import { Collider, CollisionComponent, Component, PhysXComponent, Property, Shape } from "@wonderlandengine/api";
import { Cursor, CursorTarget } from "@wonderlandengine/components";
import { PhysicsCollisionCollector } from "../../../cauldron/physics/physics_collision_collector.js";
import { PhysicsLayerFlags } from "../../../cauldron/physics/physics_layer_flags.js";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { InputSourceType, TrackedHandJointID } from "../input_types.js";
import { InputUtils } from "../input_utils.js";

export class FingerCursorComponent extends Component {
    static TypeName = "pp-finger-cursor";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myMultipleClicksEnabled: Property.bool(true),
        _myCollisionMode: Property.enum(["PhysX", "Collision"], "PhysX"),
        _myCollisionFlags: Property.string("0, 0, 0, 0, 0, 0, 0, 0"),
        _myCollisionSize: Property.float(0.0125),
        _myCursorPointerObject: Property.object(null),
        _myDisableDefaultCursorOnTrackedHandDetected: Property.bool(true),
        _myDefaultCursorObject: Property.object()
    };

    init() {
        this._myLastTarget = null;
        this._myHandInputSource = null;
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);

        this._myDoubleClickTimer = 0;
        this._myTripleClickTimer = 0;
        this._myMultipleClickObject = null;
        this._myMultipleClickDelay = 0.3;
    }

    start() {
        this._myCursorParentObject = this.object.pp_addObject();

        if (this._myCursorPointerObject == null) {
            this._myCursorPointerObject = this._myCursorParentObject.pp_addObject();
        } else {
            this._myCursorPointerObject.pp_setParent(this._myCursorParentObject);
        }

        const physicsFlags = new PhysicsLayerFlags();
        const flags = [...this._myCollisionFlags.split(",")];
        for (let i = 0; i < flags.length; i++) {
            physicsFlags.setFlagActive(i, flags[i].trim() == "1");
        }

        if (this._myCollisionMode == 0) {
            this._myCollisionComponent = this._myCursorPointerObject.pp_addComponent(PhysXComponent, {
                "shape": Shape.Sphere,
                "extents": vec3_create(this._myCollisionSize, this._myCollisionSize, this._myCollisionSize),
                "kinematic": true,
                "groupsMask": physicsFlags.getMask()
            });

            this._myPhysicsCollisionCollector = new PhysicsCollisionCollector(this._myCollisionComponent, true);
        } else if (this._myCollisionMode == 1) {
            this._myCollisionComponent = this._myCursorPointerObject.pp_addComponent(CollisionComponent);
            this._myCollisionComponent.collider = Collider.Sphere;
            this._myCollisionComponent.extents = vec3_create(this._myCollisionSize, this._myCollisionSize, this._myCollisionSize);
            this._myCollisionComponent.group = physicsFlags.getMask();
        }

        if (this._myDisableDefaultCursorOnTrackedHandDetected) {
            let defaultCursorObject = this.object;
            if (this._myDefaultCursorObject != null) {
                defaultCursorObject = this._myDefaultCursorObject;
            }

            this._myDefaultCursorComponent = defaultCursorObject.pp_getComponent(Cursor);
        }
    }

    update(dt) {
        if (this._myDoubleClickTimer > 0) {
            this._myDoubleClickTimer -= dt;
        }

        if (this._myTripleClickTimer > 0) {
            this._myTripleClickTimer -= dt;
        }

        this._myCursorParentObject.pp_setTransformQuat(Globals.getPlayerObjects(this.engine).myReferenceSpace.pp_getTransformQuat());
        this._updateHand();

        if (this._myHandInputSource != null) {
            if (this._myCollisionMode == 1) {
                const collisions = this._myCollisionComponent.queryOverlaps();
                let collisionTarget = null;
                for (let i = 0; i < collisions.length; ++i) {
                    const collision = collisions[i];
                    if (collision.group & this._myCollisionComponent.group) {
                        const object = collision.object;
                        const target = object.pp_getComponent(CursorTarget);
                        if (target && (collisionTarget == null || !target.isSurface)) {
                            collisionTarget = target;
                            if (!target.isSurface) {
                                break;
                            }
                        }
                    }
                }

                if (collisionTarget == null) {
                    this._targetTouchEnd();
                } else if (!collisionTarget.equals(this._myLastTarget)) {
                    this._targetTouchEnd();

                    this._myLastTarget = collisionTarget;

                    this._targetTouchStart();
                }
            } else {
                const collisions = this._myPhysicsCollisionCollector.getCollisions();
                let collisionTarget = null;
                for (const collision of collisions) {
                    const target = collision.object.pp_getComponent(CursorTarget);
                    if (target && (collisionTarget == null || !target.isSurface)) {
                        collisionTarget = target;
                        if (!target.isSurface) {
                            break;
                        }
                    }
                }

                if (collisionTarget == null) {
                    this._targetTouchEnd();
                } else if (!collisionTarget.equals(this._myLastTarget)) {
                    this._targetTouchEnd();

                    this._myLastTarget = collisionTarget;

                    this._targetTouchStart();
                }
            }
        } else {
            this._targetTouchEnd();
        }
    }

    _targetTouchStart() {
        this._myLastTarget.onHover.notify(this._myLastTarget.object, this);
        this._myLastTarget.onDown.notify(this._myLastTarget.object, this);
    }

    _targetTouchEnd() {
        if (this._myLastTarget != null) {
            this._myLastTarget.onClick.notify(this._myLastTarget.object, this);

            if (this._myMultipleClicksEnabled && this._myTripleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject.pp_equals(this._myLastTarget.object)) {
                this._myLastTarget.onTripleClick.notify(this._myLastTarget.object, this);

                this._myTripleClickTimer = 0;
            } else if (this._myMultipleClicksEnabled && this._myDoubleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject.pp_equals(this._myLastTarget.object)) {
                this._myLastTarget.onDoubleClick.notify(this._myLastTarget.object, this);

                this._myTripleClickTimer = this._myMultipleClickDelay;
                this._myDoubleClickTimer = 0;
            } else {
                this._myLastTarget.onSingleClick.notify(this._myLastTarget.object, this);

                this._myTripleClickTimer = 0;
                this._myDoubleClickTimer = this._myMultipleClickDelay;
                this._myMultipleClickObject = this._myLastTarget.object;
            }

            this._myLastTarget.onUp.notify(this._myLastTarget.object, this);
            this._myLastTarget.onUpWithDown.notify(this._myLastTarget.object, this);

            this._myLastTarget.onUnhover.notify(this._myLastTarget.object, this);

            this._myLastTarget = null;
        }
    }

    onActivate() {
        this._myCursorParentObject.pp_setActive(true);
    }

    onDeactivate() {
        this._targetTouchEnd();

        if (this._myCursorParentObject != null) {
            this._myCursorParentObject.pp_setActive(false);
        }
    }

    _updateHand() {
        const newHandInputSource = InputUtils.getInputSource(this._myHandednessType, InputSourceType.TRACKED_HAND, this.engine);

        if (newHandInputSource != null && this._myHandInputSource == null) {
            if (this._myDefaultCursorComponent != null) {
                this._myDefaultCursorComponent.active = false;
                this._myCursorParentObject.pp_setActive(true);
            }
        } else if (newHandInputSource == null && this._myHandInputSource != null) {
            if (this._myDefaultCursorComponent != null) {
                this._targetTouchEnd();

                this._myCursorParentObject.pp_setActive(false);
                this._myDefaultCursorComponent.active = true;
            }
        }

        this._myHandInputSource = newHandInputSource;

        if (this._myHandInputSource != null) {
            let tip = null;

            try {
                tip = XRUtils.getFrame(this.engine).getJointPose(this._myHandInputSource.hand.get(TrackedHandJointID.INDEX_FINGER_TIP), XRUtils.getReferenceSpace(this.engine));
            } catch (error) {
                // Do nothing
            }

            if (tip) {
                this._myCursorPointerObject.pp_setRotationLocalQuat([
                    tip.transform.orientation.x,
                    tip.transform.orientation.y,
                    tip.transform.orientation.z,
                    tip.transform.orientation.w]);

                this._myCursorPointerObject.pp_setPositionLocal([
                    tip.transform.position.x,
                    tip.transform.position.y,
                    tip.transform.position.z]);
            }
        }
    }
}
import { Collider, CollisionComponent, Component, Object3D, PhysXComponent, Shape } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { Cursor, CursorTarget } from "@wonderlandengine/components";
import { PhysicsCollisionCollector } from "../../../cauldron/physics/physics_collision_collector.js";
import { PhysicsLayerFlags } from "../../../cauldron/physics/physics_layer_flags.js";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { Handedness, InputSourceType, TrackedHandJointID } from "../input_types.js";
import { InputUtils } from "../input_utils.js";

/** #WARN This class is not actually a `Cursor`, but since it triggers `CursorTarget` emitters, it needs to forward a `Cursor` to them  
    As of now, this class forward a fake cursor as `Cursor`, which is a plain object with just the info usually need, like the `handedness` value */
export class FingerCursorComponent extends Component {
    static override TypeName = "pp-finger-cursor";

    @property.enum(["Left", "Right"], "Left")
    private readonly _myHandedness!: number;

    @property.enum(["Thumb", "Index", "Middle", "Ring", "Pinky"], "Index")
    private readonly _myFinger!: number;

    @property.bool(true)
    private readonly _myMultipleClicksEnabled!: boolean;

    @property.enum(["PhysX", "Collision"], "PhysX")
    private readonly _myCollisionMode!: number;

    @property.string("0, 0, 0, 0, 0, 0, 0, 0")
    private readonly _myCollisionFlags!: string;

    @property.float(0.0125)
    private readonly _myCollisionSize!: number;

    @property.object()
    private readonly _myCursorPointerObject!: Object3D;

    @property.bool(true)
    private readonly _myDisableDefaultCursorOnTrackedHandDetected!: boolean;

    @property.object()
    private readonly _myDefaultCursorObject!: Readonly<Object3D>;

    private readonly _myHandednessType!: Handedness;
    private readonly _myFingerJointID!: TrackedHandJointID;
    private _myLastTarget: CursorTarget | null = null;
    private _myDefaultCursorComponent: Cursor | null = null;
    private _myHandInputSource: Readonly<XRInputSource> | null = null;

    private readonly _myCursorParentObject!: Object3D;
    private readonly _myActualCursorParentObject!: Object3D;
    private _myPhysicsCollisionCollector: PhysicsCollisionCollector | null = null;
    private _myCollisionComponent: CollisionComponent | null = null;
    private readonly _myFakeCursor!: Cursor;

    private _myDoubleClickTimer: number = 0;
    private _myTripleClickTimer: number = 0;
    private _myMultipleClickObject: Readonly<Object3D> | null = null;

    private static _myMultipleClickDelay: number = 0.3;

    public override init(): void {
        (this._myHandednessType as Handedness) = InputUtils.getHandednessByIndex(this._myHandedness)!;

        switch (this._myFinger) {
            case 0:
                (this._myFingerJointID as TrackedHandJointID) = TrackedHandJointID.THUMB_TIP;
                break;
            case 1:
                (this._myFingerJointID as TrackedHandJointID) = TrackedHandJointID.INDEX_FINGER_TIP;
                break;
            case 2:
                (this._myFingerJointID as TrackedHandJointID) = TrackedHandJointID.MIDDLE_FINGER_TIP;
                break;
            case 3:
                (this._myFingerJointID as TrackedHandJointID) = TrackedHandJointID.RING_FINGER_TIP;
                break;
            case 4:
                (this._myFingerJointID as TrackedHandJointID) = TrackedHandJointID.PINKY_FINGER_TIP;
                break;
        }

        const fakeCursor = {
            handedness: this._myHandednessType,
            object: this.object
        };

        (this._myFakeCursor as Cursor) = fakeCursor as unknown as Cursor;
    }

    public override start(): void {
        (this._myCursorParentObject as Object3D) = this.object.pp_addObject();

        if (this._myCursorPointerObject == null) {
            (this._myActualCursorParentObject as Object3D) = this._myCursorParentObject.pp_addObject();
        } else {
            (this._myActualCursorParentObject as Object3D) = this._myCursorPointerObject;
        }

        this._myActualCursorParentObject.pp_setParent(this._myCursorParentObject);

        const physicsFlags = new PhysicsLayerFlags();
        const flags = [...this._myCollisionFlags.split(",")];
        for (let i = 0; i < flags.length; i++) {
            physicsFlags.setFlagActive(i, flags[i].trim() == "1");
        }

        if (this._myCollisionMode == 0) {
            const physxComponent = this._myActualCursorParentObject.pp_addComponent(PhysXComponent, {
                "shape": Shape.Sphere,
                "extents": vec3_create(this._myCollisionSize, this._myCollisionSize, this._myCollisionSize),
                "kinematic": true,
                "groupsMask": physicsFlags.getMask()
            })!;

            this._myPhysicsCollisionCollector = new PhysicsCollisionCollector(physxComponent, true);
        } else if (this._myCollisionMode == 1) {
            this._myCollisionComponent = this._myActualCursorParentObject.pp_addComponent(CollisionComponent)!;
            this._myCollisionComponent!.collider = Collider.Sphere;
            this._myCollisionComponent!.extents = vec3_create(this._myCollisionSize, this._myCollisionSize, this._myCollisionSize);
            this._myCollisionComponent!.group = physicsFlags.getMask();
        }

        if (this._myDisableDefaultCursorOnTrackedHandDetected) {
            let defaultCursorObject: Readonly<Object3D> = this.object;
            if (this._myDefaultCursorObject != null) {
                defaultCursorObject = this._myDefaultCursorObject;
            }

            this._myDefaultCursorComponent = defaultCursorObject.pp_getComponent(Cursor);
        }
    }

    public override update(dt: number): void {
        if (this._myDoubleClickTimer > 0) {
            this._myDoubleClickTimer -= dt;
        }

        if (this._myTripleClickTimer > 0) {
            this._myTripleClickTimer -= dt;
        }

        this._myCursorParentObject.pp_setTransformQuat(Globals.getPlayerObjects(this.engine)!.myReferenceSpace!.pp_getTransformQuat());
        this._updateHand();

        if (this._myHandInputSource != null) {
            if (this._myCollisionMode == 1) {
                const collisions = this._myCollisionComponent!.queryOverlaps();
                let collisionTarget = null;
                for (let i = 0; i < collisions.length; ++i) {
                    const collision = collisions[i];
                    if (collision.group & this._myCollisionComponent!.group) {
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
                const collisions = this._myPhysicsCollisionCollector!.getCollisions();
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

    public override onActivate(): void {
        this._myCursorParentObject.pp_setActive(true);
    }

    public override onDeactivate(): void {
        this._targetTouchEnd();

        if (this._myCursorParentObject != null) {
            this._myCursorParentObject.pp_setActive(false);
        }
    }

    private _targetTouchStart(): void {
        this._myLastTarget!.onHover.notify(this._myLastTarget!.object, this._myFakeCursor);
        this._myLastTarget!.onDown.notify(this._myLastTarget!.object, this._myFakeCursor);
    }

    private _targetTouchEnd(): void {
        if (this._myLastTarget != null) {
            this._myLastTarget.onClick.notify(this._myLastTarget.object, this._myFakeCursor);

            if (this._myMultipleClicksEnabled && this._myTripleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject.pp_equals(this._myLastTarget.object)) {
                this._myLastTarget.onTripleClick.notify(this._myLastTarget.object, this._myFakeCursor);

                this._myTripleClickTimer = 0;
            } else if (this._myMultipleClicksEnabled && this._myDoubleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject.pp_equals(this._myLastTarget.object)) {
                this._myLastTarget.onDoubleClick.notify(this._myLastTarget.object, this._myFakeCursor);

                this._myTripleClickTimer = FingerCursorComponent._myMultipleClickDelay;
                this._myDoubleClickTimer = 0;
            } else {
                this._myLastTarget.onSingleClick.notify(this._myLastTarget.object, this._myFakeCursor);

                this._myTripleClickTimer = 0;
                this._myDoubleClickTimer = FingerCursorComponent._myMultipleClickDelay;
                this._myMultipleClickObject = this._myLastTarget.object;
            }

            this._myLastTarget.onUp.notify(this._myLastTarget.object, this._myFakeCursor);
            this._myLastTarget.onUpWithDown.notify(this._myLastTarget.object, this._myFakeCursor);

            this._myLastTarget.onUnhover.notify(this._myLastTarget.object, this._myFakeCursor);

            this._myLastTarget = null;
        }
    }

    private _updateHand(): void {
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
            let tip: XRJointPose | null = null;

            try {
                const xrFrame = XRUtils.getFrame(this.engine)!;
                if (xrFrame.getJointPose != null) {
                    tip = xrFrame.getJointPose(this._myHandInputSource.hand!.get(this._myFingerJointID)!, XRUtils.getReferenceSpace(this.engine)!) ?? null;
                }
            } catch (error) {
                // Do nothing
            }

            if (tip != null) {
                this._myActualCursorParentObject.pp_setRotationLocalQuat([
                    tip.transform.orientation.x,
                    tip.transform.orientation.y,
                    tip.transform.orientation.z,
                    tip.transform.orientation.w]);

                this._myActualCursorParentObject.pp_setPositionLocal([
                    tip.transform.position.x,
                    tip.transform.position.y,
                    tip.transform.position.z]);
            }
        }
    }
}
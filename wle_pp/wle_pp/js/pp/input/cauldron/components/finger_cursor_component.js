import { Collider, CollisionComponent, Component, Property } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { XRUtils } from "../../../cauldron/utils/xr_utils";
import { vec3_create } from "../../../plugin/js/extensions/array_extension";
import { getPlayerObjects } from "../../../pp/player_objects_global";
import { InputSourceType, TrackedHandJointID } from "../input_types";
import { InputUtils } from "../input_utils";

export class FingerCursorComponent extends Component {
    static TypeName = "pp-finger-cursor";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myMultipleClicksEnabled: Property.bool(true),
        _myCollisionGroup: Property.int(1),
        _myCollisionSize: Property.float(0.0125),
        _myCursorObject: Property.object(null)
    };

    init() {
        this._myLastTarget = null;
        this._myReferenceSpace = null;
        this._myHandInputSource = null;
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);

        this._myDoubleClickTimer = 0;
        this._myTripleClickTimer = 0;
        this._myMultipleClickObject = null;
        this._myMultipleClickDelay = 0.3;
    }

    start() {
        this._myCursorObjectRoot = this.object.pp_addObject();

        if (this._myCursorObject == null) {
            this._myCursorObject = this._myCursorObjectRoot.pp_addObject();
        } else {
            this._myCursorObject.pp_setParent(this._myCursorObjectRoot);
        }

        this._myCollisionComponent = this._myCursorObject.pp_addComponent(CollisionComponent);
        this._myCollisionComponent.collider = Collider.Sphere;
        this._myCollisionComponent.group = 1 << this._myCollisionGroup;
        this._myCollisionComponent.extents = vec3_create(this._myCollisionSize, this._myCollisionSize, this._myCollisionSize);

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false, this.engine);
    }

    update(dt) {
        if (this._myDoubleClickTimer > 0) {
            this._myDoubleClickTimer -= dt;
        }

        if (this._myTripleClickTimer > 0) {
            this._myTripleClickTimer -= dt;
        }

        this._myCursorObjectRoot.pp_setTransformQuat(getPlayerObjects(this.engine).myPlayerPivot.pp_getTransformQuat());
        this._updateHand();

        if (this._myHandInputSource) {
            let overlaps = this._myCollisionComponent.queryOverlaps();
            let overlapTarget = null;
            for (let i = 0; i < overlaps.length; ++i) {
                let object = overlaps[i].object;
                let target = object.pp_getComponent(CursorTarget);
                if (target && (overlapTarget == null || !target.isSurface)) {
                    overlapTarget = target;
                    if (!target.isSurface) {
                        break;
                    }
                }
            }

            if (!overlapTarget) {
                this._targetTouchEnd();
            } else if (!overlapTarget.equals(this._myLastTarget)) {
                this._targetTouchEnd();

                this._myLastTarget = overlapTarget;

                this._targetTouchStart();
            }
        } else {
            this._targetTouchEnd();
        }
    }

    _targetTouchStart() {
        this._myLastTarget.onHover(this._myLastTarget.object, this);
        this._myLastTarget.onDown(this._myLastTarget.object, this);
    }

    _targetTouchEnd() {
        if (this._myLastTarget) {
            if (this._myMultipleClicksEnabled && this._myTripleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject.pp_equals(this._myLastTarget.object)) {
                this._myLastTarget.onTripleClick(this._myLastTarget.object, this);

                this._myTripleClickTimer = 0;
            } else if (this._myMultipleClicksEnabled && this._myDoubleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject.pp_equals(this._myLastTarget.object)) {
                this._myLastTarget.onDoubleClick(this._myLastTarget.object, this);

                this._myTripleClickTimer = this._myMultipleClickDelay;
                this._myDoubleClickTimer = 0;
            } else {
                this._myLastTarget.onClick(this._myLastTarget.object, this);

                this._myTripleClickTimer = 0;
                this._myDoubleClickTimer = this._myMultipleClickDelay;
                this._myMultipleClickObject = this._myLastTarget.object;
            }

            this._myLastTarget.onUp(this._myLastTarget.object, this);
            this._myLastTarget.onUnhover(this._myLastTarget.object, this);

            this._myLastTarget = null;
        }
    }

    onActivate() {
        this._myCursorObjectRoot.pp_setActive(true);
    }

    onDeactivate() {
        this._myCursorObjectRoot.pp_setActive(false);
    }

    _updateHand() {
        this._myHandInputSource = InputUtils.getInputSource(this._myHandednessType, InputSourceType.TRACKED_HAND, this.engine);

        if (this._myHandInputSource) {
            let tip = XRUtils.getFrame(this.engine).getJointPose(this._myHandInputSource.hand.get(TrackedHandJointID.INDEX_FINGER_TIP), this._myReferenceSpace);

            if (tip) {
                this._myCursorObject.pp_setRotationLocalQuat([
                    tip.transform.orientation.x,
                    tip.transform.orientation.y,
                    tip.transform.orientation.z,
                    tip.transform.orientation.w]);

                this._myCursorObject.pp_setPositionLocal([
                    tip.transform.position.x,
                    tip.transform.position.y,
                    tip.transform.position.z]);
            }
        }
    }

    _onXRSessionStart(session) {
        session.requestReferenceSpace(XRUtils.getReferenceSpaceType(this.engine)).then(function (referenceSpace) { this._myReferenceSpace = referenceSpace; }.bind(this));
    }

    _onXRSessionEnd(session) {
        this._myReferenceSpace = null;
    }
}
import { XRUtils } from "../../cauldron/utils/xr_utils";
import { quat_create, vec3_create } from "../../plugin/js/extensions/array_extension";
import { Handedness, InputSourceType } from "../cauldron/input_types";
import { InputUtils } from "../cauldron/input_utils";
import { BasePose, BasePoseParams } from "./base_pose";

export class HandPoseParams extends BasePoseParams {

    constructor(engine) {
        super(engine);

        this.myFixTrackedHandRotation = true;
    }
}

export class HandPose extends BasePose {

    constructor(handedness, handPoseParams = new HandPoseParams()) {
        super(handPoseParams);

        this._myInputSource = null;

        this._myHandedness = handedness;
        this._myFixTrackedHandRotation = handPoseParams.myFixTrackedHandRotation;

        this._myTrackedHand = false;

        this._myInputSourcesChangeEventListener = null;
    }

    getHandedness() {
        return this._myHandedness;
    }

    getInputSource() {
        return this._myInputSource;
    }

    getInputSourceType() {
        if (this._myInputSource == null) {
            return null;
        }

        return InputUtils.getInputSourceType(this._myInputSource);
    }

    isFixTrackedHandRotation() {
        return this._myFixTrackedHandRotation;
    }

    setFixTrackedHandRotation(fixTrackedHandRotation) {
        this.myFixTrackedHandRotation = fixTrackedHandRotation;
    }

    getRotationQuat(referenceObjectOverride = undefined) {
        // Implemented outside class definition
    }

    _isReadyToGetPose() {
        return this._myInputSource != null;
    }

    _getPose(xrFrame) {
        return xrFrame.getPose(this._myInputSource.gripSpace, this.getReferenceSpace());
    }

    _onXRSessionStartHook(manualCall, session) {
        this._myInputSourcesChangeEventListener = function (event) {
            if (event.removed) {
                for (let item of event.removed) {
                    if (item == this._myInputSource) {
                        this._myInputSource = null;
                    }
                }
            }

            if (event.added) {
                for (let item of event.added) {
                    if (item.handedness == this._myHandedness) {
                        this._myInputSource = item;
                        this._myTrackedHand = InputUtils.getInputSourceType(this._myInputSource) == InputSourceType.TRACKED_HAND;
                    }
                }
            }
        }.bind(this);

        session.addEventListener("inputsourceschange", this._myInputSourcesChangeEventListener);

        if (manualCall && this._myInputSource == null && session.inputSources) {
            for (let item of session.inputSources) {
                if (item.handedness == this._myHandedness) {
                    this._myInputSource = item;
                    this._myTrackedHand = InputUtils.getInputSourceType(this._myInputSource) == InputSourceType.TRACKED_HAND;
                }
            }
        }
    }

    _onXRSessionEndHook() {
        this._myInputSource = null;

        this._myInputSourcesChangeEventListener = null;
    }

    _destroyHook() {
        XRUtils.getSession(this.getEngine())?.removeEventListener("inputsourceschange", this._myInputSourcesChangeEventListener);
    }
}



// IMPLEMENTATION

HandPose.prototype.getRotationQuat = function () {
    let playerRotationQuat = quat_create();
    let up = vec3_create();
    let right = vec3_create();
    let forward = vec3_create();
    return function getRotationQuat(out = quat_create(), referenceObjectOverride = undefined) {
        let referenceObject = referenceObjectOverride === undefined ? this._myReferenceObject : referenceObjectOverride;

        out.quat_copy(this._myRotationQuat);

        if (this._myForwardFixed) {
            out.quat_rotateAxisRadians(Math.PI, out.quat_getUp(up), out);
        }

        if (this._myFixTrackedHandRotation && this._myTrackedHand) {
            out.quat_rotateAxis(-60, out.quat_getRight(right), out);

            let forwardRotation = 20;
            forwardRotation = (this._myHandedness == Handedness.LEFT) ? forwardRotation : -forwardRotation;
            out.quat_rotateAxis(forwardRotation, out.quat_getForward(forward), out);
        }

        if (referenceObject == null) {
            return out;
        }

        return out.quat_toWorld(referenceObject.pp_getRotationQuat(playerRotationQuat), out);
    };
}();
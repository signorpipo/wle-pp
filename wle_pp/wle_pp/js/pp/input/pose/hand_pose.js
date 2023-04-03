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

        this._myIsTrackedHand = false;
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

    _isReadyToGetPose() {
        return this._myInputSource != null;
    }

    _getPose(xrFrame) {
        return xrFrame.getPose(this._myInputSource.gripSpace, this._myReferenceSpace);
    }

    _onXRSessionStartHook(manualCall, session) {
        session.addEventListener("inputsourceschange", function (event) {
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
                        this._myIsTrackedHand = InputUtils.getInputSourceType(this._myInputSource) == InputSourceType.TRACKED_HAND;
                    }
                }
            }
        }.bind(this));

        if (manualCall && this._myInputSource == null && session.inputSources) {
            for (let item of session.inputSources) {
                if (item.handedness == this._myHandedness) {
                    this._myInputSource = item;
                    this._myIsTrackedHand = InputUtils.getInputSourceType(this._myInputSource) == InputSourceType.TRACKED_HAND;
                }
            }
        }
    }

    _onXRSessionEndHook() {
        this._myInputSource = null;
    }
}



// IMPLEMENTATION

HandPose.prototype.getRotationQuat = function () {
    let rotationQuat = quat_create();
    let playerRotationQuat = quat_create();
    let up = vec3_create();
    let right = vec3_create();
    let forward = vec3_create();
    return function getRotationQuat() {
        rotationQuat.quat_copy(this._myRotationQuat);

        if (this._myFixForward) {
            rotationQuat.quat_rotateAxisRadians(Math.PI, rotationQuat.quat_getUp(up), rotationQuat);
        }

        if (this._myFixTrackedHandRotation && this._myIsTrackedHand) {
            rotationQuat.quat_rotateAxis(-60, rotationQuat.quat_getRight(right), rotationQuat);

            let forwardRotation = 20;
            forwardRotation = (this._myHandedness == Handedness.LEFT) ? forwardRotation : -forwardRotation;
            rotationQuat.quat_rotateAxis(forwardRotation, rotationQuat.quat_getForward(forward), rotationQuat);
        }

        if (this._myReferenceObject == null) {
            return rotationQuat;
        }

        return rotationQuat.quat_toWorld(this._myReferenceObject.pp_getRotationQuat(playerRotationQuat), rotationQuat);
    };
}();
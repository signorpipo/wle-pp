PP.HandPoseParams = class HandPoseParams extends PP.BasePoseParams {
    constructor() {
        super();

        this.myFixTrackedHandRotation = true;
    }
};

PP.HandPose = class HandPose extends PP.BasePose {

    constructor(handedness, handPoseParams = new PP.HandPoseParams()) {
        super(handPoseParams);

        this._myInputSource = null;

        this._myHandedness = handedness;
        this._myFixTrackedHandRotation = handPoseParams.myFixTrackedHandRotation;

        this._myIsTrackedHand = false;
    }

    getInputSourceType() {
        if (this._myInputSource == null) {
            return null;
        }

        return PP.InputUtils.getInputSourceType(this._myInputSource);
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

    _onXRSessionStartHook(manualStart, session) {
        session.addEventListener('inputsourceschange', function (event) {
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
                        this._myIsTrackedHand = PP.InputUtils.getInputSourceType(this._myInputSource) == PP.InputSourceType.TRACKED_HAND;
                    }
                }
            }
        }.bind(this));

        if (manualStart && this._myInputSource == null && session.inputSources) {
            for (let item of session.inputSources) {
                if (item.handedness == this._myHandedness) {
                    this._myInputSource = item;
                    this._myIsTrackedHand = PP.InputUtils.getInputSourceType(this._myInputSource) == PP.InputSourceType.TRACKED_HAND;
                }
            }
        }
    }

    _onXRSessionEndHook() {
        this._myInputSource = null;
    }
};

PP.HandPose.prototype.getRotationQuat = function () {
    let rotationQuat = PP.quat_create();
    let playerRotationQuat = PP.quat_create();
    let up = PP.vec3_create();
    let right = PP.vec3_create();
    let forward = PP.vec3_create();
    return function getRotationQuat() {
        rotationQuat.quat_copy(this._myRotationQuat);

        if (this._myFixForward) {
            rotationQuat.quat_rotateAxisRadians(Math.PI, rotationQuat.quat_getUp(up), rotationQuat);
        }

        if (this._myFixTrackedHandRotation && this._myIsTrackedHand) {
            rotationQuat.quat_rotateAxis(-60, rotationQuat.quat_getRight(right), rotationQuat);

            let forwardRotation = 20;
            forwardRotation = (this._myHandedness == PP.Handedness.LEFT) ? forwardRotation : -forwardRotation;
            rotationQuat.quat_rotateAxis(forwardRotation, rotationQuat.quat_getForward(forward), rotationQuat);
        }

        if (this._myReferenceObject == null) {
            return rotationQuat;
        }

        return rotationQuat.quat_toWorld(this._myReferenceObject.pp_getRotationQuat(playerRotationQuat), rotationQuat);
    };
}();



Object.defineProperty(PP.HandPose.prototype, "getRotationQuat", { enumerable: false });
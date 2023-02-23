PP.BasePoseParams = class BasePoseParams {
    constructor() {
        this.myReferenceObject = null;
        this.myFixForward = true;
        this.myForceEmulatedVelocities = false;
        this.myUpdateOnViewReset = false;
    }
};

// BasePose transform is local by default (as if the parent/reference object was the identity transform)
// you can use setReferenceObject if you want the BasePose to return the transform in world space 
PP.BasePose = class BasePose {

    constructor(basePoseParams = new PP.BasePoseParams()) {
        this._myFixForward = basePoseParams.myFixForward;
        this._myForceEmulatedVelocities = basePoseParams.myForceEmulatedVelocities;
        this._myUpdateOnViewReset = basePoseParams.myUpdateOnViewReset;

        this._myReferenceSpace = null;
        this._myReferenceObject = basePoseParams.myReferenceObject;

        this._myPosition = PP.vec3_create();
        this._myRotationQuat = PP.quat_create();

        this._myPrevPosition = PP.vec3_create();
        this._myPrevRotationQuat = PP.quat_create();

        this._myLinearVelocity = PP.vec3_create();
        this._myAngularVelocityRadians = PP.vec3_create();

        this._myIsValid = false;
        this._myIsLinearVelocityEmulated = true;
        this._myIsAngularVelocityEmulated = true;

        this._myPoseUpdatedCallbacks = new Map();   // Signature: callback(thisPose)
    }

    // if the reference object is set, the transform will be converted using it as a parent,
    // otherwise the transform will be local, as if the parent/reference object was the identity transform
    setReferenceObject(referenceObject) {
        this._myReferenceObject = referenceObject;
    }

    getReferenceObject() {
        return this._myReferenceObject;
    }

    setFixForward(fixForward) {
        this._myFixForward = fixForward;
    }

    isFixForward() {
        return this._myFixForward;
    }

    setForceEmulatedVelocities(forceEmulatedVelocities) {
        this._myForceEmulatedVelocities = forceEmulatedVelocities;
    }

    isForceEmulatedVelocities() {
        return this._myForceEmulatedVelocities;
    }

    setUpdateOnViewReset(updateOnViewReset) {
        this._myUpdateOnViewReset = updateOnViewReset;
    }

    isUpdateOnViewReset() {
        return this._myUpdateOnViewReset;
    }

    getReferenceSpace() {
        return this._myReferenceSpace;
    }

    getInputSource() {
        return this._myInputSource;
    }

    getPosition() {
        // implemented outside class definition
    }

    getRotation() {
        return this.getRotationDegrees();
    }

    getRotationDegrees() {
        return this.getRotationQuat().quat_toDegrees();

    }

    getRotationRadians() {
        return this.getRotationQuat().quat_toRadians();
    }

    getRotationQuat() {
        // implemented outside class definition
    }

    getTransform() {
        return this.getTransformMatrix();
    }

    getTransformMatrix() {
        // implemented outside class definition
    }

    getTransformQuat() {
        // implemented outside class definition
    }

    getLinearVelocity() {
        // implemented outside class definition
    }

    getAngularVelocity() {
        return this.getAngularVelocityDegrees();
    }

    getAngularVelocityDegrees() {
        // implemented outside class definition
    }

    getAngularVelocityRadians() {
        // implemented outside class definition
    }

    isValid() {
        return this._myIsValid;
    }

    isLinearVelocityEmulated() {
        return this._myIsLinearVelocityEmulated;
    }

    isAngularVelocityEmulated() {
        return this._myIsAngularVelocityEmulated;
    }

    registerPoseUpdatedEventListener(id, callback) {
        this._myPoseUpdatedCallbacks.set(id, callback);
    }

    unregisterPoseUpdatedEventListener(id) {
        this._myPoseUpdatedCallbacks.delete(id);
    }

    start() {
        if (WL.xrSession) {
            this._onXRSessionStart(true, WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this, false));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    }

    update(dt) {
        this._update(dt, true);
    }

    // Hooks

    _isReadyToGetPose() {
        return true;
    }

    _getPose(xrFrame) {
        return null;
    }

    _updateHook(dt, updateVelocity, xrPose) {
    }

    _onXRSessionStartHook(manualStart, session) {

    }

    _onXRSessionEndHook() {

    }

    _onViewResetHook() {

    }

    // Hooks end

    _update(dt, updateVelocity) {
        this._myPrevPosition.vec3_copy(this._myPosition);
        this._myPrevRotationQuat.quat_copy(this._myRotationQuat);

        let xrFrame = Module['webxr_frame'];
        if (xrFrame && this._isReadyToGetPose()) {
            let xrPose = null;
            try {
                xrPose = this._getPose(xrFrame);
            } catch (error) {
                // not handled, pose will be null
            }

            if (xrPose) {
                this._myPosition[0] = xrPose.transform.position.x;
                this._myPosition[1] = xrPose.transform.position.y;
                this._myPosition[2] = xrPose.transform.position.z;

                this._myRotationQuat[0] = xrPose.transform.orientation.x;
                this._myRotationQuat[1] = xrPose.transform.orientation.y;
                this._myRotationQuat[2] = xrPose.transform.orientation.z;
                this._myRotationQuat[3] = xrPose.transform.orientation.w;
                this._myRotationQuat.quat_normalize(this._myRotationQuat);

                if (updateVelocity) {
                    if (xrPose.linearVelocity && !this._myForceEmulatedVelocities) {
                        this._myLinearVelocity[0] = xrPose.linearVelocity.x;
                        this._myLinearVelocity[1] = xrPose.linearVelocity.y;
                        this._myLinearVelocity[2] = xrPose.linearVelocity.z;

                        this._myIsLinearVelocityEmulated = false;
                    } else {
                        this._computeEmulatedLinearVelocity(dt);

                        this._myIsLinearVelocityEmulated = true;
                    }

                    if (xrPose.angularVelocity && !this._myForceEmulatedVelocities) {
                        this._myAngularVelocityRadians[0] = xrPose.angularVelocity.x;
                        this._myAngularVelocityRadians[1] = xrPose.angularVelocity.y;
                        this._myAngularVelocityRadians[2] = xrPose.angularVelocity.z;

                        this._myIsAngularVelocityEmulated = false;
                    } else {
                        this._computeEmulatedAngularVelocity(dt);

                        this._myIsAngularVelocityEmulated = true;
                    }
                }

                this._myIsValid = true;
            } else {
                // keep previous position and rotation but reset velocity because reasons

                if (updateVelocity) {
                    this._myLinearVelocity[0] = 0;
                    this._myLinearVelocity[1] = 0;
                    this._myLinearVelocity[2] = 0;

                    this._myAngularVelocityRadians[0] = 0;
                    this._myAngularVelocityRadians[1] = 0;
                    this._myAngularVelocityRadians[2] = 0;
                }

                this._myIsValid = false;
                this._myIsLinearVelocityEmulated = true;
                this._myIsAngularVelocityEmulated = true;
            }

            this._updateHook(dt, updateVelocity, xrPose);
        } else {
            // keep previous position and rotation but reset velocity because reasons

            if (updateVelocity) {
                this._myLinearVelocity[0] = 0;
                this._myLinearVelocity[1] = 0;
                this._myLinearVelocity[2] = 0;

                this._myAngularVelocityRadians[0] = 0;
                this._myAngularVelocityRadians[1] = 0;
                this._myAngularVelocityRadians[2] = 0;
            }

            this._myIsValid = false;
            this._myIsLinearVelocityEmulated = true;
            this._myIsAngularVelocityEmulated = true;

            this._updateHook(dt, updateVelocity, null);
        }

        this._myPoseUpdatedCallbacks.forEach(function (callback) { callback(this); }.bind(this));
    }

    _computeEmulatedLinearVelocity(dt) {
        if (dt > 0) {
            this._myPosition.vec3_sub(this._myPrevPosition, this._myLinearVelocity);
            this._myLinearVelocity.vec3_scale(1 / dt, this._myLinearVelocity);
        } else {
            this._myLinearVelocity[0] = 0;
            this._myLinearVelocity[1] = 0;
            this._myLinearVelocity[2] = 0;
        }
    }

    _onXRSessionStart(manualStart, session) {
        session.requestReferenceSpace(WebXR.refSpace).then(function (referenceSpace) {
            this._myReferenceSpace = referenceSpace;

            if (referenceSpace.addEventListener != null) {
                referenceSpace.addEventListener("reset", this._onViewReset.bind(this));
            }
        }.bind(this));

        this._onXRSessionStartHook(manualStart, session);
    }

    _onXRSessionEnd() {
        this._onXRSessionEndHook();

        this._myReferenceSpace = null;
    }

    _onViewReset() {
        if (this._myUpdateOnViewReset) {
            this._update(0, false);
        }

        this._onViewResetHook();
    }
};

PP.BasePose.prototype.getPosition = function () {
    let position = PP.vec3_create();
    let transform = PP.mat4_create();
    return function getPosition() {
        if (this._myReferenceObject == null) {
            return this._myPosition;
        }

        return this._myPosition.vec3_convertPositionToWorld(this._myReferenceObject.pp_getTransform(transform), position);
    };
}();

PP.BasePose.prototype.getRotationQuat = function () {
    let rotationQuat = PP.quat_create();
    let playerRotationQuat = PP.quat_create();
    let up = PP.vec3_create();
    return function getRotationQuat() {
        rotationQuat.quat_copy(this._myRotationQuat);

        if (this._myFixForward) {
            rotationQuat.quat_rotateAxisRadians(Math.PI, rotationQuat.quat_getUp(up), rotationQuat);
        }

        if (this._myReferenceObject == null) {
            return rotationQuat;
        }

        return rotationQuat.quat_toWorld(this._myReferenceObject.pp_getRotationQuat(playerRotationQuat), rotationQuat);
    };
}();

PP.BasePose.prototype.getTransformMatrix = function () {
    let transform = PP.mat4_create();
    return function getTransformMatrix() {
        return this.getTransformQuat().quat2_toMatrix(transform);
    };
}();

PP.BasePose.prototype.getTransformQuat = function () {
    let transformQuat = PP.quat2_create();
    let playerTransformQuat = PP.quat2_create();
    return function getTransformQuat() {
        transformQuat.quat2_setPositionRotationQuat(this._myPosition, this.getRotationQuat());

        if (this._myReferenceObject == null) {
            return transformQuat;
        }

        return transformQuat.quat_toWorld(this._myReferenceObject.pp_getTransformQuat(playerTransformQuat), transformQuat);
    };
}();

PP.BasePose.prototype.getLinearVelocity = function () {
    let position = PP.vec3_create();
    let transform = PP.mat4_create();
    return function getLinearVelocity() {
        if (this._myReferenceObject == null) {
            return this._myLinearVelocity;
        }

        return this._myLinearVelocity.vec3_convertDirectionToWorld(this._myReferenceObject.pp_getTransform(transform), position);
    };
}();

PP.BasePose.prototype.getAngularVelocityDegrees = function () {
    let rotationDegrees = PP.vec3_create();
    return function getAngularVelocityDegrees() {
        this.getAngularVelocityRadians().vec3_toDegrees(rotationDegrees);
    };
}();

PP.BasePose.prototype.getAngularVelocityRadians = function () {
    let rotationRadians = PP.vec3_create();
    let transform = PP.mat4_create();
    return function getAngularVelocityRadians() {
        if (this._myReferenceObject == null) {
            return this._myAngularVelocityRadians;
        }

        return this._myAngularVelocityRadians.vec3_convertDirectionToWorld(this._myReferenceObject.pp_getTransform(transform), rotationRadians);
    };
}();

PP.BasePose.prototype._computeEmulatedAngularVelocity = function () {
    let rotationRadians = PP.vec3_create();
    let prevRotationRadians = PP.vec3_create();
    return function _computeEmulatedAngularVelocity(dt) {
        if (dt > 0) {
            rotationRadians = this._myRotationQuat.quat_toRadians(rotationRadians);
            prevRotationRadians = this._myPrevRotationQuat.quat_toRadians(prevRotationRadians);
            rotationRadians.vec3_sub(prevRotationRadians, this._myAngularVelocityRadians);
            this._myAngularVelocityRadians.vec3_scale(1 / dt, this._myAngularVelocityRadians);
        } else {
            this._myAngularVelocityRadians[0] = 0;
            this._myAngularVelocityRadians[1] = 0;
            this._myAngularVelocityRadians[2] = 0;
        }
    };
}();



Object.defineProperty(PP.BasePose.prototype, "getPosition", { enumerable: false });
Object.defineProperty(PP.BasePose.prototype, "getRotationQuat", { enumerable: false });
Object.defineProperty(PP.BasePose.prototype, "getTransformMatrix", { enumerable: false });
Object.defineProperty(PP.BasePose.prototype, "getTransformQuat", { enumerable: false });
Object.defineProperty(PP.BasePose.prototype, "getLinearVelocity", { enumerable: false });
Object.defineProperty(PP.BasePose.prototype, "getAngularVelocityDegrees", { enumerable: false });
Object.defineProperty(PP.BasePose.prototype, "getAngularVelocityRadians", { enumerable: false });
Object.defineProperty(PP.BasePose.prototype, "_computeEmulatedAngularVelocity", { enumerable: false });
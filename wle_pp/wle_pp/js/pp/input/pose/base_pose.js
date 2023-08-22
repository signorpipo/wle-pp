import { Emitter } from "@wonderlandengine/api";
import { XRUtils } from "../../cauldron/utils/xr_utils";
import { mat4_create, quat2_create, quat_create, vec3_create } from "../../plugin/js/extensions/array_extension";
import { Globals } from "../../pp/globals";

export class BasePoseParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myReferenceObject = null;
        this.myForwardFixed = true;
        this.myUpdateOnViewReset = true;
        this.myForceEmulatedVelocities = false;

        this.myEngine = engine;
    }
}

// BasePose transform is local by default (as if the parent/reference object was the identity transform)
// You can use setReferenceObject if you want the BasePose to return the transform in world space 
export class BasePose {

    constructor(basePoseParams = new BasePoseParams()) {
        this._myForwardFixed = basePoseParams.myForwardFixed;
        this._myForceEmulatedVelocities = basePoseParams.myForceEmulatedVelocities;
        this._myUpdateOnViewReset = basePoseParams.myUpdateOnViewReset;

        this._myReferenceObject = basePoseParams.myReferenceObject;

        this._myEngine = basePoseParams.myEngine;

        this._myPosition = vec3_create();
        this._myRotationQuat = quat2_create();

        this._myPrevPosition = vec3_create();
        this._myPrevRotationQuat = quat_create();

        this._myLinearVelocity = vec3_create();
        this._myAngularVelocityRadians = vec3_create();

        this._myValid = false;
        this._myLinearVelocityEmulated = true;
        this._myAngularVelocityEmulated = true;

        this._myPoseUpdatedEmitter = new Emitter();   // Signature: listener(pose)

        this._myViewResetEventListener = null;

        this._myDestroyed = false;
    }

    getEngine() {
        return this._myEngine;
    }

    // If the reference object is set, the transform will be converted using it as a parent,
    // otherwise the transform will be local, as if the parent/reference object was the identity transform
    setReferenceObject(referenceObject) {
        this._myReferenceObject = referenceObject;
    }

    getReferenceObject() {
        return this._myReferenceObject;
    }

    setForwardFixed(forwardFixed) {
        this._myForwardFixed = forwardFixed;
    }

    isForwardFixed() {
        return this._myForwardFixed;
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
        return XRUtils.getReferenceSpace(this._myEngine);
    }

    getPosition(out = vec3_create(), referenceObjectOverride = undefined) {
        // Implemented outside class definition
    }

    getRotation(out = vec3_create(), referenceObjectOverride = undefined) {
        return this.getRotationDegrees(out, referenceObjectOverride);
    }

    getRotationDegrees(out = vec3_create(), referenceObjectOverride = undefined) {
        // Implemented outside class definition
    }

    getRotationRadians(out = vec3_create(), referenceObjectOverride = undefined) {
        // Implemented outside class definition
    }

    getRotationQuat(out = quat_create(), referenceObjectOverride = undefined) {
        // Implemented outside class definition
    }

    getTransform(out = mat4_create(), referenceObjectOverride = undefined) {
        return this.getTransformMatrix(out, referenceObjectOverride);
    }

    getTransformMatrix(out = mat4_create(), referenceObjectOverride = undefined) {
        // Implemented outside class definition
    }

    getTransformQuat(out = quat2_create(), referenceObjectOverride = undefined) {
        // Implemented outside class definition
    }

    getLinearVelocity(out = vec3_create(), referenceObjectOverride = undefined) {
        // Implemented outside class definition
    }

    getAngularVelocity(out = vec3_create(), referenceObjectOverride = undefined) {
        return this.getAngularVelocityDegrees(out, referenceObjectOverride);
    }

    getAngularVelocityDegrees(out = vec3_create(), referenceObjectOverride = undefined) {
        // Implemented outside class definition
    }

    getAngularVelocityRadians(out = vec3_create(), referenceObjectOverride = undefined) {
        // Implemented outside class definition
    }

    isValid() {
        return this._myValid;
    }

    isLinearVelocityEmulated() {
        return this._myLinearVelocityEmulated;
    }

    isAngularVelocityEmulated() {
        return this._myAngularVelocityEmulated;
    }

    registerPoseUpdatedEventListener(id, listener) {
        this._myPoseUpdatedEmitter.add(listener, { id: id });
    }

    unregisterPoseUpdatedEventListener(id) {
        this._myPoseUpdatedEmitter.remove(id);
    }

    start() {
        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, true, this._myEngine);
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

    _onXRSessionStartHook(manualCall, session) {

    }

    _onXRSessionEndHook() {

    }

    _onViewResetHook() {

    }

    _destroyHook() {

    }

    // Hooks End

    _update(dt, updateVelocity) {
        this._myPrevPosition.vec3_copy(this._myPosition);
        this._myPrevRotationQuat.quat_copy(this._myRotationQuat);

        let xrFrame = XRUtils.getFrame(this._myEngine);
        if (xrFrame && this._isReadyToGetPose()) {
            let xrPose = null;
            try {
                xrPose = this._getPose(xrFrame);
            } catch (error) {
                // Not handled, pose will be null
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

                        this._myLinearVelocityEmulated = false;
                    } else {
                        this._computeEmulatedLinearVelocity(dt);

                        this._myLinearVelocityEmulated = true;
                    }

                    if (xrPose.angularVelocity && !this._myForceEmulatedVelocities) {
                        this._myAngularVelocityRadians[0] = xrPose.angularVelocity.x;
                        this._myAngularVelocityRadians[1] = xrPose.angularVelocity.y;
                        this._myAngularVelocityRadians[2] = xrPose.angularVelocity.z;

                        this._myAngularVelocityEmulated = false;
                    } else {
                        this._computeEmulatedAngularVelocity(dt);

                        this._myAngularVelocityEmulated = true;
                    }
                }

                this._myValid = true;
            } else {
                // Keep previous position and rotation but reset velocity because reasons

                if (updateVelocity) {
                    this._myLinearVelocity[0] = 0;
                    this._myLinearVelocity[1] = 0;
                    this._myLinearVelocity[2] = 0;

                    this._myAngularVelocityRadians[0] = 0;
                    this._myAngularVelocityRadians[1] = 0;
                    this._myAngularVelocityRadians[2] = 0;
                }

                this._myValid = false;
                this._myLinearVelocityEmulated = true;
                this._myAngularVelocityEmulated = true;
            }

            this._updateHook(dt, updateVelocity, xrPose);
        } else {
            // Keep previous position and rotation but reset velocity because reasons

            if (updateVelocity) {
                this._myLinearVelocity[0] = 0;
                this._myLinearVelocity[1] = 0;
                this._myLinearVelocity[2] = 0;

                this._myAngularVelocityRadians[0] = 0;
                this._myAngularVelocityRadians[1] = 0;
                this._myAngularVelocityRadians[2] = 0;
            }

            this._myValid = false;
            this._myLinearVelocityEmulated = true;
            this._myAngularVelocityEmulated = true;

            this._updateHook(dt, updateVelocity, null);
        }

        this._myPoseUpdatedEmitter.notify(this);
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

    _onXRSessionStart(manualCall, session) {
        let referenceSpace = XRUtils.getReferenceSpace(this._myEngine);

        if (referenceSpace.addEventListener != null) {
            this._myViewResetEventListener = this._onViewReset.bind(this);
            referenceSpace.addEventListener("reset", this._myViewResetEventListener);
        }

        this._onXRSessionStartHook(manualCall, session);
    }

    _onXRSessionEnd() {
        this._onXRSessionEndHook();

        this._myViewResetEventListener = null;
    }

    _onViewReset() {
        if (this._myUpdateOnViewReset) {
            this._update(0, false);
        }

        this._onViewResetHook();
    }

    _computeEmulatedAngularVelocity() {
        // Implemented outside class definition
    }

    destroy() {
        this._myDestroyed = true;

        this._destroyHook();

        XRUtils.getReferenceSpace(this._myEngine)?.removeEventListener?.("reset", this._myViewResetEventListener);
        XRUtils.unregisterSessionStartEndEventListeners(this, this._myEngine);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

BasePose.prototype.getPosition = function () {
    let transform = mat4_create();
    return function getPosition(out = vec3_create(), referenceObjectOverride = undefined) {
        let referenceObject = referenceObjectOverride === undefined ? this._myReferenceObject : referenceObjectOverride;

        out.vec3_copy(this._myPosition);

        if (referenceObject == null) {
            return out;
        }

        return out.vec3_convertPositionToWorld(referenceObject.pp_getTransform(transform), out);
    };
}();

BasePose.prototype.getRotationDegrees = function () {
    let rotationQuat = quat_create();
    return function getRotationDegrees(out = vec3_create(), referenceObjectOverride = undefined) {
        return this.getRotationQuat(rotationQuat, referenceObjectOverride).quat_toDegrees(out);
    }
}();

BasePose.prototype.getRotationRadians = function () {
    let rotationQuat = quat_create();
    return function getRotationRadians(out = vec3_create(), referenceObjectOverride = undefined) {
        return this.getRotationQuat(rotationQuat, referenceObjectOverride).quat_toRadians(out);
    }
}();

BasePose.prototype.getRotationQuat = function () {
    let playerRotationQuat = quat_create();
    let up = vec3_create();
    return function getRotationQuat(out = quat_create(), referenceObjectOverride = undefined) {
        let referenceObject = referenceObjectOverride === undefined ? this._myReferenceObject : referenceObjectOverride;

        out.quat_copy(this._myRotationQuat);

        if (this._myForwardFixed) {
            out.quat_rotateAxisRadians(Math.PI, out.quat_getUp(up), out);
        }

        if (referenceObject == null) {
            return out;
        }

        return out.quat_toWorld(referenceObject.pp_getRotationQuat(playerRotationQuat), out);
    };
}();

BasePose.prototype.getTransformMatrix = function () {
    let transformQuat = quat2_create();
    return function getTransformMatrix(out = mat4_create(), referenceObjectOverride = undefined) {
        return this.getTransformQuat(transformQuat, referenceObjectOverride).quat2_toMatrix(out);
    };
}();

BasePose.prototype.getTransformQuat = function () {
    let rotationQuat = quat_create();
    let playerTransformQuat = quat2_create();
    return function getTransformQuat(out = quat2_create(), referenceObjectOverride = undefined) {
        let referenceObject = referenceObjectOverride === undefined ? this._myReferenceObject : referenceObjectOverride;

        out.quat2_identity();
        out.quat2_setPositionRotationQuat(this._myPosition, this.getRotationQuat(rotationQuat, referenceObjectOverride));

        if (referenceObject == null) {
            return out;
        }

        return out.quat_toWorld(referenceObject.pp_getTransformQuat(playerTransformQuat), out);
    };
}();

BasePose.prototype.getLinearVelocity = function () {
    let transform = mat4_create();
    return function getLinearVelocity(out = vec3_create(), referenceObjectOverride = undefined) {
        let referenceObject = referenceObjectOverride === undefined ? this._myReferenceObject : referenceObjectOverride;

        out.vec3_copy(this._myLinearVelocity);

        if (referenceObject == null) {
            return out;
        }

        return out.vec3_convertDirectionToWorld(referenceObject.pp_getTransform(transform), out);
    };
}();

BasePose.prototype.getAngularVelocityDegrees = function () {
    let velocityRadians = vec3_create();
    return function getAngularVelocityDegrees(out = vec3_create(), referenceObjectOverride = undefined) {
        return this.getAngularVelocityRadians(velocityRadians, referenceObjectOverride).vec3_toDegrees(out);
    };
}();

BasePose.prototype.getAngularVelocityRadians = function () {
    let transform = mat4_create();
    return function getAngularVelocityRadians(out = vec3_create(), referenceObjectOverride = undefined) {
        let referenceObject = referenceObjectOverride === undefined ? this._myReferenceObject : referenceObjectOverride;

        out.vec3_copy(this._myAngularVelocityRadians);

        if (referenceObject == null) {
            return out;
        }

        return out.vec3_convertDirectionToWorld(referenceObject.pp_getTransform(transform), out);
    };
}();

BasePose.prototype._computeEmulatedAngularVelocity = function () {
    let rotationRadians = vec3_create();
    let prevRotationRadians = vec3_create();
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
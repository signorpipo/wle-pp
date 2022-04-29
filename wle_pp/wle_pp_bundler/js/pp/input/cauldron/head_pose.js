PP.HeadPose = class HeadPose {

    constructor(fixForward = true, forceEmulatedVelocities = false) {
        this._myFixForward = fixForward;
        this._myForceEmulatedVelocities = forceEmulatedVelocities;

        this._myReferenceSpace = null;

        this._myPosition = [0, 0, 0];
        this._myRotation = [0, 0, 0, 1];

        this._myPrevPosition = [0, 0, 0];
        this._myPrevRotation = [0, 0, 0, 1];

        this._myLinearVelocity = [0, 0, 0];
        this._myAngularVelocity = [0, 0, 0]; // Radians

        this._myIsValid = false;
        this._myIsLinearVelocityEmulated = true;
        this._myIsAngularVelocityEmulated = true;

        // Out Data
        this._myOutAxes = [PP.vec3_create(), PP.vec3_create(), PP.vec3_create()];
        this._myOutRotationQuat = PP.quat_create();

        this._myOutRotationRadians = PP.vec3_create();
        this._myOutPrevRotationRadians = PP.vec3_create();
    }

    getReferenceSpace() {
        return this._myReferenceSpace;
    }

    getPosition() {
        return this._myPosition;
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
        let out = this._myRotation;

        if (this._myFixForward) {
            this._myOutRotationQuat.pp_copy(this._myRotation);
            out = this._myOutRotationQuat;
            out.quat_rotateAxisRadians(Math.PI, out.quat_getAxes(this._myOutAxes)[1], out);
        }

        return out;
    }

    getTransform() {
        return this.getTransformMatrix();
    }

    getTransformMatrix() {
        return PP.mat4_fromPositionRotationQuat(this._myPosition, this.getRotationQuat());
    }

    getTransformQuat() {
        return PP.quat2_fromPositionRotationQuat(this._myPosition, this.getRotationQuat());
    }

    getLinearVelocity() {
        return this._myLinearVelocity;
    }

    getAngularVelocity() {
        return this.getAngularVelocityDegrees();
    }

    getAngularVelocityDegrees() {
        return this._myAngularVelocity.vec3_toDegrees();
    }

    getAngularVelocityRadians() {
        return this._myAngularVelocity;
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

    setFixForward(fixForward) {
        this._myFixForward = fixForward;
    }

    setForceEmulatedVelocities(forceEmulatedVelocities) {
        this._myForceEmulatedVelocities = forceEmulatedVelocities;
    }

    start() {
        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    }

    update(dt) {
        this._myPrevPosition.vec3_copy(this._myPosition);
        this._myPrevRotation.quat_copy(this._myRotation);

        let xrFrame = Module['webxr_frame'];
        if (xrFrame) {
            let xrPose = null;
            try {
                xrPose = xrFrame.getViewerPose(this._myReferenceSpace);
            } catch (error) {
            }

            if (xrPose) {
                this._myPosition[0] = xrPose.transform.position.x;
                this._myPosition[1] = xrPose.transform.position.y;
                this._myPosition[2] = xrPose.transform.position.z;

                this._myRotation[0] = xrPose.transform.orientation.x;
                this._myRotation[1] = xrPose.transform.orientation.y;
                this._myRotation[2] = xrPose.transform.orientation.z;
                this._myRotation[3] = xrPose.transform.orientation.w;

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
                    this._myAngularVelocity[0] = xrPose.angularVelocity.x;
                    this._myAngularVelocity[1] = xrPose.angularVelocity.y;
                    this._myAngularVelocity[2] = xrPose.angularVelocity.z;

                    this._myIsAngularVelocityEmulated = false;
                } else {
                    this._computeEmulatedAngularVelocity(dt);

                    this._myIsAngularVelocityEmulated = true;
                }

                this._myIsValid = true;
            } else {
                //keep previous position and rotation but reset velocity because reasons

                this._myLinearVelocity[0] = 0;
                this._myLinearVelocity[1] = 0;
                this._myLinearVelocity[2] = 0;

                this._myAngularVelocity[0] = 0;
                this._myAngularVelocity[1] = 0;
                this._myAngularVelocity[2] = 0;

                this._myIsValid = false;
                this._myIsLinearVelocityEmulated = true;
                this._myIsAngularVelocityEmulated = true;
            }
        } else {
            //keep previous position and rotation but reset velocity because reasons

            this._myLinearVelocity[0] = 0;
            this._myLinearVelocity[1] = 0;
            this._myLinearVelocity[2] = 0;

            this._myAngularVelocity[0] = 0;
            this._myAngularVelocity[1] = 0;
            this._myAngularVelocity[2] = 0;

            this._myIsValid = false;
            this._myIsLinearVelocityEmulated = true;
            this._myIsAngularVelocityEmulated = true;
        }
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

    _computeEmulatedAngularVelocity(dt) {
        if (dt > 0) {
            let rotationRadians = this._myRotation.quat_toRadians(this._myOutRotationRadians);
            let prevRotationRadians = this._myPrevRotation.quat_toRadians(this._myOutPrevRotationRadians);
            rotationRadians.vec3_sub(prevRotationRadians, this._myAngularVelocity);
            this._myAngularVelocity.vec3_scale(1 / dt, this._myAngularVelocity);
        } else {
            this._myAngularVelocity[0] = 0;
            this._myAngularVelocity[1] = 0;
            this._myAngularVelocity[2] = 0;
        }
    }

    _onXRSessionStart(session) {
        session.requestReferenceSpace(WebXR.refSpace).then(function (referenceSpace) { this._myReferenceSpace = referenceSpace; }.bind(this));
    }

    _onXRSessionEnd(session) {
        this._myReferenceSpace = null;
    }
};
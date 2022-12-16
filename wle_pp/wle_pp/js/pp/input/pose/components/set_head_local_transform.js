WL.registerComponent('pp-set-head-local-transform', {
    _myNonVRCamera: { type: WL.Type.Object },
    _myFixForward: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        this._myHeadPose = new PP.HeadPose();
        this._myHeadPose.setFixForward(this._myFixForward);
    },
    start: function () {
        this._myHeadPose.start();
    },
    update: function () {
        let headPoseTransform = PP.quat2_create();
        let nonVRCameraRotation = PP.quat_create();
        let nonVRCameraUp = PP.vec3_create();
        let nonVRCameraPosition = PP.vec3_create();
        return function update(dt) {
            this._myHeadPose.update(dt);

            if (PP.XRUtils.isSessionActive()) {
                this.object.pp_setTransformLocalQuat(this._myHeadPose.getTransformQuat(headPoseTransform));
            } else {
                nonVRCameraRotation = this._myNonVRCamera.pp_getRotationLocalQuat(nonVRCameraRotation);
                if (this._myFixForward) {
                    nonVRCameraRotation.quat_rotateAxisRadians(Math.PI, nonVRCameraRotation.quat_getUp(nonVRCameraUp), nonVRCameraRotation);
                }
                this.object.pp_setPositionLocal(this._myNonVRCamera.pp_getPositionLocal(nonVRCameraPosition));
                this.object.pp_setRotationLocalQuat(nonVRCameraRotation);
            }
        };
    }(),
});
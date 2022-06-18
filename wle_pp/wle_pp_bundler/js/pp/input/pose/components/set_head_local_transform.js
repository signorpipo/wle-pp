WL.registerComponent('pp-set-head-local-transform', {
    _myNonVRCamera: { type: WL.Type.Object },
    _myFixForward: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        this._myHeadPose = new PP.HeadPose(this._myFixForward);
    },
    start: function () {
        this._myHeadPose.start();
    },
    update: function (dt) {
        this._myHeadPose.update(dt);

        if (PP.XRUtils.isXRSessionActive()) {
            this.object.pp_setTransformLocalQuat(this._myHeadPose.getTransformQuat());
        } else {
            let nonVRCameraRotation = this._myNonVRCamera.pp_getRotationLocalQuat();
            if (this._myFixForward) {
                nonVRCameraRotation.quat_rotateAxisRadians(Math.PI, nonVRCameraRotation.quat_getUp(), nonVRCameraRotation);
            }
            this.object.pp_setPositionLocal(this._myNonVRCamera.pp_getPositionLocal());
            this.object.pp_setRotationLocalQuat(nonVRCameraRotation);
        }
    },
});
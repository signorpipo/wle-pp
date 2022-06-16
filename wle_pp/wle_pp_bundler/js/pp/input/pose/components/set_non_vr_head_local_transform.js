WL.registerComponent('pp-set-non-vr-head-local-transform', {
    _myNonVRCamera: { type: WL.Type.Object },
    _myFixForward: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        let nonVRCameraRotation = this._myNonVRCamera.pp_getRotationLocalQuat();
        if (this._myFixForward) {
            nonVRCameraRotation.quat_rotateAxisRadians(Math.PI, nonVRCameraRotation.quat_getUp(), nonVRCameraRotation);
        }
        this.object.pp_setPositionLocal(this._myNonVRCamera.pp_getPositionLocal());
        this.object.pp_setRotationLocalQuat(nonVRCameraRotation);
    },
}); 
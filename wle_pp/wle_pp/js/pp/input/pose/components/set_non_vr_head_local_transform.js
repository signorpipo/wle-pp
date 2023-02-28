WL.registerComponent('pp-set-non-vr-head-local-transform', {
    _myNonVRCamera: { type: WL.Type.Object },
    _myFixForward: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
    },
    start: function () {
        this.update(0);
    },
    update: function (dt) {
        let nonVRCameraRotation = PP.quat_create();
        let nonVRCameraUp = PP.vec3_create();
        let nonVRCameraPosition = PP.vec3_create();
        return function update(dt) {
            nonVRCameraRotation = this._myNonVRCamera.pp_getRotationLocalQuat(nonVRCameraRotation);
            if (this._myFixForward) {
                nonVRCameraRotation.quat_rotateAxisRadians(Math.PI, nonVRCameraRotation.quat_getUp(nonVRCameraUp), nonVRCameraRotation);
            }
            this.object.pp_setPositionLocal(this._myNonVRCamera.pp_getPositionLocal(nonVRCameraPosition));
            this.object.pp_setRotationLocalQuat(nonVRCameraRotation);
        };
    }(),
}); 
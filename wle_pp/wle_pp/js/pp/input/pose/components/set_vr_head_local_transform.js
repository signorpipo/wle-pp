WL.registerComponent('pp-set-vr-head-local-transform', {
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
        return function update(dt) {
            this._myHeadPose.update(dt);
            this.object.pp_setTransformLocalQuat(this._myHeadPose.getTransformQuat(headPoseTransform));
        };
    }(),
});
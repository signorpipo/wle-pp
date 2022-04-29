WL.registerComponent('pp-set-head-transform', {
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
        this.object.pp_setTransformLocalQuat(this._myHeadPose.getTransformQuat());
    },
});
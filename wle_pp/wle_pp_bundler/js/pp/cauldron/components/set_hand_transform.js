WL.registerComponent('pp-set-hand-transform', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myFixForward: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        this._myHandPose = new PP.HandPose(PP.InputUtils.getHandednessByIndex(this._myHandedness), this._myFixForward);
    },
    start: function () {
        this._myHandPose.start();
    },
    update: function (dt) {
        this._myHandPose.update(dt);
        this.object.pp_setTransformLocalQuat(this._myHandPose.getTransformQuat());
    },
});
WL.registerComponent('pp-set-hand-local-transform', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myFixForward: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        this._myHandPose = new PP.HandPose(PP.InputUtils.getHandednessByIndex(this._myHandedness));
        this._myHandPose.setFixForward(this._myFixForward);
    },
    start: function () {
        this._myHandPose.start();
    },
    update: function () {
        let handPoseTransform = PP.quat2_create();
        return function update(dt) {
            this._myHandPose.update(dt);
            this.object.pp_setTransformLocalQuat(this._myHandPose.getTransformQuat(handPoseTransform));
        };
    }(),
});
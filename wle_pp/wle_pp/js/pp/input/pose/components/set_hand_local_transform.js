WL.registerComponent('pp-set-hand-local-transform', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myFixForward: { type: WL.Type.Bool, default: true },
    _myUpdateOnViewReset: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        this._myHandPose = new PP.HandPose(PP.InputUtils.getHandednessByIndex(this._myHandedness));
        this._myHandPose.setFixForward(this._myFixForward);
        this._myHandPose.setUpdateOnViewReset(this._myUpdateOnViewReset);
        this._myHandPose.registerPoseUpdatedEventListener(this, this.onPoseUpdated.bind(this));
    },
    start: function () {
        this._myHandPose.start();
        this.update(0);
    },
    update: function update(dt) {
        this._myHandPose.update(dt);
    },
    onPoseUpdated: function () {
        let handPoseTransform = PP.quat2_create()
        return function onPoseUpdated() {
            this.object.pp_setTransformLocalQuat(this._myHandPose.getTransformQuat(handPoseTransform));
        }
    }()
});
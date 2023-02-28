WL.registerComponent('pp-set-vr-head-local-transform', {
    _myFixForward: { type: WL.Type.Bool, default: true },
    _myUpdateOnViewReset: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        this._myHeadPose = new PP.HeadPose();
        this._myHeadPose.setFixForward(this._myFixForward);
        this._myHeadPose.setUpdateOnViewReset(this._myUpdateOnViewReset);
        this._myHeadPose.registerPoseUpdatedEventListener(this, this.onPoseUpdated.bind(this));
    },
    start: function () {
        this._myHeadPose.start();
        this.update(0);
    },
    update: function update(dt) {
        this._myHeadPose.update(dt);
    },
    onPoseUpdated: function () {
        let headPoseTransform = PP.quat2_create();
        return function onPoseUpdated() {
            this.object.pp_setTransformLocalQuat(this._myHeadPose.getTransformQuat(headPoseTransform));
        }
    }()
});
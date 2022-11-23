WL.registerComponent('pp-tracked-hand-draw-skin', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myFixForward: { type: WL.Type.Bool, default: true },
    _myHandSkin: { type: WL.Type.Skin, default: null }
}, {
    init: function () {
        this._myHandednessInternal = PP.InputUtils.getHandednessByIndex(this._myHandedness);

        this._myTrackedHandPose = new PP.TrackedHandPose(this._myHandednessInternal);
        this._myTrackedHandPose.setFixForward(this._myFixForward);
    },
    start: function () {
        this._myTrackedHandPose.start();

        this._prepareJoints();
    },
    update: function update(dt) {
        this._myTrackedHandPose.update(dt);

        for (let i = 0; i < this._myJoints.length; i++) {
            let jointObject = this._myJoints[i];

            let jointType = jointObject.name; // joint name must match the PP.TrackedHandJointType enum value
            let jointPose = this._myTrackedHandPose.getJointPose(jointType);

            jointObject.pp_setTransformLocalQuat(jointPose.getTransformQuat());
        }
    },
    _prepareJoints() {
        this._myJoints = [];

        let skinJointIDs = this._myHandSkin.jointIds;

        for (let i = 0; i < skinJointIDs.length; i++) {
            this._myJoints[i] = new WL.Object(skinJointIDs[i]);
        }
    }
});
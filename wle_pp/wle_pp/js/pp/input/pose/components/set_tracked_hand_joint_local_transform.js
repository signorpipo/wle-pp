WL.registerComponent('pp-set-tracked-hand-joint-local-transform', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myFixForward: { type: WL.Type.Bool, default: true },
    _mySetLocalScaleAsJointRadius: { type: WL.Type.Bool, default: false },
    _myJointID: {
        type: WL.Type.Enum, values:
            [
                'Wrist',
                'Thumb Metacarpal', 'Thumb Phalanx Proximal', 'Thumb Phalanx Distal', 'Thumb Tip',
                'Index Metacarpal', 'Index Phalanx Proximal', 'Index Phalanx Intermediate', 'Index Phalanx Distal', 'Index Tip',
                'Middle Metacarpal', 'Middle Phalanx Proximal', 'Middle Phalanx Intermediate', 'Middle Phalanx Distal', 'Middle Tip',
                'Ring Metacarpal', 'Ring Phalanx Proximal', 'Ring Phalanx Intermediate', 'Ring Phalanx Distal', 'Ring Tip',
                'Pinky Metacarpal', 'Pinky Phalanx Proximal', 'Pinky Phalanx Intermediate', 'Pinky Phalanx Distal', 'Pinky Tip'
            ],
        default: 'Wrist'
    }
}, {
    init: function () {
        this._myHandednessInternal = PP.InputUtils.getHandednessByIndex(this._myHandedness);
        this._myJointIDInternal = PP.InputUtils.getJointIDByIndex(this._myJointID);

        this._myTrackedHandJointPose = new PP.TrackedHandJointPose(this._myHandednessInternal, this._myJointIDInternal);
        this._myTrackedHandJointPose.setFixForward(this._myFixForward);
    },
    start: function () {
        this._myTrackedHandJointPose.start();
    },
    update: function (dt) {
        this._myTrackedHandJointPose.update(dt);

        this.object.pp_setTransformLocalQuat(this._myTrackedHandJointPose.getTransformQuat());

        if (this._mySetLocalScaleAsJointRadius) {
            this.object.pp_setScaleLocal(this._myTrackedHandJointPose.getJointRadius());
        }
    }
});
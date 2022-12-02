WL.registerComponent('pp-tracked-hand-draw-joint', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myFixForward: { type: WL.Type.Bool, default: true },
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
    },
    _myJointMesh: { type: WL.Type.Mesh },
    _myJointMaterial: { type: WL.Type.Material }
}, {
    init: function () {
        this._myHandednessInternal = PP.InputUtils.getHandednessByIndex(this._myHandedness);
        this._myJointIDInternal = PP.InputUtils.getJointIDByIndex(this._myJointID);

        this._myTrackedHandJointPose = new PP.TrackedHandJointPose(this._myHandednessInternal, this._myJointIDInternal);
        this._myTrackedHandJointPose.setFixForward(this._myFixForward);
    },
    start: function () {
        this._myTrackedHandJointPose.start();

        this._buildTrackedHandHierarchy();
    },
    update: function (dt) {
        this._myTrackedHandJointPose.update(dt);
        this._myJointMeshObject.pp_setTransformLocalQuat(this._myTrackedHandJointPose.getTransformQuat());
        this._myJointMeshObject.pp_setScaleLocal(this._myTrackedHandJointPose.getJointRadius());
    },
    _buildTrackedHandHierarchy() {
        this._myJointMeshObject = this.object.pp_addObject();

        let mesh = this._myJointMeshObject.pp_addComponent("mesh");
        mesh.mesh = this._myJointMesh;
        mesh.material = this._myJointMaterial;

        this._myJointMeshObject.pp_setScaleLocal(0);
    }
});
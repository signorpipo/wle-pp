WL.registerComponent('pp-tracked-hand-draw-all-joints', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myFixForward: { type: WL.Type.Bool, default: true },
    _myHideMetacarpals: { type: WL.Type.Bool, default: true },
    _myJointMesh: { type: WL.Type.Mesh },
    _myJointMaterial: { type: WL.Type.Material }
}, {
    init: function () {
    },
    start: function () {
        this._buildTrackedHandHierarchy();
    },
    update: function (dt) {
    },
    _buildTrackedHandHierarchy() {
        this._myTrackedHandMeshObject = this.object.pp_addObject();

        this._myJointMeshObjectList = [];

        for (let jointTypeKey in PP.TrackedHandJointType) {
            let jointType = PP.TrackedHandJointType[jointTypeKey];
            if (!this._myHideMetacarpals ||
                (jointType != PP.TrackedHandJointType.THUMB_METACARPAL &&
                    jointType != PP.TrackedHandJointType.INDEX_FINGER_METACARPAL && jointType != PP.TrackedHandJointType.MIDDLE_FINGER_METACARPAL &&
                    jointType != PP.TrackedHandJointType.RING_FINGER_METACARPAL && jointType != PP.TrackedHandJointType.PINKY_FINGER_METACARPAL)
            ) {
                let jointObject = this._myTrackedHandMeshObject.pp_addObject();
                this._myJointMeshObjectList[jointType] = jointObject;

                jointObject.pp_addComponent("pp-tracked-hand-draw-joint",
                    {
                        "_myHandedness": this._myHandedness,
                        "_myFixForward": this._myFixForward,
                        "_myJointType": PP.TrackedHandJointTypeIndex[jointTypeKey],
                        "_myJointMesh": this._myJointMesh,
                        "_myJointMaterial": this._myJointMaterial,
                    });

            }
        }
    }
});
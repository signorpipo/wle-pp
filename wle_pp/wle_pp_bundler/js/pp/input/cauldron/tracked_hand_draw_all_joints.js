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

        for (let jointIDKey in PP.TrackedHandJointID) {
            let jointID = PP.TrackedHandJointID[jointIDKey];
            if (!this._myHideMetacarpals ||
                (jointID != PP.TrackedHandJointID.THUMB_METACARPAL &&
                    jointID != PP.TrackedHandJointID.INDEX_FINGER_METACARPAL && jointID != PP.TrackedHandJointID.MIDDLE_FINGER_METACARPAL &&
                    jointID != PP.TrackedHandJointID.RING_FINGER_METACARPAL && jointID != PP.TrackedHandJointID.PINKY_FINGER_METACARPAL)
            ) {
                let jointObject = this._myTrackedHandMeshObject.pp_addObject();
                this._myJointMeshObjectList[jointID] = jointObject;

                jointObject.pp_addComponent("pp-tracked-hand-draw-joint",
                    {
                        "_myHandedness": this._myHandedness,
                        "_myFixForward": this._myFixForward,
                        "_myJointID": PP.TrackedHandJointIDIndex[jointIDKey],
                        "_myJointMesh": this._myJointMesh,
                        "_myJointMaterial": this._myJointMaterial,
                    });

            }
        }
    }
});
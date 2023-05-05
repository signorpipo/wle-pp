import { Component, MeshComponent, Property } from "@wonderlandengine/api";
import { quat2_create } from "../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../pp/globals";
import { InputUtils } from "../input_utils";

export class TrackedHandDrawJointComponent extends Component {
    static TypeName = "pp-tracked-hand-draw-joint";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myJointID: Property.enum(
            [
                "Wrist",
                "Thumb Metacarpal", "Thumb Phalanx Proximal", "Thumb Phalanx Distal", "Thumb Tip",
                "Index Metacarpal", "Index Phalanx Proximal", "Index Phalanx Intermediate", "Index Phalanx Distal", "Index Tip",
                "Middle Metacarpal", "Middle Phalanx Proximal", "Middle Phalanx Intermediate", "Middle Phalanx Distal", "Middle Tip",
                "Ring Metacarpal", "Ring Phalanx Proximal", "Ring Phalanx Intermediate", "Ring Phalanx Distal", "Ring Tip",
                "Pinky Metacarpal", "Pinky Phalanx Proximal", "Pinky Phalanx Intermediate", "Pinky Phalanx Distal", "Pinky Tip"
            ],
            "Wrist"),
        _myJointMesh: Property.mesh(),
        _myJointMaterial: Property.material()
    };

    start() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);
        this._myJointIDType = InputUtils.getJointIDByIndex(this._myJointID);

        this._buildTrackedHandHierarchy();
    }

    update(dt) {
        // Implemented outside class definition
    }

    _buildTrackedHandHierarchy() {
        this._myJointMeshObject = this.object.pp_addObject();

        let mesh = this._myJointMeshObject.pp_addComponent(MeshComponent);
        mesh.mesh = this._myJointMesh;
        mesh.material = this._myJointMaterial;

        this._myJointMeshObject.pp_setScaleLocal(0);
    }
}



// IMPLEMENTATION

TrackedHandDrawJointComponent.prototype.update = function () {
    let transformQuat = quat2_create()
    return function update(dt) {
        let jointPose = Globals.getTrackedHandPose(this._myHandednessType).getJointPose(this._myJointIDType);

        this._myJointMeshObject.pp_setTransformLocalQuat(jointPose.getTransformQuat(transformQuat, null));
        this._myJointMeshObject.pp_setScaleLocal(jointPose.getJointRadius());
    };
}();
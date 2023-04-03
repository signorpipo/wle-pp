import { Component, MeshComponent, Property } from "@wonderlandengine/api";
import { BasePoseParams } from "../../pose/base_pose";
import { TrackedHandJointPose } from "../../pose/tracked_hand_joint_pose";
import { InputUtils } from "../input_utils";

export class TrackedHandDrawJointComponent extends Component {
    static TypeName = "pp-tracked-hand-draw-joint";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myFixForward: Property.bool(true),
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

    init() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);
        this._myJointIDInternal = InputUtils.getJointIDByIndex(this._myJointID);

        this._myTrackedHandJointPose = new TrackedHandJointPose(this._myHandednessType, this._myJointIDInternal, new BasePoseParams(this.engine));
        this._myTrackedHandJointPose.setFixForward(this._myFixForward);
    }

    start() {
        this._myTrackedHandJointPose.start();

        this._buildTrackedHandHierarchy();
    }

    update(dt) {
        this._myTrackedHandJointPose.update(dt);
        this._myJointMeshObject.pp_setTransformLocalQuat(this._myTrackedHandJointPose.getTransformQuat());
        this._myJointMeshObject.pp_setScaleLocal(this._myTrackedHandJointPose.getJointRadius());
    }

    _buildTrackedHandHierarchy() {
        this._myJointMeshObject = this.object.pp_addObject();

        let mesh = this._myJointMeshObject.pp_addComponent(MeshComponent);
        mesh.mesh = this._myJointMesh;
        mesh.material = this._myJointMaterial;

        this._myJointMeshObject.pp_setScaleLocal(0);
    }
}
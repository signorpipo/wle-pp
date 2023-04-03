import { Component, Property } from "@wonderlandengine/api";
import { quat2_create } from "../../../plugin/js/extensions/array_extension";
import { InputUtils } from "../../cauldron/input_utils";
import { TrackedHandJointPose } from "../tracked_hand_joint_pose";

export class SetTrackedHandJointLocalTransformComponent extends Component {
    static TypeName = "pp-set-tracked-hand-joint-local-transform";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myFixForward: Property.bool(true),
        _myUpdateOnViewReset: Property.bool(true),
        _mySetLocalScaleAsJointRadius: Property.bool(false),
        _myJointID: Property.enum(
            [
                "Wrist",
                "Thumb Metacarpal", "Thumb Phalanx Proximal", "Thumb Phalanx Distal", "Thumb Tip",
                "Index Metacarpal", "Index Phalanx Proximal", "Index Phalanx Intermediate", "Index Phalanx Distal", "Index Tip",
                "Middle Metacarpal", "Middle Phalanx Proximal", "Middle Phalanx Intermediate", "Middle Phalanx Distal", "Middle Tip",
                "Ring Metacarpal", "Ring Phalanx Proximal", "Ring Phalanx Intermediate", "Ring Phalanx Distal", "Ring Tip",
                "Pinky Metacarpal", "Pinky Phalanx Proximal", "Pinky Phalanx Intermediate", "Pinky Phalanx Distal", "Pinky Tip"
            ],
            "Wrist")
    };

    init() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);
        this._myJointIDInternal = InputUtils.getJointIDByIndex(this._myJointID);

        this._myTrackedHandJointPose = new TrackedHandJointPose(this._myHandednessType, this._myJointIDInternal, new BasePoseParams(this.engine));
        this._myTrackedHandJointPose.setFixForward(this._myFixForward);
        this._myTrackedHandJointPose.setUpdateOnViewReset(this._myUpdateOnViewReset);
        this._myTrackedHandJointPose.registerPoseUpdatedEventListener(this, this.onPoseUpdated.bind(this));
    }

    start() {
        this._myTrackedHandJointPose.start();
        this.update(0);
    }

    update(dt) {
        this._myTrackedHandJointPose.update(dt);
    }

    onPoseUpdated() {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

SetTrackedHandJointLocalTransformComponent.prototype.onPoseUpdated = function () {
    let jointPoseTransform = quat2_create()
    return function onPoseUpdated() {
        this.object.pp_setTransformLocalQuat(this._myTrackedHandJointPose.getTransformQuat(jointPoseTransform));

        if (this._mySetLocalScaleAsJointRadius) {
            this.object.pp_setScaleLocal(this._myTrackedHandJointPose.getJointRadius());
        }
    }
}();
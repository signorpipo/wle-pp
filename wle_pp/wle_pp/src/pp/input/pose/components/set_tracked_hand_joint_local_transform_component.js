import { Component, Property } from "@wonderlandengine/api";
import { XRUtils } from "../../../cauldron/utils/xr_utils";
import { quat2_create } from "../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../pp/globals";
import { InputUtils } from "../../cauldron/input_utils";

export class SetTrackedHandJointLocalTransformComponent extends Component {
    static TypeName = "pp-set-tracked-hand-joint-local-transform";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
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

    start() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);
        this._myJointIDType = InputUtils.getJointIDByIndex(this._myJointID);

        Globals.getTrackedHandPose(this._myHandednessType, this.engine).getJointPose(this._myJointIDType).registerPoseUpdatedEventListener(this, this.onPoseUpdated.bind(this));
    }

    onPoseUpdated() {
        // Implemented outside class definition
    }

    onDestroy() {
        Globals.getTrackedHandPose(this._myHandednessType, this.engine)?.getJointPose(this._myJointIDType)?.unregisterPoseUpdatedEventListener(this);
    }
}



// IMPLEMENTATION

SetTrackedHandJointLocalTransformComponent.prototype.onPoseUpdated = function () {
    let jointPoseTransform = quat2_create();
    return function onPoseUpdated(pose) {
        if (this.active && XRUtils.isSessionActive(this.engine)) {
            if (pose.isValid()) {
                this.object.pp_setTransformLocalQuat(pose.getTransformQuat(jointPoseTransform, null));

                if (this._mySetLocalScaleAsJointRadius) {
                    this.object.pp_setScaleLocal(pose.getJointRadius());
                }
            }
        }
    };
}();
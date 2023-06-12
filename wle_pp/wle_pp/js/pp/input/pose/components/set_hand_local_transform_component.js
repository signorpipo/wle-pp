import { Component, Property } from "@wonderlandengine/api";
import { XRUtils } from "../../../cauldron/utils/xr_utils";
import { quat2_create } from "../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../pp/globals";
import { InputUtils } from "../../cauldron/input_utils";

export class SetHandLocalTransformComponent extends Component {
    static TypeName = "pp-set-hand-local-transform";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left")
    };

    start() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);

        Globals.getHandPose(this._myHandednessType, this.engine).registerPoseUpdatedEventListener(this, this.onPoseUpdated.bind(this));
    }

    onPoseUpdated() {
        // Implemented outside class definition
    }

    onDestroy() {
        Globals.getHandPose(this._myHandednessType, this.engine)?.unregisterPoseUpdatedEventListener(this);
    }
}



// IMPLEMENTATION

SetHandLocalTransformComponent.prototype.onPoseUpdated = function () {
    let handPoseTransform = quat2_create()
    return function onPoseUpdated(pose) {
        if (this.active && XRUtils.isSessionActive(this.engine)) {
            if (pose.isValid()) {
                this.object.pp_setTransformLocalQuat(pose.getTransformQuat(handPoseTransform, null));
            }
        }
    };
}();
import { Component } from "@wonderlandengine/api";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { quat2_create, quat_create, vec3_create } from "../../../plugin/js/extensions/array_extension.js";
import { Globals } from "../../../pp/globals.js";

export class SetHeadLocalTransformComponent extends Component {
    static TypeName = "pp-set-head-local-transform";
    static Properties = {};

    start() {
        Globals.getHeadPose(this.engine).registerPoseUpdatedEventListener(this, this.onPoseUpdated.bind(this));
    }

    onPoseUpdated(dt, pose) {
        // Implemented outside class definition
    }

    onDestroy() {
        Globals.getHeadPose(this.engine)?.unregisterPoseUpdatedEventListener(this);
    }
}



// IMPLEMENTATION

SetHeadLocalTransformComponent.prototype.onPoseUpdated = function () {
    let cameraNonXRRotation = quat_create();
    let cameraNonXRUp = vec3_create();
    let cameraNonXRPosition = vec3_create();

    let headPoseTransform = quat2_create();
    return function onPoseUpdated(dt, pose) {
        if (this.active) {
            if (!XRUtils.isSessionActive(this.engine)) {
                let cameraNonXR = Globals.getPlayerObjects(this.engine).myCameraNonXR;

                cameraNonXRRotation = cameraNonXR.pp_getRotationLocalQuat(cameraNonXRRotation);
                if (Globals.isPoseForwardFixed(this.engine)) {
                    cameraNonXRRotation.quat_rotateAxisRadians(Math.PI, cameraNonXRRotation.quat_getUp(cameraNonXRUp), cameraNonXRRotation);
                }
                this.object.pp_setPositionLocal(cameraNonXR.pp_getPositionLocal(cameraNonXRPosition));
                this.object.pp_setRotationLocalQuat(cameraNonXRRotation);
            } else {
                if (pose.isValid()) {
                    this.object.pp_setTransformLocalQuat(pose.getTransformQuat(headPoseTransform, null));
                }
            }
        }
    };
}();
import { Component } from "@wonderlandengine/api";
import { XRUtils } from "../../../cauldron/utils/xr_utils";
import { quat2_create, quat_create, vec3_create } from "../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../pp/globals";

export class SetHeadLocalTransformComponent extends Component {
    static TypeName = "pp-set-head-local-transform";
    static Properties = {};

    start() {
        Globals.getHeadPose(this.engine).registerPoseUpdatedEventListener(this, this.onPoseUpdated.bind(this));
    }

    update(dt) {
        // Implemented outside class definition
    }

    onPoseUpdated() {
        // Implemented outside class definition
    }

    onDestroy() {
        Globals.getHeadPose(this.engine)?.unregisterPoseUpdatedEventListener(this);
    }
}



// IMPLEMENTATION

SetHeadLocalTransformComponent.prototype.update = function () {
    let cameraNonXRRotation = quat_create();
    let cameraNonXRUp = vec3_create();
    let cameraNonXRPosition = vec3_create();
    return function update(dt) {
        if (!XRUtils.isSessionActive(this.engine)) {
            let cameraNonXR = Globals.getPlayerObjects(this.engine).myCameraNonXR;

            cameraNonXRRotation = cameraNonXR.pp_getRotationLocalQuat(cameraNonXRRotation);
            if (Globals.isPoseForwardFixed(this.engine)) {
                cameraNonXRRotation.quat_rotateAxisRadians(Math.PI, cameraNonXRRotation.quat_getUp(cameraNonXRUp), cameraNonXRRotation);
            }
            this.object.pp_setPositionLocal(cameraNonXR.pp_getPositionLocal(cameraNonXRPosition));
            this.object.pp_setRotationLocalQuat(cameraNonXRRotation);
        }
    };
}();

SetHeadLocalTransformComponent.prototype.onPoseUpdated = function () {
    let headPoseTransform = quat2_create();
    return function onPoseUpdated(pose) {
        if (this.active && XRUtils.isSessionActive(this.engine)) {
            if (pose.isValid()) {
                this.object.pp_setTransformLocalQuat(pose.getTransformQuat(headPoseTransform, null));
            }
        }
    };
}();
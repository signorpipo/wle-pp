import { Component, Property } from "@wonderlandengine/api";
import { XRUtils } from "../../../cauldron/utils/xr_utils";
import { quat2_create, quat_create, vec3_create } from "../../../plugin/js/extensions/array_extension";
import { BasePoseParams } from "../base_pose";
import { HeadPose } from "../head_pose";

export class SetHeadLocalTransformComponent extends Component {
    static TypeName = "pp-set-head-local-transform";
    static Properties = {
        _myCameraNonVR: Property.object(),
        _myFixForward: Property.bool(true),
        _myUpdateOnViewReset: Property.bool(true)
    };

    init() {
        this._myHeadPose = new HeadPose(new BasePoseParams(this.engine));
        this._myHeadPose.setFixForward(this._myFixForward);
        this._myHeadPose.setUpdateOnViewReset(this._myUpdateOnViewReset);
        this._myHeadPose.registerPoseUpdatedEventListener(this, this.onPoseUpdated.bind(this));
    }

    start() {
        this._myHeadPose.start();
        this.update(0);
    }

    update(dt) {
        // Implemented outside class definition
    }

    onPoseUpdated() {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

SetHeadLocalTransformComponent.prototype.update = function () {
    let cameraNonVRRotation = quat_create();
    let cameraNonVRUp = vec3_create();
    let cameraNonVRPosition = vec3_create();
    return function update(dt) {
        if (XRUtils.isSessionActive(this.engine)) {
            this._myHeadPose.update(dt);
        } else {
            cameraNonVRRotation = this._myCameraNonVR.pp_getRotationLocalQuat(cameraNonVRRotation);
            if (this._myFixForward) {
                cameraNonVRRotation.quat_rotateAxisRadians(Math.PI, cameraNonVRRotation.quat_getUp(cameraNonVRUp), cameraNonVRRotation);
            }
            this.object.pp_setPositionLocal(this._myCameraNonVR.pp_getPositionLocal(cameraNonVRPosition));
            this.object.pp_setRotationLocalQuat(cameraNonVRRotation);
        }
    };
}();

SetHeadLocalTransformComponent.prototype.onPoseUpdated = function () {
    let headPoseTransform = quat2_create();
    return function onPoseUpdated() {
        if (XRUtils.isSessionActive(this.engine)) {
            this.object.pp_setTransformLocalQuat(this._myHeadPose.getTransformQuat(headPoseTransform));
        }
    }
}();
import { Component, Property } from "@wonderlandengine/api";
import { quat2_create } from "../../../plugin/js/extensions/array_extension";
import { BasePoseParams } from "../base_pose";
import { HeadPose } from "../head_pose";

export class SetHeadVRLocalTransformComponent extends Component {
    static TypeName = "pp-set-head-vr-local-transform";
    static Properties = {
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
        this._myHeadPose.update(dt);
    }

    onPoseUpdated() {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

SetHeadVRLocalTransformComponent.prototype.onPoseUpdated = function () {
    let headPoseTransform = quat2_create();
    return function onPoseUpdated() {
        this.object.pp_setTransformLocalQuat(this._myHeadPose.getTransformQuat(headPoseTransform));
    }
}();
import { HandPose, HandPoseParams } from "./hand_pose.js";

export class HandRayPoseParams extends HandPoseParams { }

export class HandRayPose extends HandPose {

    constructor(handedness, handRayPoseParams = new HandRayPoseParams()) {
        super(handedness, handRayPoseParams);
    }

    _getPose(xrFrame) {
        return xrFrame.getPose(this._myInputSource.targetRaySpace, this.getReferenceSpace());
    }
}
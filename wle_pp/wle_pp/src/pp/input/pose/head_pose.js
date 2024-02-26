import { BasePose } from "./base_pose.js";

export class HeadPose extends BasePose {
    _getPose(xrFrame) {
        return xrFrame.getViewerPose(this.getReferenceSpace());
    }
}
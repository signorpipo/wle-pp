import { BasePose } from "./base_pose";

export class HeadPose extends BasePose {
    _getPose(xrFrame) {
        return xrFrame.getViewerPose(this.getReferenceSpace());
    }
}
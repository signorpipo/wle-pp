PP.HeadPose = class HeadPose extends PP.BasePose {
    _getPose(xrFrame) {
        return xrFrame.getViewerPose(this._myReferenceSpace);
    }
};
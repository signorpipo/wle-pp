PP.XRUtils = {
    isDeviceEmulated: function () {
        let isEmulated = ('CustomWebXRPolyfill' in window);
        return isEmulated;
    },
    isSessionActive: function () {
        return WL.xrSession != null;
    },
    isReferenceSpaceLocalFloor: function () {
        return !["local", "viewer"].includes(WebXR.refSpace);
    }
};
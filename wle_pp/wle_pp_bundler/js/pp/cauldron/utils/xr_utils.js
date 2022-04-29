PP.XRUtils = {
    isDeviceEmulated: function () {
        let isEmulated = ('CustomWebXRPolyfill' in window);
        return isEmulated;
    },
    isXRSessionActive: function () {
        return WL.xrSession != null;
    },
    isReferenceSpaceLocalFloor: function () {
        return !["local", "viewer"].includes(WebXR.refSpace);
    }
};
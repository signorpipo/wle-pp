WL.registerComponent('pp-copy-non-vr-head-transform', {
}, {
    update: function (dt) {
        let nonVRHead = PP.myPlayerObjects.myNonVRHead;
        this.object.pp_setTransformQuat(nonVRHead.pp_getTransformQuat());
        this.object.pp_setScale(nonVRHead.pp_getScale());
    },
});
WL.registerComponent('pp-copy-head-transform', {
}, {
    update: function (dt) {
        let head = PP.myPlayerObjects.myHead;
        this.object.pp_setTransformQuat(head.pp_getTransformQuat());
        this.object.pp_setScale(head.pp_getScale());
    },
});
WL.registerComponent('pp-copy-player-pivot-transform', {
}, {
    update: function (dt) {
        let playerPivot = PP.myPlayerObjects.myPlayerPivot;
        this.object.pp_setTransformQuat(playerPivot.pp_getTransformQuat());
        this.object.pp_setScale(playerPivot.pp_getScale());
    },
});
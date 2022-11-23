WL.registerComponent('pp-copy-player-transform', {
}, {
    update: function (dt) {
        let player = PP.myPlayerObjects.myPlayer;
        this.object.pp_setTransformQuat(player.pp_getTransformQuat());
        this.object.pp_setScale(player.pp_getScale());
    },
});
WL.registerComponent("pp-debug-axes", {
}, {
    init: function () {
    },
    start: function () {
        this._myDebugAxes = new PP.DebugAxes();
        this._myDebugAxes.setVisible(true);
    },
    update: function (dt) {
        this._myDebugAxes.setTransform(this.object.transformWorld);
    }
});
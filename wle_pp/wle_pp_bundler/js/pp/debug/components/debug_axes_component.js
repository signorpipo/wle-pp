WL.registerComponent("pp-debug-axes", {
}, {
    init: function () {
    },
    start: function () {
        this._myDebugAxes = new PP.DebugAxes();
    },
    update: function (dt) {
        this._myDebugAxes.setTransform(this.object.transformWorld);
    }
});
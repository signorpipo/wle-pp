WL.registerComponent("pp-debug-transform", {
    _myLength: { type: WL.Type.Float, default: 0.1 },
    _myThickness: { type: WL.Type.Float, default: 0.005 }
}, {
    init: function () {
    },
    start: function () {
        this._myDebugTransform = new PP.DebugTransform();
        this._myDebugTransform.setLength(this._myLength);
        this._myDebugTransform.setThickness(this._myThickness);
        this._myDebugTransform.setVisible(true);
    },
    update: function (dt) {
        this._myDebugTransform.setTransform(this.object.pp_getTransform());
    }
});
WL.registerComponent("pp-debug-transform", {
    _myLength: { type: WL.Type.Float, default: 0.1 },
    _myThickness: { type: WL.Type.Float, default: 0.005 }
}, {
    init: function () {
    },
    start: function () {
        this._myDebugTransformParams = new PP.VisualTransformParams();
        this._myDebugTransformParams.myLength = this._myLength;
        this._myDebugTransformParams.myThickness = this._myThickness;
    },
    update: function (dt) {
        this.object.pp_getTransform(this._myDebugTransformParams.myTransform);
        PP.myDebugVisualManager.draw(this._myDebugTransformParams);
    }
});
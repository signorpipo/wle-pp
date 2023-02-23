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

        this._myDebugVisualTransform = new PP.VisualTransform(this._myDebugTransformParams);
    },
    update: function (dt) {
        this.object.pp_getTransform(this._myDebugTransformParams.myTransform);
        this._myDebugVisualTransform.paramsUpdated();
    }
});
WL.registerComponent("pp-easy-transform", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myUseTuneTarget: { type: WL.Type.Bool, default: false },
    _myIsLocal: { type: WL.Type.Bool, default: false },
    _myScaleAsOne: { type: WL.Type.Bool, default: true }, // Edit all scale values together
}, {
    init: function () {
        this._myEasyObjectTuner = new PP.EasyTransform(this._myIsLocal, this._myScaleAsOne, this.object, this._myVariableName, this._mySetAsDefault, this._myUseTuneTarget);
    },
    start: function () {
        this._myEasyObjectTuner.start();
    },
    update: function (dt) {
        this._myEasyObjectTuner.update(dt);
    }
});

PP.EasyTransform = class EasyTransform extends PP.EasyObjectTuner {
    constructor(isLocal, scaleAsOne, object, variableName, setAsDefault, useTuneTarget) {
        super(object, variableName, setAsDefault, useTuneTarget);
        this._myIsLocal = isLocal;
        this._myScaleAsOne = scaleAsOne;
    }

    _getVariableNamePrefix() {
        return "Transform ";
    }

    _createEasyTuneVariable(variableName) {
        return new PP.EasyTuneTransform(variableName, this._getDefaultValue(), this._myScaleAsOne);
    }

    _getObjectValue(object) {
        return this._myIsLocal ? object.pp_getTransformLocal() : object.pp_getTransformWorld();
    }

    _getDefaultValue() {
        return PP.mat4_create();
    }

    _updateObjectValue(object, value) {
        if (this._myIsLocal) {
            object.pp_setTransformLocal(value);
        } else {
            object.pp_setTransformWorld(value);
        }
    }
};
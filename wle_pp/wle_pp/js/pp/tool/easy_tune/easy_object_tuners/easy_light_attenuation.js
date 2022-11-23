WL.registerComponent("pp-easy-light-attenuation", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myUseTuneTarget: { type: WL.Type.Bool, default: false }

}, {
    init: function () {
        this._myEasyObjectTuner = new PP.EasyLightAttenuation(this.object, this._myVariableName, this._mySetAsDefault, this._myUseTuneTarget);
    },
    start: function () {
        this._myEasyObjectTuner.start();
    },
    update: function (dt) {
        this._myEasyObjectTuner.update(dt);
    }
});

PP.EasyLightAttenuation = class EasyLightAttenuation extends PP.EasyObjectTuner {
    constructor(object, variableName, setAsDefault, useTuneTarget) {
        super(object, variableName, setAsDefault, useTuneTarget);
    }

    _getVariableNamePrefix() {
        let nameFirstPart = "Light Attenuation ";
        return nameFirstPart;
    }

    _createEasyTuneVariable(variableName) {
        return new PP.EasyTuneNumber(variableName, this._getDefaultValue(), 0.01, 3, 0, 1);
    }

    _getObjectValue(object) {
        let attenuation = this._getLightAttenuation(object);
        return attenuation;
    }

    _getDefaultValue() {
        return 0;
    }

    _updateObjectValue(object, value) {
        let attenuation = value;

        let light = object.pp_getComponent("light");
        if (light) {
            light.color[3] = attenuation;
        }
    }

    _getLightAttenuation(object) {
        let attenuation = this._getDefaultValue();

        let light = object.pp_getComponent("light");
        if (light) {
            attenuation = light.color[3];
        }

        return attenuation;
    }
};
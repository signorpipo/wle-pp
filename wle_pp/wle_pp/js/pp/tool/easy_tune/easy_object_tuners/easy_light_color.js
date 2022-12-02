WL.registerComponent("pp-easy-light-color", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myUseTuneTarget: { type: WL.Type.Bool, default: false },
    _myColorModel: { type: WL.Type.Enum, values: ['rgb', 'hsv'] }

}, {
    init: function () {
        this._myEasyObjectTuner = new PP.EasyLightColor(this._myColorModel, this.object, this._myVariableName, this._mySetAsDefault, this._myUseTuneTarget);
    },
    start: function () {
        this._myEasyObjectTuner.start();
    },
    update: function (dt) {
        this._myEasyObjectTuner.update(dt);
    }
});

PP.EasyLightColor = class EasyLightColor extends PP.EasyObjectTuner {
    constructor(colorModel, object, variableName, setAsDefault, useTuneTarget) {
        super(object, variableName, setAsDefault, useTuneTarget);
        this._myColorModel = colorModel;
    }

    _getVariableNamePrefix() {
        let nameFirstPart = null;

        if (this._myColorModel == 0) {
            nameFirstPart = "Light RGB ";
        } else {
            nameFirstPart = "Light HSV ";
        }

        return nameFirstPart;
    }

    _createEasyTuneVariable(variableName) {
        return new PP.EasyTuneIntArray(variableName, this._getDefaultValue(), 100, 0, 255);
    }

    _getObjectValue(object) {
        let color = null;

        let lightColor = this._getLightColor(object);
        if (lightColor) {
            if (this._myColorModel == 0) {
                color = PP.ColorUtils.rgbCodeToHuman(lightColor);
            } else {
                color = PP.ColorUtils.hsvCodeToHuman(PP.ColorUtils.rgbToHsv(lightColor));
            }
        } else {
            color = this._getDefaultValue();
        }

        return color;
    }

    _getDefaultValue() {
        return PP.vec3_create();
    }

    _updateObjectValue(object, value) {
        let color = value;

        if (this._myColorModel == 0) {
            color = PP.ColorUtils.rgbHumanToCode(color);
        } else {
            color = PP.ColorUtils.hsvToRgb(PP.ColorUtils.hsvHumanToCode(color));
        }

        let light = object.pp_getComponent("light");
        if (light) {
            light.color[0] = color[0];
            light.color[1] = color[1];
            light.color[2] = color[2];
            light.color[3] = light.color[3];
        }

        if ((PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).isPressStart() && PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).myIsPressed) ||
            (PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).isPressStart() && PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).myIsPressed)) {

            let hsvColor = PP.ColorUtils.color1To255(PP.ColorUtils.rgbToHsv(color));
            let rgbColor = PP.ColorUtils.color1To255(color);

            console.log("RGB:", rgbColor.vec_toString(0), "- HSV:", hsvColor.vec_toString(0));
        }
    }

    _getLightColor(object) {
        let color = null;
        let light = object.pp_getComponent("light");
        if (light) {
            color = light.color.slice(0, 3);
        }

        return color;
    }
};
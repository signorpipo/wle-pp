WL.registerComponent("pp-easy-text-color", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myUseTuneTarget: { type: WL.Type.Bool, default: false },
    _myColorModel: { type: WL.Type.Enum, values: ['rgb', 'hsv'], default: 'hsv' },
    _myColorType: { type: WL.Type.Enum, values: ['color', 'effect color'], default: 'color' }

}, {
    init: function () {
        this._myEasyObjectTuner = new PP.EasyTextColor(this._myColorModel, this._myColorType, this.object, this._myVariableName, this._mySetAsDefault, this._myUseTuneTarget);
    },
    start: function () {
        this._myEasyObjectTuner.start();
    },
    update: function (dt) {
        this._myEasyObjectTuner.update(dt);
    }
});

PP.EasyTextColor = class EasyTextColor extends PP.EasyObjectTuner {
    constructor(colorModel, colorType, object, variableName, setAsDefault, useTuneTarget) {
        super(object, variableName, setAsDefault, useTuneTarget);
        this._myColorModel = colorModel;
        this._myColorType = colorType;
        this._myColorVariableNames = ['color', 'effectColor'];
    }

    _getVariableNamePrefix() {
        let nameFirstPart = null;

        if (this._myColorModel == 0) {
            nameFirstPart = "Text RGB ";
        } else {
            nameFirstPart = "Text HSV ";
        }

        return nameFirstPart;
    }

    _createEasyTuneVariable(variableName) {
        return new PP.EasyTuneIntArray(variableName, this._getDefaultValue(), 100, 0, 255);
    }

    _getObjectValue(object) {
        let color = null;

        let textMaterial = this._getTextMaterial(object);
        if (textMaterial) {
            color = textMaterial[this._myColorVariableNames[this._myColorType]].pp_clone();

            if (this._myColorModel == 0) {
                color = PP.ColorUtils.rgbCodeToHuman(color);
            } else {
                color = PP.ColorUtils.hsvCodeToHuman(PP.ColorUtils.rgbToHsv(color));
            }
        } else {
            color = this._getDefaultValue();
        }

        return color;
    }

    _getDefaultValue() {
        return PP.vec4_create();
    }

    _updateObjectValue(object, value) {
        let color = value;

        if (this._myColorModel == 0) {
            color = PP.ColorUtils.rgbHumanToCode(color);
        } else {
            color = PP.ColorUtils.hsvToRgb(PP.ColorUtils.hsvHumanToCode(color));
        }

        let textMaterial = this._getTextMaterial(object);
        if (textMaterial) {
            textMaterial[this._myColorVariableNames[this._myColorType]] = color;
        }

        if ((PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).isPressStart() && PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).myIsPressed) ||
            (PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).isPressStart() && PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).myIsPressed)) {

            let hsvColor = PP.ColorUtils.color1To255(PP.ColorUtils.rgbToHsv(color));
            let rgbColor = PP.ColorUtils.color1To255(color);

            console.log("RGB:", rgbColor.vec_toString(0), "- HSV:", hsvColor.vec_toString(0));
        }
    }

    _getTextMaterial(object) {
        let material = null;
        let text = object.pp_getComponentHierarchy("text");
        if (text) {
            material = text.material;
        }

        return material;
    }
};
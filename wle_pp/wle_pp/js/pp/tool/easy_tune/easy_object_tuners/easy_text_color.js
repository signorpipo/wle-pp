import { ColorUtils } from "../../../cauldron/utils/color_utils";
import { GamepadButtonID } from "../../../input/gamepad/gamepad_buttons";
import { vec4_create } from "../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../pp/globals";
import { EasyTuneIntArray } from "../easy_tune_variable_types";
import { EasyObjectTuner } from "./easy_object_tuner";

export class EasyTextColor extends EasyObjectTuner {

    constructor(colorModel, colorType, object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);
        this._myColorModel = colorModel;
        this._myColorType = colorType;
        this._myColorVariableNames = ["color", "effectColor"];
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
        return new EasyTuneIntArray(variableName, this._getDefaultValue(), 100, 0, 255);
    }

    _getObjectValue(object) {
        let color = null;

        let textMaterial = this._getTextMaterial(object);
        if (textMaterial) {
            color = textMaterial[this._myColorVariableNames[this._myColorType]].pp_clone();

            if (this._myColorModel == 0) {
                color = ColorUtils.rgbCodeToHuman(color);
            } else {
                color = ColorUtils.hsvCodeToHuman(ColorUtils.rgbToHSV(color));
            }
        } else {
            color = this._getDefaultValue();
        }

        return color;
    }

    _getDefaultValue() {
        return vec4_create();
    }

    _updateObjectValue(object, value) {
        let color = value;

        if (this._myColorModel == 0) {
            color = ColorUtils.rgbHumanToCode(color);
        } else {
            color = ColorUtils.hsvToRGB(ColorUtils.hsvHumanToCode(color));
        }

        let textMaterial = this._getTextMaterial(object);
        if (textMaterial) {
            textMaterial[this._myColorVariableNames[this._myColorType]] = color;
        }

        if ((Globals.getRightGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getLeftGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) ||
            (Globals.getLeftGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getRightGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed())) {

            let hsvColor = ColorUtils.color1To255(ColorUtils.rgbToHSV(color));
            let rgbColor = ColorUtils.color1To255(color);

            console.log("RGB:", rgbColor.vec_toString(0), "- HSV:", hsvColor.vec_toString(0));
        }
    }

    _getTextMaterial(object) {
        let material = null;
        let text = object.pp_getComponent(TextComponent);
        if (text) {
            material = text.material;
        }

        return material;
    }
}
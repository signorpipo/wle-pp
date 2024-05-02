import { TextComponent } from "@wonderlandengine/api";
import { ColorUtils } from "../../../cauldron/utils/color_utils.js";
import { GamepadButtonID } from "../../../input/gamepad/gamepad_buttons.js";
import { vec4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { EasyTuneIntArray } from "../easy_tune_variable_types.js";
import { EasyObjectTuner } from "./easy_object_tuner.js";

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
        return new EasyTuneIntArray(variableName, this._getDefaultValue(), null, true, 100, 0, 255, false, undefined, this._myEngine);
    }

    _getObjectValue(object) {
        let color = null;

        let textMaterial = this._getTextMaterial(object);
        if (textMaterial) {
            color = textMaterial[this._myColorVariableNames[this._myColorType]].pp_clone();

            if (this._myColorModel == 0) {
                color = ColorUtils.colorNormalizedToInt(color);
            } else {
                color = ColorUtils.colorNormalizedToInt(ColorUtils.rgbToHSV(color));
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
            color = ColorUtils.colorIntToNormalized(color);
        } else {
            color = ColorUtils.hsvToRGB(ColorUtils.colorIntToNormalized(color));
        }

        let textMaterial = this._getTextMaterial(object);
        if (textMaterial) {
            textMaterial[this._myColorVariableNames[this._myColorType]] = color;
        }

        if ((Globals.getRightGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getLeftGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) ||
            (Globals.getLeftGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getRightGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed())) {

            let hsvColor = ColorUtils.colorNormalizedToInt(ColorUtils.rgbToHSV(color));
            let rgbColor = ColorUtils.colorNormalizedToInt(color);

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
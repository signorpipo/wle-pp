import { LightComponent } from "@wonderlandengine/api";
import { ColorUtils } from "../../../cauldron/utils/color_utils.js";
import { GamepadButtonID } from "../../../input/gamepad/gamepad_buttons.js";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { EasyTuneIntArray } from "../easy_tune_variable_types.js";
import { EasyObjectTuner } from "./easy_object_tuner.js";

export class EasyLightColor extends EasyObjectTuner {

    constructor(colorModel, object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);
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
        return new EasyTuneIntArray(variableName, this._getDefaultValue(), null, true, 100, 0, 255, false, undefined, this._myEngine);
    }

    _getObjectValue(object) {
        let color = null;

        let lightColor = this._getLightColor(object);
        if (lightColor) {
            if (this._myColorModel == 0) {
                color = ColorUtils.colorNormalizedToInt(lightColor);
            } else {
                color = ColorUtils.colorNormalizedToInt(ColorUtils.rgbToHSV(lightColor));
            }
        } else {
            color = this._getDefaultValue();
        }

        return color;
    }

    _getDefaultValue() {
        return vec3_create();
    }

    _updateObjectValue(object, value) {
        let color = value;

        if (this._myColorModel == 0) {
            color = ColorUtils.colorIntToNormalized(color);
        } else {
            color = ColorUtils.hsvToRGB(ColorUtils.colorIntToNormalized(color));
        }

        let light = object.pp_getComponent(LightComponent);
        if (light != null) {
            light.color[0] = color[0];
            light.color[1] = color[1];
            light.color[2] = color[2];
        }

        if ((Globals.getRightGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getLeftGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) ||
            (Globals.getLeftGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getRightGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed())) {

            let hsvColor = ColorUtils.colorNormalizedToInt(ColorUtils.rgbToHSV(color));
            let rgbColor = ColorUtils.colorNormalizedToInt(color);

            console.log("RGB:", rgbColor.vec_toString(0), "- HSV:", hsvColor.vec_toString(0));
        }
    }

    _getLightColor(object) {
        let color = null;
        let light = object.pp_getComponent(LightComponent);
        if (light) {
            color = light.color.slice(0, 3);
        }

        return color;
    }
}
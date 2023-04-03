import { LightComponent } from "@wonderlandengine/api";
import { ColorUtils } from "../../../cauldron/utils/color_utils";
import { getLeftGamepad, getRightGamepad } from "../../../input/cauldron/input_globals";
import { GamepadButtonID } from "../../../input/gamepad/gamepad_buttons";
import { vec3_create } from "../../../plugin/js/extensions/array_extension";
import { EasyTuneIntArray } from "../easy_tune_variable_types";
import { EasyObjectTuner } from "./easy_object_tuner";

export class EasyLightColor extends EasyObjectTuner {

    constructor(colorModel, object, variableName, setAsDefault, useTuneTarget, engine) {
        super(object, variableName, setAsDefault, useTuneTarget, engine);
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
        return new EasyTuneIntArray(variableName, this._getDefaultValue(), 100, 0, 255);
    }

    _getObjectValue(object) {
        let color = null;

        let lightColor = this._getLightColor(object);
        if (lightColor) {
            if (this._myColorModel == 0) {
                color = ColorUtils.rgbCodeToHuman(lightColor);
            } else {
                color = ColorUtils.hsvCodeToHuman(ColorUtils.rgbToHsv(lightColor));
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
            color = ColorUtils.rgbHumanToCode(color);
        } else {
            color = ColorUtils.hsvToRgb(ColorUtils.hsvHumanToCode(color));
        }

        let light = object.pp_getComponent(LightComponent);
        if (light) {
            light.color[0] = color[0];
            light.color[1] = color[1];
            light.color[2] = color[2];
            light.color[3] = light.color[3];
        }

        if ((getRightGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && getLeftGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).myIsPressed) ||
            (getLeftGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && getRightGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).myIsPressed)) {

            let hsvColor = ColorUtils.color1To255(ColorUtils.rgbToHsv(color));
            let rgbColor = ColorUtils.color1To255(color);

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
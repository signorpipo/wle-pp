import { MeshComponent } from "@wonderlandengine/api";
import { ColorUtils } from "../../../cauldron/utils/color_utils";
import { GamepadButtonID } from "../../../input/gamepad/gamepad_buttons";
import { vec4_create } from "../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../pp/globals";
import { EasyTuneIntArray, EasyTuneNumberArray } from "../easy_tune_variable_types";
import { EasyObjectTuner } from "./easy_object_tuner";

export class EasyMeshColor extends EasyObjectTuner {

    constructor(colorModel, colorType, object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);
        this._myColorModel = colorModel;
        this._myColorType = colorType;
        this._myColorVariableNames = ["color", "diffuseColor", "ambientColor", "specularColor", "emissiveColor", "fogColor", "ambientFactor",];
    }

    _getVariableNamePrefix() {
        let nameFirstPart = null;

        if (this._myColorModel == 0) {
            nameFirstPart = "Mesh RGB ";
        } else {
            nameFirstPart = "Mesh HSV ";
        }

        return nameFirstPart;
    }

    _createEasyTuneVariable(variableName) {
        if (this._myColorType == 6) {
            return new EasyTuneNumberArray(variableName, this._getDefaultValue(), null, true, 3, 0.1, 0, 1);
        }
        return new EasyTuneIntArray(variableName, this._getDefaultValue(), null, true, 100, 0, 255);
    }

    _getObjectValue(object) {
        let color = null;

        let meshMaterial = this._getMeshMaterial(object);
        if (meshMaterial) {
            if (this._myColorType != 6) {
                color = meshMaterial[this._myColorVariableNames[this._myColorType]].pp_clone();

                if (this._myColorModel == 0) {
                    color = ColorUtils.rgbCodeToHuman(color);
                } else {
                    color = ColorUtils.hsvCodeToHuman(ColorUtils.rgbToHSV(color));
                }
            } else {
                color = [meshMaterial[this._myColorVariableNames[this._myColorType]]];
            }
        } else {
            color = this._getDefaultValue();
        }

        return color;
    }

    _getDefaultValue() {
        if (this._myColorType == 6) {
            return [0];
        }

        return vec4_create();
    }

    _updateObjectValue(object, value) {
        let color = value;

        if (this._myColorType != 6) {
            if (this._myColorModel == 0) {
                color = ColorUtils.rgbHumanToCode(color);
            } else {
                color = ColorUtils.hsvToRGB(ColorUtils.hsvHumanToCode(color));
            }
        }

        let meshMaterial = this._getMeshMaterial(object);
        if (meshMaterial) {
            meshMaterial[this._myColorVariableNames[this._myColorType]] = color;
        }

        if (this._myColorType != 6) {
            if ((Globals.getRightGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getLeftGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) ||
                (Globals.getLeftGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getRightGamepad(this._myEngine).getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed())) {

                let hsvColor = ColorUtils.color1To255(ColorUtils.rgbToHSV(color));
                let rgbColor = ColorUtils.color1To255(color);

                console.log("RGB:", rgbColor.vec_toString(0), "- HSV:", hsvColor.vec_toString(0));
            }
        }
    }

    _getMeshMaterial(object) {
        let material = null;
        let mesh = object.pp_getComponent(MeshComponent);
        if (mesh) {
            material = mesh.material;
        }

        return material;
    }
}
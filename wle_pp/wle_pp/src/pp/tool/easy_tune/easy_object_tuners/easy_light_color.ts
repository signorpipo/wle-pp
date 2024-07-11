import { LightComponent, Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { Vector3 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { ColorModel, ColorUtils } from "../../../cauldron/utils/color_utils.js";
import { GamepadButtonID } from "../../../input/gamepad/gamepad_buttons.js";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { EasyTuneIntArray } from "../easy_tune_variable_types.js";
import { EasyObjectTuner } from "./easy_object_tuner.js";

export class EasyLightColor extends EasyObjectTuner<Vector3, EasyTuneIntArray> {

    private _myColorModel: ColorModel;

    constructor(colorModel: ColorModel, object: Object3D, variableName: string, setAsWidgetCurrentVariable: boolean, useTuneTarget: boolean, engine?: Readonly<WonderlandEngine>) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);

        this._myColorModel = colorModel;
    }

    protected override _getVariableNamePrefix(): string {
        let nameFirstPart = null;

        if (this._myColorModel == ColorModel.RGB) {
            nameFirstPart = "Light RGB ";
        } else {
            nameFirstPart = "Light HSV ";
        }

        return nameFirstPart;
    }

    protected override _createEasyTuneVariable(variableName: string): EasyTuneIntArray {
        return new EasyTuneIntArray(variableName, this._getDefaultValue(), null, true, 100, 0, 255, false, undefined, this._myEngine);
    }

    protected override _getObjectValue(object: Readonly<Object3D>): Readonly<Vector3> {
        let color = null;

        const lightColor = this._getLightColor(object);
        if (lightColor) {
            if (this._myColorModel == ColorModel.RGB) {
                color = ColorUtils.colorNormalizedToInt(lightColor);
            } else {
                color = ColorUtils.colorNormalizedToInt(ColorUtils.rgbToHSV(lightColor));
            }
        } else {
            color = this._getDefaultValue();
        }

        return color;
    }

    protected override _getDefaultValue(): Readonly<Vector3> {
        return vec3_create();
    }

    protected override _areValueEqual(first: Readonly<Vector3>, second: Readonly<Vector3>): boolean {
        return first.vec_equals(second);
    }

    protected override _updateObjectValue(object: Object3D, value: Readonly<Vector3>): void {
        let color = value;

        if (this._myColorModel == 0) {
            color = ColorUtils.colorIntToNormalized(color);
        } else {
            color = ColorUtils.hsvToRGB(ColorUtils.colorIntToNormalized(color));
        }

        const light = object.pp_getComponent(LightComponent);
        if (light != null) {
            light.color[0] = color[0];
            light.color[1] = color[1];
            light.color[2] = color[2];
        }

        if ((Globals.getRightGamepad(this._myEngine)!.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getLeftGamepad(this._myEngine)!.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) ||
            (Globals.getLeftGamepad(this._myEngine)!.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getRightGamepad(this._myEngine)!.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed())) {

            const hsvColor = ColorUtils.colorNormalizedToInt(ColorUtils.rgbToHSV(color));
            const rgbColor = ColorUtils.colorNormalizedToInt(color);

            console.log("RGB:", rgbColor.vec_toString(0), "- HSV:", hsvColor.vec_toString(0));
        }
    }

    private _getLightColor(object: Readonly<Object3D>): Readonly<Vector3> | null {
        let color = null;

        const light = object.pp_getComponent(LightComponent);
        if (light != null) {
            color = light.color.slice();
        }

        return color;
    }
}
import { Material, Object3D, TextComponent, WonderlandEngine } from "@wonderlandengine/api";
import { Vector4 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { ColorModel, ColorUtils } from "../../../cauldron/utils/color_utils.js";
import { GamepadButtonID } from "../../../input/gamepad/gamepad_buttons.js";
import { vec4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { EasyTuneIntArray } from "../easy_tune_variable_types.js";
import { EasyObjectTuner } from "./easy_object_tuner.js";

export enum EasyTextColorColorType {
    COLOR,
    EFFECT_COLOR
}

export class EasyTextColor extends EasyObjectTuner<Vector4, EasyTuneIntArray> {

    private _myColorModel: ColorModel;
    private _myColorType: EasyTextColorColorType;

    private static readonly _myColorVariableNames: Record<EasyTextColorColorType, string> = {
        [EasyTextColorColorType.COLOR]: "color",
        [EasyTextColorColorType.EFFECT_COLOR]: "effectColor"
    };

    constructor(colorModel: ColorModel, colorType: EasyTextColorColorType, object: Object3D, variableName: string, setAsWidgetCurrentVariable: boolean, useTuneTarget: boolean, engine?: Readonly<WonderlandEngine>) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);

        this._myColorModel = colorModel;
        this._myColorType = colorType;
    }

    protected override _getVariableNamePrefix(): string {
        let nameFirstPart = null;

        if (this._myColorModel == ColorModel.RGB) {
            nameFirstPart = "Text RGB ";
        } else {
            nameFirstPart = "Text HSV ";
        }

        return nameFirstPart;
    }

    protected override _createEasyTuneVariable(variableName: string): EasyTuneIntArray {
        return new EasyTuneIntArray(variableName, this._getDefaultValue(), null, true, 100, 0, 255, false, undefined, this._myEngine);
    }

    protected override _getObjectValue(object: Readonly<Object3D>): Readonly<Vector4> {
        let color = null;

        const textMaterial: Record<string, Vector4> = this._getMeshMaterial(object) as unknown as Record<string, Vector4>;
        if (textMaterial != null) {
            color = textMaterial[EasyTextColor._myColorVariableNames[this._myColorType]].pp_clone();

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

    protected override _getDefaultValue(): Readonly<Vector4> {
        return vec4_create();
    }

    protected override _areValueEqual(first: Readonly<Vector4>, second: Readonly<Vector4>): boolean {
        return first.vec_equals(second);
    }

    protected override _updateObjectValue(object: Object3D, value: Readonly<Vector4>): void {
        let color = value;

        if (this._myColorModel == 0) {
            color = ColorUtils.colorIntToNormalized(color);
        } else {
            color = ColorUtils.hsvToRGB(ColorUtils.colorIntToNormalized(color));
        }

        const textMaterial: Record<string, Vector4> = this._getMeshMaterial(object) as unknown as Record<string, Vector4>;
        if (textMaterial != null) {
            textMaterial[EasyTextColor._myColorVariableNames[this._myColorType]] = color;
        }

        if ((Globals.getRightGamepad(this._myEngine)!.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getLeftGamepad(this._myEngine)!.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) ||
            (Globals.getLeftGamepad(this._myEngine)!.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && Globals.getRightGamepad(this._myEngine)!.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed())) {

            const hsvColor = ColorUtils.colorNormalizedToInt(ColorUtils.rgbToHSV(color));
            const rgbColor = ColorUtils.colorNormalizedToInt(color);

            console.log("RGB:", rgbColor.vec_toString(0), "- HSV:", hsvColor.vec_toString(0));
        }
    }

    private _getMeshMaterial(object: Readonly<Object3D>): Material | null {
        let material = null;
        const text = object.pp_getComponent(TextComponent);
        if (text != null) {
            material = text.material;
        }

        return material;
    }
}
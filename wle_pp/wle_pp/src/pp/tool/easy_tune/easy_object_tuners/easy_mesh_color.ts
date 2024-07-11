import { Material, MeshComponent, Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { Vector4 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { ColorModel, ColorUtils } from "../../../cauldron/utils/color_utils.js";
import { GamepadButtonID } from "../../../input/gamepad/gamepad_buttons.js";
import { vec4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { EasyTuneIntArray } from "../easy_tune_variable_types.js";
import { EasyObjectTuner } from "./easy_object_tuner.js";

export enum EasyMeshColorColorType {
    COLOR,
    DIFFUSE_COLOR,
    AMBIENT_COLOR,
    SPECULAR_COLOR,
    EMISSIVE_COLOR,
    FOG_COLOR
}

export class EasyMeshColor extends EasyObjectTuner<Vector4, EasyTuneIntArray> {

    private _myColorModel: ColorModel;
    private _myColorType: EasyMeshColorColorType;

    private static readonly _myColorVariableNames: Record<EasyMeshColorColorType, string> = {
        [EasyMeshColorColorType.COLOR]: "color",
        [EasyMeshColorColorType.DIFFUSE_COLOR]: "diffuseColor",
        [EasyMeshColorColorType.AMBIENT_COLOR]: "ambientColor",
        [EasyMeshColorColorType.SPECULAR_COLOR]: "specularColor",
        [EasyMeshColorColorType.EMISSIVE_COLOR]: "emissiveColor",
        [EasyMeshColorColorType.FOG_COLOR]: "fogColor"
    };

    constructor(colorModel: ColorModel, colorType: EasyMeshColorColorType, object: Object3D, variableName: string, setAsWidgetCurrentVariable: boolean, useTuneTarget: boolean, engine?: Readonly<WonderlandEngine>) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);

        this._myColorModel = colorModel;
        this._myColorType = colorType;
    }

    protected override _getVariableNamePrefix(): string {
        let nameFirstPart = null;

        if (this._myColorModel == ColorModel.RGB) {
            nameFirstPart = "Mesh RGB ";
        } else {
            nameFirstPart = "Mesh HSV ";
        }

        return nameFirstPart;
    }

    protected override _createEasyTuneVariable(variableName: string): EasyTuneIntArray {
        return new EasyTuneIntArray(variableName, this._getDefaultValue(), null, true, 100, 0, 255, false, undefined, this._myEngine);
    }

    protected override _getObjectValue(object: Readonly<Object3D>): Readonly<Vector4> {
        let color = null;

        const meshMaterial: Record<string, Vector4> = this._getMeshMaterial(object) as unknown as Record<string, Vector4>;
        if (meshMaterial != null) {
            color = meshMaterial[EasyMeshColor._myColorVariableNames[this._myColorType]].pp_clone();

            if (this._myColorModel == ColorModel.RGB) {
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

        const meshMaterial: Record<string, Vector4> = this._getMeshMaterial(object) as unknown as Record<string, Vector4>;
        if (meshMaterial) {
            meshMaterial[EasyMeshColor._myColorVariableNames[this._myColorType]] = color;
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
        const mesh = object.pp_getComponent(MeshComponent);
        if (mesh != null) {
            material = mesh.material;
        }

        return material;
    }
}
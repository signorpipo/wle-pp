import { Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { Matrix4 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { mat4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { EasyTuneTransform } from "../easy_tune_variable_types.js";
import { EasyObjectTuner } from "./easy_object_tuner.js";

export class EasyTransform extends EasyObjectTuner<Matrix4, EasyTuneTransform> {

    private _myLocal: boolean;
    private _myScaleAsOne: boolean;
    private _myPositionStepPerSecond: number;
    private _myRotationStepPerSecond: number;
    private _myScaleStepPerSecond: number;

    constructor(local: boolean, scaleAsOne: boolean, positionStepPerSecond: number, rotationStepPerSecond: number, scaleStepPerSecond: number, object: Object3D, variableName: string, setAsWidgetCurrentVariable: boolean, useTuneTarget: boolean, engine?: Readonly<WonderlandEngine>) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);

        this._myLocal = local;
        this._myScaleAsOne = scaleAsOne;
        this._myPositionStepPerSecond = positionStepPerSecond;
        this._myRotationStepPerSecond = rotationStepPerSecond;
        this._myScaleStepPerSecond = scaleStepPerSecond;
    }

    protected override _getVariableNamePrefix(): string {
        return "Transform ";
    }

    protected override _createEasyTuneVariable(variableName: string): EasyTuneTransform {
        return new EasyTuneTransform(variableName, this._getDefaultValue(), null, true, this._myScaleAsOne, 3, this._myPositionStepPerSecond, this._myRotationStepPerSecond, this._myScaleStepPerSecond, undefined, this._myEngine);
    }

    protected override _getObjectValue(object: Readonly<Object3D>): Readonly<Matrix4> {
        return this._myLocal ? object.pp_getTransformLocal() : object.pp_getTransform();
    }

    protected override _getDefaultValue(): Readonly<Matrix4> {
        return mat4_create();
    }

    protected override _areValueEqual(first: Readonly<Matrix4>, second: Readonly<Matrix4>): boolean {
        return first.vec_equals(second);
    }

    protected override _updateObjectValue(object: Object3D, value: Readonly<Matrix4>): void {
        if (this._myLocal) {
            object.pp_setTransformLocal(value);
        } else {
            object.pp_setTransform(value);
        }
    }
}
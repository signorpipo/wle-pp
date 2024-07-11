import { Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { Vector3 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { EasyTuneNumberArray } from "../easy_tune_variable_types.js";
import { EasyObjectTuner } from "./easy_object_tuner.js";

export class EasyScale extends EasyObjectTuner<Vector3, EasyTuneNumberArray> {

    private _myLocal: boolean;
    private _myScaleAsOne: boolean;
    private _myStepPerSecond: number;

    constructor(local: boolean, scaleAsOne: boolean, stepPerSecond: number, object: Object3D, variableName: string, setAsWidgetCurrentVariable: boolean, useTuneTarget: boolean, engine?: Readonly<WonderlandEngine>) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);

        this._myLocal = local;
        this._myScaleAsOne = scaleAsOne;
        this._myStepPerSecond = stepPerSecond;
    }

    protected override _getVariableNamePrefix(): string {
        return "Scale ";
    }

    protected override _createEasyTuneVariable(variableName: string): EasyTuneNumberArray {
        return new EasyTuneNumberArray(variableName, this._getDefaultValue(), null, true, 3, this._myStepPerSecond, 0.001, undefined, this._myScaleAsOne, undefined, this._myEngine);
    }

    protected override _getObjectValue(object: Readonly<Object3D>): Readonly<Vector3> {
        return this._myLocal ? object.pp_getScaleLocal() : object.pp_getScale();
    }

    protected override _getDefaultValue(): Readonly<Vector3> {
        return vec3_create(1, 1, 1);
    }

    protected override _areValueEqual(first: Readonly<Vector3>, second: Readonly<Vector3>): boolean {
        return first.vec_equals(second);
    }

    protected override _updateObjectValue(object: Object3D, value: Readonly<Vector3>): void {
        if (this._myLocal) {
            object.pp_setScaleLocal(value);
        } else {
            object.pp_setScale(value);
        }
    }
}
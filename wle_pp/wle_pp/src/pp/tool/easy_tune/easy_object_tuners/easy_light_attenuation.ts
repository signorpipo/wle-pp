import { LightComponent, Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { EasyTuneNumber } from "../easy_tune_variable_types.js";
import { EasyObjectTuner } from "./easy_object_tuner.js";

export class EasyLightAttenuation extends EasyObjectTuner<number, EasyTuneNumber> {

    constructor(object: Object3D, variableName: string, setAsWidgetCurrentVariable: boolean, useTuneTarget: boolean, engine?: Readonly<WonderlandEngine>) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);
    }

    protected override _getVariableNamePrefix(): string {
        return "Light Attenuation ";
    }

    protected override _createEasyTuneVariable(variableName: string): EasyTuneNumber {
        return new EasyTuneNumber(variableName, this._getDefaultValue(), null, true, 3, 0.01, 0, 1, undefined, this._myEngine);
    }

    protected override _getObjectValue(object: Readonly<Object3D>): Readonly<number> {
        let attenuation = this._getDefaultValue();

        const light = object.pp_getComponent(LightComponent);
        if (light != null) {
            attenuation = light.color[3];
        }

        return attenuation;
    }

    protected override _getDefaultValue(): Readonly<number> {
        return 0;
    }

    protected override _areValueEqual(first: Readonly<number>, second: Readonly<number>): boolean {
        return first == second;
    }

    protected override _updateObjectValue(object: Object3D, value: Readonly<number>): void {
        const attenuation = value;

        const light = object.pp_getComponent(LightComponent);
        if (light) {
            light.color[3] = attenuation;
        }
    }
}
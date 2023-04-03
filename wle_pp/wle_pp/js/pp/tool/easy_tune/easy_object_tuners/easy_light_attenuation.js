import { LightComponent } from "@wonderlandengine/api";
import { EasyTuneNumber } from "../easy_tune_variable_types";
import { EasyObjectTuner } from "./easy_object_tuner";

export class EasyLightAttenuation extends EasyObjectTuner {

    constructor(object, variableName, setAsDefault, useTuneTarget) {
        super(object, variableName, setAsDefault, useTuneTarget);
    }

    _getVariableNamePrefix() {
        let nameFirstPart = "Light Attenuation ";
        return nameFirstPart;
    }

    _createEasyTuneVariable(variableName) {
        return new EasyTuneNumber(variableName, this._getDefaultValue(), 0.01, 3, 0, 1);
    }

    _getObjectValue(object) {
        let attenuation = this._getLightAttenuation(object);
        return attenuation;
    }

    _getDefaultValue() {
        return 0;
    }

    _updateObjectValue(object, value) {
        let attenuation = value;

        let light = object.pp_getComponent(LightComponent);
        if (light) {
            light.color[3] = attenuation;
        }
    }

    _getLightAttenuation(object) {
        let attenuation = this._getDefaultValue();

        let light = object.pp_getComponent(LightComponent);
        if (light) {
            attenuation = light.color[3];
        }

        return attenuation;
    }
}
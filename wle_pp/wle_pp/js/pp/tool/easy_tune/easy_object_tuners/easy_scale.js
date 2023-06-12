import { vec3_create } from "../../../plugin/js/extensions/array_extension";
import { EasyTuneNumberArray } from "../easy_tune_variable_types";
import { EasyObjectTuner } from "./easy_object_tuner";

export class EasyScale extends EasyObjectTuner {

    constructor(local, scaleAsOne, object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);
        this._myLocal = local;
        this._myScaleAsOne = scaleAsOne;
    }

    _getVariableNamePrefix() {
        return "Scale ";
    }

    _createEasyTuneVariable(variableName) {
        return new EasyTuneNumberArray(variableName, this._getDefaultValue(), 3, 1, 0.001, null, this._myScaleAsOne);
    }

    _getObjectValue(object) {
        return this._myLocal ? object.pp_getScaleLocal() : object.pp_getScale();
    }

    _getDefaultValue() {
        return vec3_create(1, 1, 1);
    }

    _updateObjectValue(object, value) {
        if (this._myLocal) {
            object.pp_setScaleLocal(value);
        } else {
            object.pp_setScale(value);
        }
    }
}
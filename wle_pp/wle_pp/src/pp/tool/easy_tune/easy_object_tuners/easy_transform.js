import { mat4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { EasyTuneTransform } from "../easy_tune_variable_types.js";
import { EasyObjectTuner } from "./easy_object_tuner.js";

export class EasyTransform extends EasyObjectTuner {

    constructor(local, scaleAsOne, object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);
        this._myLocal = local;
        this._myScaleAsOne = scaleAsOne;
    }

    _getVariableNamePrefix() {
        return "Transform ";
    }

    _createEasyTuneVariable(variableName) {
        return new EasyTuneTransform(variableName, this._getDefaultValue(), null, true, this._myScaleAsOne, 3, undefined, this._myEngine);
    }

    _getObjectValue(object) {
        return this._myLocal ? object.pp_getTransformLocal() : object.pp_getTransform();
    }

    _getDefaultValue() {
        return mat4_create();
    }

    _updateObjectValue(object, value) {
        if (this._myLocal) {
            object.pp_setTransformLocal(value);
        } else {
            object.pp_setTransform(value);
        }
    }
}
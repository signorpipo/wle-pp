import { mat4_create } from "../../../plugin/js/extensions/array_extension";
import { EasyTuneTransform } from "../easy_tune_variable_types";
import { EasyObjectTuner } from "./easy_object_tuner";

export class EasyTransform extends EasyObjectTuner {

    constructor(isLocal, scaleAsOne, object, variableName, setAsDefault, useTuneTarget, engine) {
        super(object, variableName, setAsDefault, useTuneTarget, engine);
        this._myIsLocal = isLocal;
        this._myScaleAsOne = scaleAsOne;
    }

    _getVariableNamePrefix() {
        return "Transform ";
    }

    _createEasyTuneVariable(variableName) {
        return new EasyTuneTransform(variableName, this._getDefaultValue(), this._myScaleAsOne);
    }

    _getObjectValue(object) {
        return this._myIsLocal ? object.pp_getTransformLocal() : object.pp_getTransform();
    }

    _getDefaultValue() {
        return mat4_create();
    }

    _updateObjectValue(object, value) {
        if (this._myIsLocal) {
            object.pp_setTransformLocal(value);
        } else {
            object.pp_setTransform(value);
        }
    }
}
import { getMainEngine } from "../../../cauldron/wl/engine_globals";
import { getEasyTuneTarget, getEasyTuneVariables } from "../easy_tune_globals";
import { EasyTuneUtils } from "../easy_tune_utils";

export class EasyObjectTuner {

    constructor(object, variableName, setAsDefault, useTuneTarget, engine = getMainEngine()) {
        this._myObject = object;
        this._myUseTuneTarget = useTuneTarget;
        this._mySetAsDefault = setAsDefault;

        this._myEasyObject = this._myObject;
        if (this._myUseTuneTarget) {
            this._myEasyObject = getEasyTuneTarget(engine);
        }
        this._myPrevEasyObject = null;

        let variableNamePrefix = this._getVariableNamePrefix();

        if (variableName == "") {
            this._myEasyTuneVariableName = variableNamePrefix.concat(this._myObject.pp_getID());
        } else {
            this._myEasyTuneVariableName = variableNamePrefix.concat(variableName);
        }

        this._myEngine = engine;
    }

    start() {
        let easyTuneVariable = this._createEasyTuneVariable(this._myEasyTuneVariableName);

        getEasyTuneVariables(this._myEngine).add(easyTuneVariable);
        if (this._mySetAsDefault) {
            EasyTuneUtils.setEasyTuneWidgetActiveVariable(this._myEasyTuneVariableName, this._myEngine);
        }
    }

    update(dt) {
        if (getEasyTuneVariables(this._myEngine).isActive(this._myEasyTuneVariableName)) {
            if (this._myUseTuneTarget) {
                this._myEasyObject = getEasyTuneTarget(engine);
            }

            if (this._myPrevEasyObject != this._myEasyObject) {
                this._myPrevEasyObject = this._myEasyObject;
                if (this._myEasyObject) {
                    let value = this._getObjectValue(this._myEasyObject);
                    getEasyTuneVariables(this._myEngine).set(this._myEasyTuneVariableName, value, true);
                } else {
                    let value = this._getDefaultValue();
                    getEasyTuneVariables(this._myEngine).set(this._myEasyTuneVariableName, value, true);
                }
            }

            if (this._myEasyObject) {
                this._updateObjectValue(this._myEasyObject, getEasyTuneVariables(this._myEngine).get(this._myEasyTuneVariableName));
            }
        }
    }

    updateVariableValue(value) {
        getEasyTuneVariables(this._myEngine).set(this._myEasyTuneVariableName, value);
    }
}
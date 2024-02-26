import { Globals } from "../../../pp/globals.js";
import { EasyTuneUtils } from "../easy_tune_utils.js";

export class EasyObjectTuner {

    constructor(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine = Globals.getMainEngine()) {
        this._myObject = object;
        this._myUseTuneTarget = useTuneTarget;
        this._mySetAsWidgetCurrentVariable = setAsWidgetCurrentVariable;

        this._myEasyObject = this._myObject;
        if (this._myUseTuneTarget) {
            this._myEasyObject = Globals.getEasyTuneTarget(engine);
        }
        this._myPrevEasyObject = null;

        let variableNamePrefix = this._getVariableNamePrefix();

        if (variableName == "") {
            let objectName = this._myObject.pp_getName();
            if (objectName != "") {
                this._myEasyTuneVariableName = variableNamePrefix.concat(objectName);
            } else {
                this._myEasyTuneVariableName = variableNamePrefix.concat(this._myObject.pp_getID());
            }
        } else {
            this._myEasyTuneVariableName = variableNamePrefix.concat(variableName);
        }

        this._myEngine = engine;
    }

    start() {
        let easyTuneVariable = this._createEasyTuneVariable(this._myEasyTuneVariableName);

        Globals.getEasyTuneVariables(this._myEngine).add(easyTuneVariable);
        if (this._mySetAsWidgetCurrentVariable) {
            EasyTuneUtils.setWidgetCurrentVariable(this._myEasyTuneVariableName, this._myEngine);
        }
    }

    update(dt) {
        if (Globals.getEasyTuneVariables(this._myEngine).isWidgetCurrentVariable(this._myEasyTuneVariableName)) {
            if (this._myUseTuneTarget) {
                this._myEasyObject = Globals.getEasyTuneTarget(this._myEngine);
            }

            if (this._myPrevEasyObject != this._myEasyObject) {
                this._myPrevEasyObject = this._myEasyObject;
                if (this._myEasyObject) {
                    let value = this._getObjectValue(this._myEasyObject);
                    Globals.getEasyTuneVariables(this._myEngine).set(this._myEasyTuneVariableName, value, true);
                } else {
                    let value = this._getDefaultValue();
                    Globals.getEasyTuneVariables(this._myEngine).set(this._myEasyTuneVariableName, value, true);
                }
            }

            if (this._myEasyObject) {
                this._updateObjectValue(this._myEasyObject, Globals.getEasyTuneVariables(this._myEngine).get(this._myEasyTuneVariableName));
            }
        }
    }
}
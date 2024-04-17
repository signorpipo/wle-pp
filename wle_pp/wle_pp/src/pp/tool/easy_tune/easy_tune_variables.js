export class EasyTuneVariables {

    constructor() {
        this._myVariables = new Map();
    }

    add(variable, overwriteCurrentOne = false) {
        if (overwriteCurrentOne || !this._myVariables.has(variable.getName())) {
            this._myVariables.set(variable.getName(), variable);
        }
    }

    remove(variableName) {
        this._myVariables.delete(variableName);
    }

    get(variableName) {
        let variable = this._myVariables.get(variableName);
        if (variable) {
            return variable.getValue();
        }

        return null;
    }

    set(variableName, value, resetDefaultValue = false) {
        let variable = this._myVariables.get(variableName);
        if (variable) {
            variable.setValue(value, resetDefaultValue);
        }
    }

    has(variableName) {
        return this._myVariables.has(variableName);
    }

    length() {
        return this._myVariables.size;
    }

    isWidgetCurrentVariable(variableName) {
        let variable = this._myVariables.get(variableName);
        if (variable) {
            return variable.isWidgetCurrentVariable();
        }

        return false;
    }

    getEasyTuneVariable(variableName) {
        return this._myVariables.get(variableName);
    }

    getEasyTuneVariablesList() {
        return Array.from(this._myVariables.values());
    }

    getEasyTuneVariablesNames() {
        return Array.from(this._myVariables.keys());
    }

    fromJSON(json, resetDefaultValue = false, manualImport = false) {
        let objectJSON = JSON.parse(json);

        for (let variable of this._myVariables.values()) {
            if ((variable.isManualImportEnabled() && manualImport) || (variable.isAutoImportEnabled() && !manualImport)) {
                let variableName = variable.getName();
                if (Object.hasOwn(objectJSON, variableName)) {
                    let variableValueJSON = objectJSON[variableName];
                    variable.fromJSON(variableValueJSON, resetDefaultValue);
                }
            }
        }
    }

    toJSON() {
        let objectJSON = {};

        for (let variable of this._myVariables.values()) {
            if (variable.isExportEnabled()) {
                objectJSON[variable.getName()] = variable.toJSON();
            }
        }

        return JSON.stringify(objectJSON);
    }

    registerValueChangedEventListener(variableName, callbackID, callback) {
        this._myVariables.get(variableName).registerValueChangedEventListener(callbackID, callback);
    }

    unregisterValueChangedEventListener(variableName, callbackID, callback) {
        this._myVariables.get(variableName).unregisterValueChangedEventListener(callbackID);
    }
}
PP.EasyTuneVariables = class EasyTuneVariables {
    constructor() {
        this._myMap = new Map();
    }

    add(variable) {
        this._myMap.set(variable.myName, variable);
    }

    remove(variableName) {
        this._myMap.delete(variableName);
    }

    get(variableName) {
        let variable = this._myMap.get(variableName);
        if (variable) {
            return variable.getValue();
        }

        return null;
    }

    set(variableName, value, resetDefaultValue = false) {
        let variable = this._myMap.get(variableName);
        if (variable) {
            variable.setValue(value, resetDefaultValue);
        }
    }

    isActive(variableName) {
        let variable = this._myMap.get(variableName);
        if (variable) {
            return variable.myIsActive;
        }

        return false;
    }

    getEasyTuneVariable(variableName) {
        return this._myMap.get(variableName);
    }

    fromJSON(json, resetDefaultValue = false) {
        let objectJSON = JSON.parse(json);

        for (let variable of this._myMap.values()) {
            let variableValueJSON = objectJSON[variable.myName];
            if (variableValueJSON !== undefined) {
                variable.fromJSON(variableValueJSON, resetDefaultValue);
            }
        }
    }

    toJSON() {
        let objectJSON = {};

        for (let variable of this._myMap.values()) {
            objectJSON[variable.myName] = variable.toJSON();
        }

        return JSON.stringify(objectJSON);
    }

    registerValueChangedEventListener(variableName, callbackID, callback) {
        this._myMap.get(variableName).registerValueChangedEventListener(callbackID, callback);
    }

    unregisterValueChangedEventListener(variableName, callbackID, callback) {
        this._myMap.get(variableName).unregisterValueChangedEventListener(callbackID);
    }

    _getInternalMap() {
        return this._myMap;
    }
};
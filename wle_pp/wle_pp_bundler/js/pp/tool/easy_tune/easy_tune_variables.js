//Variable Map
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

    set(variableName, value, resetInitialValue = false) {
        let variable = this._myMap.get(variableName);
        if (variable) {
            variable.setValue(value, resetInitialValue);
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

    _getInternalMap() {
        return this._myMap;
    }

    registerValueChangedEventListener(variableName, callbackID, callback) {
        this._myMap.get(variableName).registerValueChangedEventListener(callbackID, callback);
    }

    unregisterValueChangedEventListener(variableName, callbackID, callback) {
        this._myMap.get(variableName).unregisterValueChangedEventListener(callbackID);
    }
};

//Variable Types
PP.EasyTuneVariableType = {
    NONE: 0,
    NUMBER: 1,
    BOOL: 2,
    EASY_TRANSFORM: 3
};

PP.EasyTuneVariable = class EasyTuneVariable {
    constructor(name, type) {
        this.myName = name.slice(0);
        this.myType = type;

        this.myValue = null;
        this.myInitialValue = null;

        this.myIsActive = false;

        this._myValueChangedCallbacks = new Map();      // Signature: callback(name, value)
    }

    getValue() {
        return this.myValue;
    }

    setValue(value, resetInitialValue = false) {
        let oldValue = this.myValue;
        this.myValue = value;

        if (resetInitialValue) {
            PP.EasyTuneVariable.prototype.setInitialValue.call(this, value);
        }

        PP.refreshEasyTuneWidget();

        if (oldValue != value) {
            this._triggerValueChangedCallback();
        }
    }

    setInitialValue(value) {
        this.myInitialValue = value;
    }

    registerValueChangedEventListener(id, callback) {
        this._myValueChangedCallbacks.set(id, callback);
    }

    unregisterValueChangedEventListener(id) {
        this._myValueChangedCallbacks.delete(id);
    }

    _triggerValueChangedCallback() {
        if (this._myValueChangedCallbacks.size > 0) {
            this._myValueChangedCallbacks.forEach(function (callback) { callback(this.myName, this.getValue()); }.bind(this));
        }
    }
};

PP.EasyTuneVariableArray = class EasyTuneVariableArray extends PP.EasyTuneVariable {
    constructor(name, type, value) {
        super(name, type);

        PP.EasyTuneVariableArray.prototype.setValue.call(this, value, true);
    }

    getValue() {
        return this.myValue.slice(0);
    }

    setValue(value, resetInitialValue = false) {
        let oldValue = this.myValue;
        this.myValue = value.slice(0);

        if (resetInitialValue) {
            PP.EasyTuneVariableArray.prototype.setInitialValue.call(this, value);
        }

        PP.refreshEasyTuneWidget();

        if (oldValue == null || !oldValue.pp_equals(value)) {
            this._triggerValueChangedCallback();
        }
    }

    setInitialValue(value) {
        this.myInitialValue = value.slice(0);
    }
};

//NUMBER

PP.EasyTuneNumberArray = class EasyTuneNumberArray extends PP.EasyTuneVariableArray {
    constructor(name, value, stepPerSecond, decimalPlaces, min = null, max = null, editAllValuesTogether = false) {
        super(name, PP.EasyTuneVariableType.NUMBER, value);

        this.myDecimalPlaces = decimalPlaces;
        this.myStepPerSecond = stepPerSecond;

        this.myInitialStepPerSecond = this.myStepPerSecond;

        this.myMin = min;
        this.myMax = max;

        this.myEditAllValuesTogether = editAllValuesTogether;

        this._clampValue(true);
    }

    setMax(max) {
        this.myMax = max;
        this._clampValue(false);
    }

    setMin(min) {
        this.myMin = min;
        this._clampValue(false);
    }

    _clampValue(resetInitialValue) {
        let clampedValue = this.myValue.vec_clamp(this.myMin, this.myMax);

        if (!resetInitialValue) {
            let clampedInitialValue = this.myInitialValue.vec_clamp(this.myMin, this.myMax);
            let initialValueChanged = !clampedInitialValue.vec_equals(this.myInitialValue);
            if (initialValueChanged) {
                PP.EasyTuneVariableArray.prototype.setInitialValue.call(this, clampedInitialValue);
            }
        }

        PP.EasyTuneVariableArray.prototype.setValue.call(this, clampedValue, resetInitialValue);
    }
};

PP.EasyTuneNumber = class EasyTuneNumber extends PP.EasyTuneNumberArray {
    constructor(name, value, stepPerSecond, decimalPlaces, min, max) {
        super(name, [value], stepPerSecond, decimalPlaces, min, max);
    }

    getValue() {
        return this.myValue[0];
    }

    setValue(value, resetInitialValue = false) {
        super.setValue([value], resetInitialValue);
    }

    setInitialValue(value) {
        super.setValue([value]);
    }
};

PP.EasyTuneInt = class EasyTuneInt extends PP.EasyTuneNumber {
    constructor(name, value, stepPerSecond, min, max) {
        super(name, value, stepPerSecond, 0, min, max);
    }
};

PP.EasyTuneIntArray = class EasyTuneIntArray extends PP.EasyTuneNumberArray {
    constructor(name, value, stepPerSecond, min, max) {
        let tempValue = value.slice(0);

        for (let i = 0; i < value.length; i++) {
            tempValue[i] = Math.round(tempValue[i]);
        }

        super(name, tempValue, stepPerSecond, 0, Math.round(min), Math.round(max));
    }
};

//BOOL

PP.EasyTuneBoolArray = class EasyTuneBoolArray extends PP.EasyTuneVariableArray {
    constructor(name, value) {
        super(name, PP.EasyTuneVariableType.BOOL, value);
    }
};

PP.EasyTuneBool = class EasyTuneBool extends PP.EasyTuneBoolArray {
    constructor(name, value) {
        super(name, [value]);
    }

    getValue() {
        return this.myValue[0];
    }

    setValue(value, resetInitialValue = false) {
        super.setValue([value], resetInitialValue);
    }

    setInitialValue(value) {
        super.setValue([value]);
    }
};

//EASY TUNE EASY TRANSFORM

PP.EasyTuneSimpleTransform = class EasyTuneSimpleTransform extends PP.EasyTuneVariable {
    constructor(name, value, scaleAsOne = true, positionStepPerSecond = 1, rotationStepPerSecond = 50, scaleStepPerSecond = 1) {
        super(name, PP.EasyTuneVariableType.EASY_TRANSFORM);

        this.myDecimalPlaces = 3;

        this.myPosition = value.mat4_getPosition();
        this.myRotation = value.mat4_getRotationDegrees();
        this.myScale = value.mat4_getScale();

        let decimalPlacesMultiplier = Math.pow(10, this.myDecimalPlaces);
        for (let i = 0; i < 3; i++) {
            this.myScale[i] = Math.max(this.myScale[i], 1 / decimalPlacesMultiplier);
        }

        this.myScaleAsOne = scaleAsOne;

        this.myPositionStepPerSecond = positionStepPerSecond;
        this.myRotationStepPerSecond = rotationStepPerSecond;
        this.myScaleStepPerSecond = scaleStepPerSecond;

        this.myInitialPosition = this.myPosition.vec3_clone();
        this.myInitialRotation = this.myRotation.vec3_clone();
        this.myInitialScale = this.myScale.vec3_clone();

        this.myInitialPositionStepPerSecond = this.myPositionStepPerSecond;
        this.myInitialRotationStepPerSecond = this.myRotationStepPerSecond;
        this.myInitialScaleStepPerSecond = this.myScaleStepPerSecond;

        this.myTransform = mat4_create();
        this.myTransform.mat4_setPositionRotationDegreesScale(this.myPosition, this.myRotation, this.myScale);

        this.myTempTransform = mat4_create();
    }

    getValue() {
        this.myTransform.mat4_setPositionRotationDegreesScale(this.myPosition, this.myRotation, this.myScale);
        return this.myTransform.slice(0);
    }

    setValue(value, resetInitialValue = false) {
        this.myTempTransform.mat4_setPositionRotationDegreesScale(this.myPosition, this.myRotation, this.myScale);

        value.mat4_getPosition(this.myPosition);
        value.mat4_getRotationDegrees(this.myRotation);
        value.mat4_getScale(this.myScale);

        this.myTransform.mat4_setPositionRotationDegreesScale(this.myPosition, this.myRotation, this.myScale);

        if (resetInitialValue) {
            PP.EasyTuneSimpleTransform.prototype.setInitialValue.call(this, value);
        }

        PP.refreshEasyTuneWidget();

        if (!this.myTempTransform.pp_equals(this.myTransform)) {
            this._triggerValueChangedCallback();
        }
    }

    setInitialValue(value) {
        this.myInitialPosition = value.mat4_getPosition();
        this.myInitialRotation = value.mat4_getRotationDegrees();
        this.myInitialScale = value.mat4_getScale();
    }
};
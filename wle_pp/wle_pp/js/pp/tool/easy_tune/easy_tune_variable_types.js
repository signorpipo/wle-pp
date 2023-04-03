/*
Easy Tune Variables Examples

Number:         getEasyTuneVariables().add(new EasyTuneNumber("Float", 1.00, 0.1, 3));
Number Array:   getEasyTuneVariables().add(new EasyTuneNumberArray("Float Array", [1.00, 2.00, 3.00], 0.1, 3));
Int:            getEasyTuneVariables().add(new EasyTuneInt("Int", 1, 1));
Int Array:      getEasyTuneVariables().add(new EasyTuneIntArray("Int Array", [1, 2, 3], 1));
Bool:           getEasyTuneVariables().add(new EasyTuneBool("Bool", false));
Bool Array:     getEasyTuneVariables().add(new EasyTuneBoolArray("Bool Array", [false, true, false]));
Transform:      getEasyTuneVariables().add(new EasyTuneTransform("Transform", mat4_create(), true));
*/

import { mat4_create } from "../../plugin/js/extensions/array_extension";
import { getMainEngine } from "../../cauldron/wl/engine_globals";
import { EasyTuneUtils } from "./easy_tune_utils";

export let EasyTuneVariableType = {
    NONE: 0,
    NUMBER: 1,
    BOOL: 2,
    TRANSFORM: 3
};

export class EasyTuneVariable {

    constructor(name, type, engine = getMainEngine()) {
        this.myName = name.slice(0);
        this.myType = type;

        this.myValue = null;
        this.myDefaultValue = null;

        this.myIsActive = false;

        this._myValueChangedCallbacks = new Map();      // Signature: callback(name, value)

        this._myEngine = engine;
    }

    getValue() {
        return this.myValue;
    }

    setValue(value, resetDefaultValue = false) {
        let oldValue = this.myValue;
        this.myValue = value;

        if (resetDefaultValue) {
            EasyTuneVariable.prototype.setDefaultValue.call(this, value);
        }

        EasyTuneUtils.refreshEasyTuneWidget(this._myEngine);

        if (oldValue != value) {
            this._triggerValueChangedCallback();
        }
    }

    setDefaultValue(value) {
        this.myDefaultValue = value;
    }

    fromJSON(valueJSON, resetDefaultValue = false) {
        this.setValue(JSON.parse(valueJSON), resetDefaultValue);
    }

    toJSON() {
        return JSON.stringify(this.getValue());
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
}

export class EasyTuneVariableArray extends EasyTuneVariable {

    constructor(name, type, value, engine) {
        super(name, type, engine);

        EasyTuneVariableArray.prototype.setValue.call(this, value, true);
    }

    getValue() {
        return this.myValue.pp_clone();
    }

    setValue(value, resetDefaultValue = false) {
        let oldValue = this.myValue;
        this.myValue = value.pp_clone();

        if (resetDefaultValue) {
            EasyTuneVariableArray.prototype.setDefaultValue.call(this, value);
        }

        EasyTuneUtils.refreshEasyTuneWidget(this._myEngine);

        if (oldValue == null || !oldValue.pp_equals(value)) {
            this._triggerValueChangedCallback();
        }
    }

    setDefaultValue(value) {
        this.myDefaultValue = value.pp_clone();
    }
}

// NUMBER

export class EasyTuneNumberArray extends EasyTuneVariableArray {

    constructor(name, value, stepPerSecond, decimalPlaces, min = null, max = null, editAllValuesTogether = false, engine) {
        super(name, EasyTuneVariableType.NUMBER, value, engine);

        this.myDecimalPlaces = decimalPlaces;
        this.myStepPerSecond = stepPerSecond;

        this.myDefaultStepPerSecond = this.myStepPerSecond;

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

    _clampValue(resetDefaultValue) {
        let clampedValue = this.myValue.vec_clamp(this.myMin, this.myMax);

        if (!resetDefaultValue) {
            let clampedDefaultValue = this.myDefaultValue.vec_clamp(this.myMin, this.myMax);
            let defaultValueChanged = !clampedDefaultValue.vec_equals(this.myDefaultValue, 0.00001);
            if (defaultValueChanged) {
                EasyTuneVariableArray.prototype.setDefaultValue.call(this, clampedDefaultValue);
            }
        }

        EasyTuneVariableArray.prototype.setValue.call(this, clampedValue, resetDefaultValue);
    }
}

export class EasyTuneNumber extends EasyTuneNumberArray {

    constructor(name, value, stepPerSecond, decimalPlaces, min, max, engine) {
        super(name, [value], stepPerSecond, decimalPlaces, min, max, engine);
    }

    getValue() {
        return this.myValue[0];
    }

    setValue(value, resetDefaultValue = false) {
        super.setValue([value], resetDefaultValue);
    }

    setDefaultValue(value) {
        super.setDefaultValue([value]);
    }
}

export class EasyTuneInt extends EasyTuneNumber {

    constructor(name, value, stepPerSecond, min, max, engine) {
        super(name, value, stepPerSecond, 0, min, max, engine);
    }
}

export class EasyTuneIntArray extends EasyTuneNumberArray {

    constructor(name, value, stepPerSecond, min, max, editAllValuesTogether, engine) {
        let tempValue = value.pp_clone();

        for (let i = 0; i < value.length; i++) {
            tempValue[i] = Math.round(tempValue[i]);
        }

        super(name, tempValue, stepPerSecond, 0, min != null ? Math.round(min) : null, max != null ? Math.round(max) : max, editAllValuesTogether, engine);
    }
}

// BOOL

export class EasyTuneBoolArray extends EasyTuneVariableArray {

    constructor(name, value, engine) {
        super(name, EasyTuneVariableType.BOOL, value, engine);
    }
}

export class EasyTuneBool extends EasyTuneBoolArray {

    constructor(name, value, engine) {
        super(name, [value], engine);
    }

    getValue() {
        return this.myValue[0];
    }

    setValue(value, resetDefaultValue = false) {
        super.setValue([value], resetDefaultValue);
    }

    setDefaultValue(value) {
        super.setDefaultValue([value]);
    }
}

// EASY TUNE EASY TRANSFORM

export class EasyTuneTransform extends EasyTuneVariable {

    constructor(name, value, scaleAsOne = true, positionStepPerSecond = 1, rotationStepPerSecond = 50, scaleStepPerSecond = 1, engine) {
        super(name, EasyTuneVariableType.TRANSFORM, engine);

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

        this.myDefaultPosition = this.myPosition.vec3_clone();
        this.myDefaultRotation = this.myRotation.vec3_clone();
        this.myDefaultScale = this.myScale.vec3_clone();

        this.myDefaultPositionStepPerSecond = this.myPositionStepPerSecond;
        this.myDefaultRotationStepPerSecond = this.myRotationStepPerSecond;
        this.myDefaultScaleStepPerSecond = this.myScaleStepPerSecond;

        this.myTransform = mat4_create();
        this.myTransform.mat4_setPositionRotationDegreesScale(this.myPosition, this.myRotation, this.myScale);

        this.myTempTransform = mat4_create();
    }

    getValue() {
        this.myTransform.mat4_setPositionRotationDegreesScale(this.myPosition, this.myRotation, this.myScale);
        return this.myTransform.pp_clone();
    }

    setValue(value, resetDefaultValue = false) {
        this.myTempTransform.mat4_setPositionRotationDegreesScale(this.myPosition, this.myRotation, this.myScale);

        value.mat4_getPosition(this.myPosition);
        value.mat4_getRotationDegrees(this.myRotation);
        value.mat4_getScale(this.myScale);

        this.myTransform.mat4_setPositionRotationDegreesScale(this.myPosition, this.myRotation, this.myScale);

        if (resetDefaultValue) {
            EasyTuneTransform.prototype.setDefaultValue.call(this, value);
        }

        EasyTuneUtils.refreshEasyTuneWidget(this._myEngine);

        if (!this.myTempTransform.pp_equals(this.myTransform)) {
            this._triggerValueChangedCallback();
        }
    }

    setDefaultValue(value) {
        this.myDefaultPosition = value.mat4_getPosition();
        this.myDefaultRotation = value.mat4_getRotationDegrees();
        this.myDefaultScale = value.mat4_getScale();
    }

    fromJSON(valueJSON, resetDefaultValue = false) {
        this.setValue(JSON.parse(valueJSON), resetDefaultValue);
    }

    toJSON() {
        return this.getValue().vec_toString();
    }
}
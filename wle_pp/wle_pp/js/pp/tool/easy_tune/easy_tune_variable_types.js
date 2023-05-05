/*
Easy Tune Variables Examples

Number:         Globals.getEasyTuneVariables().add(new EasyTuneNumber("Float", 1.00, 0.1, 3));
Number Array:   Globals.getEasyTuneVariables().add(new EasyTuneNumberArray("Float Array", [1.00, 2.00, 3.00], 0.1, 3));
Int:            Globals.getEasyTuneVariables().add(new EasyTuneInt("Int", 1, 1));
Int Array:      Globals.getEasyTuneVariables().add(new EasyTuneIntArray("Int Array", [1, 2, 3], 1));
Bool:           Globals.getEasyTuneVariables().add(new EasyTuneBool("Bool", false));
Bool Array:     Globals.getEasyTuneVariables().add(new EasyTuneBoolArray("Bool Array", [false, true, false]));
Transform:      Globals.getEasyTuneVariables().add(new EasyTuneTransform("Transform", mat4_create(), true));
*/

import { Emitter } from "@wonderlandengine/api";
import { mat4_create } from "../../plugin/js/extensions/array_extension";
import { Globals } from "../../pp/globals";
import { EasyTuneUtils } from "./easy_tune_utils";

export let EasyTuneVariableType = {
    NONE: 0,
    NUMBER: 1,
    BOOL: 2,
    TRANSFORM: 3
};

export class EasyTuneVariable {

    constructor(name, type, engine = Globals.getMainEngine()) {
        this._myName = name.slice(0);
        this._myType = type;

        this._myValue = null;
        this._myDefaultValue = null;

        this._myActive = false;

        this._myValueChangedEmitter = new Emitter();      // Signature: listener(value, easyTuneVariables)

        this._myEngine = engine;
    }

    getName() {
        return this._myName;
    }

    getType() {
        return this._myType;
    }

    isActive() {
        return this._myActive;
    }

    setActive(active) {
        this._myActive = active;
    }

    getValue() {
        return this._myValue;
    }

    setValue(value, resetDefaultValue = false) {
        let valueChanged = this._myValue != value;

        this._myValue = value;

        if (resetDefaultValue) {
            EasyTuneVariable.prototype.setDefaultValue.call(this, value);
        }

        EasyTuneUtils.refreshWidget(this._myEngine);

        if (valueChanged) {
            this._myValueChangedEmitter.notify(this.getValue(), this);
        }
    }

    getDefaultValue() {
        return this._myDefaultValue;
    }

    setDefaultValue(value) {
        this._myDefaultValue = value;
    }

    fromJSON(valueJSON, resetDefaultValue = false) {
        this.setValue(JSON.parse(valueJSON), resetDefaultValue);
    }

    toJSON() {
        return JSON.stringify(this.getValue());
    }

    registerValueChangedEventListener(id, listener) {
        this._myValueChangedEmitter.add(listener, { id: id });
    }

    unregisterValueChangedEventListener(id) {
        this._myValueChangedEmitter.remove(id);
    }
}

export class EasyTuneVariableArray extends EasyTuneVariable {

    constructor(name, type, value, engine) {
        super(name, type, engine);

        EasyTuneVariableArray.prototype.setValue.call(this, value, true);
    }

    setValue(value, resetDefaultValue = false) {
        let valueChanged = this._myValue != null && !this._myValue.pp_equals(value);

        if (this._myValue == null) {
            this._myValue = value.pp_clone();
        } else {
            this._myValue.pp_copy(value);
        }

        if (resetDefaultValue) {
            EasyTuneVariableArray.prototype.setDefaultValue.call(this, value);
        }

        EasyTuneUtils.refreshWidget(this._myEngine);

        if (valueChanged) {
            this._myValueChangedEmitter.notify(this.getValue(), this);
        }
    }

    setDefaultValue(value) {
        if (this._myDefaultValue == null) {
            this._myDefaultValue = value.pp_clone();
        } else {
            this._myDefaultValue.pp_copy(value);
        }
    }
}

// NUMBER

export class EasyTuneNumberArray extends EasyTuneVariableArray {

    constructor(name, value, stepPerSecond, decimalPlaces, min = null, max = null, editAllValuesTogether = false, engine) {
        super(name, EasyTuneVariableType.NUMBER, value, engine);

        this._myDecimalPlaces = decimalPlaces;
        this._myStepPerSecond = stepPerSecond;

        this._myDefaultStepPerSecond = this._myStepPerSecond;

        this._myMin = min;
        this._myMax = max;

        this._myEditAllValuesTogether = editAllValuesTogether;

        this._clampValue(true);
    }

    setMax(max) {
        this._myMax = max;
        this._clampValue(false);
    }

    setMin(min) {
        this._myMin = min;
        this._clampValue(false);
    }

    _clampValue(resetDefaultValue) {
        let clampedValue = this._myValue.vec_clamp(this._myMin, this._myMax);

        if (!resetDefaultValue) {
            let clampedDefaultValue = this.getDefaultValue().vec_clamp(this._myMin, this._myMax);
            let defaultValueChanged = !clampedDefaultValue.vec_equals(this.getDefaultValue(), 0.00001);
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

        this._myTempValue = [0];
        this._myTempDefaultValue = [0];
    }

    getValue() {
        return super.getValue()[0];
    }

    setValue(value, resetDefaultValue = false) {
        this._myTempValue[0] = value;
        super.setValue(this._myTempValue, resetDefaultValue);
    }

    getDefaultValue() {
        return super.getDefaultValue()[0];
    }

    setDefaultValue(value) {
        this._myTempDefaultValue[0] = value;
        super.setDefaultValue(this._myTempValue);
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

        this._myTempValue = [0];
        this._myTempDefaultValue = [0];
    }

    getValue() {
        return super.getValue()[0];
    }

    setValue(value, resetDefaultValue = false) {
        this._myTempValue[0] = value;
        super.setValue(this._myTempValue, resetDefaultValue);
    }

    getDefaultValue() {
        return super.getDefaultValue()[0];
    }

    setDefaultValue(value) {
        this._myTempDefaultValue[0] = value;
        super.setDefaultValue(this._myTempValue);
    }
}

// EASY TUNE EASY TRANSFORM

export class EasyTuneTransform extends EasyTuneVariable {

    constructor(name, value, scaleAsOne = true, positionStepPerSecond = 1, rotationStepPerSecond = 50, scaleStepPerSecond = 1, engine) {
        super(name, EasyTuneVariableType.TRANSFORM, engine);

        this._myDecimalPlaces = 3;

        this._myPosition = value.mat4_getPosition();
        this._myRotation = value.mat4_getRotationDegrees();
        this._myScale = value.mat4_getScale();

        let decimalPlacesMultiplier = Math.pow(10, this._myDecimalPlaces);
        for (let i = 0; i < 3; i++) {
            this._myScale[i] = Math.max(this._myScale[i], 1 / decimalPlacesMultiplier);
        }

        this._myScaleAsOne = scaleAsOne;

        this._myPositionStepPerSecond = positionStepPerSecond;
        this._myRotationStepPerSecond = rotationStepPerSecond;
        this._myScaleStepPerSecond = scaleStepPerSecond;

        this._myDefaultPosition = this._myPosition.vec3_clone();
        this._myDefaultRotation = this._myRotation.vec3_clone();
        this._myDefaultScale = this._myScale.vec3_clone();

        this._myDefaultPositionStepPerSecond = this._myPositionStepPerSecond;
        this._myDefaultRotationStepPerSecond = this._myRotationStepPerSecond;
        this._myDefaultScaleStepPerSecond = this._myScaleStepPerSecond;

        this._myTransform = mat4_create();
        this._myTransform.mat4_setPositionRotationDegreesScale(this._myPosition, this._myRotation, this._myScale);

        this._myTempTransform = mat4_create();
    }

    getValue() {
        this._myTransform.mat4_setPositionRotationDegreesScale(this._myPosition, this._myRotation, this._myScale);
        return this._myTransform;
    }

    setValue(value, resetDefaultValue = false) {
        this._myTempTransform.mat4_setPositionRotationDegreesScale(this._myPosition, this._myRotation, this._myScale);

        value.mat4_getPosition(this._myPosition);
        value.mat4_getRotationDegrees(this._myRotation);
        value.mat4_getScale(this._myScale);

        this._myTransform.mat4_setPositionRotationDegreesScale(this._myPosition, this._myRotation, this._myScale);

        let valueChanged = !this._myTempTransform.pp_equals(this._myTransform)

        if (resetDefaultValue) {
            EasyTuneTransform.prototype.setDefaultValue.call(this, value);
        }

        EasyTuneUtils.refreshWidget(this._myEngine);

        if (valueChanged) {
            this._myValueChangedEmitter.notify(this.getValue(), this);
        }
    }

    setDefaultValue(value) {
        this._myDefaultPosition = value.mat4_getPosition();
        this._myDefaultRotation = value.mat4_getRotationDegrees();
        this._myDefaultScale = value.mat4_getScale();
    }

    fromJSON(valueJSON, resetDefaultValue = false) {
        this.setValue(JSON.parse(valueJSON), resetDefaultValue);
    }

    toJSON() {
        return this.getValue().vec_toString();
    }
}
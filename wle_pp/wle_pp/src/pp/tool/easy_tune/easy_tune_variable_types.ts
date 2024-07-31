/**
 * Easy Tune Variables Examples
 * 
 * Number:         Globals.getEasyTuneVariables().add(new EasyTuneNumber("Float", 1.00, (newValue) => this.myFloat = newValue, true, 2, 0.1));  
 * Number Array:   Globals.getEasyTuneVariables().add(new EasyTuneNumberArray("Float Array", [1.00, 2.00, 3.00], (newValue) => this.myFloatArray.pp_copy(newValue), true, 2, 0.1));  
 * Int:            Globals.getEasyTuneVariables().add(new EasyTuneInt("Int", this.myInt, (newValue) => this.myInt = newValue, true, 1));  
 * Int Array:      Globals.getEasyTuneVariables().add(new EasyTuneIntArray("Int Array", [1, 2, 3], (newValue) => this.myIntArray.pp_copy(newValue), true, 1));  
 * Bool:           Globals.getEasyTuneVariables().add(new EasyTuneBool("Bool", this.myBool, (newValue) => this.myBool = newValue, true));  
 * Bool Array:     Globals.getEasyTuneVariables().add(new EasyTuneBoolArray("Bool Array", [false, true, false], (newValue) => this.myBoolArray.pp_copy(newValue), true));  
 * Transform:      Globals.getEasyTuneVariables().add(new EasyTuneTransform("Transform", mat4_create(), (newValue) => this.myTransform.mat4_copy(newValue), true, true, 3));
 */

// #WARN some private variables are unused because they are used by the js widget! Maybe when that will be converted to ts I will fix that to a getter
// but for now do not delete them

import { Emitter, WonderlandEngine } from "@wonderlandengine/api";
import { ArrayLike, Matrix4, Vector3 } from "../../cauldron/type_definitions/array_type_definitions.js";
import { MathUtils } from "../../cauldron/utils/math_utils.js";
import { mat4_create, vec3_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../pp/globals.js";
import { EasyTuneUtils } from "./easy_tune_utils.js";

export enum EasyTuneVariableType {
    NONE = 0,
    NUMBER = 1,
    BOOL = 2,
    TRANSFORM = 3
}

export class EasyTuneVariableExtraParams {
    public myAutoImportEnabled: boolean | null = null;
    public myManualImportEnabled: boolean | null = null;
    public myExportEnabled: boolean | null = null;

    constructor(autoimportEnabled: boolean | null = null, manualImportEnabled: boolean | null = null, exportEnabled: boolean | null = null) {
        this.myAutoImportEnabled = autoimportEnabled;
        this.myManualImportEnabled = manualImportEnabled;
        this.myExportEnabled = exportEnabled;
    }
}

export abstract class EasyTuneVariable {
    private readonly _myType: EasyTuneVariableType;

    private _myName: string;

    protected abstract _myValue: unknown;
    protected abstract _myDefaultValue: unknown;

    private _myShowOnWidget: boolean;
    private _myAutoImportEnabled: boolean;
    private _myManualImportEnabled: boolean;
    private _myExportEnabled: boolean;

    private _myWidgetCurrentVariable: boolean = false;

    private readonly _myValueChangedEmitter: Emitter<[unknown, EasyTuneVariable]> = new Emitter();

    protected readonly _myEngine: Readonly<WonderlandEngine>;

    constructor(type: EasyTuneVariableType, name: string, onValueChangedEventListener: ((value: unknown, easyTuneVariable: EasyTuneVariable) => void) | null = null, showOnWidget: boolean = true, extraParams: Readonly<EasyTuneVariableExtraParams> = new EasyTuneVariableExtraParams(), engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!) {
        this._myType = type;

        this._myName = name;

        this._myShowOnWidget = showOnWidget;
        this._myAutoImportEnabled = extraParams.myAutoImportEnabled ?? EasyTuneUtils.getAutoImportEnabledDefaultValue(engine);
        this._myManualImportEnabled = extraParams.myManualImportEnabled ?? EasyTuneUtils.getManualImportEnabledDefaultValue(engine);
        this._myExportEnabled = extraParams.myExportEnabled ?? EasyTuneUtils.getExportEnabledDefaultValue(engine);

        this._myWidgetCurrentVariable = false;

        this._myValueChangedEmitter = new Emitter();      // Signature: listener(value, easyTuneVariables)

        this._myEngine = engine;

        if (onValueChangedEventListener != null) {
            this.registerValueChangedEventListener(this, onValueChangedEventListener);
        }
    }

    public getName(): string {
        return this._myName;
    }

    public setName(name: string): this {
        if (this._myName != name) {
            this._myName = name;
            EasyTuneUtils.refreshWidget(this._myEngine);
        }

        return this;
    }

    public getType(): EasyTuneVariableType {
        return this._myType;
    }

    public isWidgetCurrentVariable(): boolean {
        return this._myWidgetCurrentVariable;
    }

    public setWidgetCurrentVariable(widgetCurrentVariable: boolean): this {
        this._myWidgetCurrentVariable = widgetCurrentVariable;
        return this;
    }

    public getValue(): unknown {
        return this._myValue;
    }

    public setValue(value: unknown, resetDefaultValue: boolean = false, skipValueChangedNotify: boolean = false): this {
        const valueChanged = this._myValue != null && this._myValue != value;

        this._myValue = value;

        if (resetDefaultValue) {
            this.setDefaultValue(value);
        }

        EasyTuneUtils.refreshWidget(this._myEngine);

        if (valueChanged && !skipValueChangedNotify) {
            this._notifyValueChanged();
        }

        return this;
    }

    public getDefaultValue(): unknown {
        return this._myDefaultValue;
    }

    public isValueEqual(otherValue: unknown): boolean {
        return this._myValue == otherValue;
    }

    public setDefaultValue(value: unknown): this {
        this._myDefaultValue = value;
        return this;
    }

    public isShownOnWidget(): boolean {
        return this._myShowOnWidget;
    }

    public setShowOnWidget(showOnWidget: boolean): this {
        this._myShowOnWidget = showOnWidget;
        return this;
    }

    public isManualImportEnabled(): boolean {
        return this._myManualImportEnabled;
    }

    public isAutoImportEnabled(): boolean {
        return this._myAutoImportEnabled;
    }

    public isExportEnabled(): boolean {
        return this._myExportEnabled;
    }

    public setManualImportEnabled(enabled: boolean): this {
        this._myManualImportEnabled = enabled;
        return this;
    }

    public setAutoImportEnabled(enabled: boolean): this {
        this._myAutoImportEnabled = enabled;
        return this;
    }

    public setExportEnabled(enabled: boolean): this {
        this._myExportEnabled = enabled;
        return this;
    }

    public setEasyTuneVariableExtraParams(extraParams: Readonly<EasyTuneVariableExtraParams>): this {
        this.setAutoImportEnabled(extraParams.myAutoImportEnabled ?? EasyTuneUtils.getAutoImportEnabledDefaultValue(this._myEngine));
        this.setManualImportEnabled(extraParams.myManualImportEnabled ?? EasyTuneUtils.getManualImportEnabledDefaultValue(this._myEngine));
        this.setExportEnabled(extraParams.myExportEnabled ?? EasyTuneUtils.getExportEnabledDefaultValue(this._myEngine));

        return this;
    }

    public fromJSON(valueJSON: string, resetDefaultValue: boolean = false, skipValueChangedNotify: boolean = false): this {
        this.setValue(JSON.parse(valueJSON), resetDefaultValue, skipValueChangedNotify);
        return this;
    }

    public toJSON(): string {
        return JSON.stringify(this.getValue());
    }

    public registerValueChangedEventListener(id: unknown, listener: (value: unknown, easyTuneVariable: EasyTuneVariable) => void): this {
        this._myValueChangedEmitter.add(listener, { id: id });
        return this;
    }

    public unregisterValueChangedEventListener(id: unknown): this {
        this._myValueChangedEmitter.remove(id);
        return this;
    }

    protected _notifyValueChanged(): void {
        this._myValueChangedEmitter.notify(this.getValue(), this);
    }
}

export abstract class EasyTuneVariableTyped<T> extends EasyTuneVariable {
    protected abstract override _myValue: T;
    protected abstract override _myDefaultValue: T;

    constructor(type: EasyTuneVariableType, name: string, onValueChangedEventListener?: ((value: Readonly<T>, easyTuneVariable: EasyTuneVariable) => void) | null, showOnWidget?: boolean, extraParams?: Readonly<EasyTuneVariableExtraParams>, engine?: Readonly<WonderlandEngine>) {
        super(type, name, onValueChangedEventListener as (value: unknown, easyTuneVariable: EasyTuneVariable) => void, showOnWidget, extraParams, engine);
    }

    public override getValue(): Readonly<T> {
        return super.getValue() as T;
    }

    public override setValue(value: Readonly<T>, resetDefaultValue?: boolean, skipValueChangedNotify?: boolean): this {
        return super.setValue(value, resetDefaultValue, skipValueChangedNotify);
    }

    public override isValueEqual(otherValue: Readonly<T>): boolean {
        return this._myValue == otherValue;
    }

    public override getDefaultValue(): Readonly<T> {
        return super.getDefaultValue() as T;
    }

    public override setDefaultValue(value: Readonly<T>): this {
        return super.setDefaultValue(value);
    }

    public override registerValueChangedEventListener(id: unknown, listener: (value: Readonly<T>, easyTuneVariable: EasyTuneVariable) => void): this {
        return super.registerValueChangedEventListener(id, listener as (value: unknown, easyTuneVariable: EasyTuneVariable) => void);
    }

    public override unregisterValueChangedEventListener(id: unknown): this {
        return super.unregisterValueChangedEventListener(id);
    }
}

export abstract class EasyTuneVariableArray<ArrayType extends ArrayLike<ArrayElementType>, ArrayElementType> extends EasyTuneVariableTyped<ArrayType> {
    protected override _myValue!: ArrayType;
    protected override _myDefaultValue!: ArrayType;

    constructor(type: EasyTuneVariableType, name: string, value: ArrayType, onValueChangedEventListener?: ((value: Readonly<ArrayType>, easyTuneVariable: EasyTuneVariable) => void) | null, showOnWidget?: boolean, extraParams?: Readonly<EasyTuneVariableExtraParams>, engine?: Readonly<WonderlandEngine>) {
        super(type, name, onValueChangedEventListener, showOnWidget, extraParams, engine);

        this.setValue(value, true, true);
    }

    public override setValue(value: Readonly<ArrayType>, resetDefaultValue: boolean = false, skipValueChangedNotify: boolean = false): this {
        const valueChanged = this._myValue != null && !this._myValue.pp_equals(value);

        if (this._myValue == null) {
            this._myValue = value.pp_clone();
        } else {
            this._myValue.pp_copy(value);
        }

        if (resetDefaultValue) {
            this.setDefaultValue(value);
        }

        EasyTuneUtils.refreshWidget(this._myEngine);

        if (valueChanged && !skipValueChangedNotify) {
            this._notifyValueChanged();
        }

        return this;
    }

    public override setDefaultValue(value: Readonly<ArrayType>): this {
        if (this._myDefaultValue == null) {
            this._myDefaultValue = value.pp_clone();
        } else {
            this._myDefaultValue.pp_copy(value);
        }

        return this;
    }
}


// NUMBER

export class EasyTuneNumberArray extends EasyTuneVariableArray<ArrayLike<number>, number> {

    private _myDecimalPlaces: number;
    private _myStepPerSecond: number;

    private _myDefaultStepPerSecond: number;

    private _myMin: number;
    private _myMax: number;

    private _myEditAllValuesTogether: boolean;

    constructor(name: string, value: Readonly<ArrayLike<number>>, onValueChangedEventListener?: ((value: Readonly<ArrayLike<number>>, easyTuneVariable: EasyTuneVariable) => void) | null, showOnWidget?: boolean, decimalPlaces: number = 3, stepPerSecond: number = 1, min: number = -Number.MAX_VALUE, max: number = Number.MAX_VALUE, editAllValuesTogether: boolean = false, extraParams?: Readonly<EasyTuneVariableExtraParams>, engine?: Readonly<WonderlandEngine>) {
        super(EasyTuneVariableType.NUMBER, name, value, onValueChangedEventListener, showOnWidget, extraParams, engine);

        this._myDecimalPlaces = decimalPlaces;
        this._myStepPerSecond = stepPerSecond;

        this._myDefaultStepPerSecond = this._myStepPerSecond;

        this._myMin = min;
        this._myMax = max;

        this._myEditAllValuesTogether = editAllValuesTogether;

        this._clampValue(true, true);
    }

    public override isValueEqual(otherValue: Readonly<ArrayLike<number>>, epsilon: number = MathUtils.EPSILON): boolean {
        return this._myValue.vec_equals(otherValue, epsilon);
    }

    public setMax(max: number): this {
        this._myMax = max;
        this._clampValue(false);
        return this;
    }

    public setMin(min: number): this {
        this._myMin = min;
        this._clampValue(false);
        return this;
    }

    public override toJSON(): string {
        return this.getValue().vec_toString();
    }

    private _clampValue(resetDefaultValue: boolean, skipValueChangedNotify: boolean = false): void {
        const clampedValue = this._myValue.vec_clamp(this._myMin, this._myMax);

        if (!resetDefaultValue) {
            const clampedDefaultValue = this.getDefaultValue().vec_clamp(this._myMin, this._myMax);
            this.setDefaultValue(clampedDefaultValue);
        }

        this.setValue(clampedValue, resetDefaultValue, skipValueChangedNotify);
    }
}

export class EasyTuneIntArray extends EasyTuneNumberArray {

    constructor(name: string, value: Readonly<ArrayLike<number>>, onValueChangedEventListener?: ((value: Readonly<ArrayLike<number>>, easyTuneVariable: EasyTuneVariable) => void) | null, showOnWidget?: boolean, stepPerSecond?: number, min: number = -Number.MAX_VALUE, max: number = Number.MAX_VALUE, editAllValuesTogether?: boolean, extraParams?: Readonly<EasyTuneVariableExtraParams>, engine?: Readonly<WonderlandEngine>) {
        const roundedValue = value.pp_clone();

        for (let i = 0; i < value.length; i++) {
            roundedValue[i] = Math.round(roundedValue[i]);
        }

        super(name, roundedValue, onValueChangedEventListener, showOnWidget, 0, stepPerSecond, Math.round(min), Math.round(max), editAllValuesTogether, extraParams, engine);
    }
}

export class EasyTuneNumber extends EasyTuneVariableTyped<number> {

    protected override _myValue!: number;
    protected override _myDefaultValue!: number;

    private _myDecimalPlaces: number;
    private _myStepPerSecond: number;

    private _myDefaultStepPerSecond: number;

    private _myMin: number;
    private _myMax: number;

    constructor(name: string, value: number, onValueChangedEventListener?: ((value: number, easyTuneVariable: EasyTuneVariable) => void) | null, showOnWidget?: boolean, decimalPlaces: number = 3, stepPerSecond: number = 1, min: number = -Number.MAX_VALUE, max: number = Number.MAX_VALUE, extraParams?: Readonly<EasyTuneVariableExtraParams>, engine?: Readonly<WonderlandEngine>) {
        super(EasyTuneVariableType.NUMBER, name, onValueChangedEventListener, showOnWidget, extraParams, engine);

        this.setValue(value, true, true);

        this._myDecimalPlaces = decimalPlaces;
        this._myStepPerSecond = stepPerSecond;

        this._myDefaultStepPerSecond = this._myStepPerSecond;

        this._myMin = min;
        this._myMax = max;

        this._clampValue(true, true);
    }

    public override isValueEqual(otherValue: Readonly<number>, epsilon: number = MathUtils.EPSILON): boolean {
        return Math.abs(this._myValue - otherValue) < epsilon;
    }

    public setMax(max: number): this {
        this._myMax = max;
        this._clampValue(false);
        return this;
    }

    public setMin(min: number): this {
        this._myMin = min;
        this._clampValue(false);
        return this;
    }

    public override toJSON(): string {
        return JSON.stringify(this.getValue());
    }

    private _clampValue(resetDefaultValue: boolean, skipValueChangedNotify: boolean = false): void {
        const clampedValue = MathUtils.clamp(this._myValue, this._myMin, this._myMax);

        if (!resetDefaultValue) {
            const clampedDefaultValue = MathUtils.clamp(this.getDefaultValue(), this._myMin, this._myMax);
            this.setDefaultValue(clampedDefaultValue);
        }

        this.setValue(clampedValue, resetDefaultValue, skipValueChangedNotify);
    }
}

export class EasyTuneInt extends EasyTuneNumber {

    constructor(name: string, value: number, onValueChangedEventListener?: ((value: number, easyTuneVariable: EasyTuneVariable) => void) | null, showOnWidget?: boolean, stepPerSecond?: number, min?: number, max?: number, extraParams?: Readonly<EasyTuneVariableExtraParams>, engine?: Readonly<WonderlandEngine>) {
        super(name, value, onValueChangedEventListener, showOnWidget, 0, stepPerSecond, min, max, extraParams, engine);
    }
}

// BOOL

export class EasyTuneBoolArray extends EasyTuneVariableArray<ArrayLike<boolean>, boolean> {

    constructor(name: string, value: Readonly<ArrayLike<boolean>>, onValueChangedEventListener?: ((value: Readonly<ArrayLike<boolean>>, easyTuneVariable: EasyTuneVariable) => void) | null, showOnWidget?: boolean, extraParams?: Readonly<EasyTuneVariableExtraParams>, engine?: Readonly<WonderlandEngine>) {
        super(EasyTuneVariableType.BOOL, name, value, onValueChangedEventListener, showOnWidget, extraParams, engine);
    }
}

export class EasyTuneBool extends EasyTuneVariableTyped<boolean> {

    protected override _myValue!: boolean;
    protected override _myDefaultValue!: boolean;

    constructor(name: string, value: boolean, onValueChangedEventListener?: ((value: boolean, easyTuneVariable: EasyTuneVariable) => void) | null, showOnWidget?: boolean, extraParams?: Readonly<EasyTuneVariableExtraParams>, engine?: Readonly<WonderlandEngine>) {
        super(EasyTuneVariableType.BOOL, name, onValueChangedEventListener, showOnWidget, extraParams, engine);

        this.setValue(value, true, true);
    }
}

// EASY TUNE EASY TRANSFORM

export class EasyTuneTransform extends EasyTuneVariableTyped<Matrix4> {
    protected override _myValue: Matrix4 = mat4_create();
    protected override _myDefaultValue: Matrix4 = mat4_create();

    private _myDecimalPlaces: number;

    private readonly _myPosition: Vector3 = vec3_create();
    private readonly _myRotation: Vector3 = vec3_create();
    private readonly _myScale: Vector3 = vec3_create();

    private _myScaleAsOne: boolean;

    private _myPositionStepPerSecond: number;
    private _myRotationStepPerSecond: number;
    private _myScaleStepPerSecond: number;

    private readonly _myDefaultPosition: Vector3 = vec3_create();
    private readonly _myDefaultRotation: Vector3 = vec3_create();
    private readonly _myDefaultScale: Vector3 = vec3_create();

    private _myDefaultPositionStepPerSecond: number;
    private _myDefaultRotationStepPerSecond: number;
    private _myDefaultScaleStepPerSecond: number;

    constructor(name: string, value: Readonly<Matrix4>, onValueChangedEventListener?: ((value: Readonly<Matrix4>, easyTuneVariable: EasyTuneVariable) => void) | null, showOnWidget?: boolean, scaleAsOne: boolean = true, decimalPlaces: number = 3, positionStepPerSecond: number = 1, rotationStepPerSecond: number = 50, scaleStepPerSecond: number = 1, extraParams?: Readonly<EasyTuneVariableExtraParams>, engine?: Readonly<WonderlandEngine>) {
        super(EasyTuneVariableType.TRANSFORM, name, onValueChangedEventListener, showOnWidget, extraParams, engine);

        this._myDecimalPlaces = decimalPlaces;

        this.setValue(value, true, true);

        // To avoid having a 0 scale that can mess up the transform
        const decimalPlacesMultiplier = Math.pow(10, this._myDecimalPlaces);
        for (let i = 0; i < 3; i++) {
            this._myScale[i] = Math.max(this._myScale[i], 1 / decimalPlacesMultiplier);
        }

        this._myValue.mat4_setPosition(this._myPosition);
        this._myValue.mat4_setRotationDegrees(this._myRotation);
        this._myValue.mat4_setScale(this._myScale);

        this.setValue(this._myValue, true, true);

        this._myScaleAsOne = scaleAsOne;

        this._myPositionStepPerSecond = positionStepPerSecond;
        this._myRotationStepPerSecond = rotationStepPerSecond;
        this._myScaleStepPerSecond = scaleStepPerSecond;

        this._myDefaultPositionStepPerSecond = this._myPositionStepPerSecond;
        this._myDefaultRotationStepPerSecond = this._myRotationStepPerSecond;
        this._myDefaultScaleStepPerSecond = this._myScaleStepPerSecond;
    }

    private static readonly _setValueSV =
        {
            oldValue: mat4_create()
        };
    public override setValue(value: Readonly<Matrix4>, resetDefaultValue = false, skipValueChangedNotify: boolean = false): this {
        const oldValue = EasyTuneTransform._setValueSV.oldValue;
        oldValue.mat4_copy(this._myValue);

        this._myValue.mat4_copy(value);

        this._myValue.mat4_getPosition(this._myPosition);
        this._myValue.mat4_getRotationDegrees(this._myRotation);
        this._myValue.mat4_getScale(this._myScale);

        const valueChanged = !oldValue.pp_equals(this._myValue);

        if (resetDefaultValue) {
            this.setDefaultValue(value);
        }

        EasyTuneUtils.refreshWidget(this._myEngine);

        if (valueChanged && !skipValueChangedNotify) {
            this._notifyValueChanged();
        }

        return this;
    }

    public override isValueEqual(otherValue: Readonly<Matrix4>, epsilon: number = MathUtils.EPSILON): boolean {
        return this._myValue.vec_equals(otherValue, epsilon);
    }

    public override setDefaultValue(value: Readonly<Matrix4>): this {
        this._myDefaultValue.mat4_copy(value);

        this._myDefaultValue.mat4_getPosition(this._myDefaultPosition);
        this._myDefaultValue.mat4_getRotationDegrees(this._myDefaultRotation);
        this._myDefaultValue.mat4_getScale(this._myDefaultScale);

        return this;
    }

    public override toJSON(): string {
        return this.getValue().vec_toString();
    }
}
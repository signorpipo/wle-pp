import { Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { EasyTuneUtils } from "../easy_tune_utils.js";
import { EasyTuneVariable, EasyTuneVariableTyped } from "../easy_tune_variable_types.js";

export abstract class EasyObjectTuner<ValueType, EasyTuneVariableType extends EasyTuneVariableTyped<ValueType>> {
    private _myObject: Object3D;

    private _myEasyTuneVariable: EasyTuneVariableType | null = null;

    private _myUseTuneTarget: boolean;
    private _mySetAsWidgetCurrentVariable: boolean;

    private _myInitialEasyTuneVariableName: string;

    private _myPrevObject: Object3D | null = null;
    private _myManualVariableUpdate: boolean = false;

    protected readonly _myEngine: Readonly<WonderlandEngine>;

    constructor(object: Object3D, variableName: string, setAsWidgetCurrentVariable: boolean, useTuneTarget: boolean, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!) {
        this._myObject = object;
        this._myUseTuneTarget = useTuneTarget;
        this._mySetAsWidgetCurrentVariable = setAsWidgetCurrentVariable;

        let easyObject: Object3D | null = this._myObject;
        if (this._myUseTuneTarget) {
            easyObject = Globals.getEasyTuneTarget(engine);
        }

        const variableNamePrefix = this._getVariableNamePrefix();

        if (variableName == "") {
            const objectName = easyObject != null ? easyObject.pp_getName() : "";
            if (objectName != "") {
                this._myInitialEasyTuneVariableName = variableNamePrefix.concat(objectName);
            } else {
                this._myInitialEasyTuneVariableName = variableNamePrefix.concat(easyObject != null ? easyObject.pp_getID().toFixed() : "");
            }
        } else {
            this._myInitialEasyTuneVariableName = variableName;
        }

        this._myEngine = engine;
    }

    public getEasyTuneVariable(): EasyTuneVariable | null {
        return this._myEasyTuneVariable;
    }

    public start(): void {
        this._myEasyTuneVariable = this._createEasyTuneVariable(this._myInitialEasyTuneVariableName);
        Globals.getEasyTuneVariables(this._myEngine)!.add(this._myEasyTuneVariable);

        if (this._mySetAsWidgetCurrentVariable) {
            EasyTuneUtils.setWidgetCurrentVariable(this._myInitialEasyTuneVariableName, this._myEngine);
        }

        let easyObject: Object3D | null = this._myObject;
        if (this._myUseTuneTarget) {
            easyObject = Globals.getEasyTuneTarget(this._myEngine);
        }
        this._myPrevObject = easyObject;

        if (easyObject != null) {
            const value = this._getObjectValue(easyObject);
            this._myEasyTuneVariable.setValue(value, true);
        }

        this._myEasyTuneVariable.registerValueChangedEventListener(this, function (this: EasyObjectTuner<ValueType, EasyTuneVariableType>, newValue: Readonly<ValueType>) {
            if (this._myManualVariableUpdate) return;

            let easyObject: Object3D | null = this._myObject;
            if (this._myUseTuneTarget) {
                easyObject = Globals.getEasyTuneTarget(this._myEngine);
            }

            if (easyObject != null) {
                this._updateObjectValue(easyObject, newValue);
            }
        }.bind(this));
    }

    public update(dt: number): void {
        if (this._myEasyTuneVariable == null) return;

        let easyObject: Object3D | null = this._myObject;
        if (this._myUseTuneTarget) {
            easyObject = Globals.getEasyTuneTarget(this._myEngine);
        }

        let value = null;
        if (easyObject != null) {
            value = this._getObjectValue(easyObject);
        } else {
            value = this._getDefaultValue();
        }

        if (value != null) {
            const currentValue = this._myEasyTuneVariable.getValue();
            if (!this._areValueEqual(currentValue, value)) {
                this._myManualVariableUpdate = true;
                this._myEasyTuneVariable.setValue(value, this._myPrevObject != easyObject);
                this._myPrevObject = easyObject;

                this._myManualVariableUpdate = false;
            }
        }
    }

    protected abstract _getVariableNamePrefix(): string;

    protected abstract _createEasyTuneVariable(variableName: string): EasyTuneVariableType;

    protected abstract _getObjectValue(object: Readonly<Object3D>): Readonly<ValueType>;

    protected abstract _getDefaultValue(): Readonly<ValueType>;

    protected abstract _areValueEqual(first: Readonly<ValueType>, second: Readonly<ValueType>): boolean;

    protected abstract _updateObjectValue(object: Object3D, value: Readonly<ValueType>): void;
}
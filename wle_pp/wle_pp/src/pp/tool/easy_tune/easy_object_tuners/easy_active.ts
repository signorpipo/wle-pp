import { Component, Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { EasyTuneBool } from "../easy_tune_variable_types.js";
import { EasyObjectTuner } from "./easy_object_tuner.js";

export class EasyActive extends EasyObjectTuner<boolean, EasyTuneBool> {

    private _myComponentsToIgnore: Component[];

    constructor(componentsToIgnore: Component[], object: Object3D, variableName: string, setAsWidgetCurrentVariable: boolean, useTuneTarget: boolean, engine?: Readonly<WonderlandEngine>) {
        super(object, variableName, setAsWidgetCurrentVariable, useTuneTarget, engine);

        this._myComponentsToIgnore = componentsToIgnore;
    }

    protected override _getVariableNamePrefix(): string {
        return "Active ";
    }

    protected override _createEasyTuneVariable(variableName: string): EasyTuneBool {
        return new EasyTuneBool(variableName, this._getDefaultValue(), null, true, undefined, this._myEngine);
    }

    protected override _getObjectValue(object: Readonly<Object3D>): boolean {
        let active = false;

        const components = object.pp_getComponents();
        for (const component of components) {
            if (!this._myComponentsToIgnore.pp_hasEqual(component) && component.active) {
                active = true;
                break;
            }
        }

        return active;
    }

    protected override _getDefaultValue(): boolean {
        return true;
    }

    protected override _areValueEqual(first: boolean, second: boolean): boolean {
        return first == second;
    }

    protected override _updateObjectValue(object: Object3D, value: boolean): void {
        const componentToIgnoreState = new Map();

        for (const componentToIgnore of this._myComponentsToIgnore) {
            componentToIgnoreState.set(componentToIgnore, componentToIgnore.active);
        }

        object.pp_setActive(value);

        for (const [componentToIgnore, active] of componentToIgnoreState.entries()) {
            componentToIgnore.active = active;
        }
    }

    protected override canUpdate(): boolean {
        const easyTuneVariable = this.getEasyTuneVariable();
        return easyTuneVariable == null || easyTuneVariable.isWidgetCurrentVariable();
    }
}
import { Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { EasyTuneVariables } from "./easy_tune_variables.js";
import { EasyTuneWidget } from "./easy_tune_widgets/easy_tune_widget.js";

const _myEasyTuneVariablesList: WeakMap<Readonly<WonderlandEngine>, EasyTuneVariables> = new WeakMap();
const _myEasyTuneTargets: WeakMap<Readonly<WonderlandEngine>, Object3D> = new WeakMap();
const _myEasyTuneWidgets: WeakMap<Readonly<WonderlandEngine>, EasyTuneWidget> = new WeakMap();

export function getEasyTuneVariables(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): EasyTuneVariables | null {
    if (engine == null) return null;

    const easyTuneVariables = _myEasyTuneVariablesList.get(engine);
    return easyTuneVariables != null ? easyTuneVariables : null;
}

export function setEasyTuneVariables(easyTuneVariables: EasyTuneVariables, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myEasyTuneVariablesList.set(engine, easyTuneVariables);
    }
}

export function removeEasyTuneVariables(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myEasyTuneVariablesList.delete(engine);
    }
}

export function hasEasyTuneVariables(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myEasyTuneVariablesList.has(engine) : false;
}

export function getEasyTuneTarget(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Object3D | null {
    if (engine == null) return null;

    const easyTuneTarget = _myEasyTuneTargets.get(engine);
    return easyTuneTarget != null ? easyTuneTarget : null;
}

export function setEasyTuneTarget(easyTuneTarget: Object3D, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myEasyTuneTargets.set(engine, easyTuneTarget);
    }
}

export function removeEasyTuneTarget(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myEasyTuneTargets.delete(engine);
    }
}

export function hasEasyTuneTarget(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myEasyTuneTargets.has(engine) : false;
}

export function getEasyTuneWidget(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): EasyTuneWidget | null {
    if (engine == null) return null;

    const easyTuneWidget = _myEasyTuneWidgets.get(engine);
    return easyTuneWidget != null ? easyTuneWidget : null;
}

export function setEasyTuneWidget(easyTuneWidget: EasyTuneWidget, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myEasyTuneWidgets.set(engine, easyTuneWidget);
    }
}

export function removeEasyTuneWidget(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myEasyTuneWidgets.delete(engine);
    }
}

export function hasEasyTuneWidget(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myEasyTuneWidgets.has(engine) : false;
}
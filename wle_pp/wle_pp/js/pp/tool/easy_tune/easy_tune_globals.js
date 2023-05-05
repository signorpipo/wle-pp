import { Globals } from "../../pp/globals";

let _myEasyTuneVariablesList = new WeakMap();
let _myEasyTuneTargets = new WeakMap();

export function getEasyTuneVariables(engine = Globals.getMainEngine()) {
    return _myEasyTuneVariablesList.get(engine);
}

export function setEasyTuneVariables(easyTuneVariables, engine = Globals.getMainEngine()) {
    _myEasyTuneVariablesList.set(engine, easyTuneVariables);
}

export function removeEasyTuneVariables(engine = Globals.getMainEngine()) {
    _myEasyTuneVariablesList.delete(engine);
}

export function hasEasyTuneVariables(engine = Globals.getMainEngine()) {
    return _myEasyTuneVariablesList.has(engine);
}

export function getEasyTuneTarget(engine = Globals.getMainEngine()) {
    return _myEasyTuneTargets.get(engine);
}

export function setEasyTuneTarget(easyTuneTarget, engine = Globals.getMainEngine()) {
    _myEasyTuneTargets.set(engine, easyTuneTarget);
}

export function removeEasyTuneTarget(engine = Globals.getMainEngine()) {
    _myEasyTuneTargets.delete(engine);
}

export function hasEasyTuneTarget(engine = Globals.getMainEngine()) {
    return _myEasyTuneTargets.has(engine);
}
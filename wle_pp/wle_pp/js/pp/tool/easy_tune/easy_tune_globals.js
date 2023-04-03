let _myEasyTuneVariablesList = new WeakMap();
let _myEasyTuneTargets = new WeakMap();

export function getEasyTuneVariables(engine = getMainEngine()) {
    return _myEasyTuneVariablesList.get(engine);
}

export function setEasyTuneVariables(easyTuneVariables, engine = getMainEngine()) {
    _myEasyTuneVariablesList.set(engine, easyTuneVariables);
}

export function removeEasyTuneVariables(engine = getMainEngine()) {
    _myEasyTuneVariablesList.delete(engine);
}

export function hasEasyTuneVariables(engine = getMainEngine()) {
    return _myEasyTuneVariablesList.has(engine);
}

export function getEasyTuneTarget(engine = getMainEngine()) {
    return _myEasyTuneTargets.get(engine);
}

export function setEasyTuneTarget(easyTuneTarget, engine = getMainEngine()) {
    _myEasyTuneTargets.set(engine, easyTuneTarget);
}

export function removeEasyTuneTarget(engine = getMainEngine()) {
    _myEasyTuneTargets.delete(engine);
}

export function hasEasyTuneTarget(engine = getMainEngine()) {
    return _myEasyTuneTargets.has(engine);
}
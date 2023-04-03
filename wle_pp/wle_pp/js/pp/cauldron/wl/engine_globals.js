let _myMainEngine = null;
let _myEngines = [];

export function initEngine(engine) {
    if (engine != null) {
        addEngine(engine);
        if (getMainEngine() == null) {
            setMainEngine(engine);
        }
    }
}

export function getMainEngine() {
    return _myMainEngine;
}

export function setMainEngine(engine) {
    if (hasEngine(engine)) {
        _myMainEngine = engine;
    }
}

export function getEngines() {
    return _myEngines;
}

export function addEngine(engine) {
    removeEngine(engine);
    _myEngines.push(engine);
}

export function removeEngine(engine) {
    let index = _myEngines.indexOf(engine);

    if (index >= 0) {
        _myEngines.splice(index, 1);
    }
}

export function hasEngine(engine) {
    return _myEngines.indexOf(engine) >= 0;
}
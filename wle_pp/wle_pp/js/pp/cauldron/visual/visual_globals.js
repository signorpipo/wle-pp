import { getMainEngine } from "../wl/engine_globals";

let _myVisualDatas = new WeakMap();
let _myVisualManagers = new WeakMap();

export function getVisualData(engine = getMainEngineinEngine()) {
    return _myVisualDatas.get(engine);
}

export function setVisualData(visualData, engine = getMainEngine()) {
    _myVisualDatas.set(engine, visualData);
}

export function removeVisualData(engine = getMainEngine()) {
    _myVisualDatas.delete(engine);
}

export function hasVisualData(engine = getMainEngine()) {
    return _myVisualDatas.has(engine);
}

export function getVisualManager(engine = getMainEngine()) {
    return _myVisualManagers.get(engine);
}

export function setVisualManager(visualManager, engine = getMainEngine()) {
    _myVisualManagers.set(engine, visualManager);
}

export function removeVisualManager(engine = getMainEngine()) {
    _myVisualManagers.delete(engine);
}

export function hasVisualManager(engine = getMainEngine()) {
    return _myVisualManagers.has(engine);
}
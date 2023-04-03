import { getMainEngine } from "../../cauldron/wl/engine_globals";

let _myConsoleVRs = new WeakMap();

export function getConsoleVR(engine = getMainEngine()) {
    return _myConsoleVRs.get(engine);
}

export function setConsoleVR(consoleVR, engine = getMainEngine()) {
    _myConsoleVRs.set(engine, consoleVR);
}

export function removeConsoleVR(engine = getMainEngine()) {
    _myConsoleVRs.delete(engine);
}

export function hasConsoleVR(engine = getMainEngine()) {
    return _myConsoleVRs.has(engine);
}
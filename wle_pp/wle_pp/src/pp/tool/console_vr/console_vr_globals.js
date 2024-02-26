import { Globals } from "../../pp/globals.js";

let _myConsoleVRs = new WeakMap();

export function getConsoleVR(engine = Globals.getMainEngine()) {
    return _myConsoleVRs.get(engine);
}

export function setConsoleVR(consoleVR, engine = Globals.getMainEngine()) {
    _myConsoleVRs.set(engine, consoleVR);
}

export function removeConsoleVR(engine = Globals.getMainEngine()) {
    _myConsoleVRs.delete(engine);
}

export function hasConsoleVR(engine = Globals.getMainEngine()) {
    return _myConsoleVRs.has(engine);
}
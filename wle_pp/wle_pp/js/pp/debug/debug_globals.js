import { Globals } from "../pp/globals";

let _myDebugManagers = new WeakMap();
let _myDebugEnableds = new WeakMap();

export function getDebugManager(engine = Globals.getMainEngine()) {
    return _myDebugManagers.get(engine);
}

export function setDebugManager(debugManager, engine = Globals.getMainEngine()) {
    _myDebugManagers.set(engine, debugManager);
}

export function removeDebugManager(engine = Globals.getMainEngine()) {
    _myDebugManagers.delete(engine);
}

export function hasDebugManager(engine = Globals.getMainEngine()) {
    return _myDebugManagers.has(engine);
}

export function getDebugVisualManager(engine = Globals.getMainEngine()) {
    let debugManager = getDebugManager(engine);

    if (debugManager != null) {
        return debugManager.getDebugVisualManager();
    }

    return null;
}

export function isDebugEnabled(engine = Globals.getMainEngine()) {
    return _myDebugEnableds.get(engine);
}

export function setDebugEnabled(debugEnabled, engine = Globals.getMainEngine()) {
    _myDebugEnableds.set(engine, debugEnabled);
}

export function removeDebugEnabled(engine = Globals.getMainEngine()) {
    _myDebugEnableds.delete(engine);
}

export function hasDebugEnabled(engine = Globals.getMainEngine()) {
    return _myDebugEnableds.has(engine);
}
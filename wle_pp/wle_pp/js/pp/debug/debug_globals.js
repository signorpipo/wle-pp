import { getMainEngine } from "../cauldron/wl/engine_globals";

let _myDebugManagers = new WeakMap();
let _myDebugEnableds = new WeakMap();

export function getDebugManager(engine = getMainEngine()) {
    return _myDebugManagers.get(engine);
}

export function setDebugManager(debugManager, engine = getMainEngine()) {
    _myDebugManagers.set(engine, debugManager);
}

export function removeDebugManager(engine = getMainEngine()) {
    _myDebugManagers.delete(engine);
}

export function hasDebugManager(engine = getMainEngine()) {
    return _myDebugManagers.has(engine);
}

export function getDebugVisualManager(engine = getMainEngine()) {
    let debugManager = getDebugManager(engine);
    if (debugManager != null) {
        return debugManager.getDebugVisualManager();
    }

    return null;
}

export function isDebugEnabled(engine = getMainEngine()) {
    return _myDebugEnableds.get(engine);
}

export function setDebugEnabled(debugEnabled, engine = getMainEngine()) {
    _myDebugEnableds.set(engine, debugEnabled);
}

export function removeDebugEnabled(engine = getMainEngine()) {
    _myDebugEnableds.delete(engine);
}

export function hasDebugEnabled(engine = getMainEngine()) {
    return _myDebugEnableds.has(engine);
}
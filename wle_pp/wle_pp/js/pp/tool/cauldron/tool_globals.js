import { getMainEngine } from "../../cauldron/wl/engine_globals";

let _myToolEnableds = new WeakMap();

export function isToolEnabled(engine = getMainEngine()) {
    return _myToolEnableds.get(engine);
}

export function setToolEnabled(toolEnabled, engine = getMainEngine()) {
    _myToolEnableds.set(engine, toolEnabled);
}

export function removeToolEnabled(engine = getMainEngine()) {
    _myToolEnableds.delete(engine);
}

export function hasToolEnabled(engine = getMainEngine()) {
    return _myToolEnableds.has(engine);
}
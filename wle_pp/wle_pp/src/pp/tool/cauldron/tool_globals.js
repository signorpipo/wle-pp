import { Globals } from "../../pp/globals.js";

let _myToolEnableds = new WeakMap();

export function isToolEnabled(engine = Globals.getMainEngine()) {
    return _myToolEnableds.get(engine);
}

export function setToolEnabled(toolEnabled, engine = Globals.getMainEngine()) {
    _myToolEnableds.set(engine, toolEnabled);
}

export function removeToolEnabled(engine = Globals.getMainEngine()) {
    _myToolEnableds.delete(engine);
}

export function hasToolEnabled(engine = Globals.getMainEngine()) {
    return _myToolEnableds.has(engine);
}
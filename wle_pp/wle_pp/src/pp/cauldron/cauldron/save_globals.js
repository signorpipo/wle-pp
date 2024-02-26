import { Globals } from "../../pp/globals.js";

let _mySaveManagers = new WeakMap();

export function getSaveManager(engine = Globals.getMainEngine()) {
    return _mySaveManagers.get(engine);
}

export function setSaveManager(saveManager, engine = Globals.getMainEngine()) {
    _mySaveManagers.set(engine, saveManager);
}

export function removeSaveManager(engine = Globals.getMainEngine()) {
    _mySaveManagers.delete(engine);
}

export function hasSaveManager(engine = Globals.getMainEngine()) {
    return _mySaveManagers.has(engine);
}
import { Globals } from "../../pp/globals";

let _myObjectPoolManagers = new WeakMap();

export function getObjectPoolManager(engine = Globals.getMainEngine()) {
    return _myObjectPoolManagers.get(engine);
}

export function setObjectPoolManager(audioManager, engine = Globals.getMainEngine()) {
    _myObjectPoolManagers.set(engine, audioManager);
}

export function removeObjectPoolManager(engine = Globals.getMainEngine()) {
    _myObjectPoolManagers.delete(engine);
}

export function hasObjectPoolManager(engine = Globals.getMainEngine()) {
    return _myObjectPoolManagers.has(engine);
}
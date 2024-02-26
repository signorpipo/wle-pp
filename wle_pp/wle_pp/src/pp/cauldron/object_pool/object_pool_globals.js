import { Globals } from "../../pp/globals.js";

let _myObjectPoolManagers = new WeakMap();

export function getObjectPoolManager(engine = Globals.getMainEngine()) {
    return _myObjectPoolManagers.get(engine);
}

export function setObjectPoolManager(objectPoolManager, engine = Globals.getMainEngine()) {
    _myObjectPoolManagers.set(engine, objectPoolManager);
}

export function removeObjectPoolManager(engine = Globals.getMainEngine()) {
    _myObjectPoolManagers.delete(engine);
}

export function hasObjectPoolManager(engine = Globals.getMainEngine()) {
    return _myObjectPoolManagers.has(engine);
}
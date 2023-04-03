import { getMainEngine } from "../cauldron/wl/engine_globals";

let _myPlayerObjectsContainer = new WeakMap();

export function getPlayerObjects(engine = getMainEngine()) {
    return _myPlayerObjectsContainer.get(engine);
}

export function setPlayerObjects(playerObjects, engine = getMainEngine()) {
    _myPlayerObjectsContainer.set(engine, playerObjects);
}

export function removePlayerObjects(engine = getMainEngine()) {
    _myPlayerObjectsContainer.delete(engine);
}

export function hasPlayerObjects(engine = getMainEngine()) {
    return _myPlayerObjectsContainer.has(engine);
}
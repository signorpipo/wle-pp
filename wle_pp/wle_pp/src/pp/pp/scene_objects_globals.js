import { Globals } from "./globals";

let _mySceneObjectsContainer = new WeakMap();

export function getSceneObjects(engine = Globals.getMainEngine()) {
    return _mySceneObjectsContainer.get(engine);
}

export function setSceneObjects(sceneObjects, engine = Globals.getMainEngine()) {
    _mySceneObjectsContainer.set(engine, sceneObjects);
}

export function removeSceneObjects(engine = Globals.getMainEngine()) {
    _mySceneObjectsContainer.delete(engine);
}

export function hasSceneObjects(engine = Globals.getMainEngine()) {
    return _mySceneObjectsContainer.has(engine);
}

export function getPlayerObjects(engine = Globals.getMainEngine()) {
    let sceneObjects = getSceneObjects(engine);

    if (sceneObjects != null) {
        return sceneObjects.myPlayerObjects;
    }

    return null;
}
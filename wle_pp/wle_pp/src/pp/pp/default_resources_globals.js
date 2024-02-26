import { Globals } from "./globals";

let _myDefaultResourcesContainer = new WeakMap();

export function getDefaultResources(engine = Globals.getMainEngine()) {
    return _myDefaultResourcesContainer.get(engine);
}

export function setDefaultResources(defaultResources, engine = Globals.getMainEngine()) {
    _myDefaultResourcesContainer.set(engine, defaultResources);
}

export function removeDefaultResources(engine = Globals.getMainEngine()) {
    _myDefaultResourcesContainer.delete(engine);
}

export function hasDefaultResources(engine = Globals.getMainEngine()) {
    return _myDefaultResourcesContainer.has(engine);
}

export function getDefaultMeshes(engine = Globals.getMainEngine()) {
    let defaultResources = getDefaultResources(engine);

    if (defaultResources != null) {
        return defaultResources.myMeshes;
    }

    return null;
}

export function getDefaultMaterials(engine = Globals.getMainEngine()) {
    let defaultResources = getDefaultResources(engine);

    if (defaultResources != null) {
        return defaultResources.myMaterials;
    }

    return null;
}
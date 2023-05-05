import { Globals } from "../../pp/globals";

let _myVisualResourcesContainer = new WeakMap();
let _myVisualManagers = new WeakMap();

export function getVisualResources(engine = Globals.getMainEngineinEngine()) {
    return _myVisualResourcesContainer.get(engine);
}

export function setVisualResources(visualResources, engine = Globals.getMainEngine()) {
    _myVisualResourcesContainer.set(engine, visualResources);
}

export function removeVisualResources(engine = Globals.getMainEngine()) {
    _myVisualResourcesContainer.delete(engine);
}

export function hasVisualResources(engine = Globals.getMainEngine()) {
    return _myVisualResourcesContainer.has(engine);
}

export function getVisualManager(engine = Globals.getMainEngine()) {
    return _myVisualManagers.get(engine);
}

export function setVisualManager(visualManager, engine = Globals.getMainEngine()) {
    _myVisualManagers.set(engine, visualManager);
}

export function removeVisualManager(engine = Globals.getMainEngine()) {
    _myVisualManagers.delete(engine);
}

export function hasVisualManager(engine = Globals.getMainEngine()) {
    return _myVisualManagers.has(engine);
}
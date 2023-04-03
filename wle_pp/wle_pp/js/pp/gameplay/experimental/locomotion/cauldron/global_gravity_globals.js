import { getMainEngine } from "../../../../cauldron/wl/engine_globals";

let _myGlobalGravityAccelerations = new WeakMap();
let _myGlobalGravityDirections = new WeakMap();

export function getGlobalGravityAcceleration(engine = getMainEngine()) {
    return _myGlobalGravityAccelerations.get(engine);
}

export function setGlobalGravityAcceleration(globalGravityAcceleration, engine = getMainEngine()) {
    _myGlobalGravityAccelerations.set(engine, globalGravityAcceleration);
}

export function removeGlobalGravityAcceleration(engine = getMainEngine()) {
    _myGlobalGravityAccelerations.delete(engine);
}

export function hasGlobalGravityAcceleration(engine = getMainEngine()) {
    return _myGlobalGravityAccelerations.has(engine);
}

export function getGlobalGravityDirection(engine = getMainEngine()) {
    return _myGlobalGravityDirections.get(engine);
}

export function setGlobalGravityDirection(globalGravityDirection, engine = getMainEngine()) {
    _myGlobalGravityDirections.set(engine, globalGravityDirection);
}

export function removeGlobalGravityDirection(engine = getMainEngine()) {
    _myGlobalGravityDirections.delete(engine);
}

export function hasGlobalGravityDirection(engine = getMainEngine()) {
    return _myGlobalGravityDirections.has(engine);
}
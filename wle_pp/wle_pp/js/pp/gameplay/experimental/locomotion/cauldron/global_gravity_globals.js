import { Globals } from "../../../../pp/globals";

let _myGlobalGravityAccelerations = new WeakMap();
let _myGlobalGravityDirections = new WeakMap();

function getGlobalGravityAcceleration(engine = Globals.getMainEngine()) {
    return _myGlobalGravityAccelerations.get(engine);
}

function setGlobalGravityAcceleration(globalGravityAcceleration, engine = Globals.getMainEngine()) {
    _myGlobalGravityAccelerations.set(engine, globalGravityAcceleration);
}

function removeGlobalGravityAcceleration(engine = Globals.getMainEngine()) {
    _myGlobalGravityAccelerations.delete(engine);
}

function hasGlobalGravityAcceleration(engine = Globals.getMainEngine()) {
    return _myGlobalGravityAccelerations.has(engine);
}

function getGlobalGravityDirection(engine = Globals.getMainEngine()) {
    return _myGlobalGravityDirections.get(engine);
}

function setGlobalGravityDirection(globalGravityDirection, engine = Globals.getMainEngine()) {
    _myGlobalGravityDirections.set(engine, globalGravityDirection);
}

function removeGlobalGravityDirection(engine = Globals.getMainEngine()) {
    _myGlobalGravityDirections.delete(engine);
}

function hasGlobalGravityDirection(engine = Globals.getMainEngine()) {
    return _myGlobalGravityDirections.has(engine);
}
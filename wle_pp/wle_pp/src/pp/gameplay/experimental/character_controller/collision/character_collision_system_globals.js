import { Globals } from "../../../../pp/globals.js";

let _myCharacterCollisionSystems = new WeakMap();

export function getCharacterCollisionSystem(engine = Globals.getMainEngine()) {
    return _myCharacterCollisionSystems.get(engine);
}

export function setCharacterCollisionSystem(characterCollisionSystem, engine = Globals.getMainEngine()) {
    _myCharacterCollisionSystems.set(engine, characterCollisionSystem);
}

export function removeCharacterCollisionSystem(engine = Globals.getMainEngine()) {
    _myCharacterCollisionSystems.delete(engine);
}

export function hasCharacterCollisionSystem(engine = Globals.getMainEngine()) {
    return _myCharacterCollisionSystems.has(engine);
}
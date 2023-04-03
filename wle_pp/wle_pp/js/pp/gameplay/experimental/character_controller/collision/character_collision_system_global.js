let _myCharacterCollisionSystems = new WeakMap();

export function getCharacterCollisionSystem(engine = getMainEngine()) {
    return _myCharacterCollisionSystems.get(engine);
}

export function setCharacterCollisionSystem(characterCollisionSystem, engine = getMainEngine()) {
    _myCharacterCollisionSystems.set(engine, characterCollisionSystem);
}

export function removeCharacterCollisionSystem(engine = getMainEngine()) {
    _myCharacterCollisionSystems.delete(engine);
}

export function hasCharacterCollisionSystem(engine = getMainEngine()) {
    return _myCharacterCollisionSystems.has(engine);
}
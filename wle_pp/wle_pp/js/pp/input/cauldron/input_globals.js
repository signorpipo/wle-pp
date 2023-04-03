import { getMainEngine } from "../../cauldron/wl/engine_globals";

let _myInputManagers = new WeakMap();

export function getInputManager(engine = getMainEngine()) {
    return _myInputManagers.get(engine);
}

export function setInputManager(inputManager, engine = getMainEngine()) {
    _myInputManagers.set(engine, inputManager);
}

export function removeInputManager(engine = getMainEngine()) {
    _myInputManagers.delete(engine);
}

export function hasInputManager(engine = getMainEngine()) {
    return _myInputManagers.has(engine);
}

export function getMouse(engine = getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getMouse();
    }

    return null;
}

export function getKeyboard(engine = getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getKeyboard();
    }

    return null;
}

export function getGamepadsManager(engine = getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getGamepadsManager();
    }

    return null;
}

export function getGamepads(engine = getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getGamepadsManager().getGamepads();
    }

    return null;
}

export function getLeftGamepad(engine = getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getGamepadsManager().getLeftGamepad();
    }

    return null;
}

export function getRightGamepad(engine = getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getGamepadsManager().getRightGamepad();
    }

    return null;
}
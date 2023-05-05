import { Globals } from "../../pp/globals";

let _myInputManagers = new WeakMap();
let _myPoseForwardFixeds = new WeakMap();

export function getInputManager(engine = Globals.getMainEngine()) {
    return _myInputManagers.get(engine);
}

export function setInputManager(inputManager, engine = Globals.getMainEngine()) {
    _myInputManagers.set(engine, inputManager);
}

export function removeInputManager(engine = Globals.getMainEngine()) {
    _myInputManagers.delete(engine);
}

export function hasInputManager(engine = Globals.getMainEngine()) {
    return _myInputManagers.has(engine);
}

export function getMouse(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getMouse();
    }

    return null;
}

export function getKeyboard(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getKeyboard();
    }

    return null;
}

// Gamepad

export function getGamepadsManager(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getGamepadsManager();
    }

    return null;
}

export function getGamepad(handedness, engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getGamepadsManager().getGamepad(handedness);
    }

    return null;
}

export function getGamepads(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getGamepadsManager().getGamepads();
    }

    return null;
}

export function getLeftGamepad(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getGamepadsManager().getLeftGamepad();
    }

    return null;
}

export function getRightGamepad(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getGamepadsManager().getRightGamepad();
    }

    return null;
}

// Pose

export function getHeadPose(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getHeadPose();
    }

    return null;
}

export function getHandPose(handedness, engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getHandPose(handedness);
    }

    return null;
}

export function getHandPoses(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getHandPoses();
    }

    return null;
}

export function getLeftHandPose(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getLeftHandPose();
    }

    return null;
}

export function getRightHandPose(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getRightHandPose();
    }

    return null;
}

export function getTrackedHandPose(handedness, engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getTrackedHandPose(handedness);
    }

    return null;
}

export function getTrackedHandPoses(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getTrackedHandPoses();
    }

    return null;
}

export function getLeftTrackedHandPose(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getLeftTrackedHandPose();
    }

    return null;
}

export function getRightTrackedHandPose(engine = Globals.getMainEngine()) {
    let inputManager = getInputManager(engine);
    if (inputManager != null) {
        return inputManager.getRightTrackedHandPose();
    }

    return null;
}

// Pose Forward Fixed

export function isPoseForwardFixed(engine = Globals.getMainEngine()) {
    return _myPoseForwardFixeds.get(engine);
}

export function setPoseForwardFixed(toolEnabled, engine = Globals.getMainEngine()) {
    _myPoseForwardFixeds.set(engine, toolEnabled);
}

export function removePoseForwardFixed(engine = Globals.getMainEngine()) {
    _myPoseForwardFixeds.delete(engine);
}

export function hasPoseForwardFixed(engine = Globals.getMainEngine()) {
    return _myPoseForwardFixeds.has(engine);
}
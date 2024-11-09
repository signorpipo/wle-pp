import { WonderlandEngine } from "@wonderlandengine/api";
import { GamepadsManager } from "../../input/gamepad/cauldron/gamepads_manager.js";
import { HandPose } from "../../input/pose/hand_pose.js";
import { HeadPose } from "../../input/pose/head_pose.js";
import { TrackedHandPose } from "../../input/pose/tracked_hand_pose.js";
import { Globals } from "../../pp/globals.js";
import { Gamepad } from "../gamepad/gamepad.js";
import { HandRayPose } from "../pose/hand_ray_pose.js";
import { InputManager } from "./input_manager.js";
import { Handedness } from "./input_types.js";
import { Keyboard } from "./keyboard.js";
import { Mouse } from "./mouse.js";

const _myInputManagers: WeakMap<Readonly<WonderlandEngine>, InputManager> = new WeakMap();
const _myPoseForwardFixeds: WeakMap<Readonly<WonderlandEngine>, boolean> = new WeakMap();

export function getInputManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): InputManager | null {
    if (engine == null) return null;

    const inputManager = _myInputManagers.get(engine);
    return inputManager != null ? inputManager : null;
}

export function setInputManager(inputManager: InputManager, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myInputManagers.set(engine, inputManager);
    }
}

export function removeInputManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myInputManagers.delete(engine);
    }
}

export function hasInputManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myInputManagers.has(engine) : false;
}

export function getMouse(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Mouse | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getMouse();
    }

    return null;
}

export function getKeyboard(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Keyboard | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getKeyboard();
    }

    return null;
}

// Gamepad

export function getGamepadsManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): GamepadsManager | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getGamepadsManager();
    }

    return null;
}

export function getGamepad(handedness: Handedness, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Gamepad | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getGamepadsManager().getGamepad(handedness);
    }

    return null;
}

export function getGamepads(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Record<Handedness, Gamepad> | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getGamepadsManager().getGamepads();
    }

    return null;
}

export function getLeftGamepad(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Gamepad | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getGamepadsManager().getLeftGamepad();
    }

    return null;
}

export function getRightGamepad(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Gamepad | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getGamepadsManager().getRightGamepad();
    }

    return null;
}

// Pose

export function getHeadPose(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): HeadPose | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getHeadPose();
    }

    return null;
}

export function getHandPose(handedness: Handedness, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): HandPose | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getHandPose(handedness);
    }

    return null;
}

export function getHandPoses(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Record<Handedness, HandPose> | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getHandPoses();
    }

    return null;
}

export function getLeftHandPose(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): HandPose | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getLeftHandPose();
    }

    return null;
}

export function getRightHandPose(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): HandPose | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getRightHandPose();
    }

    return null;
}

export function getHandRayPose(handedness: Handedness, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): HandRayPose | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getHandRayPose(handedness);
    }

    return null;
}

export function getHandRayPoses(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Record<Handedness, HandRayPose> | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getHandRayPoses();
    }

    return null;
}

export function getLeftHandRayPose(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): HandRayPose | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getLeftHandRayPose();
    }

    return null;
}

export function getRightHandRayPose(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): HandRayPose | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getRightHandRayPose();
    }

    return null;
}

export function getTrackedHandPose(handedness: Handedness, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): TrackedHandPose | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getTrackedHandPose(handedness);
    }

    return null;
}

export function getTrackedHandPoses(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Record<Handedness, TrackedHandPose> | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getTrackedHandPoses();
    }

    return null;
}

export function getLeftTrackedHandPose(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): TrackedHandPose | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getLeftTrackedHandPose();
    }

    return null;
}

export function getRightTrackedHandPose(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): TrackedHandPose | null {
    const inputManager = getInputManager(engine);

    if (inputManager != null) {
        return inputManager.getRightTrackedHandPose();
    }

    return null;
}

// Pose Forward Fixed

export function isPoseForwardFixed(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? !!_myPoseForwardFixeds.get(engine) : false;
}

export function setPoseForwardFixed(toolEnabled: boolean, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myPoseForwardFixeds.set(engine, toolEnabled);
    }
}

export function removePoseForwardFixed(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myPoseForwardFixeds.delete(engine);
    }
}

export function hasPoseForwardFixed(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myPoseForwardFixeds.has(engine) : false;
}
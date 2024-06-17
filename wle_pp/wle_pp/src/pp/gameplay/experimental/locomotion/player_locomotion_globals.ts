import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { PlayerLocomotionComponent } from "./legacy/locomotion/components/player_locomotion_component.js";
import { PlayerHeadManager } from "./legacy/locomotion/player_head_manager.js";
import { PlayerLocomotion } from "./legacy/locomotion/player_locomotion.js";
import { PlayerLocomotionRotate } from "./legacy/locomotion/player_locomotion_rotate.js";
import { PlayerLocomotionSmooth } from "./legacy/locomotion/player_locomotion_smooth.js";
import { PlayerObscureManager } from "./legacy/locomotion/player_obscure_manager.js";
import { PlayerTransformManager } from "./legacy/locomotion/player_transform_manager.js";
import { PlayerLocomotionTeleport } from "./legacy/locomotion/teleport/player_locomotion_teleport.js";

const _myPlayerLocomotionComponents: WeakMap<Readonly<WonderlandEngine>, PlayerLocomotionComponent> = new WeakMap();

export function getPlayerLocomotionComponent(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): PlayerLocomotionComponent | null {
    if (engine == null) return null;

    return _myPlayerLocomotionComponents.get(engine) ?? null;
}

export function setPlayerLocomotionComponent(playerLocomotionComponent: PlayerLocomotionComponent, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myPlayerLocomotionComponents.set(engine, playerLocomotionComponent);
    }
}

export function removePlayerLocomotionComponent(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myPlayerLocomotionComponents.delete(engine);
    }
}

export function hasPlayerLocomotionComponent(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myPlayerLocomotionComponents.has(engine) : false;
}

export function getPlayerLocomotion(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): PlayerLocomotion | null {
    const playerLocomotionComponent = getPlayerLocomotionComponent(engine);

    if (playerLocomotionComponent != null) {
        return playerLocomotionComponent.getPlayerLocomotion();
    }

    return null;
}

export function getPlayerHeadManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): PlayerHeadManager | null {
    const playerLocomotion = getPlayerLocomotion(engine);

    if (playerLocomotion != null) {
        return playerLocomotion.getPlayerHeadManager();
    }

    return null;
}

export function getPlayerTransformManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): PlayerTransformManager | null {
    const playerLocomotion = getPlayerLocomotion(engine);

    if (playerLocomotion != null) {
        return playerLocomotion.getPlayerTransformManager();
    }

    return null;
}

export function getPlayerLocomotionSmooth(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): PlayerLocomotionSmooth | null {
    const playerLocomotion = getPlayerLocomotion(engine);

    if (playerLocomotion != null) {
        return playerLocomotion.getPlayerLocomotionSmooth();
    }

    return null;
}

export function getPlayerLocomotionTeleport(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): PlayerLocomotionTeleport | null {
    const playerLocomotion = getPlayerLocomotion(engine);

    if (playerLocomotion != null) {
        return playerLocomotion.getPlayerLocomotionTeleport();
    }

    return null;
}

export function getPlayerLocomotionRotate(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): PlayerLocomotionRotate | null {
    const playerLocomotion = getPlayerLocomotion(engine);

    if (playerLocomotion != null) {
        return playerLocomotion.getPlayerLocomotionRotate();
    }

    return null;
}

export function getPlayerObscureManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): PlayerObscureManager | null {
    const playerLocomotion = getPlayerLocomotion(engine);

    if (playerLocomotion != null) {
        return playerLocomotion.getPlayerObscureManager();
    }

    return null;
}
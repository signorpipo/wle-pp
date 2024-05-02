import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../../../pp/globals.js";
import { CharacterCollisionSystem } from "./character_collision_system.js";

const _myCharacterCollisionSystems: WeakMap<Readonly<WonderlandEngine>, CharacterCollisionSystem> = new WeakMap();

export function getCharacterCollisionSystem(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): CharacterCollisionSystem | null {
    if (engine == null) return null;

    const characterCollisionSystem = _myCharacterCollisionSystems.get(engine);
    return characterCollisionSystem != null ? characterCollisionSystem : null;
}

export function setCharacterCollisionSystem(characterCollisionSystem: CharacterCollisionSystem, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myCharacterCollisionSystems.set(engine, characterCollisionSystem);
    }
}

export function removeCharacterCollisionSystem(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myCharacterCollisionSystems.delete(engine);
    }
}

export function hasCharacterCollisionSystem(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myCharacterCollisionSystems.has(engine) : false;
}
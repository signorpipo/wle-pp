import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { ObjectPoolManager } from "./object_pool_manager.js";

const _myObjectPoolManagers: WeakMap<Readonly<WonderlandEngine>, ObjectPoolManager> = new WeakMap();

export function getObjectPoolManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): ObjectPoolManager | null {
    if (engine == null) return null;

    const objectPoolManager = _myObjectPoolManagers.get(engine);
    return objectPoolManager != null ? objectPoolManager : null;
}

export function setObjectPoolManager(objectPoolManager: ObjectPoolManager, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myObjectPoolManagers.set(engine, objectPoolManager);
    }
}

export function removeObjectPoolManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myObjectPoolManagers.delete(engine);
    }
}

export function hasObjectPoolManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myObjectPoolManagers.has(engine) : false;
}
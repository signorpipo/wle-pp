import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { SaveManager } from "./save_manager.js";

const _mySaveManagers: WeakMap<Readonly<WonderlandEngine>, SaveManager> = new WeakMap();

export function getSaveManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): SaveManager | null {
    if (engine == null) return null;

    const saveManager = _mySaveManagers.get(engine);
    return saveManager != null ? saveManager : null;
}

export function setSaveManager(saveManager: SaveManager, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _mySaveManagers.set(engine, saveManager);
    }
}

export function removeSaveManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _mySaveManagers.delete(engine);
    }
}

export function hasSaveManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _mySaveManagers.has(engine) : false;
}
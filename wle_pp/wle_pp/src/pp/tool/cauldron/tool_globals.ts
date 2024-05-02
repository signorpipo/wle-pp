import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";

const _myToolEnableds: WeakMap<Readonly<WonderlandEngine>, boolean> = new WeakMap();

export function isToolEnabled(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean | null {
    if (engine == null) return null;

    const toolEnabled = _myToolEnableds.get(engine);
    return toolEnabled != null ? toolEnabled : null;
}

export function setToolEnabled(toolEnabled: boolean, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myToolEnableds.set(engine, toolEnabled);
    }
}

export function removeToolEnabled(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myToolEnableds.delete(engine);
    }
}

export function hasToolEnabled(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myToolEnableds.has(engine) : false;
}
import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { ConsoleVR } from "./console_vr.js";

const _myConsoleVRs: WeakMap<Readonly<WonderlandEngine>, ConsoleVR> = new WeakMap();

export function getConsoleVR(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): ConsoleVR | null {
    if (engine == null) return null;

    const consoleVR = _myConsoleVRs.get(engine);
    return consoleVR != null ? consoleVR : null;
}

export function setConsoleVR(consoleVR: ConsoleVR, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myConsoleVRs.set(engine, consoleVR);
    }
}

export function removeConsoleVR(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myConsoleVRs.delete(engine);
    }
}

export function hasConsoleVR(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myConsoleVRs.has(engine) : false;
}
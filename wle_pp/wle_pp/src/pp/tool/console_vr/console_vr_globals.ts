import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { ConsoleVR } from "./console_vr.js";
import { ConsoleVRWidget } from "./console_vr_widget.js";

const _myConsoleVRs: WeakMap<Readonly<WonderlandEngine>, ConsoleVR> = new WeakMap();
const _myConsoleVRWidgets: WeakMap<Readonly<WonderlandEngine>, ConsoleVRWidget> = new WeakMap();

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

export function getConsoleVRWidget(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): ConsoleVRWidget | null {
    if (engine == null) return null;

    const consoleVRWidget = _myConsoleVRWidgets.get(engine);
    return consoleVRWidget != null ? consoleVRWidget : null;
}

export function setConsoleVRWidget(consoleVRWidget: ConsoleVRWidget, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myConsoleVRWidgets.set(engine, consoleVRWidget);
    }
}

export function removeConsoleVRWidget(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myConsoleVRWidgets.delete(engine);
    }
}

export function hasConsoleVRWidget(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myConsoleVRWidgets.has(engine) : false;
}
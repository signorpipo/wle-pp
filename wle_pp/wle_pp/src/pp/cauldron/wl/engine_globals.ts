import { Physics, Scene, WASM, WonderlandEngine, XRSessionState } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";

let _myMainEngine: WonderlandEngine | null = null;
const _myEngines: WonderlandEngine[] = [];

export function getMainEngine(): WonderlandEngine | null {
    return _myMainEngine;
}

export function setMainEngine(engine: WonderlandEngine): void {
    if (!hasEngine(engine)) {
        addEngine(engine);
    }

    _myMainEngine = engine;
}

export function removeMainEngine(): void {
    _myMainEngine = null;
}

export function getEngines(): WonderlandEngine[] {
    return _myEngines;
}

export function addEngine(engine: WonderlandEngine): void {
    removeEngine(engine);
    _myEngines.push(engine);
}

export function removeEngine(engine: Readonly<WonderlandEngine>): void {
    const index = _myEngines.indexOf(engine as WonderlandEngine);

    if (index >= 0) {
        _myEngines.splice(index, 1);

        if (getMainEngine() == engine) {
            removeMainEngine();
        }
    }
}

export function hasEngine(engine: Readonly<WonderlandEngine>): boolean {
    return _myEngines.indexOf(engine as WonderlandEngine) >= 0;
}

export function getScene(): Scene | null;
export function getScene(engine: Readonly<WonderlandEngine>): Scene;
export function getScene(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Scene | null {
    let scene = null;

    if (engine != null) {
        scene = engine.scene;
    }

    return scene;
}

export function getPhysics(): Physics | null;
export function getPhysics(engine: Readonly<WonderlandEngine>): Physics;
export function getPhysics(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Physics | null {
    let physics = null;

    if (engine != null) {
        physics = engine.physics;
    }

    return physics;
}

export function getCanvas(): HTMLCanvasElement | null;
export function getCanvas(engine: Readonly<WonderlandEngine>): HTMLCanvasElement;
export function getCanvas(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): HTMLCanvasElement | null {
    let canvas = null;

    if (engine != null) {
        canvas = engine.canvas;
    }

    return canvas;
}

export function getWASM(): WASM | null;
export function getWASM(engine: Readonly<WonderlandEngine>): WASM;
export function getWASM(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): WASM | null {
    let wasm = null;

    if (engine != null) {
        wasm = engine.wasm;
    }

    return wasm;
}

export function getXR(): XRSessionState | null;
export function getXR(engine: Readonly<WonderlandEngine>): XRSessionState;
export function getXR(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): XRSessionState | null {
    let xr = null;

    if (engine != null) {
        xr = engine.xr;
    }

    return xr;
}
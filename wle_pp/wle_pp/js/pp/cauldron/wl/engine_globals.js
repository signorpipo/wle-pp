import { SceneUtils } from "./utils/scene_utils";

let _myMainEngine = null;
let _myEngines = [];

export function initEngine(engine) {
    if (engine != null) {
        addEngine(engine);
        if (getMainEngine() == null) {
            setMainEngine(engine);
        }
    }
}

export function getMainEngine() {
    return _myMainEngine;
}

export function setMainEngine(engine) {
    if (hasEngine(engine)) {
        _myMainEngine = engine;
    }
}

export function getEngines() {
    return _myEngines;
}

export function addEngine(engine) {
    removeEngine(engine);
    _myEngines.push(engine);
}

export function removeEngine(engine) {
    let index = _myEngines.indexOf(engine);

    if (index >= 0) {
        _myEngines.splice(index, 1);
    }
}

export function hasEngine(engine) {
    return _myEngines.indexOf(engine) >= 0;
}

export function getScene(engine = getMainEngine()) {
    let scene = null;

    if (engine != null) {
        scene = engine.scene;
    }

    return scene;
}

export function getRoot(engine = getMainEngine()) {
    let root = null;

    let scene = getScene(engine);
    if (scene != null) {
        root = SceneUtils.getRoot(scene);
    }

    return root;
}

export function getPhysics(engine = getMainEngine()) {
    let physics = null;

    if (engine != null) {
        physics = engine.physics;
    }

    return physics;
}

export function getCanvas(engine = getMainEngine()) {
    let canvas = null;

    if (engine != null) {
        canvas = engine.canvas;
    }

    return canvas;
}

export function getWASM(engine = getMainEngine()) {
    let wasm = null;

    if (engine != null) {
        wasm = engine.wasm;
    }

    return wasm;
}

export function getXR(engine = getMainEngine()) {
    let xr = null;

    if (engine != null) {
        xr = engine.xr;
    }

    return xr;
}
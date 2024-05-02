import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { VisualManager } from "./visual_manager.js";
import { VisualResources } from "./visual_resources.js";

const _myVisualManagers: WeakMap<Readonly<WonderlandEngine>, VisualManager> = new WeakMap();
const _myVisualResourcesMap: WeakMap<Readonly<WonderlandEngine>, VisualResources> = new WeakMap();

export function getVisualManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): VisualManager | null {
    if (engine == null) return null;

    const visualManager = _myVisualManagers.get(engine);
    return visualManager != null ? visualManager : null;
}

export function setVisualManager(visualManager: VisualManager, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myVisualManagers.set(engine, visualManager);
    }
}

export function removeVisualManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myVisualManagers.delete(engine);
    }
}

export function hasVisualManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myVisualManagers.has(engine) : false;
}

export function getVisualResources(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): VisualResources | null {
    if (engine == null) return null;

    const visualResources = _myVisualResourcesMap.get(engine);
    return visualResources != null ? visualResources : null;
}

export function setVisualResources(visualResources: VisualResources, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myVisualResourcesMap.set(engine, visualResources);
    }
}

export function removeVisualResources(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myVisualResourcesMap.delete(engine);
    }
}

export function hasVisualResources(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myVisualResourcesMap.has(engine) : false;
}
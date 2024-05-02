import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { AnalyticsManager } from "./analytics_manager.js";

const _myAnalyticsManagers: WeakMap<Readonly<WonderlandEngine>, AnalyticsManager> = new WeakMap();

export function getAnalyticsManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): AnalyticsManager | null {
    if (engine == null) return null;

    const analyticsManager = _myAnalyticsManagers.get(engine);
    return analyticsManager != null ? analyticsManager : null;
}

export function setAnalyticsManager(analyticsManager: AnalyticsManager, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myAnalyticsManagers.set(engine, analyticsManager);
    }
}

export function removeAnalyticsManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myAnalyticsManagers.delete(engine);
    }
}

export function hasAnalyticsManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myAnalyticsManagers.has(engine) : false;
}
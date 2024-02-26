import { Globals } from "../../pp/globals.js";

let _myAnalyticsManagers = new WeakMap();

export function getAnalyticsManager(engine = Globals.getMainEngine()) {
    return _myAnalyticsManagers.get(engine);
}

export function setAnalyticsManager(analyticsManager, engine = Globals.getMainEngine()) {
    _myAnalyticsManagers.set(engine, analyticsManager);
}

export function removeAnalyticsManager(engine = Globals.getMainEngine()) {
    _myAnalyticsManagers.delete(engine);
}

export function hasAnalyticsManager(engine = Globals.getMainEngine()) {
    return _myAnalyticsManagers.has(engine);
}
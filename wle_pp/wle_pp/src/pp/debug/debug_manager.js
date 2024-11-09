import { Globals } from "../pp/globals.js";
import { DebugVisualManager } from "./debug_visual_manager.js";

export class DebugManager {

    constructor(engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._myDebugVisualManager = new DebugVisualManager(this._myEngine);

        this._myActive = true;
        this._myDestroyed = false;
    }

    getDebugVisualManager() {
        return this._myDebugVisualManager;
    }

    start() {
        this._myDebugVisualManager.start();
    }

    update(dt) {
        if (!this._myActive) return;

        this._myDebugVisualManager.update(dt);
    }

    setActive(active) {
        active = active && Globals.isDebugEnabled(this._myEngine);

        if (this._myActive != active) {
            this._myActive = active;
        }

        this._myDebugVisualManager.setActive(active);
    }

    isActive() {
        return this._myActive;
    }

    destroy() {
        this._myDestroyed = true;

        this.setActive(false);

        this._myDebugVisualManager.destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
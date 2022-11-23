PP.DebugManager = class DebugManager {
    constructor() {
        this._myDebugVisualManager = new PP.DebugVisualManager();
    }

    getDebugVisualManager() {
        return this._myDebugVisualManager;
    }

    start() {
        this._myDebugVisualManager.start();
    }

    update(dt) {
        this._myDebugVisualManager.update(dt);
    }
};
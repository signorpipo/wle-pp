import { Component, Property } from "@wonderlandengine/api";
import { getDebugManager, hasDebugManager, removeDebugManager, setDebugManager } from "../debug_globals";
import { DebugManager } from "../debug_manager";

export class DebugManagerComponent extends Component {
    static TypeName = "pp-debug-manager";
    static Properties = {};

    init() {
        this._myDebugManager = null;

        // Prevents double global from same engine
        if (!hasDebugManager(this.engine)) {
            this._myDebugManager = new DebugManager(this.engine);

            setDebugManager(this._myDebugManager, this.engine);
        }
    }

    start() {
        if (this._myDebugManager != null) {
            this._myDebugManager.start();
        }
    }

    update(dt) {
        if (this._myDebugManager != null) {
            this._myDebugManager.update(dt);
        }
    }

    onDestroy() {
        if (this._myDebugManager != null && getDebugManager(this.engine) == this._myDebugManager) {
            removeDebugManager(this.engine);
        }
    }
}
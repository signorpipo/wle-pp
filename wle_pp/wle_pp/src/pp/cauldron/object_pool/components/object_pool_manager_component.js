import { Component } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { ObjectPoolManager } from "../object_pool_manager.js";

export class ObjectPoolManagerComponent extends Component {
    static TypeName = "pp-object-pools-manager";

    init() {
        this._myObjectPoolManager = null;

        // Prevents double global from same engine
        if (!Globals.hasObjectPoolManager(this.engine)) {
            this._myObjectPoolManager = new ObjectPoolManager();

            Globals.setObjectPoolManager(this._myObjectPoolManager, this.engine);
        }
    }

    onDestroy() {
        if (this._myObjectPoolManager != null && Globals.getObjectPoolManager(this.engine) == this._myObjectPoolManager) {
            Globals.removeObjectPoolManager(this.engine);
        }
    }
}
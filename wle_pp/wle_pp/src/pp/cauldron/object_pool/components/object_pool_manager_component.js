import { Component } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { ObjectPoolManager } from "../object_pool_manager.js";

export class ObjectPoolManagerComponent extends Component {
    static TypeName = "pp-object-pools-manager";

    start() {
        this._myObjectPoolManager = new ObjectPoolManager();
    }

    onActivate() {
        if (!Globals.hasObjectPoolManager(this.engine)) {
            Globals.setObjectPoolManager(this._myObjectPoolManager, this.engine);
        }
    }

    onDeactivate() {
        if (this._myObjectPoolManager != null) {
            this._myObjectPoolManager.releaseAll();

            if (Globals.getObjectPoolManager(this.engine) == this._myObjectPoolManager) {
                Globals.removeObjectPoolManager(this.engine);
            }
        }
    }

    onDestroy() {
        if (this._myObjectPoolManager != null) {
            this._myObjectPoolManager.destroy();
        }
    }
}
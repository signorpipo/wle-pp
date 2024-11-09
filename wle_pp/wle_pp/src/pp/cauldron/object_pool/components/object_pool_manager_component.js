import { Component } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { ObjectPoolManager } from "../object_pool_manager.js";

export class ObjectPoolManagerComponent extends Component {
    static TypeName = "pp-object-pools-manager";

    init() {
        this._myObjectPoolManager = new ObjectPoolManager();
    }

    onActivate() {
        if (!Globals.hasObjectPoolManager(this.engine)) {
            Globals.setObjectPoolManager(this._myObjectPoolManager, this.engine);
        }
    }

    onDeactivate() {
        if (Globals.getObjectPoolManager(this.engine) == this._myObjectPoolManager) {
            this._myObjectPoolManager.releaseAll();

            Globals.removeObjectPoolManager(this.engine);
        }
    }

    onDestroy() {
        this._myObjectPoolManager.destroy();
    }
}
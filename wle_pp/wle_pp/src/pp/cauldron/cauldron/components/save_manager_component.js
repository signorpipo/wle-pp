import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { SaveManager } from "../save_manager.js";

export class SaveManagerComponent extends Component {
    static TypeName = "pp-save-manager";
    static Properties = {
        _mySaveID: Property.string(""),
        _myAutoLoadSaves: Property.bool(true)
    };

    init() {
        this._mySaveManager = null;

        if (this._mySaveID.length > 0) {
            this._mySaveManager = new SaveManager(this._mySaveID, this._myAutoLoadSaves, this.engine);
        }
    }

    update(dt) {
        if (this._mySaveManager != null && Globals.getSaveManager(this.engine) == this._mySaveManager) {
            this._mySaveManager.update(dt);
        }
    }

    onActivate() {
        if (this._mySaveManager != null && !Globals.hasSaveManager(this.engine)) {
            this._mySaveManager.setActive(true);

            Globals.setSaveManager(this._mySaveManager, this.engine);
        }
    }

    onDeactivate() {
        if (this._mySaveManager != null) {
            this._mySaveManager.setActive(false);

            if (Globals.getSaveManager(this.engine) == this._mySaveManager) {
                Globals.removeSaveManager(this.engine);
            }
        }
    }

    onDestroy() {
        if (this._mySaveManager != null) {
            this._mySaveManager.destroy();
        }
    }
}
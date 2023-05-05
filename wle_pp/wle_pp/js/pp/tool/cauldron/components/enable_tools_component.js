import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals";

export class EnableToolsComponent extends Component {
    static TypeName = "pp-enable-tools";
    static Properties = {
        _myEnable: Property.bool(true)
    };

    init() {
        this._myToolEnabled = null;

        // Prevents double global from same engine
        if (!Globals.hasToolEnabled(this.engine)) {
            this._myToolEnabled = this._myEnable;

            Globals.setToolEnabled(this._myToolEnabled, this.engine);
        }
    }

    onDestroy() {
        if (this._myToolEnabled != null && Globals.isToolEnabled(this.engine) == this._myToolEnabled) {
            Globals.removeToolEnabled(this.engine);
        }
    }
}
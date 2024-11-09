import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";

export class EnableToolComponent extends Component {
    static TypeName = "pp-enable-tools";
    static Properties = {
        _myEnable: Property.bool(true)
    };

    init() {
        this._myToolEnabled = this._myEnable;
    }

    onActivate() {
        if (!Globals.hasToolEnabled(this.engine)) {
            Globals.setToolEnabled(this._myToolEnabled, this.engine);
        }
    }

    onDeactivate() {
        if (Globals.isToolEnabled(this.engine) == this._myToolEnabled) {
            Globals.removeToolEnabled(this.engine);
        }
    }
}
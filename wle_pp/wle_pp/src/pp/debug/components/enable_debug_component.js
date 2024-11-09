import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";

export class EnableDebugComponent extends Component {
    static TypeName = "pp-enable-debug";
    static Properties = {
        _myEnable: Property.bool(true)
    };

    init() {
        this._myDebugEnabled = this._myEnable;
    }

    onActivate() {
        if (!Globals.hasDebugEnabled(this.engine)) {
            Globals.setDebugEnabled(this._myDebugEnabled, this.engine);
        }
    }

    onDeactivate() {
        if (Globals.isDebugEnabled(this.engine) == this._myDebugEnabled) {
            Globals.removeDebugEnabled(this.engine);
        }
    }
}
import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";

export class EnableDebugComponent extends Component {
    static TypeName = "pp-enable-debug";
    static Properties = {
        _myEnable: Property.bool(true)
    };

    start() {
        this._myHasDebugEnabled = this._myEnable;
        this._myDebugEnabled = this._myEnable;
    }

    onActivate() {
        if (this._myHasDebugEnabled) {
            Globals.setDebugEnabled(this._myDebugEnabled, this.engine);
        }
    }

    onDeactivate() {
        this._myHasDebugEnabled = Globals.hasDebugEnabled();
        this._myDebugEnabled = Globals.isDebugEnabled();
        Globals.removeDebugEnabled(this.engine);
    }
}
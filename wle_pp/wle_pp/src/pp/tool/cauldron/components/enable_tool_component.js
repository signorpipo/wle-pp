import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";

export class EnableToolComponent extends Component {
    static TypeName = "pp-enable-tool";
    static Properties = {
        _myEnable: Property.bool(true)
    };

    start() {
        this._myHasToolEnabled = this._myEnable;
        this._myToolEnabled = this._myEnable;
    }

    onActivate() {
        if (this._myHasToolEnabled) {
            Globals.setToolEnabled(this._myToolEnabled, this.engine);
        }
    }

    onDeactivate() {
        this._myHasToolEnabled = Globals.hasToolEnabled();
        this._myToolEnabled = Globals.isToolEnabled();
        Globals.removeToolEnabled(this.engine);
    }
}
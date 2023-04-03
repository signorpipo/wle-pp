import { Component, Property } from "@wonderlandengine/api";
import { hasToolEnabled, isToolEnabled, removeToolEnabled, setToolEnabled } from "../tool_globals";

export class EnableToolsComponent extends Component {
    static TypeName = "pp-enable-tools";
    static Properties = {
        _myEnable: Property.bool(true)
    };

    init() {
        this._myToolEnabled = null;

        // Prevents double global from same engine
        if (!hasToolEnabled(this.engine)) {
            this._myToolEnabled = this._myEnable;

            setToolEnabled(this._myToolEnabled, this.engine);
        }
    }

    onDestroy() {
        if (this._myToolEnabled != null && isToolEnabled(this.engine) == this._myToolEnabled) {
            removeToolEnabled(this.engine);
        }
    }
}
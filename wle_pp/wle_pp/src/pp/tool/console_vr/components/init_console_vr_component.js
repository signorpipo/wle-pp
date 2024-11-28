import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { ConsoleVR } from "../console_vr.js";

export class InitConsoleVRComponent extends Component {
    static TypeName = "pp-init-console-vr";
    static Properties = {
        _myInit: Property.bool(true)
    };

    start() {
        this._myConsoleVR = null;

        if (this._myInit) {
            this._myConsoleVR = new ConsoleVR(this.engine);
        }
    }

    onActivate() {
        if (this._myConsoleVR != null && !Globals.hasConsoleVR(this.engine)) {
            Globals.setConsoleVR(this._myConsoleVR, this.engine);
        }
    }

    onDeactivate() {
        if (this._myConsoleVR != null && Globals.getConsoleVR(this.engine) == this._myConsoleVR) {
            Globals.removeConsoleVR(this.engine);
        }
    }
}
import { Component, Property } from "@wonderlandengine/api";
import { ConsoleVR } from "../console_vr";
import { getConsoleVR, hasConsoleVR, removeConsoleVR, setConsoleVR } from "../console_vr_global";

export class InitConsoleVRComponent extends Component {
    static TypeName = "pp-init-console-vr";
    static Properties = {
        _myInit: Property.bool(true)
    };

    init() {
        this._myConsoleVR = null;

        if (this._myInit) {
            // Prevents double global from same engine
            if (!hasConsoleVR(this.engine)) {
                this._myConsoleVR = new ConsoleVR();

                setConsoleVR(this._myConsoleVR, this.engine);
            }
        }
    }

    onDestroy() {
        if (this._myConsoleVR != null && getConsoleVR(this.engine) == this._myConsoleVR) {
            removeConsoleVR(this.engine);
        }
    }
}
import { Component, Property } from "@wonderlandengine/api";
import { XRUtils } from "wle-pp/cauldron/utils/xr_utils.js";
import { Globals } from "../../../pp/globals.js";
import { ConsoleVRWidget, ConsoleVRWidgetParams } from "../console_vr_widget.js";

export class ConsoleVRToolComponent extends Component {
    static TypeName = "pp-console-vr-tool";
    static Properties = {
        _myHandedness: Property.enum(["None", "Left", "Right"], "None"),
        _myOverrideBrowserConsoleFunctions: Property.enum(["None", "All", "Errors & Warns"], "All"),
        _myEnableOnlyForVR: Property.bool(true),
        _myShowOnStart: Property.bool(false),
        _myShowVisibilityButton: Property.bool(false),
        _myFilterByError: Property.bool(false),
        _myPulseOnNewMessage: Property.enum(["Never", "Always", "When Hidden"], "Never")
    };

    _start() {
        this._myWidget = new ConsoleVRWidget(this.engine);

        let params = new ConsoleVRWidgetParams(this.engine);
        params.myHandedness = [null, "left", "right"][this._myHandedness];
        params.myOverrideBrowserConsoleFunctions = this._myOverrideBrowserConsoleFunctions;
        params.myShowOnStart = this._myShowOnStart;
        params.myShowVisibilityButton = this._myShowVisibilityButton;
        params.myFilterByError = this._myFilterByError;
        params.myPulseOnNewMessage = this._myPulseOnNewMessage;
        params.myPlaneMaterial = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
        params.myTextMaterial = Globals.getDefaultMaterials(this.engine).myText.clone();

        this._myWidget.start(this.object, params);

        this._myStarted = true;

        if (!Globals.hasConsoleVRWidget(this.engine)) {
            Globals.setConsoleVRWidget(this._myWidget, this.engine);
        }
    }

    update(dt) {
        if (Globals.isToolEnabled(this.engine) && (!Globals.hasConsoleVRWidget(this.engine) || Globals.getConsoleVRWidget(this.engine) == this._myWidget)) {
            if (!this._myStarted) {
                this._start();
            }

            if (!this._myEnableOnlyForVR || XRUtils.isSessionActive(this.engine)) {
                this._myWidget.setActive(true);
                this._myWidget.update(dt);
            } else {
                this._myWidget.setActive(false);
            }
        } else if (this._myStarted) {
            this._myWidget.setActive(false);
        }
    }

    onActivate() {
        if (this._myStarted) {
            if (!Globals.hasConsoleVRWidget(this.engine)) {
                Globals.setConsoleVRWidget(this._myWidget, this.engine);
            }
        }
    }

    onDeactivate() {
        if (this._myStarted) {
            this._myWidget.setActive(false);

            if (Globals.getConsoleVRWidget(this.engine) == this._myWidget) {
                Globals.removeConsoleVRWidget(this.engine);
            }
        }
    }

    onDestroy() {
        if (this._myStarted) {
            this._myWidget.destroy();
        }
    }
}
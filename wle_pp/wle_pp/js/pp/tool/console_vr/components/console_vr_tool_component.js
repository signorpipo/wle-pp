import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals";
import { ConsoleVRWidget, ConsoleVRWidgetParams } from "../console_vr_widget";
import { InitConsoleVRComponent } from "./init_console_vr_component";

export class ConsoleVRToolComponent extends Component {
    static TypeName = "pp-console-vr-tool";
    static Properties = {
        _myHandedness: Property.enum(["None", "Left", "Right"], "None"),
        _myOverrideBrowserConsole: Property.bool(true),
        _myShowOnStart: Property.bool(false),
        _myShowVisibilityButton: Property.bool(false),
        _myPulseOnNewMessage: Property.enum(["Never", "Always", "When Hidden"], "Never")
    };

    init() {
        // #TODO this should check for tool enabled but it might not have been initialized yet, not way to specify component order

        this.object.pp_addComponent(InitConsoleVRComponent);

        this._myWidget = new ConsoleVRWidget(this.engine);

        this._myStarted = false;
    }

    start() {
        if (Globals.isToolEnabled(this.engine)) {
            let params = new ConsoleVRWidgetParams(this.engine);
            params.myHandedness = [null, "left", "right"][this._myHandedness];
            params.myOverrideBrowserConsole = this._myOverrideBrowserConsole;
            params.myShowOnStart = this._myShowOnStart;
            params.myShowVisibilityButton = this._myShowVisibilityButton;
            params.myPulseOnNewMessage = this._myPulseOnNewMessage;
            params.myPlaneMaterial = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
            params.myTextMaterial = Globals.getDefaultMaterials(this.engine).myText.clone();

            this._myWidget.start(this.object, params);

            this._myWidgetVisibleBackup = this._myWidget.isVisible();
            this._mySetVisibleNextUpdate = false;

            this._myStarted = true;
        }
    }

    update(dt) {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myStarted) {
                if (this._mySetVisibleNextUpdate) {
                    this._mySetVisibleNextUpdate = false;
                    this._myWidget.setVisible(false);
                    this._myWidget.setVisible(this._myWidgetVisibleBackup);
                }


                this._myWidget.update(dt);
            }
        }
    }

    onActivate() {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myStarted) {
                this._mySetVisibleNextUpdate = true;
            }
        }
    }

    onDeactivate() {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myStarted) {
                this._myWidgetVisibleBackup = this._myWidget.isVisible();

                this._myWidget.setVisible(false);
            }
        }
    }

    onDestroy() {
        this._myWidget.destroy();
    }
}
import { Component, Property } from "@wonderlandengine/api";
import { getDefaultResources } from "../../../pp/default_resources_global";
import { isToolEnabled } from "../../cauldron/tool_globals";
import { ConsoleVRWidget, ConsoleVRWidgetAdditionalSetup } from "../console_vr_widget";
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
        if (isToolEnabled(this.engine)) {
            let additionalSetup = new ConsoleVRWidgetAdditionalSetup(this.engine);
            additionalSetup.myHandedness = [null, "left", "right"][this._myHandedness];
            additionalSetup.myOverrideBrowserConsole = this._myOverrideBrowserConsole;
            additionalSetup.myShowOnStart = this._myShowOnStart;
            additionalSetup.myShowVisibilityButton = this._myShowVisibilityButton;
            additionalSetup.myPulseOnNewMessage = this._myPulseOnNewMessage;
            additionalSetup.myPlaneMaterial = getDefaultResources(this.engine).myMaterials.myFlatOpaque.clone();
            additionalSetup.myTextMaterial = getDefaultResources(this.engine).myMaterials.myText.clone();

            this._myWidget.start(this.object, additionalSetup);

            this._myWidgetVisibleBackup = this._myWidget.isVisible();
            this._mySetVisibleNextUpdate = false;

            this._myStarted = true;
        }
    }

    update(dt) {
        if (isToolEnabled(this.engine)) {
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
        if (isToolEnabled(this.engine)) {
            if (this._myStarted) {
                this._mySetVisibleNextUpdate = true;
            }
        }
    }

    onDeactivate() {
        if (isToolEnabled(this.engine)) {
            if (this._myStarted) {
                this._myWidgetVisibleBackup = this._myWidget.isVisible();

                this._myWidget.setVisible(false);
            }
        }
    }
}
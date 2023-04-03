import { Component, Property } from "@wonderlandengine/api";
import { getDefaultResources } from "../../../pp/default_resources_global";
import { isToolEnabled } from "../../cauldron/tool_globals";
import { getEasyTuneVariables } from "../easy_tune_globals";
import { EasyTuneUtils } from "../easy_tune_utils";
import { EasyTuneWidget, EasyTuneWidgetAdditionalSetup } from "../easy_tune_widgets/easy_tune_widget";
import { InitEasyTuneVariablesComponent } from "./init_easy_tune_variables_component";

export class EasyTuneToolComponent extends Component {
    static TypeName = "pp-easy-tune-tool";
    static Properties = {
        _myHandedness: Property.enum(["None", "Left", "Right"], "None"),
        _myShowOnStart: Property.bool(false),
        _myShowVisibilityButton: Property.bool(false),
        _myGamepadScrollVariableEnabled: Property.bool(true),
        _myVariablesImportExportButtonsEnabled: Property.bool(false),
        _myVariablesImportURL: Property.string(""),   // The URL can contain parameters inside brackets, like {param}
        _myVariablesExportURL: Property.string(""),   // Those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
        _myImportVariablesOnStart: Property.bool(false),
        _myResetVariablesDefaultValueOnImport: Property.bool(false)
    };

    init() {
        // #TODO this should check for tool enabled but it might not have been initialized yet, not way to specify component order

        this.object.pp_addComponent(InitEasyTuneVariablesComponent);

        this._myWidget = new EasyTuneWidget(this.engine);

        EasyTuneUtils.addSetEasyTuneWidgetActiveVariableCallback(this, function (variableName) {
            this._myWidget.setActiveVariable(variableName);
        }.bind(this), this.engine);

        EasyTuneUtils.addRefreshEasyTuneWidgetCallback(this, function () {
            this._myWidget.refresh();
        }.bind(this), this.engine);

        this._myStarted = false;
    }

    start() {
        if (isToolEnabled(this.engine)) {
            let additionalSetup = new EasyTuneWidgetAdditionalSetup();
            additionalSetup.myHandedness = [null, "left", "right"][this._myHandedness];
            additionalSetup.myShowOnStart = this._myShowOnStart;
            additionalSetup.myShowVisibilityButton = this._myShowVisibilityButton;
            additionalSetup.myAdditionalButtonsEnabled = true;
            additionalSetup.myGamepadScrollVariableEnabled = this._myGamepadScrollVariableEnabled;
            additionalSetup.myPlaneMaterial = getDefaultResources(this.engine).myMaterials.myFlatOpaque.clone();
            additionalSetup.myTextMaterial = getDefaultResources(this.engine).myMaterials.myText.clone();

            additionalSetup.myVariablesImportExportButtonsEnabled = this._myVariablesImportExportButtonsEnabled;
            additionalSetup.myVariablesImportCallback = function (onSuccessCallback, onFailureCallback) {
                EasyTuneUtils.importEasyTuneVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport, onSuccessCallback, onFailureCallback, this.engine);
            }.bind(this);
            additionalSetup.myVariablesExportCallback = function (onSuccessCallback, onFailureCallback) {
                EasyTuneUtils.exportEasyTuneVariables(this._myVariablesExportURL, onSuccessCallback, onFailureCallback, this.engine);
            }.bind(this);

            this._myWidget.start(this.object, additionalSetup, getEasyTuneVariables(this.engine));

            this._myWidgetVisibleBackup = this._myWidget.isVisible();
            this._mySetVisibleNextUpdate = false;

            this._myStarted = true;
            this._myFirstUpdate = true;
        }
    }

    update(dt) {
        if (isToolEnabled(this.engine)) {
            if (this._myStarted) {
                if (this._myFirstUpdate) {
                    this._myFirstUpdate = false;
                    if (this._myImportVariablesOnStart) {
                        EasyTuneUtils.importEasyTuneVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport, undefined, undefined, this.engine);
                    }
                }

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
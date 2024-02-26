import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { EasyTuneUtils } from "../easy_tune_utils.js";
import { EasyTuneWidget, EasyTuneWidgetParams } from "../easy_tune_widgets/easy_tune_widget.js";
import { InitEasyTuneVariablesComponent } from "./init_easy_tune_variables_component.js";

export class EasyTuneToolComponent extends Component {
    static TypeName = "pp-easy-tune-tool";
    static Properties = {
        _myHandedness: Property.enum(["None", "Left", "Right"], "None"),
        _myShowOnStart: Property.bool(false),
        _myShowVisibilityButton: Property.bool(false),
        _myGamepadScrollVariableEnabled: Property.bool(true),

        _myShowVariablesImportExportButtons: Property.bool(false),
        _myVariablesImportURL: Property.string(""),   // The URL can contain parameters inside brackets, like {param}
        _myVariablesExportURL: Property.string(""),   // Those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
        _myImportVariablesOnStart: Property.bool(false),
        _myResetVariablesDefaultValueOnImport: Property.bool(false)
    };

    init() {
        // #TODO this should check for tool enabled but it might not have been initialized yet, not way to specify component order
        // It can't be moved to start either, because other components might call setWidgetCurrentVariable or refreshWidget during start, 
        // so it needs to be initialized before that

        this.object.pp_addComponent(InitEasyTuneVariablesComponent);

        this._myWidget = new EasyTuneWidget(this.engine);

        EasyTuneUtils.addSetWidgetCurrentVariableCallback(this, function (variableName) {
            this._myWidget.setCurrentVariable(variableName);
        }.bind(this), this.engine);

        EasyTuneUtils.addRefreshWidgetCallback(this, function () {
            this._myWidget.refresh();
        }.bind(this), this.engine);

        this._myStarted = false;
    }

    start() {
        if (Globals.isToolEnabled(this.engine)) {
            let params = new EasyTuneWidgetParams();
            params.myHandedness = [null, "left", "right"][this._myHandedness];
            params.myShowOnStart = this._myShowOnStart;
            params.myShowVisibilityButton = this._myShowVisibilityButton;
            params.myShowAdditionalButtons = true;
            params.myGamepadScrollVariableEnabled = this._myGamepadScrollVariableEnabled;
            params.myPlaneMaterial = Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();
            params.myTextMaterial = Globals.getDefaultMaterials(this.engine).myText.clone();

            params.myShowVariablesImportExportButtons = this._myShowVariablesImportExportButtons;
            params.myVariablesImportCallback = function (onSuccessCallback, onFailureCallback) {
                EasyTuneUtils.importVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport, true, onSuccessCallback, onFailureCallback, this.engine);
            }.bind(this);
            params.myVariablesExportCallback = function (onSuccessCallback, onFailureCallback) {
                EasyTuneUtils.exportVariables(this._myVariablesExportURL, onSuccessCallback, onFailureCallback, this.engine);
            }.bind(this);

            this._myWidget.start(this.object, params, Globals.getEasyTuneVariables(this.engine));

            this._myWidgetVisibleBackup = null;

            this._myStarted = true;
            this._myFirstUpdate = true;
        }
    }

    update(dt) {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myStarted) {
                if (this._myFirstUpdate) {
                    this._myFirstUpdate = false;
                    if (this._myImportVariablesOnStart) {
                        EasyTuneUtils.importVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport, false, undefined, undefined, this.engine);
                    }
                }

                if (this._myWidgetVisibleBackup != null) {
                    this._myWidget.setVisible(false);
                    this._myWidget.setVisible(this._myWidgetVisibleBackup);

                    this._myWidgetVisibleBackup = null;
                }

                this._myWidget.update(dt);
            }
        } else if (this._myStarted) {
            if (this._myWidgetVisibleBackup == null) {
                this._myWidgetVisibleBackup = this._myWidget.isVisible();
            }

            if (this._myWidget.isVisible()) {
                this._myWidget.setVisible(false);
            }
        }
    }

    onDeactivate() {
        if (this._myStarted) {
            if (this._myWidgetVisibleBackup == null) {
                this._myWidgetVisibleBackup = this._myWidget.isVisible();
            }

            if (this._myWidget.isVisible()) {
                this._myWidget.setVisible(false);
            }
        }
    }

    onDestroy() {
        this._myWidget.destroy();

        EasyTuneUtils.removeSetWidgetCurrentVariableCallback(this, this.engine);
        EasyTuneUtils.removeRefreshWidgetCallback(this, this.engine);
    }
}
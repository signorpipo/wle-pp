import { Component } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { GamepadButtonID } from "../../../input/gamepad/gamepad_buttons.js";
import { Globals } from "../../../pp/globals.js";
import { EasyTuneUtils } from "../easy_tune_utils.js";
import { EasyTuneWidget, EasyTuneWidgetParams } from "../easy_tune_widgets/easy_tune_widget.js";
import { InitEasyTuneVariablesComponent } from "./init_easy_tune_variables_component.js";

export class EasyTuneToolComponent extends Component {
    public static override TypeName = "pp-easy-tune-tool";

    @property.enum(["None", "Left", "Right"], "None")
    private readonly _myHandedness!: number;

    @property.bool(false)
    private readonly _myShowOnStart!: boolean;

    @property.bool(false)
    private readonly _myShowVisibilityButton!: boolean;

    @property.bool(true)
    private readonly _myGamepadScrollVariableEnabled!: boolean;


    @property.bool(false)
    private readonly _myShowVariablesImportExportButtons!: boolean;



    /**
     *  Can contain parameters inside brackets, like `my-url.com/{param}`,  
     *  which will be replaced with the same one on the current page url, like `www.currentpage.com/?param=2`   
     *  If empty, it will import from the clipboard
     */
    @property.string("")
    private readonly _myVariablesImportURL!: string;

    /**
     *  Can contain parameters inside brackets, like `my-url.com/{param}`,  
     *  which will be replaced with the same one on the current page url, like `www.currentpage.com/?param=2`   
     *  If empty, it will import from the clipboard
     */
    @property.string("")
    private readonly _myVariablesExportURL!: string;

    @property.bool(false)
    private readonly _myImportVariablesOnStart!: boolean;

    @property.bool(false)
    private readonly _myResetVariablesDefaultValueOnImport!: boolean;

    @property.bool(true)
    private readonly _myKeepImportVariablesOnExport!: boolean;

    @property.bool(true)
    private readonly _myAvoidExportingVariablesWithValueAsDefault!: boolean;

    private readonly _myWidget!: EasyTuneWidget;

    private _myStarted: boolean = false;
    private _myFirstUpdate: boolean = true;
    private _myWidgetVisibleBackup: boolean | null = null;

    public override init(): void {
        // #TODO this should check for tool enabled but it might not have been initialized yet, not way to specify component order
        // It can't be moved to start either, because other components might call setWidgetCurrentVariable or refreshWidget during start, 
        // so it needs to be initialized before that

        this.object.pp_addComponent(InitEasyTuneVariablesComponent);

        (this._myWidget as EasyTuneWidget) = new EasyTuneWidget(this.engine);

        EasyTuneUtils.addSetWidgetCurrentVariableCallback(this, (variableName: string) => { this._myWidget.setCurrentVariable(variableName); }, this.engine);

        EasyTuneUtils.addRefreshWidgetCallback(this, () => { this._myWidget.refresh(); }, this.engine);
    }

    public override start(): void {
        if (Globals.isToolEnabled(this.engine)) {
            const params = new EasyTuneWidgetParams();
            params.myHandedness = [null, "left", "right"][this._myHandedness];
            params.myShowOnStart = this._myShowOnStart;
            params.myShowVisibilityButton = this._myShowVisibilityButton;
            params.myShowAdditionalButtons = true;
            params.myGamepadScrollVariableEnabled = this._myGamepadScrollVariableEnabled;
            params.myPlaneMaterial = Globals.getDefaultMaterials(this.engine)!.myFlatOpaque!.clone();
            params.myTextMaterial = Globals.getDefaultMaterials(this.engine)!.myText!.clone();

            params.myShowVariablesImportExportButtons = this._myShowVariablesImportExportButtons;
            params.myVariablesImportCallback = function (this: EasyTuneToolComponent, onSuccessCallback?: () => void, onFailureCallback?: () => void) {
                EasyTuneUtils.importVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport, false, true, onSuccessCallback, onFailureCallback, this.engine);
            }.bind(this);
            params.myVariablesExportCallback = function (this: EasyTuneToolComponent, onSuccessCallback?: () => void, onFailureCallback?: () => void) {
                if (Globals.getLeftGamepad()!.getButtonInfo(GamepadButtonID.SQUEEZE).isPressed() &&
                    Globals.getLeftGamepad()!.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed() &&
                    Globals.getLeftGamepad()!.getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressed()) {

                    EasyTuneUtils.clearExportedVariables(this._myVariablesExportURL, onSuccessCallback, onFailureCallback, this.engine);
                } else if (this._myKeepImportVariablesOnExport) {
                    EasyTuneUtils.getImportVariablesJSON(this._myVariablesImportURL, (variablesToKeepJSON) => {
                        let variablesToKeep = null;
                        try {
                            variablesToKeep = JSON.parse(variablesToKeepJSON);
                        } catch (error) {
                            // Do nothing
                        }

                        EasyTuneUtils.exportVariables(this._myVariablesExportURL, this._myAvoidExportingVariablesWithValueAsDefault, variablesToKeep, onSuccessCallback, onFailureCallback, this.engine);
                    }, () => {
                        EasyTuneUtils.exportVariables(this._myVariablesExportURL, this._myAvoidExportingVariablesWithValueAsDefault, undefined, onSuccessCallback, onFailureCallback, this.engine);
                    }, this.engine);
                } else {
                    EasyTuneUtils.exportVariables(this._myVariablesExportURL, this._myAvoidExportingVariablesWithValueAsDefault, undefined, onSuccessCallback, onFailureCallback, this.engine);
                }
            }.bind(this);

            this._myWidget.start(this.object, params, Globals.getEasyTuneVariables(this.engine));

            this._myWidgetVisibleBackup = null;

            this._myStarted = true;
            this._myFirstUpdate = true;
        }
    }

    public override update(dt: number): void {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myStarted) {
                if (this._myFirstUpdate) {
                    this._myFirstUpdate = false;
                    if (this._myImportVariablesOnStart) {
                        EasyTuneUtils.importVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport, false, false, undefined, undefined, this.engine);
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

    public overrideonDeactivate(): void {
        if (this._myStarted) {
            if (this._myWidgetVisibleBackup == null) {
                this._myWidgetVisibleBackup = this._myWidget.isVisible();
            }

            if (this._myWidget.isVisible()) {
                this._myWidget.setVisible(false);
            }
        }
    }

    public override onDestroy(): void {
        this._myWidget.destroy();

        EasyTuneUtils.removeSetWidgetCurrentVariableCallback(this, this.engine);
        EasyTuneUtils.removeRefreshWidgetCallback(this, this.engine);
    }
}
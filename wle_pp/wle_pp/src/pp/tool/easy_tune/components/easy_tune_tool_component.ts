import { Component, property } from "@wonderlandengine/api";
import { GamepadButtonID } from "../../../input/gamepad/gamepad_buttons.js";
import { Globals } from "../../../pp/globals.js";
import { EasyTuneUtils } from "../easy_tune_utils.js";
import { EasyTuneWidget, EasyTuneWidgetParams } from "../easy_tune_widgets/easy_tune_widget.js";

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

    private _start(): void {
        (this._myWidget as EasyTuneWidget) = new EasyTuneWidget(this.engine);

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
            if (Globals.getLeftGamepad()!.getButtonInfo(GamepadButtonID.SELECT).isPressed() &&
                Globals.getLeftGamepad()!.getButtonInfo(GamepadButtonID.SQUEEZE).isPressed() &&
                Globals.getLeftGamepad()!.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed() &&
                Globals.getLeftGamepad()!.getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressed() &&
                Globals.getLeftGamepad()!.getButtonInfo(GamepadButtonID.THUMBSTICK).isPressed()) {

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

        EasyTuneUtils.addSetWidgetCurrentVariableCallback(this, (variableName: string) => { this._myWidget.setCurrentVariable(variableName); }, this.engine);
        EasyTuneUtils.addRefreshWidgetCallback(this, () => { this._myWidget.refresh(); }, this.engine);

        this._myStarted = true;
        this._myFirstUpdate = true;

        if (!Globals.hasEasyTuneWidget(this.engine)) {
            Globals.setEasyTuneWidget(this._myWidget, this.engine);
        }
    }

    public override update(dt: number): void {
        if (Globals.isToolEnabled(this.engine) && (!Globals.hasEasyTuneWidget(this.engine) || Globals.getEasyTuneWidget(this.engine) == this._myWidget)) {
            if (this._myStarted) {
                if (this._myFirstUpdate) {
                    this._myFirstUpdate = false;
                    if (this._myImportVariablesOnStart) {
                        EasyTuneUtils.importVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport, false, false, undefined, undefined, this.engine);
                    }
                }

                this._myWidget.setActive(true);
                this._myWidget.update(dt);
            } else {
                this._start();
            }
        } else if (this._myStarted) {
            this._myWidget.setActive(false);
        }
    }

    public override onActivate(): void {
        if (this._myStarted) {
            if (!Globals.hasEasyTuneWidget(this.engine)) {
                Globals.setEasyTuneWidget(this._myWidget, this.engine);
            }

            EasyTuneUtils.addSetWidgetCurrentVariableCallback(this, (variableName: string) => { this._myWidget.setCurrentVariable(variableName); }, this.engine);
            EasyTuneUtils.addRefreshWidgetCallback(this, () => { this._myWidget.refresh(); }, this.engine);
        }
    }

    public override onDeactivate(): void {
        if (this._myStarted) {
            this._myWidget.setActive(false);

            EasyTuneUtils.removeSetWidgetCurrentVariableCallback(this, this.engine);
            EasyTuneUtils.removeRefreshWidgetCallback(this, this.engine);

            if (Globals.getEasyTuneWidget(this.engine) == this._myWidget) {
                Globals.removeEasyTuneWidget(this.engine);
            }
        }
    }

    public override onDestroy(): void {
        if (this._myStarted) {
            this._myWidget.destroy();
        }
    }
}
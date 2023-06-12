import { GamepadAxesID, GamepadButtonID } from "../../../input/gamepad/gamepad_buttons";
import { Globals } from "../../../pp/globals";
import { ToolHandedness } from "../../cauldron/tool_types";
import { WidgetFrame, WidgetParams } from "../../widget_frame/widget_frame";
import { EasyTuneVariableType } from "../easy_tune_variable_types";
import { EasyTuneBaseWidgetParams } from "./base/easy_tune_base_widget";
import { EasyTuneBoolArrayWidgetSelector } from "./bool/easy_tune_bool_array_widget_selector";
import { EasyTuneWidgetConfig } from "./easy_tune_widget_config";
import { EasyTuneNoneWidget } from "./none/easy_tune_none_widget";
import { EasyTuneNumberArrayWidgetSelector } from "./number/easy_tune_number_widget_selector";
import { EasyTuneTransformWidget } from "./transform/easy_tune_transform_widget";

export class EasyTuneWidgetParams extends WidgetParams {

    constructor() {
        super();

        this.myShowOnStart = false;
        this.myShowVisibilityButton = false;
        this.myShowAdditionalButtons = false;
        this.myGamepadScrollVariableEnabled = false;

        this.myShowVariablesImportExportButtons = false;
        this.myVariablesImportCallback = null;   // Signature: callback()
        this.myVariablesExportCallback = null;   // Signature: callback()
    }
}

export class EasyTuneWidget {

    constructor(engine = Globals.getMainEngine()) {
        this._myStarted = false;
        this._myStartVariable = null;

        this._myWidgetFrame = new WidgetFrame("E", 1, engine);
        this._myWidgetFrame.registerWidgetVisibleChangedEventListener(this, this._widgetVisibleChanged.bind(this));

        this._myConfig = new EasyTuneWidgetConfig();
        this._myParams = null;

        this._myWidgets = [];

        this._myEasyTuneVariables = null;
        this._myEasyTuneLastSize = 0;
        this._myVariableNames = null;

        this._myCurrentWidget = null;
        this._myCurrentVariable = null;

        this._myScrollVariableTimer = 0;

        this._myGamepad = null;

        this._myRefreshVariablesTimer = 0;

        this._myDirty = false;

        this._myEngine = engine;

        this._myDestroyed = false;
    }

    setCurrentVariable(variableName) {
        if (!this._myStarted) {
            this._myStartVariable = variableName;
        } else if (this._myEasyTuneVariables.has(variableName)) {
            this._myCurrentVariable = this._myEasyTuneVariables.getEasyTuneVariable(variableName);
            this._selectCurrentWidget();
        } else {
            console.log("Can't set easy tune active variable");
        }
    }

    refresh() {
        if (this._myWidgetFrame.isVisible()) {
            this._myDirty = true;
        }
    }

    setVisible(visible) {
        this._myWidgetFrame.setVisible(visible);
    }

    isVisible() {
        return this._myWidgetFrame.isVisible();
    }

    start(parentObject, params, easyTuneVariables) {
        this._myRightGamepad = Globals.getRightGamepad(this._myEngine);
        this._myLeftGamepad = Globals.getLeftGamepad(this._myEngine);
        if (this._myConfig.myGamepadHandedness == ToolHandedness.RIGHT) {
            this._myGamepad = this._myRightGamepad;
        } else if (this._myConfig.myGamepadHandedness == ToolHandedness.LEFT) {
            this._myGamepad = this._myLeftGamepad;
        }

        this._myStarted = true;

        this._myParams = params;

        this._myWidgetFrame.start(parentObject, params);

        this._myEasyTuneVariables = easyTuneVariables;
        this._myEasyTuneLastSize = this.getValidEasyTuneVariablesLength();
        this._myVariableNames = this.getValidEasyTuneVariablesNames();

        if (this.getValidEasyTuneVariablesLength() > 0) {
            this._myCurrentVariable = this._myEasyTuneVariables.getEasyTuneVariable(this._myVariableNames[0]);
        }

        if (this._myStartVariable) {
            if (this._myEasyTuneVariables.has(this._myStartVariable)) {
                this._myCurrentVariable = this._myEasyTuneVariables.getEasyTuneVariable(this._myStartVariable);
            } else {
                console.log("Can't set easy tune active variable");
            }
        }

        this._initializeWidgets();
    }

    update(dt) {
        this._myWidgetFrame.update(dt);

        if (this.getValidEasyTuneVariablesLength() != this._myEasyTuneLastSize || this._myDirty) {
            this._refreshEasyTuneVariables();
        }

        if (this._myWidgetFrame.isVisible() && this.getValidEasyTuneVariablesLength() > 0) {
            if (this._myConfig.myRefreshVariablesDelay != null) {
                this._myRefreshVariablesTimer += dt;
                if (this._myRefreshVariablesTimer > this._myConfig.myRefreshVariablesDelay) {
                    this._myRefreshVariablesTimer = 0;
                    this._refreshEasyTuneVariables();
                }
            }

            if (this._myCurrentWidget) {
                this._myCurrentWidget.update(dt);
            }

            if (this._myParams.myGamepadScrollVariableEnabled) {
                this._updateGamepadScrollVariable(dt);
            }
        }

        this._updateGamepadWidgetVisibility();

        this._updateWidgetCurrentVariable();
    }

    _initializeWidgets() {
        let widgetParams = new EasyTuneBaseWidgetParams();
        widgetParams.myVariablesImportCallback = this._importVariables.bind(this);
        widgetParams.myVariablesExportCallback = this._exportVariables.bind(this);

        this._myWidgets[EasyTuneVariableType.NONE] = new EasyTuneNoneWidget(widgetParams, this._myEngine);
        this._myWidgets[EasyTuneVariableType.NUMBER] = new EasyTuneNumberArrayWidgetSelector(widgetParams, this._myGamepad, this._myEngine);
        this._myWidgets[EasyTuneVariableType.BOOL] = new EasyTuneBoolArrayWidgetSelector(widgetParams, this._myGamepad, this._myEngine);
        this._myWidgets[EasyTuneVariableType.TRANSFORM] = new EasyTuneTransformWidget(widgetParams, this._myGamepad, this._myEngine);

        for (let widget of this._myWidgets) {
            if (widget != null) {
                widget.start(this._myWidgetFrame.getWidgetObject(), this._myParams);
                widget.setVisible(false);
                widget.registerScrollVariableRequestEventListener(this, this._scrollVariable.bind(this));
            }
        }

        this._selectCurrentWidget();
    }

    _selectCurrentWidget() {
        if (this.getValidEasyTuneVariablesLength() <= 0) {
            return;
        } else if (this._myCurrentVariable == null) {
            this._myVariableNames = this.getValidEasyTuneVariablesNames();
            this._myCurrentVariable = this._myEasyTuneVariables.getEasyTuneVariable(this._myVariableNames[0]);
        }

        let prevWidget = null;
        if (this._myCurrentWidget != null) {
            prevWidget = this._myCurrentWidget.getWidget();
        }

        if (this._myCurrentVariable.getType() in this._myWidgets) {
            this._myCurrentWidget = this._myWidgets[this._myCurrentVariable.getType()];
        } else {
            this._myCurrentWidget = this._myWidgets[EasyTuneVariableType.NONE];
        }

        this._myCurrentWidget.setEasyTuneVariable(this._myCurrentVariable, this._createIndexString());
        this._myCurrentWidget.getWidget().syncWidget(prevWidget);

        if (prevWidget != null) {
            prevWidget.setVisible(false);
        }

        this._myCurrentWidget.setVisible(this._myWidgetFrame.isVisible());
    }

    _refreshEasyTuneVariables() {
        this._myVariableNames = this.getValidEasyTuneVariablesNames();
        this._myEasyTuneLastSize = this.getValidEasyTuneVariablesLength();

        if (this.getValidEasyTuneVariablesLength() > 0) {
            if (this._myCurrentVariable && this._myVariableNames.pp_hasEqual(this._myCurrentVariable.getName())) {
                this._myCurrentVariable = this._myEasyTuneVariables.getEasyTuneVariable(this._myCurrentVariable.getName());
            } else {
                this._myCurrentVariable = this._myEasyTuneVariables.getEasyTuneVariable(this._myVariableNames[0]);
            }

            this._selectCurrentWidget();
        } else {
            this._myCurrentVariable = null;
            if (this._myCurrentWidget) {
                this._myCurrentWidget.setVisible(false);
                this._myCurrentWidget = null;
            }
        }

        this._myDirty = false;
    }

    _updateGamepadWidgetVisibility() {
        if (this._myGamepad) {
            if ((this._myGamepad.getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressStart() && this._myGamepad.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) ||
                (this._myGamepad.getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressStart() && this._myGamepad.getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressed())) {
                this._toggleVisibility();
            }
        }
    }

    _toggleVisibility() {
        this._myWidgetFrame.toggleVisibility();
    }

    _widgetVisibleChanged(visible) {
        for (let widget of this._myWidgets) {
            if (widget != null) {
                widget.setVisible(false);
            }
        }

        if (this._myCurrentWidget) {
            if (this.getValidEasyTuneVariablesLength() > 0) {
                this._myCurrentWidget.setVisible(visible);
            } else {
                this._myCurrentWidget.setVisible(false);
            }
        }

        if (visible) {
            this._refreshEasyTuneVariables();
        }
    }

    _updateGamepadScrollVariable(dt) {
        if (this._myGamepad && (!this._myConfig.myScrollVariableButtonID || this._myGamepad.getButtonInfo(this._myConfig.myScrollVariableButtonID).isPressed())) {
            let x = this._myGamepad.getAxesInfo(GamepadAxesID.THUMBSTICK).myAxes[0];
            let y = this._myGamepad.getAxesInfo(GamepadAxesID.THUMBSTICK).myAxes[1];
            if (Math.abs(x) > this._myConfig.myScrollVariableMinXThreshold && Math.abs(y) < this._myConfig.myScrollVariableMaxYThreshold) {
                this._myScrollVariableTimer += dt;
                while (this._myScrollVariableTimer > this._myConfig.myScrollVariableDelay) {
                    this._myScrollVariableTimer -= this._myConfig.myScrollVariableDelay;
                    this._scrollVariable(Math.sign(x));
                }
            } else {
                this._myScrollVariableTimer = this._myConfig.myScrollVariableDelay;
            }
        } else {
            this._myScrollVariableTimer = this._myConfig.myScrollVariableDelay;
        }
    }

    _scrollVariable(amount) {
        if (this.getValidEasyTuneVariablesLength() <= 0) {
            return;
        }

        let variableIndex = this._getVariableIndex(this._myCurrentVariable);
        if (variableIndex >= 0) {
            // Manage negative numbers
            let newIndex = (((variableIndex + amount) % this._myVariableNames.length) + this._myVariableNames.length) % this._myVariableNames.length;
            if (this._myEasyTuneVariables.has(this._myVariableNames[newIndex])) {
                this._myCurrentVariable = this._myEasyTuneVariables.getEasyTuneVariable(this._myVariableNames[newIndex]);
                this._selectCurrentWidget();
            } else {
                this._refreshEasyTuneVariables();
            }
        } else {
            this._refreshEasyTuneVariables();
        }
    }

    _createIndexString() {
        let indexString = " (";
        let index = (this._getVariableIndex(this._myCurrentVariable) + 1).toString();
        let length = (this.getValidEasyTuneVariablesLength()).toString();
        while (index.length < length.length) {
            index = "0".concat(index);
        }

        indexString = indexString.concat(index).concat(" - ").concat(length).concat(")");

        return indexString;
    }

    _getVariableIndex(variable) {
        let variableIndex = this._myVariableNames.indexOf(variable.getName());
        return variableIndex;
    }

    _updateWidgetCurrentVariable() {
        for (let variable of this._myEasyTuneVariables.getEasyTuneVariablesList()) {
            variable.setWidgetCurrentVariable(false);
        }

        if (this._myWidgetFrame.isVisible() && this._myCurrentVariable) {
            this._myCurrentVariable.setWidgetCurrentVariable(true);
        }
    }

    _importVariables() {
        this._myParams.myVariablesImportCallback(this._onImportSuccess.bind(this), this._onImportFailure.bind(this));
    }

    _exportVariables() {
        this._myParams.myVariablesExportCallback(this._onExportSuccess.bind(this), this._onExportFailure.bind(this));
    }

    _onImportSuccess() {
        if (this._myCurrentWidget) {
            this._myCurrentWidget.onImportSuccess();
        }
    }

    _onImportFailure() {
        if (this._myCurrentWidget) {
            this._myCurrentWidget.onImportFailure();
        }
    }

    _onExportSuccess() {
        if (this._myCurrentWidget) {
            this._myCurrentWidget.onExportSuccess();
        }
    }

    _onExportFailure() {
        if (this._myCurrentWidget) {
            this._myCurrentWidget.onExportFailure();
        }
    }

    destroy() {
        this._myDestroyed = true;

        for (let widget of this._myWidgets) {
            widget.destroy();
        }

        this._myWidgetFrame.destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }


    getValidEasyTuneVariablesLength() {
        return this.getValidEasyTuneVariablesNames().length;
    }

    getValidEasyTuneVariablesNames() {
        let names = this._myEasyTuneVariables.getEasyTuneVariablesNames();

        let validNames = [];
        for (let name of names) {
            let variable = this._myEasyTuneVariables.getEasyTuneVariable(name);
            if (variable.shouldShowOnWidget()) {
                validNames.push(name);
            }
        }

        return validNames;
    }
}
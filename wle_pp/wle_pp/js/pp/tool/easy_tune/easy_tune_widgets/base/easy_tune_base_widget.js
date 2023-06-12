import { Emitter } from "@wonderlandengine/api";
import { Timer } from "../../../../cauldron/cauldron/timer";

export class EasyTuneBaseWidgetParams {

    constructor() {
        this.myVariablesImportCallback = null;   // Signature: callback()
        this.myVariablesExportCallback = null;   // Signature: callback()
    }
}

export class EasyTuneBaseWidget {

    constructor(params) {
        this._myConfig = null;
        this._myUI = null;

        this._myParams = params;

        this._myVariable = null;

        this._myVisible = true;

        this._myScrollVariableRequestEmitter = new Emitter();     // Signature: listener(scrollAmount)

        this._myAppendToVariableName = "";

        this._myScrollVariableActive = false;
        this._myScrollDirection = 0;
        this._myScrollVariableTimer = 0;
        this._myHasScrolled = false;

        this._myResetImportLabelTimer = new Timer(0, false);
        this._myResetExportLabelTimer = new Timer(0, false);

        this._myDestroyed = false;

    }

    setVisible(visible) {
        if (visible) {
            this._refreshUI();
        }

        this._myUI.setVisible(visible);

        this._myVisible = visible;
    }

    setEasyTuneVariable(variable, appendToVariableName) {
        this._myVariable = variable;

        if ((typeof appendToVariableName) !== undefined) {
            this._myAppendToVariableName = appendToVariableName;
        } else {
            this._myAppendToVariableName = "";
        }

        this._setEasyTuneVariableHook();

        this._refreshUI();
    }

    isScrollVariableActive() {
        return this._myScrollVariableActive;
    }

    getScrollVariableDirection() {
        return this._myScrollDirection;
    }

    setScrollVariableActive(active, scrollDirection) {
        this._myScrollVariableActive = active;
        this._myScrollDirection = scrollDirection;
        this._myScrollVariableTimer = this._myConfig.myScrollVariableDelay;
        this._myHasScrolled = false;
    }

    getWidget() {
        return this;
    }

    syncWidget(otherEasyTuneWidget) {
        if (otherEasyTuneWidget != null) {
            if (otherEasyTuneWidget._myResetImportLabelTimer.isRunning()) {
                this._myResetImportLabelTimer.start(otherEasyTuneWidget._myResetImportLabelTimer.getTimeLeft());
            } else {
                this._myResetImportLabelTimer.reset();
            }

            if (otherEasyTuneWidget._myResetExportLabelTimer.isRunning()) {
                this._myResetExportLabelTimer.start(otherEasyTuneWidget._myResetExportLabelTimer.getTimeLeft());
            } else {
                this._myResetExportLabelTimer.reset();
            }

            this._myUI.myImportButtonTextComponent.text = otherEasyTuneWidget._myUI.myImportButtonTextComponent.text;
            this._myUI.myExportButtonTextComponent.text = otherEasyTuneWidget._myUI.myExportButtonTextComponent.text;

            this.setScrollVariableActive(otherEasyTuneWidget.isScrollVariableActive(), otherEasyTuneWidget.getScrollVariableDirection());
        } else {
            this._myResetImportLabelTimer.reset();
            this._myUI.myImportButtonTextComponent.text = this._myConfig.myImportButtonText;

            this._myResetExportLabelTimer.reset();
            this._myUI.myExportButtonTextComponent.text = this._myConfig.myExportButtonText;
        }
    }

    onImportSuccess() {
        this._myUI.myImportButtonTextComponent.text = this._myConfig.myImportSuccessButtonText;
        this._myResetImportLabelTimer.start(this._myConfig.myImportExportResetLabelSeconds);
    }

    onImportFailure() {
        this._myUI.myImportButtonTextComponent.text = this._myConfig.myImportFailureButtonText;
        this._myResetImportLabelTimer.start(this._myConfig.myImportExportResetLabelSeconds);
    }

    onExportSuccess() {
        this._myUI.myExportButtonTextComponent.text = this._myConfig.myExportSuccessButtonText;
        this._myResetExportLabelTimer.start(this._myConfig.myImportExportResetLabelSeconds);
    }

    onExportFailure() {
        this._myUI.myExportButtonTextComponent.text = this._myConfig.myExportFailureButtonText;
        this._myResetExportLabelTimer.start(this._myConfig.myImportExportResetLabelSeconds);
    }

    registerScrollVariableRequestEventListener(id, listener) {
        this._myScrollVariableRequestEmitter.add(listener, { id: id });
    }

    unregisterScrollVariableRequestEventListener(id) {
        this._myScrollVariableRequestEmitter.remove(id);
    }

    start(parentObject, easyTuneParams) {
        this._myConfig.build();

        this._myResetImportLabelTimer.setDuration(this._myConfig.myImportExportResetLabelSeconds);
        this._myResetExportLabelTimer.setDuration(this._myConfig.myImportExportResetLabelSeconds);

        this._myUI.build(parentObject, this._myConfig, easyTuneParams);
        this._myUI.setImportExportButtonsVisible(easyTuneParams.myShowVariablesImportExportButtons);

        this._startHook(parentObject, easyTuneParams);

        this._addListeners();
    }

    update(dt) {
        if (this._isActive()) {
            this._updateHook(dt);

            this._updateScrollVariable(dt);

            this._updateImportExportLabel(dt);
        }
    }

    // Hooks

    _setEasyTuneVariableHook() {
    }

    _refreshUIHook() {
    }

    _startHook(parentObject, easyTuneParams) {
    }

    _addListenersHook() {
    }

    _updateHook(dt) {
    }

    // Hooks end

    _refreshUI() {
        if (this._myVariable) {
            if (this._myVariable.getName() != null) {
                this._myUI.myVariableLabelTextComponent.text = this._myVariable.getName().concat(this._myAppendToVariableName);
            } else {
                let name = "Unknown";
                this._myUI.myVariableLabelTextComponent.text = name.concat(this._myAppendToVariableName);
            }

            this._refreshUIHook();
        }
    }

    _updateScrollVariable(dt) {
        if (this._myScrollVariableActive) {
            if (this._myScrollVariableTimer <= 0) {
                this._scrollVariableRequest(this._myScrollDirection);
                this._myScrollVariableTimer = this._myConfig.myScrollVariableDelay;
                this._myHasScrolled = true;
            } else {
                this._myScrollVariableTimer -= dt;
            }
        }
    }

    _updateImportExportLabel(dt) {
        if (this._myResetImportLabelTimer.isRunning(dt)) {
            this._myResetImportLabelTimer.update(dt);
            if (this._myResetImportLabelTimer.isDone()) {
                this._myResetImportLabelTimer.reset();
                this._myUI.myImportButtonTextComponent.text = this._myConfig.myImportButtonText;
            }
        }

        if (this._myResetExportLabelTimer.isRunning(dt)) {
            this._myResetExportLabelTimer.update(dt);
            if (this._myResetExportLabelTimer.isDone()) {
                this._myResetExportLabelTimer.reset();
                this._myUI.myExportButtonTextComponent.text = this._myConfig.myExportButtonText;
            }
        }
    }

    _isActive() {
        return this._myVisible && this._myVariable;
    }

    _addListeners() {
        let ui = this._myUI;

        ui.myNextButtonCursorTargetComponent.onDown.add(this._setScrollVariableActive.bind(this, true, 1, false));
        ui.myNextButtonCursorTargetComponent.onDownOnHover.add(this._setScrollVariableActive.bind(this, true, 1, false));
        ui.myNextButtonCursorTargetComponent.onUpWithDown.add(this._setScrollVariableActive.bind(this, false, 0, false));
        ui.myNextButtonCursorTargetComponent.onUpWithNoDown.add(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myNextButtonCursorTargetComponent.onUnhover.add(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myNextButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myNextButtonBackgroundComponent.material));
        ui.myNextButtonCursorTargetComponent.onUnhover.add(this._genericUnhover.bind(this, ui.myNextButtonBackgroundComponent.material));

        ui.myPreviousButtonCursorTargetComponent.onDown.add(this._setScrollVariableActive.bind(this, true, -1, false));
        ui.myPreviousButtonCursorTargetComponent.onDownOnHover.add(this._setScrollVariableActive.bind(this, true, -1, false));
        ui.myPreviousButtonCursorTargetComponent.onUpWithDown.add(this._setScrollVariableActive.bind(this, false, 0, false));
        ui.myPreviousButtonCursorTargetComponent.onUpWithNoDown.add(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myPreviousButtonCursorTargetComponent.onUnhover.add(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myPreviousButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myPreviousButtonBackgroundComponent.material));
        ui.myPreviousButtonCursorTargetComponent.onUnhover.add(this._genericUnhover.bind(this, ui.myPreviousButtonBackgroundComponent.material));

        ui.myImportButtonCursorTargetComponent.onUpWithDown.add(this._importVariables.bind(this));
        ui.myImportButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myImportButtonBackgroundComponent.material));
        ui.myImportButtonCursorTargetComponent.onUnhover.add(this._genericUnhover.bind(this, ui.myImportButtonBackgroundComponent.material));

        ui.myExportButtonCursorTargetComponent.onUpWithDown.add(this._exportVariables.bind(this));
        ui.myExportButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myExportButtonBackgroundComponent.material));
        ui.myExportButtonCursorTargetComponent.onUnhover.add(this._genericUnhover.bind(this, ui.myExportButtonBackgroundComponent.material));

        this._addListenersHook();
    }

    _setScrollVariableActive(active, scrollDirection, skipForceScroll) {
        if (this._isActive() || !active) {
            let forceScroll = !active && !this._myHasScrolled && !skipForceScroll;
            let oldScrollDirection = this._myScrollDirection;

            this.setScrollVariableActive(active, scrollDirection);

            if (forceScroll) {
                this._scrollVariableRequest(oldScrollDirection);
            }
        }
    }

    _scrollVariableRequest(amount) {
        if (this._isActive() && amount != 0) {
            this._myScrollVariableRequestEmitter.notify(amount);
        }
    }

    _genericHover(material) {
        material.color = this._myConfig.myButtonHoverColor;
    }

    _genericUnhover(material) {
        material.color = this._myConfig.myBackgroundColor;
    }

    _importVariables() {
        if (this._myUI.myImportButtonTextComponent.text == this._myConfig.myImportButtonText) {
            this._myUI.myImportButtonTextComponent.text = this._myConfig.myImportingButtonText;
            this._myResetImportLabelTimer.reset();

            this._myParams.myVariablesImportCallback();
        }
    }

    _exportVariables() {
        if (this._myUI.myExportButtonTextComponent.text == this._myConfig.myExportButtonText) {
            this._myUI.myExportButtonTextComponent.text = this._myConfig.myExportingButtonText;
            this._myResetExportLabelTimer.reset();

            this._myParams.myVariablesExportCallback();
        }
    }

    destroy() {
        this._myDestroyed = true;

        if (this._myUI != null) {
            this._myUI.destroy();
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
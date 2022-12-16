PP.EasyTuneBaseWidgetParams = class EasyTuneBaseWidgetParams {
    constructor() {
        this.myVariablesImportCallback = null;   // Signature: callback()
        this.myVariablesExportCallback = null;   // Signature: callback()
    }
};

PP.EasyTuneBaseWidget = class EasyTuneBaseWidget {

    constructor(params) {
        this._mySetup = null;
        this._myUI = null;

        this._myParams = params;
        this._myAdditionalSetup = null;

        this._myVariable = null;

        this._myIsVisible = true;

        this._myScrollVariableRequestCallbacks = new Map();     // Signature: callback(scrollAmount)

        this._myAppendToVariableName = "";

        this._myScrollVariableActive = false;
        this._myScrollDirection = 0;
        this._myScrollVariableTimer = 0;
        this._myHasScrolled = false;

        this._myResetImportLabelTimer = new PP.Timer(0, false);
        this._myResetExportLabelTimer = new PP.Timer(0, false);
    }

    setVisible(visible) {
        if (visible) {
            this._refreshUI();
        }

        this._myUI.setVisible(visible);

        this._myIsVisible = visible;
    }

    setEasyTuneVariable(variable, appendToVariableName) {
        this._myVariable = variable;

        if ((typeof appendToVariableName) !== 'undefined') {
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
        this._myScrollVariableTimer = this._mySetup.myScrollVariableDelay;
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
            this._myUI.myImportButtonTextComponent.text = this._mySetup.myImportButtonText;

            this._myResetExportLabelTimer.reset();
            this._myUI.myExportButtonTextComponent.text = this._mySetup.myExportButtonText;
        }
    }

    onImportSuccess() {
        this._myUI.myImportButtonTextComponent.text = this._mySetup.myImportSuccessButtonText;
        this._myResetImportLabelTimer.start(this._mySetup.myImportExportResetLabelSeconds);
    }

    onImportFailure() {
        this._myUI.myImportButtonTextComponent.text = this._mySetup.myImportFailureButtonText;
        this._myResetImportLabelTimer.start(this._mySetup.myImportExportResetLabelSeconds);
    }

    onExportSuccess() {
        this._myUI.myExportButtonTextComponent.text = this._mySetup.myExportSuccessButtonText;
        this._myResetExportLabelTimer.start(this._mySetup.myImportExportResetLabelSeconds);
    }

    onExportFailure() {
        this._myUI.myExportButtonTextComponent.text = this._mySetup.myExportFailureButtonText;
        this._myResetExportLabelTimer.start(this._mySetup.myImportExportResetLabelSeconds);
    }

    registerScrollVariableRequestEventListener(id, callback) {
        this._myScrollVariableRequestCallbacks.set(id, callback);
    }

    unregisterScrollVariableRequestEventListener(id) {
        this._myScrollVariableRequestCallbacks.delete(id);
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._mySetup.build();

        this._myResetImportLabelTimer.setDuration(this._mySetup.myImportExportResetLabelSeconds);
        this._myResetExportLabelTimer.setDuration(this._mySetup.myImportExportResetLabelSeconds);

        this._myUI.build(parentObject, this._mySetup, additionalSetup);
        this._myUI.setImportExportButtonsActive(this._myAdditionalSetup.myEnableVariablesImportExportButtons);

        this._startHook(parentObject, additionalSetup);

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

    _startHook(parentObject, additionalSetup) {
    }

    _addListenersHook() {
    }

    _updateHook(dt) {
    }

    // Hooks end

    _refreshUI() {
        if (this._myVariable) {
            if (this._myVariable.myName != null) {
                this._myUI.myVariableLabelTextComponent.text = this._myVariable.myName.concat(this._myAppendToVariableName);
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
                this._myScrollVariableTimer = this._mySetup.myScrollVariableDelay;
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
                this._myUI.myImportButtonTextComponent.text = this._mySetup.myImportButtonText;
            }
        }

        if (this._myResetExportLabelTimer.isRunning(dt)) {
            this._myResetExportLabelTimer.update(dt);
            if (this._myResetExportLabelTimer.isDone()) {
                this._myResetExportLabelTimer.reset();
                this._myUI.myExportButtonTextComponent.text = this._mySetup.myExportButtonText;
            }
        }
    }

    _isActive() {
        return this._myIsVisible && this._myVariable;
    }

    _addListeners() {
        let ui = this._myUI;

        ui.myNextButtonCursorTargetComponent.addDownFunction(this._setScrollVariableActive.bind(this, true, 1, false));
        ui.myNextButtonCursorTargetComponent.addDownOnHoverFunction(this._setScrollVariableActive.bind(this, true, 1, false));
        ui.myNextButtonCursorTargetComponent.addUpFunction(this._setScrollVariableActive.bind(this, false, 0, false));
        ui.myNextButtonCursorTargetComponent.addUpWithNoDownFunction(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myNextButtonCursorTargetComponent.addUnHoverFunction(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myNextButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myNextButtonBackgroundComponent.material));
        ui.myNextButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myNextButtonBackgroundComponent.material));

        ui.myPreviousButtonCursorTargetComponent.addDownFunction(this._setScrollVariableActive.bind(this, true, -1, false));
        ui.myPreviousButtonCursorTargetComponent.addDownOnHoverFunction(this._setScrollVariableActive.bind(this, true, -1, false));
        ui.myPreviousButtonCursorTargetComponent.addUpFunction(this._setScrollVariableActive.bind(this, false, 0, false));
        ui.myPreviousButtonCursorTargetComponent.addUpWithNoDownFunction(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myPreviousButtonCursorTargetComponent.addUnHoverFunction(this._setScrollVariableActive.bind(this, false, 0, true));
        ui.myPreviousButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myPreviousButtonBackgroundComponent.material));
        ui.myPreviousButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myPreviousButtonBackgroundComponent.material));

        ui.myImportButtonCursorTargetComponent.addUpFunction(this._importVariables.bind(this));
        ui.myImportButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myImportButtonBackgroundComponent.material));
        ui.myImportButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myImportButtonBackgroundComponent.material));

        ui.myExportButtonCursorTargetComponent.addUpFunction(this._exportVariables.bind(this));
        ui.myExportButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myExportButtonBackgroundComponent.material));
        ui.myExportButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myExportButtonBackgroundComponent.material));

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
            for (let callback of this._myScrollVariableRequestCallbacks.values()) {
                callback(amount);
            }
        }
    }

    _genericHover(material) {
        material.color = this._mySetup.myButtonHoverColor;
    }

    _genericUnHover(material) {
        material.color = this._mySetup.myBackgroundColor;
    }

    _importVariables() {
        if (this._myUI.myImportButtonTextComponent.text == this._mySetup.myImportButtonText) {
            this._myUI.myImportButtonTextComponent.text = this._mySetup.myImportingButtonText;
            this._myResetImportLabelTimer.reset();

            this._myParams.myVariablesImportCallback();
        }
    }

    _exportVariables() {
        if (this._myUI.myExportButtonTextComponent.text == this._mySetup.myExportButtonText) {
            this._myUI.myExportButtonTextComponent.text = this._mySetup.myExportingButtonText;
            this._myResetExportLabelTimer.reset();

            this._myParams.myVariablesExportCallback();
        }
    }
};

PP.EasyTuneNoneWidget = class EasyTuneNoneWidget {

    constructor() {
        this._mySetup = new PP.EasyTuneNoneWidgetSetup();
        this._myUI = new PP.EasyTuneNoneWidgetUI();

        this._myVariable = null;

        this._myIsVisible = true;

        this._myScrollVariableRequestCallbacks = new Map();     // Signature: callback(scrollAmount)

        this._myAppendToVariableName = "";

        this._myScrollVariableActive = false;
        this._myScrollDirection = 0;
        this._myScrollVariableTimer = 0;
        this._myHasScrolled = false;
    }

    setEasyTuneVariable(variable, appendToVariableName) {
        this._myVariable = variable;

        if ((typeof appendToVariableName) !== 'undefined') {
            this._myAppendToVariableName = appendToVariableName;
        } else {
            this._myAppendToVariableName = "";
        }

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

    _refreshUI() {
        if (this._myVariable) {
            if (this._myVariable.myName != null) {
                this._myUI.myVariableLabelTextComponent.text = this._myVariable.myName.concat(this._myAppendToVariableName);
            } else {
                let name = "Unknown";
                this._myUI.myVariableLabelTextComponent.text = name.concat(this._myAppendToVariableName);
            }
        }
    }

    setVisible(visible) {
        if (visible) {
            this._refreshUI();
        }
        this._myUI.setVisible(visible);

        this._myIsVisible = visible;
    }

    registerScrollVariableRequestEventListener(id, callback) {
        this._myScrollVariableRequestCallbacks.set(id, callback);
    }

    unregisterScrollVariableRequestEventListener(id) {
        this._myScrollVariableRequestCallbacks.delete(id);
    }

    start(parentObject, additionalSetup) {
        this._myUI.build(parentObject, this._mySetup, additionalSetup);

        this._addListeners();
    }

    update(dt) {
        if (this._isActive()) {
            this._updateScrollVariable(dt);
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
};
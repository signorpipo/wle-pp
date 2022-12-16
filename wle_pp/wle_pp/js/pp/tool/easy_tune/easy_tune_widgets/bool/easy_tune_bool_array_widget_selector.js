
PP.EasyTuneBoolArrayWidgetSelector = class EasyTuneBoolArrayWidgetSelector {

    constructor(params, gamepad) {
        this._myGamepad = gamepad;

        this._myParentObject = null;

        this._myParams = params;
        this._myAdditionalSetup = null;

        this._myWidgets = new Map();

        this._myVariable = null;
        this._myIsVisible = true;

        this._myAppendToVariableName = null;

        this._myScrollVariableRequestCallbacks = new Map();     // Signature: callback(scrollAmount)

        this._myCurrentArraySize = 0;
    }

    setEasyTuneVariable(variable, appendToVariableName) {
        this._myVariable = variable;
        this._myCurrentArraySize = this._myVariable.myValue.length;
        this._myAppendToVariableName = appendToVariableName;

        if (!this._myWidgets.has(this._myCurrentArraySize)) {
            this._createWidget(this._myCurrentArraySize);
        }

        let widget = this._myWidgets.get(this._myCurrentArraySize);
        if (widget) {
            widget.setEasyTuneVariable(variable, appendToVariableName);
        }

        this.setVisible(this._myIsVisible);
    }

    setVisible(visible) {
        for (let widget of this._myWidgets.values()) {
            widget.setVisible(false);
        }

        if (this._myVariable) {
            this._sizeChangedCheck();

            let widget = this._myWidgets.get(this._myCurrentArraySize);
            if (widget) {
                widget.setVisible(visible);
            }
        }

        this._myIsVisible = visible;
    }

    isScrollVariableActive() {
        let widget = this._myWidgets.get(this._myCurrentArraySize);
        if (widget) {
            return widget.isScrollVariableActive();
        }

        return false;
    }

    getScrollVariableDirection() {
        let widget = this._myWidgets.get(this._myCurrentArraySize);
        if (widget) {
            return widget.getScrollVariableDirection();
        }

        return 0;
    }

    setScrollVariableActive(active, scrollDirection) {
        let widget = this._myWidgets.get(this._myCurrentArraySize);
        if (widget) {
            widget.setScrollVariableActive(active, scrollDirection);
        }
    }

    getWidget() {
        return this._myWidgets.get(this._myCurrentArraySize);
    }

    registerScrollVariableRequestEventListener(id, callback) {
        this._myScrollVariableRequestCallbacks.set(id, callback);
    }

    unregisterScrollVariableRequestEventListener(id) {
        this._myScrollVariableRequestCallbacks.delete(id);
    }

    start(parentObject, additionalSetup) {
        this._myParentObject = parentObject;
        this._myAdditionalSetup = additionalSetup;

        this._createWidget(1);

        if (this._myVariable) {
            this.setEasyTuneVariable(this._myVariable, this._myAppendToVariableName);
        }
    }

    update(dt) {
        if (this._isActive()) {
            this._sizeChangedCheck();

            let widget = this._myWidgets.get(this._myCurrentArraySize);
            if (widget) {
                widget.update(dt);
            }
        }
    }

    onImportSuccess() {
        let widget = this._myWidgets.get(this._myCurrentArraySize);
        if (widget) {
            widget.onImportSuccess();
        }
    }

    onImportFailure() {
        let widget = this._myWidgets.get(this._myCurrentArraySize);
        if (widget) {
            widget.onImportFailure();
        }
    }

    onExportSuccess() {
        let widget = this._myWidgets.get(this._myCurrentArraySize);
        if (widget) {
            widget.onExportSuccess();
        }
    }

    onExportFailure() {
        let widget = this._myWidgets.get(this._myCurrentArraySize);
        if (widget) {
            widget.onExportFailure();
        }
    }

    _isActive() {
        return this._myIsVisible && this._myVariable;
    }

    _scrollVariableRequest(amount) {
        for (let callback of this._myScrollVariableRequestCallbacks.values()) {
            callback(amount);
        }
    }

    _createWidget(arraySize) {
        this._myWidgets.set(arraySize, new PP.EasyTuneBoolArrayWidget(this._myParams, arraySize, this._myGamepad));
        this._myWidgets.get(arraySize).start(this._myParentObject, this._myAdditionalSetup);
        this._myWidgets.get(arraySize).setVisible(false);
        this._myWidgets.get(arraySize).registerScrollVariableRequestEventListener(this, this._scrollVariableRequest.bind(this));
    }

    _sizeChangedCheck() {
        if (this._myVariable.myValue.length != this._myCurrentArraySize) {
            this.setEasyTuneVariable(this._myVariable, this._myAppendToVariableName);
        }
    }
};
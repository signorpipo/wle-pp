import { Emitter } from "@wonderlandengine/api";
import { Globals } from "../../../../pp/globals.js";

export class EasyTuneBaseArrayWidgetSelector {

    constructor(params, gamepad, engine = Globals.getMainEngine()) {
        this._myGamepad = gamepad;

        this._myParentObject = null;

        this._myParams = params;
        this._myEasyTuneParams = null;

        this._myWidgets = new Map();

        this._myVariable = null;
        this._myVisible = true;

        this._myAppendToVariableName = null;

        this._myScrollVariableRequestEmitter = new Emitter();     // Signature: listener(scrollAmount)

        this._myCurrentArraySize = null;

        this._myEngine = engine;

        this._myActive = true;
        this._myDestroyed = false;
    }

    setEasyTuneVariable(variable, appendToVariableName, skipSetVisible = false) {
        this._myVariable = variable;

        this._myCurrentArraySize = this._myVariable.getValue().length; // null for non array variable

        this._myAppendToVariableName = appendToVariableName;

        if (!this._myWidgets.has(this._myCurrentArraySize)) {
            this._createWidget(this._myCurrentArraySize);
        }

        let widget = this._myWidgets.get(this._myCurrentArraySize);
        if (widget) {
            widget.setEasyTuneVariable(variable, appendToVariableName);
        }

        if (!skipSetVisible) {
            this.setVisible(this._myVisible);
        }
    }

    setVisible(visible) {
        if (this._myVariable) {
            this._sizeChangedCheck(true);

            let currentWidget = this._myWidgets.get(this._myCurrentArraySize);

            for (let widget of this._myWidgets.values()) {
                if (currentWidget != widget) {
                    widget.setVisible(false);
                }
            }

            if (currentWidget) {
                currentWidget.setVisible(visible);
            }
        } else {
            for (let widget of this._myWidgets.values()) {
                widget.setVisible(false);
            }
        }

        this._myVisible = visible;
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

    registerScrollVariableRequestEventListener(id, listener) {
        this._myScrollVariableRequestEmitter.add(listener, { id: id });
    }

    unregisterScrollVariableRequestEventListener(id) {
        this._myScrollVariableRequestEmitter.remove(id);
    }

    start(parentObject, easyTuneParams) {
        this._myParentObject = parentObject;
        this._myEasyTuneParams = easyTuneParams;

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
        return this._myVisible && this._myVariable;
    }

    _scrollVariableRequest(amount) {
        this._myScrollVariableRequestEmitter.notify(amount);
    }

    _createWidget(arraySize) {
        this._myWidgets.set(arraySize, this._getEasyTuneArrayWidget(arraySize));
        this._myWidgets.get(arraySize).start(this._myParentObject, this._myEasyTuneParams);
        this._myWidgets.get(arraySize).setVisible(false);
        this._myWidgets.get(arraySize).registerScrollVariableRequestEventListener(this, this._scrollVariableRequest.bind(this));
        this._myWidgets.get(arraySize).setActive(this._myActive);
    }

    _sizeChangedCheck(skipSetVisible = false) {
        if (this._myVariable.getValue().length != this._myCurrentArraySize) {
            this.setEasyTuneVariable(this._myVariable, this._myAppendToVariableName, skipSetVisible);
        }
    }

    /**
     * TS type inference helper
     * 
     * @returns {any}
     */
    _getEasyTuneArrayWidget(arraySize) {
        return null;
    }

    setActive(active) {
        this._myActive = active;
        for (let widget of this._myWidgets.values()) {
            widget.setActive(active);
        }
    }

    destroy() {
        this._myDestroyed = true;

        this.setActive(false);

        for (let widget of this._myWidgets.values()) {
            widget.destroy();
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
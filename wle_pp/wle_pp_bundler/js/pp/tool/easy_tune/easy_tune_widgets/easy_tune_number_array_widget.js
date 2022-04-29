
PP.EasyTuneNumberArrayWidget = class EasyTuneNumberArrayWidget {

    constructor(arraySize, gamepad) {
        this._myGamepad = gamepad;

        this._mySetup = new PP.EasyTuneNumberArrayWidgetSetup(arraySize);
        this._myUI = new PP.EasyTuneNumberArrayWidgetUI();

        this._myVariable = null;

        this._myIsVisible = true;

        this._myScrollVariableRequestCallbacks = new Map();     // Signature: callback(scrollAmount)

        this._myAppendToVariableName = "";

        this._myValueEditIndex = -1;

        this._myValueButtonEditIntensity = 0;
        this._myValueButtonEditIntensityTimer = 0;
        this._myStepButtonEditIntensity = 0;
        this._myStepButtonEditIntensityTimer = 0;

        this._myValueEditActive = false;
        this._myStepEditActive = false;

        this._myValueRealValue = null;
        this._myStepMultiplierValue = null;
        this._myStepFastEdit = false;

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

        if (this._myValueEditIndex >= 0) {
            this._myValueRealValue = this._myVariable.myValue[this._myValueEditIndex];
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
            this._myUI.myVariableLabelTextComponent.text = this._myVariable.myName.concat(this._myAppendToVariableName);

            for (let i = 0; i < this._mySetup.myArraySize; i++) {
                this._myUI.myValueTextComponents[i].text = this._myVariable.myValue[i].toFixed(this._myVariable.myDecimalPlaces);
            }

            this._myUI.myStepTextComponent.text = this._mySetup.myStepStartString.concat(this._myVariable.myStepPerSecond);
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
        this._myUI.setAdditionalButtonsActive(additionalSetup.myEnableAdditionalButtons);

        this._addListeners();
    }

    update(dt) {
        if (this._isActive()) {
            this._updateValue(dt);
            this._updateScrollVariable(dt);
        }
    }

    _updateValue(dt) {
        let stickVariableIntensity = 0;

        if (this._myGamepad) {
            let y = this._myGamepad.getAxesInfo().myAxes[1];

            if (Math.abs(y) > this._mySetup.myEditThumbstickMinThreshold) {
                let normalizedEditAmount = (Math.abs(y) - this._mySetup.myEditThumbstickMinThreshold) / (1 - this._mySetup.myEditThumbstickMinThreshold);
                stickVariableIntensity = Math.sign(y) * normalizedEditAmount;
            }
        }

        let valueIntensity = 0;
        if (this._myValueEditActive) {
            valueIntensity = stickVariableIntensity;
        } else if (this._myValueButtonEditIntensity != 0) {
            if (this._myValueButtonEditIntensityTimer <= 0) {
                valueIntensity = this._myValueButtonEditIntensity;
            } else {
                this._myValueButtonEditIntensityTimer -= dt;
            }
        }

        if (valueIntensity != 0) {
            let amountToAdd = valueIntensity * this._myVariable.myStepPerSecond * dt;

            this._myValueRealValue += amountToAdd;

            if (this._myVariable.myMin != null && this._myVariable.myMax != null) {
                this._myValueRealValue = Math.pp_clamp(this._myValueRealValue, this._myVariable.myMin, this._myVariable.myMax);
            } else if (this._myVariable.myMin != null) {
                this._myValueRealValue = Math.max(this._myValueRealValue, this._myVariable.myMin);
            } else if (this._myVariable.myMax != null) {
                this._myValueRealValue = Math.min(this._myValueRealValue, this._myVariable.myMax);
            }

            let decimalPlacesMultiplier = Math.pow(10, this._myVariable.myDecimalPlaces);

            if (this._myVariable.myEditAllValuesTogether) {
                let newValue = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                let difference = newValue - this._myVariable.myValue[this._myValueEditIndex];

                for (let i = 0; i < this._mySetup.myArraySize; i++) {
                    this._myVariable.myValue[i] = Math.round((this._myVariable.myValue[i] + difference) * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;

                    if (this._myVariable.myMin != null && this._myVariable.myMax != null) {
                        this._myVariable.myValue[i] = Math.pp_clamp(this._myVariable.myValue[i], this._myVariable.myMin, this._myVariable.myMax);
                    } else if (this._myVariable.myMin != null) {
                        this._myVariable.myValue[i] = Math.max(this._myVariable.myValue[i], this._myVariable.myMin);
                    } else if (this._myVariable.myMax != null) {
                        this._myVariable.myValue[i] = Math.min(this._myVariable.myValue[i], this._myVariable.myMax);
                    }

                    this._myUI.myValueTextComponents[i].text = this._myVariable.myValue[i].toFixed(this._myVariable.myDecimalPlaces);
                }

            } else {
                this._myVariable.myValue[this._myValueEditIndex] = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;

                if (this._myVariable.myMin != null && this._myVariable.myMax != null) {
                    this._myVariable.myValue[this._myValueEditIndex] = Math.pp_clamp(this._myVariable.myValue[this._myValueEditIndex], this._myVariable.myMin, this._myVariable.myMax);
                } else if (this._myVariable.myMin != null) {
                    this._myVariable.myValue[this._myValueEditIndex] = Math.max(this._myVariable.myValue[this._myValueEditIndex], this._myVariable.myMin);
                } else if (this._myVariable.myMax != null) {
                    this._myVariable.myValue[this._myValueEditIndex] = Math.min(this._myVariable.myValue[this._myValueEditIndex], this._myVariable.myMax);
                }

                this._myUI.myValueTextComponents[this._myValueEditIndex].text = this._myVariable.myValue[this._myValueEditIndex].toFixed(this._myVariable.myDecimalPlaces);
            }
        } else {
            this._myValueRealValue = this._myVariable.myValue[this._myValueEditIndex];
        }

        let stepIntensity = 0;
        if (this._myStepEditActive) {
            stepIntensity = stickVariableIntensity;
        } else if (this._myStepButtonEditIntensity != 0) {
            if (this._myStepButtonEditIntensityTimer <= 0) {
                stepIntensity = this._myStepButtonEditIntensity;
            } else {
                this._myStepButtonEditIntensityTimer -= dt;
            }
        }

        if (stepIntensity != 0) {
            let amountToAdd = 0;
            if (this._myStepFastEdit) {
                amountToAdd = Math.sign(stepIntensity) * 1;
                this._myStepFastEdit = false;
            } else {
                amountToAdd = stepIntensity * this._mySetup.myStepMultiplierStepPerSecond * dt;
            }

            this._myStepMultiplierValue += amountToAdd;
            if (Math.abs(this._myStepMultiplierValue) >= 1) {
                if (Math.sign(this._myStepMultiplierValue) > 0) {
                    this._myStepMultiplierValue -= 1;
                    this._changeStep(this._myVariable.myStepPerSecond * 10);
                } else {
                    this._myStepMultiplierValue += 1;
                    this._changeStep(this._myVariable.myStepPerSecond * 0.1);
                }
            }
        } else {
            this._myStepMultiplierValue = 0;
            this._myStepFastEdit = true;
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

        ui.myVariableLabelCursorTargetComponent.addClickFunction(this._resetAllValues.bind(this));
        ui.myVariableLabelCursorTargetComponent.addHoverFunction(this._genericTextHover.bind(this, ui.myVariableLabelText));
        ui.myVariableLabelCursorTargetComponent.addUnHoverFunction(this._genericTextUnHover.bind(this, ui.myVariableLabelText, this._mySetup.myVariableLabelTextScale));

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

        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            ui.myValueIncreaseButtonCursorTargetComponents[i].addDownFunction(this._setValueEditIntensity.bind(this, i, 1));
            ui.myValueIncreaseButtonCursorTargetComponents[i].addDownOnHoverFunction(this._setValueEditIntensity.bind(this, i, 1));
            ui.myValueIncreaseButtonCursorTargetComponents[i].addUpFunction(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueIncreaseButtonCursorTargetComponents[i].addUpWithNoDownFunction(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueIncreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueDecreaseButtonCursorTargetComponents[i].addDownFunction(this._setValueEditIntensity.bind(this, i, -1));
            ui.myValueDecreaseButtonCursorTargetComponents[i].addDownOnHoverFunction(this._setValueEditIntensity.bind(this, i, -1));
            ui.myValueDecreaseButtonCursorTargetComponents[i].addUpFunction(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueDecreaseButtonCursorTargetComponents[i].addUpWithNoDownFunction(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueDecreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._setValueEditIntensity.bind(this, i, 0));

            ui.myValueIncreaseButtonCursorTargetComponents[i].addHoverFunction(this._genericHover.bind(this, ui.myValueIncreaseButtonBackgroundComponents[i].material));
            ui.myValueIncreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._genericUnHover.bind(this, ui.myValueIncreaseButtonBackgroundComponents[i].material));
            ui.myValueDecreaseButtonCursorTargetComponents[i].addHoverFunction(this._genericHover.bind(this, ui.myValueDecreaseButtonBackgroundComponents[i].material));
            ui.myValueDecreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._genericUnHover.bind(this, ui.myValueDecreaseButtonBackgroundComponents[i].material));

            ui.myValueCursorTargetComponents[i].addClickFunction(this._resetValue.bind(this, i));
            ui.myValueCursorTargetComponents[i].addHoverFunction(this._setValueEditActive.bind(this, i, ui.myValueTexts[i], true));
            ui.myValueCursorTargetComponents[i].addUnHoverFunction(this._setValueEditActive.bind(this, i, ui.myValueTexts[i], false));
        }

        ui.myStepCursorTargetComponent.addClickFunction(this._resetStep.bind(this));
        ui.myStepCursorTargetComponent.addHoverFunction(this._setStepEditActive.bind(this, ui.myStepText, true));
        ui.myStepCursorTargetComponent.addUnHoverFunction(this._setStepEditActive.bind(this, ui.myStepText, false));

        ui.myStepIncreaseButtonCursorTargetComponent.addDownFunction(this._setStepEditIntensity.bind(this, 1));
        ui.myStepIncreaseButtonCursorTargetComponent.addDownOnHoverFunction(this._setStepEditIntensity.bind(this, 1));
        ui.myStepIncreaseButtonCursorTargetComponent.addUpFunction(this._setStepEditIntensity.bind(this, 0));
        ui.myStepIncreaseButtonCursorTargetComponent.addUpWithNoDownFunction(this._setStepEditIntensity.bind(this, 0));
        ui.myStepIncreaseButtonCursorTargetComponent.addUnHoverFunction(this._setStepEditIntensity.bind(this, 0));
        ui.myStepDecreaseButtonCursorTargetComponent.addDownFunction(this._setStepEditIntensity.bind(this, -1));
        ui.myStepDecreaseButtonCursorTargetComponent.addDownOnHoverFunction(this._setStepEditIntensity.bind(this, -1));
        ui.myStepDecreaseButtonCursorTargetComponent.addUpFunction(this._setStepEditIntensity.bind(this, 0));
        ui.myStepDecreaseButtonCursorTargetComponent.addUpWithNoDownFunction(this._setStepEditIntensity.bind(this, 0));
        ui.myStepDecreaseButtonCursorTargetComponent.addUnHoverFunction(this._setStepEditIntensity.bind(this, 0));

        ui.myStepIncreaseButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myStepIncreaseButtonBackgroundComponent.material));
        ui.myStepIncreaseButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myStepIncreaseButtonBackgroundComponent.material));
        ui.myStepDecreaseButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myStepDecreaseButtonBackgroundComponent.material));
        ui.myStepDecreaseButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myStepDecreaseButtonBackgroundComponent.material));
    }

    _setValueEditIntensity(index, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myValueButtonEditIntensityTimer = this._mySetup.myButtonEditDelay;
                this._myValueRealValue = this._myVariable.myValue[index];
                this._myValueEditIndex = index;
            }

            this._myValueButtonEditIntensity = value;
        }
    }

    _setStepEditIntensity(value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myStepButtonEditIntensityTimer = this._mySetup.myButtonEditDelay;
            }

            this._myStepButtonEditIntensity = value;
        }
    }

    _setValueEditActive(index, text, active) {
        if (this._isActive() || !active) {
            if (active) {
                this._myValueRealValue = this._myVariable.myValue[index];
                this._myValueEditIndex = index;
                text.scale(this._mySetup.myTextHoverScaleMultiplier);
            } else {
                text.scalingWorld = this._mySetup.myValueTextScale;
            }

            this._myValueEditActive = active;
        }
    }

    _setStepEditActive(text, active) {
        if (this._isActive() || !active) {
            if (active) {
                text.scale(this._mySetup.myTextHoverScaleMultiplier);
            } else {
                text.scalingWorld = this._mySetup.myStepTextScale;
            }

            this._myStepEditActive = active;
        }
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

    _resetValue(index) {
        if (this._isActive()) {
            this._myVariable.myValue[index] = this._myVariable.myInitialValue[index];
            this._myUI.myValueTextComponents[index].text = this._myVariable.myValue[index].toFixed(this._myVariable.myDecimalPlaces);
        }
    }

    _resetAllValues() {
        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            this._resetValue(i);
        }
    }

    _resetStep() {
        if (this._isActive()) {
            this._changeStep(this._myVariable.myInitialStepPerSecond);
        }
    }

    _changeStep(step) {
        step = Math.pp_roundDecimal(step, 10);
        this._myVariable.myStepPerSecond = step;
        this._myUI.myStepTextComponent.text = this._mySetup.myStepStartString.concat(this._myVariable.myStepPerSecond);
    }

    _genericHover(material) {
        material.color = this._mySetup.myButtonHoverColor;
    }

    _genericUnHover(material) {
        material.color = this._mySetup.myBackgroundColor;
    }

    _genericTextHover(text) {
        text.scale(this._mySetup.myTextHoverScaleMultiplier);
    }

    _genericTextUnHover(text, originalScale) {
        text.scalingWorld = originalScale;
    }
};
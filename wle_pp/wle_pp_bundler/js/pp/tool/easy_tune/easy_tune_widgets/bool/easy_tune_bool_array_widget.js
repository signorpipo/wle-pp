
PP.EasyTuneBoolArrayWidget = class EasyTuneBoolArrayWidget extends PP.EasyTuneBaseWidget {

    constructor(params, arraySize, gamepad) {
        super(params);

        this._mySetup = new PP.EasyTuneBoolArrayWidgetSetup(arraySize);
        this._myUI = new PP.EasyTuneBoolArrayWidgetUI();

        this._myGamepad = gamepad;

        this._myValueEditIndex = 0;
        this._myValueButtonEditIntensity = 0;
        this._myValueButtonEditIntensityTimer = 0;
        this._myValueEditActive = false;
    }

    _refreshUIHook() {
        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            this._myUI.myValueTextComponents[i].text = (this._myVariable.myValue[i]) ? "true" : "false";
        }
    }

    _startHook(parentObject, additionalSetup) {
        this._myUI.setAdditionalButtonsActive(additionalSetup.myEnableAdditionalButtons);
    }

    _updateHook(dt) {
        this._updateValue(dt);
    }

    _updateValue(dt) {
        let stickVariableIntensity = 0;

        if (this._myGamepad) {
            stickVariableIntensity = this._myGamepad.getAxesInfo(PP.GamepadAxesID.THUMBSTICK).myAxes[1];
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

        if (Math.abs(valueIntensity) > this._mySetup.myThumbstickToggleThreshold) {
            this._myVariable.myValue[this._myValueEditIndex] = valueIntensity > 0;
            this._refreshUI();
        }
    }

    _addListenersHook() {
        let ui = this._myUI;

        ui.myVariableLabelCursorTargetComponent.addClickFunction(this._resetAllValues.bind(this));
        ui.myVariableLabelCursorTargetComponent.addHoverFunction(this._genericTextHover.bind(this, ui.myVariableLabelText));
        ui.myVariableLabelCursorTargetComponent.addUnHoverFunction(this._genericTextUnHover.bind(this, ui.myVariableLabelText, this._mySetup.myVariableLabelTextScale));

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
    }

    _setValueEditIntensity(index, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myValueButtonEditIntensityTimer = this._mySetup.myButtonEditDelay;
                this._myValueEditIndex = index;
            }

            this._myValueButtonEditIntensity = value;
        }
    }

    _setValueEditActive(index, text, active) {
        if (this._isActive() || !active) {
            if (active) {
                this._myValueEditIndex = index;
                text.scale(this._mySetup.myTextHoverScaleMultiplier);
            } else {
                text.scalingWorld = this._mySetup.myValueTextScale;
            }

            this._myValueEditActive = active;
        }
    }

    _resetValue(index) {
        if (this._isActive()) {
            this._myVariable.myValue[index] = this._myVariable.myDefaultValue[index];
            this._myUI.myValueTextComponents[index].text = (this._myVariable.myValue[index]) ? "true" : "false";
        }
    }

    _resetAllValues() {
        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            this._resetValue(i);
        }
    }

    _genericTextHover(text) {
        text.scale(this._mySetup.myTextHoverScaleMultiplier);
    }

    _genericTextUnHover(text, originalScale) {
        text.scalingWorld = originalScale;
    }
};
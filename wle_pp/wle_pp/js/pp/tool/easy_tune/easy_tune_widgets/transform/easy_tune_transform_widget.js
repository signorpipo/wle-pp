PP.EasyTuneTransformWidget = class EasyTuneTransformWidget extends PP.EasyTuneBaseWidget {

    constructor(params, gamepad) {
        super(params);

        this._myGamepad = gamepad;

        this._mySetup = new PP.EasyTuneTransformWidgetSetup();
        this._myUI = new PP.EasyTuneTransformWidgetUI();

        this._myValueButtonEditIntensity = 0;
        this._myValueButtonEditIntensityTimer = 0;
        this._myStepButtonEditIntensity = 0;
        this._myStepButtonEditIntensityTimer = 0;

        this._myValueEditActive = false;
        this._myStepEditActive = false;

        this._myValueRealValue = 0;
        this._myComponentStepValue = 0;
        this._myStepMultiplierValue = 0;
        this._myStepFastEdit = false;

        this._myValueEditIndex = -1;
        this._myComponentIndex = 0;
        this._myStepIndex = 0;
    }

    _setEasyTuneVariableHook() {
        if (this._myValueEditIndex >= 0) {
            switch (this._myComponentIndex) {
                case 0:
                    this._myValueRealValue = this._myVariable.myPosition[this._myValueEditIndex];
                    this._myComponentStepValue = this._myVariable.myPositionStepPerSecond;
                    break;
                case 1:
                    this._myValueRealValue = this._myVariable.myRotation[this._myValueEditIndex];
                    this._myComponentStepValue = this._myVariable.myRotationStepPerSecond;
                    break;
                case 2:
                    this._myValueRealValue = this._myVariable.myScale[this._myValueEditIndex];
                    this._myComponentStepValue = this._myVariable.myScaleStepPerSecond;
                    break;
            }
        }
    }

    _refreshUIHook() {
        for (let i = 0; i < 3; i++) {
            this._myUI.myPositionTextComponents[i].text = this._myVariable.myPosition[i].toFixed(this._myVariable.myDecimalPlaces);
        }
        this._myUI.myPositionStepTextComponent.text = this._mySetup.myStepStartString.concat(this._myVariable.myPositionStepPerSecond);

        for (let i = 0; i < 3; i++) {
            this._myUI.myRotationTextComponents[i].text = this._myVariable.myRotation[i].toFixed(this._myVariable.myDecimalPlaces);
        }
        this._myUI.myRotationStepTextComponent.text = this._mySetup.myStepStartString.concat(this._myVariable.myRotationStepPerSecond);

        for (let i = 0; i < 3; i++) {
            this._myUI.myScaleTextComponents[i].text = this._myVariable.myScale[i].toFixed(this._myVariable.myDecimalPlaces);
        }
        this._myUI.myScaleStepTextComponent.text = this._mySetup.myStepStartString.concat(this._myVariable.myScaleStepPerSecond);
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
            let y = this._myGamepad.getAxesInfo(PP.GamepadAxesID.THUMBSTICK).myAxes[1];

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
            let amountToAdd = valueIntensity * this._myComponentStepValue * dt;

            this._myValueRealValue += amountToAdd;

            let decimalPlacesMultiplier = Math.pow(10, this._myVariable.myDecimalPlaces);

            switch (this._myComponentIndex) {
                case 0:
                    this._myVariable.myPosition[this._myValueEditIndex] = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                    this._myUI.myPositionTextComponents[this._myValueEditIndex].text = this._myVariable.myPosition[this._myValueEditIndex].toFixed(this._myVariable.myDecimalPlaces);
                    break;
                case 1:
                    if (this._myValueRealValue > 180) {
                        while (this._myValueRealValue > 180) {
                            this._myValueRealValue -= 180;
                        }
                        this._myValueRealValue = -180 + this._myValueRealValue;
                    }

                    if (this._myValueRealValue < -180) {
                        while (this._myValueRealValue < - 180) {
                            this._myValueRealValue += 180;
                        }
                        this._myValueRealValue = 180 - this._myValueRealValue;
                    }

                    this._myVariable.myRotation[this._myValueEditIndex] = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                    this._myUI.myRotationTextComponents[this._myValueEditIndex].text = this._myVariable.myRotation[this._myValueEditIndex].toFixed(this._myVariable.myDecimalPlaces);
                    break;
                case 2:
                    if (this._myValueRealValue <= 0) {
                        this._myValueRealValue = 1 / decimalPlacesMultiplier;
                    }

                    if (this._myVariable.myScaleAsOne) {
                        let newValue = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                        let difference = newValue - this._myVariable.myScale[this._myValueEditIndex];

                        for (let i = 0; i < 3; i++) {
                            this._myVariable.myScale[i] = Math.round((this._myVariable.myScale[i] + difference) * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                            this._myVariable.myScale[i] = Math.max(this._myVariable.myScale[i], 1 / decimalPlacesMultiplier);
                            this._myUI.myScaleTextComponents[i].text = this._myVariable.myScale[i].toFixed(this._myVariable.myDecimalPlaces);
                        }
                    } else {
                        this._myVariable.myScale[this._myValueEditIndex] = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                        this._myVariable.myScale[this._myValueEditIndex] = Math.max(this._myVariable.myScale[this._myValueEditIndex], 1 / decimalPlacesMultiplier);
                        this._myUI.myScaleTextComponents[this._myValueEditIndex].text = this._myVariable.myScale[this._myValueEditIndex].toFixed(this._myVariable.myDecimalPlaces);
                    }
                    break;
            }
        } else {
            switch (this._myComponentIndex) {
                case 0:
                    this._myValueRealValue = this._myVariable.myPosition[this._myValueEditIndex];
                    break;
                case 1:
                    this._myValueRealValue = this._myVariable.myRotation[this._myValueEditIndex];
                    break;
                case 2:
                    this._myValueRealValue = this._myVariable.myScale[this._myValueEditIndex];
                    break;
            }
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
                let stepValue = 0;
                switch (this._myStepIndex) {
                    case 0:
                        stepValue = this._myVariable.myPositionStepPerSecond;
                        break;
                    case 1:
                        stepValue = this._myVariable.myRotationStepPerSecond;
                        break;
                    case 2:
                        stepValue = this._myVariable.myScaleStepPerSecond;
                        break;
                    default:
                        stepValue = 0;
                }
                if (Math.sign(this._myStepMultiplierValue) > 0) {
                    this._myStepMultiplierValue -= 1;
                    this._changeStep(this._myStepIndex, stepValue * 10);
                } else {
                    this._myStepMultiplierValue += 1;
                    this._changeStep(this._myStepIndex, stepValue * 0.1);
                }
            }
        } else {
            this._myStepMultiplierValue = 0;
            this._myStepFastEdit = true;
        }
    }

    _addListenersHook() {
        let ui = this._myUI;

        ui.myVariableLabelCursorTargetComponent.addClickFunction(this._resetAllValues.bind(this));
        ui.myVariableLabelCursorTargetComponent.addHoverFunction(this._genericTextHover.bind(this, ui.myVariableLabelText));
        ui.myVariableLabelCursorTargetComponent.addUnHoverFunction(this._genericTextUnHover.bind(this, ui.myVariableLabelText, this._mySetup.myVariableLabelTextScale));

        ui.myPositionLabelCursorTargetComponent.addClickFunction(this._resetComponentValues.bind(this, 0));
        ui.myPositionLabelCursorTargetComponent.addHoverFunction(this._genericTextHover.bind(this, ui.myPositionLabelText));
        ui.myPositionLabelCursorTargetComponent.addUnHoverFunction(this._genericTextUnHover.bind(this, ui.myPositionLabelText, this._mySetup.myComponentLabelTextScale));
        for (let i = 0; i < 3; i++) {
            ui.myPositionIncreaseButtonCursorTargetComponents[i].addDownFunction(this._setValueEditIntensity.bind(this, 0, i, 1));
            ui.myPositionIncreaseButtonCursorTargetComponents[i].addDownOnHoverFunction(this._setValueEditIntensity.bind(this, 0, i, 1));
            ui.myPositionIncreaseButtonCursorTargetComponents[i].addUpFunction(this._setValueEditIntensity.bind(this, 0, i, 0));
            ui.myPositionIncreaseButtonCursorTargetComponents[i].addUpWithNoDownFunction(this._setValueEditIntensity.bind(this, 0, i, 0));
            ui.myPositionIncreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._setValueEditIntensity.bind(this, 0, i, 0));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].addDownFunction(this._setValueEditIntensity.bind(this, 0, i, -1));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].addDownOnHoverFunction(this._setValueEditIntensity.bind(this, 0, i, -1));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].addUpFunction(this._setValueEditIntensity.bind(this, 0, i, 0));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].addUpWithNoDownFunction(this._setValueEditIntensity.bind(this, 0, i, 0));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._setValueEditIntensity.bind(this, 0, i, 0));

            ui.myPositionIncreaseButtonCursorTargetComponents[i].addHoverFunction(this._genericHover.bind(this, ui.myPositionIncreaseButtonBackgroundComponents[i].material));
            ui.myPositionIncreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._genericUnHover.bind(this, ui.myPositionIncreaseButtonBackgroundComponents[i].material));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].addHoverFunction(this._genericHover.bind(this, ui.myPositionDecreaseButtonBackgroundComponents[i].material));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._genericUnHover.bind(this, ui.myPositionDecreaseButtonBackgroundComponents[i].material));

            ui.myPositionCursorTargetComponents[i].addClickFunction(this._resetValue.bind(this, 0, i));
            ui.myPositionCursorTargetComponents[i].addHoverFunction(this._setValueEditActive.bind(this, 0, i, ui.myPositionTexts[i], true));
            ui.myPositionCursorTargetComponents[i].addUnHoverFunction(this._setValueEditActive.bind(this, 0, i, ui.myPositionTexts[i], false));
        }

        ui.myRotationLabelCursorTargetComponent.addClickFunction(this._resetComponentValues.bind(this, 1));
        ui.myRotationLabelCursorTargetComponent.addHoverFunction(this._genericTextHover.bind(this, ui.myRotationLabelText));
        ui.myRotationLabelCursorTargetComponent.addUnHoverFunction(this._genericTextUnHover.bind(this, ui.myRotationLabelText, this._mySetup.myComponentLabelTextScale));
        for (let i = 0; i < 3; i++) {
            ui.myRotationIncreaseButtonCursorTargetComponents[i].addDownFunction(this._setValueEditIntensity.bind(this, 1, i, 1));
            ui.myRotationIncreaseButtonCursorTargetComponents[i].addDownOnHoverFunction(this._setValueEditIntensity.bind(this, 1, i, 1));
            ui.myRotationIncreaseButtonCursorTargetComponents[i].addUpFunction(this._setValueEditIntensity.bind(this, 1, i, 0));
            ui.myRotationIncreaseButtonCursorTargetComponents[i].addUpWithNoDownFunction(this._setValueEditIntensity.bind(this, 1, i, 0));
            ui.myRotationIncreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._setValueEditIntensity.bind(this, 1, i, 0));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].addDownFunction(this._setValueEditIntensity.bind(this, 1, i, -1));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].addDownOnHoverFunction(this._setValueEditIntensity.bind(this, 1, i, -1));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].addUpFunction(this._setValueEditIntensity.bind(this, 1, i, 0));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].addUpWithNoDownFunction(this._setValueEditIntensity.bind(this, 1, i, 0));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._setValueEditIntensity.bind(this, 1, i, 0));

            ui.myRotationIncreaseButtonCursorTargetComponents[i].addHoverFunction(this._genericHover.bind(this, ui.myRotationIncreaseButtonBackgroundComponents[i].material));
            ui.myRotationIncreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._genericUnHover.bind(this, ui.myRotationIncreaseButtonBackgroundComponents[i].material));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].addHoverFunction(this._genericHover.bind(this, ui.myRotationDecreaseButtonBackgroundComponents[i].material));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._genericUnHover.bind(this, ui.myRotationDecreaseButtonBackgroundComponents[i].material));

            ui.myRotationCursorTargetComponents[i].addClickFunction(this._resetValue.bind(this, 1, i));
            ui.myRotationCursorTargetComponents[i].addHoverFunction(this._setValueEditActive.bind(this, 1, i, ui.myRotationTexts[i], true));
            ui.myRotationCursorTargetComponents[i].addUnHoverFunction(this._setValueEditActive.bind(this, 1, i, ui.myRotationTexts[i], false));
        }

        ui.myScaleLabelCursorTargetComponent.addClickFunction(this._resetComponentValues.bind(this, 2));
        ui.myScaleLabelCursorTargetComponent.addHoverFunction(this._genericTextHover.bind(this, ui.myScaleLabelText));
        ui.myScaleLabelCursorTargetComponent.addUnHoverFunction(this._genericTextUnHover.bind(this, ui.myScaleLabelText, this._mySetup.myComponentLabelTextScale));
        for (let i = 0; i < 3; i++) {
            ui.myScaleIncreaseButtonCursorTargetComponents[i].addDownFunction(this._setValueEditIntensity.bind(this, 2, i, 1));
            ui.myScaleIncreaseButtonCursorTargetComponents[i].addDownOnHoverFunction(this._setValueEditIntensity.bind(this, 2, i, 1));
            ui.myScaleIncreaseButtonCursorTargetComponents[i].addUpFunction(this._setValueEditIntensity.bind(this, 2, i, 0));
            ui.myScaleIncreaseButtonCursorTargetComponents[i].addUpWithNoDownFunction(this._setValueEditIntensity.bind(this, 2, i, 0));
            ui.myScaleIncreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._setValueEditIntensity.bind(this, 2, i, 0));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].addDownFunction(this._setValueEditIntensity.bind(this, 2, i, -1));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].addDownOnHoverFunction(this._setValueEditIntensity.bind(this, 2, i, -1));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].addUpFunction(this._setValueEditIntensity.bind(this, 2, i, 0));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].addUpWithNoDownFunction(this._setValueEditIntensity.bind(this, 2, i, 0));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._setValueEditIntensity.bind(this, 2, i, 0));

            ui.myScaleIncreaseButtonCursorTargetComponents[i].addHoverFunction(this._genericHover.bind(this, ui.myScaleIncreaseButtonBackgroundComponents[i].material));
            ui.myScaleIncreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._genericUnHover.bind(this, ui.myScaleIncreaseButtonBackgroundComponents[i].material));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].addHoverFunction(this._genericHover.bind(this, ui.myScaleDecreaseButtonBackgroundComponents[i].material));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].addUnHoverFunction(this._genericUnHover.bind(this, ui.myScaleDecreaseButtonBackgroundComponents[i].material));

            ui.myScaleCursorTargetComponents[i].addClickFunction(this._resetValue.bind(this, 2, i));
            ui.myScaleCursorTargetComponents[i].addHoverFunction(this._setValueEditActive.bind(this, 2, i, ui.myScaleTexts[i], true));
            ui.myScaleCursorTargetComponents[i].addUnHoverFunction(this._setValueEditActive.bind(this, 2, i, ui.myScaleTexts[i], false));
        }

        ui.myPositionStepCursorTargetComponent.addClickFunction(this._resetStep.bind(this, 0));
        ui.myPositionStepCursorTargetComponent.addHoverFunction(this._setStepEditActive.bind(this, 0, ui.myPositionStepText, true));
        ui.myPositionStepCursorTargetComponent.addUnHoverFunction(this._setStepEditActive.bind(this, 0, ui.myPositionStepText, false));

        ui.myPositionStepIncreaseButtonCursorTargetComponent.addDownFunction(this._setStepEditIntensity.bind(this, 0, 1));
        ui.myPositionStepIncreaseButtonCursorTargetComponent.addDownOnHoverFunction(this._setStepEditIntensity.bind(this, 0, 1));
        ui.myPositionStepIncreaseButtonCursorTargetComponent.addUpFunction(this._setStepEditIntensity.bind(this, 0, 0));
        ui.myPositionStepIncreaseButtonCursorTargetComponent.addUpWithNoDownFunction(this._setStepEditIntensity.bind(this, 0, 0));
        ui.myPositionStepIncreaseButtonCursorTargetComponent.addUnHoverFunction(this._setStepEditIntensity.bind(this, 0, 0));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.addDownFunction(this._setStepEditIntensity.bind(this, 0, -1));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.addDownOnHoverFunction(this._setStepEditIntensity.bind(this, 0, -1));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.addUpFunction(this._setStepEditIntensity.bind(this, 0, 0));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.addUpWithNoDownFunction(this._setStepEditIntensity.bind(this, 0, 0));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.addUnHoverFunction(this._setStepEditIntensity.bind(this, 0, 0));

        ui.myPositionStepIncreaseButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myPositionStepIncreaseButtonBackgroundComponent.material));
        ui.myPositionStepIncreaseButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myPositionStepIncreaseButtonBackgroundComponent.material));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myPositionStepDecreaseButtonBackgroundComponent.material));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myPositionStepDecreaseButtonBackgroundComponent.material));

        ui.myRotationStepCursorTargetComponent.addClickFunction(this._resetStep.bind(this, 1));
        ui.myRotationStepCursorTargetComponent.addHoverFunction(this._setStepEditActive.bind(this, 1, ui.myRotationStepText, true));
        ui.myRotationStepCursorTargetComponent.addUnHoverFunction(this._setStepEditActive.bind(this, 1, ui.myRotationStepText, false));

        ui.myRotationStepIncreaseButtonCursorTargetComponent.addDownFunction(this._setStepEditIntensity.bind(this, 1, 1));
        ui.myRotationStepIncreaseButtonCursorTargetComponent.addDownOnHoverFunction(this._setStepEditIntensity.bind(this, 1, 1));
        ui.myRotationStepIncreaseButtonCursorTargetComponent.addUpFunction(this._setStepEditIntensity.bind(this, 1, 0));
        ui.myRotationStepIncreaseButtonCursorTargetComponent.addUpWithNoDownFunction(this._setStepEditIntensity.bind(this, 1, 0));
        ui.myRotationStepIncreaseButtonCursorTargetComponent.addUnHoverFunction(this._setStepEditIntensity.bind(this, 1, 0));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.addDownFunction(this._setStepEditIntensity.bind(this, 1, -1));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.addDownOnHoverFunction(this._setStepEditIntensity.bind(this, 1, -1));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.addUpFunction(this._setStepEditIntensity.bind(this, 1, 0));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.addUpWithNoDownFunction(this._setStepEditIntensity.bind(this, 1, 0));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.addUnHoverFunction(this._setStepEditIntensity.bind(this, 1, 0));

        ui.myRotationStepIncreaseButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myRotationStepIncreaseButtonBackgroundComponent.material));
        ui.myRotationStepIncreaseButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myRotationStepIncreaseButtonBackgroundComponent.material));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myRotationStepDecreaseButtonBackgroundComponent.material));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myRotationStepDecreaseButtonBackgroundComponent.material));

        ui.myScaleStepCursorTargetComponent.addClickFunction(this._resetStep.bind(this, 2));
        ui.myScaleStepCursorTargetComponent.addHoverFunction(this._setStepEditActive.bind(this, 2, ui.myScaleStepText, true));
        ui.myScaleStepCursorTargetComponent.addUnHoverFunction(this._setStepEditActive.bind(this, 2, ui.myScaleStepText, false));

        ui.myScaleStepIncreaseButtonCursorTargetComponent.addDownFunction(this._setStepEditIntensity.bind(this, 2, 1));
        ui.myScaleStepIncreaseButtonCursorTargetComponent.addDownOnHoverFunction(this._setStepEditIntensity.bind(this, 2, 1));
        ui.myScaleStepIncreaseButtonCursorTargetComponent.addUpFunction(this._setStepEditIntensity.bind(this, 2, 0));
        ui.myScaleStepIncreaseButtonCursorTargetComponent.addUpWithNoDownFunction(this._setStepEditIntensity.bind(this, 2, 0));
        ui.myScaleStepIncreaseButtonCursorTargetComponent.addUnHoverFunction(this._setStepEditIntensity.bind(this, 2, 0));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.addDownFunction(this._setStepEditIntensity.bind(this, 2, -1));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.addDownOnHoverFunction(this._setStepEditIntensity.bind(this, 2, -1));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.addUpFunction(this._setStepEditIntensity.bind(this, 2, 0));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.addUpWithNoDownFunction(this._setStepEditIntensity.bind(this, 2, 0));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.addUnHoverFunction(this._setStepEditIntensity.bind(this, 2, 0));

        ui.myScaleStepIncreaseButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myScaleStepIncreaseButtonBackgroundComponent.material));
        ui.myScaleStepIncreaseButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myScaleStepIncreaseButtonBackgroundComponent.material));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myScaleStepDecreaseButtonBackgroundComponent.material));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myScaleStepDecreaseButtonBackgroundComponent.material));

    }

    _setValueEditIntensity(componentIndex, index, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                switch (componentIndex) {
                    case 0:
                        this._myValueRealValue = this._myVariable.myPosition[index];
                        this._myComponentStepValue = this._myVariable.myPositionStepPerSecond;
                        break;
                    case 1:
                        this._myValueRealValue = this._myVariable.myRotation[index];
                        this._myComponentStepValue = this._myVariable.myRotationStepPerSecond;
                        break;
                    case 2:
                        this._myValueRealValue = this._myVariable.myScale[index];
                        this._myComponentStepValue = this._myVariable.myScaleStepPerSecond;
                        break;
                }

                this._myValueButtonEditIntensityTimer = this._mySetup.myButtonEditDelay;
                this._myValueEditIndex = index;
                this._myComponentIndex = componentIndex;
            }

            this._myValueButtonEditIntensity = value;
        }
    }

    _setStepEditIntensity(index, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myStepButtonEditIntensityTimer = this._mySetup.myButtonEditDelay;
            }

            this._myStepButtonEditIntensity = value;

            this._myStepIndex = index;
        }
    }

    _setValueEditActive(componentIndex, index, text, active) {
        if (this._isActive() || !active) {
            if (active) {
                switch (componentIndex) {
                    case 0:
                        this._myValueRealValue = this._myVariable.myPosition[index];
                        this._myComponentStepValue = this._myVariable.myPositionStepPerSecond;
                        break;
                    case 1:
                        this._myValueRealValue = this._myVariable.myRotation[index];
                        this._myComponentStepValue = this._myVariable.myRotationStepPerSecond;
                        break;
                    case 2:
                        this._myValueRealValue = this._myVariable.myScale[index];
                        this._myComponentStepValue = this._myVariable.myScaleStepPerSecond;
                        break;
                }

                this._myValueEditIndex = index;
                this._myComponentIndex = componentIndex;
                text.scale(this._mySetup.myTextHoverScaleMultiplier);
            } else {
                text.scalingWorld = this._mySetup.myValueTextScale;
            }

            this._myValueEditActive = active;
        }
    }

    _setStepEditActive(index, text, active) {
        if (this._isActive() || !active) {
            if (active) {
                text.scale(this._mySetup.myTextHoverScaleMultiplier);
            } else {
                text.scalingWorld = this._mySetup.myStepTextScale;
            }

            this._myStepEditActive = active;
            this._myStepIndex = index;
        }
    }

    _resetValue(componentIndex, index) {
        if (this._isActive()) {
            switch (componentIndex) {
                case 0:
                    this._myVariable.myPosition[index] = this._myVariable.myDefaultPosition[index];
                    this._myUI.myPositionTextComponents[index].text = this._myVariable.myPosition[index].toFixed(this._myVariable.myDecimalPlaces);
                    break;
                case 1:
                    this._myVariable.myRotation[index] = this._myVariable.myDefaultRotation[index];
                    this._myUI.myRotationTextComponents[index].text = this._myVariable.myRotation[index].toFixed(this._myVariable.myDecimalPlaces);
                    break;
                case 2:
                    this._myVariable.myScale[index] = this._myVariable.myDefaultScale[index];
                    this._myUI.myScaleTextComponents[index].text = this._myVariable.myScale[index].toFixed(this._myVariable.myDecimalPlaces);
                    break;
                default:
                    defaultValue = 0;
            }
        }
    }

    _resetAllValues() {
        for (let i = 0; i < 3; i++) {
            this._resetComponentValues(i);
        }
    }

    _resetComponentValues(index) {
        for (let i = 0; i < 3; i++) {
            this._resetValue(index, i);
        }
    }

    _resetStep(index) {
        if (this._isActive()) {
            let defaultValue = 0;
            switch (index) {
                case 0:
                    defaultValue = this._myVariable.myDefaultPositionStepPerSecond;
                    break;
                case 1:
                    defaultValue = this._myVariable.myDefaultRotationStepPerSecond;
                    break;
                case 2:
                    defaultValue = this._myVariable.myDefaultScaleStepPerSecond;
                    break;
                default:
                    defaultValue = 0;
            }

            this._changeStep(index, defaultValue);
        }
    }

    _changeStep(index, step) {
        step = Math.pp_roundDecimal(step, 10);

        switch (index) {
            case 0:
                this._myVariable.myPositionStepPerSecond = step;
                this._myUI.myPositionStepTextComponent.text = this._mySetup.myStepStartString.concat(this._myVariable.myPositionStepPerSecond);
                break;
            case 1:
                this._myVariable.myRotationStepPerSecond = step;
                this._myUI.myRotationStepTextComponent.text = this._mySetup.myStepStartString.concat(this._myVariable.myRotationStepPerSecond);
                break;
            case 2:
                this._myVariable.myScaleStepPerSecond = step;
                this._myUI.myScaleStepTextComponent.text = this._mySetup.myStepStartString.concat(this._myVariable.myScaleStepPerSecond);
                break;
        }
    }

    _genericTextHover(text) {
        text.scale(this._mySetup.myTextHoverScaleMultiplier);
    }

    _genericTextUnHover(text, originalScale) {
        text.scalingWorld = originalScale;
    }
};
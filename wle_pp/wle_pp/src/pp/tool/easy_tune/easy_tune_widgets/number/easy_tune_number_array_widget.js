import { GamepadAxesID } from "../../../../input/gamepad/gamepad_buttons.js";
import { Globals } from "../../../../pp/globals.js";
import { EasyTuneBaseWidget } from "../base/easy_tune_base_widget.js";
import { EasyTuneNumberArrayWidgetConfig } from "./easy_tune_number_array_widget_config.js";
import { EasyTuneNumberArrayWidgetUI } from "./easy_tune_number_array_widget_ui.js";

export class EasyTuneNumberArrayWidget extends EasyTuneBaseWidget {

    constructor(params, arraySize, gamepad, engine = Globals.getMainEngine()) {
        super(params);

        this._myGamepad = gamepad;

        this._myNonArray = arraySize == null;
        this._myArraySize = this._myNonArray ? 1 : arraySize;

        this._myConfig = new EasyTuneNumberArrayWidgetConfig(this._myArraySize);
        this._myUI = new EasyTuneNumberArrayWidgetUI(engine);

        this._myValueEditIndex = -1;

        this._myValueButtonEditIntensity = 0;
        this._myValueButtonEditIntensityTimer = 0;
        this._myStepButtonEditIntensity = 0;
        this._myStepButtonEditIntensityTimer = 0;

        this._myValueEditEnabled = false;
        this._myStepEditEnabled = false;

        this._myValueRealValue = 0;
        this._myStepMultiplierValue = 0;
        this._myStepFastEdit = false;

        this._myTempValue = [];

        this._myTempNonArrayValue = [0];
        this._myTempNonArrayDefaultValue = [0];
    }

    _refreshUIHook() {
        for (let i = 0; i < this._myArraySize; i++) {
            this._myUI.myValueTextComponents[i].text = this._getVariableValue()[i].toFixed(this._myVariable._myDecimalPlaces);
        }

        this._myUI.myStepTextComponent.text = this._myConfig.myStepStartString.concat(this._myVariable._myStepPerSecond);
    }


    _startHook(parentObject, easyTuneParams) {
        this._myUI.setAdditionalButtonsVisible(easyTuneParams.myShowAdditionalButtons);
    }

    _setEasyTuneVariableHook() {
        if (this._myVariable != null) {
            this._myTempValue.pp_copy(this._getVariableValue());
        }
    }

    _updateHook(dt) {
        this._updateValue(dt);
    }

    _updateValue(dt) {
        let stickVariableIntensity = 0;

        if (this._myGamepad) {
            let y = this._myGamepad.getAxesInfo(GamepadAxesID.THUMBSTICK).myAxes[1];

            if (Math.abs(y) > this._myConfig.myEditThumbstickMinThreshold) {
                let normalizedEditAmount = (Math.abs(y) - this._myConfig.myEditThumbstickMinThreshold) / (1 - this._myConfig.myEditThumbstickMinThreshold);
                stickVariableIntensity = Math.sign(y) * normalizedEditAmount;
            }
        }

        let valueIntensity = 0;
        if (this._myValueEditEnabled) {
            valueIntensity = stickVariableIntensity;
        } else if (this._myValueButtonEditIntensity != 0) {
            if (this._myValueButtonEditIntensityTimer <= 0) {
                valueIntensity = this._myValueButtonEditIntensity;
            } else {
                this._myValueButtonEditIntensityTimer -= dt;
            }
        }

        if (this._myValueEditIndex >= 0 && this._myValueEditIndex < this._getVariableValue().length) {
            if (valueIntensity != 0) {
                let amountToAdd = valueIntensity * this._myVariable._myStepPerSecond * dt;

                this._myValueRealValue += amountToAdd;

                if (this._myVariable._myMin != null && this._myVariable._myMax != null) {
                    this._myValueRealValue = Math.pp_clamp(this._myValueRealValue, this._myVariable._myMin, this._myVariable._myMax);
                } else if (this._myVariable._myMin != null) {
                    this._myValueRealValue = Math.max(this._myValueRealValue, this._myVariable._myMin);
                } else if (this._myVariable._myMax != null) {
                    this._myValueRealValue = Math.min(this._myValueRealValue, this._myVariable._myMax);
                }

                let decimalPlacesMultiplier = Math.pow(10, this._myVariable._myDecimalPlaces);

                this._myTempValue.pp_copy(this._getVariableValue());

                if (this._myVariable._myEditAllValuesTogether) {
                    let newValue = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                    let difference = newValue - this._myTempValue[this._myValueEditIndex];

                    for (let i = 0; i < this._myArraySize; i++) {
                        this._myTempValue[i] = Math.round((this._myTempValue[i] + difference) * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;

                        if (this._myVariable._myMin != null && this._myVariable._myMax != null) {
                            this._myTempValue[i] = Math.pp_clamp(this._myTempValue[i], this._myVariable._myMin, this._myVariable._myMax);
                        } else if (this._myVariable._myMin != null) {
                            this._myTempValue[i] = Math.max(this._myTempValue[i], this._myVariable._myMin);
                        } else if (this._myVariable._myMax != null) {
                            this._myTempValue[i] = Math.min(this._myTempValue[i], this._myVariable._myMax);
                        }

                        this._myUI.myValueTextComponents[i].text = this._myTempValue[i].toFixed(this._myVariable._myDecimalPlaces);
                    }

                } else {
                    this._myTempValue[this._myValueEditIndex] = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;

                    if (this._myVariable._myMin != null && this._myVariable._myMax != null) {
                        this._myTempValue[this._myValueEditIndex] = Math.pp_clamp(this._myTempValue[this._myValueEditIndex], this._myVariable._myMin, this._myVariable._myMax);
                    } else if (this._myVariable._myMin != null) {
                        this._myTempValue[this._myValueEditIndex] = Math.max(this._myTempValue[this._myValueEditIndex], this._myVariable._myMin);
                    } else if (this._myVariable._myMax != null) {
                        this._myTempValue[this._myValueEditIndex] = Math.min(this._myTempValue[this._myValueEditIndex], this._myVariable._myMax);
                    }

                    this._myUI.myValueTextComponents[this._myValueEditIndex].text = this._myTempValue[this._myValueEditIndex].toFixed(this._myVariable._myDecimalPlaces);
                }

                this._setVariableValue(this._myTempValue);
            } else {
                this._myValueRealValue = this._getVariableValue()[this._myValueEditIndex];
            }
        }

        let stepIntensity = 0;
        if (this._myStepEditEnabled) {
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
                amountToAdd = stepIntensity * this._myConfig.myStepMultiplierStepPerSecond * dt;
            }

            this._myStepMultiplierValue += amountToAdd;
            if (Math.abs(this._myStepMultiplierValue) >= 1) {
                if (Math.sign(this._myStepMultiplierValue) > 0) {
                    this._myStepMultiplierValue -= 1;
                    this._changeStep(this._myVariable._myStepPerSecond * 10);
                } else {
                    this._myStepMultiplierValue += 1;
                    this._changeStep(this._myVariable._myStepPerSecond * 0.1);
                }
            }
        } else {
            this._myStepMultiplierValue = 0;
            this._myStepFastEdit = true;
        }
    }

    _addListenersHook() {
        let ui = this._myUI;

        ui.myVariableLabelCursorTargetComponent.onClick.add(this._resetAllValues.bind(this));
        ui.myVariableLabelCursorTargetComponent.onHover.add(this._genericTextHover.bind(this, ui.myVariableLabelText));
        ui.myVariableLabelCursorTargetComponent.onUnhover.add(this._genericTextUnhover.bind(this, ui.myVariableLabelText, this._myConfig.myVariableLabelTextScale));

        for (let i = 0; i < this._myArraySize; i++) {
            ui.myValueIncreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, i, 1));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, i, 1));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, i, -1));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, i, -1));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, i, 0));

            ui.myValueIncreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myValueIncreaseButtonBackgroundComponents[i].material));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnhover.bind(this, ui.myValueIncreaseButtonBackgroundComponents[i].material));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myValueDecreaseButtonBackgroundComponents[i].material));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnhover.bind(this, ui.myValueDecreaseButtonBackgroundComponents[i].material));

            ui.myValueCursorTargetComponents[i].onClick.add(this._resetValue.bind(this, i));
            ui.myValueCursorTargetComponents[i].onHover.add(this._setValueEditEnabled.bind(this, i, ui.myValueTexts[i], true));
            ui.myValueCursorTargetComponents[i].onUnhover.add(this._setValueEditEnabled.bind(this, i, ui.myValueTexts[i], false));
        }

        ui.myStepCursorTargetComponent.onClick.add(this._resetStep.bind(this));
        ui.myStepCursorTargetComponent.onHover.add(this._setStepEditEnabled.bind(this, ui.myStepText, true));
        ui.myStepCursorTargetComponent.onUnhover.add(this._setStepEditEnabled.bind(this, ui.myStepText, false));

        ui.myStepIncreaseButtonCursorTargetComponent.onDown.add(this._setStepEditIntensity.bind(this, 1));
        ui.myStepIncreaseButtonCursorTargetComponent.onDownOnHover.add(this._setStepEditIntensity.bind(this, 1));
        ui.myStepIncreaseButtonCursorTargetComponent.onUp.add(this._setStepEditIntensity.bind(this, 0));
        ui.myStepIncreaseButtonCursorTargetComponent.onUnhover.add(this._setStepEditIntensity.bind(this, 0));
        ui.myStepDecreaseButtonCursorTargetComponent.onDown.add(this._setStepEditIntensity.bind(this, -1));
        ui.myStepDecreaseButtonCursorTargetComponent.onDownOnHover.add(this._setStepEditIntensity.bind(this, -1));
        ui.myStepDecreaseButtonCursorTargetComponent.onUp.add(this._setStepEditIntensity.bind(this, 0));
        ui.myStepDecreaseButtonCursorTargetComponent.onUnhover.add(this._setStepEditIntensity.bind(this, 0));

        ui.myStepIncreaseButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myStepIncreaseButtonBackgroundComponent.material));
        ui.myStepIncreaseButtonCursorTargetComponent.onUnhover.add(this._genericUnhover.bind(this, ui.myStepIncreaseButtonBackgroundComponent.material));
        ui.myStepDecreaseButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myStepDecreaseButtonBackgroundComponent.material));
        ui.myStepDecreaseButtonCursorTargetComponent.onUnhover.add(this._genericUnhover.bind(this, ui.myStepDecreaseButtonBackgroundComponent.material));
    }

    _setValueEditIntensity(index, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myValueButtonEditIntensityTimer = this._myConfig.myButtonEditDelay;
                this._myValueRealValue = this._getVariableValue()[index];
                this._myValueEditIndex = index;
            }

            this._myValueButtonEditIntensity = value;
        }
    }

    _setStepEditIntensity(value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myStepButtonEditIntensityTimer = this._myConfig.myButtonEditDelay;
            }

            this._myStepButtonEditIntensity = value;
        }
    }

    _setValueEditEnabled(index, text, enabled) {
        if (this._isActive() || !enabled) {
            if (enabled) {
                this._myValueRealValue = this._getVariableValue()[index];
                this._myValueEditIndex = index;
                text.pp_scaleObject(this._myConfig.myTextHoverScaleMultiplier);
            } else {
                text.pp_setScaleLocal(this._myConfig.myValueTextScale);
            }

            this._myValueEditEnabled = enabled;
        }
    }

    _setStepEditEnabled(text, enabled) {
        if (this._isActive() || !enabled) {
            if (enabled) {
                text.pp_scaleObject(this._myConfig.myTextHoverScaleMultiplier);
            } else {
                text.pp_setScaleLocal(this._myConfig.myStepTextScale);
            }

            this._myStepEditEnabled = enabled;
        }
    }

    _resetValue(index) {
        if (this._isActive()) {
            this._myTempValue.pp_copy(this._getVariableValue());
            this._myTempValue[index] = this._getVariableDefaultValue()[index];
            this._setVariableValue(this._myTempValue);

            this._myUI.myValueTextComponents[index].text = this._getVariableValue()[index].toFixed(this._myVariable._myDecimalPlaces);
        }
    }

    _resetAllValues() {
        for (let i = 0; i < this._myArraySize; i++) {
            this._resetValue(i);
        }
    }

    _resetStep() {
        if (this._isActive()) {
            this._changeStep(this._myVariable._myDefaultStepPerSecond);
        }
    }

    _changeStep(step) {
        step = Math.pp_roundDecimal(step, 10);
        this._myVariable._myStepPerSecond = step;
        this._myUI.myStepTextComponent.text = this._myConfig.myStepStartString.concat(this._myVariable._myStepPerSecond);
    }

    _genericTextHover(text) {
        text.pp_scaleObject(this._myConfig.myTextHoverScaleMultiplier);
    }

    _genericTextUnhover(text, originalScale) {
        text.pp_setScaleLocal(originalScale);
    }

    _getVariableValue() {
        if (this._myNonArray) {
            this._myTempNonArrayValue[0] = this._myVariable.getValue();
            return this._myTempNonArrayValue;
        }

        return this._myVariable.getValue();
    }

    _getVariableDefaultValue() {
        if (this._myNonArray) {
            this._myTempNonArrayDefaultValue[0] = this._myVariable.getDefaultValue();
            return this._myTempNonArrayDefaultValue;
        }

        return this._myVariable.getDefaultValue();
    }

    _setVariableValue(value) {
        if (this._myNonArray) {
            this._myVariable.setValue(value[0]);
        } else {
            this._myVariable.setValue(this._myTempValue);
        }
    }
}
import { GamepadAxesID } from "../../../../input/gamepad/gamepad_buttons";
import { mat4_create, vec3_create } from "../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../pp/globals";
import { EasyTuneBaseWidget } from "../base/easy_tune_base_widget";
import { EasyTuneTransformWidgetConfig } from "./easy_tune_transform_widget_config";
import { EasyTuneTransformWidgetUI } from "./easy_tune_transform_widget_ui";

export class EasyTuneTransformWidget extends EasyTuneBaseWidget {

    constructor(params, gamepad, engine = Globals.getMainEngine()) {
        super(params);

        this._myGamepad = gamepad;

        this._myConfig = new EasyTuneTransformWidgetConfig();
        this._myUI = new EasyTuneTransformWidgetUI(engine);

        this._myValueButtonEditIntensity = 0;
        this._myValueButtonEditIntensityTimer = 0;
        this._myStepButtonEditIntensity = 0;
        this._myStepButtonEditIntensityTimer = 0;

        this._myValueEditEnabled = false;
        this._myStepEditEnabled = false;

        this._myValueRealValue = 0;
        this._myComponentStepValue = 0;
        this._myStepMultiplierValue = 0;
        this._myStepFastEdit = false;

        this._myValueEditIndex = -1;
        this._myComponentIndex = 0;
        this._myStepIndex = 0;

        this._myTempTransformValue = mat4_create();
        this._myTempPositionValue = vec3_create();
        this._myTempRotationValue = vec3_create();
        this._myTempScaleValue = vec3_create();
    }

    _setEasyTuneVariableHook() {
        if (this._myValueEditIndex >= 0) {
            switch (this._myComponentIndex) {
                case 0:
                    this._myValueRealValue = this._myVariable._myPosition[this._myValueEditIndex];
                    this._myComponentStepValue = this._myVariable._myPositionStepPerSecond;
                    break;
                case 1:
                    this._myValueRealValue = this._myVariable._myRotation[this._myValueEditIndex];
                    this._myComponentStepValue = this._myVariable._myRotationStepPerSecond;
                    break;
                case 2:
                    this._myValueRealValue = this._myVariable._myScale[this._myValueEditIndex];
                    this._myComponentStepValue = this._myVariable._myScaleStepPerSecond;
                    break;
            }
        }
    }

    _refreshUIHook() {
        for (let i = 0; i < 3; i++) {
            this._myUI.myPositionTextComponents[i].text = this._myVariable._myPosition[i].toFixed(this._myVariable._myDecimalPlaces);
        }
        this._myUI.myPositionStepTextComponent.text = this._myConfig.myStepStartString.concat(this._myVariable._myPositionStepPerSecond);

        for (let i = 0; i < 3; i++) {
            this._myUI.myRotationTextComponents[i].text = this._myVariable._myRotation[i].toFixed(this._myVariable._myDecimalPlaces);
        }
        this._myUI.myRotationStepTextComponent.text = this._myConfig.myStepStartString.concat(this._myVariable._myRotationStepPerSecond);

        for (let i = 0; i < 3; i++) {
            this._myUI.myScaleTextComponents[i].text = this._myVariable._myScale[i].toFixed(this._myVariable._myDecimalPlaces);
        }
        this._myUI.myScaleStepTextComponent.text = this._myConfig.myStepStartString.concat(this._myVariable._myScaleStepPerSecond);
    }

    _startHook(parentObject, easyTuneParams) {
        this._myUI.setAdditionalButtonsVisible(easyTuneParams.myAdditionalButtonsVisible);
    }

    _setEasyTuneVariableHook() {
        if (this._myVariable != null) {
            this._myTempPositionValue.pp_copy(this._myVariable._myPosition);
            this._myTempRotationValue.pp_copy(this._myVariable._myRotation);
            this._myTempScaleValue.pp_copy(this._myVariable._myScale);
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

        if (valueIntensity != 0) {
            this._myTempPositionValue.pp_copy(this._myVariable._myPosition);
            this._myTempRotationValue.pp_copy(this._myVariable._myRotation);
            this._myTempScaleValue.pp_copy(this._myVariable._myScale);

            let amountToAdd = valueIntensity * this._myComponentStepValue * dt;

            this._myValueRealValue += amountToAdd;

            let decimalPlacesMultiplier = Math.pow(10, this._myVariable._myDecimalPlaces);

            switch (this._myComponentIndex) {
                case 0:
                    this._myTempPositionValue[this._myValueEditIndex] = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                    this._myUI.myPositionTextComponents[this._myValueEditIndex].text = this._myTempPositionValue[this._myValueEditIndex].toFixed(this._myVariable._myDecimalPlaces);
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

                    this._myTempRotationValue[this._myValueEditIndex] = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                    this._myUI.myRotationTextComponents[this._myValueEditIndex].text = this._myTempRotationValue[this._myValueEditIndex].toFixed(this._myVariable._myDecimalPlaces);
                    break;
                case 2:
                    if (this._myValueRealValue <= 0) {
                        this._myValueRealValue = 1 / decimalPlacesMultiplier;
                    }

                    if (this._myVariable._myScaleAsOne) {
                        let newValue = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                        let difference = newValue - this._myTempScaleValue[this._myValueEditIndex];

                        for (let i = 0; i < 3; i++) {
                            this._myTempScaleValue[i] = Math.round((this._myTempScaleValue[i] + difference) * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                            this._myTempScaleValue[i] = Math.max(this._myTempScaleValue[i], 1 / decimalPlacesMultiplier);
                            this._myUI.myScaleTextComponents[i].text = this._myTempScaleValue[i].toFixed(this._myVariable._myDecimalPlaces);
                        }
                    } else {
                        this._myTempScaleValue[this._myValueEditIndex] = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
                        this._myTempScaleValue[this._myValueEditIndex] = Math.max(this._myTempScaleValue[this._myValueEditIndex], 1 / decimalPlacesMultiplier);
                        this._myUI.myScaleTextComponents[this._myValueEditIndex].text = this._myTempScaleValue[this._myValueEditIndex].toFixed(this._myVariable._myDecimalPlaces);
                    }
                    break;
            }

            this._myTempTransformValue.mat4_setPositionRotationDegreesScale(this._myTempPositionValue, this._myTempRotationValue, this._myTempScaleValue);
            this._myVariable.setValue(this._myTempTransformValue);
        } else {
            switch (this._myComponentIndex) {
                case 0:
                    this._myValueRealValue = this._myVariable._myPosition[this._myValueEditIndex];
                    break;
                case 1:
                    this._myValueRealValue = this._myVariable._myRotation[this._myValueEditIndex];
                    break;
                case 2:
                    this._myValueRealValue = this._myVariable._myScale[this._myValueEditIndex];
                    break;
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
                let stepValue = 0;
                switch (this._myStepIndex) {
                    case 0:
                        stepValue = this._myVariable._myPositionStepPerSecond;
                        break;
                    case 1:
                        stepValue = this._myVariable._myRotationStepPerSecond;
                        break;
                    case 2:
                        stepValue = this._myVariable._myScaleStepPerSecond;
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

        ui.myVariableLabelCursorTargetComponent.onClick.add(this._resetAllValues.bind(this));
        ui.myVariableLabelCursorTargetComponent.onHover.add(this._genericTextHover.bind(this, ui.myVariableLabelText));
        ui.myVariableLabelCursorTargetComponent.onUnhover.add(this._genericTextUnHover.bind(this, ui.myVariableLabelText, this._myConfig.myVariableLabelTextScale));

        ui.myPositionLabelCursorTargetComponent.onClick.add(this._resetComponentValues.bind(this, 0));
        ui.myPositionLabelCursorTargetComponent.onHover.add(this._genericTextHover.bind(this, ui.myPositionLabelText));
        ui.myPositionLabelCursorTargetComponent.onUnhover.add(this._genericTextUnHover.bind(this, ui.myPositionLabelText, this._myConfig.myComponentLabelTextScale));
        for (let i = 0; i < 3; i++) {
            ui.myPositionIncreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, 0, i, 1));
            ui.myPositionIncreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, 0, i, 1));
            ui.myPositionIncreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, 0, i, 0));
            ui.myPositionIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, 0, i, 0));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, 0, i, -1));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, 0, i, -1));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, 0, i, 0));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, 0, i, 0));

            ui.myPositionIncreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myPositionIncreaseButtonBackgroundComponents[i].material));
            ui.myPositionIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnHover.bind(this, ui.myPositionIncreaseButtonBackgroundComponents[i].material));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myPositionDecreaseButtonBackgroundComponents[i].material));
            ui.myPositionDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnHover.bind(this, ui.myPositionDecreaseButtonBackgroundComponents[i].material));

            ui.myPositionCursorTargetComponents[i].onClick.add(this._resetValue.bind(this, 0, i));
            ui.myPositionCursorTargetComponents[i].onHover.add(this._setValueEditEnabled.bind(this, 0, i, ui.myPositionTexts[i], true));
            ui.myPositionCursorTargetComponents[i].onUnhover.add(this._setValueEditEnabled.bind(this, 0, i, ui.myPositionTexts[i], false));
        }

        ui.myRotationLabelCursorTargetComponent.onClick.add(this._resetComponentValues.bind(this, 1));
        ui.myRotationLabelCursorTargetComponent.onHover.add(this._genericTextHover.bind(this, ui.myRotationLabelText));
        ui.myRotationLabelCursorTargetComponent.onUnhover.add(this._genericTextUnHover.bind(this, ui.myRotationLabelText, this._myConfig.myComponentLabelTextScale));
        for (let i = 0; i < 3; i++) {
            ui.myRotationIncreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, 1, i, 1));
            ui.myRotationIncreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, 1, i, 1));
            ui.myRotationIncreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, 1, i, 0));
            ui.myRotationIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, 1, i, 0));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, 1, i, -1));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, 1, i, -1));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, 1, i, 0));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, 1, i, 0));

            ui.myRotationIncreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myRotationIncreaseButtonBackgroundComponents[i].material));
            ui.myRotationIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnHover.bind(this, ui.myRotationIncreaseButtonBackgroundComponents[i].material));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myRotationDecreaseButtonBackgroundComponents[i].material));
            ui.myRotationDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnHover.bind(this, ui.myRotationDecreaseButtonBackgroundComponents[i].material));

            ui.myRotationCursorTargetComponents[i].onClick.add(this._resetValue.bind(this, 1, i));
            ui.myRotationCursorTargetComponents[i].onHover.add(this._setValueEditEnabled.bind(this, 1, i, ui.myRotationTexts[i], true));
            ui.myRotationCursorTargetComponents[i].onUnhover.add(this._setValueEditEnabled.bind(this, 1, i, ui.myRotationTexts[i], false));
        }

        ui.myScaleLabelCursorTargetComponent.onClick.add(this._resetComponentValues.bind(this, 2));
        ui.myScaleLabelCursorTargetComponent.onHover.add(this._genericTextHover.bind(this, ui.myScaleLabelText));
        ui.myScaleLabelCursorTargetComponent.onUnhover.add(this._genericTextUnHover.bind(this, ui.myScaleLabelText, this._myConfig.myComponentLabelTextScale));
        for (let i = 0; i < 3; i++) {
            ui.myScaleIncreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, 2, i, 1));
            ui.myScaleIncreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, 2, i, 1));
            ui.myScaleIncreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, 2, i, 0));
            ui.myScaleIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, 2, i, 0));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, 2, i, -1));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, 2, i, -1));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, 2, i, 0));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, 2, i, 0));

            ui.myScaleIncreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myScaleIncreaseButtonBackgroundComponents[i].material));
            ui.myScaleIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnHover.bind(this, ui.myScaleIncreaseButtonBackgroundComponents[i].material));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myScaleDecreaseButtonBackgroundComponents[i].material));
            ui.myScaleDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnHover.bind(this, ui.myScaleDecreaseButtonBackgroundComponents[i].material));

            ui.myScaleCursorTargetComponents[i].onClick.add(this._resetValue.bind(this, 2, i));
            ui.myScaleCursorTargetComponents[i].onHover.add(this._setValueEditEnabled.bind(this, 2, i, ui.myScaleTexts[i], true));
            ui.myScaleCursorTargetComponents[i].onUnhover.add(this._setValueEditEnabled.bind(this, 2, i, ui.myScaleTexts[i], false));
        }

        ui.myPositionStepCursorTargetComponent.onClick.add(this._resetStep.bind(this, 0));
        ui.myPositionStepCursorTargetComponent.onHover.add(this._setStepEditEnabled.bind(this, 0, ui.myPositionStepText, true));
        ui.myPositionStepCursorTargetComponent.onUnhover.add(this._setStepEditEnabled.bind(this, 0, ui.myPositionStepText, false));

        ui.myPositionStepIncreaseButtonCursorTargetComponent.onDown.add(this._setStepEditIntensity.bind(this, 0, 1));
        ui.myPositionStepIncreaseButtonCursorTargetComponent.onDownOnHover.add(this._setStepEditIntensity.bind(this, 0, 1));
        ui.myPositionStepIncreaseButtonCursorTargetComponent.onUp.add(this._setStepEditIntensity.bind(this, 0, 0));
        ui.myPositionStepIncreaseButtonCursorTargetComponent.onUnhover.add(this._setStepEditIntensity.bind(this, 0, 0));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.onDown.add(this._setStepEditIntensity.bind(this, 0, -1));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.onDownOnHover.add(this._setStepEditIntensity.bind(this, 0, -1));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.onUp.add(this._setStepEditIntensity.bind(this, 0, 0));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.onUnhover.add(this._setStepEditIntensity.bind(this, 0, 0));

        ui.myPositionStepIncreaseButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myPositionStepIncreaseButtonBackgroundComponent.material));
        ui.myPositionStepIncreaseButtonCursorTargetComponent.onUnhover.add(this._genericUnHover.bind(this, ui.myPositionStepIncreaseButtonBackgroundComponent.material));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myPositionStepDecreaseButtonBackgroundComponent.material));
        ui.myPositionStepDecreaseButtonCursorTargetComponent.onUnhover.add(this._genericUnHover.bind(this, ui.myPositionStepDecreaseButtonBackgroundComponent.material));

        ui.myRotationStepCursorTargetComponent.onClick.add(this._resetStep.bind(this, 1));
        ui.myRotationStepCursorTargetComponent.onHover.add(this._setStepEditEnabled.bind(this, 1, ui.myRotationStepText, true));
        ui.myRotationStepCursorTargetComponent.onUnhover.add(this._setStepEditEnabled.bind(this, 1, ui.myRotationStepText, false));

        ui.myRotationStepIncreaseButtonCursorTargetComponent.onDown.add(this._setStepEditIntensity.bind(this, 1, 1));
        ui.myRotationStepIncreaseButtonCursorTargetComponent.onDownOnHover.add(this._setStepEditIntensity.bind(this, 1, 1));
        ui.myRotationStepIncreaseButtonCursorTargetComponent.onUp.add(this._setStepEditIntensity.bind(this, 1, 0));
        ui.myRotationStepIncreaseButtonCursorTargetComponent.onUnhover.add(this._setStepEditIntensity.bind(this, 1, 0));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.onDown.add(this._setStepEditIntensity.bind(this, 1, -1));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.onDownOnHover.add(this._setStepEditIntensity.bind(this, 1, -1));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.onUp.add(this._setStepEditIntensity.bind(this, 1, 0));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.onUnhover.add(this._setStepEditIntensity.bind(this, 1, 0));

        ui.myRotationStepIncreaseButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myRotationStepIncreaseButtonBackgroundComponent.material));
        ui.myRotationStepIncreaseButtonCursorTargetComponent.onUnhover.add(this._genericUnHover.bind(this, ui.myRotationStepIncreaseButtonBackgroundComponent.material));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myRotationStepDecreaseButtonBackgroundComponent.material));
        ui.myRotationStepDecreaseButtonCursorTargetComponent.onUnhover.add(this._genericUnHover.bind(this, ui.myRotationStepDecreaseButtonBackgroundComponent.material));

        ui.myScaleStepCursorTargetComponent.onClick.add(this._resetStep.bind(this, 2));
        ui.myScaleStepCursorTargetComponent.onHover.add(this._setStepEditEnabled.bind(this, 2, ui.myScaleStepText, true));
        ui.myScaleStepCursorTargetComponent.onUnhover.add(this._setStepEditEnabled.bind(this, 2, ui.myScaleStepText, false));

        ui.myScaleStepIncreaseButtonCursorTargetComponent.onDown.add(this._setStepEditIntensity.bind(this, 2, 1));
        ui.myScaleStepIncreaseButtonCursorTargetComponent.onDownOnHover.add(this._setStepEditIntensity.bind(this, 2, 1));
        ui.myScaleStepIncreaseButtonCursorTargetComponent.onUp.add(this._setStepEditIntensity.bind(this, 2, 0));
        ui.myScaleStepIncreaseButtonCursorTargetComponent.onUnhover.add(this._setStepEditIntensity.bind(this, 2, 0));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.onDown.add(this._setStepEditIntensity.bind(this, 2, -1));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.onDownOnHover.add(this._setStepEditIntensity.bind(this, 2, -1));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.onUp.add(this._setStepEditIntensity.bind(this, 2, 0));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.onUnhover.add(this._setStepEditIntensity.bind(this, 2, 0));

        ui.myScaleStepIncreaseButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myScaleStepIncreaseButtonBackgroundComponent.material));
        ui.myScaleStepIncreaseButtonCursorTargetComponent.onUnhover.add(this._genericUnHover.bind(this, ui.myScaleStepIncreaseButtonBackgroundComponent.material));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myScaleStepDecreaseButtonBackgroundComponent.material));
        ui.myScaleStepDecreaseButtonCursorTargetComponent.onUnhover.add(this._genericUnHover.bind(this, ui.myScaleStepDecreaseButtonBackgroundComponent.material));

    }

    _setValueEditIntensity(componentIndex, index, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                switch (componentIndex) {
                    case 0:
                        this._myValueRealValue = this._myVariable._myPosition[index];
                        this._myComponentStepValue = this._myVariable._myPositionStepPerSecond;
                        break;
                    case 1:
                        this._myValueRealValue = this._myVariable._myRotation[index];
                        this._myComponentStepValue = this._myVariable._myRotationStepPerSecond;
                        break;
                    case 2:
                        this._myValueRealValue = this._myVariable._myScale[index];
                        this._myComponentStepValue = this._myVariable._myScaleStepPerSecond;
                        break;
                }

                this._myValueButtonEditIntensityTimer = this._myConfig.myButtonEditDelay;
                this._myValueEditIndex = index;
                this._myComponentIndex = componentIndex;
            }

            this._myValueButtonEditIntensity = value;
        }
    }

    _setStepEditIntensity(index, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myStepButtonEditIntensityTimer = this._myConfig.myButtonEditDelay;
            }

            this._myStepButtonEditIntensity = value;

            this._myStepIndex = index;
        }
    }

    _setValueEditEnabled(componentIndex, index, text, enabled) {
        if (this._isActive() || !enabled) {
            if (enabled) {
                switch (componentIndex) {
                    case 0:
                        this._myValueRealValue = this._myVariable._myPosition[index];
                        this._myComponentStepValue = this._myVariable._myPositionStepPerSecond;
                        break;
                    case 1:
                        this._myValueRealValue = this._myVariable._myRotation[index];
                        this._myComponentStepValue = this._myVariable._myRotationStepPerSecond;
                        break;
                    case 2:
                        this._myValueRealValue = this._myVariable._myScale[index];
                        this._myComponentStepValue = this._myVariable._myScaleStepPerSecond;
                        break;
                }

                this._myValueEditIndex = index;
                this._myComponentIndex = componentIndex;
                text.pp_scaleObject(this._myConfig.myTextHoverScaleMultiplier);
            } else {
                text.pp_setScaleLocal(this._myConfig.myValueTextScale);
            }

            this._myValueEditEnabled = enabled;
        }
    }

    _setStepEditEnabled(index, text, enabled) {
        if (this._isActive() || !enabled) {
            if (enabled) {
                text.pp_scaleObject(this._myConfig.myTextHoverScaleMultiplier);
            } else {
                text.pp_setScaleLocal(this._myConfig.myStepTextScale);
            }

            this._myStepEditEnabled = enabled;
            this._myStepIndex = index;
        }
    }

    _resetValue(componentIndex, index) {
        if (this._isActive()) {
            this._myTempPositionValue.pp_copy(this._myVariable._myPosition);
            this._myTempRotationValue.pp_copy(this._myVariable._myRotation);
            this._myTempScaleValue.pp_copy(this._myVariable._myScale);

            switch (componentIndex) {
                case 0:
                    this._myTempPositionValue[index] = this._myVariable._myDefaultPosition[index];
                    this._myUI.myPositionTextComponents[index].text = this._myTempPositionValue[index].toFixed(this._myVariable._myDecimalPlaces);
                    break;
                case 1:
                    this._myTempRotationValue[index] = this._myVariable._myDefaultRotation[index];
                    this._myUI.myRotationTextComponents[index].text = this._myTempRotationValue[index].toFixed(this._myVariable._myDecimalPlaces);
                    break;
                case 2:
                    this._myTempScaleValue[index] = this._myVariable._myDefaultScale[index];
                    this._myUI.myScaleTextComponents[index].text = this._myTempScaleValue[index].toFixed(this._myVariable._myDecimalPlaces);
                    break;

            }

            this._myTempTransformValue.mat4_setPositionRotationDegreesScale(this._myTempPositionValue, this._myTempRotationValue, this._myTempScaleValue);
            this._myVariable.setValue(this._myTempTransformValue);
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
                    defaultValue = this._myVariable._myDefaultPositionStepPerSecond;
                    break;
                case 1:
                    defaultValue = this._myVariable._myDefaultRotationStepPerSecond;
                    break;
                case 2:
                    defaultValue = this._myVariable._myDefaultScaleStepPerSecond;
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
                this._myVariable._myPositionStepPerSecond = step;
                this._myUI.myPositionStepTextComponent.text = this._myConfig.myStepStartString.concat(this._myVariable._myPositionStepPerSecond);
                break;
            case 1:
                this._myVariable._myRotationStepPerSecond = step;
                this._myUI.myRotationStepTextComponent.text = this._myConfig.myStepStartString.concat(this._myVariable._myRotationStepPerSecond);
                break;
            case 2:
                this._myVariable._myScaleStepPerSecond = step;
                this._myUI.myScaleStepTextComponent.text = this._myConfig.myStepStartString.concat(this._myVariable._myScaleStepPerSecond);
                break;
        }
    }

    _genericTextHover(text) {
        text.pp_scaleObject(this._myConfig.myTextHoverScaleMultiplier);
    }

    _genericTextUnHover(text, originalScale) {
        text.pp_setScaleLocal(originalScale);
    }
}
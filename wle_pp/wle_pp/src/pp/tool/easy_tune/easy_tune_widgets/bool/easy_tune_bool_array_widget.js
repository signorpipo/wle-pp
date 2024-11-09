import { GamepadAxesID } from "../../../../input/gamepad/gamepad_buttons.js";
import { Globals } from "../../../../pp/globals.js";
import { EasyTuneBaseWidget } from "../base/easy_tune_base_widget.js";
import { EasyTuneBoolArrayWidgetConfig } from "./easy_tune_bool_array_widget_config.js";
import { EasyTuneBoolArrayWidgetUI } from "./easy_tune_bool_array_widget_ui.js";

export class EasyTuneBoolArrayWidget extends EasyTuneBaseWidget {

    constructor(params, arraySize, gamepad, engine = Globals.getMainEngine()) {
        super(params);

        this._myNonArray = arraySize == null;
        this._myArraySize = this._myNonArray ? 1 : arraySize;

        this._myConfig = new EasyTuneBoolArrayWidgetConfig(this._myArraySize);
        this._myUI = new EasyTuneBoolArrayWidgetUI(engine);

        this._myGamepad = gamepad;

        this._myValueEditIndex = 0;
        this._myValueButtonEditIntensity = 0;
        this._myValueButtonEditIntensityTimer = 0;
        this._myValueEditEnabled = false;

        this._myTempValue = [];

        this._myTempNonArrayValue = [0];
        this._myTempNonArrayDefaultValue = [0];
    }

    _refreshUIHook() {
        for (let i = 0; i < this._myArraySize; i++) {
            this._myUI.myValueTextComponents[i].text = (this._getVariableValue()[i]) ? "true" : "false";
        }
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
            stickVariableIntensity = this._myGamepad.getAxesInfo(GamepadAxesID.THUMBSTICK).myAxes[1];
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
            if (Math.abs(valueIntensity) > this._myConfig.myThumbstickToggleThreshold) {
                this._myTempValue.pp_copy(this._getVariableValue());
                this._myTempValue[this._myValueEditIndex] = valueIntensity > 0;
                this._setVariableValue(this._myTempValue);
                this._refreshUI();
            }
        }
    }

    _addListenersHook() {
        let ui = this._myUI;

        ui.myVariableLabelCursorTargetComponent.onClick.add(this._resetAllValues.bind(this));
        ui.myVariableLabelCursorTargetComponent.onHover.add(this._genericTextHover.bind(this, ui.myVariableLabelText));
        ui.myVariableLabelCursorTargetComponent.onUnhover.add(this._genericTextUnhover.bind(this, ui.myVariableLabelText, this._myConfig.myVariableLabelTextScale));

        this._myUnhoverCallbacks.push(this._genericTextUnhover.bind(this, ui.myVariableLabelText, this._myConfig.myVariableLabelTextScale));

        for (let i = 0; i < this._myArraySize; i++) {
            ui.myValueIncreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, i, 1));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, i, 1));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onDown.add(this._setValueEditIntensity.bind(this, i, -1));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onDownOnHover.add(this._setValueEditIntensity.bind(this, i, -1));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onUp.add(this._setValueEditIntensity.bind(this, i, 0));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._setValueEditIntensity.bind(this, i, 0));

            this._myUnhoverCallbacks.push(this._setValueEditIntensity.bind(this, i, 0));

            ui.myValueIncreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myValueIncreaseButtonBackgroundComponents[i].material));
            ui.myValueIncreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnhover.bind(this, ui.myValueIncreaseButtonBackgroundComponents[i].material));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onHover.add(this._genericHover.bind(this, ui.myValueDecreaseButtonBackgroundComponents[i].material));
            ui.myValueDecreaseButtonCursorTargetComponents[i].onUnhover.add(this._genericUnhover.bind(this, ui.myValueDecreaseButtonBackgroundComponents[i].material));

            this._myUnhoverCallbacks.push(this._genericUnhover.bind(this, ui.myValueIncreaseButtonBackgroundComponents[i].material));
            this._myUnhoverCallbacks.push(this._genericUnhover.bind(this, ui.myValueDecreaseButtonBackgroundComponents[i].material));

            ui.myValueCursorTargetComponents[i].onClick.add(this._resetValue.bind(this, i));
            ui.myValueCursorTargetComponents[i].onHover.add(this._setValueEditEnabled.bind(this, i, ui.myValueTexts[i], true));
            ui.myValueCursorTargetComponents[i].onUnhover.add(this._setValueEditEnabled.bind(this, i, ui.myValueTexts[i], false));

            this._myUnhoverCallbacks.push(this._setValueEditEnabled.bind(this, i, ui.myValueTexts[i], false));
        }
    }

    _setValueEditIntensity(index, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myValueButtonEditIntensityTimer = this._myConfig.myButtonEditDelay;
                this._myValueEditIndex = index;
            }

            this._myValueButtonEditIntensity = value;
        }
    }

    _setValueEditEnabled(index, text, enabled) {
        if (this._isActive() || !enabled) {
            if (enabled) {
                this._myValueEditIndex = index;
                text.pp_scaleObject(this._myConfig.myTextHoverScaleMultiplier);
            } else {
                text.pp_setScaleLocal(this._myConfig.myValueTextScale);
            }

            this._myValueEditEnabled = enabled;
        }
    }

    _resetValue(index) {
        if (this._isActive()) {
            this._myTempValue.pp_copy(this._getVariableValue());
            this._myTempValue[index] = this._getVariableDefaultValue()[index];
            this._setVariableValue(this._myTempValue);

            this._myUI.myValueTextComponents[index].text = (this._getVariableValue()[index]) ? "true" : "false";
        }
    }

    _resetAllValues() {
        for (let i = 0; i < this._myArraySize; i++) {
            this._resetValue(i);
        }
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
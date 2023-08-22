import { Handedness } from "../../cauldron/input_types";
import { GamepadButtonID } from "../gamepad_buttons";
import { GamepadCore } from "./gamepad_core";

export class ClassicGamepadCore extends GamepadCore {

    constructor(gamepadIndex, handPose) {
        super(handPose);

        this._myGamepadIndex = gamepadIndex;    // null means any active gamepad

        this._myCurrentGamepads = window.navigator.getGamepads();

        // Support Variables
        this._myButtonData = this._createButtonData();
        this._myAxesData = this._createAxesData();
        this._myHapticActuators = [];
    }

    _preUpdateHook(dt) {
        this._myCurrentGamepads = window.navigator.getGamepads();
    }

    isGamepadCoreActive() {
        let classicGamepad = this._getClassicGamepad();
        return classicGamepad != null && (classicGamepad.connected == null || classicGamepad.connected);
    }

    getButtonData(buttonID) {
        this._myButtonData.myPressed = false;
        this._myButtonData.myTouched = false;
        this._myButtonData.myValue = 0;

        let classicGamepad = this._getClassicGamepad();
        if (classicGamepad != null && this.isGamepadCoreActive()) {
            let button = null;
            if (this.getHandedness() == Handedness.LEFT) {
                switch (buttonID) {
                    case GamepadButtonID.SELECT:
                        button = classicGamepad.buttons[4];
                        break;
                    case GamepadButtonID.SQUEEZE:
                        button = classicGamepad.buttons[6];
                        break;
                    case GamepadButtonID.TOUCHPAD:
                        button = null;
                        break;
                    case GamepadButtonID.THUMBSTICK:
                        button = classicGamepad.buttons[10];
                        break;
                    case GamepadButtonID.BOTTOM_BUTTON:
                        button = classicGamepad.buttons[13];
                        break;
                    case GamepadButtonID.TOP_BUTTON:
                        button = classicGamepad.buttons[12];
                        break;
                    case GamepadButtonID.THUMB_REST:
                        button = null;
                        break;
                }
            } else {
                switch (buttonID) {
                    case GamepadButtonID.SELECT:
                        button = classicGamepad.buttons[5];
                        break;
                    case GamepadButtonID.SQUEEZE:
                        button = classicGamepad.buttons[7];
                        break;
                    case GamepadButtonID.TOUCHPAD:
                        button = null;
                        break;
                    case GamepadButtonID.THUMBSTICK:
                        button = classicGamepad.buttons[11];
                        break;
                    case GamepadButtonID.BOTTOM_BUTTON:
                        button = classicGamepad.buttons[0];
                        break;
                    case GamepadButtonID.TOP_BUTTON:
                        button = classicGamepad.buttons[3];
                        break;
                    case GamepadButtonID.THUMB_REST:
                        button = null;
                        break;
                }
            }

            if (button != null) {
                this._myButtonData.myPressed = button.pressed;
                this._myButtonData.myTouched = button.touched;
                this._myButtonData.myValue = button.value;
            }
        }

        return this._myButtonData;
    }

    getAxesData(axesID) {
        this._myAxesData.vec2_zero();

        let classicGamepad = this._getClassicGamepad();
        if (classicGamepad != null && this.isGamepadCoreActive()) {
            if (this.getHandedness() == Handedness.LEFT) {
                this._myAxesData[0] = classicGamepad.axes[0];
                this._myAxesData[1] = classicGamepad.axes[1];
            } else {
                this._myAxesData[0] = classicGamepad.axes[2];
                this._myAxesData[1] = classicGamepad.axes[3];
            }

            // Y axis is recorded negative when thumbstick is pressed forward for weird reasons
            this._myAxesData[1] = -this._myAxesData[1];
        }

        return this._myAxesData;
    }

    getHapticActuators() {
        this._myHapticActuators.pp_clear();

        let classicGamepad = this._getClassicGamepad();
        if (classicGamepad != null && this.isGamepadCoreActive()) {
            if (classicGamepad.hapticActuators != null && classicGamepad.hapticActuators.length > 0) {
                this._myHapticActuators.push(...classicGamepad.hapticActuators);
            }

            if (classicGamepad.vibrationActuator != null) {
                this._myHapticActuators.push(classicGamepad.vibrationActuator);
            }
        }

        return this._myHapticActuators;
    }

    _getClassicGamepad() {
        let classicGamepad = null;

        if (this._myGamepadIndex != null) {
            if (this._myGamepadIndex < this._myCurrentGamepads.length) {
                classicGamepad = this._myCurrentGamepads[this._myGamepadIndex];
            }
        } else {
            for (let gamepad of this._myCurrentGamepads) {
                if (gamepad != null && (gamepad.connected == null || gamepad.connected)) {
                    classicGamepad = gamepad;
                    break;
                }
            }
        }

        return classicGamepad;
    }
}
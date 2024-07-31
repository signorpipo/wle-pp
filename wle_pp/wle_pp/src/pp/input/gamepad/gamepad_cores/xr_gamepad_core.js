// xr-standard mapping is assumed

import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { GamepadRawAxesData, GamepadRawButtonData } from "../gamepad.js";
import { GamepadButtonID } from "../gamepad_buttons.js";
import { GamepadCore } from "./gamepad_core.js";

export class XRGamepadCore extends GamepadCore {

    constructor(handPose) {
        super(handPose);

        this._mySelectPressed = false;
        this._mySqueezePressed = false;

        this._myXRSessionActive = false;
        this._myInputSource = null;
        this._myGamepad = null;

        this._mySelectStartEventListener = null;
        this._mySelectEndEventListener = null;
        this._mySqueezeStartEventListener = null;
        this._mySqueezeEndEventListener = null;

        // Support Variables
        this._myButtonData = new GamepadRawButtonData();
        this._myAxesData = new GamepadRawAxesData();
        this._myHapticActuators = [];
    }

    isGamepadCoreActive() {
        // connected == null is to fix webxr emulator that leaves that field undefined
        return this._myXRSessionActive && this._myGamepad != null && (this._myGamepad.connected == null || this._myGamepad.connected);
    }

    _startHook() {
        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false, this.getEngine());
    }

    _preUpdateHook(dt) {
        let prevInputSource = this._myInputSource;
        this._myInputSource = this.getHandPose().getInputSource();

        if (prevInputSource != this._myInputSource) {
            this._mySelectPressed = false;
            this._mySqueezePressed = false;
        }

        if (this._myInputSource != null) {
            this._myGamepad = this._myInputSource.gamepad;
        } else {
            this._myGamepad = null;
        }
    }

    getButtonData(buttonID) {
        this._myButtonData.reset();

        if (this.isGamepadCoreActive()) {
            let button = null;

            switch (buttonID) {
                case GamepadButtonID.SELECT:
                    button = this._myGamepad.buttons[0];
                    break;
                case GamepadButtonID.SQUEEZE:
                    button = this._myGamepad.buttons[1];
                    break;
                case GamepadButtonID.THUMBSTICK:
                    button = this._myGamepad.buttons[3];
                    break;
                case GamepadButtonID.TOP_BUTTON:
                    if (this._myGamepad.buttons.length >= 6) {
                        button = this._myGamepad.buttons[5];
                    } else if (this._myGamepad.buttons.length >= 3) {
                        // This way if you are using a basic touch gamepad, top button will work anyway
                        button = this._myGamepad.buttons[2];
                    }
                    break;
                case GamepadButtonID.BOTTOM_BUTTON:
                    button = this._myGamepad.buttons[4];
                    break;
                case GamepadButtonID.LEFT_BUTTON:
                    button = null;
                    break;
                case GamepadButtonID.RIGHT_BUTTON:
                    button = null;
                    break;
                case GamepadButtonID.MENU:
                    button = this._myGamepad.buttons[7];
                    break;
                case GamepadButtonID.TOUCHPAD:
                    button = this._myGamepad.buttons[2];
                    break;
                case GamepadButtonID.THUMB_REST:
                    button = this._myGamepad.buttons[6];
                    break;
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
        this._myAxesData.reset();

        if (this.isGamepadCoreActive()) {
            let internalAxes = this._myGamepad.axes;
            if (internalAxes.length == 4) {
                // In this case it could be both touch axes or thumbstick axes, that depends on the gamepad
                // to support both I simply choose the absolute max value (unused axes will always be 0)

                // X
                if (Math.abs(internalAxes[0]) > Math.abs(internalAxes[2])) {
                    this._myAxesData.myAxes[0] = internalAxes[0];
                } else {
                    this._myAxesData.myAxes[0] = internalAxes[2];
                }

                // Y
                if (Math.abs(internalAxes[1]) > Math.abs(internalAxes[3])) {
                    this._myAxesData.myAxes[1] = internalAxes[1];
                } else {
                    this._myAxesData.myAxes[1] = internalAxes[3];
                }

            } else if (internalAxes.length == 2) {
                this._myAxesData.myAxes[0] = internalAxes[0];
                this._myAxesData.myAxes[1] = internalAxes[1];
            }

            // Y axis is recorded negative when thumbstick is pressed forward for weird reasons
            this._myAxesData.myAxes[1] = -this._myAxesData.myAxes[1];
        }

        return this._myAxesData;
    }

    getHapticActuators() {
        this._myHapticActuators.pp_clear();

        if (this.isGamepadCoreActive()) {
            if (this._myGamepad.hapticActuators != null) {
                for (let i = 0; i < this._myGamepad.hapticActuators.length; i++) {
                    this._myHapticActuators.push(this._myGamepad.hapticActuators[i]);
                }
            }

            if (this._myGamepad.vibrationActuator != null) {
                this._myHapticActuators.push(this._myGamepad.vibrationActuator);
            }
        }

        return this._myHapticActuators;
    }

    // This is to be more compatible
    _getSpecialButtonPressed(buttonID) {
        let pressed = false;

        if (this.isGamepadCoreActive()) {
            if (buttonID == GamepadButtonID.SELECT) {
                pressed = this._mySelectPressed;
            } else if (buttonID == GamepadButtonID.SQUEEZE) {
                pressed = this._mySqueezePressed;
            }
        }

        return pressed;
    }

    _onXRSessionStart(session) {
        this._mySelectStartEventListener = this._selectStart.bind(this);
        this._mySelectEndEventListener = this._selectEnd.bind(this);
        this._mySqueezeStartEventListener = this._squeezeStart.bind(this);
        this._mySqueezeEndEventListener = this._squeezeEnd.bind(this);

        session.addEventListener("selectstart", this._mySelectStartEventListener);
        session.addEventListener("selectend", this._mySelectEndEventListener);

        session.addEventListener("squeezestart", this._mySqueezeStartEventListener);
        session.addEventListener("squeezeend", this._mySqueezeEndEventListener);

        this._myXRSessionActive = true;
    }

    _onXRSessionEnd(session) {
        this._mySelectStartEventListener = null;
        this._mySelectEndEventListener = null;
        this._mySqueezeStartEventListener = null;
        this._mySqueezeEndEventListener = null;

        this._mySelectPressed = false;
        this._mySqueezePressed = false;

        this._myXRSessionActive = false;
    }

    // Select and Squeeze are managed this way to be more compatible
    _selectStart(event) {
        if (this._myInputSource != null && this._myInputSource == event.inputSource) {
            this._mySelectPressed = true;
        }
    }

    _selectEnd(event) {
        if (this._myInputSource != null && this._myInputSource == event.inputSource) {
            this._mySelectPressed = false;
        }
    }

    _squeezeStart(event) {
        if (this._myInputSource != null && this._myInputSource == event.inputSource) {
            this._mySqueezePressed = true;
        }
    }

    _squeezeEnd(event) {
        if (this._myInputSource != null && this._myInputSource == event.inputSource) {
            this._mySqueezePressed = false;
        }
    }

    _destroyHook() {
        XRUtils.getSession(this.getEngine())?.removeEventListener("selectstart", this._mySelectStartEventListener);
        XRUtils.getSession(this.getEngine())?.removeEventListener("selectend", this._mySelectEndEventListener);
        XRUtils.getSession(this.getEngine())?.removeEventListener("squeezestart", this._mySqueezeStartEventListener);
        XRUtils.getSession(this.getEngine())?.removeEventListener("squeezeend", this._mySqueezeEndEventListener);

        XRUtils.unregisterSessionStartEndEventListeners(this, this.getEngine());
    }
}
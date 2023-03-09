// xr-standard mapping is assumed

PP.XRGamepadCore = class XRGamepadCore extends PP.GamepadCore {

    constructor(handedness, handPoseParams = new PP.HandPoseParams()) {
        super(handedness, new PP.HandPose(handedness, handPoseParams));

        this._mySelectPressed = false;
        this._mySqueezePressed = false;

        this._myIsXRSessionActive = false;
        this._myInputSource = null;
        this._myGamepad = null;

        // Support Variables
        this._myButtonData = this._createButtonData();
        this._myAxesData = this._createAxesData();
        this._myHapticActuators = [];
    }

    isGamepadCoreActive() {
        // connected == null is to fix webxr emulator that leaves that field undefined
        return this._myIsXRSessionActive && this._myGamepad != null && (this._myGamepad.connected == null || this._myGamepad.connected);
    }

    start() {
        this._myHandPose.start();

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    }

    preUpdate(dt) {
        this._updateHandPose(dt);
    }

    getButtonData(buttonID) {
        this._myButtonData.myIsPressed = false;
        this._myButtonData.myIsTouched = false;
        this._myButtonData.myValue = 0;

        if (this.isGamepadCoreActive()) {
            if (buttonID < this._myGamepad.buttons.length) {
                let gamepadButton = this._myGamepad.buttons[buttonID];

                if (buttonID != PP.GamepadButtonID.SELECT && buttonID != PP.GamepadButtonID.SQUEEZE) {
                    this._myButtonData.myIsPressed = gamepadButton.pressed;
                } else {
                    this._myButtonData.myIsPressed = this._getSpecialButtonPressed(buttonID);
                }

                this._myButtonData.myIsTouched = gamepadButton.touched;
                this._myButtonData.myValue = gamepadButton.value;
            } else if (buttonID == PP.GamepadButtonID.TOP_BUTTON && this._myGamepad.buttons.length >= 3) {
                // This way if you are using a basic touch gamepad, top button will work anyway

                let touchButton = this._myGamepad.buttons[2];
                this._myButtonData.myIsPressed = touchButton.pressed;
                this._myButtonData.myIsTouched = touchButton.touched;
                this._myButtonData.myValue = touchButton.value;
            }
        }

        return this._myButtonData;
    }

    getAxesData(axesID) {
        this._myAxesData.vec2_zero();

        if (this.isGamepadCoreActive()) {
            let internalAxes = this._myGamepad.axes;
            if (internalAxes.length == 4) {
                // In this case it could be both touch axes or thumbstick axes, that depends on the gamepad
                // to support both I simply choose the absolute max value (unused axes will always be 0)

                // X
                if (Math.abs(internalAxes[0]) > Math.abs(internalAxes[2])) {
                    this._myAxesData[0] = internalAxes[0];
                } else {
                    this._myAxesData[0] = internalAxes[2];
                }

                // Y
                if (Math.abs(internalAxes[1]) > Math.abs(internalAxes[3])) {
                    this._myAxesData[1] = internalAxes[1];
                } else {
                    this._myAxesData[1] = internalAxes[3];
                }

            } else if (internalAxes.length == 2) {
                this._myAxesData[0] = internalAxes[0];
                this._myAxesData[1] = internalAxes[1];
            }

            // Y axis is recorded negative when thumbstick is pressed forward for weird reasons
            this._myAxesData[1] = -this._myAxesData[1];
        }

        return this._myAxesData;
    }

    getHapticActuators() {
        this._myHapticActuators.pp_clear();

        if (this.isGamepadCoreActive()) {
            if (this._myGamepad.hapticActuators != null && this._myGamepad.hapticActuators.length > 0) {
                this._myHapticActuators.push(...this._myGamepad.hapticActuators);
            }

            if (this._myGamepad.vibrationActuator != null) {
                this._myHapticActuators.push(this._myGamepad.vibrationActuator);
            }
        }

        return this._myHapticActuators;
    }

    _updateHandPose(dt) {
        this._myHandPose.update(dt);

        this._myInputSource = this._myHandPose.getInputSource();
        if (this._myInputSource != null) {
            this._myGamepad = this._myInputSource.gamepad;
        } else {
            this._myGamepad = null;
        }
    }

    // This is to be more compatible
    _getSpecialButtonPressed(buttonID) {
        let isPressed = false;

        if (this.isGamepadCoreActive()) {
            if (buttonID == PP.GamepadButtonID.SELECT) {
                isPressed = this._mySelectPressed;
            } else if (buttonID == PP.GamepadButtonID.SQUEEZE) {
                isPressed = this._mySqueezePressed;
            }
        }

        return isPressed;
    }

    _onXRSessionStart(session) {
        session.addEventListener("selectstart", this._selectStart.bind(this));
        session.addEventListener("selectend", this._selectEnd.bind(this));

        session.addEventListener("squeezestart", this._squeezeStart.bind(this));
        session.addEventListener("squeezeend", this._squeezeEnd.bind(this));

        this._myIsXRSessionActive = true;
    }

    _onXRSessionEnd(session) {
        this._myIsXRSessionActive = false;
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
};
PP.ClassicGamepadCore = class ClassicGamepadCore extends PP.GamepadCore {

    constructor(gamepadIndex, handedness, handPose = null) {
        super(handedness, handPose);

        this._myGamepadIndex = gamepadIndex;    // null means any active gamepad

        this._myHandPoseUpdateActive = false;

        // Support Variables
        this._myButtonData = this._createButtonData();
        this._myAxesData = this._createAxesData();
        this._myHapticActuators = [];
    }

    setHandPoseUpdateActive(active) {
        this._myHandPoseUpdateActive = active;
    }

    isHandPoseUpdateActive() {
        return this._myHandPoseUpdateActive;
    }

    isGamepadCoreActive() {
        let classicGamepad = this._getClassicGamepad();
        return classicGamepad != null && (classicGamepad.connected == null || classicGamepad.connected);
    }

    start() {
        if (this._myHandPose && this._myHandPoseUpdateActive) {
            this._myHandPose.start();
        }
    }

    preUpdate(dt) {
        if (this._myHandPose && this._myHandPoseUpdateActive) {
            this._myHandPose.update(dt);
        }
    }

    getButtonData(buttonID) {
        this._myButtonData.myIsPressed = false;
        this._myButtonData.myIsTouched = false;
        this._myButtonData.myValue = 0;

        let classicGamepad = this._getClassicGamepad();
        if (classicGamepad != null && this.isGamepadCoreActive()) {
            let button = null;
            if (this.getHandedness() == PP.Handedness.LEFT) {
                switch (buttonID) {
                    case PP.GamepadButtonID.SELECT:
                        button = classicGamepad.buttons[4];
                        break;
                    case PP.GamepadButtonID.SQUEEZE:
                        button = classicGamepad.buttons[6];
                        break;
                    case PP.GamepadButtonID.TOUCHPAD:
                        button = null;
                        break;
                    case PP.GamepadButtonID.THUMBSTICK:
                        button = classicGamepad.buttons[10];
                        break;
                    case PP.GamepadButtonID.BOTTOM_BUTTON:
                        button = classicGamepad.buttons[13];
                        break;
                    case PP.GamepadButtonID.TOP_BUTTON:
                        button = classicGamepad.buttons[12];
                        break;
                    case PP.GamepadButtonID.THUMB_REST:
                        button = null;
                        break;
                }
            } else {
                switch (buttonID) {
                    case PP.GamepadButtonID.SELECT:
                        button = classicGamepad.buttons[5];
                        break;
                    case PP.GamepadButtonID.SQUEEZE:
                        button = classicGamepad.buttons[7];
                        break;
                    case PP.GamepadButtonID.TOUCHPAD:
                        button = null;
                        break;
                    case PP.GamepadButtonID.THUMBSTICK:
                        button = classicGamepad.buttons[11];
                        break;
                    case PP.GamepadButtonID.BOTTOM_BUTTON:
                        button = classicGamepad.buttons[0];
                        break;
                    case PP.GamepadButtonID.TOP_BUTTON:
                        button = classicGamepad.buttons[3];
                        break;
                    case PP.GamepadButtonID.THUMB_REST:
                        button = null;
                        break;
                }
            }

            if (button != null) {
                this._myButtonData.myIsPressed = button.pressed;
                this._myButtonData.myIsTouched = button.touched;
                this._myButtonData.myValue = button.value;
            }
        }

        return this._myButtonData;
    }

    getAxesData(axesID) {
        this._myAxesData.vec2_zero();

        let classicGamepad = this._getClassicGamepad();
        if (classicGamepad != null && this.isGamepadCoreActive()) {
            if (this.getHandedness() == PP.Handedness.LEFT) {
                this._myAxesData[0] = classicGamepad.axes[0];
                this._myAxesData[1] = classicGamepad.axes[1];
            } else {
                this._myAxesData[0] = classicGamepad.axes[2];
                this._myAxesData[1] = classicGamepad.axes[3];
            }
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

        let gamepads = navigator.getGamepads();
        if (this._myGamepadIndex != null) {
            if (this._myGamepadIndex < gamepads.length) {
                classicGamepad = gamepads[this._myGamepadIndex];
            }
        } else {
            for (let gamepad of gamepads) {
                if (gamepad != null && (gamepad.connected == null || gamepad.connected)) {
                    classicGamepad = gamepad;
                    break;
                }
            }
        }

        return classicGamepad;
    }
};
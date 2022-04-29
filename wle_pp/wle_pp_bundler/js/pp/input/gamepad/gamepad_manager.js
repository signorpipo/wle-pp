PP.GamepadManager = class GamepadManager {
    constructor(fixForward = true, forceEmulatedVelocities = false) {
        this._myLeftGamepad = new PP.Gamepad(PP.Handedness.LEFT, fixForward, forceEmulatedVelocities);
        this._myRightGamepad = new PP.Gamepad(PP.Handedness.RIGHT, fixForward, forceEmulatedVelocities);
    }

    start() {
        this._myLeftGamepad.start();
        this._myRightGamepad.start();
    }

    update(dt) {
        this._myLeftGamepad.update(dt);
        this._myRightGamepad.update(dt);
    }

    getLeftGamepad() {
        return this._myLeftGamepad;
    }

    getRightGamepad() {
        return this._myRightGamepad;
    }

    getGamepad(handedness) {
        let gamepad = null;

        switch (handedness) {
            case PP.Handedness.LEFT:
                gamepad = this._myLeftGamepad;
                break;
            case PP.Handedness.RIGHT:
                gamepad = this._myRightGamepad;
                break;
            default:
                gamepad = null;
        }

        return gamepad;
    }

    getGamepads() {
        let gamepads = [];

        gamepads[PP.Handedness.LEFT] = this._myLeftGamepad;
        gamepads[PP.Handedness.RIGHT] = this._myRightGamepad;

        return gamepads;
    }
};
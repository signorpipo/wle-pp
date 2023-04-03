import { Handedness } from "../../cauldron/input_types";
import { UniversalGamepad } from "../universal_gamepad";

export class GamepadsManager {

    constructor() {
        this._myLeftGamepad = new UniversalGamepad(Handedness.LEFT);
        this._myRightGamepad = new UniversalGamepad(Handedness.RIGHT);
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
            case Handedness.LEFT:
                gamepad = this._myLeftGamepad;
                break;
            case Handedness.RIGHT:
                gamepad = this._myRightGamepad;
                break;
            default:
                gamepad = null;
        }

        return gamepad;
    }

    getGamepads() {
        let gamepads = [];

        gamepads[Handedness.LEFT] = this._myLeftGamepad;
        gamepads[Handedness.RIGHT] = this._myRightGamepad;

        return gamepads;
    }
}
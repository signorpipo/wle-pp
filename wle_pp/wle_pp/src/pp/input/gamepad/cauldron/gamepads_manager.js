import { Handedness } from "../../cauldron/input_types";
import { UniversalGamepad } from "../universal_gamepad";

export class GamepadsManager {

    constructor() {
        this._myGamepads = [];

        this._myGamepads[Handedness.LEFT] = new UniversalGamepad(Handedness.LEFT);
        this._myGamepads[Handedness.RIGHT] = new UniversalGamepad(Handedness.RIGHT);

        this._myDestroyed = false;
    }

    start() {
        for (let key in this._myGamepads) {
            this._myGamepads[key].start();
        }
    }

    update(dt) {
        for (let key in this._myGamepads) {
            this._myGamepads[key].update(dt);
        }
    }

    getLeftGamepad() {
        return this._myGamepads[Handedness.LEFT];
    }

    getRightGamepad() {
        return this._myGamepads[Handedness.RIGHT];
    }

    getGamepad(handedness) {
        return this._myGamepads[handedness];
    }

    getGamepads() {
        return this._myGamepads;
    }

    destroy() {
        this._myDestroyed = true;

        for (let key in this._myGamepads) {
            this._myGamepads[key].destroy();
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
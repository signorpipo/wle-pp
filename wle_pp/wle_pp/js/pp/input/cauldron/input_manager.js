import { getMainEngine } from "../../cauldron/wl/engine_globals";
import { GamepadsManager } from "../gamepad/cauldron/gamepads_manager";
import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";

export class InputManager {

    constructor(engine = getMainEngine()) {
        this._myMouse = new Mouse(engine);
        this._myKeyboard = new Keyboard();
        this._myGamepadsManager = new GamepadsManager(engine);
    }

    start() {
        this._myMouse.start();
        this._myKeyboard.start();
        this._myGamepadsManager.start();
    }

    update(dt) {
        this._myMouse.update(dt);
        this._myKeyboard.update(dt);
        this._myGamepadsManager.update(dt);
    }

    getMouse() {
        return this._myMouse;
    }

    getKeyboard() {
        return this._myKeyboard;
    }

    getGamepadsManager() {
        return this._myGamepadsManager;
    }
}
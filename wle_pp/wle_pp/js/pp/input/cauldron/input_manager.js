PP.InputManager = class InputManager {
    constructor() {
        this._myMouse = new PP.Mouse();
        this._myKeyboard = new PP.Keyboard();
        this._myGamepadManager = new PP.GamepadManager();
    }

    start() {
        this._myMouse.start();
        this._myKeyboard.start();
        this._myGamepadManager.start();
    }

    update(dt) {
        this._myMouse.update(dt);
        this._myKeyboard.update(dt);
        this._myGamepadManager.update(dt);
    }

    getMouse() {
        return this._myMouse;
    }

    getKeyboard() {
        return this._myKeyboard;
    }

    getGamepadManager() {
        return this._myGamepadManager;
    }
};
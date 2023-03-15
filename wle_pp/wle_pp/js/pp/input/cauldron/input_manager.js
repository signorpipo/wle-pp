PP.InputManager = class InputManager {
    constructor() {
        this._myMouse = new PP.Mouse();
        this._myKeyboard = new PP.Keyboard();
        this._myGamepadsManager = new PP.GamepadsManager();
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
};
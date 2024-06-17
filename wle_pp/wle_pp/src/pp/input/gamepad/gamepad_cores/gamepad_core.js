import { GamepadRawAxesData, GamepadRawButtonData } from "../gamepad.js";

export class GamepadCore {

    constructor(handPose) {
        this._myHandPose = handPose;

        this._myManagingHandPose = false;

        this._myDestroyed = false;
    }

    getHandedness() {
        return this.getHandPose().getHandedness();
    }

    getHandPose() {
        return this._myHandPose;
    }

    getEngine() {
        return this.getHandPose().getEngine();
    }

    isGamepadCoreActive() {
        return true;
    }

    setManageHandPose(manageHandPose) {
        this._myManagingHandPose = manageHandPose;
    }

    isManagingHandPose() {
        return this._myManagingHandPose;
    }

    start() {
        if (this.getHandPose() && this.isManagingHandPose()) {
            this.getHandPose().start();
        }

        this._startHook();
    }

    preUpdate(dt) {
        if (this.getHandPose() && this.isManagingHandPose()) {
            this.getHandPose().update(dt);
        }

        this._preUpdateHook(dt);
    }

    postUpdate(dt) {
        this._postUpdateHook(dt);
    }

    getButtonData(buttonID) {
        return new GamepadRawButtonData();
    }

    getAxesData(axesID) {
        return new GamepadRawAxesData();
    }

    getHapticActuators() {
        let hapticActuators = [];
        return hapticActuators;
    }

    // Hooks

    _startHook() {

    }

    _preUpdateHook(dt) {

    }

    _postUpdateHook(dt) {

    }

    _destroyHook() {

    }

    // Hooks end

    destroy() {
        this._myDestroyed = true;

        this._destroyHook();

        if (this.isManagingHandPose()) {
            this.getHandPose().destroy();
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
import { GamepadRawAxesData, GamepadRawButtonData } from "../gamepad.js";

export class GamepadCore {

    constructor(handPose) {
        this._myHandPose = handPose;

        this._myManagingHandPose = false;

        this._myActive = true;
        this._myStarted = false;

        this._myDestroyed = false;
    }

    setActive(active) {
        this._setActiveHook(active);

        this._myActive = active;
    }

    isActive() {
        return this._myActive;
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
        if (this._myStarted) return;

        this._myStarted = true;

        if (this.getHandPose() && this.isManagingHandPose()) {
            this.getHandPose().start();
        }

        this._startHook();

        this._myActive = false;
        this.setActive(true);
    }

    preUpdate(dt) {
        if (!this._myActive) return;

        if (this.getHandPose() && this.isManagingHandPose()) {
            this.getHandPose().update(dt);
        }

        this._preUpdateHook(dt);
    }

    postUpdate(dt) {
        if (!this._myActive) return;

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

    _setActiveHook(active) {

    }

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
        if (this._myDestroyed) return;

        this._myDestroyed = true;

        this.setActive(false);

        this._destroyHook();

        if (this.isManagingHandPose()) {
            this.getHandPose().destroy();
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
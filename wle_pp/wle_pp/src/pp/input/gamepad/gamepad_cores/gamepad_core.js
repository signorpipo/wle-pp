import { vec2_create } from "../../../plugin/js/extensions/array_extension";

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
        let buttonData = this._createButtonData();
        return buttonData;
    }

    getAxesData(axesID) {
        let axesData = this._createAxesData();
        return axesData;
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

    _createButtonData() {
        return { myPressed: false, myTouched: false, myValue: 0 };
    }

    _createAxesData() {
        return vec2_create(0, 0);
    }

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
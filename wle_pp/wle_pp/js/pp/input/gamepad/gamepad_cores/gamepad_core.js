PP.GamepadCore = class GamepadCore {

    constructor(handedness, handPose) {
        this._myHandedness = handedness;
        this._myHandPose = handPose;
    }

    getHandedness() {
        return this._myHandedness;
    }

    getHandPose() {
        return this._myHandPose;
    }

    isGamepadCoreActive() {
        return true;
    }

    start() {

    }

    preUpdate(dt) {

    }

    postUpdate(dt) {

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

    _createButtonData() {
        return { myIsPressed: false, myIsTouched: false, myValue: 0 };
    }

    _createAxesData() {
        return PP.vec2_create(0, 0);
    }
};
import { GamepadCore } from "./gamepad_core.js";

export class VirtualGamepadGamepadCore extends GamepadCore {

    constructor(virtualGamepad, handPose) {
        super(handPose);

        this._myVirtualGamepad = virtualGamepad;

        // Support Variables
        this._myButtonData = this._createButtonData();
        this._myAxesData = this._createAxesData();
        this._myHapticActuators = [];
    }

    isGamepadCoreActive() {
        return this._myVirtualGamepad.isVisible();
    }

    getButtonData(buttonID) {
        this._myButtonData.myPressed = false;
        this._myButtonData.myTouched = false;
        this._myButtonData.myValue = 0;

        if (this.isGamepadCoreActive()) {
            if (this._myVirtualGamepad.isButtonPressed(this.getHandedness(), buttonID)) {
                this._myButtonData.myPressed = true;
                this._myButtonData.myTouched = true;
                this._myButtonData.myValue = 1;
            }
        }

        return this._myButtonData;
    }

    getAxesData(axesID) {
        this._myAxesData.vec2_zero();

        if (this.isGamepadCoreActive()) {
            this._myVirtualGamepad.getAxes(this.getHandedness(), axesID, this._myAxesData);
        }

        return this._myAxesData;
    }

    getHapticActuators() {
        return this._myHapticActuators;
    }
}
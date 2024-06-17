import { GamepadRawAxesData, GamepadRawButtonData } from "../gamepad.js";
import { GamepadCore } from "./gamepad_core.js";

export class VirtualGamepadGamepadCore extends GamepadCore {

    constructor(virtualGamepad, handPose) {
        super(handPose);

        this._myVirtualGamepad = virtualGamepad;

        // Support Variables
        this._myButtonData = new GamepadRawButtonData();
        this._myAxesData = new GamepadRawAxesData();
        this._myHapticActuators = [];
    }

    isGamepadCoreActive() {
        return this._myVirtualGamepad.isVisible();
    }

    getButtonData(buttonID) {
        this._myButtonData.reset();

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
        this._myAxesData.reset();

        if (this.isGamepadCoreActive()) {
            this._myVirtualGamepad.getAxes(this.getHandedness(), axesID, this._myAxesData.myAxes);
        }

        return this._myAxesData;
    }

    getHapticActuators() {
        return this._myHapticActuators;
    }
}
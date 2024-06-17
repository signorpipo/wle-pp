import { Globals } from "../../../pp/globals.js";
import { Handedness } from "../../cauldron/input_types.js";
import { KeyID } from "../../cauldron/keyboard.js";
import { GamepadRawAxesData, GamepadRawButtonData } from "../gamepad.js";
import { GamepadButtonID } from "../gamepad_buttons.js";
import { GamepadCore } from "./gamepad_core.js";

export class KeyboardGamepadCore extends GamepadCore {

    constructor(handPose) {
        super(handPose);

        // Support Variables
        this._myButtonData = new GamepadRawButtonData();
        this._myAxesData = new GamepadRawAxesData();
        this._myHapticActuators = [];
    }

    isGamepadCoreActive() {
        return true;
    }

    getButtonData(buttonID) {
        this._myButtonData.reset();

        let keyboard = Globals.getKeyboard(this.getEngine());

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == Handedness.LEFT) {
                switch (buttonID) {
                    case GamepadButtonID.SELECT:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyE);
                        break;
                    case GamepadButtonID.SQUEEZE:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyQ);
                        break;
                    case GamepadButtonID.TOUCHPAD:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyX);
                        break;
                    case GamepadButtonID.THUMBSTICK:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyR);
                        break;
                    case GamepadButtonID.BOTTOM_BUTTON:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyC);
                        break;
                    case GamepadButtonID.TOP_BUTTON:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyF);
                        break;
                    case GamepadButtonID.THUMB_REST:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyV);
                        break;
                }
            } else {
                switch (buttonID) {
                    case GamepadButtonID.SELECT:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyU);
                        break;
                    case GamepadButtonID.SQUEEZE:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyO);
                        break;
                    case GamepadButtonID.TOUCHPAD:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyM);
                        break;
                    case GamepadButtonID.THUMBSTICK:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyY);
                        break;
                    case GamepadButtonID.BOTTOM_BUTTON:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyN);
                        break;
                    case GamepadButtonID.TOP_BUTTON:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyH);
                        break;
                    case GamepadButtonID.THUMB_REST:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.KeyB);
                        break;
                }
            }
        }

        if (this._myButtonData.myPressed) {
            this._myButtonData.myTouched = true;
            this._myButtonData.myValue = 1;
        }

        return this._myButtonData;
    }

    getAxesData(axesID) {
        this._myAxesData.reset();

        let keyboard = Globals.getKeyboard(this.getEngine());

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == Handedness.LEFT) {
                if (keyboard.isKeyPressed(KeyID.KeyW)) this._myAxesData.myAxes[1] += 1.0;
                if (keyboard.isKeyPressed(KeyID.KeyS)) this._myAxesData.myAxes[1] += -1.0;
                if (keyboard.isKeyPressed(KeyID.KeyD)) this._myAxesData.myAxes[0] += 1.0;
                if (keyboard.isKeyPressed(KeyID.KeyA)) this._myAxesData.myAxes[0] += -1.0;
            } else {
                if (keyboard.isKeyPressed(KeyID.KeyI) || keyboard.isKeyPressed(KeyID.UP)) this._myAxesData.myAxes[1] += 1.0;
                if (keyboard.isKeyPressed(KeyID.KeyK) || keyboard.isKeyPressed(KeyID.DOWN)) this._myAxesData.myAxes[1] += -1.0;
                if (keyboard.isKeyPressed(KeyID.KeyL) || keyboard.isKeyPressed(KeyID.RIGHT)) this._myAxesData.myAxes[0] += 1.0;
                if (keyboard.isKeyPressed(KeyID.KeyJ) || keyboard.isKeyPressed(KeyID.LEFT)) this._myAxesData.myAxes[0] += -1.0;
            }
        }

        return this._myAxesData;
    }

    getHapticActuators() {
        return this._myHapticActuators;
    }
}
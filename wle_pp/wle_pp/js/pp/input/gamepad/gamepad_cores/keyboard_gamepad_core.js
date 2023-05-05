import { Globals } from "../../../pp/globals";
import { Handedness } from "../../cauldron/input_types";
import { KeyID } from "../../cauldron/keyboard";
import { GamepadButtonID } from "../gamepad_buttons";
import { GamepadCore } from "./gamepad_core";

export class KeyboardGamepadCore extends GamepadCore {

    constructor(handPose) {
        super(handPose);

        // Support Variables
        this._myButtonData = this._createButtonData();
        this._myAxesData = this._createAxesData();
        this._myHapticActuators = [];
    }

    isGamepadCoreActive() {
        return true;
    }

    getButtonData(buttonID) {
        this._myButtonData.myPressed = false;
        this._myButtonData.myTouched = false;
        this._myButtonData.myValue = 0;

        let keyboard = Globals.getKeyboard(this.getEngine());

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == Handedness.LEFT) {
                switch (buttonID) {
                    case GamepadButtonID.SELECT:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.E) || keyboard.isKeyPressed(KeyID.e);
                        break;
                    case GamepadButtonID.SQUEEZE:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.Q) || keyboard.isKeyPressed(KeyID.q);
                        break;
                    case GamepadButtonID.TOUCHPAD:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.X) || keyboard.isKeyPressed(KeyID.x);
                        break;
                    case GamepadButtonID.THUMBSTICK:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.R) || keyboard.isKeyPressed(KeyID.r);
                        break;
                    case GamepadButtonID.BOTTOM_BUTTON:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.C) || keyboard.isKeyPressed(KeyID.c);
                        break;
                    case GamepadButtonID.TOP_BUTTON:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.F) || keyboard.isKeyPressed(KeyID.f);
                        break;
                    case GamepadButtonID.THUMB_REST:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.V) || keyboard.isKeyPressed(KeyID.v);
                        break;
                }
            } else {
                switch (buttonID) {
                    case GamepadButtonID.SELECT:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.U) || keyboard.isKeyPressed(KeyID.u);
                        break;
                    case GamepadButtonID.SQUEEZE:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.O) || keyboard.isKeyPressed(KeyID.o);
                        break;
                    case GamepadButtonID.TOUCHPAD:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.M) || keyboard.isKeyPressed(KeyID.m);
                        break;
                    case GamepadButtonID.THUMBSTICK:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.Y) || keyboard.isKeyPressed(KeyID.y);
                        break;
                    case GamepadButtonID.BOTTOM_BUTTON:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.N) || keyboard.isKeyPressed(KeyID.n);
                        break;
                    case GamepadButtonID.TOP_BUTTON:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.H) || keyboard.isKeyPressed(KeyID.h);
                        break;
                    case GamepadButtonID.THUMB_REST:
                        this._myButtonData.myPressed = keyboard.isKeyPressed(KeyID.B) || keyboard.isKeyPressed(KeyID.b);
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
        this._myAxesData.vec2_zero();

        let keyboard = Globals.getKeyboard(this.getEngine());

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == Handedness.LEFT) {
                if (keyboard.isKeyPressed(KeyID.W) || keyboard.isKeyPressed(KeyID.w)) this._myAxesData[1] += 1.0;
                if (keyboard.isKeyPressed(KeyID.S) || keyboard.isKeyPressed(KeyID.s)) this._myAxesData[1] += -1.0;
                if (keyboard.isKeyPressed(KeyID.D) || keyboard.isKeyPressed(KeyID.d)) this._myAxesData[0] += 1.0;
                if (keyboard.isKeyPressed(KeyID.A) || keyboard.isKeyPressed(KeyID.a)) this._myAxesData[0] += -1.0;
            } else {
                if (keyboard.isKeyPressed(KeyID.I) || keyboard.isKeyPressed(KeyID.i) || keyboard.isKeyPressed(KeyID.UP)) this._myAxesData[1] += 1.0;
                if (keyboard.isKeyPressed(KeyID.K) || keyboard.isKeyPressed(KeyID.k) || keyboard.isKeyPressed(KeyID.DOWN)) this._myAxesData[1] += -1.0;
                if (keyboard.isKeyPressed(KeyID.L) || keyboard.isKeyPressed(KeyID.l) || keyboard.isKeyPressed(KeyID.RIGHT)) this._myAxesData[0] += 1.0;
                if (keyboard.isKeyPressed(KeyID.J) || keyboard.isKeyPressed(KeyID.j) || keyboard.isKeyPressed(KeyID.LEFT)) this._myAxesData[0] += -1.0;
            }
        }

        return this._myAxesData;
    }

    getHapticActuators() {
        return this._myHapticActuators;
    }
}
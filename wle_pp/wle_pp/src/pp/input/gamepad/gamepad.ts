import { Emitter } from "@wonderlandengine/api";
import { Vector2 } from "../../cauldron/type_definitions/array_type_definitions.js";
import { vec2_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Handedness } from "../cauldron/input_types.js";
import { HandPose } from "../pose/hand_pose.js";
import { GamepadAxesEvent, GamepadAxesID, GamepadAxesInfo, GamepadButtonEvent, GamepadButtonID, GamepadButtonInfo, GamepadPulseInfo } from "./gamepad_buttons.js";

export class GamepadRawButtonData {
    public myValue: number = 0;

    public myPressed: boolean = false;
    public myTouched: boolean = false;

    public reset(): void {
        this.myValue = 0;

        this.myPressed = false;
        this.myTouched = false;
    }
}

export class GamepadRawAxesData {
    public myAxes: Vector2 = vec2_create(0);

    public reset(): void {
        this.myAxes.vec2_zero();
    }
}

export abstract class Gamepad {

    private readonly _myHandedness: Handedness;

    // Switched to `object` instead of `Map` for memory optimization reasons since iterating allocates a lot
    private readonly _myButtonInfos: Partial<Record<GamepadButtonID, GamepadButtonInfo>> = {};
    private readonly _myButtonInfosIDs: GamepadButtonID[] = [];

    private readonly _myAxesInfos: Partial<Record<GamepadAxesID, GamepadAxesInfo>> = {};
    private readonly _myAxesInfosIDs: GamepadAxesID[] = [];

    private readonly _myButtonEmitters: Partial<Record<GamepadButtonID, Partial<Record<GamepadButtonEvent, Emitter<[GamepadButtonInfo, Gamepad]>>>>> = {};

    private readonly _myAxesEmitters: Partial<Record<GamepadAxesID, Partial<Record<GamepadAxesEvent, Emitter<[GamepadAxesInfo, Gamepad]>>>>> = {};

    private readonly _myPulseInfo: GamepadPulseInfo = new GamepadPulseInfo();

    // Config
    private _myMultiplePressMaxDelay: number = 0.4;
    private _myMultipleTouchMaxDelay: number = 0.4;

    private _myDestroyed: boolean = false;

    constructor(handedness: Handedness) {
        this._myHandedness = handedness;

        this._myButtonInfos = {};
        this._myButtonInfosIDs = [];
        for (const key in GamepadButtonID) {
            const gamepadButtonID = GamepadButtonID[key as keyof typeof GamepadButtonID];
            this._myButtonInfos[gamepadButtonID] = new GamepadButtonInfo(gamepadButtonID, this._myHandedness);
            this._myButtonInfosIDs.push(gamepadButtonID);
        }

        this._myAxesInfos = {};
        this._myAxesInfosIDs = [];
        for (const key in GamepadAxesID) {
            const gamepadAxesID = GamepadAxesID[key as keyof typeof GamepadAxesID];
            this._myAxesInfos[gamepadAxesID] = new GamepadAxesInfo(gamepadAxesID, this._myHandedness);
            this._myAxesInfosIDs.push(gamepadAxesID);
        }

        for (const key in GamepadButtonID) {
            const gamepadButtonID = GamepadButtonID[key as keyof typeof GamepadButtonID];
            this._myButtonEmitters[gamepadButtonID] = {};
            for (const eventKey in GamepadButtonEvent) {
                const gamepadButtonEvent = GamepadButtonEvent[eventKey as keyof typeof GamepadButtonEvent];
                this._myButtonEmitters[gamepadButtonID]![gamepadButtonEvent] = new Emitter();
            }
        }

        for (const key in GamepadAxesID) {
            const gamepadAxesID = GamepadAxesID[key as keyof typeof GamepadAxesID];
            this._myAxesEmitters[gamepadAxesID] = {};
            for (const eventKey in GamepadAxesEvent) {
                const gamepadAxesEvent = GamepadAxesEvent[eventKey as keyof typeof GamepadAxesEvent];
                this._myAxesEmitters[gamepadAxesID]![gamepadAxesEvent] = new Emitter();
            }
        }
    }

    public getHandedness(): Handedness {
        return this._myHandedness;
    }

    public getButtonInfo(buttonID: GamepadButtonID): Readonly<GamepadButtonInfo> {
        return this._myButtonInfos[buttonID]!;
    }

    public registerButtonEventListener(buttonID: GamepadButtonID, buttonEvent: GamepadButtonEvent, id: unknown, listener: (buttonInfo: Readonly<GamepadButtonInfo>, gamepad: Gamepad) => void): void {
        this._myButtonEmitters[buttonID]![buttonEvent]!.add(listener, { id: id });
    }

    public unregisterButtonEventListener(buttonID: GamepadButtonID, buttonEvent: GamepadButtonEvent, id: unknown): void {
        this._myButtonEmitters[buttonID]![buttonEvent]!.remove(id);
    }

    public getAxesInfo(axesID: GamepadAxesID): Readonly<GamepadAxesInfo> {
        return this._myAxesInfos[axesID]!;
    }

    public registerAxesEventListener(axesID: GamepadAxesID, axesEvent: GamepadAxesEvent, id: unknown, listener: (axesInfo: Readonly<GamepadAxesInfo>, gamepad: Gamepad) => void): void {
        this._myAxesEmitters[axesID]![axesEvent]!.add(listener, { id: id });
    }

    public unregisterAxesEventListener(axesID: GamepadAxesID, axesEvent: GamepadAxesEvent, id: unknown): void {
        this._myAxesEmitters[axesID]![axesEvent]!.remove(id);
    }

    public pulse(intensity: number, duration: number = 0): void {
        this._myPulseInfo.myIntensity = Math.pp_clamp(intensity, 0, 1);
        this._myPulseInfo.myDuration = Math.max(duration, 0);
    }

    public stopPulse(): void {
        this._myPulseInfo.myIntensity = 0;
        this._myPulseInfo.myDuration = 0;
    }

    public isPulsing(): boolean {
        return this._myPulseInfo.myIntensity > 0 || this._myPulseInfo.myDuration > 0;
    }

    public getPulseInfo(): Readonly<GamepadPulseInfo> {
        return this._myPulseInfo;
    }

    public getMultiplePressMaxDelay(): number {
        return this._myMultiplePressMaxDelay;
    }

    public setMultiplePressMaxDelay(maxDelay: number): void {
        this._myMultiplePressMaxDelay = maxDelay;
    }

    public getMultipleTouchMaxDelay(): number {
        return this._myMultipleTouchMaxDelay;
    }

    public setMultipleTouchMaxDelay(maxDelay: number): void {
        this._myMultipleTouchMaxDelay = maxDelay;
    }

    // Hooks

    public getHandPose(): HandPose | null {
        return null;
    }

    protected _startHook(): void {

    }

    protected _preUpdate(dt: number): void {

    }

    protected _postUpdate(dt: number): void {

    }

    protected _getButtonData(buttonID: GamepadButtonID): Readonly<GamepadRawButtonData> {
        return new GamepadRawButtonData();
    }

    protected _getAxesData(axesID: GamepadAxesID): Readonly<GamepadRawAxesData> {
        return new GamepadRawAxesData();
    }

    protected _getHapticActuators(): GamepadHapticActuator[] {
        const hapticActuator: GamepadHapticActuator[] = [];
        return hapticActuator;
    }

    protected _destroyHook(): void {

    }

    // Hooks End

    public start(): void {
        this._startHook();
    }

    public update(dt: number): void {
        this._preUpdate(dt);

        this._preUpdateButtonInfos();
        this._updateButtonInfos();
        this._postUpdateButtonInfos(dt);

        this._preUpdateAxesInfos();
        this._updateAxesInfos();
        this._postUpdateAxesInfos();

        this._updatePulse(dt);

        this._postUpdate(dt);
    }

    private _preUpdateButtonInfos(): void {
        for (let i = 0; i < this._myButtonInfosIDs.length; i++) {
            const id = this._myButtonInfosIDs[i];
            const info = this._myButtonInfos[id]!;
            info.myPrevIsPressed = info.myPressed;
            info.myPrevIsTouched = info.myTouched;
            info.myPrevValue = info.myValue;
        }
    }

    private _updateButtonInfos(): void {
        this._updateSingleButtonInfo(GamepadButtonID.SELECT);
        this._updateSingleButtonInfo(GamepadButtonID.SQUEEZE);
        this._updateSingleButtonInfo(GamepadButtonID.TOUCHPAD);
        this._updateSingleButtonInfo(GamepadButtonID.THUMBSTICK);
        this._updateSingleButtonInfo(GamepadButtonID.BOTTOM_BUTTON);
        this._updateSingleButtonInfo(GamepadButtonID.TOP_BUTTON);
        this._updateSingleButtonInfo(GamepadButtonID.THUMB_REST);
    }

    private _updateSingleButtonInfo(buttonID: GamepadButtonID): void {
        const buttonInfo = this._myButtonInfos[buttonID]!;
        const buttonData = this._getButtonData(buttonID);

        buttonInfo.myPressed = buttonData.myPressed;
        buttonInfo.myTouched = buttonData.myTouched;
        buttonInfo.myValue = buttonData.myValue;

        if (buttonInfo.myPressed) {
            buttonInfo.myTouched = true;

            if (buttonInfo.myValue == 0) {
                buttonInfo.myValue = 1;
            }
        }
    }

    private _postUpdateButtonInfos(dt: number): void {
        for (let i = 0; i < this._myButtonInfosIDs.length; i++) {
            const id = this._myButtonInfosIDs[i];
            const info = this._myButtonInfos[id]!;
            if (info.myPressed) {
                info.myTimePressed += dt;
                if (!info.myPrevIsPressed) {
                    info.myMultiplePressStartCount += 1;

                    info.myPrevTimeNotPressed = info.myTimeNotPressed;
                    info.myTimeNotPressed = 0;
                }

                if (info.myPrevTimeNotPressed + info.myTimePressed > this._myMultiplePressMaxDelay && info.myMultiplePressEndCount > 0) {
                    info.myPrevMultiplePressEndCount = info.myMultiplePressEndCount;
                    info.myMultiplePressEndCount = 0;
                }

                if (info.myTimePressed > this._myMultiplePressMaxDelay && info.myMultiplePressStartCount > 0) {
                    info.myPrevMultiplePressStartCount = info.myMultiplePressStartCount;
                    info.myMultiplePressStartCount = 0;
                }
            } else {
                info.myTimeNotPressed += dt;
                if (info.myPrevIsPressed) {
                    info.myMultiplePressEndCount += 1;

                    info.myPrevTimePressed = info.myTimePressed;
                    info.myTimePressed = 0;
                }

                if (info.myPrevTimePressed + info.myTimeNotPressed > this._myMultiplePressMaxDelay && info.myMultiplePressStartCount > 0) {
                    info.myPrevMultiplePressStartCount = info.myMultiplePressStartCount;
                    info.myMultiplePressStartCount = 0;
                }

                if (info.myTimeNotPressed > this._myMultiplePressMaxDelay && info.myMultiplePressEndCount > 0) {
                    info.myPrevMultiplePressEndCount = info.myMultiplePressEndCount;
                    info.myMultiplePressEndCount = 0;
                }
            }

            if (info.myTouched) {
                info.myTimeTouched += dt;
                if (!info.myPrevIsTouched) {
                    info.myMultipleTouchStartCount += 1;

                    info.myPrevTimeNotTouched = info.myTimeNotTouched;
                    info.myTimeNotTouched = 0;
                }

                if (info.myPrevTimeNotTouched + info.myTimeTouched > this._myMultipleTouchMaxDelay && info.myMultipleTouchEndCount > 0) {
                    info.myPrevMultipleTouchEndCount = info.myMultipleTouchEndCount;
                    info.myMultipleTouchEndCount = 0;
                }

                if (info.myTimeTouched > this._myMultipleTouchMaxDelay && info.myMultipleTouchStartCount > 0) {
                    info.myPrevMultipleTouchStartCount = info.myMultipleTouchStartCount;
                    info.myMultipleTouchStartCount = 0;
                }
            } else {
                info.myTimeNotTouched += dt;
                if (info.myPrevIsTouched) {
                    info.myMultipleTouchEndCount += 1;

                    info.myPrevTimeTouched = info.myTimeTouched;
                    info.myTimeTouched = 0;
                }

                if (info.myPrevTimeTouched + info.myTimeNotTouched > this._myMultipleTouchMaxDelay && info.myMultipleTouchStartCount > 0) {
                    info.myPrevMultipleTouchStartCount = info.myMultipleTouchStartCount;
                    info.myMultipleTouchStartCount = 0;
                }

                if (info.myTimeNotTouched > this._myMultipleTouchMaxDelay && info.myMultipleTouchEndCount > 0) {
                    info.myPrevMultipleTouchEndCount = info.myMultipleTouchEndCount;
                    info.myMultipleTouchEndCount = 0;
                }
            }
        }

        for (let i = 0; i < this._myButtonInfosIDs.length; i++) {
            const id = this._myButtonInfosIDs[i];
            const buttonInfo = this._myButtonInfos[id]!;
            const buttonEventEmitters = this._myButtonEmitters[id]!;

            // PRESSED
            if (buttonInfo.myPressed && !buttonInfo.myPrevIsPressed) {
                const emitter = buttonEventEmitters[GamepadButtonEvent.PRESS_START]!;
                emitter.notify(buttonInfo, this);
            }

            if (!buttonInfo.myPressed && buttonInfo.myPrevIsPressed) {
                const emitter = buttonEventEmitters[GamepadButtonEvent.PRESS_END]!;
                emitter.notify(buttonInfo, this);
            }

            if (buttonInfo.myPressed) {
                const emitter = buttonEventEmitters[GamepadButtonEvent.PRESSED]!;
                emitter.notify(buttonInfo, this);
            } else {
                const emitter = buttonEventEmitters[GamepadButtonEvent.NOT_PRESSED]!;
                emitter.notify(buttonInfo, this);
            }

            // TOUCHED
            if (buttonInfo.myTouched && !buttonInfo.myPrevIsTouched) {
                const emitter = buttonEventEmitters[GamepadButtonEvent.TOUCH_START]!;
                emitter.notify(buttonInfo, this);
            }

            if (!buttonInfo.myTouched && buttonInfo.myPrevIsTouched) {
                const emitter = buttonEventEmitters[GamepadButtonEvent.TOUCH_END]!;
                emitter.notify(buttonInfo, this);
            }

            if (buttonInfo.myTouched) {
                const emitter = buttonEventEmitters[GamepadButtonEvent.TOUCHED]!;
                emitter.notify(buttonInfo, this);
            } else {
                const emitter = buttonEventEmitters[GamepadButtonEvent.NOT_TOUCHED]!;
                emitter.notify(buttonInfo, this);
            }

            // VALUE
            if (buttonInfo.myValue != buttonInfo.myPrevValue) {
                const emitter = buttonEventEmitters[GamepadButtonEvent.VALUE_CHANGED]!;
                emitter.notify(buttonInfo, this);
            }

            // ALWAYS
            const emitter = buttonEventEmitters[GamepadButtonEvent.ALWAYS]!;
            emitter.notify(buttonInfo, this);
        }
    }

    private _preUpdateAxesInfos(): void {
        for (let i = 0; i < this._myAxesInfosIDs.length; i++) {
            const id = this._myAxesInfosIDs[i];
            const info = this._myAxesInfos[id]!;
            info.myPrevAxes[0] = info.myAxes[0];
            info.myPrevAxes[1] = info.myAxes[1];
        }
    }

    private _updateAxesInfos(): void {
        this._updateSingleAxesInfo(GamepadAxesID.THUMBSTICK);
    }

    private _updateSingleAxesInfo(axesID: GamepadAxesID): void {
        const axesInfo = this._myAxesInfos[axesID]!;
        const axesData = this._getAxesData(axesID);

        axesInfo.myAxes[0] = axesData.myAxes[0];
        axesInfo.myAxes[1] = axesData.myAxes[1];
    }

    private _postUpdateAxesInfos(): void {
        for (const key in GamepadAxesID) {
            const gamepadAxesID = GamepadAxesID[key as keyof typeof GamepadAxesID];
            const axesInfo = this._myAxesInfos[gamepadAxesID]!;
            const axesEventEmitters = this._myAxesEmitters[gamepadAxesID]!;

            // X CHANGED
            if (axesInfo.myAxes[0] != axesInfo.myPrevAxes[0]) {
                const emitter = axesEventEmitters[GamepadAxesEvent.X_CHANGED]!;
                emitter.notify(axesInfo, this);
            }

            // Y CHANGED
            if (axesInfo.myAxes[1] != axesInfo.myPrevAxes[1]) {
                const emitter = axesEventEmitters[GamepadAxesEvent.Y_CHANGED]!;
                emitter.notify(axesInfo, this);
            }

            // AXES CHANGED
            if (axesInfo.myAxes[0] != axesInfo.myPrevAxes[0] ||
                axesInfo.myAxes[1] != axesInfo.myPrevAxes[1]) {
                const emitter = axesEventEmitters[GamepadAxesEvent.AXES_CHANGED]!;
                emitter.notify(axesInfo, this);
            }

            // ALWAYS        
            const emitter = axesEventEmitters[GamepadAxesEvent.ALWAYS]!;
            emitter.notify(axesInfo, this);
        }
    }

    private _updatePulse(dt: number): void {
        if (this._myPulseInfo.myDevicePulsing || this._myPulseInfo.myIntensity > 0) {
            const hapticActuators = this._getHapticActuators();
            if (hapticActuators.length > 0) {
                if (this._myPulseInfo.myIntensity > 0) {
                    for (let i = 0; i < hapticActuators.length; i++) {
                        const hapticActuator = hapticActuators[i];

                        // Duration is managed by this class
                        hapticActuator.playEffect("dual-rumble", {
                            startDelay: 0,
                            duration: Math.max(250, this._myPulseInfo.myDuration * 1000),
                            weakMagnitude: this._myPulseInfo.myIntensity,
                            strongMagnitude: this._myPulseInfo.myIntensity
                        });
                    }
                    this._myPulseInfo.myDevicePulsing = true;
                } else if (this._myPulseInfo.myDevicePulsing) {
                    for (let i = 0; i < hapticActuators.length; i++) {
                        const hapticActuator = hapticActuators[i];

                        try {
                            if (hapticActuator.reset != null) {
                                hapticActuator.reset();
                            }
                        } catch (error) {
                            // Do nothing
                        }
                    }

                    this._myPulseInfo.myDevicePulsing = false;
                }
            } else {
                this._myPulseInfo.myDevicePulsing = false;
            }
        }

        this._myPulseInfo.myDuration -= dt;
        if (this._myPulseInfo.myDuration <= 0) {
            this._myPulseInfo.myIntensity = 0;
            this._myPulseInfo.myDuration = 0;
        }
    }

    public destroy(): void {
        this._myDestroyed = true;

        this._destroyHook();
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }
}
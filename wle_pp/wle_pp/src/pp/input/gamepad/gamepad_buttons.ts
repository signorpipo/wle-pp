import { Vector2 } from "../../cauldron/type_definitions/array_type_definitions.js";
import { vec2_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Handedness } from "../cauldron/input_types.js";

export enum GamepadButtonID {
    /** Trigger */
    SELECT = 0,

    /** Grip */
    SQUEEZE = 1,

    THUMBSTICK = 2,

    /** B or Y button on oculus quest gamepad, reverts to `TOUCHPAD` button for gamepads that does not support `TOP_BUTTON` */
    TOP_BUTTON = 3,

    /** A or X button on oculus quest gamepad */
    BOTTOM_BUTTON = 4,

    /** Square button on a playstation gamepad */
    LEFT_BUTTON = 5,

    /** Circle button on a playstation gamepad */
    RIGHT_BUTTON = 6,

    MENU = 7,

    TOUCHPAD = 8,

    THUMB_REST = 9
}

export enum GamepadButtonEvent {
    PRESS_START = 0,
    PRESS_END = 1,

    /** Every frame that it is pressed */
    PRESSED = 2,

    /** Every frame that it is not pressed */
    NOT_PRESSED = 3,

    TOUCH_START = 4,
    TOUCH_END = 5,

    /** Every frame that it is touched */
    TOUCHED = 6,

    /** Every frame that it is not touched */
    NOT_TOUCHED = 7,

    VALUE_CHANGED = 8,

    /** Every frame */
    ALWAYS = 9
}

export enum GamepadAxesID {
    THUMBSTICK = 0
}

export enum GamepadAxesEvent {
    X_CHANGED = 0,
    Y_CHANGED = 1,
    AXES_CHANGED = 2,
    ALWAYS = 3
}

export class GamepadButtonInfo {

    public myID: GamepadButtonID;
    public myHandedness: Handedness;

    public myPressed: boolean = false;
    public myPrevIsPressed: boolean = false;

    public myTouched: boolean = false;
    public myPrevIsTouched: boolean = false;

    public myValue: number = 0;
    public myPrevValue: number = 0;

    public myTimePressed: number = 0;
    public myPrevTimePressed: number = 0;

    public myTimeNotPressed: number = 0;
    public myPrevTimeNotPressed: number = 0;

    public myTimeTouched: number = 0;
    public myPrevTimeTouched: number = 0;

    public myTimeNotTouched: number = 0;
    public myPrevTimeNotTouched: number = 0;

    public myMultiplePressStartCount: number = 0;
    public myPrevMultiplePressStartCount: number = 0;
    public myMultiplePressEndCount: number = 0;
    public myPrevMultiplePressEndCount: number = 0;

    public myMultipleTouchStartCount: number = 0;
    public myPrevMultipleTouchStartCount: number = 0;
    public myMultipleTouchEndCount: number = 0;
    public myPrevMultipleTouchEndCount: number = 0;

    constructor(id: GamepadButtonID, handedness: Handedness) {
        this.myID = id;
        this.myHandedness = handedness;
    }

    public getID(): GamepadButtonID {
        return this.myID;
    }

    public getHandedness(): Handedness {
        return this.myHandedness;
    }

    public getValue(): number {
        return this.myValue;
    }

    public isPressed(): boolean {
        return this.myPressed;
    }

    public isTouched(): boolean {
        return this.myTouched;
    }

    public isPressStart(multiplePressCount: number | null = null): boolean {
        return (this.myPressed && !this.myPrevIsPressed) && (multiplePressCount == null || this.myMultiplePressStartCount == multiplePressCount);
    }

    public isPressEnd(multiplePressCount: number | null = null): boolean {
        return (!this.myPressed && this.myPrevIsPressed) && (multiplePressCount == null || this.myMultiplePressEndCount == multiplePressCount);
    }

    public isTouchStart(multipleTouchCount: number | null = null): boolean {
        return (this.myTouched && !this.myPrevIsTouched) && (multipleTouchCount == null || this.myMultipleTouchStartCount == multipleTouchCount);
    }

    public isTouchEnd(multipleTouchCount: number | null = null): boolean {
        return (!this.myTouched && this.myPrevIsTouched) && (multipleTouchCount == null || this.myMultipleTouchEndCount == multipleTouchCount);
    }

    public reset(): void {
        this.myPressed = false;
        this.myPrevIsPressed = false;
        this.myTouched = false;
        this.myPrevIsTouched = false;
        this.myValue = 0;
        this.myPrevValue = 0;

        this.myTimePressed = 0;
        this.myPrevTimePressed = 0;
        this.myTimeNotPressed = 0;
        this.myPrevTimeNotPressed = 0;

        this.myTimeTouched = 0;
        this.myPrevTimeTouched = 0;
        this.myTimeNotTouched = 0;
        this.myPrevTimeNotTouched = 0;

        this.myMultiplePressStartCount = 0;
        this.myPrevMultiplePressStartCount = 0;
        this.myMultiplePressEndCount = 0;
        this.myPrevMultiplePressEndCount = 0;

        this.myMultipleTouchStartCount = 0;
        this.myPrevMultipleTouchStartCount = 0;
        this.myMultipleTouchEndCount = 0;
        this.myPrevMultipleTouchEndCount = 0;
    }

    public clone(): GamepadButtonInfo {
        const value = new GamepadButtonInfo(this.myID, this.myHandedness);

        value.myPressed = this.myPressed;
        value.myPrevIsPressed = this.myPrevIsPressed;
        value.myTouched = this.myTouched;
        value.myPrevIsTouched = this.myPrevIsTouched;
        value.myValue = this.myValue;
        value.myPrevValue = this.myPrevValue;

        value.myTimePressed = this.myTimePressed;
        value.myPrevTimePressed = this.myPrevTimePressed;
        value.myTimeNotPressed = this.myTimeNotPressed;
        value.myPrevTimeNotPressed = this.myPrevTimeNotPressed;

        value.myTimeTouched = this.myTimeTouched;
        value.myPrevTimeTouched = this.myPrevTimeTouched;
        value.myTimeNotTouched = this.myTimeNotTouched;
        value.myPrevTimeNotTouched = this.myPrevTimeNotTouched;

        value.myMultiplePressStartCount = this.myMultiplePressStartCount;
        value.myPrevMultiplePressStartCount = this.myPrevMultiplePressStartCount;
        value.myMultiplePressEndCount = this.myMultiplePressEndCount;
        value.myPrevMultiplePressEndCount = this.myPrevMultiplePressEndCount;

        value.myMultipleTouchStartCount = this.myMultipleTouchStartCount;
        value.myPrevMultipleTouchStartCount = this.myPrevMultipleTouchStartCount;
        value.myMultipleTouchEndCount = this.myMultipleTouchEndCount;
        value.myPrevMultipleTouchEndCount = this.myPrevMultipleTouchEndCount;

        return value;
    }
}

export class GamepadAxesInfo {
    public myID: GamepadAxesID;

    public myHandedness: Handedness;

    /** `myAxes[0]` is X, `myAxes[1]` is Y */
    public myAxes = vec2_create(0);

    /** `myPrevAxes[0]` is X, `myPrevAxes[1]` is Y */
    public myPrevAxes = vec2_create(0);

    constructor(id: GamepadAxesID, handedness: Handedness) {
        this.myID = id;
        this.myHandedness = handedness;
    }

    public getID(): GamepadAxesID {
        return this.myID;
    }

    public getAxes(): Readonly<Vector2> {
        return this.myAxes;
    }

    public getHandedness(): Handedness {
        return this.myHandedness;
    }

    public reset(): void {
        this.myAxes.vec2_zero();
        this.myPrevAxes.vec2_zero();
    }

    public clone(): GamepadAxesInfo {
        const value = new GamepadAxesInfo(this.myID, this.myHandedness);

        value.myAxes.vec2_copy(this.myAxes);
        value.myPrevAxes.vec2_copy(this.myPrevAxes);

        return value;
    }
}

export class GamepadPulseInfo {

    public myIntensity = 0;
    public myDuration = 0;

    /**  `true` if the gamepad actually sent a request to pulse to the device */
    public myDevicePulsing: boolean = false;

    public clone(): GamepadPulseInfo {
        const value = new GamepadPulseInfo();

        value.myIntensity = this.myIntensity;
        value.myDuration = this.myDuration;
        value.myDevicePulsing = this.myDevicePulsing;

        return value;
    }
}
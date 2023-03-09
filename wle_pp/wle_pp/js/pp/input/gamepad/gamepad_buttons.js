PP.GamepadButtonID = {
    SELECT: 0,          // Trigger
    SQUEEZE: 1,         // Grip
    TOUCHPAD: 2,
    THUMBSTICK: 3,
    BOTTOM_BUTTON: 4,   // A or X button on oculus quest gamepad
    TOP_BUTTON: 5,      // B or Y button on oculus quest gamepad, reverts to TOUCHPAD button for gamepads that does not support TOP_BUTTON
    THUMB_REST: 6
};

PP.GamepadButtonEvent = {
    PRESS_START: 0,
    PRESS_END: 1,
    PRESSED: 2,         //Every frame that it is pressed
    NOT_PRESSED: 3,     //Every frame that it is not pressed
    TOUCH_START: 4,
    TOUCH_END: 5,
    TOUCHED: 6,         //Every frame that it is touched
    NOT_TOUCHED: 7,     //Every frame that it is not touched
    VALUE_CHANGED: 8,
    ALWAYS: 9,          //Every frame
};

PP.GamepadAxesID = {
    THUMBSTICK: 0
};

PP.GamepadAxesEvent = {
    X_CHANGED: 0,
    Y_CHANGED: 1,
    AXES_CHANGED: 2,
    ALWAYS: 3
};

PP.GamepadButtonInfo = class GamepadButtonInfo {
    constructor(id, handedness) {
        this.myID = id;
        this.myHandedness = handedness;

        this.myIsPressed = false;
        this.myPrevIsPressed = false;

        this.myIsTouched = false;
        this.myPrevIsTouched = false;

        this.myValue = 0.0;
        this.myPrevValue = 0.0;

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

    getID() {
        return this.myID;
    }

    getHandedness() {
        return this.myHandedness;
    }

    getValue() {
        return this.myValue;
    }

    isPressed() {
        return this.myIsPressed;
    }

    isTouched() {
        return this.myIsTouched;
    }

    isPressStart(multiplePressCount = null) {
        return (this.myIsPressed && !this.myPrevIsPressed) && (multiplePressCount == null || this.myMultiplePressStartCount == multiplePressCount);
    }

    isPressEnd(multiplePressCount = null) {
        return (!this.myIsPressed && this.myPrevIsPressed) && (multiplePressCount == null || this.myMultiplePressEndCount == multiplePressCount);
    }

    isTouchStart(multipleTouchCount = null) {
        return (this.myIsTouched && !this.myPrevIsTouched) && (multipleTouchCount == null || this.myMultipleTouchStartCount == multipleTouchCount);
    }

    isTouchEnd(multipleTouchCount = null) {
        return (!this.myIsTouched && this.myPrevIsTouched) && (multipleTouchCount == null || this.myMultipleTouchEndCount == multipleTouchCount);
    }

    clone() {
        let value = new PP.GamepadButtonInfo(this.myID, this.myHandedness);
        value.myIsPressed = this.myIsPressed;
        value.myPrevIsPressed = this.myPrevIsPressed;
        value.myIsTouched = this.myIsTouched;
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
};

PP.GamepadAxesInfo = class GamepadAxesInfo {
    constructor(id, handedness) {
        this.myID = id;

        this.myHandedness = handedness;

        this.myAxes = PP.vec2_create(0, 0); // this.myAxes[0] is X,  this.myAxes[1] is Y
        this.myPrevAxes = PP.vec2_create(0, 0);
    }

    getID() {
        return this.myID;
    }

    getAxes() {
        return this.myAxes;
    }

    getHandedness() {
        return this.myHandedness;
    }

    clone() {
        let value = new PP.GamepadAxesInfo(this.myID, this.myHandedness);
        value.myAxes.vec2_copy(this.myAxes);
        value.myPrevAxes.vec2_copy(this.myPrevAxes);

        return value;
    }
};

PP.GamepadPulseInfo = class GamepadPulseInfo {
    constructor() {
        this.myIntensity = 0.0;
        this.myDuration = 0.0;

        this.myIsDevicePulsing = false; // true if the gamepad actually sent a request to pulse to the device
    }

    clone() {
        let value = new PP.GamepadPulseInfo();
        value.myIntensity = this.myIntensity;
        value.myDuration = this.myDuration;
        value.myIsDevicePulsing = this.myIsDevicePulsing;

        return value;
    }
};
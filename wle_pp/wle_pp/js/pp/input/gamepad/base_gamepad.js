PP.BaseGamepad = class BaseGamepad {

    constructor(handedness) {
        this._myHandedness = handedness;

        this._myButtonInfos = [];
        for (let key in PP.GamepadButtonID) {
            this._myButtonInfos[PP.GamepadButtonID[key]] = new PP.GamepadButtonInfo(PP.GamepadButtonID[key], this._myHandedness);
        }

        this._myAxesInfo = new PP.GamepadAxesInfo(this._myHandedness);

        this._myButtonCallbacks = [];   // Signature: callback(ButtonInfo, Gamepad)
        for (let key in PP.GamepadButtonID) {
            this._myButtonCallbacks[PP.GamepadButtonID[key]] = [];
            for (let eventKey in PP.GamepadButtonEvent) {
                this._myButtonCallbacks[PP.GamepadButtonID[key]][PP.GamepadButtonEvent[eventKey]] = new Map();
            }
        }

        this._myAxesCallbacks = [];     // Signature: callback(AxesInfo, Gamepad)
        for (let eventKey in PP.GamepadAxesEvent) {
            this._myAxesCallbacks[PP.GamepadAxesEvent[eventKey]] = new Map();
        }

        this._myPulseInfo = new PP.GamepadPulseInfo();

        //Setup
        this._myMultiplePressMaxDelay = 0.3;
        this._myMultipleTouchMaxDelay = 0.3;
    }

    getHandedness() {
        return this._myHandedness;
    }

    getButtonInfo(buttonID) {
        return this._myButtonInfos[buttonID];
    }

    registerButtonEventListener(buttonID, buttonEvent, id, callback) {
        this._myButtonCallbacks[buttonID][buttonEvent].set(id, callback);
    }

    unregisterButtonEventListener(buttonID, buttonEvent, id) {
        this._myButtonCallbacks[buttonID][buttonEvent].delete(id);
    }

    getAxesInfo() {
        return this._myAxesInfo;
    }

    registerAxesEventListener(axesEvent, id, callback) {
        this._myAxesCallbacks[axesEvent].set(id, callback);
    }

    unregisterAxesEventListener(axesEvent, id) {
        this._myAxesCallbacks[axesEvent].delete(id);
    }

    pulse(intensity, duration = 0) {
        this._myPulseInfo.myIntensity = Math.min(Math.max(intensity, 0), 1); // clamp 
        this._myPulseInfo.myDuration = Math.max(duration, 0);
    }

    stopPulse() {
        this._myPulseInfo.myIntensity = 0;
        this._myPulseInfo.myDuration = 0;
    }

    isPulsing() {
        return this._myPulseInfo.myIntensity > 0 || this._myPulseInfo.myDuration > 0;
    }

    getPulseInfo() {
        return this._myPulseInfo;
    }

    getMultiplePressMaxDelay() {
        return this._myMultiplePressMaxDelay;
    }

    setMultiplePressMaxDelay(maxDelay) {
        this._myMultiplePressMaxDelay = maxDelay;
    }

    getMultipleTouchMaxDelay() {
        return this._myMultipleTouchMaxDelay;
    }

    setMultipleTouchMaxDelay(maxDelay) {
        this._myMultipleTouchMaxDelay = maxDelay;
    }

    // the following functions should be re-implemented in the actual class

    getHandPose() {
        return null;
    }

    isGamepadActive() {
        return true;
    }

    _start() {

    }

    _preUpdate(dt) {

    }

    _postUpdate(dt) {

    }

    _getButtonData(buttonID) {
        let buttonData = this._createButtonData();
        return buttonData;
    }

    _getAxesData() {
        let axesData = this._createAxesData();
        return axesData;
    }

    _getHapticActuators() {
        let hapticActuator = [];
        return hapticActuator;
    }

    // the above functions should be re-implemented in the actual class

    start() {
        this._start();
    }

    update(dt) {
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

    _preUpdateButtonInfos() {
        this._myButtonInfos.forEach(function (item) {
            item.myPrevIsPressed = item.myIsPressed;
            item.myPrevIsTouched = item.myIsTouched;
            item.myPrevValue = item.myValue;
        });
    }

    _updateButtonInfos() {
        this._updateSingleButtonInfo(PP.GamepadButtonID.SELECT);
        this._updateSingleButtonInfo(PP.GamepadButtonID.SQUEEZE);
        this._updateSingleButtonInfo(PP.GamepadButtonID.TOUCHPAD);
        this._updateSingleButtonInfo(PP.GamepadButtonID.THUMBSTICK);
        this._updateSingleButtonInfo(PP.GamepadButtonID.BOTTOM_BUTTON);
        this._updateSingleButtonInfo(PP.GamepadButtonID.TOP_BUTTON);
        this._updateSingleButtonInfo(PP.GamepadButtonID.THUMB_REST);
    }

    _updateSingleButtonInfo(buttonID) {
        let button = this._myButtonInfos[buttonID];
        let buttonData = this._getButtonData(buttonID);

        button.myIsPressed = buttonData.myIsPressed;
        button.myIsTouched = buttonData.myIsTouched;
        button.myValue = buttonData.myValue;
    }

    _postUpdateButtonInfos(dt) {
        this._myButtonInfos.forEach(function (item) {
            if (item.myIsPressed) {
                item.myTimePressed += dt;
                if (!item.myPrevIsPressed) {
                    item.myMultiplePressStartCount += 1;

                    item.myPrevTimeNotPressed = item.myTimeNotPressed;
                    item.myTimeNotPressed = 0;
                }

                if (item.myPrevTimeNotPressed + item.myTimePressed > this._myMultiplePressMaxDelay && item.myMultiplePressEndCount > 0) {
                    item.myPrevMultiplePressEndCount = item.myMultiplePressEndCount;
                    item.myMultiplePressEndCount = 0;
                }

                if (item.myTimePressed > this._myMultiplePressMaxDelay && item.myMultiplePressStartCount > 0) {
                    item.myPrevMultiplePressStartCount = item.myMultiplePressStartCount;
                    item.myMultiplePressStartCount = 0;
                }
            } else {
                item.myTimeNotPressed += dt;
                if (item.myPrevIsPressed) {
                    item.myMultiplePressEndCount += 1;

                    item.myPrevTimePressed = item.myTimePressed;
                    item.myTimePressed = 0;
                }

                if (item.myPrevTimePressed + item.myTimeNotPressed > this._myMultiplePressMaxDelay && item.myMultiplePressStartCount > 0) {
                    item.myPrevMultiplePressStartCount = item.myMultiplePressStartCount;
                    item.myMultiplePressStartCount = 0;
                }

                if (item.myTimeNotPressed > this._myMultiplePressMaxDelay && item.myMultiplePressEndCount > 0) {
                    item.myPrevMultiplePressEndCount = item.myMultiplePressEndCount;
                    item.myMultiplePressEndCount = 0;
                }
            }

            if (item.myIsTouched) {
                item.myTimeTouched += dt;
                if (!item.myPrevIsTouched) {
                    item.myMultipleTouchStartCount += 1;

                    item.myPrevTimeNotTouched = item.myTimeNotTouched;
                    item.myTimeNotTouched = 0;
                }

                if (item.myPrevTimeNotTouched + item.myTimeTouched > this._myMultipleTouchMaxDelay && item.myMultipleTouchEndCount > 0) {
                    item.myPrevMultipleTouchEndCount = item.myMultipleTouchEndCount;
                    item.myMultipleTouchEndCount = 0;
                }

                if (item.myTimeTouched > this._myMultipleTouchMaxDelay && item.myMultipleTouchStartCount > 0) {
                    item.myPrevMultipleTouchStartCount = item.myMultipleTouchStartCount;
                    item.myMultipleTouchStartCount = 0;
                }
            } else {
                item.myTimeNotTouched += dt;
                if (item.myPrevIsTouched) {
                    item.myMultipleTouchEndCount += 1;

                    item.myPrevTimeTouched = item.myTimeTouched;
                    item.myTimeTouched = 0;
                }

                if (item.myPrevTimeTouched + item.myTimeNotTouched > this._myMultipleTouchMaxDelay && item.myMultipleTouchStartCount > 0) {
                    item.myPrevMultipleTouchStartCount = item.myMultipleTouchStartCount;
                    item.myMultipleTouchStartCount = 0;
                }

                if (item.myTimeNotTouched > this._myMultipleTouchMaxDelay && item.myMultipleTouchEndCount > 0) {
                    item.myPrevMultipleTouchEndCount = item.myMultipleTouchEndCount;
                    item.myMultipleTouchEndCount = 0;
                }
            }
        }.bind(this));

        for (let key in PP.GamepadButtonID) {
            let buttonInfo = this._myButtonInfos[PP.GamepadButtonID[key]];
            let buttonCallbacks = this._myButtonCallbacks[PP.GamepadButtonID[key]];

            //PRESSED
            if (buttonInfo.myIsPressed && !buttonInfo.myPrevIsPressed) {
                let callbacksMap = buttonCallbacks[PP.GamepadButtonEvent.PRESS_START];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            if (!buttonInfo.myIsPressed && buttonInfo.myPrevIsPressed) {
                let callbacksMap = buttonCallbacks[PP.GamepadButtonEvent.PRESS_END];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            if (buttonInfo.myIsPressed) {
                let callbacksMap = buttonCallbacks[PP.GamepadButtonEvent.PRESSED];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            } else {
                let callbacksMap = buttonCallbacks[PP.GamepadButtonEvent.NOT_PRESSED];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            //TOUCHED
            if (buttonInfo.myIsTouched && !buttonInfo.myPrevIsTouched) {
                let callbacksMap = buttonCallbacks[PP.GamepadButtonEvent.TOUCH_START];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            if (!buttonInfo.myIsTouched && buttonInfo.myPrevIsTouched) {
                let callbacksMap = buttonCallbacks[PP.GamepadButtonEvent.TOUCH_END];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            if (buttonInfo.myIsTouched) {
                let callbacksMap = buttonCallbacks[PP.GamepadButtonEvent.TOUCHED];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            } else {
                let callbacksMap = buttonCallbacks[PP.GamepadButtonEvent.NOT_TOUCHED];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            //VALUE
            if (buttonInfo.myValue != buttonInfo.myPrevValue) {
                let callbacksMap = buttonCallbacks[PP.GamepadButtonEvent.VALUE_CHANGED];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            //ALWAYS
            let callbacksMap = buttonCallbacks[PP.GamepadButtonEvent.ALWAYS];
            this._triggerCallbacks(callbacksMap, buttonInfo);
        }

        this._mySelectStart = false;
        this._mySelectEnd = false;
        this._mySqueezeStart = false;
        this._mySqueezeEnd = false;
    }

    _preUpdateAxesInfos() {
        this._myAxesInfo.myPrevAxes[0] = this._myAxesInfo.myAxes[0];
        this._myAxesInfo.myPrevAxes[1] = this._myAxesInfo.myAxes[1];
    }

    _updateAxesInfos() {
        let axesData = this._getAxesData();
        this._myAxesInfo.myAxes[0] = axesData[0];
        this._myAxesInfo.myAxes[1] = axesData[1];
    }

    _postUpdateAxesInfos() {
        //X CHANGED
        if (this._myAxesInfo.myAxes[0] != this._myAxesInfo.myPrevAxes[0]) {
            let callbacksMap = this._myAxesCallbacks[PP.GamepadAxesEvent.X_CHANGED];
            this._triggerCallbacks(callbacksMap, this._myAxesInfo);
        }

        //Y CHANGED
        if (this._myAxesInfo.myAxes[1] != this._myAxesInfo.myPrevAxes[1]) {
            let callbacksMap = this._myAxesCallbacks[PP.GamepadAxesEvent.Y_CHANGED];
            this._triggerCallbacks(callbacksMap, this._myAxesInfo);
        }

        //AXES CHANGED
        if (this._myAxesInfo.myAxes[0] != this._myAxesInfo.myPrevAxes[0] ||
            this._myAxesInfo.myAxes[1] != this._myAxesInfo.myPrevAxes[1]) {
            let callbacksMap = this._myAxesCallbacks[PP.GamepadAxesEvent.AXES_CHANGED];
            this._triggerCallbacks(callbacksMap, this._myAxesInfo);
        }

        //ALWAYS        
        let callbacksMap = this._myAxesCallbacks[PP.GamepadAxesEvent.ALWAYS];
        this._triggerCallbacks(callbacksMap, this._myAxesInfo);
    }

    _updatePulse(dt) {
        if (this._myPulseInfo.myIsDevicePulsing || this._myPulseInfo.myIntensity > 0) {
            let hapticActuators = this._getHapticActuators();
            if (hapticActuators.length > 0) {
                if (this._myPulseInfo.myIntensity > 0) {
                    for (let hapticActuator of hapticActuators) {
                        hapticActuator.pulse(this._myPulseInfo.myIntensity, 1000); // duration is managed by this class
                    }
                    this._myPulseInfo.myIsDevicePulsing = true;
                } else if (this._myPulseInfo.myIsDevicePulsing) {
                    for (let hapticActuator of hapticActuators) {
                        hapticActuator.reset();
                    }
                    this._myPulseInfo.myIsDevicePulsing = false;
                }
            } else {
                this._myPulseInfo.myIsDevicePulsing = false;
            }
        }

        this._myPulseInfo.myDuration -= dt;
        if (this._myPulseInfo.myDuration <= 0) {
            this._myPulseInfo.myIntensity = 0;
            this._myPulseInfo.myDuration = 0;
        }
    }

    _triggerCallbacks(callbacksMap, info) {
        for (let callback of callbacksMap.values()) {
            callback(info, this);
        }
    }

    _createButtonData() {
        return { myIsPressed: false, myIsTouched: false, myValue: 0 };
    }

    _createAxesData() {
        return PP.vec2_create(0, 0);
    }
};
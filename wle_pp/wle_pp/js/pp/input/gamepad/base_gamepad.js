PP.BaseGamepad = class BaseGamepad {

    constructor(handedness) {
        this._myHandedness = handedness;

        this._myButtonInfos = [];
        for (let key in PP.GamepadButtonID) {
            this._myButtonInfos[PP.GamepadButtonID[key]] = new PP.GamepadButtonInfo(PP.GamepadButtonID[key], this._myHandedness);
        }

        this._myAxesInfos = [];
        for (let key in PP.GamepadAxesID) {
            this._myAxesInfos[PP.GamepadAxesID[key]] = new PP.GamepadAxesInfo(PP.GamepadAxesID[key], this._myHandedness);
        }

        this._myButtonCallbacks = [];   // Signature: callback(ButtonInfo, Gamepad)
        for (let key in PP.GamepadButtonID) {
            this._myButtonCallbacks[PP.GamepadButtonID[key]] = [];
            for (let eventKey in PP.GamepadButtonEvent) {
                this._myButtonCallbacks[PP.GamepadButtonID[key]][PP.GamepadButtonEvent[eventKey]] = new Map();
            }
        }

        this._myAxesCallbacks = [];   // Signature: callback(AxesInfo, Gamepad)
        for (let key in PP.GamepadAxesID) {
            this._myAxesCallbacks[PP.GamepadAxesID[key]] = [];
            for (let eventKey in PP.GamepadAxesEvent) {
                this._myAxesCallbacks[PP.GamepadAxesID[key]][PP.GamepadAxesEvent[eventKey]] = new Map();
            }
        }

        this._myPulseInfo = new PP.GamepadPulseInfo();

        //Setup
        this._myMultiplePressMaxDelay = 0.4;
        this._myMultipleTouchMaxDelay = 0.4;
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

    getAxesInfo(axesID) {
        return this._myAxesInfos[axesID];
    }

    registerAxesEventListener(axesID, axesEvent, id, callback) {
        this._myAxesCallbacks[axesID][axesEvent].set(id, callback);
    }

    unregisterAxesEventListener(axesID, axesEvent, id) {
        this._myAxesCallbacks[axesID][axesEvent].delete(id);
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

    _getAxesData(axesID) {
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
        let buttonInfo = this._myButtonInfos[buttonID];
        let buttonData = this._getButtonData(buttonID);

        buttonInfo.myIsPressed = buttonData.myIsPressed;
        buttonInfo.myIsTouched = buttonData.myIsTouched;
        buttonInfo.myValue = buttonData.myValue;
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
                let callbacks = buttonCallbacks[PP.GamepadButtonEvent.PRESS_START];
                this._triggerCallbacks(callbacks, buttonInfo);
            }

            if (!buttonInfo.myIsPressed && buttonInfo.myPrevIsPressed) {
                let callbacks = buttonCallbacks[PP.GamepadButtonEvent.PRESS_END];
                this._triggerCallbacks(callbacks, buttonInfo);
            }

            if (buttonInfo.myIsPressed) {
                let callbacks = buttonCallbacks[PP.GamepadButtonEvent.PRESSED];
                this._triggerCallbacks(callbacks, buttonInfo);
            } else {
                let callbacks = buttonCallbacks[PP.GamepadButtonEvent.NOT_PRESSED];
                this._triggerCallbacks(callbacks, buttonInfo);
            }

            //TOUCHED
            if (buttonInfo.myIsTouched && !buttonInfo.myPrevIsTouched) {
                let callbacks = buttonCallbacks[PP.GamepadButtonEvent.TOUCH_START];
                this._triggerCallbacks(callbacks, buttonInfo);
            }

            if (!buttonInfo.myIsTouched && buttonInfo.myPrevIsTouched) {
                let callbacks = buttonCallbacks[PP.GamepadButtonEvent.TOUCH_END];
                this._triggerCallbacks(callbacks, buttonInfo);
            }

            if (buttonInfo.myIsTouched) {
                let callbacks = buttonCallbacks[PP.GamepadButtonEvent.TOUCHED];
                this._triggerCallbacks(callbacks, buttonInfo);
            } else {
                let callbacks = buttonCallbacks[PP.GamepadButtonEvent.NOT_TOUCHED];
                this._triggerCallbacks(callbacks, buttonInfo);
            }

            //VALUE
            if (buttonInfo.myValue != buttonInfo.myPrevValue) {
                let callbacks = buttonCallbacks[PP.GamepadButtonEvent.VALUE_CHANGED];
                this._triggerCallbacks(callbacks, buttonInfo);
            }

            //ALWAYS
            let callbacks = buttonCallbacks[PP.GamepadButtonEvent.ALWAYS];
            this._triggerCallbacks(callbacks, buttonInfo);
        }

        this._mySelectStart = false;
        this._mySelectEnd = false;
        this._mySqueezeStart = false;
        this._mySqueezeEnd = false;
    }

    _preUpdateAxesInfos() {
        this._myAxesInfos.forEach(function (item) {
            item.myPrevAxes[0] = item.myAxes[0];
            item.myPrevAxes[1] = item.myAxes[1];
        });
    }

    _updateAxesInfos() {
        this._updateSingleAxesInfo(PP.GamepadAxesID.THUMBSTICK);
    }

    _updateSingleAxesInfo(axesID) {
        let axesInfo = this._myAxesInfos[axesID];
        let axesData = this._getAxesData(axesID);

        axesInfo.myAxes[0] = axesData[0];
        axesInfo.myAxes[1] = axesData[1];
    }

    _postUpdateAxesInfos() {
        for (let key in PP.GamepadAxesID) {
            let axesInfo = this._myAxesInfos[PP.GamepadAxesID[key]];
            let axesCallbacks = this._myAxesCallbacks[PP.GamepadAxesID[key]];

            //X CHANGED
            if (axesInfo.myAxes[0] != axesInfo.myPrevAxes[0]) {
                let callbacks = axesCallbacks[PP.GamepadAxesEvent.X_CHANGED];
                this._triggerCallbacks(callbacks, axesInfo);
            }

            //Y CHANGED
            if (axesInfo.myAxes[1] != axesInfo.myPrevAxes[1]) {
                let callbacks = axesCallbacks[PP.GamepadAxesEvent.Y_CHANGED];
                this._triggerCallbacks(callbacks, axesInfo);
            }

            //AXES CHANGED
            if (axesInfo.myAxes[0] != axesInfo.myPrevAxes[0] ||
                axesInfo.myAxes[1] != axesInfo.myPrevAxes[1]) {
                let callbacks = axesCallbacks[PP.GamepadAxesEvent.AXES_CHANGED];
                this._triggerCallbacks(callbacks, axesInfo);
            }

            //ALWAYS        
            let callbacks = axesCallbacks[PP.GamepadAxesEvent.ALWAYS];
            this._triggerCallbacks(callbacks, axesInfo);
        }
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

    _triggerCallbacks(callbacks, info) {
        for (let callback of callbacks.values()) {
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
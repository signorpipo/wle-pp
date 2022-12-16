PP.VirtualGamepad = class VirtualGamepad {
    constructor(params = new PP.VirtualGamepadParams()) {
        this._myParams = params;

        this._myVisible = true;
        this._myVirtualGamepadContainer = null;

        this._myVirtualGamepadVirtualButtons = [];
        this._myVirtualGamepadVirtualButtons[PP.Handedness.LEFT] = [];
        this._myVirtualGamepadVirtualButtons[PP.Handedness.RIGHT] = [];

        this._myVirtualGamepadVirtualButtons[PP.Handedness.LEFT][PP.GamepadButtonID.SELECT] = null;
        this._myVirtualGamepadVirtualButtons[PP.Handedness.LEFT][PP.GamepadButtonID.SQUEEZE] = null;
        this._myVirtualGamepadVirtualButtons[PP.Handedness.LEFT][PP.GamepadButtonID.THUMBSTICK] = null;
        this._myVirtualGamepadVirtualButtons[PP.Handedness.LEFT][PP.GamepadButtonID.TOP_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[PP.Handedness.LEFT][PP.GamepadButtonID.BOTTOM_BUTTON] = null;

        this._myVirtualGamepadVirtualButtons[PP.Handedness.RIGHT][PP.GamepadButtonID.SELECT] = null;
        this._myVirtualGamepadVirtualButtons[PP.Handedness.RIGHT][PP.GamepadButtonID.SQUEEZE] = null;
        this._myVirtualGamepadVirtualButtons[PP.Handedness.RIGHT][PP.GamepadButtonID.THUMBSTICK] = null;
        this._myVirtualGamepadVirtualButtons[PP.Handedness.RIGHT][PP.GamepadButtonID.TOP_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[PP.Handedness.RIGHT][PP.GamepadButtonID.BOTTOM_BUTTON] = null;

        this._myButtonsAmount = this._myVirtualGamepadVirtualButtons[PP.Handedness.LEFT].length;

        this._myVirtualGamepadVirtualThumbsticks = [];
        this._myVirtualGamepadVirtualThumbsticks[PP.Handedness.LEFT] = null;
        this._myVirtualGamepadVirtualThumbsticks[PP.Handedness.RIGHT] = null;
    }

    isVisible() {
        return this._myVisible;
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;

            if (this._myVirtualGamepadContainer != null) {
                if (this._myVisible) {
                    this._myVirtualGamepadContainer.style.display = "block";
                } else {
                    this._myVirtualGamepadContainer.style.display = "none";
                }

                for (let handedness in this._myVirtualGamepadVirtualButtons) {
                    for (let gamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                        let button = this._myVirtualGamepadVirtualButtons[handedness][gamepadButtonID];
                        if (button != null) {
                            button.setActive(this._myVisible);
                        }
                    }
                }

                for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
                    let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness];
                    if (thumbstick != null) {
                        thumbstick.setActive(this._myVisible);
                    }
                }
            }
        }
    }

    isButtonPressed(handedness, gamepadButtonID) {
        if (!this._myVisible) return false;

        let button = this._myVirtualGamepadVirtualButtons[handedness][gamepadButtonID];
        if (button != null) {
            return button.isPressed();
        }

        return false;
    }

    getAxes(handedness, outAxes = PP.vec2_create(0, 0)) {
        if (!this._myVisible) return outAxes;

        let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness];
        if (thumbstick != null) {
            outAxes.vec2_copy(thumbstick.getAxes());
        }

        return outAxes;
    }

    start() {
        this._buildVirtualGamepad();

        let currentVisible = this._myVisible;
        this._myVisible = !this._myVisible;
        this.setVisible(currentVisible);
    }

    update(dt) {
        if (this._myParams.myAutoUpdateVisibility) {
            if (PP.XRUtils.isSessionActive() && WL.vrSupported == 1) {
                this.setVisible(false);
            } else if (this._myParams.myShowOnDesktop && PP.BrowserUtils.isDesktop() && WL.vrSupported == 0) {
                this.setVisible(true);
            } else if (this._myParams.myShowOnHeadset && PP.BrowserUtils.isDesktop() && WL.vrSupported == 1) {
                this.setVisible(true);
            } else if (this._myParams.myShowOnMobile && PP.BrowserUtils.isMobile()) {
                this.setVisible(true);
            } else {
                this.setVisible(false);
            }
        }

        if (this._myVisible) {
            for (let handedness in this._myVirtualGamepadVirtualButtons) {
                for (let gamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                    let button = this._myVirtualGamepadVirtualButtons[handedness][gamepadButtonID];
                    if (button != null) {
                        button.update(dt);
                    }
                }
            }

            for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
                let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness];
                if (thumbstick != null) {
                    thumbstick.update(dt);
                }
            }

            this._setMouseHoverActive(!(this._myParams.myDisableMouseHoverWhenPressed && this._isAnyElementPressed()));
        }
    }

    _buildVirtualGamepad() {
        this._documentBodySetup();

        this._myVirtualGamepadContainer = document.createElement("div");
        this._myVirtualGamepadContainer.style.display = "block";
        this._myVirtualGamepadContainer.style.opacity = this._myParams.myOpacity.toString();
        document.body.appendChild(this._myVirtualGamepadContainer);

        let leftDiv = document.createElement("div");
        this._myVirtualGamepadContainer.appendChild(leftDiv);

        let rightDiv = document.createElement("div");
        this._myVirtualGamepadContainer.appendChild(rightDiv);

        let buttonsAmount = this._myParams.myButtonsOrder[PP.Handedness.LEFT].length;
        for (let i = 0; i < buttonsAmount; i++) {
            if (this._myParams.myButtonsOrder[PP.Handedness.LEFT][i] != null) {
                let gamepadButtonHandedness = this._myParams.myButtonsOrder[PP.Handedness.LEFT][i][0];
                let gamepadButtonID = this._myParams.myButtonsOrder[PP.Handedness.LEFT][i][1];
                this._buildButton(leftDiv, PP.Handedness.LEFT, i, gamepadButtonHandedness, gamepadButtonID);
            }

            if (this._myParams.myButtonsOrder[PP.Handedness.RIGHT][i] != null) {
                let gamepadButtonHandedness = this._myParams.myButtonsOrder[PP.Handedness.RIGHT][i][0];
                let gamepadButtonID = this._myParams.myButtonsOrder[PP.Handedness.RIGHT][i][1];
                this._buildButton(rightDiv, PP.Handedness.RIGHT, i, gamepadButtonHandedness, gamepadButtonID);
            }
        }

        if (this._myParams.myThumbsticksOrder[PP.Handedness.LEFT] != null) {
            let gamepadThumbstickHandedness = this._myParams.myThumbsticksOrder[PP.Handedness.LEFT];
            this._buildThumbstick(leftDiv, PP.Handedness.LEFT, gamepadThumbstickHandedness);
        }

        if (this._myParams.myThumbsticksOrder[PP.Handedness.RIGHT] != null) {
            let gamepadThumbstickHandedness = this._myParams.myThumbsticksOrder[PP.Handedness.RIGHT];
            this._buildThumbstick(rightDiv, PP.Handedness.RIGHT, gamepadThumbstickHandedness);
        }
    }

    _documentBodySetup() {
        document.body.style.overflow = "hidden";
        document.body.style.userSelect = "none";
        document.body.style.webkitUserSelect = "none";
        document.body.style.webkitTapHighlightColor = "transparent";
        document.body.style.touchAction = "none";
        document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
        });
    }

    _buildButton(buttonElementParent, virtualButtonHandedness, virtualButtonIndex, gamepadButtonHandedness, gamepadButtonID) {
        let virtualGamepadVirtualButton = new PP.VirtualGamepadVirtualButton(buttonElementParent, this._myParams, virtualButtonHandedness, virtualButtonIndex, gamepadButtonHandedness, gamepadButtonID);
        this._myVirtualGamepadVirtualButtons[gamepadButtonHandedness][gamepadButtonID] = virtualGamepadVirtualButton;
    }

    _buildThumbstick(thumbstickElementParent, virtualThumbstickHandedness, gamepadThumbstickHandedness) {
        let virtualGamepadVirtualThumbstick = new PP.VirtualGamepadVirtualThumbstick(thumbstickElementParent, this._myParams, virtualThumbstickHandedness, gamepadThumbstickHandedness);
        this._myVirtualGamepadVirtualThumbsticks[gamepadThumbstickHandedness] = virtualGamepadVirtualThumbstick;
    }

    _createSizeValue(value, minSizeMultiplier) {
        return "min(" + value.toFixed(3) + "vmax," + (value * minSizeMultiplier).toFixed(3) + "vw)";
    }

    _isAnyElementPressed() {
        let isAnyElementPressed = false;

        for (let handedness in this._myVirtualGamepadVirtualButtons) {
            for (let gamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                let button = this._myVirtualGamepadVirtualButtons[handedness][gamepadButtonID];
                if (button != null && button.isPressed()) {
                    isAnyElementPressed = true;
                    break;
                }
            }
        }

        if (!isAnyElementPressed) {
            for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
                let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness];
                if (thumbstick != null && thumbstick.isPressed()) {
                    isAnyElementPressed = true;
                    break;
                }
            }
        }

        return isAnyElementPressed;
    }

    _setMouseHoverActive(hoverActive) {
        for (let handedness in this._myVirtualGamepadVirtualButtons) {
            for (let gamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                let button = this._myVirtualGamepadVirtualButtons[handedness][gamepadButtonID];
                if (button != null) {
                    button.setMouseHoverActive(hoverActive);
                }
            }
        }

        for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
            let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness];
            if (thumbstick != null) {
                thumbstick.setMouseHoverActive(hoverActive);
            }
        }
    }
};
import { BrowserUtils } from "../../../cauldron/utils/browser_utils.js";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { vec2_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Handedness } from "../../cauldron/input_types.js";
import { GamepadAxesID, GamepadButtonID } from "../gamepad_buttons.js";
import { VirtualGamepadParams } from "./virtual_gamepad_params.js";
import { VirtualGamepadVirtualButton } from "./virtual_gamepad_virtual_button.js";
import { VirtualGamepadVirtualThumbstick } from "./virtual_gamepad_virtual_thumbstick.js";

export class VirtualGamepad {

    constructor(params = new VirtualGamepadParams()) {
        this._myParams = params;

        this._myVisible = true;
        this._myVirtualGamepadContainer = null;

        this._myVirtualGamepadVirtualButtons = [];
        this._myVirtualGamepadVirtualButtons[Handedness.LEFT] = [];
        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT] = [];

        this._myVirtualGamepadVirtualButtons[Handedness.LEFT][GamepadButtonID.SELECT] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.LEFT][GamepadButtonID.SQUEEZE] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.LEFT][GamepadButtonID.THUMBSTICK] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.LEFT][GamepadButtonID.TOP_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.LEFT][GamepadButtonID.BOTTOM_BUTTON] = null;

        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT][GamepadButtonID.SELECT] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT][GamepadButtonID.SQUEEZE] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT][GamepadButtonID.THUMBSTICK] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT][GamepadButtonID.TOP_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT][GamepadButtonID.BOTTOM_BUTTON] = null;

        this._myButtonsAmount = this._myVirtualGamepadVirtualButtons[Handedness.LEFT].length;

        this._myVirtualGamepadVirtualThumbsticks = [];
        this._myVirtualGamepadVirtualThumbsticks[Handedness.LEFT] = [];
        this._myVirtualGamepadVirtualThumbsticks[Handedness.RIGHT] = [];
        this._myVirtualGamepadVirtualThumbsticks[Handedness.LEFT][GamepadAxesID.THUMBSTICK] = null;
        this._myVirtualGamepadVirtualThumbsticks[Handedness.RIGHT][GamepadAxesID.THUMBSTICK] = null;

        this._myGestureStartEventListener = null;

        this._myDestroyed = false;
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
                    for (let gamepadAxesID in this._myVirtualGamepadVirtualThumbsticks[handedness]) {
                        let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][gamepadAxesID];
                        if (thumbstick != null) {
                            thumbstick.setActive(this._myVisible);
                        }
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

    getAxes(handedness, gamepadAxesID, outAxes = vec2_create(0, 0)) {
        if (!this._myVisible) return outAxes;

        let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][gamepadAxesID];
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
            if (XRUtils.isSessionActive(this._myParams.myEngine) && XRUtils.isVRSupported(this._myParams.myEngine)) {
                this.setVisible(false);
            } else if (this._myParams.myShowOnDesktop && BrowserUtils.isDesktop() && !XRUtils.isVRSupported(this._myParams.myEngine)) {
                this.setVisible(true);
            } else if (this._myParams.myShowOnHeadset && BrowserUtils.isDesktop() && XRUtils.isVRSupported(this._myParams.myEngine)) {
                this.setVisible(true);
            } else if (this._myParams.myShowOnMobile && BrowserUtils.isMobile()) {
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
                for (let gamepadAxesID in this._myVirtualGamepadVirtualThumbsticks[handedness]) {
                    let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][gamepadAxesID];
                    if (thumbstick != null) {
                        thumbstick.update(dt);
                    }
                }
            }

            this._setMouseHoverEnabled(!(this._myParams.myDisableMouseHoverWhenPressed && this._isAnyElementPressed()));
        }
    }

    _buildVirtualGamepad() {
        this._setupDocumentBody();

        this._myVirtualGamepadContainer = document.createElement("div");
        this._myVirtualGamepadContainer.style.display = "block";
        this._myVirtualGamepadContainer.style.opacity = this._myParams.myOpacity.toString();
        document.body.appendChild(this._myVirtualGamepadContainer);

        let leftDiv = document.createElement("div");
        this._myVirtualGamepadContainer.appendChild(leftDiv);

        let rightDiv = document.createElement("div");
        this._myVirtualGamepadContainer.appendChild(rightDiv);

        let buttonsAmount = this._myParams.myButtonsOrder[Handedness.LEFT].length;
        for (let i = 0; i < buttonsAmount; i++) {
            if (this._myParams.myButtonsOrder[Handedness.LEFT][i] != null) {
                let gamepadButtonHandedness = this._myParams.myButtonsOrder[Handedness.LEFT][i][0];
                let gamepadButtonID = this._myParams.myButtonsOrder[Handedness.LEFT][i][1];
                this._buildButton(leftDiv, Handedness.LEFT, i, gamepadButtonHandedness, gamepadButtonID);
            }

            if (this._myParams.myButtonsOrder[Handedness.RIGHT][i] != null) {
                let gamepadButtonHandedness = this._myParams.myButtonsOrder[Handedness.RIGHT][i][0];
                let gamepadButtonID = this._myParams.myButtonsOrder[Handedness.RIGHT][i][1];
                this._buildButton(rightDiv, Handedness.RIGHT, i, gamepadButtonHandedness, gamepadButtonID);
            }
        }

        let thumbsticksAmount = this._myParams.myThumbsticksOrder[Handedness.LEFT].length;
        for (let i = 0; i < thumbsticksAmount; i++) {
            if (this._myParams.myThumbsticksOrder[Handedness.LEFT][i] != null) {
                let gamepadThumbstickHandedness = this._myParams.myThumbsticksOrder[Handedness.LEFT][i][0];
                let gamepadAxesID = this._myParams.myThumbsticksOrder[Handedness.LEFT][i][1];
                this._buildThumbstick(leftDiv, Handedness.LEFT, gamepadThumbstickHandedness, gamepadAxesID);
            }

            if (this._myParams.myThumbsticksOrder[Handedness.RIGHT][i] != null) {
                let gamepadThumbstickHandedness = this._myParams.myThumbsticksOrder[Handedness.RIGHT][i][0];
                let gamepadAxesID = this._myParams.myThumbsticksOrder[Handedness.RIGHT][i][1];
                this._buildThumbstick(rightDiv, Handedness.RIGHT, gamepadThumbstickHandedness, gamepadAxesID);
            }
        }
    }

    _setupDocumentBody() {
        document.body.style.overflow = "hidden";
        document.body.style.userSelect = "none";
        // eslint-disable-next-line deprecation/deprecation
        document.body.style.webkitUserSelect = "none";
        document.body.style.webkitTapHighlightColor = "transparent";
        document.body.style.touchAction = "none";

        this._myGestureStartEventListener = function (e) {
            e.preventDefault();
        };
        document.addEventListener("gesturestart", this._myGestureStartEventListener);
    }

    _buildButton(buttonElementParent, virtualButtonHandedness, virtualButtonIndex, gamepadButtonHandedness, gamepadButtonID) {
        let virtualGamepadVirtualButton = new VirtualGamepadVirtualButton(buttonElementParent, this._myParams, virtualButtonHandedness, virtualButtonIndex, gamepadButtonHandedness, gamepadButtonID);
        this._myVirtualGamepadVirtualButtons[gamepadButtonHandedness][gamepadButtonID] = virtualGamepadVirtualButton;
    }

    _buildThumbstick(thumbstickElementParent, virtualThumbstickHandedness, gamepadThumbstickHandedness, gamepadAxesID) {
        let virtualGamepadVirtualThumbstick = new VirtualGamepadVirtualThumbstick(thumbstickElementParent, this._myParams, virtualThumbstickHandedness, gamepadThumbstickHandedness, gamepadAxesID);
        this._myVirtualGamepadVirtualThumbsticks[gamepadThumbstickHandedness][gamepadAxesID] = virtualGamepadVirtualThumbstick;
    }

    _createSizeValue(value, minSizeMultiplier) {
        return "min(" + value.toFixed(3) + "vmax," + (value * minSizeMultiplier).toFixed(3) + "vw)";
    }

    _isAnyElementPressed() {
        let anyElementPressed = false;

        for (let handedness in this._myVirtualGamepadVirtualButtons) {
            for (let gamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                let button = this._myVirtualGamepadVirtualButtons[handedness][gamepadButtonID];
                if (button != null && button.isPressed()) {
                    anyElementPressed = true;
                    break;
                }
            }
        }

        if (!anyElementPressed) {
            for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
                for (let gamepadAxesID in this._myVirtualGamepadVirtualThumbsticks[handedness]) {
                    let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][gamepadAxesID];
                    if (thumbstick != null && thumbstick.isPressed()) {
                        anyElementPressed = true;
                        break;
                    }
                }
            }
        }

        return anyElementPressed;
    }

    _setMouseHoverEnabled(hoverActive) {
        for (let handedness in this._myVirtualGamepadVirtualButtons) {
            for (let gamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                let button = this._myVirtualGamepadVirtualButtons[handedness][gamepadButtonID];
                if (button != null) {
                    button.setMouseHoverEnabled(hoverActive);
                }
            }
        }

        for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
            for (let gamepadAxesID in this._myVirtualGamepadVirtualThumbsticks[handedness]) {
                let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][gamepadAxesID];
                if (thumbstick != null) {
                    thumbstick.setMouseHoverEnabled(hoverActive);
                }
            }
        }
    }

    destroy() {
        this._myDestroyed = true;

        document.removeEventListener("gesturestart", this._myGestureStartEventListener);

        for (let handedness in this._myVirtualGamepadVirtualButtons) {
            for (let gamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                let button = this._myVirtualGamepadVirtualButtons[handedness][gamepadButtonID];
                if (button != null) {
                    button.destroy();
                }
            }
        }

        for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
            for (let gamepadAxesID in this._myVirtualGamepadVirtualThumbsticks[handedness]) {
                let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][gamepadAxesID];
                if (thumbstick != null) {
                    thumbstick.destroy();
                }
            }
        }

        this._myVirtualGamepadContainer.remove();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
import { BrowserUtils } from "../../../cauldron/utils/browser_utils.js";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { vec2_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Handedness } from "../../cauldron/input_types.js";
import { VirtualGamepadParams } from "./virtual_gamepad_params.js";
import { VirtualGamepadVirtualButton } from "./virtual_gamepad_virtual_button.js";
import { VirtualGamepadVirtualThumbstick } from "./virtual_gamepad_virtual_thumbstick.js";

export let VirtualGamepadButtonID = {
    FIRST_BUTTON: 0,
    SECOND_BUTTON: 1,
    THIRD_BUTTON: 2,
    FOURTH_BUTTON: 3,
    FIFTH_BUTTON: 4
};

export let VirtualGamepadAxesID = {
    FIRST_AXES: 0
};

export class VirtualGamepad {

    constructor(params = new VirtualGamepadParams()) {
        this._myParams = params;

        this._myVisible = true;
        this._myVirtualGamepadContainer = null;

        this._myVirtualGamepadVirtualButtons = [];
        this._myVirtualGamepadVirtualButtons[Handedness.LEFT] = [];
        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT] = [];

        this._myVirtualGamepadVirtualButtons[Handedness.LEFT][VirtualGamepadButtonID.FIRST_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.LEFT][VirtualGamepadButtonID.SECOND_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.LEFT][VirtualGamepadButtonID.THIRD_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.LEFT][VirtualGamepadButtonID.FOURTH_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.LEFT][VirtualGamepadButtonID.FIFTH_BUTTON] = null;

        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT][VirtualGamepadButtonID.FIRST_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT][VirtualGamepadButtonID.SECOND_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT][VirtualGamepadButtonID.THIRD_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT][VirtualGamepadButtonID.FOURTH_BUTTON] = null;
        this._myVirtualGamepadVirtualButtons[Handedness.RIGHT][VirtualGamepadButtonID.FIFTH_BUTTON] = null;

        this._myButtonsAmount = this._myVirtualGamepadVirtualButtons[Handedness.LEFT].length;

        this._myVirtualGamepadVirtualThumbsticks = [];
        this._myVirtualGamepadVirtualThumbsticks[Handedness.LEFT] = [];
        this._myVirtualGamepadVirtualThumbsticks[Handedness.RIGHT] = [];
        this._myVirtualGamepadVirtualThumbsticks[Handedness.LEFT][VirtualGamepadAxesID.FIRST_AXES] = null;
        this._myVirtualGamepadVirtualThumbsticks[Handedness.RIGHT][VirtualGamepadAxesID.FIRST_AXES] = null;

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
                    for (let virtualGamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                        let button = this._myVirtualGamepadVirtualButtons[handedness][virtualGamepadButtonID];
                        if (button != null) {
                            button.setActive(this._myVisible);
                        }
                    }
                }

                for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
                    for (let virtualGamepadAxesID in this._myVirtualGamepadVirtualThumbsticks[handedness]) {
                        let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][virtualGamepadAxesID];
                        if (thumbstick != null) {
                            thumbstick.setActive(this._myVisible);
                        }
                    }
                }
            }
        }
    }

    isButtonPressed(handedness, virtualGamepadButtonID) {
        if (!this._myVisible) return false;

        let button = this._myVirtualGamepadVirtualButtons[handedness][virtualGamepadButtonID];
        if (button != null) {
            return button.isPressed();
        }

        return false;
    }

    getAxes(handedness, virtualGamepadAxesID, outAxes = vec2_create(0, 0)) {
        if (!this._myVisible) return outAxes;

        let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][virtualGamepadAxesID];
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
                for (let virtualGamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                    let button = this._myVirtualGamepadVirtualButtons[handedness][virtualGamepadButtonID];
                    if (button != null) {
                        button.update(dt);
                    }
                }
            }

            for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
                for (let virtualGamepadAxesID in this._myVirtualGamepadVirtualThumbsticks[handedness]) {
                    let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][virtualGamepadAxesID];
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

        for (let virtualGamepadButtonID in this._myParams.myButtonsEnabled[Handedness.LEFT]) {
            if (this._myParams.myButtonsEnabled[Handedness.LEFT][virtualGamepadButtonID] != null) {
                let enabled = this._myParams.myButtonsEnabled[Handedness.LEFT][virtualGamepadButtonID];
                if (enabled) {
                    this._buildButton(leftDiv, Handedness.LEFT, virtualGamepadButtonID);
                }
            }

            if (this._myParams.myButtonsEnabled[Handedness.RIGHT][virtualGamepadButtonID] != null) {
                let enabled = this._myParams.myButtonsEnabled[Handedness.RIGHT][virtualGamepadButtonID];
                if (enabled) {
                    this._buildButton(rightDiv, Handedness.RIGHT, virtualGamepadButtonID);
                }
            }
        }

        for (let virtualGamepadAxesID in this._myParams.myThumbsticksEnabled[Handedness.LEFT]) {
            if (this._myParams.myThumbsticksEnabled[Handedness.LEFT][virtualGamepadAxesID] != null) {
                let enabled = this._myParams.myThumbsticksEnabled[Handedness.LEFT][virtualGamepadAxesID];
                if (enabled) {
                    this._buildThumbstick(leftDiv, Handedness.LEFT, virtualGamepadAxesID);
                }
            }

            if (this._myParams.myThumbsticksEnabled[Handedness.RIGHT][virtualGamepadAxesID] != null) {
                let enabled = this._myParams.myThumbsticksEnabled[Handedness.RIGHT][virtualGamepadAxesID];
                if (enabled) {
                    this._buildThumbstick(rightDiv, Handedness.RIGHT, virtualGamepadAxesID);
                }
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

    _buildButton(buttonElementParent, virtualButtonHandedness, virtualGamepadButtonID) {
        let virtualGamepadVirtualButton = new VirtualGamepadVirtualButton(buttonElementParent, this._myParams, virtualButtonHandedness, virtualGamepadButtonID);
        this._myVirtualGamepadVirtualButtons[virtualButtonHandedness][virtualGamepadButtonID] = virtualGamepadVirtualButton;
    }

    _buildThumbstick(thumbstickElementParent, virtualThumbstickHandedness, virtualGamepadAxesID) {
        let virtualGamepadVirtualThumbstick = new VirtualGamepadVirtualThumbstick(thumbstickElementParent, this._myParams, virtualThumbstickHandedness, virtualGamepadAxesID);
        this._myVirtualGamepadVirtualThumbsticks[virtualThumbstickHandedness][virtualGamepadAxesID] = virtualGamepadVirtualThumbstick;
    }

    _createSizeValue(value, minSizeMultiplier) {
        return "min(" + value.toFixed(3) + "vmax," + (value * minSizeMultiplier).toFixed(3) + "vw)";
    }

    _isAnyElementPressed() {
        let anyElementPressed = false;

        for (let handedness in this._myVirtualGamepadVirtualButtons) {
            for (let virtualGamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                let button = this._myVirtualGamepadVirtualButtons[handedness][virtualGamepadButtonID];
                if (button != null && button.isPressed()) {
                    anyElementPressed = true;
                    break;
                }
            }
        }

        if (!anyElementPressed) {
            for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
                for (let virtualGamepadAxesID in this._myVirtualGamepadVirtualThumbsticks[handedness]) {
                    let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][virtualGamepadAxesID];
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
            for (let virtualGamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                let button = this._myVirtualGamepadVirtualButtons[handedness][virtualGamepadButtonID];
                if (button != null) {
                    button.setMouseHoverEnabled(hoverActive);
                }
            }
        }

        for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
            for (let virtualGamepadAxesID in this._myVirtualGamepadVirtualThumbsticks[handedness]) {
                let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][virtualGamepadAxesID];
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
            for (let virtualGamepadButtonID in this._myVirtualGamepadVirtualButtons[handedness]) {
                let button = this._myVirtualGamepadVirtualButtons[handedness][virtualGamepadButtonID];
                if (button != null) {
                    button.destroy();
                }
            }
        }

        for (let handedness in this._myVirtualGamepadVirtualThumbsticks) {
            for (let virtualGamepadAxesID in this._myVirtualGamepadVirtualThumbsticks[handedness]) {
                let thumbstick = this._myVirtualGamepadVirtualThumbsticks[handedness][virtualGamepadAxesID];
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
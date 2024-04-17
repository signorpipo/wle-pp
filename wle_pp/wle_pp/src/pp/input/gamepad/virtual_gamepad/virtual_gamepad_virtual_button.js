import { Handedness } from "../../cauldron/input_types.js";
import { VirtualGamepadIcon } from "./virtual_gamepad_icon.js";

export class VirtualGamepadVirtualButton {

    constructor(buttonElementParent, virtualGamepadParams, virtualButtonHandedness, virtualButtonIndex, gamepadButtonHandedness, gamepadButtonID) {
        this._myButtonElement = null;
        this._myButtonIcon = null;
        this._myButtonDetectionElement = null;

        this._myActive = true;

        this._myPointerID = null;
        this._myPointerButton = null;

        this._myPressed = false;

        this._myVirtualGamepadParams = virtualGamepadParams;
        this._myParams = this._myVirtualGamepadParams.myButtonParams[gamepadButtonHandedness][gamepadButtonID];

        this._build(buttonElementParent, virtualButtonHandedness, virtualButtonIndex);

        this._myPointerDownEventListener = this._onPointerDown.bind(this, this._myVirtualGamepadParams.myStopPropagatingPointerDownEvents);
        this._myPointerUpEventListener = this._onPointerUp.bind(this);
        this._myPointerLeaveEventListener = this._onPointerLeave.bind(this);
        this._myMouseEnterEventListener = this._onButtonEnter.bind(this);
        this._myMouseLeaveEventListener = this._onButtonLeave.bind(this);

        this._myButtonDetectionElement.addEventListener("pointerdown", this._myPointerDownEventListener);
        document.body.addEventListener("pointerup", this._myPointerUpEventListener);

        if (this._myVirtualGamepadParams.myReleaseOnPointerLeave) {
            document.body.addEventListener("pointerleave", this._myPointerLeaveEventListener);
        }

        this._myButtonDetectionElement.addEventListener("mouseenter", this._myMouseEnterEventListener);
        this._myButtonDetectionElement.addEventListener("mouseleave", this._myMouseLeaveEventListener);

        this._myDestroyed = false;
    }

    isPressed() {
        return this._myActive && this._myPressed;
    }

    setActive(active) {
        if (this._myActive != active) {
            this.reset();
            this._myButtonIcon.reset();
        }

        this._myActive = active;
    }

    setMouseHoverEnabled(hoverActive) {
        this._myButtonIcon.setMouseHoverEnabled(hoverActive);
    }

    reset() {
        this._myButtonIcon.setPressed(false);

        this._myPressed = false;
        this._myPointerID = null;
        this._myPointerButton = null;
    }

    update(dt) {
        this._myButtonIcon.update(dt);
    }

    _onPointerDown(stopPropagatingPointerDownEvents, event) {
        if (!this._myActive) return;
        if (this._myPressed) return;
        if (!this._myVirtualGamepadParams.myValidPointerButtons.pp_hasEqual(event.button)) return;

        if (stopPropagatingPointerDownEvents) {
            event.stopPropagation();
        }
        event.preventDefault();

        this._myButtonIcon.setPressed(true);

        this._myPointerID = event.pointerId;
        this._myPointerButton = event.button;

        this._myPressed = true;
    }

    _onPointerUp(event) {
        if (!this._myActive) return;
        if (!this._myPressed) return;
        if (this._myPointerID != event.pointerId) return;
        if (this._myPointerButton != null && this._myPointerButton != event.button) return;

        this.reset();
    }

    _onPointerLeave(event) {
        if (!this._myActive) return;
        if (this._myPointerID != event.pointerId) return;

        this.reset();
    }

    _onButtonEnter(event) {
        if (!this._myActive) return;

        this._myButtonIcon.onMouseEnter(event);
    }

    _onButtonLeave(event) {
        if (!this._myActive) return;

        this._myButtonIcon.onMouseLeave(event);
    }

    _build(buttonElementParent, virtualButtonHandedness, virtualButtonIndex) {
        // Config variables used for the sizes and the like

        let buttonSize = this._myVirtualGamepadParams.myButtonSize * this._myVirtualGamepadParams.myInterfaceScale;
        let buttonsRingRadius = this._myVirtualGamepadParams.myButtonsRingRadius * this._myVirtualGamepadParams.myInterfaceScale;

        let thumbstickSize = this._myVirtualGamepadParams.myThumbstickSize * this._myVirtualGamepadParams.myInterfaceScale;

        let marginBottom = this._myVirtualGamepadParams.myMarginBottom * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;
        let marginLeft = this._myVirtualGamepadParams.myMarginLeft * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;
        let marginRight = this._myVirtualGamepadParams.myMarginRight * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;

        let buttonRingStartAngle = this._myVirtualGamepadParams.myButtonsRingStartAngle;
        let buttonRingEndAngle = this._myVirtualGamepadParams.myButtonsRingEndAngle;

        let minSizeMultiplier = Math.max(1, this._myVirtualGamepadParams.myMinSizeMultiplier / this._myVirtualGamepadParams.myInterfaceScale);

        let buttonsAmount = this._myVirtualGamepadParams.myButtonsOrder[Handedness.LEFT].length;

        let angleStep = (buttonRingEndAngle - buttonRingStartAngle) / (buttonsAmount - 1);

        let currentAngle = Math.pp_angleClamp(buttonRingStartAngle + angleStep * virtualButtonIndex);

        if (virtualButtonHandedness == Handedness.RIGHT) {
            currentAngle = 270 + (270 - currentAngle);
            currentAngle = Math.pp_angleClamp(currentAngle, true);
        }

        let counterAngle = 360 - currentAngle;

        // Actual button creation

        this._myButtonContainer = document.createElement("div");
        this._myButtonContainer.style.position = "absolute";
        this._myButtonContainer.style.width = this._createSizeValue(buttonSize, minSizeMultiplier);
        this._myButtonContainer.style.height = this._createSizeValue(buttonSize, minSizeMultiplier);

        let centerOnThumbstickBottom = marginBottom + thumbstickSize / 2 - buttonSize / 2;

        this._myButtonContainer.style.bottom = this._createSizeValue(centerOnThumbstickBottom, minSizeMultiplier);

        if (virtualButtonHandedness == Handedness.LEFT) {
            let centerOnThumbstickLeft = marginLeft + thumbstickSize / 2 - buttonSize / 2;
            this._myButtonContainer.style.left = this._createSizeValue(centerOnThumbstickLeft, minSizeMultiplier);
        } else {
            let centerOnThumbstickRight = marginRight + thumbstickSize / 2 - buttonSize / 2;
            this._myButtonContainer.style.right = this._createSizeValue(centerOnThumbstickRight, minSizeMultiplier);
        }

        this._myButtonContainer.style.transform = "rotate(" + currentAngle + "deg) translateX(" + this._createSizeValue(buttonsRingRadius, minSizeMultiplier) + ")";
        buttonElementParent.appendChild(this._myButtonContainer);

        this._myButtonElement = document.createElement("div");
        this._myButtonElement.style.position = "absolute";
        this._myButtonElement.style.width = "100%";
        this._myButtonElement.style.height = "100%";
        this._myButtonElement.style.transform = "rotate(" + counterAngle + "deg)";
        this._myButtonContainer.appendChild(this._myButtonElement);

        this._myButtonIcon = new VirtualGamepadIcon(this._myButtonElement, this._myParams.myIconParams, minSizeMultiplier, this._myVirtualGamepadParams.myInterfaceScale, this._myVirtualGamepadParams.myEngine);

        let buttonElementStill = document.createElement("div");
        buttonElementStill.style.position = "absolute";
        buttonElementStill.style.width = "100%";
        buttonElementStill.style.height = "100%";
        buttonElementStill.style.transform = "rotate(" + counterAngle + "deg)";
        this._myButtonContainer.appendChild(buttonElementStill);

        let buttonDetectionElementSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        buttonDetectionElementSVG.style.position = "absolute";
        buttonDetectionElementSVG.style.width = "100%";
        buttonDetectionElementSVG.style.height = "100%";
        buttonElementStill.appendChild(buttonDetectionElementSVG);

        let buttonDetectionElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        buttonDetectionElement.setAttributeNS(null, "cx", "50%");
        buttonDetectionElement.setAttributeNS(null, "cy", "50%");
        buttonDetectionElement.setAttributeNS(null, "r", "50%");
        buttonDetectionElement.style.fill = "#00000000";
        buttonDetectionElementSVG.appendChild(buttonDetectionElement);

        this._myButtonDetectionElement = buttonDetectionElement;
    }

    _createSizeValue(value, minSizeMultiplier) {
        return "min(" + value.toFixed(3) + "vmax," + (value * minSizeMultiplier).toFixed(3) + "vw)";
    }

    destroy() {
        this._myDestroyed = true;

        this._myButtonDetectionElement.removeEventListener("pointerdown", this._myPointerDownEventListener);

        document.body.removeEventListener("pointerup", this._myPointerUpEventListener);
        document.body.removeEventListener("pointerleave", this._myPointerLeaveEventListener);

        this._myButtonDetectionElement.removeEventListener("mouseenter", this._myMouseEnterEventListener);
        this._myButtonDetectionElement.removeEventListener("mouseleave", this._myPointerUpEventLis_myMouseLeaveEventListenertener);

        this._myButtonIcon.destroy();

        this._myButtonContainer.remove();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
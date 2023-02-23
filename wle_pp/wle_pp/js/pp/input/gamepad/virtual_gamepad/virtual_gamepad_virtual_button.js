PP.VirtualGamepadVirtualButton = class VirtualGamepadVirtualButton {
    constructor(buttonElementParent, virtualGamepadParams, virtualButtonHandedness, virtualButtonIndex, gamepadButtonHandedness, gamepadButtonID) {
        this._myButtonElement = null;
        this._myButtonIcon = null;
        this._myButtonDetectionElement = null;

        this._myIsActive = true;

        this._myPointerID = null;
        this._myPointerButton = null;

        this._myIsPressed = false;

        this._myVirtualGamepadParams = virtualGamepadParams;
        this._myParams = this._myVirtualGamepadParams.myButtonParams[gamepadButtonHandedness][gamepadButtonID];

        this._build(buttonElementParent, virtualButtonHandedness, virtualButtonIndex);

        this._myButtonDetectionElement.addEventListener("pointerdown", this._onPointerDown.bind(this, this._myVirtualGamepadParams.myStopPropagatingPointerDownEvents));
        document.body.addEventListener("pointerup", this._onPointerUp.bind(this));

        if (this._myVirtualGamepadParams.myReleaseOnPointerLeave) {
            document.body.addEventListener("pointerleave", this._onPointerLeave.bind(this));
        }

        this._myButtonDetectionElement.addEventListener("mouseenter", this._onButtonEnter.bind(this));
        this._myButtonDetectionElement.addEventListener("mouseleave", this._onButtonLeave.bind(this));
    }

    isPressed() {
        return this._myIsActive && this._myIsPressed;
    }

    setActive(active) {
        if (this._myIsActive != active) {
            this.reset();
            this._myButtonIcon.reset();
        }

        this._myIsActive = active;
    }

    setMouseHoverActive(hoverActive) {
        this._myButtonIcon.setMouseHoverActive(hoverActive);
    }

    reset() {
        this._myButtonIcon.setPressed(false);

        this._myIsPressed = false;
        this._myPointerID = null;
        this._myPointerButton = null;
    }

    update(dt) {
        this._myButtonIcon.update(dt);
    }

    _onPointerDown(stopPropagatingPointerDownEvents, event) {
        if (!this._myIsActive) return;
        if (this._myIsPressed) return;
        if (!this._myVirtualGamepadParams.myValidPointerButtons.pp_hasEqual(event.button)) return;

        if (stopPropagatingPointerDownEvents) {
            event.stopPropagation();
        }
        event.preventDefault();

        this._myButtonIcon.setPressed(true);

        this._myPointerID = event.pointerId;
        this._myPointerButton = event.button;

        this._myIsPressed = true;
    }

    _onPointerUp(event) {
        if (!this._myIsActive) return;
        if (!this._myIsPressed) return;
        if (this._myPointerID != event.pointerId) return;
        if (this._myPointerButton != null && this._myPointerButton != event.button) return;

        this.reset();
    }

    _onPointerLeave(event) {
        if (!this._myIsActive) return;
        if (this._myPointerID != event.pointerId) return;

        this.reset();
    }

    _onButtonEnter(event) {
        if (!this._myIsActive) return;

        this._myButtonIcon.onMouseEnter(event);
    }

    _onButtonLeave(event) {
        if (!this._myIsActive) return;

        this._myButtonIcon.onMouseLeave(event);
    }

    _build(buttonElementParent, virtualButtonHandedness, virtualButtonIndex) {
        // setup variables used for the sizes and the like

        let buttonSize = this._myVirtualGamepadParams.myButtonSize * this._myVirtualGamepadParams.myInterfaceScale;
        let buttonsRingRadius = this._myVirtualGamepadParams.myButtonsRingRadius * this._myVirtualGamepadParams.myInterfaceScale;

        let thumbstickSize = this._myVirtualGamepadParams.myThumbstickSize * this._myVirtualGamepadParams.myInterfaceScale;

        let marginBottom = this._myVirtualGamepadParams.myMarginBottom * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;
        let marginLeft = this._myVirtualGamepadParams.myMarginLeft * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;
        let marginRight = this._myVirtualGamepadParams.myMarginRight * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;

        let buttonRingStartAngle = this._myVirtualGamepadParams.myButtonsRingStartAngle;
        let buttonRingEndAngle = this._myVirtualGamepadParams.myButtonsRingEndAngle;

        let minSizeMultiplier = Math.max(1, this._myVirtualGamepadParams.myMinSizeMultiplier / this._myVirtualGamepadParams.myInterfaceScale);

        let buttonsAmount = this._myVirtualGamepadParams.myButtonsOrder[PP.Handedness.LEFT].length;

        let angleStep = (buttonRingEndAngle - buttonRingStartAngle) / (buttonsAmount - 1);

        let currentAngle = Math.pp_angleClamp(buttonRingStartAngle + angleStep * virtualButtonIndex);

        if (virtualButtonHandedness == PP.Handedness.RIGHT) {
            currentAngle = 270 + (270 - currentAngle);
            currentAngle = Math.pp_angleClamp(currentAngle, true);
        }

        let counterAngle = 360 - currentAngle;

        // actual button creation

        let buttonPivot = document.createElement("div");
        buttonPivot.style.position = "absolute";
        buttonPivot.style.width = this._createSizeValue(buttonSize, minSizeMultiplier);
        buttonPivot.style.height = this._createSizeValue(buttonSize, minSizeMultiplier);

        let centerOnThumbstickBottom = marginBottom + thumbstickSize / 2 - buttonSize / 2;

        buttonPivot.style.bottom = this._createSizeValue(centerOnThumbstickBottom, minSizeMultiplier);

        if (virtualButtonHandedness == PP.Handedness.LEFT) {
            let centerOnThumbstickLeft = marginLeft + thumbstickSize / 2 - buttonSize / 2;
            buttonPivot.style.left = this._createSizeValue(centerOnThumbstickLeft, minSizeMultiplier);
        } else {
            let centerOnThumbstickRight = marginRight + thumbstickSize / 2 - buttonSize / 2;
            buttonPivot.style.right = this._createSizeValue(centerOnThumbstickRight, minSizeMultiplier);
        }

        buttonPivot.style.transform = "rotate(" + currentAngle + "deg) translateX(" + this._createSizeValue(buttonsRingRadius, minSizeMultiplier) + ")";
        buttonElementParent.appendChild(buttonPivot);

        this._myButtonElement = document.createElement("div");
        this._myButtonElement.style.position = "absolute";
        this._myButtonElement.style.width = "100%";
        this._myButtonElement.style.height = "100%";
        this._myButtonElement.style.transform = "rotate(" + counterAngle + "deg)";
        buttonPivot.appendChild(this._myButtonElement);

        this._myButtonIcon = new PP.VirtualGamepadIcon(this._myButtonElement, this._myParams.myIconParams, minSizeMultiplier, this._myVirtualGamepadParams.myInterfaceScale);

        let buttonElementStill = document.createElement("div");
        buttonElementStill.style.position = "absolute";
        buttonElementStill.style.width = "100%";
        buttonElementStill.style.height = "100%";
        buttonElementStill.style.transform = "rotate(" + counterAngle + "deg)";
        buttonPivot.appendChild(buttonElementStill);

        let buttonDetectionElementSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        buttonDetectionElementSVG.style.position = "absolute";
        buttonDetectionElementSVG.style.width = "100%";
        buttonDetectionElementSVG.style.height = "100%";
        buttonElementStill.appendChild(buttonDetectionElementSVG);

        let buttonDetectionElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        buttonDetectionElement.setAttributeNS(null, 'cx', "50%");
        buttonDetectionElement.setAttributeNS(null, 'cy', "50%");
        buttonDetectionElement.setAttributeNS(null, 'r', "50%");
        buttonDetectionElement.style.fill = "#00000000";
        buttonDetectionElementSVG.appendChild(buttonDetectionElement);

        this._myButtonDetectionElement = buttonDetectionElement;
    }

    _createSizeValue(value, minSizeMultiplier) {
        return "min(" + value.toFixed(3) + "vmax," + (value * minSizeMultiplier).toFixed(3) + "vw)";
    }
};
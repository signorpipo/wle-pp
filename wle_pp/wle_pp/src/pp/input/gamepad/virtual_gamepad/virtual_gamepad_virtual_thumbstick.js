import { vec2_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Handedness } from "../../cauldron/input_types.js";
import { VirtualGamepadIcon } from "./virtual_gamepad_icon.js";

export class VirtualGamepadVirtualThumbstick {

    constructor(thumbstickElementParent, virtualGamepadParams, virtualThumbstickHandedness, gamepadThumbstickHandedness, gamepadAxesID) {
        this._myThumbstickElement = null;
        this._myThumbstickIcon = null;
        this._myThumbstickBackground = null;
        this._myThumbstickDetectionElement = null;

        this._myActive = true;

        this._myPointerID = null;
        this._myPointerButton = null;

        this._myThumbstickDragStartPosition = vec2_create();

        this._myAxes = vec2_create();
        this._myPressed = false;

        this._myVirtualGamepadParams = virtualGamepadParams;
        this._myParams = this._myVirtualGamepadParams.myThumbstickParams[gamepadThumbstickHandedness][gamepadAxesID];

        this._build(thumbstickElementParent, virtualThumbstickHandedness);

        this._myPointerDownEventListener = this._onPointerDown.bind(this, this._myVirtualGamepadParams.myStopPropagatingPointerDownEvents);
        this._myPointerUpEventListener = this._onPointerUp.bind(this);
        this._myPointerMoveEventListener = this._onPointerMove.bind(this);
        this._myPointerLeaveEventListener = this._onPointerLeave.bind(this);
        this._myMouseEnterEventListener = this._onThumbstickEnter.bind(this);
        this._myMouseLeaveEventListener = this._onThumbstickLeave.bind(this);

        this._myThumbstickDetectionElement.addEventListener("pointerdown", this._myPointerDownEventListener);
        document.body.addEventListener("pointerup", this._myPointerUpEventListener);
        document.body.addEventListener("pointermove", this._myPointerMoveEventListener);

        if (this._myVirtualGamepadParams.myReleaseOnPointerLeave) {
            document.body.addEventListener("pointerleave", this._myPointerLeaveEventListener);
        }

        this._myThumbstickDetectionElement.addEventListener("mouseenter", this._myMouseEnterEventListener);
        this._myThumbstickDetectionElement.addEventListener("mouseleave", this._myMouseLeaveEventListener);

        this._myDestroyed = false;
    }

    isPressed() {
        return this._myActive && this._myPressed;
    }

    getAxes() {
        return this._myAxes;
    }

    setActive(active) {
        if (this._myActive != active) {
            this.reset();
            this._myThumbstickIcon.reset();
        }

        this._myActive = active;
    }

    setMouseHoverEnabled(hoverActive) {
        this._myThumbstickIcon.setMouseHoverEnabled(hoverActive);
    }

    reset() {
        this._myThumbstickIcon.setPressed(false);

        this._myAxes[0] = 0;
        this._myAxes[1] = 0;
        this._myPressed = false;
        this._myPointerID = null;
        this._myPointerButton = null;

        this._myThumbstickElement.style.transition = "all " + this._myParams.myReleaseTransitionSeconds + "s ease 0s";
        this._myThumbstickElement.style.transform = "translate(0px, 0px)";
    }

    update(dt) {
        this._myThumbstickIcon.update(dt);
    }

    _onPointerDown(stopPropagatingPointerDownEvents, event) {
        if (!this._myActive) return;
        if (this._myPressed) return;
        if (!this._myVirtualGamepadParams.myValidPointerButtons.pp_hasEqual(event.button)) return;

        if (stopPropagatingPointerDownEvents) {
            event.stopPropagation();
        }
        event.preventDefault();

        this._myThumbstickIcon.setPressed(true);

        this._myPointerID = event.pointerId;
        this._myPointerButton = event.button;

        this._myThumbstickDragStartPosition[0] = event.clientX;
        this._myThumbstickDragStartPosition[1] = event.clientY;

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

    _onThumbstickEnter(event) {
        this._myThumbstickIcon.onMouseEnter(event);
    }

    _onThumbstickLeave(event) {
        this._myThumbstickIcon.onMouseLeave(event);
    }

    _onPointerMove(event) {
        if (!this._myActive) return;
        if (!this._myPressed) return;

        if (event.pointerId != this._myPointerID) return;

        let mouseX = event.clientX;
        let mouseY = event.clientY;

        let backgroundRect = this._myThumbstickBackground.getBoundingClientRect();
        let maxDistanceFromCenter = (backgroundRect.width / 2) * this._myParams.myMaxDistanceFromCenterMultiplier;

        let xDiff = mouseX - this._myThumbstickDragStartPosition[0];
        let yDiff = mouseY - this._myThumbstickDragStartPosition[1];

        let angle = Math.atan2(yDiff, xDiff);
        let distanceFromDragStart = Math.min(maxDistanceFromCenter, Math.hypot(xDiff, yDiff));

        let translateThumbstickX = distanceFromDragStart * Math.cos(angle);
        let translateThumbstickY = distanceFromDragStart * Math.sin(angle);

        this._myThumbstickElement.style.transition = "all " + this._myParams.myMoveTransitionSeconds + "s ease-out 0s";
        this._myThumbstickElement.style.transform = "translate(" + translateThumbstickX + "px, " + translateThumbstickY + "px)";

        this._myAxes[0] = translateThumbstickX / maxDistanceFromCenter;
        this._myAxes[1] = -(translateThumbstickY / maxDistanceFromCenter);
    }

    _build(thumbstickElementParent, virtualThumbstickHandedness) {
        // Config variables used for the sizes and the like

        let thumbstickSize = this._myVirtualGamepadParams.myThumbstickSize * this._myVirtualGamepadParams.myInterfaceScale;

        let marginBottom = this._myVirtualGamepadParams.myMarginBottom * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;
        let marginLeft = this._myVirtualGamepadParams.myMarginLeft * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;
        let marginRight = this._myVirtualGamepadParams.myMarginRight * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;

        let minSizeMultiplier = Math.max(1, this._myVirtualGamepadParams.myMinSizeMultiplier / this._myVirtualGamepadParams.myInterfaceScale);

        // Actual thumbstick creation

        this._myThumbstickContainer = document.createElement("div");
        this._myThumbstickContainer.style.position = "absolute";
        this._myThumbstickContainer.style.width = this._createSizeValue(thumbstickSize, minSizeMultiplier);
        this._myThumbstickContainer.style.height = this._createSizeValue(thumbstickSize, minSizeMultiplier);
        this._myThumbstickContainer.style.bottom = this._createSizeValue(marginBottom, minSizeMultiplier);

        if (virtualThumbstickHandedness == Handedness.LEFT) {
            this._myThumbstickContainer.style.left = this._createSizeValue(marginLeft, minSizeMultiplier);
        } else {
            this._myThumbstickContainer.style.right = this._createSizeValue(marginRight, minSizeMultiplier);
        }

        thumbstickElementParent.appendChild(this._myThumbstickContainer);

        let thumbstickContainerSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        thumbstickContainerSVG.style.position = "absolute";
        thumbstickContainerSVG.style.width = "100%";
        thumbstickContainerSVG.style.height = "100%";
        this._myThumbstickContainer.appendChild(thumbstickContainerSVG);

        this._myThumbstickBackground = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this._myThumbstickBackground.setAttributeNS(null, "cx", "50%");
        this._myThumbstickBackground.setAttributeNS(null, "cy", "50%");
        this._myThumbstickBackground.setAttributeNS(null, "r", "48%");
        this._myThumbstickBackground.style.fill = this._myParams.myBackgroundColor;
        thumbstickContainerSVG.appendChild(this._myThumbstickBackground);

        this._myThumbstickElement = document.createElement("div");
        this._myThumbstickElement.style.position = "absolute";
        this._myThumbstickElement.style.width = "34%";
        this._myThumbstickElement.style.height = "34%";
        this._myThumbstickElement.style.top = "33%";
        this._myThumbstickElement.style.left = "33%";
        this._myThumbstickContainer.appendChild(this._myThumbstickElement);

        this._myThumbstickIcon = new VirtualGamepadIcon(this._myThumbstickElement, this._myParams.myIconParams, minSizeMultiplier, this._myVirtualGamepadParams.myScale, this._myVirtualGamepadParams.myEngine);

        if (this._myParams.myIncludeBackgroundToDetection) {
            let thumbstickBackgroundDetectionElementSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            thumbstickBackgroundDetectionElementSVG.style.position = "absolute";
            thumbstickBackgroundDetectionElementSVG.style.width = "100%";
            thumbstickBackgroundDetectionElementSVG.style.height = "100%";
            this._myThumbstickContainer.appendChild(thumbstickBackgroundDetectionElementSVG);

            let thumbstickBackgroundDetectionElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            thumbstickBackgroundDetectionElement.setAttributeNS(null, "cx", "50%");
            thumbstickBackgroundDetectionElement.setAttributeNS(null, "cy", "50%");
            thumbstickBackgroundDetectionElement.setAttributeNS(null, "r", "48%");
            thumbstickBackgroundDetectionElement.style.fill = "#00000000";
            thumbstickBackgroundDetectionElementSVG.appendChild(thumbstickBackgroundDetectionElement);

            this._myThumbstickDetectionElement = thumbstickBackgroundDetectionElement;
        } else {
            let thumbstickElementStill = document.createElement("div");
            thumbstickElementStill.style.position = "absolute";
            thumbstickElementStill.style.width = "34%";
            thumbstickElementStill.style.height = "34%";
            thumbstickElementStill.style.top = "33%";
            thumbstickElementStill.style.left = "33%";
            this._myThumbstickContainer.appendChild(thumbstickElementStill);

            let thumbstickDetectionElementSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            thumbstickDetectionElementSVG.style.position = "absolute";
            thumbstickDetectionElementSVG.style.width = "100%";
            thumbstickDetectionElementSVG.style.height = "100%";
            thumbstickElementStill.appendChild(thumbstickDetectionElementSVG);

            let thumbstickDetectionElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            thumbstickDetectionElement.setAttributeNS(null, "cx", "50%");
            thumbstickDetectionElement.setAttributeNS(null, "cy", "50%");
            thumbstickDetectionElement.setAttributeNS(null, "r", "50%");
            thumbstickDetectionElement.style.fill = "#00000000";
            thumbstickDetectionElementSVG.appendChild(thumbstickDetectionElement);

            this._myThumbstickDetectionElement = thumbstickDetectionElement;
        }
    }

    _createSizeValue(value, minSizeMultiplier) {
        return "min(" + value.toFixed(3) + "vmax," + (value * minSizeMultiplier).toFixed(3) + "vw)";
    }

    destroy() {
        this._myDestroyed = true;

        this._myThumbstickDetectionElement.removeEventListener("pointerdown", this._myPointerDownEventListener);

        document.body.removeEventListener("pointerup", this._myPointerUpEventListener);
        document.body.removeEventListener("pointermove", this._myPointerMoveEventListener);
        document.body.removeEventListener("pointerleave", this._myPointerLeaveEventListener);

        this._myThumbstickDetectionElement.removeEventListener("mouseenter", this._myMouseEnterEventListener);
        this._myThumbstickDetectionElement.removeEventListener("mouseleave", this._myPointerUpEventLis_myMouseLeaveEventListenertener);

        this._myThumbstickIcon.destroy();

        this._myThumbstickContainer.remove();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
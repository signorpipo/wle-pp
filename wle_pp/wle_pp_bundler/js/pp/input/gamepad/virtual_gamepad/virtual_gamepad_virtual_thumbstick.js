PP.VirtualGamepadVirtualThumbstick = class VirtualGamepadVirtualThumbstick {
    constructor(thumbstickElementParent, virtualGamepadParams, virtualThumbstickHandedness, gamepadThumbstickHandedness) {
        this._myThumbstickElement = null;
        this._myThumbstickElementHoverCheck = null;
        this._myThumbstickIcon = null;
        this._myThumbstickContainer = null;

        this._myIsActive = true;

        this._myPointerID = null;
        this._myPointerButton = null

        this._myThumbstickDragStartPosition = PP.vec2_create();

        this._myAxes = PP.vec2_create();
        this._myIsPressed = false;

        this._myVirtualGamepadParams = virtualGamepadParams;
        this._myParams = this._myVirtualGamepadParams.myThumbstickParams[gamepadThumbstickHandedness];

        this._build(thumbstickElementParent, virtualThumbstickHandedness);

        this._myThumbstickElement.addEventListener("pointerdown", this._onPointerDown.bind(this, this._myVirtualGamepadParams.myStopPropagatingPointerDownEvents));
        document.body.addEventListener("pointerup", this._onPointerUp.bind(this));
        document.body.addEventListener("pointermove", this._onPointerMove.bind(this));

        if (this._myVirtualGamepadParams.myReleaseOnPointerLeave) {
            document.body.addEventListener("pointerleave", this._onPointerLeave.bind(this));
        }

        this._myThumbstickElement.addEventListener("mouseenter", this._onThumbstickElementEnter.bind(this));
        this._myThumbstickElement.addEventListener("mouseleave", this._onThumbstickElementLeave.bind(this));
    }

    isPressed() {
        return this._myIsActive && this._myIsPressed;
    }

    getAxes() {
        return this._myAxes;
    }

    setActive(active) {
        if (this._myIsActive != active) {
            this.reset();
            this._myThumbstickIcon.reset();
        }

        this._myIsActive = active;
    }

    setMouseHoverActive(hoverActive) {
        this._myThumbstickIcon.setMouseHoverActive(hoverActive);
    }

    reset() {
        this._myThumbstickIcon.setPressed(false);

        this._myAxes[0] = 0;
        this._myAxes[1] = 0;
        this._myIsPressed = false;
        this._myPointerID = null;
        this._myPointerButton = null;

        this._myThumbstickElement.style.transition = "all " + this._myParams.myReleaseTransitionSeconds + "s ease 0s";
        this._myThumbstickElement.style.transform = "translate(0px, 0px)";
    }

    update(dt) {
        this._myThumbstickIcon.update(dt);
    }

    _onPointerDown(stopPropagatingPointerDownEvents, event) {
        if (!this._myIsActive) return;
        if (this._myIsPressed) return;
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

        this._myIsPressed = true;
    }

    _onPointerUp(event) {
        if (!this._myIsActive) return;
        if (!this._myIsPressed) return;
        if (this._myPointerID != event.pointerId) return;
        if (this._myPointerButton != null && this._myPointerButton != event.button) return;

        this.reset();

        let hoverCheckRect = this._myThumbstickElementHoverCheck.getBoundingClientRect();
        let isInsideHoverCheckRect =
            event.clientX >= hoverCheckRect.left && event.clientX <= hoverCheckRect.right &&
            event.clientY >= hoverCheckRect.top && event.clientY <= hoverCheckRect.bottom;
        if (!isInsideHoverCheckRect) {
            this._myThumbstickIcon.resetMouseHoverCount();
        }
    }

    _onPointerLeave(event) {
        if (!this._myIsActive) return;
        if (this._myPointerID != event.pointerId) return;

        this.reset();
    }

    _onThumbstickElementEnter(event) {
        this._myThumbstickIcon.onMouseEnter(event);
    }

    _onThumbstickElementLeave(event) {
        this._myThumbstickIcon.onMouseLeave(event);
    }

    _onPointerMove(event) {
        if (!this._myIsActive) return;
        if (!this._myIsPressed) return;

        if (event.pointerId != this._myPointerID) return;

        let mouseX = event.clientX;
        let mouseY = event.clientY;

        let containerRect = this._myThumbstickContainer.getBoundingClientRect();
        let maxDistanceFromCenter = (containerRect.width / 2) * this._myParams.myMaxDistanceFromCenterMultiplier;

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
        // setup variables used for the sizes and the like

        let thumbstickSize = this._myVirtualGamepadParams.myThumbstickSize * this._myVirtualGamepadParams.myInterfaceScale;

        let marginBottom = this._myVirtualGamepadParams.myMarginBottom * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;
        let marginLeft = this._myVirtualGamepadParams.myMarginLeft * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;
        let marginRight = this._myVirtualGamepadParams.myMarginRight * this._myVirtualGamepadParams.myInterfaceScale * this._myVirtualGamepadParams.myMarginScale;

        let minSizeMultiplier = Math.max(1, this._myVirtualGamepadParams.myMinSizeMultiplier / this._myVirtualGamepadParams.myInterfaceScale);

        // actual thumbstick creation

        this._myThumbstickContainer = document.createElement("div");
        this._myThumbstickContainer.style.position = "absolute";
        this._myThumbstickContainer.style.width = this._createSizeValue(thumbstickSize, minSizeMultiplier);
        this._myThumbstickContainer.style.height = this._createSizeValue(thumbstickSize, minSizeMultiplier);
        this._myThumbstickContainer.style.bottom = this._createSizeValue(marginBottom, minSizeMultiplier);

        if (virtualThumbstickHandedness == PP.Handedness.LEFT) {
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

        let thumbstickBackground = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        thumbstickBackground.setAttributeNS(null, 'cx', "50%");
        thumbstickBackground.setAttributeNS(null, 'cy', "50%");
        thumbstickBackground.setAttributeNS(null, 'r', "48%");
        thumbstickBackground.style.fill = this._myParams.myBackgroundColor;
        thumbstickContainerSVG.appendChild(thumbstickBackground);

        this._myThumbstickElementHoverCheck = document.createElement("div");
        this._myThumbstickElementHoverCheck.style.position = "absolute";
        this._myThumbstickElementHoverCheck.style.width = "34%";
        this._myThumbstickElementHoverCheck.style.height = "34%";
        this._myThumbstickElementHoverCheck.style.top = "33%";
        this._myThumbstickElementHoverCheck.style.left = "33%";
        this._myThumbstickContainer.appendChild(this._myThumbstickElementHoverCheck);

        this._myThumbstickElement = document.createElement("div");
        this._myThumbstickElement.style.position = "absolute";
        this._myThumbstickElement.style.width = "34%";
        this._myThumbstickElement.style.height = "34%";
        this._myThumbstickElement.style.top = "33%";
        this._myThumbstickElement.style.left = "33%";
        this._myThumbstickContainer.appendChild(this._myThumbstickElement);

        this._myThumbstickIcon = new PP.VirtualGamepadIcon(this._myThumbstickElement, this._myParams.myIconParams, minSizeMultiplier, this._myVirtualGamepadParams.myScale);
    }

    _createSizeValue(value, minSizeMultiplier) {
        return "min(" + value.toFixed(3) + "vmax," + (value * minSizeMultiplier).toFixed(3) + "vw)";
    }
};
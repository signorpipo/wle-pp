PP.VirtualGamepadIconType = {
    NONE: 0,
    LABEL: 1,
    IMAGE: 2,
    DOT: 3,
    CIRCLE: 4,
    SQUARE: 5,
    RING: 6,
    FRAME: 7,
};

PP.VirtualGamepadIconParams = class VirtualGamepadIconParams {
    constructor() {
        this.myBackgroundColor = "";
        this.myBackgroundPressedColor = "";
        this.myIconColor = "";
        this.myIconPressedColor = "";

        this.myIconType = PP.VirtualGamepadIconType.NONE;

        this.myOverallHoveredBrightness = 1;

        // if icon type is label

        this.myLabel = "";
        this.myLabelFontSize = 0;
        this.myLabelFontFamily = "";
        this.myLabelFontWeight = "";

        // if icon type is image

        this.myImageURL = "";
        this.myImagePressedBrightness = 1;
    }
};

PP.VirtualGamepadIcon = class VirtualGamepadIcon {
    constructor(iconElementParent, iconParams, minSizeMultiplier, scale) {
        this._myParams = iconParams;

        this._myIconContainerElement = null;
        this._myBackgroundElement = null;
        this._myIconElement = null;

        this._myPressed = false;

        this._myIsMouseHover = false;
        this._myIsMouseHoverActive = true;

        this._build(iconElementParent, minSizeMultiplier, scale);
    }

    update(dt) {
        if (this._myPressed || !this._myIsMouseHover || !this._myIsMouseHoverActive) {
            this._myIconContainerElement.style.filter = "none";
        } else {
            this._myIconContainerElement.style.filter = "brightness(" + this._myParams.myOverallHoveredBrightness + ")";
        }
    }

    reset() {
        this.setPressed(false);
        this._myIsMouseHover = false;
        this._myIconContainerElement.style.filter = "none";
    }

    setPressed(pressed) {
        if (this._myPressed != pressed) {
            this._myPressed = pressed;

            if (this._myPressed) {
                this._myBackgroundElement.style.fill = this._myParams.myBackgroundPressedColor;
                if (this._myIconElement != null) {
                    if (this._myIconElement.style.strokeWidth.length > 0) {
                        this._myIconElement.style.stroke = this._myParams.myIconPressedColor;
                    } else {
                        this._myIconElement.style.fill = this._myParams.myIconPressedColor;
                    }

                    if (this._myParams.myIconType == PP.VirtualGamepadIconType.IMAGE) {
                        this._myIconElement.style.filter = "brightness(" + this._myParams.myImagePressedBrightness + ")";
                    }
                }
            } else {
                this._myBackgroundElement.style.fill = this._myParams.myBackgroundColor;
                if (this._myIconElement != null) {
                    if (this._myIconElement.style.strokeWidth.length > 0) {
                        this._myIconElement.style.stroke = this._myParams.myIconColor;
                    } else {
                        this._myIconElement.style.fill = this._myParams.myIconColor;
                    }

                    if (this._myParams.myIconType == PP.VirtualGamepadIconType.IMAGE) {
                        this._myIconElement.style.filter = "none";
                    }
                }
            }
        }
    }

    onMouseEnter() {
        this._myIsMouseHover = true;
    }

    onMouseLeave() {
        this._myIsMouseHover = false;
    }

    setMouseHoverActive(hoverActive) {
        this._myIsMouseHoverActive = hoverActive;
    }

    _build(iconElementParent, minSizeMultiplier, scale) {
        this._myIconContainerElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this._myIconContainerElement.style.position = "absolute";
        this._myIconContainerElement.style.width = "100%";
        this._myIconContainerElement.style.height = "100%";
        iconElementParent.appendChild(this._myIconContainerElement);

        this._myBackgroundElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this._myBackgroundElement.setAttributeNS(null, 'cx', "50%");
        this._myBackgroundElement.setAttributeNS(null, 'cy', "50%");
        this._myBackgroundElement.setAttributeNS(null, 'r', "50%");
        this._myBackgroundElement.style.fill = this._myParams.myBackgroundColor;
        this._myIconContainerElement.appendChild(this._myBackgroundElement);

        switch (this._myParams.myIconType) {
            case PP.VirtualGamepadIconType.NONE:
                break;
            case PP.VirtualGamepadIconType.LABEL:
                this._myIconElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                this._myIconElement.setAttributeNS(null, 'x', "50%");
                this._myIconElement.setAttributeNS(null, 'y', "50%");
                this._myIconElement.style.textAlign = "center";
                this._myIconElement.style.textAnchor = "middle";
                this._myIconElement.style.dominantBaseline = "central";
                this._myIconElement.style.alignmentBaseline = "central";
                this._myIconElement.style.fontFamily = this._myParams.myLabelFontFamily;
                this._myIconElement.style.fontWeight = this._myParams.myLabelFontWeight;
                this._myIconElement.style.fontSize = this._createSizeValue(this._myParams.myLabelFontSize * scale, minSizeMultiplier);
                this._myIconElement.style.fill = this._myParams.myIconColor;
                this._myIconElement.textContent = this._myParams.myLabel;
                this._myIconContainerElement.appendChild(this._myIconElement);
                break;
            case PP.VirtualGamepadIconType.IMAGE:
                this._myIconElement = document.createElementNS("http://www.w3.org/2000/svg", 'image');
                this._myIconElement.setAttributeNS(null, 'x', "0%");
                this._myIconElement.setAttributeNS(null, 'y', "0%");
                this._myIconElement.setAttribute("href", this._myParams.myImageURL);
                this._myIconElement.style.width = "100%";
                this._myIconElement.style.height = "100%";
                this._myIconElement.style.filter = "none";
                this._myIconContainerElement.appendChild(this._myIconElement);
                break;
            case PP.VirtualGamepadIconType.DOT:
                this._myIconElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                this._myIconElement.setAttributeNS(null, 'cx', "50%");
                this._myIconElement.setAttributeNS(null, 'cy', "50%");
                this._myIconElement.setAttributeNS(null, 'r', "17.5%");
                this._myIconElement.style.fill = this._myParams.myIconColor;
                this._myIconContainerElement.appendChild(this._myIconElement);
                break;
            case PP.VirtualGamepadIconType.CIRCLE:
                this._myIconElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                this._myIconElement.setAttributeNS(null, 'cx', "50%");
                this._myIconElement.setAttributeNS(null, 'cy', "50%");
                this._myIconElement.setAttributeNS(null, 'r', "24%");
                this._myIconElement.style.fill = this._myParams.myIconColor;
                this._myIconContainerElement.appendChild(this._myIconElement);
                break;
            case PP.VirtualGamepadIconType.SQUARE:
                this._myIconElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                this._myIconElement.setAttributeNS(null, 'x', "28%");
                this._myIconElement.setAttributeNS(null, 'y', "28%");
                this._myIconElement.setAttributeNS(null, 'rx', "10%");
                this._myIconElement.setAttributeNS(null, 'ry', "10%");
                this._myIconElement.setAttributeNS(null, 'width', "44%");
                this._myIconElement.setAttributeNS(null, 'height', "44%");
                this._myIconElement.style.fill = this._myParams.myIconColor;
                this._myIconElement.style.transformOrigin = "center";
                this._myIconContainerElement.appendChild(this._myIconElement);
                break;
            case PP.VirtualGamepadIconType.RING:
                this._myIconElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                this._myIconElement.setAttributeNS(null, 'cx', "50%");
                this._myIconElement.setAttributeNS(null, 'cy', "50%");
                this._myIconElement.setAttributeNS(null, 'r', "20%");
                this._myIconElement.style.fill = "#00000000";
                this._myIconElement.style.stroke = this._myParams.myIconColor;
                this._myIconElement.style.strokeWidth = "10%";
                this._myIconContainerElement.appendChild(this._myIconElement);
                break;
            case PP.VirtualGamepadIconType.FRAME:
                this._myIconElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                this._myIconElement.setAttributeNS(null, 'x', "31.5%");
                this._myIconElement.setAttributeNS(null, 'y', "31.5%");
                this._myIconElement.setAttributeNS(null, 'rx', "10%");
                this._myIconElement.setAttributeNS(null, 'ry', "10%");
                this._myIconElement.setAttributeNS(null, 'width', "37%");
                this._myIconElement.setAttributeNS(null, 'height', "37%");
                this._myIconElement.style.fill = "#00000000";
                this._myIconElement.style.stroke = this._myParams.myIconColor;
                this._myIconElement.style.strokeWidth = "10%";
                this._myIconElement.style.transformOrigin = "center";
                this._myIconContainerElement.appendChild(this._myIconElement);
                break;
        }
    }

    _createSizeValue(value, minSizeMultiplier) {
        return "min(" + value.toFixed(3) + "vmax," + (value * minSizeMultiplier).toFixed(3) + "vw)";
    }

    _invertColors() {
        if (this._myIconElement.style.strokeWidth.length > 0) {
            this._myBackgroundElement.style.fill = this._myParams.myIconColor;
            this._myIconElement.style.fill = this._myParams.myIconColor;
            this._myIconElement.style.stroke = this._myParams.myBackgroundColor;
        } else {
            this._myBackgroundElement.style.fill = this._myParams.myIconColor;
            this._myIconElement.style.fill = this._myParams.myBackgroundColor;
        }
    }
}
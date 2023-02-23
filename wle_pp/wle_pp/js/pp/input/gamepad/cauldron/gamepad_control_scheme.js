WL.registerComponent('pp-gamepad-control-scheme', {
    _myShowOnStart: { type: WL.Type.Bool, default: true },

    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },

    _mySelectText: { type: WL.Type.String, default: "" },
    _mySqueezeText: { type: WL.Type.String, default: "" },
    _myThumbstickText: { type: WL.Type.String, default: "" },
    _myBottomButtonText: { type: WL.Type.String, default: "" },
    _myTopButtonText: { type: WL.Type.String, default: "" },

    _mySelect: { type: WL.Type.Object, default: null },
    _mySqueeze: { type: WL.Type.Object, default: null },
    _myThumbstick: { type: WL.Type.Object, default: null },
    _myBottomButton: { type: WL.Type.Object, default: null },
    _myTopButton: { type: WL.Type.Object, default: null },

    _myTextScaleMultiplier: { type: WL.Type.Float, default: 1 },
    _myTextOffsetMultiplier: { type: WL.Type.Float, default: 1 },
    _myLineLengthMultiplier: { type: WL.Type.Float, default: 1 },
    _myLineThicknessMultiplier: { type: WL.Type.Float, default: 1 },
    _myDistanceFromButtonsMultiplier: { type: WL.Type.Float, default: 1 },

    _myTextMaterial: { type: WL.Type.Material },
    _myLineMaterial: { type: WL.Type.Material }
}, {
    init: function () {
    },
    start: function () {
        this._myTextMaterialFinal = (this._myTextMaterial != null) ? this._myTextMaterial : PP.myDefaultResources.myMaterials.myText.clone();
        this._myLineMaterialFinal = (this._myLineMaterial != null) ? this._myLineMaterial : PP.myDefaultResources.myMaterials.myFlatOpaque.clone();

        this._myHandednessType = PP.InputUtils.getHandednessByIndex(this._myHandedness);
        this._myControlSchemeDirection = (this._myHandednessType == PP.Handedness.LEFT) ? 1 : -1;

        this._myVisible = false;
        this._mySetVisibleNextUpdate = false;

        this._createControlScheme();
        this.setVisible(this._myShowOnStart);

        this._myVisibleBackup = this._myVisible;
    },
    update: function (dt) {
        if (this._mySetVisibleNextUpdate) {
            this._mySetVisibleNextUpdate = false;
            this.setVisible(false);
            this.setVisible(this._myVisibleBackup);
        }
    },
    onActivate() {
        this._mySetVisibleNextUpdate = true;
    },
    onDeactivate() {
        this._myVisibleBackup = this._myVisible;
        this.setVisible(false);
    },
    isVisible() {
        return this._myVisible;
    },
    setVisible(visible) {
        this._myVisible = visible;

        if (this._myRootObject != null) {
            this._myRootObject.pp_setActive(this._myVisible);

            if (this._myVisible) {
                this._hideEmptySchemes();
            }
        }
    },
    setSelectText(text) {
        this._mySelectText = text;
        this._mySelectTextComponent.text = this._mySelectText;
        this.setVisible(this._myVisible);
    },
    setSqueezeText(text) {
        this._mySqueezeText = text;
        this._mySqueezeTextComponent.text = this._mySqueezeText;
        this.setVisible(this._myVisible);
    },
    setThumbstickText(text) {
        this._myThumbstickText = text;
        this._myThumbstickTextComponent.text = this._myThumbstickText;
        this.setVisible(this._myVisible);
    },
    setBottomButtonText(text) {
        this._myBottomButtonText = text;
        this._myBottomButtonTextComponent.text = this._myBottomButtonText;
        this.setVisible(this._myVisible);
    },
    setTopButtonText(text) {
        this._myTopButtonText = text;
        this._myTopButtonTextComponent.text = this._myTopButtonText;
        this.setVisible(this._myVisible);
    },
    _createControlScheme() {
        this._myRootObject = this.object.pp_addObject();

        let distanceFromButton = 0.02 * this._myDistanceFromButtonsMultiplier;
        let lineLength = 0.0935 * this._myLineLengthMultiplier;

        let referenceObject = this._myThumbstick;

        this._mySelectObject = this._myRootObject.pp_addObject();
        this._mySelectTextComponent = this._addScheme(this._mySelect, referenceObject,
            PP.vec3_create(0, 0, distanceFromButton),
            PP.vec3_create(lineLength * this._myControlSchemeDirection, 0, 0),
            this._mySelectObject);
        this._mySelectTextComponent.text = this._mySelectText;

        this._mySqueezeObject = this._myRootObject.pp_addObject();
        this._mySqueezeTextComponent = this._addScheme(this._mySqueeze, referenceObject,
            PP.vec3_create(distanceFromButton * this._myControlSchemeDirection, 0, 0),
            PP.vec3_create(lineLength * this._myControlSchemeDirection, 0, 0),
            this._mySqueezeObject);
        this._mySqueezeTextComponent.text = this._mySqueezeText;

        this._myThumbstickObject = this._myRootObject.pp_addObject();
        this._myThumbstickTextComponent = this._addScheme(this._myThumbstick, referenceObject,
            PP.vec3_create(0, distanceFromButton, 0),
            PP.vec3_create(-lineLength * this._myControlSchemeDirection, 0, 0),
            this._myThumbstickObject);
        this._myThumbstickTextComponent.text = this._myThumbstickText;

        let thumbstickPositionLocal = this._myThumbstick.pp_getPositionLocal();
        let thumbstickUpLocal = this._myThumbstick.pp_getUpLocal();

        {
            let bottomButtonPositionLocal = this._myBottomButton.pp_getPositionLocal();
            let difference = bottomButtonPositionLocal.vec3_sub(thumbstickPositionLocal);
            let differenceOnUp = difference.vec3_valueAlongAxis(thumbstickUpLocal);

            this._myBottomButtonObject = this._myRootObject.pp_addObject();
            this._myBottomButtonTextComponent = this._addScheme(this._myBottomButton, referenceObject,
                PP.vec3_create(0, distanceFromButton - differenceOnUp, 0),
                PP.vec3_create(0, 0, -lineLength),
                this._myBottomButtonObject);
            this._myBottomButtonTextComponent.text = this._myBottomButtonText;
        }

        {
            let topButtonPositionLocal = this._myTopButton.pp_getPositionLocal();
            let difference = topButtonPositionLocal.vec3_sub(thumbstickPositionLocal);
            let differenceOnUp = difference.vec3_valueAlongAxis(thumbstickUpLocal);

            this._myTopButtonObject = this._myRootObject.pp_addObject();
            this._myTopButtonTextComponent = this._addScheme(this._myTopButton, referenceObject,
                PP.vec3_create(0, distanceFromButton - differenceOnUp, 0),
                PP.vec3_create(-lineLength * this._myControlSchemeDirection, 0, 0).vec3_rotateAxis(-45 * this._myControlSchemeDirection, PP.vec3_create(0, 1, 0)),
                this._myTopButtonObject);
            this._myTopButtonTextComponent.text = this._myTopButtonText;
        }
    },
    _addScheme(buttonObject, referenceObject, startOffset, endOffset, parentObject) {
        let buttonPosition = buttonObject.pp_getPositionLocal();
        let referenceForward = referenceObject.pp_getForwardLocal();
        let referenceRight = referenceObject.pp_getRightLocal();
        let referenceUp = referenceObject.pp_getUpLocal();

        let lineStart = buttonPosition.vec3_add(referenceRight.vec3_scale(startOffset[0]));
        lineStart.vec3_add(referenceUp.vec3_scale(startOffset[1]), lineStart);
        lineStart.vec3_add(referenceForward.vec3_scale(startOffset[2]), lineStart);

        let lineEnd = lineStart.vec3_add(referenceRight.vec3_scale(endOffset[0]));
        lineEnd.vec3_add(referenceUp.vec3_scale(endOffset[1]), lineEnd);
        lineEnd.vec3_add(referenceForward.vec3_scale(endOffset[2]), lineEnd);

        let textOffset = 0.01 * this._myTextOffsetMultiplier;
        let textPosition = lineEnd.vec3_add(referenceForward.vec3_scale(-textOffset));

        this._addLine(lineStart, lineEnd, parentObject);
        let textComponent = this._addText(textPosition, referenceForward, referenceUp, parentObject);

        return textComponent;
    },
    _addLine(start, end, parentObject) {
        let lineDirection = end.vec3_sub(start);
        let length = lineDirection.vec3_length();
        lineDirection.vec3_normalize(lineDirection);

        lineRootObject = parentObject.pp_addObject();
        lineObject = lineRootObject.pp_addObject();

        let lineMesh = lineObject.addComponent('mesh');
        lineMesh.mesh = PP.myDefaultResources.myMeshes.myCylinder;
        lineMesh.material = this._myLineMaterialFinal;

        lineRootObject.pp_setPositionLocal(start);

        let thickness = 0.001 * this._myLineThicknessMultiplier;
        lineObject.pp_scaleObject(PP.vec3_create(thickness / 2, length / 2, thickness / 2));

        lineObject.pp_setUpLocal(lineDirection);
        lineObject.pp_translateObject(PP.vec3_create(0, length / 2, 0));
    },
    _addText(position, forward, up, parentObject) {
        let textObject = parentObject.pp_addObject();
        textObject.pp_setPositionLocal(position);
        textObject.pp_lookToLocal(up, forward);
        textObject.pp_scaleObject(0.0935 * this._myTextScaleMultiplier);

        let textComponent = textObject.pp_addComponent("text");
        textComponent.alignment = WL.Alignment.Center;
        textComponent.justification = WL.Justification.Top;
        textComponent.material = this._myTextMaterialFinal;

        return textComponent;
    },
    _hideEmptySchemes() {
        if (this._mySelectText.length == 0) {
            this._mySelectObject.pp_setActive(false);
        }
        if (this._mySqueezeText.length == 0) {
            this._mySqueezeObject.pp_setActive(false);
        }
        if (this._myThumbstickText.length == 0) {
            this._myThumbstickObject.pp_setActive(false);
        }
        if (this._myBottomButtonText.length == 0) {
            this._myBottomButtonObject.pp_setActive(false);
        }
        if (this._myTopButtonText.length == 0) {
            this._myTopButtonObject.pp_setActive(false);
        }
    }
});
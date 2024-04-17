import { Alignment, Component, Justification, MeshComponent, Property, TextComponent } from "@wonderlandengine/api";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { Handedness } from "../../cauldron/input_types.js";
import { InputUtils } from "../../cauldron/input_utils.js";

export class GamepadControlSchemeComponent extends Component {
    static TypeName = "pp-gamepad-control-scheme";
    static Properties = {
        _myShowOnStart: Property.bool(true),

        _myHandedness: Property.enum(["Left", "Right"], "Left"),

        _mySelectText: Property.string(""),
        _mySqueezeText: Property.string(""),
        _myThumbstickText: Property.string(""),
        _myBottomButtonText: Property.string(""),
        _myTopButtonText: Property.string(""),

        _mySelect: Property.object(null),
        _mySqueeze: Property.object(null),
        _myThumbstick: Property.object(null),
        _myBottomButton: Property.object(null),
        _myTopButton: Property.object(null),

        _myTextScaleMultiplier: Property.float(1),
        _myTextOffsetMultiplier: Property.float(1),
        _myLineLengthMultiplier: Property.float(1),
        _myLineThicknessMultiplier: Property.float(1),
        _myDistanceFromButtonsMultiplier: Property.float(1),

        _myTextMaterial: Property.material(),
        _myLineMaterial: Property.material()
    };

    start() {
        this._myTextMaterialFinal = (this._myTextMaterial != null) ? this._myTextMaterial : Globals.getDefaultMaterials(this.engine).myText.clone();
        this._myLineMaterialFinal = (this._myLineMaterial != null) ? this._myLineMaterial : Globals.getDefaultMaterials(this.engine).myFlatOpaque.clone();

        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);
        this._myControlSchemeDirection = (this._myHandednessType == Handedness.LEFT) ? 1 : -1;

        this._myVisible = false;
        this._mySetVisibleNextUpdate = false;

        this._createControlScheme();
        this.setVisible(this._myShowOnStart);

        this._myVisibleBackup = this._myVisible;
    }

    update(dt) {
        if (this._mySetVisibleNextUpdate) {
            this._mySetVisibleNextUpdate = false;
            this.setVisible(false);
            this.setVisible(this._myVisibleBackup);
        }
    }

    onActivate() {
        this._mySetVisibleNextUpdate = true;
    }

    onDeactivate() {
        if (this._myVisible != null) {
            this._myVisibleBackup = this._myVisible;
            this.setVisible(false);
        }
    }

    isVisible() {
        return this._myVisible;
    }

    setVisible(visible) {
        this._myVisible = visible;

        if (this._myParentObject != null) {
            this._myParentObject.pp_setActive(this._myVisible);

            if (this._myVisible) {
                this._hideEmptySchemes();
            }
        }
    }

    setSelectText(text) {
        this._mySelectText = text;
        this._mySelectTextComponent.text = this._mySelectText;
        this.setVisible(this._myVisible);
    }

    setSqueezeText(text) {
        this._mySqueezeText = text;
        this._mySqueezeTextComponent.text = this._mySqueezeText;
        this.setVisible(this._myVisible);
    }

    setThumbstickText(text) {
        this._myThumbstickText = text;
        this._myThumbstickTextComponent.text = this._myThumbstickText;
        this.setVisible(this._myVisible);
    }

    setBottomButtonText(text) {
        this._myBottomButtonText = text;
        this._myBottomButtonTextComponent.text = this._myBottomButtonText;
        this.setVisible(this._myVisible);
    }

    setTopButtonText(text) {
        this._myTopButtonText = text;
        this._myTopButtonTextComponent.text = this._myTopButtonText;
        this.setVisible(this._myVisible);
    }

    _createControlScheme() {
        this._myParentObject = this.object.pp_addObject();

        let distanceFromButton = 0.02 * this._myDistanceFromButtonsMultiplier;
        let lineLength = 0.0935 * this._myLineLengthMultiplier;

        let referenceObject = this._myThumbstick;

        this._mySelectObject = this._myParentObject.pp_addObject();
        this._mySelectTextComponent = this._addScheme(this._mySelect, referenceObject,
            vec3_create(0, 0, distanceFromButton),
            vec3_create(lineLength * this._myControlSchemeDirection, 0, 0),
            this._mySelectObject);
        this._mySelectTextComponent.text = this._mySelectText;

        this._mySqueezeObject = this._myParentObject.pp_addObject();
        this._mySqueezeTextComponent = this._addScheme(this._mySqueeze, referenceObject,
            vec3_create(distanceFromButton * this._myControlSchemeDirection, 0, 0),
            vec3_create(lineLength * this._myControlSchemeDirection, 0, 0),
            this._mySqueezeObject);
        this._mySqueezeTextComponent.text = this._mySqueezeText;

        this._myThumbstickObject = this._myParentObject.pp_addObject();
        this._myThumbstickTextComponent = this._addScheme(this._myThumbstick, referenceObject,
            vec3_create(0, distanceFromButton, 0),
            vec3_create(-lineLength * this._myControlSchemeDirection, 0, 0),
            this._myThumbstickObject);
        this._myThumbstickTextComponent.text = this._myThumbstickText;

        let thumbstickPositionLocal = this._myThumbstick.pp_getPositionLocal();
        let thumbstickUpLocal = this._myThumbstick.pp_getUpLocal();

        {
            let bottomButtonPositionLocal = this._myBottomButton.pp_getPositionLocal();
            let difference = bottomButtonPositionLocal.vec3_sub(thumbstickPositionLocal);
            let differenceOnUp = difference.vec3_valueAlongAxis(thumbstickUpLocal);

            this._myBottomButtonObject = this._myParentObject.pp_addObject();
            this._myBottomButtonTextComponent = this._addScheme(this._myBottomButton, referenceObject,
                vec3_create(0, distanceFromButton - differenceOnUp, 0),
                vec3_create(0, 0, -lineLength),
                this._myBottomButtonObject);
            this._myBottomButtonTextComponent.text = this._myBottomButtonText;
        }

        {
            let topButtonPositionLocal = this._myTopButton.pp_getPositionLocal();
            let difference = topButtonPositionLocal.vec3_sub(thumbstickPositionLocal);
            let differenceOnUp = difference.vec3_valueAlongAxis(thumbstickUpLocal);

            this._myTopButtonObject = this._myParentObject.pp_addObject();
            this._myTopButtonTextComponent = this._addScheme(this._myTopButton, referenceObject,
                vec3_create(0, distanceFromButton - differenceOnUp, 0),
                vec3_create(-lineLength * this._myControlSchemeDirection, 0, 0).vec3_rotateAxis(-45 * this._myControlSchemeDirection, vec3_create(0, 1, 0)),
                this._myTopButtonObject);
            this._myTopButtonTextComponent.text = this._myTopButtonText;
        }
    }

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
    }

    _addLine(start, end, parentObject) {
        let lineDirection = end.vec3_sub(start);
        let length = lineDirection.vec3_length();
        lineDirection.vec3_normalize(lineDirection);

        let lineParentObject = parentObject.pp_addObject();
        let lineObject = lineParentObject.pp_addObject();

        let lineMesh = lineObject.pp_addComponent(MeshComponent);
        lineMesh.mesh = Globals.getDefaultMeshes(this.engine).myCylinder;
        lineMesh.material = this._myLineMaterialFinal;

        lineParentObject.pp_setPositionLocal(start);

        let thickness = 0.001 * this._myLineThicknessMultiplier;
        lineObject.pp_scaleObject(vec3_create(thickness / 2, length / 2, thickness / 2));

        lineObject.pp_setUpLocal(lineDirection);
        lineObject.pp_translateObject(vec3_create(0, length / 2, 0));
    }

    _addText(position, forward, up, parentObject) {
        let textObject = parentObject.pp_addObject();
        textObject.pp_setPositionLocal(position);
        textObject.pp_lookToLocal(up, forward);
        textObject.pp_scaleObject(0.0935 * this._myTextScaleMultiplier);

        let textComponent = textObject.pp_addComponent(TextComponent);
        textComponent.alignment = Alignment.Center;
        textComponent.justification = Justification.Top;
        textComponent.material = this._myTextMaterialFinal;

        return textComponent;
    }

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
}
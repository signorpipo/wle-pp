import { CollisionComponent, MeshComponent, TextComponent } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { EasyTuneBaseWidgetUI } from "../base/easy_tune_base_widget_ui.js";

export class EasyTuneTransformWidgetUI extends EasyTuneBaseWidgetUI {

    constructor(engine) {
        super(engine);
    }

    setAdditionalButtonsVisible(visible) {
        this._myAdditionalButtonsVisible = visible;

        for (let i = 0; i < 3; i++) {
            this.myPositionIncreaseButtonPanels[i].pp_setActive(this._myAdditionalButtonsVisible);
            this.myPositionDecreaseButtonPanels[i].pp_setActive(this._myAdditionalButtonsVisible);
        }
        this.myPositionStepIncreaseButtonPanel.pp_setActive(this._myAdditionalButtonsVisible);
        this.myPositionStepDecreaseButtonPanel.pp_setActive(this._myAdditionalButtonsVisible);

        for (let i = 0; i < 3; i++) {
            this.myRotationIncreaseButtonPanels[i].pp_setActive(this._myAdditionalButtonsVisible);
            this.myRotationDecreaseButtonPanels[i].pp_setActive(this._myAdditionalButtonsVisible);
        }
        this.myRotationStepIncreaseButtonPanel.pp_setActive(this._myAdditionalButtonsVisible);
        this.myRotationStepDecreaseButtonPanel.pp_setActive(this._myAdditionalButtonsVisible);

        for (let i = 0; i < 3; i++) {
            this.myScaleIncreaseButtonPanels[i].pp_setActive(this._myAdditionalButtonsVisible);
            this.myScaleDecreaseButtonPanels[i].pp_setActive(this._myAdditionalButtonsVisible);
        }
        this.myScaleStepIncreaseButtonPanel.pp_setActive(this._myAdditionalButtonsVisible);
        this.myScaleStepDecreaseButtonPanel.pp_setActive(this._myAdditionalButtonsVisible);
    }

    _buildHook() {
        this._myAdditionalButtonsVisible = true;
    }

    _createSkeletonHook() {
        // Position

        this.myPositionPanel = this.myDisplayPanel.pp_addChild();
        this.myPositionLabelText = this.myPositionPanel.pp_addChild();
        this.myPositionLabelCursorTarget = this.myPositionPanel.pp_addChild();

        this.myPositionPanels = [];
        this.myPositionTexts = [];
        this.myPositionCursorTargets = [];

        this.myPositionIncreaseButtonPanels = [];
        this.myPositionIncreaseButtonBackgrounds = [];
        this.myPositionIncreaseButtonTexts = [];
        this.myPositionIncreaseButtonCursorTargets = [];

        this.myPositionDecreaseButtonPanels = [];
        this.myPositionDecreaseButtonBackgrounds = [];
        this.myPositionDecreaseButtonTexts = [];
        this.myPositionDecreaseButtonCursorTargets = [];

        for (let i = 0; i < 3; i++) {
            this.myPositionPanels[i] = this.myPositionPanel.pp_addChild();
            this.myPositionTexts[i] = this.myPositionPanels[i].pp_addChild();
            this.myPositionCursorTargets[i] = this.myPositionPanels[i].pp_addChild();

            this.myPositionIncreaseButtonPanels[i] = this.myPositionPanels[i].pp_addChild();
            this.myPositionIncreaseButtonBackgrounds[i] = this.myPositionIncreaseButtonPanels[i].pp_addChild();
            this.myPositionIncreaseButtonTexts[i] = this.myPositionIncreaseButtonPanels[i].pp_addChild();
            this.myPositionIncreaseButtonCursorTargets[i] = this.myPositionIncreaseButtonPanels[i].pp_addChild();

            this.myPositionDecreaseButtonPanels[i] = this.myPositionPanels[i].pp_addChild();
            this.myPositionDecreaseButtonBackgrounds[i] = this.myPositionDecreaseButtonPanels[i].pp_addChild();
            this.myPositionDecreaseButtonTexts[i] = this.myPositionDecreaseButtonPanels[i].pp_addChild();
            this.myPositionDecreaseButtonCursorTargets[i] = this.myPositionDecreaseButtonPanels[i].pp_addChild();
        }

        // Rotation

        this.myRotationPanel = this.myDisplayPanel.pp_addChild();
        this.myRotationLabelText = this.myRotationPanel.pp_addChild();
        this.myRotationLabelCursorTarget = this.myRotationPanel.pp_addChild();

        this.myRotationPanels = [];
        this.myRotationTexts = [];
        this.myRotationCursorTargets = [];

        this.myRotationIncreaseButtonPanels = [];
        this.myRotationIncreaseButtonBackgrounds = [];
        this.myRotationIncreaseButtonTexts = [];
        this.myRotationIncreaseButtonCursorTargets = [];

        this.myRotationDecreaseButtonPanels = [];
        this.myRotationDecreaseButtonBackgrounds = [];
        this.myRotationDecreaseButtonTexts = [];
        this.myRotationDecreaseButtonCursorTargets = [];

        for (let i = 0; i < 3; i++) {
            this.myRotationPanels[i] = this.myRotationPanel.pp_addChild();
            this.myRotationTexts[i] = this.myRotationPanels[i].pp_addChild();
            this.myRotationCursorTargets[i] = this.myRotationPanels[i].pp_addChild();

            this.myRotationIncreaseButtonPanels[i] = this.myRotationPanels[i].pp_addChild();
            this.myRotationIncreaseButtonBackgrounds[i] = this.myRotationIncreaseButtonPanels[i].pp_addChild();
            this.myRotationIncreaseButtonTexts[i] = this.myRotationIncreaseButtonPanels[i].pp_addChild();
            this.myRotationIncreaseButtonCursorTargets[i] = this.myRotationIncreaseButtonPanels[i].pp_addChild();

            this.myRotationDecreaseButtonPanels[i] = this.myRotationPanels[i].pp_addChild();
            this.myRotationDecreaseButtonBackgrounds[i] = this.myRotationDecreaseButtonPanels[i].pp_addChild();
            this.myRotationDecreaseButtonTexts[i] = this.myRotationDecreaseButtonPanels[i].pp_addChild();
            this.myRotationDecreaseButtonCursorTargets[i] = this.myRotationDecreaseButtonPanels[i].pp_addChild();
        }

        // Scale

        this.myScalePanel = this.myDisplayPanel.pp_addChild();
        this.myScaleLabelText = this.myScalePanel.pp_addChild();
        this.myScaleLabelCursorTarget = this.myScalePanel.pp_addChild();

        this.myScalePanels = [];
        this.myScaleTexts = [];
        this.myScaleCursorTargets = [];

        this.myScaleIncreaseButtonPanels = [];
        this.myScaleIncreaseButtonBackgrounds = [];
        this.myScaleIncreaseButtonTexts = [];
        this.myScaleIncreaseButtonCursorTargets = [];

        this.myScaleDecreaseButtonPanels = [];
        this.myScaleDecreaseButtonBackgrounds = [];
        this.myScaleDecreaseButtonTexts = [];
        this.myScaleDecreaseButtonCursorTargets = [];

        for (let i = 0; i < 3; i++) {
            this.myScalePanels[i] = this.myScalePanel.pp_addChild();
            this.myScaleTexts[i] = this.myScalePanels[i].pp_addChild();
            this.myScaleCursorTargets[i] = this.myScalePanels[i].pp_addChild();

            this.myScaleIncreaseButtonPanels[i] = this.myScalePanels[i].pp_addChild();
            this.myScaleIncreaseButtonBackgrounds[i] = this.myScaleIncreaseButtonPanels[i].pp_addChild();
            this.myScaleIncreaseButtonTexts[i] = this.myScaleIncreaseButtonPanels[i].pp_addChild();
            this.myScaleIncreaseButtonCursorTargets[i] = this.myScaleIncreaseButtonPanels[i].pp_addChild();

            this.myScaleDecreaseButtonPanels[i] = this.myScalePanels[i].pp_addChild();
            this.myScaleDecreaseButtonBackgrounds[i] = this.myScaleDecreaseButtonPanels[i].pp_addChild();
            this.myScaleDecreaseButtonTexts[i] = this.myScaleDecreaseButtonPanels[i].pp_addChild();
            this.myScaleDecreaseButtonCursorTargets[i] = this.myScaleDecreaseButtonPanels[i].pp_addChild();
        }

        // Steps

        // Position

        this.myPositionStepPanel = this.myPositionPanel.pp_addChild();
        this.myPositionStepText = this.myPositionStepPanel.pp_addChild();
        this.myPositionStepCursorTarget = this.myPositionStepPanel.pp_addChild();

        this.myPositionStepIncreaseButtonPanel = this.myPositionStepPanel.pp_addChild();
        this.myPositionStepIncreaseButtonBackground = this.myPositionStepIncreaseButtonPanel.pp_addChild();
        this.myPositionStepIncreaseButtonText = this.myPositionStepIncreaseButtonPanel.pp_addChild();
        this.myPositionStepIncreaseButtonCursorTarget = this.myPositionStepIncreaseButtonPanel.pp_addChild();

        this.myPositionStepDecreaseButtonPanel = this.myPositionStepPanel.pp_addChild();
        this.myPositionStepDecreaseButtonBackground = this.myPositionStepDecreaseButtonPanel.pp_addChild();
        this.myPositionStepDecreaseButtonText = this.myPositionStepDecreaseButtonPanel.pp_addChild();
        this.myPositionStepDecreaseButtonCursorTarget = this.myPositionStepDecreaseButtonPanel.pp_addChild();

        // Rotation

        this.myRotationStepPanel = this.myRotationPanel.pp_addChild();
        this.myRotationStepText = this.myRotationStepPanel.pp_addChild();
        this.myRotationStepCursorTarget = this.myRotationStepPanel.pp_addChild();

        this.myRotationStepIncreaseButtonPanel = this.myRotationStepPanel.pp_addChild();
        this.myRotationStepIncreaseButtonBackground = this.myRotationStepIncreaseButtonPanel.pp_addChild();
        this.myRotationStepIncreaseButtonText = this.myRotationStepIncreaseButtonPanel.pp_addChild();
        this.myRotationStepIncreaseButtonCursorTarget = this.myRotationStepIncreaseButtonPanel.pp_addChild();

        this.myRotationStepDecreaseButtonPanel = this.myRotationStepPanel.pp_addChild();
        this.myRotationStepDecreaseButtonBackground = this.myRotationStepDecreaseButtonPanel.pp_addChild();
        this.myRotationStepDecreaseButtonText = this.myRotationStepDecreaseButtonPanel.pp_addChild();
        this.myRotationStepDecreaseButtonCursorTarget = this.myRotationStepDecreaseButtonPanel.pp_addChild();

        // Scale

        this.myScaleStepPanel = this.myScalePanel.pp_addChild();
        this.myScaleStepText = this.myScaleStepPanel.pp_addChild();
        this.myScaleStepCursorTarget = this.myScaleStepPanel.pp_addChild();

        this.myScaleStepIncreaseButtonPanel = this.myScaleStepPanel.pp_addChild();
        this.myScaleStepIncreaseButtonBackground = this.myScaleStepIncreaseButtonPanel.pp_addChild();
        this.myScaleStepIncreaseButtonText = this.myScaleStepIncreaseButtonPanel.pp_addChild();
        this.myScaleStepIncreaseButtonCursorTarget = this.myScaleStepIncreaseButtonPanel.pp_addChild();

        this.myScaleStepDecreaseButtonPanel = this.myScaleStepPanel.pp_addChild();
        this.myScaleStepDecreaseButtonBackground = this.myScaleStepDecreaseButtonPanel.pp_addChild();
        this.myScaleStepDecreaseButtonText = this.myScaleStepDecreaseButtonPanel.pp_addChild();
        this.myScaleStepDecreaseButtonCursorTarget = this.myScaleStepDecreaseButtonPanel.pp_addChild();
    }

    _setTransformHook() {
        // Position

        this.myPositionPanel.pp_setPositionLocal(this._myConfig.myPositionPanelPosition);
        this.myPositionLabelText.pp_scaleObject(this._myConfig.myComponentLabelTextScale);
        this.myPositionLabelCursorTarget.pp_setPositionLocal(this._myConfig.myComponentLabelCursorTargetPosition);

        for (let i = 0; i < 3; i++) {
            this.myPositionPanels[i].pp_setPositionLocal(this._myConfig.myValuePanelsPositions[i]);
            this.myPositionTexts[i].pp_scaleObject(this._myConfig.myValueTextScale);
            this.myPositionCursorTargets[i].pp_setPositionLocal(this._myConfig.myValueCursorTargetPosition);

            this.myPositionIncreaseButtonPanels[i].pp_setPositionLocal(this._myConfig.myIncreaseButtonPosition);
            this.myPositionIncreaseButtonBackgrounds[i].pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
            this.myPositionIncreaseButtonTexts[i].pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
            this.myPositionIncreaseButtonTexts[i].pp_scaleObject(this._myConfig.mySideButtonTextScale);
            this.myPositionIncreaseButtonCursorTargets[i].pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

            this.myPositionDecreaseButtonPanels[i].pp_setPositionLocal(this._myConfig.myDecreaseButtonPosition);
            this.myPositionDecreaseButtonBackgrounds[i].pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
            this.myPositionDecreaseButtonTexts[i].pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
            this.myPositionDecreaseButtonTexts[i].pp_scaleObject(this._myConfig.mySideButtonTextScale);
            this.myPositionDecreaseButtonCursorTargets[i].pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);
        }

        // Rotation

        this.myRotationPanel.pp_setPositionLocal(this._myConfig.myRotationPanelPosition);
        this.myRotationLabelText.pp_scaleObject(this._myConfig.myComponentLabelTextScale);
        this.myRotationLabelCursorTarget.pp_setPositionLocal(this._myConfig.myComponentLabelCursorTargetPosition);

        for (let i = 0; i < 3; i++) {
            this.myRotationPanels[i].pp_setPositionLocal(this._myConfig.myValuePanelsPositions[i]);
            this.myRotationTexts[i].pp_scaleObject(this._myConfig.myValueTextScale);
            this.myRotationCursorTargets[i].pp_setPositionLocal(this._myConfig.myValueCursorTargetPosition);

            this.myRotationIncreaseButtonPanels[i].pp_setPositionLocal(this._myConfig.myIncreaseButtonPosition);
            this.myRotationIncreaseButtonBackgrounds[i].pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
            this.myRotationIncreaseButtonTexts[i].pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
            this.myRotationIncreaseButtonTexts[i].pp_scaleObject(this._myConfig.mySideButtonTextScale);
            this.myRotationIncreaseButtonCursorTargets[i].pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

            this.myRotationDecreaseButtonPanels[i].pp_setPositionLocal(this._myConfig.myDecreaseButtonPosition);
            this.myRotationDecreaseButtonBackgrounds[i].pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
            this.myRotationDecreaseButtonTexts[i].pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
            this.myRotationDecreaseButtonTexts[i].pp_scaleObject(this._myConfig.mySideButtonTextScale);
            this.myRotationDecreaseButtonCursorTargets[i].pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);
        }

        // Scale

        this.myScalePanel.pp_setPositionLocal(this._myConfig.myScalePanelPosition);
        this.myScaleLabelText.pp_scaleObject(this._myConfig.myComponentLabelTextScale);
        this.myScaleLabelCursorTarget.pp_setPositionLocal(this._myConfig.myComponentLabelCursorTargetPosition);

        for (let i = 0; i < 3; i++) {
            this.myScalePanels[i].pp_setPositionLocal(this._myConfig.myValuePanelsPositions[i]);
            this.myScaleTexts[i].pp_scaleObject(this._myConfig.myValueTextScale);
            this.myScaleCursorTargets[i].pp_setPositionLocal(this._myConfig.myValueCursorTargetPosition);

            this.myScaleIncreaseButtonPanels[i].pp_setPositionLocal(this._myConfig.myIncreaseButtonPosition);
            this.myScaleIncreaseButtonBackgrounds[i].pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
            this.myScaleIncreaseButtonTexts[i].pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
            this.myScaleIncreaseButtonTexts[i].pp_scaleObject(this._myConfig.mySideButtonTextScale);
            this.myScaleIncreaseButtonCursorTargets[i].pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

            this.myScaleDecreaseButtonPanels[i].pp_setPositionLocal(this._myConfig.myDecreaseButtonPosition);
            this.myScaleDecreaseButtonBackgrounds[i].pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
            this.myScaleDecreaseButtonTexts[i].pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
            this.myScaleDecreaseButtonTexts[i].pp_scaleObject(this._myConfig.mySideButtonTextScale);
            this.myScaleDecreaseButtonCursorTargets[i].pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);
        }

        // Steps

        // Position

        this.myPositionStepPanel.pp_setPositionLocal(this._myConfig.myStepPanelPosition);
        this.myPositionStepText.pp_scaleObject(this._myConfig.myStepTextScale);
        this.myPositionStepCursorTarget.pp_setPositionLocal(this._myConfig.myStepCursorTargetPosition);

        this.myPositionStepIncreaseButtonPanel.pp_setPositionLocal(this._myConfig.myIncreaseButtonPosition);
        this.myPositionStepIncreaseButtonBackground.pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
        this.myPositionStepIncreaseButtonText.pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
        this.myPositionStepIncreaseButtonText.pp_scaleObject(this._myConfig.mySideButtonTextScale);
        this.myPositionStepIncreaseButtonCursorTarget.pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

        this.myPositionStepDecreaseButtonPanel.pp_setPositionLocal(this._myConfig.myDecreaseButtonPosition);
        this.myPositionStepDecreaseButtonBackground.pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
        this.myPositionStepDecreaseButtonText.pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
        this.myPositionStepDecreaseButtonText.pp_scaleObject(this._myConfig.mySideButtonTextScale);
        this.myPositionStepDecreaseButtonCursorTarget.pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

        // Rotation

        this.myRotationStepPanel.pp_setPositionLocal(this._myConfig.myStepPanelPosition);
        this.myRotationStepText.pp_scaleObject(this._myConfig.myStepTextScale);
        this.myRotationStepCursorTarget.pp_setPositionLocal(this._myConfig.myStepCursorTargetPosition);

        this.myRotationStepIncreaseButtonPanel.pp_setPositionLocal(this._myConfig.myIncreaseButtonPosition);
        this.myRotationStepIncreaseButtonBackground.pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
        this.myRotationStepIncreaseButtonText.pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
        this.myRotationStepIncreaseButtonText.pp_scaleObject(this._myConfig.mySideButtonTextScale);
        this.myRotationStepIncreaseButtonCursorTarget.pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

        this.myRotationStepDecreaseButtonPanel.pp_setPositionLocal(this._myConfig.myDecreaseButtonPosition);
        this.myRotationStepDecreaseButtonBackground.pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
        this.myRotationStepDecreaseButtonText.pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
        this.myRotationStepDecreaseButtonText.pp_scaleObject(this._myConfig.mySideButtonTextScale);
        this.myRotationStepDecreaseButtonCursorTarget.pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

        // Scale

        this.myScaleStepPanel.pp_setPositionLocal(this._myConfig.myStepPanelPosition);
        this.myScaleStepText.pp_scaleObject(this._myConfig.myStepTextScale);
        this.myScaleStepCursorTarget.pp_setPositionLocal(this._myConfig.myStepCursorTargetPosition);

        this.myScaleStepIncreaseButtonPanel.pp_setPositionLocal(this._myConfig.myIncreaseButtonPosition);
        this.myScaleStepIncreaseButtonBackground.pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
        this.myScaleStepIncreaseButtonText.pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
        this.myScaleStepIncreaseButtonText.pp_scaleObject(this._myConfig.mySideButtonTextScale);
        this.myScaleStepIncreaseButtonCursorTarget.pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

        this.myScaleStepDecreaseButtonPanel.pp_setPositionLocal(this._myConfig.myDecreaseButtonPosition);
        this.myScaleStepDecreaseButtonBackground.pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
        this.myScaleStepDecreaseButtonText.pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
        this.myScaleStepDecreaseButtonText.pp_scaleObject(this._myConfig.mySideButtonTextScale);
        this.myScaleStepDecreaseButtonCursorTarget.pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);
    }

    _addComponentsHook() {
        // Position

        this.myPositionLabelTextComponent = this.myPositionLabelText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myPositionLabelTextComponent);
        this.myPositionLabelTextComponent.text = this._myConfig.myPositionText;

        this.myPositionLabelCursorTargetComponent = this.myPositionLabelCursorTarget.pp_addComponent(CursorTarget);
        this.myPositionLabelCollisionComponent = this.myPositionLabelCursorTarget.pp_addComponent(CollisionComponent);
        this.myPositionLabelCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myPositionLabelCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myPositionLabelCollisionComponent.extents = this._myConfig.myComponentLabelCollisionExtents;

        this.myPositionTextComponents = [];
        this.myPositionCursorTargetComponents = [];
        this.myPositionCollisionComponents = [];

        this.myPositionIncreaseButtonBackgroundComponents = [];
        this.myPositionIncreaseButtonTextComponents = [];
        this.myPositionIncreaseButtonCursorTargetComponents = [];
        this.myPositionIncreaseButtonCollisionComponents = [];

        this.myPositionDecreaseButtonBackgroundComponents = [];
        this.myPositionDecreaseButtonTextComponents = [];
        this.myPositionDecreaseButtonCursorTargetComponents = [];
        this.myPositionDecreaseButtonCollisionComponents = [];

        for (let i = 0; i < 3; i++) {
            this.myPositionTextComponents[i] = this.myPositionTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myPositionTextComponents[i]);
            this.myPositionTextComponents[i].text = " ";

            this.myPositionCursorTargetComponents[i] = this.myPositionCursorTargets[i].pp_addComponent(CursorTarget);
            this.myPositionCollisionComponents[i] = this.myPositionCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myPositionCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myPositionCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myPositionCollisionComponents[i].extents = this._myConfig.myValueCollisionExtents;

            this.myPositionIncreaseButtonBackgroundComponents[i] = this.myPositionIncreaseButtonBackgrounds[i].pp_addComponent(MeshComponent);
            this.myPositionIncreaseButtonBackgroundComponents[i].mesh = this._myPlaneMesh;
            this.myPositionIncreaseButtonBackgroundComponents[i].material = this._myParams.myPlaneMaterial.clone();
            this.myPositionIncreaseButtonBackgroundComponents[i].material.color = this._myConfig.myBackgroundColor;

            this.myPositionIncreaseButtonTextComponents[i] = this.myPositionIncreaseButtonTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myPositionIncreaseButtonTextComponents[i]);
            this.myPositionIncreaseButtonTextComponents[i].text = this._myConfig.myIncreaseButtonText;

            this.myPositionIncreaseButtonCursorTargetComponents[i] = this.myPositionIncreaseButtonCursorTargets[i].pp_addComponent(CursorTarget);
            this.myPositionIncreaseButtonCollisionComponents[i] = this.myPositionIncreaseButtonCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myPositionIncreaseButtonCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myPositionIncreaseButtonCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myPositionIncreaseButtonCollisionComponents[i].extents = this._myConfig.mySideButtonCollisionExtents;

            this.myPositionDecreaseButtonBackgroundComponents[i] = this.myPositionDecreaseButtonBackgrounds[i].pp_addComponent(MeshComponent);
            this.myPositionDecreaseButtonBackgroundComponents[i].mesh = this._myPlaneMesh;
            this.myPositionDecreaseButtonBackgroundComponents[i].material = this._myParams.myPlaneMaterial.clone();
            this.myPositionDecreaseButtonBackgroundComponents[i].material.color = this._myConfig.myBackgroundColor;

            this.myPositionDecreaseButtonTextComponents[i] = this.myPositionDecreaseButtonTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myPositionDecreaseButtonTextComponents[i]);
            this.myPositionDecreaseButtonTextComponents[i].text = this._myConfig.myDecreaseButtonText;

            this.myPositionDecreaseButtonCursorTargetComponents[i] = this.myPositionDecreaseButtonCursorTargets[i].pp_addComponent(CursorTarget);
            this.myPositionDecreaseButtonCollisionComponents[i] = this.myPositionDecreaseButtonCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myPositionDecreaseButtonCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myPositionDecreaseButtonCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myPositionDecreaseButtonCollisionComponents[i].extents = this._myConfig.mySideButtonCollisionExtents;
        }

        // Rotation

        this.myRotationLabelTextComponent = this.myRotationLabelText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myRotationLabelTextComponent);
        this.myRotationLabelTextComponent.text = this._myConfig.myRotationText;

        this.myRotationLabelCursorTargetComponent = this.myRotationLabelCursorTarget.pp_addComponent(CursorTarget);
        this.myRotationLabelCollisionComponent = this.myRotationLabelCursorTarget.pp_addComponent(CollisionComponent);
        this.myRotationLabelCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myRotationLabelCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myRotationLabelCollisionComponent.extents = this._myConfig.myComponentLabelCollisionExtents;

        this.myRotationTextComponents = [];
        this.myRotationCursorTargetComponents = [];
        this.myRotationCollisionComponents = [];

        this.myRotationIncreaseButtonBackgroundComponents = [];
        this.myRotationIncreaseButtonTextComponents = [];
        this.myRotationIncreaseButtonCursorTargetComponents = [];
        this.myRotationIncreaseButtonCollisionComponents = [];

        this.myRotationDecreaseButtonBackgroundComponents = [];
        this.myRotationDecreaseButtonTextComponents = [];
        this.myRotationDecreaseButtonCursorTargetComponents = [];
        this.myRotationDecreaseButtonCollisionComponents = [];

        for (let i = 0; i < 3; i++) {
            this.myRotationTextComponents[i] = this.myRotationTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myRotationTextComponents[i]);
            this.myRotationTextComponents[i].text = " ";

            this.myRotationCursorTargetComponents[i] = this.myRotationCursorTargets[i].pp_addComponent(CursorTarget);
            this.myRotationCollisionComponents[i] = this.myRotationCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myRotationCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myRotationCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myRotationCollisionComponents[i].extents = this._myConfig.myValueCollisionExtents;

            this.myRotationIncreaseButtonBackgroundComponents[i] = this.myRotationIncreaseButtonBackgrounds[i].pp_addComponent(MeshComponent);
            this.myRotationIncreaseButtonBackgroundComponents[i].mesh = this._myPlaneMesh;
            this.myRotationIncreaseButtonBackgroundComponents[i].material = this._myParams.myPlaneMaterial.clone();
            this.myRotationIncreaseButtonBackgroundComponents[i].material.color = this._myConfig.myBackgroundColor;

            this.myRotationIncreaseButtonTextComponents[i] = this.myRotationIncreaseButtonTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myRotationIncreaseButtonTextComponents[i]);
            this.myRotationIncreaseButtonTextComponents[i].text = this._myConfig.myIncreaseButtonText;

            this.myRotationIncreaseButtonCursorTargetComponents[i] = this.myRotationIncreaseButtonCursorTargets[i].pp_addComponent(CursorTarget);
            this.myRotationIncreaseButtonCollisionComponents[i] = this.myRotationIncreaseButtonCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myRotationIncreaseButtonCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myRotationIncreaseButtonCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myRotationIncreaseButtonCollisionComponents[i].extents = this._myConfig.mySideButtonCollisionExtents;

            this.myRotationDecreaseButtonBackgroundComponents[i] = this.myRotationDecreaseButtonBackgrounds[i].pp_addComponent(MeshComponent);
            this.myRotationDecreaseButtonBackgroundComponents[i].mesh = this._myPlaneMesh;
            this.myRotationDecreaseButtonBackgroundComponents[i].material = this._myParams.myPlaneMaterial.clone();
            this.myRotationDecreaseButtonBackgroundComponents[i].material.color = this._myConfig.myBackgroundColor;

            this.myRotationDecreaseButtonTextComponents[i] = this.myRotationDecreaseButtonTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myRotationDecreaseButtonTextComponents[i]);
            this.myRotationDecreaseButtonTextComponents[i].text = this._myConfig.myDecreaseButtonText;

            this.myRotationDecreaseButtonCursorTargetComponents[i] = this.myRotationDecreaseButtonCursorTargets[i].pp_addComponent(CursorTarget);
            this.myRotationDecreaseButtonCollisionComponents[i] = this.myRotationDecreaseButtonCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myRotationDecreaseButtonCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myRotationDecreaseButtonCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myRotationDecreaseButtonCollisionComponents[i].extents = this._myConfig.mySideButtonCollisionExtents;
        }

        // Scale

        this.myScaleLabelTextComponent = this.myScaleLabelText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myScaleLabelTextComponent);
        this.myScaleLabelTextComponent.text = this._myConfig.myScaleText;

        this.myScaleLabelCursorTargetComponent = this.myScaleLabelCursorTarget.pp_addComponent(CursorTarget);
        this.myScaleLabelCollisionComponent = this.myScaleLabelCursorTarget.pp_addComponent(CollisionComponent);
        this.myScaleLabelCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myScaleLabelCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myScaleLabelCollisionComponent.extents = this._myConfig.myComponentLabelCollisionExtents;

        this.myScaleTextComponents = [];
        this.myScaleCursorTargetComponents = [];
        this.myScaleCollisionComponents = [];

        this.myScaleIncreaseButtonBackgroundComponents = [];
        this.myScaleIncreaseButtonTextComponents = [];
        this.myScaleIncreaseButtonCursorTargetComponents = [];
        this.myScaleIncreaseButtonCollisionComponents = [];

        this.myScaleDecreaseButtonBackgroundComponents = [];
        this.myScaleDecreaseButtonTextComponents = [];
        this.myScaleDecreaseButtonCursorTargetComponents = [];
        this.myScaleDecreaseButtonCollisionComponents = [];

        for (let i = 0; i < 3; i++) {
            this.myScaleTextComponents[i] = this.myScaleTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myScaleTextComponents[i]);
            this.myScaleTextComponents[i].text = " ";

            this.myScaleCursorTargetComponents[i] = this.myScaleCursorTargets[i].pp_addComponent(CursorTarget);
            this.myScaleCollisionComponents[i] = this.myScaleCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myScaleCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myScaleCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myScaleCollisionComponents[i].extents = this._myConfig.myValueCollisionExtents;

            this.myScaleIncreaseButtonBackgroundComponents[i] = this.myScaleIncreaseButtonBackgrounds[i].pp_addComponent(MeshComponent);
            this.myScaleIncreaseButtonBackgroundComponents[i].mesh = this._myPlaneMesh;
            this.myScaleIncreaseButtonBackgroundComponents[i].material = this._myParams.myPlaneMaterial.clone();
            this.myScaleIncreaseButtonBackgroundComponents[i].material.color = this._myConfig.myBackgroundColor;

            this.myScaleIncreaseButtonTextComponents[i] = this.myScaleIncreaseButtonTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myScaleIncreaseButtonTextComponents[i]);
            this.myScaleIncreaseButtonTextComponents[i].text = this._myConfig.myIncreaseButtonText;

            this.myScaleIncreaseButtonCursorTargetComponents[i] = this.myScaleIncreaseButtonCursorTargets[i].pp_addComponent(CursorTarget);
            this.myScaleIncreaseButtonCollisionComponents[i] = this.myScaleIncreaseButtonCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myScaleIncreaseButtonCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myScaleIncreaseButtonCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myScaleIncreaseButtonCollisionComponents[i].extents = this._myConfig.mySideButtonCollisionExtents;

            this.myScaleDecreaseButtonBackgroundComponents[i] = this.myScaleDecreaseButtonBackgrounds[i].pp_addComponent(MeshComponent);
            this.myScaleDecreaseButtonBackgroundComponents[i].mesh = this._myPlaneMesh;
            this.myScaleDecreaseButtonBackgroundComponents[i].material = this._myParams.myPlaneMaterial.clone();
            this.myScaleDecreaseButtonBackgroundComponents[i].material.color = this._myConfig.myBackgroundColor;

            this.myScaleDecreaseButtonTextComponents[i] = this.myScaleDecreaseButtonTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myScaleDecreaseButtonTextComponents[i]);
            this.myScaleDecreaseButtonTextComponents[i].text = this._myConfig.myDecreaseButtonText;

            this.myScaleDecreaseButtonCursorTargetComponents[i] = this.myScaleDecreaseButtonCursorTargets[i].pp_addComponent(CursorTarget);
            this.myScaleDecreaseButtonCollisionComponents[i] = this.myScaleDecreaseButtonCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myScaleDecreaseButtonCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myScaleDecreaseButtonCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myScaleDecreaseButtonCollisionComponents[i].extents = this._myConfig.mySideButtonCollisionExtents;
        }

        // Steps

        // Position 
        this.myPositionStepTextComponent = this.myPositionStepText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myPositionStepTextComponent);
        this.myPositionStepTextComponent.text = " ";

        this.myPositionStepCursorTargetComponent = this.myPositionStepCursorTarget.pp_addComponent(CursorTarget);
        this.myPositionStepCollisionComponent = this.myPositionStepCursorTarget.pp_addComponent(CollisionComponent);
        this.myPositionStepCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myPositionStepCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myPositionStepCollisionComponent.extents = this._myConfig.myStepCollisionExtents;

        this.myPositionStepIncreaseButtonBackgroundComponent = this.myPositionStepIncreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myPositionStepIncreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPositionStepIncreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myPositionStepIncreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myPositionStepIncreaseButtonTextComponent = this.myPositionStepIncreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myPositionStepIncreaseButtonTextComponent);
        this.myPositionStepIncreaseButtonTextComponent.text = this._myConfig.myIncreaseButtonText;

        this.myPositionStepIncreaseButtonCursorTargetComponent = this.myPositionStepIncreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myPositionStepIncreaseButtonCollisionComponent = this.myPositionStepIncreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myPositionStepIncreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myPositionStepIncreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myPositionStepIncreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        this.myPositionStepDecreaseButtonBackgroundComponent = this.myPositionStepDecreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myPositionStepDecreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPositionStepDecreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myPositionStepDecreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myPositionStepDecreaseButtonTextComponent = this.myPositionStepDecreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myPositionStepDecreaseButtonTextComponent);
        this.myPositionStepDecreaseButtonTextComponent.text = this._myConfig.myDecreaseButtonText;

        this.myPositionStepDecreaseButtonCursorTargetComponent = this.myPositionStepDecreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myPositionStepDecreaseButtonCollisionComponent = this.myPositionStepDecreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myPositionStepDecreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myPositionStepDecreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myPositionStepDecreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        // Rotation

        this.myRotationStepTextComponent = this.myRotationStepText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myRotationStepTextComponent);
        this.myRotationStepTextComponent.text = " ";

        this.myRotationStepCursorTargetComponent = this.myRotationStepCursorTarget.pp_addComponent(CursorTarget);
        this.myRotationStepCollisionComponent = this.myRotationStepCursorTarget.pp_addComponent(CollisionComponent);
        this.myRotationStepCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myRotationStepCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myRotationStepCollisionComponent.extents = this._myConfig.myStepCollisionExtents;

        this.myRotationStepIncreaseButtonBackgroundComponent = this.myRotationStepIncreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myRotationStepIncreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myRotationStepIncreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myRotationStepIncreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myRotationStepIncreaseButtonTextComponent = this.myRotationStepIncreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myRotationStepIncreaseButtonTextComponent);
        this.myRotationStepIncreaseButtonTextComponent.text = this._myConfig.myIncreaseButtonText;

        this.myRotationStepIncreaseButtonCursorTargetComponent = this.myRotationStepIncreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myRotationStepIncreaseButtonCollisionComponent = this.myRotationStepIncreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myRotationStepIncreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myRotationStepIncreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myRotationStepIncreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        this.myRotationStepDecreaseButtonBackgroundComponent = this.myRotationStepDecreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myRotationStepDecreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myRotationStepDecreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myRotationStepDecreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myRotationStepDecreaseButtonTextComponent = this.myRotationStepDecreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myRotationStepDecreaseButtonTextComponent);
        this.myRotationStepDecreaseButtonTextComponent.text = this._myConfig.myDecreaseButtonText;

        this.myRotationStepDecreaseButtonCursorTargetComponent = this.myRotationStepDecreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myRotationStepDecreaseButtonCollisionComponent = this.myRotationStepDecreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myRotationStepDecreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myRotationStepDecreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myRotationStepDecreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        // Scale

        this.myScaleStepTextComponent = this.myScaleStepText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myScaleStepTextComponent);
        this.myScaleStepTextComponent.text = " ";

        this.myScaleStepCursorTargetComponent = this.myScaleStepCursorTarget.pp_addComponent(CursorTarget);
        this.myScaleStepCollisionComponent = this.myScaleStepCursorTarget.pp_addComponent(CollisionComponent);
        this.myScaleStepCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myScaleStepCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myScaleStepCollisionComponent.extents = this._myConfig.myStepCollisionExtents;

        this.myScaleStepIncreaseButtonBackgroundComponent = this.myScaleStepIncreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myScaleStepIncreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myScaleStepIncreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myScaleStepIncreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myScaleStepIncreaseButtonTextComponent = this.myScaleStepIncreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myScaleStepIncreaseButtonTextComponent);
        this.myScaleStepIncreaseButtonTextComponent.text = this._myConfig.myIncreaseButtonText;

        this.myScaleStepIncreaseButtonCursorTargetComponent = this.myScaleStepIncreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myScaleStepIncreaseButtonCollisionComponent = this.myScaleStepIncreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myScaleStepIncreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myScaleStepIncreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myScaleStepIncreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        this.myScaleStepDecreaseButtonBackgroundComponent = this.myScaleStepDecreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myScaleStepDecreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myScaleStepDecreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myScaleStepDecreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myScaleStepDecreaseButtonTextComponent = this.myScaleStepDecreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myScaleStepDecreaseButtonTextComponent);
        this.myScaleStepDecreaseButtonTextComponent.text = this._myConfig.myDecreaseButtonText;

        this.myScaleStepDecreaseButtonCursorTargetComponent = this.myScaleStepDecreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myScaleStepDecreaseButtonCollisionComponent = this.myScaleStepDecreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myScaleStepDecreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myScaleStepDecreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myScaleStepDecreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;
    }

    _addStepComponents() {
        // Position
        this.myPositionStepTextComponent = this.myPositionStepText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myPositionStepTextComponent);
        this.myPositionStepTextComponent.text = " ";

        this.myPositionStepCursorTargetComponent = this.myPositionStepCursorTarget.pp_addComponent(CursorTarget);
        this.myPositionStepCollisionComponent = this.myPositionStepCursorTarget.pp_addComponent(CollisionComponent);
        this.myPositionStepCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myPositionStepCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myPositionStepCollisionComponent.extents = this._myConfig.myStepCollisionExtents;

        // Increase/Decrease
        this.myPositionStepIncreaseButtonBackgroundComponent = this.myPositionStepIncreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myPositionStepIncreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPositionStepIncreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myPositionStepIncreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myPositionStepIncreaseButtonTextComponent = this.myPositionStepIncreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myPositionStepIncreaseButtonTextComponent);
        this.myPositionStepIncreaseButtonTextComponent.text = this._myConfig.myIncreaseButtonText;

        this.myPositionStepIncreaseButtonCursorTargetComponent = this.myPositionStepIncreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myPositionStepIncreaseButtonCollisionComponent = this.myPositionStepIncreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myPositionStepIncreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myPositionStepIncreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myPositionStepIncreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        this.myPositionStepDecreaseButtonBackgroundComponent = this.myPositionStepDecreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myPositionStepDecreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPositionStepDecreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myPositionStepDecreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myPositionStepDecreaseButtonTextComponent = this.myPositionStepDecreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myPositionStepDecreaseButtonTextComponent);
        this.myPositionStepDecreaseButtonTextComponent.text = this._myConfig.myDecreaseButtonText;

        this.myPositionStepDecreaseButtonCursorTargetComponent = this.myPositionStepDecreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myPositionStepDecreaseButtonCollisionComponent = this.myPositionStepDecreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myPositionStepDecreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myPositionStepDecreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myPositionStepDecreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        // Rotation
        this.myRotationStepTextComponent = this.myRotationStepText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myRotationStepTextComponent);
        this.myRotationStepTextComponent.text = " ";

        this.myRotationStepCursorTargetComponent = this.myRotationStepCursorTarget.pp_addComponent(CursorTarget);
        this.myRotationStepCollisionComponent = this.myRotationStepCursorTarget.pp_addComponent(CollisionComponent);
        this.myRotationStepCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myRotationStepCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myRotationStepCollisionComponent.extents = this._myConfig.myStepCollisionExtents;

        // Increase/Decrease
        this.myRotationStepIncreaseButtonBackgroundComponent = this.myRotationStepIncreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myRotationStepIncreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myRotationStepIncreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myRotationStepIncreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myRotationStepIncreaseButtonTextComponent = this.myRotationStepIncreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myRotationStepIncreaseButtonTextComponent);
        this.myRotationStepIncreaseButtonTextComponent.text = this._myConfig.myIncreaseButtonText;

        this.myRotationStepIncreaseButtonCursorTargetComponent = this.myRotationStepIncreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myRotationStepIncreaseButtonCollisionComponent = this.myRotationStepIncreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myRotationStepIncreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myRotationStepIncreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myRotationStepIncreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        this.myRotationStepDecreaseButtonBackgroundComponent = this.myRotationStepDecreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myRotationStepDecreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myRotationStepDecreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myRotationStepDecreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myRotationStepDecreaseButtonTextComponent = this.myRotationStepDecreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myRotationStepDecreaseButtonTextComponent);
        this.myRotationStepDecreaseButtonTextComponent.text = this._myConfig.myDecreaseButtonText;

        this.myRotationStepDecreaseButtonCursorTargetComponent = this.myRotationStepDecreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myRotationStepDecreaseButtonCollisionComponent = this.myRotationStepDecreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myRotationStepDecreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myRotationStepDecreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myRotationStepDecreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        // Scale
        this.myScaleStepTextComponent = this.myScaleStepText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myScaleStepTextComponent);
        this.myScaleStepTextComponent.text = " ";

        this.myScaleStepCursorTargetComponent = this.myScaleStepCursorTarget.pp_addComponent(CursorTarget);
        this.myScaleStepCollisionComponent = this.myScaleStepCursorTarget.pp_addComponent(CollisionComponent);
        this.myScaleStepCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myScaleStepCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myScaleStepCollisionComponent.extents = this._myConfig.myStepCollisionExtents;

        // Increase/Decrease
        this.myScaleStepIncreaseButtonBackgroundComponent = this.myScaleStepIncreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myScaleStepIncreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myScaleStepIncreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myScaleStepIncreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myScaleStepIncreaseButtonTextComponent = this.myScaleStepIncreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myScaleStepIncreaseButtonTextComponent);
        this.myScaleStepIncreaseButtonTextComponent.text = this._myConfig.myIncreaseButtonText;

        this.myScaleStepIncreaseButtonCursorTargetComponent = this.myScaleStepIncreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myScaleStepIncreaseButtonCollisionComponent = this.myScaleStepIncreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myScaleStepIncreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myScaleStepIncreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myScaleStepIncreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        this.myScaleStepDecreaseButtonBackgroundComponent = this.myScaleStepDecreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myScaleStepDecreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myScaleStepDecreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myScaleStepDecreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myScaleStepDecreaseButtonTextComponent = this.myScaleStepDecreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myScaleStepDecreaseButtonTextComponent);
        this.myScaleStepDecreaseButtonTextComponent.text = this._myConfig.myDecreaseButtonText;

        this.myScaleStepDecreaseButtonCursorTargetComponent = this.myScaleStepDecreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myScaleStepDecreaseButtonCollisionComponent = this.myScaleStepDecreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myScaleStepDecreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myScaleStepDecreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myScaleStepDecreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;
    }
}
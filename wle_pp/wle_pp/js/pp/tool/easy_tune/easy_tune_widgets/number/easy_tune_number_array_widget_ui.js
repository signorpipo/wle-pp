import { CollisionComponent, MeshComponent, TextComponent } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { EasyTuneBaseWidgetUI } from "../base/easy_tune_base_widget_ui";

export class EasyTuneNumberArrayWidgetUI extends EasyTuneBaseWidgetUI {

    constructor(engine) {
        super(engine);
    }

    setAdditionalButtonsVisible(visible) {
        this._myAdditionalButtonsVisible = visible;

        for (let i = 0; i < this._myConfig.myArraySize; i++) {
            this.myValueIncreaseButtonPanels[i].pp_setActive(this._myAdditionalButtonsVisible);
            this.myValueDecreaseButtonPanels[i].pp_setActive(this._myAdditionalButtonsVisible);
        }

        this.myStepIncreaseButtonPanel.pp_setActive(this._myAdditionalButtonsVisible);
        this.myStepDecreaseButtonPanel.pp_setActive(this._myAdditionalButtonsVisible);
    }

    _buildHook() {
        this._myAdditionalButtonsVisible = true;
    }

    _createSkeletonHook() {
        this.myValuesPanel = this.myDisplayPanel.pp_addObject();

        this.myValuePanels = [];
        this.myValueTexts = [];
        this.myValueCursorTargets = [];

        this.myValueIncreaseButtonPanels = [];
        this.myValueIncreaseButtonBackgrounds = [];
        this.myValueIncreaseButtonTexts = [];
        this.myValueIncreaseButtonCursorTargets = [];

        this.myValueDecreaseButtonPanels = [];
        this.myValueDecreaseButtonBackgrounds = [];
        this.myValueDecreaseButtonTexts = [];
        this.myValueDecreaseButtonCursorTargets = [];

        for (let i = 0; i < this._myConfig.myArraySize; i++) {
            this.myValuePanels[i] = this.myValuesPanel.pp_addObject();
            this.myValueTexts[i] = this.myValuePanels[i].pp_addObject();
            this.myValueCursorTargets[i] = this.myValuePanels[i].pp_addObject();

            this.myValueIncreaseButtonPanels[i] = this.myValuePanels[i].pp_addObject();
            this.myValueIncreaseButtonBackgrounds[i] = this.myValueIncreaseButtonPanels[i].pp_addObject();
            this.myValueIncreaseButtonTexts[i] = this.myValueIncreaseButtonPanels[i].pp_addObject();
            this.myValueIncreaseButtonCursorTargets[i] = this.myValueIncreaseButtonPanels[i].pp_addObject();

            this.myValueDecreaseButtonPanels[i] = this.myValuePanels[i].pp_addObject();
            this.myValueDecreaseButtonBackgrounds[i] = this.myValueDecreaseButtonPanels[i].pp_addObject();
            this.myValueDecreaseButtonTexts[i] = this.myValueDecreaseButtonPanels[i].pp_addObject();
            this.myValueDecreaseButtonCursorTargets[i] = this.myValueDecreaseButtonPanels[i].pp_addObject();
        }

        this.myStepPanel = this.myPivotObject.pp_addObject();
        this.myStepText = this.myStepPanel.pp_addObject();
        this.myStepCursorTarget = this.myStepPanel.pp_addObject();

        this.myStepIncreaseButtonPanel = this.myStepPanel.pp_addObject();
        this.myStepIncreaseButtonBackground = this.myStepIncreaseButtonPanel.pp_addObject();
        this.myStepIncreaseButtonText = this.myStepIncreaseButtonPanel.pp_addObject();
        this.myStepIncreaseButtonCursorTarget = this.myStepIncreaseButtonPanel.pp_addObject();

        this.myStepDecreaseButtonPanel = this.myStepPanel.pp_addObject();
        this.myStepDecreaseButtonBackground = this.myStepDecreaseButtonPanel.pp_addObject();
        this.myStepDecreaseButtonText = this.myStepDecreaseButtonPanel.pp_addObject();
        this.myStepDecreaseButtonCursorTarget = this.myStepDecreaseButtonPanel.pp_addObject();
    }

    _setTransformHook() {
        this.myValuesPanel.pp_setPositionLocal(this._myConfig.myValuesPanelPosition);

        for (let i = 0; i < this._myConfig.myArraySize; i++) {
            this.myValuePanels[i].pp_setPositionLocal(this._myConfig.myValuePanelsPositions[i]);
            this.myValueTexts[i].pp_scaleObject(this._myConfig.myValueTextScale);
            this.myValueCursorTargets[i].pp_setPositionLocal(this._myConfig.myValueCursorTargetPosition);

            this.myValueIncreaseButtonPanels[i].pp_setPositionLocal(this._myConfig.myRightSideButtonPosition);
            this.myValueIncreaseButtonBackgrounds[i].pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
            this.myValueIncreaseButtonTexts[i].pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
            this.myValueIncreaseButtonTexts[i].pp_scaleObject(this._myConfig.mySideButtonTextScale);
            this.myValueIncreaseButtonCursorTargets[i].pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

            this.myValueDecreaseButtonPanels[i].pp_setPositionLocal(this._myConfig.myLeftSideButtonPosition);
            this.myValueDecreaseButtonBackgrounds[i].pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
            this.myValueDecreaseButtonTexts[i].pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
            this.myValueDecreaseButtonTexts[i].pp_scaleObject(this._myConfig.mySideButtonTextScale);
            this.myValueDecreaseButtonCursorTargets[i].pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);
        }

        this.myStepPanel.pp_setPositionLocal(this._myConfig.myStepPanelPosition);
        this.myStepText.pp_scaleObject(this._myConfig.myStepTextScale);
        this.myStepCursorTarget.pp_setPositionLocal(this._myConfig.myStepCursorTargetPosition);

        this.myStepIncreaseButtonPanel.pp_setPositionLocal(this._myConfig.myRightSideButtonPosition);
        this.myStepIncreaseButtonBackground.pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
        this.myStepIncreaseButtonText.pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
        this.myStepIncreaseButtonText.pp_scaleObject(this._myConfig.mySideButtonTextScale);
        this.myStepIncreaseButtonCursorTarget.pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

        this.myStepDecreaseButtonPanel.pp_setPositionLocal(this._myConfig.myLeftSideButtonPosition);
        this.myStepDecreaseButtonBackground.pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
        this.myStepDecreaseButtonText.pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
        this.myStepDecreaseButtonText.pp_scaleObject(this._myConfig.mySideButtonTextScale);
        this.myStepDecreaseButtonCursorTarget.pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);
    }

    _addComponentsHook() {
        this.myValueTextComponents = [];
        this.myValueCursorTargetComponents = [];
        this.myValueCollisionComponents = [];

        this.myValueIncreaseButtonBackgroundComponents = [];
        this.myValueIncreaseButtonTextComponents = [];
        this.myValueIncreaseButtonCursorTargetComponents = [];
        this.myValueIncreaseButtonCollisionComponents = [];

        this.myValueDecreaseButtonBackgroundComponents = [];
        this.myValueDecreaseButtonTextComponents = [];
        this.myValueDecreaseButtonCursorTargetComponents = [];
        this.myValueDecreaseButtonCollisionComponents = [];


        for (let i = 0; i < this._myConfig.myArraySize; i++) {
            this.myValueTextComponents[i] = this.myValueTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myValueTextComponents[i]);
            this.myValueTextComponents[i].text = " ";

            this.myValueCursorTargetComponents[i] = this.myValueCursorTargets[i].pp_addComponent(CursorTarget);
            this.myValueCollisionComponents[i] = this.myValueCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myValueCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myValueCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myValueCollisionComponents[i].extents = this._myConfig.myValueCollisionExtents;

            this.myValueIncreaseButtonBackgroundComponents[i] = this.myValueIncreaseButtonBackgrounds[i].pp_addComponent(MeshComponent);
            this.myValueIncreaseButtonBackgroundComponents[i].mesh = this._myPlaneMesh;
            this.myValueIncreaseButtonBackgroundComponents[i].material = this._myParams.myPlaneMaterial.clone();
            this.myValueIncreaseButtonBackgroundComponents[i].material.color = this._myConfig.myBackgroundColor;

            this.myValueIncreaseButtonTextComponents[i] = this.myValueIncreaseButtonTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myValueIncreaseButtonTextComponents[i]);
            this.myValueIncreaseButtonTextComponents[i].text = this._myConfig.myIncreaseButtonText;

            this.myValueIncreaseButtonCursorTargetComponents[i] = this.myValueIncreaseButtonCursorTargets[i].pp_addComponent(CursorTarget);
            this.myValueIncreaseButtonCollisionComponents[i] = this.myValueIncreaseButtonCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myValueIncreaseButtonCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myValueIncreaseButtonCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myValueIncreaseButtonCollisionComponents[i].extents = this._myConfig.mySideButtonCollisionExtents;

            this.myValueDecreaseButtonBackgroundComponents[i] = this.myValueDecreaseButtonBackgrounds[i].pp_addComponent(MeshComponent);
            this.myValueDecreaseButtonBackgroundComponents[i].mesh = this._myPlaneMesh;
            this.myValueDecreaseButtonBackgroundComponents[i].material = this._myParams.myPlaneMaterial.clone();
            this.myValueDecreaseButtonBackgroundComponents[i].material.color = this._myConfig.myBackgroundColor;

            this.myValueDecreaseButtonTextComponents[i] = this.myValueDecreaseButtonTexts[i].pp_addComponent(TextComponent);
            this._setupTextComponent(this.myValueDecreaseButtonTextComponents[i]);
            this.myValueDecreaseButtonTextComponents[i].text = this._myConfig.myDecreaseButtonText;

            this.myValueDecreaseButtonCursorTargetComponents[i] = this.myValueDecreaseButtonCursorTargets[i].pp_addComponent(CursorTarget);
            this.myValueDecreaseButtonCollisionComponents[i] = this.myValueDecreaseButtonCursorTargets[i].pp_addComponent(CollisionComponent);
            this.myValueDecreaseButtonCollisionComponents[i].collider = this._myConfig.myCursorTargetCollisionCollider;
            this.myValueDecreaseButtonCollisionComponents[i].group = 1 << this._myConfig.myCursorTargetCollisionGroup;
            this.myValueDecreaseButtonCollisionComponents[i].extents = this._myConfig.mySideButtonCollisionExtents;
        }

        this.myStepTextComponent = this.myStepText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myStepTextComponent);
        this.myStepTextComponent.text = " ";

        this.myStepCursorTargetComponent = this.myStepCursorTarget.pp_addComponent(CursorTarget);
        this.myStepCollisionComponent = this.myStepCursorTarget.pp_addComponent(CollisionComponent);
        this.myStepCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myStepCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myStepCollisionComponent.extents = this._myConfig.myStepCollisionExtents;

        // Increase/Decrease
        this.myStepIncreaseButtonBackgroundComponent = this.myStepIncreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myStepIncreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myStepIncreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myStepIncreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myStepIncreaseButtonTextComponent = this.myStepIncreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myStepIncreaseButtonTextComponent);
        this.myStepIncreaseButtonTextComponent.text = this._myConfig.myIncreaseButtonText;

        this.myStepIncreaseButtonCursorTargetComponent = this.myStepIncreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myStepIncreaseButtonCollisionComponent = this.myStepIncreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myStepIncreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myStepIncreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myStepIncreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        this.myStepDecreaseButtonBackgroundComponent = this.myStepDecreaseButtonBackground.pp_addComponent(MeshComponent);
        this.myStepDecreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myStepDecreaseButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myStepDecreaseButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myStepDecreaseButtonTextComponent = this.myStepDecreaseButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myStepDecreaseButtonTextComponent);
        this.myStepDecreaseButtonTextComponent.text = this._myConfig.myDecreaseButtonText;

        this.myStepDecreaseButtonCursorTargetComponent = this.myStepDecreaseButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myStepDecreaseButtonCollisionComponent = this.myStepDecreaseButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myStepDecreaseButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myStepDecreaseButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myStepDecreaseButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;
    }

    _setVisibleHook(visible) {
        if (visible) {
            this.setAdditionalButtonsVisible(this._myAdditionalButtonsVisible);
        }
    }
}
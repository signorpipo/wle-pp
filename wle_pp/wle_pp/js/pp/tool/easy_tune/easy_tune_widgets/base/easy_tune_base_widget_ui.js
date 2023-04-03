import { CollisionComponent, MeshComponent, TextComponent } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { XRUtils } from "../../../../cauldron/utils/xr_utils";
import { getMainEngine } from "../../../../cauldron/wl/engine_globals";
import { getDefaultResources } from "../../../../pp/default_resources_global";
import { ToolHandedness } from "../../../cauldron/tool_types";

export class EasyTuneBaseWidgetUI {

    constructor(engine = getMainEngine()) {
        this._myEngine = engine;
    }

    build(parentObject, setup, additionalSetup) {
        this._myParentObject = parentObject;
        this._mySetup = setup;
        this._myAdditionalSetup = additionalSetup;

        this._myImportExportButtonsActive = true;

        this._myPlaneMesh = getDefaultResources(this._myEngine).myMeshes.myPlane;

        this._buildHook();

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();

        this._setTransformForNonVR();

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false, this._myEngine);
    }

    setVisible(visible) {
        this.myPivotObject.pp_setActive(visible);

        if (visible) {
            this.setImportExportButtonsActive(this._myImportExportButtonsActive);
        }

        this._setVisibleHook(visible);
    }

    setImportExportButtonsActive(active) {
        this._myImportExportButtonsActive = active;

        this.myImportExportPanel.pp_setActive(this._myImportExportButtonsActive);
    }

    // Hooks

    _buildHook() {
    }

    _setVisibleHook(visible) {
    }

    _createSkeletonHook() {
    }

    _setTransformHook() {
    }

    _addComponentsHook() {
    }

    // Hooks end

    // Skeleton

    _createSkeleton() {
        this.myPivotObject = this._myParentObject.pp_addObject();

        this.myBackPanel = this.myPivotObject.pp_addObject();
        this.myBackBackground = this.myBackPanel.pp_addObject();

        // Display

        this.myDisplayPanel = this.myPivotObject.pp_addObject();

        this.myVariableLabelPanel = this.myDisplayPanel.pp_addObject();
        this.myVariableLabelText = this.myVariableLabelPanel.pp_addObject();
        this.myVariableLabelCursorTarget = this.myVariableLabelPanel.pp_addObject();

        // Next/Previous

        this.myNextButtonPanel = this.myVariableLabelPanel.pp_addObject();
        this.myNextButtonBackground = this.myNextButtonPanel.pp_addObject();
        this.myNextButtonText = this.myNextButtonPanel.pp_addObject();
        this.myNextButtonCursorTarget = this.myNextButtonPanel.pp_addObject();

        this.myPreviousButtonPanel = this.myVariableLabelPanel.pp_addObject();
        this.myPreviousButtonBackground = this.myPreviousButtonPanel.pp_addObject();
        this.myPreviousButtonText = this.myPreviousButtonPanel.pp_addObject();
        this.myPreviousButtonCursorTarget = this.myPreviousButtonPanel.pp_addObject();

        // Import/Export

        this.myImportExportPanel = this.myPivotObject.pp_addObject();

        this.myImportButtonPanel = this.myImportExportPanel.pp_addObject();
        this.myImportButtonBackground = this.myImportButtonPanel.pp_addObject();
        this.myImportButtonText = this.myImportButtonPanel.pp_addObject();
        this.myImportButtonCursorTarget = this.myImportButtonPanel.pp_addObject();

        this.myExportButtonPanel = this.myImportExportPanel.pp_addObject();
        this.myExportButtonBackground = this.myExportButtonPanel.pp_addObject();
        this.myExportButtonText = this.myExportButtonPanel.pp_addObject();
        this.myExportButtonCursorTarget = this.myExportButtonPanel.pp_addObject();

        // Pointer

        this.myPointerCursorTarget = this.myPivotObject.pp_addObject();

        this._createSkeletonHook();
    }

    // Transforms

    _setTransforms() {
        this.myPivotObject.pp_setPositionLocal(this._mySetup.myPivotObjectPositions[this._myAdditionalSetup.myHandedness]);

        this.myBackPanel.pp_setPositionLocal(this._mySetup.myBackPanelPosition);
        this.myBackBackground.pp_scaleObject(this._mySetup.myBackBackgroundScale);

        // Display
        this.myDisplayPanel.pp_setPositionLocal(this._mySetup.myDisplayPanelPosition);

        this.myVariableLabelPanel.pp_setPositionLocal(this._mySetup.myVariableLabelPanelPosition);
        this.myVariableLabelText.pp_scaleObject(this._mySetup.myVariableLabelTextScale);
        this.myVariableLabelCursorTarget.pp_setPositionLocal(this._mySetup.myVariableLabelCursorTargetPosition);

        // Next/Previous

        this.myNextButtonPanel.pp_setPositionLocal(this._mySetup.myRightSideButtonPosition);
        this.myNextButtonBackground.pp_scaleObject(this._mySetup.mySideButtonBackgroundScale);
        this.myNextButtonText.pp_setPositionLocal(this._mySetup.mySideButtonTextPosition);
        this.myNextButtonText.pp_scaleObject(this._mySetup.mySideButtonTextScale);
        this.myNextButtonCursorTarget.pp_setPositionLocal(this._mySetup.mySideButtonCursorTargetPosition);

        this.myPreviousButtonPanel.pp_setPositionLocal(this._mySetup.myLeftSideButtonPosition);
        this.myPreviousButtonBackground.pp_scaleObject(this._mySetup.mySideButtonBackgroundScale);
        this.myPreviousButtonText.pp_setPositionLocal(this._mySetup.mySideButtonTextPosition);
        this.myPreviousButtonText.pp_scaleObject(this._mySetup.mySideButtonTextScale);
        this.myPreviousButtonCursorTarget.pp_setPositionLocal(this._mySetup.mySideButtonCursorTargetPosition);

        // Import/Export

        this.myImportExportPanel.pp_setPositionLocal(this._mySetup.myImportExportPanelPosition);

        this.myImportButtonPanel.pp_setPositionLocal(this._mySetup.myImportButtonPosition);
        this.myImportButtonBackground.pp_scaleObject(this._mySetup.myImportExportButtonBackgroundScale);
        this.myImportButtonText.pp_setPositionLocal(this._mySetup.myImportExportButtonTextPosition);
        this.myImportButtonText.pp_scaleObject(this._mySetup.myImportExportButtonTextScale);
        this.myImportButtonCursorTarget.pp_setPositionLocal(this._mySetup.myImportExportButtonCursorTargetPosition);

        this.myExportButtonPanel.pp_setPositionLocal(this._mySetup.myExportButtonPosition);
        this.myExportButtonBackground.pp_scaleObject(this._mySetup.myImportExportButtonBackgroundScale);
        this.myExportButtonText.pp_setPositionLocal(this._mySetup.myImportExportButtonTextPosition);
        this.myExportButtonText.pp_scaleObject(this._mySetup.myImportExportButtonTextScale);
        this.myExportButtonCursorTarget.pp_setPositionLocal(this._mySetup.myImportExportButtonCursorTargetPosition);

        // Pointer

        this.myPointerCursorTarget.pp_setPositionLocal(this._mySetup.myPointerCursorTargetPosition);

        this._setTransformHook();
    }

    // Components

    _addComponents() {
        this.myBackBackgroundComponent = this.myBackBackground.pp_addComponent(MeshComponent);
        this.myBackBackgroundComponent.mesh = this._myPlaneMesh;
        this.myBackBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myBackBackgroundComponent.material.color = this._mySetup.myBackBackgroundColor;

        // Display

        this.myVariableLabelTextComponent = this.myVariableLabelText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myVariableLabelTextComponent);
        this.myVariableLabelTextComponent.text = " ";

        this.myVariableLabelCursorTargetComponent = this.myVariableLabelCursorTarget.pp_addComponent(CursorTarget);
        this.myVariableLabelCollisionComponent = this.myVariableLabelCursorTarget.pp_addComponent(CollisionComponent);
        this.myVariableLabelCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myVariableLabelCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myVariableLabelCollisionComponent.extents = this._mySetup.myVariableLabelCollisionExtents;

        // Next/Previous

        this.myNextButtonBackgroundComponent = this.myNextButtonBackground.pp_addComponent(MeshComponent);
        this.myNextButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myNextButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myNextButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myNextButtonTextComponent = this.myNextButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myNextButtonTextComponent);
        this.myNextButtonTextComponent.text = this._mySetup.myNextButtonText;

        this.myNextButtonCursorTargetComponent = this.myNextButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myNextButtonCollisionComponent = this.myNextButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myNextButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myNextButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myNextButtonCollisionComponent.extents = this._mySetup.mySideButtonCollisionExtents;

        this.myPreviousButtonBackgroundComponent = this.myPreviousButtonBackground.pp_addComponent(MeshComponent);
        this.myPreviousButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPreviousButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myPreviousButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myPreviousButtonTextComponent = this.myPreviousButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myPreviousButtonTextComponent);
        this.myPreviousButtonTextComponent.text = this._mySetup.myPreviousButtonText;

        this.myPreviousButtonCursorTargetComponent = this.myPreviousButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myPreviousButtonCollisionComponent = this.myPreviousButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myPreviousButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPreviousButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPreviousButtonCollisionComponent.extents = this._mySetup.mySideButtonCollisionExtents;

        // Import/Export

        this.myImportButtonBackgroundComponent = this.myImportButtonBackground.pp_addComponent(MeshComponent);
        this.myImportButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myImportButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myImportButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myImportButtonTextComponent = this.myImportButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myImportButtonTextComponent);
        this.myImportButtonTextComponent.text = this._mySetup.myImportButtonText;

        this.myImportButtonCursorTargetComponent = this.myImportButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myImportButtonCollisionComponent = this.myImportButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myImportButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myImportButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myImportButtonCollisionComponent.extents = this._mySetup.myImportExportButtonCollisionExtents;

        this.myExportButtonBackgroundComponent = this.myExportButtonBackground.pp_addComponent(MeshComponent);
        this.myExportButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myExportButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myExportButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myExportButtonTextComponent = this.myExportButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myExportButtonTextComponent);
        this.myExportButtonTextComponent.text = this._mySetup.myExportButtonText;

        this.myExportButtonCursorTargetComponent = this.myExportButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myExportButtonCollisionComponent = this.myExportButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myExportButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myExportButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myExportButtonCollisionComponent.extents = this._mySetup.myImportExportButtonCollisionExtents;

        // Pointer

        this.myPointerCollisionComponent = this.myPointerCursorTarget.pp_addComponent(CollisionComponent);
        this.myPointerCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPointerCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPointerCollisionComponent.extents = this._mySetup.myPointerCollisionExtents;

        this._addComponentsHook();
    }

    _setupTextComponent(textComponent) {
        textComponent.alignment = this._mySetup.myTextAlignment;
        textComponent.justification = this._mySetup.myTextJustification;
        textComponent.material = this._myAdditionalSetup.myTextMaterial.clone();
        textComponent.material.color = this._mySetup.myTextColor;
        textComponent.text = "";
    }

    _onXRSessionStart() {
        this._setTransformForVR();
    }

    _onXRSessionEnd() {
        this._setTransformForNonVR();
    }

    _setTransformForVR() {
        this.myPivotObject.pp_setPositionLocal(this._mySetup.myPivotObjectPositions[this._myAdditionalSetup.myHandedness]);
    }

    _setTransformForNonVR() {
        this.myPivotObject.pp_setPositionLocal(this._mySetup.myPivotObjectPositions[ToolHandedness.NONE]);
    }
}
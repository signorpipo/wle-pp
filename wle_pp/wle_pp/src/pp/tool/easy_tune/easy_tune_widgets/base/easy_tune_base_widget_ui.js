import { CollisionComponent, MeshComponent, TextComponent } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";
import { XRUtils } from "../../../../cauldron/utils/xr_utils.js";
import { Globals } from "../../../../pp/globals.js";
import { ToolHandedness } from "../../../cauldron/tool_types.js";

export class EasyTuneBaseWidgetUI {

    constructor(engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._myDestroyed = false;
    }

    build(parentObject, config, params) {
        this._myParentObject = parentObject;
        this._myConfig = config;
        this._myParams = params;

        this._myImportExportButtonsVisible = true;

        this._myPlaneMesh = Globals.getDefaultMeshes(this._myEngine).myDoubleSidedPlane;

        this._buildHook();

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();

        this._setTransformForNonXR();

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false, this._myEngine);
    }

    setVisible(visible) {
        this.myPivotObject.pp_setActive(visible);

        if (visible) {
            this.setImportExportButtonsVisible(this._myImportExportButtonsVisible);
        }

        this._setVisibleHook(visible);
    }

    setImportExportButtonsVisible(visible) {
        this._myImportExportButtonsVisible = visible;

        this.myImportExportPanel.pp_setActive(this._myImportExportButtonsVisible);
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
        this.myPivotObject.pp_setPositionLocal(this._myConfig.myPivotObjectPositions[this._myParams.myHandedness]);

        this.myBackPanel.pp_setPositionLocal(this._myConfig.myBackPanelPosition);
        this.myBackBackground.pp_scaleObject(this._myConfig.myBackBackgroundScale);

        // Display
        this.myDisplayPanel.pp_setPositionLocal(this._myConfig.myDisplayPanelPosition);

        this.myVariableLabelPanel.pp_setPositionLocal(this._myConfig.myVariableLabelPanelPosition);
        this.myVariableLabelText.pp_scaleObject(this._myConfig.myVariableLabelTextScale);
        this.myVariableLabelCursorTarget.pp_setPositionLocal(this._myConfig.myVariableLabelCursorTargetPosition);

        // Next/Previous

        this.myNextButtonPanel.pp_setPositionLocal(this._myConfig.myRightSideButtonPosition);
        this.myNextButtonBackground.pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
        this.myNextButtonText.pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
        this.myNextButtonText.pp_scaleObject(this._myConfig.mySideButtonTextScale);
        this.myNextButtonCursorTarget.pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

        this.myPreviousButtonPanel.pp_setPositionLocal(this._myConfig.myLeftSideButtonPosition);
        this.myPreviousButtonBackground.pp_scaleObject(this._myConfig.mySideButtonBackgroundScale);
        this.myPreviousButtonText.pp_setPositionLocal(this._myConfig.mySideButtonTextPosition);
        this.myPreviousButtonText.pp_scaleObject(this._myConfig.mySideButtonTextScale);
        this.myPreviousButtonCursorTarget.pp_setPositionLocal(this._myConfig.mySideButtonCursorTargetPosition);

        // Import/Export

        this.myImportExportPanel.pp_setPositionLocal(this._myConfig.myImportExportPanelPosition);

        this.myImportButtonPanel.pp_setPositionLocal(this._myConfig.myImportButtonPosition);
        this.myImportButtonBackground.pp_scaleObject(this._myConfig.myImportExportButtonBackgroundScale);
        this.myImportButtonText.pp_setPositionLocal(this._myConfig.myImportExportButtonTextPosition);
        this.myImportButtonText.pp_scaleObject(this._myConfig.myImportExportButtonTextScale);
        this.myImportButtonCursorTarget.pp_setPositionLocal(this._myConfig.myImportExportButtonCursorTargetPosition);

        this.myExportButtonPanel.pp_setPositionLocal(this._myConfig.myExportButtonPosition);
        this.myExportButtonBackground.pp_scaleObject(this._myConfig.myImportExportButtonBackgroundScale);
        this.myExportButtonText.pp_setPositionLocal(this._myConfig.myImportExportButtonTextPosition);
        this.myExportButtonText.pp_scaleObject(this._myConfig.myImportExportButtonTextScale);
        this.myExportButtonCursorTarget.pp_setPositionLocal(this._myConfig.myImportExportButtonCursorTargetPosition);

        // Pointer

        this.myPointerCursorTarget.pp_setPositionLocal(this._myConfig.myPointerCursorTargetPosition);

        this._setTransformHook();
    }

    // Components

    _addComponents() {
        this.myBackBackgroundComponent = this.myBackBackground.pp_addComponent(MeshComponent);
        this.myBackBackgroundComponent.mesh = this._myPlaneMesh;
        this.myBackBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myBackBackgroundComponent.material.color = this._myConfig.myBackBackgroundColor;

        // Display

        this.myVariableLabelTextComponent = this.myVariableLabelText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myVariableLabelTextComponent);
        this.myVariableLabelTextComponent.text = " ";

        this.myVariableLabelCursorTargetComponent = this.myVariableLabelCursorTarget.pp_addComponent(CursorTarget);
        this.myVariableLabelCollisionComponent = this.myVariableLabelCursorTarget.pp_addComponent(CollisionComponent);
        this.myVariableLabelCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myVariableLabelCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myVariableLabelCollisionComponent.extents = this._myConfig.myVariableLabelCollisionExtents;

        // Next/Previous

        this.myNextButtonBackgroundComponent = this.myNextButtonBackground.pp_addComponent(MeshComponent);
        this.myNextButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myNextButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myNextButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myNextButtonTextComponent = this.myNextButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myNextButtonTextComponent);
        this.myNextButtonTextComponent.text = this._myConfig.myNextButtonText;

        this.myNextButtonCursorTargetComponent = this.myNextButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myNextButtonCollisionComponent = this.myNextButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myNextButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myNextButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myNextButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        this.myPreviousButtonBackgroundComponent = this.myPreviousButtonBackground.pp_addComponent(MeshComponent);
        this.myPreviousButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPreviousButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myPreviousButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myPreviousButtonTextComponent = this.myPreviousButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myPreviousButtonTextComponent);
        this.myPreviousButtonTextComponent.text = this._myConfig.myPreviousButtonText;

        this.myPreviousButtonCursorTargetComponent = this.myPreviousButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myPreviousButtonCollisionComponent = this.myPreviousButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myPreviousButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myPreviousButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myPreviousButtonCollisionComponent.extents = this._myConfig.mySideButtonCollisionExtents;

        // Import/Export

        this.myImportButtonBackgroundComponent = this.myImportButtonBackground.pp_addComponent(MeshComponent);
        this.myImportButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myImportButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myImportButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myImportButtonTextComponent = this.myImportButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myImportButtonTextComponent);
        this.myImportButtonTextComponent.text = this._myConfig.myImportButtonText;

        this.myImportButtonCursorTargetComponent = this.myImportButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myImportButtonCollisionComponent = this.myImportButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myImportButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myImportButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myImportButtonCollisionComponent.extents = this._myConfig.myImportExportButtonCollisionExtents;

        this.myExportButtonBackgroundComponent = this.myExportButtonBackground.pp_addComponent(MeshComponent);
        this.myExportButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myExportButtonBackgroundComponent.material = this._myParams.myPlaneMaterial.clone();
        this.myExportButtonBackgroundComponent.material.color = this._myConfig.myBackgroundColor;

        this.myExportButtonTextComponent = this.myExportButtonText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myExportButtonTextComponent);
        this.myExportButtonTextComponent.text = this._myConfig.myExportButtonText;

        this.myExportButtonCursorTargetComponent = this.myExportButtonCursorTarget.pp_addComponent(CursorTarget);
        this.myExportButtonCollisionComponent = this.myExportButtonCursorTarget.pp_addComponent(CollisionComponent);
        this.myExportButtonCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myExportButtonCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myExportButtonCollisionComponent.extents = this._myConfig.myImportExportButtonCollisionExtents;

        // Pointer

        this.myPointerCollisionComponent = this.myPointerCursorTarget.pp_addComponent(CollisionComponent);
        this.myPointerCollisionComponent.collider = this._myConfig.myCursorTargetCollisionCollider;
        this.myPointerCollisionComponent.group = 1 << this._myConfig.myCursorTargetCollisionGroup;
        this.myPointerCollisionComponent.extents = this._myConfig.myPointerCollisionExtents;

        this._addComponentsHook();
    }

    _setupTextComponent(textComponent) {
        textComponent.alignment = this._myConfig.myTextAlignment;
        textComponent.justification = this._myConfig.myTextJustification;
        textComponent.material = this._myParams.myTextMaterial.clone();
        textComponent.material.color = this._myConfig.myTextColor;
        textComponent.text = "";
    }

    _onXRSessionStart() {
        this._setTransformForXR();
    }

    _onXRSessionEnd() {
        this._setTransformForNonXR();
    }

    _setTransformForXR() {
        this.myPivotObject.pp_setPositionLocal(this._myConfig.myPivotObjectPositions[this._myParams.myHandedness]);
    }

    _setTransformForNonXR() {
        this.myPivotObject.pp_setPositionLocal(this._myConfig.myPivotObjectPositions[ToolHandedness.NONE]);
    }

    destroy() {
        this._myDestroyed = true;

        XRUtils.unregisterSessionStartEndEventListeners(this, this._myEngine);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
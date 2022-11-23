
PP.EasyTuneBaseWidgetUI = class EasyTuneBaseWidgetUI {

    build(parentObject, setup, additionalSetup) {
        this._myParentObject = parentObject;
        this._mySetup = setup;
        this._myAdditionalSetup = additionalSetup;

        this._myImportExportButtonsActive = true;

        this._myPlaneMesh = PP.myDefaultResources.myMeshes.myPlane;

        this._buildHook();

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();

        this._setTransformForNonVR();

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    }

    setVisible(visible) {
        this.myPivotObject.pp_setActiveHierarchy(visible);

        if (visible) {
            this.setImportExportButtonsActive(this._myImportExportButtonsActive);
        }

        this._setVisibleHook(visible);
    }

    setImportExportButtonsActive(active) {
        this._myImportExportButtonsActive = active;

        this.myImportExportPanel.pp_setActiveHierarchy(this._myImportExportButtonsActive);
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
        this.myPivotObject = WL.scene.addObject(this._myParentObject);

        this.myBackPanel = WL.scene.addObject(this.myPivotObject);
        this.myBackBackground = WL.scene.addObject(this.myBackPanel);

        // Display

        this.myDisplayPanel = WL.scene.addObject(this.myPivotObject);

        this.myVariableLabelPanel = WL.scene.addObject(this.myDisplayPanel);
        this.myVariableLabelText = WL.scene.addObject(this.myVariableLabelPanel);
        this.myVariableLabelCursorTarget = WL.scene.addObject(this.myVariableLabelPanel);

        // Next/Previous

        this.myNextButtonPanel = WL.scene.addObject(this.myVariableLabelPanel);
        this.myNextButtonBackground = WL.scene.addObject(this.myNextButtonPanel);
        this.myNextButtonText = WL.scene.addObject(this.myNextButtonPanel);
        this.myNextButtonCursorTarget = WL.scene.addObject(this.myNextButtonPanel);

        this.myPreviousButtonPanel = WL.scene.addObject(this.myVariableLabelPanel);
        this.myPreviousButtonBackground = WL.scene.addObject(this.myPreviousButtonPanel);
        this.myPreviousButtonText = WL.scene.addObject(this.myPreviousButtonPanel);
        this.myPreviousButtonCursorTarget = WL.scene.addObject(this.myPreviousButtonPanel);

        // Import/Export

        this.myImportExportPanel = WL.scene.addObject(this.myPivotObject);

        this.myImportButtonPanel = WL.scene.addObject(this.myImportExportPanel);
        this.myImportButtonBackground = WL.scene.addObject(this.myImportButtonPanel);
        this.myImportButtonText = WL.scene.addObject(this.myImportButtonPanel);
        this.myImportButtonCursorTarget = WL.scene.addObject(this.myImportButtonPanel);

        this.myExportButtonPanel = WL.scene.addObject(this.myImportExportPanel);
        this.myExportButtonBackground = WL.scene.addObject(this.myExportButtonPanel);
        this.myExportButtonText = WL.scene.addObject(this.myExportButtonPanel);
        this.myExportButtonCursorTarget = WL.scene.addObject(this.myExportButtonPanel);

        // Pointer

        this.myPointerCursorTarget = WL.scene.addObject(this.myPivotObject);

        this._createSkeletonHook();
    }

    // Transforms

    _setTransforms() {
        this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPositions[this._myAdditionalSetup.myHandedness]);

        this.myBackPanel.setTranslationLocal(this._mySetup.myBackPanelPosition);
        this.myBackBackground.scale(this._mySetup.myBackBackgroundScale);

        // Display
        this.myDisplayPanel.setTranslationLocal(this._mySetup.myDisplayPanelPosition);

        this.myVariableLabelPanel.setTranslationLocal(this._mySetup.myVariableLabelPanelPosition);
        this.myVariableLabelText.scale(this._mySetup.myVariableLabelTextScale);
        this.myVariableLabelCursorTarget.setTranslationLocal(this._mySetup.myVariableLabelCursorTargetPosition);

        // Next/Previous

        this.myNextButtonPanel.setTranslationLocal(this._mySetup.myRightSideButtonPosition);
        this.myNextButtonBackground.scale(this._mySetup.mySideButtonBackgroundScale);
        this.myNextButtonText.setTranslationLocal(this._mySetup.mySideButtonTextPosition);
        this.myNextButtonText.scale(this._mySetup.mySideButtonTextScale);
        this.myNextButtonCursorTarget.setTranslationLocal(this._mySetup.mySideButtonCursorTargetPosition);

        this.myPreviousButtonPanel.setTranslationLocal(this._mySetup.myLeftSideButtonPosition);
        this.myPreviousButtonBackground.scale(this._mySetup.mySideButtonBackgroundScale);
        this.myPreviousButtonText.setTranslationLocal(this._mySetup.mySideButtonTextPosition);
        this.myPreviousButtonText.scale(this._mySetup.mySideButtonTextScale);
        this.myPreviousButtonCursorTarget.setTranslationLocal(this._mySetup.mySideButtonCursorTargetPosition);

        // Import/Export

        this.myImportExportPanel.setTranslationLocal(this._mySetup.myImportExportPanelPosition);

        this.myImportButtonPanel.setTranslationLocal(this._mySetup.myImportButtonPosition);
        this.myImportButtonBackground.scale(this._mySetup.myImportExportButtonBackgroundScale);
        this.myImportButtonText.setTranslationLocal(this._mySetup.myImportExportButtonTextPosition);
        this.myImportButtonText.scale(this._mySetup.myImportExportButtonTextScale);
        this.myImportButtonCursorTarget.setTranslationLocal(this._mySetup.myImportExportButtonCursorTargetPosition);

        this.myExportButtonPanel.setTranslationLocal(this._mySetup.myExportButtonPosition);
        this.myExportButtonBackground.scale(this._mySetup.myImportExportButtonBackgroundScale);
        this.myExportButtonText.setTranslationLocal(this._mySetup.myImportExportButtonTextPosition);
        this.myExportButtonText.scale(this._mySetup.myImportExportButtonTextScale);
        this.myExportButtonCursorTarget.setTranslationLocal(this._mySetup.myImportExportButtonCursorTargetPosition);

        // Pointer

        this.myPointerCursorTarget.setTranslationLocal(this._mySetup.myPointerCursorTargetPosition);

        this._setTransformHook();
    }

    // Components

    _addComponents() {
        this.myBackBackgroundComponent = this.myBackBackground.addComponent('mesh');
        this.myBackBackgroundComponent.mesh = this._myPlaneMesh;
        this.myBackBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myBackBackgroundComponent.material.color = this._mySetup.myBackBackgroundColor;

        // Display

        this.myVariableLabelTextComponent = this.myVariableLabelText.addComponent('text');
        this._setupTextComponent(this.myVariableLabelTextComponent);
        this.myVariableLabelTextComponent.text = " ";

        this.myVariableLabelCursorTargetComponent = this.myVariableLabelCursorTarget.addComponent('cursor-target');
        this.myVariableLabelCollisionComponent = this.myVariableLabelCursorTarget.addComponent('collision');
        this.myVariableLabelCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myVariableLabelCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myVariableLabelCollisionComponent.extents = this._mySetup.myVariableLabelCollisionExtents;

        // Next/Previous

        this.myNextButtonBackgroundComponent = this.myNextButtonBackground.addComponent('mesh');
        this.myNextButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myNextButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myNextButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myNextButtonTextComponent = this.myNextButtonText.addComponent('text');
        this._setupTextComponent(this.myNextButtonTextComponent);
        this.myNextButtonTextComponent.text = this._mySetup.myNextButtonText;

        this.myNextButtonCursorTargetComponent = this.myNextButtonCursorTarget.addComponent('cursor-target');
        this.myNextButtonCollisionComponent = this.myNextButtonCursorTarget.addComponent('collision');
        this.myNextButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myNextButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myNextButtonCollisionComponent.extents = this._mySetup.mySideButtonCollisionExtents;

        this.myPreviousButtonBackgroundComponent = this.myPreviousButtonBackground.addComponent('mesh');
        this.myPreviousButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPreviousButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myPreviousButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myPreviousButtonTextComponent = this.myPreviousButtonText.addComponent('text');
        this._setupTextComponent(this.myPreviousButtonTextComponent);
        this.myPreviousButtonTextComponent.text = this._mySetup.myPreviousButtonText;

        this.myPreviousButtonCursorTargetComponent = this.myPreviousButtonCursorTarget.addComponent('cursor-target');
        this.myPreviousButtonCollisionComponent = this.myPreviousButtonCursorTarget.addComponent('collision');
        this.myPreviousButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPreviousButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPreviousButtonCollisionComponent.extents = this._mySetup.mySideButtonCollisionExtents;

        // Import/Export

        this.myImportButtonBackgroundComponent = this.myImportButtonBackground.addComponent('mesh');
        this.myImportButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myImportButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myImportButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myImportButtonTextComponent = this.myImportButtonText.addComponent('text');
        this._setupTextComponent(this.myImportButtonTextComponent);
        this.myImportButtonTextComponent.text = this._mySetup.myImportButtonText;

        this.myImportButtonCursorTargetComponent = this.myImportButtonCursorTarget.addComponent('cursor-target');
        this.myImportButtonCollisionComponent = this.myImportButtonCursorTarget.addComponent('collision');
        this.myImportButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myImportButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myImportButtonCollisionComponent.extents = this._mySetup.myImportExportButtonCollisionExtents;

        this.myExportButtonBackgroundComponent = this.myExportButtonBackground.addComponent('mesh');
        this.myExportButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myExportButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myExportButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myExportButtonTextComponent = this.myExportButtonText.addComponent('text');
        this._setupTextComponent(this.myExportButtonTextComponent);
        this.myExportButtonTextComponent.text = this._mySetup.myExportButtonText;

        this.myExportButtonCursorTargetComponent = this.myExportButtonCursorTarget.addComponent('cursor-target');
        this.myExportButtonCollisionComponent = this.myExportButtonCursorTarget.addComponent('collision');
        this.myExportButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myExportButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myExportButtonCollisionComponent.extents = this._mySetup.myImportExportButtonCollisionExtents;

        // Pointer

        this.myPointerCollisionComponent = this.myPointerCursorTarget.addComponent('collision');
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
        this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPositions[this._myAdditionalSetup.myHandedness]);
    }

    _setTransformForNonVR() {
        this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPositions[PP.ToolHandedness.NONE]);
    }
};
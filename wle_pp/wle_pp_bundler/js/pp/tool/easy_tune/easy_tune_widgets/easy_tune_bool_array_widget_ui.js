
PP.EasyTuneBoolArrayWidgetUI = class EasyTuneBoolArrayWidgetUI {

    build(parentObject, setup, additionalSetup) {
        this._myParentObject = parentObject;
        this._mySetup = setup;
        this._myAdditionalSetup = additionalSetup;

        this._myAdditionalButtonsActive = true;

        this._myPlaneMesh = PP.MeshUtils.createPlaneMesh();

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();
    }

    setVisible(visible) {
        this.myPivotObject.pp_setActiveHierarchy(visible);
        if (visible) {
            this.setAdditionalButtonsActive(this._myAdditionalButtonsActive);
        }
    }

    setAdditionalButtonsActive(active) {
        this._myAdditionalButtonsActive = active;

        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            this.myValueIncreaseButtonPanels[i].pp_setActiveHierarchy(this._myAdditionalButtonsActive);
            this.myValueDecreaseButtonPanels[i].pp_setActiveHierarchy(this._myAdditionalButtonsActive);
        }
    }

    //Skeleton
    _createSkeleton() {
        this.myPivotObject = WL.scene.addObject(this._myParentObject);

        this.myBackPanel = WL.scene.addObject(this.myPivotObject);
        this.myBackBackground = WL.scene.addObject(this.myBackPanel);

        this._createDisplaySkeleton();
        this._createPointerSkeleton();
    }

    _createDisplaySkeleton() {
        this.myDisplayPanel = WL.scene.addObject(this.myPivotObject);

        this.myVariableLabelPanel = WL.scene.addObject(this.myDisplayPanel);
        this.myVariableLabelText = WL.scene.addObject(this.myVariableLabelPanel);
        this.myVariableLabelCursorTarget = WL.scene.addObject(this.myVariableLabelPanel);

        //Next/Previous
        this.myNextButtonPanel = WL.scene.addObject(this.myVariableLabelPanel);
        this.myNextButtonBackground = WL.scene.addObject(this.myNextButtonPanel);
        this.myNextButtonText = WL.scene.addObject(this.myNextButtonPanel);
        this.myNextButtonCursorTarget = WL.scene.addObject(this.myNextButtonPanel);

        this.myPreviousButtonPanel = WL.scene.addObject(this.myVariableLabelPanel);
        this.myPreviousButtonBackground = WL.scene.addObject(this.myPreviousButtonPanel);
        this.myPreviousButtonText = WL.scene.addObject(this.myPreviousButtonPanel);
        this.myPreviousButtonCursorTarget = WL.scene.addObject(this.myPreviousButtonPanel);

        this.myValuesPanel = WL.scene.addObject(this.myDisplayPanel);

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

        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            this.myValuePanels[i] = WL.scene.addObject(this.myValuesPanel);
            this.myValueTexts[i] = WL.scene.addObject(this.myValuePanels[i]);
            this.myValueCursorTargets[i] = WL.scene.addObject(this.myValuePanels[i]);

            //Increase/Decrease
            this.myValueIncreaseButtonPanels[i] = WL.scene.addObject(this.myValuePanels[i]);
            this.myValueIncreaseButtonBackgrounds[i] = WL.scene.addObject(this.myValueIncreaseButtonPanels[i]);
            this.myValueIncreaseButtonTexts[i] = WL.scene.addObject(this.myValueIncreaseButtonPanels[i]);
            this.myValueIncreaseButtonCursorTargets[i] = WL.scene.addObject(this.myValueIncreaseButtonPanels[i]);

            this.myValueDecreaseButtonPanels[i] = WL.scene.addObject(this.myValuePanels[i]);
            this.myValueDecreaseButtonBackgrounds[i] = WL.scene.addObject(this.myValueDecreaseButtonPanels[i]);
            this.myValueDecreaseButtonTexts[i] = WL.scene.addObject(this.myValueDecreaseButtonPanels[i]);
            this.myValueDecreaseButtonCursorTargets[i] = WL.scene.addObject(this.myValueDecreaseButtonPanels[i]);
        }
    }

    _createPointerSkeleton() {
        this.myPointerCursorTarget = WL.scene.addObject(this.myPivotObject);
    }

    //Transforms
    _setTransforms() {
        this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectPositions[this._myAdditionalSetup.myHandedness]);

        this.myBackPanel.setTranslationLocal(this._mySetup.myBackPanelPosition);
        this.myBackBackground.scale(this._mySetup.myBackBackgroundScale);

        this._setDisplayTransforms();
        this._setPointerTransform();
    }

    _setDisplayTransforms() {
        this.myDisplayPanel.setTranslationLocal(this._mySetup.myDisplayPanelPosition);

        this.myVariableLabelPanel.setTranslationLocal(this._mySetup.myVariableLabelPanelPosition);
        this.myVariableLabelText.scale(this._mySetup.myVariableLabelTextScale);
        this.myVariableLabelCursorTarget.setTranslationLocal(this._mySetup.myVariableLabelCursorTargetPosition);

        //Next/Previous
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

        this.myValuesPanel.setTranslationLocal(this._mySetup.myValuesPanelPosition);

        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            this.myValuePanels[i].setTranslationLocal(this._mySetup.myValuePanelsPositions[i]);
            this.myValueTexts[i].scale(this._mySetup.myValueTextScale);
            this.myValueCursorTargets[i].setTranslationLocal(this._mySetup.myValueCursorTargetPosition);

            this.myValueIncreaseButtonPanels[i].setTranslationLocal(this._mySetup.myRightSideButtonPosition);
            this.myValueIncreaseButtonBackgrounds[i].scale(this._mySetup.mySideButtonBackgroundScale);
            this.myValueIncreaseButtonTexts[i].setTranslationLocal(this._mySetup.mySideButtonTextPosition);
            this.myValueIncreaseButtonTexts[i].scale(this._mySetup.mySideButtonTextScale);
            this.myValueIncreaseButtonCursorTargets[i].setTranslationLocal(this._mySetup.mySideButtonCursorTargetPosition);

            this.myValueDecreaseButtonPanels[i].setTranslationLocal(this._mySetup.myLeftSideButtonPosition);
            this.myValueDecreaseButtonBackgrounds[i].scale(this._mySetup.mySideButtonBackgroundScale);
            this.myValueDecreaseButtonTexts[i].setTranslationLocal(this._mySetup.mySideButtonTextPosition);
            this.myValueDecreaseButtonTexts[i].scale(this._mySetup.mySideButtonTextScale);
            this.myValueDecreaseButtonCursorTargets[i].setTranslationLocal(this._mySetup.mySideButtonCursorTargetPosition);
        }
    }

    _setPointerTransform() {
        this.myPointerCursorTarget.setTranslationLocal(this._mySetup.myPointerCursorTargetPosition);
    }

    //Components
    _addComponents() {
        this.myBackBackgroundComponent = this.myBackBackground.addComponent('mesh');
        this.myBackBackgroundComponent.mesh = this._myPlaneMesh;
        this.myBackBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myBackBackgroundComponent.material.color = this._mySetup.myBackBackgroundColor;

        this._addDisplayComponents();
        this._addPointerComponents();
    }

    _addDisplayComponents() {
        this.myVariableLabelTextComponent = this.myVariableLabelText.addComponent('text');
        this._setupTextComponent(this.myVariableLabelTextComponent);
        this.myVariableLabelTextComponent.text = " ";

        this.myVariableLabelCursorTargetComponent = this.myVariableLabelCursorTarget.addComponent('cursor-target');
        this.myVariableLabelCollisionComponent = this.myVariableLabelCursorTarget.addComponent('collision');
        this.myVariableLabelCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myVariableLabelCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myVariableLabelCollisionComponent.extents = this._mySetup.myVariableLabelCollisionExtents;

        //Next/Previous
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


        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            this.myValueTextComponents[i] = this.myValueTexts[i].addComponent('text');
            this._setupTextComponent(this.myValueTextComponents[i]);
            this.myValueTextComponents[i].text = " ";

            this.myValueCursorTargetComponents[i] = this.myValueCursorTargets[i].addComponent('cursor-target');
            this.myValueCollisionComponents[i] = this.myValueCursorTargets[i].addComponent('collision');
            this.myValueCollisionComponents[i].collider = this._mySetup.myCursorTargetCollisionCollider;
            this.myValueCollisionComponents[i].group = 1 << this._mySetup.myCursorTargetCollisionGroup;
            this.myValueCollisionComponents[i].extents = this._mySetup.myValueCollisionExtents;

            //Increase/Decrease
            this.myValueIncreaseButtonBackgroundComponents[i] = this.myValueIncreaseButtonBackgrounds[i].addComponent('mesh');
            this.myValueIncreaseButtonBackgroundComponents[i].mesh = this._myPlaneMesh;
            this.myValueIncreaseButtonBackgroundComponents[i].material = this._myAdditionalSetup.myPlaneMaterial.clone();
            this.myValueIncreaseButtonBackgroundComponents[i].material.color = this._mySetup.myBackgroundColor;

            this.myValueIncreaseButtonTextComponents[i] = this.myValueIncreaseButtonTexts[i].addComponent('text');
            this._setupTextComponent(this.myValueIncreaseButtonTextComponents[i]);
            this.myValueIncreaseButtonTextComponents[i].text = this._mySetup.myIncreaseButtonText;

            this.myValueIncreaseButtonCursorTargetComponents[i] = this.myValueIncreaseButtonCursorTargets[i].addComponent('cursor-target');
            this.myValueIncreaseButtonCollisionComponents[i] = this.myValueIncreaseButtonCursorTargets[i].addComponent('collision');
            this.myValueIncreaseButtonCollisionComponents[i].collider = this._mySetup.myCursorTargetCollisionCollider;
            this.myValueIncreaseButtonCollisionComponents[i].group = 1 << this._mySetup.myCursorTargetCollisionGroup;
            this.myValueIncreaseButtonCollisionComponents[i].extents = this._mySetup.mySideButtonCollisionExtents;

            this.myValueDecreaseButtonBackgroundComponents[i] = this.myValueDecreaseButtonBackgrounds[i].addComponent('mesh');
            this.myValueDecreaseButtonBackgroundComponents[i].mesh = this._myPlaneMesh;
            this.myValueDecreaseButtonBackgroundComponents[i].material = this._myAdditionalSetup.myPlaneMaterial.clone();
            this.myValueDecreaseButtonBackgroundComponents[i].material.color = this._mySetup.myBackgroundColor;

            this.myValueDecreaseButtonTextComponents[i] = this.myValueDecreaseButtonTexts[i].addComponent('text');
            this._setupTextComponent(this.myValueDecreaseButtonTextComponents[i]);
            this.myValueDecreaseButtonTextComponents[i].text = this._mySetup.myDecreaseButtonText;

            this.myValueDecreaseButtonCursorTargetComponents[i] = this.myValueDecreaseButtonCursorTargets[i].addComponent('cursor-target');
            this.myValueDecreaseButtonCollisionComponents[i] = this.myValueDecreaseButtonCursorTargets[i].addComponent('collision');
            this.myValueDecreaseButtonCollisionComponents[i].collider = this._mySetup.myCursorTargetCollisionCollider;
            this.myValueDecreaseButtonCollisionComponents[i].group = 1 << this._mySetup.myCursorTargetCollisionGroup;
            this.myValueDecreaseButtonCollisionComponents[i].extents = this._mySetup.mySideButtonCollisionExtents;
        }
    }

    _addPointerComponents() {
        this.myPointerCollisionComponent = this.myPointerCursorTarget.addComponent('collision');
        this.myPointerCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPointerCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPointerCollisionComponent.extents = this._mySetup.myPointerCollisionExtents;
    }

    _setupTextComponent(textComponent) {
        textComponent.alignment = this._mySetup.myTextAlignment;
        textComponent.justification = this._mySetup.myTextJustification;
        textComponent.material = this._myAdditionalSetup.myTextMaterial.clone();
        textComponent.material.outlineRange = this._mySetup.myTextOutlineRange;
        textComponent.material.color = this._mySetup.myTextColor;
        textComponent.material.outlineColor = this._mySetup.myTextOutlineColor;
        textComponent.text = "";
    }
};
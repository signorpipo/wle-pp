
PP.EasyTuneNumberArrayWidgetUI = class EasyTuneNumberArrayWidgetUI extends PP.EasyTuneBaseWidgetUI {

    setAdditionalButtonsActive(active) {
        this._myAdditionalButtonsActive = active;

        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            this.myValueIncreaseButtonPanels[i].pp_setActiveHierarchy(this._myAdditionalButtonsActive);
            this.myValueDecreaseButtonPanels[i].pp_setActiveHierarchy(this._myAdditionalButtonsActive);
        }

        this.myStepIncreaseButtonPanel.pp_setActiveHierarchy(this._myAdditionalButtonsActive);
        this.myStepDecreaseButtonPanel.pp_setActiveHierarchy(this._myAdditionalButtonsActive);
    }

    _buildHook() {
        this._myAdditionalButtonsActive = true;
    }

    _createSkeletonHook() {
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

            this.myValueIncreaseButtonPanels[i] = WL.scene.addObject(this.myValuePanels[i]);
            this.myValueIncreaseButtonBackgrounds[i] = WL.scene.addObject(this.myValueIncreaseButtonPanels[i]);
            this.myValueIncreaseButtonTexts[i] = WL.scene.addObject(this.myValueIncreaseButtonPanels[i]);
            this.myValueIncreaseButtonCursorTargets[i] = WL.scene.addObject(this.myValueIncreaseButtonPanels[i]);

            this.myValueDecreaseButtonPanels[i] = WL.scene.addObject(this.myValuePanels[i]);
            this.myValueDecreaseButtonBackgrounds[i] = WL.scene.addObject(this.myValueDecreaseButtonPanels[i]);
            this.myValueDecreaseButtonTexts[i] = WL.scene.addObject(this.myValueDecreaseButtonPanels[i]);
            this.myValueDecreaseButtonCursorTargets[i] = WL.scene.addObject(this.myValueDecreaseButtonPanels[i]);
        }

        this.myStepPanel = WL.scene.addObject(this.myPivotObject);
        this.myStepText = WL.scene.addObject(this.myStepPanel);
        this.myStepCursorTarget = WL.scene.addObject(this.myStepPanel);

        this.myStepIncreaseButtonPanel = WL.scene.addObject(this.myStepPanel);
        this.myStepIncreaseButtonBackground = WL.scene.addObject(this.myStepIncreaseButtonPanel);
        this.myStepIncreaseButtonText = WL.scene.addObject(this.myStepIncreaseButtonPanel);
        this.myStepIncreaseButtonCursorTarget = WL.scene.addObject(this.myStepIncreaseButtonPanel);

        this.myStepDecreaseButtonPanel = WL.scene.addObject(this.myStepPanel);
        this.myStepDecreaseButtonBackground = WL.scene.addObject(this.myStepDecreaseButtonPanel);
        this.myStepDecreaseButtonText = WL.scene.addObject(this.myStepDecreaseButtonPanel);
        this.myStepDecreaseButtonCursorTarget = WL.scene.addObject(this.myStepDecreaseButtonPanel);
    }

    _setTransformHook() {
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

        this.myStepPanel.setTranslationLocal(this._mySetup.myStepPanelPosition);
        this.myStepText.scale(this._mySetup.myStepTextScale);
        this.myStepCursorTarget.setTranslationLocal(this._mySetup.myStepCursorTargetPosition);

        this.myStepIncreaseButtonPanel.setTranslationLocal(this._mySetup.myRightSideButtonPosition);
        this.myStepIncreaseButtonBackground.scale(this._mySetup.mySideButtonBackgroundScale);
        this.myStepIncreaseButtonText.setTranslationLocal(this._mySetup.mySideButtonTextPosition);
        this.myStepIncreaseButtonText.scale(this._mySetup.mySideButtonTextScale);
        this.myStepIncreaseButtonCursorTarget.setTranslationLocal(this._mySetup.mySideButtonCursorTargetPosition);

        this.myStepDecreaseButtonPanel.setTranslationLocal(this._mySetup.myLeftSideButtonPosition);
        this.myStepDecreaseButtonBackground.scale(this._mySetup.mySideButtonBackgroundScale);
        this.myStepDecreaseButtonText.setTranslationLocal(this._mySetup.mySideButtonTextPosition);
        this.myStepDecreaseButtonText.scale(this._mySetup.mySideButtonTextScale);
        this.myStepDecreaseButtonCursorTarget.setTranslationLocal(this._mySetup.mySideButtonCursorTargetPosition);
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


        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            this.myValueTextComponents[i] = this.myValueTexts[i].addComponent('text');
            this._setupTextComponent(this.myValueTextComponents[i]);
            this.myValueTextComponents[i].text = " ";

            this.myValueCursorTargetComponents[i] = this.myValueCursorTargets[i].addComponent('cursor-target');
            this.myValueCollisionComponents[i] = this.myValueCursorTargets[i].addComponent('collision');
            this.myValueCollisionComponents[i].collider = this._mySetup.myCursorTargetCollisionCollider;
            this.myValueCollisionComponents[i].group = 1 << this._mySetup.myCursorTargetCollisionGroup;
            this.myValueCollisionComponents[i].extents = this._mySetup.myValueCollisionExtents;

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

        this.myStepTextComponent = this.myStepText.addComponent('text');
        this._setupTextComponent(this.myStepTextComponent);
        this.myStepTextComponent.text = " ";

        this.myStepCursorTargetComponent = this.myStepCursorTarget.addComponent('cursor-target');
        this.myStepCollisionComponent = this.myStepCursorTarget.addComponent('collision');
        this.myStepCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myStepCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myStepCollisionComponent.extents = this._mySetup.myStepCollisionExtents;

        //Increase/Decrease
        this.myStepIncreaseButtonBackgroundComponent = this.myStepIncreaseButtonBackground.addComponent('mesh');
        this.myStepIncreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myStepIncreaseButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myStepIncreaseButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myStepIncreaseButtonTextComponent = this.myStepIncreaseButtonText.addComponent('text');
        this._setupTextComponent(this.myStepIncreaseButtonTextComponent);
        this.myStepIncreaseButtonTextComponent.text = this._mySetup.myIncreaseButtonText;

        this.myStepIncreaseButtonCursorTargetComponent = this.myStepIncreaseButtonCursorTarget.addComponent('cursor-target');
        this.myStepIncreaseButtonCollisionComponent = this.myStepIncreaseButtonCursorTarget.addComponent('collision');
        this.myStepIncreaseButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myStepIncreaseButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myStepIncreaseButtonCollisionComponent.extents = this._mySetup.mySideButtonCollisionExtents;

        this.myStepDecreaseButtonBackgroundComponent = this.myStepDecreaseButtonBackground.addComponent('mesh');
        this.myStepDecreaseButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myStepDecreaseButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myStepDecreaseButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myStepDecreaseButtonTextComponent = this.myStepDecreaseButtonText.addComponent('text');
        this._setupTextComponent(this.myStepDecreaseButtonTextComponent);
        this.myStepDecreaseButtonTextComponent.text = this._mySetup.myDecreaseButtonText;

        this.myStepDecreaseButtonCursorTargetComponent = this.myStepDecreaseButtonCursorTarget.addComponent('cursor-target');
        this.myStepDecreaseButtonCollisionComponent = this.myStepDecreaseButtonCursorTarget.addComponent('collision');
        this.myStepDecreaseButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myStepDecreaseButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myStepDecreaseButtonCollisionComponent.extents = this._mySetup.mySideButtonCollisionExtents;
    }

    _setVisibleHook(visible) {
        if (visible) {
            this.setAdditionalButtonsActive(this._myAdditionalButtonsActive);
        }
    }
};

PP.EasyTuneBoolArrayWidgetUI = class EasyTuneBoolArrayWidgetUI extends PP.EasyTuneBaseWidgetUI {

    setAdditionalButtonsActive(active) {
        this._myAdditionalButtonsActive = active;

        for (let i = 0; i < this._mySetup.myArraySize; i++) {
            this.myValueIncreaseButtonPanels[i].pp_setActiveHierarchy(this._myAdditionalButtonsActive);
            this.myValueDecreaseButtonPanels[i].pp_setActiveHierarchy(this._myAdditionalButtonsActive);
        }
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
    }

    _setVisibleHook(visible) {
        if (visible) {
            this.setAdditionalButtonsActive(this._myAdditionalButtonsActive);
        }
    }
};

PP.WidgetFrameUI = class WidgetFrameUI {

    constructor() {
        this._myInputSourceType = null;

        this._myParentObject = null;
        this._myIsPinned = false;
    }

    build(parentObject, setup, additionalSetup) {
        this._myParentObject = parentObject;
        this._mySetup = setup;
        this._myAdditionalSetup = additionalSetup;
        this._myPlaneMesh = PP.MeshUtils.createPlaneMesh();

        this._createSkeleton();
        this._setTransforms();
        this._addComponents();
    }

    setWidgetVisible(visible) {
        this.myFlagsButtonPanel.pp_setActiveHierarchy(visible);
        if (visible) {
            this._updateObjectsTransforms(true);
        }
    }

    setVisibilityButtonVisible(visible) {
        this.myVisibilityButtonPanel.pp_setActiveHierarchy(visible);
    }

    setPinned(pinned) {
        if (pinned != this._myIsPinned) {
            this._myIsPinned = pinned;
            if (this._myIsPinned) {
                this.myPivotObject.pp_setParent(null);
            } else {
                this.myPivotObject.pp_setParent(this.myFixForwardObject);
                this._updateObjectsTransforms(true);
            }
        }
    }

    update(dt) {
        this._updateObjectsTransforms(false);
    }

    _updateObjectsTransforms(forceRefreshObjectsTransforms) {
        let inputSourceType = PP.InputUtils.getInputSourceType(this._myAdditionalSetup.myHandedness);

        if (inputSourceType != this._myInputSourceType || forceRefreshObjectsTransforms) {
            this._myInputSourceType = inputSourceType;

            if (!this._myIsPinned) {
                this.myPivotObject.setTranslationLocal(this._mySetup.myPivotObjectTransforms[this._myInputSourceType][this._myAdditionalSetup.myHandedness].myPosition);
                this.myPivotObject.resetRotation();
                this.myPivotObject.rotateObject(this._mySetup.myPivotObjectTransforms[this._myInputSourceType][this._myAdditionalSetup.myHandedness].myRotation);

                this.myWidgetObject.setTranslationLocal(this._mySetup.myWidgetObjectTransforms[this._myInputSourceType][this._myAdditionalSetup.myHandedness].myPosition);
                this.myWidgetObject.resetRotation();
                this.myWidgetObject.rotateObject(this._mySetup.myWidgetObjectTransforms[this._myInputSourceType][this._myAdditionalSetup.myHandedness].myRotation);
            }
        }
    }

    //Skeleton
    _createSkeleton() {
        this.myFixForwardObject = WL.scene.addObject(this._myParentObject);
        this.myFixForwardObject.pp_rotateObject([0, 180, 0]);
        this.myPivotObject = WL.scene.addObject(this.myFixForwardObject);
        this.myWidgetObject = WL.scene.addObject(this.myPivotObject);

        this.myVisibilityButtonPanel = WL.scene.addObject(this.myPivotObject);
        this.myVisibilityButtonBackground = WL.scene.addObject(this.myVisibilityButtonPanel);
        this.myVisibilityButtonText = WL.scene.addObject(this.myVisibilityButtonPanel);
        this.myVisibilityButtonCursorTarget = WL.scene.addObject(this.myVisibilityButtonPanel);

        this.myFlagsButtonPanel = WL.scene.addObject(this.myPivotObject);

        this.myPinButtonPanel = WL.scene.addObject(this.myFlagsButtonPanel);
        this.myPinButtonBackground = WL.scene.addObject(this.myPinButtonPanel);
        this.myPinButtonText = WL.scene.addObject(this.myPinButtonPanel);
        this.myPinButtonCursorTarget = WL.scene.addObject(this.myPinButtonPanel);
    }

    //Transforms
    _setTransforms() {
        this.myPivotObject.setDirty();

        this.myVisibilityButtonPanel.setTranslationLocal(this._mySetup.myVisibilityButtonPosition[this._myAdditionalSetup.myHandedness].myPosition);
        this.myVisibilityButtonBackground.scale(this._mySetup.myVisibilityButtonBackgroundScale);
        this.myVisibilityButtonText.setTranslationLocal(this._mySetup.myVisibilityButtonTextPosition);
        this.myVisibilityButtonText.scale(this._mySetup.myVisibilityButtonTextScale);
        this.myVisibilityButtonCursorTarget.setTranslationLocal(this._mySetup.myVisibilityButtonCursorTargetPosition);

        this.myPinButtonPanel.setTranslationLocal(this._mySetup.myPinButtonPosition[this._myAdditionalSetup.myHandedness].myPosition);

        this.myPinButtonBackground.scale(this._mySetup.myFlagButtonBackgroundScale);
        this.myPinButtonText.setTranslationLocal(this._mySetup.myFlagButtonTextPosition);
        this.myPinButtonText.scale(this._mySetup.myFlagButtonTextScale);
        this.myPinButtonCursorTarget.setTranslationLocal(this._mySetup.myPinButtonCursorTargetPosition);
    }

    //Components
    _addComponents() {
        this.myVisibilityButtonBackgroundComponent = this.myVisibilityButtonBackground.addComponent('mesh');
        this.myVisibilityButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myVisibilityButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myVisibilityButtonBackgroundComponent.material.color = this._mySetup.myBackgroundColor;

        this.myVisibilityButtonTextComponent = this.myVisibilityButtonText.addComponent('text');
        this._setupButtonTextComponent(this.myVisibilityButtonTextComponent);
        this.myVisibilityButtonTextComponent.text = this._mySetup.myVisibilityButtonText;

        this.myVisibilityButtonCursorTargetComponent = this.myVisibilityButtonCursorTarget.addComponent('cursor-target');
        this.myVisibilityButtonCollisionComponent = this.myVisibilityButtonCursorTarget.addComponent('collision');
        this.myVisibilityButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myVisibilityButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myVisibilityButtonCollisionComponent.extents = this._mySetup.myVisibilityButtonCollisionExtents;

        this.myPinButtonBackgroundComponent = this.myPinButtonBackground.addComponent('mesh');
        this.myPinButtonBackgroundComponent.mesh = this._myPlaneMesh;
        this.myPinButtonBackgroundComponent.material = this._myAdditionalSetup.myPlaneMaterial.clone();
        this.myPinButtonBackgroundComponent.material.color = this._mySetup.myButtonDisabledBackgroundColor;

        this.myPinButtonTextComponent = this.myPinButtonText.addComponent('text');
        this._setupButtonTextComponent(this.myPinButtonTextComponent);
        this.myPinButtonTextComponent.material.color = this._mySetup.myButtonDisabledTextColor;
        this.myPinButtonTextComponent.text = this._mySetup.myPinButtonText;

        this.myPinButtonCursorTargetComponent = this.myPinButtonCursorTarget.addComponent('cursor-target');

        this.myPinButtonCollisionComponent = this.myPinButtonCursorTarget.addComponent('collision');
        this.myPinButtonCollisionComponent.collider = this._mySetup.myCursorTargetCollisionCollider;
        this.myPinButtonCollisionComponent.group = 1 << this._mySetup.myCursorTargetCollisionGroup;
        this.myPinButtonCollisionComponent.extents = this._mySetup.myPinButtonCollisionExtents;
    }

    _setupButtonTextComponent(textComponent) {
        textComponent.alignment = this._mySetup.myTextAlignment;
        textComponent.justification = this._mySetup.myTextJustification;
        textComponent.material = this._myAdditionalSetup.myTextMaterial.clone();
        textComponent.material.color = this._mySetup.myTextColor;
        textComponent.text = "";
    }
};
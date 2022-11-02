
PP.WidgetFrame = class WidgetFrame {

    constructor(widgetLetterID, buttonsColumnIndex) {
        this.myIsWidgetVisible = true;
        this.myIsPinned = false;

        this._mySetup = new PP.WidgetFrameSetup(widgetLetterID, buttonsColumnIndex);
        this._myAdditionalSetup = null;

        this._myUI = new PP.WidgetFrameUI();
        this._myShowVisibilityButton = false;

        this._myWidgetVisibleChangedCallbacks = new Map();      // Signature: callback(isWidgetVisible)
        this._myPinChangedCallbacks = new Map();                // Signature: callback(isPinned)
    }

    getWidgetObject() {
        return this._myUI.myWidgetObject;
    }

    setVisible(visible) {
        this.myIsWidgetVisible = !visible;
        this._toggleVisibility(false, true);
    }

    isVisible() {
        return this.myIsWidgetVisible;
    }

    toggleVisibility() {
        this._toggleVisibility(false, true);
    }

    togglePin() {
        this._togglePin(false);
    }

    registerWidgetVisibleChangedEventListener(id, callback) {
        this._myWidgetVisibleChangedCallbacks.set(id, callback);
    }

    unregisterWidgetVisibleChangedEventListener(id) {
        this._myWidgetVisibleChangedCallbacks.delete(id);
    }

    registerPinChangedEventListener(id, callback) {
        this._myPinChangedCallbacks.set(id, callback);
    }

    unregisterPinChangedEventListener(id) {
        this._myPinChangedCallbacks.delete(id);
    }

    start(parentObject, additionalSetup) {
        this._myAdditionalSetup = additionalSetup;

        this._myUI.build(parentObject, this._mySetup, additionalSetup);
        this._myUI.setVisibilityButtonVisible(additionalSetup.myShowVisibilityButton);
        this._myShowVisibilityButton = additionalSetup.myShowVisibilityButton;
        if (!additionalSetup.myShowOnStart) {
            this._toggleVisibility(false, false);
        }

        this._addListeners();
    }

    update(dt) {
        this._myUI.update(dt);
    }

    _addListeners() {
        let ui = this._myUI;

        ui.myPinButtonCursorTargetComponent.addClickFunction(this._togglePin.bind(this, true));
        ui.myPinButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myPinButtonBackgroundComponent.material));
        ui.myPinButtonCursorTargetComponent.addUnHoverFunction(this._pinUnHover.bind(this, ui.myPinButtonBackgroundComponent.material));

        ui.myVisibilityButtonCursorTargetComponent.addClickFunction(this._toggleVisibility.bind(this, true, true));
        ui.myVisibilityButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));
        ui.myVisibilityButtonCursorTargetComponent.addUnHoverFunction(this._visibilityUnHover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));
    }

    _toggleVisibility(isButton, notify) {
        this.myIsWidgetVisible = !this.myIsWidgetVisible;

        this._myUI.setWidgetVisible(this.myIsWidgetVisible);

        let textMaterial = this._myUI.myVisibilityButtonTextComponent.material;
        let backgroundMaterial = this._myUI.myVisibilityButtonBackgroundComponent.material;
        if (this.myIsWidgetVisible) {
            textMaterial.color = this._mySetup.myDefaultTextColor;
            if (!isButton) {
                backgroundMaterial.color = this._mySetup.myBackgroundColor;
            }
        } else {
            textMaterial.color = this._mySetup.myButtonDisabledTextColor;
            if (!isButton) {
                backgroundMaterial.color = this._mySetup.myButtonDisabledBackgroundColor;
            }
        }

        if (notify) {
            for (let callback of this._myWidgetVisibleChangedCallbacks.values()) {
                callback(this.myIsWidgetVisible);
            }
        }

        this._myUI.setVisibilityButtonVisible(this._myShowVisibilityButton);
    }

    _togglePin(isButton) {
        if (this.myIsWidgetVisible) {
            this.myIsPinned = !this.myIsPinned;

            this._myUI.setPinned(this.myIsPinned);

            let textMaterial = this._myUI.myPinButtonTextComponent.material;
            let backgroundMaterial = this._myUI.myPinButtonBackgroundComponent.material;
            if (this.myIsPinned) {
                textMaterial.color = this._mySetup.myDefaultTextColor;
                if (!isButton) {
                    backgroundMaterial.color = this._mySetup.myBackgroundColor;
                }
            } else {
                textMaterial.color = this._mySetup.myButtonDisabledTextColor;
                if (!isButton) {
                    backgroundMaterial.color = this._mySetup.myButtonDisabledBackgroundColor;
                }
            }

            for (let callback of this._myPinChangedCallbacks.values()) {
                callback(this.myIsPinned);
            }
        }
    }

    _genericHover(material) {
        material.color = this._mySetup.myButtonHoverColor;
    }

    _visibilityUnHover(material) {
        if (this.myIsWidgetVisible) {
            material.color = this._mySetup.myBackgroundColor;
        } else {
            material.color = this._mySetup.myButtonDisabledBackgroundColor;
        }
    }

    _pinUnHover(material) {
        if (this.myIsPinned) {
            material.color = this._mySetup.myBackgroundColor;
        } else {
            material.color = this._mySetup.myButtonDisabledBackgroundColor;
        }
    }
};
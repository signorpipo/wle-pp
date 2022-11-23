
PP.EasyTuneNoneWidgetUI = class EasyTuneNoneWidgetUI extends PP.EasyTuneBaseWidgetUI {

    _createSkeletonHook() {
        this.myTypeNotSupportedPanel = WL.scene.addObject(this.myDisplayPanel);
        this.myTypeNotSupportedText = WL.scene.addObject(this.myTypeNotSupportedPanel);
        this.myTypeNotSupportedCursorTarget = WL.scene.addObject(this.myTypeNotSupportedPanel);
    }

    _setTransformHook() {
        this.myTypeNotSupportedPanel.setTranslationLocal(this._mySetup.myTypeNotSupportedPanelPosition);
        this.myTypeNotSupportedText.scale(this._mySetup.myTypeNotSupportedTextScale);
    }

    _addComponentsHook() {
        this.myTypeNotSupportedTextComponent = this.myTypeNotSupportedText.addComponent('text');
        this._setupTextComponent(this.myTypeNotSupportedTextComponent);
        this.myTypeNotSupportedTextComponent.text = this._mySetup.myTypeNotSupportedText;
    }
};
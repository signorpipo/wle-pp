import { TextComponent } from "@wonderlandengine/api";
import { EasyTuneBaseWidgetUI } from "../base/easy_tune_base_widget_ui.js";

export class EasyTuneNoneWidgetUI extends EasyTuneBaseWidgetUI {

    constructor(engine) {
        super(engine);
    }

    _createSkeletonHook() {
        this.myTypeNotSupportedPanel = this.myDisplayPanel.pp_addChild();
        this.myTypeNotSupportedText = this.myTypeNotSupportedPanel.pp_addChild();
        this.myTypeNotSupportedCursorTarget = this.myTypeNotSupportedPanel.pp_addChild();
    }

    _setTransformHook() {
        this.myTypeNotSupportedPanel.pp_setPositionLocal(this._myConfig.myTypeNotSupportedPanelPosition);
        this.myTypeNotSupportedText.pp_scaleObject(this._myConfig.myTypeNotSupportedTextScale);
    }

    _addComponentsHook() {
        this.myTypeNotSupportedTextComponent = this.myTypeNotSupportedText.pp_addComponent(TextComponent);
        this._setupTextComponent(this.myTypeNotSupportedTextComponent);
        this.myTypeNotSupportedTextComponent.text = this._myConfig.myTypeNotSupportedText;
    }
}
import { TextComponent } from "@wonderlandengine/api";
import { EasyTuneBaseWidgetUI } from "../base/easy_tune_base_widget_ui";

export class EasyTuneNoneWidgetUI extends EasyTuneBaseWidgetUI {

    constructor(engine) {
        super(engine);
    }

    _createSkeletonHook() {
        this.myTypeNotSupportedPanel = this.myDisplayPanel.pp_addObject();
        this.myTypeNotSupportedText = this.myTypeNotSupportedPanel.pp_addObject();
        this.myTypeNotSupportedCursorTarget = this.myTypeNotSupportedPanel.pp_addObject();
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
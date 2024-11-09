import { Emitter } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { ToolHandedness } from "../cauldron/tool_types.js";
import { WidgetFrameConfig } from "./widget_frame_config.js";
import { WidgetFrameUI } from "./widget_frame_ui.js";

export class WidgetParams {

    constructor() {
        this.myHandedness = ToolHandedness.NONE;

        this.myPlaneMaterial = null;
        this.myTextMaterial = null;
    }
}

export class WidgetFrame {

    constructor(widgetLetterID, buttonsColumnIndex, engine = Globals.getMainEngine()) {
        this._myWidgetVisible = true;
        this._myPinned = false;

        this._myConfig = new WidgetFrameConfig(widgetLetterID, buttonsColumnIndex);
        this._myParams = null;

        this._myUI = new WidgetFrameUI(engine);
        this._myShowVisibilityButton = false;

        this._myWidgetVisibleChangedEmitter = new Emitter();      // Signature: listener(widgetVisible)
        this._myPinChangedEmitter = new Emitter();                // Signature: listener(pinned)

        this._myUnhoverCallbacks = [];

        this._myDestroyed = false;
    }

    getWidgetObject() {
        return this._myUI.myWidgetObject;
    }

    setVisible(visible) {
        this._myWidgetVisible = !visible;
        this._toggleVisibility(false, true);
    }

    isVisible() {
        return this._myWidgetVisible;
    }

    toggleVisibility() {
        this._toggleVisibility(false, true);
    }

    togglePin() {
        this._togglePin(false);
    }

    registerWidgetVisibleChangedEventListener(id, listener) {
        this._myWidgetVisibleChangedEmitter.add(listener, { id: id });
    }

    unregisterWidgetVisibleChangedEventListener(id) {
        this._myWidgetVisibleChangedEmitter.remove(id);
    }

    registerPinChangedEventListener(id, listener) {
        this._myPinChangedEmitter.add(listener, { id: id });
    }

    unregisterPinChangedEventListener(id) {
        this._myPinChangedEmitter.remove(id);
    }

    start(parentObject, params) {
        this._myParams = params;

        this._myUI.build(parentObject, this._myConfig, params);
        this._myUI.setVisibilityButtonVisible(params.myShowVisibilityButton);
        this._myShowVisibilityButton = params.myShowVisibilityButton;
        if (!params.myShowOnStart) {
            this._toggleVisibility(false, false);
        }

        this._addListeners();
    }

    update(dt) {
        this._myUI.update(dt);
    }

    _addListeners() {
        let ui = this._myUI;

        this._myUnhoverCallbacks = [];

        ui.myPinButtonCursorTargetComponent.onClick.add(this._togglePin.bind(this, true));
        ui.myPinButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myPinButtonBackgroundComponent.material));
        ui.myPinButtonCursorTargetComponent.onUnhover.add(this._pinUnhover.bind(this, ui.myPinButtonBackgroundComponent.material));

        this._myUnhoverCallbacks.push(this._pinUnhover.bind(this, ui.myPinButtonBackgroundComponent.material));

        ui.myVisibilityButtonCursorTargetComponent.onClick.add(this._toggleVisibility.bind(this, true, true));
        ui.myVisibilityButtonCursorTargetComponent.onHover.add(this._genericHover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));
        ui.myVisibilityButtonCursorTargetComponent.onUnhover.add(this._visibilityUnhover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));

        this._myUnhoverCallbacks.push(this._visibilityUnhover.bind(this, ui.myVisibilityButtonBackgroundComponent.material));
    }

    _toggleVisibility(isButton, notify) {
        this._myWidgetVisible = !this._myWidgetVisible;

        this._myUI.setWidgetVisible(this._myWidgetVisible);

        for (const unhoverCallback of this._myUnhoverCallbacks) {
            unhoverCallback();
        }

        let textMaterial = this._myUI.myVisibilityButtonTextComponent.material;
        let backgroundMaterial = this._myUI.myVisibilityButtonBackgroundComponent.material;
        if (this._myWidgetVisible) {
            textMaterial.color = this._myConfig.myDefaultTextColor;
            if (!isButton) {
                backgroundMaterial.color = this._myConfig.myBackgroundColor;
            }
        } else {
            textMaterial.color = this._myConfig.myButtonDisabledTextColor;
            if (!isButton) {
                backgroundMaterial.color = this._myConfig.myButtonDisabledBackgroundColor;
            }
        }

        if (notify) {
            this._myWidgetVisibleChangedEmitter.notify(this._myWidgetVisible);
        }

        this._myUI.setVisibilityButtonVisible(this._myShowVisibilityButton);
    }

    _togglePin(isButton) {
        if (this._myWidgetVisible) {
            this._myPinned = !this._myPinned;

            this._myUI.setPinned(this._myPinned);

            let textMaterial = this._myUI.myPinButtonTextComponent.material;
            let backgroundMaterial = this._myUI.myPinButtonBackgroundComponent.material;
            if (this._myPinned) {
                textMaterial.color = this._myConfig.myDefaultTextColor;
                if (!isButton) {
                    backgroundMaterial.color = this._myConfig.myBackgroundColor;
                }
            } else {
                textMaterial.color = this._myConfig.myButtonDisabledTextColor;
                if (!isButton) {
                    backgroundMaterial.color = this._myConfig.myButtonDisabledBackgroundColor;
                }
            }

            this._myPinChangedEmitter.notify(this._myPinned);
        }
    }

    _genericHover(material) {
        material.color = this._myConfig.myButtonHoverColor;
    }

    _visibilityUnhover(material) {
        if (this._myWidgetVisible) {
            material.color = this._myConfig.myBackgroundColor;
        } else {
            material.color = this._myConfig.myButtonDisabledBackgroundColor;
        }
    }

    _pinUnhover(material) {
        if (this._myPinned) {
            material.color = this._myConfig.myBackgroundColor;
        } else {
            material.color = this._myConfig.myButtonDisabledBackgroundColor;
        }
    }

    setActive(active) {
        this._myUI.setActive(active);
    }

    destroy() {
        this._myDestroyed = true;

        this.setActive(false);

        if (this._myUI != null) {
            this._myUI.destroy();
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
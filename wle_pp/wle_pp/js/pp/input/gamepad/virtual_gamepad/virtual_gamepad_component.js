import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals";
import { Handedness } from "../../cauldron/input_types";
import { GamepadButtonID } from "../gamepad_buttons";
import { VirtualGamepadGamepadCore } from "../gamepad_cores/virtual_gamepad_gamepad_core";
import { VirtualGamepad } from "./virtual_gamepad";
import { VirtualGamepadParams } from "./virtual_gamepad_params";

export class VirtualGamepadComponent extends Component {
    static TypeName = "pp-virtual-gamepad";
    static Properties = {
        _myShowOnDesktop: Property.bool(false),   // You may have to enable headset too
        _myShowOnMobile: Property.bool(true),
        _myShowOnHeadset: Property.bool(false),   // Not 100% reliable, this is true if the device supports XR and it is Desktop
        _myAddToUniversalGamepad: Property.bool(true),
        _myOpacity: Property.float(0.5),
        _myIconColor: Property.string("#e0e0e0"),
        _myBackgroundColor: Property.string("#616161"),
        _myInterfaceScale: Property.float(1),
        _myMarginScale: Property.float(1),

        ADVANCED_PARAMS_BELOW: Property.string(""),

        _myLabelFontSize: Property.float(2),
        _myLabelFontFamily: Property.string("sans-serif"),
        _myLabelFontWeight: Property.string("bold"),
        _myImagePressedBrightness: Property.float(0.5),

        _myLeftSelectButtonVisible: Property.bool(true),
        _myLeftSelectButtonOrderIndex: Property.int(1),
        _myLeftSelectButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Frame"),
        _myLeftSelectButtonIconLabelOrImageUrl: Property.string(""),

        _myLeftSqueezeButtonVisible: Property.bool(true),
        _myLeftSqueezeButtonOrderIndex: Property.int(0),
        _myLeftSqueezeButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Square"),
        _myLeftSqueezeButtonIconLabelOrImageUrl: Property.string(""),

        _myLeftThumbstickButtonVisible: Property.bool(true),
        _myLeftThumbstickButtonOrderIndex: Property.int(4),
        _myLeftThumbstickButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Dot"),
        _myLeftThumbstickButtonIconLabelOrImageUrl: Property.string(""),

        _myLeftTopButtonVisible: Property.bool(true),
        _myLeftTopButtonOrderIndex: Property.int(2),
        _myLeftTopButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Circle"),
        _myLeftTopButtonIconLabelOrImageUrl: Property.string(""),

        _myLeftBottomButtonVisible: Property.bool(true),
        _myLeftBottomButtonOrderIndex: Property.int(3),
        _myLeftBottomButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Ring"),
        _myLeftBottomButtonIconLabelOrImageUrl: Property.string(""),

        _myRightSelectButtonVisible: Property.bool(true),
        _myRightSelectButtonOrderIndex: Property.int(1),
        _myRightSelectButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Frame"),
        _myRightSelectButtonIconLabelOrImageUrl: Property.string(""),

        _myRightSqueezeButtonVisible: Property.bool(true),
        _myRightSqueezeButtonOrderIndex: Property.int(0),
        _myRightSqueezeButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Square"),
        _myRightSqueezeButtonIconLabelOrImageUrl: Property.string(""),

        _myRightThumbstickButtonVisible: Property.bool(true),
        _myRightThumbstickButtonOrderIndex: Property.int(4),
        _myRightThumbstickButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Dot"),
        _myRightThumbstickButtonIconLabelOrImageUrl: Property.string(""),

        _myRightTopButtonVisible: Property.bool(true),
        _myRightTopButtonOrderIndex: Property.int(2),
        _myRightTopButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Circle"),
        _myRightTopButtonIconLabelOrImageUrl: Property.string(""),

        _myRightBottomButtonVisible: Property.bool(true),
        _myRightBottomButtonOrderIndex: Property.int(3),
        _myRightBottomButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Ring"),
        _myRightBottomButtonIconLabelOrImageUrl: Property.string("")
    };

    start() {
        let params = new VirtualGamepadParams(this.engine);
        params.defaultConfig();

        for (let handedness in params.myButtonParams) {
            for (let gamepadButtonID in params.myButtonParams[handedness]) {
                let buttonParams = params.myButtonParams[handedness][gamepadButtonID];
                buttonParams.myIconParams.myBackgroundColor = this._myBackgroundColor;
                buttonParams.myIconParams.myBackgroundPressedColor = this._myIconColor;
                buttonParams.myIconParams.myIconColor = this._myIconColor;
                buttonParams.myIconParams.myIconPressedColor = this._myBackgroundColor;
            }
        }

        for (let handedness in params.myThumbstickParams) {
            for (let gamepadAxesID in params.myThumbstickParams[handedness]) {
                let thumbstickParams = params.myThumbstickParams[handedness][gamepadAxesID];
                thumbstickParams.myBackgroundColor = this._myBackgroundColor;
                thumbstickParams.myIconParams.myBackgroundColor = this._myIconColor;
                thumbstickParams.myIconParams.myBackgroundPressedColor = this._myIconColor;
                thumbstickParams.myIconParams.myIconColor = this._myBackgroundColor;
                thumbstickParams.myIconParams.myIconPressedColor = this._myBackgroundColor;
            }
        }

        params.myOpacity = this._myOpacity;

        params.myInterfaceScale = this._myInterfaceScale;
        params.myMarginScale = this._myMarginScale;

        params.myShowOnDesktop = this._myShowOnDesktop;
        params.myShowOnMobile = this._myShowOnMobile;
        params.myShowOnHeadset = this._myShowOnHeadset;

        if (params.myShowOnDesktop || params.myShowOnMobile || params.myShowOnHeadset) {
            params.myAutoUpdateVisibility = true;
        } else {
            params.myAutoUpdateVisibility = false;
        }

        this._advancedConfig(params);

        this._myVirtualGamepad = new VirtualGamepad(params);
        this._myVirtualGamepad.setVisible(false);

        this._myVirtualGamepad.start();

        this._myFirstUpdate = true;

        this._myLeftVirtualGamepadGamepadCore = null;
        this._myRightVirtualGamepadGamepadCore = null;
    }

    update(dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;

            if (this._myAddToUniversalGamepad) {
                this._myLeftVirtualGamepadGamepadCore = new VirtualGamepadGamepadCore(this._myVirtualGamepad, Globals.getLeftGamepad(this.engine).getGamepadCore("pp_left_xr_gamepad").getHandPose());
                this._myRightVirtualGamepadGamepadCore = new VirtualGamepadGamepadCore(this._myVirtualGamepad, Globals.getRightGamepad(this.engine).getGamepadCore("pp_right_xr_gamepad").getHandPose());

                Globals.getLeftGamepad(this.engine).addGamepadCore("pp_left_virtual_gamepad", this._myLeftVirtualGamepadGamepadCore);
                Globals.getRightGamepad(this.engine).addGamepadCore("pp_right_virtual_gamepad", this._myRightVirtualGamepadGamepadCore);
            }
        }

        this._myVirtualGamepad.update(dt);
    }

    _advancedConfig(params) {
        params.myButtonsOrder[Handedness.LEFT] = [null, null, null, null, null];
        params.myButtonsOrder[Handedness.RIGHT] = [null, null, null, null, null];

        {
            let buttonParams = params.myButtonParams[Handedness.LEFT][GamepadButtonID.SELECT];
            buttonParams.myIconParams.myIconType = this._myLeftSelectButtonIconType;
            buttonParams.myIconParams.myLabel = this._myLeftSelectIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myLeftSelectIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            if (this._myLeftSelectButtonVisible) {
                params.myButtonsOrder[Handedness.LEFT][this._myLeftSelectButtonOrderIndex] = [Handedness.LEFT, GamepadButtonID.SELECT];
            }
        }

        {
            let buttonParams = params.myButtonParams[Handedness.LEFT][GamepadButtonID.SQUEEZE];
            buttonParams.myIconParams.myIconType = this._myLeftSqueezeButtonIconType;
            buttonParams.myIconParams.myLabel = this._myLeftSqueezeIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myLeftSqueezeIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            if (this._myLeftSqueezeButtonVisible) {
                params.myButtonsOrder[Handedness.LEFT][this._myLeftSqueezeButtonOrderIndex] = [Handedness.LEFT, GamepadButtonID.SQUEEZE];
            }
        }

        {
            let buttonParams = params.myButtonParams[Handedness.LEFT][GamepadButtonID.THUMBSTICK];
            buttonParams.myIconParams.myIconType = this._myLeftThumbstickButtonIconType;
            buttonParams.myIconParams.myLabel = this._myLeftThumbstickButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myLeftThumbstickButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            if (this._myLeftThumbstickButtonVisible) {
                params.myButtonsOrder[Handedness.LEFT][this._myLeftThumbstickButtonOrderIndex] = [Handedness.LEFT, GamepadButtonID.THUMBSTICK];
            }
        }

        {
            let buttonParams = params.myButtonParams[Handedness.LEFT][GamepadButtonID.TOP_BUTTON];
            buttonParams.myIconParams.myIconType = this._myLeftTopButtonIconType;
            buttonParams.myIconParams.myLabel = this._myLeftTopButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myLeftTopButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            if (this._myLeftTopButtonVisible) {
                params.myButtonsOrder[Handedness.LEFT][this._myLeftTopButtonOrderIndex] = [Handedness.LEFT, GamepadButtonID.TOP_BUTTON];
            }
        }

        {
            let buttonParams = params.myButtonParams[Handedness.LEFT][GamepadButtonID.BOTTOM_BUTTON];
            buttonParams.myIconParams.myIconType = this._myLeftBottomButtonIconType;
            buttonParams.myIconParams.myLabel = this._myLeftBottomButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myLeftBottomButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            if (this._myLeftBottomButtonVisible) {
                params.myButtonsOrder[Handedness.LEFT][this._myLeftBottomButtonOrderIndex] = [Handedness.LEFT, GamepadButtonID.BOTTOM_BUTTON];
            }
        }

        {
            let buttonParams = params.myButtonParams[Handedness.RIGHT][GamepadButtonID.SELECT];
            buttonParams.myIconParams.myIconType = this._myRightSelectButtonIconType;
            buttonParams.myIconParams.myLabel = this._myRightSelectIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myRightSelectIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            if (this._myRightSelectButtonVisible) {
                params.myButtonsOrder[Handedness.RIGHT][this._myRightSelectButtonOrderIndex] = [Handedness.RIGHT, GamepadButtonID.SELECT];
            }
        }

        {
            let buttonParams = params.myButtonParams[Handedness.RIGHT][GamepadButtonID.SQUEEZE];
            buttonParams.myIconParams.myIconType = this._myRightSqueezeButtonIconType;
            buttonParams.myIconParams.myLabel = this._myRightSqueezeIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myRightSqueezeIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            if (this._myRightSqueezeButtonVisible) {
                params.myButtonsOrder[Handedness.RIGHT][this._myRightSqueezeButtonOrderIndex] = [Handedness.RIGHT, GamepadButtonID.SQUEEZE];
            }
        }

        {
            let buttonParams = params.myButtonParams[Handedness.RIGHT][GamepadButtonID.THUMBSTICK];
            buttonParams.myIconParams.myIconType = this._myRightThumbstickButtonIconType;
            buttonParams.myIconParams.myLabel = this._myRightThumbstickButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myRightThumbstickButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            if (this._myRightThumbstickButtonVisible) {
                params.myButtonsOrder[Handedness.RIGHT][this._myRightThumbstickButtonOrderIndex] = [Handedness.RIGHT, GamepadButtonID.THUMBSTICK];
            }
        }

        {
            let buttonParams = params.myButtonParams[Handedness.RIGHT][GamepadButtonID.TOP_BUTTON];
            buttonParams.myIconParams.myIconType = this._myRightTopButtonIconType;
            buttonParams.myIconParams.myLabel = this._myRightTopButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myRightTopButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            if (this._myRightTopButtonVisible) {
                params.myButtonsOrder[Handedness.RIGHT][this._myRightTopButtonOrderIndex] = [Handedness.RIGHT, GamepadButtonID.TOP_BUTTON];
            }
        }

        {
            let buttonParams = params.myButtonParams[Handedness.RIGHT][GamepadButtonID.BOTTOM_BUTTON];
            buttonParams.myIconParams.myIconType = this._myRightBottomButtonIconType;
            buttonParams.myIconParams.myLabel = this._myRightBottomButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myRightBottomButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            if (this._myRightBottomButtonVisible) {
                params.myButtonsOrder[Handedness.RIGHT][this._myRightBottomButtonOrderIndex] = [Handedness.RIGHT, GamepadButtonID.BOTTOM_BUTTON];
            }
        }
    }

    onDestroy() {
        Globals.getLeftGamepad(this.engine)?.removeGamepadCore("pp_left_virtual_gamepad");
        Globals.getRightGamepad(this.engine)?.removeGamepadCore("pp_right_virtual_gamepad");

        this._myLeftVirtualGamepadGamepadCore.destroy();
        this._myRightVirtualGamepadGamepadCore.destroy();

        this._myVirtualGamepad.destroy();
    }
}
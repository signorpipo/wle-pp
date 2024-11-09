import { Component, Property } from "@wonderlandengine/api";
import { InputUtils } from "../../../input/cauldron/input_utils.js";
import { Globals } from "../../../pp/globals.js";
import { Handedness } from "../../cauldron/input_types.js";
import { GamepadAxesID, GamepadButtonID } from "../gamepad_buttons.js";
import { VirtualGamepadGamepadCore } from "../gamepad_cores/virtual_gamepad_gamepad_core.js";
import { VirtualGamepad, VirtualGamepadAxesID, VirtualGamepadButtonID } from "./virtual_gamepad.js";
import { VirtualGamepadParams } from "./virtual_gamepad_params.js";

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

        _myLeftFirstButtonEnabled: Property.bool(true),
        _myLeftFirstButtonGamepadButtonID: Property.enum(["Select", "Squeeze", "Thumbstick", "Top Button", "Bottom Button", "Left Button", "Right Button", "Menu", "Touchpad", "Thumb Rest"], "Squeeze"),
        _myLeftFirstButtonGamepadHandedness: Property.enum(["Left", "Right"], "Left"),
        _myLeftFirstButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Square"),
        _myLeftFirstButtonIconLabelOrImageUrl: Property.string(""),

        _myLeftSecondButtonEnabled: Property.bool(true),
        _myLeftSecondButtonGamepadButtonID: Property.enum(["Select", "Squeeze", "Thumbstick", "Top Button", "Bottom Button", "Left Button", "Right Button", "Menu", "Touchpad", "Thumb Rest"], "Select"),
        _myLeftSecondButtonGamepadHandedness: Property.enum(["Left", "Right"], "Left"),
        _myLeftSecondButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Frame"),
        _myLeftSecondButtonIconLabelOrImageUrl: Property.string(""),

        _myLeftThirdButtonEnabled: Property.bool(true),
        _myLeftThirdButtonGamepadButtonID: Property.enum(["Select", "Squeeze", "Thumbstick", "Top Button", "Bottom Button", "Left Button", "Right Button", "Menu", "Touchpad", "Thumb Rest"], "Top Button"),
        _myLeftThirdButtonGamepadHandedness: Property.enum(["Left", "Right"], "Left"),
        _myLeftThirdButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Circle"),
        _myLeftThirdButtonIconLabelOrImageUrl: Property.string(""),

        _myLeftFourthButtonEnabled: Property.bool(true),
        _myLeftFourthButtonGamepadButtonID: Property.enum(["Select", "Squeeze", "Thumbstick", "Top Button", "Bottom Button", "Left Button", "Right Button", "Menu", "Touchpad", "Thumb Rest"], "Bottom Button"),
        _myLeftFourthButtonGamepadHandedness: Property.enum(["Left", "Right"], "Left"),
        _myLeftFourthButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Ring"),
        _myLeftFourthButtonIconLabelOrImageUrl: Property.string(""),

        _myLeftFifthButtonEnabled: Property.bool(true),
        _myLeftFifthButtonGamepadButtonID: Property.enum(["Select", "Squeeze", "Thumbstick", "Top Button", "Bottom Button", "Left Button", "Right Button", "Menu", "Touchpad", "Thumb Rest"], "Thumbstick"),
        _myLeftFifthButtonGamepadHandedness: Property.enum(["Left", "Right"], "Left"),
        _myLeftFifthButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Dot"),
        _myLeftFifthButtonIconLabelOrImageUrl: Property.string(""),

        _myLeftThumbstickEnabled: Property.bool(true),
        _myLeftThumbstickGamepadHandedness: Property.enum(["Left", "Right"], "Left"),

        _myRightFirstButtonEnabled: Property.bool(true),
        _myRightFirstButtonGamepadButtonID: Property.enum(["Select", "Squeeze", "Thumbstick", "Top Button", "Bottom Button", "Left Button", "Right Button", "Menu", "Touchpad", "Thumb Rest"], "Squeeze"),
        _myRightFirstButtonGamepadHandedness: Property.enum(["Left", "Right"], "Right"),
        _myRightFirstButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Square"),
        _myRightFirstButtonIconLabelOrImageUrl: Property.string(""),

        _myRightSecondButtonEnabled: Property.bool(true),
        _myRightSecondButtonGamepadButtonID: Property.enum(["Select", "Squeeze", "Thumbstick", "Top Button", "Bottom Button", "Left Button", "Right Button", "Menu", "Touchpad", "Thumb Rest"], "Select"),
        _myRightSecondButtonGamepadHandedness: Property.enum(["Left", "Right"], "Right"),
        _myRightSecondButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Frame"),
        _myRightSecondButtonIconLabelOrImageUrl: Property.string(""),

        _myRightThirdButtonEnabled: Property.bool(true),
        _myRightThirdButtonGamepadButtonID: Property.enum(["Select", "Squeeze", "Thumbstick", "Top Button", "Bottom Button", "Left Button", "Right Button", "Menu", "Touchpad", "Thumb Rest"], "Top Button"),
        _myRightThirdButtonGamepadHandedness: Property.enum(["Left", "Right"], "Right"),
        _myRightThirdButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Circle"),
        _myRightThirdButtonIconLabelOrImageUrl: Property.string(""),

        _myRightFourthButtonEnabled: Property.bool(true),
        _myRightFourthButtonGamepadButtonID: Property.enum(["Select", "Squeeze", "Thumbstick", "Top Button", "Bottom Button", "Left Button", "Right Button", "Menu", "Touchpad", "Thumb Rest"], "Bottom Button"),
        _myRightFourthButtonGamepadHandedness: Property.enum(["Left", "Right"], "Right"),
        _myRightFourthButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Ring"),
        _myRightFourthButtonIconLabelOrImageUrl: Property.string(""),

        _myRightFifthButtonEnabled: Property.bool(true),
        _myRightFifthButtonGamepadButtonID: Property.enum(["Select", "Squeeze", "Thumbstick", "Top Button", "Bottom Button", "Left Button", "Right Button", "Menu", "Touchpad", "Thumb Rest"], "Thumbstick"),
        _myRightFifthButtonGamepadHandedness: Property.enum(["Left", "Right"], "Right"),
        _myRightFifthButtonIconType: Property.enum(["None", "Label", "Image", "Dot", "Circle", "Square", "Ring", "Frame"], "Dot"),
        _myRightFifthButtonIconLabelOrImageUrl: Property.string(""),

        _myRightThumbstickEnabled: Property.bool(true),
        _myRightThumbstickGamepadHandedness: Property.enum(["Left", "Right"], "Right")
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

        this._myActivateOnNextUpdate = false;
    }

    update(dt) {
        if (this._myActivateOnNextUpdate) {
            this._onActivate();

            this._myActivateOnNextUpdate = false;
        }

        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;

            if (this._myAddToUniversalGamepad) {
                this._addToUniversalGamepad();
            }
        }

        this._myVirtualGamepad.update(dt);
    }

    _advancedConfig(params) {
        {
            let buttonParams = params.myButtonParams[Handedness.LEFT][VirtualGamepadButtonID.SECOND_BUTTON];
            buttonParams.myIconParams.myIconType = this._myLeftSecondButtonIconType;
            buttonParams.myIconParams.myLabel = this._myLeftSecondButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myLeftSecondButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            params.myButtonsEnabled[Handedness.LEFT][VirtualGamepadButtonID.SECOND_BUTTON] = this._myLeftSecondButtonEnabled;
        }

        {
            let buttonParams = params.myButtonParams[Handedness.LEFT][VirtualGamepadButtonID.FIRST_BUTTON];
            buttonParams.myIconParams.myIconType = this._myLeftFirstButtonIconType;
            buttonParams.myIconParams.myLabel = this._myLeftFirstButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myLeftFirstButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            params.myButtonsEnabled[Handedness.LEFT][VirtualGamepadButtonID.FIRST_BUTTON] = this._myLeftFirstButtonEnabled;
        }

        {
            let buttonParams = params.myButtonParams[Handedness.LEFT][VirtualGamepadButtonID.FIFTH_BUTTON];
            buttonParams.myIconParams.myIconType = this._myLeftFifthButtonIconType;
            buttonParams.myIconParams.myLabel = this._myLeftFifthButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myLeftFifthButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            params.myButtonsEnabled[Handedness.LEFT][VirtualGamepadButtonID.FIFTH_BUTTON] = this._myLeftFifthButtonEnabled;
        }

        {
            let buttonParams = params.myButtonParams[Handedness.LEFT][VirtualGamepadButtonID.THIRD_BUTTON];
            buttonParams.myIconParams.myIconType = this._myLeftThirdButtonIconType;
            buttonParams.myIconParams.myLabel = this._myLeftThirdButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myLeftThirdButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            params.myButtonsEnabled[Handedness.LEFT][VirtualGamepadButtonID.THIRD_BUTTON] = this._myLeftThirdButtonEnabled;
        }

        {
            let buttonParams = params.myButtonParams[Handedness.LEFT][VirtualGamepadButtonID.FOURTH_BUTTON];
            buttonParams.myIconParams.myIconType = this._myLeftFourthButtonIconType;
            buttonParams.myIconParams.myLabel = this._myLeftFourthButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myLeftFourthButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            params.myButtonsEnabled[Handedness.LEFT][VirtualGamepadButtonID.FOURTH_BUTTON] = this._myLeftFourthButtonEnabled;
        }

        {
            let buttonParams = params.myButtonParams[Handedness.RIGHT][VirtualGamepadButtonID.SECOND_BUTTON];
            buttonParams.myIconParams.myIconType = this._myRightSecondButtonIconType;
            buttonParams.myIconParams.myLabel = this._myRightSecondButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myRightSecondButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            params.myButtonsEnabled[Handedness.RIGHT][VirtualGamepadButtonID.SECOND_BUTTON] = this._myRightSecondButtonEnabled;
        }

        {
            let buttonParams = params.myButtonParams[Handedness.RIGHT][VirtualGamepadButtonID.FIRST_BUTTON];
            buttonParams.myIconParams.myIconType = this._myRightFirstButtonIconType;
            buttonParams.myIconParams.myLabel = this._myRightFirstButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myRightFirstButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            params.myButtonsEnabled[Handedness.RIGHT][VirtualGamepadButtonID.FIRST_BUTTON] = this._myRightFirstButtonEnabled;
        }

        {
            let buttonParams = params.myButtonParams[Handedness.RIGHT][VirtualGamepadButtonID.FIFTH_BUTTON];
            buttonParams.myIconParams.myIconType = this._myRightFifthButtonIconType;
            buttonParams.myIconParams.myLabel = this._myRightFifthButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myRightFifthButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            params.myButtonsEnabled[Handedness.RIGHT][VirtualGamepadButtonID.FIFTH_BUTTON] = this._myRightFifthButtonEnabled;
        }

        {
            let buttonParams = params.myButtonParams[Handedness.RIGHT][VirtualGamepadButtonID.THIRD_BUTTON];
            buttonParams.myIconParams.myIconType = this._myRightThirdButtonIconType;
            buttonParams.myIconParams.myLabel = this._myRightThirdButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myRightThirdButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            params.myButtonsEnabled[Handedness.RIGHT][VirtualGamepadButtonID.THIRD_BUTTON] = this._myRightThirdButtonEnabled;
        }

        {
            let buttonParams = params.myButtonParams[Handedness.RIGHT][VirtualGamepadButtonID.FOURTH_BUTTON];
            buttonParams.myIconParams.myIconType = this._myRightFourthButtonIconType;
            buttonParams.myIconParams.myLabel = this._myRightFourthButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myImageURL = this._myRightFourthButtonIconLabelOrImageUrl;
            buttonParams.myIconParams.myLabelFontSize = this._myLabelFontSize;
            buttonParams.myIconParams.myLabelFontFamily = this._myLabelFontFamily;
            buttonParams.myIconParams.myLabelFontWeight = this._myLabelFontWeight;
            buttonParams.myIconParams.myImagePressedBrightness = this._myImagePressedBrightness;

            params.myButtonsEnabled[Handedness.RIGHT][VirtualGamepadButtonID.FOURTH_BUTTON] = this._myRightFourthButtonEnabled;
        }

        params.myThumbsticksEnabled[Handedness.LEFT][VirtualGamepadAxesID.FIRST_AXES] = this._myLeftThumbstickEnabled;
        params.myThumbsticksEnabled[Handedness.RIGHT][VirtualGamepadAxesID.FIRST_AXES] = this._myRightThumbstickEnabled;
    }

    _addToUniversalGamepad() {
        const leftGamepadToVirtualGamepadButtonIDMap = new Map();
        const rightGamepadToVirtualGamepadButtonIDMap = new Map();

        if (this._myLeftFirstButtonEnabled) {
            if (InputUtils.getHandednessByIndex(this._myLeftFirstButtonGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myLeftFirstButtonGamepadButtonID), [Handedness.LEFT, VirtualGamepadButtonID.FIRST_BUTTON]);
            } else {
                rightGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myLeftFirstButtonGamepadButtonID), [Handedness.LEFT, VirtualGamepadButtonID.FIRST_BUTTON]);
            }
        }

        if (this._myLeftSecondButtonEnabled) {
            if (InputUtils.getHandednessByIndex(this._myLeftSecondButtonGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myLeftSecondButtonGamepadButtonID), [Handedness.LEFT, VirtualGamepadButtonID.SECOND_BUTTON]);
            } else {
                rightGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myLeftSecondButtonGamepadButtonID), [Handedness.LEFT, VirtualGamepadButtonID.SECOND_BUTTON]);
            }
        }

        if (this._myLeftThirdButtonEnabled) {
            if (InputUtils.getHandednessByIndex(this._myLeftThirdButtonGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myLeftThirdButtonGamepadButtonID), [Handedness.LEFT, VirtualGamepadButtonID.THIRD_BUTTON]);
            } else {
                rightGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myLeftThirdButtonGamepadButtonID), [Handedness.LEFT, VirtualGamepadButtonID.THIRD_BUTTON]);
            }
        }

        if (this._myLeftFourthButtonEnabled) {
            if (InputUtils.getHandednessByIndex(this._myLeftFourthButtonGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myLeftFourthButtonGamepadButtonID), [Handedness.LEFT, VirtualGamepadButtonID.FOURTH_BUTTON]);
            } else {
                rightGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myLeftFourthButtonGamepadButtonID), [Handedness.LEFT, VirtualGamepadButtonID.FOURTH_BUTTON]);
            }
        }

        if (this._myLeftFifthButtonEnabled) {
            if (InputUtils.getHandednessByIndex(this._myLeftFifthButtonGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myLeftFifthButtonGamepadButtonID), [Handedness.LEFT, VirtualGamepadButtonID.FIFTH_BUTTON]);
            } else {
                rightGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myLeftFifthButtonGamepadButtonID), [Handedness.LEFT, VirtualGamepadButtonID.FIFTH_BUTTON]);
            }
        }

        if (this._myRightFirstButtonEnabled) {
            if (InputUtils.getHandednessByIndex(this._myRightFirstButtonGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myRightFirstButtonGamepadButtonID), [Handedness.RIGHT, VirtualGamepadButtonID.FIRST_BUTTON]);
            } else {
                rightGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myRightFirstButtonGamepadButtonID), [Handedness.RIGHT, VirtualGamepadButtonID.FIRST_BUTTON]);
            }
        }

        if (this._myRightSecondButtonEnabled) {
            if (InputUtils.getHandednessByIndex(this._myRightSecondButtonGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myRightSecondButtonGamepadButtonID), [Handedness.RIGHT, VirtualGamepadButtonID.SECOND_BUTTON]);
            } else {
                rightGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myRightSecondButtonGamepadButtonID), [Handedness.RIGHT, VirtualGamepadButtonID.SECOND_BUTTON]);
            }
        }

        if (this._myRightThirdButtonEnabled) {
            if (InputUtils.getHandednessByIndex(this._myRightThirdButtonGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myRightThirdButtonGamepadButtonID), [Handedness.RIGHT, VirtualGamepadButtonID.THIRD_BUTTON]);
            } else {
                rightGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myRightThirdButtonGamepadButtonID), [Handedness.RIGHT, VirtualGamepadButtonID.THIRD_BUTTON]);
            }
        }

        if (this._myRightFourthButtonEnabled) {
            if (InputUtils.getHandednessByIndex(this._myRightFourthButtonGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myRightFourthButtonGamepadButtonID), [Handedness.RIGHT, VirtualGamepadButtonID.FOURTH_BUTTON]);
            } else {
                rightGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myRightFourthButtonGamepadButtonID), [Handedness.RIGHT, VirtualGamepadButtonID.FOURTH_BUTTON]);
            }
        }

        if (this._myRightFifthButtonEnabled) {
            if (InputUtils.getHandednessByIndex(this._myRightFifthButtonGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myRightFifthButtonGamepadButtonID), [Handedness.RIGHT, VirtualGamepadButtonID.FIFTH_BUTTON]);
            } else {
                rightGamepadToVirtualGamepadButtonIDMap.set(this._gamepadPropertyButtonIDToEnum(this._myRightFifthButtonGamepadButtonID), [Handedness.RIGHT, VirtualGamepadButtonID.FIFTH_BUTTON]);
            }
        }

        const leftGamepadToVirtualGamepadAxesIDMap = new Map();
        const rightGamepadToVirtualGamepadAxesIDMap = new Map();

        if (this._myLeftThumbstickEnabled) {
            if (InputUtils.getHandednessByIndex(this._myLeftThumbstickGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadAxesIDMap.set(GamepadAxesID.THUMBSTICK, [Handedness.LEFT, VirtualGamepadAxesID.FIRST_AXES]);
            } else {
                rightGamepadToVirtualGamepadAxesIDMap.set(GamepadAxesID.THUMBSTICK, [Handedness.LEFT, VirtualGamepadAxesID.FIRST_AXES]);
            }
        }

        if (this._myRightThumbstickEnabled) {
            if (InputUtils.getHandednessByIndex(this._myRightThumbstickGamepadHandedness) == Handedness.LEFT) {
                leftGamepadToVirtualGamepadAxesIDMap.set(GamepadAxesID.THUMBSTICK, [Handedness.RIGHT, VirtualGamepadAxesID.FIRST_AXES]);
            } else {
                rightGamepadToVirtualGamepadAxesIDMap.set(GamepadAxesID.THUMBSTICK, [Handedness.RIGHT, VirtualGamepadAxesID.FIRST_AXES]);
            }
        }

        const leftHandPose = Globals.getLeftGamepad(this.engine).getGamepadCore("pp_left_xr_gamepad").getHandPose();
        const rightHandPose = Globals.getRightGamepad(this.engine).getGamepadCore("pp_right_xr_gamepad").getHandPose();
        this._myLeftVirtualGamepadGamepadCore = new VirtualGamepadGamepadCore(this._myVirtualGamepad, leftHandPose, leftGamepadToVirtualGamepadButtonIDMap, leftGamepadToVirtualGamepadAxesIDMap);
        this._myRightVirtualGamepadGamepadCore = new VirtualGamepadGamepadCore(this._myVirtualGamepad, rightHandPose, rightGamepadToVirtualGamepadButtonIDMap, rightGamepadToVirtualGamepadAxesIDMap);

        Globals.getLeftGamepad(this.engine).addGamepadCore("pp_left_virtual_gamepad", this._myLeftVirtualGamepadGamepadCore);
        Globals.getRightGamepad(this.engine).addGamepadCore("pp_right_virtual_gamepad", this._myRightVirtualGamepadGamepadCore);

    }

    _gamepadPropertyButtonIDToEnum(propertyButtonID) {
        let buttonID = null;

        switch (propertyButtonID) {
            case 0:
                buttonID = GamepadButtonID.SELECT;
                break;
            case 1:
                buttonID = GamepadButtonID.SQUEEZE;
                break;
            case 2:
                buttonID = GamepadButtonID.THUMBSTICK;
                break;
            case 3:
                buttonID = GamepadButtonID.TOP_BUTTON;
                break;
            case 4:
                buttonID = GamepadButtonID.BOTTOM_BUTTON;
                break;
            case 5:
                buttonID = GamepadButtonID.LEFT_BUTTON;
                break;
            case 6:
                buttonID = GamepadButtonID.RIGHT_BUTTON;
                break;
            case 7:
                buttonID = GamepadButtonID.MENU;
                break;
            case 8:
                buttonID = GamepadButtonID.TOUCHPAD;
                break;
            case 9:
                buttonID = GamepadButtonID.THUMB_REST;
                break;
        }

        return buttonID;
    }

    onActivate() {
        this._myActivateOnNextUpdate = true;
    }

    _onActivate() {
        if (!this._myFirstUpdate && this._myAddToUniversalGamepad) {
            Globals.getLeftGamepad(this.engine).addGamepadCore("pp_left_virtual_gamepad", this._myLeftVirtualGamepadGamepadCore);
            Globals.getRightGamepad(this.engine).addGamepadCore("pp_right_virtual_gamepad", this._myRightVirtualGamepadGamepadCore);
        }
    }

    onDeactivate() {
        this._myVirtualGamepad?.setVisible(false);

        if (!this._myFirstUpdate && this._myAddToUniversalGamepad) {
            // Sadly here, if it can't manage to remove them due to global gamepads being null,
            // then if the gamepad is activated again it will still have and use the virtual gamepad cores
            // Usually not an issue since this is happens only when the whole scene is deactivated
            Globals.getLeftGamepad(this.engine)?.removeGamepadCore("pp_left_virtual_gamepad");
            Globals.getRightGamepad(this.engine)?.removeGamepadCore("pp_right_virtual_gamepad");

            this._myLeftVirtualGamepadGamepadCore.setActive(false);
            this._myRightVirtualGamepadGamepadCore.setActive(false);
        }
    }

    onDestroy() {
        this._myLeftVirtualGamepadGamepadCore?.destroy();
        this._myRightVirtualGamepadGamepadCore?.destroy();

        this._myVirtualGamepad?.destroy();
    }
}
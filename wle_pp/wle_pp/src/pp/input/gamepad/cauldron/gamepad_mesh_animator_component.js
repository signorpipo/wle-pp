import { Component, Property } from "@wonderlandengine/api";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { HandednessIndex } from "../../cauldron/input_types.js";
import { GamepadAxesEvent, GamepadAxesID, GamepadButtonEvent, GamepadButtonID } from "../gamepad_buttons.js";

export class GamepadMeshAnimatorComponent extends Component {
    static TypeName = "pp-gamepad-mesh-animator";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _mySelect: Property.object(null),
        _mySqueeze: Property.object(null),
        _myThumbstick: Property.object(null),
        _myTopButton: Property.object(null),
        _myBottomButton: Property.object(null),
        _mySelectRotateAngle: Property.float(15),
        _mySqueezeRotateAngle: Property.float(11),
        _myThumbstickRotateAngle: Property.float(15),
        _myThumbstickPressOffset: Property.float(0.000625),
        _myTopButtonPressOffset: Property.float(0.0015),
        _myBottomButtonPressOffset: Property.float(0.0015),
        _myUsePressForSqueeze: Property.bool(false),
        _mySqueezePressOffset: Property.float(0.0015)
    };

    start() {
        let gamepad = null;
        if (this._myHandedness == HandednessIndex.LEFT) {
            gamepad = Globals.getLeftGamepad(this.engine);
        } else {
            gamepad = Globals.getRightGamepad(this.engine);
        }

        if (this._mySelect != null) {
            this._mySelectOriginalRotation = this._mySelect.pp_getRotationLocalQuat();
            this._mySelectOriginalLeft = this._mySelect.pp_getLeftLocal();
        }

        if (this._mySqueeze != null) {
            this._mySqueezeOriginalPosition = this._mySqueeze.pp_getPositionLocal();
            this._mySqueezeOriginalRotation = this._mySqueeze.pp_getRotationLocalQuat();
            this._mySqueezeOriginalLeft = this._mySqueeze.pp_getLeftLocal();
            this._mySqueezeOriginalForward = this._mySqueeze.pp_getForwardLocal();
        }

        if (this._myThumbstick != null) {
            this._myThumbstickOriginalPosition = this._myThumbstick.pp_getPositionLocal();
            this._myThumbstickOriginalRotation = this._myThumbstick.pp_getRotationLocalQuat();
            this._myThumbstickOriginalLeft = this._myThumbstick.pp_getLeftLocal();
            this._myThumbstickOriginalUp = this._myThumbstick.pp_getUpLocal();
            this._myThumbstickOriginalForward = this._myThumbstick.pp_getForwardLocal();
        }

        if (this._myTopButton != null) {
            this._myTopButtonOriginalPosition = this._myTopButton.pp_getPositionLocal();
            this._myTopButtonOriginalUp = this._myTopButton.pp_getUpLocal();
        }

        if (this._myBottomButton != null) {
            this._myBottomButtonOriginalPosition = this._myBottomButton.pp_getPositionLocal();
            this._myBottomButtonOriginalUp = this._myBottomButton.pp_getUpLocal();
        }

        // PRESSED
        if (this._myThumbstick != null) {
            gamepad.registerButtonEventListener(GamepadButtonID.THUMBSTICK, GamepadButtonEvent.PRESS_START, this, this._thumbstickPressedStart.bind(this));
            gamepad.registerButtonEventListener(GamepadButtonID.THUMBSTICK, GamepadButtonEvent.PRESS_END, this, this._thumbstickPressedEnd.bind(this));
        }

        if (this._myTopButton != null) {
            gamepad.registerButtonEventListener(GamepadButtonID.TOP_BUTTON, GamepadButtonEvent.PRESS_START, this, this._topButtonPressedStart.bind(this));
            gamepad.registerButtonEventListener(GamepadButtonID.TOP_BUTTON, GamepadButtonEvent.PRESS_END, this, this._topButtonPressedEnd.bind(this));
        }

        if (this._myBottomButton != null) {

            gamepad.registerButtonEventListener(GamepadButtonID.BOTTOM_BUTTON, GamepadButtonEvent.PRESS_START, this, this._bottomButtonPressedStart.bind(this));
            gamepad.registerButtonEventListener(GamepadButtonID.BOTTOM_BUTTON, GamepadButtonEvent.PRESS_END, this, this._bottomButtonPressedEnd.bind(this));
        }

        // VALUE CHANGED
        if (this._mySelect != null) {
            gamepad.registerButtonEventListener(GamepadButtonID.SELECT, GamepadButtonEvent.VALUE_CHANGED, this, this._selectValueChanged.bind(this));
        }

        if (this._mySqueeze != null) {
            gamepad.registerButtonEventListener(GamepadButtonID.SQUEEZE, GamepadButtonEvent.VALUE_CHANGED, this, this._squeezeValueChanged.bind(this));
        }

        // AXES CHANGED
        if (this._myThumbstick != null) {
            gamepad.registerAxesEventListener(GamepadAxesID.THUMBSTICK, GamepadAxesEvent.AXES_CHANGED, this, this._thumbstickValueChanged.bind(this));
        }
    }

    _thumbstickPressedStart() {
        // Implemented outside class definition
    }

    _thumbstickPressedEnd(buttonInfo, gamepad) {
        this._myThumbstick.pp_setPositionLocal(this._myThumbstickOriginalPosition);
    }

    _topButtonPressedStart(buttonInfo, gamepad) {
        this._myTopButton.pp_translateAxisLocal(-this._myTopButtonPressOffset, this._myTopButtonOriginalUp);
    }

    _topButtonPressedEnd(buttonInfo, gamepad) {
        this._myTopButton.pp_setPositionLocal(this._myTopButtonOriginalPosition);
    }

    _bottomButtonPressedStart(buttonInfo, gamepad) {
        this._myBottomButton.pp_translateAxisLocal(-this._myBottomButtonPressOffset, this._myBottomButtonOriginalUp);
    }

    _bottomButtonPressedEnd(buttonInfo, gamepad) {
        this._myBottomButton.pp_setPositionLocal(this._myBottomButtonOriginalPosition);
    }

    _selectValueChanged(buttonInfo, gamepad) {
        this._mySelect.pp_setRotationLocalQuat(this._mySelectOriginalRotation);

        if (buttonInfo.getValue() > 0.00001) {
            this._mySelect.pp_rotateAxisLocal(this._mySelectRotateAngle * buttonInfo.getValue(), this._mySelectOriginalLeft);
        }
    }

    _squeezeValueChanged(buttonInfo, gamepad) {
        this._mySqueeze.pp_setPositionLocal(this._mySqueezeOriginalPosition);
        this._mySqueeze.pp_setRotationLocalQuat(this._mySqueezeOriginalRotation);

        if (buttonInfo.getValue() > 0.00001) {
            if (this._myUsePressForSqueeze) {
                let translation = this._mySqueezePressOffset;
                if (this._myHandedness == 1) {
                    translation *= -1;
                }

                this._mySqueeze.pp_translateAxisLocal(translation * buttonInfo.getValue(), this._mySqueezeOriginalLeft);
            } else {
                let rotation = -this._mySqueezeRotateAngle;
                if (this._myHandedness == 1) {
                    rotation *= -1;
                }

                this._mySqueeze.pp_rotateAxisLocal(rotation * buttonInfo.getValue(), this._mySqueezeOriginalForward);
            }
        }
    }

    _thumbstickValueChanged(axesInfo, gamepad) {
        this._myThumbstick.pp_setRotationLocalQuat(this._myThumbstickOriginalRotation);

        let leftRotation = this._myThumbstickRotateAngle * axesInfo.myAxes[1];
        let forwardRotation = this._myThumbstickRotateAngle * axesInfo.myAxes[0];

        if (Math.abs(leftRotation) > 0.0001) {
            this._myThumbstick.pp_rotateAxisLocal(leftRotation, this._myThumbstickOriginalLeft);
        }

        if (Math.abs(forwardRotation) > 0.0001) {
            this._myThumbstick.pp_rotateAxisLocal(forwardRotation, this._myThumbstickOriginalForward);
        }
    }
}



// IMPLEMENTATION

GamepadMeshAnimatorComponent.prototype._thumbstickPressedStart = function () {
    let upTranslation = vec3_create();
    return function _thumbstickPressedStart(buttonInfo, gamepad) {
        // Since thumbstick object rotate you need to specifically use its original up to translate it
        this._myThumbstickOriginalUp.vec3_scale(-this._myThumbstickPressOffset, upTranslation);
        this._myThumbstick.pp_translateLocal(upTranslation);
    };
}();
import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { ClassicGamepadCore } from "../../gamepad/gamepad_cores/classic_gamepad_core.js";
import { KeyboardGamepadCore } from "../../gamepad/gamepad_cores/keyboard_gamepad_core.js";
import { XRGamepadCore } from "../../gamepad/gamepad_cores/xr_gamepad_core.js";
import { InputManager } from "../input_manager.js";

export class InputManagerComponent extends Component {
    static TypeName = "pp-input-manager";
    static Properties = {
        _myPoseForwardFixed: Property.bool(true),
        _myPreventMouseContextMenu: Property.bool(true),
        _myPreventMouseMiddleButtonScroll: Property.bool(true),
        _mySwitchToTrackedHandDelay: Property.float(0),
        _myEnableTrackedHandPoses: Property.bool(true)
    };

    init() {
        this._myInputManager = null;

        this._myPoseForwardFixedGlobal = this._myPoseForwardFixed;
    }

    update(dt) {
        if (Globals.getInputManager(this.engine) == this._myInputManager) {
            this._myInputManager.update(dt);
        }
    }

    _setupMousePrevent() {
        if (this._myPreventMouseContextMenu) {
            this._myInputManager.getMouse().setContextMenuActive(false);
        }

        if (this._myPreventMouseMiddleButtonScroll) {
            this._myInputManager.getMouse().setMiddleButtonScrollActive(false);
        }
    }

    _addGamepadCores() {
        let leftHandPose = this._myInputManager.getLeftHandPose();
        let rightHandPose = this._myInputManager.getRightHandPose();

        let leftXRGamepadCore = new XRGamepadCore(leftHandPose);
        let rightXRGamepadCore = new XRGamepadCore(rightHandPose);

        this._myInputManager.getGamepadsManager().getLeftGamepad().addGamepadCore("pp_left_xr_gamepad", leftXRGamepadCore);
        this._myInputManager.getGamepadsManager().getRightGamepad().addGamepadCore("pp_right_xr_gamepad", rightXRGamepadCore);

        let leftKeyboardGamepadCore = new KeyboardGamepadCore(leftHandPose);
        let rightKeyboardGamepadCore = new KeyboardGamepadCore(rightHandPose);

        this._myInputManager.getGamepadsManager().getLeftGamepad().addGamepadCore("pp_left_keyboard_gamepad", leftKeyboardGamepadCore);
        this._myInputManager.getGamepadsManager().getRightGamepad().addGamepadCore("pp_right_keyboard_gamepad", rightKeyboardGamepadCore);

        let leftClassicGamepadCore = new ClassicGamepadCore(null, leftHandPose);
        let rightClassicGamepadCore = new ClassicGamepadCore(null, rightHandPose);

        this._myInputManager.getGamepadsManager().getLeftGamepad().addGamepadCore("pp_left_classic_gamepad", leftClassicGamepadCore);
        this._myInputManager.getGamepadsManager().getRightGamepad().addGamepadCore("pp_right_classic_gamepad", rightClassicGamepadCore);
    }

    onActivate() {
        if (this._myInputManager == null) {
            this._myInputManager = new InputManager(this.engine);
            this._myInputManager.setTrackedHandPosesEnabled(this._myEnableTrackedHandPoses);
            this._myInputManager.getLeftHandPose().setSwitchToTrackedHandDelay(this._mySwitchToTrackedHandDelay);
            this._myInputManager.getRightHandPose().setSwitchToTrackedHandDelay(this._mySwitchToTrackedHandDelay);
            this._myInputManager.getLeftHandRayPose().setSwitchToTrackedHandDelay(this._mySwitchToTrackedHandDelay);
            this._myInputManager.getRightHandRayPose().setSwitchToTrackedHandDelay(this._mySwitchToTrackedHandDelay);

            this._myInputManager.start();

            this._setupMousePrevent();

            this._addGamepadCores();
        }

        if (!Globals.hasInputManager(this.engine)) {
            this._myInputManager.setActive(true);

            Globals.setInputManager(this._myInputManager, this.engine);
        }

        if (!Globals.hasPoseForwardFixed(this.engine)) {
            Globals.setPoseForwardFixed(this._myPoseForwardFixedGlobal, this.engine);
        }
    }

    onDeactivate() {
        if (this._myInputManager != null) {
            this._myInputManager.setActive(false);

            if (Globals.getInputManager(this.engine) == this._myInputManager) {
                Globals.removeInputManager(this.engine);
            }
        }

        if (Globals.isPoseForwardFixed(this.engine) == this._myPoseForwardFixedGlobal) {
            Globals.removePoseForwardFixed(this.engine);
        }
    }

    onDestroy() {
        if (this._myInputManager != null) {
            this._myInputManager.destroy();
        }
    }
}
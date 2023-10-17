import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals";
import { ClassicGamepadCore } from "../../gamepad/gamepad_cores/classic_gamepad_core";
import { KeyboardGamepadCore } from "../../gamepad/gamepad_cores/keyboard_gamepad_core";
import { XRGamepadCore } from "../../gamepad/gamepad_cores/xr_gamepad_core";
import { InputManager } from "../input_manager";

export class InputManagerComponent extends Component {
    static TypeName = "pp-input-manager";
    static Properties = {
        _myPoseForwardFixed: Property.bool(true),
        _myPreventMouseContextMenu: Property.bool(true),
        _myPreventMouseMiddleButtonScroll: Property.bool(true),
        _myEnableTrackedHandPoses: Property.bool(true)
    };

    init() {
        this._myInputManager = null;
        this._myPoseForwardFixedGlobal = null;

        // Prevents double global from same engine
        if (!Globals.hasInputManager(this.engine)) {
            this._myInputManager = new InputManager(this.engine);
            this._myInputManager.setTrackedHandPosesEnabled(this._myEnableTrackedHandPoses);

            Globals.setInputManager(this._myInputManager, this.engine);
        }

        // Prevents double global from same engine
        if (!Globals.hasPoseForwardFixed(this.engine)) {
            this._myPoseForwardFixedGlobal = this._myPoseForwardFixed;

            Globals.setPoseForwardFixed(this._myPoseForwardFixedGlobal, this.engine);
        }
    }

    start() {
        if (this._myInputManager != null) {
            this._myInputManager.start();

            this._setupMousePrevent();

            this._addGamepadCores();
        }
    }

    update(dt) {
        if (this._myInputManager != null) {
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

    onDestroy() {
        if (this._myInputManager != null && Globals.getInputManager(this.engine) == this._myInputManager) {
            Globals.removeInputManager(this.engine);

            this._myInputManager.destroy();
        }

        if (this._myPoseForwardFixedGlobal != null && Globals.isPoseForwardFixed(this.engine) == this._myPoseForwardFixedGlobal) {
            Globals.removePoseForwardFixed(this.engine);
        }
    }
}
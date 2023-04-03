import { Component, Property } from "@wonderlandengine/api";
import { getPlayerObjects } from "../../../pp/player_objects_global";
import { ClassicGamepadCore } from "../../gamepad/gamepad_cores/classic_gamepad_core";
import { KeyboardGamepadCore } from "../../gamepad/gamepad_cores/keyboard_gamepad_core";
import { XRGamepadCore } from "../../gamepad/gamepad_cores/xr_gamepad_core";
import { HandPose, HandPoseParams } from "../../pose/hand_pose";
import { hasInputManager, setInputManager } from "../input_globals";
import { InputManager } from "../input_manager";
import { Handedness } from "../input_types";

export class InputManagerComponent extends Component {
    static TypeName = "pp-input-manager";
    static Properties = {
        _myGamepadFixForward: Property.bool(true),
        _myMousePreventContextMenu: Property.bool(true),
        _myMousePreventMiddleButtonScroll: Property.bool(true)
    };

    init() {
        this._myInputManager = null;

        // Prevents double global from same engine
        if (!hasInputManager(this.engine)) {
            this._myInputManager = new InputManager(this.engine);

            setInputManager(this._myInputManager, this.engine);
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
        if (this._myMousePreventContextMenu) {
            this._myInputManager.getMouse().setContextMenuActive(false);
        }

        if (this._myMousePreventMiddleButtonScroll) {
            this._myInputManager.getMouse().setMiddleButtonScrollActive(false);
        }
    }

    _addGamepadCores() {
        let handPoseParams = new HandPoseParams(this.engine);
        handPoseParams.myReferenceObject = getPlayerObjects(this.engine).myPlayerPivot;
        handPoseParams.myFixForward = this._myGamepadFixForward;
        handPoseParams.myForceEmulatedVelocities = false;

        let leftHandPose = new HandPose(Handedness.LEFT, handPoseParams);
        let rightHandPose = new HandPose(Handedness.RIGHT, handPoseParams);

        let leftXRGamepadCore = new XRGamepadCore(leftHandPose);
        let rightXRGamepadCore = new XRGamepadCore(rightHandPose);

        leftXRGamepadCore.setManageHandPose(true);
        rightXRGamepadCore.setManageHandPose(true);

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
}
/**
 * A quick and simple way to have the gamepads up and running
 * Add this manager to an object that will never be destroyed (like the Player object)
 * otherwise the gamepads will not be updated anymore
 */
WL.registerComponent('pp-gamepad-manager', {
    _myFixForward: { type: WL.Type.Bool, default: true }
}, {
    init() {
        this._myGamepadManager = new PP.GamepadManager();

        PP.myLeftGamepad = this._myGamepadManager.getLeftGamepad();
        PP.myRightGamepad = this._myGamepadManager.getRightGamepad();
        PP.myGamepads = this._myGamepadManager.getGamepads();
    },
    start() {
        this._addGamepadCores();

        this._myGamepadManager.start();
    },
    update(dt) {
        this._myGamepadManager.update(dt);
    },
    _addGamepadCores() {
        let handPoseParams = new PP.HandPoseParams();
        handPoseParams.myReferenceObject = PP.myPlayerObjects.myPlayerPivot;
        handPoseParams.myFixForward = this._myFixForward;
        handPoseParams.myForceEmulatedVelocities = false;

        let leftXRGamepadCore = new PP.XRGamepadCore(PP.Handedness.LEFT, handPoseParams);
        let rightXRGamepadCore = new PP.XRGamepadCore(PP.Handedness.RIGHT, handPoseParams);

        PP.myLeftGamepad.addGamepadCore("left_xr_gamepad", leftXRGamepadCore);
        PP.myRightGamepad.addGamepadCore("right_xr_gamepad", rightXRGamepadCore);

        let leftKeyboardGamepadCore = new PP.KeyboardGamepadCore(PP.Handedness.LEFT, leftXRGamepadCore.getHandPose());
        let rightKeyboardGamepadCore = new PP.KeyboardGamepadCore(PP.Handedness.RIGHT, rightXRGamepadCore.getHandPose());

        PP.myLeftGamepad.addGamepadCore("left_keyboard_gamepad", leftKeyboardGamepadCore);
        PP.myRightGamepad.addGamepadCore("right_keyboard_gamepad", rightKeyboardGamepadCore);
    }
});

PP.myLeftGamepad = null;
PP.myRightGamepad = null;
PP.myGamepads = null;
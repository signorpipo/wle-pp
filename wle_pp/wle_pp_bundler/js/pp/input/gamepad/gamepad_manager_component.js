/**
 * A quick and simple way to have the gamepads up and running
 * Add this manager to an object that will never be destroyed (like the Player object)
 * otherwise the gamepads will not be updated anymore
 */
WL.registerComponent('pp-gamepad-manager', {
    _myFixForward: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        this._myGamepadManager = new PP.GamepadManager(this._myFixForward);

        PP.myLeftGamepad = this._myGamepadManager.getLeftGamepad();
        PP.myRightGamepad = this._myGamepadManager.getRightGamepad();
        PP.myGamepads = this._myGamepadManager.getGamepads();
    },
    start: function () {
        this._myGamepadManager.start();
    },
    update: function (dt) {
        this._myGamepadManager.update(dt);
    },
});

PP.myLeftGamepad = null;
PP.myRightGamepad = null;
PP.myGamepads = null;
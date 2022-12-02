PP.KeyboardGamepadCore = class KeyboardGamepadCore extends PP.GamepadCore {

    constructor(handedness, handPose) {
        super(handedness);

        this._myHandPose = handPose; // can be null for keyboard
        this._myHandPoseUpdateActive = false;
    }

    getHandedness() {
        return this._myHandedness;
    }

    getHandPose() {
        return this._myHandPose;
    }

    setHandPoseUpdateActive(active) {
        this._myHandPoseUpdateActive = active;
    }

    isHandPoseUpdateActive() {
        return this._myHandPoseUpdateActive;
    }

    isGamepadCoreActive() {
        return true;
    }

    start() {
        if (this._myHandPose && this._myHandPoseUpdateActive) {
            this._myHandPose.start();
        }
    }

    preUpdate(dt) {
        if (this._myHandPose && this._myHandPoseUpdateActive) {
            this._myHandPose.update(dt);
        }
    }

    getButtonData(buttonID) {
        let buttonData = { myIsPressed: false, myIsTouched: false, myValue: 0 };

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == PP.Handedness.LEFT) {
                switch (buttonID) {
                    case PP.GamepadButtonID.SELECT:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.E) || PP.myKeyboard.isKeyPressed(PP.KeyID.e);
                        break;
                    case PP.GamepadButtonID.SQUEEZE:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.Q) || PP.myKeyboard.isKeyPressed(PP.KeyID.q);
                        break;
                    case PP.GamepadButtonID.TOUCHPAD:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.X) || PP.myKeyboard.isKeyPressed(PP.KeyID.x);
                        break;
                    case PP.GamepadButtonID.THUMBSTICK:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.R) || PP.myKeyboard.isKeyPressed(PP.KeyID.r);
                        break;
                    case PP.GamepadButtonID.BOTTOM_BUTTON:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.C) || PP.myKeyboard.isKeyPressed(PP.KeyID.c);
                        break;
                    case PP.GamepadButtonID.TOP_BUTTON:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.F) || PP.myKeyboard.isKeyPressed(PP.KeyID.f);
                        break;
                    case PP.GamepadButtonID.THUMB_REST:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.V) || PP.myKeyboard.isKeyPressed(PP.KeyID.v);
                        break;
                }
            } else {
                switch (buttonID) {
                    case PP.GamepadButtonID.SELECT:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.U) || PP.myKeyboard.isKeyPressed(PP.KeyID.u);
                        break;
                    case PP.GamepadButtonID.SQUEEZE:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.O) || PP.myKeyboard.isKeyPressed(PP.KeyID.o);
                        break;
                    case PP.GamepadButtonID.TOUCHPAD:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.M) || PP.myKeyboard.isKeyPressed(PP.KeyID.m);
                        break;
                    case PP.GamepadButtonID.THUMBSTICK:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.Y) || PP.myKeyboard.isKeyPressed(PP.KeyID.y);
                        break;
                    case PP.GamepadButtonID.BOTTOM_BUTTON:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.N) || PP.myKeyboard.isKeyPressed(PP.KeyID.n);
                        break;
                    case PP.GamepadButtonID.TOP_BUTTON:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.H) || PP.myKeyboard.isKeyPressed(PP.KeyID.h);
                        break;
                    case PP.GamepadButtonID.THUMB_REST:
                        buttonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.B) || PP.myKeyboard.isKeyPressed(PP.KeyID.b);
                        break;
                }
            }
        }

        if (buttonData.myIsPressed) {
            buttonData.myIsTouched = true;
            buttonData.myValue = 1;
        }

        return buttonData;
    }

    getAxesData() {
        let axes = [0.0, 0.0];

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == PP.Handedness.LEFT) {
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.W) || PP.myKeyboard.isKeyPressed(PP.KeyID.w)) axes[1] += 1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.S) || PP.myKeyboard.isKeyPressed(PP.KeyID.s)) axes[1] += -1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.D) || PP.myKeyboard.isKeyPressed(PP.KeyID.d)) axes[0] += 1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.A) || PP.myKeyboard.isKeyPressed(PP.KeyID.a)) axes[0] += -1.0;
            } else {
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.I) || PP.myKeyboard.isKeyPressed(PP.KeyID.i) || PP.myKeyboard.isKeyPressed(PP.KeyID.UP)) axes[1] += 1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.K) || PP.myKeyboard.isKeyPressed(PP.KeyID.k) || PP.myKeyboard.isKeyPressed(PP.KeyID.DOWN)) axes[1] += -1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.L) || PP.myKeyboard.isKeyPressed(PP.KeyID.l) || PP.myKeyboard.isKeyPressed(PP.KeyID.RIGHT)) axes[0] += 1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.J) || PP.myKeyboard.isKeyPressed(PP.KeyID.j) || PP.myKeyboard.isKeyPressed(PP.KeyID.LEFT)) axes[0] += -1.0;
            }
        }

        return axes;
    }

    getHapticActuators() {
        let hapticActuators = [];
        return hapticActuators;
    }
};
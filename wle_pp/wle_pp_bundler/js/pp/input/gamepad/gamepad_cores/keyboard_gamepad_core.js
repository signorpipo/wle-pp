// xr-standard mapping is assumed
PP.KeyboardGamepadCore = class KeyboardGamepadCore extends PP.GamepadCore {

    constructor(handedness, handPose) {
        super(handedness);

        this._myHandPose = handPose; // can be null for keyboard
        this._myHandPoseUpdateActive = false;

        this._myKeyboard = new PP.Keyboard();
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
        this._myKeyboard.start();

        if (this._myHandPose && this._myHandPoseUpdateActive) {
            this._myHandPose.start();
        }
    }

    preUpdate(dt) {
        this._myKeyboard.update(dt);

        if (this._myHandPose && this._myHandPoseUpdateActive) {
            this._myHandPose.update(dt);
        }
    }

    getButtonData(buttonType) {
        let buttonData = { myIsPressed: false, myIsTouched: false, myValue: 0 };

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == PP.Handedness.LEFT) {
                switch (buttonType) {
                    case PP.ButtonType.SELECT:
                        buttonData.myIsPressed = this._myKeyboard.isKeyPressed(PP.KeyType.C) || this._myKeyboard.isKeyPressed(PP.KeyType.c);
                        break;
                    case PP.ButtonType.SQUEEZE:
                        buttonData.myIsPressed = this._myKeyboard.isKeyPressed(PP.KeyType.F) || this._myKeyboard.isKeyPressed(PP.KeyType.f);
                        break;
                    case PP.ButtonType.THUMBSTICK:
                        buttonData.myIsPressed = this._myKeyboard.isKeyPressed(PP.KeyType.R) || this._myKeyboard.isKeyPressed(PP.KeyType.r);
                        break;
                    case PP.ButtonType.TOP_BUTTON:
                        buttonData.myIsPressed = this._myKeyboard.isKeyPressed(PP.KeyType.E) || this._myKeyboard.isKeyPressed(PP.KeyType.e);
                        break;
                    case PP.ButtonType.BOTTOM_BUTTON:
                        buttonData.myIsPressed = this._myKeyboard.isKeyPressed(PP.KeyType.Q) || this._myKeyboard.isKeyPressed(PP.KeyType.q);
                        break;
                }
            } else {
                switch (buttonType) {
                    case PP.ButtonType.SELECT:
                        buttonData.myIsPressed = this._myKeyboard.isKeyPressed(PP.KeyType.N) || this._myKeyboard.isKeyPressed(PP.KeyType.n);
                        break;
                    case PP.ButtonType.SQUEEZE:
                        buttonData.myIsPressed = this._myKeyboard.isKeyPressed(PP.KeyType.H) || this._myKeyboard.isKeyPressed(PP.KeyType.h);
                        break;
                    case PP.ButtonType.THUMBSTICK:
                        buttonData.myIsPressed = this._myKeyboard.isKeyPressed(PP.KeyType.Y) || this._myKeyboard.isKeyPressed(PP.KeyType.y);
                        break;
                    case PP.ButtonType.TOP_BUTTON:
                        buttonData.myIsPressed = this._myKeyboard.isKeyPressed(PP.KeyType.U) || this._myKeyboard.isKeyPressed(PP.KeyType.u);
                        break;
                    case PP.ButtonType.BOTTOM_BUTTON:
                        buttonData.myIsPressed = this._myKeyboard.isKeyPressed(PP.KeyType.O) || this._myKeyboard.isKeyPressed(PP.KeyType.o);
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
                if (this._myKeyboard.isKeyPressed(PP.KeyType.W) || this._myKeyboard.isKeyPressed(PP.KeyType.w)) axes[1] += 1.0;
                if (this._myKeyboard.isKeyPressed(PP.KeyType.S) || this._myKeyboard.isKeyPressed(PP.KeyType.s)) axes[1] += -1.0;
                if (this._myKeyboard.isKeyPressed(PP.KeyType.D) || this._myKeyboard.isKeyPressed(PP.KeyType.d)) axes[0] += 1.0;
                if (this._myKeyboard.isKeyPressed(PP.KeyType.A) || this._myKeyboard.isKeyPressed(PP.KeyType.a)) axes[0] += -1.0;
            } else {
                if (this._myKeyboard.isKeyPressed(PP.KeyType.I) || this._myKeyboard.isKeyPressed(PP.KeyType.i) || this._myKeyboard.isKeyPressed(PP.KeyType.UP)) axes[1] += 1.0;
                if (this._myKeyboard.isKeyPressed(PP.KeyType.K) || this._myKeyboard.isKeyPressed(PP.KeyType.k) || this._myKeyboard.isKeyPressed(PP.KeyType.DOWN)) axes[1] += -1.0;
                if (this._myKeyboard.isKeyPressed(PP.KeyType.L) || this._myKeyboard.isKeyPressed(PP.KeyType.l) || this._myKeyboard.isKeyPressed(PP.KeyType.RIGHT)) axes[0] += 1.0;
                if (this._myKeyboard.isKeyPressed(PP.KeyType.J) || this._myKeyboard.isKeyPressed(PP.KeyType.j) || this._myKeyboard.isKeyPressed(PP.KeyType.LEFT)) axes[0] += -1.0;
            }
        }

        return axes;
    }

    getHapticActuators() {
        let hapticActuators = [];
        return hapticActuators;
    }
};
PP.KeyboardGamepadCore = class KeyboardGamepadCore extends PP.GamepadCore {

    constructor(handedness, handPose = null) {
        super(handedness, handPose);

        this._myHandPoseUpdateActive = false;

        // Support Variables
        this._myButtonData = this._createButtonData();
        this._myAxesData = this._createAxesData();
        this._myHapticActuators = [];
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
        this._myButtonData.myIsPressed = false;
        this._myButtonData.myIsTouched = false;
        this._myButtonData.myValue = 0;

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == PP.Handedness.LEFT) {
                switch (buttonID) {
                    case PP.GamepadButtonID.SELECT:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.E) || PP.myKeyboard.isKeyPressed(PP.KeyID.e);
                        break;
                    case PP.GamepadButtonID.SQUEEZE:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.Q) || PP.myKeyboard.isKeyPressed(PP.KeyID.q);
                        break;
                    case PP.GamepadButtonID.TOUCHPAD:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.X) || PP.myKeyboard.isKeyPressed(PP.KeyID.x);
                        break;
                    case PP.GamepadButtonID.THUMBSTICK:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.R) || PP.myKeyboard.isKeyPressed(PP.KeyID.r);
                        break;
                    case PP.GamepadButtonID.BOTTOM_BUTTON:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.C) || PP.myKeyboard.isKeyPressed(PP.KeyID.c);
                        break;
                    case PP.GamepadButtonID.TOP_BUTTON:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.F) || PP.myKeyboard.isKeyPressed(PP.KeyID.f);
                        break;
                    case PP.GamepadButtonID.THUMB_REST:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.V) || PP.myKeyboard.isKeyPressed(PP.KeyID.v);
                        break;
                }
            } else {
                switch (buttonID) {
                    case PP.GamepadButtonID.SELECT:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.U) || PP.myKeyboard.isKeyPressed(PP.KeyID.u);
                        break;
                    case PP.GamepadButtonID.SQUEEZE:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.O) || PP.myKeyboard.isKeyPressed(PP.KeyID.o);
                        break;
                    case PP.GamepadButtonID.TOUCHPAD:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.M) || PP.myKeyboard.isKeyPressed(PP.KeyID.m);
                        break;
                    case PP.GamepadButtonID.THUMBSTICK:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.Y) || PP.myKeyboard.isKeyPressed(PP.KeyID.y);
                        break;
                    case PP.GamepadButtonID.BOTTOM_BUTTON:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.N) || PP.myKeyboard.isKeyPressed(PP.KeyID.n);
                        break;
                    case PP.GamepadButtonID.TOP_BUTTON:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.H) || PP.myKeyboard.isKeyPressed(PP.KeyID.h);
                        break;
                    case PP.GamepadButtonID.THUMB_REST:
                        this._myButtonData.myIsPressed = PP.myKeyboard.isKeyPressed(PP.KeyID.B) || PP.myKeyboard.isKeyPressed(PP.KeyID.b);
                        break;
                }
            }
        }

        if (this._myButtonData.myIsPressed) {
            this._myButtonData.myIsTouched = true;
            this._myButtonData.myValue = 1;
        }

        return this._myButtonData;
    }

    getAxesData(axesID) {
        this._myAxesData.vec2_zero();

        if (this.isGamepadCoreActive()) {
            if (this.getHandedness() == PP.Handedness.LEFT) {
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.W) || PP.myKeyboard.isKeyPressed(PP.KeyID.w)) this._myAxesData[1] += 1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.S) || PP.myKeyboard.isKeyPressed(PP.KeyID.s)) this._myAxesData[1] += -1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.D) || PP.myKeyboard.isKeyPressed(PP.KeyID.d)) this._myAxesData[0] += 1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.A) || PP.myKeyboard.isKeyPressed(PP.KeyID.a)) this._myAxesData[0] += -1.0;
            } else {
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.I) || PP.myKeyboard.isKeyPressed(PP.KeyID.i) || PP.myKeyboard.isKeyPressed(PP.KeyID.UP)) this._myAxesData[1] += 1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.K) || PP.myKeyboard.isKeyPressed(PP.KeyID.k) || PP.myKeyboard.isKeyPressed(PP.KeyID.DOWN)) this._myAxesData[1] += -1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.L) || PP.myKeyboard.isKeyPressed(PP.KeyID.l) || PP.myKeyboard.isKeyPressed(PP.KeyID.RIGHT)) this._myAxesData[0] += 1.0;
                if (PP.myKeyboard.isKeyPressed(PP.KeyID.J) || PP.myKeyboard.isKeyPressed(PP.KeyID.j) || PP.myKeyboard.isKeyPressed(PP.KeyID.LEFT)) this._myAxesData[0] += -1.0;
            }
        }

        return this._myAxesData;
    }

    getHapticActuators() {
        return this._myHapticActuators;
    }
};
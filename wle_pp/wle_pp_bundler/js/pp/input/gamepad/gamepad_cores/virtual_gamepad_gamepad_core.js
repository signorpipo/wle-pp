PP.VirtualGamepadGamepadCore = class VirtualGamepadGamepadCore extends PP.GamepadCore {

    constructor(virtualGamepad, handedness, handPose = null) {
        super(handedness, handPose);

        this._myHandPoseUpdateActive = false;

        this._myVirtualGamepad = virtualGamepad;

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
        return this._myVirtualGamepad.isVisible();
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
            if (this._myVirtualGamepad.isButtonPressed(this._myHandedness, buttonID)) {
                this._myButtonData.myIsPressed = true;
                this._myButtonData.myIsTouched = true;
                this._myButtonData.myValue = 1;
            }
        }

        return this._myButtonData;
    }

    getAxesData(axesID) {
        this._myAxesData.vec2_zero();

        if (this.isGamepadCoreActive()) {
            this._myVirtualGamepad.getAxes(this._myHandedness, this._myAxesData);
        }

        return this._myAxesData;
    }

    getHapticActuators() {
        return this._myHapticActuators;
    }
};
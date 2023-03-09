PP.UniversalGamepad = class UniversalGamepad extends PP.BaseGamepad {

    constructor(handedness) {
        super(handedness);

        this._myGamepadCores = new Map();

        this._myStarted = false;

        // Support Variables
        this._myButtonData = this._createButtonData();
        this._myAxesData = this._createAxesData();
        this._myHapticActuators = [];

    }

    addGamepadCore(id, gamepadCore) {
        if (gamepadCore.getHandedness() == this.getHandedness()) {
            this._myGamepadCores.set(id, gamepadCore);
            if (this._myStarted) {
                gamepadCore.start();
            }
        }
    }

    getGamepadCore(id) {
        return this._myGamepadCores.get(id);
    }

    removeGamepadCore(id) {
        let gamepadCore = this._myGamepadCores.get(id);
        if (gamepadCore) {
            this._myGamepadCores.delete(id);
        }
    }

    removeAllGamepadCores() {
        for (let id of this._myGamepadCores.keys()) {
            this.removeGamepadCore(id);
        }
    }

    getHandPose() {
        let handPose = null;

        for (let core of this._myGamepadCores.values()) {
            if (core.isGamepadCoreActive()) {
                let currentCoreHandPose = core.getHandPose();
                if (handPose == null || (currentCoreHandPose != null && currentCoreHandPose.isValid())) {
                    handPose = currentCoreHandPose;
                }
            }

            if (handPose != null && handPose.isValid()) {
                break;
            }
        }

        return handPose;
    }

    _start() {
        for (let core of this._myGamepadCores.values()) {
            core.start();
        }

        this._myStarted = true;
    }

    _preUpdate(dt) {
        for (let core of this._myGamepadCores.values()) {
            core.preUpdate(dt);
        }
    }

    _postUpdate(dt) {
        for (let core of this._myGamepadCores.values()) {
            core.postUpdate(dt);
        }
    }

    _getButtonData(buttonID) {
        this._myButtonData.myIsPressed = false;
        this._myButtonData.myIsTouched = false;
        this._myButtonData.myValue = 0;

        for (let core of this._myGamepadCores.values()) {
            if (core.isGamepadCoreActive()) {
                let coreButtonData = core.getButtonData(buttonID);
                this._myButtonData.myIsPressed = this._myButtonData.myIsPressed || coreButtonData.myIsPressed;
                this._myButtonData.myIsTouched = this._myButtonData.myIsTouched || coreButtonData.myIsTouched;
                if (Math.abs(coreButtonData.myValue) > Math.abs(this._myButtonData.myValue)) {
                    this._myButtonData.myValue = coreButtonData.myValue;
                }
            }
        }

        return this._myButtonData;
    }

    _getAxesData(axesID) {
        this._myAxesData.vec2_zero();

        for (let core of this._myGamepadCores.values()) {
            if (core.isGamepadCoreActive()) {
                let coreAxesData = core.getAxesData(axesID);

                if (Math.abs(coreAxesData[0]) > Math.abs(this._myAxesData[0])) {
                    this._myAxesData[0] = coreAxesData[0];
                }

                if (Math.abs(coreAxesData[1]) > Math.abs(this._myAxesData[1])) {
                    this._myAxesData[1] = coreAxesData[1];
                }
            }
        }

        return this._myAxesData;
    }

    _getHapticActuators() {
        this._myHapticActuators.pp_clear();

        for (let core of this._myGamepadCores.values()) {
            if (core.isGamepadCoreActive()) {
                this._myHapticActuators.push(...core.getHapticActuators());
            }
        }

        return this._myHapticActuators;
    }
};
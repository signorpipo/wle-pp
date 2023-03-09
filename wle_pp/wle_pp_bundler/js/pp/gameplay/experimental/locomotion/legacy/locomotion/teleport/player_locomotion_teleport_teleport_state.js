PP.PlayerLocomotionTeleportTeleportType = {
    INSTANT: 0,
    BLINK: 1,
    SHIFT: 2,
};

PP.PlayerLocomotionTeleportTeleportParams = class PlayerLocomotionTeleportTeleportParams {
    constructor() {
        this.myTeleportType = PP.PlayerLocomotionTeleportTeleportType.SHIFT;

        this.myBlinkFadeOutSeconds = 0.1;
        this.myBlinkFadeInSeconds = 0.1;
        this.myBlinkWaitSeconds = 0.1;
        this.myBlinkSphereColor = PP.vec3_create();
        this.myBlinkSphereScale = 0.1;

        this.myShiftMovementSeconds = 0.15;
        this.myShiftMovementSecondsMultiplierOverDistanceFunction = null;
        this.myShiftMovementEasingFunction = PP.EasingFunction.easeInOut;

        this.myShiftRotateSeconds = 1;
        this.myShiftRotateSecondsMultiplierOverAngleFunction = null;
        this.myShiftRotateEasingFunction = PP.EasingFunction.easeOut;
        this.myShiftRotateStartAfterMovementPercentage = 0.7;

        this.myShiftRotateSecondsMultiplierOverAngleFunction = function (angle) {
            return PP.EasingFunction.easeOut(angle / 180);
        };
    }
};

PP.PlayerLocomotionTeleportTeleportState = class PlayerLocomotionTeleportTeleportState extends PP.PlayerLocomotionTeleportState {
    constructor(teleportParams, teleportRuntimeParams, locomotionRuntimeParams) {
        super(teleportParams, teleportRuntimeParams, locomotionRuntimeParams);

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "Locomotion Teleport Teleport");

        this._myFSM.addState("init");
        this._myFSM.addState("idle");

        this._myBlinkState = new PP.PlayerLocomotionTeleportTeleportBlinkState(teleportParams, teleportRuntimeParams, locomotionRuntimeParams);
        this._myShiftState = new PP.PlayerLocomotionTeleportTeleportShiftState(teleportParams, teleportRuntimeParams, locomotionRuntimeParams);

        this._myFSM.addState("instant_teleport", this._instantUpdate.bind(this));
        this._myFSM.addState("blink_teleport", this._myBlinkState);
        this._myFSM.addState("shift_teleport", this._myShiftState);

        this._myFSM.addTransition("init", "idle", "start");

        this._myFSM.addTransition("idle", "instant_teleport", "start_instant");
        this._myFSM.addTransition("idle", "blink_teleport", "start_blink");
        this._myFSM.addTransition("idle", "shift_teleport", "start_shift");

        this._myFSM.addTransition("instant_teleport", "idle", "done", this._teleportDone.bind(this));
        this._myFSM.addTransition("blink_teleport", "idle", "done", this._teleportDone.bind(this));
        this._myFSM.addTransition("shift_teleport", "idle", "done", this._teleportDone.bind(this));

        this._myFSM.addTransition("idle", "idle", "stop");
        this._myFSM.addTransition("instant_teleport", "idle", "stop", this._instantStop.bind(this));
        this._myFSM.addTransition("blink_teleport", "idle", "stop");
        this._myFSM.addTransition("shift_teleport", "idle", "stop");

        this._myFSM.init("init");
        this._myFSM.perform("start");
    }

    start(fsm) {
        this._myParentFSM = fsm;

        switch (this._myTeleportParams.myTeleportParams.myTeleportType) {
            case PP.PlayerLocomotionTeleportTeleportType.INSTANT:
                this._myFSM.perform("start_instant");
                break;
            case PP.PlayerLocomotionTeleportTeleportType.BLINK:
                this._myFSM.perform("start_blink");
                break;
            case PP.PlayerLocomotionTeleportTeleportType.SHIFT:
                this._myFSM.perform("start_shift");
                break;
            default:
                this._myFSM.perform("start_instant");
        }
    }

    end() {
    }

    update(dt, fsm) {
        this._myFSM.update(dt);
    }

    completeTeleport() {
        this._myFSM.perform("stop");
        this._teleportToPosition(this._myTeleportRuntimeParams.myTeleportPosition, this._myTeleportRuntimeParams.myTeleportRotationOnUp, this._myLocomotionRuntimeParams.myCollisionRuntimeParams);
    }

    _instantUpdate(dt, fsm) {
        this._teleportToPosition(this._myTeleportRuntimeParams.myTeleportPosition, this._myTeleportRuntimeParams.myTeleportRotationOnUp, this._myLocomotionRuntimeParams.myCollisionRuntimeParams);
        this._myLocomotionRuntimeParams.myTeleportJustPerformed = true;
        fsm.perform("done");
    }

    _instantStop(fsm) {
        this._instantUpdate(0, fsm);
    }

    _completeTeleport() {
        fsm.perform("stop");
    }

    _teleportDone() {
        this._myTeleportParams.myPlayerTransformManager.resetReal(true, false, false);
        this._myTeleportParams.myPlayerTransformManager.resetHeadToReal();

        this._myParentFSM.performDelayed("done");
    }
};
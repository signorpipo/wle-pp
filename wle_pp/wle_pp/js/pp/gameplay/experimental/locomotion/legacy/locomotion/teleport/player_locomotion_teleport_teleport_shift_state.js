import { Timer } from "../../../../../../cauldron/cauldron/timer";
import { FSM } from "../../../../../../cauldron/fsm/fsm";
import { vec3_create } from "../../../../../../plugin/js/extensions/array_extension";
import { PlayerLocomotionTeleportState } from "./player_locomotion_teleport_state";

export class PlayerLocomotionTeleportTeleportShiftState extends PlayerLocomotionTeleportState {

    constructor(teleportParams, teleportRuntimeParams, locomotionRuntimeParams) {
        super(teleportParams, teleportRuntimeParams, locomotionRuntimeParams);

        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, "Locomotion Teleport Teleport Shift");

        this._myFSM.addState("init");
        this._myFSM.addState("idle");

        this._myFSM.addState("shifting", this._shiftingUpdate.bind(this));

        this._myFSM.addTransition("init", "idle", "start");

        this._myFSM.addTransition("idle", "shifting", "teleport", this._startShifting.bind(this));
        this._myFSM.addTransition("shifting", "idle", "done", this._teleportDone.bind(this));

        this._myFSM.addTransition("idle", "idle", "stop");
        this._myFSM.addTransition("shifting", "idle", "stop", this._stop.bind(this));

        this._myFSM.init("init");
        this._myFSM.perform("start");

        this._myShiftMovementTimer = new Timer(this._myTeleportParams.myTeleportParams.myShiftMovementSeconds);
        this._myShiftRotateTimer = new Timer(this._myTeleportParams.myTeleportParams.myShiftRotateSeconds, false);

        this._myFeetStartPosition = vec3_create();

        this._myCurrentRotationOnUp = 0;
        this._myStartRotationOnUp = 0;

        //Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).add(new EasyTuneNumber("Shift Movement Seconds", this._myTeleportParams.myTeleportParams.myShiftMovementSeconds, 0.5, 3, 0, undefined, this._myTeleportParams.myEngine));
        //Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).add(new EasyTuneNumber("Shift Rotate Seconds", this._myTeleportParams.myTeleportParams.myShiftRotateSeconds, 0.5, 3, 0, undefined, this._myTeleportParams.myEngine));
        //Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).add(new EasyTuneNumber("Shift Rotate Start Percentage", this._myTeleportParams.myTeleportParams.myShiftRotateStartAfterMovementPercentage, 0.5, 3, 0, 1, this._myTeleportParams.myEngine));
    }

    start(fsm) {
        this._myParentFSM = fsm;

        this._myFSM.perform("teleport");
    }

    end() {
        this._myFSM.perform("stop");
    }

    update(dt, fsm) {
        //this._myTeleportParams.myTeleportParams.myShiftMovementSeconds = Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).get("Shift Movement Seconds");
        //this._myTeleportParams.myTeleportParams.myShiftRotateSeconds = Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).get("Shift Rotate Seconds");
        //this._myTeleportParams.myTeleportParams.myShiftRotateStartAfterMovementPercentage = Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).get("Shift Rotate Start Percentage");

        this._myFSM.update(dt);
    }

    _startShifting() {
        this._myTeleportParams.myPlayerTransformManager.getParams().mySyncPositionDisabled = true;

        this._myLocomotionRuntimeParams.myIsTeleporting = true;
        this._myFeetStartPosition = this._myTeleportParams.myPlayerHeadManager.getPositionFeet(this._myFeetStartPosition);

        this._myShiftMovementTimer.start(this._myTeleportParams.myTeleportParams.myShiftMovementSeconds);

        if (this._myTeleportParams.myTeleportParams.myShiftMovementSecondsMultiplierOverDistanceFunction) {
            let distance = this._myTeleportRuntimeParams.myTeleportPosition.vec3_distance(this._myFeetStartPosition);
            let multiplier = this._myTeleportParams.myTeleportParams.myShiftMovementSecondsMultiplierOverDistanceFunction(distance);
            this._myShiftMovementTimer.start(this._myTeleportParams.myTeleportParams.myShiftMovementSeconds * multiplier);
        }

        this._myShiftRotateTimer.reset(this._myTeleportParams.myTeleportParams.myShiftRotateSeconds);
        if (this._myTeleportParams.myTeleportParams.myShiftRotateSecondsMultiplierOverAngleFunction) {
            let multiplier = this._myTeleportParams.myTeleportParams.myShiftRotateSecondsMultiplierOverAngleFunction(Math.abs(this._myTeleportRuntimeParams.myTeleportRotationOnUp));
            this._myShiftRotateTimer.reset(this._myTeleportParams.myTeleportParams.myShiftRotateSeconds * multiplier);
        }

        this._myStartRotationOnUp = this._myTeleportRuntimeParams.myTeleportRotationOnUp;
        this._myCurrentRotationOnUp = 0;
    }

    _stop() {
        this._teleport();
    }

    _teleportDone() {
        this._teleport();
        this._myParentFSM.performDelayed("done");
    }

    _teleport() {
        this._myTeleportParams.myPlayerTransformManager.getParams().mySyncPositionDisabled = false;
        this._myLocomotionRuntimeParams.myIsTeleporting = false;
        this._myLocomotionRuntimeParams.myTeleportJustPerformed = true;
        this._teleportToPosition(this._myTeleportRuntimeParams.myTeleportPosition, this._myStartRotationOnUp - this._myCurrentRotationOnUp, this._myLocomotionRuntimeParams.myCollisionRuntimeParams);
    }
}



// IMPLEMENTATION

PlayerLocomotionTeleportTeleportShiftState.prototype._shiftingUpdate = function () {
    let movementToTeleportFeet = vec3_create();
    let newFeetPosition = vec3_create();
    return function _shiftingUpdate(dt, fsm) {
        this._myShiftMovementTimer.update(dt);
        this._myShiftRotateTimer.update(dt);

        if (this._myShiftRotateTimer.isDone() && this._myShiftMovementTimer.isDone()) {
            fsm.perform("done");
        } else {
            newFeetPosition.vec3_copy(this._myTeleportRuntimeParams.myTeleportPosition);

            if (this._myShiftMovementTimer.isStarted() || this._myShiftMovementTimer.isJustDone()) {

                let interpolationFactor = this._myTeleportParams.myTeleportParams.myShiftMovementEasingFunction(this._myShiftMovementTimer.getPercentage());

                if (interpolationFactor >= this._myTeleportParams.myTeleportParams.myShiftRotateStartAfterMovementPercentage && !this._myShiftRotateTimer.isStarted()) {
                    this._myShiftRotateTimer.start();
                    this._myShiftRotateTimer.update(dt);
                }

                movementToTeleportFeet = this._myTeleportRuntimeParams.myTeleportPosition.vec3_sub(this._myFeetStartPosition, movementToTeleportFeet);
                movementToTeleportFeet.vec3_scale(interpolationFactor, movementToTeleportFeet);
                newFeetPosition = this._myFeetStartPosition.vec3_add(movementToTeleportFeet, newFeetPosition);
            }

            let rotationOnUp = 0;
            if (this._myShiftRotateTimer.isRunning() || this._myShiftRotateTimer.isJustDone()) {
                let interpolationFactor = this._myTeleportParams.myTeleportParams.myShiftRotateEasingFunction(this._myShiftRotateTimer.getPercentage());

                let newCurrentRotationOnUp = this._myStartRotationOnUp * interpolationFactor;
                rotationOnUp = newCurrentRotationOnUp - this._myCurrentRotationOnUp;

                this._myCurrentRotationOnUp = newCurrentRotationOnUp;
            }

            this._teleportToPosition(newFeetPosition, rotationOnUp, this._myLocomotionRuntimeParams.myCollisionRuntimeParams, true);
        }
    };
}();



Object.defineProperty(PlayerLocomotionTeleportTeleportShiftState.prototype, "_shiftingUpdate", { enumerable: false });
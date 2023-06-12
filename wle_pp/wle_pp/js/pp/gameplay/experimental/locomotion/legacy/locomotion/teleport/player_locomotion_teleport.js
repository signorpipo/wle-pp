import { FSM } from "../../../../../../cauldron/fsm/fsm";
import { XRUtils } from "../../../../../../cauldron/utils/xr_utils";
import { Handedness } from "../../../../../../input/cauldron/input_types";
import { MouseButtonID } from "../../../../../../input/cauldron/mouse";
import { GamepadAxesID } from "../../../../../../input/gamepad/gamepad_buttons";
import { quat2_create, vec3_create } from "../../../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../../../pp/globals";
import { CollisionCheckBridge } from "../../../../character_controller/collision/collision_check_bridge";
import { PlayerLocomotionMovement } from "../player_locomotion_movement";
import { PlayerLocomotionTeleportDetectionParams, PlayerLocomotionTeleportDetectionState } from "./player_locomotion_teleport_detection_state";
import { PlayerLocomotionTeleportDetectionVisualizerParams } from "./player_locomotion_teleport_detection_visualizer";
import { PlayerLocomotionTeleportTeleportParams, PlayerLocomotionTeleportTeleportState } from "./player_locomotion_teleport_teleport_state";

export class PlayerLocomotionTeleportParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myPlayerHeadManager = null;

        this.myCollisionCheckParams = null;

        this.myDetectionParams = new PlayerLocomotionTeleportDetectionParams();
        this.myVisualizerParams = new PlayerLocomotionTeleportDetectionVisualizerParams();
        this.myTeleportParams = new PlayerLocomotionTeleportTeleportParams();

        this.myHandedness = Handedness.LEFT;

        this.myPerformTeleportAsMovement = false;
        this.myTeleportAsMovementMaxDistanceFromTeleportPosition = 0.001;
        this.myTeleportAsMovementMaxSteps = 2;
        // When checking teleport as movement u may need to move more times to get to the position due to snap and gravity
        // This specifies how many movement u can try to get to the teleport position

        this.myTeleportAsMovementRemoveVerticalMovement = true;
        // This can be used to remove the vertical movement from the difference from the current and teleport position so that u can apply just
        // the gravity as vertical movement
        this.myTeleportAsMovementExtraVerticalMovementPerMeter = 1; // This simulate the gravity for the teleport movement

        this.myStickIdleThreshold = 0.1;

        this.myAdjustPositionEveryFrame = false;
        this.myGravityAcceleration = 0;
        this.myMaxGravitySpeed = 0;

        this.myEngine = engine;

        this.myDebugEnabled = false;
        this.myDebugDetectEnabled = false;
        this.myDebugShowEnabled = false;
        this.myDebugVisibilityEnabled = false;
    }
}

export class PlayerLocomotionTeleportRuntimeParams {

    constructor() {
        this.myTeleportPosition = vec3_create();
        this.myTeleportRotationOnUp = 0;
    }
}

export class PlayerLocomotionTeleport extends PlayerLocomotionMovement {

    constructor(teleportParams, locomotionRuntimeParams) {
        super(locomotionRuntimeParams);

        this._myTeleportParams = teleportParams;
        this._myTeleportRuntimeParams = new PlayerLocomotionTeleportRuntimeParams();

        this._myStickIdleCharge = true;

        this._myDetectionState = new PlayerLocomotionTeleportDetectionState(this._myTeleportParams, this._myTeleportRuntimeParams, this._myLocomotionRuntimeParams);
        this._myTeleportState = new PlayerLocomotionTeleportTeleportState(this._myTeleportParams, this._myTeleportRuntimeParams, this._myLocomotionRuntimeParams);

        this._myFSM = new FSM();
        //this._myFSM.setLogEnabled(true, "Locomotion Teleport");

        this._myFSM.addState("init");
        this._myFSM.addState("idle", this._idleUpdate.bind(this));
        this._myFSM.addState("detect", this._myDetectionState);
        this._myFSM.addState("teleport", this._myTeleportState);

        this._myFSM.addTransition("init", "idle", "start");

        this._myFSM.addTransition("idle", "detect", "detect");
        this._myFSM.addTransition("detect", "teleport", "teleport");
        this._myFSM.addTransition("detect", "idle", "cancel");
        this._myFSM.addTransition("teleport", "idle", "done");

        this._myFSM.addTransition("idle", "idle", "stop");
        this._myFSM.addTransition("detect", "idle", "stop");
        this._myFSM.addTransition("teleport", "idle", "stop", this._completeTeleport.bind(this));

        this._myFSM.init("init");
        this._myFSM.perform("start");

        this._myDestroyed = false;
    }

    start() {
    }

    stop() {
        this._myFSM.perform("stop");
    }

    canStop() {
        return this._myFSM.isInState("idle");
    }

    getParams() {
        return this._myTeleportParams;
    }

    getTeleportRuntimeParams() {
        return this._myTeleportRuntimeParams;
    }

    update(dt) {
        this._myLocomotionRuntimeParams.myTeleportJustPerformed = false;

        this._myFSM.update(dt);

        if (!this._myLocomotionRuntimeParams.myIsTeleporting && (this._myTeleportParams.myAdjustPositionEveryFrame || this._myTeleportParams.myGravityAcceleration != 0)) {
            this._applyGravity(dt);
        }

        if (this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnGround) {
            this._myLocomotionRuntimeParams.myIsFlying = false;
        }
    }

    _idleUpdate(dt) {
        if (this._startDetecting()) {
            this._myFSM.perform("detect");
        }
    }

    _startDetecting() {
        let startDetecting = false;

        if (!XRUtils.isSessionActive(this._myTeleportParams.myEngine)) {
            startDetecting = Globals.getMouse(this._myTeleportParams.myEngine).isButtonPressStart(MouseButtonID.MIDDLE) &&
                Globals.getMouse(this._myTeleportParams.myEngine).isTargetingRenderCanvas();
        } else {
            let axes = Globals.getGamepads(this._myTeleportParams.myEngine)[this._myTeleportParams.myHandedness].getAxesInfo(GamepadAxesID.THUMBSTICK).getAxes();

            if (axes.vec2_length() <= this._myTeleportParams.myStickIdleThreshold) {
                this._myStickIdleCharge = true;
            }

            if (this._myStickIdleCharge && axes[1] >= 0.75) {
                this._myStickIdleCharge = false;
                startDetecting = true;
            }
        }

        return startDetecting;
    }

    _completeTeleport() {
        this._myTeleportState.completeTeleport();
    }

    destroy() {
        this._myDestroyed = true;

        this._myDetectionState.destroy();

    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

PlayerLocomotionTeleport.prototype._applyGravity = function () {
    let playerUp = vec3_create();
    let gravityMovement = vec3_create();
    let feetTransformQuat = quat2_create();
    return function _applyGravity(dt) {
        // If gravity is zero it's still important to move to remain snapped and gather proper surface data even when not teleporting

        playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

        gravityMovement.vec3_zero();
        if (!this._myLocomotionRuntimeParams.myIsFlying && !this._myLocomotionRuntimeParams.myIsTeleporting) {
            this._myLocomotionRuntimeParams.myGravitySpeed += this._myTeleportParams.myGravityAcceleration * dt;

            if (Math.abs(this._myLocomotionRuntimeParams.myGravitySpeed) > Math.abs(this._myTeleportParams.myMaxGravitySpeed)) {
                this._myLocomotionRuntimeParams.myGravitySpeed = Math.pp_sign(this._myTeleportParams.myGravityAcceleration) * Math.abs(this._myTeleportParams.myMaxGravitySpeed);
            }

            gravityMovement = playerUp.vec3_scale(this._myLocomotionRuntimeParams.myGravitySpeed * dt, gravityMovement);
        } else {
            this._myLocomotionRuntimeParams.myGravitySpeed = 0;
        }

        feetTransformQuat = this._myTeleportParams.myPlayerHeadManager.getTransformFeetQuat(feetTransformQuat);
        CollisionCheckBridge.getCollisionCheck(this._myTeleportParams.myEngine).move(gravityMovement, feetTransformQuat, this._myTeleportParams.myCollisionCheckParams, this._myLocomotionRuntimeParams.myCollisionRuntimeParams);
        if (!this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myVerticalMovementCanceled) {
            this._myTeleportParams.myPlayerHeadManager.teleportPositionFeet(this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myNewPosition);
        }

        if (this._myLocomotionRuntimeParams.myGravitySpeed > 0 && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnCeiling ||
            this._myLocomotionRuntimeParams.myGravitySpeed < 0 && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnGround) {
            this._myLocomotionRuntimeParams.myGravitySpeed = 0;
        }
    };
}();
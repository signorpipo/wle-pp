import { FSM, SkipStateFunction } from "../../../../../../cauldron/fsm/fsm.js";
import { XRUtils } from "../../../../../../cauldron/utils/xr_utils.js";
import { Handedness } from "../../../../../../input/cauldron/input_types.js";
import { MouseButtonID } from "../../../../../../input/cauldron/mouse.js";
import { GamepadAxesID } from "../../../../../../input/gamepad/gamepad_buttons.js";
import { quat_create, vec3_create } from "../../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../../../pp/globals.js";
import { PlayerLocomotionMovement } from "../player_locomotion_movement.js";
import { PlayerLocomotionTeleportDetectionParams, PlayerLocomotionTeleportDetectionState } from "./player_locomotion_teleport_detection_state.js";
import { PlayerLocomotionTeleportDetectionVisualizerParams } from "./player_locomotion_teleport_detection_visualizer.js";
import { PlayerLocomotionTeleportTeleportParams, PlayerLocomotionTeleportTeleportState } from "./player_locomotion_teleport_teleport_state.js";

export class PlayerLocomotionTeleportParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myPlayerTransformManager = null;

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
        this.myTeleportForward = vec3_create(0, 0, 0);
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
        this._myFSM.addTransition("teleport", "idle", "done");

        this._myFSM.addTransition("idle", "idle", "stop");
        this._myFSM.addTransition("detect", "idle", "stop");
        this._myFSM.addTransition("teleport", "idle", "stop", this._completeTeleport.bind(this));

        this._myFSM.addTransition("idle", "idle", "cancel");
        this._myFSM.addTransition("detect", "idle", "cancel");
        this._myFSM.addTransition("teleport", "idle", "cancel", this._cancelTeleport.bind(this), SkipStateFunction.END);

        this._myFSM.init("init");
        this._myFSM.perform("start");

        this._myIsUpdating = false;
        this._myDestroyed = false;

        this.setActive(true);
    }

    start() {
    }

    stop() {
        this._myFSM.perform("stop");
    }

    cancelTeleport() {
        if (!this._myIsUpdating && this._myFSM.isInState("teleport")) {
            this._myFSM.perform("cancel");
        }
    }

    canStop() {
        return this._myFSM.isInState("idle");
    }

    isTeleporting() {
        return this._myFSM.isInState("teleport");
    }

    getParams() {
        return this._myTeleportParams;
    }

    getTeleportRuntimeParams() {
        return this._myTeleportRuntimeParams;
    }

    update(dt) {
        if (!this.isActive()) return;

        this._myIsUpdating = true;

        this._prepareCollisionCheckParams();

        this._myLocomotionRuntimeParams.myTeleportJustPerformed = false;

        this._myFSM.update(dt);

        if (!this._myLocomotionRuntimeParams.myIsTeleporting && (this._myTeleportParams.myAdjustPositionEveryFrame || this._myTeleportParams.myGravityAcceleration != 0)) {
            this._applyGravity(dt);
        }

        if (this._myTeleportParams.myPlayerTransformManager.getCollisionRuntimeParams().myIsOnGround) {
            this._myLocomotionRuntimeParams.myIsFlying = false;
        }

        this._myIsUpdating = false;
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

    _cancelDetection() {
        this._myDetectionState.cancel();
    }

    _cancelTeleport() {
        this._myTeleportState.cancelTeleport();
    }

    _prepareCollisionCheckParams() {
        //this._myTeleportCollisionCheckParams.copy(this._myTeleportParams.myPlayerTransformManager.getTeleportCollisionCheckParams());

        // Increased so to let teleport on steep slopes from above (from below is fixed through detection myGroundAngleToIgnoreUpward)
        // this._myTeleportCollisionCheckParams.myGroundAngleToIgnore = Math.max(61, this._myTeleportCollisionCheckParams.myGroundAngleToIgnore);

        /*
        this._myTeleportCollisionCheckParams.myExtraTeleportCheckCallback = function (
            offsetTeleportPosition, endPosition, feetPosition, transformUp, transformForward, height,
            collisionCheckParams, prevCollisionRuntimeParams, collisionRuntimeParams, newFeetPosition

        ) {
            let isTeleportingUpward = endPosition.vec3_isFartherAlongAxis(feetPosition, transformUp);
            if (isTeleportingUpward) {
                collisionRuntimeParams.myTeleportCanceled = collisionRuntimeParams.myGroundAngle > 30 + 0.0001;
                console.error(collisionRuntimeParams.myTeleportCanceled);
            }

            return newFeetPosition;
        }
        */

        /*
         * This is needed for when u want to perform the teleport as a movement
         * Maybe this should be another set of collsion check params copied from the smooth ones?
         * When you teleport as move, u check with the teleport for the position, and this other params for the move, so that u can use a smaller
         * cone, and sliding if desired
         * If nothing is specified it's copied from the teleport and if greater than 90 cone is tuned down, and also the below settings are applied

         * You could also do this if u want to perform the teleport as movement, instead of using the smooth
         * but this will make even the final teleport check be halved
         */

        /*
        this._myTeleportCollisionCheckParams.myHalfConeAngle = 90;
        this._myTeleportCollisionCheckParams.myHalfConeSliceAmount = 3;
        this._myTeleportCollisionCheckParams.myCheckHorizontalFixedForwardEnabled = false;
        this._myTeleportCollisionCheckParams.mySplitMovementEnabled = true;
        this._myTeleportCollisionCheckParams.mySplitMovementMaxLengthEnabled = true;
        this._myTeleportCollisionCheckParams.mySplitMovementMaxLength = this._myTeleportCollisionCheckParams.myRadius * 0.75;
        this._myTeleportCollisionCheckParams.mySplitMovementMinLengthEnabled = true;
        this._myTeleportCollisionCheckParams.mySplitMovementMinLength = params.mySplitMovementMaxLength;
        this._myTeleportCollisionCheckParams.mySplitMovementStopWhenHorizontalMovementCanceled = true;
        this._myTeleportCollisionCheckParams.mySplitMovementStopWhenVerticalMovementCanceled = true;

        this._myTeleportCollisionCheckParams.myDebugEnabled = true;
        */
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
    let playerRotationQuat = quat_create();
    let playerUp = vec3_create();
    let gravityMovement = vec3_create();
    return function _applyGravity(dt) {
        // If gravity is zero it's still important to move to remain snapped and gather proper surface data even when not teleporting

        playerUp = this._myTeleportParams.myPlayerTransformManager.getRotationQuat(playerRotationQuat).quat_getUp(playerUp);

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

        this._myTeleportParams.myPlayerTransformManager.move(gravityMovement, false);

        const collisionRuntimeParams = this._myTeleportParams.myPlayerTransformManager.getCollisionRuntimeParams();
        if (this._myLocomotionRuntimeParams.myGravitySpeed > 0 && collisionRuntimeParams.myIsOnCeiling ||
            this._myLocomotionRuntimeParams.myGravitySpeed < 0 && collisionRuntimeParams.myIsOnGround) {
            this._myLocomotionRuntimeParams.myGravitySpeed = 0;
        }
    };
}();
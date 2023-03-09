PP.PlayerLocomotionTeleportParams = class PlayerLocomotionTeleportParams {
    constructor() {
        this.myPlayerHeadManager = null;

        this.myCollisionCheckParams = null;

        this.myDetectionParams = new PP.PlayerLocomotionTeleportDetectionParams();
        this.myVisualizerParams = new PP.PlayerLocomotionTeleportDetectionVisualizerParams();
        this.myTeleportParams = new PP.PlayerLocomotionTeleportTeleportParams();

        this.myHandedness = PP.Handedness.LEFT;

        this.myPerformTeleportAsMovement = false;
        this.myTeleportAsMovementMaxDistanceFromTeleportPosition = 0.001;
        this.myTeleportAsMovementMaxSteps = 2;
        // when checking teleport as movement u may need to move more times to get to the position due to snap and gravity
        // this specifies how many movement u can try to get to the teleport position

        this.myTeleportAsMovementRemoveVerticalMovement = true;
        // this can be used to remove the vertical movement from the difference from the current and teleport position so that u can apply just
        // the gravity as vertical movement
        this.myTeleportAsMovementExtraVerticalMovementPerMeter = 1; // this simulate the gravity for the teleport movement

        this.myStickIdleThreshold = 0.1;

        this.myAdjustPositionEveryFrame = false;
        this.myGravityAcceleration = 0;

        this.myDebugActive = false;
        this.myDebugDetectActive = false;
        this.myDebugShowActive = false;
        this.myDebugVisibilityActive = false;
    }
};

PP.PlayerLocomotionTeleportRuntimeParams = class PlayerLocomotionTeleportRuntimeParams {
    constructor() {
        this.myTeleportPosition = PP.vec3_create();
        this.myTeleportRotationOnUp = 0;
    }
};

PP.PlayerLocomotionTeleport = class PlayerLocomotionTeleport extends PP.PlayerLocomotionMovement {
    constructor(teleportParams, locomotionRuntimeParams) {
        super(locomotionRuntimeParams);

        this._myTeleportParams = teleportParams;
        this._myTeleportRuntimeParams = new PP.PlayerLocomotionTeleportRuntimeParams();

        this._myStickIdleCharge = true;
        this._myGravitySpeed = 0;

        this._myDetectionState = new PP.PlayerLocomotionTeleportDetectionState(this._myTeleportParams, this._myTeleportRuntimeParams, this._myLocomotionRuntimeParams);
        this._myTeleportState = new PP.PlayerLocomotionTeleportTeleportState(this._myTeleportParams, this._myTeleportRuntimeParams, this._myLocomotionRuntimeParams);

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "Locomotion Teleport");

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
    }

    start() {
        this._myGravitySpeed = 0;
    }

    stop() {
        this._myFSM.perform("stop");
    }

    canStop() {
        return this._myFSM.isInState("idle");
    }

    update(dt) {
        this._myLocomotionRuntimeParams.myTeleportJustPerformed = false;

        this._myFSM.update(dt);

        // no gravity if teleporting
        if (this._myTeleportParams.myAdjustPositionEveryFrame || this._myTeleportParams.myGravityAcceleration != 0) {
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

        if (!PP.XRUtils.isSessionActive()) {
            startDetecting = PP.myMouse.isButtonPressStart(PP.MouseButtonID.MIDDLE) && PP.myMouse.isTargetingRenderCanvas();
        } else {
            let axes = PP.myGamepads[this._myTeleportParams.myHandedness].getAxesInfo(PP.GamepadAxesID.THUMBSTICK).getAxes();

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
};

PP.PlayerLocomotionTeleport.prototype._applyGravity = function () {
    let playerUp = PP.vec3_create();
    let gravityMovement = PP.vec3_create();
    let feetTransformQuat = PP.quat2_create();
    return function _applyGravity(dt) {
        // if gravity is zero it's still important to move to remain snapped and gather proper surface data even when not teleporting

        playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

        this._myGravitySpeed += this._myTeleportParams.myGravityAcceleration * dt;
        gravityMovement = playerUp.vec3_scale(this._myGravitySpeed * dt, gravityMovement);

        if (this._myLocomotionRuntimeParams.myIsFlying) {
            gravityMovement.vec3_zero();
        }

        feetTransformQuat = this._myTeleportParams.myPlayerHeadManager.getTransformFeetQuat(feetTransformQuat);
        PP.myCollisionCheck.move(gravityMovement, feetTransformQuat, this._myTeleportParams.myCollisionCheckParams, this._myLocomotionRuntimeParams.myCollisionRuntimeParams);
        if (!this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myVerticalMovementCanceled) {
            this._myTeleportParams.myPlayerHeadManager.teleportPositionFeet(this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myNewPosition);
        }

        if (this._myGravitySpeed > 0 && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnCeiling ||
            this._myGravitySpeed < 0 && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnGround) {
            this._myGravitySpeed = 0;
        }
    };
}();
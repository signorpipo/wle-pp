PP.CleanedPlayerLocomotionSmooth = class CleanedPlayerLocomotionSmooth extends PP.PlayerLocomotionMovement {

    constructor(params, locomotionRuntimeParams) {
        super(locomotionRuntimeParams);

        this._myParams = params;

        this._myDirectionReference = PP.myPlayerObjects.myHead;

        this._myStickIdleTimer = new PP.Timer(0.25, false);

        let directionConverterNonVRParams = new PP.Direction2DTo3DConverterParams();
        directionConverterNonVRParams.myAutoUpdateFlyForward = this._myParams.myFlyEnabled;
        directionConverterNonVRParams.myAutoUpdateFlyRight = this._myParams.myFlyEnabled;
        directionConverterNonVRParams.myMinAngleToFlyForwardUp = this._myParams.myMinAngleToFlyUpNonVR;
        directionConverterNonVRParams.myMinAngleToFlyForwardDown = this._myParams.myMinAngleToFlyDownNonVR;
        directionConverterNonVRParams.myMinAngleToFlyRightUp = this._myParams.myMinAngleToFlyRight;
        directionConverterNonVRParams.myMinAngleToFlyRightDown = this._myParams.myMinAngleToFlyRight;

        let directionConverterVRParams = new PP.Direction2DTo3DConverterParams();
        directionConverterVRParams.myAutoUpdateFlyForward = this._myParams.myFlyEnabled;
        directionConverterVRParams.myAutoUpdateFlyRight = this._myParams.myFlyEnabled;
        directionConverterVRParams.myMinAngleToFlyForwardUp = this._myParams.myMinAngleToFlyUpVR;
        directionConverterVRParams.myMinAngleToFlyForwardDown = this._myParams.myMinAngleToFlyDownVR;
        directionConverterVRParams.myMinAngleToFlyRightUp = this._myParams.myMinAngleToFlyRight;
        directionConverterVRParams.myMinAngleToFlyRightDown = this._myParams.myMinAngleToFlyRight;

        this._myDirectionConverterNonVR = new PP.Direction2DTo3DConverter(directionConverterNonVRParams);
        this._myDirectionConverterVR = new PP.Direction2DTo3DConverter(directionConverterVRParams);
        this._myCurrentDirectionConverter = this._myDirectionConverterNonVR;

        this._myLocomotionRuntimeParams.myIsFlying = false;

        this._myGravitySpeed = 0;

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    }

    update(dt) {
        // implemented outside class definition
    }
};

PP.CleanedPlayerLocomotionSmooth.prototype.update = function () {
    let playerUp = PP.vec3_create();
    let headMovement = PP.vec3_create();
    let direction = PP.vec3_create();
    let directionOnUp = PP.vec3_create();
    let verticalMovement = PP.vec3_create();
    let feetTransformQuat = PP.quat2_create();

    let directionReferenceTransformQuat = PP.quat2_create();
    return function update(dt) {
        playerUp = this._myParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

        headMovement.vec3_zero();

        let axes = PP.myGamepads[this._myParams.myHandedness].getAxesInfo(PP.GamepadAxesID.THUMBSTICK).getAxes();
        axes[0] = Math.abs(axes[0]) > this._myParams.myMovementMinStickIntensityThreshold ? axes[0] : 0;
        axes[1] = Math.abs(axes[1]) > this._myParams.myMovementMinStickIntensityThreshold ? axes[1] : 0;

        let horizontalMovement = false;
        if (!axes.vec2_isZero()) {
            this._myStickIdleTimer.start();

            direction = this._myCurrentDirectionConverter.convertTransformQuat(axes, this._myDirectionReference.pp_getTransformQuat(directionReferenceTransformQuat), playerUp, direction);

            if (!direction.vec3_isZero()) {
                this._myLocomotionRuntimeParams.myIsFlying = this._myLocomotionRuntimeParams.myIsFlying || direction.vec3_componentAlongAxis(playerUp, directionOnUp).vec3_length() > 0.000001;
                if (!this._myLocomotionRuntimeParams.myIsFlying) {
                    direction = direction.vec3_removeComponentAlongAxis(playerUp, direction);
                }

                let movementIntensity = axes.vec2_length();
                let speed = Math.pp_lerp(0, this._myParams.myMaxSpeed, movementIntensity);

                headMovement = direction.vec3_scale(speed * dt, headMovement);

                horizontalMovement = true;
            }
        } else {
            if (this._myStickIdleTimer.isRunning()) {
                this._myStickIdleTimer.update(dt);
                if (this._myStickIdleTimer.isDone()) {
                    this._myCurrentDirectionConverter.resetFly();
                }
            }
        }

        if (this._myParams.myFlyEnabled) {
            if (PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).isPressed()) {
                verticalMovement = playerUp.vec3_scale(this._myParams.myMaxSpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
                this._myLocomotionRuntimeParams.myIsFlying = true;
            } else if (PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.BOTTOM_BUTTON).isPressed()) {
                verticalMovement = playerUp.vec3_scale(-this._myParams.myMaxSpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
                this._myLocomotionRuntimeParams.myIsFlying = true;
            }

            if (PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
                this._myLocomotionRuntimeParams.myIsFlying = false;
            }
        }

        if (this._myParams.myMoveHeadShortcutEnabled && PP.myGamepads[PP.InputUtils.getOppositeHandedness(this._myParams.myHandedness)].getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressed()) {
            this._myParams.myPlayerTransformManager.getPlayerHeadManager().moveFeet(headMovement);
        } else if (this._myParams.myMoveThroughCollisionShortcutEnabled && PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressed()) {
            this._myParams.myPlayerTransformManager.move(headMovement, this._myLocomotionRuntimeParams.myCollisionRuntimeParams, true);
            if (horizontalMovement) {
                this._myParams.myPlayerTransformManager.resetReal(true, false, false);
                this._myParams.myPlayerTransformManager.resetHeadToReal();
            }
        } else {
            if (!this._myLocomotionRuntimeParams.myIsFlying) {
                this._myGravitySpeed += this._myParams.myGravityAcceleration * dt;
                verticalMovement = playerUp.vec3_scale(this._myGravitySpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
            }

            if (PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.SQUEEZE).isPressed()) {
                // headMovement.vec3_zero();
            }

            feetTransformQuat = this._myParams.myPlayerTransformManager.getTransformQuat(feetTransformQuat);

            this._myParams.myPlayerTransformManager.move(headMovement, this._myLocomotionRuntimeParams.myCollisionRuntimeParams);
            if (horizontalMovement) {
                this._myParams.myPlayerTransformManager.resetReal(true, false, false);
                this._myParams.myPlayerTransformManager.resetHeadToReal();
            }

            if (this._myGravitySpeed > 0 && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnCeiling ||
                this._myGravitySpeed < 0 && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnGround) {
                this._myGravitySpeed = 0;
            }
        }

        if (this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnGround) {
            this._myLocomotionRuntimeParams.myIsFlying = false;
            this._myCurrentDirectionConverter.resetFly();
        }
    };
}();

PP.CleanedPlayerLocomotionSmooth.prototype._onXRSessionStart = function () {
    return function _onXRSessionStart(session) {
        switch (this._myParams.myVRDirectionReferenceType) {
            case 0:
                this._myDirectionReference = PP.myPlayerObjects.myHead;
                break;
            case 1:
                this._myDirectionReference = PP.myPlayerObjects.myHands[this._myParams.myHandedness];
                break;
            case 2:
                this._myDirectionReference = this._myParams.myVRDirectionReferenceObject;
                break;
        }

        this._myCurrentDirectionConverter = this._myDirectionConverterVR;
        this._myCurrentDirectionConverter.resetFly();
    };
}();

PP.CleanedPlayerLocomotionSmooth.prototype._onXRSessionEnd = function () {
    let playerUp = PP.vec3_create();
    return function _onXRSessionEnd(session) {
        this._myDirectionReference = PP.myPlayerObjects.myHead;
        this._myCurrentDirectionConverter = this._myDirectionConverterNonVR;

        this._myCurrentDirectionConverter.resetFly();
    };
}();



Object.defineProperty(PP.CleanedPlayerLocomotionSmooth.prototype, "update", { enumerable: false });
Object.defineProperty(PP.CleanedPlayerLocomotionSmooth.prototype, "_onXRSessionStart", { enumerable: false });
Object.defineProperty(PP.CleanedPlayerLocomotionSmooth.prototype, "_onXRSessionEnd", { enumerable: false });
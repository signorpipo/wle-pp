import { Timer } from "../../../../../cauldron/cauldron/timer.js";
import { XRUtils } from "../../../../../cauldron/utils/xr_utils.js";
import { Handedness } from "../../../../../input/cauldron/input_types.js";
import { InputUtils } from "../../../../../input/cauldron/input_utils.js";
import { GamepadAxesID, GamepadButtonID } from "../../../../../input/gamepad/gamepad_buttons.js";
import { quat2_create, quat_create, vec3_create } from "../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../../pp/globals.js";
import { Direction2DTo3DConverter, Direction2DTo3DConverterParams } from "../../../../cauldron/cauldron/direction_2D_to_3D_converter.js";
import { PlayerLocomotionDirectionReferenceType } from "./player_locomotion.js";
import { PlayerLocomotionMovement } from "./player_locomotion_movement.js";

export class PlayerLocomotionSmoothParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myPlayerTransformManager = null;

        this.myMaxSpeed = 0;
        this.mySpeedSlowDownPercentageOnWallSlid = 1; // this is the target value for a 90 degrees slid, the more u move toward the wall the slower u go 

        this.myMovementMinStickIntensityThreshold = 0;

        this.myFlyEnabled = false;
        this.myFlyWithButtonsEnabled = false;
        this.myFlyWithViewAngleEnabled = false;
        this.myMinAngleToFlyUpNonVR = 0;
        this.myMinAngleToFlyDownNonVR = 0;
        this.myMinAngleToFlyUpVR = 0;
        this.myMinAngleToFlyDownVR = 0;
        this.myMinAngleToFlyRight = 0;

        this.myGravityAcceleration = 0;
        this.myMaxGravitySpeed = 0;

        this.myDirectionInvertForwardWhenUpsideDown = true;
        this.myVRDirectionReferenceType = PlayerLocomotionDirectionReferenceType.HEAD;
        this.myVRDirectionReferenceObject = null;

        this.myHandedness = Handedness.LEFT;

        this.myDebugFlyMaxSpeedMultiplier = 5;
        this.myMoveThroughCollisionShortcutEnabled = false;
        this.myMoveHeadShortcutEnabled = false;
        this.myTripleSpeedShortcutEnabled = false;

        this.myEngine = engine;
    }
}

export class PlayerLocomotionSmooth extends PlayerLocomotionMovement {

    constructor(params, locomotionRuntimeParams) {
        super(locomotionRuntimeParams);

        this._myParams = params;

        this._myCurrentSpeed = 0;
        this._myLastHorizontalMovement = vec3_create();

        this._myDirectionReference = Globals.getPlayerObjects(this._myParams.myEngine).myHead;

        this._myStickIdleTimer = new Timer(0.25, false);

        let directionConverterNonVRParams = new Direction2DTo3DConverterParams(this._myParams.myEngine);
        directionConverterNonVRParams.myAutoUpdateFlyForward = this._myParams.myFlyEnabled && this._myParams.myFlyWithViewAngleEnabled;
        directionConverterNonVRParams.myAutoUpdateFlyRight = this._myParams.myFlyEnabled && this._myParams.myFlyWithViewAngleEnabled;
        directionConverterNonVRParams.myMinAngleToFlyForwardUp = this._myParams.myMinAngleToFlyUpNonVR;
        directionConverterNonVRParams.myMinAngleToFlyForwardDown = this._myParams.myMinAngleToFlyDownNonVR;
        directionConverterNonVRParams.myMinAngleToFlyRightUp = this._myParams.myMinAngleToFlyRight;
        directionConverterNonVRParams.myMinAngleToFlyRightDown = this._myParams.myMinAngleToFlyRight;
        directionConverterNonVRParams.myInvertForwardWhenUpsideDown = this._myParams.myDirectionInvertForwardWhenUpsideDown;

        let directionConverterVRParams = new Direction2DTo3DConverterParams(this._myParams.myEngine);
        directionConverterVRParams.myAutoUpdateFlyForward = this._myParams.myFlyEnabled && this._myParams.myFlyWithViewAngleEnabled;
        directionConverterVRParams.myAutoUpdateFlyRight = this._myParams.myFlyEnabled && this._myParams.myFlyWithViewAngleEnabled;
        directionConverterVRParams.myMinAngleToFlyForwardUp = this._myParams.myMinAngleToFlyUpVR;
        directionConverterVRParams.myMinAngleToFlyForwardDown = this._myParams.myMinAngleToFlyDownVR;
        directionConverterVRParams.myMinAngleToFlyRightUp = this._myParams.myMinAngleToFlyRight;
        directionConverterVRParams.myMinAngleToFlyRightDown = this._myParams.myMinAngleToFlyRight;
        directionConverterVRParams.myInvertForwardWhenUpsideDown = this._myParams.myDirectionInvertForwardWhenUpsideDown;

        this._myDirectionConverterNonVR = new Direction2DTo3DConverter(directionConverterNonVRParams);
        this._myDirectionConverterVR = new Direction2DTo3DConverter(directionConverterVRParams);
        this._myCurrentDirectionConverter = this._myDirectionConverterNonVR;

        this._myDebugFlyEnabled = false;

        this._myDestroyed = false;

        this.setActive(true);
    }

    start() {
        this._myCurrentSpeed = 0;
        this._myLastHorizontalMovement.vec3_zero();
    }

    setActive(active) {
        if (this.isActive() != active) {
            if (active) {
                XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false, this._myParams.myEngine);
            } else {
                XRUtils.unregisterSessionStartEndEventListeners(this, this._myParams.myEngine);
            }
        }

        super.setActive(active);
    }

    getParams() {
        return this._myParams;
    }

    getCurrentSpeed() {
        return this._myCurrentSpeed;
    }

    getLastHorizontalSpeed() {
        return this._myLastHorizontalMovement;
    }

    update(dt) {
        // Implemented outside class definition
    }

    setDebugFlyEnabled(enabled) {
        if (this._myDebugFlyEnabled != enabled) {
            if (!enabled) {
                this._myLocomotionRuntimeParams.myIsFlying = false;
                this._myCurrentDirectionConverter.resetFly();
            }
        }

        this._myDebugFlyEnabled = enabled;
    }

    isDebugFlyEnabled() {
        return this._myDebugFlyEnabled;
    }

    _onXRSessionStart(session) {
        // Implemented outside class definition
    }

    _onXRSessionEnd(session) {
        // Implemented outside class definition
    }

    destroy() {
        this._myDestroyed = true;

        this.setActive(false);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

PlayerLocomotionSmooth.prototype.update = function () {
    let playerRotationQuat = quat_create();
    let playerUp = vec3_create();
    let headMovement = vec3_create();
    let direction = vec3_create();
    let directionOnUp = vec3_create();
    let verticalMovement = vec3_create();

    let directionReferenceTransformQuat = quat2_create();
    return function update(dt) {
        if (!this.isActive()) return;

        let debugFlyEnabled = this._myDebugFlyEnabled && Globals.isDebugEnabled(this._myParams.myEngine);

        this._myCurrentSpeed = 0;
        this._myLastHorizontalMovement.vec3_zero();

        playerUp = this._myParams.myPlayerTransformManager.getRotationQuat(playerRotationQuat).quat_getUp(playerUp);

        headMovement.vec3_zero();

        let axes = Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getAxesInfo(GamepadAxesID.THUMBSTICK).getAxes();
        axes[0] = Math.abs(axes[0]) > this._myParams.myMovementMinStickIntensityThreshold ? axes[0] : 0;
        axes[1] = Math.abs(axes[1]) > this._myParams.myMovementMinStickIntensityThreshold ? axes[1] : 0;

        let isManuallyMoving = false;
        let maxSpeed = this._myParams.myMaxSpeed;
        if (debugFlyEnabled) {
            maxSpeed = maxSpeed * this._myParams.myDebugFlyMaxSpeedMultiplier;
        }

        if ((this._myParams.myTripleSpeedShortcutEnabled && Globals.isDebugEnabled(this._myParams.myEngine)) || debugFlyEnabled) {
            if (Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.SELECT).isPressed()) {
                maxSpeed *= 3;
            }
        }

        if (debugFlyEnabled && Globals.getGamepads(this._myParams.myEngine)[InputUtils.getOppositeHandedness(this._myParams.myHandedness)].getButtonInfo(GamepadButtonID.SELECT).isPressed()) {
            maxSpeed = this._myParams.myMaxSpeed;
        }

        const collisionRuntimeParams = this._myParams.myPlayerTransformManager.getCollisionRuntimeParams();

        if (!axes.vec2_isZero()) {
            this._myStickIdleTimer.start();

            direction = this._myCurrentDirectionConverter.convertTransformQuat(axes, this._myDirectionReference.pp_getTransformQuat(directionReferenceTransformQuat), playerUp, direction);

            if (!direction.vec3_isZero()) {
                this._myLocomotionRuntimeParams.myIsFlying = this._myLocomotionRuntimeParams.myIsFlying || direction.vec3_componentAlongAxis(playerUp, directionOnUp).vec3_length() > 0.000001;
                if (!this._myLocomotionRuntimeParams.myIsFlying) {
                    direction = direction.vec3_removeComponentAlongAxis(playerUp, direction);
                }

                let movementIntensity = axes.vec2_length();
                this._myCurrentSpeed = Math.pp_lerp(0, maxSpeed, movementIntensity);

                if (collisionRuntimeParams.myIsSliding && this._myParams.mySpeedSlowDownPercentageOnWallSlid != 1) {
                    let slowPercentage = this._myParams.mySpeedSlowDownPercentageOnWallSlid;

                    let slidStrength = Math.pp_mapToRange(Math.abs(collisionRuntimeParams.mySlidingMovementAngle), 0, 90, 0, 1);
                    slowPercentage = Math.pp_lerp(1, slowPercentage, slidStrength);

                    this._myCurrentSpeed = this._myCurrentSpeed * slowPercentage;
                }

                headMovement = direction.vec3_scale(this._myCurrentSpeed * dt, headMovement);

                isManuallyMoving = true;
            }
        } else {
            if (this._myStickIdleTimer.isRunning()) {
                this._myStickIdleTimer.update(dt);
                if (this._myStickIdleTimer.isDone()) {
                    this._myCurrentDirectionConverter.resetFly();
                }
            }
        }

        if ((this._myParams.myFlyEnabled && this._myParams.myFlyWithButtonsEnabled) || debugFlyEnabled) {
            if (Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) {
                verticalMovement = playerUp.vec3_scale(maxSpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
                this._myLocomotionRuntimeParams.myIsFlying = true;

                isManuallyMoving = true;
            } else if (Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressed()) {
                verticalMovement = playerUp.vec3_scale(-maxSpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
                this._myLocomotionRuntimeParams.myIsFlying = true;

                isManuallyMoving = true;
            }

            if (Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
                this._myLocomotionRuntimeParams.myIsFlying = false;
            }
        }

        if (this._myParams.myMoveHeadShortcutEnabled && Globals.isDebugEnabled(this._myParams.myEngine) &&
            Globals.getGamepads(this._myParams.myEngine)[InputUtils.getOppositeHandedness(this._myParams.myHandedness)].getButtonInfo(GamepadButtonID.THUMBSTICK).isPressed()) {
            this._myParams.myPlayerTransformManager.getPlayerHeadManager().moveFeet(headMovement);
        } else if ((this._myParams.myMoveThroughCollisionShortcutEnabled && Globals.isDebugEnabled(this._myParams.myEngine) &&
            Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.THUMBSTICK).isPressed())
            || debugFlyEnabled) {
            this._myParams.myPlayerTransformManager.move(headMovement, true);
            if (isManuallyMoving) {
                this._myParams.myPlayerTransformManager.resetReal();
            }
        } else {
            if (!this._myLocomotionRuntimeParams.myIsFlying) {
                this._myLocomotionRuntimeParams.myGravitySpeed += this._myParams.myGravityAcceleration * dt;

                if (Math.abs(this._myLocomotionRuntimeParams.myGravitySpeed) > Math.abs(this._myParams.myMaxGravitySpeed)) {
                    this._myLocomotionRuntimeParams.myGravitySpeed = Math.pp_sign(this._myParams.myGravityAcceleration) * Math.abs(this._myParams.myMaxGravitySpeed);
                }

                verticalMovement = playerUp.vec3_scale(this._myLocomotionRuntimeParams.myGravitySpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
            } else {
                this._myLocomotionRuntimeParams.myGravitySpeed = 0;
            }

            this._myParams.myPlayerTransformManager.move(headMovement, false);
            if (isManuallyMoving) {
                this._myParams.myPlayerTransformManager.resetReal();

                collisionRuntimeParams.myFixedMovement.vec3_removeComponentAlongAxis(
                    collisionRuntimeParams.myOriginalUp,
                    this._myLastHorizontalMovement
                );
            }

            if (this._myLocomotionRuntimeParams.myGravitySpeed > 0 && collisionRuntimeParams.myIsOnCeiling ||
                this._myLocomotionRuntimeParams.myGravitySpeed < 0 && collisionRuntimeParams.myIsOnGround) {
                this._myLocomotionRuntimeParams.myGravitySpeed = 0;
            }
        }

        if (collisionRuntimeParams.myIsOnGround) {
            this._myLocomotionRuntimeParams.myIsFlying = false;
            this._myCurrentDirectionConverter.resetFly();
        }
    };
}();

PlayerLocomotionSmooth.prototype._onXRSessionStart = function () {
    return function _onXRSessionStart(session) {
        switch (this._myParams.myVRDirectionReferenceType) {
            case 0:
                this._myDirectionReference = Globals.getPlayerObjects(this._myParams.myEngine).myHead;
                break;
            case 1:
                this._myDirectionReference = Globals.getPlayerObjects(this._myParams.myEngine).myHands[this._myParams.myHandedness];
                break;
            case 2:
                this._myDirectionReference = this._myParams.myVRDirectionReferenceObject;
                break;
        }

        this._myCurrentDirectionConverter = this._myDirectionConverterVR;
        this._myCurrentDirectionConverter.resetFly();
    };
}();

PlayerLocomotionSmooth.prototype._onXRSessionEnd = function () {
    return function _onXRSessionEnd(session) {
        this._myDirectionReference = Globals.getPlayerObjects(this._myParams.myEngine).myHead;
        this._myCurrentDirectionConverter = this._myDirectionConverterNonVR;

        this._myCurrentDirectionConverter.resetFly();
    };
}();
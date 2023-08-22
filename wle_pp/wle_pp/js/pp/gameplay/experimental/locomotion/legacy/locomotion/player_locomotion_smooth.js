import { Timer } from "../../../../../cauldron/cauldron/timer";
import { XRUtils } from "../../../../../cauldron/utils/xr_utils";
import { Handedness } from "../../../../../input/cauldron/input_types";
import { InputUtils } from "../../../../../input/cauldron/input_utils";
import { GamepadAxesID, GamepadButtonID } from "../../../../../input/gamepad/gamepad_buttons";
import { quat2_create, vec3_create } from "../../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../../pp/globals";
import { Direction2DTo3DConverter, Direction2DTo3DConverterParams } from "../../../../cauldron/cauldron/direction_2D_to_3D_converter";
import { PlayerLocomotionDirectionReferenceType } from "./player_locomotion";
import { PlayerLocomotionMovement } from "./player_locomotion_movement";

export class PlayerLocomotionSmoothParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myPlayerHeadManager = null;
        this.myPlayerTransformManager = null;

        this.myCollisionCheckParams = null;

        this.myMaxSpeed = 0;
        this.mySpeedSlowDownPercentageOnWallSlid = 1; // this is the target value for a 90 degrees slid, the more u move toward the wall the slower u go 

        this.myMovementMinStickIntensityThreshold = 0;

        this.myFlyEnabled = false;
        this.myMinAngleToFlyUpNonVR = 0;
        this.myMinAngleToFlyDownNonVR = 0;
        this.myMinAngleToFlyUpVR = 0;
        this.myMinAngleToFlyDownVR = 0;
        this.myMinAngleToFlyRight = 0;

        this.myGravityAcceleration = 0;
        this.myMaxGravitySpeed = 0;

        this.myVRDirectionReferenceType = PlayerLocomotionDirectionReferenceType.HEAD;
        this.myVRDirectionReferenceObject = null;

        this.myHandedness = Handedness.LEFT;

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
        directionConverterNonVRParams.myAutoUpdateFlyForward = this._myParams.myFlyEnabled;
        directionConverterNonVRParams.myAutoUpdateFlyRight = this._myParams.myFlyEnabled;
        directionConverterNonVRParams.myMinAngleToFlyForwardUp = this._myParams.myMinAngleToFlyUpNonVR;
        directionConverterNonVRParams.myMinAngleToFlyForwardDown = this._myParams.myMinAngleToFlyDownNonVR;
        directionConverterNonVRParams.myMinAngleToFlyRightUp = this._myParams.myMinAngleToFlyRight;
        directionConverterNonVRParams.myMinAngleToFlyRightDown = this._myParams.myMinAngleToFlyRight;
        directionConverterNonVRParams.myInvertForwardWhenUpsideDown = this._myParams.myDirectionInvertForwardWhenUpsideDown;

        let directionConverterVRParams = new Direction2DTo3DConverterParams(this._myParams.myEngine);
        directionConverterVRParams.myAutoUpdateFlyForward = this._myParams.myFlyEnabled;
        directionConverterVRParams.myAutoUpdateFlyRight = this._myParams.myFlyEnabled;
        directionConverterVRParams.myMinAngleToFlyForwardUp = this._myParams.myMinAngleToFlyUpVR;
        directionConverterVRParams.myMinAngleToFlyForwardDown = this._myParams.myMinAngleToFlyDownVR;
        directionConverterVRParams.myMinAngleToFlyRightUp = this._myParams.myMinAngleToFlyRight;
        directionConverterVRParams.myMinAngleToFlyRightDown = this._myParams.myMinAngleToFlyRight;
        directionConverterVRParams.myInvertForwardWhenUpsideDown = this._myParams.myDirectionInvertForwardWhenUpsideDown;

        this._myDirectionConverterNonVR = new Direction2DTo3DConverter(directionConverterNonVRParams);
        this._myDirectionConverterVR = new Direction2DTo3DConverter(directionConverterVRParams);
        this._myCurrentDirectionConverter = this._myDirectionConverterNonVR;

        this._myDestroyed = false;

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false, this._myParams.myEngine);
    }

    start() {
        this._myCurrentSpeed = 0;
        this._myLastHorizontalMovement.vec3_zero();
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

    destroy() {
        this._myDestroyed = true;

        XRUtils.unregisterSessionStartEndEventListeners(this, this._myParams.myEngine);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

PlayerLocomotionSmooth.prototype.update = function () {
    let playerUp = vec3_create();
    let headMovement = vec3_create();
    let direction = vec3_create();
    let directionOnUp = vec3_create();
    let verticalMovement = vec3_create();
    let feetTransformQuat = quat2_create();

    let directionReferenceTransformQuat = quat2_create();
    return function update(dt) {
        this._myCurrentSpeed = 0;
        this._myLastHorizontalMovement.vec3_zero();

        playerUp = this._myParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

        headMovement.vec3_zero();

        let axes = Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getAxesInfo(GamepadAxesID.THUMBSTICK).getAxes();
        axes[0] = Math.abs(axes[0]) > this._myParams.myMovementMinStickIntensityThreshold ? axes[0] : 0;
        axes[1] = Math.abs(axes[1]) > this._myParams.myMovementMinStickIntensityThreshold ? axes[1] : 0;

        let horizontalMovement = false;
        let maxSpeed = this._myParams.myMaxSpeed;

        if (this._myParams.myTripleSpeedShortcutEnabled && Globals.isDebugEnabled(this._myParams.myEngine)) {
            if (Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.SELECT).isPressed()) {
                maxSpeed *= 3;
            }
        }

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

                if (this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsSliding && this._myParams.mySpeedSlowDownPercentageOnWallSlid != 1) {
                    let slowPercentage = this._myParams.mySpeedSlowDownPercentageOnWallSlid;

                    let slidStrength = Math.pp_mapToRange(Math.abs(this._myLocomotionRuntimeParams.myCollisionRuntimeParams.mySlidingMovementAngle), 0, 90, 0, 1);
                    slowPercentage = Math.pp_lerp(1, slowPercentage, slidStrength);

                    this._myCurrentSpeed = this._myCurrentSpeed * slowPercentage;
                }

                headMovement = direction.vec3_scale(this._myCurrentSpeed * dt, headMovement);

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
            if (Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) {
                verticalMovement = playerUp.vec3_scale(maxSpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
                this._myLocomotionRuntimeParams.myIsFlying = true;
            } else if (Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressed()) {
                verticalMovement = playerUp.vec3_scale(-maxSpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
                this._myLocomotionRuntimeParams.myIsFlying = true;
            }

            if (Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
                this._myLocomotionRuntimeParams.myIsFlying = false;
            }
        }

        if (this._myParams.myMoveHeadShortcutEnabled && Globals.isDebugEnabled(this._myParams.myEngine) &&
            Globals.getGamepads(this._myParams.myEngine)[InputUtils.getOppositeHandedness(this._myParams.myHandedness)].getButtonInfo(GamepadButtonID.THUMBSTICK).isPressed()) {
            this._myParams.myPlayerTransformManager.getPlayerHeadManager().moveFeet(headMovement);
        } else if (this._myParams.myMoveThroughCollisionShortcutEnabled && Globals.isDebugEnabled(this._myParams.myEngine) &&
            Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.THUMBSTICK).isPressed()) {
            this._myParams.myPlayerTransformManager.move(headMovement, this._myLocomotionRuntimeParams.myCollisionRuntimeParams, true);
            if (horizontalMovement) {
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

            feetTransformQuat = this._myParams.myPlayerTransformManager.getTransformQuat(feetTransformQuat);

            this._myParams.myPlayerTransformManager.move(headMovement, this._myLocomotionRuntimeParams.myCollisionRuntimeParams);
            if (horizontalMovement) {
                this._myParams.myPlayerTransformManager.resetReal();

                this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myFixedMovement.vec3_removeComponentAlongAxis(
                    this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myOriginalUp,
                    this._myLastHorizontalMovement
                );
            }

            if (this._myLocomotionRuntimeParams.myGravitySpeed > 0 && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnCeiling ||
                this._myLocomotionRuntimeParams.myGravitySpeed < 0 && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnGround) {
                this._myLocomotionRuntimeParams.myGravitySpeed = 0;
            }
        }

        if (this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnGround) {
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



Object.defineProperty(PlayerLocomotionSmooth.prototype, "_onXRSessionStart", { enumerable: false });
Object.defineProperty(PlayerLocomotionSmooth.prototype, "_onXRSessionEnd", { enumerable: false });
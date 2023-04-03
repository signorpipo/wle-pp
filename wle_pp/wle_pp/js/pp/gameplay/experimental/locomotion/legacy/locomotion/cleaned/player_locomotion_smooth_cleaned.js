import { Timer } from "../../../../../../cauldron/cauldron/timer";
import { XRUtils } from "../../../../../../cauldron/utils/xr_utils";
import { getGamepads } from "../../../../../../input/cauldron/input_globals";
import { InputUtils } from "../../../../../../input/cauldron/input_utils";
import { GamepadAxesID, GamepadButtonID } from "../../../../../../input/gamepad/gamepad_buttons";
import { quat2_create, vec3_create } from "../../../../../../plugin/js/extensions/array_extension";
import { getPlayerObjects } from "../../../../../../pp/player_objects_global";
import { Direction2DTo3DConverter, Direction2DTo3DConverterParams } from "../../../../../cauldron/cauldron/direction_2D_to_3D_converter";
import { PlayerLocomotionMovement } from "../player_locomotion_movement";

export class CleanedPlayerLocomotionSmooth extends PlayerLocomotionMovement {

    constructor(params, locomotionRuntimeParams) {
        super(locomotionRuntimeParams);

        this._myParams = params;

        this._myDirectionReference = getPlayerObjects(this._myParams.myEngine).myHead;

        this._myStickIdleTimer = new Timer(0.25, false);

        let directionConverterNonVRParams = new Direction2DTo3DConverterParams(this._myParams.myEngine);
        directionConverterNonVRParams.myAutoUpdateFlyForward = this._myParams.myFlyEnabled;
        directionConverterNonVRParams.myAutoUpdateFlyRight = this._myParams.myFlyEnabled;
        directionConverterNonVRParams.myMinAngleToFlyForwardUp = this._myParams.myMinAngleToFlyUpNonVR;
        directionConverterNonVRParams.myMinAngleToFlyForwardDown = this._myParams.myMinAngleToFlyDownNonVR;
        directionConverterNonVRParams.myMinAngleToFlyRightUp = this._myParams.myMinAngleToFlyRight;
        directionConverterNonVRParams.myMinAngleToFlyRightDown = this._myParams.myMinAngleToFlyRight;

        let directionConverterVRParams = new Direction2DTo3DConverterParams(this._myParams.myEngine);
        directionConverterVRParams.myAutoUpdateFlyForward = this._myParams.myFlyEnabled;
        directionConverterVRParams.myAutoUpdateFlyRight = this._myParams.myFlyEnabled;
        directionConverterVRParams.myMinAngleToFlyForwardUp = this._myParams.myMinAngleToFlyUpVR;
        directionConverterVRParams.myMinAngleToFlyForwardDown = this._myParams.myMinAngleToFlyDownVR;
        directionConverterVRParams.myMinAngleToFlyRightUp = this._myParams.myMinAngleToFlyRight;
        directionConverterVRParams.myMinAngleToFlyRightDown = this._myParams.myMinAngleToFlyRight;

        this._myDirectionConverterNonVR = new Direction2DTo3DConverter(directionConverterNonVRParams);
        this._myDirectionConverterVR = new Direction2DTo3DConverter(directionConverterVRParams);
        this._myCurrentDirectionConverter = this._myDirectionConverterNonVR;

        this._myLocomotionRuntimeParams.myIsFlying = false;

        this._myGravitySpeed = 0;

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false, this._myParams.myEngine);
    }

    update(dt) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

CleanedPlayerLocomotionSmooth.prototype.update = function () {
    let playerUp = vec3_create();
    let headMovement = vec3_create();
    let direction = vec3_create();
    let directionOnUp = vec3_create();
    let verticalMovement = vec3_create();
    let feetTransformQuat = quat2_create();

    let directionReferenceTransformQuat = quat2_create();
    return function update(dt) {
        playerUp = this._myParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

        headMovement.vec3_zero();

        let axes = getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getAxesInfo(GamepadAxesID.THUMBSTICK).getAxes();
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
            if (getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.TOP_BUTTON).isPressed()) {
                verticalMovement = playerUp.vec3_scale(this._myParams.myMaxSpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
                this._myLocomotionRuntimeParams.myIsFlying = true;
            } else if (getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressed()) {
                verticalMovement = playerUp.vec3_scale(-this._myParams.myMaxSpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
                this._myLocomotionRuntimeParams.myIsFlying = true;
            }

            if (getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
                this._myLocomotionRuntimeParams.myIsFlying = false;
            }
        }

        if (this._myParams.myMoveHeadShortcutEnabled && getGamepads(this._myParams.myEngine)[InputUtils.getOppositeHandedness(this._myParams.myHandedness)].getButtonInfo(GamepadButtonID.THUMBSTICK).isPressed()) {
            this._myParams.myPlayerTransformManager.getPlayerHeadManager().moveFeet(headMovement);
        } else if (this._myParams.myMoveThroughCollisionShortcutEnabled && getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.THUMBSTICK).isPressed()) {
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

            if (getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getButtonInfo(GamepadButtonID.SQUEEZE).isPressed()) {
                //headMovement.vec3_zero();
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

CleanedPlayerLocomotionSmooth.prototype._onXRSessionStart = function () {
    return function _onXRSessionStart(session) {
        switch (this._myParams.myVRDirectionReferenceType) {
            case 0:
                this._myDirectionReference = getPlayerObjects(this._myParams.myEngine).myHead;
                break;
            case 1:
                this._myDirectionReference = getPlayerObjects(this._myParams.myEngine).myHands[this._myParams.myHandedness];
                break;
            case 2:
                this._myDirectionReference = this._myParams.myVRDirectionReferenceObject;
                break;
        }

        this._myCurrentDirectionConverter = this._myDirectionConverterVR;
        this._myCurrentDirectionConverter.resetFly();
    };
}();

CleanedPlayerLocomotionSmooth.prototype._onXRSessionEnd = function () {
    let playerUp = vec3_create();
    return function _onXRSessionEnd(session) {
        this._myDirectionReference = getPlayerObjects(this._myParams.myEngine).myHead;
        this._myCurrentDirectionConverter = this._myDirectionConverterNonVR;

        this._myCurrentDirectionConverter.resetFly();
    };
}();



Object.defineProperty(CleanedPlayerLocomotionSmooth.prototype, "_onXRSessionStart", { enumerable: false });
Object.defineProperty(CleanedPlayerLocomotionSmooth.prototype, "_onXRSessionEnd", { enumerable: false });
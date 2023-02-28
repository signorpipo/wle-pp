PP.PlayerLocomotionTeleportState = class PlayerLocomotionTeleportState extends PP.State {
    constructor(teleportParams, teleportRuntimeParams, locomotionRuntimeParams) {
        super();

        this._myLocomotionRuntimeParams = locomotionRuntimeParams;

        this._myTeleportParams = teleportParams;
        this._myTeleportRuntimeParams = teleportRuntimeParams;

        this._myTeleportAsMovementFailed = false;
    }
};

PP.PlayerLocomotionTeleportState.prototype._checkTeleport = function () {
    return function _checkTeleport(teleportPosition, feetTransformQuat, collisionRuntimeParams, checkTeleportCollisionRuntimeParams = null) {
        PP.myCollisionCheck.teleport(teleportPosition, feetTransformQuat, this._myTeleportParams.myCollisionCheckParams, collisionRuntimeParams);
        if (checkTeleportCollisionRuntimeParams != null) {
            checkTeleportCollisionRuntimeParams.copy(collisionRuntimeParams);
        }
    };
}();

PP.PlayerLocomotionTeleportState.prototype._checkTeleportAsMovement = function () {
    let checkTeleportMovementCollisionRuntimeParams = new PP.CollisionRuntimeParams();
    let feetRotationQuat = PP.quat_create();
    let feetPosition = PP.vec3_create();
    let feetUp = PP.vec3_create();
    let teleportFeetForward = PP.vec3_create();
    let teleportFeetRotationQuat = PP.quat_create();
    let teleportFeetTransformQuat = PP.quat2_create();

    let currentFeetPosition = PP.vec3_create();
    let fixedTeleportPosition = PP.vec3_create();

    let teleportMovement = PP.vec3_create();
    let extraVerticalMovement = PP.vec3_create();
    let movementToTeleportPosition = PP.vec3_create();
    let movementFeetTransformQuat = PP.quat2_create();
    return function _checkTeleportAsMovement(teleportPosition, feetTransformQuat, collisionRuntimeParams, checkTeleportCollisionRuntimeParams) {
        feetPosition = feetTransformQuat.quat2_getPosition(feetPosition);
        feetRotationQuat = feetTransformQuat.quat2_getRotationQuat(feetRotationQuat);

        // first try a normal teleport
        feetUp = feetRotationQuat.quat_getUp(feetUp);
        teleportFeetForward = teleportPosition.vec3_sub(feetPosition, teleportFeetForward).vec3_removeComponentAlongAxis(feetUp, teleportFeetForward);
        teleportFeetForward.vec3_normalize(teleportFeetForward);
        if (teleportFeetForward.vec3_isZero(0.00001)) {
            teleportFeetForward = feetRotationQuat.quat_getForward(teleportFeetForward);
        }

        teleportFeetRotationQuat.quat_setUp(feetUp, teleportFeetForward);
        teleportFeetTransformQuat.quat2_setPositionRotationQuat(feetPosition, teleportFeetRotationQuat);

        this._checkTeleport(teleportPosition, teleportFeetTransformQuat, collisionRuntimeParams, checkTeleportCollisionRuntimeParams);

        // if teleport is ok then we can check movement knowing we have to move toward the teleported position (which has also snapped/fixed the position)
        if (!collisionRuntimeParams.myTeleportCanceled) {
            let teleportMovementValid = false;

            checkTeleportMovementCollisionRuntimeParams.copy(collisionRuntimeParams);
            fixedTeleportPosition.vec3_copy(collisionRuntimeParams.myNewPosition);
            currentFeetPosition.vec3_copy(feetPosition);
            for (let i = 0; i < this._myTeleportParams.myTeleportAsMovementMaxSteps; i++) {
                teleportMovement = fixedTeleportPosition.vec3_sub(currentFeetPosition, teleportMovement);

                if (this._myTeleportParams.myTeleportAsMovementRemoveVerticalMovement) {
                    teleportMovement = teleportMovement.vec3_removeComponentAlongAxis(feetUp, teleportMovement);
                }

                if (this._myTeleportParams.myTeleportAsMovementExtraVerticalMovementPerMeter != 0) {
                    let meters = teleportMovement.vec3_length();
                    let extraVerticalMovementValue = meters * this._myTeleportParams.myTeleportAsMovementExtraVerticalMovementPerMeter;
                    extraVerticalMovement = feetUp.vec3_scale(extraVerticalMovementValue, extraVerticalMovement);
                    teleportMovement = teleportMovement.vec3_add(extraVerticalMovement, teleportMovement);
                }

                movementFeetTransformQuat.quat2_setPositionRotationQuat(currentFeetPosition, feetRotationQuat);
                PP.myCollisionCheck.move(teleportMovement, movementFeetTransformQuat, this._myTeleportParams.myCollisionCheckParams, checkTeleportMovementCollisionRuntimeParams);

                if (!checkTeleportMovementCollisionRuntimeParams.myHorizontalMovementCanceled && !checkTeleportMovementCollisionRuntimeParams.myVerticalMovementCanceled) {
                    movementToTeleportPosition = fixedTeleportPosition.vec3_sub(checkTeleportMovementCollisionRuntimeParams.myNewPosition, movementToTeleportPosition);
                    //console.error(movementToTeleportPosition.vec3_length());
                    if (movementToTeleportPosition.vec3_length() < this._myTeleportParams.myTeleportAsMovementMaxDistanceFromTeleportPosition + 0.00001) {
                        teleportMovementValid = true;
                        break;
                    } else {
                        teleportMovement.vec3_copy(movementToTeleportPosition);
                        currentFeetPosition.vec3_copy(checkTeleportMovementCollisionRuntimeParams.myNewPosition);
                    }
                } else {
                    break;
                }
            }

            if (!teleportMovementValid) {
                collisionRuntimeParams.myTeleportCanceled = true;
            }

            this._myTeleportAsMovementFailed = !teleportMovementValid;
        }
    };
}();

PP.PlayerLocomotionTeleportState.prototype._teleportToPosition = function () {
    let playerUp = PP.vec3_create();
    let feetTransformQuat = PP.quat2_create();
    let newFeetTransformQuat = PP.quat2_create();
    let newFeetRotationQuat = PP.quat_create();
    let teleportRotation = PP.quat_create();
    return function _teleportToPosition(teleportPosition, rotationOnUp, collisionRuntimeParams, forceTeleport = false) {
        this._myTeleportAsMovementFailed = false;

        playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

        feetTransformQuat = this._myTeleportParams.myPlayerHeadManager.getTransformFeetQuat(feetTransformQuat);
        newFeetRotationQuat = feetTransformQuat.quat2_getRotationQuat(newFeetRotationQuat);
        if (rotationOnUp != 0) {
            newFeetRotationQuat = newFeetRotationQuat.quat_rotateAxis(rotationOnUp, playerUp, newFeetRotationQuat);
        }

        newFeetTransformQuat.quat2_setPositionRotationQuat(teleportPosition, newFeetRotationQuat);

        if (PP.myGamepads[PP.InputUtils.getOppositeHandedness(this._myTeleportParams.myHandedness)].getButtonInfo(PP.GamepadButtonID.BOTTOM_BUTTON).isPressed()) {
            PP.myCollisionCheck.positionCheck(true, newFeetTransformQuat, this._myTeleportParams.myCollisionCheckParams, collisionRuntimeParams);

            this._myTeleportParams.myPlayerHeadManager.teleportPositionFeet(teleportPosition);
            if (rotationOnUp != 0) {
                teleportRotation.quat_fromAxis(rotationOnUp, playerUp);
                this._myTeleportParams.myPlayerHeadManager.rotateFeetQuat(teleportRotation);
            }
        } else {
            //should teleport then rotate
            this._myTeleportParams.myPlayerTransformManager.teleportTransformQuat(newFeetTransformQuat, collisionRuntimeParams, forceTeleport);
        }
    };
}();
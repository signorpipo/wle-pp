PP.CollisionCheck.prototype._positionCheck = function () {
    let feetPosition = PP.vec3_create();
    return function _positionCheck(allowAdjustments, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        feetPosition = transformQuat.quat2_getPosition(feetPosition);

        this._teleport(feetPosition, transformQuat, collisionCheckParams, collisionRuntimeParams, true);

        collisionRuntimeParams.myIsPositionOk = !collisionRuntimeParams.myTeleportCanceled;
        collisionRuntimeParams.myIsPositionCheck = true;
        collisionRuntimeParams.myOriginalPositionCheckPosition.vec3_copy(collisionRuntimeParams.myOriginalTeleportPosition);
        collisionRuntimeParams.myFixedPositionCheckPosition.vec3_copy(collisionRuntimeParams.myFixedTeleportPosition);
        collisionRuntimeParams.myIsPositionCheckAllowAdjustments = allowAdjustments;

        if (!allowAdjustments) {
            collisionRuntimeParams.myIsPositionOk = collisionRuntimeParams.myIsPositionOk &&
                collisionRuntimeParams.myOriginalPositionCheckPosition.vec_equals(collisionRuntimeParams.myFixedPositionCheckPosition, 0.00001);
        }

        collisionRuntimeParams.myOriginalTeleportPosition.vec3_zero();
        collisionRuntimeParams.myFixedTeleportPosition.vec3_zero();
        collisionRuntimeParams.myTeleportCanceled = false;
        collisionRuntimeParams.myIsTeleport = false;
    };
}();



Object.defineProperty(PP.CollisionCheck.prototype, "_positionCheck", { enumerable: false });

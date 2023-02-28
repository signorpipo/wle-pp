PP.CollisionCheckUtils = {
    generate360TeleportParamsFromMovementParams: function (movementParams, outTeleportParams = new PP.CollisionCheckParams()) {
        outTeleportParams.copy(movementParams);

        outTeleportParams.myHalfConeAngle = 180;
        outTeleportParams.myHalfConeSliceAmount = Math.round((outTeleportParams.myHalfConeAngle / movementParams.myHalfConeAngle) * movementParams.myHalfConeSliceAmount);

        outTeleportParams.myCheckHorizontalFixedForwardEnabled = true;
        outTeleportParams.myCheckHorizontalFixedForward = PP.vec3_create(0, 0, 1);

        return outTeleportParams;
    },
};

PP.CollisionCheck = class CollisionCheck {
    constructor() {
        this._myRaycastSetup = new PP.RaycastSetup();
        this._myRaycastResult = new PP.RaycastResults();
        this._myFixRaycastResult = new PP.RaycastResults();

        this._myBackupRaycastHit = new PP.RaycastHit();

        this._myPrevCollisionRuntimeParams = new PP.CollisionRuntimeParams();

        this._mySlidingCollisionRuntimeParams = new PP.CollisionRuntimeParams();
        this._myCheckBetterSlidingNormalCollisionRuntimeParams = new PP.CollisionRuntimeParams();
        this._myInternalSlidingCollisionRuntimeParams = new PP.CollisionRuntimeParams();
        this._mySlidingFlickeringFixCollisionRuntimeParams = new PP.CollisionRuntimeParams();
        this._mySlidingFlickeringFixSlidingCollisionRuntimeParams = new PP.CollisionRuntimeParams();
        this._mySlidingOppositeDirectionCollisionRuntimeParams = new PP.CollisionRuntimeParams();
        this._mySlidingOnVerticalCheckCollisionRuntimeParams = new PP.CollisionRuntimeParams();

        this._myDebugActive = false;

        this._myTotalRaycasts = 0;
        this._myTotalRaycastsMax = 0;
    }

    move(movement, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        this._move(movement, transformQuat, collisionCheckParams, collisionRuntimeParams);
    }

    //#TODO add teleport position/transform and return originalteleportransform
    // instead of position old transform / new transform
    teleport(position, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        this._teleport(position, transformQuat, collisionCheckParams, collisionRuntimeParams);
    }

    positionCheck(allowFix, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        this._positionCheck(allowFix, transformQuat, collisionCheckParams, collisionRuntimeParams);
    }

    updateSurfaceInfo(transformQuat, collisionCheckParams, collisionRuntimeParams) {
        this._updateSurfaceInfo(transformQuat, collisionCheckParams, collisionRuntimeParams);
    }

    _debugMovement(movement, fixedMovement, feetPosition, up, collisionCheckParams) {
        let originalHorizontalMovement = movement.vec3_removeComponentAlongAxis(up);

        let horizontalMovement = fixedMovement.vec3_removeComponentAlongAxis(up);
        let verticalMovement = fixedMovement.vec3_componentAlongAxis(up);

        let feetPositionPlusOffset = feetPosition.vec3_add(up.vec3_scale(collisionCheckParams.myDistanceFromFeetToIgnore + 0.001));

        if (!originalHorizontalMovement.vec3_isZero()) {
            originalHorizontalMovement.vec3_normalize(originalHorizontalMovement);

            PP.myDebugVisualManager.drawArrow(0, feetPositionPlusOffset, originalHorizontalMovement, 0.2, PP.vec4_create(0.5, 0.5, 1, 1));
        }

        if (!horizontalMovement.vec3_isZero()) {
            horizontalMovement.vec3_normalize(horizontalMovement);

            PP.myDebugVisualManager.drawArrow(0, feetPositionPlusOffset, horizontalMovement, 0.2, PP.vec4_create(0, 0, 1, 1));
        }

        if (!verticalMovement.vec3_isZero()) {
            verticalMovement.vec3_normalize(verticalMovement);

            PP.myDebugVisualManager.drawArrow(0, feetPosition, verticalMovement, 0.2, PP.vec4_create(0, 0, 1, 1));
        }
    }

    _debugRuntimeParams(collisionRuntimeParams) {
        if (collisionRuntimeParams.myHorizontalCollisionHit.isValid()) {
            PP.myDebugVisualManager.drawArrow(0,
                collisionRuntimeParams.myHorizontalCollisionHit.myPosition,
                collisionRuntimeParams.myHorizontalCollisionHit.myNormal, 0.2, PP.vec4_create(1, 0, 0, 1));
        }

        if (collisionRuntimeParams.mySlidingCollisionHit.isValid()) {
            PP.myDebugVisualManager.drawArrow(0,
                collisionRuntimeParams.mySlidingCollisionHit.myPosition,
                collisionRuntimeParams.mySlidingCollisionHit.myNormal, 0.2, PP.vec4_create(1, 0, 0, 1));
        }

        if (collisionRuntimeParams.myVerticalCollisionHit.isValid()) {
            PP.myDebugVisualManager.drawArrow(0,
                collisionRuntimeParams.myVerticalCollisionHit.myPosition,
                collisionRuntimeParams.myVerticalCollisionHit.myNormal, 0.2, PP.vec4_create(1, 0, 0, 1));
        }
    }
};

PP.CollisionCheck.prototype._raycastAndDebug = function () {
    let tempRaycastResult = new PP.RaycastResults();
    return function _raycastAndDebug(origin, direction, distance, ignoreHitsInsideCollision, isHorizontal, collisionCheckParams, collisionRuntimeParams) {
        this._myRaycastSetup.myOrigin.vec3_copy(origin);
        this._myRaycastSetup.myDirection.vec3_copy(direction);
        this._myRaycastSetup.myDistance = distance;

        if (isHorizontal) {
            this._myRaycastSetup.myBlockLayerFlags.copy(collisionCheckParams.myHorizontalBlockLayerFlags);
            this._myRaycastSetup.myObjectsToIgnore = collisionCheckParams.myHorizontalObjectsToIgnore;
        } else {
            this._myRaycastSetup.myBlockLayerFlags.copy(collisionCheckParams.myVerticalBlockLayerFlags);
            this._myRaycastSetup.myObjectsToIgnore = collisionCheckParams.myVerticalObjectsToIgnore;
        }

        this._myRaycastSetup.myIgnoreHitsInsideCollision = ignoreHitsInsideCollision;

        let raycastResult = null;
        if (true) {
            raycastResult = PP.PhysicsUtils.raycast(this._myRaycastSetup, this._myRaycastResult);
        } else {
            // quick debug to remove raycasts and/or let all raycasts fail

            let raycastAlways = false;
            if (raycastAlways || !this._myRaycastResult.isColliding()) {
                raycastResult = PP.PhysicsUtils.raycast(this._myRaycastSetup, tempRaycastResult);
            }

            if (!this._myRaycastResult.isColliding() && tempRaycastResult.isColliding()) {
                this._myRaycastResult.copy(tempRaycastResult);
            }

            raycastResult = this._myRaycastResult;
        }


        this._myTotalRaycasts++;
        //raycastResult.myHits = [];

        if (this._myDebugActive) {
            PP.myDebugVisualManager.drawRaycast(0, raycastResult);
        }

        return raycastResult;
    };
}();



Object.defineProperty(PP.CollisionCheck.prototype, "_raycastAndDebug", { enumerable: false });


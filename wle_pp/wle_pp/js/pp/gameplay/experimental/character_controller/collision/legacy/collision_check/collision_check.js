import { RaycastHit, RaycastParams, RaycastResults } from "../../../../../../cauldron/physics/physics_raycast_params";
import { PhysicsUtils } from "../../../../../../cauldron/physics/physics_utils";
import { vec3_create, vec4_create } from "../../../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../../../pp/globals";
import { CollisionCheckParams, CollisionRuntimeParams } from "./collision_params";

export function generate360TeleportParamsFromMovementParams(movementParams, outTeleportParams = new CollisionCheckParams()) {
    outTeleportParams.copy(movementParams);

    outTeleportParams.myHalfConeAngle = 180;
    outTeleportParams.myHalfConeSliceAmount = Math.round((outTeleportParams.myHalfConeAngle / movementParams.myHalfConeAngle) * movementParams.myHalfConeSliceAmount);

    outTeleportParams.myCheckHorizontalFixedForwardEnabled = true;
    outTeleportParams.myCheckHorizontalFixedForward = vec3_create(0, 0, 1);

    return outTeleportParams;
}

export let CollisionCheckUtils = {
    generate360TeleportParamsFromMovementParams
};

export class CollisionCheck {

    constructor(engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._myRaycastParams = new RaycastParams(Globals.getPhysics(this._myEngine));
        this._myRaycastResult = new RaycastResults();
        this._myFixRaycastResult = new RaycastResults();

        this._myBackupRaycastHit = new RaycastHit();

        this._myPrevCollisionRuntimeParams = new CollisionRuntimeParams();

        this._mySlidingCollisionRuntimeParams = new CollisionRuntimeParams();
        this._myCheckBetterSlidingNormalCollisionRuntimeParams = new CollisionRuntimeParams();
        this._myInternalSlidingCollisionRuntimeParams = new CollisionRuntimeParams();
        this._mySlidingFlickeringFixCollisionRuntimeParams = new CollisionRuntimeParams();
        this._mySlidingFlickeringFixSlidingCollisionRuntimeParams = new CollisionRuntimeParams();
        this._mySlidingOppositeDirectionCollisionRuntimeParams = new CollisionRuntimeParams();
        this._mySlidingOnVerticalCheckCollisionRuntimeParams = new CollisionRuntimeParams();

        this._myDebugEnabled = false;

        this._myTotalRaycasts = 0;
        this._myTotalRaycastsMax = 0;
    }

    move(movement, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        this._move(movement, transformQuat, collisionCheckParams, collisionRuntimeParams);
    }

    // #TODO Add teleport position/transform and return originalteleportransform
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

            Globals.getDebugVisualManager(this._myEngine).drawArrow(0, feetPositionPlusOffset, originalHorizontalMovement, 0.2, vec4_create(0.5, 0.5, 1, 1));
        }

        if (!horizontalMovement.vec3_isZero()) {
            horizontalMovement.vec3_normalize(horizontalMovement);

            Globals.getDebugVisualManager(this._myEngine).drawArrow(0, feetPositionPlusOffset, horizontalMovement, 0.2, vec4_create(0, 0, 1, 1));
        }

        if (!verticalMovement.vec3_isZero()) {
            verticalMovement.vec3_normalize(verticalMovement);

            Globals.getDebugVisualManager(this._myEngine).drawArrow(0, feetPosition, verticalMovement, 0.2, vec4_create(0, 0, 1, 1));
        }
    }

    _debugRuntimeParams(collisionRuntimeParams) {
        if (collisionRuntimeParams.myHorizontalCollisionHit.isValid()) {
            Globals.getDebugVisualManager(this._myEngine).drawArrow(0,
                collisionRuntimeParams.myHorizontalCollisionHit.myPosition,
                collisionRuntimeParams.myHorizontalCollisionHit.myNormal, 0.2, vec4_create(1, 0, 0, 1));
        }

        if (collisionRuntimeParams.mySlidingCollisionHit.isValid()) {
            Globals.getDebugVisualManager(this._myEngine).drawArrow(0,
                collisionRuntimeParams.mySlidingCollisionHit.myPosition,
                collisionRuntimeParams.mySlidingCollisionHit.myNormal, 0.2, vec4_create(1, 0, 0, 1));
        }

        if (collisionRuntimeParams.myVerticalCollisionHit.isValid()) {
            Globals.getDebugVisualManager(this._myEngine).drawArrow(0,
                collisionRuntimeParams.myVerticalCollisionHit.myPosition,
                collisionRuntimeParams.myVerticalCollisionHit.myNormal, 0.2, vec4_create(1, 0, 0, 1));
        }
    }

    _raycastAndDebug(origin, direction, distance, ignoreHitsInsideCollision, isHorizontal, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }
};

CollisionCheck.prototype._raycastAndDebug = function () {
    let tempRaycastResult = new RaycastResults();
    return function _raycastAndDebug(origin, direction, distance, ignoreHitsInsideCollision, isHorizontal, collisionCheckParams, collisionRuntimeParams) {
        this._myRaycastParams.myOrigin.vec3_copy(origin);
        this._myRaycastParams.myDirection.vec3_copy(direction);
        this._myRaycastParams.myDistance = distance;

        if (isHorizontal) {
            this._myRaycastParams.myBlockLayerFlags.copy(collisionCheckParams.myHorizontalBlockLayerFlags);
            this._myRaycastParams.myObjectsToIgnore = collisionCheckParams.myHorizontalObjectsToIgnore;
        } else {
            this._myRaycastParams.myBlockLayerFlags.copy(collisionCheckParams.myVerticalBlockLayerFlags);
            this._myRaycastParams.myObjectsToIgnore = collisionCheckParams.myVerticalObjectsToIgnore;
        }

        this._myRaycastParams.myIgnoreHitsInsideCollision = ignoreHitsInsideCollision;

        let raycastResult = null;
        if (true) {
            raycastResult = PhysicsUtils.raycast(this._myRaycastParams, this._myRaycastResult);
        } else {
            // Quick debug to remove raycasts and/or let all raycasts fail

            let raycastAlways = false;
            if (raycastAlways || !this._myRaycastResult.isColliding()) {
                raycastResult = PhysicsUtils.raycast(this._myRaycastParams, tempRaycastResult);
            }

            if (!this._myRaycastResult.isColliding() && tempRaycastResult.isColliding()) {
                this._myRaycastResult.copy(tempRaycastResult);
            }

            raycastResult = this._myRaycastResult;
        }


        this._myTotalRaycasts++;
        //raycastResult.myHits = [];

        if (this._myDebugEnabled && Globals.isDebugEnabled(this._myEngine)) {
            Globals.getDebugVisualManager(this._myEngine).drawRaycast(0, raycastResult);
        }

        return raycastResult;
    };
}();
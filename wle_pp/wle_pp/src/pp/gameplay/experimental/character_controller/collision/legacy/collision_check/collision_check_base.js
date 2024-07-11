import { RaycastBlockColliderType, RaycastHit, RaycastParams, RaycastResults } from "../../../../../../cauldron/physics/physics_raycast_params.js";
import { PhysicsUtils } from "../../../../../../cauldron/physics/physics_utils.js";
import { quat2_create, vec3_create, vec4_create } from "../../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../../../pp/globals.js";
import { CollisionRuntimeParams } from "./collision_params.js";

export class CollisionCheckBase {

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

        this._myCollisionCheckDisabled = false;

        this._myDebugEnabled = false;

        this._myTotalRaycasts = 0;
    }

    isCollisionCheckDisabled() {
        return this._myCollisionCheckDisabled;
    }

    setCollisionCheckDisabled(collisionCheckDisabled) {
        this._myCollisionCheckDisabled = collisionCheckDisabled;
    }

    _raycastAndDebug(origin, direction, distance, ignoreHitsInsideCollision, isHorizontal, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }

    _setRuntimeParamsForMoveCollisionCheckDisabled(movement, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }

    _setRuntimeParamsForTeleportCollisionCheckDisabled(position, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }

    _setRuntimeParamsForPositionCheckCollisionCheckDisabled(allowFix, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }

    _setRuntimeParamsForUpdateSurfaceInfoCollisionCheckDisabled(transformQuat, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
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
}



// IMPLEMENTATION

CollisionCheckBase.prototype._raycastAndDebug = function () {
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

        // #TODO it should just hit NORMAL colliders, but for perf reasons since I need to get the component from the object it's better to keep it like this 
        // When changing this to NORMAL, do also remember to update the other place like player teleport where BOTH is also used to NORMAL
        this._myRaycastParams.myBlockColliderType = RaycastBlockColliderType.BOTH;

        let raycastResult = null;

        let raycastPerformanceDebugEnabled = false;
        if (raycastPerformanceDebugEnabled && Globals.isDebugEnabled(this._myEngine)) {
            // Quick debug to remove raycasts and/or let all raycasts fail

            let raycastAlways = false;
            if (raycastAlways || !this._myRaycastResult.isColliding()) {
                raycastResult = PhysicsUtils.raycast(this._myRaycastParams, tempRaycastResult);
            }

            if (!this._myRaycastResult.isColliding() && tempRaycastResult.isColliding()) {
                this._myRaycastResult.copy(tempRaycastResult);
            }

            raycastResult = this._myRaycastResult;
        } else {
            raycastResult = PhysicsUtils.raycast(this._myRaycastParams, this._myRaycastResult);
        }


        this._myTotalRaycasts++;

        if (this._myDebugEnabled && Globals.isDebugEnabled(this._myEngine)) {
            Globals.getDebugVisualManager(this._myEngine).drawRaycast(0, raycastResult);
        }

        return raycastResult;
    };
}();

CollisionCheckBase.prototype._setRuntimeParamsForMoveCollisionCheckDisabled = function () {
    let transformOffsetLocalQuat = quat2_create();
    let offsetTransformQuat = quat2_create();
    return function _setRuntimeParamsForMoveCollisionCheckDisabled(movement, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        collisionRuntimeParams.reset();

        collisionRuntimeParams.myRealIsOnGround = true;
        collisionRuntimeParams.myIsOnGround = true;
        collisionRuntimeParams.myGroundCollisionHit.reset();
        collisionRuntimeParams.myGroundAngle = 0;
        collisionRuntimeParams.myGroundPerceivedAngle = 0;
        collisionRuntimeParams.myGroundNormal.vec3_set(0, 1, 0);
        collisionRuntimeParams.myGroundHitMaxAngle = collisionRuntimeParams.myGroundAngle;
        collisionRuntimeParams.myGroundHitMaxNormal.vec3_copy(collisionRuntimeParams.myGroundNormal);
        collisionRuntimeParams.myGroundDistance = 0;
        collisionRuntimeParams.myGroundIsBaseInsideCollision = false;
        collisionRuntimeParams.myOnGroundDueToBasePartiallyInsideCollision = false;

        collisionRuntimeParams.myRealIsOnCeiling = false;
        collisionRuntimeParams.myIsOnCeiling = false;
        collisionRuntimeParams.myCeilingCollisionHit.reset();
        collisionRuntimeParams.myCeilingAngle = 0;
        collisionRuntimeParams.myCeilingPerceivedAngle = 0;
        collisionRuntimeParams.myCeilingNormal.vec3_set(0, 1, 0);
        collisionRuntimeParams.myCeilingHitMaxAngle = collisionRuntimeParams.myCeilingAngle;
        collisionRuntimeParams.myCeilingHitMaxNormal.vec3_copy(collisionRuntimeParams.myCeilingNormal);
        collisionRuntimeParams.myCeilingDistance = 0;
        collisionRuntimeParams.myCeilingIsBaseInsideCollision = false;
        collisionRuntimeParams.myOnCeilingDueToBasePartiallyInsideCollision = false;

        collisionRuntimeParams.mySplitMovementSteps = 1;
        collisionRuntimeParams.mySplitMovementStepsPerformed = 1;
        collisionRuntimeParams.mySplitMovementStop = false;
        collisionRuntimeParams.mySplitMovementMovementChecked.vec3_copy(movement);

        collisionRuntimeParams.myOriginalUp = transformQuat.quat2_getUp(collisionRuntimeParams.myOriginalUp);
        collisionRuntimeParams.myOriginalForward = transformQuat.quat2_getForward(collisionRuntimeParams.myOriginalForward);
        collisionRuntimeParams.myOriginalPosition = transformQuat.quat2_getPosition(collisionRuntimeParams.myOriginalPosition);

        transformOffsetLocalQuat.quat2_setPositionRotationQuat(collisionCheckParams.myPositionOffsetLocal, collisionCheckParams.myRotationOffsetLocalQuat);
        offsetTransformQuat = transformOffsetLocalQuat.quat2_toWorld(transformQuat, offsetTransformQuat);
        if (transformQuat.vec_equals(offsetTransformQuat, 0.00001)) {
            offsetTransformQuat.quat2_copy(transformQuat);
        }
        collisionRuntimeParams.myOffsetUp = offsetTransformQuat.quat2_getUp(collisionRuntimeParams.myOffsetUp);

        collisionRuntimeParams.myOriginalHeight = collisionCheckParams.myHeight;

        collisionRuntimeParams.myOriginalMovement.vec3_copy(movement);
        collisionRuntimeParams.myFixedMovement.vec3_copy(movement);

        collisionRuntimeParams.myNewPosition = collisionRuntimeParams.myOriginalPosition.vec3_add(collisionRuntimeParams.myFixedMovement, collisionRuntimeParams.myNewPosition);

        collisionRuntimeParams.myIsMove = true;
    };
}();

CollisionCheckBase.prototype._setRuntimeParamsForTeleportCollisionCheckDisabled = function () {
    let transformOffsetLocalQuat = quat2_create();
    let offsetTransformQuat = quat2_create();
    return function _setRuntimeParamsForTeleportCollisionCheckDisabled(position, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        collisionRuntimeParams.reset();

        collisionRuntimeParams.myRealIsOnGround = true;
        collisionRuntimeParams.myIsOnGround = true;
        collisionRuntimeParams.myGroundCollisionHit.reset();
        collisionRuntimeParams.myGroundAngle = 0;
        collisionRuntimeParams.myGroundPerceivedAngle = 0;
        collisionRuntimeParams.myGroundNormal.vec3_set(0, 1, 0);
        collisionRuntimeParams.myGroundHitMaxAngle = collisionRuntimeParams.myGroundAngle;
        collisionRuntimeParams.myGroundHitMaxNormal.vec3_copy(collisionRuntimeParams.myGroundNormal);
        collisionRuntimeParams.myGroundDistance = 0;
        collisionRuntimeParams.myGroundIsBaseInsideCollision = false;
        collisionRuntimeParams.myOnGroundDueToBasePartiallyInsideCollision = false;

        collisionRuntimeParams.myRealIsOnCeiling = false;
        collisionRuntimeParams.myIsOnCeiling = false;
        collisionRuntimeParams.myCeilingCollisionHit.reset();
        collisionRuntimeParams.myCeilingAngle = 0;
        collisionRuntimeParams.myCeilingPerceivedAngle = 0;
        collisionRuntimeParams.myCeilingNormal.vec3_set(0, 1, 0);
        collisionRuntimeParams.myCeilingHitMaxAngle = collisionRuntimeParams.myCeilingAngle;
        collisionRuntimeParams.myCeilingHitMaxNormal.vec3_copy(collisionRuntimeParams.myCeilingNormal);
        collisionRuntimeParams.myCeilingDistance = 0;
        collisionRuntimeParams.myCeilingIsBaseInsideCollision = false;
        collisionRuntimeParams.myOnCeilingDueToBasePartiallyInsideCollision = false;

        collisionRuntimeParams.myOriginalUp = transformQuat.quat2_getUp(collisionRuntimeParams.myOriginalUp);
        collisionRuntimeParams.myOriginalForward = transformQuat.quat2_getForward(collisionRuntimeParams.myOriginalForward);
        collisionRuntimeParams.myOriginalPosition = transformQuat.quat2_getPosition(collisionRuntimeParams.myOriginalPosition);

        transformOffsetLocalQuat.quat2_setPositionRotationQuat(collisionCheckParams.myPositionOffsetLocal, collisionCheckParams.myRotationOffsetLocalQuat);
        offsetTransformQuat = transformOffsetLocalQuat.quat2_toWorld(transformQuat, offsetTransformQuat);
        if (transformQuat.vec_equals(offsetTransformQuat, 0.00001)) {
            offsetTransformQuat.quat2_copy(transformQuat);
        }
        collisionRuntimeParams.myOffsetUp = offsetTransformQuat.quat2_getUp(collisionRuntimeParams.myOffsetUp);

        collisionRuntimeParams.myOriginalHeight = collisionCheckParams.myHeight;

        collisionRuntimeParams.myOriginalTeleportPosition.vec3_copy(position);
        collisionRuntimeParams.myFixedTeleportPosition.vec3_copy(position);

        collisionRuntimeParams.myNewPosition.vec3_copy(collisionRuntimeParams.myFixedTeleportPosition);

        collisionRuntimeParams.myIsTeleport = true;
    };
}();

CollisionCheckBase.prototype._setRuntimeParamsForPositionCheckCollisionCheckDisabled = function () {
    let feetPosition = vec3_create();
    return function _setRuntimeParamsForPositionCheckCollisionCheckDisabled(allowFix, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        feetPosition = transformQuat.quat2_getPosition(feetPosition);
        this._setRuntimeParamsForTeleportCollisionCheckDisabled(feetPosition, transformQuat, collisionCheckParams, collisionRuntimeParams);

        collisionRuntimeParams.myIsPositionOk = true;
        collisionRuntimeParams.myIsPositionCheck = true;

        collisionRuntimeParams.myOriginalPositionCheckPosition.vec3_copy(collisionRuntimeParams.myOriginalTeleportPosition);
        collisionRuntimeParams.myFixedPositionCheckPosition.vec3_copy(collisionRuntimeParams.myFixedTeleportPosition);
        collisionRuntimeParams.myIsPositionCheckAllowAdjustments = allowFix;

        collisionRuntimeParams.myOriginalTeleportPosition.vec3_zero();
        collisionRuntimeParams.myFixedTeleportPosition.vec3_zero();
        collisionRuntimeParams.myTeleportCanceled = false;
        collisionRuntimeParams.myIsTeleport = false;
    };
}();

CollisionCheckBase.prototype._setRuntimeParamsForUpdateSurfaceInfoCollisionCheckDisabled = function () {
    return function _setRuntimeParamsForUpdateSurfaceInfoCollisionCheckDisabled(transformQuat, collisionCheckParams, collisionRuntimeParams) {
        collisionRuntimeParams.myRealIsOnGround = true;
        collisionRuntimeParams.myIsOnGround = true;
        collisionRuntimeParams.myGroundCollisionHit.reset();
        collisionRuntimeParams.myGroundAngle = 0;
        collisionRuntimeParams.myGroundPerceivedAngle = 0;
        collisionRuntimeParams.myGroundNormal.vec3_set(0, 1, 0);
        collisionRuntimeParams.myGroundHitMaxAngle = collisionRuntimeParams.myGroundAngle;
        collisionRuntimeParams.myGroundHitMaxNormal.vec3_copy(collisionRuntimeParams.myGroundNormal);
        collisionRuntimeParams.myGroundDistance = 0;
        collisionRuntimeParams.myGroundIsBaseInsideCollision = false;
        collisionRuntimeParams.myOnGroundDueToBasePartiallyInsideCollision = false;

        collisionRuntimeParams.myRealIsOnCeiling = false;
        collisionRuntimeParams.myIsOnCeiling = false;
        collisionRuntimeParams.myCeilingCollisionHit.reset();
        collisionRuntimeParams.myCeilingAngle = 0;
        collisionRuntimeParams.myCeilingPerceivedAngle = 0;
        collisionRuntimeParams.myCeilingNormal.vec3_set(0, 1, 0);
        collisionRuntimeParams.myCeilingHitMaxAngle = collisionRuntimeParams.myCeilingAngle;
        collisionRuntimeParams.myCeilingHitMaxNormal.vec3_copy(collisionRuntimeParams.myCeilingNormal);
        collisionRuntimeParams.myCeilingDistance = 0;
        collisionRuntimeParams.myCeilingIsBaseInsideCollision = false;
        collisionRuntimeParams.myOnCeilingDueToBasePartiallyInsideCollision = false;
    };
}();
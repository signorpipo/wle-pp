import { RaycastHit } from "../../../../../../cauldron/physics/physics_raycast_params.js";
import { vec3_create } from "../../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { CollisionCheckHorizontal } from "./collision_check_horizontal.js";

export class CollisionCheckVertical extends CollisionCheckHorizontal {

    _verticalCheck(verticalMovement, originalMovementSign, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, outFixedMovement) {
        // Implemented outside class definition
    }

    _verticalMovementAdjustment(verticalMovement, isMovementDownward, originalMovementSign, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, outFixedMovement) {
        // Implemented outside class definition
    }

    _verticalPositionCheck(feetPosition, checkUpward, height, up, forward, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }

    _getVerticalCheckPositions(feetPosition, up, forward, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

CollisionCheckVertical.prototype._verticalCheck = function () {
    let newFeetPosition = vec3_create();
    let additionalFixedMovement = vec3_create();
    let zero = vec3_create(0, 0, 0);
    return function _verticalCheck(verticalMovement, originalMovementSign, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, outFixedMovement) {
        collisionRuntimeParams.myIsCollidingVertically = false;
        collisionRuntimeParams.myVerticalCollisionHit.reset();

        // #TODO the sign of 0 is by default downward, but it should probably be based on if u previously were on Ground or Ceiling
        // If none, ok downward, if on Ground downward, if on Ceiling upward, so that even without @myCheckVerticalBothDirection
        // if u were snapped to the ceiling u will keep snap on it even when 0 vertical movement
        let movementSign = Math.pp_sign(verticalMovement.vec3_lengthSigned(up), -1);
        let isMovementDownward = movementSign < 0;

        outFixedMovement.vec3_copy(verticalMovement);
        if (collisionCheckParams.myVerticalMovementCheckEnabled) {
            outFixedMovement = this._verticalMovementAdjustment(verticalMovement, isMovementDownward, originalMovementSign, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, outFixedMovement);

            if (!collisionRuntimeParams.myIsCollidingVertically && collisionCheckParams.myCheckVerticalBothDirection &&
                (outFixedMovement.vec_equals(verticalMovement, 0.00001) || originalMovementSign == 0 || (movementSign != originalMovementSign))) {
                newFeetPosition = feetPosition.vec3_add(outFixedMovement, newFeetPosition);
                let isOppositeMovementDownward = !isMovementDownward;
                additionalFixedMovement = this._verticalMovementAdjustment(zero, isOppositeMovementDownward, originalMovementSign, newFeetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, additionalFixedMovement);

                outFixedMovement.vec3_add(additionalFixedMovement, outFixedMovement);
                isMovementDownward = !isMovementDownward;
            }
        }

        // #TODO Here, if there is no vertical movement and there is no horizontal movement (or it has been canceled)
        // it would probably make more sense to skip this check, and if it is vertically colliding, but the movement is 0,0,0
        // we can say that the movement is, after all, fine
        // For now I will keep it as it is because i'm not sure if some feature (like the transform manager) could make assumption
        // on the fact that even a 0,0,0 movement can fail thanks to this (like the head colliding check)
        // Is not a big problem anyway, u can just check if the movement is 0 before checking the collision, and if it is 0
        // u won't move anyway
        if (!collisionRuntimeParams.myIsCollidingVertically && collisionCheckParams.myVerticalPositionCheckEnabled) {
            newFeetPosition = feetPosition.vec3_add(outFixedMovement, newFeetPosition);
            let canStay = this._verticalPositionCheck(newFeetPosition, isMovementDownward, height, up, forward, collisionCheckParams, collisionRuntimeParams);
            if (!canStay) {
                outFixedMovement.vec3_zero();

                // #TODO Probably this should not be reset, you should be required to check if the movement was ok to be sure this values have a meaning
                collisionRuntimeParams.myHasSnappedOnGround = false;
                collisionRuntimeParams.myHasSnappedOnCeiling = false;
                collisionRuntimeParams.myHasPoppedOutGround = false;
                collisionRuntimeParams.myHasPoppedOutCeiling = false;
                collisionRuntimeParams.myHasReducedVerticalMovement = false;
            }
        } else if (collisionRuntimeParams.myIsCollidingVertically) {
            outFixedMovement.vec3_zero();
        }

        return outFixedMovement;
    };
}();

CollisionCheckVertical.prototype._verticalMovementAdjustment = function () {
    let startOffset = vec3_create();
    let endOffset = vec3_create();
    let tempVector = vec3_create();
    let furtherDirection = vec3_create();
    let furtherDirectionPosition = vec3_create();
    let upNegate = vec3_create();
    let origin = vec3_create();
    let direction = vec3_create();

    let verticalCollisionHit = new RaycastHit();
    return function _verticalMovementAdjustment(verticalMovement, isMovementDownward, originalMovementSign, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, outFixedMovement) {
        this._myDebugEnabled = collisionCheckParams.myDebugEnabled && collisionCheckParams.myDebugVerticalMovementEnabled;

        startOffset.vec3_zero();
        endOffset.vec3_zero();

        let popOutEnabled = false;
        let snapEnabled = false;

        if (isMovementDownward) {
            startOffset.vec3_zero();
            endOffset.vec3_copy(verticalMovement);

            if (collisionCheckParams.myGroundPopOutExtraDistance > 0 && collisionCheckParams.myGroundPopOutEnabled) {
                startOffset.vec3_add(up.vec3_scale(collisionCheckParams.myGroundPopOutExtraDistance + 0.00001, tempVector), startOffset);
                popOutEnabled = true;
            }
        } else {
            startOffset = up.vec3_scale(height, startOffset);
            endOffset = up.vec3_scale(height, endOffset).vec3_add(verticalMovement, endOffset);

            if (collisionCheckParams.myCeilingPopOutExtraDistance > 0 && collisionCheckParams.myCeilingPopOutEnabled) {
                startOffset.vec3_add(up.vec3_scale(-collisionCheckParams.myCeilingPopOutExtraDistance - 0.00001, tempVector), startOffset);
                popOutEnabled = true;
            }
        }

        if (isMovementDownward && originalMovementSign <= 0 && this._myPrevCollisionRuntimeParams.myIsOnGround && collisionCheckParams.mySnapOnGroundEnabled && collisionCheckParams.mySnapOnGroundExtraDistance > 0) {
            endOffset.vec3_add(up.vec3_scale(-collisionCheckParams.mySnapOnGroundExtraDistance - 0.00001, tempVector), endOffset);
            snapEnabled = true;
        } else if (!isMovementDownward && this._myPrevCollisionRuntimeParams.myIsOnCeiling && collisionCheckParams.mySnapOnCeilingEnabled && collisionCheckParams.mySnapOnCeilingExtraDistance > 0 &&
            (originalMovementSign > 0 || (originalMovementSign == 0 && (!this._myPrevCollisionRuntimeParams.myIsOnGround || !collisionCheckParams.mySnapOnGroundEnabled)))) {
            endOffset.vec3_add(up.vec3_scale(collisionCheckParams.mySnapOnCeilingExtraDistance + 0.00001, tempVector), endOffset);
            snapEnabled = true;
        }

        outFixedMovement.vec3_zero();
        if (startOffset.vec3_distance(endOffset) > 0.00001) {
            let checkPositions = this._getVerticalCheckPositions(feetPosition, up, forward, collisionCheckParams, collisionRuntimeParams);

            furtherDirection.vec3_copy(up);
            if (!isMovementDownward) {
                furtherDirection.vec3_negate(furtherDirection);
            }

            let furtherDirectionPositionSet = false;

            for (let i = 0; i < checkPositions.length; i++) {
                let currentPosition = checkPositions[i];

                origin = currentPosition.vec3_add(startOffset, origin);
                direction = currentPosition.vec3_add(endOffset, direction).vec3_sub(origin, direction);
                let distance = direction.vec3_length();
                direction.vec3_normalize(direction);

                let raycastResult = this._raycastAndDebug(origin, direction, distance, true, false, collisionCheckParams, collisionRuntimeParams);

                if (raycastResult.myHits.length > 0) {
                    if (furtherDirectionPositionSet) {
                        if (raycastResult.myHits[0].myPosition.vec3_isFartherAlongAxis(furtherDirectionPosition, furtherDirection)) {
                            furtherDirectionPosition.vec3_copy(raycastResult.myHits[0].myPosition);
                            verticalCollisionHit.copy(raycastResult.myHits[0]);
                        }
                    } else {
                        furtherDirectionPositionSet = true;
                        furtherDirectionPosition.vec3_copy(raycastResult.myHits[0].myPosition);
                        verticalCollisionHit.copy(raycastResult.myHits[0]);
                    }
                }
            }

            if (furtherDirectionPositionSet) {
                upNegate = up.vec3_negate(upNegate);
                if (isMovementDownward) {
                    outFixedMovement = furtherDirectionPosition.vec3_sub(feetPosition, outFixedMovement).vec3_componentAlongAxis(up, outFixedMovement);

                    if (snapEnabled && outFixedMovement.vec3_isFartherAlongAxis(verticalMovement, upNegate)) {
                        collisionRuntimeParams.myHasSnappedOnGround = true;
                    } else if (popOutEnabled && outFixedMovement.vec3_isFartherAlongAxis(verticalMovement, up)) {
                        if (!outFixedMovement.vec3_isZero(0.00001) &&
                            (verticalMovement.vec3_isZero(0.00001) || !outFixedMovement.vec3_isConcordant(verticalMovement))) {
                            collisionRuntimeParams.myHasPoppedOutGround = true;
                        } else {
                            collisionRuntimeParams.myHasReducedVerticalMovement = true;
                        }
                    } else {
                        collisionRuntimeParams.myHasReducedVerticalMovement = true;
                    }
                } else {
                    outFixedMovement = furtherDirectionPosition.vec3_sub(feetPosition.vec3_add(up.vec3_scale(height, outFixedMovement), outFixedMovement), outFixedMovement).
                        vec3_componentAlongAxis(up, outFixedMovement);

                    if (snapEnabled && outFixedMovement.vec3_isFartherAlongAxis(verticalMovement, up)) {
                        collisionRuntimeParams.myHasSnappedOnCeiling = true;
                    } else if (popOutEnabled && outFixedMovement.vec3_isFartherAlongAxis(verticalMovement, upNegate)) {
                        if (!outFixedMovement.vec3_isZero(0.00001) &&
                            (verticalMovement.vec3_isZero(0.00001) || !outFixedMovement.vec3_isConcordant(verticalMovement))) {
                            collisionRuntimeParams.myHasPoppedOutCeiling = true;
                        } else {
                            collisionRuntimeParams.myHasReducedVerticalMovement = true;
                        }
                    } else {
                        collisionRuntimeParams.myHasReducedVerticalMovement = true;
                    }
                }

                if (!popOutEnabled && !outFixedMovement.vec3_isConcordant(verticalMovement)) {
                    outFixedMovement.vec3_zero();
                }

                if (!collisionCheckParams.myVerticalMovementReduceEnabled && collisionRuntimeParams.myHasReducedVerticalMovement) {
                    outFixedMovement.vec3_zero();

                    // #TODO Probably this should not be reset, you should be required to check if the movement was ok to be sure this values have a meaning
                    collisionRuntimeParams.myHasSnappedOnGround = false;
                    collisionRuntimeParams.myHasSnappedOnCeiling = false;
                    collisionRuntimeParams.myHasPoppedOutGround = false;
                    collisionRuntimeParams.myHasPoppedOutCeiling = false;
                    collisionRuntimeParams.myHasReducedVerticalMovement = false;

                    collisionRuntimeParams.myIsCollidingVertically = true;
                    collisionRuntimeParams.myVerticalCollisionHit.copy(verticalCollisionHit);
                }
            } else {
                outFixedMovement.vec3_copy(verticalMovement);
            }
        } else {
            outFixedMovement.vec3_copy(verticalMovement);
        }

        if (outFixedMovement.vec3_length() < 0.00001) {
            outFixedMovement.vec3_zero();
        }

        return outFixedMovement;
    };
}();

CollisionCheckVertical.prototype._verticalPositionCheck = function () {
    let smallHeightFixOffset = vec3_create();
    let heightOffset = vec3_create();
    let startPosition = vec3_create();
    let endPosition = vec3_create();
    let direction = vec3_create();
    return function _verticalPositionCheck(feetPosition, checkUpward, height, up, forward, collisionCheckParams, collisionRuntimeParams) {
        if (height < 0.00001) {
            return true;
        }

        this._myDebugEnabled = collisionCheckParams.myDebugEnabled && collisionCheckParams.myDebugVerticalPositionEnabled;

        let checkPositions = this._getVerticalCheckPositions(feetPosition, up, forward, collisionCheckParams, collisionRuntimeParams);

        let isVerticalPositionOk = true;
        let atLeastOneIsOk = false;

        let adjustmentEpsilon = 0.0001; // Small offset to prevent hitting with the surface where u are on
        smallHeightFixOffset = up.vec3_scale(adjustmentEpsilon, smallHeightFixOffset);
        heightOffset = up.vec3_scale(height - adjustmentEpsilon, heightOffset);
        if (height - adjustmentEpsilon < adjustmentEpsilon * 10) {
            heightOffset = up.vec3_scale(adjustmentEpsilon * 10, heightOffset);
        }

        let insideHitSet = false;
        for (let i = 0; i < checkPositions.length; i++) {
            let currentPosition = checkPositions[i];

            if (checkUpward) {
                startPosition = currentPosition.vec3_add(smallHeightFixOffset, startPosition);
                endPosition = currentPosition.vec3_add(heightOffset, endPosition);
            } else {
                startPosition = currentPosition.vec3_add(heightOffset, startPosition);
                endPosition = currentPosition.vec3_add(smallHeightFixOffset, endPosition);
            }

            let origin = startPosition;
            direction = endPosition.vec3_sub(origin, direction);
            let distance = direction.vec3_length();
            direction.vec3_normalize(direction);

            let raycastResult = this._raycastAndDebug(origin, direction, distance, false, false, collisionCheckParams, collisionRuntimeParams);

            if (raycastResult.isColliding()) {
                let firstHitOutsideCollision = raycastResult.getFirstHitOutsideCollision();
                if (firstHitOutsideCollision != null) {
                    isVerticalPositionOk = false;
                    collisionRuntimeParams.myVerticalCollisionHit.copy(firstHitOutsideCollision);
                    break;
                } else if (!insideHitSet) {
                    insideHitSet = true;
                    collisionRuntimeParams.myVerticalCollisionHit.copy(raycastResult.myHits[0]);
                    if (!collisionCheckParams.myVerticalAllowHitInsideCollisionIfOneOk) {
                        isVerticalPositionOk = false;
                        break;
                    }
                }
            } else {
                atLeastOneIsOk = true;
            }
        }

        collisionRuntimeParams.myIsCollidingVertically = !isVerticalPositionOk || !atLeastOneIsOk;

        return !collisionRuntimeParams.myIsCollidingVertically;
    };
}();

CollisionCheckVertical.prototype._getVerticalCheckPositions = function () {
    let checkPositions = [];
    let cachedCheckPositions = [];
    let currentCachedCheckPositionIndex = 0;
    let _localGetCachedCheckPosition = function () {
        let item = null;
        while (cachedCheckPositions.length <= currentCachedCheckPositionIndex) {
            cachedCheckPositions.push(vec3_create());
        }

        item = cachedCheckPositions[currentCachedCheckPositionIndex];
        currentCachedCheckPositionIndex++;
        return item;
    };

    let currentDirection = vec3_create();
    return function _getVerticalCheckPositions(feetPosition, up, forward, collisionCheckParams, collisionRuntimeParams) {
        checkPositions.length = 0;
        currentCachedCheckPositionIndex = 0;

        if (collisionCheckParams.myGroundCircumferenceAddCenter) {
            let tempCheckPosition = _localGetCachedCheckPosition();
            tempCheckPosition.vec3_copy(feetPosition);
            checkPositions.push(tempCheckPosition);
        }

        let radiusStep = collisionCheckParams.myFeetRadius / collisionCheckParams.myGroundCircumferenceStepAmount;
        let sliceAngle = 360 / collisionCheckParams.myGroundCircumferenceSliceAmount;
        let currentStepRotation = 0;
        for (let i = 0; i < collisionCheckParams.myGroundCircumferenceStepAmount; i++) {
            let currentRadius = radiusStep * (i + 1);

            currentDirection = forward.vec3_rotateAxis(currentStepRotation, up, currentDirection);
            for (let j = 0; j < collisionCheckParams.myGroundCircumferenceSliceAmount; j++) {
                let tempCheckPosition = _localGetCachedCheckPosition();
                let sliceDirection = currentDirection.vec3_rotateAxis(sliceAngle * j, up, tempCheckPosition);
                checkPositions.push(feetPosition.vec3_add(sliceDirection.vec3_scale(currentRadius, sliceDirection), sliceDirection));
            }

            currentStepRotation += collisionCheckParams.myGroundCircumferenceRotationPerStep;
        }

        return checkPositions;
    };
}();
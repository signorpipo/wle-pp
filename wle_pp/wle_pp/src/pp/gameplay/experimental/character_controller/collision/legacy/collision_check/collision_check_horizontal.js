import { vec3_create } from "../../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { CollisionCheckHorizontalSliding } from "./collision_check_horizontal_sliding.js";

export class CollisionCheckHorizontal extends CollisionCheckHorizontalSliding {

    _horizontalCheck(movement, feetPosition, height, up, forward, allowSurfaceSteepFix, collisionCheckParams, collisionRuntimeParams, previousCollisionRuntimeParams, avoidSlidingExtraCheck, outFixedMovement) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

CollisionCheckHorizontal.prototype._horizontalCheck = function () {
    let fixedFeetPosition = vec3_create();
    let newFixedFeetPosition = vec3_create();
    let newFeetPosition = vec3_create();
    let horizontalDirection = vec3_create();
    return function _horizontalCheck(movement, feetPosition, height, up, forward, allowSurfaceSteepFix, collisionCheckParams, collisionRuntimeParams, previousCollisionRuntimeParams, avoidSlidingExtraCheck, outFixedMovement) {
        collisionRuntimeParams.myIsCollidingHorizontally = false;
        collisionRuntimeParams.myHorizontalCollisionHit.reset();
        outFixedMovement.vec3_zero();

        horizontalDirection = movement.vec3_normalize(horizontalDirection);
        let surfaceTooSteepResults = this._surfaceTooSteep(up, horizontalDirection, collisionCheckParams, previousCollisionRuntimeParams);
        if (movement.vec3_isZero(0.000001) ||
            ((!surfaceTooSteepResults[0] || (allowSurfaceSteepFix && collisionCheckParams.myAllowGroundSteepFix)) &&
                (!surfaceTooSteepResults[1] || (allowSurfaceSteepFix && collisionCheckParams.myAllowCeilingSteepFix)))) {
            fixedFeetPosition = feetPosition.vec3_add(up.vec3_scale(collisionCheckParams.myDistanceFromFeetToIgnore + 0.0001, fixedFeetPosition), fixedFeetPosition);
            let fixedHeight = Math.max(0, height - collisionCheckParams.myDistanceFromFeetToIgnore - collisionCheckParams.myDistanceFromHeadToIgnore - 0.0001 * 2);

            let canMove = true;
            if (collisionCheckParams.myHorizontalMovementCheckEnabled && !movement.vec3_isZero(0.000001)) {
                canMove = this._horizontalMovementCheck(movement, feetPosition, height, fixedFeetPosition, fixedHeight, up, collisionCheckParams, collisionRuntimeParams);
            }

            if (canMove) {
                if (collisionCheckParams.myHorizontalPositionCheckEnabled) {
                    newFixedFeetPosition = fixedFeetPosition.vec3_add(movement, newFixedFeetPosition);
                    newFeetPosition = feetPosition.vec3_add(movement, newFeetPosition);
                    let canStay = this._horizontalPositionCheck(newFeetPosition, height, newFixedFeetPosition, fixedHeight, up, forward, collisionCheckParams, collisionRuntimeParams);
                    if (canStay) {
                        outFixedMovement.vec3_copy(movement);
                    }

                    if (outFixedMovement.vec3_isZero(0.000001)) {
                        outFixedMovement.vec3_zero();
                    }
                } else {
                    outFixedMovement.vec3_copy(movement);
                }
            } else if (!avoidSlidingExtraCheck && collisionCheckParams.mySlidingEnabled && collisionCheckParams.mySlidingHorizontalMovementCheckBetterNormal) {
                this._horizontalCheckBetterSlideNormal(movement, feetPosition, height, fixedFeetPosition, fixedHeight, up, forward, collisionCheckParams, collisionRuntimeParams);
            }
        }

        return outFixedMovement;
    };
}();
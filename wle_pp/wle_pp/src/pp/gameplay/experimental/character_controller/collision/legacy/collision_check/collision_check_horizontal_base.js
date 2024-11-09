import { vec3_create } from "../../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { CollisionCheckSurface } from "./collision_check_surface.js";

export class CollisionCheckHorizontalBase extends CollisionCheckSurface {

    _horizontalCheckRaycast(startPosition, endPosition, movementDirection, up,
        ignoreHitsInsideCollision, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
        feetPosition, fixHitOnCollision,
        collisionCheckParams, collisionRuntimeParams, checkAllHits = false, ignoreHitsInsideCollisionIfObjectToIgnore = false) {
        // Implemented outside class definition
    }

    _ignoreSurfaceAngle(feetPosition, height, movementOrForward, objectsToIgnore, outIgnoredObjects, isGround, isMovementCheck, up, collisionCheckParams, hit, ignoreHitsInsideCollisionIfObjectToIgnore) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

CollisionCheckHorizontalBase.prototype._horizontalCheckRaycast = function () {
    let direction = vec3_create();
    let fixedFeetPosition = vec3_create();
    let fixedHitPosition = vec3_create();
    return function _horizontalCheckRaycast(startPosition, endPosition, movementDirection, up,
        ignoreHitsInsideCollision, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
        feetPosition, fixHitOnCollision,
        collisionCheckParams, collisionRuntimeParams, checkAllHits = false, ignoreHitsInsideCollisionIfObjectToIgnore = false) {

        let origin = startPosition;
        direction = endPosition.vec3_sub(origin, direction);

        if (movementDirection != null && !direction.vec3_isConcordant(movementDirection)) {
            direction.vec3_negate(direction);
            origin = endPosition;
        }

        let distance = direction.vec3_length();
        direction.vec3_normalize(direction);
        let raycastResult = this._raycastAndDebug(origin, direction, distance, ignoreHitsInsideCollision, true, collisionCheckParams, collisionRuntimeParams);

        let isOk = true;

        if (raycastResult.isColliding()) {
            let hitsToControl = checkAllHits ? raycastResult.myHits.length : 1;
            let validHitIndex = 0;
            for (let i = 0; i < hitsToControl; i++) {
                let hit = raycastResult.myHits[i];
                if ((ignoreGroundAngleCallback == null || !ignoreGroundAngleCallback(hit, ignoreHitsInsideCollisionIfObjectToIgnore)) &&
                    (ignoreCeilingAngleCallback == null || !ignoreCeilingAngleCallback(hit, ignoreHitsInsideCollisionIfObjectToIgnore))) {
                    isOk = false;
                    validHitIndex = i;
                    break;
                }
            }

            if (!isOk && validHitIndex > 0) {
                for (let i = 0; i < validHitIndex; i++) {
                    raycastResult.removeHit(0);
                }
            }
        }

        if (!isOk && fixHitOnCollision) {
            let hitPosition = raycastResult.myHits[0].myPosition;

            fixedFeetPosition = feetPosition.vec3_copyComponentAlongAxis(hitPosition, up, fixedFeetPosition);
            fixedHitPosition.vec3_copy(hitPosition);

            let directionOffsetEpsilonValue = 0.0001;
            direction = direction.vec3_componentAlongAxis(up, direction);
            if (!direction.vec3_isZero(0.000001)) {
                // If the check has an up part move the hit a bit on the that direction
                direction.vec3_normalize(direction);
                direction.vec3_scale(directionOffsetEpsilonValue, direction);

                // This offset is a workaround for objects that in the editor are aligned but due to clamp get a bit tilted when in the game
                // and therefore trying an horizontal cast on the vertical hit position could result in hitting the bottom which in theory should be parallel and therefore not possible
                fixedFeetPosition.vec3_add(direction, fixedFeetPosition);
                fixedHitPosition.vec3_add(direction, fixedHitPosition);
            }

            // Move the hit a bit further to prevent miss
            direction = fixedHitPosition.vec3_sub(fixedFeetPosition, direction);
            direction.vec3_normalize(direction);
            direction.vec3_scale(directionOffsetEpsilonValue, direction);
            fixedHitPosition = fixedHitPosition.vec3_add(direction, fixedHitPosition);

            let swapRaycastResult = this._myRaycastResult;
            this._myRaycastResult = this._myFixRaycastResult;

            isOk = this._horizontalCheckRaycast(fixedFeetPosition, fixedHitPosition, null, up,
                false, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                feetPosition, false,
                collisionCheckParams, collisionRuntimeParams);

            if (this._myRaycastResult.isColliding()) {
                this._myFixRaycastResult = swapRaycastResult;
            } else {
                isOk = false;
                this._myRaycastResult = swapRaycastResult;
            }
        }

        return isOk;
    };
}();

CollisionCheckHorizontalBase.prototype._ignoreSurfaceAngle = function () {
    let objectsEqualCallback = (first, second) => first == second;

    let movementDirection = vec3_create();
    let hitDirection = vec3_create();
    let hitMovement = vec3_create();
    let projectAlongAxis = vec3_create();
    return function _ignoreSurfaceAngle(feetPosition, height, movementOrForward, objectsToIgnore, outIgnoredObjects, isGround, isMovementCheck, up, collisionCheckParams, hit, ignoreHitsInsideCollisionIfObjectToIgnore) {
        let isIgnorable = false;

        let surfaceIgnoreHeight = null;
        let groundIgnoreHeight = isMovementCheck ? collisionCheckParams.myHorizontalMovementGroundAngleIgnoreHeight : collisionCheckParams.myHorizontalPositionGroundAngleIgnoreHeight;
        let ceilingIgnoreHeight = isMovementCheck ? collisionCheckParams.myHorizontalMovementCeilingAngleIgnoreHeight : collisionCheckParams.myHorizontalPositionCeilingAngleIgnoreHeight;
        if (isGround && groundIgnoreHeight != null) {
            surfaceIgnoreHeight = Math.pp_clamp(groundIgnoreHeight + 0.0002, 0, height);
        } else if (!isGround && ceilingIgnoreHeight != null) {
            surfaceIgnoreHeight = Math.pp_clamp(height - ceilingIgnoreHeight - 0.0002, 0, height);
        }

        let surfaceIgnoreMaxMovementLeft = null;
        if (isMovementCheck) {
            if (isGround && collisionCheckParams.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft != null) {
                surfaceIgnoreMaxMovementLeft = collisionCheckParams.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft;
            } else if (!isGround && collisionCheckParams.myHorizontalMovementCeilingAngleIgnoreMaxMovementLeft != null) {
                surfaceIgnoreMaxMovementLeft = collisionCheckParams.myHorizontalMovementCeilingAngleIgnoreMaxMovementLeft;
            }
        }

        if (!hit.myInsideCollision) {
            movementDirection = movementOrForward.vec3_normalize(movementDirection);

            let surfaceAngle = hit.myNormal.vec3_angle(up);
            if (!isGround) {
                surfaceAngle = 180 - surfaceAngle;
            }

            if (isGround && collisionCheckParams.myGroundAngleToIgnore > 0 && (surfaceAngle > collisionCheckParams.myGroundAngleToIgnore + 0.0001)) {
                if (collisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle != null &&
                    surfaceAngle <= collisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle + 0.0001) {
                    let perceivedAngle = this.computeSurfacePerceivedAngle(
                        hit.myNormal,
                        movementDirection, up, true);
                    surfaceAngle = Math.abs(perceivedAngle);
                }
            } else if (!isGround && collisionCheckParams.myCeilingAngleToIgnore > 0 && surfaceAngle > collisionCheckParams.myCeilingAngleToIgnore + 0.0001) {
                if (collisionCheckParams.myCeilingAngleToIgnoreWithPerceivedAngle != null &&
                    surfaceAngle <= collisionCheckParams.myCeilingAngleToIgnoreWithPerceivedAngle + 0.0001) {
                    let perceivedAngle = this.computeSurfacePerceivedAngle(
                        hit.myNormal,
                        movementDirection, up, false);
                    surfaceAngle = Math.abs(perceivedAngle);
                }
            }

            if ((isGround && (collisionCheckParams.myGroundAngleToIgnore > 0 && surfaceAngle <= collisionCheckParams.myGroundAngleToIgnore + 0.0001)) ||
                (!isGround && (collisionCheckParams.myCeilingAngleToIgnore > 0 && surfaceAngle <= collisionCheckParams.myCeilingAngleToIgnore + 0.0001))) {
                if (objectsToIgnore == null || objectsToIgnore.pp_hasEqual(hit.myObject, objectsEqualCallback)) {
                    let surfaceHeightCheckOk = true;
                    let maxMovementLeftCheckOk = true;

                    if (surfaceIgnoreHeight != null) {
                        surfaceHeightCheckOk = false;

                        let feetPositionUp = feetPosition.vec3_valueAlongAxis(up);
                        let hitUp = hit.myPosition.vec3_valueAlongAxis(up);
                        let hitHeight = hitUp - feetPositionUp;
                        if ((isGround && hitHeight <= surfaceIgnoreHeight) || (!isGround && hitHeight >= surfaceIgnoreHeight)) {
                            surfaceHeightCheckOk = true;
                        } else {
                            //console.error(hitHeight.toFixed(6));
                        }
                    }

                    if (surfaceHeightCheckOk && isMovementCheck) {
                        if (surfaceIgnoreMaxMovementLeft != null) {
                            let movementLength = movementOrForward.vec3_length();
                            if (movementLength > surfaceIgnoreMaxMovementLeft) {
                                maxMovementLeftCheckOk = false;

                                let hitPosition = hit.myPosition;
                                let halfConeAngle = Math.min(collisionCheckParams.myHalfConeAngle, 90);
                                hitDirection = hitPosition.vec3_sub(feetPosition, hitDirection);

                                if (hitDirection.vec3_isToTheRight(movementDirection, up)) {
                                    projectAlongAxis = movementDirection.vec3_rotateAxis(-halfConeAngle, up, projectAlongAxis);
                                } else {
                                    projectAlongAxis = movementDirection.vec3_rotateAxis(halfConeAngle, up, projectAlongAxis);
                                }

                                hitMovement = hitDirection.vec3_projectOnAxisAlongAxis(movementDirection, projectAlongAxis, hitMovement);

                                let hitMovementLength = hitMovement.vec3_length();
                                let movementLeft = movementLength - hitMovementLength;

                                if (movementLeft <= surfaceIgnoreMaxMovementLeft) {
                                    maxMovementLeftCheckOk = true;
                                } else {
                                    //console.error(movementLeft.toFixed(3));
                                }
                            }
                        }
                    }

                    if (surfaceHeightCheckOk && maxMovementLeftCheckOk) {
                        isIgnorable = true;
                    }
                }
            }
        } else if (ignoreHitsInsideCollisionIfObjectToIgnore) {
            // #TODO When raycast pierce will work, if it gives the normal even when inside check if the angle is ok and only ignore if that's the case
            if (objectsToIgnore == null || objectsToIgnore.pp_hasEqual(hit.myObject, objectsEqualCallback)) {
                isIgnorable = true;
            }
        }

        if (isIgnorable) {
            if (outIgnoredObjects != null) {
                outIgnoredObjects.pp_pushUnique(hit.myObject, objectsEqualCallback);
            }
        }


        return isIgnorable;
    };
}();
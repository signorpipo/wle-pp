import { RaycastHit } from "../../../../../../cauldron/physics/physics_raycast_params.js";
import { vec3_create } from "../../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { CollisionCheckHorizontalBase } from "./collision_check_horizontal_base.js";

export class CollisionCheckHorizontalPosition extends CollisionCheckHorizontalBase {

    _horizontalPositionCheck(originalFeetPosition, originalHeight, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }

    _horizontalPositionHorizontalCheck(feetPosition, checkPositions, heightOffset, up, forward, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }

    _horizontalPositionVerticalCheck(feetPosition, checkPositions, heightOffset, heightStep, verticalDirection, up, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

CollisionCheckHorizontalPosition.prototype._horizontalPositionCheck = function () {
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

    let _localGroundObjectsToIgnore = [];
    let _localCeilingObjectsToIgnore = [];
    let _localGroundCeilingObjectsToIgnore = [];

    let objectsEqualCallback = (first, second) => first == second;

    let heightOffset = vec3_create();
    let heightStep = vec3_create();
    let currentHeightOffset = vec3_create();
    let hitHeightOffset = vec3_create();
    let hitHeightOffsetEpsilon = vec3_create();
    let downwardHeightOffset = vec3_create();
    let downwardHeightStep = vec3_create();

    let verticalDirection = vec3_create();

    let vertilCheckHit = new RaycastHit();

    return function _horizontalPositionCheck(originalFeetPosition, originalHeight, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams) {
        this._myDebugEnabled = collisionCheckParams.myDebugEnabled && collisionCheckParams.myDebugHorizontalPositionEnabled;

        checkPositions.length = 0;
        currentCachedCheckPositionIndex = 0;

        let halfConeAngle = Math.min(collisionCheckParams.myHalfConeAngle, 180);
        let sliceAngle = halfConeAngle / collisionCheckParams.myHalfConeSliceAmount;
        let tempCheckPosition = _localGetCachedCheckPosition();
        checkPositions.push(feetPosition.vec3_add(forward.vec3_scale(collisionCheckParams.myRadius, tempCheckPosition), tempCheckPosition));
        for (let i = 1; i <= collisionCheckParams.myHalfConeSliceAmount; i++) {
            let currentAngle = i * sliceAngle;

            tempCheckPosition = _localGetCachedCheckPosition();
            let radialDirection = forward.vec3_rotateAxis(-currentAngle, up, tempCheckPosition);
            checkPositions.push(feetPosition.vec3_add(radialDirection.vec3_scale(collisionCheckParams.myRadius, radialDirection), radialDirection));

            tempCheckPosition = _localGetCachedCheckPosition();
            radialDirection = forward.vec3_rotateAxis(currentAngle, up, tempCheckPosition);
            checkPositions.push(feetPosition.vec3_add(radialDirection.vec3_scale(collisionCheckParams.myRadius, radialDirection), radialDirection));
        }

        let groundObjectsToIgnore = null;
        let ceilingObjectsToIgnore = null;
        let groundCeilingObjectsToIgnore = null;

        if (collisionCheckParams.myGroundAngleToIgnore > 0) {
            // Gather ground objects to ignore
            groundObjectsToIgnore = _localGroundObjectsToIgnore;
            groundObjectsToIgnore.length = 0;
            groundCeilingObjectsToIgnore = _localGroundCeilingObjectsToIgnore;
            groundCeilingObjectsToIgnore.length = 0;

            let ignoreGroundAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, forward, null, groundObjectsToIgnore, true, false, up, collisionCheckParams);

            let ignoreCeilingAngleCallback = null;
            if (collisionCheckParams.myCeilingAngleToIgnore > 0) {
                ignoreCeilingAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, forward, null, groundCeilingObjectsToIgnore, false, false, up, collisionCheckParams);
            }

            heightOffset.vec3_zero();
            this._horizontalPositionHorizontalCheck(feetPosition, checkPositions, heightOffset, up, forward, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);
        }

        if (collisionCheckParams.myCeilingAngleToIgnore > 0) {
            // Gather ceiling objects to ignore
            if (!collisionRuntimeParams.myIsCollidingHorizontally && collisionCheckParams.myCheckHeight) {
                ceilingObjectsToIgnore = _localCeilingObjectsToIgnore;
                ceilingObjectsToIgnore.length = 0;

                let ignoreGroundAngleCallback = null;
                if (collisionCheckParams.myGroundAngleToIgnore > 0) {
                    ignoreGroundAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, forward, groundObjectsToIgnore, null, true, false, up, collisionCheckParams);
                }

                let ignoreCeilingAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, forward, null, ceilingObjectsToIgnore, false, false, up, collisionCheckParams);

                heightOffset = up.vec3_scale(height, heightOffset);
                this._horizontalPositionHorizontalCheck(feetPosition, checkPositions, heightOffset, up, forward, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);
            }
        }

        if (!collisionRuntimeParams.myIsCollidingHorizontally) {

            let groundCeilingCheckIsFine = true;

            if (groundCeilingObjectsToIgnore != null) {
                // Check that the ceiling objects ignored by the ground are the correct ones, that is the one ignored by the upper check
                for (let object of groundCeilingObjectsToIgnore) {
                    if (!ceilingObjectsToIgnore.pp_hasEqual(object, objectsEqualCallback)) {
                        groundCeilingCheckIsFine = false;
                        break;
                    }
                }
            }

            let ignoreGroundAngleCallback = null;
            let ignoreCeilingAngleCallback = null;

            if (collisionCheckParams.myGroundAngleToIgnore > 0) {
                ignoreGroundAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, forward, groundObjectsToIgnore, null, true, false, up, collisionCheckParams);
            }

            if (collisionCheckParams.myCeilingAngleToIgnore > 0) {
                ignoreCeilingAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, forward, ceilingObjectsToIgnore, null, false, false, up, collisionCheckParams);
            }

            let heightStepAmount = 0;
            if (collisionCheckParams.myCheckHeight && collisionCheckParams.myHeightCheckStepAmountPosition > 0 && height > 0) {
                heightStepAmount = collisionCheckParams.myHeightCheckStepAmountPosition;
                up.vec3_scale(height / heightStepAmount, heightStep);
            }

            for (let i = 0; i <= heightStepAmount; i++) {
                currentHeightOffset = heightStep.vec3_scale(i, currentHeightOffset);

                // We can skip the ground check since we have already done that, but if there was an error do it again with the proper set of objects to ignore
                // The ceiling check can always be ignored, it used the proper ground objects already
                if (collisionCheckParams.myCheckHeightTopPosition || i == 0) {
                    if ((i != 0 && i != heightStepAmount) ||
                        (i == 0 && !groundCeilingCheckIsFine) ||
                        (i == 0 && collisionCheckParams.myGroundAngleToIgnore == 0) ||
                        (i != 0 && i == heightStepAmount && collisionCheckParams.myCeilingAngleToIgnore == 0)) {
                        this._horizontalPositionHorizontalCheck(feetPosition, checkPositions, currentHeightOffset, up, forward, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);

                        if (collisionRuntimeParams.myIsCollidingHorizontally) {
                            break;
                        }
                    }
                }

                if (i > 0) {
                    if (collisionCheckParams.myCheckHeightVerticalPosition) {
                        // This offset is a workaround for objects that in the editor are aligned but due to clamp get a bit tilted when in the game
                        // and therefore trying an horizontal cast on the vertical hit position could result in hitting the bottom which in theory should be parallel and therefore not possible
                        let hitHeightOffsetEpsilonValue = 0.0001;

                        if (collisionCheckParams.myHorizontalPositionCheckVerticalDirectionType == 0 || collisionCheckParams.myHorizontalPositionCheckVerticalDirectionType == 2) {
                            verticalDirection.vec3_copy(up);
                            this._horizontalPositionVerticalCheck(feetPosition, checkPositions, currentHeightOffset, heightStep, verticalDirection, up, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);

                            if (collisionRuntimeParams.myIsCollidingHorizontally && collisionCheckParams.myCheckHeightConeOnCollision) {
                                hitHeightOffset = collisionRuntimeParams.myHorizontalCollisionHit.myPosition.vec3_sub(feetPosition, hitHeightOffset).vec3_componentAlongAxis(up, hitHeightOffset);
                                hitHeightOffset.vec3_add(verticalDirection.vec3_scale(hitHeightOffsetEpsilonValue, hitHeightOffsetEpsilon), hitHeightOffset);

                                collisionRuntimeParams.myIsCollidingHorizontally = false;
                                if (collisionCheckParams.myCheckHeightConeOnCollisionKeepHit) {
                                    vertilCheckHit.copy(collisionRuntimeParams.myHorizontalCollisionHit);
                                }
                                collisionRuntimeParams.myHorizontalCollisionHit.reset();
                                this._horizontalPositionHorizontalCheck(feetPosition, checkPositions, hitHeightOffset, up, forward, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);

                                if (collisionRuntimeParams.myIsCollidingHorizontally) {
                                    break;
                                } else if (collisionCheckParams.myCheckHeightConeOnCollisionKeepHit) {
                                    collisionRuntimeParams.myIsCollidingHorizontally = true;
                                    collisionRuntimeParams.myHorizontalCollisionHit.copy(vertilCheckHit);
                                    break;
                                }
                            }
                        }

                        if (!collisionRuntimeParams.myIsCollidingHorizontally) {
                            if (collisionCheckParams.myHorizontalPositionCheckVerticalDirectionType == 1 || collisionCheckParams.myHorizontalPositionCheckVerticalDirectionType == 2) {
                                verticalDirection = up.vec3_negate(verticalDirection);
                                downwardHeightOffset = currentHeightOffset.vec3_sub(heightStep, downwardHeightOffset);
                                downwardHeightStep = heightStep.vec3_negate(downwardHeightStep);
                                this._horizontalPositionVerticalCheck(feetPosition, checkPositions, downwardHeightOffset, downwardHeightStep, verticalDirection, up, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);
                            }

                            if (collisionRuntimeParams.myIsCollidingHorizontally && collisionCheckParams.myCheckHeightConeOnCollision) {
                                hitHeightOffset = collisionRuntimeParams.myHorizontalCollisionHit.myPosition.vec3_sub(feetPosition, hitHeightOffset).vec3_componentAlongAxis(up, hitHeightOffset);
                                hitHeightOffset.vec3_add(verticalDirection.vec3_scale(hitHeightOffsetEpsilonValue, hitHeightOffsetEpsilon), hitHeightOffset);

                                collisionRuntimeParams.myIsCollidingHorizontally = false;
                                if (collisionCheckParams.myCheckHeightConeOnCollisionKeepHit) {
                                    vertilCheckHit.copy(collisionRuntimeParams.myHorizontalCollisionHit);
                                }
                                collisionRuntimeParams.myHorizontalCollisionHit.reset();
                                this._horizontalPositionHorizontalCheck(feetPosition, checkPositions, hitHeightOffset, up, forward, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);

                                if (collisionRuntimeParams.myIsCollidingHorizontally) {
                                    break;
                                } else if (collisionCheckParams.myCheckHeightConeOnCollisionKeepHit) {
                                    collisionRuntimeParams.myIsCollidingHorizontally = true;
                                    collisionRuntimeParams.myHorizontalCollisionHit.copy(vertilCheckHit);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        return !collisionRuntimeParams.myIsCollidingHorizontally;
    };
}();

CollisionCheckHorizontalPosition.prototype._horizontalPositionHorizontalCheck = function () {
    let basePosition = vec3_create();
    let forwardNegate = vec3_create();
    let currentRadialPosition = vec3_create();
    let previousRadialPosition = vec3_create();
    return function _horizontalPositionHorizontalCheck(feetPosition, checkPositions, heightOffset, up, forward, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams) {
        let isHorizontalCheckOk = true;

        basePosition = feetPosition.vec3_add(heightOffset, basePosition);

        let halfRadialPositions = Math.floor(checkPositions.length / 2) + 1;
        for (let j = 0; j < halfRadialPositions; j++) {
            if (j > 0) {
                let leftIndex = Math.max(0, j * 2);
                let rightIndex = Math.max(0, (j * 2 - 1));
                let leftAndRightEqual = checkPositions[leftIndex].vec_equals(checkPositions[rightIndex], 0.000001);

                if (collisionCheckParams.myCheckConeBorder) {
                    for (let r = 0; r < 2; r++) {
                        let currentIndex = r == 0 ? leftIndex : rightIndex;

                        currentRadialPosition = checkPositions[currentIndex].vec3_add(heightOffset, currentRadialPosition);

                        let previousIndex = Math.max(0, currentIndex - 2);
                        previousRadialPosition = checkPositions[previousIndex].vec3_add(heightOffset, previousRadialPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(previousRadialPosition, currentRadialPosition, forward.vec3_negate(forwardNegate), up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }
                }

                if (collisionCheckParams.myCheckConeRay && isHorizontalCheckOk) {
                    for (let r = 0; r < 2; r++) {
                        if (r == 1 && leftAndRightEqual) {
                            break;
                        }

                        let currentIndex = r == 0 ? leftIndex : rightIndex;

                        currentRadialPosition = checkPositions[currentIndex].vec3_add(heightOffset, currentRadialPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(basePosition, currentRadialPosition, null, up,
                            false, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, false,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }
                }
            } else {
                if (collisionCheckParams.myCheckConeRay) {
                    currentRadialPosition = checkPositions[j].vec3_add(heightOffset, currentRadialPosition);

                    isHorizontalCheckOk = this._horizontalCheckRaycast(basePosition, currentRadialPosition, null, up,
                        false, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                        feetPosition, false,
                        collisionCheckParams, collisionRuntimeParams);

                    if (!isHorizontalCheckOk) break;
                }
            }

            if (!isHorizontalCheckOk) {
                break;
            }
        }

        if (!isHorizontalCheckOk) {
            collisionRuntimeParams.myIsCollidingHorizontally = true;
            collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
        }

        return isHorizontalCheckOk;
    };
}();

CollisionCheckHorizontalPosition.prototype._horizontalPositionVerticalCheck = function () {
    let basePosition = vec3_create();
    let previousBasePosition = vec3_create();
    let currentRadialPosition = vec3_create();
    let previousRadialPosition = vec3_create();
    let previousCurrentRadialPosition = vec3_create();
    let previousPreviousRadialPosition = vec3_create();
    return function _horizontalPositionVerticalCheck(feetPosition, checkPositions, heightOffset, heightStep, verticalDirection, up, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams) {
        let isHorizontalCheckOk = true;

        basePosition = feetPosition.vec3_add(heightOffset, basePosition);
        previousBasePosition = basePosition.vec3_sub(heightStep, previousBasePosition);

        for (let j = 0; j <= checkPositions.length; j++) {
            let previousCheckPositionIsEqual = false;

            if (j == checkPositions.length) {
                currentRadialPosition.vec3_copy(basePosition);
                previousRadialPosition.vec3_copy(previousBasePosition);
            } else {
                currentRadialPosition = checkPositions[j].vec3_add(heightOffset, currentRadialPosition);
                previousRadialPosition = currentRadialPosition.vec3_sub(heightStep, previousRadialPosition);

                if (j > 0) {
                    previousCheckPositionIsEqual = checkPositions[j].vec_equals(checkPositions[j - 1], 0.000001);
                }
            }

            if (collisionCheckParams.myCheckVerticalStraight && !previousCheckPositionIsEqual) {
                isHorizontalCheckOk = this._horizontalCheckRaycast(previousRadialPosition, currentRadialPosition, null, up,
                    collisionCheckParams.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                    feetPosition, true,
                    collisionCheckParams, collisionRuntimeParams, true, true);

                if (!isHorizontalCheckOk) {
                    if (!collisionRuntimeParams.myIsCollidingHorizontally) {
                        collisionRuntimeParams.myIsCollidingHorizontally = true;
                        collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                    } else if (this._myRaycastResult.myHits[0].myPosition.vec3_isFartherAlongAxis(collisionRuntimeParams.myHorizontalCollisionHit.myPosition, verticalDirection)) {
                        collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                    }

                    if (!collisionCheckParams.myCheckVerticalSearchFartherVerticalHit) {
                        break;
                    }
                }
            }

            if (j < checkPositions.length) {
                if ((collisionCheckParams.myCheckVerticalDiagonalRayOutward ||
                    (collisionCheckParams.myCheckVerticalDiagonalBorderRayOutward && (j == checkPositions.length - 2 || j == checkPositions.length - 1))) &&
                    !previousCheckPositionIsEqual) {
                    isHorizontalCheckOk = this._horizontalCheckRaycast(previousBasePosition, currentRadialPosition, null, up,
                        collisionCheckParams.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                        feetPosition, true,
                        collisionCheckParams, collisionRuntimeParams, true, true);

                    if (!isHorizontalCheckOk) {
                        if (!collisionRuntimeParams.myIsCollidingHorizontally) {
                            collisionRuntimeParams.myIsCollidingHorizontally = true;
                            collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                        } else if (this._myRaycastResult.myHits[0].myPosition.vec3_isFartherAlongAxis(collisionRuntimeParams.myHorizontalCollisionHit.myPosition, verticalDirection)) {
                            collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                        }

                        if (!collisionCheckParams.myCheckVerticalSearchFartherVerticalHit) {
                            break;
                        }
                    }
                }

                if ((collisionCheckParams.myCheckVerticalDiagonalRayInward ||
                    (collisionCheckParams.myCheckVerticalDiagonalBorderRayInward && (j == checkPositions.length - 2 || j == checkPositions.length - 1))) &&
                    !previousCheckPositionIsEqual) {
                    isHorizontalCheckOk = this._horizontalCheckRaycast(previousRadialPosition, basePosition, null, up,
                        collisionCheckParams.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                        feetPosition, true,
                        collisionCheckParams, collisionRuntimeParams, true, true);

                    if (!isHorizontalCheckOk) {
                        if (!collisionRuntimeParams.myIsCollidingHorizontally) {
                            collisionRuntimeParams.myIsCollidingHorizontally = true;
                            collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                        } else if (this._myRaycastResult.myHits[0].myPosition.vec3_isFartherAlongAxis(collisionRuntimeParams.myHorizontalCollisionHit.myPosition, verticalDirection)) {
                            collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                        }

                        if (!collisionCheckParams.myCheckVerticalSearchFartherVerticalHit) {
                            break;
                        }
                    }
                }

                if (j > 0) {
                    if (collisionCheckParams.myCheckVerticalDiagonalBorderOutward || collisionCheckParams.myCheckVerticalDiagonalBorderInward) {
                        let previousIndex = Math.max(0, j - 2);
                        previousCurrentRadialPosition = checkPositions[previousIndex].vec3_add(heightOffset, previousCurrentRadialPosition);
                        previousPreviousRadialPosition = previousCurrentRadialPosition.vec3_sub(heightStep, previousPreviousRadialPosition);

                        if (collisionCheckParams.myCheckVerticalDiagonalBorderOutward) {
                            isHorizontalCheckOk = this._horizontalCheckRaycast(previousPreviousRadialPosition, currentRadialPosition, null, up,
                                collisionCheckParams.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                                feetPosition, true,
                                collisionCheckParams, collisionRuntimeParams, true, true);

                            if (!isHorizontalCheckOk) {
                                if (!collisionRuntimeParams.myIsCollidingHorizontally) {
                                    collisionRuntimeParams.myIsCollidingHorizontally = true;
                                    collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                                } else if (this._myRaycastResult.myHits[0].myPosition.vec3_isFartherAlongAxis(collisionRuntimeParams.myHorizontalCollisionHit.myPosition, verticalDirection)) {
                                    collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                                }

                                if (!collisionCheckParams.myCheckVerticalSearchFartherVerticalHit) {
                                    break;
                                }
                            }
                        }

                        if (collisionCheckParams.myCheckVerticalDiagonalBorderInward) {
                            isHorizontalCheckOk = this._horizontalCheckRaycast(previousRadialPosition, previousCurrentRadialPosition, null, up,
                                collisionCheckParams.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                                feetPosition, true,
                                collisionCheckParams, collisionRuntimeParams, true, true);

                            if (!isHorizontalCheckOk) {
                                if (!collisionRuntimeParams.myIsCollidingHorizontally) {
                                    collisionRuntimeParams.myIsCollidingHorizontally = true;
                                    collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                                } else if (this._myRaycastResult.myHits[0].myPosition.vec3_isFartherAlongAxis(collisionRuntimeParams.myHorizontalCollisionHit.myPosition, verticalDirection)) {
                                    collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                                }

                                if (!collisionCheckParams.myCheckVerticalSearchFartherVerticalHit) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        return !collisionRuntimeParams.myIsCollidingHorizontally;
    };
}();
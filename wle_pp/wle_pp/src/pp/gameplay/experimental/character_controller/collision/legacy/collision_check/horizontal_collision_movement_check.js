import { vec3_create } from "../../../../../../plugin/js/extensions/array_extension";
import { CollisionCheck } from "./collision_check";

CollisionCheck.prototype._horizontalMovementCheck = function () {
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

    let objectsEqualCallback = (first, second) => first.pp_equals(second);

    let movementDirection = vec3_create();
    let heightOffset = vec3_create();
    let heightStep = vec3_create();
    let currentHeightOffset = vec3_create();
    let leftRadialDirection = vec3_create();
    let rightRadialDirection = vec3_create();
    return function _horizontalMovementCheck(movement, originalFeetPosition, originalHeight, feetPosition, height, up, collisionCheckParams, collisionRuntimeParams) {
        // #TODO Add a flag in the params to specify if u want to allow movement inside collision (to hope that it will end up in a non collision position)
        // Also vertical check should check all hits like the position check
        // For now is ok as it is, the movement check is not as important and could also be disabled it the movement per frame is very small

        this._myDebugEnabled = collisionCheckParams.myDebugEnabled && collisionCheckParams.myDebugHorizontalMovementEnabled;

        let halfConeAngle = Math.min(collisionCheckParams.myHalfConeAngle, 90);
        movementDirection = movement.vec3_normalize(movementDirection);

        checkPositions.length = 0;
        currentCachedCheckPositionIndex = 0;

        let steplength = collisionCheckParams.myRadius / collisionCheckParams.myHorizontalMovementRadialStepAmount;

        {
            let tempCheckPosition = _localGetCachedCheckPosition();
            tempCheckPosition.vec3_copy(feetPosition);
            checkPositions.push(tempCheckPosition);
        }

        {
            leftRadialDirection = movementDirection.vec3_rotateAxis(halfConeAngle, up, leftRadialDirection);
            rightRadialDirection = movementDirection.vec3_rotateAxis(-halfConeAngle, up, rightRadialDirection);
            for (let i = 1; i <= collisionCheckParams.myHorizontalMovementRadialStepAmount; i++) {
                // Left
                {
                    let currentStep = i * steplength;
                    let tempCheckPosition = _localGetCachedCheckPosition();
                    let currentRadialPosition = leftRadialDirection.vec3_scale(currentStep, tempCheckPosition);
                    let currentCheckPosition = currentRadialPosition.vec3_add(feetPosition, currentRadialPosition);
                    checkPositions.push(currentCheckPosition);
                }

                // Right
                {
                    let currentStep = i * steplength;
                    let tempCheckPosition = _localGetCachedCheckPosition();
                    let currentRadialPosition = rightRadialDirection.vec3_scale(currentStep, tempCheckPosition);
                    let currentCheckPosition = currentRadialPosition.vec3_add(feetPosition, currentRadialPosition);
                    checkPositions.push(currentCheckPosition);
                }
            }
        }

        // If result is inside a collision it's ignored, so that at least you can exit it before seeing if the new position works now

        let groundObjectsToIgnore = null;
        let ceilingObjectsToIgnore = null;
        let groundCeilingObjectsToIgnore = null;

        if (collisionCheckParams.myGroundAngleToIgnore > 0) {
            // Gather ground objects to ignore
            groundObjectsToIgnore = _localGroundObjectsToIgnore;
            groundObjectsToIgnore.length = 0;
            groundCeilingObjectsToIgnore = _localGroundCeilingObjectsToIgnore;
            groundCeilingObjectsToIgnore.length = 0;

            let ignoreGroundAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, movement, null, groundObjectsToIgnore, true, true, up, collisionCheckParams);

            let ignoreCeilingAngleCallback = null;
            if (collisionCheckParams.myCeilingAngleToIgnore > 0) {
                ignoreCeilingAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, movement, null, groundCeilingObjectsToIgnore, false, true, up, collisionCheckParams);
            }

            heightOffset.vec3_zero();
            this._horizontalMovementHorizontalCheck(movement, feetPosition, checkPositions, heightOffset, up, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);
        }

        if (collisionCheckParams.myCeilingAngleToIgnore > 0) {
            // Gather ceiling objects to ignore
            if (!collisionRuntimeParams.myIsCollidingHorizontally && collisionCheckParams.myCheckHeight) {
                ceilingObjectsToIgnore = _localCeilingObjectsToIgnore;
                ceilingObjectsToIgnore.length = 0;

                let ignoreGroundAngleCallback = null;
                if (collisionCheckParams.myGroundAngleToIgnore > 0) {
                    ignoreGroundAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, movement, groundObjectsToIgnore, null, true, true, up, collisionCheckParams);
                }

                let ignoreCeilingAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, movement, null, ceilingObjectsToIgnore, false, true, up, collisionCheckParams);

                heightOffset = up.vec3_scale(height, heightOffset);
                this._horizontalMovementHorizontalCheck(movement, feetPosition, checkPositions, heightOffset, up, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);
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
                ignoreGroundAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, movement, groundObjectsToIgnore, null, true, true, up, collisionCheckParams);
            }

            if (collisionCheckParams.myCeilingAngleToIgnore > 0) {
                ignoreCeilingAngleCallback = this._ignoreSurfaceAngle.bind(this, originalFeetPosition, originalHeight, movement, ceilingObjectsToIgnore, null, false, true, up, collisionCheckParams);
            }

            let heightStepAmount = 0;
            if (collisionCheckParams.myCheckHeight && collisionCheckParams.myHeightCheckStepAmountMovement > 0 && height > 0.000001) {
                heightStepAmount = collisionCheckParams.myHeightCheckStepAmountMovement;
                heightStep = up.vec3_scale(height / heightStepAmount, heightStep);
            }

            for (let i = 0; i <= heightStepAmount; i++) {
                currentHeightOffset = heightStep.vec3_scale(i, currentHeightOffset);

                // We can skip the ground check since we have already done that, but if there was an error do it again with the proper set of objects to ignore
                // The ceiling check can always be ignored, it used the proper ground objects already
                if (collisionCheckParams.myCheckHeightTopMovement || i == 0) {
                    if ((i != 0 && i != heightStepAmount) ||
                        (i == 0 && !groundCeilingCheckIsFine) ||
                        (i == 0 && collisionCheckParams.myGroundAngleToIgnore == 0) ||
                        (i == heightStepAmount && collisionCheckParams.myCeilingAngleToIgnore == 0)) {
                        this._horizontalMovementHorizontalCheck(movement, feetPosition, checkPositions, currentHeightOffset, up, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);

                        if (collisionRuntimeParams.myIsCollidingHorizontally) {
                            break;
                        }
                    }
                }

                if (i > 0) {
                    if (collisionCheckParams.myCheckHeightVerticalMovement) {
                        this._horizontalMovementVerticalCheck(movement, feetPosition, checkPositions, currentHeightOffset, heightStep, up, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams);
                    }

                    if (collisionRuntimeParams.myIsCollidingHorizontally) {
                        break;
                    }
                }
            }
        }

        return !collisionRuntimeParams.myIsCollidingHorizontally;
    };
}();

CollisionCheck.prototype._horizontalMovementVerticalCheck = function () {
    let movementStep = vec3_create();
    let movementDirection = vec3_create();
    let firstPosition = vec3_create();
    let secondPosition = vec3_create();
    let firstMovementPosition = vec3_create();
    let secondMovementPosition = vec3_create();
    let firstHeightPosition = vec3_create();
    let secondHeightPosition = vec3_create();
    let firstHeightMovementPosition = vec3_create();
    let secondHeightMovementPosition = vec3_create();
    return function _horizontalMovementVerticalCheck(movement, feetPosition, checkPositions, heightOffset, heightStep, up, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams) {
        let isHorizontalCheckOk = true;

        let movementStepAmount = 1;
        movementStep.vec3_copy(movement);

        if (collisionCheckParams.myHorizontalMovementStepEnabled) {
            movementStepAmount = Math.max(1, Math.ceil(movement.vec3_length() / collisionCheckParams.myHorizontalMovementStepMaxLength));
            movement.vec3_scale(1 / movementStepAmount, movementStep);
        }

        movementDirection = movement.vec3_normalize(movementDirection);

        for (let m = 0; m < movementStepAmount; m++) {
            for (let j = 0; j < checkPositions.length; j++) {
                firstPosition = checkPositions[j].vec3_add(movementStep.vec3_scale(m, firstPosition), firstPosition).vec3_add(heightOffset, firstPosition);

                if (j > 0) {
                    let secondIndex = Math.max(0, j - 2);
                    secondPosition = checkPositions[secondIndex].vec3_add(movementStep.vec3_scale(m, secondPosition), secondPosition).vec3_add(heightOffset, secondPosition);

                    if (collisionCheckParams.myHorizontalMovementCheckVerticalDiagonalUpwardOutward) {
                        firstMovementPosition = firstPosition.vec3_add(movementStep, firstMovementPosition);
                        secondHeightPosition = secondPosition.vec3_sub(heightStep, secondHeightPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(secondHeightPosition, firstMovementPosition, movementDirection, up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }

                    if (collisionCheckParams.myHorizontalMovementCheckVerticalDiagonalUpwardInward) {
                        secondMovementPosition = secondPosition.vec3_add(movementStep, secondMovementPosition);
                        firstHeightPosition = firstPosition.vec3_sub(heightStep, firstHeightPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(firstHeightPosition, secondMovementPosition, movementDirection, up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }

                    if (collisionCheckParams.myHorizontalMovementCheckVerticalDiagonalDownwardOutward) {
                        firstHeightMovementPosition = firstPosition.vec3_add(movementStep, firstHeightMovementPosition);
                        firstHeightMovementPosition = firstHeightMovementPosition.vec3_sub(heightStep, firstHeightMovementPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(secondPosition, firstHeightMovementPosition, movementDirection, up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }

                    if (collisionCheckParams.myHorizontalMovementCheckVerticalDiagonalDownwardInward) {
                        secondHeightMovementPosition = secondPosition.vec3_add(movementStep, secondHeightMovementPosition);
                        secondHeightMovementPosition = secondHeightMovementPosition.vec3_sub(heightStep, secondHeightMovementPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(firstPosition, secondHeightMovementPosition, movementDirection, up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }

                    if (m == 0) {
                        if (collisionCheckParams.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalOutward) {
                            secondHeightPosition = secondPosition.vec3_sub(heightStep, secondHeightPosition);

                            isHorizontalCheckOk = this._horizontalCheckRaycast(secondHeightPosition, firstPosition, movementDirection, up,
                                true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                                feetPosition, true,
                                collisionCheckParams, collisionRuntimeParams);

                            if (!isHorizontalCheckOk) break;
                        }

                        if (collisionCheckParams.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalInward) {
                            let firstHeightPosition = firstPosition.vec3_sub(heightStep);

                            isHorizontalCheckOk = this._horizontalCheckRaycast(firstHeightPosition, secondPosition, movementDirection, up,
                                true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                                feetPosition, true,
                                collisionCheckParams, collisionRuntimeParams);

                            if (!isHorizontalCheckOk) break;
                        }
                    }

                    if (collisionCheckParams.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalOutward) {
                        firstMovementPosition = firstPosition.vec3_add(movementStep, firstMovementPosition);
                        secondHeightMovementPosition = secondPosition.vec3_sub(heightStep, secondHeightMovementPosition).vec3_add(movementStep, secondHeightMovementPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(secondHeightMovementPosition, firstMovementPosition, movementDirection, up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }

                    if (collisionCheckParams.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalInward) {
                        secondMovementPosition = secondPosition.vec3_add(movementStep, secondMovementPosition);
                        firstHeightMovementPosition = firstPosition.vec3_sub(heightStep, firstHeightMovementPosition).vec3_add(movementStep, firstHeightMovementPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(firstHeightMovementPosition, secondMovementPosition, movementDirection, up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }
                }

                if (collisionCheckParams.myHorizontalMovementCheckVerticalStraight ||
                    (collisionCheckParams.myHorizontalMovementHorizontalStraightCentralCheckEnabled && j == 0)) {
                    if (m == 0) {
                        firstHeightPosition = firstPosition.vec3_sub(heightStep, firstHeightPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(firstHeightPosition, firstPosition, movementDirection, up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }

                    {
                        firstMovementPosition = firstPosition.vec3_add(movementStep, firstMovementPosition);
                        firstHeightMovementPosition = firstMovementPosition.vec3_sub(heightStep, firstHeightMovementPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(firstHeightMovementPosition, firstMovementPosition, movementDirection, up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }
                }

                if (collisionCheckParams.myHorizontalMovementCheckVerticalStraightDiagonalUpward ||
                    (collisionCheckParams.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled && j == 0)) {
                    firstMovementPosition = firstPosition.vec3_add(movementStep, firstMovementPosition);
                    firstHeightPosition = firstPosition.vec3_sub(heightStep, firstHeightPosition);

                    isHorizontalCheckOk = this._horizontalCheckRaycast(firstHeightPosition, firstMovementPosition, movementDirection, up,
                        true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                        feetPosition, true,
                        collisionCheckParams, collisionRuntimeParams);

                    if (!isHorizontalCheckOk) break;
                }

                if (collisionCheckParams.myHorizontalMovementCheckVerticalStraightDiagonalDownward ||
                    (collisionCheckParams.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled && j == 0)) {
                    firstHeightMovementPosition = firstPosition.vec3_sub(heightStep, firstHeightMovementPosition).vec3_add(movementStep, firstHeightMovementPosition);

                    isHorizontalCheckOk = this._horizontalCheckRaycast(firstPosition, firstHeightMovementPosition, movementDirection, up,
                        true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                        feetPosition, true,
                        collisionCheckParams, collisionRuntimeParams);

                    if (!isHorizontalCheckOk) break;
                }

                if (!isHorizontalCheckOk) {
                    collisionRuntimeParams.myIsCollidingHorizontally = true;
                    collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                    break;
                }
            }
        }

        return isHorizontalCheckOk;
    };
}();

CollisionCheck.prototype._horizontalMovementHorizontalCheck = function () {
    let movementStep = vec3_create();
    let movementDirection = vec3_create();
    let firstPosition = vec3_create();
    let secondPosition = vec3_create();
    let firstMovementPosition = vec3_create();
    let secondMovementPosition = vec3_create();
    return function _horizontalMovementHorizontalCheck(movement, feetPosition, checkPositions, heightOffset, up, ignoreGroundAngleCallback, ignoreCeilingAngleCallback, collisionCheckParams, collisionRuntimeParams) {
        let isHorizontalCheckOk = true;

        let movementStepAmount = 1;
        movementStep.vec3_copy(movement);

        if (collisionCheckParams.myHorizontalMovementStepEnabled) {
            movementStepAmount = Math.max(1, Math.ceil(movement.vec3_length() / collisionCheckParams.myHorizontalMovementStepMaxLength));
            movement.vec3_scale(1 / movementStepAmount, movementStep);
        }

        movementDirection = movement.vec3_normalize(movementDirection);

        for (let m = 0; m < movementStepAmount; m++) {
            for (let j = 0; j < checkPositions.length; j++) {
                firstPosition = checkPositions[j].vec3_add(movementStep.vec3_scale(m, firstPosition), firstPosition).vec3_add(heightOffset, firstPosition);

                if (j > 0) {
                    let secondIndex = Math.max(0, j - 2);
                    secondPosition = checkPositions[secondIndex].vec3_add(movementStep.vec3_scale(m, secondPosition), secondPosition).vec3_add(heightOffset, secondPosition);

                    if (collisionCheckParams.myHorizontalMovementCheckDiagonalOutward) {
                        firstMovementPosition = firstPosition.vec3_add(movementStep, firstMovementPosition);

                        // #TODO Ignore hits if inside could be a paramter, so you can specify if u want to be able to exit from a collision
                        isHorizontalCheckOk = this._horizontalCheckRaycast(secondPosition, firstMovementPosition, movementDirection, up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }

                    if (collisionCheckParams.myHorizontalMovementCheckDiagonalInward) {
                        secondMovementPosition = secondPosition.vec3_add(movementStep, secondMovementPosition);

                        isHorizontalCheckOk = this._horizontalCheckRaycast(firstPosition, secondMovementPosition, movementDirection, up,
                            true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                            feetPosition, true,
                            collisionCheckParams, collisionRuntimeParams);

                        if (!isHorizontalCheckOk) break;
                    }

                    if (collisionCheckParams.myHorizontalMovementCheckHorizontalBorder) {
                        if (m == 0) {
                            isHorizontalCheckOk = this._horizontalCheckRaycast(secondPosition, firstPosition, movementDirection, up,
                                true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                                feetPosition, true,
                                collisionCheckParams, collisionRuntimeParams);

                            if (!isHorizontalCheckOk) break;
                        }

                        {
                            firstMovementPosition = firstPosition.vec3_add(movementStep, firstMovementPosition);
                            secondMovementPosition = secondPosition.vec3_add(movementStep, secondMovementPosition);

                            isHorizontalCheckOk = this._horizontalCheckRaycast(secondMovementPosition, firstMovementPosition, movementDirection, up,
                                true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                                feetPosition, true,
                                collisionCheckParams, collisionRuntimeParams);

                            if (!isHorizontalCheckOk) break;
                        }
                    }
                }

                if (collisionCheckParams.myHorizontalMovementCheckStraight ||
                    (collisionCheckParams.myHorizontalMovementVerticalStraightCentralCheckEnabled && j == 0)) {
                    firstMovementPosition = firstPosition.vec3_add(movementStep, firstMovementPosition);

                    isHorizontalCheckOk = this._horizontalCheckRaycast(firstPosition, firstMovementPosition, null, up,
                        true, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                        feetPosition, true,
                        collisionCheckParams, collisionRuntimeParams);

                    if (!isHorizontalCheckOk) break;
                }
            }

            if (!isHorizontalCheckOk) {
                collisionRuntimeParams.myIsCollidingHorizontally = true;
                collisionRuntimeParams.myHorizontalCollisionHit.copy(this._myRaycastResult.myHits[0]);
                break;
            }
        }

        return isHorizontalCheckOk;
    };
}();



Object.defineProperty(CollisionCheck.prototype, "_horizontalMovementCheck", { enumerable: false });
Object.defineProperty(CollisionCheck.prototype, "_horizontalMovementVerticalCheck", { enumerable: false });
Object.defineProperty(CollisionCheck.prototype, "_horizontalMovementHorizontalCheck", { enumerable: false });
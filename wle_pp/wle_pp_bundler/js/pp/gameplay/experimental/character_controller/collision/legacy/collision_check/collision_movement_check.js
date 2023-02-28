PP.CollisionCheck.prototype._move = function () {
    let transformUp = PP.vec3_create();
    let transformForward = PP.vec3_create();
    let feetPosition = PP.vec3_create();

    let transformOffsetLocalQuat = PP.quat2_create();
    let offsetTransformQuat = PP.quat2_create();

    let horizontalMovement = PP.vec3_create();
    let verticalMovement = PP.vec3_create();

    let movementStep = PP.vec3_create();
    let currentMovementStep = PP.vec3_create();
    let movementChecked = PP.vec3_create();
    let fixedMovement = PP.vec3_create();
    let newFeetPosition = PP.vec3_create();
    let fixedMovementStep = PP.vec3_create();

    let previousCollisionRuntimeParams = new PP.CollisionRuntimeParams();
    let previousFixedMovement = PP.vec3_create();
    let previousMovementChecked = PP.vec3_create();
    return function _move(movement, transformQuat, collisionCheckParams, collisionRuntimeParams) {
        //return PP.vec3_create();
        //movement = PP.vec3_create(0, 0, -1);

        transformOffsetLocalQuat.quat2_setPositionRotationQuat(collisionCheckParams.myPositionOffsetLocal, collisionCheckParams.myRotationOffsetLocalQuat);
        offsetTransformQuat = transformOffsetLocalQuat.quat2_toWorld(transformQuat, offsetTransformQuat);
        if (transformQuat.vec_equals(offsetTransformQuat, 0.00001)) {
            offsetTransformQuat.quat2_copy(transformQuat);
        }

        transformUp = offsetTransformQuat.quat2_getUp(transformUp);
        transformForward = offsetTransformQuat.quat2_getForward(transformForward);
        feetPosition = offsetTransformQuat.quat2_getPosition(feetPosition);

        let height = collisionCheckParams.myHeight;
        height = height - 0.00001; // this makes it easier to setup things at the same exact height of a character so that it can go under it
        if (height < 0.00001) {
            height = 0;
        }
        //height = 1.75;

        horizontalMovement = movement.vec3_removeComponentAlongAxis(transformUp, horizontalMovement);
        verticalMovement = movement.vec3_componentAlongAxis(transformUp, verticalMovement);
        //feetPosition = feetPosition.vec3_add(horizontalMovement.vec3_normalize().vec3_scale(0.5));
        //height = height / 2;
        //horizontalMovement.vec3_normalize(horizontalMovement).vec3_scale(0.3, horizontalMovement); movement = horizontalMovement.vec3_add(verticalMovement);

        let movementStepAmount = 1;
        movementStep.vec3_copy(movement);

        if (!movement.vec3_isZero(0.00001) && collisionCheckParams.mySplitMovementEnabled) {
            let equalStepLength = movement.vec3_length() / collisionCheckParams.mySplitMovementMaxSteps;
            if (!collisionCheckParams.mySplitMovementStepEqualLength || equalStepLength < collisionCheckParams.mySplitMovementStepEqualLengthMinLength) {
                let maxLength = collisionCheckParams.mySplitMovementStepEqualLength ? collisionCheckParams.mySplitMovementStepEqualLengthMinLength : collisionCheckParams.mySplitMovementMaxLength;
                movementStepAmount = Math.ceil(movement.vec3_length() / maxLength);
                if (movementStepAmount > 1) {
                    movementStep = movementStep.vec3_normalize(movementStep).vec3_scale(maxLength, movementStep);
                    movementStepAmount = (collisionCheckParams.mySplitMovementMaxStepsEnabled) ? Math.min(movementStepAmount, collisionCheckParams.mySplitMovementMaxSteps) : movementStepAmount;
                }

                movementStepAmount = Math.max(1, movementStepAmount);

                if (movementStepAmount == 1) {
                    movementStep.vec3_copy(movement);
                }
            } else {
                movementStepAmount = collisionCheckParams.mySplitMovementMaxSteps;
                if (movementStepAmount > 1) {
                    movementStep = movementStep.vec3_normalize(movementStep).vec3_scale(equalStepLength, movementStep);
                }
            }
        }

        fixedMovement.vec3_zero();
        movementChecked.vec3_zero();

        previousCollisionRuntimeParams.copy(collisionRuntimeParams);
        previousFixedMovement.vec3_copy(fixedMovement);
        previousMovementChecked.vec3_copy(movementChecked);

        let stepsPerformed = 0;
        let splitMovementStop = false;
        for (let i = 0; i < movementStepAmount; i++) {
            if (movementStepAmount == 1 || i != movementStepAmount - 1) {
                currentMovementStep.vec3_copy(movementStep);
            } else {
                currentMovementStep = movement.vec3_sub(movementChecked, currentMovementStep);
            }

            newFeetPosition = feetPosition.vec3_add(fixedMovement, newFeetPosition);
            fixedMovementStep.vec3_zero();
            fixedMovementStep = this._moveStep(currentMovementStep, newFeetPosition, transformUp, transformForward, height, true, collisionCheckParams, collisionRuntimeParams, fixedMovementStep);
            fixedMovement.vec3_add(fixedMovementStep, fixedMovement);

            movementChecked = movementChecked.vec3_add(movementStep, movementChecked);

            stepsPerformed = i + 1;

            if ((collisionRuntimeParams.myHorizontalMovementCanceled && collisionRuntimeParams.myVerticalMovementCanceled) ||
                (collisionRuntimeParams.myHorizontalMovementCanceled && collisionCheckParams.mySplitMovementStopWhenHorizontalMovementCanceled) ||
                (collisionRuntimeParams.myVerticalMovementCanceled && collisionCheckParams.mySplitMovementStopWhenVerticalMovementCanceled) ||
                (collisionCheckParams.mySplitMovementStopCallback != null && collisionCheckParams.mySplitMovementStopCallback(collisionRuntimeParams))) {
                if (collisionCheckParams.mySplitMovementStopReturnPrevious) {
                    collisionRuntimeParams.copy(previousCollisionRuntimeParams);
                    fixedMovement.vec3_copy(previousFixedMovement);
                    movementChecked.vec3_copy(previousMovementChecked);
                    stepsPerformed -= 1;
                }

                splitMovementStop = true;
                break;
            }

            previousCollisionRuntimeParams.copy(collisionRuntimeParams);
            previousFixedMovement.vec3_copy(fixedMovement);
            previousMovementChecked.vec3_copy(movementChecked);
        }

        //fixedMovement.vec3_zero();

        collisionRuntimeParams.mySplitMovementSteps = movementStepAmount;
        collisionRuntimeParams.mySplitMovementStepsPerformed = stepsPerformed;
        collisionRuntimeParams.mySplitMovementStop = splitMovementStop;
        collisionRuntimeParams.mySplitMovementMovementChecked.vec3_copy(movementChecked);

        collisionRuntimeParams.myOriginalUp = transformQuat.quat2_getUp(collisionRuntimeParams.myOriginalUp);
        collisionRuntimeParams.myOriginalForward = transformQuat.quat2_getForward(collisionRuntimeParams.myOriginalForward);
        collisionRuntimeParams.myOriginalPosition = transformQuat.quat2_getPosition(collisionRuntimeParams.myOriginalPosition);

        //console.error(collisionRuntimeParams.myOriginalPosition.vec3_sub(feetPosition)[1].toFixed(3));

        collisionRuntimeParams.myOriginalHeight = collisionCheckParams.myHeight;

        collisionRuntimeParams.myOriginalMovement.vec3_copy(movement);
        collisionRuntimeParams.myFixedMovement.vec3_copy(fixedMovement);

        collisionRuntimeParams.myNewPosition = collisionRuntimeParams.myOriginalPosition.vec3_add(collisionRuntimeParams.myFixedMovement, collisionRuntimeParams.myNewPosition);

        collisionRuntimeParams.myIsMove = true;


        //console.error(this._myTotalRaycasts );

        //this._myTotalRaycastsMax = Math.max(this._myTotalRaycasts, this._myTotalRaycastsMax);
        //console.error(this._myTotalRaycastsMax);
    };
}();

PP.CollisionCheck.prototype._moveStep = function () {
    let horizontalMovement = PP.vec3_create();
    let verticalMovement = PP.vec3_create();
    let fixedHorizontalMovement = PP.vec3_create();
    let fixedVerticalMovement = PP.vec3_create();
    let horizontalDirection = PP.vec3_create();
    let forwardForHorizontal = PP.vec3_create();
    let forwardForVertical = PP.vec3_create();
    let forwardForPerceivedAngle = PP.vec3_create();
    let newFeetPosition = PP.vec3_create();
    let surfaceAdjustedVerticalMovement = PP.vec3_create();
    let surfaceAdjustedHorizontalMovement = PP.vec3_create();
    let fixedMovement = PP.vec3_create();

    let zAxis = PP.vec3_create(0, 0, 1);
    let xAxis = PP.vec3_create(1, 0, 0);
    return function _moveStep(movement, feetPosition, transformUp, transformForward, height, allowSurfaceSteepFix, collisionCheckParams, collisionRuntimeParams, outFixedMovement) {
        // #TODO refactor and split horizontal check and vertical check into: hMovement + vMovement + hPosition + vPosition?
        // Will make the sliding heavier, if I slide repeating all the 4 steps instead of 2 as now, but would be more correct

        // #TODO when on high slopes where u are not allowed to move the check does not manage to slide

        // #TODO when moving upward on the edge of a slope, the edge can be detected as a wall and prevent movement, while it should just keep moving

        horizontalMovement = movement.vec3_removeComponentAlongAxis(transformUp, horizontalMovement);
        if (horizontalMovement.vec3_isZero(0.000001)) {
            horizontalMovement.vec3_zero();
        }

        verticalMovement = movement.vec3_componentAlongAxis(transformUp, verticalMovement);
        if (verticalMovement.vec3_isZero(0.000001)) {
            verticalMovement.vec3_zero();
        }

        if (horizontalMovement.vec3_isZero()) {
            //return PP.vec3_create();
        }

        //this._myTotalRaycasts = 0;
        //collisionCheckParams.myDebugActive = true;

        this._myPrevCollisionRuntimeParams.copy(collisionRuntimeParams);
        collisionRuntimeParams.reset();

        surfaceAdjustedHorizontalMovement = this._adjustHorizontalMovementWithSurface(horizontalMovement, verticalMovement, transformUp, collisionCheckParams, collisionRuntimeParams, this._myPrevCollisionRuntimeParams, surfaceAdjustedHorizontalMovement);
        if (surfaceAdjustedHorizontalMovement.vec3_isZero(0.00001)) {
            surfaceAdjustedHorizontalMovement.vec3_zero();
        }

        this._syncCollisionRuntimeParamsWithPrevious(surfaceAdjustedHorizontalMovement, verticalMovement, transformUp, collisionCheckParams, collisionRuntimeParams, this._myPrevCollisionRuntimeParams);

        {
            forwardForHorizontal.vec3_copy(collisionCheckParams.myCheckHorizontalFixedForward);
            if (!collisionCheckParams.myCheckHorizontalFixedForwardEnabled) {
                if (!surfaceAdjustedHorizontalMovement.vec3_isZero()) {
                    forwardForHorizontal = surfaceAdjustedHorizontalMovement.vec3_normalize(forwardForHorizontal);
                } else if (!horizontalMovement.vec3_isZero()) {
                    forwardForHorizontal = horizontalMovement.vec3_normalize(forwardForHorizontal);
                } else {
                    forwardForHorizontal.vec3_copy(transformForward);
                }
            } else {
                if (collisionCheckParams.myCheckHorizontalFixedForward.vec3_isOnAxis(transformUp)) {
                    if (zAxis.vec3_isOnAxis(transformUp)) {
                        forwardForHorizontal.vec3_copy(xAxis);
                    } else {
                        forwardForHorizontal.vec3_copy(zAxis);
                    }
                }

                forwardForHorizontal = forwardForHorizontal.vec3_removeComponentAlongAxis(transformUp, forwardForHorizontal);
                forwardForHorizontal = forwardForHorizontal.vec3_normalize(forwardForHorizontal);

                if (forwardForHorizontal.vec_equals(collisionCheckParams.myCheckHorizontalFixedForward, 0.00001)) {
                    forwardForHorizontal.vec3_copy(collisionCheckParams.myCheckHorizontalFixedForward);
                }
            }

            fixedHorizontalMovement.vec3_zero();

            if (!surfaceAdjustedHorizontalMovement.vec3_isZero()) {
                fixedHorizontalMovement = this._horizontalCheck(surfaceAdjustedHorizontalMovement, feetPosition, height, transformUp, forwardForHorizontal, allowSurfaceSteepFix, collisionCheckParams, collisionRuntimeParams, this._myPrevCollisionRuntimeParams, false, fixedHorizontalMovement);
                //console.error(this._myTotalRaycasts );
                //collisionRuntimeParams.myIsCollidingHorizontally = true;
                //collisionRuntimeParams.myHorizontalCollisionHit.myNormal = PP.vec3_create(0, 0, 1);
                if (collisionCheckParams.mySlidingEnabled && collisionRuntimeParams.myIsCollidingHorizontally && this._isSlidingNormalValid(surfaceAdjustedHorizontalMovement, transformUp, collisionRuntimeParams)) {
                    fixedHorizontalMovement = this._horizontalSlide(surfaceAdjustedHorizontalMovement, feetPosition, height, transformUp, forwardForHorizontal, allowSurfaceSteepFix, collisionCheckParams, collisionRuntimeParams, this._myPrevCollisionRuntimeParams, fixedHorizontalMovement);
                } else {
                    //console.error("no slide");
                }
            }

            if (fixedHorizontalMovement.vec3_isZero(0.000001)) {
                fixedHorizontalMovement.vec3_zero();
            }

            if (!surfaceAdjustedHorizontalMovement.vec3_isZero() && fixedHorizontalMovement.vec3_isZero()) {
                collisionRuntimeParams.myHorizontalMovementCanceled = true;
            }
        }

        {
            forwardForVertical.vec3_copy(collisionCheckParams.myCheckVerticalFixedForward);
            if (!collisionCheckParams.myCheckVerticalFixedForwardEnabled) {
                if (fixedHorizontalMovement.vec3_isZero()) {
                    if (!surfaceAdjustedHorizontalMovement.vec3_isZero()) {
                        forwardForVertical = surfaceAdjustedHorizontalMovement.vec3_normalize(forwardForVertical);
                    } else if (!horizontalMovement.vec3_isZero()) {
                        forwardForVertical = horizontalMovement.vec3_normalize(forwardForVertical);
                    } else {
                        forwardForVertical.vec3_copy(transformForward);
                    }
                } else {
                    forwardForVertical = fixedHorizontalMovement.vec3_normalize(forwardForVertical);
                }
            } else {
                if (collisionCheckParams.myCheckVerticalFixedForward.vec3_isOnAxis(transformUp)) {
                    if (zAxis.vec3_isOnAxis(transformUp)) {
                        forwardForVertical.vec3_copy(xAxis);
                    } else {
                        forwardForVertical.vec3_copy(zAxis);
                    }
                }

                forwardForVertical = forwardForVertical.vec3_removeComponentAlongAxis(transformUp, forwardForVertical);
                forwardForVertical = forwardForVertical.vec3_normalize(forwardForVertical);

                if (forwardForVertical.vec_equals(collisionCheckParams.myCheckVerticalFixedForward, 0.00001)) {
                    forwardForVertical.vec3_copy(collisionCheckParams.myCheckVerticalFixedForward);
                }
            }

            //console.error(this._myTotalRaycasts );
            // collisionCheckParams.myDebugActive = false;

            surfaceAdjustedVerticalMovement = this._adjustVerticalMovementWithSurface(fixedHorizontalMovement, verticalMovement, transformUp, collisionCheckParams, collisionRuntimeParams, this._myPrevCollisionRuntimeParams, surfaceAdjustedVerticalMovement);

            newFeetPosition = feetPosition.vec3_add(fixedHorizontalMovement, newFeetPosition);
            let originalMovementSign = Math.pp_sign(verticalMovement.vec3_lengthSigned(transformUp), 0);

            fixedVerticalMovement.vec3_zero();
            fixedVerticalMovement = this._verticalCheck(surfaceAdjustedVerticalMovement, originalMovementSign, newFeetPosition, height, transformUp, forwardForVertical, collisionCheckParams, collisionRuntimeParams, fixedVerticalMovement);

            if (fixedVerticalMovement.vec3_isZero(0.000001)) {
                fixedVerticalMovement.vec3_zero();
            }
        }

        //console.error(this._myTotalRaycasts );
        outFixedMovement.vec3_zero();
        if (!collisionRuntimeParams.myIsCollidingVertically) {
            outFixedMovement = fixedHorizontalMovement.vec3_add(fixedVerticalMovement, outFixedMovement);
        } else {
            collisionRuntimeParams.myHorizontalMovementCanceled = true;
            collisionRuntimeParams.myVerticalMovementCanceled = true;
            fixedHorizontalMovement.vec3_zero();
            fixedVerticalMovement.vec3_zero();

            if (!collisionCheckParams.myCheckVerticalFixedForwardEnabled) {
                if (!surfaceAdjustedHorizontalMovement.vec3_isZero()) {
                    forwardForVertical = surfaceAdjustedHorizontalMovement.vec3_normalize(forwardForVertical);
                } else if (!horizontalMovement.vec3_isZero()) {
                    forwardForVertical = horizontalMovement.vec3_normalize(forwardForVertical);
                } else {
                    forwardForVertical.vec3_copy(transformForward);
                }
            }
        }

        newFeetPosition = feetPosition.vec3_add(outFixedMovement, newFeetPosition);

        forwardForPerceivedAngle.vec3_copy(transformForward);

        if (!fixedHorizontalMovement.vec3_isZero()) {
            forwardForPerceivedAngle = fixedHorizontalMovement.vec3_normalize(forwardForPerceivedAngle);
        } else if (!surfaceAdjustedHorizontalMovement.vec3_isZero()) {
            forwardForPerceivedAngle = surfaceAdjustedHorizontalMovement.vec3_normalize(forwardForPerceivedAngle);
        } else if (!horizontalMovement.vec3_isZero()) {
            forwardForPerceivedAngle = horizontalMovement.vec3_normalize(forwardForPerceivedAngle);
        }

        if (collisionCheckParams.myComputeGroundInfoEnabled) {
            this._gatherSurfaceInfo(newFeetPosition, height, transformUp, forwardForPerceivedAngle, forwardForVertical, true, collisionCheckParams, collisionRuntimeParams);
        }

        if (collisionCheckParams.myComputeCeilingInfoEnabled) {
            this._gatherSurfaceInfo(newFeetPosition, height, transformUp, forwardForPerceivedAngle, forwardForVertical, false, collisionCheckParams, collisionRuntimeParams);
        }

        if (!surfaceAdjustedHorizontalMovement.vec3_isZero() && !collisionRuntimeParams.myHorizontalMovementCanceled) {
            let surfaceCheckOk = this._postSurfaceCheck(fixedHorizontalMovement, fixedVerticalMovement, transformUp, collisionCheckParams, collisionRuntimeParams, this._myPrevCollisionRuntimeParams);

            if (!surfaceCheckOk) {
                collisionRuntimeParams.myHorizontalMovementCanceled = true;
                collisionRuntimeParams.myVerticalMovementCanceled = true;
                fixedHorizontalMovement.vec3_zero();
                fixedVerticalMovement.vec3_zero();
                outFixedMovement.vec3_zero();
                newFeetPosition = feetPosition.vec3_add(outFixedMovement, newFeetPosition);

                if (!surfaceAdjustedHorizontalMovement.vec3_isZero()) {
                    forwardForPerceivedAngle = surfaceAdjustedHorizontalMovement.vec3_normalize(forwardForPerceivedAngle);
                } else if (!horizontalMovement.vec3_isZero()) {
                    forwardForPerceivedAngle = horizontalMovement.vec3_normalize(forwardForPerceivedAngle);
                } else {
                    forwardForPerceivedAngle.vec3_copy(transformForward);
                }

                if (collisionCheckParams.myComputeGroundInfoEnabled && collisionCheckParams.myRegatherGroundInfoOnSurfaceCheckFail) {
                    this._gatherSurfaceInfo(newFeetPosition, height, transformUp, forwardForPerceivedAngle, forwardForVertical, true, collisionCheckParams, collisionRuntimeParams);
                } else {
                    collisionRuntimeParams.myIsOnGround = this._myPrevCollisionRuntimeParams.myIsOnGround;
                    collisionRuntimeParams.myGroundAngle = this._myPrevCollisionRuntimeParams.myGroundAngle;
                    collisionRuntimeParams.myGroundPerceivedAngle = this._myPrevCollisionRuntimeParams.myGroundPerceivedAngle;
                    collisionRuntimeParams.myGroundNormal.vec3_copy(this._myPrevCollisionRuntimeParams.myGroundNormal);
                }

                if (collisionCheckParams.myComputeCeilingInfoEnabled && collisionCheckParams.myRegatherCeilingInfoOnSurfaceCheckFail) {
                    this._gatherSurfaceInfo(newFeetPosition, height, transformUp, forwardForPerceivedAngle, forwardForVertical, false, collisionCheckParams, collisionRuntimeParams);
                } else {
                    collisionRuntimeParams.myIsOnCeiling = this._myPrevCollisionRuntimeParams.myIsOnCeiling;
                    collisionRuntimeParams.myCeilingAngle = this._myPrevCollisionRuntimeParams.myCeilingAngle;
                    collisionRuntimeParams.myCeilingPerceivedAngle = this._myPrevCollisionRuntimeParams.myCeilingPerceivedAngle;
                    collisionRuntimeParams.myCeilingNormal.vec3_copy(this._myPrevCollisionRuntimeParams.myCeilingNormal);
                }
            }
        }

        //return outFixedMovement.vec3_zero();        

        if (collisionCheckParams.myExtraMovementCheckCallback != null) {
            fixedMovement.vec3_copy(outFixedMovement);
            outFixedMovement = collisionCheckParams.myExtraMovementCheckCallback(
                movement, fixedMovement, feetPosition, transformUp, transformForward, height,
                collisionCheckParams, this._myPrevCollisionRuntimeParams, collisionRuntimeParams, outFixedMovement);

            fixedHorizontalMovement = outFixedMovement.vec3_removeComponentAlongAxis(transformUp, fixedHorizontalMovement);
            fixedVerticalMovement = outFixedMovement.vec3_componentAlongAxis(transformUp, fixedVerticalMovement);
        }

        {
            if (collisionCheckParams.mySlidingAdjustSign90Degrees) {
                if (!collisionRuntimeParams.myHorizontalMovementCanceled && !collisionRuntimeParams.myIsSliding && !fixedHorizontalMovement.vec3_isZero()) {
                    /* let angleWithPreviousThreshold = 0.5;
                    check use surfaceAdjustedHorizontalMovement instead of horizontalMovement if reenable this
                    if (!this._myPrevCollisionRuntimeParams.myLastValidOriginalHorizontalMovement.vec3_isZero() && !horizontalMovement.vec3_isZero() &&
                        horizontalMovement.vec3_angle(this._myPrevCollisionRuntimeParams.myLastValidOriginalHorizontalMovement) > angleWithPreviousThreshold) {
                        collisionRuntimeParams.mySliding90DegreesSign = horizontalMovement.vec3_signTo(this._myPrevCollisionRuntimeParams.myLastValidOriginalHorizontalMovement, transformUp);
                        console.error("sp", collisionRuntimeParams.mySliding90DegreesSign, collisionRuntimeParams.myIsSliding);
                    } */
                    collisionRuntimeParams.mySlidingRecompute90DegreesSign = true;
                    //console.error("empty renew");
                }
            }

            if (!horizontalMovement.vec3_isZero()) {
                collisionRuntimeParams.myLastValidOriginalHorizontalMovement.vec3_copy(horizontalMovement);
            }

            if (!surfaceAdjustedHorizontalMovement.vec3_isZero()) {
                collisionRuntimeParams.myLastValidSurfaceAdjustedHorizontalMovement.vec3_copy(surfaceAdjustedHorizontalMovement);
            }

            if (!verticalMovement.vec3_isZero()) {
                collisionRuntimeParams.myLastValidOriginalVerticalMovement.vec3_copy(verticalMovement);
            }

            if (!surfaceAdjustedVerticalMovement.vec3_isZero()) {
                collisionRuntimeParams.myLastValidSurfaceAdjustedVerticalMovement.vec3_copy(surfaceAdjustedVerticalMovement);
            }

            if (!fixedHorizontalMovement.vec3_isZero(0.000001)) {
                collisionRuntimeParams.myLastValidIsSliding = collisionRuntimeParams.myIsSliding;
                collisionRuntimeParams.myIsSlidingFlickerPrevented = false;
                collisionRuntimeParams.myLastValidEndHorizontalMovement.vec3_copy(fixedHorizontalMovement);
                //fixedHorizontalMovement.vec3_error();

                if (!collisionRuntimeParams.myIsSliding) {
                    //console.error("not sliding");
                } else {
                    //console.error("sliding", collisionRuntimeParams.myIsSlidingFlickerPrevented, collisionRuntimeParams.mySlidingFlickerPreventionCheckAnywayCounter);
                }
            } else {
                //console.error("still", collisionRuntimeParams.myIsSlidingFlickerPrevented, collisionRuntimeParams.mySlidingFlickerPreventionCheckAnywayCounter);
            }

            if (!fixedVerticalMovement.vec3_isZero(0.000001)) {
                collisionRuntimeParams.myLastValidEndVerticalMovement.vec3_copy(fixedVerticalMovement);
            }
        }

        let moveStepFixed = false;
        if (!collisionRuntimeParams.myHorizontalMovementCanceled && !fixedHorizontalMovement.vec3_isZero(0.000001)) {
            horizontalDirection = fixedHorizontalMovement.vec3_normalize(horizontalDirection);
            let surfaceTooSteepResults = this._surfaceTooSteep(transformUp, horizontalDirection, collisionCheckParams, this._myPrevCollisionRuntimeParams);
            if (surfaceTooSteepResults[0] || surfaceTooSteepResults[1]) {
                horizontalDirection = fixedHorizontalMovement.vec3_normalize(horizontalDirection);
                let newSurfaceTooSteepResults = this._surfaceTooSteep(transformUp, horizontalDirection, collisionCheckParams, collisionRuntimeParams);

                if ((surfaceTooSteepResults[0] && newSurfaceTooSteepResults[0]) ||
                    (surfaceTooSteepResults[1] && newSurfaceTooSteepResults[1]) ||
                    !allowSurfaceSteepFix ||
                    (surfaceTooSteepResults[0] && !collisionCheckParams.myAllowGroundSteepFix) ||
                    (surfaceTooSteepResults[1] && !collisionCheckParams.myAllowCeilingSteepFix)) {
                    outFixedMovement.vec3_zero();
                    collisionRuntimeParams.copy(this._myPrevCollisionRuntimeParams);
                    this._moveStep(movement, feetPosition, transformUp, transformForward, height, false, collisionCheckParams, collisionRuntimeParams, outFixedMovement);
                    moveStepFixed = true;
                }
            }
        }

        if (!moveStepFixed) {
            if (collisionCheckParams.myDebugActive && collisionCheckParams.myDebugMovementActive) {
                this._debugMovement(movement, outFixedMovement, newFeetPosition, transformUp, collisionCheckParams);
            }

            if (collisionCheckParams.myDebugActive && collisionCheckParams.myDebugRuntimeParamsActive) {
                this._debugRuntimeParams(collisionRuntimeParams);
            }
        }

        return outFixedMovement;
    };
}();

PP.CollisionCheck.prototype._syncCollisionRuntimeParamsWithPrevious = function () {
    let previousFixedHorizontalMovement = PP.vec3_create();
    return function _syncCollisionRuntimeParamsWithPrevious(surfaceAdjustedHorizontalMovement, verticalMovement, up, collisionCheckParams, collisionRuntimeParams, previousCollisionRuntimeParams) {
        collisionRuntimeParams.myIsSlidingFlickerPrevented = previousCollisionRuntimeParams.myIsSlidingFlickerPrevented;
        //console.error("prevented", collisionRuntimeParams.myIsSlidingFlickerPrevented);

        collisionRuntimeParams.myLastValidOriginalHorizontalMovement.vec3_copy(previousCollisionRuntimeParams.myLastValidOriginalHorizontalMovement);
        collisionRuntimeParams.myLastValidOriginalVerticalMovement.vec3_copy(previousCollisionRuntimeParams.myLastValidOriginalVerticalMovement);
        collisionRuntimeParams.myLastValidSurfaceAdjustedHorizontalMovement.vec3_copy(previousCollisionRuntimeParams.myLastValidSurfaceAdjustedHorizontalMovement);
        collisionRuntimeParams.myLastValidSurfaceAdjustedVerticalMovement.vec3_copy(previousCollisionRuntimeParams.myLastValidSurfaceAdjustedVerticalMovement);
        collisionRuntimeParams.myLastValidIsSliding = previousCollisionRuntimeParams.myLastValidIsSliding;

        collisionRuntimeParams.mySliding90DegreesSign = previousCollisionRuntimeParams.mySliding90DegreesSign;
        collisionRuntimeParams.mySlidingRecompute90DegreesSign = previousCollisionRuntimeParams.mySlidingRecompute90DegreesSign;
        if (collisionCheckParams.mySlidingAdjustSign90Degrees) {
            let angleWithPreviousThreshold = 0.5;
            if (!previousCollisionRuntimeParams.myLastValidSurfaceAdjustedHorizontalMovement.vec3_isZero() && !surfaceAdjustedHorizontalMovement.vec3_isZero() &&
                surfaceAdjustedHorizontalMovement.vec3_angle(previousCollisionRuntimeParams.myLastValidSurfaceAdjustedHorizontalMovement) > angleWithPreviousThreshold) {
                //previousFixedHorizontalMovement = previousCollisionRuntimeParams.myFixedMovement.vec3_removeComponentAlongAxis(up, previousFixedHorizontalMovement);
                if (!previousCollisionRuntimeParams.myLastValidIsSliding) {
                    let angleSigned = surfaceAdjustedHorizontalMovement.vec3_angleSigned(previousCollisionRuntimeParams.myLastValidSurfaceAdjustedHorizontalMovement, up);
                    let angleSignedThreshold = 10;
                    if (Math.abs(angleSigned) < 180 - angleSignedThreshold) {
                        collisionRuntimeParams.mySliding90DegreesSign = Math.pp_sign(angleSigned);
                        //console.error("special sign");
                    }
                }
                collisionRuntimeParams.mySlidingRecompute90DegreesSign = true;
                //console.error("direction new");
            }
        }

        previousFixedHorizontalMovement = previousCollisionRuntimeParams.myFixedMovement.vec3_removeComponentAlongAxis(up, previousFixedHorizontalMovement);
        if (previousFixedHorizontalMovement.vec3_isZero(0.000001)) {
            collisionRuntimeParams.mySlidingPreviousHorizontalMovement.vec3_copy(previousCollisionRuntimeParams.mySlidingPreviousHorizontalMovement);
        } else {
            collisionRuntimeParams.mySlidingPreviousHorizontalMovement.vec3_copy(previousFixedHorizontalMovement);
        }
    };
}();



Object.defineProperty(PP.CollisionCheck.prototype, "_move", { enumerable: false });
Object.defineProperty(PP.CollisionCheck.prototype, "_moveStep", { enumerable: false });
Object.defineProperty(PP.CollisionCheck.prototype, "_syncCollisionRuntimeParamsWithPrevious", { enumerable: false });
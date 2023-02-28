PP.CollisionCheck.prototype._teleport = function () {
    let transformUp = PP.vec3_create();
    let transformForward = PP.vec3_create();
    let feetPosition = PP.vec3_create();
    let originalFeetPosition = PP.vec3_create();

    let transformOffsetLocalQuat = PP.quat2_create();
    let offsetTransformQuat = PP.quat2_create();

    let feetPositionOffsetToOriginal = PP.vec3_create();
    let offsetTeleportPosition = PP.vec3_create();

    let zero = PP.vec3_create();
    let forwardForHorizontal = PP.vec3_create();
    let forwardForVertical = PP.vec3_create();
    let forwardForPerceivedAngle = PP.vec3_create();
    let fixedHorizontalMovement = PP.vec3_create();
    let fixedVerticalMovement = PP.vec3_create();
    let newFeetPosition = PP.vec3_create();
    let endPosition = PP.vec3_create();

    let zAxis = PP.vec3_create(0, 0, 1);
    let xAxis = PP.vec3_create(1, 0, 0);
    return function _teleport(teleportPosition, transformQuat, collisionCheckParams, collisionRuntimeParams, isPositionCheck = false) {
        transformOffsetLocalQuat.quat2_setPositionRotationQuat(collisionCheckParams.myPositionOffsetLocal, collisionCheckParams.myRotationOffsetLocalQuat);
        offsetTransformQuat = transformOffsetLocalQuat.quat2_toWorld(transformQuat, offsetTransformQuat);
        if (transformQuat.vec_equals(offsetTransformQuat, 0.00001)) {
            offsetTransformQuat.quat2_copy(transformQuat);
        }

        transformUp = offsetTransformQuat.quat2_getUp(transformUp);
        transformForward = offsetTransformQuat.quat2_getForward(transformForward);
        feetPosition = offsetTransformQuat.quat2_getPosition(feetPosition);

        offsetTeleportPosition.vec3_copy(teleportPosition);
        originalFeetPosition = transformQuat.quat2_getPosition(originalFeetPosition);
        feetPositionOffsetToOriginal = originalFeetPosition.vec3_sub(feetPosition, feetPositionOffsetToOriginal);
        if (feetPositionOffsetToOriginal.vec3_isZero(0.00001)) {
            feetPositionOffsetToOriginal.vec3_zero();
        } else {
            offsetTeleportPosition = offsetTeleportPosition.vec3_sub(feetPositionOffsetToOriginal, offsetTeleportPosition);
        }


        let height = collisionCheckParams.myHeight;
        height = height - 0.00001; // this makes it easier to setup things at the same exact height of a character so that it can go under it
        if (height < 0.00001) {
            height = 0;
        }
        //height = 1.75;

        this._myPrevCollisionRuntimeParams.copy(collisionRuntimeParams);
        collisionRuntimeParams.reset();

        forwardForHorizontal.vec3_copy(collisionCheckParams.myCheckHorizontalFixedForward);
        if (!collisionCheckParams.myCheckHorizontalFixedForwardEnabled) {
            forwardForHorizontal.vec3_copy(transformForward);
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

        fixedHorizontalMovement = this._horizontalCheck(zero, offsetTeleportPosition, height, transformUp, forwardForHorizontal, false, collisionCheckParams, collisionRuntimeParams, this._myPrevCollisionRuntimeParams, false, fixedHorizontalMovement);
        if (!collisionRuntimeParams.myIsCollidingHorizontally) {
            newFeetPosition = offsetTeleportPosition.vec3_add(fixedHorizontalMovement, newFeetPosition);

            forwardForVertical.vec3_copy(collisionCheckParams.myCheckVerticalFixedForward);
            if (!collisionCheckParams.myCheckVerticalFixedForwardEnabled) {
                forwardForVertical.vec3_copy(transformForward);
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

            let downward = -1;
            fixedVerticalMovement = this._verticalCheck(zero, downward, newFeetPosition, height, transformUp, forwardForVertical, collisionCheckParams, collisionRuntimeParams, fixedVerticalMovement);
            if (!collisionRuntimeParams.myIsCollidingVertically) {
                newFeetPosition = newFeetPosition.vec3_add(fixedVerticalMovement, newFeetPosition);

                forwardForPerceivedAngle.vec3_copy(transformForward);

                if (collisionCheckParams.myComputeGroundInfoEnabled) {
                    this._gatherSurfaceInfo(newFeetPosition, height, transformUp, forwardForPerceivedAngle, forwardForVertical, true, collisionCheckParams, collisionRuntimeParams);
                }

                if (collisionCheckParams.myComputeCeilingInfoEnabled) {
                    this._gatherSurfaceInfo(newFeetPosition, height, transformUp, forwardForPerceivedAngle, forwardForVertical, false, collisionCheckParams, collisionRuntimeParams);
                }

                if (!collisionRuntimeParams.myIsOnGround) {
                    if ((collisionCheckParams.myTeleportMustBeOnGround && !isPositionCheck)
                        || (collisionCheckParams.myCheckTransformMustBeOnGround && isPositionCheck)) {
                        collisionRuntimeParams.myTeleportCanceled = true;
                    }
                }

                if (!collisionRuntimeParams.myIsOnCeiling) {
                    if ((collisionCheckParams.myTeleportMustBeOnCeiling && !isPositionCheck)
                        || (collisionCheckParams.myCheckTransformMustBeOnCeiling && isPositionCheck)) {
                        collisionRuntimeParams.myTeleportCanceled = true;
                    }
                }

                if (collisionRuntimeParams.myIsOnGround) {
                    let minAngle = null;
                    if (!isPositionCheck) {
                        if (collisionCheckParams.myTeleportMustBeOnIgnorableGroundAngle) {
                            minAngle = collisionCheckParams.myGroundAngleToIgnore;
                        }

                        if (collisionCheckParams.myTeleportMustBeOnGroundAngle != null) {
                            minAngle = Math.min(minAngle, collisionCheckParams.myTeleportMustBeOnGroundAngle);
                        }
                    } else {
                        if (collisionCheckParams.myCheckTransformMustBeOnIgnorableGroundAngle) {
                            minAngle = collisionCheckParams.myGroundAngleToIgnore;
                        }

                        if (collisionCheckParams.myCheckTransformMustBeOnGroundAngle != null) {
                            minAngle = Math.min(minAngle, collisionCheckParams.myCheckTransformMustBeOnGroundAngle);
                        }
                    }

                    if (minAngle != null && collisionRuntimeParams.myGroundAngle > minAngle + 0.0001) {
                        collisionRuntimeParams.myTeleportCanceled = true;
                    }
                }

                if (collisionRuntimeParams.myIsOnCeiling) {
                    let minAngle = null;
                    if (!isPositionCheck) {
                        if (collisionCheckParams.myTeleportMustBeOnIgnorableCeilingAngle) {
                            minAngle = collisionCheckParams.myCeilingAngleToIgnore;
                        }

                        if (collisionCheckParams.myTeleportMustBeOnCeilingAngle != null) {
                            minAngle = Math.min(minAngle, collisionCheckParams.myTeleportMustBeOnCeilingAngle);
                        }
                    } else {
                        if (collisionCheckParams.myCheckTransformMustBeOnIgnorableCeilingAngle) {
                            minAngle = collisionCheckParams.myCeilingAngleToIgnore;
                        }

                        if (collisionCheckParams.myCheckTransformMustBeOnCeilingAngle != null) {
                            minAngle = Math.min(minAngle, collisionCheckParams.myCheckTransformMustBeOnCeilingAngle);
                        }
                    }

                    if (minAngle != null && collisionRuntimeParams.myCeilingAngle > minAngle + 0.0001) {
                        collisionRuntimeParams.myTeleportCanceled = true;
                    }
                }

                if (collisionRuntimeParams.myTeleportCanceled) {
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

                //regather surface if invalid else use before
            } else {
                collisionRuntimeParams.myTeleportCanceled = true;
            }
        } else {
            collisionRuntimeParams.myTeleportCanceled = true;
        }

        if (!isPositionCheck) {
            if (collisionCheckParams.myExtraTeleportCheckCallback != null) {
                endPosition.vec3_copy(newFeetPosition);
                newFeetPosition = collisionCheckParams.myExtraTeleportCheckCallback(
                    offsetTeleportPosition, endPosition, feetPosition, transformUp, transformForward, height,
                    collisionCheckParams, this._myPrevCollisionRuntimeParams, collisionRuntimeParams, newFeetPosition);
            }
        } else {
            if (collisionCheckParams.myExtraCheckTransformCheckCallback != null) {
                endPosition.vec3_copy(newFeetPosition);
                newFeetPosition = collisionCheckParams.myExtraCheckTransformCheckCallback(
                    endPosition, feetPosition, transformUp, transformForward, height,
                    collisionCheckParams, this._myPrevCollisionRuntimeParams, collisionRuntimeParams, newFeetPosition);
            }
        }

        collisionRuntimeParams.myOriginalUp = transformQuat.quat2_getUp(collisionRuntimeParams.myOriginalUp);
        collisionRuntimeParams.myOriginalForward = transformQuat.quat2_getForward(collisionRuntimeParams.myOriginalForward);
        collisionRuntimeParams.myOriginalPosition = transformQuat.quat2_getPosition(collisionRuntimeParams.myOriginalPosition);

        collisionRuntimeParams.myOriginalHeight = collisionCheckParams.myHeight;

        collisionRuntimeParams.myOriginalTeleportPosition.vec3_copy(teleportPosition);

        if (!collisionRuntimeParams.myTeleportCanceled) {
            collisionRuntimeParams.myFixedTeleportPosition.vec3_copy(newFeetPosition);
            if (!feetPositionOffsetToOriginal.vec3_isZero(0.00001)) {
                collisionRuntimeParams.myFixedTeleportPosition = collisionRuntimeParams.myFixedTeleportPosition.vec3_add(feetPositionOffsetToOriginal, collisionRuntimeParams.myFixedTeleportPosition);
            }

            collisionRuntimeParams.myNewPosition.vec3_copy(collisionRuntimeParams.myFixedTeleportPosition);
        } else {
            collisionRuntimeParams.myNewPosition.vec3_copy(collisionRuntimeParams.myOriginalPosition);
        }

        collisionRuntimeParams.myIsTeleport = true;

        if (collisionCheckParams.myDebugActive && collisionCheckParams.myDebugRuntimeParamsActive) {
            this._debugRuntimeParams(collisionRuntimeParams);
        }
    };
}();



Object.defineProperty(PP.CollisionCheck.prototype, "_teleport", { enumerable: false });

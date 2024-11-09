import { RaycastHit } from "../../../../../../cauldron/physics/physics_raycast_params.js";
import { quat2_create, vec3_create } from "../../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../../../pp/globals.js";
import { CollisionCheckBase } from "./collision_check_base.js";

export class CollisionCheckSurface extends CollisionCheckBase {

    updateSurfaceInfo(transformQuat, collisionCheckParams, collisionRuntimeParams) {
        if (this.isCollisionCheckDisabled() && Globals.isDebugEnabled(this._myEngine)) {
            this._setRuntimeParamsForUpdateSurfaceInfoCollisionCheckDisabled(transformQuat, collisionCheckParams, collisionRuntimeParams);
            return;
        }

        this._updateSurfaceInfo(transformQuat, collisionCheckParams, collisionRuntimeParams);
    }

    computeSurfacePerceivedAngle(surfaceNormal, forward, up, isGround = true) {
        // Implemented outside class definition
    }

    _updateSurfaceInfo(transformQuat, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }

    _postSurfaceCheck(fixedHorizontalMovement, originalVerticalMovement, transformUp, collisionCheckParams, collisionRuntimeParams, previousCollisionRuntimeParams) {
        // Implemented outside class definition
    }

    _surfaceTooSteep(up, direction, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }

    _adjustVerticalMovementWithSurface(horizontalMovement, verticalMovement, up, collisionCheckParams, collisionRuntimeParams, previousCollisionRuntimeParams, outAdjustedVerticalMovement) {
        // Implemented outside class definition
    }

    _adjustHorizontalMovementWithSurface(horizontalMovement, verticalMovement, up, collisionCheckParams, collisionRuntimeParams, previousCollisionRuntimeParams, outAdjustedHorizontalMovement) {
        // Implemented outside class definition
    }

    _computeExtraSurfaceVerticalMovement(horizontalMovement, up, collisionCheckParams, collisionRuntimeParams, outExtraSurfaceVerticalMovement) {
        // Implemented outside class definition
    }

    _gatherSurfaceInfo(feetPosition, height, up, forwardForPerceivedAngle, forwardForVertical, isGround, collisionCheckParams, collisionRuntimeParams) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

CollisionCheckSurface.prototype._updateSurfaceInfo = function () {
    let transformUp = vec3_create();
    let transformForward = vec3_create();
    let feetPosition = vec3_create();

    let transformOffsetLocalQuat = quat2_create();
    let offsetTransformQuat = quat2_create();

    let forwardForPerceivedAngle = vec3_create();
    let forwardForVertical = vec3_create();

    let zAxis = vec3_create(0, 0, 1);
    let xAxis = vec3_create(1, 0, 0);
    return function _updateSurfaceInfo(transformQuat, collisionCheckParams, collisionRuntimeParams) {
        transformOffsetLocalQuat.quat2_setPositionRotationQuat(collisionCheckParams.myPositionOffsetLocal, collisionCheckParams.myRotationOffsetLocalQuat);
        offsetTransformQuat = transformOffsetLocalQuat.quat2_toWorld(transformQuat, offsetTransformQuat);
        if (transformQuat.vec_equals(offsetTransformQuat, 0.00001)) {
            offsetTransformQuat.quat2_copy(transformQuat);
        }

        transformUp = offsetTransformQuat.quat2_getUp(transformUp);
        transformForward = offsetTransformQuat.quat2_getForward(transformForward);
        feetPosition = offsetTransformQuat.quat2_getPosition(feetPosition);

        let height = collisionCheckParams.myHeight;
        height = height - 0.00001; // This makes it easier to setup things at the same exact height of a character so that it can go under it
        if (height < 0.00001) {
            height = 0;
        }

        forwardForPerceivedAngle.vec3_copy(transformForward);

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

        if (collisionCheckParams.myComputeGroundInfoEnabled) {
            this._gatherSurfaceInfo(feetPosition, height, transformUp, forwardForPerceivedAngle, forwardForVertical, true, collisionCheckParams, collisionRuntimeParams);
        }

        if (collisionCheckParams.myComputeCeilingInfoEnabled) {
            this._gatherSurfaceInfo(feetPosition, height, transformUp, forwardForPerceivedAngle, forwardForVertical, false, collisionCheckParams, collisionRuntimeParams);
        }
    };
}();

CollisionCheckSurface.prototype._postSurfaceCheck = function () {
    let horizontalDirection = vec3_create();
    return function _postSurfaceCheck(fixedHorizontalMovement, originalVerticalMovement, transformUp, collisionCheckParams, collisionRuntimeParams, previousCollisionRuntimeParams) {

        let isVerticalMovementZero = originalVerticalMovement.vec3_isZero(0.00001);
        let isVerticalMovemenDownward = Math.pp_sign(originalVerticalMovement.vec3_lengthSigned(transformUp), -1) < 0;

        let horizontalMovementIsZero = fixedHorizontalMovement.vec3_isZero(0.00001);
        horizontalDirection = fixedHorizontalMovement.vec3_normalize(horizontalDirection);

        let groundPerceivedAngle = this.computeSurfacePerceivedAngle(collisionRuntimeParams.myGroundNormal, horizontalDirection, transformUp, true);
        let ceilingPerceivedAngle = this.computeSurfacePerceivedAngle(collisionRuntimeParams.myCeilingNormal, horizontalDirection, transformUp, false);

        let mustRemainOnGroundOk = true;
        if (collisionCheckParams.myMustStayOnGround) {
            if (previousCollisionRuntimeParams.myIsOnGround && !collisionRuntimeParams.myIsOnGround && (isVerticalMovementZero || isVerticalMovemenDownward)) {
                mustRemainOnGroundOk = false;
            }
        }

        let mustRemainOnCeilingOk = true;
        if (collisionCheckParams.myMustStayOnCeiling) {
            if (previousCollisionRuntimeParams.myIsOnCeiling && !collisionRuntimeParams.myIsOnCeiling && (isVerticalMovementZero || isVerticalMovemenDownward)) {
                mustRemainOnCeilingOk = false;
            }
        }

        let mustStayBelowGroundAngleOk = true;
        if (collisionCheckParams.myMustStayBelowGroundAngleDownhill != null || collisionCheckParams.myMustStayBelowIgnorableGroundAngleDownhill) {
            let minAngle = null;
            if (!collisionCheckParams.myMustStayBelowIgnorableGroundAngleDownhill) {
                minAngle = collisionCheckParams.myMustStayBelowGroundAngleDownhill;
            } else if (collisionCheckParams.myMustStayBelowGroundAngleDownhill == null) {
                minAngle = collisionCheckParams.myGroundAngleToIgnore;
            } else {
                minAngle = Math.min(collisionCheckParams.myMustStayBelowGroundAngleDownhill, collisionCheckParams.myGroundAngleToIgnore);
            }

            if (!horizontalMovementIsZero && groundPerceivedAngle < 0 && previousCollisionRuntimeParams.myIsOnGround &&
                previousCollisionRuntimeParams.myGroundAngle <= minAngle &&
                collisionRuntimeParams.myIsOnGround && collisionRuntimeParams.myGroundAngle > minAngle + 0.0001) {
                mustStayBelowGroundAngleOk = false;
            }
        }

        let mustStayBelowCeilingAngleOk = true;
        if (collisionCheckParams.myMustStayBelowCeilingAngleDownhill != null || collisionCheckParams.myMustStayBelowIgnorableCeilingAngleDownhill) {
            let minAngle = null;
            if (!collisionCheckParams.myMustStayBelowIgnorableCeilingAngleDownhill) {
                minAngle = collisionCheckParams.myMustStayBelowCeilingAngleDownhill;
            } else if (collisionCheckParams.myMustStayBelowCeilingAngleDownhill == null) {
                minAngle = collisionCheckParams.myCeilingAngleToIgnore;
            } else {
                minAngle = Math.min(collisionCheckParams.myMustStayBelowCeilingAngleDownhill, collisionCheckParams.myCeilingAngleToIgnore);
            }

            if (!horizontalMovementIsZero && groundPerceivedAngle < 0 && previousCollisionRuntimeParams.myIsOnCeiling &&
                previousCollisionRuntimeParams.myCeilingAngle <= minAngle &&
                collisionRuntimeParams.myIsOnCeiling && collisionRuntimeParams.myCeilingAngle > minAngle + 0.0001) {
                mustStayBelowCeilingAngleOk = false;
            }
        }

        let mustStayOnGroundHitAngleOk = true;
        if (collisionCheckParams.myMovementMustStayOnGroundHitAngle != null) {
            if (!horizontalMovementIsZero && previousCollisionRuntimeParams.myIsOnGround &&
                previousCollisionRuntimeParams.myGroundHitMaxAngle <= collisionCheckParams.myMovementMustStayOnGroundHitAngle &&
                collisionRuntimeParams.myIsOnGround && collisionRuntimeParams.myGroundHitMaxAngle > collisionCheckParams.myMovementMustStayOnGroundHitAngle + 0.0001) {
                mustStayOnGroundHitAngleOk = false;
            }
        }

        let mustStayOnCeilingHitAngleOk = true;
        if (collisionCheckParams.myMovementMustStayOnCeilingHitAngle != null) {
            if (!horizontalMovementIsZero && previousCollisionRuntimeParams.myIsOnCeiling &&
                previousCollisionRuntimeParams.myCeilingHitMaxAngle <= collisionCheckParams.myMovementMustStayOnCeilingHitAngle &&
                collisionRuntimeParams.myIsOnCeiling && collisionRuntimeParams.myCeilingHitMaxAngle > collisionCheckParams.myMovementMustStayOnCeilingHitAngle + 0.0001) {
                mustStayOnCeilingHitAngleOk = false;
            }
        }

        let isOnValidGroundAngleUphill = true;
        let isOnValidGroundAngleDownhill = true;
        if (collisionRuntimeParams.myIsOnGround && collisionRuntimeParams.myGroundAngle > collisionCheckParams.myGroundAngleToIgnore + 0.0001) {
            if (previousCollisionRuntimeParams.myIsOnGround && !horizontalMovementIsZero) {
                if (groundPerceivedAngle > 0) {
                    isOnValidGroundAngleUphill = false;
                    if (collisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle != null &&
                        collisionRuntimeParams.myGroundAngle <= collisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle + 0.0001) {
                        isOnValidGroundAngleUphill = Math.abs(groundPerceivedAngle) <= collisionCheckParams.myGroundAngleToIgnore + 0.0001;
                    }
                } else if (groundPerceivedAngle < 0) {
                    if (previousCollisionRuntimeParams.myGroundAngle <= collisionCheckParams.myGroundAngleToIgnore + 0.0001) {
                        if (collisionCheckParams.myMustStayOnValidGroundAngleDownhill) {
                            isOnValidGroundAngleDownhill = false;
                        }
                    }
                }
            }
        }

        let isOnValidCeilingAngleUphill = true;
        let isOnValidCeilingAngleDownhill = true;
        if (collisionRuntimeParams.myIsOnCeiling && collisionRuntimeParams.myCeilingAngle > collisionCheckParams.myCeilingAngleToIgnore + 0.0001) {
            if (previousCollisionRuntimeParams.myIsOnCeiling && !horizontalMovementIsZero) {
                if (ceilingPerceivedAngle > 0) {
                    isOnValidCeilingAngleUphill = false;
                    if (collisionCheckParams.myCeilingAngleToIgnoreWithPerceivedAngle != null &&
                        collisionRuntimeParams.myCeilingAngle <= collisionCheckParams.myCeilingAngleToIgnoreWithPerceivedAngle + 0.0001) {
                        isOnValidCeilingAngleUphill = Math.abs(ceilingPerceivedAngle) <= collisionCheckParams.myCeilingAngleToIgnore + 0.0001;
                    }
                } else if (ceilingPerceivedAngle < 0) {
                    if (previousCollisionRuntimeParams.myCeilingAngle <= collisionCheckParams.myCeilingAngleToIgnore + 0.0001) {
                        if (collisionCheckParams.myMustStayOnValidCeilingAngleDownhill) {
                            isOnValidCeilingAngleDownhill = false;
                        }
                    }
                }
            }
        }

        return mustRemainOnGroundOk && mustRemainOnCeilingOk && mustStayBelowGroundAngleOk && mustStayBelowCeilingAngleOk && mustStayOnGroundHitAngleOk && mustStayOnCeilingHitAngleOk && isOnValidGroundAngleUphill && isOnValidGroundAngleDownhill && isOnValidCeilingAngleUphill && isOnValidCeilingAngleDownhill;
    };
}();

CollisionCheckSurface.prototype._surfaceTooSteep = function () {
    let surfaceSteepResults = [false, false];
    return function _surfaceTooSteep(up, direction, collisionCheckParams, collisionRuntimeParams) {
        let groundTooSteep = false;
        let ceilingTooSteep = false;

        if (collisionRuntimeParams.myIsOnGround && collisionRuntimeParams.myGroundAngle > collisionCheckParams.myGroundAngleToIgnore + 0.0001) {
            let groundPerceivedAngle = this.computeSurfacePerceivedAngle(
                collisionRuntimeParams.myGroundNormal,
                direction, up, true);

            groundTooSteep = groundPerceivedAngle > 0;
            if (groundTooSteep &&
                collisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle != null &&
                collisionRuntimeParams.myGroundAngle <= collisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle + 0.0001) {
                groundTooSteep = Math.abs(groundPerceivedAngle) > collisionCheckParams.myGroundAngleToIgnore + 0.0001;
            }
        }

        if (!groundTooSteep) {
            if (collisionRuntimeParams.myIsOnCeiling && collisionRuntimeParams.myCeilingAngle > collisionCheckParams.myCeilingAngleToIgnore + 0.0001) {
                let ceilingPerceivedAngle = this.computeSurfacePerceivedAngle(
                    collisionRuntimeParams.myCeilingNormal,
                    direction, up, false);

                ceilingTooSteep = ceilingPerceivedAngle > 0;
                if (ceilingTooSteep &&
                    collisionCheckParams.myCeilingAngleToIgnoreWithPerceivedAngle != null &&
                    collisionRuntimeParams.myCeilingAngle <= collisionCheckParams.myCeilingAngleToIgnoreWithPerceivedAngle + 0.0001) {
                    ceilingTooSteep = Math.abs(ceilingPerceivedAngle) > collisionCheckParams.myCeilingAngleToIgnore + 0.0001;
                }
            }
        }

        surfaceSteepResults[0] = groundTooSteep;
        surfaceSteepResults[1] = ceilingTooSteep;
        return surfaceSteepResults;
    };
}();

CollisionCheckSurface.prototype._adjustVerticalMovementWithSurface = function () {
    let horizontalDirection = vec3_create();
    let extraVerticalMovement = vec3_create();
    return function _adjustVerticalMovementWithSurface(horizontalMovement, verticalMovement, up, collisionCheckParams, collisionRuntimeParams, previousCollisionRuntimeParams, outAdjustedVerticalMovement) {
        outAdjustedVerticalMovement.vec3_copy(verticalMovement);

        if (horizontalMovement.vec3_isZero(0.00001)) {
            return outAdjustedVerticalMovement;
        }

        let extraVerticalLength = 0;
        horizontalDirection = horizontalMovement.vec3_normalize(horizontalDirection);

        if (previousCollisionRuntimeParams.myIsOnGround) {
            let groundPerceivedAngle = this.computeSurfacePerceivedAngle(
                previousCollisionRuntimeParams.myGroundNormal,
                horizontalDirection, up, true);

            let groundExtraVerticalLength = horizontalMovement.vec3_length() * Math.tan(Math.pp_toRadians(Math.abs(groundPerceivedAngle)));
            groundExtraVerticalLength *= Math.pp_sign(groundPerceivedAngle);

            if (Math.abs(groundExtraVerticalLength) > 0.00001) {
                if (groundPerceivedAngle > 0) {
                    if (collisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphill &&
                        (collisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphillMaxPerceivedAngle == null || Math.abs(groundPerceivedAngle) <= collisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphillMaxPerceivedAngle) &&
                        (collisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphillMaxAngle == null || previousCollisionRuntimeParams.myGroundAngle <= collisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphillMaxAngle)) {
                        extraVerticalLength = groundExtraVerticalLength;
                        collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleUphill = true;
                    }
                } else if (groundPerceivedAngle < 0) {
                    if (collisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhill &&
                        (collisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhillMaxPerceivedAngle == null || Math.abs(groundPerceivedAngle) <= collisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhillMaxPerceivedAngle) &&
                        (collisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhillMaxAngle == null || previousCollisionRuntimeParams.myGroundAngle <= collisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhillMaxAngle)) {
                        extraVerticalLength = groundExtraVerticalLength;
                        collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleDownhill = true;
                    }
                }
            }
        }

        if (previousCollisionRuntimeParams.myIsOnCeiling) {
            let ceilingPerceivedAngle = this.computeSurfacePerceivedAngle(
                previousCollisionRuntimeParams.myCeilingNormal,
                horizontalDirection, up, false);

            let ceilingExtraVerticalLength = horizontalMovement.vec3_length() * Math.tan(Math.pp_toRadians(Math.abs(ceilingPerceivedAngle)));
            ceilingExtraVerticalLength *= Math.pp_sign(ceilingPerceivedAngle);

            if (Math.abs(ceilingExtraVerticalLength) > 0.00001) {
                let sameSignThanGround = Math.pp_sign(extraVerticalLength) == Math.pp_sign(ceilingExtraVerticalLength);
                if (extraVerticalLength == 0 || (sameSignThanGround && Math.abs(ceilingExtraVerticalLength) > Math.abs(extraVerticalLength))) {
                    if (ceilingPerceivedAngle > 0) {
                        if (collisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphill &&
                            (collisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphillMaxPerceivedAngle == null || Math.abs(ceilingPerceivedAngle) <= collisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphillMaxPerceivedAngle) &&
                            (collisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphillMaxAngle == null || previousCollisionRuntimeParams.myCeilingAngle <= collisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphillMaxAngle)) {
                            extraVerticalLength = ceilingExtraVerticalLength;
                            collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleUphill = true;
                            collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleUphill = false;
                        }
                    } else if (ceilingPerceivedAngle < 0) {
                        if (collisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhill &&
                            (collisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhillMaxPerceivedAngle == null || Math.abs(ceilingPerceivedAngle) <= collisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhillMaxPerceivedAngle) &&
                            (collisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhillMaxAngle == null || previousCollisionRuntimeParams.myCeilingAngle <= collisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhillMaxAngle)) {
                            extraVerticalLength = ceilingExtraVerticalLength;
                            collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleDownhill = true;
                            collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleDownhill = false;
                        }
                    }
                }
            }
        }

        if (Math.abs(extraVerticalLength) > 0.00001) {
            let verticalMovementLength = verticalMovement.vec3_lengthSigned(up);
            let sameSignThanExtra = Math.pp_sign(extraVerticalLength) == Math.pp_sign(verticalMovementLength);
            extraVerticalMovement = up.vec3_scale(extraVerticalLength, extraVerticalMovement);
            if (verticalMovement.vec3_isZero(0.00001)) {
                outAdjustedVerticalMovement.vec3_copy(extraVerticalMovement);
            } else if (sameSignThanExtra) {
                outAdjustedVerticalMovement = verticalMovement.vec3_add(extraVerticalMovement, outAdjustedVerticalMovement);
            } else if (!sameSignThanExtra && (
                collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleUphill ||
                collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleUphill)) {
                // Do not add for downhill, since it means the vertical movement was about to go away from surface and u should not cancel that
                outAdjustedVerticalMovement = verticalMovement.vec3_add(extraVerticalMovement, outAdjustedVerticalMovement);
            } else {
                collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleUphill = false;
                collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleUphill = false;
                collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleDownhill = false;
                collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleDownhill = false;
            }
        }

        if (outAdjustedVerticalMovement.vec3_isZero(0.000001)) {
            outAdjustedVerticalMovement.vec3_zero();
        }

        return outAdjustedVerticalMovement;
    };
}();

CollisionCheckSurface.prototype._adjustHorizontalMovementWithSurface = function () {
    let extraHorizontalMovement = vec3_create();
    let groundHorizontalDirection = vec3_create();
    let ceilingHorizontalDirection = vec3_create();
    let scaledCeilingHorizontalDirection = vec3_create();
    let scaledCeilingHorizontalDirectionAlongGroundHorizontalDirection = vec3_create();
    let scaledCeilingHorizontalDirectionWithoutGroundHorizontalDirection = vec3_create();
    return function _adjustHorizontalMovementWithSurface(horizontalMovement, verticalMovement, up, collisionCheckParams, collisionRuntimeParams, previousCollisionRuntimeParams, outAdjustedHorizontalMovement) {
        outAdjustedHorizontalMovement.vec3_copy(horizontalMovement);

        if (verticalMovement.vec3_isZero(0.00001)) {
            return outAdjustedHorizontalMovement;
        }

        let isMovementDownward = !verticalMovement.vec3_isConcordant(up);

        extraHorizontalMovement.vec3_zero();
        groundHorizontalDirection.vec3_zero();

        if (previousCollisionRuntimeParams.myIsOnGround) {
            groundHorizontalDirection = previousCollisionRuntimeParams.myGroundNormal.vec3_removeComponentAlongAxis(up, groundHorizontalDirection);
            if (!groundHorizontalDirection.vec3_isZero(0.00001)) {
                groundHorizontalDirection.vec3_normalize(groundHorizontalDirection);

                let groundExtraHorizontalLength = verticalMovement.vec3_length() / Math.tan(Math.pp_toRadians(previousCollisionRuntimeParams.myGroundAngle));
                groundExtraHorizontalLength *= (isMovementDownward) ? 1 : -1;

                if (Math.abs(groundExtraHorizontalLength) > 0.00001) {
                    if (isMovementDownward) {
                        if (collisionCheckParams.myAdjustHorizontalMovementWithGroundAngleDownhill &&
                            (collisionCheckParams.myAdjustHorizontalMovementWithGroundAngleDownhillMinAngle == null || previousCollisionRuntimeParams.myGroundAngle >= collisionCheckParams.myAdjustHorizontalMovementWithGroundAngleDownhillMinAngle)) {
                            extraHorizontalMovement = groundHorizontalDirection.vec3_scale(groundExtraHorizontalLength, extraHorizontalMovement);
                            collisionRuntimeParams.myVerticalMovementHasAdjustedHorizontalMovementOverGroundAngleDownhill = true;
                        }
                    }
                }
            }
        }

        if (previousCollisionRuntimeParams.myIsOnCeiling) {
            ceilingHorizontalDirection = previousCollisionRuntimeParams.myCeilingNormal.vec3_removeComponentAlongAxis(up, ceilingHorizontalDirection);
            if (!ceilingHorizontalDirection.vec3_isZero(0.00001)) {
                ceilingHorizontalDirection.vec3_normalize(ceilingHorizontalDirection);

                let ceilingExtraHorizontalLength = verticalMovement.vec3_length() / Math.tan(Math.pp_toRadians(previousCollisionRuntimeParams.myCeilingAngle));
                ceilingExtraHorizontalLength *= (isMovementDownward) ? -1 : 1;

                if (Math.abs(ceilingExtraHorizontalLength) > 0.00001) {
                    let sameDirectionAsGround = ceilingHorizontalDirection.vec3_isConcordant(groundHorizontalDirection);
                    if (extraHorizontalMovement.vec3_isZero() || sameDirectionAsGround) {
                        if (!isMovementDownward) {
                            if (collisionCheckParams.myAdjustHorizontalMovementWithCeilingAngleDownhill &&
                                (collisionCheckParams.myAdjustHorizontalMovementWithCeilingAngleDownhillMinAngle == null || previousCollisionRuntimeParams.myCeilingAngle >= collisionCheckParams.myAdjustHorizontalMovementWithCeilingAngleDownhillMinAngle)) {
                                scaledCeilingHorizontalDirection = ceilingHorizontalDirection.vec3_scale(ceilingExtraHorizontalLength, scaledCeilingHorizontalDirection);
                                if (!groundHorizontalDirection.vec3_isZero()) {
                                    scaledCeilingHorizontalDirectionWithoutGroundHorizontalDirection = scaledCeilingHorizontalDirection.vec3_removeComponentAlongAxis(scaledCeilingHorizontalDirectionWithoutGroundHorizontalDirection);
                                    scaledCeilingHorizontalDirectionAlongGroundHorizontalDirection = scaledCeilingHorizontalDirection.vec3_componentAlongAxis(scaledCeilingHorizontalDirectionWithoutGroundHorizontalDirection);

                                    if (scaledCeilingHorizontalDirectionAlongGroundHorizontalDirection.vec3_isFartherAlongAxis(extraHorizontalMovement, groundHorizontalDirection)) {
                                        collisionRuntimeParams.myVerticalMovementHasAdjustedHorizontalMovementOverGroundAngleDownhill = false;
                                        extraHorizontalMovement.vec3_copy(scaledCeilingHorizontalDirection);
                                        collisionRuntimeParams.myVerticalMovementHasAdjustedHorizontalMovementOverCeilingAngleDownhill = true;
                                    } else if (!scaledCeilingHorizontalDirectionWithoutGroundHorizontalDirection.vec3_isZero(0.00001)) {
                                        extraHorizontalMovement = extraHorizontalMovement.vec3_add(scaledCeilingHorizontalDirectionWithoutGroundHorizontalDirection, extraHorizontalMovement);
                                        collisionRuntimeParams.myVerticalMovementHasAdjustedHorizontalMovementOverCeilingAngleDownhill = true;
                                    }
                                } else {
                                    extraHorizontalMovement.vec3_copy(scaledCeilingHorizontalDirection);
                                    collisionRuntimeParams.myVerticalMovementHasAdjustedHorizontalMovementOverCeilingAngleDownhill = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!extraHorizontalMovement.vec3_isZero()) {
            if (horizontalMovement.vec3_isZero(0.00001)) {
                outAdjustedHorizontalMovement.vec3_copy(extraHorizontalMovement);
            } else if (extraHorizontalMovement.vec3_isConcordant(horizontalMovement)) {
                outAdjustedHorizontalMovement = horizontalMovement.vec3_add(extraHorizontalMovement, outAdjustedHorizontalMovement);
            } else {
                outAdjustedHorizontalMovement = horizontalMovement.vec3_add(extraHorizontalMovement, outAdjustedHorizontalMovement);
            }
        }

        if (outAdjustedHorizontalMovement.vec3_isZero(0.000001)) {
            outAdjustedHorizontalMovement.vec3_zero();
        }

        return outAdjustedHorizontalMovement;
    };
}();

// Useless now
CollisionCheckSurface.prototype._computeExtraSurfaceVerticalMovement = function () {
    let direction = vec3_create();
    let tempVector = vec3_create();
    return function _computeExtraSurfaceVerticalMovement(horizontalMovement, up, collisionCheckParams, collisionRuntimeParams, outExtraSurfaceVerticalMovement) {
        outExtraSurfaceVerticalMovement.vec3_zero();

        if (!horizontalMovement.vec3_isZero()) {
            if (collisionRuntimeParams.myIsOnGround && collisionRuntimeParams.myGroundAngle != 0) {
                direction = horizontalMovement.vec3_normalize(direction);
                let groundPerceivedAngle = this.computeSurfacePerceivedAngle(
                    collisionRuntimeParams.myGroundNormal,
                    direction, up, true);

                let extraVerticalLength = horizontalMovement.vec3_length() * Math.tan(Math.pp_toRadians(Math.abs(groundPerceivedAngle)));
                extraVerticalLength *= Math.pp_sign(groundPerceivedAngle);

                if (Math.abs(extraVerticalLength) > 0.00001 && (collisionCheckParams.mySnapOnGroundEnabled || extraVerticalLength > 0)) {
                    outExtraSurfaceVerticalMovement.vec3_add(up.vec3_scale(extraVerticalLength, tempVector), outExtraSurfaceVerticalMovement);
                }
            } else if (collisionRuntimeParams.myIsOnCeiling && collisionRuntimeParams.myCeilingAngle != 0) {
                direction = horizontalMovement.vec3_normalize(direction);
                let ceilingPerceivedAngle = this.computeSurfacePerceivedAngle(
                    collisionRuntimeParams.myCeilingNormal,
                    direction, up, false);

                let extraVerticalLength = horizontalMovement.vec3_length() * Math.tan(Math.pp_toRadians(Math.abs(ceilingPerceivedAngle)));
                extraVerticalLength *= Math.pp_sign(ceilingPerceivedAngle);
                extraVerticalLength *= -1;

                if (Math.abs(extraVerticalLength) > 0.00001 && (collisionCheckParams.mySnapOnCeilingEnabled || extraVerticalLength < 0)) {
                    outExtraSurfaceVerticalMovement.vec3_add(up.vec3_scale(extraVerticalLength, tempVector), outExtraSurfaceVerticalMovement);
                }
            }
        }

        return outExtraSurfaceVerticalMovement;
    };
}();

CollisionCheckSurface.prototype._gatherSurfaceInfo = function () {
    let verticalDirection = vec3_create();
    let startOffset = vec3_create();
    let endOffset = vec3_create();
    let heightOffset = vec3_create();
    let smallOffset = vec3_create();
    let smallStartPosition = vec3_create();
    let smallEndPosition = vec3_create();
    let surfaceNormal = vec3_create();
    let surfaceHitMaxNormal = vec3_create();
    let hitFromCurrentPosition = vec3_create();
    let startPosition = vec3_create();
    let endPosition = vec3_create();
    let direction = vec3_create();

    let surfaceCollisionHit = new RaycastHit();
    let surfaceCollisionHitForBaseInsideCollision = new RaycastHit();
    return function _gatherSurfaceInfo(feetPosition, height, up, forwardForPerceivedAngle, forwardForVertical, isGround, collisionCheckParams, collisionRuntimeParams) {
        this._myDebugEnabled = collisionCheckParams.myDebugEnabled && ((isGround && collisionCheckParams.myDebugGroundInfoEnabled) || (!isGround && collisionCheckParams.myDebugCeilingInfoEnabled));

        let checkPositions = this._getVerticalCheckPositions(feetPosition, up, forwardForVertical, collisionCheckParams, collisionRuntimeParams);

        verticalDirection.vec3_copy(up);
        let distanceToBeOnSurface = collisionCheckParams.myDistanceToBeOnGround;
        let distanceToComputeSurfaceInfo = collisionCheckParams.myDistanceToComputeGroundInfo;
        let distanceToFindSurfaceDistance = collisionCheckParams.myFindGroundDistanceMaxOutsideDistance;
        let distanceToCollectCollisionHit = collisionCheckParams.myCollectGroundCollisionHitOutsideDistance;
        let verticalFixToBeOnSurface = collisionCheckParams.myVerticalFixToBeOnGround;
        let verticalFixToComputeSurfaceInfo = collisionCheckParams.myVerticalFixToComputeGroundInfo;
        let verticalFixToFindSurfaceDistance = collisionCheckParams.myFindGroundDistanceMaxInsideDistance;
        let verticalFixToCollectCollisionHit = collisionCheckParams.myCollectGroundCollisionHitInsideDistance;
        let isOnSurfaceIfInsideHit = collisionCheckParams.myIsOnGroundIfInsideHit;
        let isBaseInsideCollisionCheckEnabled = collisionCheckParams.myGroundIsBaseInsideCollisionCheckEnabled;
        if (!isGround) {
            verticalDirection.vec3_negate(verticalDirection);
            distanceToBeOnSurface = collisionCheckParams.myDistanceToBeOnCeiling;
            distanceToComputeSurfaceInfo = collisionCheckParams.myDistanceToComputeCeilingInfo;
            distanceToFindSurfaceDistance = collisionCheckParams.myFindCeilingDistanceMaxOutsideDistance;
            distanceToCollectCollisionHit = collisionCheckParams.myCollectCeilingCollisionHitOutsideDistance;
            verticalFixToBeOnSurface = collisionCheckParams.myVerticalFixToBeOnCeiling;
            verticalFixToComputeSurfaceInfo = collisionCheckParams.myVerticalFixToComputeCeilingInfo;
            verticalFixToFindSurfaceDistance = collisionCheckParams.myFindCeilingDistanceMaxInsideDistance;
            verticalFixToCollectCollisionHit = collisionCheckParams.myCollectCeilingCollisionHitInsideDistance;
            isOnSurfaceIfInsideHit = collisionCheckParams.myIsOnCeilingIfInsideHit;
            isBaseInsideCollisionCheckEnabled = collisionCheckParams.myCeilingIsBaseInsideCollisionCheckEnabled;
        }

        startOffset = verticalDirection.vec3_scale(Math.max(verticalFixToBeOnSurface, verticalFixToComputeSurfaceInfo, verticalFixToFindSurfaceDistance, 0.00001), startOffset);
        endOffset = verticalDirection.vec3_negate(endOffset).vec3_scale(Math.max(distanceToBeOnSurface, distanceToComputeSurfaceInfo, distanceToFindSurfaceDistance, 0.00001), endOffset);

        heightOffset.vec3_zero();
        if (!isGround) {
            heightOffset = up.vec3_scale(height, heightOffset);
        }

        smallOffset = verticalDirection.vec3_scale(0.0001, smallOffset);

        let isOnSurface = false;
        let isActuallyOnSurface = false;
        let surfaceAngle = 0;
        let surfacePerceivedAngle = 0;
        surfaceNormal.vec3_zero();
        surfaceCollisionHit.reset();
        surfaceCollisionHitForBaseInsideCollision.reset();

        let surfaceHitMaxAngle = 0;
        surfaceHitMaxNormal.vec3_zero();

        let surfaceDistance = null;
        let surfaceDistanceForCollectCollisionHit = null;
        let isBaseInsideCollision = checkPositions.length > 0;

        for (let i = 0; i < checkPositions.length; i++) {
            let currentPosition = checkPositions[i];
            currentPosition.vec3_add(heightOffset, currentPosition);

            let baseHitIsInsideCollision = false;
            if (isBaseInsideCollisionCheckEnabled) {
                smallStartPosition = currentPosition.vec3_add(smallOffset, smallStartPosition);
                smallEndPosition = currentPosition.vec3_sub(smallOffset, smallEndPosition);

                let origin = smallStartPosition;
                direction = smallEndPosition.vec3_sub(origin, direction);
                let distance = direction.vec3_length();
                direction.vec3_normalize(direction);
                let raycastResult = this._raycastAndDebug(origin, direction, distance, false, false, collisionCheckParams, collisionRuntimeParams);

                if (raycastResult.isColliding()) {
                    baseHitIsInsideCollision = raycastResult.myHits[0].myInsideCollision;
                    surfaceCollisionHitForBaseInsideCollision.copy(raycastResult.myHits[0]);
                }
            }

            isBaseInsideCollision &&= baseHitIsInsideCollision;

            if (!baseHitIsInsideCollision) {
                startPosition = currentPosition.vec3_add(startOffset, startPosition);
                endPosition = currentPosition.vec3_add(endOffset, endPosition);

                let origin = startPosition;
                direction = endPosition.vec3_sub(origin, direction);
                let distance = direction.vec3_length();
                direction.vec3_normalize(direction);
                let raycastResult = this._raycastAndDebug(origin, direction, distance, true, false, collisionCheckParams, collisionRuntimeParams);

                if (raycastResult.isColliding()) {
                    hitFromCurrentPosition = raycastResult.myHits[0].myPosition.vec3_sub(currentPosition, hitFromCurrentPosition);
                    let hitFromCurrentPositionLength = hitFromCurrentPosition.vec3_lengthSigned(verticalDirection);

                    if ((hitFromCurrentPositionLength >= 0 && hitFromCurrentPositionLength <= verticalFixToBeOnSurface + 0.00001) ||
                        (hitFromCurrentPositionLength < 0 && Math.abs(hitFromCurrentPositionLength) <= distanceToBeOnSurface + 0.00001)) {
                        isOnSurface = true;
                        isActuallyOnSurface = true;
                    }

                    if ((hitFromCurrentPositionLength >= 0 && hitFromCurrentPositionLength <= verticalFixToComputeSurfaceInfo + 0.00001) ||
                        (hitFromCurrentPositionLength < 0 && Math.abs(hitFromCurrentPositionLength) <= distanceToComputeSurfaceInfo + 0.00001)) {
                        let currentSurfaceNormal = raycastResult.myHits[0].myNormal;
                        surfaceNormal.vec3_add(currentSurfaceNormal, surfaceNormal);

                        let surfaceHitAngle = currentSurfaceNormal.vec3_angle(verticalDirection);
                        if (surfaceHitAngle > surfaceHitMaxAngle) {
                            surfaceHitMaxAngle = surfaceHitAngle;
                            surfaceHitMaxNormal.vec3_copy(currentSurfaceNormal);
                        }
                    }

                    if ((hitFromCurrentPositionLength >= 0 && hitFromCurrentPositionLength <= verticalFixToFindSurfaceDistance + 0.00001) ||
                        (hitFromCurrentPositionLength < 0 && Math.abs(hitFromCurrentPositionLength) <= distanceToFindSurfaceDistance + 0.00001)) {
                        if (surfaceDistance == null) {
                            surfaceDistance = -hitFromCurrentPositionLength;
                        } else {
                            if (Math.abs(hitFromCurrentPositionLength) < Math.abs(surfaceDistance)) {
                                surfaceDistance = -hitFromCurrentPositionLength;
                            }
                        }
                    }

                    if ((hitFromCurrentPositionLength >= 0 && hitFromCurrentPositionLength <= verticalFixToCollectCollisionHit + 0.00001) ||
                        (hitFromCurrentPositionLength < 0 && Math.abs(hitFromCurrentPositionLength) <= distanceToCollectCollisionHit + 0.00001)) {
                        if (surfaceDistanceForCollectCollisionHit == null) {
                            surfaceDistanceForCollectCollisionHit = -hitFromCurrentPositionLength;
                            surfaceCollisionHit.copy(raycastResult.myHits[0]);
                        } else {
                            if (Math.abs(hitFromCurrentPositionLength) < Math.abs(surfaceDistanceForCollectCollisionHit)) {
                                surfaceDistanceForCollectCollisionHit = -hitFromCurrentPositionLength;
                                surfaceCollisionHit.copy(raycastResult.myHits[0]);
                            }
                        }
                    }
                }
            } else if (isOnSurfaceIfInsideHit) {
                if (!isOnSurface) {
                    isOnSurface = true;
                    if (!surfaceCollisionHit.isValid()) {
                        surfaceCollisionHit.copy(surfaceCollisionHitForBaseInsideCollision);
                    }
                }
            }
        }

        if (!surfaceNormal.vec3_isZero()) {
            surfaceNormal.vec3_normalize(surfaceNormal);
            surfaceAngle = surfaceNormal.vec3_angle(verticalDirection);

            if (surfaceAngle <= 0.0001) {
                surfaceAngle = 0;
                surfaceNormal.vec3_copy(verticalDirection);
            } else if (surfaceAngle >= 180 - 0.0001) {
                surfaceAngle = 180;
                surfaceNormal = verticalDirection.vec3_negate(surfaceNormal);
            }

            surfacePerceivedAngle = this.computeSurfacePerceivedAngle(surfaceNormal, forwardForPerceivedAngle, up, isGround);
        }

        if (isGround) {
            collisionRuntimeParams.myRealIsOnGround = isOnSurface;

            collisionRuntimeParams.myGroundCollisionHit.copy(surfaceCollisionHit);

            collisionRuntimeParams.myGroundAngle = surfaceAngle;
            collisionRuntimeParams.myGroundPerceivedAngle = surfacePerceivedAngle;
            collisionRuntimeParams.myGroundNormal.vec3_copy(surfaceNormal);

            collisionRuntimeParams.myGroundHitMaxAngle = surfaceHitMaxAngle;
            collisionRuntimeParams.myGroundHitMaxNormal.vec3_copy(surfaceHitMaxNormal);

            collisionRuntimeParams.myGroundDistance = surfaceDistance;

            collisionRuntimeParams.myGroundIsBaseInsideCollision = isBaseInsideCollision;

            if (isOnSurface && (collisionCheckParams.myIsOnGroundMaxSurfaceAngle == null || collisionRuntimeParams.myGroundAngle <= collisionCheckParams.myIsOnGroundMaxSurfaceAngle)) {
                collisionRuntimeParams.myIsOnGround = true;
            } else {
                collisionRuntimeParams.myIsOnGround = false;
            }

            collisionRuntimeParams.myOnGroundDueToBasePartiallyInsideCollision = isOnSurface && !isActuallyOnSurface;
        } else {
            collisionRuntimeParams.myRealIsOnCeiling = isOnSurface;

            collisionRuntimeParams.myCeilingCollisionHit.copy(surfaceCollisionHit);

            collisionRuntimeParams.myCeilingAngle = surfaceAngle;
            collisionRuntimeParams.myCeilingPerceivedAngle = surfacePerceivedAngle;
            collisionRuntimeParams.myCeilingNormal.vec3_copy(surfaceNormal);

            collisionRuntimeParams.myCeilingHitMaxAngle = surfaceHitMaxAngle;
            collisionRuntimeParams.myCeilingHitMaxNormal.vec3_copy(surfaceHitMaxNormal);

            collisionRuntimeParams.myCeilingDistance = surfaceDistance;

            collisionRuntimeParams.myCeilingIsBaseInsideCollision = isBaseInsideCollision;

            if (isOnSurface && (collisionCheckParams.myIsOnCeilingMaxSurfaceAngle == null || collisionRuntimeParams.myCeilingAngle <= collisionCheckParams.myIsOnCeilingMaxSurfaceAngle)) {
                collisionRuntimeParams.myIsOnCeiling = true;
            } else {
                collisionRuntimeParams.myIsOnCeiling = false;
            }

            collisionRuntimeParams.myOnCeilingDueToBasePartiallyInsideCollision = isOnSurface && !isActuallyOnSurface;
        }
    };
}();

CollisionCheckSurface.prototype.computeSurfacePerceivedAngle = function () {
    let forwardOnSurface = vec3_create();
    let verticalDirection = vec3_create();
    return function computeSurfacePerceivedAngle(surfaceNormal, forward, up, isGround = true) {
        let surfacePerceivedAngle = 0;

        verticalDirection.vec3_copy(up);
        if (!isGround) {
            verticalDirection.vec3_negate(verticalDirection);
        }

        let surfaceAngle = surfaceNormal.vec3_angle(verticalDirection);
        if (surfaceAngle <= Math.PP_EPSILON_DEGREES) {
            surfaceAngle = 0;
        } else if (surfaceAngle >= 180 - Math.PP_EPSILON_DEGREES) {
            surfaceAngle = 180;
        }

        forwardOnSurface = forward.vec3_projectOnPlaneAlongAxis(surfaceNormal, up, forwardOnSurface);
        surfacePerceivedAngle = forwardOnSurface.vec3_angle(forward);

        let isFartherOnUp = forwardOnSurface.vec3_isFartherAlongAxis(forward, up);
        if ((!isFartherOnUp && isGround) || (isFartherOnUp && !isGround)) {
            surfacePerceivedAngle *= -1;
        }

        if (Math.abs(surfacePerceivedAngle) >= surfaceAngle) {
            if (surfaceAngle != 0 && surfaceAngle != 180) {
                surfacePerceivedAngle = surfaceAngle * Math.pp_sign(surfacePerceivedAngle);
            } else {
                surfacePerceivedAngle = surfaceAngle;
            }
        }

        return surfacePerceivedAngle;
    };
}();
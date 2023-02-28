PP.CollisionCheckBridge = {
    _myCollisionCheck: new PP.CollisionCheck(),

    checkMovement: function () {
        let collisionCheckParams = new PP.CollisionCheckParams();
        let collisionRuntimeParams = new PP.CollisionRuntimeParams();
        return function checkMovement(movement, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
            this.convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, collisionCheckParams);
            this.convertCharacterCollisionResultsToCollisionRuntimeParams(prevCharacterCollisionResults, collisionRuntimeParams);
            this._myCollisionCheck.move(movement, currentTransformQuat, collisionCheckParams, collisionRuntimeParams);
            this.convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, currentTransformQuat, outCharacterCollisionResults);
        }
    }(),
    checkTeleportToTransform: function () {
        let teleportPosition = PP.vec3_create();
        let collisionCheckParams = new PP.CollisionCheckParams();
        let collisionRuntimeParams = new PP.CollisionRuntimeParams();
        return function checkTeleportToTransform(teleportTransformQuat, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
            this.convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, collisionCheckParams);
            this.convertCharacterCollisionResultsToCollisionRuntimeParams(prevCharacterCollisionResults, collisionRuntimeParams);
            teleportPosition = teleportTransformQuat.quat2_getPosition(teleportPosition);
            this._myCollisionCheck.teleport(teleportPosition, teleportTransformQuat, collisionCheckParams, collisionRuntimeParams);
            this.convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, currentTransformQuat, outCharacterCollisionResults);
        }
    }(),
    checkTransform: function () {
        let collisionCheckParams = new PP.CollisionCheckParams();
        let collisionRuntimeParams = new PP.CollisionRuntimeParams();
        return function checkTransform(checkTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
            this.convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, collisionCheckParams);
            this.convertCharacterCollisionResultsToCollisionRuntimeParams(prevCharacterCollisionResults, collisionRuntimeParams);
            this._myCollisionCheck.positionCheck(true, checkTransformQuat, collisionCheckParams, collisionRuntimeParams);
            this.convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, checkTransformQuat, outCharacterCollisionResults);
        }
    }(),
    updateGroundInfo: function () {
        let collisionCheckParams = new PP.CollisionCheckParams();
        let collisionRuntimeParams = new PP.CollisionRuntimeParams();
        return function updateGroundInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
            this.convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, collisionCheckParams);
            this.convertCharacterCollisionResultsToCollisionRuntimeParams(prevCharacterCollisionResults, collisionRuntimeParams);
            collisionCheckParams.myComputeCeilingInfoEnabled = false;
            this._myCollisionCheck.updateSurfaceInfo(currentTransformQuat, collisionCheckParams, collisionRuntimeParams);
            this.convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, currentTransformQuat, outCharacterCollisionResults);
        }
    }(),
    updateCeilingInfo: function () {
        let collisionCheckParams = new PP.CollisionCheckParams();
        let collisionRuntimeParams = new PP.CollisionRuntimeParams();
        return function updateCeilingInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
            this.convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, collisionCheckParams);
            this.convertCharacterCollisionResultsToCollisionRuntimeParams(prevCharacterCollisionResults, collisionRuntimeParams);
            collisionCheckParams.myComputeGroundInfoEnabled = false;
            this._myCollisionCheck.updateSurfaceInfo(currentTransformQuat, collisionCheckParams, collisionRuntimeParams);
            this.convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, currentTransformQuat, outCharacterCollisionResults);
        }
    }(),
    convertCharacterCollisionResultsToCollisionRuntimeParams: function (characterCollisionResults, outCollisionRuntimeParams) {
        outCollisionRuntimeParams.reset();

        characterCollisionResults.myTransformResults.myStartTransformQuat.quat2_getPosition(outCollisionRuntimeParams.myOriginalPosition);
        characterCollisionResults.myTransformResults.myEndTransformQuat.quat2_getPosition(outCollisionRuntimeParams.myNewPosition);

        characterCollisionResults.myTransformResults.myStartTransformQuat.quat2_getForward(outCollisionRuntimeParams.myOriginalForward);
        characterCollisionResults.myTransformResults.myStartTransformQuat.quat2_getUp(outCollisionRuntimeParams.myOriginalUp);

        //ok: outCollisionRuntimeParams.myOriginalHeight = characterCollisionResults.myOriginalHeight;

        outCollisionRuntimeParams.myOriginalMovement.vec3_copy(characterCollisionResults.myMovementResults.myStartMovement);
        outCollisionRuntimeParams.myFixedMovement.vec3_copy(characterCollisionResults.myMovementResults.myEndMovement);

        outCollisionRuntimeParams.myLastValidOriginalHorizontalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantStartHorizontalMovement);
        outCollisionRuntimeParams.myLastValidOriginalVerticalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantStartVerticalMovement);

        outCollisionRuntimeParams.myLastValidEndHorizontalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantEndHorizontalMovement);
        outCollisionRuntimeParams.myLastValidEndVerticalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantEndVerticalMovement);

        outCollisionRuntimeParams.myLastValidSurfaceAdjustedHorizontalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantAdjustedStartHorizontalMovement);
        outCollisionRuntimeParams.myLastValidSurfaceAdjustedVerticalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantAdjustedStartVerticalMovement);

        outCollisionRuntimeParams.myIsOnGround = characterCollisionResults.myGroundInfo.myIsOnSurface;
        outCollisionRuntimeParams.myGroundAngle = characterCollisionResults.myGroundInfo.mySurfaceAngle;
        outCollisionRuntimeParams.myGroundPerceivedAngle = characterCollisionResults.myGroundInfo.mySurfacePerceivedAngle;
        outCollisionRuntimeParams.myGroundNormal.vec3_copy(characterCollisionResults.myGroundInfo.mySurfaceNormal);
        outCollisionRuntimeParams.myGroundHitMaxAngle = characterCollisionResults.myGroundInfo.mySurfaceHitMaxAngle;
        outCollisionRuntimeParams.myGroundHitMaxNormal.vec3_copy(characterCollisionResults.myGroundInfo.mySurfaceHitMaxNormal);
        outCollisionRuntimeParams.myGroundDistance = characterCollisionResults.myGroundInfo.mySurfaceDistance;
        outCollisionRuntimeParams.myGroundIsBaseInsideCollision = characterCollisionResults.myGroundInfo.myIsBaseInsideCollision;

        outCollisionRuntimeParams.myIsOnCeiling = characterCollisionResults.myCeilingInfo.myIsOnSurface;
        outCollisionRuntimeParams.myCeilingAngle = characterCollisionResults.myCeilingInfo.mySurfaceAngle;
        outCollisionRuntimeParams.myCeilingPerceivedAngle = characterCollisionResults.myCeilingInfo.mySurfacePerceivedAngle;
        outCollisionRuntimeParams.myCeilingNormal.vec3_copy(characterCollisionResults.myCeilingInfo.mySurfaceNormal);
        outCollisionRuntimeParams.myCeilingHitMaxAngle = characterCollisionResults.myCeilingInfo.mySurfaceHitMaxAngle;
        outCollisionRuntimeParams.myCeilingHitMaxNormal.vec3_copy(characterCollisionResults.myCeilingInfo.mySurfaceHitMaxNormal);
        outCollisionRuntimeParams.myCeilingDistance = characterCollisionResults.myCeilingInfo.mySurfaceDistance;
        outCollisionRuntimeParams.myCeilingIsBaseInsideCollision = characterCollisionResults.myCeilingInfo.myIsBaseInsideCollision;

        outCollisionRuntimeParams.myHorizontalMovementCanceled = characterCollisionResults.myHorizontalMovementResults.myMovementFailed;
        outCollisionRuntimeParams.myIsCollidingHorizontally = characterCollisionResults.myHorizontalMovementResults.myIsColliding;
        outCollisionRuntimeParams.myHorizontalCollisionHit.copy(characterCollisionResults.myHorizontalMovementResults.myReferenceCollisionHit);

        outCollisionRuntimeParams.myVerticalMovementCanceled = characterCollisionResults.myVerticalMovementResults.myMovementFailed;
        outCollisionRuntimeParams.myIsCollidingVertically = characterCollisionResults.myVerticalMovementResults.myIsColliding;
        outCollisionRuntimeParams.myVerticalCollisionHit.copy(characterCollisionResults.myVerticalMovementResults.myReferenceCollisionHit);

        outCollisionRuntimeParams.myHasSnappedOnGround = characterCollisionResults.myGroundResults.myHasSnappedOnSurface;
        outCollisionRuntimeParams.myHasSnappedOnCeiling = characterCollisionResults.myCeilingResults.myHasSnappedOnSurface;
        outCollisionRuntimeParams.myHasPoppedOutGround = characterCollisionResults.myGroundResults.myHasPoppedOutSurface;
        outCollisionRuntimeParams.myHasPoppedOutCeiling = characterCollisionResults.myCeilingResults.myHasPoppedOutSurface;

        outCollisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementBasedOnGroundPerceivedAngleDownhill = characterCollisionResults.myGroundResults.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill;
        outCollisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementBasedOnGroundPerceivedAngleUphill = characterCollisionResults.myGroundResults.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill;
        outCollisionRuntimeParams.myVerticalMovementHasAdjustedHorizontalMovementBasedOnGroundAngleDownhill = characterCollisionResults.myGroundResults.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill;

        outCollisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementBasedOnCeilingPerceivedAngleDownhill = characterCollisionResults.myCeilingResults.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill;
        outCollisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementBasedOnCeilingPerceivedAngleUphill = characterCollisionResults.myCeilingResults.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill;
        outCollisionRuntimeParams.myVerticalMovementHasAdjustedHorizontalMovementBasedOnCeilingAngleDownhill = characterCollisionResults.myCeilingResults.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill;

        //ok: outCollisionRuntimeParams.myHasReducedVerticalMovement = characterCollisionResults.myVerticalMovementResults.myHasMovementBeenReduced;

        outCollisionRuntimeParams.myIsSliding = characterCollisionResults.myWallSlideResults.myHasSlid;
        outCollisionRuntimeParams.mySlidingMovementAngle = characterCollisionResults.myWallSlideResults.mySlideMovementAngle;
        outCollisionRuntimeParams.mySlidingCollisionAngle = characterCollisionResults.myWallSlideResults.mySlideMovementWallAngle;
        outCollisionRuntimeParams.mySlidingWallNormal.vec3_copy(characterCollisionResults.myWallSlideResults.myWallNormal);

        outCollisionRuntimeParams.myIsSlidingIntoOppositeDirection = characterCollisionResults.myInternalResults.myHasWallSlidTowardOppositeDirection;
        outCollisionRuntimeParams.myIsSlidingFlickerPrevented = characterCollisionResults.myInternalResults.myLastRelevantWallSlideFlickerPrevented;
        outCollisionRuntimeParams.mySlidingFlickerPreventionCheckAnywayCounter = characterCollisionResults.myInternalResults.myWallSlideFlickerPreventionForceCheckCounter;
        outCollisionRuntimeParams.mySliding90DegreesSign = characterCollisionResults.myInternalResults.myWallSlide90DegreesDirectionSign;
        outCollisionRuntimeParams.mySlidingRecompute90DegreesSign = characterCollisionResults.myInternalResults.myWallSlide90DegreesRecomputeDirectionSign;
        outCollisionRuntimeParams.myLastValidIsSliding = characterCollisionResults.myInternalResults.myLastRelevantHasWallSlid;
        outCollisionRuntimeParams.mySlidingPreviousHorizontalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantEndHorizontalMovement);

        outCollisionRuntimeParams.myOriginalTeleportPosition.vec3_copy(characterCollisionResults.myTeleportResults.myStartTeleportTransformQuat);
        outCollisionRuntimeParams.myFixedTeleportPosition.vec3_copy(characterCollisionResults.myTeleportResults.myEndTeleportTransformQuat);
        outCollisionRuntimeParams.myTeleportCanceled = characterCollisionResults.myTeleportResults.myTeleportFailed;

        outCollisionRuntimeParams.myIsPositionOk = characterCollisionResults.myCheckTransformResults.myCheckTransformFailed;
        characterCollisionResults.myCheckTransformResults.myStartCheckTransformQuat.quat2_getPosition(outCollisionRuntimeParams.myOriginalPositionCheckPosition);
        characterCollisionResults.myCheckTransformResults.myEndCheckTransformQuat.quat2_getPosition(outCollisionRuntimeParams.myFixedPositionCheckPosition);

        outCollisionRuntimeParams.myIsTeleport = characterCollisionResults.myCheckType == PP.CharacterCollisionCheckType.CHECK_TELEPORT;
        outCollisionRuntimeParams.myIsMove = characterCollisionResults.myCheckType == PP.CharacterCollisionCheckType.CHECK_MOVEMENT;
        outCollisionRuntimeParams.myIsPositionCheck = characterCollisionResults.myCheckType == PP.CharacterCollisionCheckType.CHECK_TRANSFORM;

        outCollisionRuntimeParams.mySplitMovementSteps = characterCollisionResults.mySplitMovementResults.myStepsToPerform;
        outCollisionRuntimeParams.mySplitMovementStepsPerformed = characterCollisionResults.mySplitMovementResults.myStepsPerformed;
        outCollisionRuntimeParams.mySplitMovementStop = characterCollisionResults.mySplitMovementResults.myMovementInterrupted;
        outCollisionRuntimeParams.mySplitMovementMovementChecked.vec3_copy(characterCollisionResults.mySplitMovementResults.myMovementChecked);

        return outCollisionRuntimeParams;
    },
    convertCollisionRuntimeParamsToCharacterCollisionResults: function () {
        let rotationQuat = PP.quat_create();
        return function convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, currentTransformQuat, outCharacterCollisionResults) {
            outCharacterCollisionResults.reset();

            if (collisionRuntimeParams.myIsMove) {
                outCharacterCollisionResults.myCheckType = PP.CharacterCollisionCheckType.CHECK_MOVEMENT;
            } else if (collisionRuntimeParams.myIsTeleport) {
                outCharacterCollisionResults.myCheckType = PP.CharacterCollisionCheckType.CHECK_TELEPORT;
            } else if (collisionRuntimeParams.myIsPositionCheck) {
                outCharacterCollisionResults.myCheckType = PP.CharacterCollisionCheckType.CHECK_TRANSFORM;
            }

            rotationQuat.quat_setForward(collisionRuntimeParams.myOriginalForward, collisionRuntimeParams.myOriginalUp);
            outCharacterCollisionResults.myTransformResults.myStartTransformQuat.quat2_setPositionRotationQuat(collisionRuntimeParams.myOriginalPosition, rotationQuat);
            outCharacterCollisionResults.myTransformResults.myEndTransformQuat.quat2_setPositionRotationQuat(collisionRuntimeParams.myNewPosition, rotationQuat);

            outCharacterCollisionResults.myMovementResults.myStartMovement.vec3_copy(collisionRuntimeParams.myOriginalMovement);
            outCharacterCollisionResults.myMovementResults.myEndMovement.vec3_copy(collisionRuntimeParams.myFixedMovement);
            outCharacterCollisionResults.myMovementResults.myMovementFailed = collisionRuntimeParams.myHorizontalMovementCanceled && collisionRuntimeParams.myVerticalMovementCanceled;
            outCharacterCollisionResults.myMovementResults.myIsColliding = collisionRuntimeParams.myIsCollidingHorizontally || collisionRuntimeParams.myIsCollidingVertically;
            if (collisionRuntimeParams.myIsCollidingHorizontally) {
                outCharacterCollisionResults.myMovementResults.myReferenceCollisionHit.copy(collisionRuntimeParams.myHorizontalCollisionHit);
            } else if (collisionRuntimeParams.myIsCollidingVertically) {
                outCharacterCollisionResults.myMovementResults.myReferenceCollisionHit.copy(collisionRuntimeParams.myVerticalCollisionHit);
            }

            outCharacterCollisionResults.myHorizontalMovementResults.myMovementFailed = collisionRuntimeParams.myHorizontalMovementCanceled;
            outCharacterCollisionResults.myHorizontalMovementResults.myIsColliding = collisionRuntimeParams.myIsCollidingHorizontally;
            outCharacterCollisionResults.myHorizontalMovementResults.myReferenceCollisionHit.copy(collisionRuntimeParams.myHorizontalCollisionHit);

            outCharacterCollisionResults.myVerticalMovementResults.myMovementFailed = collisionRuntimeParams.myVerticalMovementCanceled;
            outCharacterCollisionResults.myVerticalMovementResults.myIsColliding = collisionRuntimeParams.myIsCollidingVertically;
            outCharacterCollisionResults.myVerticalMovementResults.myReferenceCollisionHit.copy(collisionRuntimeParams.myVerticalCollisionHit);

            outCharacterCollisionResults.myTeleportResults.myStartTeleportTransformQuat.quat2_copy(outCharacterCollisionResults.myTransformResults.myStartTransformQuat);
            outCharacterCollisionResults.myTeleportResults.myStartTeleportTransformQuat.quat2_setPosition(collisionRuntimeParams.myOriginalTeleportPosition);
            outCharacterCollisionResults.myTeleportResults.myEndTeleportTransformQuat.quat2_copy(outCharacterCollisionResults.myTransformResults.myEndTransformQuat);
            outCharacterCollisionResults.myTeleportResults.myEndTeleportTransformQuat.quat2_setPosition(collisionRuntimeParams.myFixedTeleportPosition);
            outCharacterCollisionResults.myTeleportResults.myTeleportFailed = collisionRuntimeParams.myTeleportCanceled;

            outCharacterCollisionResults.myCheckTransformResults.myStartCheckTransformQuat.quat2_copy(outCharacterCollisionResults.myTransformResults.myStartTransformQuat);
            outCharacterCollisionResults.myCheckTransformResults.myStartCheckTransformQuat.quat2_setPosition(collisionRuntimeParams.myOriginalPositionCheckPosition);
            outCharacterCollisionResults.myCheckTransformResults.myEndCheckTransformQuat.quat2_copy(outCharacterCollisionResults.myTransformResults.myEndTransformQuat);
            outCharacterCollisionResults.myCheckTransformResults.myEndCheckTransformQuat.quat2_setPosition(collisionRuntimeParams.myFixedPositionCheckPosition);
            outCharacterCollisionResults.myCheckTransformResults.myCheckTransformFailed = !collisionRuntimeParams.myIsPositionOk;

            outCharacterCollisionResults.myWallSlideResults.myHasSlid = collisionRuntimeParams.myIsSliding;
            outCharacterCollisionResults.myWallSlideResults.mySlideMovementAngle = collisionRuntimeParams.mySlidingMovementAngle;
            outCharacterCollisionResults.myWallSlideResults.mySlideMovementWallAngle = collisionRuntimeParams.mySlidingCollisionAngle;
            outCharacterCollisionResults.myWallSlideResults.myWallNormal.vec3_copy(ollisionRuntimeParams.mySlidingWallNormal);

            outCharacterCollisionResults.myGroundInfo.myIsOnSurface = collisionRuntimeParams.myIsOnGround;
            outCharacterCollisionResults.myGroundInfo.mySurfaceAngle = collisionRuntimeParams.myGroundAngle;
            outCharacterCollisionResults.myGroundInfo.mySurfacePerceivedAngle = collisionRuntimeParams.myGroundPerceivedAngle;
            outCharacterCollisionResults.myGroundInfo.mySurfaceNormal.vec3_copy(collisionRuntimeParams.myGroundNormal);
            outCharacterCollisionResults.myGroundInfo.mySurfaceHitMaxAngle = collisionRuntimeParams.myGroundHitMaxAngle;
            outCharacterCollisionResults.myGroundInfo.mySurfaceHitMaxNormal.vec3_copy(collisionRuntimeParams.myGroundHitMaxNormal);
            outCharacterCollisionResults.myGroundInfo.mySurfaceDistance = collisionRuntimeParams.myGroundDistance;
            outCharacterCollisionResults.myGroundInfo.myIsBaseInsideCollision = collisionRuntimeParams.myGroundIsBaseInsideCollision;

            outCharacterCollisionResults.myCeilingInfo.myIsOnSurface = collisionRuntimeParams.myIsOnCeiling;
            outCharacterCollisionResults.myCeilingInfo.mySurfaceAngle = collisionRuntimeParams.myCeilingAngle;
            outCharacterCollisionResults.myCeilingInfo.mySurfacePerceivedAngle = collisionRuntimeParams.myCeilingPerceivedAngle;
            outCharacterCollisionResults.myCeilingInfo.mySurfaceNormal.vec3_copy(collisionRuntimeParams.myCeilingNormal);
            outCharacterCollisionResults.myCeilingInfo.mySurfaceHitMaxAngle = collisionRuntimeParams.myCeilingHitMaxAngle;
            outCharacterCollisionResults.myCeilingInfo.mySurfaceHitMaxNormal.vec3_copy(collisionRuntimeParams.myCeilingHitMaxNormal);
            outCharacterCollisionResults.myCeilingInfo.mySurfaceDistance = collisionRuntimeParams.myCeilingDistance;
            outCharacterCollisionResults.myCeilingInfo.myIsBaseInsideCollision = collisionRuntimeParams.myCeilingIsBaseInsideCollision;

            outCharacterCollisionResults.myGroundResults.myHasSnappedOnSurface = collisionRuntimeParams.myHasSnappedOnGround;
            outCharacterCollisionResults.myGroundResults.myHasPoppedOutSurface = collisionRuntimeParams.myHasPoppedOutGround;
            outCharacterCollisionResults.myCeilingResults.myHasSnappedOnSurface = collisionRuntimeParams.myHasSnappedOnCeiling;
            outCharacterCollisionResults.myCeilingResults.myHasPoppedOutSurface = collisionRuntimeParams.myHasPoppedOutCeiling;

            outCharacterCollisionResults.myGroundResults.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill = collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementBasedOnGroundPerceivedAngleDownhill;
            outCharacterCollisionResults.myGroundResults.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill = collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementBasedOnGroundPerceivedAngleUphill;
            outCharacterCollisionResults.myGroundResults.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill = collisionRuntimeParams.myVerticalMovementHasAdjustedHorizontalMovementBasedOnGroundAngleDownhill;

            outCharacterCollisionResults.myCeilingResults.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill = collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementBasedOnCeilingPerceivedAngleDownhill;
            outCharacterCollisionResults.myCeilingResults.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill = collisionRuntimeParams.myHorizontalMovementHasAdjustedVerticalMovementBasedOnCeilingPerceivedAngleUphill;
            outCharacterCollisionResults.myCeilingResults.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill = collisionRuntimeParams.myVerticalMovementHasAdjustedHorizontalMovementBasedOnCeilingAngleDownhill;

            outCharacterCollisionResults.mySplitMovementResults.myStepsToPerform = collisionRuntimeParams.mySplitMovementSteps;
            outCharacterCollisionResults.mySplitMovementResults.myStepsPerformed = collisionRuntimeParams.mySplitMovementStepsPerformed;
            outCharacterCollisionResults.mySplitMovementResults.myMovementInterrupted = collisionRuntimeParams.mySplitMovementStop;
            outCharacterCollisionResults.mySplitMovementResults.myMovementChecked.vec3_copy(collisionRuntimeParams.mySplitMovementMovementChecked);

            outCharacterCollisionResults.myInternalResults.myLastRelevantStartHorizontalMovement.vec3_copy(collisionRuntimeParams.myLastValidOriginalHorizontalMovement);
            outCharacterCollisionResults.myInternalResults.myLastRelevantEndHorizontalMovement.vec3_copy(collisionRuntimeParams.myLastValidEndHorizontalMovement);
            outCharacterCollisionResults.myInternalResults.myLastRelevantStartVerticalMovement.vec3_copy(collisionRuntimeParams.myLastValidOriginalVerticalMovement);
            outCharacterCollisionResults.myInternalResults.myLastRelevantEndVerticalMovement.vec3_copy(collisionRuntimeParams.myLastValidEndVerticalMovement);

            outCharacterCollisionResults.myInternalResults.myLastRelevantAdjustedStartHorizontalMovement.vec3_copy(collisionRuntimeParams.myLastValidSurfaceAdjustedHorizontalMovement);
            outCharacterCollisionResults.myInternalResults.myLastRelevantAdjustedStartVerticalMovement.vec3_copy(collisionRuntimeParams.myLastValidSurfaceAdjustedVerticalMovement);

            outCharacterCollisionResults.myInternalResults.myLastRelevantHasWallSlid = collisionRuntimeParams.myLastValidIsSliding;
            outCharacterCollisionResults.myInternalResults.myHasWallSlidTowardOppositeDirection = collisionRuntimeParams.myIsSlidingIntoOppositeDirection;
            outCharacterCollisionResults.myInternalResults.myLastRelevantWallSlideFlickerPrevented = collisionRuntimeParams.myIsSlidingFlickerPrevented;
            outCharacterCollisionResults.myInternalResults.myWallSlideFlickerPreventionForceCheckCounter = collisionRuntimeParams.mySlidingFlickerPreventionCheckAnywayCounter;
            outCharacterCollisionResults.myInternalResults.myWallSlide90DegreesDirectionSign = collisionRuntimeParams.mySliding90DegreesSign;
            outCharacterCollisionResults.myInternalResults.myWallSlide90DegreesRecomputeDirectionSign = collisionRuntimeParams.mySlidingRecompute90DegreesSign;

            outCharacterCollisionResults.myTransformResults.myStartTransformQuat.quat2_copy(currentTransformQuat);

            return outCharacterCollisionResults;
        }
    }(),

    convertCharacterColliderSetupToCollisionCheckParams: function () {
        return function convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, outCollisionCheckParams) {
            outCollisionCheckParams.myHeight = characterColliderSetup.myHeight;

            outCollisionCheckParams.myRadius = characterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckConeRadius;
            outCollisionCheckParams.myDistanceFromFeetToIgnore = characterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckFeetDistanceToIgnore;
            outCollisionCheckParams.myDistanceFromHeadToIgnore = characterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckHeadDistanceToIgnore;

            outCollisionCheckParams.myHorizontalMovementCheckEnabled = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementCheckEnabled;

            outCollisionCheckParams.myHorizontalMovementStepEnabled = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementCheckSplitMovementEnabled;
            outCollisionCheckParams.myHorizontalMovementStepMaxLength = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementCheckSplitMovementMaxStepLength;

            outCollisionCheckParams.myHorizontalMovementRadialStepAmount = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementCheckRadialSteps;

            outCollisionCheckParams.myHorizontalMovementCheckDiagonalOutward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalDiagonalOutwardCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckDiagonalInward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalDiagonalInwardCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckStraight = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalStraightCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckHorizontalBorder = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalRadialCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckVerticalStraight = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckVerticalDiagonalUpwardOutward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalDiagonalOutwardUpwardCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckVerticalDiagonalUpwardInward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalDiagonalInwardUpwardCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckVerticalDiagonalDownwardOutward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalDiagonalOutwardDownwardCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckVerticalDiagonalDownwardInward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalDiagonalInwardDownwardCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckVerticalStraightDiagonalUpward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightDiagonalUpwardCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckVerticalStraightDiagonalDownward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightDiagonalDownwardCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalOutward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalRadialDiagonalOutwardCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalInward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalRadialDiagonalInwardCheckEnabled;

            outCollisionCheckParams.myHorizontalMovementHorizontalStraightCentralCheckEnabled = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalStraightCentralCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementVerticalStraightCentralCheckEnabled = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightCentralCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled;
            outCollisionCheckParams.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled;

            outCollisionCheckParams.myHorizontalPositionCheckEnabled = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionCheckEnabled;

            outCollisionCheckParams.myHalfConeAngle = characterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckConeHalfAngle;
            outCollisionCheckParams.myHalfConeSliceAmount = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionCheckConeHalfSlices;
            outCollisionCheckParams.myCheckConeBorder = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHorizontalBorderCheckEnabled;
            outCollisionCheckParams.myCheckConeRay = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHorizontalRadialCheckEnabled;
            outCollisionCheckParams.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalCheckIgnoreHitsInsideCollision;
            outCollisionCheckParams.myHorizontalPositionCheckVerticalDirectionType = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalCheckDirection;

            outCollisionCheckParams.myCheckHeight = characterColliderSetup.myHorizontalCheckSetup.myHorizontalHeightCheckEnabled;

            outCollisionCheckParams.myCheckHeightVerticalMovement = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHeightVerticalCheckEnabled;
            outCollisionCheckParams.myCheckHeightVerticalPosition = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHeightVerticalCheckEnabled;
            outCollisionCheckParams.myCheckHeightTopMovement = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHeightHorizontalCheckEnabled;
            outCollisionCheckParams.myCheckHeightTopPosition = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHeightHorizontalCheckEnabled;
            outCollisionCheckParams.myCheckHeightConeOnCollision = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHit;
            outCollisionCheckParams.myCheckHeightConeOnCollisionKeepHit = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHitKeepVerticalHitIfNoHorizontalHit;

            outCollisionCheckParams.myHeightCheckStepAmountMovement = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHeightCheckSteps;
            outCollisionCheckParams.myHeightCheckStepAmountPosition = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHeightCheckSteps;
            outCollisionCheckParams.myCheckVerticalStraight = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalStraightCheckEnabled;
            outCollisionCheckParams.myCheckVerticalDiagonalRayOutward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalRadialDiagonalOutwardCheckEnabled;
            outCollisionCheckParams.myCheckVerticalDiagonalRayInward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalRadialDiagonalInwardCheckEnabled;
            outCollisionCheckParams.myCheckVerticalDiagonalBorderOutward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalBorderDiagonalOutwardCheckEnabled;
            outCollisionCheckParams.myCheckVerticalDiagonalBorderInward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalBorderDiagonalInwardCheckEnabled;
            outCollisionCheckParams.myCheckVerticalDiagonalBorderRayOutward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalRadialBorderDiagonalOutwardCheckEnabled;
            outCollisionCheckParams.myCheckVerticalDiagonalBorderRayInward = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalRadialBorderDiagonalInwardCheckEnabled;
            outCollisionCheckParams.myCheckVerticalSearchFartherVerticalHit = characterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalCheckGetFarthestHit;

            outCollisionCheckParams.myCheckHorizontalFixedForwardEnabled = characterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckFixedForwardEnabled;
            outCollisionCheckParams.myCheckHorizontalFixedForward.vec3_copy(characterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckFixedForward);

            outCollisionCheckParams.myVerticalMovementCheckEnabled = characterColliderSetup.myVerticalCheckSetup.myVerticalMovementCheckEnabled;
            outCollisionCheckParams.myVerticalPositionCheckEnabled = characterColliderSetup.myVerticalCheckSetup.myVerticalPositionCheckEnabled;
            outCollisionCheckParams.myFeetRadius = characterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRadius;

            outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhill = characterColliderSetup.myGroundSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhill;
            outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphill = characterColliderSetup.myGroundSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphill;
            outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhillMaxAngle = characterColliderSetup.myGroundSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhillMaxSurfaceAngle;
            outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphillMaxAngle = characterColliderSetup.myGroundSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphillMaxSurfaceAngle;
            outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhillMaxPerceivedAngle = characterColliderSetup.myGroundSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhillMaxSurfacePerceivedAngle;
            outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphillMaxPerceivedAngle = characterColliderSetup.myGroundSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphillMaxSurfacePerceivedAngle;
            outCollisionCheckParams.myAdjustHorizontalMovementWithGroundAngleDownhill = characterColliderSetup.myGroundSetup.myVerticalMovementAdjustHorizontalMovementBasedOnSurfaceAngleDownhill;
            outCollisionCheckParams.myAdjustHorizontalMovementWithGroundAngleDownhillMinAngle = characterColliderSetup.myGroundSetup.myVerticalMovementAdjustHorizontalMovementBasedOnSurfaceAngleDownhillMinSurfaceAngle;

            outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhill = characterColliderSetup.myCeilingSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhill;
            outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphill = characterColliderSetup.myCeilingSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphill;
            outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhillMaxAngle = characterColliderSetup.myCeilingSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhillMaxSurfaceAngle;
            outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphillMaxAngle = characterColliderSetup.myCeilingSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphillMaxSurfaceAngle;
            outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhillMaxPerceivedAngle = characterColliderSetup.myCeilingSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhillMaxSurfacePerceivedAngle;
            outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphillMaxPerceivedAngle = characterColliderSetup.myCeilingSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphillMaxSurfacePerceivedAngle;
            outCollisionCheckParams.myAdjustHorizontalMovementWithCeilingAngleDownhill = characterColliderSetup.myCeilingSetup.myVerticalMovementAdjustHorizontalMovementBasedOnSurfaceAngleDownhill;
            outCollisionCheckParams.myAdjustHorizontalMovementWithCeilingAngleDownhillMinAngle = characterColliderSetup.myCeilingSetup.myVerticalMovementAdjustHorizontalMovementBasedOnSurfaceAngleDownhillMinSurfaceAngle;

            outCollisionCheckParams.myCheckVerticalFixedForwardEnabled = characterColliderSetup.myVerticalCheckSetup.myVerticalCheckFixedForwardEnabled;
            outCollisionCheckParams.myCheckVerticalFixedForward.vec3_copy(characterColliderSetup.myVerticalCheckSetup.myVerticalCheckFixedForward);
            outCollisionCheckParams.myCheckVerticalBothDirection = characterColliderSetup.myVerticalCheckSetup.myVerticalMovementCheckPerformCheckOnBothSides;

            outCollisionCheckParams.myVerticalMovementReduceEnabled = characterColliderSetup.myVerticalCheckSetup.myVerticalMovementCheckReductionEnabled;

            outCollisionCheckParams.myGroundCircumferenceAddCenter = characterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceCentralCheckEnabled;
            outCollisionCheckParams.myGroundCircumferenceSliceAmount = characterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceSlices;
            outCollisionCheckParams.myGroundCircumferenceStepAmount = characterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRadialSteps;
            outCollisionCheckParams.myGroundCircumferenceRotationPerStep = characterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRotationPerRadialStep;
            outCollisionCheckParams.myVerticalAllowHitInsideCollisionIfOneOk = characterColliderSetup.myVerticalCheckSetup.myVerticalCheckAllowHitsInsideCollisionIfOneValid;

            outCollisionCheckParams.myHorizontalBlockLayerFlags.copy(characterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckBlockLayerFlags);
            outCollisionCheckParams.myVerticalBlockLayerFlags.copy(characterColliderSetup.myVerticalCheckSetup.myVerticalCheckBlockLayerFlags);
            outCollisionCheckParams.myHorizontalObjectsToIgnore.pp_copy(characterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckObjectsToIgnore);
            outCollisionCheckParams.myVerticalObjectsToIgnore.pp_copy(characterColliderSetup.myVerticalCheckSetup.myVerticalCheckObjectsToIgnore);

            outCollisionCheckParams.mySnapOnGroundEnabled = characterColliderSetup.myGroundSetup.mySurfaceSnapEnabled;
            outCollisionCheckParams.mySnapOnGroundExtraDistance = characterColliderSetup.myGroundSetup.mySurfaceSnapMaxDistance;
            outCollisionCheckParams.mySnapOnCeilingEnabled = characterColliderSetup.myCeilingSetup.mySurfaceSnapEnabled;
            outCollisionCheckParams.mySnapOnCeilingExtraDistance = characterColliderSetup.myCeilingSetup.mySurfaceSnapMaxDistance;

            outCollisionCheckParams.myGroundPopOutEnabled = characterColliderSetup.myGroundSetup.mySurfacePopOutEnabled;
            outCollisionCheckParams.myGroundPopOutExtraDistance = characterColliderSetup.myGroundSetup.mySurfacePopOutMaxDistance;
            outCollisionCheckParams.myCeilingPopOutEnabled = characterColliderSetup.myCeilingSetup.mySurfacePopOutEnabled;
            outCollisionCheckParams.myCeilingPopOutExtraDistance = characterColliderSetup.myCeilingSetup.mySurfacePopOutMaxDistance;

            outCollisionCheckParams.myGroundAngleToIgnore = characterColliderSetup.myGroundSetup.mySurfaceAngleToIgnore;
            outCollisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle = characterColliderSetup.myGroundSetup.mySurfaceAngleToIgnoreWithSurfacePerceivedAngle;
            outCollisionCheckParams.myCeilingAngleToIgnore = characterColliderSetup.myCeilingSetup.mySurfaceAngleToIgnore;
            outCollisionCheckParams.myCeilingAngleToIgnoreWithPerceivedAngle = characterColliderSetup.myCeilingSetup.mySurfaceAngleToIgnoreWithSurfacePerceivedAngle;

            outCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreHeight = characterColliderSetup.myGroundSetup.myHorizontalMovementSurfaceAngleToIgnoreMaxVerticalDistance;
            outCollisionCheckParams.myHorizontalMovementCeilingAngleIgnoreHeight = characterColliderSetup.myCeilingSetup.myHorizontalMovementSurfaceAngleToIgnoreMaxVerticalDistance;
            outCollisionCheckParams.myHorizontalPositionGroundAngleIgnoreHeight = characterColliderSetup.myGroundSetup.myHorizontalPositionSurfaceAngleToIgnoreMaxVerticalDistance;
            outCollisionCheckParams.myHorizontalPositionCeilingAngleIgnoreHeight = characterColliderSetup.myCeilingSetup.myHorizontalPositionSurfaceAngleToIgnoreMaxVerticalDistance;

            outCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft = characterColliderSetup.myGroundSetup.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft;
            outCollisionCheckParams.myHorizontalMovementCeilingAngleIgnoreMaxMovementLeft = characterColliderSetup.myCeilingSetup.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft;

            outCollisionCheckParams.myComputeGroundInfoEnabled = characterColliderSetup.myGroundSetup.myCollectSurfaceInfo;
            outCollisionCheckParams.myComputeCeilingInfoEnabled = characterColliderSetup.myCeilingSetup.myCollectSurfaceInfo;
            outCollisionCheckParams.myDistanceToBeOnGround = characterColliderSetup.myGroundSetup.myIsOnSurfaceMaxOutsideDistance;
            outCollisionCheckParams.myDistanceToComputeGroundInfo = characterColliderSetup.myGroundSetup.myCollectSurfaceNormalMaxOutsideDistance;
            outCollisionCheckParams.myDistanceToBeOnCeiling = characterColliderSetup.myCeilingSetup.myIsOnSurfaceMaxOutsideDistance;
            outCollisionCheckParams.myDistanceToComputeCeilingInfo = characterColliderSetup.myCeilingSetup.myCollectSurfaceNormalMaxOutsideDistance;
            outCollisionCheckParams.myVerticalFixToBeOnGround = characterColliderSetup.myGroundSetup.myIsOnSurfaceMaxInsideDistance;
            outCollisionCheckParams.myVerticalFixToComputeGroundInfo = characterColliderSetup.myGroundSetup.myCollectSurfaceNormalMaxInsideDistance;
            outCollisionCheckParams.myVerticalFixToBeOnCeiling = characterColliderSetup.myCeilingSetup.myIsOnSurfaceMaxInsideDistance;
            outCollisionCheckParams.myVerticalFixToComputeCeilingInfo = characterColliderSetup.myCeilingSetup.myCollectSurfaceNormalMaxInsideDistance;

            outCollisionCheckParams.myGroundIsBaseInsideCollisionCheckEnabled = characterColliderSetup.myGroundSetup.myIsBaseInsideCollisionCheckEnabled;
            outCollisionCheckParams.myCeilingIsBaseInsideCollisionCheckEnabled = characterColliderSetup.myCeilingSetup.myIsBaseInsideCollisionCheckEnabled;
            outCollisionCheckParams.myIsOnGroundIfInsideHit = characterColliderSetup.myGroundSetup.myIsOnSurfaceIfBaseInsideCollision;
            outCollisionCheckParams.myIsOnCeilingIfInsideHit = characterColliderSetup.myCeilingSetup.myIsOnSurfaceIfBaseInsideCollision;

            outCollisionCheckParams.myFindGroundDistanceMaxOutsideDistance = characterColliderSetup.myGroundSetup.myFindSurfaceDistanceMaxOutsideDistance;
            outCollisionCheckParams.myFindGroundDistanceMaxInsideDistance = characterColliderSetup.myGroundSetup.myFindSurfaceDistanceMaxInsideDistance;
            outCollisionCheckParams.myFindCeilingDistanceMaxOutsideDistance = characterColliderSetup.myCeilingSetup.myFindSurfaceDistanceMaxOutsideDistance;
            outCollisionCheckParams.myFindCeilingDistanceMaxInsideDistance = characterColliderSetup.myCeilingSetup.myFindSurfaceDistanceMaxInsideDistance;

            outCollisionCheckParams.myAllowGroundSteepFix = characterColliderSetup.myGroundSetup.myHorizontalMovementAllowExitAttemptWhenOnNotIgnorableSurfacePerceivedAngle;
            outCollisionCheckParams.myAllowCeilingSteepFix = characterColliderSetup.myCeilingSetup.myHorizontalMovementAllowExitAttemptWhenOnNotIgnorableSurfacePerceivedAngle;

            outCollisionCheckParams.myMustStayOnGround = characterColliderSetup.myGroundSetup.myMovementMustStayOnSurface;
            outCollisionCheckParams.myMustStayOnCeiling = characterColliderSetup.myCeilingSetup.myMovementMustStayOnSurface;
            outCollisionCheckParams.myRegatherGroundInfoOnSurfaceCheckFail = characterColliderSetup.myGroundSetup.myRecollectSurfaceInfoOnSurfaceCheckFailed;
            outCollisionCheckParams.myRegatherCeilingInfoOnSurfaceCheckFail = characterColliderSetup.myCeilingSetup.myRecollectSurfaceInfoOnSurfaceCheckFailed;
            outCollisionCheckParams.myMustStayBelowIgnorableGroundAngleDownhill = characterColliderSetup.myGroundSetup.myMovementMustStayOnIgnorableSurfaceAngleDownhill;
            outCollisionCheckParams.myMustStayBelowIgnorableCeilingAngleDownhill = characterColliderSetup.myCeilingSetup.myMovementMustStayOnIgnorableSurfaceAngleDownhill;
            outCollisionCheckParams.myMustStayBelowGroundAngleDownhill = characterColliderSetup.myGroundSetup.myMovementMustStayOnSurfaceAngleDownhill;
            outCollisionCheckParams.myMustStayBelowCeilingAngleDownhill = characterColliderSetup.myCeilingSetup.myMovementMustStayOnSurfaceAngleDownhill;
            outCollisionCheckParams.myMovementMustStayOnGroundHitAngle = characterColliderSetup.myGroundSetup.myMovementMustStayOnSurfaceHitMaxAngle;
            outCollisionCheckParams.myMovementMustStayOnCeilingHitAngle = characterColliderSetup.myCeilingSetup.myMovementMustStayOnSurfaceHitMaxAngle;

            outCollisionCheckParams.myTeleportMustBeOnIgnorableGroundAngle = characterColliderSetup.myGroundSetup.myTeleportMustBeOnIgnorableSurfaceAngle;
            outCollisionCheckParams.myCheckTransformMustBeOnIgnorableGroundAngle = characterColliderSetup.myGroundSetup.myCheckTransformMustBeOnIgnorableSurfaceAngle;
            outCollisionCheckParams.myTeleportMustBeOnIgnorableCeilingAngle = characterColliderSetup.myCeilingSetup.myTeleportMustBeOnIgnorableSurfaceAngle;
            outCollisionCheckParams.myCheckTransformMustBeOnIgnorableCeilingAngle = characterColliderSetup.myCeilingSetup.myCheckTransformMustBeOnIgnorableSurfaceAngle;

            outCollisionCheckParams.myTeleportMustBeOnGroundAngle = characterColliderSetup.myGroundSetup.myTeleportMustBeOnSurfaceAngle;
            outCollisionCheckParams.myCheckTransformMustBeOnGroundAngle = characterColliderSetup.myGroundSetup.myCheckTransformMustBeOnSurfaceAngle;
            outCollisionCheckParams.myTeleportMustBeOnCeilingAngle = characterColliderSetup.myCeilingSetup.myTeleportMustBeOnSurfaceAngle;
            outCollisionCheckParams.myCheckTransformMustBeOnCeilingAngle = characterColliderSetup.myCeilingSetup.myCheckTransformMustBeOnSurfaceAngle;

            outCollisionCheckParams.myTeleportMustBeOnGround = characterColliderSetup.myGroundSetup.myTeleportMustBeOnSurface;
            outCollisionCheckParams.myCheckTransformMustBeOnGround = characterColliderSetup.myGroundSetup.myCheckTransformMustBeOnSurface;
            outCollisionCheckParams.myTeleportMustBeOnCeiling = characterColliderSetup.myCeilingSetup.myTeleportMustBeOnSurface;
            outCollisionCheckParams.myCheckTransformMustBeOnCeiling = characterColliderSetup.myCeilingSetup.myCheckTransformMustBeOnSurface;

            outCollisionCheckParams.mySlidingEnabled = characterColliderSetup.myWallSlideSetup.myWallSlideEnabled;
            outCollisionCheckParams.mySlidingHorizontalMovementCheckBetterNormal = characterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementCheckGetBetterReferenceHit;
            outCollisionCheckParams.mySlidingMaxAttempts = characterColliderSetup.myWallSlideSetup.myWallSlideMaxAttempts;
            outCollisionCheckParams.mySlidingCheckBothDirections = characterColliderSetup.myWallSlideSetup.myCheckBothWallSlideDirections;
            outCollisionCheckParams.mySlidingFlickeringPreventionType = characterColliderSetup.myWallSlideSetup.myWallSlideFlickerPreventionMode;
            outCollisionCheckParams.mySlidingFlickeringPreventionCheckOnlyIfAlreadySliding = characterColliderSetup.myWallSlideSetup.myWallSlideFlickerPreventionCheckOnlyIfAlreadySliding;
            outCollisionCheckParams.mySlidingFlickerPreventionCheckAnywayCounter = characterColliderSetup.myWallSlideSetup.myWallSlideFlickerPreventionForceCheckCounter;
            outCollisionCheckParams.mySlidingAdjustSign90Degrees = characterColliderSetup.myWallSlideSetup.my90DegreesWallSlideAdjustDirectionSign;

            outCollisionCheckParams.mySplitMovementEnabled = characterColliderSetup.mySplitMovementSetup.mySplitMovementEnabled;
            outCollisionCheckParams.mySplitMovementMaxLength = characterColliderSetup.mySplitMovementSetup.mySplitMovementMaxStepLength;
            outCollisionCheckParams.mySplitMovementMaxStepsEnabled = characterColliderSetup.mySplitMovementSetup.mySplitMovementMaxSteps != null;
            outCollisionCheckParams.mySplitMovementMaxSteps = characterColliderSetup.mySplitMovementSetup.mySplitMovementMaxSteps;
            outCollisionCheckParams.mySplitMovementStepEqualLength = characterColliderSetup.mySplitMovementSetup.mySplitMovementMaxStepLength == null;
            outCollisionCheckParams.mySplitMovementStepEqualLengthMinLength = characterColliderSetup.mySplitMovementSetup.mySplitMovementMinStepLength;
            outCollisionCheckParams.mySplitMovementStopWhenHorizontalMovementCanceled = characterColliderSetup.mySplitMovementSetup.mySplitMovementStopOnHorizontalMovementFailed;
            outCollisionCheckParams.mySplitMovementStopWhenVerticalMovementCanceled = characterColliderSetup.mySplitMovementSetup.mySplitMovementStopOnVerticalMovementFailed;
            outCollisionCheckParams.mySplitMovementStopCallback = characterColliderSetup.mySplitMovementSetup.mySplitMovementStopOnCallback;
            outCollisionCheckParams.mySplitMovementStopReturnPrevious = characterColliderSetup.mySplitMovementSetup.mySplitMovementStopReturnPreviousResults;

            outCollisionCheckParams.myPositionOffsetLocal.vec3_copy(characterColliderSetup.myAdditionalSetup.myPositionOffsetLocal);
            outCollisionCheckParams.myRotationOffsetLocalQuat.quat_copy(characterColliderSetup.myAdditionalSetup.myRotationOffsetLocalQuat);

            outCollisionCheckParams.myDebugActive = characterColliderSetup.myDebugSetup.myVisualDebugActive;

            outCollisionCheckParams.myDebugHorizontalMovementActive = characterColliderSetup.myDebugSetup.myVisualDebugHorizontalMovementCheckActive;
            outCollisionCheckParams.myDebugHorizontalPositionActive = characterColliderSetup.myDebugSetup.myVisualDebugHorizontalPositionCheckActive;
            outCollisionCheckParams.myDebugVerticalMovementActive = characterColliderSetup.myDebugSetup.myVisualDebugVerticalMovementCheckActive;
            outCollisionCheckParams.myDebugVerticalPositionActive = characterColliderSetup.myDebugSetup.myVisualDebugVerticalPositionCheckActive;
            outCollisionCheckParams.myDebugSlidingActive = characterColliderSetup.myDebugSetup.myVisualDebugSlideActive;

            outCollisionCheckParams.myDebugGroundInfoActive = characterColliderSetup.myDebugSetup.myVisualDebugGroundInfoActive;
            outCollisionCheckParams.myDebugCeilingInfoActive = characterColliderSetup.myDebugSetup.myVisualDebugGroundInfoActive;
            outCollisionCheckParams.myDebugRuntimeParamsActive = characterColliderSetup.myDebugSetup.myVisualDebugResultsActive;
            outCollisionCheckParams.myDebugMovementActive = characterColliderSetup.myDebugSetup.myVisualDebugMovementActive;

            return outCollisionCheckParams;
        }
    }()
};
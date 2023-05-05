import { quat_create, vec3_create } from "../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../pp/globals";
import { CharacterCollisionCheckType, CharacterCollisionResults } from "./character_collision_results";
import { CollisionCheck } from "./legacy/collision_check/collision_check";
import { CollisionCheckParams, CollisionRuntimeParams } from "./legacy/collision_check/collision_params";

let _myCollisionChecks = new WeakMap();

export function getCollisionCheck(engine = Globals.getMainEngine()) {
    return _myCollisionChecks.get(engine);
}

export function setCollisionCheck(collisionCheck, engine = Globals.getMainEngine()) {
    _myCollisionChecks.set(engine, collisionCheck);
}

export function initBridge(engine = Globals.getMainEngine()) {
    setCollisionCheck(new CollisionCheck(engine), engine);
}

export let checkMovement = function () {
    let collisionCheckParams = new CollisionCheckParams();
    let collisionRuntimeParams = new CollisionRuntimeParams();
    return function checkMovement(movement, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults(), engine = Globals.getMainEngine()) {
        this.convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, collisionCheckParams);
        this.convertCharacterCollisionResultsToCollisionRuntimeParams(prevCharacterCollisionResults, collisionRuntimeParams);
        getCollisionCheck(engine).move(movement, currentTransformQuat, collisionCheckParams, collisionRuntimeParams);
        this.convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, currentTransformQuat, outCharacterCollisionResults);
    }
}();

export let checkTeleportToTransform = function () {
    let teleportPosition = vec3_create();
    let collisionCheckParams = new CollisionCheckParams();
    let collisionRuntimeParams = new CollisionRuntimeParams();
    return function checkTeleportToTransform(teleportTransformQuat, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults(), engine = Globals.getMainEngine()) {
        this.convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, collisionCheckParams);
        this.convertCharacterCollisionResultsToCollisionRuntimeParams(prevCharacterCollisionResults, collisionRuntimeParams);
        teleportPosition = teleportTransformQuat.quat2_getPosition(teleportPosition);
        getCollisionCheck(engine).teleport(teleportPosition, teleportTransformQuat, collisionCheckParams, collisionRuntimeParams);
        this.convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, currentTransformQuat, outCharacterCollisionResults);
    }
}();

export let checkTransform = function () {
    let collisionCheckParams = new CollisionCheckParams();
    let collisionRuntimeParams = new CollisionRuntimeParams();
    return function checkTransform(checkTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults(), engine = Globals.getMainEngine()) {
        this.convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, collisionCheckParams);
        this.convertCharacterCollisionResultsToCollisionRuntimeParams(prevCharacterCollisionResults, collisionRuntimeParams);
        getCollisionCheck(engine).positionCheck(true, checkTransformQuat, collisionCheckParams, collisionRuntimeParams);
        this.convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, checkTransformQuat, outCharacterCollisionResults);
    }
}();

export let updateGroundInfo = function () {
    let collisionCheckParams = new CollisionCheckParams();
    let collisionRuntimeParams = new CollisionRuntimeParams();
    return function updateGroundInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults(), engine = Globals.getMainEngine()) {
        this.convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, collisionCheckParams);
        this.convertCharacterCollisionResultsToCollisionRuntimeParams(prevCharacterCollisionResults, collisionRuntimeParams);
        collisionCheckParams.myComputeCeilingInfoEnabled = false;
        getCollisionCheck(engine).updateSurfaceInfo(currentTransformQuat, collisionCheckParams, collisionRuntimeParams);
        this.convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, currentTransformQuat, outCharacterCollisionResults);
    }
}();

export let updateCeilingInfo = function () {
    let collisionCheckParams = new CollisionCheckParams();
    let collisionRuntimeParams = new CollisionRuntimeParams();
    return function updateCeilingInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new CharacterCollisionResults(), engine = Globals.getMainEngine()) {
        this.convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, collisionCheckParams);
        this.convertCharacterCollisionResultsToCollisionRuntimeParams(prevCharacterCollisionResults, collisionRuntimeParams);
        collisionCheckParams.myComputeGroundInfoEnabled = false;
        getCollisionCheck(engine).updateSurfaceInfo(currentTransformQuat, collisionCheckParams, collisionRuntimeParams);
        this.convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, currentTransformQuat, outCharacterCollisionResults);
    }
}();

export function convertCharacterCollisionResultsToCollisionRuntimeParams(characterCollisionResults, outCollisionRuntimeParams) {
    outCollisionRuntimeParams.reset();

    characterCollisionResults.myTransformResults.myStartTransformQuat.quat2_getPosition(outCollisionRuntimeParams.myOriginalPosition);
    characterCollisionResults.myTransformResults.myEndTransformQuat.quat2_getPosition(outCollisionRuntimeParams.myNewPosition);

    characterCollisionResults.myTransformResults.myStartTransformQuat.quat2_getForward(outCollisionRuntimeParams.myOriginalForward);
    characterCollisionResults.myTransformResults.myStartTransformQuat.quat2_getUp(outCollisionRuntimeParams.myOriginalUp);

    // Ok: outCollisionRuntimeParams.myOriginalHeight = characterCollisionResults.myOriginalHeight;

    outCollisionRuntimeParams.myOriginalMovement.vec3_copy(characterCollisionResults.myMovementResults.myStartMovement);
    outCollisionRuntimeParams.myFixedMovement.vec3_copy(characterCollisionResults.myMovementResults.myEndMovement);

    outCollisionRuntimeParams.myLastValidOriginalHorizontalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantStartHorizontalMovement);
    outCollisionRuntimeParams.myLastValidOriginalVerticalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantStartVerticalMovement);

    outCollisionRuntimeParams.myLastValidEndHorizontalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantEndHorizontalMovement);
    outCollisionRuntimeParams.myLastValidEndVerticalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantEndVerticalMovement);

    outCollisionRuntimeParams.myLastValidSurfaceAdjustedHorizontalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantAdjustedStartHorizontalMovement);
    outCollisionRuntimeParams.myLastValidSurfaceAdjustedVerticalMovement.vec3_copy(characterCollisionResults.myInternalResults.myLastRelevantAdjustedStartVerticalMovement);

    outCollisionRuntimeParams.myIsOnGround = characterCollisionResults.myGroundInfo.myOnSurface;
    outCollisionRuntimeParams.myGroundAngle = characterCollisionResults.myGroundInfo.mySurfaceAngle;
    outCollisionRuntimeParams.myGroundPerceivedAngle = characterCollisionResults.myGroundInfo.mySurfacePerceivedAngle;
    outCollisionRuntimeParams.myGroundNormal.vec3_copy(characterCollisionResults.myGroundInfo.mySurfaceNormal);
    outCollisionRuntimeParams.myGroundHitMaxAngle = characterCollisionResults.myGroundInfo.mySurfaceHitMaxAngle;
    outCollisionRuntimeParams.myGroundHitMaxNormal.vec3_copy(characterCollisionResults.myGroundInfo.mySurfaceHitMaxNormal);
    outCollisionRuntimeParams.myGroundDistance = characterCollisionResults.myGroundInfo.mySurfaceDistance;
    outCollisionRuntimeParams.myGroundIsBaseInsideCollision = characterCollisionResults.myGroundInfo.myBaseInsideCollision;

    outCollisionRuntimeParams.myIsOnCeiling = characterCollisionResults.myCeilingInfo.myOnSurface;
    outCollisionRuntimeParams.myCeilingAngle = characterCollisionResults.myCeilingInfo.mySurfaceAngle;
    outCollisionRuntimeParams.myCeilingPerceivedAngle = characterCollisionResults.myCeilingInfo.mySurfacePerceivedAngle;
    outCollisionRuntimeParams.myCeilingNormal.vec3_copy(characterCollisionResults.myCeilingInfo.mySurfaceNormal);
    outCollisionRuntimeParams.myCeilingHitMaxAngle = characterCollisionResults.myCeilingInfo.mySurfaceHitMaxAngle;
    outCollisionRuntimeParams.myCeilingHitMaxNormal.vec3_copy(characterCollisionResults.myCeilingInfo.mySurfaceHitMaxNormal);
    outCollisionRuntimeParams.myCeilingDistance = characterCollisionResults.myCeilingInfo.mySurfaceDistance;
    outCollisionRuntimeParams.myCeilingIsBaseInsideCollision = characterCollisionResults.myCeilingInfo.myBaseInsideCollision;

    outCollisionRuntimeParams.myHorizontalMovementCanceled = characterCollisionResults.myHorizontalMovementResults.myMovementFailed;
    outCollisionRuntimeParams.myIsCollidingHorizontally = characterCollisionResults.myHorizontalMovementResults.myMovementCollided;
    outCollisionRuntimeParams.myHorizontalCollisionHit.copy(characterCollisionResults.myHorizontalMovementResults.myReferenceCollisionHit);

    outCollisionRuntimeParams.myVerticalMovementCanceled = characterCollisionResults.myVerticalMovementResults.myMovementFailed;
    outCollisionRuntimeParams.myIsCollidingVertically = characterCollisionResults.myVerticalMovementResults.myMovementCollided;
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

    // Ok: outCollisionRuntimeParams.myHasReducedVerticalMovement = characterCollisionResults.myVerticalMovementResults.myHasMovementBeenReduced;

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

    outCollisionRuntimeParams.myIsTeleport = characterCollisionResults.myCheckType == CharacterCollisionCheckType.CHECK_TELEPORT;
    outCollisionRuntimeParams.myIsMove = characterCollisionResults.myCheckType == CharacterCollisionCheckType.CHECK_MOVEMENT;
    outCollisionRuntimeParams.myIsPositionCheck = characterCollisionResults.myCheckType == CharacterCollisionCheckType.CHECK_TRANSFORM;

    outCollisionRuntimeParams.mySplitMovementSteps = characterCollisionResults.mySplitMovementResults.myStepsToPerform;
    outCollisionRuntimeParams.mySplitMovementStepsPerformed = characterCollisionResults.mySplitMovementResults.myStepsPerformed;
    outCollisionRuntimeParams.mySplitMovementStop = characterCollisionResults.mySplitMovementResults.myMovementInterrupted;
    outCollisionRuntimeParams.mySplitMovementMovementChecked.vec3_copy(characterCollisionResults.mySplitMovementResults.myMovementChecked);

    return outCollisionRuntimeParams;
}

export let convertCollisionRuntimeParamsToCharacterCollisionResults = function () {
    let rotationQuat = quat_create();
    return function convertCollisionRuntimeParamsToCharacterCollisionResults(collisionRuntimeParams, currentTransformQuat, outCharacterCollisionResults) {
        outCharacterCollisionResults.reset();

        if (collisionRuntimeParams.myIsMove) {
            outCharacterCollisionResults.myCheckType = CharacterCollisionCheckType.CHECK_MOVEMENT;
        } else if (collisionRuntimeParams.myIsTeleport) {
            outCharacterCollisionResults.myCheckType = CharacterCollisionCheckType.CHECK_TELEPORT;
        } else if (collisionRuntimeParams.myIsPositionCheck) {
            outCharacterCollisionResults.myCheckType = CharacterCollisionCheckType.CHECK_TRANSFORM;
        }

        rotationQuat.quat_setForward(collisionRuntimeParams.myOriginalForward, collisionRuntimeParams.myOriginalUp);
        outCharacterCollisionResults.myTransformResults.myStartTransformQuat.quat2_setPositionRotationQuat(collisionRuntimeParams.myOriginalPosition, rotationQuat);
        outCharacterCollisionResults.myTransformResults.myEndTransformQuat.quat2_setPositionRotationQuat(collisionRuntimeParams.myNewPosition, rotationQuat);

        outCharacterCollisionResults.myMovementResults.myStartMovement.vec3_copy(collisionRuntimeParams.myOriginalMovement);
        outCharacterCollisionResults.myMovementResults.myEndMovement.vec3_copy(collisionRuntimeParams.myFixedMovement);
        outCharacterCollisionResults.myMovementResults.myMovementFailed = collisionRuntimeParams.myHorizontalMovementCanceled && collisionRuntimeParams.myVerticalMovementCanceled;
        outCharacterCollisionResults.myMovementResults.myMovementCollided = collisionRuntimeParams.myIsCollidingHorizontally || collisionRuntimeParams.myIsCollidingVertically;
        if (collisionRuntimeParams.myIsCollidingHorizontally) {
            outCharacterCollisionResults.myMovementResults.myReferenceCollisionHit.copy(collisionRuntimeParams.myHorizontalCollisionHit);
        } else if (collisionRuntimeParams.myIsCollidingVertically) {
            outCharacterCollisionResults.myMovementResults.myReferenceCollisionHit.copy(collisionRuntimeParams.myVerticalCollisionHit);
        }

        outCharacterCollisionResults.myHorizontalMovementResults.myMovementFailed = collisionRuntimeParams.myHorizontalMovementCanceled;
        outCharacterCollisionResults.myHorizontalMovementResults.myMovementCollided = collisionRuntimeParams.myIsCollidingHorizontally;
        outCharacterCollisionResults.myHorizontalMovementResults.myReferenceCollisionHit.copy(collisionRuntimeParams.myHorizontalCollisionHit);

        outCharacterCollisionResults.myVerticalMovementResults.myMovementFailed = collisionRuntimeParams.myVerticalMovementCanceled;
        outCharacterCollisionResults.myVerticalMovementResults.myMovementCollided = collisionRuntimeParams.myIsCollidingVertically;
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

        outCharacterCollisionResults.myGroundInfo.myOnSurface = collisionRuntimeParams.myIsOnGround;
        outCharacterCollisionResults.myGroundInfo.mySurfaceAngle = collisionRuntimeParams.myGroundAngle;
        outCharacterCollisionResults.myGroundInfo.mySurfacePerceivedAngle = collisionRuntimeParams.myGroundPerceivedAngle;
        outCharacterCollisionResults.myGroundInfo.mySurfaceNormal.vec3_copy(collisionRuntimeParams.myGroundNormal);
        outCharacterCollisionResults.myGroundInfo.mySurfaceHitMaxAngle = collisionRuntimeParams.myGroundHitMaxAngle;
        outCharacterCollisionResults.myGroundInfo.mySurfaceHitMaxNormal.vec3_copy(collisionRuntimeParams.myGroundHitMaxNormal);
        outCharacterCollisionResults.myGroundInfo.mySurfaceDistance = collisionRuntimeParams.myGroundDistance;
        outCharacterCollisionResults.myGroundInfo.myBaseInsideCollision = collisionRuntimeParams.myGroundIsBaseInsideCollision;

        outCharacterCollisionResults.myCeilingInfo.myOnSurface = collisionRuntimeParams.myIsOnCeiling;
        outCharacterCollisionResults.myCeilingInfo.mySurfaceAngle = collisionRuntimeParams.myCeilingAngle;
        outCharacterCollisionResults.myCeilingInfo.mySurfacePerceivedAngle = collisionRuntimeParams.myCeilingPerceivedAngle;
        outCharacterCollisionResults.myCeilingInfo.mySurfaceNormal.vec3_copy(collisionRuntimeParams.myCeilingNormal);
        outCharacterCollisionResults.myCeilingInfo.mySurfaceHitMaxAngle = collisionRuntimeParams.myCeilingHitMaxAngle;
        outCharacterCollisionResults.myCeilingInfo.mySurfaceHitMaxNormal.vec3_copy(collisionRuntimeParams.myCeilingHitMaxNormal);
        outCharacterCollisionResults.myCeilingInfo.mySurfaceDistance = collisionRuntimeParams.myCeilingDistance;
        outCharacterCollisionResults.myCeilingInfo.myBaseInsideCollision = collisionRuntimeParams.myCeilingIsBaseInsideCollision;

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
}();

export let convertCharacterColliderSetupToCollisionCheckParams = function () {
    return function convertCharacterColliderSetupToCollisionCheckParams(characterColliderSetup, outCollisionCheckParams) {
        outCollisionCheckParams.myHeight = characterColliderSetup.myHeight;

        outCollisionCheckParams.myRadius = characterColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeRadius;
        outCollisionCheckParams.myDistanceFromFeetToIgnore = characterColliderSetup.myHorizontalCheckParams.myHorizontalCheckFeetDistanceToIgnore;
        outCollisionCheckParams.myDistanceFromHeadToIgnore = characterColliderSetup.myHorizontalCheckParams.myHorizontalCheckHeadDistanceToIgnore;

        outCollisionCheckParams.myHorizontalMovementCheckEnabled = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementCheckEnabled;

        outCollisionCheckParams.myHorizontalMovementStepEnabled = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementCheckSplitMovementEnabled;
        outCollisionCheckParams.myHorizontalMovementStepMaxLength = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementCheckSplitMovementMaxStepLength;

        outCollisionCheckParams.myHorizontalMovementRadialStepAmount = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementCheckRadialSteps;

        outCollisionCheckParams.myHorizontalMovementCheckDiagonalOutward = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalDiagonalOutwardCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckDiagonalInward = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalDiagonalInwardCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckStraight = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalStraightCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckHorizontalBorder = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalRadialCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckVerticalStraight = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckVerticalDiagonalUpwardOutward = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalDiagonalOutwardUpwardCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckVerticalDiagonalUpwardInward = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalDiagonalInwardUpwardCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckVerticalDiagonalDownwardOutward = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalDiagonalOutwardDownwardCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckVerticalDiagonalDownwardInward = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalDiagonalInwardDownwardCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckVerticalStraightDiagonalUpward = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightDiagonalUpwardCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckVerticalStraightDiagonalDownward = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightDiagonalDownwardCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalOutward = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalRadialDiagonalOutwardCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalInward = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalRadialDiagonalInwardCheckEnabled;

        outCollisionCheckParams.myHorizontalMovementHorizontalStraightCentralCheckEnabled = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalStraightCentralCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementVerticalStraightCentralCheckEnabled = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightCentralCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled;
        outCollisionCheckParams.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled;

        outCollisionCheckParams.myHorizontalPositionCheckEnabled = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionCheckEnabled;

        outCollisionCheckParams.myHalfConeAngle = characterColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeHalfAngle;
        outCollisionCheckParams.myHalfConeSliceAmount = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionCheckConeHalfSlices;
        outCollisionCheckParams.myCheckConeBorder = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHorizontalBorderCheckEnabled;
        outCollisionCheckParams.myCheckConeRay = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHorizontalRadialCheckEnabled;
        outCollisionCheckParams.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalCheckIgnoreHitsInsideCollision;
        outCollisionCheckParams.myHorizontalPositionCheckVerticalDirectionType = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalCheckDirection;

        outCollisionCheckParams.myCheckHeight = characterColliderSetup.myHorizontalCheckParams.myHorizontalHeightCheckEnabled;

        outCollisionCheckParams.myCheckHeightVerticalMovement = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHeightVerticalCheckEnabled;
        outCollisionCheckParams.myCheckHeightVerticalPosition = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHeightVerticalCheckEnabled;
        outCollisionCheckParams.myCheckHeightTopMovement = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHeightHorizontalCheckEnabled;
        outCollisionCheckParams.myCheckHeightTopPosition = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHeightHorizontalCheckEnabled;
        outCollisionCheckParams.myCheckHeightConeOnCollision = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHit;
        outCollisionCheckParams.myCheckHeightConeOnCollisionKeepHit = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHitKeepVerticalHitIfNoHorizontalHit;

        outCollisionCheckParams.myHeightCheckStepAmountMovement = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHeightCheckSteps;
        outCollisionCheckParams.myHeightCheckStepAmountPosition = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHeightCheckSteps;
        outCollisionCheckParams.myCheckVerticalStraight = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalStraightCheckEnabled;
        outCollisionCheckParams.myCheckVerticalDiagonalRayOutward = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalRadialDiagonalOutwardCheckEnabled;
        outCollisionCheckParams.myCheckVerticalDiagonalRayInward = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalRadialDiagonalInwardCheckEnabled;
        outCollisionCheckParams.myCheckVerticalDiagonalBorderOutward = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalBorderDiagonalOutwardCheckEnabled;
        outCollisionCheckParams.myCheckVerticalDiagonalBorderInward = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalBorderDiagonalInwardCheckEnabled;
        outCollisionCheckParams.myCheckVerticalDiagonalBorderRayOutward = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalRadialBorderDiagonalOutwardCheckEnabled;
        outCollisionCheckParams.myCheckVerticalDiagonalBorderRayInward = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalRadialBorderDiagonalInwardCheckEnabled;
        outCollisionCheckParams.myCheckVerticalSearchFartherVerticalHit = characterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalCheckGetFarthestHit;

        outCollisionCheckParams.myCheckHorizontalFixedForwardEnabled = characterColliderSetup.myHorizontalCheckParams.myHorizontalCheckFixedForwardEnabled;
        outCollisionCheckParams.myCheckHorizontalFixedForward.vec3_copy(characterColliderSetup.myHorizontalCheckParams.myHorizontalCheckFixedForward);

        outCollisionCheckParams.myVerticalMovementCheckEnabled = characterColliderSetup.myVerticalCheckParams.myVerticalMovementCheckEnabled;
        outCollisionCheckParams.myVerticalPositionCheckEnabled = characterColliderSetup.myVerticalCheckParams.myVerticalPositionCheckEnabled;
        outCollisionCheckParams.myFeetRadius = characterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRadius;

        outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhill = characterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhill;
        outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphill = characterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphill;
        outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhillMaxAngle = characterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhillMaxSurfaceAngle;
        outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphillMaxAngle = characterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphillMaxSurfaceAngle;
        outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleDownhillMaxPerceivedAngle = characterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhillMaxSurfacePerceivedAngle;
        outCollisionCheckParams.myAdjustVerticalMovementWithGroundAngleUphillMaxPerceivedAngle = characterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphillMaxSurfacePerceivedAngle;
        outCollisionCheckParams.myAdjustHorizontalMovementWithGroundAngleDownhill = characterColliderSetup.myGroundParams.myVerticalMovementAdjustHorizontalMovementBasedOnSurfaceAngleDownhill;
        outCollisionCheckParams.myAdjustHorizontalMovementWithGroundAngleDownhillMinAngle = characterColliderSetup.myGroundParams.myVerticalMovementAdjustHorizontalMovementBasedOnSurfaceAngleDownhillMinSurfaceAngle;

        outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhill = characterColliderSetup.myCeilingParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhill;
        outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphill = characterColliderSetup.myCeilingParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphill;
        outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhillMaxAngle = characterColliderSetup.myCeilingParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhillMaxSurfaceAngle;
        outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphillMaxAngle = characterColliderSetup.myCeilingParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphillMaxSurfaceAngle;
        outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleDownhillMaxPerceivedAngle = characterColliderSetup.myCeilingParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleDownhillMaxSurfacePerceivedAngle;
        outCollisionCheckParams.myAdjustVerticalMovementWithCeilingAngleUphillMaxPerceivedAngle = characterColliderSetup.myCeilingParams.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngleUphillMaxSurfacePerceivedAngle;
        outCollisionCheckParams.myAdjustHorizontalMovementWithCeilingAngleDownhill = characterColliderSetup.myCeilingParams.myVerticalMovementAdjustHorizontalMovementBasedOnSurfaceAngleDownhill;
        outCollisionCheckParams.myAdjustHorizontalMovementWithCeilingAngleDownhillMinAngle = characterColliderSetup.myCeilingParams.myVerticalMovementAdjustHorizontalMovementBasedOnSurfaceAngleDownhillMinSurfaceAngle;

        outCollisionCheckParams.myCheckVerticalFixedForwardEnabled = characterColliderSetup.myVerticalCheckParams.myVerticalCheckFixedForwardEnabled;
        outCollisionCheckParams.myCheckVerticalFixedForward.vec3_copy(characterColliderSetup.myVerticalCheckParams.myVerticalCheckFixedForward);
        outCollisionCheckParams.myCheckVerticalBothDirection = characterColliderSetup.myVerticalCheckParams.myVerticalMovementCheckPerformCheckOnBothSides;

        outCollisionCheckParams.myVerticalMovementReduceEnabled = characterColliderSetup.myVerticalCheckParams.myVerticalMovementCheckReductionEnabled;

        outCollisionCheckParams.myGroundCircumferenceAddCenter = characterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceCentralCheckEnabled;
        outCollisionCheckParams.myGroundCircumferenceSliceAmount = characterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceSlices;
        outCollisionCheckParams.myGroundCircumferenceStepAmount = characterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRadialSteps;
        outCollisionCheckParams.myGroundCircumferenceRotationPerStep = characterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRotationPerRadialStep;
        outCollisionCheckParams.myVerticalAllowHitInsideCollisionIfOneOk = characterColliderSetup.myVerticalCheckParams.myVerticalCheckAllowHitsInsideCollisionIfOneValid;

        outCollisionCheckParams.myHorizontalBlockLayerFlags.copy(characterColliderSetup.myHorizontalCheckParams.myHorizontalCheckBlockLayerFlags);
        outCollisionCheckParams.myVerticalBlockLayerFlags.copy(characterColliderSetup.myVerticalCheckParams.myVerticalCheckBlockLayerFlags);
        outCollisionCheckParams.myHorizontalObjectsToIgnore.pp_copy(characterColliderSetup.myHorizontalCheckParams.myHorizontalCheckObjectsToIgnore);
        outCollisionCheckParams.myVerticalObjectsToIgnore.pp_copy(characterColliderSetup.myVerticalCheckParams.myVerticalCheckObjectsToIgnore);

        outCollisionCheckParams.mySnapOnGroundEnabled = characterColliderSetup.myGroundParams.mySurfaceSnapEnabled;
        outCollisionCheckParams.mySnapOnGroundExtraDistance = characterColliderSetup.myGroundParams.mySurfaceSnapMaxDistance;
        outCollisionCheckParams.mySnapOnCeilingEnabled = characterColliderSetup.myCeilingParams.mySurfaceSnapEnabled;
        outCollisionCheckParams.mySnapOnCeilingExtraDistance = characterColliderSetup.myCeilingParams.mySurfaceSnapMaxDistance;

        outCollisionCheckParams.myGroundPopOutEnabled = characterColliderSetup.myGroundParams.mySurfacePopOutEnabled;
        outCollisionCheckParams.myGroundPopOutExtraDistance = characterColliderSetup.myGroundParams.mySurfacePopOutMaxDistance;
        outCollisionCheckParams.myCeilingPopOutEnabled = characterColliderSetup.myCeilingParams.mySurfacePopOutEnabled;
        outCollisionCheckParams.myCeilingPopOutExtraDistance = characterColliderSetup.myCeilingParams.mySurfacePopOutMaxDistance;

        outCollisionCheckParams.myGroundAngleToIgnore = characterColliderSetup.myGroundParams.mySurfaceAngleToIgnore;
        outCollisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle = characterColliderSetup.myGroundParams.mySurfaceAngleToIgnoreWithSurfacePerceivedAngle;
        outCollisionCheckParams.myCeilingAngleToIgnore = characterColliderSetup.myCeilingParams.mySurfaceAngleToIgnore;
        outCollisionCheckParams.myCeilingAngleToIgnoreWithPerceivedAngle = characterColliderSetup.myCeilingParams.mySurfaceAngleToIgnoreWithSurfacePerceivedAngle;

        outCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreHeight = characterColliderSetup.myGroundParams.myHorizontalMovementSurfaceAngleToIgnoreMaxVerticalDistance;
        outCollisionCheckParams.myHorizontalMovementCeilingAngleIgnoreHeight = characterColliderSetup.myCeilingParams.myHorizontalMovementSurfaceAngleToIgnoreMaxVerticalDistance;
        outCollisionCheckParams.myHorizontalPositionGroundAngleIgnoreHeight = characterColliderSetup.myGroundParams.myHorizontalPositionSurfaceAngleToIgnoreMaxVerticalDistance;
        outCollisionCheckParams.myHorizontalPositionCeilingAngleIgnoreHeight = characterColliderSetup.myCeilingParams.myHorizontalPositionSurfaceAngleToIgnoreMaxVerticalDistance;

        outCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft = characterColliderSetup.myGroundParams.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft;
        outCollisionCheckParams.myHorizontalMovementCeilingAngleIgnoreMaxMovementLeft = characterColliderSetup.myCeilingParams.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft;

        outCollisionCheckParams.myComputeGroundInfoEnabled = characterColliderSetup.myGroundParams.myCollectSurfaceInfo;
        outCollisionCheckParams.myComputeCeilingInfoEnabled = characterColliderSetup.myCeilingParams.myCollectSurfaceInfo;
        outCollisionCheckParams.myDistanceToBeOnGround = characterColliderSetup.myGroundParams.myOnSurfaceMaxOutsideDistance;
        outCollisionCheckParams.myDistanceToComputeGroundInfo = characterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxOutsideDistance;
        outCollisionCheckParams.myDistanceToBeOnCeiling = characterColliderSetup.myCeilingParams.myOnSurfaceMaxOutsideDistance;
        outCollisionCheckParams.myDistanceToComputeCeilingInfo = characterColliderSetup.myCeilingParams.myCollectSurfaceNormalMaxOutsideDistance;
        outCollisionCheckParams.myVerticalFixToBeOnGround = characterColliderSetup.myGroundParams.myOnSurfaceMaxInsideDistance;
        outCollisionCheckParams.myVerticalFixToComputeGroundInfo = characterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxInsideDistance;
        outCollisionCheckParams.myVerticalFixToBeOnCeiling = characterColliderSetup.myCeilingParams.myOnSurfaceMaxInsideDistance;
        outCollisionCheckParams.myVerticalFixToComputeCeilingInfo = characterColliderSetup.myCeilingParams.myCollectSurfaceNormalMaxInsideDistance;

        outCollisionCheckParams.myGroundIsBaseInsideCollisionCheckEnabled = characterColliderSetup.myGroundParams.myBaseInsideCollisionCheckEnabled;
        outCollisionCheckParams.myCeilingIsBaseInsideCollisionCheckEnabled = characterColliderSetup.myCeilingParams.myBaseInsideCollisionCheckEnabled;
        outCollisionCheckParams.myIsOnGroundIfInsideHit = characterColliderSetup.myGroundParams.myOnSurfaceIfBaseInsideCollision;
        outCollisionCheckParams.myIsOnCeilingIfInsideHit = characterColliderSetup.myCeilingParams.myOnSurfaceIfBaseInsideCollision;

        outCollisionCheckParams.myFindGroundDistanceMaxOutsideDistance = characterColliderSetup.myGroundParams.myFindSurfaceDistanceMaxOutsideDistance;
        outCollisionCheckParams.myFindGroundDistanceMaxInsideDistance = characterColliderSetup.myGroundParams.myFindSurfaceDistanceMaxInsideDistance;
        outCollisionCheckParams.myFindCeilingDistanceMaxOutsideDistance = characterColliderSetup.myCeilingParams.myFindSurfaceDistanceMaxOutsideDistance;
        outCollisionCheckParams.myFindCeilingDistanceMaxInsideDistance = characterColliderSetup.myCeilingParams.myFindSurfaceDistanceMaxInsideDistance;

        outCollisionCheckParams.myAllowGroundSteepFix = characterColliderSetup.myGroundParams.myHorizontalMovementAllowExitAttemptWhenOnNotIgnorableSurfacePerceivedAngle;
        outCollisionCheckParams.myAllowCeilingSteepFix = characterColliderSetup.myCeilingParams.myHorizontalMovementAllowExitAttemptWhenOnNotIgnorableSurfacePerceivedAngle;

        outCollisionCheckParams.myMustStayOnGround = characterColliderSetup.myGroundParams.myMovementMustStayOnSurface;
        outCollisionCheckParams.myMustStayOnCeiling = characterColliderSetup.myCeilingParams.myMovementMustStayOnSurface;
        outCollisionCheckParams.myRegatherGroundInfoOnSurfaceCheckFail = characterColliderSetup.myGroundParams.myRecollectSurfaceInfoOnSurfaceCheckFailed;
        outCollisionCheckParams.myRegatherCeilingInfoOnSurfaceCheckFail = characterColliderSetup.myCeilingParams.myRecollectSurfaceInfoOnSurfaceCheckFailed;
        outCollisionCheckParams.myMustStayBelowIgnorableGroundAngleDownhill = characterColliderSetup.myGroundParams.myMovementMustStayOnIgnorableSurfaceAngleDownhill;
        outCollisionCheckParams.myMustStayBelowIgnorableCeilingAngleDownhill = characterColliderSetup.myCeilingParams.myMovementMustStayOnIgnorableSurfaceAngleDownhill;
        outCollisionCheckParams.myMustStayBelowGroundAngleDownhill = characterColliderSetup.myGroundParams.myMovementMustStayOnSurfaceAngleDownhill;
        outCollisionCheckParams.myMustStayBelowCeilingAngleDownhill = characterColliderSetup.myCeilingParams.myMovementMustStayOnSurfaceAngleDownhill;
        outCollisionCheckParams.myMovementMustStayOnGroundHitAngle = characterColliderSetup.myGroundParams.myMovementMustStayOnSurfaceHitMaxAngle;
        outCollisionCheckParams.myMovementMustStayOnCeilingHitAngle = characterColliderSetup.myCeilingParams.myMovementMustStayOnSurfaceHitMaxAngle;

        outCollisionCheckParams.myTeleportMustBeOnIgnorableGroundAngle = characterColliderSetup.myGroundParams.myTeleportMustBeOnIgnorableSurfaceAngle;
        outCollisionCheckParams.myCheckTransformMustBeOnIgnorableGroundAngle = characterColliderSetup.myGroundParams.myCheckTransformMustBeOnIgnorableSurfaceAngle;
        outCollisionCheckParams.myTeleportMustBeOnIgnorableCeilingAngle = characterColliderSetup.myCeilingParams.myTeleportMustBeOnIgnorableSurfaceAngle;
        outCollisionCheckParams.myCheckTransformMustBeOnIgnorableCeilingAngle = characterColliderSetup.myCeilingParams.myCheckTransformMustBeOnIgnorableSurfaceAngle;

        outCollisionCheckParams.myTeleportMustBeOnGroundAngle = characterColliderSetup.myGroundParams.myTeleportMustBeOnSurfaceAngle;
        outCollisionCheckParams.myCheckTransformMustBeOnGroundAngle = characterColliderSetup.myGroundParams.myCheckTransformMustBeOnSurfaceAngle;
        outCollisionCheckParams.myTeleportMustBeOnCeilingAngle = characterColliderSetup.myCeilingParams.myTeleportMustBeOnSurfaceAngle;
        outCollisionCheckParams.myCheckTransformMustBeOnCeilingAngle = characterColliderSetup.myCeilingParams.myCheckTransformMustBeOnSurfaceAngle;

        outCollisionCheckParams.myTeleportMustBeOnGround = characterColliderSetup.myGroundParams.myTeleportMustBeOnSurface;
        outCollisionCheckParams.myCheckTransformMustBeOnGround = characterColliderSetup.myGroundParams.myCheckTransformMustBeOnSurface;
        outCollisionCheckParams.myTeleportMustBeOnCeiling = characterColliderSetup.myCeilingParams.myTeleportMustBeOnSurface;
        outCollisionCheckParams.myCheckTransformMustBeOnCeiling = characterColliderSetup.myCeilingParams.myCheckTransformMustBeOnSurface;

        outCollisionCheckParams.mySlidingEnabled = characterColliderSetup.myWallSlideParams.myWallSlideEnabled;
        outCollisionCheckParams.mySlidingHorizontalMovementCheckBetterNormal = characterColliderSetup.myHorizontalCheckParams.myHorizontalMovementCheckGetBetterReferenceHit;
        outCollisionCheckParams.mySlidingMaxAttempts = characterColliderSetup.myWallSlideParams.myWallSlideMaxAttempts;
        outCollisionCheckParams.mySlidingCheckBothDirections = characterColliderSetup.myWallSlideParams.myCheckBothWallSlideDirections;
        outCollisionCheckParams.mySlidingFlickeringPreventionType = characterColliderSetup.myWallSlideParams.myWallSlideFlickerPreventionMode;
        outCollisionCheckParams.mySlidingFlickeringPreventionCheckOnlyIfAlreadySliding = characterColliderSetup.myWallSlideParams.myWallSlideFlickerPreventionCheckOnlyIfAlreadySliding;
        outCollisionCheckParams.mySlidingFlickerPreventionCheckAnywayCounter = characterColliderSetup.myWallSlideParams.myWallSlideFlickerPreventionForceCheckCounter;
        outCollisionCheckParams.mySlidingAdjustSign90Degrees = characterColliderSetup.myWallSlideParams.my90DegreesWallSlideAdjustDirectionSign;

        outCollisionCheckParams.mySplitMovementEnabled = characterColliderSetup.mySplitMovementParams.mySplitMovementEnabled;
        outCollisionCheckParams.mySplitMovementMaxLength = characterColliderSetup.mySplitMovementParams.mySplitMovementMaxStepLength;
        outCollisionCheckParams.mySplitMovementMaxStepsEnabled = characterColliderSetup.mySplitMovementParams.mySplitMovementMaxSteps != null;
        outCollisionCheckParams.mySplitMovementMaxSteps = characterColliderSetup.mySplitMovementParams.mySplitMovementMaxSteps;
        outCollisionCheckParams.mySplitMovementStepEqualLength = characterColliderSetup.mySplitMovementParams.mySplitMovementMaxStepLength == null;
        outCollisionCheckParams.mySplitMovementStepEqualLengthMinLength = characterColliderSetup.mySplitMovementParams.mySplitMovementMinStepLength;
        outCollisionCheckParams.mySplitMovementStopWhenHorizontalMovementCanceled = characterColliderSetup.mySplitMovementParams.mySplitMovementStopOnHorizontalMovementFailed;
        outCollisionCheckParams.mySplitMovementStopWhenVerticalMovementCanceled = characterColliderSetup.mySplitMovementParams.mySplitMovementStopOnVerticalMovementFailed;
        outCollisionCheckParams.mySplitMovementStopCallback = characterColliderSetup.mySplitMovementParams.mySplitMovementStopOnCallback;
        outCollisionCheckParams.mySplitMovementStopReturnPrevious = characterColliderSetup.mySplitMovementParams.mySplitMovementStopReturnPreviousResults;

        outCollisionCheckParams.myPositionOffsetLocal.vec3_copy(characterColliderSetup.myAdditionalParams.myPositionOffsetLocal);
        outCollisionCheckParams.myRotationOffsetLocalQuat.quat_copy(characterColliderSetup.myAdditionalParams.myRotationOffsetLocalQuat);

        outCollisionCheckParams.myDebugEnabled = characterColliderSetup.myDebugParams.myVisualDebugEnabled;

        outCollisionCheckParams.myDebugHorizontalMovementEnabled = characterColliderSetup.myDebugParams.myVisualDebugHorizontalMovementCheckEnabled;
        outCollisionCheckParams.myDebugHorizontalPositionEnabled = characterColliderSetup.myDebugParams.myVisualDebugHorizontalPositionCheckEnabled;
        outCollisionCheckParams.myDebugVerticalMovementEnabled = characterColliderSetup.myDebugParams.myVisualDebugVerticalMovementCheckEnabled;
        outCollisionCheckParams.myDebugVerticalPositionEnabled = characterColliderSetup.myDebugParams.myVisualDebugVerticalPositionCheckEnabled;
        outCollisionCheckParams.myDebugSlidingEnabled = characterColliderSetup.myDebugParams.myVisualDebugSlideEnabled;

        outCollisionCheckParams.myDebugGroundInfoEnabled = characterColliderSetup.myDebugParams.myVisualDebugGroundInfoEnabled;
        outCollisionCheckParams.myDebugCeilingInfoEnabled = characterColliderSetup.myDebugParams.myVisualDebugGroundInfoEnabled;
        outCollisionCheckParams.myDebugRuntimeParamsEnabled = characterColliderSetup.myDebugParams.myVisualDebugResultsEnabled;
        outCollisionCheckParams.myDebugMovementEnabled = characterColliderSetup.myDebugParams.myVisualDebugMovementEnabled;

        return outCollisionCheckParams;
    }
}()

export let CollisionCheckBridge = {
    initBridge,
    checkMovement,
    checkTeleportToTransform,
    checkTransform,
    updateGroundInfo,
    updateCeilingInfo,
    convertCharacterCollisionResultsToCollisionRuntimeParams,
    convertCollisionRuntimeParamsToCharacterCollisionResults,
    convertCharacterColliderSetupToCollisionCheckParams
};
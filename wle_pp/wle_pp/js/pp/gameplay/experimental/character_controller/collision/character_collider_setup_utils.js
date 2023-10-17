import { PhysicsLayerFlags } from "../../../../cauldron/physics/physics_layer_flags";
import { CharacterColliderSetup, CharacterColliderSlideFlickerPreventionMode } from "./character_collider_setup";

export let CharacterColliderSetupSimplifiedCreationAccuracyLevel = {
    VERY_LOW: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    VERY_HIGH: 4
};

export class CharacterColliderSetupSimplifiedCreationParams {

    constructor() {
        this.myHeight = 0;
        this.myRadius = 0;

        this.myAccuracyLevel = CharacterColliderSetupSimplifiedCreationAccuracyLevel.VERY_LOW;

        this.myIsPlayer = false;

        this.myCheckOnlyFeet = false;

        this.myMaxSpeed = 0;
        this.myAverageFPS = 72;

        this.myCanFly = false;

        this.myShouldSlideAlongWall = false;

        this.myCollectGroundInfo = false;
        this.myShouldSnapOnGround = false;
        this.myMaxDistanceToSnapOnGround = 0;
        this.myMaxWalkableGroundAngle = 0;
        this.myMaxWalkableGroundStepHeight = 0;
        this.myShouldNotFallFromEdges = false;

        this.myHorizontalCheckBlockLayerFlags = new PhysicsLayerFlags();
        this.myHorizontalCheckObjectsToIgnore = [];

        this.myVerticalCheckBlockLayerFlags = new PhysicsLayerFlags();
        this.myVerticalCheckObjectsToIgnore = [];

        this.myHorizontalCheckDebugEnabled = false;
        this.myVerticalCheckDebugEnabled = false;
    }
}

export function createSimplified(simplifiedCreationParams, outCharacterColliderSetup = new CharacterColliderSetup()) {
    outCharacterColliderSetup.myHeight = simplifiedCreationParams.myHeight;
    outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeRadius = simplifiedCreationParams.myRadius;
    outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRadius = simplifiedCreationParams.myRadius / 2;

    outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckFixedForwardEnabled = true;
    outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckFixedForward.vec3_set(0, 0, 1);

    if (!simplifiedCreationParams.myCheckOnlyFeet || simplifiedCreationParams.myCanFly) {
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalHeightCheckEnabled = true;
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalPositionCheckEnabled = true;
    }

    outCharacterColliderSetup.myWallSlideParams.myWallSlideEnabled = simplifiedCreationParams.myShouldSlideAlongWall;

    outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckFeetDistanceToIgnore = simplifiedCreationParams.myMaxWalkableGroundStepHeight;



    outCharacterColliderSetup.myGroundParams.mySurfaceSnapMaxDistance = simplifiedCreationParams.myMaxDistanceToSnapOnGround;
    outCharacterColliderSetup.myGroundParams.mySurfacePopOutMaxDistance = simplifiedCreationParams.myMaxDistanceToSnapOnGround > 0 ?
        simplifiedCreationParams.myMaxDistanceToSnapOnGround : (simplifiedCreationParams.myRadius > 0.1) ? 0.1 : 0.01;
    outCharacterColliderSetup.myGroundParams.mySurfacePopOutMaxDistance = Math.max(outCharacterColliderSetup.myGroundParams.mySurfacePopOutMaxDistance, outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckFeetDistanceToIgnore);
    outCharacterColliderSetup.myGroundParams.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft = simplifiedCreationParams.myRadius * 0.75;

    outCharacterColliderSetup.myGroundParams.myCollectSurfaceInfo = simplifiedCreationParams.myCollectGroundInfo || simplifiedCreationParams.myMaxWalkableGroundAngle > 0;
    outCharacterColliderSetup.myGroundParams.mySurfaceSnapEnabled = simplifiedCreationParams.myShouldSnapOnGround;
    outCharacterColliderSetup.myGroundParams.mySurfacePopOutEnabled = true;
    outCharacterColliderSetup.myGroundParams.mySurfaceAngleToIgnore = simplifiedCreationParams.myMaxWalkableGroundAngle;
    outCharacterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngle = true;

    outCharacterColliderSetup.myGroundParams.myOnSurfaceMaxOutsideDistance = 0.001;
    outCharacterColliderSetup.myGroundParams.myOnSurfaceMaxInsideDistance = 0.001;

    outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxOutsideDistance = (simplifiedCreationParams.myRadius > 0.1) ? 0.1 : 0.01;
    outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxInsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxOutsideDistance;

    outCharacterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhill = true;
    outCharacterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphill = true;

    if (simplifiedCreationParams.myCanFly) {
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckHeadDistanceToIgnore = outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckFeetDistanceToIgnore;

        outCharacterColliderSetup.myCeilingParams.myCollectSurfaceInfo = outCharacterColliderSetup.myGroundParams.myCollectSurfaceInfo;
        outCharacterColliderSetup.myCeilingParams.mySurfacePopOutEnabled = outCharacterColliderSetup.myGroundParams.mySurfacePopOutEnabled;
        outCharacterColliderSetup.myCeilingParams.mySurfaceAngleToIgnore = outCharacterColliderSetup.myGroundParams.mySurfaceAngleToIgnore;

        outCharacterColliderSetup.myCeilingParams.mySurfaceSnapMaxDistance = outCharacterColliderSetup.myGroundParams.mySurfaceSnapMaxDistance;
        outCharacterColliderSetup.myCeilingParams.mySurfacePopOutMaxDistance = outCharacterColliderSetup.myGroundParams.mySurfacePopOutMaxDistance;
        outCharacterColliderSetup.myCeilingParams.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft = outCharacterColliderSetup.myGroundParams.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft;
        outCharacterColliderSetup.myCeilingParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngle = outCharacterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngle;

        outCharacterColliderSetup.myCeilingParams.myOnSurfaceMaxOutsideDistance = outCharacterColliderSetup.myGroundParams.myOnSurfaceMaxOutsideDistance;
        outCharacterColliderSetup.myCeilingParams.myOnSurfaceMaxInsideDistance = outCharacterColliderSetup.myGroundParams.myOnSurfaceMaxInsideDistance;

        outCharacterColliderSetup.myCeilingParams.myCollectSurfaceNormalMaxOutsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxOutsideDistance;
        outCharacterColliderSetup.myCeilingParams.myCollectSurfaceNormalMaxInsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxInsideDistance;

        outCharacterColliderSetup.myCeilingParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhill = outCharacterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhill;
        outCharacterColliderSetup.myCeilingParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphill = outCharacterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphill;
    }

    if (simplifiedCreationParams.myShouldNotFallFromEdges) {
        outCharacterColliderSetup.myGroundParams.myMovementMustStayOnSurface = true;
        outCharacterColliderSetup.myGroundParams.myMovementMustStayOnSurfaceAngleDownhill = Math.max(60, outCharacterColliderSetup.myGroundParams.mySurfaceAngleToIgnore);
    }



    outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckBlockLayerFlags.copy(simplifiedCreationParams.myHorizontalCheckBlockLayerFlags);
    outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckObjectsToIgnore.pp_copy(simplifiedCreationParams.myHorizontalCheckObjectsToIgnore);

    outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckBlockLayerFlags.copy(simplifiedCreationParams.myVerticalCheckBlockLayerFlags);
    outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckObjectsToIgnore.pp_copy(simplifiedCreationParams.myVerticalCheckObjectsToIgnore);



    if (simplifiedCreationParams.myHorizontalCheckDebugEnabled) {
        outCharacterColliderSetup.myDebugParams.myVisualDebugEnabled = true;
        outCharacterColliderSetup.myDebugParams.myVisualDebugHorizontalMovementCheckEnabled = true;
        outCharacterColliderSetup.myDebugParams.myVisualDebugHorizontalPositionCheckEnabled = true;
    }

    if (simplifiedCreationParams.myVerticalCheckDebugEnabled) {
        outCharacterColliderSetup.myDebugParams.myVisualDebugEnabled = true;
        outCharacterColliderSetup.myDebugParams.myVisualDebugVerticalMovementCheckEnabled = true;
        outCharacterColliderSetup.myDebugParams.myVisualDebugVerticalPositionCheckEnabled = true;
    }



    // ACCURACY

    if (simplifiedCreationParams.myAccuracyLevel >= CharacterColliderSetupSimplifiedCreationAccuracyLevel.VERY_LOW) {
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeHalfAngle = 60;

        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHeightVerticalCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHeightVerticalCheckEnabled = true;

        // Enable based on speed?
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementCheckEnabled = false;

        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionCheckConeHalfSlices = 1;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHeightCheckSteps = 1;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHorizontalRadialCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalStraightCheckEnabled = true;



        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceSlices = 4;
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceCentralCheckEnabled = true;
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRadialSteps = 1;

        outCharacterColliderSetup.myVerticalCheckParams.myVerticalMovementCheckEnabled = true;
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalMovementCheckReductionEnabled = true;

        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckAllowHitsInsideCollisionIfOneValid = true;

        if (simplifiedCreationParams.myIsPlayer) {
            outCharacterColliderSetup.myWallSlideParams.myWallSlideMaxAttempts = 2;
            outCharacterColliderSetup.myWallSlideParams.my90DegreesWallSlideAdjustDirectionSign = true;
        }
    }

    if (simplifiedCreationParams.myAccuracyLevel >= CharacterColliderSetupSimplifiedCreationAccuracyLevel.LOW) {
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementCheckRadialSteps = 1;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHeightCheckSteps = 1;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalStraightCentralCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = true;



        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRadialSteps = 2;
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRotationPerRadialStep = 180 / outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceSlices;



        outCharacterColliderSetup.myWallSlideParams.myWallSlideMaxAttempts = 2;
        outCharacterColliderSetup.myWallSlideParams.myCheckBothWallSlideDirections = false;
        outCharacterColliderSetup.myWallSlideParams.myWallSlideFlickerPreventionMode = CharacterColliderSlideFlickerPreventionMode.NONE;
        outCharacterColliderSetup.myWallSlideParams.myWallSlideFlickerPreventionCheckOnlyIfAlreadySliding = false;
        outCharacterColliderSetup.myWallSlideParams.myWallSlideFlickerPreventionForceCheckCounter = 0;
        outCharacterColliderSetup.myWallSlideParams.my90DegreesWallSlideAdjustDirectionSign = false;
    }

    if (simplifiedCreationParams.myAccuracyLevel >= CharacterColliderSetupSimplifiedCreationAccuracyLevel.MEDIUM) {
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHeightHorizontalCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalDiagonalOutwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalDiagonalOutwardUpwardCheckEnabled = true;

        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionCheckConeHalfSlices = 2;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHeightHorizontalCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHorizontalBorderCheckEnabled = true;



        outCharacterColliderSetup.myVerticalCheckParams.myVerticalMovementCheckPerformCheckOnBothSides = true;

        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceSlices = 6;
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRadialSteps = 2;
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRotationPerRadialStep = 180 / outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceSlices;



        outCharacterColliderSetup.myWallSlideParams.myWallSlideMaxAttempts = 3;
        outCharacterColliderSetup.myWallSlideParams.my90DegreesWallSlideAdjustDirectionSign = true;

        if (simplifiedCreationParams.myIsPlayer) {
            outCharacterColliderSetup.myWallSlideParams.myWallSlideFlickerPreventionMode = CharacterColliderSlideFlickerPreventionMode.USE_PREVIOUS_RESULTS;
            outCharacterColliderSetup.myWallSlideParams.myWallSlideFlickerPreventionCheckOnlyIfAlreadySliding = true;
            outCharacterColliderSetup.myWallSlideParams.myWallSlideFlickerPreventionForceCheckCounter = 4;
        }
    }

    if (simplifiedCreationParams.myAccuracyLevel >= CharacterColliderSetupSimplifiedCreationAccuracyLevel.HIGH) {
        if (outCharacterColliderSetup.myWallSlideParams.myWallSlideEnabled) {
            outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementCheckGetBetterReferenceHit = true;

            outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHit = true;
            outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHitKeepVerticalHitIfNoHorizontalHit = true;
        }

        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalDiagonalInwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalStraightCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalStraightCentralCheckEnabled = false;

        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalDiagonalInwardUpwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightDiagonalUpwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = false;



        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceSlices = 8;
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRadialSteps = 2;
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRotationPerRadialStep = 180 / outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceSlices;



        outCharacterColliderSetup.myWallSlideParams.myWallSlideMaxAttempts = 4;

        if (simplifiedCreationParams.myIsPlayer) {
            outCharacterColliderSetup.myWallSlideParams.myCheckBothWallSlideDirections = true;
        }



        outCharacterColliderSetup.myGroundParams.myBaseInsideCollisionCheckEnabled = true;
        outCharacterColliderSetup.myCeilingParams.myBaseInsideCollisionCheckEnabled = true;



        if (simplifiedCreationParams.myMaxSpeed / simplifiedCreationParams.myAverageFPS > simplifiedCreationParams.myRadius) {
            outCharacterColliderSetup.mySplitMovementParams.mySplitMovementEnabled = true;

            outCharacterColliderSetup.mySplitMovementParams.mySplitMovementMaxSteps = Math.ceil((simplifiedCreationParams.myMaxSpeed / simplifiedCreationParams.myAverageFPS) / simplifiedCreationParams.myRadius);
            outCharacterColliderSetup.mySplitMovementParams.mySplitMovementMinStepLength = simplifiedCreationParams.myRadius * 0.75;
        }
    }

    if (simplifiedCreationParams.myAccuracyLevel >= CharacterColliderSetupSimplifiedCreationAccuracyLevel.VERY_HIGH) {
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHeightCheckSteps = 2;

        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementHorizontalRadialCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalDiagonalOutwardDownwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalDiagonalInwardDownwardCheckEnabled = true;

        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightCentralCheckEnabled = false;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightDiagonalDownwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled = false;

        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionHeightCheckSteps = 2;

        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalRadialDiagonalOutwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalBorderDiagonalOutwardCheckEnabled = true;

        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHit = true;
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHitKeepVerticalHitIfNoHorizontalHit = true;



        outCharacterColliderSetup.myGroundParams.myRecollectSurfaceInfoOnSurfaceCheckFailed = true;
        outCharacterColliderSetup.myCeilingParams.myRecollectSurfaceInfoOnSurfaceCheckFailed = outCharacterColliderSetup.myGroundParams.myRecollectSurfaceInfoOnSurfaceCheckFailed;
    }

    return outCharacterColliderSetup;
}

export function createTeleportColliderSetupFromMovementColliderSetup(movementColliderSetup, outTeleportColliderSetup = new CharacterColliderSetup()) {
    outTeleportColliderSetup.copy(movementColliderSetup);

    outTeleportColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeHalfAngle = 180;
    outTeleportColliderSetup.myHorizontalCheckParams.myHorizontalPositionCheckConeHalfSlices =
        Math.round((outTeleportColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeHalfAngle / movementColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeHalfAngle)
            * movementColliderSetup.myHorizontalCheckParams.myHorizontalPositionCheckConeHalfSlices);

    outTeleportColliderSetup.myHorizontalCheckParams.myHorizontalCheckFixedForwardEnabled = true;
    outTeleportColliderSetup.myHorizontalCheckParams.myHorizontalCheckFixedForward.vec3_set(0, 0, 1);

    return outTeleportColliderSetup;
}

export let CharacterColliderSetupUtils = {
    createSimplified,
    createTeleportColliderSetupFromMovementColliderSetup
};
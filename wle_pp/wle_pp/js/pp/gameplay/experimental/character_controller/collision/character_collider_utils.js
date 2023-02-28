PP.CharacterColliderSetupSimplifiedCreationAccuracyLevel = {
    VERY_LOW: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    VERY_HIGH: 4,
};

PP.CharacterColliderSetupSimplifiedCreationParams = class CharacterColliderSetupSimplifiedCreationParams {
    constructor() {
        this.myHeight = 0;
        this.myRadius = 0;

        this.myAccuracyLevel = PP.CharacterColliderSetupSimplifiedCreationAccuracyLevel.VERY_LOW;

        this.myIsPlayer = false;

        this.myCheckOnlyFeet = false;

        this.myAverageSpeed = 0;

        this.myCanFly = false;

        this.myShouldSlideAgainstWall = false;

        this.myCollectGroundInfo = false;
        this.myShouldSnapOnGround = false;
        this.myMaxDistanceToSnapOnGround = 0;
        this.myMaxWalkableGroundAngle = 0;
        this.myMaxWalkableGroundStepHeight = 0;
        this.myShouldNotFallFromEdges = false;

        this.myHorizontalCheckBlockLayerFlags = new PP.PhysicsLayerFlags();
        this.myHorizontalCheckObjectsToIgnore = [];

        this.myVerticalCheckBlockLayerFlags = new PP.PhysicsLayerFlags();
        this.myVerticalCheckObjectsToIgnore = [];

        this.myHorizontalCheckDebugActive = false;
        this.myVerticalCheckDebugActive = false;
    }
};

PP.CharacterColliderUtils = {
    createCharacterColliderSetupSimplified: function (simplifiedCreationParams, outCharacterColliderSetup = new PP.CharacterColliderSetup()) {
        // implemented outside class definition
    },
    createTeleportColliderFromMovementCollider: function (movementColliderSetup, outTeleportColliderSetup = new PP.CharacterColliderSetup()) {
        outTeleportColliderSetup.copy(movementColliderSetup);

        outTeleportColliderSetup.myHorizontalCheckSetup.myHorizontalCheckConeHalfAngle = 180;
        outTeleportColliderSetup.myHorizontalCheckSetup.myHorizontalPositionCheckConeHalfSlices =
            Math.round((outTeleportColliderSetup.myHorizontalCheckSetup.myHorizontalCheckConeHalfAngle / movementColliderSetup.myHorizontalCheckSetup.myHorizontalCheckConeHalfAngle)
                * movementColliderSetup.myHorizontalCheckSetup.myHorizontalPositionCheckConeHalfSlices);

        outTeleportColliderSetup.myHorizontalCheckSetup.myHorizontalCheckFixedForwardEnabled = true;
        outTeleportColliderSetup.myHorizontalCheckSetup.myHorizontalCheckFixedForward.vec3_set(0, 0, 1);

        return outTeleportColliderSetup;
    },
};



// IMPLEMENTATION

PP.CharacterColliderUtils.createCharacterColliderSetupSimplified = function createCharacterColliderSetupSimplified(simplifiedCreationParams, outCharacterColliderSetup = new PP.CharacterColliderSetup()) {
    outCharacterColliderSetup.myHeight = simplifiedCreationParams.myHeight;
    outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckConeRadius = simplifiedCreationParams.myRadius;
    outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRadius = simplifiedCreationParams.myRadius / 2;

    outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckFixedForwardEnabled = true;
    outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckFixedForward.vec3_set(0, 0, 1);

    if (!simplifiedCreationParams.myCheckOnlyFeet || simplifiedCreationParams.myCanFly) {
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalHeightCheckEnabled = true;
        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalPositionCheckEnabled = true;
    }

    outCharacterColliderSetup.myWallSlideSetup.myWallSlideEnabled = simplifiedCreationParams.myShouldSlideAgainstWall;

    outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckFeetDistanceToIgnore = simplifiedCreationParams.myMaxWalkableGroundStepHeight;



    outCharacterColliderSetup.myGroundSetup.mySurfaceSnapMaxDistance = simplifiedCreationParams.myMaxDistanceToSnapOnGround;
    outCharacterColliderSetup.myGroundSetup.mySurfacePopOutMaxDistance = simplifiedCreationParams.myMaxDistanceToSnapOnGround > 0 ?
        simplifiedCreationParams.myMaxDistanceToSnapOnGround : (simplifiedCreationParams.myRadius > 0.1) ? 0.1 : 0.01;
    outCharacterColliderSetup.myGroundSetup.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft = simplifiedCreationParams.myRadius;

    outCharacterColliderSetup.myGroundSetup.myCollectSurfaceInfo = simplifiedCreationParams.myCollectGroundInfo || simplifiedCreationParams.myMaxWalkableGroundAngle > 0;
    outCharacterColliderSetup.myGroundSetup.mySurfaceSnapEnabled = simplifiedCreationParams.myShouldSnapOnGround;
    outCharacterColliderSetup.myGroundSetup.mySurfacePopOutEnabled = true;
    outCharacterColliderSetup.myGroundSetup.mySurfaceAngleToIgnore = simplifiedCreationParams.myMaxWalkableGroundAngle;
    outCharacterColliderSetup.myGroundSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngle = true;

    outCharacterColliderSetup.myGroundSetup.myIsOnSurfaceMaxOutsideDistance = 0.001;
    outCharacterColliderSetup.myGroundSetup.myIsOnSurfaceMaxInsideDistance = 0.001;

    outCharacterColliderSetup.myGroundSetup.myCollectSurfaceNormalMaxOutsideDistance = (simplifiedCreationParams.myRadius > 0.1) ? 0.1 : 0.01;
    outCharacterColliderSetup.myGroundSetup.myCollectSurfaceNormalMaxInsideDistance = outCharacterColliderSetup.myGroundSetup.myCollectSurfaceNormalMaxOutsideDistance;



    if (simplifiedCreationParams.myCanFly) {
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckHeadDistanceToIgnore = outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckFeetDistanceToIgnore;

        outCharacterColliderSetup.myCeilingSetup.myCollectSurfaceInfo = outCharacterColliderSetup.myGroundSetup.myCollectSurfaceInfo;
        outCharacterColliderSetup.myCeilingSetup.mySurfacePopOutEnabled = outCharacterColliderSetup.myGroundSetup.mySurfacePopOutEnabled;
        outCharacterColliderSetup.myCeilingSetup.mySurfaceAngleToIgnore = outCharacterColliderSetup.myGroundSetup.mySurfaceAngleToIgnore;

        outCharacterColliderSetup.myCeilingSetup.mySurfaceSnapMaxDistance = outCharacterColliderSetup.myGroundSetup.mySurfaceSnapMaxDistance;
        outCharacterColliderSetup.myCeilingSetup.mySurfacePopOutMaxDistance = outCharacterColliderSetup.myGroundSetup.mySurfacePopOutMaxDistance;
        outCharacterColliderSetup.myCeilingSetup.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft = outCharacterColliderSetup.myGroundSetup.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft;
        outCharacterColliderSetup.myCeilingSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngle = outCharacterColliderSetup.myGroundSetup.myHorizontalMovementAdjustVerticalMovementBasedOnSurfacePerceivedAngle;

        outCharacterColliderSetup.myCeilingSetup.myIsOnSurfaceMaxOutsideDistance = outCharacterColliderSetup.myGroundSetup.myIsOnSurfaceMaxOutsideDistance;
        outCharacterColliderSetup.myCeilingSetup.myIsOnSurfaceMaxInsideDistance = outCharacterColliderSetup.myGroundSetup.myIsOnSurfaceMaxInsideDistance;

        outCharacterColliderSetup.myCeilingSetup.myCollectSurfaceNormalMaxOutsideDistance = outCharacterColliderSetup.myGroundSetup.myCollectSurfaceNormalMaxOutsideDistance;
        outCharacterColliderSetup.myCeilingSetup.myCollectSurfaceNormalMaxInsideDistance = outCharacterColliderSetup.myGroundSetup.myCollectSurfaceNormalMaxInsideDistance;

    }

    if (simplifiedCreationParams.myShouldNotFallFromEdges) {
        outCharacterColliderSetup.myGroundSetup.myMovementMustStayOnSurface = true;
        outCharacterColliderSetup.myGroundSetup.myMovementMustStayOnSurfaceAngleDownhill = Math.max(60, outCharacterColliderSetup.myGroundSetup.mySurfaceAngleToIgnore);
    }



    outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckBlockLayerFlags.copy(simplifiedCreationParams.myHorizontalCheckBlockLayerFlags);
    outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckObjectsToIgnore.pp_copy(simplifiedCreationParams.myHorizontalCheckObjectsToIgnore);

    outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckBlockLayerFlags.copy(simplifiedCreationParams.myVerticalCheckBlockLayerFlags);
    outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckObjectsToIgnore.pp_copy(simplifiedCreationParams.myVerticalCheckObjectsToIgnore);



    if (simplifiedCreationParams.myHorizontalCheckDebugActive) {
        outCharacterColliderSetup.myDebugSetup.myVisualDebugActive = true;
        outCharacterColliderSetup.myDebugSetup.myVisualDebugHorizontalMovementCheckActive = true;
        outCharacterColliderSetup.myDebugSetup.myVisualDebugHorizontalPositionCheckActive = true;
    }

    if (simplifiedCreationParams.myVerticalCheckDebugActive) {
        outCharacterColliderSetup.myDebugSetup.myVisualDebugActive = true;
        outCharacterColliderSetup.myDebugSetup.myVisualDebugVerticalMovementCheckActive = true;
        outCharacterColliderSetup.myDebugSetup.myVisualDebugVerticalPositionCheckActive = true;
    }



    // ACCURACY

    if (simplifiedCreationParams.myAccuracyLevel >= PP.CharacterColliderSetupSimplifiedCreationAccuracyLevel.VERY_LOW) {
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalCheckConeHalfAngle = 60;

        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHeightVerticalCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHeightVerticalCheckEnabled = true;

        // activate based on speed?
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementCheckEnabled = false;

        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionCheckConeHalfSlices = 1;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHeightCheckSteps = 1;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHorizontalRadialCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalStraightCheckEnabled = true;



        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceSlices = 4;
        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceCentralCheckEnabled = true;
        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRadialSteps = 1;

        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalMovementCheckEnabled = true;
        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalMovementCheckReductionEnabled = true;

        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalPositionCheckEnabled = true;

        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckAllowHitsInsideCollisionIfOneValid = true;
    }

    if (simplifiedCreationParams.myAccuracyLevel >= PP.CharacterColliderSetupSimplifiedCreationAccuracyLevel.LOW) {
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementCheckRadialSteps = 1;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHeightCheckSteps = 1;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalStraightCentralCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = true;



        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRadialSteps = 2;
        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRotationPerRadialStep = 180 / outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceSlices;



        outCharacterColliderSetup.myWallSlideSetup.myWallSlideMaxAttempts = 1;
        outCharacterColliderSetup.myWallSlideSetup.myCheckBothWallSlideDirections = false;
        outCharacterColliderSetup.myWallSlideSetup.myWallSlideFlickerPreventionMode = PP.CharacterColliderSlideFlickerPreventionMode.NONE;
        outCharacterColliderSetup.myWallSlideSetup.myWallSlideFlickerPreventionCheckOnlyIfAlreadySliding = false;
        outCharacterColliderSetup.myWallSlideSetup.myWallSlideFlickerPreventionForceCheckCounter = 0;
        outCharacterColliderSetup.myWallSlideSetup.my90DegreesWallSlideAdjustDirectionSign = false;



        outCharacterColliderSetup.myWallSlideSetup.myWallSlideMaxAttempts = 2;
    }

    if (simplifiedCreationParams.myAccuracyLevel >= PP.CharacterColliderSetupSimplifiedCreationAccuracyLevel.MEDIUM) {
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHeightHorizontalCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalDiagonalOutwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalDiagonalOutwardUpwardCheckEnabled = true;

        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionCheckConeHalfSlices = 2;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHeightHorizontalCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHorizontalBorderCheckEnabled = true;



        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalMovementCheckPerformCheckOnBothSides = true;

        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceSlices = 6;
        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRadialSteps = 2;
        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRotationPerRadialStep = 180 / outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceSlices;



        outCharacterColliderSetup.myWallSlideSetup.myWallSlideMaxAttempts = 3;
        outCharacterColliderSetup.myWallSlideSetup.my90DegreesWallSlideAdjustDirectionSign = true;

        if (simplifiedCreationParams.myIsPlayer) {
            outCharacterColliderSetup.myWallSlideSetup.myWallSlideFlickerPreventionMode = PP.CharacterColliderSlideFlickerPreventionMode.USE_PREVIOUS_RESULTS;
            outCharacterColliderSetup.myWallSlideSetup.myWallSlideFlickerPreventionCheckOnlyIfAlreadySliding = true;
            outCharacterColliderSetup.myWallSlideSetup.myWallSlideFlickerPreventionForceCheckCounter = 4;
        }
    }

    if (simplifiedCreationParams.myAccuracyLevel >= PP.CharacterColliderSetupSimplifiedCreationAccuracyLevel.HIGH) {
        if (outCharacterColliderSetup.myWallSlideSetup.myWallSlideEnabled) {
            outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementCheckGetBetterReferenceHit = true;

            outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHit = true;
            outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHitKeepVerticalHitIfNoHorizontalHit = true;
        }

        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalDiagonalInwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalStraightCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalStraightCentralCheckEnabled = false;

        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalDiagonalInwardUpwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightDiagonalUpwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = false;



        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceSlices = 8;
        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRadialSteps = 2;
        outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceRotationPerRadialStep = 180 / outCharacterColliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceSlices;



        outCharacterColliderSetup.myWallSlideSetup.myWallSlideMaxAttempts = 4;

        if (simplifiedCreationParams.myIsPlayer) {
            outCharacterColliderSetup.myWallSlideSetup.myCheckBothWallSlideDirections = true;
        }



        outCharacterColliderSetup.myGroundSetup.myIsBaseInsideCollisionCheckEnabled = true;
        outCharacterColliderSetup.myCeilingSetup.myIsBaseInsideCollisionCheckEnabled = true;



        let fps = 90;
        if (simplifiedCreationParams.myAverageSpeed / fps > simplifiedCreationParams.myRadius) {
            outCharacterColliderSetup.mySplitMovementSetup.mySplitMovementEnabled = other.mySplitMovementEnabled;

            outCharacterColliderSetup.mySplitMovementSetup.mySplitMovementMaxSteps = Math.ceil((simplifiedCreationParams.myAverageSpeed / fps) / simplifiedCreationParams.myRadius);
            outCharacterColliderSetup.mySplitMovementSetup.mySplitMovementMinStepLength = simplifiedCreationParams.myRadius;
        }
    }

    if (simplifiedCreationParams.myAccuracyLevel >= PP.CharacterColliderSetupSimplifiedCreationAccuracyLevel.VERY_HIGH) {
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHeightCheckSteps = 2;

        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementHorizontalRadialCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalDiagonalOutwardDownwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalDiagonalInwardDownwardCheckEnabled = true;

        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightCentralCheckEnabled = false;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightDiagonalDownwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled = false;

        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionHeightCheckSteps = 2;

        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalRadialDiagonalOutwardCheckEnabled = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalBorderDiagonalOutwardCheckEnabled = true;

        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHit = true;
        outCharacterColliderSetup.myHorizontalCheckSetup.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHitKeepVerticalHitIfNoHorizontalHit = true;



        outCharacterColliderSetup.myGroundSetup.myRecollectSurfaceInfoOnSurfaceCheckFailed = true;
        outCharacterColliderSetup.myCeilingSetup.myRecollectSurfaceInfoOnSurfaceCheckFailed = outCharacterColliderSetup.myGroundSetup.myRecollectSurfaceInfoOnSurfaceCheckFailed;
    }

    return outCharacterColliderSetup;
};

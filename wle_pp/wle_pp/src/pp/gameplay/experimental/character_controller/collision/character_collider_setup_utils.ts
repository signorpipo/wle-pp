import { Object3D } from "@wonderlandengine/api";
import { PhysicsLayerFlags } from "../../../../cauldron/physics/physics_layer_flags.js";
import { CharacterColliderSetup, CharacterColliderSlideFlickerPreventionMode } from "./character_collider_setup.js";

export enum CharacterColliderSetupSimplifiedCreationAccuracyLevel {
    VERY_LOW = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4
};

export class CharacterColliderSetupSimplifiedCreationParams {

    public myHeight: number = 0;
    public myRadius: number = 0;
    public myFeetRadius: number | null = null;

    public myAccuracyLevel: CharacterColliderSetupSimplifiedCreationAccuracyLevel = CharacterColliderSetupSimplifiedCreationAccuracyLevel.VERY_LOW;

    public myIsPlayer: boolean = false;

    /**
     * If you enable this, you might also want to disable {@link myCheckCeilings},  
     * since it doesn't make much sense to check for ceilings when not checking the height
     */
    public myCheckOnlyFeet: boolean = false;

    /**
     * If you enable this, you might also want to disable {@link myCheckOnlyFeet},  
     * since it doesn't make much sense to check for ceilings without also checking the height
     */
    public myCheckCeilings: boolean = false;

    public myMaxMovementSteps: number | null = null;

    public myShouldSlideAlongWall: boolean = false;



    public myCollectGroundInfo: boolean = false;
    public myMaxDistanceToSnapOnGround: number = 0;
    public myMaxDistanceToPopOutGround: number = 0;
    public myMaxWalkableGroundAngle: number = 0;
    public myMaxWalkableGroundStepHeight: number = 0;

    /**
     * Normally, the ground params are used for the ceiling too, but this needs to be a different setting,  
     * since allowing walkable steps on ceiling might create issues with view occlusion for the player (especially with a high value)  
     * since you can go more under some low ceiling making the occlusion head collide with it
     * 
     * Settings it to zero is safer, but means that the ceilings physx must be more flat, because it's easier that a small ceiling bump now blocks you
     */
    public myMaxWalkableCeilingStepHeight: number = 0;

    public myShouldNotFallFromEdges: boolean = false;



    public myHorizontalCheckBlockLayerFlags: PhysicsLayerFlags = new PhysicsLayerFlags();
    public myHorizontalCheckObjectsToIgnore: Object3D[] = [];

    public myVerticalCheckBlockLayerFlags: PhysicsLayerFlags = new PhysicsLayerFlags();
    public myVerticalCheckObjectsToIgnore: Object3D[] = [];

    public myHorizontalCheckDebugEnabled: boolean = false;
    public myVerticalCheckDebugEnabled: boolean = false;
}

export function createSimplified(simplifiedCreationParams: Readonly<CharacterColliderSetupSimplifiedCreationParams>, outCharacterColliderSetup: CharacterColliderSetup = new CharacterColliderSetup()): CharacterColliderSetup {
    outCharacterColliderSetup.myHeight = simplifiedCreationParams.myHeight;
    outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeRadius = simplifiedCreationParams.myRadius;
    outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckCircumferenceRadius = simplifiedCreationParams.myFeetRadius ?? simplifiedCreationParams.myRadius / 2;

    outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckFixedForwardEnabled = true;
    outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckFixedForward.vec3_set(0, 0, 1);

    if (!simplifiedCreationParams.myCheckOnlyFeet) {
        outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalHeightCheckEnabled = true;
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalPositionCheckEnabled = true;
    }

    outCharacterColliderSetup.myWallSlideParams.myWallSlideEnabled = simplifiedCreationParams.myShouldSlideAlongWall;



    outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckFeetDistanceToIgnore = simplifiedCreationParams.myMaxWalkableGroundStepHeight;

    outCharacterColliderSetup.myGroundParams.mySurfaceSnapEnabled = simplifiedCreationParams.myMaxDistanceToSnapOnGround > 0;
    outCharacterColliderSetup.myGroundParams.mySurfaceSnapMaxDistance = simplifiedCreationParams.myMaxDistanceToSnapOnGround;
    outCharacterColliderSetup.myGroundParams.mySurfacePopOutEnabled = simplifiedCreationParams.myMaxDistanceToPopOutGround > 0;
    outCharacterColliderSetup.myGroundParams.mySurfacePopOutMaxDistance = simplifiedCreationParams.myMaxDistanceToPopOutGround;
    outCharacterColliderSetup.myGroundParams.mySurfacePopOutMaxDistance = Math.max(outCharacterColliderSetup.myGroundParams.mySurfacePopOutMaxDistance, outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckFeetDistanceToIgnore);

    outCharacterColliderSetup.myGroundParams.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft = simplifiedCreationParams.myRadius * 0.75;

    outCharacterColliderSetup.myGroundParams.myCollectSurfaceInfo = simplifiedCreationParams.myCollectGroundInfo || simplifiedCreationParams.myMaxWalkableGroundAngle > 0;
    outCharacterColliderSetup.myGroundParams.mySurfaceAngleToIgnore = simplifiedCreationParams.myMaxWalkableGroundAngle;

    outCharacterColliderSetup.myGroundParams.myOnSurfaceMaxOutsideDistance = 0.001;
    outCharacterColliderSetup.myGroundParams.myOnSurfaceMaxInsideDistance = 0.001;

    outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxOutsideDistance = (simplifiedCreationParams.myRadius > 0.1) ? 0.1 : 0.01;
    outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxInsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxOutsideDistance;
    outCharacterColliderSetup.myGroundParams.myCollectSurfaceDistanceOutsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxOutsideDistance;
    outCharacterColliderSetup.myGroundParams.myCollectSurfaceDistanceInsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxInsideDistance;
    outCharacterColliderSetup.myGroundParams.myCollectSurfaceCollisionHitOutsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxOutsideDistance;
    outCharacterColliderSetup.myGroundParams.myCollectSurfaceCollisionHitInsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxInsideDistance;

    outCharacterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhill = true;
    outCharacterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphill = true;

    if (simplifiedCreationParams.myShouldNotFallFromEdges) {
        outCharacterColliderSetup.myGroundParams.myMovementMustStayOnSurface = true;
        outCharacterColliderSetup.myGroundParams.myMovementMustStayOnSurfaceAngleDownhill = Math.max(60, outCharacterColliderSetup.myGroundParams.mySurfaceAngleToIgnore);
    }


    outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckHeadDistanceToIgnore = simplifiedCreationParams.myMaxWalkableCeilingStepHeight;

    if (simplifiedCreationParams.myCheckCeilings) {
        outCharacterColliderSetup.myCeilingParams.mySurfacePopOutEnabled = outCharacterColliderSetup.myGroundParams.mySurfacePopOutEnabled;
        outCharacterColliderSetup.myCeilingParams.mySurfacePopOutMaxDistance = simplifiedCreationParams.myMaxDistanceToPopOutGround;
        outCharacterColliderSetup.myCeilingParams.mySurfacePopOutMaxDistance = Math.max(outCharacterColliderSetup.myCeilingParams.mySurfacePopOutMaxDistance, outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckHeadDistanceToIgnore);

        outCharacterColliderSetup.myCeilingParams.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft = outCharacterColliderSetup.myGroundParams.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft;

        outCharacterColliderSetup.myCeilingParams.myCollectSurfaceInfo = outCharacterColliderSetup.myGroundParams.myCollectSurfaceInfo;
        outCharacterColliderSetup.myCeilingParams.mySurfaceAngleToIgnore = outCharacterColliderSetup.myGroundParams.mySurfaceAngleToIgnore;

        outCharacterColliderSetup.myCeilingParams.myOnSurfaceMaxOutsideDistance = outCharacterColliderSetup.myGroundParams.myOnSurfaceMaxOutsideDistance;
        outCharacterColliderSetup.myCeilingParams.myOnSurfaceMaxInsideDistance = outCharacterColliderSetup.myGroundParams.myOnSurfaceMaxInsideDistance;

        outCharacterColliderSetup.myCeilingParams.myCollectSurfaceNormalMaxOutsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxOutsideDistance;
        outCharacterColliderSetup.myCeilingParams.myCollectSurfaceNormalMaxInsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceNormalMaxInsideDistance;
        outCharacterColliderSetup.myCeilingParams.myCollectSurfaceDistanceOutsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceDistanceOutsideDistance;
        outCharacterColliderSetup.myCeilingParams.myCollectSurfaceDistanceInsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceDistanceInsideDistance;
        outCharacterColliderSetup.myCeilingParams.myCollectSurfaceCollisionHitOutsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceCollisionHitOutsideDistance;
        outCharacterColliderSetup.myCeilingParams.myCollectSurfaceCollisionHitInsideDistance = outCharacterColliderSetup.myGroundParams.myCollectSurfaceCollisionHitInsideDistance;

        outCharacterColliderSetup.myCeilingParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphill = outCharacterColliderSetup.myGroundParams.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphill;
    }



    outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckBlockLayerFlags.copy(simplifiedCreationParams.myHorizontalCheckBlockLayerFlags);
    outCharacterColliderSetup.myHorizontalCheckParams.myHorizontalCheckObjectsToIgnore.pp_copy(simplifiedCreationParams.myHorizontalCheckObjectsToIgnore);

    outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckBlockLayerFlags.copy(simplifiedCreationParams.myVerticalCheckBlockLayerFlags);
    outCharacterColliderSetup.myVerticalCheckParams.myVerticalCheckObjectsToIgnore.pp_copy(simplifiedCreationParams.myVerticalCheckObjectsToIgnore);



    if (simplifiedCreationParams.myHorizontalCheckDebugEnabled) {
        outCharacterColliderSetup.myDebugParams.myVisualDebugEnabled = true;
        outCharacterColliderSetup.myDebugParams.myVisualDebugHorizontalMovementCheckEnabled = true;
        outCharacterColliderSetup.myDebugParams.myVisualDebugHorizontalPositionCheckEnabled = true;
        outCharacterColliderSetup.myDebugParams.myVisualDebugSlideEnabled = true;
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
        outCharacterColliderSetup.myVerticalCheckParams.myVerticalPositionCheckPerformCheckOnBothSides = true;

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



        outCharacterColliderSetup.mySplitMovementParams.mySplitMovementEnabled = true;
        outCharacterColliderSetup.mySplitMovementParams.mySplitMovementMaxSteps = simplifiedCreationParams.myMaxMovementSteps;

        const safeRadius = simplifiedCreationParams.myRadius * 0.75;
        outCharacterColliderSetup.mySplitMovementParams.mySplitMovementMaxStepLength = safeRadius;
        outCharacterColliderSetup.mySplitMovementParams.mySplitMovementMinStepLength = safeRadius;
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

        if (simplifiedCreationParams.myCheckCeilings) {
            outCharacterColliderSetup.myCeilingParams.myBaseInsideCollisionCheckEnabled = true;
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

        if (simplifiedCreationParams.myCheckCeilings) {
            outCharacterColliderSetup.myCeilingParams.myRecollectSurfaceInfoOnSurfaceCheckFailed = outCharacterColliderSetup.myGroundParams.myRecollectSurfaceInfoOnSurfaceCheckFailed;
        }
    }

    return outCharacterColliderSetup;
}

export function createTeleportColliderSetupFromMovementColliderSetup(movementColliderSetup: Readonly<CharacterColliderSetup>, outTeleportColliderSetup: CharacterColliderSetup = new CharacterColliderSetup()): CharacterColliderSetup {
    outTeleportColliderSetup.copy(movementColliderSetup);

    outTeleportColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeHalfAngle = 180;
    outTeleportColliderSetup.myHorizontalCheckParams.myHorizontalPositionCheckConeHalfSlices =
        Math.round((outTeleportColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeHalfAngle / movementColliderSetup.myHorizontalCheckParams.myHorizontalCheckConeHalfAngle)
            * movementColliderSetup.myHorizontalCheckParams.myHorizontalPositionCheckConeHalfSlices);

    outTeleportColliderSetup.myHorizontalCheckParams.myHorizontalCheckFixedForwardEnabled = true;
    outTeleportColliderSetup.myHorizontalCheckParams.myHorizontalCheckFixedForward.vec3_set(0, 0, 1);

    return outTeleportColliderSetup;
}

export const CharacterColliderSetupUtils = {
    createSimplified,
    createTeleportColliderSetupFromMovementColliderSetup
} as const;
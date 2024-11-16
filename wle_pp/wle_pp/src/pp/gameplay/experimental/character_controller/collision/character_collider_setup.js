import { PhysicsLayerFlags } from "../../../../cauldron/physics/physics_layer_flags.js";
import { RaycastBlockColliderType } from "../../../../cauldron/physics/physics_raycast_params.js";
import { quat_create, vec3_create } from "../../../../plugin/js/extensions/array/vec_create_extension.js";

export class CharacterColliderSetup {

    constructor() {
        this.myHeight = 0;

        this.myHorizontalCheckParams = new CharacterColliderHorizontalCheckParams();
        this.myVerticalCheckParams = new CharacterColliderVerticalCheckParams();

        this.myWallSlideParams = new CharacterColliderWallSlideParams();

        this.myGroundParams = new CharacterColliderSurfaceParams();
        this.myCeilingParams = new CharacterColliderSurfaceParams();

        this.mySplitMovementParams = new CharacterColliderSplitMovementParams();

        this.myAdditionalParams = new CharacterColliderAdditionalParams();

        this.myDebugParams = new CharacterColliderDebugParams();
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export let CharacterColliderHorizontalPositionVerticalCheckDirection = {
    UPWARD: 0,      // Gives less issues with a ground based movement, but may also collide a bit more, resulting in less sliding
    DOWNWARD: 1,    // Gives less issues with a ceiling based movement (unusual), but may also collide a bit more, resulting in less sliding and more stuck in front of a wall
    BOTH: 2         // Check both directions, more expensive (2x checks) and better prevent collisions, sliding more, but is more expensive and gives more issues           

    //                                                                                                                                                  _
    // The issues means that a small step at the end of a slope, maybe due to 2 rectangles, one for the floor and the other for the slope like this -> /   
    // can create a small step if the floor rectangle is a bit above the end of the slope, this will make the character get stuck thinking it's a wall
    // BOTH do a more "aggressive" vertical check that makes the character get less stuck in other situations, but can get stuck in this one
    // The better solution is to properly create the level, and if possible combine the 2 rectangles by having the floor a little below the end of the slope (like this -> /-)
    // The step that is created "on the other side" in fact can easily be ignored thanks to the myHorizontalCheckFeetDistanceToIgnore param
    // If the level is properly created the best solution should be UPWARD
    // and also myHorizontalPositionVerticalCheckIgnoreHitsInsideCollision = false
};

export class CharacterColliderHorizontalCheckParams {

    constructor() {
        this.myHorizontalCheckConeRadius = 0;
        this.myHorizontalCheckConeHalfAngle = 0;

        this.myHorizontalHeightCheckEnabled = false;

        this.myHorizontalCheckFeetDistanceToIgnore = 0;
        this.myHorizontalCheckHeadDistanceToIgnore = 0;
        // These distances can be used to make the character ignore small steps (like a stair step) so they can move on it
        // It also needs the surface pop out to be enabeld to then snap on the step

        this.myHorizontalCheckFixedForwardEnabled = false; // This is basically only useful if the cone angle is 180 degrees
        this.myHorizontalCheckFixedForward = vec3_create();

        this.myHorizontalMovementCheckEnabled = false;

        this.myHorizontalMovementCheckRadialSteps = 0;

        this.myHorizontalMovementCheckSplitMovementEnabled = false;
        this.myHorizontalMovementCheckSplitMovementMaxSteps = null;
        this.myHorizontalMovementCheckSplitMovementMaxStepLength = null;
        this.myHorizontalMovementCheckSplitMovementMinStepLength = null;

        this.myHorizontalMovementCheckGetBetterReferenceHit = false;
        // If the horizontal movement finds a hit it stops looking, but could end up having a bad reference collision hit
        // This makes it so it will check a better hit to use later for the slide

        this.myHorizontalMovementHorizontalRadialCheckEnabled = false;
        this.myHorizontalMovementHorizontalDiagonalOutwardCheckEnabled = false;
        this.myHorizontalMovementHorizontalDiagonalInwardCheckEnabled = false;
        this.myHorizontalMovementHorizontalStraightCheckEnabled = false;
        this.myHorizontalMovementHorizontalStraightCentralCheckEnabled = false;

        this.myHorizontalMovementHeightCheckSteps = 0;
        this.myHorizontalMovementHeightHorizontalCheckEnabled = false;
        this.myHorizontalMovementHeightVerticalCheckEnabled = false;

        this.myHorizontalMovementVerticalRadialDiagonalOutwardCheckEnabled = false;
        this.myHorizontalMovementVerticalRadialDiagonalInwardCheckEnabled = false;

        this.myHorizontalMovementVerticalDiagonalOutwardUpwardCheckEnabled = false;
        this.myHorizontalMovementVerticalDiagonalOutwardDownwardCheckEnabled = false;
        this.myHorizontalMovementVerticalDiagonalInwardUpwardCheckEnabled = false;
        this.myHorizontalMovementVerticalDiagonalInwardDownwardCheckEnabled = false;

        this.myHorizontalMovementVerticalStraightCheckEnabled = false;
        this.myHorizontalMovementVerticalStraightCentralCheckEnabled = false;
        this.myHorizontalMovementVerticalStraightDiagonalUpwardCheckEnabled = false;
        this.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = false;
        this.myHorizontalMovementVerticalStraightDiagonalDownwardCheckEnabled = false;
        this.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled = false;

        this.myHorizontalPositionCheckEnabled = false;
        this.myHorizontalPositionCheckConeHalfSlices = 0;
        this.myHorizontalPositionHorizontalBorderCheckEnabled = false;
        this.myHorizontalPositionHorizontalRadialCheckEnabled = false;

        this.myHorizontalPositionHeightCheckSteps = 0;
        this.myHorizontalPositionHeightHorizontalCheckEnabled = false;
        this.myHorizontalPositionHeightVerticalCheckEnabled = false;

        this.myHorizontalPositionVerticalStraightCheckEnabled = false;
        this.myHorizontalPositionVerticalStraightCentralCheckEnabled = false;
        this.myHorizontalPositionVerticalRadialDiagonalOutwardCheckEnabled = false;
        this.myHorizontalPositionVerticalRadialDiagonalInwardCheckEnabled = false;
        this.myHorizontalPositionVerticalBorderDiagonalOutwardCheckEnabled = false;
        this.myHorizontalPositionVerticalBorderDiagonalInwardCheckEnabled = false;
        this.myHorizontalPositionVerticalRadialBorderDiagonalOutwardCheckEnabled = false;
        this.myHorizontalPositionVerticalRadialBorderDiagonalInwardCheckEnabled = false;

        this.myHorizontalPositionVerticalCheckGetFarthestHit = false; // Not very useful but already implemented so

        this.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHit = false;
        this.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHitKeepVerticalHitIfNoHorizontalHit = false;
        // If the horizontal check does not hit the vertical hit will be restored
        // The fact that the horizontal does not hit could be due to the fact that it thinks that the collision can be ignored
        // so restoring the vertical hit can be a bit safer (since u are actually colliding) but also can lead to false positive

        this.myHorizontalPositionVerticalCheckIgnoreHitsInsideCollision = false; // true gives less issues, but may also collide a bit more, resulting in less sliding
        this.myHorizontalPositionVerticalCheckDirection = CharacterColliderHorizontalPositionVerticalCheckDirection.UPWARD;

        this.myHorizontalCheckBlockLayerFlags = new PhysicsLayerFlags();
        this.myHorizontalCheckObjectsToIgnore = [];
        this.myHorizontalBlockColliderType = RaycastBlockColliderType.BOTH;
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterColliderVerticalCheckParams {

    constructor() {
        this.myVerticalCheckCircumferenceRadius = 0;

        this.myVerticalCheckCircumferenceSlices = 0;
        this.myVerticalCheckCircumferenceCentralCheckEnabled = false;
        this.myVerticalCheckCircumferenceRadialSteps = 0;
        this.myVerticalCheckCircumferenceRotationPerRadialStep = 0;

        this.myVerticalCheckFixedForwardEnabled = false;
        this.myVerticalCheckFixedForward = vec3_create();

        this.myVerticalMovementCheckEnabled = false;
        this.myVerticalMovementCheckReductionEnabled = false;
        this.myVerticalMovementCheckPerformCheckOnBothSides = false;

        this.myVerticalPositionCheckEnabled = false;
        this.myVerticalPositionCheckPerformCheckOnBothSides = false;

        this.myVerticalCheckAllowHitsInsideCollisionIfOneValid = false;
        // If at least one vertical raycast is valid (no hit, outside collision) is it ok if the other checks are completely inside a collision
        // let you keep moving vertically if only partially inside a wall

        this.myVerticalCheckBlockLayerFlags = new PhysicsLayerFlags();
        this.myVerticalCheckObjectsToIgnore = [];
        this.myVerticalBlockColliderType = RaycastBlockColliderType.BOTH;
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export let CharacterColliderSlideFlickerPreventionMode = {
    NONE: 0,
    USE_PREVIOUS_RESULTS: 1,                // Allow some flicker before stabilizing but avoid stopping for a 1 frame flicker only (false positive), is also less expensive
    COLLISION_ANGLE_ABOVE_90_DEGREES: 2,    // Prevents most flicker apart those on almost flat surface, can have some false positive, always check when sliding into opposite direction
    COLLISION_ANGLE_ABOVE_90_DEGREES_OR_MOVEMENT_ANGLE_ABOVE_85_DEGREES: 3, // Less flicker than COLLISION_ANGLE_ABOVE_90_DEGREES but more false positive, always check when sliding into opposite direction
    ALWAYS: 4                               // Less flicker than COLLISION_ANGLE_ABOVE_90_DEGREES_OR_MOVEMENT_ANGLE_ABOVE_85_DEGREES but more false positive
};

export class CharacterColliderWallSlideParams {

    constructor() {
        this.myWallSlideEnabled = false;

        this.myWallSlideMaxAttempts = 0;

        this.myCheckBothWallSlideDirections = false;
        // Expensive, 2 times the checks since it basically check again on the other slide direction
        // This can fix some edge cases in which u can get stuck instead of sliding
        // It basically require that u also add flicker prevention

        this.myWallSlideFlickerPreventionMode = CharacterColliderSlideFlickerPreventionMode.NONE;

        this.myWallSlideFlickerPreventionCheckOnlyIfAlreadySliding = false;
        // This flag make it so the prevention is done only if it was already sliding
        // This can lead to a few frames of flicker if u go toward a corner directly, but allow the movement to be more fluid, avoiding getting stuck and false positive

        this.myWallSlideFlickerPreventionForceCheckCounter = 0;
        // If the collision think it needs to check for flicker, it will keep checking for the next X frames based on this value even if the condition are not met anymore
        // This help in catching the flicker when the direction is not changing every frame but every 2-3 for example
        // It's especially useful if combo-ed with CharacterColliderSlideFlickerPreventionMode.USE_PREVIOUS_RESULTS, making it a bit less fluid but also less flickering

        this.my90DegreesWallSlideAdjustDirectionSign = false;
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterColliderSurfaceParams {

    constructor() {
        this.mySurfaceSnapMaxDistance = 0;
        this.mySurfacePopOutMaxDistance = 0;

        this.mySurfaceAngleToIgnore = 0;

        this.mySurfaceAngleToIgnoreWithSurfacePerceivedAngle = null;
        // Between this value and mySurfaceAngleToIgnore, use the perceived angle to see if u can actually ignore the surface
        // This basically means that on steep surface u could still go up by moving diagonally

        this.myHorizontalMovementSurfaceAngleToIgnoreMaxVerticalDistance = null;
        this.myHorizontalPositionSurfaceAngleToIgnoreMaxVerticalDistance = null;
        // If the collision with the surface is above this max value, even if the surface angle is ignorable do not ignore it

        this.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft = null;
        // If the collision with the surface happens during the horizontal movement check, if the horizontal movement left (total movement to perform minus hit distance)
        // is above this value do not ignore it otherwise you would ignore a surface but are actually going too much inside it

        this.myCollectSurfaceInfo = false;

        this.myOnSurfaceMaxOutsideDistance = 0;
        this.myOnSurfaceMaxInsideDistance = 0;

        this.myBaseInsideCollisionCheckEnabled = false;
        this.myOnSurfaceIfBaseInsideCollision = false;

        this.myCollectSurfaceNormalMaxOutsideDistance = 0;
        this.myCollectSurfaceNormalMaxInsideDistance = 0;

        this.myCollectSurfaceDistanceOutsideDistance = 0;
        this.myCollectSurfaceDistanceInsideDistance = 0;

        this.myCollectSurfaceCollisionHitOutsideDistance = 0;
        this.myCollectSurfaceCollisionHitInsideDistance = 0;

        this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhill = false;
        this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphill = false;
        // This make it so when a character moves horizontally on a slope it also add a vertical movement so that the movement is actually on the slope plane
        this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhillMaxSurfaceAngle = null;
        this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphillMaxSurfaceAngle = null;
        this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhillMaxSurfacePerceivedAngle = null;
        this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphillMaxSurfacePerceivedAngle = null;
        // This can be used to limit the adjustment so that on steep slopes u can bounce off, or anyway don't add a huge vertical movement due to a very steep slope

        this.myVerticalMovementAdjustHorizontalMovementOverSurfaceAngleDownhill = false;
        // This make it so when a character moves vertically on a slope (sort of sliding down the slope) it also add a horizontal movement so that the movement is actually on the slope plane
        this.myVerticalMovementAdjustHorizontalMovementOverSurfaceAngleDownhillMinSurfaceAngle = null;
        // This can be used to make it so the movement (and therefore the slide) only happens above a certain angle, like u want to slide down only on steep surfaces

        this.myMovementMustStayOnSurface = false;
        this.myMovementMustStayOnSurfaceHitMaxAngle = null;
        this.myMovementMustStayOnIgnorableSurfaceAngleDownhill = false;
        this.myMovementMustStayOnSurfaceAngleDownhill = null;

        this.myTeleportMustBeOnSurface = false;
        this.myTeleportMustBeOnIgnorableSurfaceAngle = false;
        this.myTeleportMustBeOnSurfaceAngle = null;

        this.myCheckTransformMustBeOnSurface = false;
        this.myCheckTransformMustBeOnIgnorableSurfaceAngle = false;
        this.myCheckTransformMustBeOnSurfaceAngle = null;

        this.myRecollectSurfaceInfoOnSurfaceCheckFailed = false;
        // Instead of copying the previous surface info on fail, regather them

        this.myHorizontalMovementAllowExitAttemptWhenOnNotIgnorableSurfacePerceivedAngle = false;
        // If u start on a not ignorable perceived angle (above angle to ignore) u normally can't even try to move uphill, this will let you try and see if with that movement
        // you could end up in a ignorable perceived angle position
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterColliderSplitMovementParams {

    constructor() {
        this.mySplitMovementEnabled = false;

        this.mySplitMovementMaxSteps = null;
        this.mySplitMovementMaxStepLength = null;
        this.mySplitMovementMinStepLength = null;
        this.mySplitMovementLastStepCanBeLongerThanMaxStepLength = false;

        this.mySplitMovementStopOnHorizontalMovementFailed = false;
        this.mySplitMovementStopOnVerticalMovementFailed = false;
        this.mySplitMovementStopOnVerticalMovementReduced = false;

        this.mySplitMovementStopAndFailIfMovementWouldBeReduced = false;

        /*
        this will not be available until the bridge is removed with a new implementation that directly use the collider and results
        
        this.mySplitMovementStopOnCallback = null;              // Signature: callback(paramsToBeDefined)
        */

        this.mySplitMovementStopReturnPreviousResults = false;
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterColliderAdditionalParams {

    constructor() {
        this.myPositionOffsetLocal = vec3_create();
        this.myRotationOffsetLocalQuat = quat_create();

        /*
        these will not be available until the bridge is removed with a new implementation that directly use the collider and results

        this.myExtraMovementCheckCallback = null;              // Signature: callback(paramsToBeDefined)
        this.myExtraTeleportCheckCallback = null;              // Signature: callback(paramsToBeDefined)
        this.myExtraCheckTransformCheckCallback = null;        // Signature: callback(paramsToBeDefined)
        */
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class CharacterColliderDebugParams {

    constructor() {
        this.myVisualDebugEnabled = false;

        this.myVisualDebugMovementEnabled = false;

        this.myVisualDebugHorizontalMovementCheckEnabled = false;
        this.myVisualDebugHorizontalPositionCheckEnabled = false;

        this.myVisualDebugVerticalMovementCheckEnabled = false;
        this.myVisualDebugVerticalPositionCheckEnabled = false;

        this.myVisualDebugSlideEnabled = false;

        this.myVisualDebugGroundInfoEnabled = false;
        this.myVisualDebugCeilingInfoEnabled = false;

        this.myVisualDebugResultsEnabled = false;
    }

    copy(other) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

CharacterColliderSetup.prototype.copy = function copy(other) {
    this.myHeight = other.myHeight;

    this.myHorizontalCheckParams.copy(other.myHorizontalCheckParams);
    this.myVerticalCheckParams.copy(other.myVerticalCheckParams);

    this.myWallSlideParams.copy(other.myWallSlideParams);

    this.myGroundParams.copy(other.myGroundParams);
    this.myCeilingParams.copy(other.myCeilingParams);

    this.mySplitMovementParams.copy(other.mySplitMovementParams);

    this.myAdditionalParams.copy(other.myAdditionalParams);

    this.myDebugParams.copy(other.myDebugParams);
};

CharacterColliderHorizontalCheckParams.prototype.copy = function copy(other) {
    this.myHorizontalCheckConeRadius = other.myHorizontalCheckConeRadius;
    this.myHorizontalCheckConeHalfAngle = other.myHorizontalCheckConeHalfAngle;

    this.myHorizontalHeightCheckEnabled = other.myHorizontalHeightCheckEnabled;

    this.myHorizontalCheckFeetDistanceToIgnore = other.myHorizontalCheckFeetDistanceToIgnore;
    this.myHorizontalCheckHeadDistanceToIgnore = other.myHorizontalCheckHeadDistanceToIgnore;

    this.myHorizontalCheckFixedForwardEnabled = other.myHorizontalCheckFixedForwardEnabled;
    this.myHorizontalCheckFixedForward.vec3_copy(other.myHorizontalCheckFixedForward);

    this.myHorizontalMovementCheckEnabled = other.myHorizontalMovementCheckEnabled;

    this.myHorizontalMovementCheckRadialSteps = other.myHorizontalMovementCheckRadialSteps;

    this.myHorizontalMovementCheckSplitMovementEnabled = other.myHorizontalMovementCheckSplitMovementEnabled;
    this.myHorizontalMovementCheckSplitMovementMaxSteps = other.myHorizontalMovementCheckSplitMovementMaxSteps;
    this.myHorizontalMovementCheckSplitMovementMaxStepLength = other.myHorizontalMovementCheckSplitMovementMaxStepLength;
    this.myHorizontalMovementCheckSplitMovementMinStepLength = other.myHorizontalMovementCheckSplitMovementMinStepLength;

    this.myHorizontalMovementCheckGetBetterReferenceHit = other.myHorizontalMovementCheckGetBetterReferenceHit;

    this.myHorizontalMovementHorizontalRadialCheckEnabled = other.myHorizontalMovementHorizontalRadialCheckEnabled;
    this.myHorizontalMovementHorizontalDiagonalOutwardCheckEnabled = other.myHorizontalMovementHorizontalDiagonalOutwardCheckEnabled;
    this.myHorizontalMovementHorizontalDiagonalInwardCheckEnabled = other.myHorizontalMovementHorizontalDiagonalInwardCheckEnabled;
    this.myHorizontalMovementHorizontalStraightCheckEnabled = other.myHorizontalMovementHorizontalStraightCheckEnabled;
    this.myHorizontalMovementHorizontalStraightCentralCheckEnabled = other.myHorizontalMovementHorizontalStraightCentralCheckEnabled;

    this.myHorizontalMovementHeightCheckSteps = other.myHorizontalMovementHeightCheckSteps;
    this.myHorizontalMovementHeightVerticalCheckEnabled = other.myHorizontalMovementHeightVerticalCheckEnabled;
    this.myHorizontalMovementHeightHorizontalCheckEnabled = other.myHorizontalMovementHeightHorizontalCheckEnabled;

    this.myHorizontalMovementVerticalRadialDiagonalOutwardCheckEnabled = other.myHorizontalMovementVerticalRadialDiagonalOutwardCheckEnabled;
    this.myHorizontalMovementVerticalRadialDiagonalInwardCheckEnabled = other.myHorizontalMovementVerticalRadialDiagonalInwardCheckEnabled;

    this.myHorizontalMovementVerticalDiagonalOutwardUpwardCheckEnabled = other.myHorizontalMovementVerticalDiagonalOutwardUpwardCheckEnabled;
    this.myHorizontalMovementVerticalDiagonalOutwardDownwardCheckEnabled = other.myHorizontalMovementVerticalDiagonalOutwardDownwardCheckEnabled;
    this.myHorizontalMovementVerticalDiagonalInwardUpwardCheckEnabled = other.myHorizontalMovementVerticalDiagonalInwardUpwardCheckEnabled;
    this.myHorizontalMovementVerticalDiagonalInwardDownwardCheckEnabled = other.myHorizontalMovementVerticalDiagonalInwardDownwardCheckEnabled;

    this.myHorizontalMovementVerticalStraightCheckEnabled = other.myHorizontalMovementVerticalStraightCheckEnabled;
    this.myHorizontalMovementVerticalStraightCentralCheckEnabled = other.myHorizontalMovementVerticalStraightCentralCheckEnabled;
    this.myHorizontalMovementVerticalStraightDiagonalUpwardCheckEnabled = other.myHorizontalMovementVerticalStraightDiagonalUpwardCheckEnabled;
    this.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = other.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled;
    this.myHorizontalMovementVerticalStraightDiagonalDownwardCheckEnabled = other.myHorizontalMovementVerticalStraightDiagonalDownwardCheckEnabled;
    this.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled = other.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled;

    this.myHorizontalPositionCheckEnabled = other.myHorizontalPositionCheckEnabled;
    this.myHorizontalPositionCheckConeHalfSlices = other.myHorizontalPositionCheckConeHalfSlices;
    this.myHorizontalPositionHorizontalBorderCheckEnabled = other.myHorizontalPositionHorizontalBorderCheckEnabled;
    this.myHorizontalPositionHorizontalRadialCheckEnabled = other.myHorizontalPositionHorizontalRadialCheckEnabled;

    this.myHorizontalPositionHeightCheckSteps = other.myHorizontalPositionHeightCheckSteps;
    this.myHorizontalPositionHeightHorizontalCheckEnabled = other.myHorizontalPositionHeightHorizontalCheckEnabled;
    this.myHorizontalPositionHeightVerticalCheckEnabled = other.myHorizontalPositionHeightVerticalCheckEnabled;

    this.myHorizontalPositionVerticalStraightCheckEnabled = other.myHorizontalPositionVerticalStraightCheckEnabled;
    this.myHorizontalPositionVerticalStraightCentralCheckEnabled = other.myHorizontalPositionVerticalStraightCentralCheckEnabled;
    this.myHorizontalPositionVerticalRadialDiagonalOutwardCheckEnabled = other.myHorizontalPositionVerticalRadialDiagonalOutwardCheckEnabled;
    this.myHorizontalPositionVerticalRadialDiagonalInwardCheckEnabled = other.myHorizontalPositionVerticalRadialDiagonalInwardCheckEnabled;
    this.myHorizontalPositionVerticalBorderDiagonalOutwardCheckEnabled = other.myHorizontalPositionVerticalBorderDiagonalOutwardCheckEnabled;
    this.myHorizontalPositionVerticalBorderDiagonalInwardCheckEnabled = other.myHorizontalPositionVerticalBorderDiagonalInwardCheckEnabled;
    this.myHorizontalPositionVerticalRadialBorderDiagonalOutwardCheckEnabled = other.myHorizontalPositionVerticalRadialBorderDiagonalOutwardCheckEnabled;
    this.myHorizontalPositionVerticalRadialBorderDiagonalInwardCheckEnabled = other.myHorizontalPositionVerticalRadialBorderDiagonalInwardCheckEnabled;

    this.myHorizontalPositionVerticalCheckGetFarthestHit = other.myHorizontalPositionVerticalCheckGetFarthestHit;

    this.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHit = other.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHit;
    this.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHitKeepVerticalHitIfNoHorizontalHit = other.myHorizontalPositionVerticalCheckPerformHorizontalCheckOnHitKeepVerticalHitIfNoHorizontalHit;

    this.myHorizontalPositionVerticalCheckIgnoreHitsInsideCollision = other.myHorizontalPositionVerticalCheckIgnoreHitsInsideCollision;
    this.myHorizontalPositionVerticalCheckDirection = other.myHorizontalPositionVerticalCheckDirection;

    this.myHorizontalCheckBlockLayerFlags.setMask(other.myHorizontalCheckBlockLayerFlags.getMask());
    this.myHorizontalCheckObjectsToIgnore.pp_copy(other.myHorizontalCheckObjectsToIgnore);
    this.myHorizontalBlockColliderType = other.myHorizontalBlockColliderType;
};

CharacterColliderVerticalCheckParams.prototype.copy = function copy(other) {
    this.myVerticalCheckCircumferenceRadius = other.myVerticalCheckCircumferenceRadius;

    this.myVerticalCheckCircumferenceSlices = other.myVerticalCheckCircumferenceSlices;
    this.myVerticalCheckCircumferenceCentralCheckEnabled = other.myVerticalCheckCircumferenceCentralCheckEnabled;
    this.myVerticalCheckCircumferenceRadialSteps = other.myVerticalCheckCircumferenceRadialSteps;
    this.myVerticalCheckCircumferenceRotationPerRadialStep = other.myVerticalCheckCircumferenceRotationPerRadialStep;

    this.myVerticalCheckFixedForwardEnabled = other.myVerticalCheckFixedForwardEnabled;
    this.myVerticalCheckFixedForward.vec3_copy(other.myVerticalCheckFixedForward);

    this.myVerticalMovementCheckEnabled = other.myVerticalMovementCheckEnabled;
    this.myVerticalMovementCheckReductionEnabled = other.myVerticalMovementCheckReductionEnabled;
    this.myVerticalMovementCheckPerformCheckOnBothSides = other.myVerticalMovementCheckPerformCheckOnBothSides;

    this.myVerticalPositionCheckEnabled = other.myVerticalPositionCheckEnabled;
    this.myVerticalPositionCheckPerformCheckOnBothSides = other.myVerticalPositionCheckPerformCheckOnBothSides;

    this.myVerticalCheckAllowHitsInsideCollisionIfOneValid = other.myVerticalCheckAllowHitsInsideCollisionIfOneValid;

    this.myVerticalCheckBlockLayerFlags.setMask(other.myVerticalCheckBlockLayerFlags.getMask());
    this.myVerticalCheckObjectsToIgnore.pp_copy(other.myVerticalCheckObjectsToIgnore);
    this.myVerticalBlockColliderType = other.myVerticalBlockColliderType;
};

CharacterColliderWallSlideParams.prototype.copy = function copy(other) {
    this.myWallSlideEnabled = other.myWallSlideEnabled;

    this.myWallSlideMaxAttempts = other.myWallSlideMaxAttempts;

    this.myCheckBothWallSlideDirections = other.myCheckBothWallSlideDirections;

    this.myWallSlideFlickerPreventionMode = other.myWallSlideFlickerPreventionMode;

    this.myWallSlideFlickerPreventionCheckOnlyIfAlreadySliding = other.myWallSlideFlickerPreventionCheckOnlyIfAlreadySliding;

    this.myWallSlideFlickerPreventionForceCheckCounter = other.myWallSlideFlickerPreventionForceCheckCounter;

    this.my90DegreesWallSlideAdjustDirectionSign = other.my90DegreesWallSlideAdjustDirectionSign;
};

CharacterColliderSurfaceParams.prototype.copy = function copy(other) {
    this.mySurfaceSnapMaxDistance = other.mySurfaceSnapMaxDistance;
    this.mySurfacePopOutMaxDistance = other.mySurfacePopOutMaxDistance;

    this.mySurfaceAngleToIgnore = other.mySurfaceAngleToIgnore;
    this.mySurfaceAngleToIgnoreWithSurfacePerceivedAngle = other.mySurfaceAngleToIgnoreWithSurfacePerceivedAngle;

    this.myHorizontalMovementSurfaceAngleToIgnoreMaxVerticalDistance = other.myHorizontalMovementSurfaceAngleToIgnoreMaxVerticalDistance;
    this.myHorizontalPositionSurfaceAngleToIgnoreMaxVerticalDistance = other.myHorizontalPositionSurfaceAngleToIgnoreMaxVerticalDistance;

    this.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft = other.myHorizontalMovementSurfaceAngleToIgnoreMaxHorizontalMovementLeft;

    this.myCollectSurfaceInfo = other.myCollectSurfaceInfo;

    this.myOnSurfaceMaxOutsideDistance = other.myOnSurfaceMaxOutsideDistance;
    this.myOnSurfaceMaxInsideDistance = other.myOnSurfaceMaxInsideDistance;

    this.myBaseInsideCollisionCheckEnabled = other.myBaseInsideCollisionCheckEnabled;
    this.myOnSurfaceIfBaseInsideCollision = other.myOnSurfaceIfBaseInsideCollision;

    this.myCollectSurfaceNormalMaxOutsideDistance = other.myCollectSurfaceNormalMaxOutsideDistance;
    this.myCollectSurfaceNormalMaxInsideDistance = other.myCollectSurfaceNormalMaxInsideDistance;

    this.myCollectSurfaceDistanceOutsideDistance = other.myCollectSurfaceDistanceOutsideDistance;
    this.myCollectSurfaceDistanceInsideDistance = other.myCollectSurfaceDistanceInsideDistance;

    this.myCollectSurfaceCollisionHitOutsideDistance = other.myCollectSurfaceCollisionHitOutsideDistance;
    this.myCollectSurfaceCollisionHitInsideDistance = other.myCollectSurfaceCollisionHitInsideDistance;

    this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhill = other.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhill;
    this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphill = other.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphill;
    this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhillMaxSurfaceAngle = other.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhillMaxSurfaceAngle;
    this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphillMaxSurfaceAngle = other.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphillMaxSurfaceAngle;
    this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhillMaxSurfacePerceivedAngle = other.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleDownhillMaxSurfacePerceivedAngle;
    this.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphillMaxSurfacePerceivedAngle = other.myHorizontalMovementAdjustVerticalMovementOverSurfacePerceivedAngleUphillMaxSurfacePerceivedAngle;

    this.myVerticalMovementAdjustHorizontalMovementOverSurfaceAngleDownhill = other.myVerticalMovementAdjustHorizontalMovementOverSurfaceAngleDownhill;
    this.myVerticalMovementAdjustHorizontalMovementOverSurfaceAngleDownhillMinSurfaceAngle = other.myVerticalMovementAdjustHorizontalMovementOverSurfaceAngleDownhillMinSurfaceAngle;

    this.myMovementMustStayOnSurface = other.myMovementMustStayOnSurface;
    this.myMovementMustStayOnSurfaceHitMaxAngle = other.myMovementMustStayOnSurfaceHitMaxAngle;
    this.myMovementMustStayOnIgnorableSurfaceAngleDownhill = other.myMovementMustStayOnIgnorableSurfaceAngleDownhill;
    this.myMovementMustStayOnSurfaceAngleDownhill = other.myMovementMustStayOnSurfaceAngleDownhill;

    this.myTeleportMustBeOnSurface = other.myTeleportMustBeOnSurface;
    this.myTeleportMustBeOnIgnorableSurfaceAngle = other.myTeleportMustBeOnIgnorableSurfaceAngle;
    this.myTeleportMustBeOnSurfaceAngle = other.myTeleportMustBeOnSurfaceAngle;

    this.myCheckTransformMustBeOnSurface = other.myCheckTransformMustBeOnSurface;
    this.myCheckTransformMustBeOnIgnorableSurfaceAngle = other.myCheckTransformMustBeOnIgnorableSurfaceAngle;
    this.myCheckTransformMustBeOnSurfaceAngle = other.myCheckTransformMustBeOnSurfaceAngle;

    this.myRecollectSurfaceInfoOnSurfaceCheckFailed = other.myRecollectSurfaceInfoOnSurfaceCheckFailed;

    this.myHorizontalMovementAllowExitAttemptWhenOnNotIgnorableSurfacePerceivedAngle = other.myHorizontalMovementAllowExitAttemptWhenOnNotIgnorableSurfacePerceivedAngle;
};

CharacterColliderSplitMovementParams.prototype.copy = function copy(other) {
    this.mySplitMovementEnabled = other.mySplitMovementEnabled;

    this.mySplitMovementMaxSteps = other.mySplitMovementMaxSteps;
    this.mySplitMovementMaxStepLength = other.mySplitMovementMaxStepLength;
    this.mySplitMovementMinStepLength = other.mySplitMovementMinStepLength;
    this.mySplitMovementLastStepCanBeLongerThanMaxStepLength = other.mySplitMovementLastStepCanBeLongerThanMaxStepLength;

    this.mySplitMovementStopOnHorizontalMovementFailed = other.mySplitMovementStopOnHorizontalMovementFailed;
    this.mySplitMovementStopOnVerticalMovementFailed = other.mySplitMovementStopOnVerticalMovementFailed;
    this.mySplitMovementStopOnVerticalMovementReduced = other.mySplitMovementStopOnVerticalMovementReduced;

    this.mySplitMovementStopAndFailIfMovementWouldBeReduced = other.mySplitMovementStopAndFailIfMovementWouldBeReduced;

    /*
    this.mySplitMovementStopOnCallback = other.mySplitMovementStopOnCallback;
    */

    this.mySplitMovementStopReturnPreviousResults = other.mySplitMovementStopReturnPreviousResults;
};

CharacterColliderAdditionalParams.prototype.copy = function copy(other) {
    this.myPositionOffsetLocal.vec3_copy(other.myPositionOffsetLocal);
    this.myRotationOffsetLocalQuat.quat_copy(other.myRotationOffsetLocalQuat);

    /*
    this.myExtraMovementCheckCallback = other.myExtraMovementCheckCallback;
    this.myExtraTeleportCheckCallback = other.myExtraTeleportCheckCallback;
    this.myExtraCheckTransformCheckCallback = other.myExtraCheckTransformCheckCallback;
    */
};

CharacterColliderDebugParams.prototype.copy = function copy(other) {
    this.myVisualDebugEnabled = other.myVisualDebugEnabled;

    this.myVisualDebugMovementEnabled = other.myVisualDebugMovementEnabled;

    this.myVisualDebugHorizontalMovementCheckEnabled = other.myVisualDebugHorizontalMovementCheckEnabled;
    this.myVisualDebugHorizontalPositionCheckEnabled = other.myVisualDebugHorizontalPositionCheckEnabled;

    this.myVisualDebugVerticalMovementCheckEnabled = other.myVisualDebugVerticalMovementCheckEnabled;
    this.myVisualDebugVerticalPositionCheckEnabled = other.myVisualDebugVerticalPositionCheckEnabled;

    this.myVisualDebugSlideEnabled = other.myVisualDebugSlideEnabled;

    this.myVisualDebugGroundInfoEnabled = other.myVisualDebugGroundInfoEnabled;
    this.myVisualDebugCeilingInfoEnabled = other.myVisualDebugCeilingInfoEnabled;

    this.myVisualDebugResultsEnabled = other.myVisualDebugResultsEnabled;
};
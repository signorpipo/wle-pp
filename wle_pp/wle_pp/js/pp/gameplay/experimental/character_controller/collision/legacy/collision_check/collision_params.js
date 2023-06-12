import { PhysicsLayerFlags } from "../../../../../../cauldron/physics/physics_layer_flags";
import { RaycastHit } from "../../../../../../cauldron/physics/physics_raycast_params";
import { quat_create, vec3_create } from "../../../../../../plugin/js/extensions/array_extension";

export class CollisionCheckParams {

    constructor() {
        this.mySplitMovementEnabled = false;
        this.mySplitMovementMaxLength = 0;
        this.mySplitMovementMaxStepsEnabled = false;
        this.mySplitMovementMaxSteps = 0;
        this.mySplitMovementStepEqualLength = false;
        this.mySplitMovementStepEqualLengthMinLength = 0;
        this.mySplitMovementStopWhenHorizontalMovementCanceled = false;
        this.mySplitMovementStopWhenVerticalMovementCanceled = false;
        this.mySplitMovementStopCallback = null;                        // Signature: callback(collisionRuntimeParams)
        this.mySplitMovementStopReturnPrevious = false;

        this.myRadius = 0;
        this.myDistanceFromFeetToIgnore = 0;
        this.myDistanceFromHeadToIgnore = 0;

        this.myPositionOffsetLocal = vec3_create();
        this.myRotationOffsetLocalQuat = quat_create();

        this.myHorizontalMovementCheckEnabled = false;

        // Usually the horizontal movement is very small and it could be simply skipped has a check, the horizontal position check will be enough
        // With small I mean that it's very unlikely that in 10 cm of movement in a frame u are going to hit something in between but not in the final position
        // If u feel like the movement is bigger or want to be sure u can always enabled this
        // If the movement is really that big it's probably better to use the mySplitMovementEnabled flag and split the movement check into smaller movements
        this.myHorizontalMovementStepEnabled = false;
        this.myHorizontalMovementStepMaxLength = 0;

        this.myHorizontalMovementRadialStepAmount = 0;
        this.myHorizontalMovementCheckDiagonalOutward = false;
        this.myHorizontalMovementCheckDiagonalInward = false;
        this.myHorizontalMovementCheckStraight = false;
        this.myHorizontalMovementCheckHorizontalBorder = false;
        this.myHorizontalMovementCheckVerticalStraight = false;
        this.myHorizontalMovementCheckVerticalDiagonalUpwardOutward = false;
        this.myHorizontalMovementCheckVerticalDiagonalUpwardInward = false;
        this.myHorizontalMovementCheckVerticalDiagonalDownwardOutward = false;
        this.myHorizontalMovementCheckVerticalDiagonalDownwardInward = false;
        this.myHorizontalMovementCheckVerticalStraightDiagonalUpward = false;
        this.myHorizontalMovementCheckVerticalStraightDiagonalDownward = false;
        this.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalOutward = false;
        this.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalInward = false;
        this.myHorizontalMovementHorizontalStraightCentralCheckEnabled = false;
        this.myHorizontalMovementVerticalStraightCentralCheckEnabled = false;
        this.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = false;
        this.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled = false;

        this.myHorizontalPositionCheckEnabled = false;

        this.myHalfConeAngle = 0;
        this.myHalfConeSliceAmount = 0;
        this.myCheckConeBorder = false;
        this.myCheckConeRay = false;
        this.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision = true; // True gives less issues(tm), but may also collide a bit more, resulting in less sliding
        this.myHorizontalPositionCheckVerticalDirectionType = 0; // Somewhat expensive, 2 times the check for the vertical check of the horizontal movement!
        // 0: check upward, gives less issues(tm) (hitting a very small step at the end of a slope /-) with a grounded movement (not fly or snapped to ceiling), but may also collide a bit more, resulting in less sliding
        // 1: check downard, gives less issues(tm) with a ceiling-ed movement (not fly or snapped to ground), but may also collide a bit more, resulting in less sliding and more stuck in front of a wall
        // 2: check both directions, more expensive and better prevent collision, sliding more, but is more expensive and gives more issues            
        //                                                                                                                                                      ___
        // The issues(tm) means that a small step at the end of a slope, maybe due to 2 rectangles, one for the floor and the other for the slope like this -> /   
        // can create a small step if the floor rectangle is a bit above the end of the slope, this will make the character get stuck thinking it's a wall
        // 0 avoid this issue for a grounded movement, 2 instead do a more "aggressive" vertical check that makes the character get less stuck in other situations, but can get stuck in this one
        // The better solution is to properly create the level, and if possible combine the 2 rectangles by having the floor a little below the end of the slope
        // The step that is created "on the other side" in fact can easily be ignored thanks to the myDistanceFromFeetToIgnore field
        // If the level is properly created the best solution should be myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision = false and myHorizontalPositionCheckVerticalDirectionType = 0

        this.myCheckHorizontalFixedForwardEnabled = false; // This is basically only useful if the cone angle is 180 degrees
        this.myCheckHorizontalFixedForward = vec3_create();

        this.myVerticalMovementCheckEnabled = false;
        this.myVerticalPositionCheckEnabled = false;
        this.myFeetRadius = 0;

        this.myAdjustVerticalMovementWithGroundAngleDownhill = false;
        this.myAdjustVerticalMovementWithGroundAngleUphill = false;
        this.myAdjustVerticalMovementWithGroundAngleDownhillMaxAngle = null;
        this.myAdjustVerticalMovementWithGroundAngleUphillMaxAngle = null;
        this.myAdjustVerticalMovementWithGroundAngleDownhillMaxPerceivedAngle = null;
        this.myAdjustVerticalMovementWithGroundAngleUphillMaxPerceivedAngle = null;
        this.myAdjustHorizontalMovementWithGroundAngleDownhill = false;
        this.myAdjustHorizontalMovementWithGroundAngleDownhillMinAngle = null;

        this.myAdjustVerticalMovementWithCeilingAngleDownhill = false;
        this.myAdjustVerticalMovementWithCeilingAngleUphill = false;
        this.myAdjustVerticalMovementWithCeilingAngleDownhillMaxAngle = null;
        this.myAdjustVerticalMovementWithCeilingAngleUphillMaxAngle = null;
        this.myAdjustVerticalMovementWithCeilingAngleDownhillMaxAngle = null;
        this.myAdjustVerticalMovementWithCeilingAngleUphillMaxAngle = null;
        this.myAdjustHorizontalMovementWithCeilingAngleDownhill = false;
        this.myAdjustHorizontalMovementWithCeilingAngleDownhillMinAngle = null;

        this.myCheckVerticalFixedForwardEnabled = false;
        this.myCheckVerticalFixedForward = vec3_create();
        this.myCheckVerticalBothDirection = false;

        this.mySnapOnGroundEnabled = false;
        this.mySnapOnGroundExtraDistance = 0;
        this.mySnapOnCeilingEnabled = false;
        this.mySnapOnCeilingExtraDistance = 0;

        this.myGroundPopOutEnabled = false;
        this.myGroundPopOutExtraDistance = 0;
        this.myCeilingPopOutEnabled = false;
        this.myCeilingPopOutExtraDistance = 0;

        this.myVerticalMovementReduceEnabled = false;

        this.myGroundCircumferenceAddCenter = false;
        this.myGroundCircumferenceSliceAmount = 0;
        this.myGroundCircumferenceStepAmount = 0;
        this.myGroundCircumferenceRotationPerStep = 0;
        this.myVerticalAllowHitInsideCollisionIfOneOk = false;

        this.myCheckHeight = false;
        this.myCheckHeightVerticalMovement = false;
        this.myCheckHeightVerticalPosition = false;
        this.myCheckHeightTopMovement = false;
        this.myCheckHeightTopPosition = false;
        this.myCheckHeightConeOnCollision = false;
        this.myCheckHeightConeOnCollisionKeepHit = false;
        // If true and myCheckHeightConeOnCollision is true, if the cone does not hit the height hit will be restored
        // The fact that the cone does not hit could be due to the fact that it thinks that the collision can be ignored though, sop restoring can be a bit safer but also collide more

        this.myHeightCheckStepAmountMovement = 0;
        this.myHeightCheckStepAmountPosition = 0;
        this.myCheckVerticalStraight = false;
        this.myCheckVerticalDiagonalRayOutward = false;
        this.myCheckVerticalDiagonalRayInward = false;
        this.myCheckVerticalDiagonalBorderOutward = false;
        this.myCheckVerticalDiagonalBorderInward = false;
        this.myCheckVerticalDiagonalBorderRayOutward = false;
        this.myCheckVerticalDiagonalBorderRayInward = false;
        this.myCheckVerticalSearchFartherVerticalHit = false; // Somewhat expensive, but can help fix sime sliding issues

        this.myGroundAngleToIgnore = 0;
        this.myGroundAngleToIgnoreWithPerceivedAngle = null;
        this.myCeilingAngleToIgnore = 0;
        this.myCeilingAngleToIgnoreWithPerceivedAngle = null;

        this.myHorizontalMovementGroundAngleIgnoreHeight = null;
        this.myHorizontalMovementCeilingAngleIgnoreHeight = null;
        this.myHorizontalPositionGroundAngleIgnoreHeight = null;
        this.myHorizontalPositionCeilingAngleIgnoreHeight = null;

        this.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft = null;
        this.myHorizontalMovementCeilingAngleIgnoreMaxMovementLeft = null;

        this.myHeight = 0;

        this.myComputeGroundInfoEnabled = false;
        this.myComputeCeilingInfoEnabled = false;
        this.myDistanceToBeOnGround = 0;
        this.myDistanceToComputeGroundInfo = 0;
        this.myDistanceToBeOnCeiling = 0;
        this.myDistanceToComputeCeilingInfo = 0;
        this.myVerticalFixToBeOnGround = 0;
        this.myVerticalFixToComputeGroundInfo = 0;
        this.myVerticalFixToBeOnCeiling = 0;
        this.myVerticalFixToComputeCeilingInfo = 0;
        this.myGroundIsBaseInsideCollisionCheckEnabled = false;
        this.myCeilingIsBaseInsideCollisionCheckEnabled = false;
        this.myIsOnGroundIfInsideHit = false;
        this.myIsOnCeilingIfInsideHit = false;
        this.myIsOnGroundMaxSurfaceAngle = null;
        this.myIsOnCeilingMaxSurfaceAngle = null;
        this.myFindGroundDistanceMaxOutsideDistance = 0;
        this.myFindGroundDistanceMaxInsideDistance = 0;
        this.myFindCeilingDistanceMaxOutsideDistance = 0;
        this.myFindCeilingDistanceMaxInsideDistance = 0;

        this.myAllowGroundSteepFix = false;
        this.myAllowCeilingSteepFix = false;
        this.myMustStayOnGround = false;
        this.myMustStayOnCeiling = false;
        this.myMustStayOnValidGroundAngleDownhill = false;
        this.myMustStayOnValidCeilingAngleDownhill = false;
        this.myRegatherGroundInfoOnSurfaceCheckFail = false;
        this.myRegatherCeilingInfoOnSurfaceCheckFail = false;
        this.myMustStayBelowIgnorableGroundAngleDownhill = false;
        this.myMustStayBelowIgnorableCeilingAngleDownhill = false;
        this.myMustStayBelowGroundAngleDownhill = null;
        this.myMustStayBelowCeilingAngleDownhill = null;
        this.myMovementMustStayOnGroundHitAngle = null;
        this.myMovementMustStayOnCeilingHitAngle = null;

        this.myTeleportMustBeOnIgnorableGroundAngle = false;
        this.myCheckTransformMustBeOnIgnorableGroundAngle = false;
        this.myTeleportMustBeOnIgnorableCeilingAngle = false;
        this.myCheckTransformMustBeOnIgnorableCeilingAngle = false;

        this.myTeleportMustBeOnGroundAngle = null;
        this.myCheckTransformMustBeOnGroundAngle = null;
        this.myTeleportMustBeOnCeilingAngle = null;
        this.myCheckTransformMustBeOnCeilingAngle = null;

        this.myTeleportMustBeOnGround = false;
        this.myCheckTransformMustBeOnGround = false;
        this.myTeleportMustBeOnCeiling = false;
        this.myCheckTransformMustBeOnCeiling = false;

        this.mySlidingEnabled = false;
        this.mySlidingHorizontalMovementCheckBetterNormal = false;
        this.mySlidingMaxAttempts = 0;
        this.mySlidingCheckBothDirections = false;       // Expensive, 2 times the check for the whole horizontal movement!
        // This can fix some edge cases in which u can get stuck instead of sliding
        // It basically require that u also add flicker prevention

        this.mySlidingFlickeringPreventionType = 0;      // Expensive, 2 times the check for the whole horizontal movement!
        // 0: no prevention
        // 1: use previous frame data to understand if the sliding could flicker, this avoid stopping the movement when the flicker would just last some frames, 
        //    but also allows a bit of flicker that stabilize after 2-3 frames
        // 2: check when sliding collision angle is more then 90 degrees, prevents most flicker apart those on almost flat surfaces
        // 3: check 2 + check when sliding movement angle is more then 85 degrees, prevents almost all flicker, even on almost flat surfaces
        // 4: check every time
        //
        // From 3 and above you could have that the flicker prevents the movement when u expect it, because it's a more aggressive prevention
        // In case a fluid movement is more important than a bit of flicker from time to time, 1 is a better choice (which is also less expensive than 3 and above)
        // 2 is just a less expensive version of 3 (check less times) but also less precise, allowing more flickering

        this.mySlidingFlickeringPreventionCheckOnlyIfAlreadySliding = false;
        // This flag make it so the prevention is done only if it was already sliding, this can lead to a few frames of flicker if u go toward a corner directly
        // but allow the movement to be more fluid, avoiding getting stuck

        this.mySlidingFlickerPreventionCheckAnywayCounter = 0;
        // If the collision think it needs to check for flicker, it will keep checking for the next X frames based on this value even if the condition are not met anymore
        // This help in catching the flicker when the direction is not changing every frame but every 2-3 for example
        // It's especially useful if combo-ed with mySlidingFlickeringPreventionType == 1, making it a bit less fluid but also less flickering

        this.mySlidingAdjustSign90Degrees = false;

        this.myHorizontalBlockLayerFlags = new PhysicsLayerFlags();
        this.myHorizontalObjectsToIgnore = [];

        this.myVerticalBlockLayerFlags = new PhysicsLayerFlags();
        this.myVerticalObjectsToIgnore = [];

        this.myExtraMovementCheckCallback = null;              // Signature: callback(startMovement, endMovement, currentPosition, currentTransformUp, currentTransformForward, currentHeight, collisionCheckParams, prevCollisionRuntimeParams, outCollisionRuntimeParams, outFixedMovement) -> outFixedMovement
        this.myExtraTeleportCheckCallback = null;              // Signature: callback(collisionRuntimeParams) -> bool
        this.myExtraCheckTransformCheckCallback = null;        // Signature: callback(collisionRuntimeParams) -> bool

        this.myDebugEnabled = false;

        this.myDebugHorizontalMovementEnabled = false;
        this.myDebugHorizontalPositionEnabled = false;
        this.myDebugVerticalMovementEnabled = false;
        this.myDebugVerticalPositionEnabled = false;
        this.myDebugSlidingEnabled = false;
        this.myDebugGroundInfoEnabled = false;
        this.myDebugCeilingInfoEnabled = false;
        this.myDebugRuntimeParamsEnabled = false;
        this.myDebugMovementEnabled = false;
    }

    copy(other) {
        this.mySplitMovementEnabled = other.mySplitMovementEnabled;
        this.mySplitMovementMaxLength = other.mySplitMovementMaxLength;
        this.mySplitMovementMaxStepsEnabled = other.mySplitMovementMaxStepsEnabled;
        this.mySplitMovementMaxSteps = other.mySplitMovementMaxSteps;
        this.mySplitMovementStepEqualLength = other.mySplitMovementStepEqualLength;
        this.mySplitMovementStepEqualLengthMinLength = other.mySplitMovementStepEqualLengthMinLength;
        this.mySplitMovementStopWhenHorizontalMovementCanceled = other.mySplitMovementStopWhenHorizontalMovementCanceled;
        this.mySplitMovementStopWhenVerticalMovementCanceled = other.mySplitMovementStopWhenVerticalMovementCanceled;
        this.mySplitMovementStopCallback = other.mySplitMovementStopCallback;
        this.mySplitMovementStopReturnPrevious = other.mySplitMovementStopReturnPrevious;

        this.myRadius = other.myRadius;
        this.myDistanceFromFeetToIgnore = other.myDistanceFromFeetToIgnore;
        this.myDistanceFromHeadToIgnore = other.myDistanceFromHeadToIgnore;

        this.myPositionOffsetLocal.vec3_copy(other.myPositionOffsetLocal);
        this.myRotationOffsetLocalQuat.quat_copy(other.myRotationOffsetLocalQuat);

        this.myHorizontalMovementCheckEnabled = other.myHorizontalMovementCheckEnabled;
        this.myHorizontalMovementStepEnabled = other.myHorizontalMovementStepEnabled;
        this.myHorizontalMovementStepMaxLength = other.myHorizontalMovementStepMaxLength;
        this.myHorizontalMovementRadialStepAmount = other.myHorizontalMovementRadialStepAmount;
        this.myHorizontalMovementCheckDiagonalOutward = other.myHorizontalMovementCheckDiagonalOutward;
        this.myHorizontalMovementCheckDiagonalInward = other.myHorizontalMovementCheckDiagonalInward;
        this.myHorizontalMovementCheckStraight = other.myHorizontalMovementCheckStraight;
        this.myHorizontalMovementCheckHorizontalBorder = other.myHorizontalMovementCheckHorizontalBorder;
        this.myHorizontalMovementCheckVerticalStraight = other.myHorizontalMovementCheckVerticalStraight;
        this.myHorizontalMovementCheckVerticalDiagonalUpwardOutward = other.myHorizontalMovementCheckVerticalDiagonalUpwardOutward;
        this.myHorizontalMovementCheckVerticalDiagonalUpwardInward = other.myHorizontalMovementCheckVerticalDiagonalUpwardInward;
        this.myHorizontalMovementCheckVerticalDiagonalDownwardOutward = other.myHorizontalMovementCheckVerticalDiagonalDownwardOutward;
        this.myHorizontalMovementCheckVerticalDiagonalDownwardInward = other.myHorizontalMovementCheckVerticalDiagonalDownwardInward;
        this.myHorizontalMovementCheckVerticalStraightDiagonalUpward = other.myHorizontalMovementCheckVerticalStraightDiagonalUpward;
        this.myHorizontalMovementCheckVerticalStraightDiagonalDownward = other.myHorizontalMovementCheckVerticalStraightDiagonalDownward;
        this.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalOutward = other.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalOutward;
        this.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalInward = other.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalInward;
        this.myHorizontalMovementHorizontalStraightCentralCheckEnabled = other.myHorizontalMovementHorizontalStraightCentralCheckEnabled;
        this.myHorizontalMovementVerticalStraightCentralCheckEnabled = other.myHorizontalMovementVerticalStraightCentralCheckEnabled;
        this.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = other.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled;
        this.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled = other.myHorizontalMovementVerticalStraightDiagonalDownwardCentralCheckEnabled;

        this.myHorizontalPositionCheckEnabled = other.myHorizontalPositionCheckEnabled;
        this.myHalfConeAngle = other.myHalfConeAngle;
        this.myHalfConeSliceAmount = other.myHalfConeSliceAmount;
        this.myCheckConeBorder = other.myCheckConeBorder;
        this.myCheckConeRay = other.myCheckConeRay;
        this.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision = other.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision;
        this.myHorizontalPositionCheckVerticalDirectionType = other.myHorizontalPositionCheckVerticalDirectionType;

        this.myVerticalMovementCheckEnabled = other.myVerticalMovementCheckEnabled;
        this.myVerticalPositionCheckEnabled = other.myVerticalPositionCheckEnabled;
        this.myFeetRadius = other.myFeetRadius;

        this.myAdjustVerticalMovementWithGroundAngleDownhill = other.myAdjustVerticalMovementWithGroundAngleDownhill;
        this.myAdjustVerticalMovementWithGroundAngleUphill = other.myAdjustVerticalMovementWithGroundAngleUphill;
        this.myAdjustVerticalMovementWithGroundAngleDownhillMaxAngle = other.myAdjustVerticalMovementWithGroundAngleDownhillMaxAngle;
        this.myAdjustVerticalMovementWithGroundAngleUphillMaxAngle = other.myAdjustVerticalMovementWithGroundAngleUphillMaxAngle;
        this.myAdjustVerticalMovementWithGroundAngleDownhillMaxPerceivedAngle = other.myAdjustVerticalMovementWithGroundAngleDownhillMaxPerceivedAngle;
        this.myAdjustVerticalMovementWithGroundAngleUphillMaxPerceivedAngle = other.myAdjustVerticalMovementWithGroundAngleUphillMaxPerceivedAngle;
        this.myAdjustHorizontalMovementWithGroundAngleDownhill = other.myAdjustHorizontalMovementWithGroundAngleDownhill;
        this.myAdjustHorizontalMovementWithGroundAngleDownhillMinAngle = other.myAdjustHorizontalMovementWithGroundAngleDownhillMinAngle;

        this.myAdjustVerticalMovementWithCeilingAngleDownhill = other.myAdjustVerticalMovementWithCeilingAngleDownhill;
        this.myAdjustVerticalMovementWithCeilingAngleUphill = other.myAdjustVerticalMovementWithCeilingAngleUphill;
        this.myAdjustVerticalMovementWithCeilingAngleDownhillMaxAngle = other.myAdjustVerticalMovementWithCeilingAngleDownhillMaxAngle;
        this.myAdjustVerticalMovementWithCeilingAngleUphillMaxAngle = other.myAdjustVerticalMovementWithCeilingAngleUphillMaxAngle;
        this.myAdjustVerticalMovementWithCeilingAngleDownhillMaxAngle = other.myAdjustVerticalMovementWithCeilingAngleDownhillMaxAngle;
        this.myAdjustVerticalMovementWithCeilingAngleUphillMaxAngle = other.myAdjustVerticalMovementWithCeilingAngleUphillMaxAngle;
        this.myAdjustHorizontalMovementWithCeilingAngleDownhill = other.myAdjustHorizontalMovementWithCeilingAngleDownhill;
        this.myAdjustHorizontalMovementWithCeilingAngleDownhillMinAngle = other.myAdjustHorizontalMovementWithCeilingAngleDownhillMinAngle;

        this.myCheckVerticalFixedForwardEnabled = other.myCheckVerticalFixedForwardEnabled;
        this.myCheckVerticalFixedForward.vec3_copy(other.myCheckVerticalFixedForward);
        this.myCheckVerticalBothDirection = other.myCheckVerticalBothDirection;

        this.mySnapOnGroundEnabled = other.mySnapOnGroundEnabled;
        this.mySnapOnGroundExtraDistance = other.mySnapOnGroundExtraDistance;
        this.mySnapOnCeilingEnabled = other.mySnapOnCeilingEnabled;
        this.mySnapOnCeilingExtraDistance = other.mySnapOnCeilingExtraDistance;

        this.myGroundPopOutEnabled = other.myGroundPopOutEnabled;
        this.myGroundPopOutExtraDistance = other.myGroundPopOutExtraDistance;
        this.myCeilingPopOutEnabled = other.myCeilingPopOutEnabled;
        this.myCeilingPopOutExtraDistance = other.myCeilingPopOutExtraDistance;

        this.myVerticalMovementReduceEnabled = other.myVerticalMovementReduceEnabled;

        this.myGroundCircumferenceAddCenter = other.myGroundCircumferenceAddCenter;
        this.myGroundCircumferenceSliceAmount = other.myGroundCircumferenceSliceAmount;
        this.myGroundCircumferenceStepAmount = other.myGroundCircumferenceStepAmount;
        this.myGroundCircumferenceRotationPerStep = other.myGroundCircumferenceRotationPerStep;
        this.myVerticalAllowHitInsideCollisionIfOneOk = other.myVerticalAllowHitInsideCollisionIfOneOk;

        this.myCheckHeight = other.myCheckHeight;
        this.myCheckHeightVerticalMovement = other.myCheckHeightVerticalMovement;
        this.myCheckHeightVerticalPosition = other.myCheckHeightVerticalPosition;
        this.myCheckHeightTopMovement = other.myCheckHeightTopMovement;
        this.myCheckHeightTopPosition = other.myCheckHeightTopPosition;
        this.myCheckHeightConeOnCollision = other.myCheckHeightConeOnCollision;
        this.myCheckHeightConeOnCollisionKeepHit = other.myCheckHeightConeOnCollisionKeepHit;
        this.myHeightCheckStepAmountMovement = other.myHeightCheckStepAmountMovement;
        this.myHeightCheckStepAmountPosition = other.myHeightCheckStepAmountPosition;
        this.myCheckVerticalStraight = other.myCheckVerticalStraight;
        this.myCheckVerticalDiagonalRayOutward = other.myCheckVerticalDiagonalRayOutward;
        this.myCheckVerticalDiagonalRayInward = other.myCheckVerticalDiagonalRayInward;
        this.myCheckVerticalDiagonalBorderOutward = other.myCheckVerticalDiagonalBorderOutward;
        this.myCheckVerticalDiagonalBorderInward = other.myCheckVerticalDiagonalBorderInward;
        this.myCheckVerticalDiagonalBorderRayOutward = other.myCheckVerticalDiagonalBorderRayOutward;
        this.myCheckVerticalDiagonalBorderRayInward = other.myCheckVerticalDiagonalBorderRayInward;
        this.myCheckVerticalSearchFartherVerticalHit = other.myCheckVerticalSearchFartherVerticalHit;

        this.myGroundAngleToIgnore = other.myGroundAngleToIgnore;
        this.myGroundAngleToIgnoreWithPerceivedAngle = other.myGroundAngleToIgnoreWithPerceivedAngle;
        this.myCeilingAngleToIgnore = other.myCeilingAngleToIgnore;
        this.myCeilingAngleToIgnoreWithPerceivedAngle = other.myCeilingAngleToIgnoreWithPerceivedAngle;

        this.myHorizontalMovementGroundAngleIgnoreHeight = other.myHorizontalMovementGroundAngleIgnoreHeight;
        this.myHorizontalMovementCeilingAngleIgnoreHeight = other.myHorizontalMovementCeilingAngleIgnoreHeight;
        this.myHorizontalPositionGroundAngleIgnoreHeight = other.myHorizontalPositionGroundAngleIgnoreHeight;
        this.myHorizontalPositionCeilingAngleIgnoreHeight = other.myHorizontalPositionCeilingAngleIgnoreHeight;

        this.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft = other.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft;
        this.myHorizontalMovementCeilingAngleIgnoreMaxMovementLeft = other.myHorizontalMovementCeilingAngleIgnoreMaxMovementLeft;

        this.myHeight = other.myHeight;

        this.myComputeGroundInfoEnabled = other.myComputeGroundInfoEnabled;
        this.myComputeCeilingInfoEnabled = other.myComputeCeilingInfoEnabled;
        this.myDistanceToBeOnGround = other.myDistanceToBeOnGround;
        this.myDistanceToComputeGroundInfo = other.myDistanceToComputeGroundInfo;
        this.myDistanceToBeOnCeiling = other.myDistanceToBeOnCeiling;
        this.myDistanceToComputeCeilingInfo = other.myDistanceToComputeCeilingInfo;
        this.myVerticalFixToBeOnGround = other.myVerticalFixToBeOnGround;
        this.myVerticalFixToComputeGroundInfo = other.myVerticalFixToComputeGroundInfo;
        this.myVerticalFixToBeOnCeiling = other.myVerticalFixToBeOnCeiling;
        this.myVerticalFixToComputeCeilingInfo = other.myVerticalFixToComputeCeilingInfo;
        this.myGroundIsBaseInsideCollisionCheckEnabled = other.myGroundIsBaseInsideCollisionCheckEnabled;
        this.myCeilingIsBaseInsideCollisionCheckEnabled = other.myCeilingIsBaseInsideCollisionCheckEnabled;
        this.myIsOnGroundIfInsideHit = other.myIsOnGroundIfInsideHit;
        this.myIsOnCeilingIfInsideHit = other.myIsOnCeilingIfInsideHit;
        this.myIsOnGroundMaxSurfaceAngle = other.myIsOnGroundMaxSurfaceAngle;
        this.myIsOnCeilingMaxSurfaceAngle = other.myIsOnCeilingMaxSurfaceAngle;
        this.myFindGroundDistanceMaxOutsideDistance = other.myFindGroundDistanceMaxOutsideDistance;
        this.myFindGroundDistanceMaxInsideDistance = other.myFindGroundDistanceMaxInsideDistance;
        this.myFindCeilingDistanceMaxOutsideDistance = other.myFindCeilingDistanceMaxOutsideDistance;
        this.myFindCeilingDistanceMaxInsideDistance = other.myFindCeilingDistanceMaxInsideDistance;

        this.myAllowGroundSteepFix = other.myAllowGroundSteepFix;
        this.myAllowCeilingSteepFix = other.myAllowCeilingSteepFix;
        this.myMustStayOnGround = other.myMustStayOnGround;
        this.myMustStayOnCeiling = other.myMustStayOnCeiling;
        this.myMustStayOnValidGroundAngleDownhill = other.myMustStayOnValidGroundAngleDownhill;
        this.myMustStayOnValidCeilingAngleDownhill = other.myMustStayOnValidCeilingAngleDownhill;
        this.myRegatherGroundInfoOnSurfaceCheckFail = other.myRegatherGroundInfoOnSurfaceCheckFail;
        this.myRegatherCeilingInfoOnSurfaceCheckFail = other.myRegatherCeilingInfoOnSurfaceCheckFail;
        this.myMustStayBelowGroundAngleDownhill = other.myMustStayBelowGroundAngleDownhill;
        this.myMustStayBelowCeilingAngleDownhill = other.myMustStayBelowCeilingAngleDownhill;
        this.myMustStayBelowIgnorableGroundAngleDownhill = other.myMustStayBelowIgnorableGroundAngleDownhill;
        this.myMustStayBelowIgnorableCeilingAngleDownhill = other.myMustStayBelowIgnorableCeilingAngleDownhill;
        this.myMovementMustStayOnGroundHitAngle = other.myMovementMustStayOnGroundHitAngle;
        this.myMovementMustStayOnCeilingHitAngle = other.myMovementMustStayOnCeilingHitAngle;

        this.myTeleportMustBeOnIgnorableGroundAngle = other.myTeleportMustBeOnIgnorableGroundAngle;
        this.myCheckTransformMustBeOnIgnorableGroundAngle = other.myCheckTransformMustBeOnIgnorableGroundAngle;
        this.myTeleportMustBeOnIgnorableCeilingAngle = other.myTeleportMustBeOnIgnorableCeilingAngle;
        this.myCheckTransformMustBeOnIgnorableCeilingAngle = other.myCheckTransformMustBeOnIgnorableCeilingAngle;

        this.myTeleportMustBeOnGroundAngle = other.myTeleportMustBeOnGroundAngle;
        this.myCheckTransformMustBeOnGroundAngle = other.myCheckTransformMustBeOnGroundAngle;
        this.myTeleportMustBeOnCeilingAngle = other.myTeleportMustBeOnCeilingAngle;
        this.myCheckTransformMustBeOnCeilingAngle = other.myCheckTransformMustBeOnCeilingAngle;

        this.myTeleportMustBeOnGround = other.myTeleportMustBeOnGround;
        this.myCheckTransformMustBeOnGround = other.myCheckTransformMustBeOnGround;
        this.myTeleportMustBeOnCeiling = other.myTeleportMustBeOnCeiling;
        this.myCheckTransformMustBeOnCeiling = other.myCheckTransformMustBeOnCeiling;

        this.mySlidingEnabled = other.mySlidingEnabled;
        this.mySlidingHorizontalMovementCheckBetterNormal = other.mySlidingHorizontalMovementCheckBetterNormal;
        this.mySlidingMaxAttempts = other.mySlidingMaxAttempts;
        this.mySlidingCheckBothDirections = other.mySlidingCheckBothDirections;
        this.mySlidingFlickeringPreventionType = other.mySlidingFlickeringPreventionType;
        this.mySlidingFlickeringPreventionCheckOnlyIfAlreadySliding = other.mySlidingFlickeringPreventionCheckOnlyIfAlreadySliding;
        this.mySlidingFlickerPreventionCheckAnywayCounter = other.mySlidingFlickerPreventionCheckAnywayCounter;

        this.mySlidingAdjustSign90Degrees = other.mySlidingAdjustSign90Degrees;

        this.myHorizontalBlockLayerFlags.copy(other.myHorizontalBlockLayerFlags);
        this.myHorizontalObjectsToIgnore.pp_copy(other.myHorizontalObjectsToIgnore);

        this.myVerticalBlockLayerFlags.copy(other.myVerticalBlockLayerFlags);
        this.myVerticalObjectsToIgnore.pp_copy(other.myVerticalObjectsToIgnore);

        this.myExtraMovementCheckCallback = other.myExtraMovementCheckCallback;
        this.myExtraTeleportCheckCallback = other.myExtraTeleportCheckCallback;
        this.myExtraCheckTransformCheckCallback = other.myExtraCheckTransformCheckCallback;

        this.myDebugEnabled = other.myDebugEnabled;

        this.myDebugHorizontalMovementEnabled = other.myDebugHorizontalMovementEnabled;
        this.myDebugHorizontalPositionEnabled = other.myDebugHorizontalPositionEnabled;
        this.myDebugVerticalMovementEnabled = other.myDebugVerticalMovementEnabled;
        this.myDebugVerticalPositionEnabled = other.myDebugVerticalPositionEnabled;
        this.myDebugSlidingEnabled = other.myDebugSlidingEnabled;
        this.myDebugGroundInfoEnabled = other.myDebugGroundInfoEnabled;
        this.myDebugCeilingInfoEnabled = other.myDebugCeilingInfoEnabled;
        this.myDebugRuntimeParamsEnabled = other.myDebugRuntimeParamsEnabled;
        this.myDebugMovementEnabled = other.myDebugMovementEnabled;
    }
}

export class CollisionRuntimeParams {

    constructor() {
        this.myOriginalPosition = vec3_create();
        this.myNewPosition = vec3_create();

        this.myOriginalHeight = 0;

        this.myOriginalForward = vec3_create();
        this.myOriginalUp = vec3_create();

        this.myOriginalMovement = vec3_create();
        this.myFixedMovement = vec3_create();

        this.myLastValidOriginalHorizontalMovement = vec3_create();
        this.myLastValidOriginalVerticalMovement = vec3_create();
        this.myLastValidSurfaceAdjustedHorizontalMovement = vec3_create();
        this.myLastValidSurfaceAdjustedVerticalMovement = vec3_create();
        this.myLastValidEndHorizontalMovement = vec3_create();
        this.myLastValidEndVerticalMovement = vec3_create();

        this.myIsOnGround = false;
        this.myGroundAngle = 0;
        this.myGroundPerceivedAngle = 0;
        this.myGroundNormal = vec3_create();
        this.myGroundHitMaxAngle = 0;
        this.myGroundHitMaxNormal = vec3_create();
        this.myGroundDistance = null;
        this.myGroundIsBaseInsideCollision = false;

        this.myIsOnCeiling = false;
        this.myCeilingAngle = 0;
        this.myCeilingPerceivedAngle = 0;
        this.myCeilingNormal = vec3_create();
        this.myCeilingHitMaxAngle = 0;
        this.myCeilingHitMaxNormal = vec3_create();
        this.myCeilingDistance = null;
        this.myCeilingIsBaseInsideCollision = false;

        this.myHorizontalMovementCanceled = false; // Could add HorizontalMovementCanceledReason
        this.myIsCollidingHorizontally = false;
        this.myHorizontalCollisionHit = new RaycastHit();

        this.myVerticalMovementCanceled = false;
        this.myIsCollidingVertically = false;
        this.myVerticalCollisionHit = new RaycastHit();

        this.myHasSnappedOnGround = false;
        this.myHasSnappedOnCeiling = false;
        this.myHasPoppedOutGround = false;
        this.myHasPoppedOutCeiling = false;
        this.myHasReducedVerticalMovement = false;

        this.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleDownhill = false;
        this.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleUphill = false;
        this.myVerticalMovementHasAdjustedHorizontalMovementOverGroundAngleDownhill = false;

        this.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleDownhill = false;
        this.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleUphill = false;
        this.myVerticalMovementHasAdjustedHorizontalMovementOverCeilingAngleDownhill = false;

        this.myIsSliding = false;
        this.myIsSlidingIntoOppositeDirection = false;
        this.myIsSlidingFlickerPrevented = false;
        this.mySlidingFlickerPreventionCheckAnywayCounter = 0;
        this.mySlidingMovementAngle = 0;
        this.mySlidingCollisionAngle = 0;
        this.mySlidingCollisionHit = new RaycastHit();
        this.mySlidingWallNormal = new vec3_create();
        this.mySliding90DegreesSign = 0;
        this.mySlidingRecompute90DegreesSign = true;
        this.myLastValidIsSliding = false;
        this.mySlidingPreviousHorizontalMovement = vec3_create();

        this.myOriginalTeleportPosition = vec3_create();
        this.myFixedTeleportPosition = vec3_create();

        this.myOriginalPositionCheckPosition = vec3_create();
        this.myFixedPositionCheckPosition = vec3_create();

        this.myTeleportCanceled = false;

        this.myIsPositionOk = false;

        this.myIsTeleport = false; // Could be a single bool but not sure if there should be an option and don't want to create an enum for now
        this.myIsMove = false;
        this.myIsPositionCheck = false;
        this.myIsPositionCheckAllowAdjustments = false;

        this.mySplitMovementSteps = 0;
        this.mySplitMovementStepsPerformed = 0;
        this.mySplitMovementStop = false;
        this.mySplitMovementMovementChecked = vec3_create();

        this.myRealIsOnGround = false;
        this.myRealIsOnCeiling = false;
    }

    reset() {
        this.myOriginalPosition.vec3_zero();
        this.myNewPosition.vec3_zero();

        this.myOriginalHeight = 0;

        this.myOriginalForward.vec3_zero();
        this.myOriginalUp.vec3_zero();

        this.myOriginalMovement.vec3_zero();
        this.myFixedMovement.vec3_zero();

        this.myLastValidOriginalHorizontalMovement.vec3_zero();
        this.myLastValidOriginalVerticalMovement.vec3_zero();
        this.myLastValidSurfaceAdjustedHorizontalMovement.vec3_zero();
        this.myLastValidSurfaceAdjustedVerticalMovement.vec3_zero();
        this.myLastValidEndHorizontalMovement.vec3_zero();
        this.myLastValidEndVerticalMovement.vec3_zero();


        this.myIsOnGround = false;
        this.myGroundAngle = 0;
        this.myGroundPerceivedAngle = 0;
        this.myGroundNormal.vec3_zero();
        this.myGroundHitMaxAngle = 0;
        this.myGroundHitMaxNormal.vec3_zero();
        this.myGroundDistance = null;
        this.myGroundIsBaseInsideCollision = false;

        this.myIsOnCeiling = false;
        this.myCeilingAngle = 0;
        this.myCeilingPerceivedAngle = 0;
        this.myCeilingNormal.vec3_zero();
        this.myCeilingHitMaxAngle = 0;
        this.myCeilingHitMaxNormal.vec3_zero();
        this.myCeilingDistance = null;
        this.myCeilingIsBaseInsideCollision = false;

        this.myHorizontalMovementCanceled = false;
        this.myIsCollidingHorizontally = false;
        this.myHorizontalCollisionHit.reset();

        this.myVerticalMovementCanceled = false;
        this.myIsCollidingVertically = false;
        this.myVerticalCollisionHit.reset();

        this.myHasSnappedOnGround = false;
        this.myHasSnappedOnCeiling = false;
        this.myHasPoppedOutGround = false;
        this.myHasPoppedOutCeiling = false;
        this.myHasReducedVerticalMovement = false;

        this.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleDownhill = false;
        this.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleUphill = false;
        this.myVerticalMovementHasAdjustedHorizontalMovementOverGroundAngleDownhill = false;

        this.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleDownhill = false;
        this.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleUphill = false;
        this.myVerticalMovementHasAdjustedHorizontalMovementOverCeilingAngleDownhill = false;

        this.myIsSliding = false;
        this.myIsSlidingIntoOppositeDirection = false;
        this.myIsSlidingFlickerPrevented = false;
        this.mySlidingFlickerPreventionCheckAnywayCounter = 0;
        this.mySlidingMovementAngle = 0;
        this.mySlidingCollisionAngle = 0;
        this.mySlidingCollisionHit.reset();
        this.mySliding90DegreesSign = 0;
        this.mySlidingRecompute90DegreesSign = true;
        this.myLastValidIsSliding = false;
        this.mySlidingPreviousHorizontalMovement.vec3_zero();
        this.mySlidingWallNormal.vec3_zero();

        this.myOriginalTeleportPosition.vec3_zero();
        this.myFixedTeleportPosition.vec3_zero();

        this.myOriginalPositionCheckPosition.vec3_zero();
        this.myFixedPositionCheckPosition.vec3_zero();

        this.myTeleportCanceled = false;

        this.myIsPositionOk = false;

        this.myIsTeleport = false;
        this.myIsMove = false;
        this.myIsPositionCheck = false;
        this.myIsPositionCheckAllowAdjustments = false;

        this.mySplitMovementSteps = 0;
        this.mySplitMovementStepsPerformed = 0;
        this.mySplitMovementStop = false;
        this.mySplitMovementMovementChecked.vec3_zero();

        this.myRealIsOnGround = false;
        this.myRealIsOnCeiling = false;
    }

    copy(other) {
        this.myOriginalPosition.vec3_copy(other.myOriginalPosition);
        this.myNewPosition.vec3_copy(other.myNewPosition);

        this.myOriginalHeight = other.myOriginalHeight;

        this.myOriginalForward.vec3_copy(other.myOriginalForward);
        this.myOriginalUp.vec3_copy(other.myOriginalUp);

        this.myOriginalMovement.vec3_copy(other.myOriginalMovement);
        this.myFixedMovement.vec3_copy(other.myFixedMovement);

        this.myLastValidOriginalHorizontalMovement.vec3_copy(other.myLastValidOriginalHorizontalMovement);
        this.myLastValidOriginalVerticalMovement.vec3_copy(other.myLastValidOriginalVerticalMovement);
        this.myLastValidSurfaceAdjustedHorizontalMovement.vec3_copy(other.myLastValidSurfaceAdjustedHorizontalMovement);
        this.myLastValidSurfaceAdjustedVerticalMovement.vec3_copy(other.myLastValidSurfaceAdjustedVerticalMovement);
        this.myLastValidEndHorizontalMovement.vec3_copy(other.myLastValidEndHorizontalMovement);
        this.myLastValidEndVerticalMovement.vec3_copy(other.myLastValidEndVerticalMovement);

        this.myIsOnGround = other.myIsOnGround;
        this.myGroundAngle = other.myGroundAngle;
        this.myGroundPerceivedAngle = other.myGroundPerceivedAngle;
        this.myGroundNormal.vec3_copy(other.myGroundNormal);
        this.myGroundHitMaxAngle = other.myGroundHitMaxAngle;
        this.myGroundHitMaxNormal.vec3_copy(other.myGroundHitMaxNormal);
        this.myGroundDistance = other.myGroundDistance;
        this.myGroundIsBaseInsideCollision = other.myGroundIsBaseInsideCollision;

        this.myIsOnCeiling = other.myIsOnCeiling;
        this.myCeilingAngle = other.myCeilingAngle;
        this.myCeilingPerceivedAngle = other.myCeilingPerceivedAngle;
        this.myCeilingNormal.vec3_copy(other.myCeilingNormal);
        this.myCeilingHitMaxAngle = other.myCeilingHitMaxAngle;
        this.myCeilingHitMaxNormal.vec3_copy(other.myCeilingHitMaxNormal);
        this.myCeilingDistance = other.myCeilingDistance;
        this.myCeilingIsBaseInsideCollision = other.myCeilingIsBaseInsideCollision;

        this.myHorizontalMovementCanceled = other.myHorizontalMovementCanceled;
        this.myIsCollidingHorizontally = other.myIsCollidingHorizontally;
        this.myHorizontalCollisionHit.copy(other.myHorizontalCollisionHit);

        this.myVerticalMovementCanceled = other.myVerticalMovementCanceled;
        this.myIsCollidingVertically = other.myIsCollidingVertically;
        this.myVerticalCollisionHit.copy(other.myVerticalCollisionHit);

        this.myHasSnappedOnGround = other.myHasSnappedOnGround;
        this.myHasSnappedOnCeiling = other.myHasSnappedOnCeiling;
        this.myHasPoppedOutGround = other.myHasPoppedOutGround;
        this.myHasPoppedOutCeiling = other.myHasPoppedOutCeiling;
        this.myHasReducedVerticalMovement = other.myHasReducedVerticalMovement;

        this.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleDownhill = other.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleDownhill;
        this.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleUphill = other.myHorizontalMovementHasAdjustedVerticalMovementOverGroundPerceivedAngleUphill;
        this.myVerticalMovementHasAdjustedHorizontalMovementOverGroundAngleDownhill = other.myVerticalMovementHasAdjustedHorizontalMovementOverGroundAngleDownhill;

        this.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleDownhill = other.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleDownhill;
        this.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleUphill = other.myHorizontalMovementHasAdjustedVerticalMovementOverCeilingPerceivedAngleUphill;
        this.myVerticalMovementHasAdjustedHorizontalMovementOverCeilingAngleDownhill = other.myVerticalMovementHasAdjustedHorizontalMovementOverCeilingAngleDownhill;

        this.myIsSliding = other.myIsSliding;
        this.myIsSlidingIntoOppositeDirection = other.myIsSlidingIntoOppositeDirection;
        this.myIsSlidingFlickerPrevented = other.myIsSlidingFlickerPrevented;
        this.mySlidingFlickerPreventionCheckAnywayCounter = other.mySlidingFlickerPreventionCheckAnywayCounter;
        this.mySlidingMovementAngle = other.mySlidingMovementAngle;
        this.mySlidingCollisionAngle = other.mySlidingCollisionAngle;
        this.mySlidingCollisionHit.copy(other.mySlidingCollisionHit);
        this.mySliding90DegreesSign = other.mySliding90DegreesSign;
        this.mySlidingRecompute90DegreesSign = other.mySlidingRecompute90DegreesSign;
        this.myLastValidIsSliding = other.myLastValidIsSliding;
        this.mySlidingPreviousHorizontalMovement.vec3_copy(other.mySlidingPreviousHorizontalMovement);
        this.mySlidingWallNormal.vec3_copy(other.mySlidingWallNormal);

        this.myOriginalTeleportPosition.vec3_copy(other.myOriginalTeleportPosition);
        this.myFixedTeleportPosition.vec3_copy(other.myFixedTeleportPosition);
        this.myTeleportCanceled = other.myTeleportCanceled;

        this.myIsPositionOk = other.myIsPositionOk;

        this.myOriginalPositionCheckPosition.vec3_copy(other.myOriginalPositionCheckPosition);
        this.myFixedPositionCheckPosition.vec3_copy(other.myFixedPositionCheckPosition);

        this.myIsTeleport = other.myIsTeleport;
        this.myIsMove = other.myIsMove;
        this.myIsPositionCheck = other.myIsPositionCheck;
        this.myIsPositionCheckAllowAdjustments = other.myIsPositionCheckAllowAdjustments;

        this.mySplitMovementSteps = other.mySplitMovementSteps;
        this.mySplitMovementStepsPerformed = other.mySplitMovementStepsPerformed;
        this.mySplitMovementStop = other.mySplitMovementStop;
        this.mySplitMovementMovementChecked.vec3_copy(other.mySplitMovementMovementChecked);

        this.myRealIsOnGround = other.myRealIsOnGround;
        this.myRealIsOnCeiling = other.myRealIsOnCeiling;
    }
}
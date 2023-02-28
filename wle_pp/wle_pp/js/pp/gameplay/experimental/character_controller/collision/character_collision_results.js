PP.CharacterCollisionResults = class CharacterCollisionResults {
    constructor() {
        this.myCheckType = PP.CharacterCollisionCheckType.NONE;

        this.myTransformResults = new PP.CharacterCollisionTransformResults();

        this.myMovementResults = new PP.CharacterCollisionMovementResults();
        this.myHorizontalMovementResults = new PP.CharacterCollisionMovementResults();
        this.myVerticalMovementResults = new PP.CharacterCollisionMovementResults();

        this.myTeleportResults = new PP.CharacterCollisionTeleportResults();

        this.myCheckTransformResults = new PP.CharacterCollisionCheckTransformResults();

        this.myWallSlideResults = new PP.CharacterCollisionWallSlideResults();

        this.myGroundInfo = new PP.CharacterCollisionSurfaceInfo();
        this.myCeilingInfo = new PP.CharacterCollisionSurfaceInfo();

        this.myGroundResults = new PP.CharacterCollisionSurfaceResults();
        this.myCeilingResults = new PP.CharacterCollisionSurfaceResults();

        this.mySplitMovementResults = new PP.CharacterCollisionSplitMovementResults();

        this.myDebugResults = new PP.CharacterCollisionDebugResults();

        this.myInternalResults = new PP.CharacterCollisionInternalResults();
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.CharacterCollisionCheckType = {
    NONE: 0,
    CHECK_MOVEMENT: 1,
    CHECK_TELEPORT: 2,
    CHECK_TRANSFORM: 3,
    UPDATE_SURFACE_INFO: 4,
    UPDATE_GROUND_INFO: 5,
    UPDATE_CEILING_INFO: 6
};

PP.CharacterCollisionSurfaceInfo = class CharacterCollisionSurfaceInfo {
    constructor() {
        this.myIsOnSurface = false;

        this.mySurfaceAngle = 0;
        this.mySurfacePerceivedAngle = 0;
        this.mySurfaceNormal = PP.vec3_create();

        this.mySurfaceHitMaxAngle = 0;
        this.mySurfaceHitMaxNormal = PP.vec3_create();

        this.mySurfaceDistance = null;

        this.myIsBaseInsideCollision = false;
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.CharacterCollisionWallSlideResults = class CharacterCollisionWallSlideResults {
    constructor() {
        this.myHasSlid = false;
        this.mySlideMovementAngle = 0;          // signed angle between the start movement and the wall slide movement, basically telling you how much u had to change direction to slide
        this.mySlideMovementWallAngle = 0;      // signed angle between the inverted surface normal and the wall slide movement
        this.myWallNormal = PP.vec3_create();
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.CharacterCollisionTransformResults = class CharacterCollisionMovementResults {
    constructor() {
        this.myStartTransformQuat = PP.quat2_create();
        this.myEndTransformQuat = PP.quat2_create();
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.CharacterCollisionMovementResults = class CharacterCollisionMovementResults {
    constructor() {
        this.myStartMovement = PP.vec3_create();
        this.myEndMovement = PP.vec3_create();
        this.myMovementFailed = false;
        this.myIsColliding = false;
        this.myReferenceCollisionHit = new PP.RaycastHit();
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.CharacterCollisionTeleportResults = class CharacterCollisionTeleportResults {
    constructor() {
        this.myStartTeleportTransformQuat = PP.quat2_create();
        this.myEndTeleportTransformQuat = PP.quat2_create();
        this.myTeleportFailed = false;
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.CharacterCollisionCheckTransformResults = class CharacterCollisionCheckTransformResults {
    constructor() {
        this.myStartCheckTransformQuat = PP.quat2_create();
        this.myEndCheckTransformQuat = PP.quat2_create();
        this.myCheckTransformFailed = false;
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.CharacterCollisionSurfaceResults = class CharacterCollisionCheckTransformResults {
    constructor() {
        this.myHasSnappedOnSurface = false;
        this.myHasPoppedOutSurface = false;
        this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill = false;
        this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill = false;
        this.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill = false;
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.CharacterCollisionSplitMovementResults = class CharacterCollisionSplitMovementResults {
    constructor() {
        this.myStepsToPerform = 0;
        this.myStepsPerformed = 0;
        this.myMovementInterrupted = false;
        this.myMovementChecked = PP.vec3_create();
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.CharacterCollisionDebugResults = class CharacterCollisionDebugResults {
    constructor() {
        this._myRaycastsPerformed = 0;
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.CharacterCollisionInternalResults = class CharacterCollisionSplitMovementResults {
    constructor() {
        this.myLastRelevantStartHorizontalMovement = PP.vec3_create();
        this.myLastRelevantAdjustedStartHorizontalMovement = PP.vec3_create();
        this.myLastRelevantEndHorizontalMovement = PP.vec3_create();

        this.myLastRelevantStartVerticalMovement = PP.vec3_create();
        this.myLastRelevantAdjustedStartVerticalMovement = PP.vec3_create();
        this.myLastRelevantEndVerticalMovement = PP.vec3_create();

        this.myLastRelevantHasWallSlid = false;
        this.myHasWallSlidTowardOppositeDirection = false;
        this.myLastRelevantWallSlideFlickerPrevented = false;
        this.myWallSlideFlickerPreventionForceCheckCounter = 0;
        this.myWallSlide90DegreesDirectionSign = 0;
        this.myWallSlide90DegreesRecomputeDirectionSign = true;
    }

    reset() {
        // implemented outside class definition
    }

    copy(other) {
        // implemented outside class definition
    }
};



// IMPLEMENTATION

PP.CharacterCollisionResults.prototype.reset = function reset() {
    this.myCheckType = PP.CharacterCollisionCheckType.NONE;

    this.myTransformResults.reset();

    this.myMovementResults.reset();
    this.myHorizontalMovementResults.reset();
    this.myVerticalMovementResults.reset();

    this.myTeleportResults.reset();

    this.myCheckTransformResults.reset();

    this.myWallSlideResults.reset();

    this.myGroundInfo.reset();
    this.myCeilingInfo.reset();

    this.myGroundResults.reset();
    this.myCeilingResults.reset();

    this.mySplitMovementResults.reset();

    this.myInternalResults.reset();
};

PP.CharacterCollisionResults.prototype.copy = function copy(other) {
    this.myCheckType = other.myCheckType;

    this.myTransformResults.copy(other.myTransformResults);

    this.myMovementResults.copy(other.myMovementResults);
    this.myHorizontalMovementResults.copy(other.myHorizontalMovementResults);
    this.myVerticalMovementResults.copy(other.myVerticalMovementResults);

    this.myTeleportResults.copy(other.myTeleportResults);

    this.myCheckTransformResults.copy(other.myCheckTransformResults);

    this.myWallSlideResults.copy(other.myWallSlideResults);

    this.myGroundInfo.copy(other.myGroundInfo);
    this.myCeilingInfo.copy(other.myCeilingInfo);

    this.myGroundResults.copy(other.myGroundResults);
    this.myCeilingResults.copy(other.myCeilingResults);

    this.mySplitMovementResults.copy(other.mySplitMovementResults);

    this.myInternalResults.copy(other.myInternalResults);
};

PP.CharacterCollisionSurfaceInfo.prototype.reset = function reset() {
    this.myIsOnSurface = false;

    this.mySurfaceAngle = 0;
    this.mySurfacePerceivedAngle = 0;
    this.mySurfaceNormal.vec3_zero();

    this.mySurfaceHitMaxAngle = 0;
    this.mySurfaceHitMaxNormal.vec3_zero();

    this.mySurfaceDistance = null;

    this.myIsBaseInsideCollision = false;
};

PP.CharacterCollisionSurfaceInfo.prototype.copy = function copy(other) {
    this.myIsOnSurface = other.myIsOnSurface;

    this.mySurfaceAngle = other.mySurfaceAngle;
    this.mySurfacePerceivedAngle = other.mySurfacePerceivedAngle;
    this.mySurfaceNormal.vec3_copy(other.mySurfaceNormal);

    this.mySurfaceHitMaxAngle = other.mySurfaceHitMaxAngle;
    this.mySurfaceHitMaxNormal.vec3_copy(other.mySurfaceHitMaxNormal);

    this.mySurfaceDistance = other.mySurfaceDistance;

    this.myIsBaseInsideCollision = other.myIsBaseInsideCollision;
};

PP.CharacterCollisionWallSlideResults.prototype.reset = function reset() {
    this.myHasSlid = false;
    this.mySlideMovementAngle = 0;
    this.mySlideMovementWallAngle = 0;
    this.myWallNormal.vec3_zero();
};

PP.CharacterCollisionWallSlideResults.prototype.copy = function copy(other) {
    this.myHasSlid = other.myHasSlid;
    this.mySlideMovementAngle = other.mySlideMovementAngle;
    this.mySlideMovementWallAngle = other.mySlideMovementWallAngle;
    this.myWallNormal.vec3_copy(other.myWallNormal);
};

PP.CharacterCollisionTransformResults.prototype.reset = function reset() {
    this.myStartTransformQuat.quat2_identity();
    this.myEndTransformQuat.quat2_identity();
};

PP.CharacterCollisionTransformResults.prototype.copy = function copy(other) {
    this.myStartTransformQuat.quat2_copy(other.myStartTransformQuat);
    this.myEndTransformQuat.quat2_copy(other.myEndTransformQuat);
};

PP.CharacterCollisionMovementResults.prototype.reset = function reset() {
    this.myStartMovement.vec3_zero();
    this.myEndMovement.vec3_zero();
    this.myMovementFailed = false;
    this.myIsColliding = false;
    this.myReferenceCollisionHit.reset();
};

PP.CharacterCollisionMovementResults.prototype.copy = function copy(other) {
    this.myStartMovement.vec3_copy(other.myStartMovement);
    this.myEndMovement.vec3_copy(other.myEndMovement);
    this.myMovementFailed = other.myMovementFailed;
    this.myIsColliding = other.myIsColliding;
    this.myReferenceCollisionHit.copy(other.myReferenceCollisionHit);
};

PP.CharacterCollisionTeleportResults.prototype.reset = function reset() {
    this.myStartTeleportTransformQuat.quat2_identity();
    this.myEndTeleportTransformQuat.quat2_identity();
    this.myTeleportFailed = false;
};

PP.CharacterCollisionTeleportResults.prototype.copy = function copy(other) {
    this.myStartTeleportTransformQuat.quat2_copy(other.myStartTeleportTransformQuat);
    this.myEndTeleportTransformQuat.quat2_copy(other.myEndTeleportTransformQuat);
    this.myTeleportFailed = other.myTeleportFailed;
};

PP.CharacterCollisionCheckTransformResults.prototype.reset = function reset() {
    this.myStartCheckTransformQuat.quat2_identity();
    this.myEndCheckTransformQuat.quat2_identity();
    this.myCheckTransformFailed = false;
};

PP.CharacterCollisionCheckTransformResults.prototype.copy = function copy(other) {
    this.myStartCheckTransformQuat.quat2_copy(other.myStartCheckTransformQuat);
    this.myEndCheckTransformQuat.quat2_copy(other.myEndCheckTransformQuat);
    this.myCheckTransformFailed = other.myCheckTransformFailed;
};

PP.CharacterCollisionSurfaceResults.prototype.reset = function reset() {
    this.myHasSnappedOnSurface = false;
    this.myHasPoppedOutSurface = false;
    this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill = false;
    this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill = false;
    this.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill = false;
};

PP.CharacterCollisionSurfaceResults.prototype.copy = function copy(other) {
    this.myHasSnappedOnSurface = other.myHasSnappedOnSurface;
    this.myHasPoppedOutSurface = other.myHasPoppedOutSurface;
    this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill = other.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleDownhill;
    this.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill = other.myHasHorizontalMovementAdjustedVerticalMovementBasedOnSurfacePerceivedAngleUphill;
    this.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill = other.myHasVerticalMovementAdjustedHorizontalMovementBasedOnSurfaceAngleDownhill;
};

PP.CharacterCollisionSplitMovementResults.prototype.reset = function reset() {
    this.myStepsToPerform = 0;
    this.myStepsPerformed = 0;
    this.myMovementInterrupted = false;
    this.myMovementChecked.vec3_zero();
};

PP.CharacterCollisionSplitMovementResults.prototype.copy = function copy(other) {
    this.myStepsToPerform = other.myStepsToPerform;
    this.myStepsPerformed = other.myStepsPerformed;
    this.myMovementInterrupted = other.myMovementInterrupted;
    this.myMovementChecked.vec3_copy(other.myMovementChecked);
};

PP.CharacterCollisionDebugResults.prototype.reset = function reset() {
    this._myRaycastsPerformed = 0;
};

PP.CharacterCollisionDebugResults.prototype.copy = function copy(other) {
    this._myRaycastsPerformed = other._myRaycastsPerformed;
};

PP.CharacterCollisionInternalResults.prototype.reset = function reset() {
};

PP.CharacterCollisionInternalResults.prototype.copy = function copy(other) {
    this.myLastRelevantStartHorizontalMovement.vec3_copy(other.myLastRelevantStartHorizontalMovement);
    this.myLastRelevantAdjustedStartHorizontalMovement.vec3_copy(other.myLastRelevantAdjustedStartHorizontalMovement);
    this.myLastRelevantEndHorizontalMovement.vec3_copy(other.myLastRelevantEndHorizontalMovement);

    this.myLastRelevantStartVerticalMovement.vec3_copy(other.myLastRelevantStartVerticalMovement);
    this.myLastRelevantAdjustedStartVerticalMovement.vec3_copy(other.myLastRelevantAdjustedStartVerticalMovement);
    this.myLastRelevantEndVerticalMovement.vec3_copy(other.myLastRelevantEndVerticalMovement);

    this.myLastRelevantHasWallSlid = other.myLastRelevantHasWallSlid;
    this.myHasWallSlidTowardOppositeDirection = other.myHasWallSlidTowardOppositeDirection;
    this.myLastRelevantWallSlideFlickerPrevented = other.myLastRelevantWallSlideFlickerPrevented;
    this.myWallSlideFlickerPreventionForceCheckCounter = other.myWallSlideFlickerPreventionForceCheckCounter;
    this.myWallSlide90DegreesDirectionSign = other.myWallSlide90DegreesDirectionSign;
    this.myWallSlide90DegreesRecomputeDirectionSign = other.myWallSlide90DegreesRecomputeDirectionSign;
};



Object.defineProperty(PP.CharacterCollisionResults.prototype, "reset", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionTransformResults.prototype, "reset", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionMovementResults.prototype, "reset", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionTeleportResults.prototype, "reset", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionCheckTransformResults.prototype, "reset", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionWallSlideResults.prototype, "reset", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionSurfaceInfo.prototype, "reset", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionSurfaceResults.prototype, "reset", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionSplitMovementResults.prototype, "reset", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionInternalResults.prototype, "reset", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionResults.prototype, "copy", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionTransformResults.prototype, "copy", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionMovementResults.prototype, "copy", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionTeleportResults.prototype, "copy", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionCheckTransformResults.prototype, "copy", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionWallSlideResults.prototype, "copy", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionSurfaceInfo.prototype, "copy", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionSurfaceResults.prototype, "copy", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionSplitMovementResults.prototype, "copy", { enumerable: false });
Object.defineProperty(PP.CharacterCollisionInternalResults.prototype, "copy", { enumerable: false });
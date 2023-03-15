PP.PlayerLocomotionDirectionReferenceType = {
    HEAD: 0,
    HAND: 1,
    CUSTOM_OBJECT: 2,
};

PP.PlayerLocomotionParams = class PlayerLocomotionParams {
    constructor() {
        this.myMaxSpeed = 0;
        this.myMaxRotationSpeed = 0;

        this.myCharacterRadius = 0;

        this.myIsSnapTurn = false;
        this.mySnapTurnOnlyVR = false;
        this.mySnapTurnAngle = 0;
        this.mySnapTurnSpeedDegrees = 0;

        this.myFlyEnabled = false;
        this.myMinAngleToFlyUpNonVR = 0;
        this.myMinAngleToFlyDownNonVR = 0;
        this.myMinAngleToFlyUpVR = 0;
        this.myMinAngleToFlyDownVR = 0;
        this.myMinAngleToFlyRight = 0;

        this.myMainHand = PP.Handedness.LEFT;

        this.myVRDirectionReferenceType = PP.PlayerLocomotionDirectionReferenceType.HEAD;
        this.myVRDirectionReferenceObject = null;

        this.myTeleportParableStartReferenceObject = null;

        this.myForeheadExtraHeight = 0;

        this.myTeleportPositionObject = null;

        this.myMoveThroughCollisionShortcutEnabled = false;
        this.myMoveHeadShortcutEnabled = false;

        this.myPhysicsBlockLayerFlags = new PP.PhysicsLayerFlags();
    }
};

// #TODO add lerped snap on vertical over like half a second to avoid the "snap effect"
// this could be done by detatching the actual vertical position of the player from the collision real one when a snap is detected above a certain threshold
// with a timer, after which the vertical position is just copied, while during the detatching is lerped toward the collision vertical one
PP.PlayerLocomotion = class PlayerLocomotion {
    constructor(params) {
        this._myParams = params;

        this._myCollisionCheckParamsMovement = new PP.CollisionCheckParams();
        this._setupCollisionCheckParamsMovement();
        this._myCollisionCheckParamsTeleport = null;
        this._setupCollisionCheckParamsTeleport();


        this._myCollisionRuntimeParams = new PP.CollisionRuntimeParams();
        this._myMovementRuntimeParams = new PP.PlayerLocomotionMovementRuntimeParams();
        this._myMovementRuntimeParams.myCollisionRuntimeParams = this._myCollisionRuntimeParams;

        {
            let params = new PP.PlayerHeadManagerParams();

            params.mySessionChangeResyncEnabled = true;

            params.myBlurEndResyncEnabled = true;
            params.myBlurEndResyncRotation = true;

            //params.myNextEnterSessionFloorHeight = 3;
            params.myEnterSessionResyncHeight = false;
            params.myExitSessionResyncHeight = false;
            params.myExitSessionResyncVerticalAngle = true;
            params.myExitSessionRemoveRightTilt = true;
            params.myExitSessionAdjustMaxVerticalAngle = true;
            params.myExitSessionMaxVerticalAngle = 90;

            params.myHeightOffsetVRWithFloor = 0;
            params.myHeightOffsetVRWithoutFloor = 1.75;
            params.myHeightOffsetNonVR = 1.75;

            params.myForeheadExtraHeight = this._myParams.myForeheadExtraHeight;

            params.myFeetRotationKeepUp = true;

            params.myDebugActive = false;

            this._myPlayerHeadManager = new PP.PlayerHeadManager(params);
        }

        {
            let params = new PP.PlayerTransformManagerParams();

            params.myPlayerHeadManager = this._myPlayerHeadManager;

            params.myMovementCollisionCheckParams = this._myCollisionCheckParamsMovement;
            params.myTeleportCollisionCheckParams = null;
            params.myTeleportCollisionCheckParamsCopyFromMovement = true;
            params.myTeleportCollisionCheckParamsCheck360 = true;

            params.myHeadCollisionBlockLayerFlags.copy(params.myMovementCollisionCheckParams.myHorizontalBlockLayerFlags);
            params.myHeadCollisionBlockLayerFlags.add(params.myMovementCollisionCheckParams.myVerticalBlockLayerFlags);
            params.myHeadCollisionObjectsToIgnore.pp_copy(params.myMovementCollisionCheckParams.myHorizontalObjectsToIgnore);
            let objectsEqualCallback = (first, second) => first.pp_equals(second);
            for (let objectToIgnore of params.myMovementCollisionCheckParams.myVerticalObjectsToIgnore) {
                params.myHeadCollisionObjectsToIgnore.pp_pushUnique(objectToIgnore, objectsEqualCallback);
            }

            params.myCollisionRuntimeParams = this._myCollisionRuntimeParams;

            params.myHeadRadius = 0.15;

            params.myIsMaxDistanceFromRealToSyncEnabled = true;
            params.myMaxDistanceFromRealToSync = 100;

            params.myIsFloatingValidIfVerticalMovement = false;
            params.myIsFloatingValidIfVerticalMovementAndRealOnGround = false;
            params.myIsFloatingValidIfSteepGround = false;
            params.myIsFloatingValidIfVerticalMovementAndSteepGround = false;
            params.myIsFloatingValidIfRealOnGround = false;
            params.myIsLeaningValidAboveDistance = true;
            params.myLeaningValidDistance = 2;
            params.myFloatingSplitCheckEnabled = true;
            params.myFloatingSplitCheckMaxLength = 0.2;
            params.myFloatingSplitCheckMaxSteps = 5;
            params.myRealMovementAllowVerticalAdjustments = false;

            params.myUpdateRealPositionValid = true;
            params.myUpdatePositionValid = true;

            params.myIsBodyCollidingWhenHeightBelowValue = null;
            params.myIsBodyCollidingWhenHeightAboveValue = null;

            params.myResetToValidOnEnterSession = true;
            params.myResetToValidOnExitSession = true;

            params.myAlwaysResetRealPositionNonVR = true;
            params.myAlwaysResetRealRotationNonVR = true;
            params.myAlwaysResetRealHeightNonVR = true;

            params.myAlwaysResetRealPositionVR = false;
            params.myAlwaysResetRealRotationVR = false;
            params.myAlwaysResetRealHeightVR = false;

            params.myNeverResetRealPositionNonVR = false;
            params.myNeverResetRealRotationNonVR = true;
            params.myNeverResetRealHeightNonVR = false;

            params.myNeverResetRealPositionVR = false;
            params.myNeverResetRealRotationVR = false;
            params.myNeverResetRealHeightVR = true;

            params.myResetRealOnMove = true;

            params.myDebugActive = true;

            this._myPlayerTransformManager = new PP.PlayerTransformManager(params);
        }

        {
            let params = new PP.PlayerObscureManagerParams();

            params.myPlayerTransformManager = this._myPlayerTransformManager;

            params.myObscureObject = null;
            params.myObscureMaterial = null;
            params.myObscureRadius = 0.1;

            params.myObscureFadeOutSeconds = 0.25;
            params.myObscureFadeInSeconds = 0.25;

            params.myObscureFadeEasingFunction = PP.EasingFunction.linear;
            params.myObscureLevelRelativeDistanceEasingFunction = PP.EasingFunction.linear;

            params.myDistanceToStartObscureWhenBodyColliding = 0.2;
            params.myDistanceToStartObscureWhenHeadColliding = 0;
            params.myDistanceToStartObscureWhenFloating = 1;
            params.myDistanceToStartObscureWhenFar = 1;

            params.myRelativeDistanceToMaxObscureWhenBodyColliding = 0.5;
            params.myRelativeDistanceToMaxObscureWhenHeadColliding = 0.1;
            params.myRelativeDistanceToMaxObscureWhenFloating = 5;
            params.myRelativeDistanceToMaxObscureWhenFar = 5;

            this._myPlayerObscureManager = new PP.PlayerObscureManager(params);
        }

        {
            let params = new PP.PlayerLocomotionRotateParams();

            params.myPlayerHeadManager = this._myPlayerHeadManager;
            params.myPlayerTransformManager = this._myPlayerTransformManager;

            params.myMaxRotationSpeed = this._myParams.myMaxRotationSpeed;
            params.myIsSnapTurn = this._myParams.myIsSnapTurn;
            params.mySnapTurnOnlyVR = this._myParams.mySnapTurnOnlyVR;
            params.mySnapTurnAngle = this._myParams.mySnapTurnAngle;

            if (this._myParams.mySnapTurnSpeedDegrees > PP.LocomotionUtils.EPSILON_NUMBER) {
                params.mySmoothSnapActive = true;
                params.mySmoothSnapSpeedDegrees = this._myParams.mySnapTurnSpeedDegrees;
            } else {
                params.mySmoothSnapActive = false;
            }

            params.myRotationMinStickIntensityThreshold = 0.1;
            params.mySnapTurnActivateThreshold = 0.5;
            params.mySnapTurnResetThreshold = 0.4;

            params.myClampVerticalAngle = true;
            params.myMaxVerticalAngle = 90;

            this._myPlayerLocomotionRotate = new PP.PlayerLocomotionRotate(params);

            params.myHandedness = PP.InputUtils.getOppositeHandedness(this._myParams.myMainHand);
        }

        {
            {
                let params = new PP.PlayerLocomotionSmoothParams();

                params.myPlayerHeadManager = this._myPlayerHeadManager;
                params.myPlayerTransformManager = this._myPlayerTransformManager;

                params.myCollisionCheckParams = this._myCollisionCheckParamsMovement;

                params.myHandedness = this._myParams.myMainHand;

                params.myMaxSpeed = this._myParams.myMaxSpeed;

                params.myMovementMinStickIntensityThreshold = 0.1;

                params.myFlyEnabled = this._myParams.myFlyEnabled;
                params.myMinAngleToFlyUpNonVR = this._myParams.myMinAngleToFlyUpNonVR;
                params.myMinAngleToFlyDownNonVR = this._myParams.myMinAngleToFlyDownNonVR;
                params.myMinAngleToFlyUpVR = this._myParams.myMinAngleToFlyUpVR;
                params.myMinAngleToFlyDownVR = this._myParams.myMinAngleToFlyDownVR;
                params.myMinAngleToFlyRight = this._myParams.myMinAngleToFlyRight;

                params.myGravityAcceleration = -20;

                params.myVRDirectionReferenceType = this._myParams.myVRDirectionReferenceType;
                params.myVRDirectionReferenceObject = this._myParams.myVRDirectionReferenceObject;

                params.myMoveThroughCollisionShortcutEnabled = this._myParams.myMoveThroughCollisionShortcutEnabled;
                params.myMoveHeadShortcutEnabled = this._myParams.myMoveHeadShortcutEnabled;

                this._myPlayerLocomotionSmooth = new PP.PlayerLocomotionSmooth(params, this._myMovementRuntimeParams);
            }

            {
                let params = new PP.PlayerLocomotionTeleportParams();

                params.myPlayerHeadManager = this._myPlayerHeadManager;
                params.myPlayerTransformManager = this._myPlayerTransformManager;

                params.myCollisionCheckParams = this._myCollisionCheckParamsTeleport;

                params.myHandedness = this._myParams.myMainHand;

                params.myDetectionParams.myMaxDistance = 3;
                params.myDetectionParams.myMaxHeightDifference = 4;
                params.myDetectionParams.myGroundAngleToIgnoreUpward = this._myCollisionCheckParamsMovement.myGroundAngleToIgnore;
                params.myDetectionParams.myMustBeOnGround = true;

                params.myDetectionParams.myTeleportBlockLayerFlags.copy(this._myParams.myPhysicsBlockLayerFlags);
                params.myDetectionParams.myTeleportFloorLayerFlags.copy(this._myParams.myPhysicsBlockLayerFlags);
                params.myDetectionParams.myTeleportFeetPositionMustBeVisible = false;
                params.myDetectionParams.myTeleportHeadPositionMustBeVisible = false;
                params.myDetectionParams.myTeleportHeadOrFeetPositionMustBeVisible = true;

                params.myDetectionParams.myTeleportParableStartReferenceObject = this._myParams.myTeleportParableStartReferenceObject;

                params.myDetectionParams.myVisibilityBlockLayerFlags.copy(this._myParams.myPhysicsBlockLayerFlags);

                params.myVisualizerParams.myTeleportPositionObject = this._myParams.myTeleportPositionObject;

                params.myPerformTeleportAsMovement = false;
                params.myTeleportAsMovementRemoveVerticalMovement = true;
                params.myTeleportAsMovementExtraVerticalMovementPerMeter = -2;

                params.myGravityAcceleration = 0;

                params.myDebugActive = false;
                params.myDebugDetectActive = true;
                params.myDebugShowActive = true;
                params.myDebugVisibilityActive = false;

                this._myPlayerLocomotionTeleport = new PP.PlayerLocomotionTeleport(params, this._myMovementRuntimeParams);
            }
        }

        this._setupLocomotionMovementFSM();

        this._myIdle = false;
    }

    start() {
        this._fixAlmostUp();

        this._myPlayerHeadManager.start();
        this._myPlayerTransformManager.start();

        this._myPlayerObscureManager.start();

        this._myPlayerLocomotionRotate.start();

        this._myLocomotionMovementFSM.perform("start");
    }

    update(dt) {
        this._myPlayerHeadManager.update(dt);
        this._myPlayerTransformManager.update(dt);

        if (PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressEnd(2)) {
            if (this._myLocomotionMovementFSM.isInState("smooth") && this._myPlayerLocomotionSmooth.canStop()) {
                this._myLocomotionMovementFSM.perform("next");
            } else if (this._myLocomotionMovementFSM.isInState("teleport") && this._myPlayerLocomotionTeleport.canStop()) {
                this._myLocomotionMovementFSM.perform("next");
            }
        }

        if (this._myPlayerHeadManager.isSynced()) {

            this._updateCollisionHeight();

            if (!this._myIdle) {
                this._myPlayerLocomotionRotate.update(dt);
                this._myLocomotionMovementFSM.update(dt);
            }
        }

        //this._myPlayerObscureManager.update(dt);
        if (PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.SELECT).isPressEnd(2)) {
            if (this._myPlayerObscureManager.isFading()) {
                this._myPlayerObscureManager.obscureLevelOverride(this._myPlayerObscureManager.isFadingOut() ? Math.pp_random(0, 0) : Math.pp_random(1, 1));
            } else {
                this._myPlayerObscureManager.obscureLevelOverride(this._myPlayerObscureManager.isObscured() ? Math.pp_random(0, 0) : Math.pp_random(1, 1));
            }
        }
    }

    setIdle(idle) {
        this._myIdle = idle;

        if (idle) {
            this._myLocomotionMovementFSM.perform("idle");
        } else {
            this._myLocomotionMovementFSM.perform("start");
        }
    }

    _updateCollisionHeight() {
        this._myCollisionCheckParamsMovement.myHeight = this._myPlayerHeadManager.getHeightHead();
        if (this._myCollisionCheckParamsMovement.myHeight <= 0.000001) {
            this._myCollisionCheckParamsMovement.myHeight = 0;
        }
        this._myCollisionCheckParamsTeleport.myHeight = this._myCollisionCheckParamsMovement.myHeight;
    }

    _setupCollisionCheckParamsMovement() {
        this._myCollisionCheckParamsMovement.mySplitMovementEnabled = false;
        this._myCollisionCheckParamsMovement.mySplitMovementMaxLength = 0;

        this._myCollisionCheckParamsMovement.myRadius = this._myParams.myCharacterRadius;
        this._myCollisionCheckParamsMovement.myDistanceFromFeetToIgnore = 0.1;
        this._myCollisionCheckParamsMovement.myDistanceFromHeadToIgnore = 0.1;

        //this._myCollisionCheckParamsMovement.myPositionOffsetLocal.vec3_set(0, 1, 0)
        //this._myCollisionCheckParamsMovement.myRotationOffsetLocalQuat.quat_fromAxis(45, PP.vec3_create(1, 1, 0).vec3_normalize());

        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckEnabled = true;
        this._myCollisionCheckParamsMovement.myHorizontalMovementStepEnabled = false;
        this._myCollisionCheckParamsMovement.myHorizontalMovementStepMaxLength = 0;
        this._myCollisionCheckParamsMovement.myHorizontalMovementRadialStepAmount = 1;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckDiagonalOutward = true;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckDiagonalInward = true;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckStraight = false;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckHorizontalBorder = false;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckVerticalStraight = false;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckVerticalDiagonalUpwardOutward = true;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckVerticalDiagonalUpwardInward = true;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckVerticalDiagonalDownwardOutward = false;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckVerticalDiagonalDownwardInward = false;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckVerticalStraightDiagonalUpward = false;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckVerticalStraightDiagonalDownward = false;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalOutward = false;
        this._myCollisionCheckParamsMovement.myHorizontalMovementCheckVerticalHorizontalBorderDiagonalInward = false;
        this._myCollisionCheckParamsMovement.myHorizontalMovementHorizontalStraightCentralCheckEnabled = true;
        this._myCollisionCheckParamsMovement.myHorizontalMovementVerticalStraightDiagonalUpwardCentralCheckEnabled = true;

        this._myCollisionCheckParamsMovement.myHorizontalPositionCheckEnabled = true;
        this._myCollisionCheckParamsMovement.myHalfConeAngle = 60;
        this._myCollisionCheckParamsMovement.myHalfConeSliceAmount = 2;
        this._myCollisionCheckParamsMovement.myCheckConeBorder = true;
        this._myCollisionCheckParamsMovement.myCheckConeRay = true;
        this._myCollisionCheckParamsMovement.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision = false;
        this._myCollisionCheckParamsMovement.myHorizontalPositionCheckVerticalDirectionType = 2; // somewhat expensive, 2 times the check for the vertical check of the horizontal movement!

        this._myCollisionCheckParamsMovement.myVerticalMovementCheckEnabled = true;
        this._myCollisionCheckParamsMovement.myVerticalPositionCheckEnabled = true;
        this._myCollisionCheckParamsMovement.myVerticalMovementReduceEnabled = true;
        this._myCollisionCheckParamsMovement.myFeetRadius = 0.1;
        this._myCollisionCheckParamsMovement.myAdjustVerticalMovementWithGroundAngleDownhill = true;
        this._myCollisionCheckParamsMovement.myAdjustVerticalMovementWithGroundAngleUphill = true;
        this._myCollisionCheckParamsMovement.myAdjustVerticalMovementWithCeilingAngleUphill = true;
        this._myCollisionCheckParamsMovement.myAdjustHorizontalMovementWithGroundAngleDownhill = false;
        this._myCollisionCheckParamsMovement.myAdjustHorizontalMovementWithCeilingAngleDownhill = false;
        this._myCollisionCheckParamsMovement.myAdjustHorizontalMovementWithGroundAngleDownhillMinAngle = 30;

        this._myCollisionCheckParamsMovement.mySnapOnGroundEnabled = true;
        this._myCollisionCheckParamsMovement.mySnapOnGroundExtraDistance = 0.1;
        this._myCollisionCheckParamsMovement.mySnapOnCeilingEnabled = false;
        this._myCollisionCheckParamsMovement.mySnapOnCeilingExtraDistance = 0.1;

        this._myCollisionCheckParamsMovement.myGroundPopOutEnabled = true;
        this._myCollisionCheckParamsMovement.myGroundPopOutExtraDistance = 0.1;
        this._myCollisionCheckParamsMovement.myCeilingPopOutEnabled = true;
        this._myCollisionCheckParamsMovement.myCeilingPopOutExtraDistance = 0.1;

        this._myCollisionCheckParamsMovement.myGroundCircumferenceAddCenter = true;
        this._myCollisionCheckParamsMovement.myGroundCircumferenceSliceAmount = 8;
        this._myCollisionCheckParamsMovement.myGroundCircumferenceStepAmount = 2;
        this._myCollisionCheckParamsMovement.myGroundCircumferenceRotationPerStep = 22.5;
        this._myCollisionCheckParamsMovement.myVerticalAllowHitInsideCollisionIfOneOk = true;

        this._myCollisionCheckParamsMovement.myCheckHeight = true;
        this._myCollisionCheckParamsMovement.myCheckHeightVerticalMovement = true;
        this._myCollisionCheckParamsMovement.myCheckHeightVerticalPosition = true;
        this._myCollisionCheckParamsMovement.myCheckHeightTopMovement = true;
        this._myCollisionCheckParamsMovement.myCheckHeightTopPosition = true;
        this._myCollisionCheckParamsMovement.myCheckHeightConeOnCollision = true;
        this._myCollisionCheckParamsMovement.myCheckHeightConeOnCollisionKeepHit = false;
        this._myCollisionCheckParamsMovement.myHeightCheckStepAmountMovement = 2;
        this._myCollisionCheckParamsMovement.myHeightCheckStepAmountPosition = 2;
        this._myCollisionCheckParamsMovement.myCheckVerticalFixedForwardEnabled = true;
        this._myCollisionCheckParamsMovement.myCheckVerticalFixedForward = PP.vec3_create(0, 0, 1);
        this._myCollisionCheckParamsMovement.myCheckVerticalBothDirection = true;

        this._myCollisionCheckParamsMovement.myCheckVerticalStraight = true;
        this._myCollisionCheckParamsMovement.myCheckVerticalDiagonalRayOutward = false;
        this._myCollisionCheckParamsMovement.myCheckVerticalDiagonalRayInward = false;
        this._myCollisionCheckParamsMovement.myCheckVerticalDiagonalBorderOutward = false;
        this._myCollisionCheckParamsMovement.myCheckVerticalDiagonalBorderInward = false;
        this._myCollisionCheckParamsMovement.myCheckVerticalDiagonalBorderRayOutward = false;
        this._myCollisionCheckParamsMovement.myCheckVerticalDiagonalBorderRayInward = false;
        this._myCollisionCheckParamsMovement.myCheckVerticalSearchFartherVerticalHit = false;

        this._myCollisionCheckParamsMovement.myGroundAngleToIgnore = 30;
        this._myCollisionCheckParamsMovement.myCeilingAngleToIgnore = 30;

        //this._myCollisionCheckParamsMovement.myHorizontalMovementGroundAngleIgnoreHeight = 0.1 * 3;
        //this._myCollisionCheckParamsMovement.myHorizontalMovementCeilingAngleIgnoreHeight = 0.1 * 3;
        //this._myCollisionCheckParamsMovement.myHorizontalPositionGroundAngleIgnoreHeight = 0.1;
        //this._myCollisionCheckParamsMovement.myHorizontalPositionCeilingAngleIgnoreHeight = 0.1;

        this._myCollisionCheckParamsMovement.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft = 0.1;
        this._myCollisionCheckParamsMovement.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft = 0.1;

        this._myCollisionCheckParamsMovement.myHeight = 1;

        this._myCollisionCheckParamsMovement.myComputeGroundInfoEnabled = true;
        this._myCollisionCheckParamsMovement.myComputeCeilingInfoEnabled = true;
        this._myCollisionCheckParamsMovement.myDistanceToBeOnGround = 0.001;
        this._myCollisionCheckParamsMovement.myDistanceToComputeGroundInfo = 0.1;
        this._myCollisionCheckParamsMovement.myDistanceToBeOnCeiling = 0.001;
        this._myCollisionCheckParamsMovement.myDistanceToComputeCeilingInfo = 0.1;
        this._myCollisionCheckParamsMovement.myVerticalFixToBeOnGround = 0;
        this._myCollisionCheckParamsMovement.myVerticalFixToComputeGroundInfo = 0;
        this._myCollisionCheckParamsMovement.myVerticalFixToBeOnCeiling = 0;
        this._myCollisionCheckParamsMovement.myVerticalFixToComputeCeilingInfo = 0;

        this._myCollisionCheckParamsMovement.myMustStayOnGround = false;
        this._myCollisionCheckParamsMovement.myMustStayOnCeiling = false;
        this._myCollisionCheckParamsMovement.myRegatherGroundInfoOnSurfaceCheckFail = true;
        this._myCollisionCheckParamsMovement.myRegatherCeilingInfoOnSurfaceCheckFail = true;
        //this._myCollisionCheckParamsMovement.myExtraMovementCheckCallback = function () { return [0, 0, 0.01]; }

        this._myCollisionCheckParamsMovement.mySlidingEnabled = true;
        this._myCollisionCheckParamsMovement.mySlidingHorizontalMovementCheckBetterNormal = true;
        this._myCollisionCheckParamsMovement.mySlidingMaxAttempts = 4;
        this._myCollisionCheckParamsMovement.mySlidingCheckBothDirections = true;        // expensive, 2 times the check for the whole horizontal movement!
        this._myCollisionCheckParamsMovement.mySlidingFlickeringPreventionType = 1;      // expensive, 2 times the check for the whole horizontal movement!
        this._myCollisionCheckParamsMovement.mySlidingFlickeringPreventionCheckOnlyIfAlreadySliding = true;
        this._myCollisionCheckParamsMovement.mySlidingFlickerPreventionCheckAnywayCounter = 4;
        this._myCollisionCheckParamsMovement.mySlidingAdjustSign90Degrees = true;

        this._myCollisionCheckParamsMovement.myHorizontalBlockLayerFlags.copy(this._myParams.myPhysicsBlockLayerFlags);
        let physXComponents = PP.myPlayerObjects.myPlayer.pp_getComponentsHierarchy("physx");
        for (let physXComponent of physXComponents) {
            this._myCollisionCheckParamsMovement.myHorizontalObjectsToIgnore.pp_pushUnique(physXComponent.object, (first, second) => first.pp_equals(second));
        }

        this._myCollisionCheckParamsMovement.myVerticalBlockLayerFlags.copy(this._myCollisionCheckParamsMovement.myHorizontalBlockLayerFlags);
        this._myCollisionCheckParamsMovement.myVerticalObjectsToIgnore.pp_copy(this._myCollisionCheckParamsMovement.myHorizontalObjectsToIgnore);

        this._myCollisionCheckParamsMovement.myDebugActive = false;

        this._myCollisionCheckParamsMovement.myDebugHorizontalMovementActive = false;
        this._myCollisionCheckParamsMovement.myDebugHorizontalPositionActive = true;
        this._myCollisionCheckParamsMovement.myDebugVerticalMovementActive = false;
        this._myCollisionCheckParamsMovement.myDebugVerticalPositionActive = false;
        this._myCollisionCheckParamsMovement.myDebugSlidingActive = false;
        this._myCollisionCheckParamsMovement.myDebugGroundInfoActive = false;
        this._myCollisionCheckParamsMovement.myDebugCeilingInfoActive = false;
        this._myCollisionCheckParamsMovement.myDebugRuntimeParamsActive = false;
        this._myCollisionCheckParamsMovement.myDebugMovementActive = false;
    }

    _setupCollisionCheckParamsTeleport() {
        this._myCollisionCheckParamsTeleport = PP.CollisionCheckUtils.generate360TeleportParamsFromMovementParams(this._myCollisionCheckParamsMovement);

        // increased so to let teleport on steep slopes from above (from below is fixed through detection myGroundAngleToIgnoreUpward)
        this._myCollisionCheckParamsTeleport.myGroundAngleToIgnore = 60;
        this._myCollisionCheckParamsTeleport.myTeleportMustBeOnIgnorableGroundAngle = true;
        this._myCollisionCheckParamsTeleport.myTeleportMustBeOnGround = true;

        /*
        this._myCollisionCheckParamsTeleport.myExtraTeleportCheckCallback = function (
            offsetTeleportPosition, endPosition, feetPosition, transformUp, transformForward, height,
            collisionCheckParams, prevCollisionRuntimeParams, collisionRuntimeParams, newFeetPosition

        ) {
            let isTeleportingUpward = endPosition.vec3_isFartherAlongAxis(feetPosition, transformUp);
            if (isTeleportingUpward) {
                collisionRuntimeParams.myTeleportCanceled = collisionRuntimeParams.myGroundAngle > 30 + 0.0001;
                console.error(collisionRuntimeParams.myTeleportCanceled);
            }

            return newFeetPosition;
        }*/

        // this is needed for when u want to perform the teleport as a movement
        // maybe this should be another set of collsion check params copied from the smooth ones?
        // when you teleport as move, u check with the teleport for the position, and this other params for the move, so that u can use a smaller
        // cone, and sliding if desired
        // if nothing is specified it's copied from the teleport and if greater than 90 cone is tuned down, and also the below settings are applied

        // you could also do this if u want to perform the teleport as movement, instead of using the smooth
        // but this will make even the final teleport check be halved
        //this._myCollisionCheckParamsTeleport.myHalfConeAngle = 90;
        //this._myCollisionCheckParamsTeleport.myHalfConeSliceAmount = 3;
        //this._myCollisionCheckParamsTeleport.myCheckHorizontalFixedForwardEnabled = false;
        //this._myCollisionCheckParamsTeleport.mySplitMovementEnabled = true;
        //this._myCollisionCheckParamsTeleport.mySplitMovementMaxLength = 0.2;

        //this._myCollisionCheckParamsTeleport.myDebugActive = true;
    }

    _fixAlmostUp() {
        // get rotation on y and adjust if it's slightly tilted when it's almsot 0,1,0

        let defaultUp = PP.vec3_create(0, 1, 0);
        let angleWithDefaultUp = PP.myPlayerObjects.myPlayer.pp_getUp().vec3_angle(defaultUp);
        if (angleWithDefaultUp < 1) {
            let forward = PP.myPlayerObjects.myPlayer.pp_getForward();
            let flatForward = forward.vec3_clone();
            flatForward[1] = 0;

            let defaultForward = PP.vec3_create(0, 0, 1);
            let angleWithDefaultForward = defaultForward.vec3_angleSigned(flatForward, defaultUp);

            PP.myPlayerObjects.myPlayer.pp_resetRotation();
            PP.myPlayerObjects.myPlayer.pp_rotateAxis(angleWithDefaultForward, defaultUp);
        }
    }

    _setupLocomotionMovementFSM() {
        this._myLocomotionMovementFSM = new PP.FSM();
        //this._myLocomotionMovementFSM.setDebugLogActive(true, "Locomotion Movement");

        this._myLocomotionMovementFSM.addState("init");
        this._myLocomotionMovementFSM.addState("smooth", (dt) => this._myPlayerLocomotionSmooth.update(dt));
        this._myLocomotionMovementFSM.addState("teleport", (dt) => this._myPlayerLocomotionTeleport.update(dt));
        this._myLocomotionMovementFSM.addState("idleSmooth");
        this._myLocomotionMovementFSM.addState("idleTeleport");

        this._myLocomotionMovementFSM.addTransition("init", "smooth", "start", function () {
            this._myPlayerLocomotionSmooth.start();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("smooth", "teleport", "next", function () {
            this._myPlayerLocomotionSmooth.stop();
            this._myPlayerLocomotionTeleport.start();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("teleport", "smooth", "next", function () {
            this._myPlayerLocomotionTeleport.stop();
            this._myPlayerLocomotionSmooth.start();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("smooth", "idleSmooth", "idle", function () {
            this._myPlayerLocomotionSmooth.stop();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("teleport", "idleTeleport", "idle", function () {
            this._myPlayerLocomotionTeleport.stop();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("idleSmooth", "smooth", "start", function () {
            this._myPlayerLocomotionSmooth.start();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("idleTeleport", "teleport", "start", function () {
            this._myPlayerLocomotionTeleport.start();
        }.bind(this));

        this._myLocomotionMovementFSM.init("init");
    }
};
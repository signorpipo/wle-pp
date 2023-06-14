import { PhysXComponent } from "@wonderlandengine/api";
import { FSM } from "../../../../../cauldron/fsm/fsm";
import { EasingFunction } from "../../../../../cauldron/js/utils/math_utils";
import { PhysicsLayerFlags } from "../../../../../cauldron/physics/physics_layer_flags";
import { Handedness } from "../../../../../input/cauldron/input_types";
import { InputUtils } from "../../../../../input/cauldron/input_utils";
import { GamepadButtonID } from "../../../../../input/gamepad/gamepad_buttons";
import { vec3_create } from "../../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../../pp/globals";
import { CharacterColliderSetupSimplifiedCreationParams, CharacterColliderSetupUtils } from "../../../character_controller/collision/character_collider_setup_utils";
import { CollisionCheckBridge } from "../../../character_controller/collision/collision_check_bridge";
import { CollisionCheckUtils } from "../../../character_controller/collision/legacy/collision_check/collision_check";
import { CollisionCheckParams, CollisionRuntimeParams } from "../../../character_controller/collision/legacy/collision_check/collision_params";
import { PlayerHeadManager, PlayerHeadManagerParams } from "./player_head_manager";
import { PlayerLocomotionMovementRuntimeParams } from "./player_locomotion_movement";
import { PlayerLocomotionRotate, PlayerLocomotionRotateParams } from "./player_locomotion_rotate";
import { PlayerLocomotionSmooth, PlayerLocomotionSmoothParams } from "./player_locomotion_smooth";
import { PlayerObscureManager, PlayerObscureManagerParams } from "./player_obscure_manager";
import { PlayerTransformManager, PlayerTransformManagerParams, PlayerTransformManagerSyncFlag } from "./player_transform_manager";
import { PlayerLocomotionTeleport, PlayerLocomotionTeleportParams } from "./teleport/player_locomotion_teleport";
import { PlayerLocomotionTeleportTeleportType } from "./teleport/player_locomotion_teleport_teleport_state";

export let PlayerLocomotionDirectionReferenceType = {
    HEAD: 0,
    HAND: 1,
    CUSTOM_OBJECT: 2,
};

export let PlayerLocomotionType = {
    SMOOTH: 0,
    TELEPORT: 1
};

export class PlayerLocomotionParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myDefaultLocomotionType = PlayerLocomotionType.SMOOTH;
        this.mySwitchLocomotionTypeShortcutEnabled = true; // double press main hand (default left) thumbstick to switch

        this.myDefaultHeight = 0;

        this.myMaxSpeed = 0;
        this.myMaxRotationSpeed = 0;

        this.myGravityAcceleration = 0;
        this.myMaxGravitySpeed = 0;

        this.myCharacterRadius = 0;

        this.mySpeedSlowDownPercentageOnWallSlid = 1;

        this.myIsSnapTurn = false;
        this.mySnapTurnOnlyVR = false;
        this.mySnapTurnAngle = 0;
        this.mySnapTurnSpeedDegrees = 0;

        this.myFlyEnabled = false;
        this.myStartFlying = false;

        this.myMinAngleToFlyUpNonVR = 0;
        this.myMinAngleToFlyDownNonVR = 0;
        this.myMinAngleToFlyUpVR = 0;
        this.myMinAngleToFlyDownVR = 0;
        this.myMinAngleToFlyRight = 0;

        this.myMainHand = Handedness.LEFT;

        this.myDirectionInvertForwardWhenUpsideDown = true;
        this.myVRDirectionReferenceType = PlayerLocomotionDirectionReferenceType.HEAD;
        this.myVRDirectionReferenceObject = null;

        this.myForeheadExtraHeight = 0;

        this.myTeleportType = PlayerLocomotionTeleportTeleportType.INSTANT;
        this.myTeleportMaxDistance = 0;
        this.myTeleportMaxHeightDifference = 0;
        this.myTeleportRotationOnUpEnabled = null;
        this.myTeleportValidMaterial = null;
        this.myTeleportInvalidMaterial = null;
        this.myTeleportPositionObject = null;
        this.myTeleportPositionObjectRotateWithHead = null;
        this.myTeleportParableStartReferenceObject = null;

        this.mySyncWithRealWorldPositionOnlyIfValid = true;
        this.myViewOcclusionInsideWallsEnabled = true;

        this.myColliderAccuracy = null;
        this.myColliderCheckOnlyFeet = false;
        this.myColliderSlideAlongWall = false;
        this.myColliderMaxWalkableGroundAngle = 0;
        this.myColliderSnapOnGround = false;
        this.myColliderMaxDistanceToSnapOnGround = 0;
        this.myColliderMaxWalkableGroundStepHeight = 0;
        this.myColliderPreventFallingFromEdges = false;

        this.myDebugHorizontalEnabled = false;
        this.myDebugVerticalEnabled = false;

        this.myMoveThroughCollisionShortcutEnabled = false; // main hand (default left) thumbstick pressed while moving
        this.myMoveHeadShortcutEnabled = false;             // non main hand (default right) thumbstick pressed while moving
        this.myTripleSpeedShortcutEnabled = false;          // main hand (default left) select pressed while moving

        this.myPhysicsBlockLayerFlags = new PhysicsLayerFlags();

        this.myEngine = engine;
    }
}

// #TODO Add lerped snap on vertical over like half a second to avoid the "snap effect"
// This could be done by detatching the actual vertical position of the player from the collision real one when a snap is detected above a certain threshold
// with a timer, after which the vertical position is just copied, while during the detatching is lerped toward the collision vertical one
export class PlayerLocomotion {

    constructor(params) {
        this._myParams = params;

        this._myCollisionCheckParamsMovement = new CollisionCheckParams();
        this._setupCollisionCheckParamsMovement();
        this._myCollisionCheckParamsTeleport = null;
        this._setupCollisionCheckParamsTeleport();

        this._myCollisionRuntimeParams = new CollisionRuntimeParams();
        this._myMovementRuntimeParams = new PlayerLocomotionMovementRuntimeParams();
        this._myMovementRuntimeParams.myIsFlying = this._myParams.myStartFlying;
        this._myMovementRuntimeParams.myCollisionRuntimeParams = this._myCollisionRuntimeParams;

        {
            let params = new PlayerHeadManagerParams(this._myParams.myEngine);

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
            params.myHeightOffsetVRWithoutFloor = this._myParams.myDefaultHeight;
            params.myHeightOffsetNonVR = this._myParams.myDefaultHeight;

            params.myForeheadExtraHeight = this._myParams.myForeheadExtraHeight;

            params.myFeetRotationKeepUp = true;

            params.myDebugEnabled = false;

            this._myPlayerHeadManager = new PlayerHeadManager(params);
        }

        {
            let params = new PlayerTransformManagerParams(this._myParams.myEngine);

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

            params.myAlwaysSyncPositionWithReal = !this._myParams.mySyncWithRealWorldPositionOnlyIfValid;
            params.myAlwaysSyncHeadPositionWithReal = false;

            if (!this._myParams.myViewOcclusionInsideWallsEnabled && !this._myParams.mySyncWithRealWorldPositionOnlyIfValid) {
                params.mySyncEnabledFlagMap.set(PlayerTransformManagerSyncFlag.BODY_COLLIDING, false);
                params.mySyncEnabledFlagMap.set(PlayerTransformManagerSyncFlag.HEAD_COLLIDING, false);
                params.mySyncEnabledFlagMap.set(PlayerTransformManagerSyncFlag.FAR, false);
                params.mySyncEnabledFlagMap.set(PlayerTransformManagerSyncFlag.FLOATING, false);

                params.myAlwaysSyncHeadPositionWithReal = !this._myParams.mySyncWithRealWorldPositionOnlyIfValid;
            }

            params.myMaxDistanceFromRealToSyncEnabled = true;
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

            params.myResetRealOnMove = false;

            params.myDebugEnabled = false;

            this._myPlayerTransformManager = new PlayerTransformManager(params);
        }

        {
            let params = new PlayerObscureManagerParams(this._myParams.myEngine);

            params.myPlayerTransformManager = this._myPlayerTransformManager;

            params.myEnabled = this._myParams.myViewOcclusionInsideWallsEnabled;

            params.myObscureObject = null;
            params.myObscureMaterial = null;
            params.myObscureRadius = 0.1;

            params.myObscureFadeOutSeconds = 0.25;
            params.myObscureFadeInSeconds = 0.25;

            params.myObscureFadeEasingFunction = EasingFunction.linear;
            params.myObscureLevelRelativeDistanceEasingFunction = EasingFunction.linear;

            params.myDistanceToStartObscureWhenBodyColliding = 0.75;
            params.myDistanceToStartObscureWhenHeadColliding = 0;
            params.myDistanceToStartObscureWhenFloating = 0.75;
            params.myDistanceToStartObscureWhenFar = 0.75;

            params.myRelativeDistanceToMaxObscureWhenBodyColliding = 0.5;
            params.myRelativeDistanceToMaxObscureWhenHeadColliding = 0.1;
            params.myRelativeDistanceToMaxObscureWhenFloating = 0.5;
            params.myRelativeDistanceToMaxObscureWhenFar = 0.5;

            this._myPlayerObscureManager = new PlayerObscureManager(params);
        }

        {
            let params = new PlayerLocomotionRotateParams(this._myParams.myEngine);

            params.myPlayerHeadManager = this._myPlayerHeadManager;
            params.myPlayerTransformManager = this._myPlayerTransformManager;

            params.myMaxRotationSpeed = this._myParams.myMaxRotationSpeed;
            params.myIsSnapTurn = this._myParams.myIsSnapTurn;
            params.mySnapTurnOnlyVR = this._myParams.mySnapTurnOnlyVR;
            params.mySnapTurnAngle = this._myParams.mySnapTurnAngle;

            if (this._myParams.mySnapTurnSpeedDegrees > Math.PP_EPSILON) {
                params.mySmoothSnapEnabled = true;
                params.mySmoothSnapSpeedDegrees = this._myParams.mySnapTurnSpeedDegrees;
            } else {
                params.mySmoothSnapEnabled = false;
            }

            params.myRotationMinStickIntensityThreshold = 0.1;
            params.mySnapTurnActivateThreshold = 0.5;
            params.mySnapTurnResetThreshold = 0.4;

            params.myClampVerticalAngle = true;
            params.myMaxVerticalAngle = 90;

            this._myPlayerLocomotionRotate = new PlayerLocomotionRotate(params);

            params.myHandedness = InputUtils.getOppositeHandedness(this._myParams.myMainHand);
        }

        {
            {
                let params = new PlayerLocomotionSmoothParams(this._myParams.myEngine);

                params.myPlayerHeadManager = this._myPlayerHeadManager;
                params.myPlayerTransformManager = this._myPlayerTransformManager;

                params.myCollisionCheckParams = this._myCollisionCheckParamsMovement;

                params.myHandedness = this._myParams.myMainHand;

                params.myMaxSpeed = this._myParams.myMaxSpeed;
                params.mySpeedSlowDownPercentageOnWallSlid = this._myParams.mySpeedSlowDownPercentageOnWallSlid;

                params.myMovementMinStickIntensityThreshold = 0.1;

                params.myFlyEnabled = this._myParams.myFlyEnabled;
                params.myMinAngleToFlyUpNonVR = this._myParams.myMinAngleToFlyUpNonVR;
                params.myMinAngleToFlyDownNonVR = this._myParams.myMinAngleToFlyDownNonVR;
                params.myMinAngleToFlyUpVR = this._myParams.myMinAngleToFlyUpVR;
                params.myMinAngleToFlyDownVR = this._myParams.myMinAngleToFlyDownVR;
                params.myMinAngleToFlyRight = this._myParams.myMinAngleToFlyRight;

                params.myGravityAcceleration = this._myParams.myGravityAcceleration;
                params.myMaxGravitySpeed = this._myParams.myMaxGravitySpeed;

                params.myDirectionInvertForwardWhenUpsideDown = this._myParams.myDirectionInvertForwardWhenUpsideDown;
                params.myVRDirectionReferenceType = this._myParams.myVRDirectionReferenceType;
                params.myVRDirectionReferenceObject = this._myParams.myVRDirectionReferenceObject;

                params.myMoveThroughCollisionShortcutEnabled = this._myParams.myMoveThroughCollisionShortcutEnabled;
                params.myMoveHeadShortcutEnabled = this._myParams.myMoveHeadShortcutEnabled;
                params.myTripleSpeedShortcutEnabled = this._myParams.myTripleSpeedShortcutEnabled;

                this._myPlayerLocomotionSmooth = new PlayerLocomotionSmooth(params, this._myMovementRuntimeParams);
            }

            {
                let params = new PlayerLocomotionTeleportParams(this._myParams.myEngine);

                params.myPlayerHeadManager = this._myPlayerHeadManager;
                params.myPlayerTransformManager = this._myPlayerTransformManager;

                params.myCollisionCheckParams = this._myCollisionCheckParamsTeleport;

                params.myHandedness = this._myParams.myMainHand;

                params.myDetectionParams.myMaxDistance = this._myParams.myTeleportMaxDistance;
                params.myDetectionParams.myMaxHeightDifference = this._myParams.myTeleportMaxHeightDifference;
                params.myDetectionParams.myGroundAngleToIgnoreUpward = this._myCollisionCheckParamsMovement.myGroundAngleToIgnore;
                params.myDetectionParams.myRotationOnUpEnabled = this._myParams.myTeleportRotationOnUpEnabled;
                params.myDetectionParams.myMustBeOnGround = true;

                params.myDetectionParams.myTeleportBlockLayerFlags.copy(this._myParams.myPhysicsBlockLayerFlags);
                params.myDetectionParams.myTeleportFloorLayerFlags.copy(this._myParams.myPhysicsBlockLayerFlags);

                params.myDetectionParams.myTeleportFeetPositionMustBeVisible = false;
                params.myDetectionParams.myTeleportHeadPositionMustBeVisible = false;
                params.myDetectionParams.myTeleportHeadOrFeetPositionMustBeVisible = true;

                params.myDetectionParams.myTeleportParableStartReferenceObject = this._myParams.myTeleportParableStartReferenceObject;

                params.myDetectionParams.myVisibilityBlockLayerFlags.copy(params.myDetectionParams.myTeleportBlockLayerFlags);

                params.myTeleportParams.myTeleportType = this._myParams.myTeleportType;

                params.myVisualizerParams.myTeleportPositionObject = this._myParams.myTeleportPositionObject;
                params.myVisualizerParams.myTeleportValidMaterial = this._myParams.myTeleportValidMaterial;
                params.myVisualizerParams.myTeleportInvalidMaterial = this._myParams.myTeleportInvalidMaterial;
                params.myVisualizerParams.myTeleportPositionObjectRotateWithHead = this._myParams.myTeleportPositionObjectRotateWithHead;

                params.myPerformTeleportAsMovement = false;
                params.myTeleportAsMovementRemoveVerticalMovement = true;
                params.myTeleportAsMovementExtraVerticalMovementPerMeter = -2;

                params.myGravityAcceleration = this._myParams.myGravityAcceleration;
                params.myMaxGravitySpeed = this._myParams.myMaxGravitySpeed;

                params.myDebugEnabled = false;
                params.myDebugDetectEnabled = true;
                params.myDebugShowEnabled = true;
                params.myDebugVisibilityEnabled = false;

                this._myPlayerLocomotionTeleport = new PlayerLocomotionTeleport(params, this._myMovementRuntimeParams);
            }
        }

        this._setupLocomotionMovementFSM();

        this._myIdle = false;

        this._myActive = true;
        this._myStarted = false;
        this._myDestroyed = false;
    }

    start() {
        this._fixAlmostUp();

        this._myPlayerHeadManager.start();
        this._myPlayerTransformManager.start();

        this._myPlayerObscureManager.start();

        this._myPlayerLocomotionRotate.start();

        if (this._myParams.myDefaultLocomotionType == PlayerLocomotionType.SMOOTH) {
            this._myLocomotionMovementFSM.perform("startSmooth");
        } else {
            this._myLocomotionMovementFSM.perform("startTeleport");
        }

        this._myStarted = true;

        let currentActive = this._myActive
        this._myActive = !this._myActive;
        this.setActive(currentActive);
    }

    setActive(active) {
        if (this._myActive != active) {
            this._myActive = active;

            if (this._myStarted) {
                if (this._myActive) {
                    this._myPlayerObscureManager.start();
                    if (!this._myIdle) {
                        this._myLocomotionMovementFSM.perform("resume");
                    }
                } else {
                    this._myLocomotionMovementFSM.perform("idle");
                    this._myPlayerObscureManager.stop();
                }
            }

            this._myPlayerHeadManager.setActive(this._myActive);
            this._myPlayerTransformManager.setActive(this._myActive);
        }
    }

    isStarted() {
        return this._myStarted;
    }

    canStop() {
        let canStop = false;

        if (this._myLocomotionMovementFSM.isInState("smooth") && this._myPlayerLocomotionSmooth.canStop()) {
            canStop = true;
        } else if (this._myLocomotionMovementFSM.isInState("teleport") && this._myPlayerLocomotionTeleport.canStop()) {
            canStop = true;
        }

        return canStop;
    }

    update(dt) {
        this._myPlayerHeadManager.update(dt);
        this._myPlayerTransformManager.update(dt);

        if (this._myParams.mySwitchLocomotionTypeShortcutEnabled &&
            Globals.getLeftGamepad(this._myParams.myEngine).getButtonInfo(GamepadButtonID.THUMBSTICK).isPressEnd(2)) {
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

        this._myPlayerObscureManager.update(dt);
    }

    setIdle(idle) {
        this._myIdle = idle;

        if (idle) {
            this._myLocomotionMovementFSM.perform("idle");
        } else {
            this._myLocomotionMovementFSM.perform("resume");
        }
    }

    getPlayerLocomotionSmooth() {
        return this._myPlayerLocomotionSmooth;
    }

    getPlayerLocomotionTeleport() {
        return this._myPlayerLocomotionTeleport;
    }

    getPlayerTransformManager() {
        return this._myPlayerTransformManager;
    }

    getPlayerLocomotionRotate() {
        return this._myPlayerLocomotionRotate;
    }

    getPlayerHeadManager() {
        return this._myPlayerHeadManager;
    }

    getPlayerObscureManager() {
        return this._myPlayerObscureManager;
    }

    _updateCollisionHeight() {
        this._myCollisionCheckParamsMovement.myHeight = this._myPlayerHeadManager.getHeightHead();
        if (this._myCollisionCheckParamsMovement.myHeight <= 0.000001) {
            this._myCollisionCheckParamsMovement.myHeight = 0;
        }
        this._myCollisionCheckParamsTeleport.myHeight = this._myCollisionCheckParamsMovement.myHeight;
    }

    _setupCollisionCheckParamsMovement() {
        let simplifiedParams = new CharacterColliderSetupSimplifiedCreationParams();

        simplifiedParams.myHeight = this._myParams.myDefaultHeight;
        simplifiedParams.myRadius = this._myParams.myCharacterRadius;

        simplifiedParams.myAccuracyLevel = this._myParams.myColliderAccuracy;

        simplifiedParams.myIsPlayer = true;

        simplifiedParams.myCheckOnlyFeet = this._myParams.myColliderCheckOnlyFeet;

        simplifiedParams.myMaxSpeed = this._myParams.myMaxSpeed;

        simplifiedParams.myCanFly = this._myParams.myFlyEnabled;

        simplifiedParams.myShouldSlideAlongWall = this._myParams.myColliderSlideAlongWall;

        simplifiedParams.myCollectGroundInfo = true;
        simplifiedParams.myMaxWalkableGroundAngle = this._myParams.myColliderMaxWalkableGroundAngle;
        simplifiedParams.myShouldSnapOnGround = this._myParams.myColliderSnapOnGround;
        simplifiedParams.myMaxDistanceToSnapOnGround = this._myParams.myColliderMaxDistanceToSnapOnGround;
        simplifiedParams.myMaxWalkableGroundStepHeight = this._myParams.myColliderMaxWalkableGroundStepHeight;
        simplifiedParams.myShouldNotFallFromEdges = this._myParams.myColliderPreventFallingFromEdges;

        simplifiedParams.myHorizontalCheckBlockLayerFlags.copy(this._myParams.myPhysicsBlockLayerFlags);
        let physXComponents = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getComponents(PhysXComponent);
        for (let physXComponent of physXComponents) {
            simplifiedParams.myHorizontalCheckObjectsToIgnore.pp_pushUnique(physXComponent.object, (first, second) => first.pp_equals(second));
        }
        simplifiedParams.myVerticalCheckBlockLayerFlags.copy(simplifiedParams.myHorizontalCheckBlockLayerFlags);
        simplifiedParams.myVerticalCheckObjectsToIgnore.pp_copy(simplifiedParams.myHorizontalCheckObjectsToIgnore);

        simplifiedParams.myHorizontalCheckDebugEnabled = this._myParams.myDebugHorizontalEnabled && Globals.isDebugEnabled(this._myParams.myEngine);
        simplifiedParams.myVerticalCheckDebugEnabled = this._myParams.myDebugVerticalEnabled && Globals.isDebugEnabled(this._myParams.myEngine);

        let colliderSetup = CharacterColliderSetupUtils.createSimplified(simplifiedParams);

        this._myCollisionCheckParamsMovement = CollisionCheckBridge.convertCharacterColliderSetupToCollisionCheckParams(colliderSetup, this._myCollisionCheckParamsMovement, this._myParams.myEngine);
    }

    _setupCollisionCheckParamsTeleport() {
        this._myCollisionCheckParamsTeleport = CollisionCheckUtils.generate360TeleportParamsFromMovementParams(this._myCollisionCheckParamsMovement);

        // Increased so to let teleport on steep slopes from above (from below is fixed through detection myGroundAngleToIgnoreUpward)
        this._myCollisionCheckParamsTeleport.myGroundAngleToIgnore = 61;
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

        // This is needed for when u want to perform the teleport as a movement
        // Maybe this should be another set of collsion check params copied from the smooth ones?
        // When you teleport as move, u check with the teleport for the position, and this other params for the move, so that u can use a smaller
        // cone, and sliding if desired
        // If nothing is specified it's copied from the teleport and if greater than 90 cone is tuned down, and also the below settings are applied

        // You could also do this if u want to perform the teleport as movement, instead of using the smooth
        // but this will make even the final teleport check be halved
        //this._myCollisionCheckParamsTeleport.myHalfConeAngle = 90;
        //this._myCollisionCheckParamsTeleport.myHalfConeSliceAmount = 3;
        //this._myCollisionCheckParamsTeleport.myCheckHorizontalFixedForwardEnabled = false;
        //this._myCollisionCheckParamsTeleport.mySplitMovementEnabled = true;
        //this._myCollisionCheckParamsTeleport.mySplitMovementMaxLength = 0.2;

        //this._myCollisionCheckParamsTeleport.myDebugEnabled = true;
    }

    _fixAlmostUp() {
        // Get rotation on y and adjust if it's slightly tilted when it's almsot 0,1,0

        let defaultUp = vec3_create(0, 1, 0);
        let angleWithDefaultUp = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getUp().vec3_angle(defaultUp);
        if (angleWithDefaultUp < 1) {
            let forward = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getForward();
            let flatForward = forward.vec3_clone();
            flatForward[1] = 0;

            let defaultForward = vec3_create(0, 0, 1);
            let angleWithDefaultForward = defaultForward.vec3_angleSigned(flatForward, defaultUp);

            Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_resetRotation();
            Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_rotateAxis(angleWithDefaultForward, defaultUp);
        }
    }

    _setupLocomotionMovementFSM() {
        this._myLocomotionMovementFSM = new FSM();
        //this._myLocomotionMovementFSM.setLogEnabled(true, "Locomotion Movement");

        this._myLocomotionMovementFSM.addState("init");
        this._myLocomotionMovementFSM.addState("smooth", (dt) => this._myPlayerLocomotionSmooth.update(dt));
        this._myLocomotionMovementFSM.addState("teleport", (dt) => this._myPlayerLocomotionTeleport.update(dt));
        this._myLocomotionMovementFSM.addState("idleSmooth");
        this._myLocomotionMovementFSM.addState("idleTeleport");

        this._myLocomotionMovementFSM.addTransition("init", "smooth", "startSmooth", function () {
            this._myPlayerLocomotionSmooth.start();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("init", "teleport", "startTeleport", function () {
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

        this._myLocomotionMovementFSM.addTransition("idleSmooth", "smooth", "resume", function () {
            this._myPlayerLocomotionSmooth.start();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("idleTeleport", "teleport", "resume", function () {
            this._myPlayerLocomotionTeleport.start();
        }.bind(this));

        this._myLocomotionMovementFSM.init("init");
    }

    destroy() {
        this._myDestroyed = true;

        this._myPlayerHeadManager.destroy();
        this._myPlayerLocomotionSmooth.destroy();
        this._myPlayerTransformManager.destroy();
        this._myPlayerObscureManager.destroy();
        this._myPlayerLocomotionTeleport.destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
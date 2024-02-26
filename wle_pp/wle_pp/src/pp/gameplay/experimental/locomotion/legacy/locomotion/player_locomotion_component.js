import { Component, Property } from "@wonderlandengine/api";
import { Timer } from "../../../../../cauldron/cauldron/timer.js";
import { PhysicsLayerFlags } from "../../../../../cauldron/physics/physics_layer_flags.js";
import { PhysicsUtils } from "../../../../../cauldron/physics/physics_utils.js";
import { InputUtils } from "../../../../../input/cauldron/input_utils.js";
import { Globals } from "../../../../../pp/globals.js";
import { PlayerLocomotion, PlayerLocomotionParams } from "./player_locomotion.js";

export class PlayerLocomotionComponent extends Component {
    static TypeName = "pp-player-locomotion";
    static Properties = {
        _myDefaultLocomotionType: Property.enum(["Smooth", "Teleport"], "Smooth"),
        _myAlwaysSmoothForNonVR: Property.bool(true),
        _mySwitchLocomotionTypeShortcutEnabled: Property.bool(true), // Double press main hand (default left) thumbstick to switch
        _myPhysicsBlockLayerFlags: Property.string("0, 0, 0, 0, 0, 0, 0, 0"),
        _myDefaultHeight: Property.float(1.70),
        _myCharacterRadius: Property.float(0.3),
        _myMaxSpeed: Property.float(2),
        _myMaxRotationSpeed: Property.float(100),
        _myGravityAcceleration: Property.float(-20),
        _myMaxGravitySpeed: Property.float(-15),
        _mySpeedSlowDownPercentageOnWallSlid: Property.float(1),
        _myIsSnapTurn: Property.bool(true),
        _mySnapTurnOnlyVR: Property.bool(true),
        _mySnapTurnAngle: Property.float(30),
        _mySnapTurnSpeedDegrees: Property.float(0),

        _myFlyEnabled: Property.bool(false),
        _myStartFlying: Property.bool(false),
        _myFlyWithButtonsEnabled: Property.bool(true),
        _myFlyWithViewAngleEnabled: Property.bool(true),
        _myMinAngleToFlyUpNonVR: Property.float(30),
        _myMinAngleToFlyDownNonVR: Property.float(50),
        _myMinAngleToFlyUpVR: Property.float(60),
        _myMinAngleToFlyDownVR: Property.float(1),
        _myMinAngleToFlyRight: Property.float(60),

        _myMainHand: Property.enum(["Left", "Right"], "Left"),
        _myDirectionInvertForwardWhenUpsideDown: Property.bool(true),
        _myVRDirectionReferenceType: Property.enum(["Head", "Hand", "Custom Object"], "Head"),
        _myVRDirectionReferenceObject: Property.object(),

        _myTeleportType: Property.enum(["Instant", "Blink", "Shift"], "Shift"),
        _myTeleportMaxDistance: Property.float(3),
        _myTeleportMaxHeightDifference: Property.float(1.25),
        _myTeleportRotationOnUpEnabled: Property.bool(false),
        _myTeleportValidMaterial: Property.material(),
        _myTeleportInvalidMaterial: Property.material(),
        _myTeleportPositionObject: Property.object(),
        _myTeleportPositionObjectRotateWithHead: Property.bool(true),
        _myTeleportParableStartReferenceObject: Property.object(),

        _myResetRealOnStart: Property.bool(true),

        // #WARN With @myResetRealOnStartFramesAmount at 1 it can happen that you enter the session like 1 frame before the game load
        // and the head pose might have not been properly initialized yet in the WebXR API, so the reset real will not happen has expected
        // Since this is a sort of edge case (either u enter after the load, or you were already in for more than 2-3 frames), and that
        // setting this to more than 1 can cause a visible (even if very short) stutter after the load (due to resetting the head multiple times),
        // it's better to keep this value at 1
        // A possible effect of the edge case is the view being obscured on start because it thinks you are colliding
        //
        // A value of 3 will make u sure that the head pose will be initialized and the reset real will happen as expected in any case
        // For example, if u have a total fade at start and nothing can be seen aside the clear color for at least, let's say, 10 frames, 
        // you can set this to 3 safely, since there will be no visible stutter to be seen (beside the clear color)
        _myResetRealOnStartFramesAmount: Property.int(1),

        // Can fix some head through floor issues, when you can move your head completely to the other side of the floor
        // If the floors are thick enough that this can't happen, you can leave this to false
        _myResetHeadToFeetInsteadOfReal: Property.bool(true),
        _myResetHeadToRealMinDistance: Property.float(0.25),

        // these 2 flags works 100% properly only if both true or false
        _mySyncWithRealWorldPositionOnlyIfValid: Property.bool(true),   // valid means the real player has not moved inside walls
        _myViewOcclusionInsideWallsEnabled: Property.bool(true),

        _mySyncNonVRHeightWithVROnExitSession: Property.bool(false),
        _mySyncNonVRVerticalAngleWithVROnExitSession: Property.bool(false),

        _mySyncHeadWithRealAfterLocomotionUpdateIfNeeded: Property.bool(true),

        _myColliderAccuracy: Property.enum(["Very Low", "Low", "Medium", "High", "Very High"], "High"),
        _myColliderCheckOnlyFeet: Property.bool(false),
        _myColliderSlideAlongWall: Property.bool(true),
        _myColliderMaxWalkableGroundAngle: Property.float(30),
        _myColliderSnapOnGround: Property.bool(true),
        _myColliderMaxDistanceToSnapOnGround: Property.float(0.1),
        _myColliderMaxWalkableGroundStepHeight: Property.float(0.1),
        _myColliderPreventFallingFromEdges: Property.bool(false),

        _myDebugFlyShortcutEnabled: Property.bool(false),               // main hand (default left) select + thumbstick press, auto switch to smooth
        _myDebugFlyMaxSpeedMultiplier: Property.float(5),
        _myMoveThroughCollisionShortcutEnabled: Property.bool(false),   // main hand (default left) thumbstick pressed while moving
        _myMoveHeadShortcutEnabled: Property.bool(false),               // non main hand (default right) thumbstick pressed while moving
        _myTripleSpeedShortcutEnabled: Property.bool(false),            // main hand (default left) select pressed while moving

        _myDebugHorizontalEnabled: Property.bool(false),
        _myDebugVerticalEnabled: Property.bool(false),

        _myCollisionCheckDisabled: Property.bool(false),

        _myRaycastCountLogEnabled: Property.bool(false),
        _myRaycastVisualDebugEnabled: Property.bool(false),
        _myPerformanceLogEnabled: Property.bool(false)
    };

    start() {
        let params = new PlayerLocomotionParams(this.engine);

        params.myDefaultLocomotionType = this._myDefaultLocomotionType;
        params.myAlwaysSmoothForNonVR = this._myAlwaysSmoothForNonVR;
        params.mySwitchLocomotionTypeShortcutEnabled = this._mySwitchLocomotionTypeShortcutEnabled;

        params.myDefaultHeight = this._myDefaultHeight;

        params.myMaxSpeed = this._myMaxSpeed;
        params.myMaxRotationSpeed = this._myMaxRotationSpeed;
        params.myGravityAcceleration = this._myGravityAcceleration;
        params.myMaxGravitySpeed = this._myMaxGravitySpeed;

        params.myCharacterRadius = this._myCharacterRadius;

        params.mySpeedSlowDownPercentageOnWallSlid = this._mySpeedSlowDownPercentageOnWallSlid;

        params.myIsSnapTurn = this._myIsSnapTurn;
        params.mySnapTurnOnlyVR = this._mySnapTurnOnlyVR;
        params.mySnapTurnAngle = this._mySnapTurnAngle;
        params.mySnapTurnSpeedDegrees = this._mySnapTurnSpeedDegrees;

        params.myFlyEnabled = this._myFlyEnabled;
        params.myStartFlying = this._myStartFlying;
        params.myFlyWithButtonsEnabled = this._myFlyWithButtonsEnabled;
        params.myFlyWithViewAngleEnabled = this._myFlyWithViewAngleEnabled;
        params.myMinAngleToFlyUpNonVR = this._myMinAngleToFlyUpNonVR;
        params.myMinAngleToFlyDownNonVR = this._myMinAngleToFlyDownNonVR;
        params.myMinAngleToFlyUpVR = this._myMinAngleToFlyUpVR;
        params.myMinAngleToFlyDownVR = this._myMinAngleToFlyDownVR;
        params.myMinAngleToFlyRight = this._myMinAngleToFlyRight;

        params.myMainHand = InputUtils.getHandednessByIndex(this._myMainHand);

        params.myDirectionInvertForwardWhenUpsideDown = this._myDirectionInvertForwardWhenUpsideDown;
        params.myVRDirectionReferenceType = this._myVRDirectionReferenceType;
        params.myVRDirectionReferenceObject = this._myVRDirectionReferenceObject;

        params.myForeheadExtraHeight = 0.1;

        params.myTeleportType = this._myTeleportType;
        params.myTeleportMaxDistance = this._myTeleportMaxDistance;
        params.myTeleportMaxHeightDifference = this._myTeleportMaxHeightDifference;
        params.myTeleportRotationOnUpEnabled = this._myTeleportRotationOnUpEnabled;
        params.myTeleportValidMaterial = this._myTeleportValidMaterial;
        params.myTeleportInvalidMaterial = this._myTeleportInvalidMaterial;
        params.myTeleportPositionObject = this._myTeleportPositionObject;
        params.myTeleportPositionObjectRotateWithHead = this._myTeleportPositionObjectRotateWithHead;
        params.myTeleportParableStartReferenceObject = this._myTeleportParableStartReferenceObject;

        params.myResetRealOnStart = this._myResetRealOnStart;
        params.myResetRealOnStartFramesAmount = this._myResetRealOnStartFramesAmount;
        params.myResetHeadToFeetInsteadOfReal = this._myResetHeadToFeetInsteadOfReal;
        params.myResetHeadToRealMinDistance = this._myResetHeadToRealMinDistance;

        params.mySyncWithRealWorldPositionOnlyIfValid = this._mySyncWithRealWorldPositionOnlyIfValid;
        params.myViewOcclusionInsideWallsEnabled = this._myViewOcclusionInsideWallsEnabled;

        params.mySyncNonVRHeightWithVROnExitSession = this._mySyncNonVRHeightWithVROnExitSession;
        params.mySyncNonVRVerticalAngleWithVROnExitSession = this._mySyncNonVRVerticalAngleWithVROnExitSession;

        params.mySyncHeadWithRealAfterLocomotionUpdateIfNeeded = this._mySyncHeadWithRealAfterLocomotionUpdateIfNeeded;

        params.myColliderAccuracy = this._myColliderAccuracy;
        params.myColliderCheckOnlyFeet = this._myColliderCheckOnlyFeet;
        params.myColliderSlideAlongWall = this._myColliderSlideAlongWall;
        params.myColliderMaxWalkableGroundAngle = this._myColliderMaxWalkableGroundAngle;
        params.myColliderSnapOnGround = this._myColliderSnapOnGround;
        params.myColliderMaxDistanceToSnapOnGround = this._myColliderMaxDistanceToSnapOnGround;
        params.myColliderMaxWalkableGroundStepHeight = this._myColliderMaxWalkableGroundStepHeight;
        params.myColliderPreventFallingFromEdges = this._myColliderPreventFallingFromEdges;

        params.myDebugFlyShortcutEnabled = this._myDebugFlyShortcutEnabled;
        params.myDebugFlyMaxSpeedMultiplier = this._myDebugFlyMaxSpeedMultiplier;
        params.myMoveThroughCollisionShortcutEnabled = this._myMoveThroughCollisionShortcutEnabled;
        params.myMoveHeadShortcutEnabled = this._myMoveHeadShortcutEnabled;
        params.myTripleSpeedShortcutEnabled = this._myTripleSpeedShortcutEnabled;

        params.myDebugHorizontalEnabled = this._myDebugHorizontalEnabled;
        params.myDebugVerticalEnabled = this._myDebugVerticalEnabled;

        params.myCollisionCheckDisabled = this._myCollisionCheckDisabled;

        params.myPhysicsBlockLayerFlags.copy(this._getPhysicsBlockLayersFlags());

        this._myPlayerLocomotion = new PlayerLocomotion(params);

        this._myLocomotionStarted = false;
        this._myResetReal = true;

        this._myDebugPerformanceLogTimer = new Timer(0.5);
        this._myDebugPerformanceLogTotalTime = 0;
        this._myDebugPerformanceLogFrameCount = 0;

        Globals.getHeadPose(this.engine).registerPostPoseUpdatedEventEventListener(this, this.onPostPoseUpdatedEvent.bind(this));
    }

    onPostPoseUpdatedEvent(dt, pose, manualUpdate) {
        if (manualUpdate) return;

        let startTime = 0;
        if (this._myPerformanceLogEnabled && Globals.isDebugEnabled(this.engine)) {
            startTime = window.performance.now();
        }

        let raycastVisualDebugEnabledBackup = false;
        if (this._myRaycastVisualDebugEnabled && Globals.isDebugEnabled(this.engine)) {
            raycastVisualDebugEnabledBackup = PhysicsUtils.isRaycastVisualDebugEnabled(this.engine.physics);
            PhysicsUtils.setRaycastVisualDebugEnabled(true, this.engine.physics);
        }

        if (this._myRaycastCountLogEnabled && Globals.isDebugEnabled(this.engine)) {
            PhysicsUtils.resetRaycastCount(this.engine.physics);
        }

        if (!this._myLocomotionStarted) {
            this._myLocomotionStarted = true;
            this._myPlayerLocomotion.start();
        }

        this._myPlayerLocomotion.update(dt);

        if (this._myPerformanceLogEnabled && Globals.isDebugEnabled(this.engine)) {
            let endTime = window.performance.now();
            this._myDebugPerformanceLogTotalTime += endTime - startTime;
            this._myDebugPerformanceLogFrameCount++;

            this._myDebugPerformanceLogTimer.update(dt);
            if (this._myDebugPerformanceLogTimer.isDone()) {
                this._myDebugPerformanceLogTimer.start();

                let averageTime = this._myDebugPerformanceLogTotalTime / this._myDebugPerformanceLogFrameCount;

                console.log("Locomotion ms: " + averageTime.toFixed(3));

                this._myDebugPerformanceLogTotalTime = 0;
                this._myDebugPerformanceLogFrameCount = 0;
            }
        }

        if (this._myRaycastVisualDebugEnabled && Globals.isDebugEnabled(this.engine)) {
            PhysicsUtils.setRaycastVisualDebugEnabled(raycastVisualDebugEnabledBackup, this.engine.physics);
        }

        if (this._myRaycastCountLogEnabled && Globals.isDebugEnabled(this.engine)) {
            console.log("Raycast count: " + PhysicsUtils.getRaycastCount(this.engine.physics));
            PhysicsUtils.resetRaycastCount(this.engine.physics);
        }
    }

    getPlayerLocomotion() {
        return this._myPlayerLocomotion;
    }

    onActivate() {
        if (this._myPlayerLocomotion != null) {
            this._myPlayerLocomotion.setActive(true);
        }
    }

    onDeactivate() {
        if (this._myPlayerLocomotion != null) {
            this._myPlayerLocomotion.setActive(false);
        }
    }

    _getPhysicsBlockLayersFlags() {
        let physicsFlags = new PhysicsLayerFlags();

        let flags = [...this._myPhysicsBlockLayerFlags.split(",")];
        for (let i = 0; i < flags.length; i++) {
            physicsFlags.setFlagActive(i, flags[i].trim() == "1");
        }

        return physicsFlags;
    }

    onDestroy() {
        this._myPlayerLocomotion?.destroy();
    }
}
import { PhysicsLayerFlags } from "../../../../../cauldron/physics/physics_layer_flags";
import { XRUtils } from "../../../../../cauldron/utils/xr_utils";
import { quat2_create, quat_create, vec3_create, vec4_create } from "../../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../../pp/globals";
import { CollisionCheckBridge } from "../../../character_controller/collision/collision_check_bridge";
import { CollisionCheckUtils } from "../../../character_controller/collision/legacy/collision_check/collision_check";
import { CollisionCheckParams, CollisionRuntimeParams } from "../../../character_controller/collision/legacy/collision_check/collision_params";

export let PlayerTransformManagerSyncFlag = {
    BODY_COLLIDING: 0,
    HEAD_COLLIDING: 1,
    FAR: 2,
    FLOATING: 3
};

export class PlayerTransformManagerParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myPlayerHeadManager = null;

        this.myMovementCollisionCheckParams = null;
        this.myTeleportCollisionCheckParams = null; // Can be left null and will be generated from the movement one
        this.myTeleportCollisionCheckParamsCopyFromMovement = false;
        this.myTeleportCollisionCheckParamsCheck360 = false;

        this.myAlwaysSyncPositionWithReal = false;
        this.myAlwaysSyncHeadPositionWithReal = false;

        // Sync for VR and Non VR
        this.mySyncEnabledFlagMap = new Map();
        this.mySyncEnabledFlagMap.set(PlayerTransformManagerSyncFlag.BODY_COLLIDING, true);
        this.mySyncEnabledFlagMap.set(PlayerTransformManagerSyncFlag.HEAD_COLLIDING, true);
        this.mySyncEnabledFlagMap.set(PlayerTransformManagerSyncFlag.FAR, true);
        this.mySyncEnabledFlagMap.set(PlayerTransformManagerSyncFlag.FLOATING, true);

        this.mySyncPositionFlagMap = new Map();
        this.mySyncPositionFlagMap.set(PlayerTransformManagerSyncFlag.BODY_COLLIDING, true);
        this.mySyncPositionFlagMap.set(PlayerTransformManagerSyncFlag.HEAD_COLLIDING, false);
        this.mySyncPositionFlagMap.set(PlayerTransformManagerSyncFlag.FAR, true);
        this.mySyncPositionFlagMap.set(PlayerTransformManagerSyncFlag.FLOATING, true);

        this.mySyncPositionHeadFlagMap = new Map();
        this.mySyncPositionHeadFlagMap.set(PlayerTransformManagerSyncFlag.BODY_COLLIDING, false);
        this.mySyncPositionHeadFlagMap.set(PlayerTransformManagerSyncFlag.HEAD_COLLIDING, true);
        this.mySyncPositionHeadFlagMap.set(PlayerTransformManagerSyncFlag.FAR, false);
        this.mySyncPositionHeadFlagMap.set(PlayerTransformManagerSyncFlag.FLOATING, false);

        this.mySyncRotationFlagMap = new Map();
        this.mySyncRotationFlagMap.set(PlayerTransformManagerSyncFlag.BODY_COLLIDING, false);
        this.mySyncRotationFlagMap.set(PlayerTransformManagerSyncFlag.HEAD_COLLIDING, false);
        this.mySyncRotationFlagMap.set(PlayerTransformManagerSyncFlag.FAR, false);
        this.mySyncRotationFlagMap.set(PlayerTransformManagerSyncFlag.FLOATING, false);

        this.mySyncHeightFlagMap = new Map();
        this.mySyncHeightFlagMap.set(PlayerTransformManagerSyncFlag.BODY_COLLIDING, false);
        this.mySyncHeightFlagMap.set(PlayerTransformManagerSyncFlag.HEAD_COLLIDING, false);
        this.mySyncHeightFlagMap.set(PlayerTransformManagerSyncFlag.FAR, false);
        this.mySyncHeightFlagMap.set(PlayerTransformManagerSyncFlag.FLOATING, false);

        this.myIsLeaningValidAboveDistance = false;
        this.myLeaningValidDistance = 0;

        // Settings for both hop and lean
        this.myIsFloatingValidIfVerticalMovement = false;
        this.myIsFloatingValidIfVerticalMovementAndRealOnGround = false; // #TODO This is more an override
        this.myIsFloatingValidIfRealOnGround = false;
        this.myIsFloatingValidIfSteepGround = false;
        this.myIsFloatingValidIfVerticalMovementAndSteepGround = false;

        this.myFloatingSplitCheckEnabled = false;
        this.myFloatingSplitCheckMaxLength = 0;
        this.myFloatingSplitCheckMaxSteps = null;
        this.myFloatingSplitCheckStepEqualLength = false;
        this.myFloatingSplitCheckStepEqualLengthMinLength = 0;

        this.myMaxDistanceFromRealToSyncEnabled = false;
        this.myMaxDistanceFromRealToSync = 0;
        // Max distance to resync valid with head, if you head is further do not resync

        this.myHeadRadius = 0;
        this.myHeadCollisionBlockLayerFlags = new PhysicsLayerFlags();
        this.myHeadCollisionObjectsToIgnore = [];

        this.myRotateOnlyIfSynced = false;
        this.myResetRealResetRotationIfUpChanged = true;

        //this.myDistanceToStartApplyGravityWhenFloating = 0; // This should be moved outisde, that is, if it is floating stop gravity

        // Set valid if head synced (head manager)

        this.myRealMovementAllowVerticalAdjustments = false;
        // This true means that the real movement should also snap on ground or fix the vertical to pop from it
        // You may want this if u want that while real moving u can also climb stairs

        // Real movement apply vertical snap or not (other option to apply gravity) 
        // (gravity inside this class?) only when movement is applied not for head only)

        this.myUpdateRealPositionValid = false;
        this.myUpdatePositionValid = false;

        this.myMinHeight = null;
        this.myMaxHeight = null;

        // These and the callbacks does not makes much sense
        // The colliding things are made to not sync the real position, but if the height is below and the body is not colliding
        // There is not reason not to resync, even if u put the real back on the valid the height will stay the same
        // If someone puts the head in the ground, there is no way for me to resync and make the head pop out sadly
        // In this case u either accept that u can move without seeing, or stop moving until the obscure is on
        this.myIsBodyCollidingWhenHeightBelowValue = null; // Could be removed and added with the custom check callback if u want it
        this.myIsBodyCollidingWhenHeightAboveValue = null;

        this.myIsBodyCollidingExtraCheckCallback = null;      // Signature: callback(transformManager) -> bool
        this.myIsLeaningExtraCheckCallback = null;            // Signature: callback(transformManager) -> bool
        this.myIsHoppingExtraCheckCallback = null;            // Signature: callback(transformManager) -> bool
        this.myIsFarExtraCheckCallback = null;                // Signature: callback(transformManager) -> bool

        this.myResetToValidOnEnterSession = false;
        this.myResetToValidOnExitSession = false;

        this.myAlwaysResetRealPositionNonVR = false;
        this.myAlwaysResetRealRotationNonVR = false;
        this.myAlwaysResetRealHeightNonVR = false;

        this.myAlwaysResetRealPositionVR = false;
        this.myAlwaysResetRealRotationVR = false;
        this.myAlwaysResetRealHeightVR = false;

        this.myNeverResetRealPositionNonVR = false;
        this.myNeverResetRealRotationNonVR = false;
        this.myNeverResetRealHeightNonVR = false;

        this.myNeverResetRealPositionVR = false;
        this.myNeverResetRealRotationVR = false;
        this.myNeverResetRealHeightVR = false;

        this.myResetRealOnMove = false;
        this.myResetRealOnTeleport = false;

        this.mySyncPositionDisabled = false;

        this.myEngine = engine;

        this.myDebugEnabled = false;
    }

    destroy() {
        this._myDestroyed = true;

        XRUtils.unregisterSessionStartEndEventListeners(this, this._myParams.myEngine);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}

export class PlayerTransformManager {

    constructor(params) {
        this._myParams = params;

        this._myRealMovementCollisionCheckParams = null;
        this._generateRealMovementParamsFromMovementParams();

        this._myCollisionRuntimeParams = new CollisionRuntimeParams();
        this._myRealCollisionRuntimeParams = new CollisionRuntimeParams();

        if (this._myParams.myTeleportCollisionCheckParamsCopyFromMovement) {
            this._generateTeleportParamsFromMovementParams();
        }

        this._myHeadCollisionCheckParams = null;
        this._setupHeadCollisionCheckParams();

        this._myValidPosition = vec3_create();
        this._myValidRotationQuat = quat_create();
        this._myValidHeight = 0;
        this._myValidPositionHead = vec3_create();

        this._myIsBodyColliding = false;
        this._myIsHeadColliding = false;
        this._myIsLeaning = false;
        this._myIsHopping = false;
        this._myIsFar = false;

        this._myLastValidMovementDirection = vec3_create();
        this._myIsRealPositionValid = false;
        this._myIsPositionValid = false;

        this._myResetRealOnSynced = false;

        this._myActive = true;
        this._myDestroyed = false;
    }

    start() {
        this.resetToReal(true);

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, false, this._myParams.myEngine);
    }

    getParams() {
        return this._myParams;
    }

    setActive(active) {
        this._myActive = active;
    }

    // update should be before to check the new valid transform and if the head new transform is fine
    // then update movements, so that they will use the proper transform
    // pre/post update?
    // For sliding if previous frame no horizontal movement then reset sliding on pre update
    // In generale capire come fare per risolvere i problemi quando c'è un move solo verticale che sputtana i dati dello sliding precedente
    // che servono per far slidare bene anche dopo, magari un flag per dire non aggiornare le cose relative al movimento orizzontale
    // o un move check solo verticale
    update(dt) {
        // Implemented outside class definition
    }

    move(movement, outCollisionRuntimeParams = null, forceMove = false) {
        // Collision runtime will copy the result, so that u can use that for later reference like if it was sliding
        // Maybe there should be a way to sum all the things happened for proper movement in a summary runtime
        // or maybe the move should be done once per frame, or at least in theory

        // Collision check and move

        // Move should move the valid transform, but also move the player object so that they head, even is colliding is dragged with it
        // Also teleport, should get the difference from previous and move the player object, this will keep the relative position head-to-valid

        // Implemented outside class definition
    }

    teleportPosition(position, outCollisionRuntimeParams = null, forceTeleport = false) {
        // Collision check and teleport, if force teleport teleport in any case
        // Use current valid rotation

        // Implemented outside class definition
    }

    teleportPositionRotationQuat(position, rotationQuat, outCollisionRuntimeParams = null, forceTeleport = false) {
        // Collision check and teleport, if force teleport teleport in any case

        // Implemented outside class definition
    }

    teleportTransformQuat(transformQuat, outCollisionRuntimeParams = null, forceTeleport = false) {
        // Collision check and teleport, if force teleport teleport in any case

        // Implemented outside class definition
    }

    // Quick way to force teleport to a position and reset the real to this
    forceTeleportAndReset(position, rotationQuat) {
        this.teleportPositionRotationQuat(position, rotationQuat, null, true);

        this.resetReal(true, true);
    }

    rotateQuat(rotationQuat) {
        // Implemented outside class definition
    }

    setRotationQuat(rotationQuat) {
        // Implemented outside class definition
    }

    setHeight(height, forceSet = false) {
        // Implemented outside class definition
    }

    getPlayer() {
        return this._myParams.myPlayerHeadManager.getPlayer();
    }

    getHead() {
        return this._myParams.myPlayerHeadManager.getHead();
    }

    getTransformQuat(outTransformQuat = quat2_create()) {
        return outTransformQuat.quat2_setPositionRotationQuat(this.getPosition(this._myValidPosition), this.getRotationQuat(this._myValidRotationQuat));
    }

    getPosition(outPosition = vec3_create()) {
        return outPosition.vec3_copy(this._myValidPosition);
    }

    getRotationQuat(outRotation = quat_create()) {
        return outRotation.quat_copy(this._myValidRotationQuat);
    }

    getPositionHead(outPosition = vec3_create()) {
        return outPosition.vec3_copy(this._myValidPositionHead);
    }

    getTransformHeadQuat(outTransformQuat = quat2_create()) {
        return outTransformQuat.quat2_setPositionRotationQuat(this.getPositionHead(this._myValidPositionHead), this.getRotationQuat(this._myValidRotationQuat));
    }

    getHeight() {
        return this._myValidHeight;
    }

    getTransformRealQuat(outTransformQuat = quat2_create()) {
        return this.getPlayerHeadManager().getTransformFeetQuat(outTransformQuat);
    }

    getTransformHeadRealQuat(outTransformQuat = quat2_create()) {
        return this.getPlayerHeadManager().getTransformHeadQuat(outTransformQuat);
    }

    getPositionReal(outPosition = vec3_create()) {
        return this.getPlayerHeadManager().getPositionFeet(outPosition);
    }

    getPositionHeadReal(outPosition = vec3_create()) {
        return this.getPlayerHeadManager().getPositionHead(outPosition);
    }

    getRotationRealQuat(outRotation = quat_create()) {
        return this.getPlayerHeadManager().getRotationFeetQuat(outRotation);
    }

    getHeightReal() {
        return this._myParams.myPlayerHeadManager.getHeightHead();
    }

    isSynced(syncFlagMap = null) {
        let isBodyColliding = this.isBodyColliding() && (syncFlagMap == null || syncFlagMap.get(PlayerTransformManagerSyncFlag.BODY_COLLIDING));
        let isHeadColliding = this.isHeadColliding() && (syncFlagMap == null || syncFlagMap.get(PlayerTransformManagerSyncFlag.HEAD_COLLIDING));
        let isFar = this.isFar() && (syncFlagMap == null || syncFlagMap.get(PlayerTransformManagerSyncFlag.FAR));
        let isFloating = this.isFloating() && (syncFlagMap == null || syncFlagMap.get(PlayerTransformManagerSyncFlag.FLOATING));
        return !isBodyColliding && !isHeadColliding && !isFar && !isFloating;
    }

    resetReal(resetPosition = true, resetRotation = false, resetHeight = false, resetHeadToReal = true, updateRealFlags = false) {
        // Implemented outside class definition
    }

    updateReal() {
        this._updateReal(0);
    }

    resetToReal(resetToPlayerInsteadOfHead = false, updateRealFlags = false) {
        if (resetToPlayerInsteadOfHead) {
            this._myValidPosition = this.getPlayerHeadManager().getPlayer().pp_getPosition(this._myValidPosition);
        } else {
            this._myValidPosition = this.getPositionReal(this._myValidPosition);
        }

        if (!this._myParams.myAlwaysSyncPositionWithReal) {
            this._myValidPositionHead = this.getPositionHeadReal(this._myValidPositionHead);
        }

        if (resetToPlayerInsteadOfHead) {
            this._myValidRotationQuat = this.getPlayerHeadManager().getPlayer().pp_getRotationQuat(this._myValidRotationQuat);
        } else {
            this._myValidRotationQuat = this.getRotationRealQuat(this._myValidRotationQuat);
        }

        this._myValidHeight = Math.pp_clamp(this.getHeightReal(), this._myParams.myMinHeight, this._myParams.myMaxHeight);

        if (updateRealFlags) {
            this._updateReal(0);
        }
    }

    resetHeadToReal() {
        if (!this._myParams.myAlwaysSyncPositionWithReal) {
            this._myValidPositionHead = this.getPositionHeadReal(this._myValidPositionHead);
        }
    }

    isBodyColliding() {
        return this._myIsBodyColliding;
    }

    isHeadColliding() {
        return this._myIsHeadColliding;
    }

    isFloating() {
        return this.isLeaning() || this.isHopping();
    }

    isLeaning() {
        return this._myIsLeaning;
    }

    isHopping() {
        return this._myIsHopping;
    }

    isFar() {
        return this._myIsFar;
    }

    getDistanceToReal() {
        // Implemented outside class definition
    }

    getDistanceToRealHead() {
        // Implemented outside class definition
    }

    getPlayerHeadManager() {
        return this._myParams.myPlayerHeadManager;
    }

    getMovementCollisionCheckParams() {
        return this._myParams.myMovementCollisionCheckParams;
    }

    getTeleportCollisionCheckParams() {
        return this._myParams.myTeleportCollisionCheckParams;
    }

    collisionCheckParamsUpdated() {
        if (this._myParams.myTeleportCollisionCheckParamsCopyFromMovement) {
            this._generateTeleportParamsFromMovementParams();
        }

        this._generateRealMovementParamsFromMovementParams();
    }

    isPositionValid() {
        return this._myIsPositionValid;
    }

    isRealPositionValid() {
        return this._myIsRealPositionValid;
    }

    getCollisionRuntimeParams() {
        return this._myCollisionRuntimeParams;
    }

    getRealCollisionRuntimeParams() {
        return this._myRealCollisionRuntimeParams;
    }

    _updateCollisionHeight() {
        let validHeight = this.getHeight();
        let realHeight = Math.pp_clamp(this.getHeightReal(), this._myParams.myMinHeight, this._myParams.myMaxHeight);

        this._myParams.myMovementCollisionCheckParams.myHeight = validHeight;
        this._myParams.myTeleportCollisionCheckParams.myHeight = validHeight;

        this._myRealMovementCollisionCheckParams.myHeight = realHeight;
    }

    _setupHeadCollisionCheckParams() {
        this._myHeadCollisionCheckParams = new CollisionCheckParams();
        let params = this._myHeadCollisionCheckParams;

        params.myRadius = this._myParams.myHeadRadius;
        params.myDistanceFromFeetToIgnore = 0;
        params.myDistanceFromHeadToIgnore = 0;

        params.mySplitMovementEnabled = true;
        params.mySplitMovementMaxLength = 0.5;
        params.mySplitMovementMaxStepsEnabled = true;
        params.mySplitMovementMaxSteps = 2;
        params.mySplitMovementStopWhenHorizontalMovementCanceled = true;
        params.mySplitMovementStopWhenVerticalMovementCanceled = true;

        params.myHorizontalMovementCheckEnabled = true;
        params.myHorizontalMovementRadialStepAmount = 1;
        params.myHorizontalMovementCheckDiagonalOutward = true;
        params.myHorizontalMovementCheckDiagonalInward = true;
        params.myHorizontalMovementCheckVerticalDiagonalUpwardOutward = true;
        params.myHorizontalMovementCheckVerticalDiagonalUpwardInward = true;

        params.myHorizontalPositionCheckEnabled = true;
        params.myHalfConeAngle = 180;
        params.myHalfConeSliceAmount = 3;
        params.myCheckConeBorder = true;
        params.myCheckConeRay = true;
        params.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision = false;
        params.myHorizontalPositionCheckVerticalDirectionType = 0;

        params.myHeight = params.myRadius; // On purpose the height "radius" is half, to avoid hitting before with head than body collision (through height)
        params.myPositionOffsetLocal.vec3_set(0, -params.myRadius / 2, 0);

        params.myCheckHeight = true;
        params.myCheckHeightVerticalMovement = true;
        params.myCheckHeightVerticalPosition = true;
        params.myHeightCheckStepAmountMovement = 2;
        params.myHeightCheckStepAmountPosition = 2;
        params.myCheckHeightTopMovement = true;
        params.myCheckHeightTopPosition = true;
        params.myCheckVerticalStraight = true;

        params.myCheckVerticalFixedForwardEnabled = true;
        params.myCheckVerticalFixedForward = vec3_create(0, 0, 1);

        params.myCheckHorizontalFixedForwardEnabled = true;
        params.myCheckHorizontalFixedForward = vec3_create(0, 0, 1);

        params.myVerticalMovementCheckEnabled = true;
        params.myVerticalPositionCheckEnabled = true;

        params.myGroundCircumferenceAddCenter = true;
        params.myGroundCircumferenceSliceAmount = 6;
        params.myGroundCircumferenceStepAmount = 2;
        params.myGroundCircumferenceRotationPerStep = 30;
        params.myFeetRadius = params.myRadius;

        params.myHorizontalBlockLayerFlags.copy(this._myParams.myHeadCollisionBlockLayerFlags);
        params.myHorizontalObjectsToIgnore.pp_copy(this._myParams.myHeadCollisionObjectsToIgnore);
        params.myVerticalBlockLayerFlags.copy(this._myParams.myHeadCollisionBlockLayerFlags);
        params.myVerticalObjectsToIgnore.pp_copy(this._myParams.myHeadCollisionObjectsToIgnore);

        params.myDebugEnabled = false;

        params.myDebugHorizontalMovementEnabled = true;
        params.myDebugHorizontalPositionEnabled = false;
        params.myDebugVerticalMovementEnabled = false;
        params.myDebugVerticalPositionEnabled = false;
        params.myDebugSlidingEnabled = false;
        params.myDebugGroundInfoEnabled = false;
        params.myDebugCeilingInfoEnabled = false;
        params.myDebugRuntimeParamsEnabled = false;
        params.myDebugMovementEnabled = false;
    }

    _generateTeleportParamsFromMovementParams() {
        if (this._myParams.myTeleportCollisionCheckParams == null) {
            this._myParams.myTeleportCollisionCheckParams = new CollisionCheckParams();
        }

        if (this._myParams.myTeleportCollisionCheckParamsCheck360) {
            this._myParams.myTeleportCollisionCheckParams = CollisionCheckUtils.generate360TeleportParamsFromMovementParams(this._myParams.myMovementCollisionCheckParams, this._myParams.myTeleportCollisionCheckParams);
        } else {
            this._myParams.myTeleportCollisionCheckParams.copy(this._myParams.myMovementCollisionCheckParams);
        }
    }

    _generateRealMovementParamsFromMovementParams() {
        if (this._myRealMovementCollisionCheckParams == null) {
            this._myRealMovementCollisionCheckParams = new CollisionCheckParams();
        }

        let params = this._myRealMovementCollisionCheckParams;
        params.copy(this._myParams.myMovementCollisionCheckParams);

        params.mySplitMovementEnabled = true;
        params.mySplitMovementMaxLength = 0.5;
        params.mySplitMovementMaxStepsEnabled = true;
        params.mySplitMovementMaxSteps = 2;
        params.mySplitMovementStopWhenHorizontalMovementCanceled = true;
        params.mySplitMovementStopWhenVerticalMovementCanceled = true;

        params.mySlidingEnabled = false;

        if (!this._myParams.myRealMovementAllowVerticalAdjustments) {
            params.mySnapOnGroundEnabled = false;
            params.mySnapOnCeilingEnabled = false;
            params.myGroundPopOutEnabled = false;
            params.myCeilingPopOutEnabled = false;
            params.myAdjustVerticalMovementWithGroundAngleDownhill = false;
            params.myAdjustVerticalMovementWithGroundAngleUphill = false;
            params.myAdjustVerticalMovementWithCeilingAngleDownhill = false;
            params.myAdjustVerticalMovementWithCeilingAngleUphill = false;
            params.myAdjustHorizontalMovementWithGroundAngleDownhill = false;
            params.myAdjustHorizontalMovementWithCeilingAngleDownhill = false;
            params.myVerticalMovementReduceEnabled = false;
        }

        //params.myHorizontalMovementGroundAngleIgnoreHeight = 0.1 * 3;
        //params.myHorizontalMovementCeilingAngleIgnoreHeight = 0.1 * 3;

        params.myIsOnGroundIfInsideHit = true;

        params.myDebugEnabled = false;

        params.myDebugHorizontalMovementEnabled = false;
        params.myDebugHorizontalPositionEnabled = false;
        params.myDebugVerticalMovementEnabled = false;
        params.myDebugVerticalPositionEnabled = false;
        params.myDebugSlidingEnabled = false;
        params.myDebugGroundInfoEnabled = true;
        params.myDebugCeilingInfoEnabled = true;
        params.myDebugRuntimeParamsEnabled = false;
        params.myDebugMovementEnabled = false;
    }

    _onXRSessionStart(session) {
        if (this._myActive) {
            if (this._myParams.myResetToValidOnEnterSession) {
                this._myResetRealOnSynced = true;
            }
        }
    }

    _onXRSessionEnd() {
        if (this._myActive) {
            if (this._myParams.myResetToValidOnExitSession) {
                this._myResetRealOnSynced = true;
            }
        }
    }

    _debugUpdate(dt) {
        Globals.getDebugVisualManager(this._myParams.myEngine).drawPoint(0, this._myValidPosition, vec4_create(1, 0, 0, 1), 0.05);
        Globals.getDebugVisualManager(this._myParams.myEngine).drawLineEnd(0, this._myValidPosition, this.getPositionReal(), vec4_create(1, 0, 0, 1), 0.05);
        Globals.getDebugVisualManager(this._myParams.myEngine).drawLine(0, this._myValidPosition, this._myValidRotationQuat.quat_getForward(), 0.15, vec4_create(0, 1, 0, 1), 0.025);

        Globals.getDebugVisualManager(this._myParams.myEngine).drawPoint(0, this._myValidPositionHead, vec4_create(1, 1, 0, 1), 0.05);
    }

    destroy() {
        this._myDestroyed = true;

        XRUtils.unregisterSessionStartEndEventListeners(this, this._myParams.myEngine);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

PlayerTransformManager.prototype.getDistanceToReal = function () {
    let position = vec3_create();
    let realPosition = vec3_create();
    return function getDistanceToReal() {
        realPosition = this.getPositionReal(realPosition);
        return realPosition.vec3_distance(this.getPosition(position));
    };
}();

PlayerTransformManager.prototype.getDistanceToRealHead = function () {
    let position = vec3_create();
    let realPosition = vec3_create();
    return function getDistanceToRealHead() {
        realPosition = this.getPositionHeadReal(realPosition);
        return realPosition.vec3_distance(this.getPositionHead(position));
    };
}();

PlayerTransformManager.prototype.resetReal = function () {
    let realUp = vec3_create();
    let validUp = vec3_create();
    let position = vec3_create();
    let rotationQuat = quat_create();
    return function resetReal(resetPosition = true, resetRotation = false, resetHeight = false, resetHeadToReal = true, updateRealFlags = false) {
        let playerHeadManager = this.getPlayerHeadManager();

        if (resetPosition) {
            playerHeadManager.teleportPositionFeet(this.getPosition(position));
        }

        realUp = this.getPlayerHeadManager().getRotationFeetQuat(rotationQuat).quat_getUp(realUp);
        validUp = this.getRotationQuat(rotationQuat).quat_getUp(validUp);

        if (resetRotation || (realUp.vec3_angle(validUp) > Math.PP_EPSILON_DEGREES && this._myParams.myResetRealResetRotationIfUpChanged)) {
            playerHeadManager.setRotationFeetQuat(this.getRotationQuat(rotationQuat), false);
        }

        if (resetHeight) {
            playerHeadManager.setHeightHead(this.getHeight(), true);
        }

        if (updateRealFlags) {
            this._updateReal(0);
        }

        if (resetHeadToReal) {
            this.resetHeadToReal();
        }
    };
}();

PlayerTransformManager.prototype.update = function () {
    let transformQuat = quat2_create();
    let collisionRuntimeParams = new CollisionRuntimeParams();
    let transformUp = vec3_create();
    let horizontalDirection = vec3_create();
    let rotationQuat = quat_create();
    return function update(dt) {
        // #TODO This should update ground and ceiling info but not sliding info        

        this._updateReal(dt);

        if (this._myResetRealOnSynced) {
            if (this.getPlayerHeadManager().isSynced()) {
                this._myResetRealOnSynced = false;
                if (XRUtils.isSessionActive(this._myParams.myEngine)) {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionVR,
                        !this._myParams.myNeverResetRealRotationVR,
                        !this._myParams.myNeverResetRealHeightVR,
                        true,
                        true);
                } else {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionNonVR,
                        !this._myParams.myNeverResetRealRotationNonVR,
                        !this._myParams.myNeverResetRealHeightNonVR,
                        true,
                        true);
                }
            }
        }

        if (this._myParams.myUpdatePositionValid) {
            transformQuat = this.getTransformQuat(transformQuat);
            transformUp = transformQuat.quat2_getUp(transformUp);
            rotationQuat = transformQuat.quat2_getRotationQuat(rotationQuat);
            horizontalDirection = this._myLastValidMovementDirection.vec3_removeComponentAlongAxis(transformUp, horizontalDirection);
            if (!horizontalDirection.vec3_isZero(0.00001)) {
                horizontalDirection.vec3_normalize(horizontalDirection);
                rotationQuat.quat_setForward(horizontalDirection);
                transformQuat.quat2_setRotationQuat(rotationQuat);
            }
            let debugBackup = this._myParams.myMovementCollisionCheckParams.myDebugEnabled;
            this._myParams.myMovementCollisionCheckParams.myDebugEnabled = false;
            CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine).positionCheck(true, transformQuat, this._myParams.myMovementCollisionCheckParams, collisionRuntimeParams);
            this._myParams.myMovementCollisionCheckParams.myDebugEnabled = debugBackup;
            this._myIsPositionValid = collisionRuntimeParams.myIsPositionOk;
        }

        if (this._myParams.myDebugEnabled && Globals.isDebugEnabled(this._myParams.myEngine)) {
            this._debugUpdate(dt);
        }
    };
}();

PlayerTransformManager.prototype._updateReal = function () {
    let movementToCheck = vec3_create();
    let position = vec3_create();
    let positionReal = vec3_create();
    let transformQuat = quat2_create();
    let collisionRuntimeParams = new CollisionRuntimeParams();

    let newPosition = vec3_create();
    let newPositionHead = vec3_create();
    let movementStep = vec3_create();
    let currentMovementStep = vec3_create();
    let transformUp = vec3_create();
    let verticalMovement = vec3_create();
    let movementChecked = vec3_create();
    let newFeetPosition = vec3_create();
    let floatingTransformQuat = quat2_create();
    let horizontalDirection = vec3_create();
    let rotationQuat = quat_create();
    return function _updateReal(dt) {
        // Check if new head is ok and update the data
        // If head is not synced (blurred or session changing) avoid this and keep last valid
        if (this.getPlayerHeadManager().isSynced()) {
            this._updateCollisionHeight();

            this._myIsBodyColliding = false;
            this._myIsHeadColliding = false;
            this._myIsLeaning = false;
            this._myIsHopping = false;
            this._myIsFar = false;

            movementToCheck = this.getPositionReal(positionReal).vec3_sub(this.getPosition(position), movementToCheck);
            if (movementToCheck.vec3_length() > 0.0001) {
                this._myLastValidMovementDirection = movementToCheck.vec3_normalize(this._myLastValidMovementDirection);
            }

            // Far
            if (this._myParams.mySyncEnabledFlagMap.get(PlayerTransformManagerSyncFlag.FAR)) {
                if (this._myParams.myMaxDistanceFromRealToSyncEnabled && movementToCheck.vec3_length() > this._myParams.myMaxDistanceFromRealToSync) {
                    this._myIsFar = true;
                } else if (this._myParams.myIsFarExtraCheckCallback != null && this._myParams.myIsFarExtraCheckCallback(this)) {
                    this._myIsFar = true;
                }
            }

            // Body Colliding
            collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
            collisionRuntimeParams.myIsOnGround = true; // #TODO Temp as long as surface infos are not actually updated
            transformQuat = this.getTransformQuat(transformQuat);
            newPosition.vec3_copy(this._myValidPosition);
            if (this._myParams.mySyncEnabledFlagMap.get(PlayerTransformManagerSyncFlag.BODY_COLLIDING)) {
                CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine).move(movementToCheck, transformQuat, this._myRealMovementCollisionCheckParams, collisionRuntimeParams);

                if (!collisionRuntimeParams.myHorizontalMovementCanceled && !collisionRuntimeParams.myVerticalMovementCanceled) {
                    if (Math.pp_clamp(this._myRealMovementCollisionCheckParams.myHeight, this._myParams.myIsBodyCollidingWhenHeightBelowValue,
                        this._myParams.myIsBodyCollidingWhenHeightAboveValue) != this._myRealMovementCollisionCheckParams.myHeight) {
                        this._myIsBodyColliding = true;
                    } else {
                        if (this._myParams.myIsBodyCollidingExtraCheckCallback != null && this._myParams.myIsBodyCollidingExtraCheckCallback(this)) {
                            this._myIsBodyColliding = true;
                        } else {
                            this._myIsBodyColliding = false;
                            newPosition.vec3_copy(collisionRuntimeParams.myNewPosition);
                        }
                    }
                } else {
                    this._myIsBodyColliding = true;
                }
            }

            if (this._myParams.myAlwaysSyncPositionWithReal) {
                newPosition.vec3_copy(positionReal);
            }

            // Floating 
            if (this._myParams.mySyncEnabledFlagMap.get(PlayerTransformManagerSyncFlag.FLOATING)) {

                if (!this._myIsBodyColliding) {
                    movementToCheck = newPosition.vec3_sub(position, movementToCheck);
                } else {
                    movementToCheck = positionReal.vec3_sub(position, movementToCheck);
                }

                collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
                floatingTransformQuat.quat2_setPositionRotationQuat(this._myValidPosition, this._myValidRotationQuat);
                CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine).updateSurfaceInfo(floatingTransformQuat, this._myRealMovementCollisionCheckParams, collisionRuntimeParams);
                // #TODO Utilizzare on ground del body gia calcolato, ma ora non c'è quindi va bene così

                if (collisionRuntimeParams.myIsOnGround) {
                    transformUp = transformQuat.quat2_getUp(transformUp);
                    verticalMovement = movementToCheck.vec3_componentAlongAxis(transformUp, verticalMovement);
                    let isVertical = !verticalMovement.vec3_isZero(0.00001);
                    if (!isVertical || !this._myParams.myIsFloatingValidIfVerticalMovement) {
                        let movementStepAmount = 1;
                        movementStep.vec3_copy(movementToCheck);
                        if (!movementToCheck.vec3_isZero(0.00001) && this._myParams.myFloatingSplitCheckEnabled) {
                            let equalStepLength = movementToCheck.vec3_length() / this._myParams.myFloatingSplitCheckMaxSteps;
                            if (!this._myParams.myFloatingSplitCheckStepEqualLength || equalStepLength < this._myParams.myFloatingSplitCheckStepEqualLengthMinLength) {
                                let maxLength = this._myParams.myFloatingSplitCheckStepEqualLength ? this._myParams.myFloatingSplitCheckStepEqualLengthMinLength : this._myParams.myFloatingSplitCheckMaxLength;
                                movementStepAmount = Math.ceil(movementToCheck.vec3_length() / maxLength);
                                if (movementStepAmount > 1) {
                                    movementStep = movementStep.vec3_normalize(movementStep).vec3_scale(maxLength, movementStep);
                                    movementStepAmount = (this._myParams.myFloatingSplitCheckMaxSteps != null) ? Math.min(movementStepAmount, this._myParams.myFloatingSplitCheckMaxSteps) : movementStepAmount;
                                }

                                movementStepAmount = Math.max(1, movementStepAmount);

                                if (movementStepAmount == 1) {
                                    movementStep.vec3_copy(movementToCheck);
                                }
                            } else {
                                movementStepAmount = this._myParams.myFloatingSplitCheckMaxSteps;
                                if (movementStepAmount > 1) {
                                    movementStep = movementStep.vec3_normalize(movementStep).vec3_scale(equalStepLength, movementStep);
                                }
                            }
                        }

                        let isOnValidGroundAngle = collisionRuntimeParams.myGroundAngle <= this._myRealMovementCollisionCheckParams.myGroundAngleToIgnore + 0.0001;

                        movementChecked.vec3_zero();
                        newFeetPosition.vec3_copy(this._myValidPosition);
                        collisionRuntimeParams.copy(this._myCollisionRuntimeParams);

                        let atLeastOneNotOnGround = false;
                        let isOneOnGroundBetweenNoGround = false;
                        let isLastOnGround = false;
                        let isOneOnSteepGround = false;

                        for (let i = 0; i < movementStepAmount; i++) {
                            if (movementStepAmount == 1 || i != movementStepAmount - 1) {
                                currentMovementStep.vec3_copy(movementStep);
                            } else {
                                currentMovementStep = movementToCheck.vec3_sub(movementChecked, currentMovementStep);
                            }

                            newFeetPosition = newFeetPosition.vec3_add(currentMovementStep, newFeetPosition);
                            floatingTransformQuat.quat2_setPositionRotationQuat(newFeetPosition, this._myValidRotationQuat);
                            collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
                            CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine).updateSurfaceInfo(floatingTransformQuat, this._myRealMovementCollisionCheckParams, collisionRuntimeParams);
                            movementChecked = movementChecked.vec3_add(currentMovementStep, movementChecked);

                            if (!collisionRuntimeParams.myIsOnGround) {
                                atLeastOneNotOnGround = true;
                            } else {
                                if (collisionRuntimeParams.myGroundAngle > this._myRealMovementCollisionCheckParams.myGroundAngleToIgnore + 0.0001) {
                                    isOneOnSteepGround = true;
                                }

                                if (atLeastOneNotOnGround) {
                                    isOneOnGroundBetweenNoGround = true;
                                }

                                if (i == movementStepAmount - 1) {
                                    isLastOnGround = true;
                                }
                            }
                        }

                        let isFloatingOnSteepGroundFail = isOneOnSteepGround && isOnValidGroundAngle &&
                            !this._myParams.myIsFloatingValidIfSteepGround && (!isVertical || !this._myParams.myIsFloatingValidIfVerticalMovementAndSteepGround);
                        if (atLeastOneNotOnGround || isFloatingOnSteepGroundFail) {
                            if (isOneOnGroundBetweenNoGround) {
                                this._myIsHopping = true;
                            } else {
                                this._myIsLeaning = true;
                            }
                        } else {
                            this._myIsLeaning = false;
                            this._myIsHopping = false;

                            if (this._myParams.myIsLeaningExtraCheckCallback != null && this._myParams.myIsLeaningExtraCheckCallback(this)) {
                                this._myIsLeaning = true;
                            } else if (this._myParams.myIsHoppingExtraCheckCallback != null && this._myParams.myIsHoppingExtraCheckCallback(this)) {
                                this._myIsHopping = true;
                            }
                        }

                        if (this._myIsLeaning) {
                            let distance = movementToCheck.vec3_length();
                            if (this._myParams.myIsLeaningValidAboveDistance && distance > this._myParams.myLeaningValidDistance) {
                                this._myIsLeaning = false;
                            }
                        }

                        if (this._myIsLeaning || this._myIsHopping) {
                            if (isLastOnGround && this._myParams.myIsFloatingValidIfRealOnGround) {
                                this._myIsLeaning = false;
                                this._myIsHopping = false;
                            } else if (isLastOnGround && isVertical && this._myParams.myIsFloatingValidIfVerticalMovementAndRealOnGround) {
                                this._myIsLeaning = false;
                                this._myIsHopping = false;
                            }
                        }
                    }
                }
            }

            // Head Colliding
            movementToCheck = this.getPositionHeadReal(positionReal).vec3_sub(this.getPositionHead(position), movementToCheck);
            collisionRuntimeParams.reset();
            transformQuat = this.getTransformHeadQuat(transformQuat); // Get eyes transform
            newPositionHead.vec3_copy(this._myValidPositionHead);
            if (this._myParams.mySyncEnabledFlagMap.get(PlayerTransformManagerSyncFlag.HEAD_COLLIDING)) {
                CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine).move(movementToCheck, transformQuat, this._myHeadCollisionCheckParams, collisionRuntimeParams);

                if (!collisionRuntimeParams.myHorizontalMovementCanceled && !collisionRuntimeParams.myVerticalMovementCanceled) {
                    this._myIsHeadColliding = false;
                    newPositionHead.vec3_copy(collisionRuntimeParams.myNewPosition);
                } else {
                    this._myIsHeadColliding = true;
                }
            }

            if (this._myParams.myAlwaysSyncHeadPositionWithReal) {
                newPositionHead.vec3_copy(positionReal);
            }

            if ((this.isSynced(this._myParams.mySyncPositionFlagMap) || this._myParams.myAlwaysSyncPositionWithReal) && !this._myParams.mySyncPositionDisabled) {
                this._myValidPosition.vec3_copy(newPosition);
                // Reset real position dato che la posizione new potrebbe essere quella influenzata da snap
            }

            if (this.isSynced(this._myParams.mySyncPositionHeadFlagMap) || this._myParams.myAlwaysSyncHeadPositionWithReal
                || (this.isSynced(this._myParams.mySyncPositionFlagMap) && this._myParams.myAlwaysSyncPositionWithReal)) {
                this._myValidPositionHead = this.getPositionHeadReal(newPositionHead);
            }

            if (this.isSynced(this._myParams.mySyncRotationFlagMap)) {
                this._myValidRotationQuat = this.getRotationRealQuat(this._myValidRotationQuat);
            }

            if (this.isSynced(this._myParams.mySyncHeightFlagMap)) {
                this._myValidHeight = this._myRealMovementCollisionCheckParams.myHeight;
                this._updateCollisionHeight();
            }

            if (this._myParams.myUpdateRealPositionValid) {
                transformQuat = this.getTransformRealQuat(transformQuat);
                transformUp = transformQuat.quat2_getUp(transformUp);
                rotationQuat = transformQuat.quat2_getRotationQuat(rotationQuat);
                horizontalDirection = this._myLastValidMovementDirection.vec3_removeComponentAlongAxis(transformUp, horizontalDirection);
                if (!horizontalDirection.vec3_isZero(0.00001)) {
                    horizontalDirection.vec3_normalize(horizontalDirection);
                    rotationQuat.quat_setForward(horizontalDirection);
                    transformQuat.quat2_setRotationQuat(rotationQuat);
                }

                let debugBackup = this._myParams.myMovementCollisionCheckParams.myDebugEnabled;
                this._myParams.myMovementCollisionCheckParams.myDebugEnabled = false;
                CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine).positionCheck(true, transformQuat, this._myParams.myMovementCollisionCheckParams, this._myRealCollisionRuntimeParams);
                this._myIsRealPositionValid = this._myRealCollisionRuntimeParams.myIsPositionOk;
                this._myParams.myMovementCollisionCheckParams.myDebugEnabled = debugBackup;
            }
        }
    };
}();

PlayerTransformManager.prototype.move = function () {
    let transformQuat = quat2_create();
    let fixedMovement = vec3_create();
    return function move(movement, outCollisionRuntimeParams = null, forceMove = false) {
        transformQuat = this.getTransformQuat(transformQuat);

        CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine).move(movement, transformQuat, this._myParams.myMovementCollisionCheckParams, this._myCollisionRuntimeParams);
        if (outCollisionRuntimeParams != null) {
            outCollisionRuntimeParams.copy(this._myCollisionRuntimeParams);
        }

        if (!forceMove) {
            fixedMovement.vec3_copy(this._myCollisionRuntimeParams.myFixedMovement);
        } else {
            fixedMovement.vec3_copy(movement);
        }

        if (!fixedMovement.vec3_isZero(0.00001)) {
            this._myValidPosition.vec3_add(fixedMovement, this._myValidPosition);
            this.getPlayerHeadManager().moveFeet(fixedMovement);
        }

        // This make reset happens even for gravity, maybe u should do it manually
        if (this._myParams.myResetRealOnMove) {
            if (!this.isSynced()) {
                if (XRUtils.isSessionActive(this._myParams.myEngine)) {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionVR,
                        !this._myParams.myNeverResetRealRotationVR,
                        !this._myParams.myNeverResetRealHeightVR,
                        true);
                } else {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionNonVR,
                        !this._myParams.myNeverResetRealRotationNonVR,
                        !this._myParams.myNeverResetRealHeightNonVR,
                        true);
                }
            }
        }

        // #TODO Add move callback
    };
}();

PlayerTransformManager.prototype.teleportPosition = function () {
    let teleportTransformQuat = quat2_create();
    return function teleportPosition(teleportPosition, outCollisionRuntimeParams = null, forceTeleport = false) {
        teleportTransformQuat = this.getTransformQuat(teleportTransformQuat);
        teleportTransformQuat.quat2_setPosition(teleportPosition);
        this.teleportTransformQuat(teleportTransformQuat, outCollisionRuntimeParams, forceTeleport);
    };
}();

PlayerTransformManager.prototype.teleportPositionRotationQuat = function () {
    let teleportTransformQuat = quat2_create();
    return function teleportPositionRotationQuat(teleportPosition, teleportRotationQuat, outCollisionRuntimeParams = null, forceTeleport = false) {
        teleportTransformQuat = this.getTransformQuat(teleportTransformQuat);
        teleportTransformQuat.quat2_setPositionRotationQuat(teleportPosition, teleportRotationQuat);
        this.teleportTransformQuat(teleportTransformQuat, outCollisionRuntimeParams, forceTeleport);
    };
}();

PlayerTransformManager.prototype.teleportTransformQuat = function () {
    let currentPosition = vec3_create();
    let teleportPositionVec = vec3_create();
    let teleportRotation = quat_create();
    let rotatedTransformQuat = quat2_create();
    let fixedMovement = vec3_create();
    return function teleportTransformQuat(teleportTransformQuat, outCollisionRuntimeParams = null, forceTeleport = false) {
        currentPosition = this.getPosition(currentPosition);
        teleportPositionVec = teleportTransformQuat.quat2_getPosition(teleportPositionVec);
        teleportRotation = teleportTransformQuat.quat2_getRotationQuat(teleportRotation);

        rotatedTransformQuat.quat2_setPositionRotationQuat(currentPosition, teleportRotation);

        CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine).teleport(teleportPositionVec, rotatedTransformQuat, this._myParams.myTeleportCollisionCheckParams, this._myCollisionRuntimeParams);
        if (outCollisionRuntimeParams != null) {
            outCollisionRuntimeParams.copy(this._myCollisionRuntimeParams);
        }

        fixedMovement.vec3_zero();
        if (!forceTeleport) {
            if (!this._myCollisionRuntimeParams.myTeleportCanceled) {
                fixedMovement = this._myCollisionRuntimeParams.myFixedTeleportPosition.vec3_sub(currentPosition, fixedMovement);
            }
        } else {
            fixedMovement = teleportPositionVec.vec3_sub(currentPosition, fixedMovement);
        }

        if (!this._myCollisionRuntimeParams.myTeleportCanceled || forceTeleport) {
            this._myValidRotationQuat.quat_copy(teleportRotation);
            this.getPlayerHeadManager().setRotationFeetQuat(teleportRotation);
        }

        if (!fixedMovement.vec3_isZero(0.00001)) {
            this._myValidPosition.vec3_add(fixedMovement, this._myValidPosition);
            this.getPlayerHeadManager().moveFeet(fixedMovement);
        }

        if (this._myParams.myResetRealOnTeleport) {
            if (!this.isSynced()) {
                if (XRUtils.isSessionActive(this._myParams.myEngine)) {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionVR,
                        !this._myParams.myNeverResetRealRotationVR,
                        !this._myParams.myNeverResetRealHeightVR,
                        true);
                } else {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionNonVR,
                        !this._myParams.myNeverResetRealRotationNonVR,
                        !this._myParams.myNeverResetRealHeightNonVR,
                        true);
                }
            }
        }

        // #TODO Add teleport callback
    };
}();

PlayerTransformManager.prototype.rotateQuat = function () {
    return function rotateQuat(rotationQuat) {
        this._myValidRotationQuat.quat_rotateQuat(rotationQuat, this._myValidRotationQuat);
        this.getPlayerHeadManager().rotateFeetQuat(rotationQuat);
    };
}();

PlayerTransformManager.prototype.setRotationQuat = function () {
    let rotationToPerform = quat_create();
    return function setRotationQuat(rotationQuat) {
        rotationToPerform = this._myValidRotationQuat.quat_rotationToQuat(rotationQuat, rotationToPerform);
        this.rotateQuat(rotationToPerform);
    };
}();

PlayerTransformManager.prototype.setHeight = function () {
    let transformQuat = quat2_create();
    return function setHeight(height, forceSet = false) {
        let fixedHeight = Math.pp_clamp(height, this._myParams.myMinHeight, this._myParams.myMaxHeight);
        let previousHeight = this.getHeight();

        this._myValidHeight = fixedHeight;
        this._updateCollisionHeight();

        transformQuat = this.getTransformQuat(transformQuat);

        CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine).positionCheck(true, transformQuat, this._myParams.myMovementCollisionCheckParams, this._myCollisionRuntimeParams);

        if (this._myCollisionRuntimeParams.myIsPositionOk || forceSet) {
            this.getPlayerHeadManager().setHeightHead(this.getHeight(), true);
        } else {
            this._myValidHeight = previousHeight;
        }

        this._updateCollisionHeight();
    };
}();

// #TODO Sliding info, surface info, update
PP.CleanedPlayerTransformManager = class CleanedPlayerTransformManager {
    constructor(params) {
        this._myParams = params;

        this._myRealMovementCollisionCheckParams = null;
        this._generateRealMovementParamsFromMovementParams();

        this._myCollisionRuntimeParams = new PP.CollisionRuntimeParams();
        this._myRealCollisionRuntimeParams = new PP.CollisionRuntimeParams();

        if (this._myParams.myTeleportCollisionCheckParamsCopyFromMovement) {
            this._generateTeleportParamsFromMovementParams();
        }

        this._myHeadCollisionCheckParams = null;
        this._setupHeadCollisionCheckParams();

        this._myValidPosition = PP.vec3_create();
        this._myValidRotationQuat = new PP.quat_create();
        this._myValidHeight = 0;
        this._myValidPositionHead = PP.vec3_create();

        this._myIsBodyColliding = false;
        this._myIsHeadColliding = false;
        this._myIsLeaning = false;
        this._myIsHopping = false;
        this._myIsFar = false;

        this._myLastValidMovementDirection = PP.vec3_create();
        this._myIsRealPositionValid = false;
        this._myIsPositionValid = false;

        this._myResetRealOnSynced = false;

        this._myActive = true;
    }

    start() {
        this.resetToReal(true);

        if (WL.xrSession) {
            this._onXRSessionStart(true, WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this, false));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    }

    setActive(active) {
        this._myActive = active;
    }

    // update should be before to check the new valid transform and if the head new transform is fine
    // then update movements, so that they will use the proper transform
    // pre/post update?
    // for sliding if previous frame no horizontal movement then reset sliding on pre update
    // in generale capire come fare per risolvere i problemi quando c'è un move solo verticale che sputtana i dati dello sliding precedente
    // che servono per far slidare bene anche dopo, magari un flag per dire non aggiornare le cose relative al movimento orizzontale
    // o un move check solo verticale
    update(dt) {
        // implemented outside class definition
    }

    move(movement, outCollisionRuntimeParams = null, forceMove = false) {
        // collision runtime will copy the result, so that u can use that for later reference like if it was sliding
        // maybe there should be a way to sum all the things happened for proper movement in a summary runtime
        // or maybe the move should be done once per frame, or at least in theory

        // collision check and move

        // move should move the valid transform, but also move the player object so that they head, even is colliding is dragged with it
        // also teleport, should get the difference from previous and move the player object, this will keep the relative position head-to-valid

        // implemented outside class definition
    }

    teleportPosition(position, outCollisionRuntimeParams = null, forceTeleport = false) {
        // collision check and teleport, if force teleport teleport in any case
        // use current valid rotation

        // implemented outside class definition
    }

    teleportTransformQuat(transformQuat, outCollisionRuntimeParams = null, forceTeleport = false) {
        // collision check and teleport, if force teleport teleport in any case

        // implemented outside class definition
    }

    rotateQuat(rotationQuat) {
        // implemented outside class definition
    }

    setRotationQuat(rotationQuat) {
        // implemented outside class definition
    }

    setHeight(height, forceSet = false) {
        // implemented outside class definition
    }

    getPlayer() {
        return this._myParams.myPlayerHeadManager.getPlayer();
    }

    getHead() {
        return this._myParams.myPlayerHeadManager.getHead();
    }

    getTransformQuat(outTransformQuat = PP.quat2_create()) {
        return outTransformQuat.quat2_setPositionRotationQuat(this.getPosition(this._myValidPosition), this.getRotationQuat(this._myValidRotationQuat));
    }

    getPosition(outPosition = PP.vec3_create()) {
        return outPosition.vec3_copy(this._myValidPosition);
    }

    getRotationQuat(outRotation = PP.quat_create()) {
        return outRotation.quat_copy(this._myValidRotationQuat);
    }

    getPositionHead(outPosition = PP.vec3_create()) {
        return outPosition.vec3_copy(this._myValidPositionHead);
    }

    getTransformHeadQuat(outTransformQuat = PP.quat2_create()) {
        return outTransformQuat.quat2_setPositionRotationQuat(this.getPositionHead(this._myValidPositionHead), this.getRotationQuat(this._myValidRotationQuat));
    }

    getHeight() {
        return this._myValidHeight;
    }

    getTransformRealQuat(outTransformQuat = PP.quat2_create()) {
        return this.getPlayerHeadManager().getTransformFeetQuat(outTransformQuat);
    }

    getTransformHeadRealQuat(outTransformQuat = PP.quat2_create()) {
        return this.getPlayerHeadManager().getTransformHeadQuat(outTransformQuat);
    }

    getPositionReal(outPosition = PP.vec3_create()) {
        return this.getPlayerHeadManager().getPositionFeet(outPosition);
    }

    getPositionHeadReal(outPosition = PP.vec3_create()) {
        return this.getPlayerHeadManager().getPositionHead(outPosition);
    }

    getRotationRealQuat(outRotation = PP.quat_create()) {
        return this.getPlayerHeadManager().getRotationFeetQuat(outRotation);
    }

    getHeightReal() {
        return this._myParams.myPlayerHeadManager.getHeightHead();
    }

    isSynced(syncFlagMap = null) {
        let isBodyColliding = this.isBodyColliding() && (syncFlagMap == null || syncFlagMap.get(PP.PlayerTransformManagerSyncFlag.BODY_COLLIDING));
        let isHeadColliding = this.isHeadColliding() && (syncFlagMap == null || syncFlagMap.get(PP.PlayerTransformManagerSyncFlag.HEAD_COLLIDING));
        let isFar = this.isFar() && (syncFlagMap == null || syncFlagMap.get(PP.PlayerTransformManagerSyncFlag.FAR));
        let isFloating = this.isFloating() && (syncFlagMap == null || syncFlagMap.get(PP.PlayerTransformManagerSyncFlag.FLOATING));
        return !isBodyColliding && !isHeadColliding && !isFar && !isFloating;
    }

    resetReal(resetPosition = true, resetRotation = true, resetHeight = true, updateRealFlags = false) {
        // implemented outside class definition
    }

    updateReal() {
        this._updateReal(0, false);
    }

    resetToReal(updateRealFlags = false) {
        this._myValidPosition = this.getPositionReal(this._myValidPosition);
        this._myValidPositionHead = this.getPositionHeadReal(this._myValidPositionHead);
        this._myValidRotationQuat = this.getRotationRealQuat(this._myValidRotationQuat);
        this._myValidHeight = Math.pp_clamp(this.getHeightReal(), this._myParams.myMinHeight, this._myParams.myMaxHeight);

        if (updateRealFlags) {
            this._updateReal(0, false);
        }
    }

    resetHeadToReal() {
        this._myValidPositionHead = this.getPositionHeadReal(this._myValidPositionHead);
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

    isHopping() {
        return this._myIsHopping;
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
        // implemented outside class definition
    }

    getDistanceToRealHead() {
        // implemented outside class definition
    }

    getPlayerHeadManager() {
        return this._myParams.myPlayerHeadManager;
    }

    getParams() {
        return this._myParams;
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
        this._myHeadCollisionCheckParams = new PP.CollisionCheckParams();
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

        params.myHeight = params.myRadius; // on purpose the height "radius" is half, to avoid hitting before with head than body collision (through height)
        params.myPositionOffsetLocal.vec3_set(0, -params.myRadius / 2, 0)

        params.myCheckHeight = true;
        params.myCheckHeightVerticalMovement = true;
        params.myCheckHeightVerticalPosition = true;
        params.myHeightCheckStepAmountMovement = 2;
        params.myHeightCheckStepAmountPosition = 2;
        params.myCheckHeightTopMovement = true;
        params.myCheckHeightTopPosition = true;
        params.myCheckVerticalStraight = true;

        params.myCheckVerticalFixedForwardEnabled = true;
        params.myCheckVerticalFixedForward = PP.vec3_create(0, 0, 1);

        params.myCheckHorizontalFixedForwardEnabled = true;
        params.myCheckHorizontalFixedForward = PP.vec3_create(0, 0, 1);

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

        params.myDebugActive = false;

        params.myDebugHorizontalMovementActive = true;
        params.myDebugHorizontalPositionActive = false;
        params.myDebugVerticalMovementActive = false;
        params.myDebugVerticalPositionActive = false;
        params.myDebugSlidingActive = false;
        params.myDebugGroundInfoActive = false;
        params.myDebugCeilingInfoActive = false;
        params.myDebugRuntimeParamsActive = false;
        params.myDebugMovementActive = false;
    }

    _generateTeleportParamsFromMovementParams() {
        if (this._myParams.myTeleportCollisionCheckParams == null) {
            this._myParams.myTeleportCollisionCheckParams = new PP.CollisionCheckParams();
        }

        if (this._myParams.myTeleportCollisionCheckParamsCheck360) {
            this._myParams.myTeleportCollisionCheckParams = PP.CollisionCheckUtils.generate360TeleportParamsFromMovementParams(this._myParams.myMovementCollisionCheckParams, this._myParams.myTeleportCollisionCheckParams);
        } else {
            this._myParams.myTeleportCollisionCheckParams.copy(this._myParams.myMovementCollisionCheckParams);
        }
    }

    _generateRealMovementParamsFromMovementParams() {
        if (this._myRealMovementCollisionCheckParams == null) {
            this._myRealMovementCollisionCheckParams = new PP.CollisionCheckParams();
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

        params.myDebugActive = false;

        params.myDebugHorizontalMovementActive = false;
        params.myDebugHorizontalPositionActive = false;
        params.myDebugVerticalMovementActive = false;
        params.myDebugVerticalPositionActive = false;
        params.myDebugSlidingActive = false;
        params.myDebugGroundInfoActive = true;
        params.myDebugCeilingInfoActive = true;
        params.myDebugRuntimeParamsActive = false;
        params.myDebugMovementActive = false;
    }

    _onXRSessionStart(manualStart, session) {
        if (this._myActive) {
            if (this._myParams.myResetToValidOnEnterSession && !manualStart) {
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
        PP.myDebugVisualManager.drawPoint(0, this._myValidPosition, PP.vec4_create(1, 0, 0, 1), 0.05);
        PP.myDebugVisualManager.drawLineEnd(0, this._myValidPosition, this.getPositionReal(), PP.vec4_create(1, 0, 0, 1), 0.05);
        PP.myDebugVisualManager.drawLine(0, this._myValidPosition, this._myValidRotationQuat.quat_getForward(), 0.15, PP.vec4_create(0, 1, 0, 1), 0.025);

        PP.myDebugVisualManager.drawPoint(0, this._myValidPositionHead, PP.vec4_create(1, 1, 0, 1), 0.05);
    }
};

PP.CleanedPlayerTransformManager.prototype.getDistanceToReal = function () {
    let realPosition = PP.vec3_create();
    return function getDistanceToReal() {
        realPosition = this.getPositionReal(realPosition);
        return realPosition.vec3_distance(this.getPosition());
    };
}();

PP.CleanedPlayerTransformManager.prototype.getDistanceToRealHead = function () {
    let realPosition = PP.vec3_create();
    return function getDistanceToRealHead() {
        realPosition = this.getPositionHeadReal(realPosition);
        return realPosition.vec3_distance(this.getPositionHead());
    };
}();

PP.CleanedPlayerTransformManager.prototype.resetReal = function () {
    let realUp = PP.vec3_create();
    let validUp = PP.vec3_create();
    let position = PP.vec3_create();
    let rotationQuat = PP.quat_create();
    return function resetReal(resetPosition = true, resetRotation = true, resetHeight = true, updateRealFlags = false) {
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
            playerHeadManager.setHeight(this.getHeight(), true);
        }

        if (updateRealFlags) {
            this._updateReal(0, false);
        }
    };
}();

PP.CleanedPlayerTransformManager.prototype.update = function () {
    let transformQuat = PP.quat2_create();
    let collisionRuntimeParams = new PP.CollisionRuntimeParams();
    let transformUp = PP.vec3_create();
    let horizontalDirection = PP.vec3_create();
    let rotationQuat = PP.quat_create();
    return function update(dt) {
        //#TODO this should update ground and ceiling info but not sliding info        

        this._updateReal(dt);

        if (this._myResetRealOnSynced) {
            if (this.getPlayerHeadManager().isSynced()) {
                this._myResetRealOnSynced = false;
                if (PP.XRUtils.isSessionActive()) {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionVR,
                        !this._myParams.myNeverResetRealRotationVR,
                        !this._myParams.myNeverResetRealHeightVR,
                        false);
                } else {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionNonVR,
                        !this._myParams.myNeverResetRealRotationNonVR,
                        !this._myParams.myNeverResetRealHeightNonVR,
                        false);
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
            let debugBackup = this._myParams.myMovementCollisionCheckParams.myDebugActive;
            this._myParams.myMovementCollisionCheckParams.myDebugActive = false;
            PP.myCollisionCheck.positionCheck(true, transformQuat, this._myParams.myMovementCollisionCheckParams, collisionRuntimeParams);
            this._myParams.myMovementCollisionCheckParams.myDebugActive = debugBackup;
            this._myIsPositionValid = collisionRuntimeParams.myIsPositionOk;
        }

        if (this._myParams.myDebugActive) {
            this._debugUpdate(dt);
        }
    }
}();

PP.CleanedPlayerTransformManager.prototype._updateReal = function () {
    let movementToCheck = PP.vec3_create();
    let position = PP.vec3_create();
    let positionReal = PP.vec3_create();
    let transformQuat = PP.quat2_create();
    let collisionRuntimeParams = new PP.CollisionRuntimeParams();

    let newPosition = PP.vec3_create();
    let newPositionHead = PP.vec3_create();
    let movementStep = PP.vec3_create();
    let currentMovementStep = PP.vec3_create();
    let transformUp = PP.vec3_create();
    let verticalMovement = PP.vec3_create();
    let movementChecked = PP.vec3_create();
    let newFeetPosition = PP.vec3_create();
    let floatingTransformQuat = PP.quat2_create();
    let horizontalDirection = PP.vec3_create();
    let rotationQuat = PP.quat_create();
    return function _updateReal(dt, resetRealEnabled = true) {
        // check if new head is ok and update the data
        // if head is not synced (blurred or session changing) avoid this and keep last valid
        if (this.getPlayerHeadManager().isSynced()) {
            this._updateCollisionHeight();

            this._myIsBodyColliding = false;
            this._myIsHeadColliding = false;
            this._myIsLeaning = false;
            this._myIsHopping = false;
            this._myIsFar = false;

            movementToCheck = this.getPositionReal(positionReal).vec3_sub(this.getPosition(position), movementToCheck);
            if (movementToCheck.vec3_length() > 0.0001) {
                this._myLastValidMovementDirection = movementToCheck.vec3_normalize(this._myLastValidMovementDirection); //TEMP direction
            }

            // Far
            if (this._myParams.mySyncEnabledFlagMap.get(PP.PlayerTransformManagerSyncFlag.FAR)) {
                if (this._myParams.myIsMaxDistanceFromRealToSyncEnabled && movementToCheck.vec3_length() > this._myParams.myMaxDistanceFromRealToSync) {
                    this._myIsFar = true;
                } else if (this._myParams.myIsFarExtraCheckCallback != null && this._myParams.myIsFarExtraCheckCallback(this)) {
                    this._myIsFar = true;
                }
            }

            // Body Colliding
            collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
            collisionRuntimeParams.myIsOnGround = true; //#TODO temp as long as surface infos are not actually updated
            transformQuat = this.getTransformQuat(transformQuat);
            newPosition.vec3_copy(this._myValidPosition);
            if (this._myParams.mySyncEnabledFlagMap.get(PP.PlayerTransformManagerSyncFlag.BODY_COLLIDING)) {
                PP.myCollisionCheck.move(movementToCheck, transformQuat, this._myRealMovementCollisionCheckParams, collisionRuntimeParams);

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

            // Floating 
            if (this._myParams.mySyncEnabledFlagMap.get(PP.PlayerTransformManagerSyncFlag.FLOATING)) {

                if (!this._myIsBodyColliding) {
                    movementToCheck = newPosition.vec3_sub(position, movementToCheck);
                } else {
                    movementToCheck = positionReal.vec3_sub(position, movementToCheck);
                }

                collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
                floatingTransformQuat.quat2_setPositionRotationQuat(this._myValidPosition, this._myValidRotationQuat);
                PP.myCollisionCheck.updateSurfaceInfo(floatingTransformQuat, this._myRealMovementCollisionCheckParams, collisionRuntimeParams);
                //#TODO utilizzare on ground del body gia calcolato, ma ora non c'è quindi va bene così

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
                            PP.myCollisionCheck.updateSurfaceInfo(floatingTransformQuat, this._myRealMovementCollisionCheckParams, collisionRuntimeParams);
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
            transformQuat = this.getTransformHeadQuat(transformQuat); // get eyes transform
            newPositionHead.vec3_copy(this._myValidPositionHead);
            if (this._myParams.mySyncEnabledFlagMap.get(PP.PlayerTransformManagerSyncFlag.HEAD_COLLIDING)) {
                PP.myCollisionCheck.move(movementToCheck, transformQuat, this._myHeadCollisionCheckParams, collisionRuntimeParams);

                if (!collisionRuntimeParams.myHorizontalMovementCanceled && !collisionRuntimeParams.myVerticalMovementCanceled) {
                    this._myIsHeadColliding = false;
                    newPositionHead.vec3_copy(collisionRuntimeParams.myNewPosition);
                } else {
                    this._myIsHeadColliding = true;
                }
            }

            if (this.isSynced(this._myParams.mySyncPositionFlagMap) && !this._myParams.mySyncPositionDisabled) {
                this._myValidPosition.vec3_copy(newPosition);
                //reset real position dato che la posizione new potrebbe essere quella influenzata da snap
            }

            if (this.isSynced(this._myParams.mySyncPositionHeadFlagMap)) {
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

                let debugBackup = this._myParams.myMovementCollisionCheckParams.myDebugActive;
                this._myParams.myMovementCollisionCheckParams.myDebugActive = false;
                PP.myCollisionCheck.positionCheck(true, transformQuat, this._myParams.myMovementCollisionCheckParams, this._myRealCollisionRuntimeParams);
                this._myIsRealPositionValid = this._myRealCollisionRuntimeParams.myIsPositionOk;
                this._myParams.myMovementCollisionCheckParams.myDebugActive = debugBackup;
            }
        }
    }
}();

PP.CleanedPlayerTransformManager.prototype.move = function () {
    let transformQuat = PP.quat2_create();
    let fixedMovement = PP.vec3_create();
    return function move(movement, outCollisionRuntimeParams = null, forceMove = false) {
        transformQuat = this.getTransformQuat(transformQuat);

        PP.myCollisionCheck.move(movement, transformQuat, this._myParams.myMovementCollisionCheckParams, this._myCollisionRuntimeParams);
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

        // this make reset happens even for gravity, maybe u should do it manually
        if (this._myParams.myResetRealOnMove) {
            if (!this.isSynced()) {
                if (PP.XRUtils.isSessionActive()) {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionVR,
                        !this._myParams.myNeverResetRealRotationVR,
                        !this._myParams.myNeverResetRealHeightVR,
                        false);
                } else {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionNonVR,
                        !this._myParams.myNeverResetRealRotationNonVR,
                        !this._myParams.myNeverResetRealHeightNonVR,
                        false);
                }
            }
        }

        //#TODO add move callback
    };
}();

PP.CleanedPlayerTransformManager.prototype.teleportPosition = function () {
    let teleportTransformQuat = PP.quat2_create();
    return function teleportPosition(teleportPosition, outCollisionRuntimeParams = null, forceTeleport = false) {
        teleportTransformQuat = this.getTransformQuat(teleportTransformQuat);
        teleportTransformQuat.quat2_setPosition(teleportPosition);
        this.teleportTransformQuat(teleportTransformQuat, outCollisionRuntimeParams, forceTeleport);
    };
}();

PP.CleanedPlayerTransformManager.prototype.teleportTransformQuat = function () {
    let currentPosition = PP.vec3_create();
    let teleportPositionVec = PP.vec3_create();
    let teleportRotation = PP.quat_create();
    let rotatedTransformQuat = PP.quat2_create();
    let fixedMovement = PP.vec3_create();
    return function teleportTransformQuat(teleportTransformQuat, outCollisionRuntimeParams = null, forceTeleport = false) {
        currentPosition = this.getPosition(currentPosition);
        teleportPositionVec = teleportTransformQuat.quat2_getPosition(teleportPositionVec);
        teleportRotation = teleportTransformQuat.quat2_getRotationQuat(teleportRotation);

        rotatedTransformQuat.quat2_setPositionRotationQuat(currentPosition, teleportRotation);

        PP.myCollisionCheck.teleport(teleportPositionVec, rotatedTransformQuat, this._myParams.myTeleportCollisionCheckParams, this._myCollisionRuntimeParams);
        if (outCollisionRuntimeParams != null) {
            outCollisionRuntimeParams.copy(this._myCollisionRuntimeParams);
        }

        fixedMovement.vec3_zero();
        if (!forceTeleport) {
            if (!this._myCollisionRuntimeParams.myTeleportCanceled) {
                fixedMovement = this._myCollisionRuntimeParams.myFixedTeleportPosition.vec3_sub(currentPosition, fixedMovement);
                this.getPlayerHeadManager().setRotationFeetQuat(teleportRotation);
            }
        } else {
            fixedMovement = teleportPositionVec.vec3_sub(currentPosition, fixedMovement);
            this.getPlayerHeadManager().setRotationFeetQuat(teleportRotation);
        }

        if (!fixedMovement.vec3_isZero(0.00001)) {
            this._myValidPosition.vec3_add(fixedMovement, this._myValidPosition);
            this.getPlayerHeadManager().moveFeet(fixedMovement);
        }

        if (this._myParams.myResetRealOnTeleport) {
            if (!this.isSynced()) {
                if (PP.XRUtils.isSessionActive()) {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionVR,
                        !this._myParams.myNeverResetRealRotationVR,
                        !this._myParams.myNeverResetRealHeightVR,
                        false);
                } else {
                    this.resetReal(
                        !this._myParams.myNeverResetRealPositionNonVR,
                        !this._myParams.myNeverResetRealRotationNonVR,
                        !this._myParams.myNeverResetRealHeightNonVR,
                        false);
                }
            }
        }

        //#TODO add teleport callback
    };
}();

PP.CleanedPlayerTransformManager.prototype.rotateQuat = function () {
    return function rotateQuat(rotationQuat) {
        this._myValidRotationQuat.quat_rotateQuat(rotationQuat, this._myValidRotationQuat);
        this.getPlayerHeadManager().rotateFeetQuat(rotationQuat);
    };
}();

PP.CleanedPlayerTransformManager.prototype.setRotationQuat = function () {
    let rotationToPerform = PP.quat_create();
    return function setRotationQuat(rotationQuat) {
        rotationToPerform = this._myValidRotationQuat.quat_rotationToQuat(rotationQuat, rotationToPerform);
        this.rotateQuat(rotationToPerform);
    };
}();

PP.CleanedPlayerTransformManager.prototype.setHeight = function () {
    let transformQuat = PP.quat2_create();
    return function setHeight(height, forceSet = false) {
        let fixedHeight = Math.pp_clamp(height, this._myParams.myMinHeight, this._myParams.myMaxHeight);
        let previousHeight = this.getHeight();

        this._myValidHeight = fixedHeight;
        this._updateCollisionHeight();

        transformQuat = this.getTransformQuat(transformQuat);

        PP.myCollisionCheck.positionCheck(true, transformQuat, this._myParams.myMovementCollisionCheckParams, this._myCollisionRuntimeParams);

        if (this._myCollisionRuntimeParams.myIsPositionOk || forceSet) {
            this.getPlayerHeadManager().setHeight(this.getHeight(), true);
        } else {
            this._myValidHeight = previousHeight;
        }

        this._updateCollisionHeight();
    };
}();

//sliding info, surface info, update
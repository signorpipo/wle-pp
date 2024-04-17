import { Timer } from "../../../../../cauldron/cauldron/timer.js";
import { Quat2Utils } from "../../../../../cauldron/utils/array/quat2_utils.js";
import { XRUtils } from "../../../../../cauldron/utils/xr_utils.js";
import { mat4_create, quat2_create, quat_create, vec3_create, vec4_create } from "../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../../pp/globals.js";

export let NonVRReferenceSpaceMode = {
    NO_FLOOR: 0,
    FLOOR: 1,
    NO_FLOOR_THEN_KEEP_VR: 2,
    FLOOR_THEN_KEEP_VR: 3
};

export class PlayerHeadManagerParams {

    constructor(engine = Globals.getMainEngine()) {
        this.mySessionChangeResyncEnabled = false;

        this.myBlurEndResyncEnabled = false;
        this.myBlurEndResyncRotation = false;

        this.myResetTransformOnViewResetEnabled = true;

        this.myNextEnterSessionResyncHeight = false;
        this.myEnterSessionResyncHeight = false;

        this.myExitSessionResyncHeight = false;
        this.myExitSessionResyncVerticalAngle = false;
        this.myExitSessionRemoveRightTilt = false; // For now right tilt is removed even if this setting is false, if the vertical angle has to be adjusted
        this.myExitSessionAdjustMaxVerticalAngle = false;
        this.myExitSessionMaxVerticalAngle = 0;
        this.myExitSessionResetNonVRTransformLocal = true;

        this.myNonVRFloorBasedMode = NonVRReferenceSpaceMode.FLOOR_THEN_KEEP_VR;

        this.myRotateFeetKeepUp = false;

        this.myDefaultHeightNonVR = 0;
        this.myDefaultHeightVRWithoutFloor = 0;
        this.myDefaultHeightVRWithFloor = null; // null means just keep the detected one
        this.myForeheadExtraHeight = 0;
        // Can be used to always add a bit of height, for example to compensate the fact 
        // that the default height is actually the eye height and you may want to also add a forehead offset

        this.myEngine = engine;

        this.myDebugEnabled = false;
    }
}

// Could be intended as the generic player body manager (maybe with hands and stuff also)
export class PlayerHeadManager {

    constructor(params = new PlayerHeadManagerParams()) {
        this._myParams = params;

        this._myCurrentHead = Globals.getPlayerObjects(this._myParams.myEngine).myHead;

        this._mySessionChangeResyncHeadTransform = null;
        this._myBlurRecoverHeadTransform = null;
        this._myCurrentHeadTransformLocalQuat = quat2_create();

        this._myDelaySessionChangeResyncCounter = 0; // Needed because VR head takes some frames to get the tracked position
        this._myDelayBlurEndResyncCounter = 0;
        this._myDelayBlurEndResyncTimer = new Timer(5, false);
        this._myVisibilityHidden = false;

        this._mySessionActive = false;
        this._mySessionBlurred = false;

        this._myIsSyncedDelayCounter = 0;

        this._myViewResetThisFrame = false;
        this._myViewResetEventListener = null;

        this._myHeightNonVR = 0;
        this._myHeightNonVROnEnterSession = 0;
        this._myHeightVRWithoutFloor = null;
        this._myHeightVRWithFloor = null;
        this._myHeightOffsetWithFloor = 0;
        this._myHeightOffsetWithoutFloor = 0;
        this._myNextEnterSessionSetHeightVRWithFloor = false;
        this._myNextEnterSessionSetHeightVRWithoutFloor = false;
        this._myDelayNextEnterSessionSetHeightVRCounter = 0;

        this._myLastReferenceSpaceIsFloorBased = null;

        this._myActive = true;
        this._myDestroyed = false;

        // Config

        this._myResyncCounterFrames = 3;
        this._myIsSyncedDelayCounterFrames = 1;
    }

    start() {
        this._setHeightHeadNonVR(this._myParams.myDefaultHeightNonVR);
        this._setHeightHeadVRWithoutFloor(this._myParams.myDefaultHeightVRWithoutFloor);
        this._setHeightHeadVRWithFloor(this._myParams.myDefaultHeightVRWithFloor);

        this._updateHeightOffset();

        this._setCameraNonXRHeight(this._myHeightNonVR);

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, true, this._myParams.myEngine);
    }

    setActive(active) {
        this._myActive = active;
    }

    getParams() {
        return this._myParams;
    }

    getPlayer() {
        return Globals.getPlayerObjects(this._myParams.myEngine).myPlayer;
    }

    getHead() {
        return this._myCurrentHead;
    }

    getHeightHead() {
        return this.getHeightEyes() + this._myParams.myForeheadExtraHeight;
    }

    getHeightEyes() {
        // Implemented outside class definition
    }

    getTransformFeetQuat(outTransformFeetQuat = quat2_create()) {
        // Implemented outside class definition
    }

    getTransformHeadQuat(outTransformFeetQuat = quat2_create()) {
        return this.getHead().pp_getTransformQuat(outTransformFeetQuat);
    }

    getPositionFeet(outPositionFeet = vec3_create()) {
        // Implemented outside class definition
    }

    getPositionHead(outPositionHead = vec3_create()) {
        return this._myCurrentHead.pp_getPosition(outPositionHead);
    }

    getRotationFeetQuat(outRotationFeetQuat = quat_create()) {
        // Implemented outside class definition
    }

    getRotationHeadQuat(outRotationHeadQuat = quat_create()) {
        return this.getHead().pp_getRotationQuat(outRotationHeadQuat);
    }

    isSynced() {
        return this._myIsSyncedDelayCounter == 0 && this._myDelaySessionChangeResyncCounter == 0 && this._myDelayNextEnterSessionSetHeightVRCounter == 0 && this._myDelayBlurEndResyncCounter == 0 && !this._myDelayBlurEndResyncTimer.isRunning() && !this._mySessionBlurred;
    }

    setHeightHead(height, setOnlyForActiveOne = true) {
        this._setHeightHead(height, height, height, setOnlyForActiveOne);
    }

    resetHeightHeadToDefault(resetOnlyForActiveOne = true) {
        this._setHeightHead(this._myHeightNonVR, this._myHeightVRWithoutFloor, this._myHeightVRWithFloor, resetOnlyForActiveOne);
    }

    setHeightHeadNonVR(height) {
        this._setHeightHeadNonVR(height);

        if (!this._mySessionActive) {
            this._updateHeightOffset();
            this._setCameraNonXRHeight(this._myHeightNonVR);
        }
    }

    setHeightHeadVRWithoutFloor(height) {
        this._setHeightHeadVRWithoutFloor(height);

        if (this._mySessionActive) {
            this._updateHeightOffset();
        }
    }

    resetHeightHeadVRWithFloor() {
        this.setHeightHeadVRWithFloor(null);
    }

    setHeightHeadVRWithFloor(height = null) {
        this._setHeightHeadVRWithFloor(height);

        if (this._mySessionActive) {
            this._updateHeightOffset();
        }
    }

    getDefaultHeightHeadNonVR() {
        return this._myHeightNonVR;
    }

    getDefaultHeightHeadVRWithoutFloor() {
        return this._myHeightVRWithoutFloor;
    }

    getDefaultHeightHeadVRWithFloor() {
        return this._myHeightVRWithFloor;
    }

    moveFeet(movement) {
        // Implemented outside class definition
    }

    moveHead(movement) {
        this.moveFeet(movement);
    }

    teleportPositionHead(teleportPosition) {
        // Implemented outside class definition
    }

    teleportPositionFeet(teleportPosition) {
        // Implemented outside class definition
    }

    teleportPlayerToHeadTransformQuat(headTransformQuat) {
        // Implemented outside class definition
    }

    rotateFeetQuat(rotationQuat, keepUpOverride = null) {
        // Implemented outside class definition 
    }

    rotateHeadQuat(rotationQuat) {
        // #TODO Rotate feet with this and then rotate head freely if possible
        // Implemented outside class definition 
    }

    canRotateFeet() {
        return true;
    }

    canRotateHead() {
        return !this._mySessionActive;
    }

    setRotationFeetQuat(rotationQuat, keepUpOverride = null) {
        // Implemented outside class definition 
    }

    setRotationHeadQuat() {
        // Implemented outside class definition 
    }

    lookAtFeet(position, up = null, keepUpOverride = null) {
        // Implemented outside class definition 
    }

    lookToFeet(direction, up = null, keepUpOverride = null) {
        // Implemented outside class definition 
    }

    lookAtHead(position, up = null) {
    }

    lookToHead(direction, up = null) {
    }

    resetCameraNonXR() {
        Globals.getPlayerObjects(this._myParams.myEngine).myCameraNonXR.pp_resetTransformLocal();
        this._setCameraNonXRHeight(this._myHeightNonVR);
    }

    update(dt) {
        this._myViewResetThisFrame = false;

        if (this._myIsSyncedDelayCounter != 0) {
            this._myIsSyncedDelayCounter--;
            this._myIsSyncedDelayCounter = Math.max(0, this._myIsSyncedDelayCounter);
        }

        if (this._myDelaySessionChangeResyncCounter > 0) {
            this._myDelaySessionChangeResyncCounter--;
            if (this._myDelaySessionChangeResyncCounter == 0) {
                this._sessionChangeResync();
                this._myIsSyncedDelayCounter = this._myIsSyncedDelayCounterFrames;
            }
        }

        if (this._myDelayBlurEndResyncCounter > 0 && !this._myDelayBlurEndResyncTimer.isRunning()) {
            this._myDelayBlurEndResyncCounter--;
            if (this._myDelayBlurEndResyncCounter == 0) {
                this._blurEndResync();
                this._myIsSyncedDelayCounter = this._myIsSyncedDelayCounterFrames;
            }
        }

        // Not really used since visibility hidden end is not considered a special case anymore
        if (this._myDelayBlurEndResyncTimer.isRunning()) {
            if (this._myDelayBlurEndResyncCounter > 0) {
                this._myDelayBlurEndResyncCounter--;
            } else {
                this._myDelayBlurEndResyncTimer.update(dt);
                if (this._myDelayBlurEndResyncTimer.isDone()) {
                    this._blurEndResync();
                    this._myIsSyncedDelayCounter = this._myIsSyncedDelayCounterFrames;
                }
            }
        }

        if (this._myDelayNextEnterSessionSetHeightVRCounter > 0) {
            this._myDelayNextEnterSessionSetHeightVRCounter--;
            if (this._myDelayNextEnterSessionSetHeightVRCounter == 0) {
                if (this._mySessionActive) {
                    let isFloor = XRUtils.isReferenceSpaceFloorBased(this._myParams.myEngine);
                    if (isFloor && this._myNextEnterSessionSetHeightVRWithFloor) {
                        let currentHeadPosition = this._myCurrentHead.pp_getPosition();

                        let floorHeight = this._myHeightVRWithFloor - this._myParams.myForeheadExtraHeight;
                        let currentHeadHeight = this._getPositionEyesHeight(currentHeadPosition);

                        this._myHeightOffsetWithFloor = this._myHeightOffsetWithFloor + (floorHeight - currentHeadHeight);

                        this._updateHeightOffset();

                        this._myNextEnterSessionSetHeightVRWithFloor = false;
                    } else if (!isFloor && this._myNextEnterSessionSetHeightVRWithoutFloor) {
                        let currentHeadPosition = this._myCurrentHead.pp_getPosition();

                        let floorHeight = this._myHeightVRWithoutFloor - this._myParams.myForeheadExtraHeight;
                        let currentHeadHeight = this._getPositionEyesHeight(currentHeadPosition);

                        this._myHeightOffsetWithoutFloor = this._myHeightOffsetWithoutFloor + (floorHeight - currentHeadHeight);

                        this._updateHeightOffset();

                        this._myNextEnterSessionSetHeightVRWithoutFloor = false;
                    }
                }
            }
        }

        if (this.isSynced()) {
            this._myCurrentHead.pp_getTransformLocalQuat(this._myCurrentHeadTransformLocalQuat);
        }

        if (this._myParams.myDebugEnabled && Globals.isDebugEnabled(this._myParams.myEngine)) {
            this._debugUpdate(dt);
        }
    }

    _setHeightHead(heightNonVR, heightVRWithoutFloor, heightVRWithFloor, setOnlyForActiveOne = true) {
        if (!setOnlyForActiveOne || !this._mySessionActive) {
            this._setHeightHeadNonVR(heightNonVR);
        }

        if (!setOnlyForActiveOne || this._mySessionActive) {
            this._setHeightHeadVRWithoutFloor(heightVRWithoutFloor);
            this._setHeightHeadVRWithFloor(heightVRWithFloor);
        }

        this._updateHeightOffset();

        if (!this._mySessionActive) {
            this._setCameraNonXRHeight(this._myHeightNonVR);
        }
    }

    _setHeightHeadNonVR(height) {
        this._myHeightNonVR = height;
        this._myHeightNonVROnEnterSession = height;
    }

    _setHeightHeadVRWithoutFloor(heightWithoutFloor) {
        if (heightWithoutFloor != null) {
            this._myHeightVRWithoutFloor = heightWithoutFloor;
            this._myNextEnterSessionSetHeightVRWithoutFloor = false;

            if (this._mySessionActive) {
                this._myHeightOffsetWithoutFloor = this._myHeightOffsetWithoutFloor + (heightWithoutFloor - this.getHeightHead());
            } else {
                this._myNextEnterSessionSetHeightVRWithoutFloor = true;
            }
        } else {
            this._myHeightVRWithoutFloor = null;
            this._myHeightOffsetWithoutFloor = 0;
        }
    }

    _setHeightHeadVRWithFloor(heightWithFloor) {
        if (heightWithFloor != null) {
            this._myHeightVRWithFloor = heightWithFloor;
            this._myNextEnterSessionSetHeightVRWithFloor = false;

            if (this._mySessionActive) {
                this._myHeightOffsetWithFloor = this._myHeightOffsetWithFloor + (heightWithFloor - this.getHeightHead());
            } else {
                this._myNextEnterSessionSetHeightVRWithFloor = true;
            }
        } else {
            this._myHeightVRWithFloor = null;
            this._myHeightOffsetWithFloor = 0;
        }
    }

    _shouldNonVRUseVRWithFloor() {
        return (this._myLastReferenceSpaceIsFloorBased == null && this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.FLOOR_THEN_KEEP_VR) ||
            (this._myLastReferenceSpaceIsFloorBased != null && this._myLastReferenceSpaceIsFloorBased &&
                (this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.NO_FLOOR_THEN_KEEP_VR || this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.FLOOR_THEN_KEEP_VR));
    }

    _shouldNonVRUseVRWithoutFloor() {
        return (this._myLastReferenceSpaceIsFloorBased == null && this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.NO_FLOOR_THEN_KEEP_VR) ||
            (this._myLastReferenceSpaceIsFloorBased != null && !this._myLastReferenceSpaceIsFloorBased &&
                (this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.NO_FLOOR_THEN_KEEP_VR || this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.FLOOR_THEN_KEEP_VR));
    }

    _setCameraNonXRHeight(height) {
        // Implemented outside class definition
    }

    _debugUpdate(dt) {
        Globals.getDebugVisualManager(this._myParams.myEngine).drawLineEnd(0, this.getPositionFeet(), this.getPositionHead(), vec4_create(1, 0, 0, 1), 0.01);

        console.error(this.getHeightEyes());
    }

    _getPositionEyesHeight(position) {
        // Implemented outside class definition
    }

    _onXRSessionStart(manualCall, session) {
        // Implemented outside class definition
    }

    _onXRSessionEnd(session) {
        // Implemented outside class definition
    }

    _onXRSessionBlurStart(session) {
        // Implemented outside class definition
    }

    _onXRSessionBlurEnd(session) {
        // Implemented outside class definition
    }

    _onViewReset() {
        // Implemented outside class definition
    }

    _blurEndResync() {
        // Implemented outside class definition
    }

    _sessionChangeResync() {
        // Implemented outside class definition
    }

    _setReferenceSpaceHeightOffset(offset, amountToRemove) {
        // Implemented outside class definition
    }

    _updateHeightOffset() {
        // Implemented outside class definition
    }

    _getHeadTransformFromLocal(transformLocal) {
        // Implemented outside class definition
    }

    _resyncHeadRotationForward(resyncHeadRotation) {
        // Implemented outside class definition
    }

    destroy() {
        this._myDestroyed = true;

        XRUtils.getReferenceSpace(this._myParams.myEngine)?.removeEventListener?.("reset", this._myViewResetEventListener);
        XRUtils.getSession(this._myParams.myEngine)?.removeEventListener("visibilitychange", this._myVisibilityChangeEventListener);
        XRUtils.unregisterSessionStartEndEventListeners(this, this._myParams.myEngine);
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

PlayerHeadManager.prototype.getHeightEyes = function () {
    let headPosition = vec3_create();
    return function getHeightEyes() {
        headPosition = this._myCurrentHead.pp_getPosition(headPosition);
        let eyesHeight = this._getPositionEyesHeight(headPosition);

        return eyesHeight;
    };
}();

PlayerHeadManager.prototype.getTransformFeetQuat = function () {
    let feetPosition = vec3_create();
    let feetRotationQuat = quat_create();
    return function getTransformFeetQuat(outTransformFeetQuat = quat2_create()) {
        outTransformFeetQuat.quat2_setPositionRotationQuat(this.getPositionFeet(feetPosition), this.getRotationFeetQuat(feetRotationQuat));
        return outTransformFeetQuat;
    };
}();

PlayerHeadManager.prototype.getRotationFeetQuat = function () {
    let playerUp = vec3_create();
    let headForward = vec3_create();
    return function getRotationFeetQuat(outRotationFeetQuat = quat_create()) {
        playerUp = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getUp(playerUp);
        headForward = this._myCurrentHead.pp_getForward(headForward);

        // Feet are considered to always be flat on the player up
        let angleWithUp = headForward.vec3_angle(playerUp);
        let mingAngle = 10;
        if (angleWithUp < mingAngle) {
            headForward = this._myCurrentHead.pp_getDown(headForward);
        } else if (angleWithUp > 180 - mingAngle) {
            headForward = this._myCurrentHead.pp_getUp(headForward);
        }

        headForward = headForward.vec3_removeComponentAlongAxis(playerUp, headForward);
        headForward.vec3_normalize(headForward);

        outRotationFeetQuat.quat_setUp(playerUp, headForward);
        return outRotationFeetQuat;
    };
}();

PlayerHeadManager.prototype.getPositionFeet = function () {
    let headPosition = vec3_create();
    let playerUp = vec3_create();
    return function getPositionFeet(outPositionFeet = vec3_create()) {
        headPosition = this._myCurrentHead.pp_getPosition(headPosition);
        let headHeight = this._getPositionEyesHeight(headPosition);

        playerUp = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getUp(playerUp);
        outPositionFeet = headPosition.vec3_sub(playerUp.vec3_scale(headHeight, outPositionFeet), outPositionFeet);

        return outPositionFeet;
    };
}();

PlayerHeadManager.prototype.moveFeet = function moveFeet(movement) {
    Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_translate(movement);
};

PlayerHeadManager.prototype.rotateFeetQuat = function () {
    let playerUp = vec3_create();
    let rotationAxis = vec3_create();
    let currentHeadPosition = vec3_create();
    let currentFeetRotation = quat_create();
    let newFeetRotation = quat_create();
    let fixedNewFeetRotation = quat_create();
    let newFeetForward = vec3_create();
    let fixedRotation = quat_create();
    let newHeadPosition = vec3_create();
    let headAdjustmentMovement = vec3_create();
    return function rotateFeetQuat(rotationQuat, keepUpOverride = null) {
        let angle = rotationQuat.quat_getAngleRadians();
        if (angle <= 0.00001) {
            return;
        }

        currentHeadPosition = this._myCurrentHead.pp_getPosition(currentHeadPosition);
        playerUp = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getUp(playerUp);
        rotationAxis = rotationQuat.quat_getAxis(rotationAxis);

        if (!rotationAxis.vec3_isOnAxis(playerUp) &&
            ((keepUpOverride == null && this._myParams.myFeetRotationKeepUp) || (keepUpOverride))) {
            currentFeetRotation = this.getRotationFeetQuat(currentFeetRotation);

            newFeetRotation = currentFeetRotation.quat_rotateQuat(rotationQuat, newFeetRotation);
            newFeetForward = newFeetRotation.quat_getForward(newFeetForward);

            fixedNewFeetRotation.quat_copy(newFeetRotation);
            fixedNewFeetRotation.quat_setUp(playerUp, newFeetForward);

            fixedRotation = currentFeetRotation.quat_rotationToQuat(fixedNewFeetRotation, fixedRotation);
        } else {
            fixedRotation.quat_copy(rotationQuat);
        }

        Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_rotateAroundQuat(fixedRotation, currentHeadPosition);

        newHeadPosition = this._myCurrentHead.pp_getPosition(newHeadPosition);

        headAdjustmentMovement = currentHeadPosition.vec3_sub(newHeadPosition, headAdjustmentMovement);
        if (headAdjustmentMovement.vec3_length() > 0.00001) {
            this.moveFeet(headAdjustmentMovement);
        }
    };
}();

PlayerHeadManager.prototype.rotateHeadQuat = function () {
    let newHeadRotation = quat_create();
    let newHeadUp = vec3_create();
    return function rotateHeadQuat(rotationQuat) {
        if (this.canRotateHead()) {
            this._myCurrentHead.pp_rotateQuat(rotationQuat);
            newHeadRotation = this._myCurrentHead.pp_getRotationQuat(newHeadRotation);

            Globals.getPlayerObjects(this._myParams.myEngine).myHead.pp_setRotationQuat(newHeadRotation);

            if (!this._mySessionActive) {
                newHeadRotation = newHeadRotation.quat_rotateAxisRadians(Math.PI, newHeadRotation.quat_getUp(newHeadUp), newHeadRotation);
                Globals.getPlayerObjects(this._myParams.myEngine).myCameraNonXR.pp_setRotationQuat(newHeadRotation);
            }
        }
    };
}();

PlayerHeadManager.prototype.setRotationFeetQuat = function () {
    let currentRotationQuat = quat_create();
    let rotationQuatToRotate = quat_create();
    return function setRotationFeetQuat(rotationQuat, keepUpOverride = null) {
        currentRotationQuat = this.getRotationFeetQuat(currentRotationQuat);
        rotationQuatToRotate = currentRotationQuat.quat_rotationToQuat(rotationQuat, rotationQuatToRotate);
        this.rotateFeetQuat(rotationQuatToRotate, keepUpOverride);
    };
}();

PlayerHeadManager.prototype.setRotationHeadQuat = function () {
    let currentRotationQuat = quat_create();
    let rotationQuatToRotate = quat_create();
    return function setRotationHeadQuat(rotationQuat) {
        currentRotationQuat = this.getRotationHeadQuat(currentRotationQuat);
        rotationQuatToRotate = currentRotationQuat.quat_rotationToQuat(rotationQuat, rotationQuatToRotate);
        this.rotateHeadQuat(rotationQuatToRotate);
    };
}();

PlayerHeadManager.prototype.teleportPositionHead = function () {
    let currentHeadPosition = vec3_create();
    let teleportMovementToPerform = vec3_create();
    return function teleportPositionHead(teleportPosition) {
        currentHeadPosition = this._myCurrentHead.pp_getPosition(currentHeadPosition);
        teleportMovementToPerform = teleportPosition.vec3_sub(currentHeadPosition, teleportMovementToPerform);
        this.moveFeet(teleportMovementToPerform);
    };
}();

PlayerHeadManager.prototype.teleportPositionFeet = function () {
    let currentFeetPosition = vec3_create();
    let teleportMovementToPerform = vec3_create();
    return function teleportPositionFeet(teleportPosition) {
        currentFeetPosition = this.getPositionFeet(currentFeetPosition);
        teleportMovementToPerform = teleportPosition.vec3_sub(currentFeetPosition, teleportMovementToPerform);
        this.moveFeet(teleportMovementToPerform);
    };
}();

PlayerHeadManager.prototype.teleportPlayerToHeadTransformQuat = function () {
    let headPosition = vec3_create();
    let playerUp = vec3_create();
    let flatCurrentPlayerPosition = vec3_create();
    let flatNewPlayerPosition = vec3_create();
    let teleportMovement = vec3_create();
    let playerForward = vec3_create();
    let headForward = vec3_create();
    let referenceSpaceForward = vec3_create();
    let referenceSpaceForwardNegated = vec3_create();
    let rotationToPerform = quat_create();
    return function teleportPlayerToHeadTransformQuat(headTransformQuat) {
        headPosition = headTransformQuat.quat2_getPosition(headPosition);

        playerUp = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getUp(playerUp);
        flatCurrentPlayerPosition = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getPosition(flatCurrentPlayerPosition).vec3_removeComponentAlongAxis(playerUp, flatCurrentPlayerPosition);
        flatNewPlayerPosition = headPosition.vec3_removeComponentAlongAxis(playerUp, flatNewPlayerPosition);

        teleportMovement = flatNewPlayerPosition.vec3_sub(flatCurrentPlayerPosition, teleportMovement);
        Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_translate(teleportMovement);

        playerForward = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getForward(playerForward);
        headForward = headTransformQuat.quat2_getForward(headForward);

        rotationToPerform = playerForward.vec3_rotationToPivotedQuat(headForward, playerUp, rotationToPerform);

        Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_rotateQuat(rotationToPerform);

        // Adjust player rotation based on the reference space rotation, which should not actually be touched,
        // but just in case

        playerForward = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getForward(playerForward);

        referenceSpaceForward = Globals.getPlayerObjects(this._myParams.myEngine).myReferenceSpace.pp_getForward(referenceSpaceForward);
        referenceSpaceForwardNegated = referenceSpaceForward.vec3_negate(referenceSpaceForwardNegated);

        rotationToPerform = referenceSpaceForwardNegated.vec3_rotationToPivotedQuat(playerForward, playerUp, rotationToPerform);

        Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_rotateQuat(rotationToPerform);
    };
}();

PlayerHeadManager.prototype.lookAtFeet = function () {
    let direction = vec3_create();
    let feetPosition = vec3_create();
    return function lookAtFeet(position, up = null, keepUpOverride = null) {
        feetPosition = this.getPositionFeet(feetPosition);
        direction = position.vec3_sub(feetPosition, direction).vec3_normalize(direction);

        this.lookToFeet(direction, up, keepUpOverride);
    };
}();

PlayerHeadManager.prototype.lookToFeet = function () {
    let feetRotation = quat_create();
    return function lookToFeet(direction, up = null, keepUpOverride = null) {
        feetRotation = this.getRotationFeetQuat(feetRotation);
        feetRotation.quat_setForward(direction, up);
        this.setRotationFeetQuat(feetRotation, keepUpOverride);
    };
}();

PlayerHeadManager.prototype.lookAtHead = function () {
    let direction = vec3_create();
    let headPosition = vec3_create();
    return function lookAtHead(position, up = null) {
        headPosition = this.getPositionHead(headPosition);
        direction = position.vec3_sub(headPosition, direction).vec3_normalize(direction);

        this.lookToHead(direction, up);
    };
}();

PlayerHeadManager.prototype.lookToHead = function () {
    let headRotation = quat_create();
    return function lookToHead(direction, up = null) {
        headRotation = this.getRotationHeadQuat(headRotation);
        headRotation.quat_setForward(direction, up);
        this.setRotationHeadQuat(headRotation);
    };
}();

PlayerHeadManager.prototype._getPositionEyesHeight = function () {
    let playerPosition = vec3_create();
    let playerUp = vec3_create();
    let heightVector = vec3_create();
    return function _getPositionEyesHeight(position) {
        playerPosition = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getPosition(playerPosition);
        playerUp = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getUp(playerUp);

        heightVector = position.vec3_sub(playerPosition, heightVector).vec3_componentAlongAxis(playerUp, heightVector);
        let height = heightVector.vec3_length();
        if (!playerUp.vec3_isConcordant(heightVector)) {
            height = -height;
        }

        return height;
    };
}();

// #TODO What happens if the player go in the blurred state before the scene has loaded?
PlayerHeadManager.prototype._onXRSessionStart = function () {
    return function _onXRSessionStart(manualCall, session) {
        let nonVRCurrentEyesHeight = this._getPositionEyesHeight(Globals.getPlayerObjects(this._myParams.myEngine).myCameraNonXR.pp_getPosition());
        this._myHeightNonVROnEnterSession = nonVRCurrentEyesHeight + this._myParams.myForeheadExtraHeight;

        this._myBlurRecoverHeadTransform = null;
        this._myVisibilityHidden = false;

        this._myDelaySessionChangeResyncCounter = 0;
        this._myDelayBlurEndResyncCounter = 0;
        this._myDelayBlurEndResyncTimer.reset();
        this._myDelayNextEnterSessionSetHeightVRCounter = 0;

        let referenceSpace = XRUtils.getReferenceSpace(this._myParams.myEngine);

        if (referenceSpace.addEventListener != null) {
            this._myViewResetEventListener = this._onViewReset.bind(this);
            referenceSpace.addEventListener("reset", this._myViewResetEventListener);
        }

        this._myLastReferenceSpaceIsFloorBased = XRUtils.isReferenceSpaceFloorBased(this._myParams.myEngine);

        this._myVisibilityChangeEventListener = function (event) {
            if (event.session.visibilityState != "visible") {
                if (!this._mySessionBlurred) {
                    this._onXRSessionBlurStart(event.session);
                }

                this._myVisibilityHidden = session.visibilityState == "hidden";
            } else {
                if (this._mySessionBlurred) {
                    this._onXRSessionBlurEnd(event.session);
                }

                this._myVisibilityHidden = false;
            }
        }.bind(this);

        session.addEventListener("visibilitychange", this._myVisibilityChangeEventListener);

        if (this._myParams.mySessionChangeResyncEnabled && !manualCall && this._myActive) {
            if (this._myDelaySessionChangeResyncCounter == 0) {
                this._mySessionChangeResyncHeadTransform = this._getHeadTransformFromLocal(this._myCurrentHeadTransformLocalQuat);
            }

            this._myDelaySessionChangeResyncCounter = this._myResyncCounterFrames;
        } else {
            this._myDelaySessionChangeResyncCounter = 0;
            this._mySessionChangeResyncHeadTransform = null;
        }

        if (this._myNextEnterSessionSetHeightVRWithFloor || this._myNextEnterSessionSetHeightVRWithoutFloor) {
            this._myDelayNextEnterSessionSetHeightVRCounter = this._myResyncCounterFrames;
        }

        this._mySessionActive = true;
        this._mySessionBlurred = false;

        if (this._myActive) {
            this._updateHeightOffset();
        }
    };
}();

PlayerHeadManager.prototype._onXRSessionEnd = function () {
    return function _onXRSessionEnd(session) {
        if (this._myParams.mySessionChangeResyncEnabled && this._myActive) {
            if (this._myDelaySessionChangeResyncCounter == 0) {
                let previousHeadTransform = this._getHeadTransformFromLocal(this._myCurrentHeadTransformLocalQuat);

                if (this._myBlurRecoverHeadTransform != null) {
                    previousHeadTransform = this._myBlurRecoverHeadTransform;
                }

                this._mySessionChangeResyncHeadTransform = previousHeadTransform;
            }

            this._myDelaySessionChangeResyncCounter = this._myResyncCounterFrames;
        } else {
            this._myDelaySessionChangeResyncCounter = 0;
            this._mySessionChangeResyncHeadTransform = null;
        }

        this._myDelayNextEnterSessionSetHeightVRCounter = 0;

        this._myVisibilityChangeEventListener = null;
        this._myViewResetEventListener = null;

        this._myBlurRecoverHeadTransform = null;
        this._myVisibilityHidden = false;

        this._myDelayBlurEndResyncCounter = 0;
        this._myDelayBlurEndResyncTimer.reset();

        this._mySessionActive = false;
        this._mySessionBlurred = false;

        if (this._myActive) {
            this._updateHeightOffset();

            if (this._myParams.myExitSessionResetNonVRTransformLocal) {
                this.resetCameraNonXR();
            } else {
                this._setCameraNonXRHeight(this._myHeightNonVROnEnterSession);
            }
        }
    };
}();

PlayerHeadManager.prototype._onXRSessionBlurStart = function () {
    return function _onXRSessionBlurStart(session) {
        if (this._myActive) {
            if (this._myParams.myBlurEndResyncEnabled && this._myBlurRecoverHeadTransform == null && this._mySessionActive) {
                if (this._myDelaySessionChangeResyncCounter > 0) {
                    this._myBlurRecoverHeadTransform = this._mySessionChangeResyncHeadTransform;
                } else {
                    this._myBlurRecoverHeadTransform = this._getHeadTransformFromLocal(this._myCurrentHeadTransformLocalQuat);
                }
            } else if (!this._mySessionActive || !this._myParams.myBlurEndResyncEnabled) {
                this._myBlurRecoverHeadTransform = null;
            }
        }

        this._myDelayBlurEndResyncCounter = 0;

        this._mySessionBlurred = true;
    };
}();

PlayerHeadManager.prototype._onXRSessionBlurEnd = function () {
    return function _onXRSessionBlurEnd(session) {
        if (this._myActive) {
            if (this._myDelaySessionChangeResyncCounter == 0) {
                if (this._myParams.myBlurEndResyncEnabled && this._myBlurRecoverHeadTransform != null && this._mySessionActive) {
                    this._myDelayBlurEndResyncCounter = this._myResyncCounterFrames;
                    if (this._myVisibilityHidden) {
                        //this._myDelayBlurEndResyncTimer.start();

                        // This was added because on the end of hidden u can have the resync delay cause of the guardian resync
                        // but I just decided to skip this since it's not reliable and the guardian resync can happen in other cases
                        // with no notification anyway
                    }
                } else {
                    this._myBlurRecoverHeadTransform = null;
                    this._myDelayBlurEndResyncCounter = 0;
                }
            } else {
                this._myDelaySessionChangeResyncCounter = this._myResyncCounterFrames;
                this._myBlurRecoverHeadTransform = null;
            }
        }

        this._mySessionBlurred = false;
    };
}();

PlayerHeadManager.prototype._onViewReset = function () {
    let identityTransformQuat = Quat2Utils.identity(quat2_create());
    let prevHeadPosition = vec3_create();
    let resetHeadPosition = vec3_create();
    return function _onViewReset() {
        if (this._myActive) {
            if (!this._myViewResetThisFrame && this._myParams.myResetTransformOnViewResetEnabled && this._mySessionActive && this.isSynced()) {
                this._myViewResetThisFrame = true;
                let previousHeadTransformQuat = this._getHeadTransformFromLocal(this._myCurrentHeadTransformLocalQuat);
                this.teleportPlayerToHeadTransformQuat(previousHeadTransformQuat);

                let isFloor = XRUtils.isReferenceSpaceFloorBased(this._myParams.myEngine);
                if (!isFloor) {
                    let resetHeadTransformQuat = this._getHeadTransformFromLocal(identityTransformQuat);
                    let prevHeadHeight = this._getPositionEyesHeight(previousHeadTransformQuat.quat2_getPosition(prevHeadPosition));
                    let currentHeadHeight = this._getPositionEyesHeight(resetHeadTransformQuat.quat2_getPosition(resetHeadPosition));
                    this._myHeightOffsetWithoutFloor = this._myHeightOffsetWithoutFloor + (prevHeadHeight - currentHeadHeight);
                    this._updateHeightOffset();
                }
            }
        }
    };
}();

PlayerHeadManager.prototype._blurEndResync = function () {
    let playerUp = vec3_create();
    let currentHeadPosition = vec3_create();
    let recoverHeadPosition = vec3_create();
    let flatCurrentHeadPosition = vec3_create();
    let flatRecoverHeadPosition = vec3_create();
    let recoverMovement = vec3_create();
    let recoverHeadForward = vec3_create();
    let currentHeadForward = vec3_create();
    let rotationToPerform = quat_create();
    return function _blurEndResync() {
        if (this._myBlurRecoverHeadTransform != null) {
            if (this._mySessionChangeResyncHeadTransform != null) {
                this._myBlurRecoverHeadTransform = null;
                this._sessionChangeResync();
            } else {
                playerUp = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getUp(playerUp);

                currentHeadPosition = this._myCurrentHead.pp_getPosition(currentHeadPosition);
                recoverHeadPosition = this._myBlurRecoverHeadTransform.quat2_getPosition(recoverHeadPosition);

                flatCurrentHeadPosition = currentHeadPosition.vec3_removeComponentAlongAxis(playerUp, flatCurrentHeadPosition);
                flatRecoverHeadPosition = recoverHeadPosition.vec3_removeComponentAlongAxis(playerUp, flatRecoverHeadPosition);

                recoverMovement = flatRecoverHeadPosition.vec3_sub(flatCurrentHeadPosition, recoverMovement);
                this.moveFeet(recoverMovement);

                recoverHeadForward = this._myBlurRecoverHeadTransform.quat2_getForward(recoverHeadForward);
                currentHeadForward = this._myCurrentHead.pp_getForward(currentHeadForward);
                rotationToPerform = currentHeadForward.vec3_rotationToPivotedQuat(recoverHeadForward, playerUp, rotationToPerform);

                if (this._myParams.myBlurEndResyncRotation) {
                    this.rotateFeetQuat(rotationToPerform);
                }

                this._myBlurRecoverHeadTransform = null;
            }
        }
    };
}();

PlayerHeadManager.prototype._sessionChangeResync = function () {
    let currentHeadPosition = vec3_create();
    let resyncHeadPosition = vec3_create();
    let resyncHeadRotation = quat_create();
    let playerUp = vec3_create();
    let flatCurrentHeadPosition = vec3_create();
    let flatResyncHeadPosition = vec3_create();
    let resyncMovement = vec3_create();
    let resyncHeadForward = vec3_create();
    let resyncHeadUp = vec3_create();
    let resyncHeadRight = vec3_create();
    let playerPosition = vec3_create();
    let newPlayerPosition = vec3_create();
    let fixedHeadRight = vec3_create();
    let fixedHeadLeft = vec3_create();
    let fixedHeadUp = vec3_create();
    let fixedHeadForward = vec3_create();
    let fixedHeadRotation = quat_create();
    return function _sessionChangeResync() {
        if (this._myBlurRecoverHeadTransform == null && this._mySessionChangeResyncHeadTransform != null) {
            if (this._mySessionActive) {
                currentHeadPosition = this._myCurrentHead.pp_getPosition(currentHeadPosition);
                resyncHeadPosition = this._mySessionChangeResyncHeadTransform.quat2_getPosition(resyncHeadPosition);
                resyncHeadRotation = this._mySessionChangeResyncHeadTransform.quat2_getRotationQuat(resyncHeadRotation);

                playerUp = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getUp(playerUp);

                flatCurrentHeadPosition = currentHeadPosition.vec3_removeComponentAlongAxis(playerUp, flatCurrentHeadPosition);
                flatResyncHeadPosition = resyncHeadPosition.vec3_removeComponentAlongAxis(playerUp, flatResyncHeadPosition);

                resyncMovement = flatResyncHeadPosition.vec3_sub(flatCurrentHeadPosition, resyncMovement);
                this.moveFeet(resyncMovement);

                if (this._myParams.myEnterSessionResyncHeight || this._myParams.myNextEnterSessionResyncHeight) {
                    this._myParams.myNextEnterSessionResyncHeight = false;
                    let resyncHeadHeight = this._getPositionEyesHeight(resyncHeadPosition);
                    let currentHeadHeight = this._getPositionEyesHeight(currentHeadPosition);

                    this._myHeightVRWithoutFloor = resyncHeadHeight + this._myParams.myForeheadExtraHeight;
                    this._myHeightVRWithFloor = resyncHeadHeight + this._myParams.myForeheadExtraHeight;
                    this._myHeightOffsetWithFloor = this._myHeightOffsetWithFloor + (resyncHeadHeight - currentHeadHeight);
                    this._myHeightOffsetWithoutFloor = this._myHeightOffsetWithoutFloor + (resyncHeadHeight - currentHeadHeight);

                    this._updateHeightOffset();

                    this._myNextEnterSessionSetHeightVRWithFloor = false;
                    this._myNextEnterSessionSetHeightVRWithoutFloor = false;
                }

                this._resyncHeadRotationForward(resyncHeadRotation);
            } else {
                playerUp = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getUp(playerUp);

                resyncHeadPosition = this._mySessionChangeResyncHeadTransform.quat2_getPosition(resyncHeadPosition);
                flatResyncHeadPosition = resyncHeadPosition.vec3_removeComponentAlongAxis(playerUp, flatResyncHeadPosition);

                playerPosition = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getPosition(playerPosition);
                newPlayerPosition = flatResyncHeadPosition.vec3_add(playerPosition.vec3_componentAlongAxis(playerUp, newPlayerPosition), newPlayerPosition);

                Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_setPosition(newPlayerPosition);
                Globals.getPlayerObjects(this._myParams.myEngine).myCameraNonXR.pp_resetPositionLocal();

                if (this._myParams.myExitSessionResyncHeight) {
                    let resyncHeadHeight = this._getPositionEyesHeight(resyncHeadPosition);
                    this._myHeightNonVR = resyncHeadHeight + this._myParams.myForeheadExtraHeight;
                }

                this._updateHeightOffset();

                if (this._myParams.myExitSessionResyncHeight || this._myParams.myExitSessionResetNonVRTransformLocal) {
                    this._setCameraNonXRHeight(this._myHeightNonVR);
                } else {
                    this._setCameraNonXRHeight(this._myHeightNonVROnEnterSession);
                }

                resyncHeadRotation = this._mySessionChangeResyncHeadTransform.quat2_getRotationQuat(resyncHeadRotation);

                if (this._myParams.myExitSessionRemoveRightTilt ||
                    this._myParams.myExitSessionAdjustMaxVerticalAngle || !this._myParams.myExitSessionResyncVerticalAngle) {
                    resyncHeadForward = resyncHeadRotation.quat_getForward(resyncHeadForward);
                    resyncHeadUp = resyncHeadRotation.quat_getUp(resyncHeadUp);

                    fixedHeadRight = resyncHeadForward.vec3_cross(playerUp, fixedHeadRight);
                    fixedHeadRight.vec3_normalize(fixedHeadRight);

                    if (!resyncHeadUp.vec3_isConcordant(playerUp)) {
                        let angleForwardUp = resyncHeadForward.vec3_angle(playerUp);
                        let negateAngle = 45;
                        if (angleForwardUp > (180 - negateAngle) || angleForwardUp < negateAngle) {
                            // This way I get a good fixed result for both head upside down and head rotated on forward
                            // When the head is looking down and a bit backward (more than 135 degrees), I want the forward to actually
                            // be the opposite because it's like u rotate back the head up and look forward again
                            fixedHeadRight.vec3_negate(fixedHeadRight);
                        }
                    }

                    if (fixedHeadRight.vec3_isZero(0.000001)) {
                        fixedHeadRight = resyncHeadRotation.quat_getRight(fixedHeadRight);
                    }

                    fixedHeadUp = fixedHeadRight.vec3_cross(resyncHeadForward, fixedHeadUp);
                    fixedHeadUp.vec3_normalize(fixedHeadUp);
                    fixedHeadForward = fixedHeadUp.vec3_cross(fixedHeadRight, fixedHeadForward);
                    fixedHeadForward.vec3_normalize(fixedHeadForward);

                    fixedHeadRotation.quat_fromAxes(fixedHeadRight.vec3_negate(fixedHeadLeft), fixedHeadUp, fixedHeadForward);
                    resyncHeadRotation.quat_copy(fixedHeadRotation);
                }

                if (this._myParams.myExitSessionAdjustMaxVerticalAngle || !this._myParams.myExitSessionResyncVerticalAngle) {
                    resyncHeadUp = resyncHeadRotation.quat_getUp(resyncHeadUp);
                    resyncHeadRight = resyncHeadRotation.quat_getRight(resyncHeadRight);

                    let maxVerticalAngle = Math.max(0, this._myParams.myExitSessionMaxVerticalAngle - 0.0001);
                    if (!this._myParams.myExitSessionResyncVerticalAngle) {
                        maxVerticalAngle = 0;
                    }

                    let angleWithUp = Math.pp_angleClamp(resyncHeadUp.vec3_angleSigned(playerUp, resyncHeadRight));
                    if (Math.abs(angleWithUp) > maxVerticalAngle) {
                        let fixAngle = (Math.abs(angleWithUp) - maxVerticalAngle) * Math.pp_sign(angleWithUp);
                        resyncHeadRotation = resyncHeadRotation.quat_rotateAxis(fixAngle, resyncHeadRight, resyncHeadRotation);
                    }
                }

                this.setRotationHeadQuat(resyncHeadRotation);
            }

            this._mySessionChangeResyncHeadTransform = null;
        }
    };
}();

PlayerHeadManager.prototype._resyncHeadRotationForward = function () {
    let playerUp = vec3_create();
    let resyncHeadForward = vec3_create();
    let resyncHeadUp = vec3_create();
    let fixedResyncHeadRotation = quat_create();
    return function _resyncHeadRotationForward(resyncHeadRotation) {
        playerUp = Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getUp(playerUp);
        resyncHeadForward = resyncHeadRotation.quat_getForward(resyncHeadForward);
        resyncHeadUp = resyncHeadRotation.quat_getUp(resyncHeadUp);
        fixedResyncHeadRotation.quat_copy(resyncHeadRotation);
        fixedResyncHeadRotation.quat_setUp(playerUp, resyncHeadForward);

        if (!resyncHeadUp.vec3_isConcordant(playerUp)) {
            // If it was upside down, it's like it has to rotate the neck back up,so the forward is actually on the opposite side
            fixedResyncHeadRotation.quat_rotateAxis(180, playerUp, fixedResyncHeadRotation);
        }

        this.setRotationFeetQuat(fixedResyncHeadRotation);
        return;
    };
}();

PlayerHeadManager.prototype._setCameraNonXRHeight = function () {
    let cameraNonVRPosition = vec3_create();
    let cameraNonVRPositionLocalToPlayer = vec3_create();
    let adjustedCameraNonVRPosition = vec3_create();
    let playerTranform = mat4_create();
    return function _setCameraNonXRHeight(height) {
        let eyeHeight = height - this._myParams.myForeheadExtraHeight;
        cameraNonVRPosition = Globals.getPlayerObjects(this._myParams.myEngine).myCameraNonXR.pp_getPosition(cameraNonVRPosition);
        cameraNonVRPositionLocalToPlayer = cameraNonVRPosition.vec3_convertPositionToLocal(Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getTransform(playerTranform), cameraNonVRPositionLocalToPlayer);
        cameraNonVRPositionLocalToPlayer.vec3_set(cameraNonVRPositionLocalToPlayer[0], eyeHeight, cameraNonVRPositionLocalToPlayer[2]);
        adjustedCameraNonVRPosition = cameraNonVRPositionLocalToPlayer.vec3_convertPositionToWorld(Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getTransform(playerTranform), adjustedCameraNonVRPosition);
        Globals.getPlayerObjects(this._myParams.myEngine).myCameraNonXR.pp_setPosition(adjustedCameraNonVRPosition);
    };
}();

PlayerHeadManager.prototype._updateHeightOffset = function () {
    return function _updateHeightOffset() {
        if (this._mySessionActive) {
            if (XRUtils.isReferenceSpaceFloorBased(this._myParams.myEngine)) {
                this._setReferenceSpaceHeightOffset(this._myHeightOffsetWithFloor, 0);
            } else {
                this._setReferenceSpaceHeightOffset(this._myHeightOffsetWithoutFloor, 0);
            }
        } else {
            if (this._shouldNonVRUseVRWithFloor()) {
                this._setReferenceSpaceHeightOffset(this._myHeightOffsetWithFloor, 0);
            } else if (this._shouldNonVRUseVRWithoutFloor()) {
                this._setReferenceSpaceHeightOffset(this._myHeightOffsetWithoutFloor, 0);
            } else if (this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.FLOOR) {
                this._setReferenceSpaceHeightOffset(0, 0);
            } else {
                this._setReferenceSpaceHeightOffset(this._myHeightNonVR, this._myParams.myForeheadExtraHeight);
            }
        }
    };
}();

PlayerHeadManager.prototype._setReferenceSpaceHeightOffset = function () {
    let referenceSpacePosition = vec3_create();
    let referenceSpacePositionLocalToPlayer = vec3_create();
    let adjustedReferenceSpacePosition = vec3_create();
    let playerTranform = mat4_create();
    return function _setReferenceSpaceHeightOffset(offset, amountToRemove) {
        if (offset != null) {
            referenceSpacePosition = Globals.getPlayerObjects(this._myParams.myEngine).myReferenceSpace.pp_getPosition(referenceSpacePosition);
            referenceSpacePositionLocalToPlayer = referenceSpacePosition.vec3_convertPositionToLocal(Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getTransform(playerTranform), referenceSpacePositionLocalToPlayer);
            referenceSpacePositionLocalToPlayer.vec3_set(referenceSpacePositionLocalToPlayer[0], offset - amountToRemove, referenceSpacePositionLocalToPlayer[2]);
            adjustedReferenceSpacePosition = referenceSpacePositionLocalToPlayer.vec3_convertPositionToWorld(Globals.getPlayerObjects(this._myParams.myEngine).myPlayer.pp_getTransform(playerTranform), adjustedReferenceSpacePosition);
            Globals.getPlayerObjects(this._myParams.myEngine).myReferenceSpace.pp_setPosition(adjustedReferenceSpacePosition);
        }
    };
}();

PlayerHeadManager.prototype._getHeadTransformFromLocal = function () {
    return function _getHeadTransformFromLocal(transformLocal) {
        return this._myCurrentHead.pp_convertTransformLocalToWorldQuat(transformLocal);
    };
}();
PP.CharacterCollisionSystem = class CharacterCollisionSystem {
    constructor() {
        this._myLastCheckRaycastsPerformed = 0;
        this._myCurrentFrameRaycastsPerformed = 0;
        this._myMaxFrameRaycastsPerformed = 0;
    }

    update(dt) {
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        this._myCurrentFrameRaycastsPerformed = 0;
        PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts = 0;
    }

    checkMovement(movement, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
        PP.CollisionCheckBridge.checkMovement(movement, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);

        this._myLastCheckRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts - this._myCurrentFrameRaycastsPerformed;
        this._myCurrentFrameRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }

    checkTeleportToPosition(teleportPosition, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
        // implemented outside class definition
    }

    checkTeleportToTransform(teleportTransformQuat, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
        PP.CollisionCheckBridge.checkTeleportToTransform(teleportTransformQuat, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);

        this._myLastCheckRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts - this._myCurrentFrameRaycastsPerformed;
        this._myCurrentFrameRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }

    checkTransform(checkTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
        PP.CollisionCheckBridge.checkTransform(checkTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);

        this._myLastCheckRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts - this._myCurrentFrameRaycastsPerformed;
        this._myCurrentFrameRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }

    updateSurfaceInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
        let currentFramePerformedRaycasts = this._myCurrentFrameRaycastsPerformed;

        this.updateGroundInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);
        this.updateCeilingInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);

        this._myLastCheckRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts - currentFramePerformedRaycasts;
        this._myCurrentFrameRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }

    updateGroundInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
        PP.CollisionCheckBridge.updateGroundInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);

        this._myLastCheckRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts - this._myCurrentFrameRaycastsPerformed;
        this._myCurrentFrameRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }

    updateCeilingInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults = new PP.CharacterCollisionResults()) {
        PP.CollisionCheckBridge.updateCeilingInfo(currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);

        this._myLastCheckRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts - this._myCurrentFrameRaycastsPerformed;
        this._myCurrentFrameRaycastsPerformed = PP.CollisionCheckBridge._myCollisionCheck._myTotalRaycasts;
        this._myMaxFrameRaycastsPerformed = Math.max(this._myCurrentFrameRaycastsPerformed, this._myMaxFrameRaycastsPerformed);
        outCharacterCollisionResults.myDebugResults._myRaycastsPerformed = this._myLastCheckRaycastsPerformed;
    }
};



// IMPLEMENTATION

PP.CharacterCollisionSystem.prototype.checkTeleportToPosition = function () {
    let teleportTransformQuat = PP.quat2_create();
    return function checkTeleportToPosition(teleportPosition, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults) {
        teleportTransformQuat.quat2_copy(currentTransformQuat);
        teleportTransformQuat.quat2_setPosition(teleportPosition);
        this.checkTeleportToTransform(teleportTransformQuat, currentTransformQuat, characterColliderSetup, prevCharacterCollisionResults, outCharacterCollisionResults);
    };
}();



Object.defineProperty(PP.CharacterCollisionSystem.prototype, "checkTeleportToPosition", { enumerable: false });
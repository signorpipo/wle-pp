import { RaycastParams, RaycastResults } from "../../../../../../cauldron/physics/physics_raycast_params";
import { PhysicsUtils } from "../../../../../../cauldron/physics/physics_utils";
import { vec3_create } from "../../../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../../../pp/globals";
import { PlayerLocomotionTeleportDetectionState } from "./player_locomotion_teleport_detection_state";

PlayerLocomotionTeleportDetectionState.prototype._isTeleportPositionVisible = function () {
    let playerUp = vec3_create();

    let offsetFeetTeleportPosition = vec3_create();
    let headTeleportPosition = vec3_create();
    return function _isTeleportPositionVisible(teleportPosition) {
        let isVisible = true;

        if (this._myTeleportParams.myDetectionParams.myTeleportFeetPositionMustBeVisible ||
            this._myTeleportParams.myDetectionParams.myTeleportHeadPositionMustBeVisible ||
            this._myTeleportParams.myDetectionParams.myTeleportHeadOrFeetPositionMustBeVisible) {

            playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);
            let isHeadVisible = false;
            let isFeetVisible = false;

            if (this._myTeleportParams.myDetectionParams.myTeleportHeadOrFeetPositionMustBeVisible ||
                this._myTeleportParams.myDetectionParams.myTeleportHeadPositionMustBeVisible) {
                let headheight = this._myTeleportParams.myPlayerHeadManager.getHeightHead();
                headTeleportPosition = teleportPosition.vec3_add(playerUp.vec3_scale(headheight, headTeleportPosition), headTeleportPosition);
                isHeadVisible = this._isPositionVisible(headTeleportPosition);
            } else {
                isHeadVisible = true;
            }

            if (this._myTeleportParams.myDetectionParams.myTeleportHeadOrFeetPositionMustBeVisible && isHeadVisible) {
                isFeetVisible = true;
            } else {
                if (this._myTeleportParams.myDetectionParams.myTeleportHeadOrFeetPositionMustBeVisible ||
                    (this._myTeleportParams.myDetectionParams.myTeleportFeetPositionMustBeVisible && isHeadVisible)) {
                    offsetFeetTeleportPosition = teleportPosition.vec3_add(playerUp.vec3_scale(this._myTeleportParams.myDetectionParams.myVisibilityCheckFeetPositionVerticalOffset, offsetFeetTeleportPosition), offsetFeetTeleportPosition);
                    isFeetVisible = this._isPositionVisible(offsetFeetTeleportPosition);
                } else {
                    isFeetVisible = true;
                }
            }

            isVisible = isHeadVisible && isFeetVisible;
        }

        return isVisible;
    };
}();

PlayerLocomotionTeleportDetectionState.prototype._isPositionVisible = function () {
    let playerUp = vec3_create();
    let standardUp = vec3_create(0, 1, 0);
    let standardForward = vec3_create(0, 0, 1);
    let referenceUp = vec3_create();
    let headPosition = vec3_create();
    let direction = vec3_create();
    let fixedRight = vec3_create();
    let fixedForward = vec3_create();
    let fixedUp = vec3_create();
    let raycastEndPosition = vec3_create();

    let raycastParams = new RaycastParams();
    let raycastResult = new RaycastResults();

    let objectsEqualCallback = (first, second) => first.pp_equals(second);
    return function _isPositionVisible(position) {
        let isVisible = true;

        playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

        let currentHead = this._myTeleportParams.myPlayerHeadManager.getHead();
        headPosition = currentHead.pp_getPosition(headPosition);
        direction = position.vec3_sub(headPosition, direction).vec3_normalize(direction);

        referenceUp.vec3_copy(standardUp);
        if (direction.vec3_angle(standardUp) < 0.0001) {
            referenceUp.vec3_copy(standardForward);
        }

        fixedRight = direction.vec3_cross(referenceUp, fixedRight);
        fixedUp = fixedRight.vec3_cross(direction, fixedUp);
        fixedForward.vec3_copy(direction);

        fixedUp.vec3_normalize(fixedUp);
        fixedForward.vec3_normalize(fixedForward);

        let checkPositions = this._getVisibilityCheckPositions(headPosition, fixedUp, fixedForward);

        let distance = headPosition.vec3_distance(position);

        for (let checkPosition of checkPositions) {
            raycastParams.myOrigin.vec3_copy(checkPosition);
            raycastParams.myDirection.vec3_copy(fixedForward);
            raycastParams.myDistance = distance;
            raycastParams.myPhysics = Globals.getPhysics(this._myTeleportParams.myEngine);

            raycastParams.myBlockLayerFlags.setMask(this._myTeleportParams.myDetectionParams.myVisibilityBlockLayerFlags.getMask());

            raycastParams.myObjectsToIgnore.pp_copy(this._myTeleportParams.myCollisionCheckParams.myHorizontalObjectsToIgnore);
            for (let objectToIgnore of this._myTeleportParams.myCollisionCheckParams.myVerticalObjectsToIgnore) {
                raycastParams.myObjectsToIgnore.pp_pushUnique(objectToIgnore, objectsEqualCallback);
            }

            raycastParams.myIgnoreHitsInsideCollision = true;

            raycastResult = PhysicsUtils.raycast(raycastParams, raycastResult);

            if (this._myTeleportParams.myDebugEnabled && this._myTeleportParams.myDebugVisibilityEnabled && Globals.isDebugEnabled(this._myTeleportParams.myEngine)) {
                Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawRaycast(0, raycastResult);
            }

            if (raycastResult.isColliding()) {
                raycastEndPosition = checkPosition.vec3_add(fixedForward.vec3_scale(distance, raycastEndPosition), raycastEndPosition);
                let hit = raycastResult.myHits.pp_first();

                if (this._myTeleportParams.myDetectionParams.myVisibilityCheckDistanceFromHitThreshold == 0 || hit.myPosition.vec3_distance(raycastEndPosition) > this._myTeleportParams.myDetectionParams.myVisibilityCheckDistanceFromHitThreshold + 0.00001) {
                    isVisible = false;
                    break;
                }
            }
        }

        return isVisible;
    };
}();

PlayerLocomotionTeleportDetectionState.prototype._getVisibilityCheckPositions = function () {
    let checkPositions = [];
    let cachedCheckPositions = [];
    let currentCachedCheckPositionIndex = 0;
    let _localGetCachedCheckPosition = function () {
        let item = null;
        while (cachedCheckPositions.length <= currentCachedCheckPositionIndex) {
            cachedCheckPositions.push(vec3_create());
        }

        item = cachedCheckPositions[currentCachedCheckPositionIndex];
        currentCachedCheckPositionIndex++;
        return item;
    };

    let currentDirection = vec3_create();
    return function _getVisibilityCheckPositions(position, up, forward) {
        checkPositions.length = 0;
        currentCachedCheckPositionIndex = 0;

        {
            let tempCheckPosition = _localGetCachedCheckPosition();
            tempCheckPosition.vec3_copy(position);
            checkPositions.push(tempCheckPosition);
        }

        let radiusStep = this._myTeleportParams.myDetectionParams.myVisibilityCheckRadius / this._myTeleportParams.myDetectionParams.myVisibilityCheckCircumferenceStepAmount;
        let sliceAngle = 360 / this._myTeleportParams.myDetectionParams.myVisibilityCheckCircumferenceSliceAmount;
        let currentStepRotation = 0;
        for (let i = 0; i < this._myTeleportParams.myDetectionParams.myVisibilityCheckCircumferenceStepAmount; i++) {
            let currentRadius = radiusStep * (i + 1);

            currentDirection = up.vec3_rotateAxis(currentStepRotation, forward, currentDirection);
            for (let j = 0; j < this._myTeleportParams.myDetectionParams.myVisibilityCheckCircumferenceSliceAmount; j++) {
                let tempCheckPosition = _localGetCachedCheckPosition();
                let sliceDirection = currentDirection.vec3_rotateAxis(sliceAngle * j, forward, tempCheckPosition);
                checkPositions.push(position.vec3_add(sliceDirection.vec3_scale(currentRadius, sliceDirection), sliceDirection));
            }

            currentStepRotation += this._myTeleportParams.myDetectionParams.myVisibilityCheckCircumferenceRotationPerStep;
        }

        return checkPositions;
    };
}();
import { PhysicsLayerFlags } from "../../../../../../cauldron/physics/physics_layer_flags";
import { RaycastParams, RaycastResults } from "../../../../../../cauldron/physics/physics_raycast_params";
import { PhysicsUtils } from "../../../../../../cauldron/physics/physics_utils";
import { XRUtils } from "../../../../../../cauldron/utils/xr_utils";
import { MouseButtonID } from "../../../../../../input/cauldron/mouse";
import { GamepadAxesID, GamepadButtonID } from "../../../../../../input/gamepad/gamepad_buttons";
import { quat2_create, quat_create, vec3_create, vec4_create } from "../../../../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../../../../pp/globals";
import { CollisionRuntimeParams } from "../../../../character_controller/collision/legacy/collision_check/collision_params";
import { PlayerLocomotionTeleportDetectionVisualizer } from "./player_locomotion_teleport_detection_visualizer";
import { PlayerLocomotionTeleportParable } from "./player_locomotion_teleport_parable";
import { PlayerLocomotionTeleportState } from "./player_locomotion_teleport_state";

export class PlayerLocomotionTeleportDetectionParams {

    constructor() {
        this.myMaxDistance = 0;
        this.myMaxHeightDifference = 0;
        this.myGroundAngleToIgnoreUpward = 0;
        // This can be used to make it so the teleport position is valid on a steeper angle when going downward by setting the higher value on the collision params
        // and then use this to specify that when going upward u want it to be less, basically to be able to teleprot down a cliff even on a steep ground
        // that would not let you go up
        this.myMustBeOnGround = false;

        this.myTeleportBlockLayerFlags = new PhysicsLayerFlags();
        this.myTeleportFloorLayerFlags = new PhysicsLayerFlags();

        this.myParableForwardMinAngleToBeValidUp = 30;
        this.myParableForwardMinAngleToBeValidDown = 0;

        this.myTeleportParableStartReferenceObject = null;

        // Used if reference is null
        this.myTeleportParableStartPositionOffset = vec3_create(0, -0.04, 0.08);
        this.myTeleportParableStartRotationOffset = vec3_create(30, 0, 0);

        this.myTeleportParableSpeed = 15;
        this.myTeleportParableGravity = -30;
        this.myTeleportParableStepLength = 0.25;

        this.myRotationOnUpMinStickIntensity = 0.5;
        this.myRotationOnUpEnabled = false;

        this.myTeleportFeetPositionMustBeVisible = false;
        this.myTeleportHeadPositionMustBeVisible = false;
        this.myTeleportHeadOrFeetPositionMustBeVisible = false; // Wins over previous parameters

        this.myVisibilityCheckRadius = 0.05;
        this.myVisibilityCheckFeetPositionVerticalOffset = 0.1;
        this.myVisibilityCheckDistanceFromHitThreshold = 0.1;
        this.myVisibilityCheckCircumferenceSliceAmount = 6;
        this.myVisibilityCheckCircumferenceStepAmount = 1;
        this.myVisibilityCheckCircumferenceRotationPerStep = 30;
        this.myVisibilityBlockLayerFlags = new PhysicsLayerFlags();
    }
}

export class PlayerLocomotionTeleportDetectionRuntimeParams {

    constructor() {
        this.myTeleportDetectionValid = false;
        this.myTeleportPositionValid = false;
        this.myTeleportSurfaceNormal = vec3_create();

        this.myParable = new PlayerLocomotionTeleportParable();
    }
}

export class PlayerLocomotionTeleportDetectionState extends PlayerLocomotionTeleportState {

    constructor(teleportParams, teleportRuntimeParams, locomotionRuntimeParams) {
        super(teleportParams, teleportRuntimeParams, locomotionRuntimeParams);

        this._myDetectionRuntimeParams = new PlayerLocomotionTeleportDetectionRuntimeParams();

        this._myVisualizer = new PlayerLocomotionTeleportDetectionVisualizer(this._myTeleportParams, this._myTeleportRuntimeParams, this._myDetectionRuntimeParams);

        this._myTeleportRotationOnUpNext = 0;

        //Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).add(new EasyTuneNumber("Parable Steps", this._myTeleportParams.myDetectionParams.myTeleportParableStepLength, 1, 3, 0.01, undefined, this._myTeleportParams.myEngine));
        //Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).add(new EasyTuneNumber("Parable Gravity", this._myTeleportParams.myDetectionParams.myTeleportParableGravity, 10, 3, undefined, undefined, this._myTeleportParams.myEngine));
        //Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).add(new EasyTuneNumber("Parable Speed", this._myTeleportParams.myDetectionParams.myTeleportParableSpeed, 10, 3, 0, undefined, this._myTeleportParams.myEngine));
        //Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).add(new EasyTuneNumber("Teleport Max Distance", this._myTeleportParams.myDetectionParams.myMaxDistance, 10, 3, 0, undefined, this._myTeleportParams.myEngine));

        this._myDestroyed = false;
    }

    start() {
        this._myLocomotionRuntimeParams.myIsTeleportDetecting = true;
        this._myTeleportRuntimeParams.myTeleportRotationOnUp = 0;
        this._myTeleportRotationOnUpNext = 0;

        this._myDetectionRuntimeParams.myParable.setSpeed(this._myTeleportParams.myDetectionParams.myTeleportParableSpeed);
        this._myDetectionRuntimeParams.myParable.setGravity(this._myTeleportParams.myDetectionParams.myTeleportParableGravity);
        this._myDetectionRuntimeParams.myParable.setStepLength(this._myTeleportParams.myDetectionParams.myTeleportParableStepLength);

        this._myTeleportParams.myPlayerTransformManager.resetReal(true, false, false);
        this._myTeleportParams.myPlayerTransformManager.resetHeadToReal();

        this._myVisualizer.start();
    }

    end() {
        this._myLocomotionRuntimeParams.myIsTeleportDetecting = false;
        this._myVisualizer.end();
    }

    update(dt, fsm) {
        this._detectTeleportPosition();

        this._myVisualizer.update(dt);

        if (this._confirmTeleport()) {
            if (this._myDetectionRuntimeParams.myTeleportPositionValid) {
                fsm.perform("teleport");
            } else {
                fsm.perform("cancel");
            }
        } else if (this._cancelTeleport()) {
            fsm.perform("cancel");
        }
    }

    _confirmTeleport() {
        let confirmTeleport = false;

        if (!XRUtils.isSessionActive(this._myTeleportParams.myEngine)) {
            if (Globals.getMouse(this._myTeleportParams.myEngine).isInsideView()) {
                confirmTeleport = Globals.getMouse(this._myTeleportParams.myEngine).isButtonPressEnd(MouseButtonID.MIDDLE);
            }
        } else {
            let axes = Globals.getGamepads(this._myTeleportParams.myEngine)[this._myTeleportParams.myHandedness].getAxesInfo(GamepadAxesID.THUMBSTICK).getAxes();
            if (axes.vec2_length() <= this._myTeleportParams.myStickIdleThreshold) {
                confirmTeleport = true;
            }
        }

        return confirmTeleport;
    }

    _cancelTeleport() {
        let cancelTeleport = false;

        if (!XRUtils.isSessionActive(this._myTeleportParams.myEngine)) {
            cancelTeleport = Globals.getMouse(this._myTeleportParams.myEngine).isButtonPressEnd(MouseButtonID.RIGHT) || !Globals.getMouse(this._myTeleportParams.myEngine).isInsideView();
        } else {
            cancelTeleport = Globals.getGamepads(this._myTeleportParams.myEngine)[this._myTeleportParams.myHandedness].getButtonInfo(GamepadButtonID.THUMBSTICK).isPressed();
        }

        return cancelTeleport;
    }

    _detectTeleportPosition() {
        //this._myDetectionRuntimeParams.myParable.setSpeed(Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).get("Parable Speed"));
        //this._myDetectionRuntimeParams.myParable.setGravity(Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).get("Parable Gravity"));
        //this._myDetectionRuntimeParams.myParable.setStepLength(Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).get("Parable Steps"));
        //this._myTeleportParams.myDetectionParams.myMaxDistance = Globals.getEasyTuneVariables(this._myTeleportParams.myEngine).get("Teleport Max Distance");

        if (XRUtils.isSessionActive(this._myTeleportParams.myEngine)) {
            this._detectTeleportRotationVR();
            this._detectTeleportPositionVR();
        } else {
            this._myTeleportRuntimeParams.myTeleportRotationOnUp = 0;
            this._myTeleportRotationOnUpNext = 0;
            this._detectTeleportPositionNonVR();
        }
    }

    destroy() {
        this._myDestroyed = true;

        this._myVisualizer.destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

PlayerLocomotionTeleportDetectionState.prototype._detectTeleportPositionNonVR = function () {
    let mousePosition = vec3_create();
    let mouseDirection = vec3_create();

    let playerUp = vec3_create();
    return function _detectTeleportPositionNonVR(dt) {
        this._myDetectionRuntimeParams.myTeleportPositionValid = false;
        this._myDetectionRuntimeParams.myTeleportDetectionValid = true;

        playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

        Globals.getMouse(this._myTeleportParams.myEngine).getOriginWorld(mousePosition);
        Globals.getMouse(this._myTeleportParams.myEngine).getDirectionWorld(mouseDirection);

        this._detectTeleportPositionParable(mousePosition, mouseDirection, playerUp);
    };
}();

PlayerLocomotionTeleportDetectionState.prototype._detectTeleportPositionVR = function () {
    let teleportStartTransformLocal = quat2_create();
    let teleportStartTransformWorld = quat2_create();

    let teleportStartPosition = vec3_create();
    let teleportDirection = vec3_create();

    let playerUp = vec3_create();
    let playerUpNegate = vec3_create();
    return function _detectTeleportPositionVR(dt) {
        this._myDetectionRuntimeParams.myTeleportPositionValid = false;
        this._myDetectionRuntimeParams.myTeleportDetectionValid = false;

        if (this._myTeleportParams.myDetectionParams.myTeleportParableStartReferenceObject == null) {
            let referenceObject = Globals.getPlayerObjects(this._myTeleportParams.myEngine).myHands[this._myTeleportParams.myHandedness];

            teleportStartTransformLocal.quat2_setPositionRotationDegrees(this._myTeleportParams.myDetectionParams.myTeleportParableStartPositionOffset, this._myTeleportParams.myDetectionParams.myTeleportParableStartRotationOffset);
            teleportStartTransformWorld = referenceObject.pp_convertTransformObjectToWorldQuat(teleportStartTransformLocal, teleportStartTransformWorld);
        } else {
            let referenceObject = this._myTeleportParams.myDetectionParams.myTeleportParableStartReferenceObject;

            referenceObject.pp_getTransformQuat(teleportStartTransformWorld);
        }

        teleportStartPosition = teleportStartTransformWorld.quat2_getPosition(teleportStartPosition);
        teleportDirection = teleportStartTransformWorld.quat2_getForward(teleportDirection);

        playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);
        playerUpNegate = playerUp.vec3_negate(playerUpNegate);

        if (teleportDirection.vec3_angle(playerUp) >= this._myTeleportParams.myDetectionParams.myParableForwardMinAngleToBeValidUp &&
            teleportDirection.vec3_angle(playerUpNegate) >= this._myTeleportParams.myDetectionParams.myParableForwardMinAngleToBeValidDown
        ) {
            this._myDetectionRuntimeParams.myTeleportDetectionValid = true;
        }

        if (this._myDetectionRuntimeParams.myTeleportDetectionValid) {
            this._detectTeleportPositionParable(teleportStartPosition, teleportDirection, playerUp);
        }
    };
}();

PlayerLocomotionTeleportDetectionState.prototype._detectTeleportPositionParable = function () {
    let parablePosition = vec3_create();
    let prevParablePosition = vec3_create();
    let parableFinalPosition = vec3_create();

    let raycastParams = new RaycastParams();
    let raycastResult = new RaycastResults();

    let parableHitPosition = vec3_create();
    let parableHitNormal = vec3_create();

    let verticalHitOrigin = vec3_create();
    let verticalHitDirection = vec3_create();

    let flatTeleportHorizontalHitNormal = vec3_create();
    let flatParableHitNormal = vec3_create();
    let flatParableDirectionNegate = vec3_create();

    let teleportCollisionRuntimeParams = new CollisionRuntimeParams();

    let objectsEqualCallback = (first, second) => first.pp_equals(second);
    return function _detectTeleportPositionParable(startPosition, direction, up) {
        this._myDetectionRuntimeParams.myParable.setStartPosition(startPosition);
        this._myDetectionRuntimeParams.myParable.setForward(direction);
        this._myDetectionRuntimeParams.myParable.setUp(up);

        let currentPositionIndex = 1;
        let positionFlatDistance = 0;
        let positionParableDistance = 0;
        prevParablePosition = this._myDetectionRuntimeParams.myParable.getPosition(currentPositionIndex - 1, prevParablePosition);

        raycastParams.myIgnoreHitsInsideCollision = true;
        raycastParams.myBlockLayerFlags.setMask(this._myTeleportParams.myDetectionParams.myTeleportBlockLayerFlags.getMask());
        raycastParams.myPhysics = Globals.getPhysics(this._myTeleportParams.myEngine);

        raycastParams.myObjectsToIgnore.pp_copy(this._myTeleportParams.myCollisionCheckParams.myHorizontalObjectsToIgnore);
        for (let objectToIgnore of this._myTeleportParams.myCollisionCheckParams.myVerticalObjectsToIgnore) {
            raycastParams.myObjectsToIgnore.pp_pushUnique(objectToIgnore, objectsEqualCallback);
        }

        let maxParableDistance = this._myTeleportParams.myDetectionParams.myMaxDistance * 2;

        do {
            parablePosition = this._myDetectionRuntimeParams.myParable.getPosition(currentPositionIndex, parablePosition);

            raycastParams.myOrigin.vec3_copy(prevParablePosition);
            raycastParams.myDirection = parablePosition.vec3_sub(prevParablePosition, raycastParams.myDirection);
            raycastParams.myDistance = raycastParams.myDirection.vec3_length();
            raycastParams.myDirection.vec3_normalize(raycastParams.myDirection);

            raycastResult = PhysicsUtils.raycast(raycastParams, raycastResult);

            if (this._myTeleportParams.myDebugEnabled && this._myTeleportParams.myDebugDetectEnabled && Globals.isDebugEnabled(this._myTeleportParams.myEngine)) {
                Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawRaycast(0, raycastResult);
            }

            prevParablePosition.vec3_copy(parablePosition);
            positionFlatDistance = parablePosition.vec3_sub(startPosition, parablePosition).vec3_removeComponentAlongAxis(up, parablePosition).vec3_length();
            positionParableDistance = this._myDetectionRuntimeParams.myParable.getDistance(currentPositionIndex);

            currentPositionIndex++;
        } while (
            positionFlatDistance <= this._myTeleportParams.myDetectionParams.myMaxDistance &&
            positionParableDistance <= maxParableDistance &&
            !raycastResult.isColliding());

        let maxParableDistanceOverFlatDistance = this._myDetectionRuntimeParams.myParable.getDistanceOverFlatDistance(this._myTeleportParams.myDetectionParams.myMaxDistance, maxParableDistance);

        let fixedPositionParableDistance = positionParableDistance;
        if (positionParableDistance > maxParableDistanceOverFlatDistance || positionParableDistance > maxParableDistance) {
            fixedPositionParableDistance = Math.min(maxParableDistanceOverFlatDistance, maxParableDistance);
        }

        this._myDetectionRuntimeParams.myParableDistance = fixedPositionParableDistance;

        let hitCollisionValid = false;

        let bottomCheckMaxLength = 100;

        if (raycastResult.isColliding()) {
            let hit = raycastResult.myHits.pp_first();

            let hitParableDistance = positionParableDistance - (raycastParams.myDistance - hit.myDistance);

            if (hitParableDistance <= fixedPositionParableDistance) {
                hitCollisionValid = true;

                this._myDetectionRuntimeParams.myParableDistance = hitParableDistance;

                teleportCollisionRuntimeParams.reset();
                this._myDetectionRuntimeParams.myTeleportPositionValid = this._isTeleportHitValid(hit, this._myTeleportRuntimeParams.myTeleportRotationOnUp, teleportCollisionRuntimeParams);

                this._myTeleportRuntimeParams.myTeleportPosition.vec3_copy(teleportCollisionRuntimeParams.myNewPosition);
                this._myDetectionRuntimeParams.myTeleportSurfaceNormal.vec3_copy(teleportCollisionRuntimeParams.myGroundNormal);

                parableHitPosition.vec3_copy(hit.myPosition);
                parableHitNormal.vec3_copy(hit.myNormal);

                if (!this._myDetectionRuntimeParams.myTeleportPositionValid && !this._myTeleportAsMovementFailed) {
                    verticalHitOrigin = hit.myPosition.vec3_add(hit.myNormal.vec3_scale(0.01, verticalHitOrigin), verticalHitOrigin);
                    verticalHitDirection = up.vec3_negate(verticalHitDirection);

                    raycastParams.myOrigin.vec3_copy(verticalHitOrigin);
                    raycastParams.myDirection.vec3_copy(verticalHitDirection);
                    raycastParams.myDistance = bottomCheckMaxLength;

                    raycastResult = PhysicsUtils.raycast(raycastParams, raycastResult);

                    if (this._myTeleportParams.myDebugEnabled && this._myTeleportParams.myDebugDetectEnabled && Globals.isDebugEnabled(this._myTeleportParams.myEngine)) {
                        Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawRaycast(0, raycastResult);
                    }

                    if (raycastResult.isColliding()) {
                        let hit = raycastResult.myHits.pp_first();

                        teleportCollisionRuntimeParams.reset();
                        this._myDetectionRuntimeParams.myTeleportPositionValid = this._isTeleportHitValid(hit, this._myTeleportRuntimeParams.myTeleportRotationOnUp, teleportCollisionRuntimeParams);

                        this._myTeleportRuntimeParams.myTeleportPosition.vec3_copy(teleportCollisionRuntimeParams.myNewPosition);
                        this._myDetectionRuntimeParams.myTeleportSurfaceNormal.vec3_copy(teleportCollisionRuntimeParams.myGroundNormal);

                        if (!this._myDetectionRuntimeParams.myTeleportPositionValid &&
                            !this._myTeleportAsMovementFailed &&
                            teleportCollisionRuntimeParams.myTeleportCanceled &&
                            teleportCollisionRuntimeParams.myIsCollidingHorizontally) {
                            flatTeleportHorizontalHitNormal = teleportCollisionRuntimeParams.myHorizontalCollisionHit.myNormal.vec3_removeComponentAlongAxis(up, flatTeleportHorizontalHitNormal);

                            if (!flatTeleportHorizontalHitNormal.vec3_isZero(0.00001)) {
                                flatTeleportHorizontalHitNormal.vec3_normalize(flatTeleportHorizontalHitNormal);

                                let backwardStep = this._myTeleportParams.myCollisionCheckParams.myRadius * 1.1;
                                raycastParams.myOrigin = verticalHitOrigin.vec3_add(flatTeleportHorizontalHitNormal.vec3_scale(backwardStep, raycastParams.myOrigin), raycastParams.myOrigin);
                                raycastParams.myDirection.vec3_copy(verticalHitDirection);
                                raycastParams.myDistance = bottomCheckMaxLength;

                                raycastResult = PhysicsUtils.raycast(raycastParams, raycastResult);

                                if (this._myTeleportParams.myDebugEnabled && this._myTeleportParams.myDebugDetectEnabled && Globals.isDebugEnabled(this._myTeleportParams.myEngine)) {
                                    Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawPoint(0, raycastParams.myOrigin, vec4_create(0, 0, 0, 1), 0.03);
                                    Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawRaycast(0, raycastResult);
                                }

                                if (raycastResult.isColliding()) {
                                    let hit = raycastResult.myHits.pp_first();

                                    teleportCollisionRuntimeParams.reset();
                                    this._myDetectionRuntimeParams.myTeleportPositionValid = this._isTeleportHitValid(hit, this._myTeleportRuntimeParams.myTeleportRotationOnUp, teleportCollisionRuntimeParams);

                                    this._myTeleportRuntimeParams.myTeleportPosition.vec3_copy(teleportCollisionRuntimeParams.myNewPosition);
                                    this._myDetectionRuntimeParams.myTeleportSurfaceNormal.vec3_copy(teleportCollisionRuntimeParams.myGroundNormal);
                                }
                            }
                        } else {
                            //console.error("2", this._myDetectionRuntimeParams.myTeleportPositionValid, this._myTeleportAsMovementFailed);
                        }

                        if (!this._myDetectionRuntimeParams.myTeleportPositionValid && !this._myTeleportAsMovementFailed) {
                            flatParableHitNormal = parableHitNormal.vec3_removeComponentAlongAxis(up, flatParableHitNormal);
                            if (!flatParableHitNormal.vec3_isZero(0.00001)) {
                                flatParableHitNormal.vec3_normalize(flatParableHitNormal);

                                let backwardStep = this._myTeleportParams.myCollisionCheckParams.myRadius * 1.1;
                                raycastParams.myOrigin = verticalHitOrigin.vec3_add(flatParableHitNormal.vec3_scale(backwardStep, raycastParams.myOrigin), raycastParams.myOrigin);
                                raycastParams.myDirection.vec3_copy(verticalHitDirection);
                                raycastParams.myDistance = bottomCheckMaxLength;

                                raycastResult = PhysicsUtils.raycast(raycastParams, raycastResult);

                                if (this._myTeleportParams.myDebugEnabled && this._myTeleportParams.myDebugDetectEnabled && Globals.isDebugEnabled(this._myTeleportParams.myEngine)) {
                                    Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawPoint(0, raycastParams.myOrigin, vec4_create(0, 0, 0, 1), 0.03);
                                    Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawRaycast(0, raycastResult);
                                }

                                if (raycastResult.isColliding()) {
                                    let hit = raycastResult.myHits.pp_first();

                                    teleportCollisionRuntimeParams.reset();
                                    this._myDetectionRuntimeParams.myTeleportPositionValid = this._isTeleportHitValid(hit, this._myTeleportRuntimeParams.myTeleportRotationOnUp, teleportCollisionRuntimeParams);

                                    this._myTeleportRuntimeParams.myTeleportPosition.vec3_copy(teleportCollisionRuntimeParams.myNewPosition);
                                    this._myDetectionRuntimeParams.myTeleportSurfaceNormal.vec3_copy(teleportCollisionRuntimeParams.myGroundNormal);
                                }
                            }
                        } else {
                            //console.error("3", this._myDetectionRuntimeParams.myTeleportPositionValid, this._myTeleportAsMovementFailed);
                        }

                        if (!this._myDetectionRuntimeParams.myTeleportPositionValid && !this._myTeleportAsMovementFailed) {
                            flatParableDirectionNegate = direction.vec3_negate(flatParableDirectionNegate).vec3_removeComponentAlongAxis(up, flatParableDirectionNegate).vec3_normalize(flatParableDirectionNegate);

                            if (!flatParableDirectionNegate.vec3_isZero(0.00001)) {
                                flatParableDirectionNegate.vec3_normalize(flatParableDirectionNegate);

                                let backwardStep = this._myTeleportParams.myCollisionCheckParams.myRadius * 1.1;
                                raycastParams.myOrigin = verticalHitOrigin.vec3_add(flatParableDirectionNegate.vec3_scale(backwardStep, raycastParams.myOrigin), raycastParams.myOrigin);
                                raycastParams.myDirection.vec3_copy(verticalHitDirection);
                                raycastParams.myDistance = bottomCheckMaxLength;

                                raycastResult = PhysicsUtils.raycast(raycastParams, raycastResult);

                                if (this._myTeleportParams.myDebugEnabled && this._myTeleportParams.myDebugDetectEnabled && Globals.isDebugEnabled(this._myTeleportParams.myEngine)) {
                                    Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawPoint(0, raycastParams.myOrigin, vec4_create(0, 0, 0, 1), 0.03);
                                    Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawRaycast(0, raycastResult);
                                }

                                if (raycastResult.isColliding()) {
                                    let hit = raycastResult.myHits.pp_first();

                                    teleportCollisionRuntimeParams.reset();
                                    this._myDetectionRuntimeParams.myTeleportPositionValid = this._isTeleportHitValid(hit, this._myTeleportRuntimeParams.myTeleportRotationOnUp, teleportCollisionRuntimeParams);

                                    this._myTeleportRuntimeParams.myTeleportPosition.vec3_copy(teleportCollisionRuntimeParams.myNewPosition);
                                    this._myDetectionRuntimeParams.myTeleportSurfaceNormal.vec3_copy(teleportCollisionRuntimeParams.myGroundNormal);
                                }
                            }
                        } else {
                            //console.error("4", this._myDetectionRuntimeParams.myTeleportPositionValid, this._myTeleportAsMovementFailed);
                        }
                    }
                } else {
                    //console.error("1", this._myDetectionRuntimeParams.myTeleportPositionValid, this._myTeleportAsMovementFailed);
                }
            }
        }

        //console.error("-");

        if (!hitCollisionValid) {
            parableFinalPosition = this._myDetectionRuntimeParams.myParable.getPositionByDistance(this._myDetectionRuntimeParams.myParableDistance, parableFinalPosition);

            verticalHitOrigin.vec3_copy(parableFinalPosition);
            verticalHitDirection = up.vec3_negate(verticalHitDirection);

            raycastParams.myOrigin.vec3_copy(verticalHitOrigin);
            raycastParams.myDirection.vec3_copy(verticalHitDirection);
            raycastParams.myDistance = bottomCheckMaxLength;

            raycastResult = PhysicsUtils.raycast(raycastParams, raycastResult);

            if (this._myTeleportParams.myDebugEnabled && this._myTeleportParams.myDebugDetectEnabled && Globals.isDebugEnabled(this._myTeleportParams.myEngine)) {
                Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawRaycast(0, raycastResult);
            }

            if (raycastResult.isColliding()) {
                let hit = raycastResult.myHits.pp_first();

                teleportCollisionRuntimeParams.reset();
                this._myDetectionRuntimeParams.myTeleportPositionValid = this._isTeleportHitValid(hit, this._myTeleportRuntimeParams.myTeleportRotationOnUp, teleportCollisionRuntimeParams);

                this._myTeleportRuntimeParams.myTeleportPosition.vec3_copy(teleportCollisionRuntimeParams.myNewPosition);
                this._myDetectionRuntimeParams.myTeleportSurfaceNormal.vec3_copy(teleportCollisionRuntimeParams.myGroundNormal);

                if (!this._myDetectionRuntimeParams.myTeleportPositionValid &&
                    !this._myTeleportAsMovementFailed &&
                    teleportCollisionRuntimeParams.myTeleportCanceled &&
                    teleportCollisionRuntimeParams.myIsCollidingHorizontally) {
                    flatTeleportHorizontalHitNormal = teleportCollisionRuntimeParams.myHorizontalCollisionHit.myNormal.vec3_removeComponentAlongAxis(up, flatTeleportHorizontalHitNormal);

                    if (!flatTeleportHorizontalHitNormal.vec3_isZero(0.00001)) {
                        flatTeleportHorizontalHitNormal.vec3_normalize(flatTeleportHorizontalHitNormal);

                        let backwardStep = this._myTeleportParams.myCollisionCheckParams.myRadius * 1.1;
                        raycastParams.myOrigin = verticalHitOrigin.vec3_add(flatTeleportHorizontalHitNormal.vec3_scale(backwardStep, raycastParams.myOrigin), raycastParams.myOrigin);
                        raycastParams.myDirection.vec3_copy(verticalHitDirection);
                        raycastParams.myDistance = bottomCheckMaxLength;

                        raycastResult = PhysicsUtils.raycast(raycastParams, raycastResult);

                        if (this._myTeleportParams.myDebugEnabled && this._myTeleportParams.myDebugDetectEnabled && Globals.isDebugEnabled(this._myTeleportParams.myEngine)) {
                            Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawPoint(0, raycastParams.myOrigin, vec4_create(0, 0, 0, 1), 0.03);
                            Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawRaycast(0, raycastResult);
                        }

                        if (raycastResult.isColliding()) {
                            let hit = raycastResult.myHits.pp_first();

                            teleportCollisionRuntimeParams.reset();
                            this._myDetectionRuntimeParams.myTeleportPositionValid = this._isTeleportHitValid(hit, this._myTeleportRuntimeParams.myTeleportRotationOnUp, teleportCollisionRuntimeParams);

                            this._myTeleportRuntimeParams.myTeleportPosition.vec3_copy(teleportCollisionRuntimeParams.myNewPosition);
                            this._myDetectionRuntimeParams.myTeleportSurfaceNormal.vec3_copy(teleportCollisionRuntimeParams.myGroundNormal);
                        }
                    }
                }

                if (!this._myDetectionRuntimeParams.myTeleportPositionValid && !this._myTeleportAsMovementFailed) {
                    flatParableDirectionNegate = direction.vec3_negate(flatParableDirectionNegate).vec3_removeComponentAlongAxis(up, flatParableDirectionNegate).vec3_normalize(flatParableDirectionNegate);

                    if (!flatParableDirectionNegate.vec3_isZero(0.00001)) {
                        flatParableDirectionNegate.vec3_normalize(flatParableDirectionNegate);

                        let backwardStep = this._myTeleportParams.myCollisionCheckParams.myRadius * 1.1;
                        raycastParams.myOrigin = verticalHitOrigin.vec3_add(flatParableDirectionNegate.vec3_scale(backwardStep, raycastParams.myOrigin), raycastParams.myOrigin);
                        raycastParams.myDirection.vec3_copy(verticalHitDirection);
                        raycastParams.myDistance = bottomCheckMaxLength;

                        raycastResult = PhysicsUtils.raycast(raycastParams, raycastResult);

                        if (this._myTeleportParams.myDebugEnabled && this._myTeleportParams.myDebugDetectEnabled && Globals.isDebugEnabled(this._myTeleportParams.myEngine)) {
                            Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawPoint(0, raycastParams.myOrigin, vec4_create(0, 0, 0, 1), 0.03);
                            Globals.getDebugVisualManager(this._myTeleportParams.myEngine).drawRaycast(0, raycastResult);
                        }

                        if (raycastResult.isColliding()) {
                            let hit = raycastResult.myHits.pp_first();

                            teleportCollisionRuntimeParams.reset();
                            this._myDetectionRuntimeParams.myTeleportPositionValid = this._isTeleportHitValid(hit, this._myTeleportRuntimeParams.myTeleportRotationOnUp, teleportCollisionRuntimeParams);

                            this._myTeleportRuntimeParams.myTeleportPosition.vec3_copy(teleportCollisionRuntimeParams.myNewPosition);
                            this._myDetectionRuntimeParams.myTeleportSurfaceNormal.vec3_copy(teleportCollisionRuntimeParams.myGroundNormal);
                        }
                    }
                }
            }
        }
    };
}();

PlayerLocomotionTeleportDetectionState.prototype._detectTeleportRotationVR = function () {
    let axesVec3 = vec3_create();
    let axesForward = vec3_create(0, 0, 1);
    let axesUp = vec3_create(0, 1, 0);
    return function _detectTeleportRotationVR(dt) {
        let axes = Globals.getGamepads(this._myTeleportParams.myEngine)[this._myTeleportParams.myHandedness].getAxesInfo(GamepadAxesID.THUMBSTICK).getAxes();

        if (axes.vec2_length() > this._myTeleportParams.myDetectionParams.myRotationOnUpMinStickIntensity) {
            this._myTeleportRuntimeParams.myTeleportRotationOnUp = this._myTeleportRotationOnUpNext;

            axesVec3.vec3_set(axes[0], 0, axes[1]);
            this._myTeleportRotationOnUpNext = axesVec3.vec3_angleSigned(axesForward, axesUp);
        }

        if (!this._myTeleportParams.myDetectionParams.myRotationOnUpEnabled) {
            this._myTeleportRuntimeParams.myTeleportRotationOnUp = 0;
            this._myTeleportRotationOnUpNext = 0;
        }
    };
}();

PlayerLocomotionTeleportDetectionState.prototype._isTeleportHitValid = function () {
    let raycastParams = new RaycastParams();
    let raycastResult = new RaycastResults();

    let playerUp = vec3_create();
    let objectsEqualCallback = (first, second) => first.pp_equals(second);
    return function _isTeleportHitValid(hit, rotationOnUp, checkTeleportCollisionRuntimeParams) {
        let isValid = false;

        this._myTeleportAsMovementFailed = false;

        if (hit.isValid() && !hit.myInsideCollision) {
            playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

            if (true || hit.myNormal.vec3_isConcordant(playerUp)) {
                // #TODO When the flags on the physx will be available just check that the hit object physx has the floor flag

                raycastParams.myIgnoreHitsInsideCollision = true;
                raycastParams.myBlockLayerFlags.setMask(this._myTeleportParams.myDetectionParams.myTeleportFloorLayerFlags.getMask());
                raycastParams.myPhysics = Globals.getPhysics(this._myTeleportParams.myEngine);

                raycastParams.myObjectsToIgnore.pp_copy(this._myTeleportParams.myCollisionCheckParams.myHorizontalObjectsToIgnore);
                for (let objectToIgnore of this._myTeleportParams.myCollisionCheckParams.myVerticalObjectsToIgnore) {
                    raycastParams.myObjectsToIgnore.pp_pushUnique(objectToIgnore, objectsEqualCallback);
                }

                let distanceToCheck = 0.01;
                raycastParams.myOrigin = hit.myPosition.vec3_add(hit.myNormal.vec3_scale(distanceToCheck, raycastParams.myOrigin), raycastParams.myOrigin);
                raycastParams.myDirection = hit.myNormal.vec3_negate(raycastParams.myDirection);
                raycastParams.myDistance = distanceToCheck * 1.25;
                raycastParams.myDirection.vec3_normalize(raycastParams.myDirection);

                raycastResult = PhysicsUtils.raycast(raycastParams, raycastResult);

                if (raycastResult.isColliding()) {
                    let floorHit = raycastResult.myHits.pp_first();
                    if (floorHit.myObject.pp_equals(hit.myObject)) {
                        isValid = this._isTeleportPositionValid(hit.myPosition, rotationOnUp, checkTeleportCollisionRuntimeParams);
                    }
                }
            }
        }

        return isValid;
    };
}();

PlayerLocomotionTeleportDetectionState.prototype._isTeleportPositionValid = function () {
    let playerUp = vec3_create();
    let feetTransformQuat = quat2_create();
    let feetRotationQuat = quat_create();
    let feetPosition = vec3_create();
    let differenceOnUpVector = vec3_create();
    let teleportCheckCollisionRuntimeParams = new CollisionRuntimeParams();
    return function _isTeleportPositionValid(teleportPosition, rotationOnUp, checkTeleportCollisionRuntimeParams) {
        let isValid = false;

        let positionVisible = this._isTeleportPositionVisible(teleportPosition);

        if (positionVisible) {
            playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

            feetTransformQuat = this._myTeleportParams.myPlayerHeadManager.getTransformFeetQuat(feetTransformQuat);
            feetPosition = feetTransformQuat.quat2_getPosition(feetPosition);
            if (rotationOnUp != 0) {
                feetRotationQuat = feetTransformQuat.quat2_getRotationQuat(feetRotationQuat);
                feetRotationQuat = feetRotationQuat.quat_rotateAxis(rotationOnUp, playerUp, feetRotationQuat);
                feetTransformQuat.quat2_setPositionRotationQuat(feetPosition, feetRotationQuat);
            }

            let differenceOnUp = teleportPosition.vec3_sub(feetPosition, differenceOnUpVector).vec3_componentAlongAxis(playerUp, differenceOnUpVector).vec3_length();

            if (differenceOnUp < this._myTeleportParams.myDetectionParams.myMaxHeightDifference + 0.00001) {
                let teleportCheckValid = false;
                teleportCheckCollisionRuntimeParams.copy(this._myLocomotionRuntimeParams.myCollisionRuntimeParams);

                if (!this._myTeleportParams.myPerformTeleportAsMovement) {
                    this._checkTeleport(teleportPosition, feetTransformQuat, teleportCheckCollisionRuntimeParams, checkTeleportCollisionRuntimeParams);
                } else {
                    this._checkTeleportAsMovement(teleportPosition, feetTransformQuat, teleportCheckCollisionRuntimeParams, checkTeleportCollisionRuntimeParams);
                }

                if (!teleportCheckCollisionRuntimeParams.myTeleportCanceled) {
                    teleportCheckValid = true;
                }

                if (teleportCheckValid && (!this._myTeleportParams.myDetectionParams.myMustBeOnGround || teleportCheckCollisionRuntimeParams.myIsOnGround)) {

                    let groundAngleValid = true;
                    let isTeleportingUpward = teleportCheckCollisionRuntimeParams.myNewPosition.vec3_isFartherAlongAxis(feetPosition, playerUp);
                    if (isTeleportingUpward) {
                        groundAngleValid = teleportCheckCollisionRuntimeParams.myGroundAngle < this._myTeleportParams.myDetectionParams.myGroundAngleToIgnoreUpward + 0.0001;
                    }

                    if (groundAngleValid) {
                        isValid = true;
                    }
                }
            }
        }

        return isValid;
    };
}();
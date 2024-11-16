import { Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { PhysicsLayerFlags } from "../../../../../cauldron/physics/physics_layer_flags.js";
import { RaycastBlockColliderType } from "../../../../../cauldron/physics/physics_raycast_params.js";
import { Quaternion, Quaternion2, Vector3 } from "../../../../../cauldron/type_definitions/array_type_definitions.js";
import { XRUtils } from "../../../../../cauldron/utils/xr_utils.js";
import { quat2_create, quat_create, vec3_create, vec4_create } from "../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../../pp/globals.js";
import { CollisionCheckBridge } from "../../../character_controller/collision/collision_check_bridge.js";
import { CollisionCheckUtils } from "../../../character_controller/collision/legacy/collision_check/collision_check_utils.js";
import { CollisionCheckParams, CollisionRuntimeParams } from "../../../character_controller/collision/legacy/collision_check/collision_params.js";
import { PlayerHeadManager } from "./player_head_manager.js";
import { PlayerLocomotionTeleport } from "./teleport/player_locomotion_teleport.js";

export enum PlayerTransformManagerSyncFlag {
    BODY_COLLIDING = 0,
    HEAD_COLLIDING = 1,
    FAR = 2,
    FLOATING = 3,
    HEIGHT_COLLIDING = 4
}

export class PlayerTransformManagerParams {

    public myPlayerHeadManager!: PlayerHeadManager;

    public myMovementCollisionCheckParams!: CollisionCheckParams;

    /** Can be left `null` and will be generated from the `myMovementCollisionCheckParams` */
    public myTeleportCollisionCheckParams: CollisionCheckParams | null = null;
    public myTeleportCollisionCheckParamsCopyFromMovement: boolean = false;
    public myTeleportCollisionCheckParamsCheck360: boolean = false;
    public myTeleportCollisionCheckParamsGroundAngleToIgnore: number | null = null;



    /** 
     * This make it so if the valid position after syncing with real has some snapping, the real position too will also adjust to it  
     * For example, with this off, if you move in real life over ramps the real life height will not change to avoid motion sickness,
     * but if you prefer to also go up and down, you need to enable this
     */
    public myApplyRealToValidAdjustmentsToRealPositionToo: boolean = false;

    /**
     * Does not prevent (for now at least) from colliding if you stand up and your head goes inside the ceiling, in that case the height
     * is not adjusted to prevent that and the view will be occluded
     */
    public myPreventRealFromColliding: boolean = false;

    public myAlwaysSyncPositionWithReal: boolean = false;
    public myAlwaysSyncHeadPositionWithReal: boolean = false;

    public myIgnoreUpwardMovementToRealIfValidOnGround: boolean = false;

    /**
     * If the real position is far, body will be considered colliding  
     * If the body is colliding, the floating check is skipped
     */
    public readonly mySyncEnabledFlagMap: Map<PlayerTransformManagerSyncFlag, boolean> = new Map();
    public readonly mySyncPositionFlagMap: Map<PlayerTransformManagerSyncFlag, boolean> = new Map();
    public readonly mySyncPositionHeadFlagMap: Map<PlayerTransformManagerSyncFlag, boolean> = new Map();
    public readonly mySyncRotationFlagMap: Map<PlayerTransformManagerSyncFlag, boolean> = new Map();
    public readonly mySyncHeightFlagMap: Map<PlayerTransformManagerSyncFlag, boolean> = new Map();



    /** Used to make the character fall if it's leaning too much */
    public myIsLeaningValidAboveDistance: boolean = false;
    public myLeaningValidDistance: number = 0;

    /** Settings for both hop and lean */

    /**
     * With {@link myRealMovementAllowVerticalAdjustments} enabled these "ValidIfVerticalMovement" flags does not work properly,
     * since the adjustments can add vertical movement just due to snaps
     */
    public myIsFloatingValidIfVerticalMovement: boolean = false;
    public myIsFloatingValidIfVerticalMovementAndRealOnGround: boolean = false; // #TODO This is more an override
    public myIsFloatingValidIfRealOnGround: boolean = false;
    public myIsFloatingValidIfSteepGround: boolean = false;
    public myIsFloatingValidIfVerticalMovementAndSteepGround: boolean = false;

    public myFloatingSplitCheckEnabled: boolean = false;
    public myFloatingSplitCheckMinLength: number | null = null;
    public myFloatingSplitCheckMaxLength: number | null = null;
    public myFloatingSplitCheckStepEqualLength: boolean = false;
    public myFloatingSplitCheckStepEqualLengthMinLength: number = 0;


    /**
     * Can be useful if using the exact height is giving you issues like too close too ceilings, or view occluded too easily
     */
    public myExtraHeight: number = 0;

    public myMaxDistanceFromRealToSyncEnabled: boolean = false;

    /**
     * Max distance to resync valid with real  
     * If your real position is farther the body will be considered as colliding
     */
    public myMaxDistanceFromRealToSync: number = 0;

    public myMaxDistanceFromHeadRealToSyncEnabled: boolean = false;

    /**
     * Max distance to resync valid head with real head  
     * If you real head is farther the head will be considered as colliding
     * Vertically, the max distance can be higher if the current height is higher
     * Since the head might have been reset to feet
     */
    public myMaxDistanceFromHeadRealToSync: number = 0;

    /**
     * If this is enabled, the head will do this max amount of steps to reach the real head, but every step might be longer
     * than the safe max step  
     * This means that the movement to reach the real head might not be as precise and can allow clipping through objects,
     * but it will be more performant
     * 
     * Even though the max distance from the head can be already used to limit the amount of steps, when the head is reset
     * to feet, it's allowed to perform the whole height movement, even if above the max distance  
     * If this adjustment movement is too heavy, this can limit it, even though might cause the valid head to move to invalid places
     */
    public myMaxHeadToRealHeadSteps: number | null = null;



    public myHeadRadius: number = 0;
    public myHeadHeight: number = 0;
    public readonly myHeadCollisionBlockLayerFlags: PhysicsLayerFlags = new PhysicsLayerFlags();
    public myHeadCollisionObjectsToIgnore: Readonly<Object3D>[] = [];
    public myHeadCollisionBlockColliderType: RaycastBlockColliderType = RaycastBlockColliderType.BOTH;

    /**
     * Can be used if when resetting to feet there might be dynamic objects which you would like to exclude for this reset check,  
     * but you might still to normally avoid, for example for object you can grab and therefore put close to the head, which are not a big deal  
     * and you can accept being able to see inside them when resetting the head, but not for normal movements
     */
    public myHeadCollisionBlockLayerFlagsForResetToFeet: PhysicsLayerFlags | null = null;



    public myRotateOnlyIfSynced: boolean = false;
    public myResetRealResetRotationIfUpChanged: boolean = false;



    /**
     * This make it so the head must be able to reach from the feet to the real head, sort of  
     * like you were teleported in a space squashed to your feet and then have to get up  
     * It can be used to prevent being able to see through the floor, since when the head is reset to the real one  
     * if the real one is on the other side of the above floor there would be no collision  
     * The risk is that, if you have objects close to your feet, your head could get stuck on them while trying to "get up"  
     * and the view could be obscured thinking you have those objects in your view
     */
    public myResetHeadToFeetInsteadOfReal: boolean = false;

    /** This other flag is to fix the above issue, doing the "squash and get up" only if the head is not reachable normally  
        The above issue can still happen but should be more rare, only if you teleport to a place where there could be garbage stuff */
    public myResetHeadToFeetInsteadOfRealOnlyIfRealNotReachable: boolean = false;

    public myResetHeadToFeetMoveTowardReal: boolean = false;

    /* Can be used to specify that the head should reset a bit above the actual feet level, so to avoid small objects that could very frequently  
       happen to be close to the floor */
    public myResetHeadToFeetUpOffset: number = 0;

    public myResetHeadToFeetGroudnAngleIgnoreEnabled: boolean = false;

    public myResetHeadToRealMinDistance: number = 0;




    // #TODO Set valid if head synced (head manager) (not sure what I meant with this?)

    /** This true means that the real movement should also snap on ground or fix the vertical to pop from it  
        You may want this if u want that while real moving u can also climb stairs */
    public myRealMovementAllowVerticalAdjustments: boolean = false;

    // #TODO Real movement apply vertical snap or not (other option to apply gravity) 
    // (gravity inside this class?) only when movement is applied not for head only)

    public myUpdatePositionValid: boolean = false;
    public myUpdatePositionHeadValid: boolean = false;
    public myUpdateRealPositionValid: boolean = false;
    public myUpdateRealPositionHeadValid: boolean = false;

    public myMinHeight: number | null = null;
    public myMaxHeight: number | null = null;



    /**  
     * These and the callbacks does not makes much sense  
     * The colliding things are made to not sync the real position, but if the height is below and the body is not colliding  
     * There is not reason not to resync, even if u put the real back on the valid the height will stay the same  
     * If someone puts the head in the ground, there is no way for me to resync and make the head pop out sadly  
     * In this case u either accept that u can move without seeing, or stop moving until the obscure is on
     */

    /** Could be ignored and added with the custom check callback if u want it */
    public myIsBodyCollidingWhenHeightBelowValue: number | null = null;

    /** Could be ignored and added with the custom check callback if u want it */
    public myIsBodyCollidingWhenHeightAboveValue: number | null = null;


    public myIsBodyCollidingExtraCheckCallback: ((playerTransformManager: PlayerTransformManager) => boolean) | null = null;
    public myIsLeaningExtraCheckCallback: ((playerTransformManager: PlayerTransformManager) => boolean) | null = null;
    public myIsHoppingExtraCheckCallback: ((playerTransformManager: PlayerTransformManager) => boolean) | null = null;
    public myIsFarExtraCheckCallback: ((playerTransformManager: PlayerTransformManager) => boolean) | null = null;



    public myAllowUpdateValidToRealWhenBlurred: boolean = false;

    public myResetToValidOnEnterSession: boolean = false;
    public myResetToValidOnExitSession: boolean = false;
    public myResetToValidOnSessionHiddenEnd: boolean = false;

    public myAlwaysResetRealPositionNonVR: boolean = false;
    public myAlwaysResetRealRotationNonVR: boolean = false;
    public myAlwaysResetRealHeightNonVR: boolean = false;

    public myAlwaysResetRealPositionVR: boolean = false;
    public myAlwaysResetRealRotationVR: boolean = false;
    public myAlwaysResetRealHeightVR: boolean = false;

    public myNeverResetRealPositionNonVR: boolean = false;
    public myNeverResetRealRotationNonVR: boolean = false;
    public myNeverResetRealHeightNonVR: boolean = false;

    public myResetRealHeightNonVROnExitSession: boolean = false;

    public myNeverResetRealPositionVR: boolean = false;
    public myNeverResetRealRotationVR: boolean = false;
    public myNeverResetRealHeightVR: boolean = false;

    public myResetRealOnMove: boolean = false;
    public myResetRealOnTeleport: boolean = false;

    public mySyncPositionDisabled: boolean = false;

    public myDebugEnabled: boolean = false;

    public readonly myEngine: Readonly<WonderlandEngine>;

    constructor(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!) {
        this.myEngine = engine;
    }
}

// #TODO Sliding info, surface info, update
export class PlayerTransformManager {

    private readonly _myParams: PlayerTransformManagerParams;

    private readonly _myRealMovementCollisionCheckParams!: CollisionCheckParams;
    private readonly _myHeadCollisionCheckParams !: CollisionCheckParams;

    private readonly _myCollisionRuntimeParams = new CollisionRuntimeParams();

    private _myPlayerLocomotionTeleport: PlayerLocomotionTeleport | null = null;

    private readonly _myValidPosition: Vector3 = vec3_create();
    private readonly _myValidRotationQuat: Quaternion = quat_create();
    private _myValidHeight: number = 0;
    private readonly _myValidPositionHead: Vector3 = vec3_create();
    private readonly _myValidPositionHeadBackupForResetToFeet: Vector3 = vec3_create();

    private _myIsBodyColliding: boolean = false;
    private _myIsHeadColliding: boolean = false;
    private _myIsLeaning: boolean = false;
    private _myIsHopping: boolean = false;
    private _myIsFar: boolean = false;
    private _myIsHeightColliding: boolean = false;

    private readonly _myLastValidMovementDirection: Vector3 = vec3_create();
    private _myIsPositionValid: boolean = false;
    private _myIsPositionHeadValid: boolean = false;
    private _myIsRealPositionValid: boolean = false;
    private _myIsRealPositionHeadValid: boolean = false;

    private _myResetRealOnHeadSynced: boolean = false;

    private _myResetHeadToFeetDirty: boolean = false;
    private _myResetHeadToFeetOnNextUpdateValidToReal: boolean = false;

    private _myVisibilityChangeEventListener: ((event: XRSessionEvent) => any) | null = null;

    private _mySessionHasBeenHidden: boolean = false;

    private _myActive: boolean = true;

    private _myDestroyed: boolean = false;

    constructor(params: PlayerTransformManagerParams) {
        this._myParams = params;

        this._generateRealMovementParamsFromMovementParams();

        if (this._myParams.myTeleportCollisionCheckParamsCopyFromMovement) {
            this._generateTeleportParamsFromMovementParams();
        }

        this._setupHeadCollisionCheckParams();
    }

    public start(): void {
        this.resetToReal(true, true, true, true, false, true);

        this._myActive = false;
        this.setActive(true);
    }

    public getParams(): PlayerTransformManagerParams {
        return this._myParams;
    }

    public setActive(active: boolean): void {
        if (this._myActive != active) {
            this._myActive = active;

            if (this._myActive) {
                XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, true, this._myParams.myEngine);
            } else {
                if (this._myVisibilityChangeEventListener != null) {
                    XRUtils.getSession(this._myParams.myEngine)?.removeEventListener("visibilitychange", this._myVisibilityChangeEventListener);
                }

                XRUtils.unregisterSessionStartEndEventListeners(this, this._myParams.myEngine);
            }
        }
    }

    // #TODO update should be before to check the new valid transform and if the head new transform is fine
    // then update movements, so that they will use the proper transform
    // pre/post update?
    // For sliding if previous frame no horizontal movement then reset sliding on pre update
    // In generale capire come fare per risolvere i problemi quando c'è un move solo verticale che sputtana i dati dello sliding precedente
    // che servono per far slidare bene anche dopo, magari un flag per dire non aggiornare le cose relative al movimento orizzontale
    // o un move check solo verticale
    public update(dt: number): void {
        if (!this._myActive) return;

        // #TODO This should update ground and ceiling info but not sliding info    

        if (this._myResetRealOnHeadSynced) {
            if (this.getPlayerHeadManager().isSynced()) {
                this._myResetRealOnHeadSynced = false;
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
                        !this._myParams.myNeverResetRealHeightNonVR && this._myParams.myResetRealHeightNonVROnExitSession,
                        true,
                        true);
                }
            }
        }

        this._updateValidToReal(dt);
        this._updatePositionsValid(dt);

        this._updateCollisionHeight();

        if (this._myParams.myDebugEnabled && Globals.isDebugEnabled(this._myParams.myEngine)) {
            this._debugUpdate(dt);
        }
    }

    // #TODO Collision runtime will copy the result, so that u can use that for later reference like if it was sliding
    // Maybe there should be a way to sum all the things happened for proper movement in a summary runtime
    // or maybe the move should be done once per frame, or at least in theory
    // Move should move the valid transform, but also move the player object so that they head, even is colliding is dragged with it
    // Also teleport, should get the difference from previous and move the player object, this will keep the relative position head-to-valid
    private static readonly _moveSV =
        {
            fixedMovement: vec3_create(),
            transformQuat: quat2_create(),
            transformUp: vec3_create(),
            fixedVerticalMovement: vec3_create()
        };
    public move(movement: Readonly<Vector3>, forceMove: boolean = false, useHighestHeight: boolean = false, outCollisionRuntimeParams: CollisionRuntimeParams | null = null): void {
        if (this._myPlayerLocomotionTeleport != null) {
            this._myPlayerLocomotionTeleport.cancelTeleport();
        }

        this.checkMovement(movement, undefined, undefined, useHighestHeight, this._myCollisionRuntimeParams);

        if (outCollisionRuntimeParams != null) {
            outCollisionRuntimeParams.copy(this._myCollisionRuntimeParams);
        }

        const fixedMovement = PlayerTransformManager._moveSV.fixedMovement;
        if (!forceMove) {
            fixedMovement.vec3_copy(this._myCollisionRuntimeParams.myFixedMovement);
        } else {
            fixedMovement.vec3_copy(movement);
        }

        if (!fixedMovement.vec3_isZero(0.00001)) {
            this._myValidPosition.vec3_add(fixedMovement, this._myValidPosition);
            this.getPlayerHeadManager().moveFeet(fixedMovement);

            const fixedVerticalMovement = PlayerTransformManager._moveSV.fixedVerticalMovement;
            const transformQuat = PlayerTransformManager._moveSV.transformQuat;
            const transformUp = PlayerTransformManager._moveSV.transformUp;
            this.getTransformQuat(transformQuat);
            transformQuat.quat2_getUp(transformUp);
            if (fixedMovement.vec3_removeComponentAlongAxis(transformUp, fixedVerticalMovement).vec3_length() > 0.0001) {
                fixedMovement.vec3_normalize(this._myLastValidMovementDirection);
            }
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
    }

    private static readonly _checkMovementSV =
        {
            currentTransformQuat: quat2_create()
        };
    public checkMovement(movement: Readonly<Vector3>, currentTransformQuat?: Readonly<Quaternion2>, collisionCheckParams?: Readonly<CollisionCheckParams>, useHighestHeight: boolean = false, outCollisionRuntimeParams?: CollisionRuntimeParams): CollisionRuntimeParams {
        this._updateCollisionHeight(useHighestHeight);

        if (currentTransformQuat == null) {
            currentTransformQuat = PlayerTransformManager._checkMovementSV.currentTransformQuat;
            this.getTransformQuat(currentTransformQuat);
        }

        if (collisionCheckParams == null) {
            collisionCheckParams = this._myParams.myMovementCollisionCheckParams;
        }

        if (outCollisionRuntimeParams == null) {
            outCollisionRuntimeParams = new CollisionRuntimeParams();
            outCollisionRuntimeParams.copy(this._myCollisionRuntimeParams);
        }

        CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).move(movement, currentTransformQuat, collisionCheckParams, outCollisionRuntimeParams);

        this._updateCollisionHeight();

        return outCollisionRuntimeParams;
    }

    private static readonly _teleportPositionSV =
        {
            teleportTransformQuat: quat2_create()
        };
    public teleportPosition(teleportPosition: Readonly<Vector3>, forceTeleport: boolean = false, forceTeleportSkipCollisionCheck: boolean = false, useHighestHeight: boolean = false, outCollisionRuntimeParams: CollisionRuntimeParams | null = null): void {
        const teleportTransformQuat = PlayerTransformManager._teleportPositionSV.teleportTransformQuat;
        this.getTransformQuat(teleportTransformQuat);
        teleportTransformQuat.quat2_setPosition(teleportPosition);
        this.teleportTransformQuat(teleportTransformQuat, forceTeleport, forceTeleportSkipCollisionCheck, useHighestHeight, outCollisionRuntimeParams);
    }

    private static readonly _teleportPositionRotationQuatSV =
        {
            teleportTransformQuat: quat2_create()
        };
    public teleportPositionRotationQuat(teleportPosition: Readonly<Vector3>, rotationQuat: Quaternion, forceTeleport: boolean = false, forceTeleportSkipCollisionCheck: boolean = false, useHighestHeight: boolean = false, outCollisionRuntimeParams: CollisionRuntimeParams | null = null): void {
        const teleportTransformQuat = PlayerTransformManager._teleportPositionRotationQuatSV.teleportTransformQuat;
        this.getTransformQuat(teleportTransformQuat);
        teleportTransformQuat.quat2_setPositionRotationQuat(teleportPosition, rotationQuat);
        this.teleportTransformQuat(teleportTransformQuat, forceTeleport, forceTeleportSkipCollisionCheck, useHighestHeight, outCollisionRuntimeParams);
    }

    private static readonly _teleportTransformQuatSV =
        {
            currentPosition: vec3_create(),
            teleportPosition: vec3_create(),
            teleportRotation: quat_create(),
            fixedMovement: vec3_create(),
            transformQuat: quat2_create(),
            transformUp: vec3_create(),
            flatTeleportForward: vec3_create()
        };
    public teleportTransformQuat(teleportTransformQuat: Readonly<Quaternion2>, forceTeleport: boolean = false, forceTeleportSkipCollisionCheck: boolean = false, useHighestHeight: boolean = false, outCollisionRuntimeParams: CollisionRuntimeParams | null = null): void {
        if (this._myPlayerLocomotionTeleport != null) {
            this._myPlayerLocomotionTeleport.cancelTeleport();
        }

        if (!forceTeleport || !forceTeleportSkipCollisionCheck) {
            this.checkTeleportToTransformQuat(teleportTransformQuat, undefined, undefined, useHighestHeight, this._myCollisionRuntimeParams);
        }

        if (outCollisionRuntimeParams != null) {
            outCollisionRuntimeParams.copy(this._myCollisionRuntimeParams);
        }

        const currentPosition = PlayerTransformManager._teleportTransformQuatSV.currentPosition;
        const teleportPosition = PlayerTransformManager._teleportTransformQuatSV.teleportPosition;
        const teleportRotation = PlayerTransformManager._teleportTransformQuatSV.teleportRotation;
        this.getPosition(currentPosition);
        teleportTransformQuat.quat2_getPosition(teleportPosition);
        teleportTransformQuat.quat2_getRotationQuat(teleportRotation);

        const fixedMovement = PlayerTransformManager._teleportTransformQuatSV.fixedMovement;
        fixedMovement.vec3_zero();
        if (!forceTeleport) {
            if (!this._myCollisionRuntimeParams.myTeleportCanceled) {
                this._myCollisionRuntimeParams.myFixedTeleportPosition.vec3_sub(currentPosition, fixedMovement);
            }
        } else {
            teleportPosition.vec3_sub(currentPosition, fixedMovement);
        }

        if (!this._myCollisionRuntimeParams.myTeleportCanceled || forceTeleport) {
            this._myValidRotationQuat.quat_copy(teleportRotation);
            this.getPlayerHeadManager().setRotationFeetQuat(teleportRotation);
        }

        if (!fixedMovement.vec3_isZero(0.00001)) {
            this._myValidPosition.vec3_add(fixedMovement, this._myValidPosition);
            this.getPlayerHeadManager().moveFeet(fixedMovement);

            const transformQuat = PlayerTransformManager._teleportTransformQuatSV.transformQuat;
            const transformUp = PlayerTransformManager._teleportTransformQuatSV.transformUp;
            const flatTeleportForward = PlayerTransformManager._teleportTransformQuatSV.flatTeleportForward;
            this.getTransformQuat(transformQuat);
            transformQuat.quat2_getUp(transformUp);
            if (this._myCollisionRuntimeParams.myTeleportForward.vec3_removeComponentAlongAxis(transformUp, flatTeleportForward).vec3_length() > 0.0001) {
                flatTeleportForward.vec3_normalize(this._myLastValidMovementDirection);
            }
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
    }

    private static readonly _checkTeleportToTransformQuatSV =
        {
            currentTransformQuat: quat2_create(),
            currentPosition: vec3_create(),
            teleportPosition: vec3_create(),
            teleportRotation: quat_create(),
            rotatedTransformQuat: quat2_create()
        };
    public checkTeleportToTransformQuat(teleportTransformQuat: Readonly<Quaternion2>, currentTransformQuat?: Readonly<Quaternion2>, collisionCheckParams?: Readonly<CollisionCheckParams>, useHighestHeight: boolean = false, outCollisionRuntimeParams?: CollisionRuntimeParams): CollisionRuntimeParams {
        this._updateCollisionHeight(useHighestHeight);

        if (currentTransformQuat == null) {
            currentTransformQuat = PlayerTransformManager._checkTeleportToTransformQuatSV.currentTransformQuat;
            this.getTransformQuat(currentTransformQuat);
        }

        const currentPosition = PlayerTransformManager._checkTeleportToTransformQuatSV.currentPosition;
        const teleportPosition = PlayerTransformManager._checkTeleportToTransformQuatSV.teleportPosition;
        const teleportRotation = PlayerTransformManager._checkTeleportToTransformQuatSV.teleportRotation;
        const rotatedTransformQuat = PlayerTransformManager._checkTeleportToTransformQuatSV.rotatedTransformQuat;
        currentTransformQuat.quat2_getPosition(currentPosition);
        teleportTransformQuat.quat2_getPosition(teleportPosition);
        teleportTransformQuat.quat2_getRotationQuat(teleportRotation);
        rotatedTransformQuat.quat2_setPositionRotationQuat(currentPosition, teleportRotation);

        if (collisionCheckParams == null) {
            collisionCheckParams = this._myParams.myTeleportCollisionCheckParams!;
        }

        if (outCollisionRuntimeParams == null) {
            outCollisionRuntimeParams = new CollisionRuntimeParams();
            outCollisionRuntimeParams.copy(this._myCollisionRuntimeParams);
        }

        CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).teleport(teleportPosition, rotatedTransformQuat, collisionCheckParams, outCollisionRuntimeParams);

        this._updateCollisionHeight();

        return outCollisionRuntimeParams;
    }

    public checkTransformQuat(transformQuat: Readonly<Quaternion2>, collisionCheckParams?: Readonly<CollisionCheckParams>, outCollisionRuntimeParams?: CollisionRuntimeParams): CollisionRuntimeParams {
        if (collisionCheckParams == null) {
            collisionCheckParams = this._myParams.myMovementCollisionCheckParams;
        }

        if (outCollisionRuntimeParams == null) {
            outCollisionRuntimeParams = new CollisionRuntimeParams();
            outCollisionRuntimeParams.copy(this._myCollisionRuntimeParams);
        }

        CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).positionCheck(true, transformQuat, collisionCheckParams, outCollisionRuntimeParams);

        return outCollisionRuntimeParams;
    }

    /** Quick way to force teleport to a position and reset the real to this */
    public forceTeleportAndReset(teleportPosition: Readonly<Vector3>, teleportRotationQuat: Readonly<Quaternion>, forceTeleportSkipCollisionCheck: boolean = false): void {
        this.teleportPositionRotationQuat(teleportPosition, teleportRotationQuat, true, forceTeleportSkipCollisionCheck);

        this.resetReal(true, true, undefined, undefined, undefined, true);
    }

    public rotateQuat(rotationQuat: Readonly<Quaternion>): void {
        this._myValidRotationQuat.quat_rotateQuat(rotationQuat, this._myValidRotationQuat);
        this.getPlayerHeadManager().rotateFeetQuat(rotationQuat);
    }

    private static readonly _setRotationQuatSV =
        {
            rotationToPerform: quat_create()
        };
    public setRotationQuat(rotationQuat: Readonly<Quaternion>): void {
        const rotationToPerform = PlayerTransformManager._setRotationQuatSV.rotationToPerform;
        this._myValidRotationQuat.quat_rotationToQuat(rotationQuat, rotationToPerform);
        this.rotateQuat(rotationToPerform);
    }

    private static readonly _setHeightSV =
        {
            transformQuat: quat_create(),
            transformUp: vec3_create(),
            rotationQuat: quat_create(),
            horizontalDirection: vec3_create(),
            collisionRuntimeParams: new CollisionRuntimeParams()
        };
    public setHeight(height: number, forceSet: boolean = false): void {
        const fixedHeight = Math.pp_clamp(height, this._myParams.myMinHeight ?? undefined, this._myParams.myMaxHeight ?? undefined);
        const previousHeight = this.getHeight();

        this._myValidHeight = fixedHeight;
        this._updateCollisionHeight();

        const transformQuat = PlayerTransformManager._setHeightSV.transformQuat;
        const transformUp = PlayerTransformManager._setHeightSV.transformUp;
        const rotationQuat = PlayerTransformManager._setHeightSV.rotationQuat;
        const horizontalDirection = PlayerTransformManager._setHeightSV.horizontalDirection;
        this.getTransformQuat(transformQuat);
        transformQuat.quat2_getUp(transformUp);
        transformQuat.quat2_getRotationQuat(rotationQuat);
        this._myLastValidMovementDirection.vec3_removeComponentAlongAxis(transformUp, horizontalDirection);

        if (!horizontalDirection.vec3_isZero(0.00001)) {
            horizontalDirection.vec3_normalize(horizontalDirection);
            rotationQuat.quat_setUp(transformUp, horizontalDirection);
            transformQuat.quat2_setRotationQuat(rotationQuat);
        }

        const collisionRuntimeParams = PlayerTransformManager._setHeightSV.collisionRuntimeParams;
        collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
        const debugBackup = this._myParams.myMovementCollisionCheckParams.myDebugEnabled;
        this._myParams.myMovementCollisionCheckParams.myDebugEnabled = false;
        CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).positionCheck(true, transformQuat, this._myParams.myMovementCollisionCheckParams, collisionRuntimeParams);
        this._myParams.myMovementCollisionCheckParams.myDebugEnabled = debugBackup;

        if (collisionRuntimeParams.myIsPositionOk || forceSet) {
            this.getPlayerHeadManager().setHeightHead(this.getHeight(), true);
        } else {
            this._myValidHeight = previousHeight;
        }

        this._updateCollisionHeight();
    }

    public getPlayer(): Object3D {
        return this._myParams.myPlayerHeadManager.getPlayer();
    }

    public getHead(): Object3D {
        return this._myParams.myPlayerHeadManager.getHead();
    }

    public getTransformQuat(): Quaternion2;
    public getTransformQuat<T extends Quaternion2>(outTransformQuat: T): T;
    public getTransformQuat<T extends Quaternion2>(outTransformQuat: Quaternion2 | T = quat2_create()): Quaternion2 | T {
        return outTransformQuat.quat2_setPositionRotationQuat(this.getPosition(this._myValidPosition), this.getRotationQuat(this._myValidRotationQuat));
    }

    public getPosition(): Vector3;
    public getPosition<T extends Vector3>(outPosition: T): T;
    public getPosition<T extends Vector3>(outPosition: Vector3 | T = vec3_create()): Vector3 | T {
        return outPosition.vec3_copy(this._myValidPosition);
    }

    public getRotationQuat(): Quaternion;
    public getRotationQuat<T extends Quaternion>(outRotationQuat: T): T;
    public getRotationQuat<T extends Quaternion>(outRotationQuat: Quaternion | T = quat_create()): Quaternion | T {
        return outRotationQuat.quat_copy(this._myValidRotationQuat);
    }

    public getPositionHead(): Vector3;
    public getPositionHead<T extends Vector3>(outPosition: T): T;
    public getPositionHead<T extends Vector3>(outPosition: Vector3 | T = vec3_create()): Vector3 | T {
        return outPosition.vec3_copy(this._myValidPositionHead);
    }

    public getTransformHeadQuat(): Quaternion2;
    public getTransformHeadQuat<T extends Quaternion2>(outTransformQuat: T): T;
    public getTransformHeadQuat<T extends Quaternion2>(outTransformQuat: Quaternion2 | T = quat2_create()): Quaternion2 | T {
        return outTransformQuat.quat2_setPositionRotationQuat(this.getPositionHead(this._myValidPositionHead), this.getRotationQuat(this._myValidRotationQuat));
    }

    public getHeight(): number {
        return this._myValidHeight;
    }

    public getTransformRealQuat(outTransformQuat: Quaternion2 = quat2_create()): Quaternion2 {
        return this.getPlayerHeadManager().getTransformFeetQuat(outTransformQuat);
    }

    public getPositionReal(): Vector3;
    public getPositionReal<T extends Vector3>(outPosition: T): T;
    public getPositionReal<T extends Vector3>(outPosition: Vector3 | T = vec3_create()): Vector3 | T {
        return this.getPlayerHeadManager().getPositionFeet(outPosition);
    }

    public getRotationRealQuat(): Quaternion;
    public getRotationRealQuat<T extends Quaternion>(outRotationQuat: T): T;
    public getRotationRealQuat<T extends Quaternion>(outRotationQuat: Quaternion | T = quat_create()): Quaternion | T {
        return this.getPlayerHeadManager().getRotationFeetQuat(outRotationQuat);
    }

    public getPositionHeadReal(): Vector3;
    public getPositionHeadReal<T extends Vector3>(outPosition: T): T;
    public getPositionHeadReal<T extends Vector3>(outPosition: Vector3 | T = vec3_create()): Vector3 | T {
        return this.getPlayerHeadManager().getPositionHead(outPosition);
    }

    public getTransformHeadRealQuat(): Quaternion2;
    public getTransformHeadRealQuat<T extends Quaternion2>(outTransformQuat: T): T;
    public getTransformHeadRealQuat<T extends Quaternion2>(outTransformQuat: Quaternion2 | T = quat2_create()): Quaternion2 | T {
        return this.getPlayerHeadManager().getTransformHeadQuat(outTransformQuat);
    }

    public getHeightReal(): number {
        return this._myParams.myPlayerHeadManager.getHeightHead();
    }

    public isSynced(syncFlagMap: Map<PlayerTransformManagerSyncFlag, boolean> | null = null): boolean {
        const isBodyColliding = this.isBodyColliding() && (syncFlagMap == null || syncFlagMap.get(PlayerTransformManagerSyncFlag.BODY_COLLIDING));
        const isHeadColliding = this.isHeadColliding() && (syncFlagMap == null || syncFlagMap.get(PlayerTransformManagerSyncFlag.HEAD_COLLIDING));
        const isFar = this.isFar() && (syncFlagMap == null || syncFlagMap.get(PlayerTransformManagerSyncFlag.FAR));
        const isFloating = this.isFloating() && (syncFlagMap == null || syncFlagMap.get(PlayerTransformManagerSyncFlag.FLOATING));
        const isHeightColliding = this.isHeightColliding() && (syncFlagMap == null || syncFlagMap.get(PlayerTransformManagerSyncFlag.HEIGHT_COLLIDING));
        return !isBodyColliding && !isHeadColliding && !isFar && !isFloating && !isHeightColliding;
    }

    private static readonly _resetRealSV =
        {
            realUp: vec3_create(),
            validUp: vec3_create(),
            position: vec3_create(),
            rotationQuat: quat_create(),

            positionHeadReal: vec3_create(),
            validPositionHeadBackupForResetToFeet: vec3_create()
        };
    public resetReal(resetPosition = true, resetRotation = false, resetHeight = false, resetHeadToReal = true, updateValidToReal = false, ignoreResetHeadMinDistance = false): void {
        const playerHeadManager = this.getPlayerHeadManager();

        const position = PlayerTransformManager._resetRealSV.position;
        if (resetPosition) {
            playerHeadManager.teleportPositionFeet(this.getPosition(position));
        }

        const realUp = PlayerTransformManager._resetRealSV.realUp;
        const rotationQuat = PlayerTransformManager._resetRealSV.rotationQuat;
        const validUp = PlayerTransformManager._resetRealSV.validUp;
        this.getPlayerHeadManager().getRotationFeetQuat(rotationQuat).quat_getUp(realUp);
        this.getRotationQuat(rotationQuat).quat_getUp(validUp);

        if (resetRotation || (realUp.vec3_angle(validUp) > Math.PP_EPSILON_DEGREES && this._myParams.myResetRealResetRotationIfUpChanged)) {
            playerHeadManager.setRotationFeetQuat(this.getRotationQuat(rotationQuat), false);
        }

        if (resetHeight) {
            playerHeadManager.setHeightHead(this.getHeight(), true);
        }

        if (resetHeadToReal) {
            const positionHeadReal = PlayerTransformManager._resetRealSV.positionHeadReal;
            this.getPositionHeadReal(positionHeadReal);
            const distanceToRealHead = this._myValidPositionHead.vec3_distance(positionHeadReal);
            if (ignoreResetHeadMinDistance || distanceToRealHead >= this._myParams.myResetHeadToRealMinDistance) {
                if (this._myParams.myResetHeadToFeetInsteadOfRealOnlyIfRealNotReachable) {
                    this._myResetHeadToFeetOnNextUpdateValidToReal = true;
                    const validPositionHeadBackupForResetToFeet = PlayerTransformManager._resetRealSV.validPositionHeadBackupForResetToFeet;
                    validPositionHeadBackupForResetToFeet.vec3_copy(this._myValidPositionHead);
                    this.resetHeadToFeet();
                    this._myValidPositionHeadBackupForResetToFeet.vec3_copy(validPositionHeadBackupForResetToFeet);
                } else if (this._myParams.myResetHeadToFeetInsteadOfReal) {
                    this.resetHeadToFeet();
                } else {
                    this.resetHeadToReal();
                }
            }
        }

        if (updateValidToReal) {
            this._updateValidToReal(0);
        }
    }

    public updateValidToReal(): void {
        this._updateValidToReal(0);
    }

    public updateValidHeadToRealHead(): void {
        this._updateValidHeadToRealHead(0);
    }

    public updateValidHeadToRealHeadIfNeeded(): void {
        if (this._myResetHeadToFeetDirty) {
            this._updateValidHeadToRealHead(0);
        }
    }

    public resetToReal(resetPosition = true, resetRotation = true, resetHeight = true, resetPositionHead = true, updateValidToReal = false, resetToPlayerInsteadOfHead = false): void {
        if (resetPosition) {
            if (resetToPlayerInsteadOfHead) {
                this.getPlayerHeadManager().getPlayer().pp_getPosition(this._myValidPosition);
            } else {
                this.getPositionReal(this._myValidPosition);
            }
        }

        if (resetPositionHead) {
            if (!this._myParams.myAlwaysSyncPositionWithReal) {
                this.getPositionHeadReal(this._myValidPositionHead);
                this._myValidPositionHeadBackupForResetToFeet.vec3_copy(this._myValidPositionHead);

                this._myResetHeadToFeetOnNextUpdateValidToReal = false;
                this._myResetHeadToFeetDirty = false;
            }
        }

        if (resetRotation) {
            if (resetToPlayerInsteadOfHead) {
                this.getPlayerHeadManager().getPlayer().pp_getRotationQuat(this._myValidRotationQuat);
            } else {
                this.getRotationRealQuat(this._myValidRotationQuat);
            }
        }

        if (resetHeight) {
            this._myValidHeight = Math.pp_clamp(this.getHeightReal(), this._myParams.myMinHeight ?? undefined, this._myParams.myMaxHeight ?? undefined);
        }

        if (updateValidToReal) {
            this._updateValidToReal(0);
        }
    }

    public resetHeadToReal(): void {
        if (!this._myParams.myAlwaysSyncPositionWithReal) {
            this.getPositionHeadReal(this._myValidPositionHead);
            this._myValidPositionHeadBackupForResetToFeet.vec3_copy(this._myValidPositionHead);

            this._myResetHeadToFeetOnNextUpdateValidToReal = false;
            this._myResetHeadToFeetDirty = false;
        }
    }

    private static readonly _resetHeadToFeetSV =
        {
            transformQuat: quat2_create(),
            headUp: vec3_create()
        };
    public resetHeadToFeet(): void {
        this.getPosition(this._myValidPositionHead);

        const transformQuat = PlayerTransformManager._resetHeadToFeetSV.transformQuat;
        const headUp = PlayerTransformManager._resetHeadToFeetSV.headUp;
        this.getTransformHeadQuat(transformQuat);
        transformQuat.quat2_getUp(headUp);
        this._myValidPositionHead.vec3_add(headUp.vec3_scale(this._myHeadCollisionCheckParams.myHeight / 2 + 0.00001 + this._myParams.myResetHeadToFeetUpOffset, headUp), this._myValidPositionHead);
        this._myValidPositionHeadBackupForResetToFeet.vec3_copy(this._myValidPositionHead);

        this._myResetHeadToFeetDirty = true;
    }

    public isBodyColliding(): boolean {
        return this._myIsBodyColliding;
    }

    public isHeadColliding(): boolean {
        return this._myIsHeadColliding;
    }

    public isFloating(): boolean {
        return this.isLeaning() || this.isHopping();
    }

    public isLeaning(): boolean {
        return this._myIsLeaning;
    }

    public isHopping(): boolean {
        return this._myIsHopping;
    }

    public isFar(): boolean {
        return this._myIsFar;
    }

    public isHeightColliding(): boolean {
        return this._myIsHeightColliding;
    }

    private static readonly _getDistanceToRealSV =
        {
            position: vec3_create(),
            realPosition: vec3_create()
        };
    public getDistanceToReal(): number {
        const realPosition = PlayerTransformManager._getDistanceToRealSV.realPosition;
        const position = PlayerTransformManager._getDistanceToRealSV.position;

        this.getPositionReal(realPosition);
        return realPosition.vec3_distance(this.getPosition(position));
    }

    private static readonly _getDistanceToRealHeadSV =
        {
            position: vec3_create(),
            realPosition: vec3_create()
        };
    public getDistanceToRealHead(): number {
        const realPosition = PlayerTransformManager._getDistanceToRealSV.realPosition;
        const position = PlayerTransformManager._getDistanceToRealSV.position;

        this.getPositionHeadReal(realPosition);
        return realPosition.vec3_distance(this.getPositionHead(position));
    }

    public getPlayerHeadManager(): PlayerHeadManager {
        return this._myParams.myPlayerHeadManager;
    }

    public getMovementCollisionCheckParams(): CollisionCheckParams {
        return this._myParams.myMovementCollisionCheckParams;
    }

    public getTeleportCollisionCheckParams(): CollisionCheckParams {
        return this._myParams.myTeleportCollisionCheckParams!;
    }

    public getHeadCollisionCheckParams(): CollisionCheckParams {
        return this._myHeadCollisionCheckParams!;
    }

    /**
     * This should be used anytime the movement `CollisionCheckParams` are updated,
     * so that the other `CollisionCheckParams` are synced with that (if needed)
     * 
     * The head `CollisionCheckParams` are another set of params which are not synced automatically
     * If you want to apply some changes made to the movement params to the head ones too, for example
     * a new object to ignore, you need to also manually update them
     */
    public movementCollisionCheckParamsUpdated(): void {
        if (this._myParams.myTeleportCollisionCheckParamsCopyFromMovement) {
            this._generateTeleportParamsFromMovementParams();
        }

        this._generateRealMovementParamsFromMovementParams();
    }

    public getCollisionRuntimeParams(): CollisionRuntimeParams {
        return this._myCollisionRuntimeParams;
    }

    public isPositionValid(): boolean {
        return this._myIsPositionValid;
    }

    public isPositionHeadValid(): boolean {
        return this._myIsPositionHeadValid;
    }

    public isPositionRealValid(): boolean {
        return this._myIsRealPositionValid;
    }

    public isPositionHeadRealValid(): boolean {
        return this._myIsRealPositionHeadValid;
    }

    public setPlayerLocomotionTeleport(playerLocomotionTeleport: PlayerLocomotionTeleport | null): void {
        this._myPlayerLocomotionTeleport = playerLocomotionTeleport;
    }

    private _updateCollisionHeight(useHighestHeight: boolean = false): void {
        const validHeight = this.getHeight();
        const realHeight = this.getHeightReal();

        const highestHeight = Math.max(validHeight, realHeight);

        this._myParams.myMovementCollisionCheckParams.myHeight = (useHighestHeight ? highestHeight : validHeight) + this._myParams.myExtraHeight;
        this._myParams.myTeleportCollisionCheckParams!.myHeight = this._myParams.myMovementCollisionCheckParams.myHeight;

        this._myRealMovementCollisionCheckParams.myHeight = Math.max(realHeight, this._myParams.myMinHeight ?? -Number.MAX_VALUE) + this._myParams.myExtraHeight;
    }

    private _setupHeadCollisionCheckParams(): void {
        (this._myHeadCollisionCheckParams as CollisionCheckParams) = new CollisionCheckParams();
        const params = this._myHeadCollisionCheckParams;

        params.myRadius = this._myParams.myHeadRadius;
        params.myDistanceFromFeetToIgnore = 0;
        params.myDistanceFromHeadToIgnore = 0;

        params.mySplitMovementEnabled = true;
        params.mySplitMovementMaxLengthEnabled = true;
        params.mySplitMovementMaxLength = params.myRadius * 0.75;
        params.mySplitMovementMinLengthEnabled = true;
        params.mySplitMovementMinLength = params.mySplitMovementMaxLength;

        if (this._myParams.myMaxHeadToRealHeadSteps != null) {
            params.mySplitMovementMaxStepsEnabled = true;
            params.mySplitMovementMaxSteps = this._myParams.myMaxHeadToRealHeadSteps;
            params.mySplitMovementMaxLengthLastStepCanBeLonger = true;
        }

        params.mySplitMovementStopWhenHorizontalMovementCanceled = true;
        params.mySplitMovementStopWhenVerticalMovementCanceled = true;
        params.mySplitMovementStopWhenVerticalMovementReduced = true;

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

        params.myHeight = this._myParams.myHeadHeight;
        params.myPositionOffsetLocal.vec3_set(0, -params.myHeight / 2, 0);

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
        params.myCheckVerticalBothDirection = true;
        params.myCheckVerticalPositionBothDirection = true;

        params.myGroundCircumferenceAddCenter = true;
        params.myGroundCircumferenceSliceAmount = 6;
        params.myGroundCircumferenceStepAmount = 2;
        params.myGroundCircumferenceRotationPerStep = 30;
        params.myFeetRadius = params.myRadius;

        params.myHorizontalBlockLayerFlags.copy(this._myParams.myHeadCollisionBlockLayerFlags);
        params.myHorizontalObjectsToIgnore.pp_copy(this._myParams.myHeadCollisionObjectsToIgnore);
        params.myHorizontalBlockColliderType = this._myParams.myHeadCollisionBlockColliderType;
        params.myVerticalBlockLayerFlags.copy(this._myParams.myHeadCollisionBlockLayerFlags);
        params.myVerticalObjectsToIgnore.pp_copy(this._myParams.myHeadCollisionObjectsToIgnore);
        params.myVerticalBlockColliderType = this._myParams.myHeadCollisionBlockColliderType;

        params.mySlidingEnabled = false;

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

        params.myDebugEnabled = false;

        params.myDebugHorizontalMovementEnabled = false;
        params.myDebugHorizontalPositionEnabled = false;
        params.myDebugVerticalMovementEnabled = false;
        params.myDebugVerticalPositionEnabled = false;
        params.myDebugSlidingEnabled = false;
        params.myDebugGroundInfoEnabled = false;
        params.myDebugCeilingInfoEnabled = false;
        params.myDebugRuntimeParamsEnabled = false;
        params.myDebugMovementEnabled = false;
    }

    private _generateTeleportParamsFromMovementParams(): void {
        if (this._myParams.myTeleportCollisionCheckParams == null) {
            this._myParams.myTeleportCollisionCheckParams = new CollisionCheckParams();
        }

        if (this._myParams.myTeleportCollisionCheckParamsCheck360) {
            this._myParams.myTeleportCollisionCheckParams = CollisionCheckUtils.generate360TeleportParamsFromMovementParams(this._myParams.myMovementCollisionCheckParams, this._myParams.myTeleportCollisionCheckParams);
        } else {
            this._myParams.myTeleportCollisionCheckParams.copy(this._myParams.myMovementCollisionCheckParams);
        }

        if (this._myParams.myTeleportCollisionCheckParamsGroundAngleToIgnore != null) {
            this._myParams.myTeleportCollisionCheckParams.myGroundAngleToIgnore = this._myParams.myTeleportCollisionCheckParamsGroundAngleToIgnore;
        }
    }

    private _generateRealMovementParamsFromMovementParams(): void {
        if (this._myRealMovementCollisionCheckParams == null) {
            (this._myRealMovementCollisionCheckParams as CollisionCheckParams) = new CollisionCheckParams();
        }

        const params = this._myRealMovementCollisionCheckParams;
        params.copy(this._myParams.myMovementCollisionCheckParams);

        params.mySplitMovementStopWhenHorizontalMovementCanceled = true;
        params.mySplitMovementStopWhenVerticalMovementCanceled = true;
        params._myInternalSplitMovementMaxStepsDisabled = true;

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

        params.myDebugEnabled = false;

        params.myDebugHorizontalMovementEnabled = false;
        params.myDebugHorizontalPositionEnabled = false;
        params.myDebugVerticalMovementEnabled = false;
        params.myDebugVerticalPositionEnabled = false;
        params.myDebugSlidingEnabled = false;
        params.myDebugGroundInfoEnabled = false;
        params.myDebugCeilingInfoEnabled = false;
        params.myDebugRuntimeParamsEnabled = false;
        params.myDebugMovementEnabled = false;
    }

    private _onXRSessionStart(manualCall: boolean, session: XRSession): void {
        if (!manualCall) {
            if (this._myActive) {
                if (this._myParams.myResetToValidOnEnterSession) {
                    this._myResetRealOnHeadSynced = true;
                }
            }
        }

        this._myVisibilityChangeEventListener = function (this: PlayerTransformManager, event: XRSessionEvent) {
            if (event.session.visibilityState == "hidden") {
                this._mySessionHasBeenHidden = true;
            } else if (this._mySessionHasBeenHidden) {
                this._mySessionHasBeenHidden = false;

                if (this._myParams.myResetToValidOnSessionHiddenEnd) {
                    this._myResetRealOnHeadSynced = true;
                }
            }
        }.bind(this);

        session.addEventListener("visibilitychange", this._myVisibilityChangeEventListener);
    }

    private _onXRSessionEnd(): void {
        if (this._myActive) {
            if (this._myParams.myResetToValidOnExitSession) {
                this._myResetRealOnHeadSynced = true;
            }
        }

        this._myVisibilityChangeEventListener = null;
    }

    private static readonly _updatePositionsValidSV =
        {
            transformQuat: quat2_create(),
            collisionRuntimeParams: new CollisionRuntimeParams(),
            headCollisionRuntimeParams: new CollisionRuntimeParams(),
            transformUp: vec3_create(),
            horizontalDirection: vec3_create(),
            rotationQuat: quat_create()
        };
    private _updatePositionsValid(dt: number): void {
        this._updateCollisionHeight();

        if (this._myParams.myUpdatePositionValid) {
            const transformQuat = PlayerTransformManager._updatePositionsValidSV.transformQuat;
            const transformUp = PlayerTransformManager._updatePositionsValidSV.transformUp;
            const rotationQuat = PlayerTransformManager._updatePositionsValidSV.rotationQuat;
            const horizontalDirection = PlayerTransformManager._updatePositionsValidSV.horizontalDirection;
            this.getTransformQuat(transformQuat);
            transformQuat.quat2_getUp(transformUp);
            transformQuat.quat2_getRotationQuat(rotationQuat);
            this._myLastValidMovementDirection.vec3_removeComponentAlongAxis(transformUp, horizontalDirection);

            if (!horizontalDirection.vec3_isZero(0.00001)) {
                horizontalDirection.vec3_normalize(horizontalDirection);
                rotationQuat.quat_setUp(transformUp, horizontalDirection);
                transformQuat.quat2_setRotationQuat(rotationQuat);
            }

            const collisionRuntimeParams = PlayerTransformManager._updatePositionsValidSV.collisionRuntimeParams;
            collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
            const debugBackup = this._myParams.myMovementCollisionCheckParams.myDebugEnabled;
            this._myParams.myMovementCollisionCheckParams.myDebugEnabled = false;
            CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).positionCheck(true, transformQuat, this._myParams.myMovementCollisionCheckParams, collisionRuntimeParams);
            this._myParams.myMovementCollisionCheckParams.myDebugEnabled = debugBackup;
            this._myIsPositionValid = collisionRuntimeParams.myIsPositionOk;
        } else {
            this._myIsPositionValid = true;
        }

        if (this._myParams.myUpdatePositionHeadValid) {
            const transformQuat = PlayerTransformManager._updatePositionsValidSV.transformQuat;
            this.getTransformHeadQuat(transformQuat);

            const headCollisionRuntimeParams = PlayerTransformManager._updatePositionsValidSV.headCollisionRuntimeParams;
            headCollisionRuntimeParams.reset();
            const debugBackup = this._myHeadCollisionCheckParams.myDebugEnabled;
            this._myHeadCollisionCheckParams.myDebugEnabled = false;
            CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).positionCheck(true, transformQuat, this._myHeadCollisionCheckParams, headCollisionRuntimeParams);
            this._myHeadCollisionCheckParams.myDebugEnabled = debugBackup;
            this._myIsPositionHeadValid = headCollisionRuntimeParams.myIsPositionOk;
        } else {
            this._myIsPositionHeadValid = true;
        }

        if (this._myParams.myUpdateRealPositionValid) {
            const transformQuat = PlayerTransformManager._updatePositionsValidSV.transformQuat;
            const transformUp = PlayerTransformManager._updatePositionsValidSV.transformUp;
            const rotationQuat = PlayerTransformManager._updatePositionsValidSV.rotationQuat;
            const horizontalDirection = PlayerTransformManager._updatePositionsValidSV.horizontalDirection;
            this.getTransformRealQuat(transformQuat);
            transformQuat.quat2_getUp(transformUp);
            transformQuat.quat2_getRotationQuat(rotationQuat);
            this._myLastValidMovementDirection.vec3_removeComponentAlongAxis(transformUp, horizontalDirection);

            if (!horizontalDirection.vec3_isZero(0.00001)) {
                horizontalDirection.vec3_normalize(horizontalDirection);
                rotationQuat.quat_setUp(transformUp, horizontalDirection);
                transformQuat.quat2_setRotationQuat(rotationQuat);
            }

            const collisionRuntimeParams = PlayerTransformManager._updatePositionsValidSV.collisionRuntimeParams;
            collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
            const debugBackup = this._myParams.myMovementCollisionCheckParams.myDebugEnabled;
            this._myParams.myMovementCollisionCheckParams.myDebugEnabled = false;
            CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).positionCheck(true, transformQuat, this._myParams.myMovementCollisionCheckParams, collisionRuntimeParams);
            this._myIsRealPositionValid = collisionRuntimeParams.myIsPositionOk;
            this._myParams.myMovementCollisionCheckParams.myDebugEnabled = debugBackup;
        } else {
            this._myIsRealPositionValid = true;
        }

        if (this._myParams.myUpdateRealPositionHeadValid) {
            const transformQuat = PlayerTransformManager._updatePositionsValidSV.transformQuat;
            this.getTransformHeadRealQuat(transformQuat);

            const headCollisionRuntimeParams = PlayerTransformManager._updatePositionsValidSV.headCollisionRuntimeParams;
            headCollisionRuntimeParams.reset();
            const debugBackup = this._myHeadCollisionCheckParams.myDebugEnabled;
            this._myHeadCollisionCheckParams.myDebugEnabled = false;
            CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).positionCheck(true, transformQuat, this._myHeadCollisionCheckParams, headCollisionRuntimeParams);
            this._myHeadCollisionCheckParams.myDebugEnabled = debugBackup;
            this._myIsRealPositionHeadValid = headCollisionRuntimeParams.myIsPositionOk;
        } else {
            this._myIsRealPositionHeadValid = true;
        }
    }

    private static readonly _updateValidToRealSV =
        {
            movementToCheck: vec3_create(),
            position: vec3_create(),
            positionReal: vec3_create(),
            transformQuat: quat2_create(),
            collisionRuntimeParams: new CollisionRuntimeParams(),

            newValidMovementDirection: vec3_create(),
            newValidVerticalMovementDirection: vec3_create(),
            newPosition: vec3_create(),
            movementStep: vec3_create(),
            currentMovementStep: vec3_create(),
            transformUp: vec3_create(),
            verticalMovement: vec3_create(),
            movementChecked: vec3_create(),
            newFeetPosition: vec3_create(),
            floatingTransformQuat: quat2_create(),
            rotationQuat: quat_create(),
            horizontalDirection: vec3_create()
        };
    private _updateValidToReal(dt: number): void {
        // If the head is not synced, only do the check to see if head is colliding, but do not actually change the valid position
        const isHeadSynced = this.getPlayerHeadManager().isSynced(this._myParams.myAllowUpdateValidToRealWhenBlurred);

        this._updateCollisionHeight();

        const position = PlayerTransformManager._updateValidToRealSV.position;
        const positionReal = PlayerTransformManager._updateValidToRealSV.positionReal;
        const movementToCheck = PlayerTransformManager._updateValidToRealSV.movementToCheck;
        this.getPositionReal(positionReal).vec3_sub(this.getPosition(position), movementToCheck);

        this._myIsFar = false;
        // Far
        if (this._myParams.mySyncEnabledFlagMap.get(PlayerTransformManagerSyncFlag.FAR)) {
            if (this._myParams.myMaxDistanceFromRealToSyncEnabled && movementToCheck.vec3_length() > this._myParams.myMaxDistanceFromRealToSync) {
                this._myIsFar = true;
            } else if (this._myParams.myIsFarExtraCheckCallback != null && this._myParams.myIsFarExtraCheckCallback(this)) {
                this._myIsFar = true;
            }
        }

        const collisionRuntimeParams = PlayerTransformManager._updateValidToRealSV.collisionRuntimeParams;
        const transformQuat = PlayerTransformManager._updateValidToRealSV.transformQuat;
        const newPosition = PlayerTransformManager._updateValidToRealSV.newPosition;
        const transformUp = PlayerTransformManager._updateValidToRealSV.transformUp;
        this.getTransformQuat(transformQuat);
        newPosition.vec3_copy(positionReal);
        transformQuat.quat2_getUp(transformUp);

        this._myIsBodyColliding = false;
        // Body Colliding
        if (!this._myIsFar && this._myParams.mySyncEnabledFlagMap.get(PlayerTransformManagerSyncFlag.BODY_COLLIDING)) {
            const realHeight = this.getHeightReal();
            if (Math.pp_clamp(realHeight, this._myParams.myIsBodyCollidingWhenHeightBelowValue ?? undefined, this._myParams.myIsBodyCollidingWhenHeightAboveValue ?? undefined) != realHeight) {
                this._myIsBodyColliding = true;
            } else {
                collisionRuntimeParams.copy(this._myCollisionRuntimeParams);

                // #TODO Temp as long as surface infos are not updated every time the position changes
                // This is needed to understand if snapping should occur (and possibly other stuff I can't remember)
                CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).updateSurfaceInfo(transformQuat, this._myParams.myMovementCollisionCheckParams, collisionRuntimeParams);

                if (collisionRuntimeParams.myIsOnGround && this._myParams.myIgnoreUpwardMovementToRealIfValidOnGround) {
                    const valueAlongUp = movementToCheck.vec3_valueAlongAxis(transformUp);
                    if (valueAlongUp >= 0) {
                        movementToCheck.vec3_removeComponentAlongAxis(transformUp, movementToCheck);
                    }
                }

                CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).move(movementToCheck, transformQuat, this._myRealMovementCollisionCheckParams, collisionRuntimeParams);

                if (!collisionRuntimeParams.myHorizontalMovementCanceled && !collisionRuntimeParams.myVerticalMovementCanceled) {
                    if (this._myParams.myIsBodyCollidingExtraCheckCallback != null && this._myParams.myIsBodyCollidingExtraCheckCallback(this)) {
                        this._myIsBodyColliding = true;
                    } else {
                        this._myIsBodyColliding = false;
                        newPosition.vec3_copy(collisionRuntimeParams.myNewPosition);
                        movementToCheck.vec3_copy(collisionRuntimeParams.myFixedMovement);
                    }
                } else {
                    this._myIsBodyColliding = true;
                }
            }
        } else if (this._myIsFar) {
            this._myIsBodyColliding = true;
        }

        if (this._myParams.myAlwaysSyncPositionWithReal) {
            newPosition.vec3_copy(positionReal);
        }

        this._myIsLeaning = false;
        this._myIsHopping = false;
        // Floating 
        if (!this._myIsBodyColliding && this._myParams.mySyncEnabledFlagMap.get(PlayerTransformManagerSyncFlag.FLOATING)) {
            collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
            const floatingTransformQuat = PlayerTransformManager._updateValidToRealSV.floatingTransformQuat;
            floatingTransformQuat.quat2_setPositionRotationQuat(this._myValidPosition, this._myValidRotationQuat);
            CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).updateSurfaceInfo(floatingTransformQuat, this._myRealMovementCollisionCheckParams, collisionRuntimeParams);
            // #TODO Utilizzare on ground del body gia calcolato, ma ora non c'è quindi va bene così

            if (collisionRuntimeParams.myIsOnGround) {
                const verticalMovement = PlayerTransformManager._updateValidToRealSV.verticalMovement;
                movementToCheck.vec3_componentAlongAxis(transformUp, verticalMovement);
                const isVertical = !verticalMovement.vec3_isZero(0.00001);
                if (!isVertical || !this._myParams.myIsFloatingValidIfVerticalMovement) {
                    let movementStepAmount = 1;
                    const movementStep = PlayerTransformManager._updateValidToRealSV.movementStep;
                    movementStep.vec3_copy(movementToCheck);
                    if (!movementToCheck.vec3_isZero(0.00001) && this._myParams.myFloatingSplitCheckEnabled) {
                        const minLength = this._myParams.myFloatingSplitCheckMinLength;
                        const maxLength = this._myParams.myFloatingSplitCheckMaxLength;

                        const movementLength = movementToCheck.vec3_length();
                        const stepLength = Math.pp_clamp(movementLength, minLength ?? undefined, maxLength ?? undefined);

                        movementStepAmount = Math.ceil(movementLength / stepLength);
                        movementStep.vec3_normalize(movementStep).vec3_scale(stepLength, movementStep);

                        movementStepAmount = Math.max(1, movementStepAmount);

                        if (movementStepAmount == 1) {
                            movementStep.vec3_copy(movementToCheck);
                        }
                    }

                    const isOnValidGroundAngle = collisionRuntimeParams.myGroundAngle <= this._myRealMovementCollisionCheckParams.myGroundAngleToIgnore + 0.0001;

                    const movementChecked = PlayerTransformManager._updateValidToRealSV.movementChecked;
                    const newFeetPosition = PlayerTransformManager._updateValidToRealSV.newFeetPosition;
                    movementChecked.vec3_zero();
                    newFeetPosition.vec3_copy(this._myValidPosition);
                    collisionRuntimeParams.copy(this._myCollisionRuntimeParams);

                    let atLeastOneNotOnGround = false;
                    let isOneOnGroundBetweenNoGround = false;
                    let isLastOnGround = false;
                    let isOneOnSteepGround = false;

                    const isOnGroundIfInsideHitBackup = this._myRealMovementCollisionCheckParams.myIsOnGroundIfInsideHit;

                    // Previously this was always apply to real, but I think it was needed just for the floating check
                    // If it seems there are errors due to this, move back to have this always enabled
                    //
                    // If the position check was used, this would probably not be needed because snap could happen, but since it's more performance heavy
                    // just the surface check is done
                    this._myRealMovementCollisionCheckParams.myIsOnGroundIfInsideHit = true;

                    const currentMovementStep = PlayerTransformManager._updateValidToRealSV.currentMovementStep;
                    for (let i = 0; i < movementStepAmount; i++) {
                        if (movementStepAmount == 1 || i != movementStepAmount - 1) {
                            currentMovementStep.vec3_copy(movementStep);
                        } else {
                            movementToCheck.vec3_sub(movementChecked, currentMovementStep);
                        }

                        newFeetPosition.vec3_add(currentMovementStep, newFeetPosition);
                        floatingTransformQuat.quat2_setPositionRotationQuat(newFeetPosition, this._myValidRotationQuat);
                        collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
                        CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).updateSurfaceInfo(floatingTransformQuat, this._myRealMovementCollisionCheckParams, collisionRuntimeParams);
                        movementChecked.vec3_add(currentMovementStep, movementChecked);

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

                    this._myRealMovementCollisionCheckParams.myIsOnGroundIfInsideHit = isOnGroundIfInsideHitBackup;

                    const isFloatingOnSteepGroundFail = isOneOnSteepGround && isOnValidGroundAngle &&
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
                        const distance = movementToCheck.vec3_length();
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

        if (isHeadSynced) {
            if ((this.isSynced(this._myParams.mySyncPositionFlagMap) || this._myParams.myAlwaysSyncPositionWithReal) && !this._myParams.mySyncPositionDisabled &&
                (this._myPlayerLocomotionTeleport == null || !this._myPlayerLocomotionTeleport.isTeleporting())) {
                const newValidMovementDirection = PlayerTransformManager._updateValidToRealSV.newValidMovementDirection;
                const newValidVerticalMovementDirection = PlayerTransformManager._updateValidToRealSV.newValidVerticalMovementDirection;
                newPosition.vec3_sub(this._myValidPosition, newValidMovementDirection);
                if (newValidMovementDirection.vec3_removeComponentAlongAxis(transformUp, newValidVerticalMovementDirection).vec3_length() > 0.0001) {
                    newValidMovementDirection.vec3_normalize(this._myLastValidMovementDirection);
                }

                this._myValidPosition.vec3_copy(newPosition);

                // This might cause motion sickness
                if (this._myParams.myApplyRealToValidAdjustmentsToRealPositionToo) {
                    this.resetReal(true, false, false, false, false, false);
                }
            }

            // For now I've not found a valid reason not to always sync rotation, it shouldn't case any trouble even if the new direction collides a bit
            if (this.isSynced(this._myParams.mySyncRotationFlagMap)) {
                this.getRotationRealQuat(this._myValidRotationQuat);
            }
        }

        const newHeight = Math.pp_clamp(this.getHeightReal(), this._myParams.myMinHeight ?? undefined, this._myParams.myMaxHeight ?? undefined);
        this._myIsHeightColliding = false;
        // Height Colliding 
        if (this._myParams.mySyncEnabledFlagMap.get(PlayerTransformManagerSyncFlag.HEIGHT_COLLIDING)) {
            const transformQuat = PlayerTransformManager._updateValidToRealSV.transformQuat;
            const transformUp = PlayerTransformManager._updateValidToRealSV.transformUp;
            const rotationQuat = PlayerTransformManager._updateValidToRealSV.rotationQuat;
            const horizontalDirection = PlayerTransformManager._updateValidToRealSV.horizontalDirection;
            this.getTransformQuat(transformQuat);
            transformQuat.quat2_getUp(transformUp);
            transformQuat.quat2_getRotationQuat(rotationQuat);
            this._myLastValidMovementDirection.vec3_removeComponentAlongAxis(transformUp, horizontalDirection);

            if (!horizontalDirection.vec3_isZero(0.00001)) {
                horizontalDirection.vec3_normalize(horizontalDirection);
                rotationQuat.quat_setUp(transformUp, horizontalDirection);
                transformQuat.quat2_setRotationQuat(rotationQuat);
            }

            const collisionRuntimeParams = PlayerTransformManager._updateValidToRealSV.collisionRuntimeParams;
            collisionRuntimeParams.copy(this._myCollisionRuntimeParams);
            const debugBackup = this._myParams.myMovementCollisionCheckParams.myDebugEnabled;
            const heightBackup = this._myParams.myMovementCollisionCheckParams.myHeight;
            this._myParams.myMovementCollisionCheckParams.myHeight = newHeight + this._myParams.myExtraHeight;
            this._myParams.myMovementCollisionCheckParams.myDebugEnabled = false;
            CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).positionCheck(true, transformQuat, this._myParams.myMovementCollisionCheckParams, collisionRuntimeParams);
            this._myParams.myMovementCollisionCheckParams.myDebugEnabled = debugBackup;
            this._myParams.myMovementCollisionCheckParams.myHeight = heightBackup;

            this._myIsHeightColliding = !collisionRuntimeParams.myIsPositionOk;
        }

        if (isHeadSynced) {
            if (this.isSynced(this._myParams.mySyncHeightFlagMap)) {
                this._myValidHeight = newHeight;
                this._updateCollisionHeight();
            }

            if (this._myParams.myPreventRealFromColliding) {
                this.resetReal(true, false, false, false, false, false);
            }
        }

        this._updateValidHeadToRealHead(dt);
    }

    private static readonly _updateValidHeadToRealHeadSV =
        {
            movementToCheck: vec3_create(),
            horizontalMovementToCheck: vec3_create(),
            verticalMovementToCheck: vec3_create(),
            position: vec3_create(),
            positionReal: vec3_create(),
            transformQuat: quat2_create(),
            collisionRuntimeParams: new CollisionRuntimeParams(),

            bodyRotationQuat: quat_create(),
            bodyUp: vec3_create(),
            bodyPosition: vec3_create(),

            newPositionHead: vec3_create(),

            backupHorizontalBlockLayerFlags: new PhysicsLayerFlags(),
            backupVerticalBlockLayerFlags: new PhysicsLayerFlags()
        };
    private _updateValidHeadToRealHead(dt: number): void {
        // If the head is not synced, only do the check to see if head is colliding, but do not actually change the valid position
        const isHeadSynced = this.getPlayerHeadManager().isSynced(this._myParams.myAllowUpdateValidToRealWhenBlurred);

        this._myIsHeadColliding = false;

        const backupHorizontalBlockLayerFlags = PlayerTransformManager._updateValidHeadToRealHeadSV.backupHorizontalBlockLayerFlags;
        const backupVerticalBlockLayerFlags = PlayerTransformManager._updateValidHeadToRealHeadSV.backupVerticalBlockLayerFlags;
        backupHorizontalBlockLayerFlags.copy(this._myHeadCollisionCheckParams.myHorizontalBlockLayerFlags);
        backupVerticalBlockLayerFlags.copy(this._myHeadCollisionCheckParams.myVerticalBlockLayerFlags);

        const backupVerticalMovementReduceEnabled = this._myHeadCollisionCheckParams.myVerticalMovementReduceEnabled;

        const backupGroundAngleToIgnore = this._myHeadCollisionCheckParams.myGroundAngleToIgnore;
        const backupGroundAngleToIgnoreWithPerceivedAngle = this._myHeadCollisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle;
        const backupHorizontalMovementGroundAngleIgnoreHeight = this._myHeadCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreHeight;
        const backupHorizontalPositionGroundAngleIgnoreHeight = this._myHeadCollisionCheckParams.myHorizontalPositionGroundAngleIgnoreHeight;
        const backupHorizontalMovementGroundAngleIgnoreMaxMovementLeft = this._myHeadCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft;

        let headReducedVerticalMovementFeetAdjustment = false;

        const newPositionHead = PlayerTransformManager._updateValidHeadToRealHeadSV.newPositionHead;
        const positionReal = PlayerTransformManager._updateValidHeadToRealHeadSV.positionReal;

        // Head Colliding
        let firstHeadCollidingCheckDone = false;
        do {
            if (isHeadSynced) {
                if (firstHeadCollidingCheckDone && this._myResetHeadToFeetOnNextUpdateValidToReal) {
                    this._myResetHeadToFeetOnNextUpdateValidToReal = false;
                    this.resetHeadToFeet();
                }
            }

            let resetHeadToFeetDirty = this._myResetHeadToFeetDirty;

            if (this._myResetHeadToFeetOnNextUpdateValidToReal) {
                this._myValidPositionHead.vec3_copy(this._myValidPositionHeadBackupForResetToFeet);

                if (isHeadSynced) {
                    this._myResetHeadToFeetDirty = false;
                }

                resetHeadToFeetDirty = false;
            }

            if (resetHeadToFeetDirty) {
                if (this._myParams.myHeadCollisionBlockLayerFlagsForResetToFeet != null) {
                    this._myHeadCollisionCheckParams.myHorizontalBlockLayerFlags.copy(this._myParams.myHeadCollisionBlockLayerFlagsForResetToFeet);
                    this._myHeadCollisionCheckParams.myVerticalBlockLayerFlags.copy(this._myParams.myHeadCollisionBlockLayerFlagsForResetToFeet);
                }

                if (this._myParams.myResetHeadToFeetMoveTowardReal) {
                    this._myHeadCollisionCheckParams.myVerticalMovementReduceEnabled = true;
                }

                if (this._myParams.myResetHeadToFeetGroudnAngleIgnoreEnabled) {
                    this._myHeadCollisionCheckParams.myGroundAngleToIgnore = this._myParams.myMovementCollisionCheckParams.myGroundAngleToIgnore;
                    this._myHeadCollisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle = this._myParams.myMovementCollisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle;

                    this._myHeadCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreHeight = this._myParams.myMovementCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreHeight;
                    this._myHeadCollisionCheckParams.myHorizontalPositionGroundAngleIgnoreHeight = this._myParams.myMovementCollisionCheckParams.myHorizontalPositionGroundAngleIgnoreHeight;

                    this._myHeadCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft = this._myParams.myMovementCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft;
                }

                if (isHeadSynced) {
                    this._myResetHeadToFeetDirty = false;
                }
            } else {
                this._myHeadCollisionCheckParams.myHorizontalBlockLayerFlags.copy(backupHorizontalBlockLayerFlags);
                this._myHeadCollisionCheckParams.myVerticalBlockLayerFlags.copy(backupVerticalBlockLayerFlags);
                this._myHeadCollisionCheckParams.myVerticalMovementReduceEnabled = backupVerticalMovementReduceEnabled;

                this._myHeadCollisionCheckParams.myGroundAngleToIgnore = backupGroundAngleToIgnore;
                this._myHeadCollisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle = backupGroundAngleToIgnoreWithPerceivedAngle;
                this._myHeadCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreHeight = backupHorizontalMovementGroundAngleIgnoreHeight;
                this._myHeadCollisionCheckParams.myHorizontalPositionGroundAngleIgnoreHeight = backupHorizontalPositionGroundAngleIgnoreHeight;
                this._myHeadCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft = backupHorizontalMovementGroundAngleIgnoreMaxMovementLeft;
            }

            const position = PlayerTransformManager._updateValidHeadToRealHeadSV.position;
            const movementToCheck = PlayerTransformManager._updateValidHeadToRealHeadSV.movementToCheck;
            this.getPositionHeadReal(positionReal).vec3_sub(this.getPositionHead(position), movementToCheck);

            const collisionRuntimeParams = PlayerTransformManager._updateValidHeadToRealHeadSV.collisionRuntimeParams;
            collisionRuntimeParams.reset();

            const transformQuat = PlayerTransformManager._updateValidHeadToRealHeadSV.transformQuat;
            this.getTransformHeadQuat(transformQuat); // Get eyes transform
            newPositionHead.vec3_copy(positionReal);

            let isHeadFar = false;
            if (this._myParams.myMaxDistanceFromHeadRealToSyncEnabled) {
                isHeadFar = movementToCheck.vec3_length() > this._myParams.myMaxDistanceFromHeadRealToSync;
                if (isHeadFar) {
                    const horizontalMovementToCheck = PlayerTransformManager._updateValidHeadToRealHeadSV.horizontalMovementToCheck;
                    const verticalMovementToCheck = PlayerTransformManager._updateValidHeadToRealHeadSV.verticalMovementToCheck;
                    const bodyRotationQuat = PlayerTransformManager._updateValidHeadToRealHeadSV.bodyRotationQuat;
                    const bodyUp = PlayerTransformManager._updateValidHeadToRealHeadSV.bodyUp;

                    this.getRotationQuat(bodyRotationQuat);
                    bodyRotationQuat.quat_getUp(bodyUp);
                    movementToCheck.vec3_componentAlongAxis(bodyUp, verticalMovementToCheck);
                    movementToCheck.vec3_sub(verticalMovementToCheck, horizontalMovementToCheck);

                    isHeadFar = horizontalMovementToCheck.vec3_length() > this._myParams.myMaxDistanceFromHeadRealToSync;
                    if (!isHeadFar) {
                        const bodyPosition = PlayerTransformManager._updateValidHeadToRealHeadSV.bodyPosition;
                        this.getPosition(bodyPosition);

                        const bodyUpValue = bodyPosition.vec3_valueAlongAxis(bodyUp);
                        const headUpValue = position.vec3_valueAlongAxis(bodyUp);
                        const headRealUpValue = positionReal.vec3_valueAlongAxis(bodyUp);

                        const isHeadBetweenBodyAndHeadReal = headRealUpValue >= headUpValue && headRealUpValue >= bodyUpValue && headUpValue >= (bodyUpValue - 0.0001);

                        if (!isHeadBetweenBodyAndHeadReal) {
                            // It's not a movement to get from feet to head, because the valid head is not between the feet and the real head
                            isHeadFar = true;
                        } else {
                            const heightToCheck = this.getPlayerHeadManager().getHeightEyes() + this._myHeadCollisionCheckParams.myRadius;
                            const isHeadRealBelowHeight = (headRealUpValue - bodyUpValue) <= heightToCheck;

                            if (!isHeadRealBelowHeight) {
                                // It's not a movement to get from feet to head, because the real head is actually higher
                                isHeadFar = true;
                            } else {
                                isHeadFar = false;
                            }
                        }
                    }
                }
            }

            if (!isHeadFar && this._myParams.mySyncEnabledFlagMap.get(PlayerTransformManagerSyncFlag.HEAD_COLLIDING)) {
                CollisionCheckBridge.getCollisionCheck(this._myParams.myEngine as any).move(movementToCheck, transformQuat, this._myHeadCollisionCheckParams, collisionRuntimeParams);

                if (!collisionRuntimeParams.myHorizontalMovementCanceled && !collisionRuntimeParams.myVerticalMovementCanceled) {
                    if (!backupVerticalMovementReduceEnabled && collisionRuntimeParams.myHasReducedVerticalMovement) {
                        this._myIsHeadColliding = true;
                        headReducedVerticalMovementFeetAdjustment = true;
                    } else {
                        this._myIsHeadColliding = false;
                    }

                    newPositionHead.vec3_copy(collisionRuntimeParams.myNewPosition);
                } else {
                    this._myIsHeadColliding = true;
                }
            } else if (isHeadFar) {
                this._myIsHeadColliding = true;
            }

            firstHeadCollidingCheckDone = true;
        } while (this._myIsHeadColliding && isHeadSynced && this._myResetHeadToFeetOnNextUpdateValidToReal);

        {
            this._myHeadCollisionCheckParams.myHorizontalBlockLayerFlags.copy(backupHorizontalBlockLayerFlags);
            this._myHeadCollisionCheckParams.myVerticalBlockLayerFlags.copy(backupVerticalBlockLayerFlags);
            this._myHeadCollisionCheckParams.myVerticalMovementReduceEnabled = backupVerticalMovementReduceEnabled;

            this._myHeadCollisionCheckParams.myGroundAngleToIgnore = backupGroundAngleToIgnore;
            this._myHeadCollisionCheckParams.myGroundAngleToIgnoreWithPerceivedAngle = backupGroundAngleToIgnoreWithPerceivedAngle;
            this._myHeadCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreHeight = backupHorizontalMovementGroundAngleIgnoreHeight;
            this._myHeadCollisionCheckParams.myHorizontalPositionGroundAngleIgnoreHeight = backupHorizontalPositionGroundAngleIgnoreHeight;
            this._myHeadCollisionCheckParams.myHorizontalMovementGroundAngleIgnoreMaxMovementLeft = backupHorizontalMovementGroundAngleIgnoreMaxMovementLeft;
        }

        if (isHeadSynced) {
            this._myResetHeadToFeetOnNextUpdateValidToReal = false;
            this._myResetHeadToFeetDirty = false;
        }

        if (this._myParams.myAlwaysSyncHeadPositionWithReal) {
            newPositionHead.vec3_copy(positionReal);
        }

        const backupIsHeadColliding = this._myIsHeadColliding;
        if (headReducedVerticalMovementFeetAdjustment) {
            // This is to allow the sync of the head if this is the only think preventing it
            this._myIsHeadColliding = false;
        }

        if (isHeadSynced) {
            if (this.isSynced(this._myParams.mySyncPositionHeadFlagMap) || this._myParams.myAlwaysSyncHeadPositionWithReal
                || (this.isSynced(this._myParams.mySyncPositionFlagMap) && this._myParams.myAlwaysSyncPositionWithReal)) {
                this._myValidPositionHead.vec3_copy(newPositionHead);
                this._myValidPositionHeadBackupForResetToFeet.vec3_copy(this._myValidPositionHead);
            }
        }

        if (headReducedVerticalMovementFeetAdjustment) {
            // Restoring it to colliding after
            this._myIsHeadColliding = backupIsHeadColliding;
        }
    }

    private _debugUpdate(dt: number): void {
        Globals.getDebugVisualManager(this._myParams.myEngine)!.drawPoint(0, this._myValidPosition, vec4_create(1, 0, 0, 1), 0.05);
        Globals.getDebugVisualManager(this._myParams.myEngine)!.drawLineEnd(0, this._myValidPosition, this.getPositionReal(), vec4_create(1, 0, 0, 1), 0.05);
        Globals.getDebugVisualManager(this._myParams.myEngine)!.drawLine(0, this._myValidPosition, this._myValidRotationQuat.quat_getForward(), 0.15, vec4_create(0, 1, 0, 1), 0.025);

        Globals.getDebugVisualManager(this._myParams.myEngine)!.drawPoint(0, this._myValidPositionHead, vec4_create(1, 1, 0, 1), 0.05);
    }

    public destroy(): void {
        this._myDestroyed = true;

        this.setActive(false);
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }
}
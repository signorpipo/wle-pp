import { Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { Timer } from "../../../../../cauldron/cauldron/timer.js";
import { Quaternion, Quaternion2, Vector3 } from "../../../../../cauldron/type_definitions/array_type_definitions.js";
import { Quat2Utils } from "../../../../../cauldron/utils/array/quat2_utils.js";
import { XRUtils } from "../../../../../cauldron/utils/xr_utils.js";
import { mat4_create, quat2_create, quat_create, vec3_create, vec4_create } from "../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../../pp/globals.js";

export enum NonVRReferenceSpaceMode {
    NO_FLOOR = 0,
    FLOOR = 1,
    NO_FLOOR_THEN_KEEP_VR = 2,
    FLOOR_THEN_KEEP_VR = 3
}

export class PlayerHeadManagerParams {

    public mySessionChangeResyncEnabled: boolean = false;

    public myBlurEndResyncEnabled: boolean = false;
    public myBlurEndResyncRotation: boolean = false;

    public myResetTransformOnViewResetEnabled: boolean = true;

    public myNextEnterSessionResyncHeight: boolean = false;
    public myEnterSessionResyncHeight: boolean = false;



    public myExitSessionResyncHeight: boolean = false;
    public myExitSessionResyncVerticalAngle: boolean = false;

    /** For now right tilt is removed even if this setting is `false`, if the vertical angle has to be adjusted */
    public myExitSessionRemoveRightTilt: boolean = false;

    public myExitSessionAdjustMaxVerticalAngle: boolean = false;
    public myExitSessionMaxVerticalAngle: number = 0;
    public myExitSessionResetNonVRTransformLocal: boolean = true;



    public myNonVRFloorBasedMode: NonVRReferenceSpaceMode = NonVRReferenceSpaceMode.FLOOR_THEN_KEEP_VR;



    public myDefaultHeightNonVR: number = 0;
    public myDefaultHeightVRWithoutFloor: number = 0;

    /** `null` means just keep the detected one */
    public myDefaultHeightVRWithFloor: number | null = null;

    /** Can be used to always add a bit of height, for example to compensate the fact  
        that the default height is actually the eye height and you may want to also add a forehead offset */
    public myForeheadExtraHeight: number = 0;



    public myFeetRotationKeepUp: boolean = true;

    public myDebugEnabled: boolean = false;

    public readonly myEngine: Readonly<WonderlandEngine>;

    constructor(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!) {
        this.myEngine = engine;
    }
}

// #TODO Could be seen as the generic player body manager (maybe with hands and stuff also)
export class PlayerHeadManager {

    private readonly _myParams: PlayerHeadManagerParams;

    private _myCurrentHead: Object3D;
    private readonly _myCurrentHeadTransformLocalQuat: Quaternion2 = quat2_create();


    private _mySessionChangeResyncHeadTransform: Readonly<Quaternion2> | null = null;

    /** Needed because VR head takes some frames to get the tracked position */
    private _myDelaySessionChangeResyncCounter: number = 0;


    private _myBlurRecoverHeadTransform: Readonly<Quaternion2> | null = null;
    private _myDelayBlurEndResyncCounter: number = 0;
    private readonly _myDelayBlurEndResyncTimer = new Timer(5, false);

    private _myVisibilityHidden: boolean = false;
    private _myVisibilityChangeEventListener: ((event: XRSessionEvent) => any) | null = null;

    private _mySessionActive: boolean = false;
    private _mySessionBlurred: boolean = false;

    private _myIsSyncedDelayCounter: number = 0;

    private _myViewResetThisFrame: boolean = false;
    private _myViewResetEventListener: ((event: XRReferenceSpaceEvent) => any) | null = null;

    private _myHeightNonVR: number = 0;
    private _myHeightNonVROnEnterSession: number = 0;
    private _myHeightVRWithoutFloor: number | null = null;
    private _myHeightVRWithFloor: number | null = null;
    private _myHeightOffsetWithFloor: number = 0;
    private _myHeightOffsetWithoutFloor: number = 0;
    private _myNextEnterSessionSetHeightVRWithFloor: boolean = false;
    private _myNextEnterSessionSetHeightVRWithoutFloor: boolean = false;
    private _myDelayNextEnterSessionSetHeightVRCounter: number = 0;

    private _myLastReferenceSpaceIsFloorBased: boolean | null = null;

    private _myActive: boolean = true;

    private _myDestroyed: boolean = false;

    private static _myResyncCounterFrames = 3;
    private static _myIsSyncedDelayCounterFrames = 1;

    constructor(params: PlayerHeadManagerParams = new PlayerHeadManagerParams()) {
        this._myParams = params;

        this._myCurrentHead = Globals.getPlayerObjects(this._myParams.myEngine)!.myHead!;
    }

    public start(): void {
        this._setHeightHeadNonVR(this._myParams.myDefaultHeightNonVR);
        this._setHeightHeadVRWithoutFloor(this._myParams.myDefaultHeightVRWithoutFloor);
        this._setHeightHeadVRWithFloor(this._myParams.myDefaultHeightVRWithFloor);

        this._updateHeightOffset();

        this._setCameraNonXRHeight(this._myHeightNonVR);

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), true, true, this._myParams.myEngine);
    }

    public setActive(active: boolean): void {
        if (active != this._myActive) {
            this.cancelSync();
        }

        this._myActive = active;
    }

    public getParams(): PlayerHeadManagerParams {
        return this._myParams;
    }

    public getPlayer(): Object3D {
        return Globals.getPlayerObjects(this._myParams.myEngine)!.myPlayer!;
    }

    public getHead(): Object3D {
        return this._myCurrentHead;
    }

    public getHeightHead(): number {
        return this.getHeightEyes() + this._myParams.myForeheadExtraHeight;
    }

    private static readonly _getHeightEyesSV =
        {
            headPosition: vec3_create()
        };
    public getHeightEyes(): number {
        const headPosition = PlayerHeadManager._getHeightEyesSV.headPosition;
        this._myCurrentHead.pp_getPosition(headPosition);
        const eyesHeight = this._getPositionEyesHeight(headPosition);

        return eyesHeight;
    }

    private static readonly _getTransformFeetQuatSV =
        {
            feetPosition: vec3_create(),
            feetRotationQuat: quat_create()
        };
    public getTransformFeetQuat(): Quaternion2;
    public getTransformFeetQuat<T extends Quaternion2>(outTransformQuat: T): T;
    public getTransformFeetQuat<T extends Quaternion2>(outTransformQuat: Quaternion2 | T = quat2_create()): Quaternion2 | T {
        const feetPosition = PlayerHeadManager._getTransformFeetQuatSV.feetPosition;
        const feetRotationQuat = PlayerHeadManager._getTransformFeetQuatSV.feetRotationQuat;
        outTransformQuat.quat2_setPositionRotationQuat(this.getPositionFeet(feetPosition), this.getRotationFeetQuat(feetRotationQuat));
        return outTransformQuat;
    }

    public getTransformHeadQuat(): Quaternion2;
    public getTransformHeadQuat<T extends Quaternion2>(outTransformQuat: T): T;
    public getTransformHeadQuat<T extends Quaternion2>(outTransformQuat: Quaternion2 | T = quat2_create()): Quaternion2 | T {
        return this.getHead().pp_getTransformQuat(outTransformQuat);
    }

    private static readonly _getPositionFeetSV =
        {
            headPosition: vec3_create(),
            playerUp: vec3_create()
        };
    public getPositionFeet(): Vector3;
    public getPositionFeet<T extends Vector3>(outPosition: T): T;
    public getPositionFeet<T extends Vector3>(outPosition: Vector3 | T = vec3_create()): Vector3 | T {
        const headPosition = PlayerHeadManager._getPositionFeetSV.headPosition;
        this._myCurrentHead.pp_getPosition(headPosition);
        const headHeight = this._getPositionEyesHeight(headPosition);

        const playerUp = PlayerHeadManager._getPositionFeetSV.playerUp;
        this.getPlayer().pp_getUp(playerUp);
        outPosition = headPosition.vec3_sub(playerUp.vec3_scale(headHeight, outPosition), outPosition);

        return outPosition;
    }

    public getPositionHead(): Vector3;
    public getPositionHead<T extends Vector3>(outPosition: T): T;
    public getPositionHead<T extends Vector3>(outPosition: Vector3 | T = vec3_create()): Vector3 | T {
        return this._myCurrentHead.pp_getPosition(outPosition);
    }

    private static readonly _getRotationFeetQuatSV =
        {
            playerUp: vec3_create(),
            headForward: vec3_create()
        };
    public getRotationFeetQuat(): Quaternion;
    public getRotationFeetQuat<T extends Quaternion>(outRotationQuat: T): T;
    public getRotationFeetQuat<T extends Quaternion>(outRotationQuat: Quaternion | T = quat_create()): Quaternion | T {
        const playerUp = PlayerHeadManager._getRotationFeetQuatSV.playerUp;
        const headForward = PlayerHeadManager._getRotationFeetQuatSV.headForward;
        this.getPlayer().pp_getUp(playerUp);
        this._myCurrentHead.pp_getForward(headForward);

        // Feet are considered to always be flat on the player up
        const angleWithUp = headForward.vec3_angle(playerUp);
        const mingAngle = 10;
        if (angleWithUp < mingAngle) {
            this._myCurrentHead.pp_getDown(headForward);
        } else if (angleWithUp > 180 - mingAngle) {
            this._myCurrentHead.pp_getUp(headForward);
        }

        headForward.vec3_removeComponentAlongAxis(playerUp, headForward);
        headForward.vec3_normalize(headForward);

        outRotationQuat.quat_setUp(playerUp, headForward);
        return outRotationQuat;
    }

    public getRotationHeadQuat(): Quaternion;
    public getRotationHeadQuat<T extends Quaternion>(outRotationQuat: T): T;
    public getRotationHeadQuat<T extends Quaternion>(outRotationQuat: Quaternion | T = quat_create()): Quaternion | T {
        return this.getHead().pp_getRotationQuat(outRotationQuat);
    }

    public isSynced(ignoreSessionBlurredState: boolean = false): boolean {
        return this._myIsSyncedDelayCounter == 0 && this._myDelaySessionChangeResyncCounter == 0 && this._myDelayNextEnterSessionSetHeightVRCounter == 0 && this._myDelayBlurEndResyncCounter == 0 && !this._myDelayBlurEndResyncTimer.isRunning() && (ignoreSessionBlurredState || !this._mySessionBlurred);
    }

    public setHeightHead(height: number, setOnlyForActiveOne: boolean = true): void {
        this._setHeightHead(height, height, height, setOnlyForActiveOne);
    }

    public setHeightHeadNonVR(height: number): void {
        this._setHeightHeadNonVR(height);

        if (!this._mySessionActive) {
            this._updateHeightOffset();
            this._setCameraNonXRHeight(this._myHeightNonVR);
        }
    }

    public setHeightHeadVRWithoutFloor(height: number): void {
        this._setHeightHeadVRWithoutFloor(height);

        if (this._mySessionActive) {
            this._updateHeightOffset();
        }
    }

    public setHeightHeadVRWithFloor(height = null): void {
        this._setHeightHeadVRWithFloor(height);

        if (this._mySessionActive) {
            this._updateHeightOffset();
        }
    }

    public resetHeightHeadToDefault(resetOnlyForActiveOne: boolean = true): void {
        this._setHeightHead(this._myHeightNonVR, this._myHeightVRWithoutFloor, this._myHeightVRWithFloor, resetOnlyForActiveOne);
    }

    public resetHeightHeadVRWithFloor(): void {
        this.setHeightHeadVRWithFloor(null);
    }

    public getDefaultHeightHeadNonVR(): number {
        return this._myHeightNonVR;
    }

    public getDefaultHeightHeadVRWithoutFloor(): number | null {
        return this._myHeightVRWithoutFloor;
    }

    public getDefaultHeightHeadVRWithFloor(): number | null {
        return this._myHeightVRWithFloor;
    }

    public getForeheadExtraHeight(): number {
        return this._myParams.myForeheadExtraHeight;
    }

    public setForeheadExtraHeight(foreheadExtraHeight: number, keepSameHeight: boolean = false, keepSameHeightOnlyForActiveOne: boolean = true): void {
        this._myParams.myForeheadExtraHeight = foreheadExtraHeight;

        if (keepSameHeight && (!keepSameHeightOnlyForActiveOne || !this._mySessionActive)) {
            this._setHeightHeadNonVR(this._myHeightNonVR);
        } else {
            this._myHeightNonVR = Math.max(this._myHeightNonVR + (foreheadExtraHeight - this._myParams.myForeheadExtraHeight), this._myParams.myForeheadExtraHeight);
            this._myHeightNonVROnEnterSession = Math.max(this._myHeightNonVROnEnterSession + (foreheadExtraHeight - this._myParams.myForeheadExtraHeight), this._myParams.myForeheadExtraHeight);
        }

        if (keepSameHeight && (!keepSameHeightOnlyForActiveOne || this._mySessionActive)) {
            this._setHeightHeadVRWithoutFloor(this._myHeightVRWithoutFloor);
            this._setHeightHeadVRWithFloor(this._myHeightVRWithFloor);
        } else {
            if (this._myHeightVRWithoutFloor != null) {
                this._myHeightVRWithoutFloor = Math.max(this._myHeightVRWithoutFloor + (foreheadExtraHeight - this._myParams.myForeheadExtraHeight), this._myParams.myForeheadExtraHeight);
            }

            if (this._myHeightVRWithFloor != null) {
                this._myHeightVRWithFloor = Math.max(this._myHeightVRWithFloor + (foreheadExtraHeight - this._myParams.myForeheadExtraHeight), this._myParams.myForeheadExtraHeight);
            }
        }

        if (keepSameHeight) {
            this._updateHeightOffset();

            if (!this._mySessionActive) {
                this._setCameraNonXRHeight(this._myHeightNonVR);
            }
        }
    }

    public moveFeet(movement: Readonly<Vector3>): void {
        this.getPlayer().pp_translate(movement);
    }

    public moveHead(movement: Readonly<Vector3>): void {
        this.moveFeet(movement);
    }

    private static readonly _teleportPositionHeadSV =
        {
            currentHeadPosition: vec3_create(),
            teleportMovementToPerform: vec3_create()
        };
    public teleportPositionHead(teleportPosition: Readonly<Vector3>): void {
        const currentHeadPosition = PlayerHeadManager._teleportPositionHeadSV.currentHeadPosition;
        const teleportMovementToPerform = PlayerHeadManager._teleportPositionHeadSV.teleportMovementToPerform;
        this._myCurrentHead.pp_getPosition(currentHeadPosition);
        teleportPosition.vec3_sub(currentHeadPosition, teleportMovementToPerform);
        this.moveFeet(teleportMovementToPerform);
    }

    private static readonly _teleportPositionFeetSV =
        {
            currentFeetPosition: vec3_create(),
            teleportMovementToPerform: vec3_create()
        };
    public teleportPositionFeet(teleportPosition: Readonly<Vector3>): void {
        const currentFeetPosition = PlayerHeadManager._teleportPositionFeetSV.currentFeetPosition;
        const teleportMovementToPerform = PlayerHeadManager._teleportPositionFeetSV.teleportMovementToPerform;
        this.getPositionFeet(currentFeetPosition);
        teleportPosition.vec3_sub(currentFeetPosition, teleportMovementToPerform);
        this.moveFeet(teleportMovementToPerform);
    }

    private static readonly _teleportPlayerToHeadTransformQuatSV =
        {
            headPosition: vec3_create(),
            playerUp: vec3_create(),
            flatCurrentPlayerPosition: vec3_create(),
            flatNewPlayerPosition: vec3_create(),
            teleportMovement: vec3_create(),
            playerForward: vec3_create(),
            headForward: vec3_create(),
            referenceSpaceForward: vec3_create(),
            referenceSpaceForwardNegated: vec3_create(),
            rotationToPerform: quat_create()
        };
    public teleportPlayerToHeadTransformQuat(headTransformQuat: Readonly<Quaternion2>): void {
        const headPosition = PlayerHeadManager._teleportPlayerToHeadTransformQuatSV.headPosition;
        headTransformQuat.quat2_getPosition(headPosition);

        const playerUp = PlayerHeadManager._teleportPlayerToHeadTransformQuatSV.playerUp;
        const flatCurrentPlayerPosition = PlayerHeadManager._teleportPlayerToHeadTransformQuatSV.flatCurrentPlayerPosition;
        const flatNewPlayerPosition = PlayerHeadManager._teleportPlayerToHeadTransformQuatSV.flatNewPlayerPosition;
        this.getPlayer().pp_getUp(playerUp);
        this.getPlayer().pp_getPosition(flatCurrentPlayerPosition).vec3_removeComponentAlongAxis(playerUp, flatCurrentPlayerPosition);
        headPosition.vec3_removeComponentAlongAxis(playerUp, flatNewPlayerPosition);

        const teleportMovement = PlayerHeadManager._teleportPlayerToHeadTransformQuatSV.teleportMovement;
        flatNewPlayerPosition.vec3_sub(flatCurrentPlayerPosition, teleportMovement);
        this.getPlayer().pp_translate(teleportMovement);

        const playerForward = PlayerHeadManager._teleportPlayerToHeadTransformQuatSV.playerForward;
        const headForward = PlayerHeadManager._teleportPlayerToHeadTransformQuatSV.headForward;
        this.getPlayer().pp_getForward(playerForward);
        headTransformQuat.quat2_getForward(headForward);

        const rotationToPerform = PlayerHeadManager._teleportPlayerToHeadTransformQuatSV.rotationToPerform;
        playerForward.vec3_rotationToPivotedQuat(headForward, playerUp, rotationToPerform);

        this.getPlayer().pp_rotateQuat(rotationToPerform);

        // Adjust player rotation based on the reference space rotation, which should not actually be touched,
        // but just in case

        this.getPlayer().pp_getForward(playerForward);

        const referenceSpaceForward = PlayerHeadManager._teleportPlayerToHeadTransformQuatSV.referenceSpaceForward;
        const referenceSpaceForwardNegated = PlayerHeadManager._teleportPlayerToHeadTransformQuatSV.referenceSpaceForwardNegated;
        Globals.getPlayerObjects(this._myParams.myEngine)!.myReferenceSpace!.pp_getForward(referenceSpaceForward);
        referenceSpaceForward.vec3_negate(referenceSpaceForwardNegated);

        referenceSpaceForwardNegated.vec3_rotationToPivotedQuat(playerForward, playerUp, rotationToPerform);

        this.getPlayer().pp_rotateQuat(rotationToPerform);
    }

    private static readonly _rotateFeetQuatSV =
        {
            playerUp: vec3_create(),
            rotationAxis: vec3_create(),
            currentHeadPosition: vec3_create(),
            currentFeetRotation: quat_create(),
            newFeetRotation: quat_create(),
            fixedNewFeetRotation: quat_create(),
            newFeetForward: vec3_create(),
            fixedRotation: quat_create(),
            newHeadPosition: vec3_create(),
            headAdjustmentMovement: vec3_create()
        };
    public rotateFeetQuat(rotationQuat: Readonly<Quaternion>, keepUpOverride: boolean | null = null): void {
        const angle = rotationQuat.quat_getAngleRadians();
        if (angle <= 0.00001) {
            return;
        }

        const currentHeadPosition = PlayerHeadManager._rotateFeetQuatSV.currentHeadPosition;
        const playerUp = PlayerHeadManager._rotateFeetQuatSV.playerUp;
        const rotationAxis = PlayerHeadManager._rotateFeetQuatSV.rotationAxis;
        this._myCurrentHead.pp_getPosition(currentHeadPosition);
        this.getPlayer().pp_getUp(playerUp);
        rotationQuat.quat_getAxis(rotationAxis);

        const fixedRotation = PlayerHeadManager._rotateFeetQuatSV.fixedRotation;
        if (!rotationAxis.vec3_isOnAxis(playerUp) &&
            ((keepUpOverride == null && this._myParams.myFeetRotationKeepUp) || (keepUpOverride))) {
            const currentFeetRotation = PlayerHeadManager._rotateFeetQuatSV.currentFeetRotation;
            this.getRotationFeetQuat(currentFeetRotation);

            const newFeetRotation = PlayerHeadManager._rotateFeetQuatSV.newFeetRotation;
            const newFeetForward = PlayerHeadManager._rotateFeetQuatSV.newFeetForward;
            currentFeetRotation.quat_rotateQuat(rotationQuat, newFeetRotation);
            newFeetRotation.quat_getForward(newFeetForward);

            const fixedNewFeetRotation = PlayerHeadManager._rotateFeetQuatSV.fixedNewFeetRotation;
            fixedNewFeetRotation.quat_copy(newFeetRotation);
            fixedNewFeetRotation.quat_setUp(playerUp, newFeetForward);

            currentFeetRotation.quat_rotationToQuat(fixedNewFeetRotation, fixedRotation);
        } else {
            fixedRotation.quat_copy(rotationQuat);
        }

        this.getPlayer().pp_rotateAroundQuat(fixedRotation, currentHeadPosition);

        const newHeadPosition = PlayerHeadManager._rotateFeetQuatSV.newHeadPosition;
        this._myCurrentHead.pp_getPosition(newHeadPosition);

        const headAdjustmentMovement = PlayerHeadManager._rotateFeetQuatSV.headAdjustmentMovement;
        currentHeadPosition.vec3_sub(newHeadPosition, headAdjustmentMovement);
        if (headAdjustmentMovement.vec3_length() > 0.00001) {
            this.moveFeet(headAdjustmentMovement);
        }
    }

    private static readonly _rotateHeadQuatSV =
        {
            newHeadRotation: quat_create(),
            newHeadUp: vec3_create()
        };
    // #TODO Rotate feet with this and then rotate head freely if possible
    public rotateHeadQuat(rotationQuat: Readonly<Quaternion>): void {
        if (this.canRotateHead()) {
            this._myCurrentHead.pp_rotateQuat(rotationQuat);
            const newHeadRotation = PlayerHeadManager._rotateHeadQuatSV.newHeadRotation;
            this._myCurrentHead.pp_getRotationQuat(newHeadRotation);

            Globals.getPlayerObjects(this._myParams.myEngine)!.myHead!.pp_setRotationQuat(newHeadRotation);

            if (!this._mySessionActive) {
                const newHeadUp = PlayerHeadManager._rotateHeadQuatSV.newHeadUp;
                newHeadRotation.quat_rotateAxisRadians(Math.PI, newHeadRotation.quat_getUp(newHeadUp), newHeadRotation);
                Globals.getPlayerObjects(this._myParams.myEngine)!.myCameraNonXR!.pp_setRotationQuat(newHeadRotation);
            }
        }
    }

    public canRotateFeet(): boolean {
        return true;
    }

    public canRotateHead(): boolean {
        return !this._mySessionActive;
    }

    private static readonly _setRotationFeetQuatSV =
        {
            currentRotationQuat: quat_create(),
            rotationQuatToRotate: quat_create()
        };
    public setRotationFeetQuat(rotationQuat: Readonly<Quaternion>, keepUpOverride: boolean | null = null): void {
        const currentRotationQuat = PlayerHeadManager._setRotationFeetQuatSV.currentRotationQuat;
        const rotationQuatToRotate = PlayerHeadManager._setRotationFeetQuatSV.rotationQuatToRotate;
        this.getRotationFeetQuat(currentRotationQuat);
        currentRotationQuat.quat_rotationToQuat(rotationQuat, rotationQuatToRotate);
        this.rotateFeetQuat(rotationQuatToRotate, keepUpOverride);
    }

    private static readonly _setRotationHeadQuatSV =
        {
            currentRotationQuat: quat_create(),
            rotationQuatToRotate: quat_create()
        };
    public setRotationHeadQuat(rotationQuat: Readonly<Quaternion>): void {
        const currentRotationQuat = PlayerHeadManager._setRotationHeadQuatSV.currentRotationQuat;
        const rotationQuatToRotate = PlayerHeadManager._setRotationHeadQuatSV.rotationQuatToRotate;
        this.getRotationHeadQuat(currentRotationQuat);
        currentRotationQuat.quat_rotationToQuat(rotationQuat, rotationQuatToRotate);
        this.rotateHeadQuat(rotationQuatToRotate);
    }

    private static readonly _lookAtFeetSV =
        {
            direction: vec3_create(),
            feetPosition: vec3_create()
        };
    public lookAtFeet(position: Readonly<Vector3>, up?: Readonly<Vector3>, keepUpOverride: boolean | null = null): void {
        const feetPosition = PlayerHeadManager._lookAtFeetSV.feetPosition;
        const direction = PlayerHeadManager._lookAtFeetSV.direction;
        this.getPositionFeet(feetPosition);
        position.vec3_sub(feetPosition, direction).vec3_normalize(direction);

        this.lookToFeet(direction, up, keepUpOverride);
    }

    private static readonly _lookToFeetSV =
        {
            feetRotation: quat_create()
        };
    public lookToFeet(direction: Readonly<Vector3>, up?: Readonly<Vector3>, keepUpOverride: boolean | null = null): void {
        const feetRotation = PlayerHeadManager._lookToFeetSV.feetRotation;
        this.getRotationFeetQuat(feetRotation);
        feetRotation.quat_setForward(direction, up);
        this.setRotationFeetQuat(feetRotation, keepUpOverride);
    }

    private static readonly _lookAtHeadSV =
        {
            direction: vec3_create(),
            headPosition: vec3_create()
        };
    public lookAtHead(position: Readonly<Vector3>, up?: Readonly<Vector3>): void {
        const headPosition = PlayerHeadManager._lookAtHeadSV.headPosition;
        const direction = PlayerHeadManager._lookAtHeadSV.direction;
        this.getPositionHead(headPosition);
        position.vec3_sub(headPosition, direction).vec3_normalize(direction);

        this.lookToHead(direction, up);
    }

    private static readonly _lookToHeadSV =
        {
            headRotation: quat_create()
        };
    public lookToHead(direction: Readonly<Vector3>, up?: Readonly<Vector3>): void {
        const headRotation = PlayerHeadManager._lookToHeadSV.headRotation;
        this.getRotationHeadQuat(headRotation);
        headRotation.quat_setForward(direction, up);
        this.setRotationHeadQuat(headRotation);
    }

    public resetCameraNonXR(): void {
        Globals.getPlayerObjects(this._myParams.myEngine)!.myCameraNonXR!.pp_resetTransformLocal();
        this._setCameraNonXRHeight(this._myHeightNonVR);
    }

    public cancelSync(): void {
        this._myIsSyncedDelayCounter = 0;
        this._myDelaySessionChangeResyncCounter = 0;
        this._myDelayBlurEndResyncCounter = 0;
        this._myDelayBlurEndResyncTimer.reset();

        this._mySessionChangeResyncHeadTransform = null;
        this._myBlurRecoverHeadTransform = null;
    }

    public cancelNextEnterSessionSetHeight(): void {
        this._myDelayNextEnterSessionSetHeightVRCounter--;
        this._myNextEnterSessionSetHeightVRWithFloor = false;
        this._myNextEnterSessionSetHeightVRWithoutFloor = false;
    }

    public update(dt: number): void {
        if (!this._myActive) return;

        this._myViewResetThisFrame = false;

        if (this._myIsSyncedDelayCounter != 0) {
            this._myIsSyncedDelayCounter--;
            this._myIsSyncedDelayCounter = Math.max(0, this._myIsSyncedDelayCounter);
        }

        if (this._myDelaySessionChangeResyncCounter > 0) {
            this._myDelaySessionChangeResyncCounter--;
            if (this._myDelaySessionChangeResyncCounter == 0) {
                this._sessionChangeResync();
                this._myIsSyncedDelayCounter = PlayerHeadManager._myIsSyncedDelayCounterFrames;
            }
        }

        if (this._myDelayBlurEndResyncCounter > 0 && !this._myDelayBlurEndResyncTimer.isRunning()) {
            this._myDelayBlurEndResyncCounter--;
            if (this._myDelayBlurEndResyncCounter == 0) {
                this._blurEndResync();
                this._myIsSyncedDelayCounter = PlayerHeadManager._myIsSyncedDelayCounterFrames;
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
                    this._myIsSyncedDelayCounter = PlayerHeadManager._myIsSyncedDelayCounterFrames;
                }
            }
        }

        if (this._myDelayNextEnterSessionSetHeightVRCounter > 0) {
            this._myDelayNextEnterSessionSetHeightVRCounter--;
            if (this._myDelayNextEnterSessionSetHeightVRCounter == 0) {
                if (this._mySessionActive) {
                    const isFloor = XRUtils.isReferenceSpaceFloorBased(this._myParams.myEngine);
                    if (isFloor && this._myNextEnterSessionSetHeightVRWithFloor) {
                        const currentHeadPosition = this._myCurrentHead.pp_getPosition();

                        const floorHeight = this._myHeightVRWithFloor! - this._myParams.myForeheadExtraHeight;
                        const currentEyeHeight = this._getPositionEyesHeight(currentHeadPosition);

                        this._myHeightOffsetWithFloor = this._myHeightOffsetWithFloor + (floorHeight - currentEyeHeight);

                        this._updateHeightOffset();

                        this._myNextEnterSessionSetHeightVRWithFloor = false;
                    } else if (!isFloor && this._myNextEnterSessionSetHeightVRWithoutFloor) {
                        const currentHeadPosition = this._myCurrentHead.pp_getPosition();

                        const floorHeight = this._myHeightVRWithoutFloor! - this._myParams.myForeheadExtraHeight;
                        const currentEyeHeight = this._getPositionEyesHeight(currentHeadPosition);

                        this._myHeightOffsetWithoutFloor = this._myHeightOffsetWithoutFloor + (floorHeight - currentEyeHeight);

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

    private _setHeightHead(heightNonVR: number, heightVRWithoutFloor: number | null, heightVRWithFloor: number | null, setOnlyForActiveOne: boolean = true): void {
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

    private _setHeightHeadNonVR(height: number): void {
        this._myHeightNonVR = Math.max(height, this._myParams.myForeheadExtraHeight);
        this._myHeightNonVROnEnterSession = this._myHeightNonVR;
    }

    private _setHeightHeadVRWithoutFloor(heightWithoutFloor: number | null): void {
        if (heightWithoutFloor != null) {
            this._myHeightVRWithoutFloor = Math.max(heightWithoutFloor, this._myParams.myForeheadExtraHeight);
            this._myNextEnterSessionSetHeightVRWithoutFloor = false;

            if (this._mySessionActive) {
                this._myHeightOffsetWithoutFloor = this._myHeightOffsetWithoutFloor + (this._myHeightVRWithoutFloor - this.getHeightHead());
            } else {
                this._myNextEnterSessionSetHeightVRWithoutFloor = true;
            }
        } else {
            this._myHeightVRWithoutFloor = null;
            this._myHeightOffsetWithoutFloor = 0;
        }
    }

    private _setHeightHeadVRWithFloor(heightWithFloor: number | null): void {
        if (heightWithFloor != null) {
            this._myHeightVRWithFloor = Math.max(heightWithFloor, this._myParams.myForeheadExtraHeight);
            this._myNextEnterSessionSetHeightVRWithFloor = false;

            if (this._mySessionActive) {
                this._myHeightOffsetWithFloor = this._myHeightOffsetWithFloor + (this._myHeightVRWithFloor - this.getHeightHead());
            } else {
                this._myNextEnterSessionSetHeightVRWithFloor = true;
            }
        } else {
            this._myHeightVRWithFloor = null;
            this._myHeightOffsetWithFloor = 0;
        }
    }

    private _shouldNonVRUseVRWithFloor(): boolean {
        return (this._myLastReferenceSpaceIsFloorBased == null && this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.FLOOR_THEN_KEEP_VR) ||
            (this._myLastReferenceSpaceIsFloorBased != null && this._myLastReferenceSpaceIsFloorBased &&
                (this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.NO_FLOOR_THEN_KEEP_VR || this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.FLOOR_THEN_KEEP_VR));
    }

    private _shouldNonVRUseVRWithoutFloor(): boolean {
        return (this._myLastReferenceSpaceIsFloorBased == null && this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.NO_FLOOR_THEN_KEEP_VR) ||
            (this._myLastReferenceSpaceIsFloorBased != null && !this._myLastReferenceSpaceIsFloorBased &&
                (this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.NO_FLOOR_THEN_KEEP_VR || this._myParams.myNonVRFloorBasedMode == NonVRReferenceSpaceMode.FLOOR_THEN_KEEP_VR));
    }

    private static readonly _setCameraNonXRHeightSV =
        {
            cameraNonVRPosition: vec3_create(),
            cameraNonVRPositionLocalToPlayer: vec3_create(),
            adjustedCameraNonVRPosition: vec3_create(),
            playerTranform: mat4_create()
        };
    private _setCameraNonXRHeight(height: number): void {
        const eyeHeight = height - this._myParams.myForeheadExtraHeight;

        const cameraNonVRPosition = PlayerHeadManager._setCameraNonXRHeightSV.cameraNonVRPosition;
        const cameraNonVRPositionLocalToPlayer = PlayerHeadManager._setCameraNonXRHeightSV.cameraNonVRPositionLocalToPlayer;
        const adjustedCameraNonVRPosition = PlayerHeadManager._setCameraNonXRHeightSV.adjustedCameraNonVRPosition;
        const playerTranform = PlayerHeadManager._setCameraNonXRHeightSV.playerTranform;

        Globals.getPlayerObjects(this._myParams.myEngine)!.myCameraNonXR!.pp_getPosition(cameraNonVRPosition);

        cameraNonVRPosition.vec3_convertPositionToLocal(this.getPlayer().pp_getTransform(playerTranform), cameraNonVRPositionLocalToPlayer);
        cameraNonVRPositionLocalToPlayer.vec3_set(cameraNonVRPositionLocalToPlayer[0], eyeHeight, cameraNonVRPositionLocalToPlayer[2]);
        cameraNonVRPositionLocalToPlayer.vec3_convertPositionToWorld(this.getPlayer().pp_getTransform(playerTranform), adjustedCameraNonVRPosition);

        Globals.getPlayerObjects(this._myParams.myEngine)!.myCameraNonXR!.pp_setPosition(adjustedCameraNonVRPosition);
    }

    private static readonly _getPositionEyesHeightSV =
        {
            playerPosition: vec3_create(),
            playerUp: vec3_create(),
            heightVector: vec3_create()
        };
    private _getPositionEyesHeight(position: Readonly<Vector3>): number {
        const playerPosition = PlayerHeadManager._getPositionEyesHeightSV.playerPosition;
        const playerUp = PlayerHeadManager._getPositionEyesHeightSV.playerUp;
        this.getPlayer().pp_getPosition(playerPosition);
        this.getPlayer().pp_getUp(playerUp);

        const heightVector = PlayerHeadManager._getPositionEyesHeightSV.heightVector;
        position.vec3_sub(playerPosition, heightVector).vec3_componentAlongAxis(playerUp, heightVector);
        let height = heightVector.vec3_length();
        if (!playerUp.vec3_isConcordant(heightVector)) {
            height = -height;
        }

        return height;
    }

    // #TODO What happens if the player go in the blurred state before the scene has loaded?
    private _onXRSessionStart(manualCall: boolean, session: XRSession): void {
        const nonVRCurrentEyesHeight = this._getPositionEyesHeight(Globals.getPlayerObjects(this._myParams.myEngine)!.myCameraNonXR!.pp_getPosition());
        this._myHeightNonVROnEnterSession = nonVRCurrentEyesHeight + this._myParams.myForeheadExtraHeight;

        this._myBlurRecoverHeadTransform = null;
        this._myVisibilityHidden = false;

        this._myDelaySessionChangeResyncCounter = 0;
        this._myDelayBlurEndResyncCounter = 0;
        this._myDelayBlurEndResyncTimer.reset();
        this._myDelayNextEnterSessionSetHeightVRCounter = 0;

        const referenceSpace = XRUtils.getReferenceSpace(this._myParams.myEngine)!;

        if (referenceSpace.addEventListener != null) {
            this._myViewResetEventListener = this._onViewReset.bind(this);
            referenceSpace.addEventListener("reset", this._myViewResetEventListener);
        }

        this._myLastReferenceSpaceIsFloorBased = XRUtils.isReferenceSpaceFloorBased(this._myParams.myEngine);

        this._myVisibilityChangeEventListener = function (this: PlayerHeadManager, event: XRSessionEvent) {
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

            this._myDelaySessionChangeResyncCounter = PlayerHeadManager._myResyncCounterFrames;
        } else {
            this._myDelaySessionChangeResyncCounter = 0;
            this._mySessionChangeResyncHeadTransform = null;
        }

        if (this._myActive) {
            if (this._myNextEnterSessionSetHeightVRWithFloor || this._myNextEnterSessionSetHeightVRWithoutFloor) {
                this._myDelayNextEnterSessionSetHeightVRCounter = PlayerHeadManager._myResyncCounterFrames;
            }
        } else {
            this._myNextEnterSessionSetHeightVRWithFloor = false;
            this._myNextEnterSessionSetHeightVRWithoutFloor = false;
        }

        this._mySessionActive = true;
        this._mySessionBlurred = false;

        if (this._myActive) {
            this._updateHeightOffset();
        }
    }

    private _onXRSessionEnd(): void {
        if (this._myParams.mySessionChangeResyncEnabled && this._myActive) {
            if (this._myDelaySessionChangeResyncCounter == 0) {
                let previousHeadTransform = this._getHeadTransformFromLocal(this._myCurrentHeadTransformLocalQuat);

                if (this._myBlurRecoverHeadTransform != null) {
                    previousHeadTransform = this._myBlurRecoverHeadTransform;
                }

                this._mySessionChangeResyncHeadTransform = previousHeadTransform;
            }

            this._myDelaySessionChangeResyncCounter = PlayerHeadManager._myResyncCounterFrames;
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
    }

    private _onXRSessionBlurStart(session: XRSession): void {
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
    }

    private _onXRSessionBlurEnd(session: XRSession): void {
        if (this._myActive) {
            if (this._myDelaySessionChangeResyncCounter == 0) {
                if (this._myParams.myBlurEndResyncEnabled && this._myBlurRecoverHeadTransform != null && this._mySessionActive) {
                    this._myDelayBlurEndResyncCounter = PlayerHeadManager._myResyncCounterFrames;
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
                this._myDelaySessionChangeResyncCounter = PlayerHeadManager._myResyncCounterFrames;
                this._myBlurRecoverHeadTransform = null;
            }
        }

        this._mySessionBlurred = false;
    }

    private static readonly _onViewResetSV =
        {
            identityTransformQuat: Quat2Utils.identity(quat2_create()),
            prevHeadPosition: vec3_create(),
            resetHeadPosition: vec3_create()
        };
    private _onViewReset(): void {
        if (this._myActive) {
            if (!this._myViewResetThisFrame && this._myParams.myResetTransformOnViewResetEnabled && this._mySessionActive && this.isSynced()) {
                this._myViewResetThisFrame = true;
                const previousHeadTransformQuat = this._getHeadTransformFromLocal(this._myCurrentHeadTransformLocalQuat);
                this.teleportPlayerToHeadTransformQuat(previousHeadTransformQuat);

                const isFloor = XRUtils.isReferenceSpaceFloorBased(this._myParams.myEngine);
                if (!isFloor) {
                    const identityTransformQuat = PlayerHeadManager._onViewResetSV.identityTransformQuat;
                    const resetHeadTransformQuat = this._getHeadTransformFromLocal(identityTransformQuat);

                    const prevHeadPosition = PlayerHeadManager._onViewResetSV.prevHeadPosition;
                    const resetHeadPosition = PlayerHeadManager._onViewResetSV.resetHeadPosition;
                    const prevHeadHeight = this._getPositionEyesHeight(previousHeadTransformQuat.quat2_getPosition(prevHeadPosition));
                    const currentHeadHeight = this._getPositionEyesHeight(resetHeadTransformQuat.quat2_getPosition(resetHeadPosition));

                    this._myHeightOffsetWithoutFloor = this._myHeightOffsetWithoutFloor + (prevHeadHeight - currentHeadHeight);
                    this._updateHeightOffset();
                }
            }
        }
    }

    private static readonly _blurEndResyncSV =
        {
            playerUp: vec3_create(),
            currentHeadPosition: vec3_create(),
            recoverHeadPosition: vec3_create(),
            flatCurrentHeadPosition: vec3_create(),
            flatRecoverHeadPosition: vec3_create(),
            recoverMovement: vec3_create(),
            recoverHeadForward: vec3_create(),
            currentHeadForward: vec3_create(),
            rotationToPerform: quat_create()
        };
    private _blurEndResync(): void {
        if (this._myBlurRecoverHeadTransform != null) {
            if (this._mySessionChangeResyncHeadTransform != null) {
                this._myBlurRecoverHeadTransform = null;
                this._sessionChangeResync();
            } else {
                const playerUp = PlayerHeadManager._blurEndResyncSV.playerUp;
                this.getPlayer().pp_getUp(playerUp);

                const currentHeadPosition = PlayerHeadManager._blurEndResyncSV.currentHeadPosition;
                const recoverHeadPosition = PlayerHeadManager._blurEndResyncSV.recoverHeadPosition;
                this._myCurrentHead.pp_getPosition(currentHeadPosition);
                this._myBlurRecoverHeadTransform.quat2_getPosition(recoverHeadPosition);

                const flatCurrentHeadPosition = PlayerHeadManager._blurEndResyncSV.flatCurrentHeadPosition;
                const flatRecoverHeadPosition = PlayerHeadManager._blurEndResyncSV.flatRecoverHeadPosition;
                currentHeadPosition.vec3_removeComponentAlongAxis(playerUp, flatCurrentHeadPosition);
                recoverHeadPosition.vec3_removeComponentAlongAxis(playerUp, flatRecoverHeadPosition);

                const recoverMovement = PlayerHeadManager._blurEndResyncSV.recoverMovement;
                flatRecoverHeadPosition.vec3_sub(flatCurrentHeadPosition, recoverMovement);
                this.moveFeet(recoverMovement);

                const recoverHeadForward = PlayerHeadManager._blurEndResyncSV.recoverHeadForward;
                const currentHeadForward = PlayerHeadManager._blurEndResyncSV.currentHeadForward;
                const rotationToPerform = PlayerHeadManager._blurEndResyncSV.rotationToPerform;
                this._myBlurRecoverHeadTransform.quat2_getForward(recoverHeadForward);
                this._myCurrentHead.pp_getForward(currentHeadForward);
                currentHeadForward.vec3_rotationToPivotedQuat(recoverHeadForward, playerUp, rotationToPerform);

                if (this._myParams.myBlurEndResyncRotation) {
                    this.rotateFeetQuat(rotationToPerform);
                }

                this._myBlurRecoverHeadTransform = null;
            }
        }
    }

    private static readonly _sessionChangeResyncSV =
        {
            currentHeadPosition: vec3_create(),
            resyncHeadPosition: vec3_create(),
            resyncHeadRotation: quat_create(),
            playerUp: vec3_create(),
            flatCurrentHeadPosition: vec3_create(),
            flatResyncHeadPosition: vec3_create(),
            resyncMovement: vec3_create(),
            resyncHeadForward: vec3_create(),
            resyncHeadUp: vec3_create(),
            resyncHeadRight: vec3_create(),
            playerPosition: vec3_create(),
            newPlayerPosition: vec3_create(),
            fixedHeadRight: vec3_create(),
            fixedHeadLeft: vec3_create(),
            fixedHeadUp: vec3_create(),
            fixedHeadForward: vec3_create(),
            fixedHeadRotation: quat_create()
        };
    private _sessionChangeResync(): void {
        if (this._myBlurRecoverHeadTransform == null && this._mySessionChangeResyncHeadTransform != null) {
            if (this._mySessionActive) {
                const currentHeadPosition = PlayerHeadManager._sessionChangeResyncSV.currentHeadPosition;
                const resyncHeadPosition = PlayerHeadManager._sessionChangeResyncSV.resyncHeadPosition;
                const resyncHeadRotation = PlayerHeadManager._sessionChangeResyncSV.resyncHeadRotation;
                this._myCurrentHead.pp_getPosition(currentHeadPosition);
                this._mySessionChangeResyncHeadTransform.quat2_getPosition(resyncHeadPosition);
                this._mySessionChangeResyncHeadTransform.quat2_getRotationQuat(resyncHeadRotation);

                const playerUp = PlayerHeadManager._sessionChangeResyncSV.playerUp;
                this.getPlayer().pp_getUp(playerUp);

                const flatCurrentHeadPosition = PlayerHeadManager._sessionChangeResyncSV.flatCurrentHeadPosition;
                const flatResyncHeadPosition = PlayerHeadManager._sessionChangeResyncSV.flatResyncHeadPosition;
                currentHeadPosition.vec3_removeComponentAlongAxis(playerUp, flatCurrentHeadPosition);
                resyncHeadPosition.vec3_removeComponentAlongAxis(playerUp, flatResyncHeadPosition);

                const resyncMovement = PlayerHeadManager._sessionChangeResyncSV.resyncMovement;
                flatResyncHeadPosition.vec3_sub(flatCurrentHeadPosition, resyncMovement);
                this.moveFeet(resyncMovement);

                if (this._myParams.myEnterSessionResyncHeight || this._myParams.myNextEnterSessionResyncHeight) {
                    this._myParams.myNextEnterSessionResyncHeight = false;
                    const resyncHeadHeight = this._getPositionEyesHeight(resyncHeadPosition);
                    const currentHeadHeight = this._getPositionEyesHeight(currentHeadPosition);

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
                const playerUp = PlayerHeadManager._sessionChangeResyncSV.playerUp;
                this.getPlayer().pp_getUp(playerUp);

                const resyncHeadPosition = PlayerHeadManager._sessionChangeResyncSV.resyncHeadPosition;
                const flatResyncHeadPosition = PlayerHeadManager._sessionChangeResyncSV.flatResyncHeadPosition;
                this._mySessionChangeResyncHeadTransform.quat2_getPosition(resyncHeadPosition);
                resyncHeadPosition.vec3_removeComponentAlongAxis(playerUp, flatResyncHeadPosition);

                const playerPosition = PlayerHeadManager._sessionChangeResyncSV.playerPosition;
                const newPlayerPosition = PlayerHeadManager._sessionChangeResyncSV.newPlayerPosition;
                this.getPlayer().pp_getPosition(playerPosition);
                flatResyncHeadPosition.vec3_add(playerPosition.vec3_componentAlongAxis(playerUp, newPlayerPosition), newPlayerPosition);

                this.getPlayer().pp_setPosition(newPlayerPosition);
                Globals.getPlayerObjects(this._myParams.myEngine)!.myCameraNonXR!.pp_resetPositionLocal();

                if (this._myParams.myExitSessionResyncHeight) {
                    const resyncHeadHeight = this._getPositionEyesHeight(resyncHeadPosition);
                    this._myHeightNonVR = resyncHeadHeight + this._myParams.myForeheadExtraHeight;
                }

                this._updateHeightOffset();

                if (this._myParams.myExitSessionResyncHeight || this._myParams.myExitSessionResetNonVRTransformLocal) {
                    this._setCameraNonXRHeight(this._myHeightNonVR);
                } else {
                    this._setCameraNonXRHeight(this._myHeightNonVROnEnterSession);
                }

                const resyncHeadRotation = PlayerHeadManager._sessionChangeResyncSV.resyncHeadRotation;
                this._mySessionChangeResyncHeadTransform.quat2_getRotationQuat(resyncHeadRotation);

                if (this._myParams.myExitSessionRemoveRightTilt ||
                    this._myParams.myExitSessionAdjustMaxVerticalAngle || !this._myParams.myExitSessionResyncVerticalAngle) {
                    const resyncHeadForward = PlayerHeadManager._sessionChangeResyncSV.resyncHeadForward;
                    const resyncHeadUp = PlayerHeadManager._sessionChangeResyncSV.resyncHeadUp;
                    resyncHeadRotation.quat_getForward(resyncHeadForward);
                    resyncHeadRotation.quat_getUp(resyncHeadUp);

                    const fixedHeadRight = PlayerHeadManager._sessionChangeResyncSV.fixedHeadRight;
                    resyncHeadForward.vec3_cross(playerUp, fixedHeadRight);
                    fixedHeadRight.vec3_normalize(fixedHeadRight);

                    if (!resyncHeadUp.vec3_isConcordant(playerUp)) {
                        const angleForwardUp = resyncHeadForward.vec3_angle(playerUp);
                        const negateAngle = 45;
                        if (angleForwardUp > (180 - negateAngle) || angleForwardUp < negateAngle) {
                            // This way I get a good fixed result for both head upside down and head rotated on forward
                            // When the head is looking down and a bit backward (more than 135 degrees), I want the forward to actually
                            // be the opposite because it's like u rotate back the head up and look forward again
                            fixedHeadRight.vec3_negate(fixedHeadRight);
                        }
                    }

                    if (fixedHeadRight.vec3_isZero(0.000001)) {
                        resyncHeadRotation.quat_getRight(fixedHeadRight);
                    }

                    const fixedHeadUp = PlayerHeadManager._sessionChangeResyncSV.fixedHeadUp;
                    const fixedHeadForward = PlayerHeadManager._sessionChangeResyncSV.fixedHeadForward;
                    fixedHeadRight.vec3_cross(resyncHeadForward, fixedHeadUp);
                    fixedHeadUp.vec3_normalize(fixedHeadUp);
                    fixedHeadUp.vec3_cross(fixedHeadRight, fixedHeadForward);
                    fixedHeadForward.vec3_normalize(fixedHeadForward);

                    const fixedHeadRotation = PlayerHeadManager._sessionChangeResyncSV.fixedHeadRotation;
                    const fixedHeadLeft = PlayerHeadManager._sessionChangeResyncSV.fixedHeadLeft;
                    fixedHeadRotation.quat_fromAxes(fixedHeadRight.vec3_negate(fixedHeadLeft), fixedHeadUp, fixedHeadForward);
                    resyncHeadRotation.quat_copy(fixedHeadRotation);
                }

                if (this._myParams.myExitSessionAdjustMaxVerticalAngle || !this._myParams.myExitSessionResyncVerticalAngle) {
                    const resyncHeadUp = PlayerHeadManager._sessionChangeResyncSV.resyncHeadUp;
                    const resyncHeadRight = PlayerHeadManager._sessionChangeResyncSV.resyncHeadRight;
                    resyncHeadRotation.quat_getUp(resyncHeadUp);
                    resyncHeadRotation.quat_getRight(resyncHeadRight);

                    let maxVerticalAngle = Math.max(0, this._myParams.myExitSessionMaxVerticalAngle - 0.0001);
                    if (!this._myParams.myExitSessionResyncVerticalAngle) {
                        maxVerticalAngle = 0;
                    }

                    const angleWithUp = Math.pp_angleClamp(resyncHeadUp.vec3_angleSigned(playerUp, resyncHeadRight));
                    if (Math.abs(angleWithUp) > maxVerticalAngle) {
                        const fixAngle = (Math.abs(angleWithUp) - maxVerticalAngle) * Math.pp_sign(angleWithUp);
                        resyncHeadRotation.quat_rotateAxis(fixAngle, resyncHeadRight, resyncHeadRotation);
                    }
                }

                this.setRotationHeadQuat(resyncHeadRotation);
            }

            this._mySessionChangeResyncHeadTransform = null;
        }
    }

    private static readonly _setReferenceSpaceHeightOffsetSV =
        {
            referenceSpacePosition: vec3_create(),
            referenceSpacePositionLocalToPlayer: vec3_create(),
            adjustedReferenceSpacePosition: vec3_create(),
            playerTransform: mat4_create()
        };
    private _setReferenceSpaceHeightOffset(offset: number, amountToRemove: number): void {
        if (offset != null) {
            const referenceSpacePosition = PlayerHeadManager._setReferenceSpaceHeightOffsetSV.referenceSpacePosition;
            const referenceSpacePositionLocalToPlayer = PlayerHeadManager._setReferenceSpaceHeightOffsetSV.referenceSpacePositionLocalToPlayer;
            const playerTransform = PlayerHeadManager._setReferenceSpaceHeightOffsetSV.playerTransform;
            Globals.getPlayerObjects(this._myParams.myEngine)!.myReferenceSpace!.pp_getPosition(referenceSpacePosition);
            referenceSpacePosition.vec3_convertPositionToLocal(this.getPlayer().pp_getTransform(playerTransform), referenceSpacePositionLocalToPlayer);
            referenceSpacePositionLocalToPlayer.vec3_set(referenceSpacePositionLocalToPlayer[0], offset - amountToRemove, referenceSpacePositionLocalToPlayer[2]);

            const adjustedReferenceSpacePosition = PlayerHeadManager._setReferenceSpaceHeightOffsetSV.adjustedReferenceSpacePosition;
            referenceSpacePositionLocalToPlayer.vec3_convertPositionToWorld(this.getPlayer().pp_getTransform(playerTransform), adjustedReferenceSpacePosition);
            Globals.getPlayerObjects(this._myParams.myEngine)!.myReferenceSpace!.pp_setPosition(adjustedReferenceSpacePosition);
        }
    }

    private _updateHeightOffset(): void {
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
    }

    private static readonly _getHeadTransformFromLocalSV =
        {
            direction: vec3_create(),
            feetPosition: vec3_create()
        };
    private _getHeadTransformFromLocal(transformLocal: Readonly<Quaternion2>): Quaternion2 {
        return this._myCurrentHead.pp_convertTransformLocalToWorldQuat(transformLocal);
    }

    private static readonly _resyncHeadRotationForwardSV =
        {
            playerUp: vec3_create(),
            resyncHeadForward: vec3_create(),
            resyncHeadUp: vec3_create(),
            fixedResyncHeadRotation: quat_create()
        };
    private _resyncHeadRotationForward(resyncHeadRotation: Readonly<Quaternion>): void {
        const playerUp = PlayerHeadManager._resyncHeadRotationForwardSV.playerUp;
        const resyncHeadForward = PlayerHeadManager._resyncHeadRotationForwardSV.resyncHeadForward;
        const resyncHeadUp = PlayerHeadManager._resyncHeadRotationForwardSV.resyncHeadUp;
        this.getPlayer().pp_getUp(playerUp);
        resyncHeadRotation.quat_getForward(resyncHeadForward);
        resyncHeadRotation.quat_getUp(resyncHeadUp);

        const fixedResyncHeadRotation = PlayerHeadManager._resyncHeadRotationForwardSV.fixedResyncHeadRotation;
        fixedResyncHeadRotation.quat_copy(resyncHeadRotation);
        fixedResyncHeadRotation.quat_setUp(playerUp, resyncHeadForward);

        if (!resyncHeadUp.vec3_isConcordant(playerUp)) {
            // If it was upside down, it's like it has to rotate the neck back up,so the forward is actually on the opposite side
            fixedResyncHeadRotation.quat_rotateAxis(180, playerUp, fixedResyncHeadRotation);
        }

        this.setRotationFeetQuat(fixedResyncHeadRotation);
    }

    private _debugUpdate(dt: number): void {
        Globals.getDebugVisualManager(this._myParams.myEngine)!.drawLineEnd(0, this.getPositionFeet(), this.getPositionHead(), vec4_create(1, 0, 0, 1), 0.01);

        console.error(this.getHeightEyes());
    }

    public destroy(): void {
        this._myDestroyed = true;

        XRUtils.getReferenceSpace(this._myParams.myEngine)?.removeEventListener("reset", this._myViewResetEventListener!);
        XRUtils.getSession(this._myParams.myEngine)?.removeEventListener("visibilitychange", this._myVisibilityChangeEventListener!);
        XRUtils.unregisterSessionStartEndEventListeners(this, this._myParams.myEngine);
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }
}
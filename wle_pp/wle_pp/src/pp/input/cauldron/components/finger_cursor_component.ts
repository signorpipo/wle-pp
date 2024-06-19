import { Collider, CollisionComponent, Component, Object3D, PhysXComponent, Shape } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { Cursor } from "@wonderlandengine/components";
import { PhysicsLayerFlags } from "../../../cauldron/physics/physics_layer_flags.js";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { Handedness, InputSourceType, TrackedHandJointID } from "../input_types.js";
import { InputUtils } from "../input_utils.js";
import { OverlapCursorComponent } from "./overlap_cursor_component.js";

/** #WARN This class is actually adding an `OverlapCursorComponent` so use that if you want to interact with the cursor */
export class FingerCursorComponent extends Component {
    static override TypeName = "pp-finger-cursor";

    @property.enum(["Left", "Right"], "Left")
    private readonly _myHandedness!: number;

    @property.enum(["Thumb", "Index", "Middle", "Ring", "Pinky"], "Index")
    private readonly _myFinger!: number;

    @property.enum(["PhysX", "Collision"], "PhysX")
    private readonly _myCollisionMode!: number;

    @property.string("0, 0, 0, 0, 0, 0, 0, 0")
    private readonly _myCollisionFlags!: string;

    @property.float(0.0125)
    private readonly _myCollisionSize!: number;

    @property.float(1.25)
    private readonly _myCollisionSizeMultiplierOnOverlap!: number;

    @property.float(90)
    private readonly _myValidOverlapAngleFromTargetForward!: number;

    @property.object()
    private readonly _myCursorPointerObject!: Object3D;

    @property.bool(true)
    private readonly _myDisableDefaultCursorOnTrackedHandDetected!: boolean;

    @property.object()
    private readonly _myDefaultCursorObject!: Readonly<Object3D>;

    private readonly _myHandednessType!: Handedness;
    private readonly _myFingerJointID!: TrackedHandJointID;
    private _myDefaultCursorComponent: Cursor | null = null;
    private _myHandInputSource: Readonly<XRInputSource> | null = null;
    private _myForceRefreshActiveCursor: boolean = true;

    private readonly _myCursorParentObject!: Object3D;
    private readonly _myActualCursorParentObject!: Object3D;
    private readonly _myOverlapCursorComponent!: OverlapCursorComponent;

    public override init(): void {
        (this._myHandednessType as Handedness) = InputUtils.getHandednessByIndex(this._myHandedness)!;

        switch (this._myFinger) {
            case 0:
                (this._myFingerJointID as TrackedHandJointID) = TrackedHandJointID.THUMB_TIP;
                break;
            case 1:
                (this._myFingerJointID as TrackedHandJointID) = TrackedHandJointID.INDEX_FINGER_TIP;
                break;
            case 2:
                (this._myFingerJointID as TrackedHandJointID) = TrackedHandJointID.MIDDLE_FINGER_TIP;
                break;
            case 3:
                (this._myFingerJointID as TrackedHandJointID) = TrackedHandJointID.RING_FINGER_TIP;
                break;
            case 4:
                (this._myFingerJointID as TrackedHandJointID) = TrackedHandJointID.PINKY_FINGER_TIP;
                break;
        }
    }

    public override start(): void {
        (this._myCursorParentObject as Object3D) = this.object.pp_addObject();

        if (this._myCursorPointerObject == null) {
            (this._myActualCursorParentObject as Object3D) = this._myCursorParentObject.pp_addObject();
        } else {
            (this._myActualCursorParentObject as Object3D) = this._myCursorPointerObject;
        }

        this._myActualCursorParentObject.pp_setParent(this._myCursorParentObject);

        const physicsFlags = new PhysicsLayerFlags();
        const flags = [...this._myCollisionFlags.split(",")];
        for (let i = 0; i < flags.length; i++) {
            physicsFlags.setFlagActive(i, flags[i].trim() == "1");
        }

        if (this._myCollisionMode == 0) {
            this._myActualCursorParentObject.pp_addComponent(PhysXComponent, {
                shape: Shape.Sphere,
                extents: vec3_create(this._myCollisionSize, this._myCollisionSize, this._myCollisionSize),
                kinematic: true,
                trigger: true,
                groupsMask: physicsFlags.getMask()
            })!;
        } else if (this._myCollisionMode == 1) {
            const collisionComponent = this._myActualCursorParentObject.pp_addComponent(CollisionComponent)!;
            collisionComponent.collider = Collider.Sphere;
            collisionComponent.extents = vec3_create(this._myCollisionSize, this._myCollisionSize, this._myCollisionSize);
            collisionComponent.group = physicsFlags.getMask();
        }

        if (this._myDisableDefaultCursorOnTrackedHandDetected) {
            let defaultCursorObject: Readonly<Object3D> = this.object;
            if (this._myDefaultCursorObject != null) {
                defaultCursorObject = this._myDefaultCursorObject;
            }

            this._myDefaultCursorComponent = defaultCursorObject.pp_getComponent(Cursor);
        }

        (this._myOverlapCursorComponent as OverlapCursorComponent) = this._myActualCursorParentObject.pp_addComponent(OverlapCursorComponent, {
            _myCollisionSizeMultiplierOnOverlap: this._myCollisionSizeMultiplierOnOverlap,
            _myValidOverlapAngleFromTargetForward: this._myValidOverlapAngleFromTargetForward,
        })!;

        this._myCursorParentObject.pp_setActive(false);
    }

    public override update(dt: number): void {
        this._myCursorParentObject.pp_setTransformQuat(Globals.getPlayerObjects(this.engine)!.myReferenceSpace!.pp_getTransformQuat());
        this._updateHand();
    }

    public override onActivate(): void {
        this._myForceRefreshActiveCursor = true;
    }

    public override onDeactivate(): void {
        if (this._myCursorParentObject != null) {
            this._myCursorParentObject.pp_setActive(false);
        }
    }

    private _updateHand(): void {
        const newHandInputSource = InputUtils.getInputSource(this._myHandednessType, InputSourceType.TRACKED_HAND, this.engine);

        if (newHandInputSource != null && (this._myHandInputSource == null || this._myForceRefreshActiveCursor)) {
            if (this._myDefaultCursorComponent != null) {
                this._myDefaultCursorComponent.active = false;
            }

            this._myCursorParentObject.pp_setActive(true);
        } else if (newHandInputSource == null && (this._myHandInputSource != null || this._myForceRefreshActiveCursor)) {
            this._myCursorParentObject.pp_setActive(false);

            if (this._myDefaultCursorComponent != null) {
                this._myDefaultCursorComponent.active = true;
            }
        }

        this._myHandInputSource = newHandInputSource;

        if (this._myHandInputSource != null) {
            let tip: XRJointPose | null = null;

            try {
                const xrFrame = XRUtils.getFrame(this.engine)!;
                if (xrFrame.getJointPose != null) {
                    tip = xrFrame.getJointPose(this._myHandInputSource.hand!.get(this._myFingerJointID)!, XRUtils.getReferenceSpace(this.engine)!) ?? null;
                }
            } catch (error) {
                // Do nothing
            }

            if (tip != null) {
                this._myActualCursorParentObject.pp_setRotationLocalQuat([
                    tip.transform.orientation.x,
                    tip.transform.orientation.y,
                    tip.transform.orientation.z,
                    tip.transform.orientation.w]);

                this._myActualCursorParentObject.pp_setPositionLocal([
                    tip.transform.position.x,
                    tip.transform.position.y,
                    tip.transform.position.z]);
            }
        }
    }
}
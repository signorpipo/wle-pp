import { CollisionComponent, Component, Object3D, PhysXComponent, property } from "@wonderlandengine/api";
import { Cursor, CursorTarget } from "@wonderlandengine/components";
import { PhysicsCollisionCollector } from "../../../cauldron/physics/physics_collision_collector.js";
import { Vector3 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";

/** #WARN This class is not actually a `Cursor`, but since it triggers `CursorTarget` emitters, it needs to forward a `Cursor` to them  
    As of now, this class forward a fake cursor as `Cursor`, which is a plain object with just the info usually need, like the `handedness` value */
export class OverlapCursorComponent extends Component {
    public static override TypeName = "pp-overlap-cursor";

    /** 
     * This is useful if you want to avoid the cursor entering and exiting the target when very close to the target,  
     * due to it flickering between inside and outside.  
     * You can scale the collision up a bit so that it needs to move a bit outside to actually exit, so that it will not collide 
     *  
     * #WARN When using a `PhysXComponent` sadly this require to active and deactivate it to update the extents, which triggers a collision end and a start  
     * This is not an issue for the cursor, but if you use the same `PhysXComponent` for other queries, you might have issues due to this 
     */
    @property.float(1.125)
    private readonly _myCollisionSizeMultiplierOnOverlap!: number;

    @property.float(90)
    private readonly _myValidOverlapAngleFromTargetForward!: number;

    private _myLastTarget: CursorTarget | null = null;

    private _myPhysXComponent: PhysXComponent | null = null;
    private _myPhysicsCollisionCollector: PhysicsCollisionCollector | null = null;
    private readonly _myPhysXComponentExtents: Vector3 = vec3_create();
    private _myCollisionComponent: CollisionComponent | null = null;
    private readonly _myCollisionComponentExtents: Vector3 = vec3_create();
    private readonly _myFakeCursor!: Cursor;

    private readonly _myCursorPositionHistory: Vector3[] = [];
    private readonly _myInvalidOverlapCursorTargets: CursorTarget[] = [];

    private _myDoubleClickTimer: number = 0;
    private _myTripleClickTimer: number = 0;
    private _myMultipleClickObject: Readonly<Object3D> | null = null;

    private static readonly _myMultipleClickDelay: number = 0.3;

    private static _SV = {
        componentEqualCallback(first: CursorTarget, second: CursorTarget): boolean {
            return first == second;
        }
    };

    public override init(): void {
        const fakeCursor = {
            handedness: null,
            handednessTyped: null,
            object: this.object,
            cursorPos: vec3_create()
        };

        (this._myFakeCursor as Cursor) = fakeCursor as unknown as Cursor;

        for (let i = 0; i < 5; i++) {
            this._myCursorPositionHistory.push(vec3_create());
        }
    }

    public override start(): void {
        this._myPhysXComponent = this.object.pp_getComponent(PhysXComponent);
        if (this._myPhysXComponent != null) {
            this._myPhysicsCollisionCollector = new PhysicsCollisionCollector(this._myPhysXComponent);

            this._myPhysXComponentExtents.vec3_copy(this._myPhysXComponent.extents);
        }

        this._myCollisionComponent = this.object.pp_getComponent(CollisionComponent);
        if (this._myCollisionComponent != null) {
            this._myCollisionComponentExtents.vec3_copy(this._myCollisionComponent.extents);
        }
    }

    public override update(dt: number): void {
        if (this._myDoubleClickTimer > 0) {
            this._myDoubleClickTimer -= dt;
        }

        if (this._myTripleClickTimer > 0) {
            this._myTripleClickTimer -= dt;
        }

        for (let i = this._myCursorPositionHistory.length - 1; i > 0; i--) {
            this._myCursorPositionHistory[i].vec3_copy(this._myCursorPositionHistory[i - 1]);
        }
        this.object.pp_getPosition(this._myCursorPositionHistory[0]);
        this._myFakeCursor.cursorPos.vec3_copy(this._myCursorPositionHistory[0]);

        let bestCursorTarget = null;
        const processedCursorTargets: CursorTarget[] = [];

        if (this._myCollisionComponent != null) {
            const collisions = this._myCollisionComponent!.queryOverlaps();
            for (const collision of collisions) {
                if (collision.group & this._myCollisionComponent!.group) {
                    const target = collision.object.pp_getComponentSelf(CursorTarget);
                    if (target != null && target.active) {
                        processedCursorTargets.push(target);
                        bestCursorTarget = this._pickBestCursorTarget(bestCursorTarget, target);
                    }
                }
            }
        }

        if (this._myPhysicsCollisionCollector != null) {
            this._myPhysicsCollisionCollector.update(dt);
            const collisions = this._myPhysicsCollisionCollector.getCollisions();
            for (const collision of collisions) {
                const target = collision.object.pp_getComponentSelf(CursorTarget);
                if (target != null && target.active) {
                    processedCursorTargets.push(target);
                    bestCursorTarget = this._pickBestCursorTarget(bestCursorTarget, target);
                }
            }
        }

        if (this._myInvalidOverlapCursorTargets.length > 0) {
            const componentEqualCallback = OverlapCursorComponent._SV.componentEqualCallback;
            this._myInvalidOverlapCursorTargets.pp_removeAll((elementToCheck) => {
                return !processedCursorTargets.pp_hasEqual(elementToCheck, componentEqualCallback);
            });
        }

        if (bestCursorTarget == null) {
            this._targetOverlapEnd();
        } else if (bestCursorTarget != this._myLastTarget) {
            this._targetOverlapEnd();

            this._myLastTarget = bestCursorTarget;

            this._targetOverlapStart();
        }
    }

    public override onActivate(): void {
        if (this._myPhysicsCollisionCollector != null) {
            this._myPhysicsCollisionCollector.setActive(true);
        }
    }

    public override onDeactivate(): void {
        this._targetOverlapEnd();

        if (this._myPhysicsCollisionCollector != null) {
            this._myPhysicsCollisionCollector.setActive(false);
        }
    }

    private _targetOverlapStart(): void {
        if (this._myCollisionSizeMultiplierOnOverlap != 1 && !this._myLastTarget!.isSurface) {
            if (this._myPhysXComponent != null) {
                this._myPhysXComponent.extents = this._myPhysXComponentExtents.vec3_scale(this._myCollisionSizeMultiplierOnOverlap);

                this._myPhysicsCollisionCollector!.setActive(false);
                this._myPhysXComponent.active = false;
                this._myPhysicsCollisionCollector!.setActive(true);
                this._myPhysXComponent.active = true;
            }

            if (this._myCollisionComponent != null) {
                this._myCollisionComponent.extents = this._myCollisionComponentExtents.vec3_scale(this._myCollisionSizeMultiplierOnOverlap);
            }
        }

        this._myLastTarget!.onHover.notify(this._myLastTarget!.object, this._myFakeCursor);
        this._myLastTarget!.onDown.notify(this._myLastTarget!.object, this._myFakeCursor);
    }

    private _targetOverlapEnd(): void {
        if (this._myLastTarget != null) {
            if (this._myCollisionSizeMultiplierOnOverlap != 1) {
                if (this._myPhysXComponent != null) {
                    this._myPhysXComponent.extents = this._myPhysXComponentExtents;

                    this._myPhysicsCollisionCollector!.setActive(false);
                    this._myPhysXComponent.active = false;
                    this._myPhysicsCollisionCollector!.setActive(true);
                    this._myPhysXComponent.active = true;
                }

                if (this._myCollisionComponent != null) {
                    this._myCollisionComponent.extents = this._myCollisionComponentExtents;
                }
            }

            if (!this._myLastTarget.isDestroyed && this._myLastTarget.active) {
                this._myLastTarget.onClick.notify(this._myLastTarget.object, this._myFakeCursor);

                if (this._myTripleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject == this._myLastTarget.object) {
                    this._myLastTarget.onTripleClick.notify(this._myLastTarget.object, this._myFakeCursor);

                    this._myTripleClickTimer = 0;
                } else if (this._myDoubleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject == this._myLastTarget.object) {
                    this._myLastTarget.onDoubleClick.notify(this._myLastTarget.object, this._myFakeCursor);

                    this._myTripleClickTimer = OverlapCursorComponent._myMultipleClickDelay;
                    this._myDoubleClickTimer = 0;
                } else {
                    this._myLastTarget.onSingleClick.notify(this._myLastTarget.object, this._myFakeCursor);

                    this._myTripleClickTimer = 0;
                    this._myDoubleClickTimer = OverlapCursorComponent._myMultipleClickDelay;
                    this._myMultipleClickObject = this._myLastTarget.object;
                }

                this._myLastTarget.onUp.notify(this._myLastTarget.object, this._myFakeCursor);
                this._myLastTarget.onUpWithDown.notify(this._myLastTarget.object, this._myFakeCursor);

                this._myLastTarget.onUnhover.notify(this._myLastTarget.object, this._myFakeCursor);
            }

            this._myLastTarget = null;
        }
    }

    private _pickBestCursorTarget(currentBestCursorTarget: CursorTarget | null, cursorTarget: CursorTarget): CursorTarget | null {
        let bestCursorTarget = currentBestCursorTarget;

        if (cursorTarget == this._myLastTarget) {
            bestCursorTarget = cursorTarget;
        } else {
            const componentEqualCallback = OverlapCursorComponent._SV.componentEqualCallback;
            if (!this._myInvalidOverlapCursorTargets.pp_hasEqual(cursorTarget, componentEqualCallback)) {
                const isAngleValid = this._isOverlapAngleValid(cursorTarget.object);

                if (isAngleValid) {
                    if (bestCursorTarget == null || (!cursorTarget.isSurface && bestCursorTarget.isSurface)) {
                        bestCursorTarget = cursorTarget;
                    }
                } else {
                    this._myInvalidOverlapCursorTargets.push(cursorTarget);
                }
            }
        }

        return bestCursorTarget;
    }

    private static _isOverlapAngleValidSV =
        {
            cursorPosition: vec3_create(),
            targetPosition: vec3_create(),
            targetForward: vec3_create(),
            directionToCursor: vec3_create()
        };
    private _isOverlapAngleValid(targetObject: Readonly<Object3D>): boolean {
        if (this._myValidOverlapAngleFromTargetForward == 180) {
            return true;
        }

        const targetPosition = OverlapCursorComponent._isOverlapAngleValidSV.targetPosition;
        const targetForward = OverlapCursorComponent._isOverlapAngleValidSV.targetForward;
        targetObject.pp_getPosition(targetPosition);
        targetObject.pp_getForward(targetForward);

        const directionToCursor = OverlapCursorComponent._isOverlapAngleValidSV.directionToCursor;
        this._myCursorPositionHistory.pp_last()!.vec3_sub(targetPosition, directionToCursor).vec3_normalize(directionToCursor);

        const overlapAngle = directionToCursor.vec3_angle(targetForward);

        return overlapAngle <= this._myValidOverlapAngleFromTargetForward;
    }
}
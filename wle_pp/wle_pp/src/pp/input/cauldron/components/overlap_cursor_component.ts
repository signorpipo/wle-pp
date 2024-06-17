import { CollisionComponent, Component, Object3D, PhysXComponent } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { Cursor, CursorTarget } from "@wonderlandengine/components";
import { PhysicsCollisionCollector } from "../../../cauldron/physics/physics_collision_collector.js";

/** #WARN This class is not actually a `Cursor`, but since it triggers `CursorTarget` emitters, it needs to forward a `Cursor` to them  
    As of now, this class forward a fake cursor as `Cursor`, which is a plain object with just the info usually need, like the `handedness` value */
export class OverlapCursorComponent extends Component {
    static override TypeName = "pp-overlap-cursor";

    @property.bool(true)
    private readonly _myMultipleClicksEnabled!: boolean;

    private _myLastTarget: CursorTarget | null = null;

    private _myPhysicsCollisionCollector: PhysicsCollisionCollector | null = null;
    private _myCollisionComponent: CollisionComponent | null = null;
    private readonly _myFakeCursor!: Cursor;

    private _myDoubleClickTimer: number = 0;
    private _myTripleClickTimer: number = 0;
    private _myMultipleClickObject: Readonly<Object3D> | null = null;

    private static _myMultipleClickDelay: number = 0.3;

    public override init(): void {

        const fakeCursor = {
            handedness: 3,
            object: this.object
        };

        (this._myFakeCursor as Cursor) = fakeCursor as unknown as Cursor;
    }

    public override start(): void {
        const physxComponent = this.object.pp_getComponent(PhysXComponent);
        if (physxComponent != null) {
            this._myPhysicsCollisionCollector = new PhysicsCollisionCollector(physxComponent, true);
        }

        this._myCollisionComponent = this.object.pp_getComponent(CollisionComponent);
    }

    public override update(dt: number): void {
        if (this._myDoubleClickTimer > 0) {
            this._myDoubleClickTimer -= dt;
        }

        if (this._myTripleClickTimer > 0) {
            this._myTripleClickTimer -= dt;
        }

        if (this._myCollisionComponent != null) {
            const collisions = this._myCollisionComponent!.queryOverlaps();
            let collisionTarget = null;
            for (let i = 0; i < collisions.length; ++i) {
                const collision = collisions[i];
                if (collision.group & this._myCollisionComponent!.group) {
                    const object = collision.object;
                    const target = object.pp_getComponent(CursorTarget);
                    if (target && (collisionTarget == null || !target.isSurface)) {
                        collisionTarget = target;
                        if (!target.isSurface) {
                            break;
                        }
                    }
                }
            }

            if (collisionTarget == null) {
                this._targetTouchEnd();
            } else if (!collisionTarget.equals(this._myLastTarget)) {
                this._targetTouchEnd();

                this._myLastTarget = collisionTarget;

                this._targetTouchStart();
            }
        } else {
            const collisions = this._myPhysicsCollisionCollector!.getCollisions();
            let collisionTarget = null;
            for (const collision of collisions) {
                const target = collision.object.pp_getComponent(CursorTarget);
                if (target && (collisionTarget == null || !target.isSurface)) {
                    collisionTarget = target;
                    if (!target.isSurface) {
                        break;
                    }
                }
            }

            if (collisionTarget == null) {
                this._targetTouchEnd();
            } else if (!collisionTarget.equals(this._myLastTarget)) {
                this._targetTouchEnd();

                this._myLastTarget = collisionTarget;

                this._targetTouchStart();
            }
        }
    }

    public override onDeactivate(): void {
        this._targetTouchEnd();
    }

    private _targetTouchStart(): void {
        this._myLastTarget!.onHover.notify(this._myLastTarget!.object, this._myFakeCursor);
        this._myLastTarget!.onDown.notify(this._myLastTarget!.object, this._myFakeCursor);
    }

    private _targetTouchEnd(): void {
        if (this._myLastTarget != null) {
            this._myLastTarget.onClick.notify(this._myLastTarget.object, this._myFakeCursor);

            if (this._myMultipleClicksEnabled && this._myTripleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject.pp_equals(this._myLastTarget.object)) {
                this._myLastTarget.onTripleClick.notify(this._myLastTarget.object, this._myFakeCursor);

                this._myTripleClickTimer = 0;
            } else if (this._myMultipleClicksEnabled && this._myDoubleClickTimer > 0 && this._myMultipleClickObject && this._myMultipleClickObject.pp_equals(this._myLastTarget.object)) {
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

            this._myLastTarget = null;
        }
    }
}
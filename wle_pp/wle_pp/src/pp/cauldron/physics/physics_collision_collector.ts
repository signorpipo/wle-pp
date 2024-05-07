import { CollisionEventType, Emitter, Object3D, PhysXComponent } from "@wonderlandengine/api";
import { Timer } from "../cauldron/timer.js";

export class PhysicsCollisionCollector {

    private readonly _myPhysXComponent: PhysXComponent;
    private readonly _myIsTrigger: boolean;

    private _myActive: boolean = false;

    private _myCollisionCallbackID: number | null = null;

    private _myCollisionEmitter: Emitter<[PhysXComponent, PhysXComponent, CollisionEventType]> = new Emitter();
    private _myCollisionStartEmitter: Emitter<[PhysXComponent, PhysXComponent, CollisionEventType]> = new Emitter();
    private _myCollisionEndEmitter: Emitter<[PhysXComponent, PhysXComponent, CollisionEventType]> = new Emitter();

    private readonly _myCollisions: PhysXComponent[] = [];
    private _myCollisionsStarted: PhysXComponent[] = [];
    private _myCollisionsEnded: PhysXComponent[] = [];
    private _myCollisionsStartedToProcess: PhysXComponent[] = [];
    private _myCollisionsEndedToProcess: PhysXComponent[] = [];

    // This separation is needed so it's possible to return the physx component list without having to build it every time
    // Beside, this is only needed due to trigger not detecting a collision end if the physX component they are colliding with goes inactive or is destroyed
    private readonly _myCollisionObjects: Object3D[] = [];
    private _myCollisionObjectsStarted: Object3D[] = [];
    private _myCollisionObjectsEnded: Object3D[] = [];
    private _myCollisionObjectsStartedToProcess: Object3D[] = [];
    private _myCollisionObjectsEndedToProcess: Object3D[] = [];

    private _myUpdateActive: boolean = false;

    private readonly _myTriggerDesyncFixDelay: Timer = new Timer(0.1);

    private _myLogEnabled: boolean = false;

    private _myDestroyed: boolean = false;



    constructor(physXComponent: PhysXComponent, isTrigger: boolean = false) {
        this._myPhysXComponent = physXComponent;

        this._myIsTrigger = isTrigger;

        this.setActive(true);
    }

    public getPhysXComponent(): PhysXComponent {
        return this._myPhysXComponent;
    }

    public getCollisions(): Readonly<PhysXComponent[]> {
        return this._myCollisions;
    }

    public getCollisionsStarted(): Readonly<PhysXComponent[]> {
        return this._myCollisionsStarted;
    }

    public getCollisionsEnded(): Readonly<PhysXComponent[]> {
        return this._myCollisionsEnded;
    }

    public isActive(): boolean {
        return this._myActive;
    }

    public setActive(active: boolean): void {
        if (this._myActive != active) {
            this._myActive = active;

            this._myCollisions.pp_clear();
            this._myCollisionObjects.pp_clear();

            this._myCollisionsStarted.pp_clear();
            this._myCollisionObjectsStarted.pp_clear();
            this._myCollisionsEnded.pp_clear();
            this._myCollisionObjectsEnded.pp_clear();
            this._myUpdateActive = false;
            this._myCollisionsStartedToProcess.pp_clear();
            this._myCollisionObjectsStartedToProcess.pp_clear();
            this._myCollisionsEndedToProcess.pp_clear();
            this._myCollisionObjectsEndedToProcess.pp_clear();

            if (this._myActive) {
                this._myCollisionCallbackID = this._myPhysXComponent.onCollision(this._onCollision.bind(this));
            } else if (this._myCollisionCallbackID != null) {
                this._myPhysXComponent.removeCollisionCallback(this._myCollisionCallbackID);
                this._myCollisionCallbackID = null;
            }
        }
    }

    // Set to true only if u are going to actually update this object and don't want to lose any collision start/end events prior to updating the first time after activation
    public setUpdateActive(active: boolean): void {
        this._myUpdateActive = active;
    }

    // Update is not mandatory, use it only if u want to access collisions start and end
    public update(dt: number): void {
        if (!this._myActive) {
            return;
        }

        this._myUpdateActive = true;

        const prevCollisionsStartToProcess = this._myCollisionsStartedToProcess;
        this._myCollisionsStartedToProcess = this._myCollisionsStarted;
        this._myCollisionsStartedToProcess.pp_clear();
        this._myCollisionsStarted = prevCollisionsStartToProcess;

        const prevCollisionObjectsStartToProcess = this._myCollisionObjectsStartedToProcess;
        this._myCollisionObjectsStartedToProcess = this._myCollisionObjectsStarted;
        this._myCollisionObjectsStartedToProcess.pp_clear();
        this._myCollisionObjectsStarted = prevCollisionObjectsStartToProcess;

        const prevCollisionsEndToProcess = this._myCollisionsEndedToProcess;
        this._myCollisionsEndedToProcess = this._myCollisionsEnded;
        this._myCollisionsEndedToProcess.pp_clear();
        this._myCollisionsEnded = prevCollisionsEndToProcess;

        const prevCollisionObjectsEndToProcess = this._myCollisionObjectsEndedToProcess;
        this._myCollisionObjectsEndedToProcess = this._myCollisionObjectsEnded;
        this._myCollisionObjectsEndedToProcess.pp_clear();
        this._myCollisionObjectsEnded = prevCollisionObjectsEndToProcess;

        if (this._myIsTrigger) {
            this._triggerDesyncFix(dt);
        }
    }

    public isLogEnabled(): boolean {
        return this._myLogEnabled;
    }

    public setLogEnabled(enabled: boolean): void {
        this._myLogEnabled = enabled;
    }

    public registerCollisionEventListener(id: Readonly<any>, listener: (currentPhysX: PhysXComponent, otherPhysX: PhysXComponent, collisionType: CollisionEventType) => void): void {
        this._myCollisionEmitter.add(listener, { id: id });
    }

    public unregisterCollisionEventListener(id: Readonly<any>): void {
        this._myCollisionEmitter.remove(id);
    }

    public registerCollisionStartEventListener(id: Readonly<any>, listener: (currentPhysX: PhysXComponent, otherPhysX: PhysXComponent, collisionType: CollisionEventType) => void): void {
        this._myCollisionStartEmitter.add(listener, { id: id });
    }

    public unregisterCollisionStartEventListener(id: Readonly<any>): void {
        this._myCollisionStartEmitter.remove(id);
    }

    public registerCollisionEndEventListener(id: Readonly<any>, listener: (currentPhysX: PhysXComponent, otherPhysX: PhysXComponent, collisionType: CollisionEventType) => void): void {
        this._myCollisionEndEmitter.add(listener, { id: id });
    }

    public unregisterCollisionEndEventListener(id: Readonly<any>): void {
        this._myCollisionEndEmitter.remove(id);
    }

    private _onCollision(type: CollisionEventType, physXComponent: PhysXComponent): void {
        if (type == CollisionEventType.Touch || type == CollisionEventType.TriggerTouch) {
            this._onCollisionStart(type, physXComponent);
        } else if (type == CollisionEventType.TouchLost || type == CollisionEventType.TriggerTouchLost) {
            this._onCollisionEnd(type, physXComponent);
        }

        this._myCollisionEmitter.notify(this._myPhysXComponent, physXComponent, type);
    }

    private _onCollisionStart(type: CollisionEventType, physXComponent: PhysXComponent): void {
        if (this._myLogEnabled) {
            let componentFound = false;
            for (const physXComponentToCheck of this._myCollisions) {
                if (physXComponentToCheck.equals(physXComponent)) {
                    componentFound = true;
                    break;
                }
            }

            if (componentFound) {
                console.error("Collision Start on PhysX component already collected");
            }
        }

        this._myCollisions.push(physXComponent);
        this._myCollisionObjects.push(physXComponent.object);

        if (this._myUpdateActive) {
            this._myCollisionsStartedToProcess.push(physXComponent);
            this._myCollisionObjectsStartedToProcess.push(physXComponent.object);

            const indexesToRemove = this._myCollisionsEndedToProcess.pp_findAllIndexes(function (physXComponentToCheck: PhysXComponent) {
                return physXComponentToCheck.equals(physXComponent);
            });

            for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                this._myCollisionsEndedToProcess.pp_removeIndex(indexesToRemove[i]);
                this._myCollisionObjectsEndedToProcess.pp_removeIndex(indexesToRemove[i]);
            }
        }

        if (this._myLogEnabled) {
            console.log("Collision Start - Object ID: " + physXComponent.object.pp_getID());
        }

        this._myCollisionStartEmitter.notify(this._myPhysXComponent, physXComponent, type);
    }

    private _onCollisionEnd(type: CollisionEventType, physXComponent: PhysXComponent): void {
        if (this._myLogEnabled) {
            let componentFound = false;
            for (const physXComponentToCheck of this._myCollisions) {
                if (physXComponentToCheck.equals(physXComponent)) {
                    componentFound = true;
                    break;
                }
            }

            if (!componentFound) {
                console.error("Collision End on physX component not collected - Object ID: " + physXComponent.object.pp_getID());
            }
        }

        const indexesToRemove = this._myCollisions.pp_findAllIndexes(function (physXComponentToCheck: PhysXComponent) {
            return physXComponentToCheck.equals(physXComponent);
        });

        for (let i = indexesToRemove.length - 1; i >= 0; i--) {
            this._myCollisions.pp_removeIndex(indexesToRemove[i]);
            this._myCollisionObjects.pp_removeIndex(indexesToRemove[i]);
        }

        if (this._myUpdateActive) {
            this._myCollisionsEndedToProcess.push(physXComponent);
            this._myCollisionObjectsEndedToProcess.push(physXComponent.object);

            const indexesToRemove = this._myCollisionsStartedToProcess.pp_findAllIndexes(function (physXComponentToCheck: PhysXComponent) {
                return physXComponentToCheck.equals(physXComponent);
            });

            for (let i = indexesToRemove.length - 1; i >= 0; i--) {
                this._myCollisionsStartedToProcess.pp_removeIndex(indexesToRemove[i]);
                this._myCollisionObjectsStartedToProcess.pp_removeIndex(indexesToRemove[i]);
            }
        }

        if (this._myLogEnabled) {
            console.log("Collision End - Object ID: " + physXComponent.object.pp_getID());
        }

        this._myCollisionEndEmitter.notify(this._myPhysXComponent, physXComponent, type);
    }

    private static readonly _triggerDesyncFixSV =
        {
            findAllCallback: function (object: Readonly<Object3D>) {
                const physXComponent = object.pp_getComponentSelf(PhysXComponent);
                return physXComponent == null || !physXComponent.active;
            }
        };
    private _triggerDesyncFix(dt: number): void {
        this._myTriggerDesyncFixDelay.update(dt);
        if (this._myTriggerDesyncFixDelay.isDone()) {
            this._myTriggerDesyncFixDelay.start();

            const findAllCallback = PhysicsCollisionCollector._triggerDesyncFixSV.findAllCallback;
            const collisionsToEndIndexes = this._myCollisionObjects.pp_findAllIndexes(findAllCallback);

            if (collisionsToEndIndexes.length > 0) {
                const physXComponentsToEnd: PhysXComponent[] = [];
                for (let i = 0; i < collisionsToEndIndexes.length; i++) {
                    physXComponentsToEnd.push(this._myCollisions[collisionsToEndIndexes[i]]);
                }

                for (const physXComponentToEnd of physXComponentsToEnd) {
                    if (this._myLogEnabled) {
                        console.log("Trigger Desync Fix - Object ID: " + physXComponentToEnd.object.pp_getID());
                    }

                    this._onCollisionEnd(CollisionEventType.TriggerTouchLost, physXComponentToEnd);
                }
            }
        }
    }

    public destroy(): void {
        this._myDestroyed = true;

        if (this._myCollisionCallbackID != null) {
            this._myPhysXComponent.removeCollisionCallback(this._myCollisionCallbackID);
            this._myCollisionCallbackID = null;
        }
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }
}
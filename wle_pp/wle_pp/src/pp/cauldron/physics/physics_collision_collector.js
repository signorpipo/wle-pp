import { CollisionEventType, Emitter, PhysXComponent } from "@wonderlandengine/api";
import { Timer } from "../cauldron/timer.js";

export class PhysicsCollisionCollector {

    constructor(physXComponent, trigger = false) {
        this._myPhysX = physXComponent;

        this._myTrigger = trigger;

        this._myCollisions = [];

        this._myCollisionsStart = [];
        this._myCollisionsEnd = [];

        this._myUpdateActive = false;
        this._myCollisionsStartToProcess = [];
        this._myCollisionsEndToProcess = [];

        this._myCollisionCallbackID = null;

        this._myActive = false;
        this.setActive(true);

        this._myLogEnabled = false;

        this._myTriggerDesyncFixDelay = new Timer(0.1);

        this._myCollisionEmitter = new Emitter();          // Signature: listener(currentPhysX, otherPhysX, collisionType)
        this._myCollisionStartEmitter = new Emitter();     // Signature: listener(currentPhysX, otherPhysX, collisionType)
        this._myCollisionEndEmitter = new Emitter();       // Signature: listener(currentPhysX, otherPhysX, collisionType)

        this._myDestroyed = false;
    }

    getPhysX() {
        return this._myPhysX;
    }

    getCollisions() {
        return this._myCollisions;
    }

    getCollisionsStart() {
        return this._myCollisionsStart;
    }

    getCollisionsEnd() {
        return this._myCollisionsEnd;
    }

    isActive() {
        return this._myActive;
    }

    setActive(active) {
        if (this._myActive != active) {
            this._myActive = active;

            this._myCollisions.pp_clear();

            this._myCollisionsStart.pp_clear();
            this._myCollisionsEnd.pp_clear();
            this._myUpdateActive = false;
            this._myCollisionsStartToProcess.pp_clear();
            this._myCollisionsEndToProcess.pp_clear();

            if (this._myActive) {
                this._myCollisionCallbackID = this._myPhysX.onCollision(this._onCollision.bind(this));
            } else if (this._myCollisionCallbackID != null) {
                this._myPhysX.removeCollisionCallback(this._myCollisionCallbackID);
                this._myCollisionCallbackID = null;
            }
        }
    }

    // Set to true only if u are going to actually update this object and don't want to lose any collision start/end events prior to updating the first time after activation
    setUpdateActive(active) {
        this._myUpdateActive = active;
    }

    // Update is not mandatory, use it only if u want to access collisions start and end
    update(dt) {
        if (!this._myActive) {
            return;
        }

        this._myUpdateActive = true;

        let prevCollisionsStartToProcess = this._myCollisionsStartToProcess;
        this._myCollisionsStartToProcess = this._myCollisionsStart;
        this._myCollisionsStartToProcess.pp_clear();
        this._myCollisionsStart = prevCollisionsStartToProcess;

        let prevCollisionsEndToProcess = this._myCollisionsEndToProcess;
        this._myCollisionsEndToProcess = this._myCollisionsEnd;
        this._myCollisionsEndToProcess.pp_clear();
        this._myCollisionsEnd = prevCollisionsEndToProcess;

        if (this._myTrigger) {
            this._triggerDesyncFix(dt);
        }
    }

    isLogEnabled() {
        return this._myLogEnabled;
    }

    setLogEnabled(enabled) {
        this._myLogEnabled = enabled;
    }

    registerCollisionEventListener(id, listener) {
        this._myCollisionEmitter.add(listener, { id: id });
    }

    unregisterCollisionEventListener(id) {
        this._myCollisionEmitter.remove(id);
    }

    registerCollisionStartEventListener(id, listener) {
        this._myCollisionStartEmitter.add(listener, { id: id });
    }

    unregisterCollisionStartEventListener(id) {
        this._myCollisionStartEmitter.remove(id);
    }

    registerCollisionEndEventListener(id, listener) {
        this._myCollisionEndEmitter.add(listener, { id: id });
    }

    unregisterCollisionEndEventListener(id) {
        this._myCollisionEndEmitter.remove(id);
    }

    _onCollision(type, physXComponent) {
        if (type == CollisionEventType.Touch || type == CollisionEventType.TriggerTouch) {
            this._onCollisionStart(type, physXComponent);
        } else if (type == CollisionEventType.TouchLost || type == CollisionEventType.TriggerTouchLost) {
            this._onCollisionEnd(type, physXComponent);
        }

        this._myCollisionEmitter.notify(this._myPhysX, physXComponent, type);
    }

    _onCollisionStart(type, physXComponent) {
        if (this._myLogEnabled) {
            let objectFound = false;
            for (let object of this._myCollisions) {
                if (object.pp_equals(physXComponent.object)) {
                    objectFound = true;
                    break;
                }
            }

            if (objectFound) {
                console.error("Collision Start on object already collected");
            }
        }

        this._myCollisions.push(physXComponent.object);

        if (this._myUpdateActive) {
            this._myCollisionsStartToProcess.push(physXComponent.object);
            this._myCollisionsEndToProcess.pp_removeAll(function (element) {
                return element.pp_equals(physXComponent.object);
            });
        }

        if (this._myLogEnabled) {
            console.log("Collision Start -", this._myCollisions.length);
        }

        this._myCollisionStartEmitter.notify(this._myPhysX, physXComponent, type);
    }

    _onCollisionEnd(type, physXComponent) {
        if (this._myLogEnabled) {
            let objectFound = false;
            for (let object of this._myCollisions) {
                if (object.pp_equals(physXComponent.object)) {
                    objectFound = true;
                    break;
                }
            }

            if (!objectFound) {
                console.error("Collision End on object not collected");
            }
        }


        this._myCollisions.pp_removeAll(function (element) {
            return element.pp_equals(physXComponent.object);
        });

        if (this._myUpdateActive) {
            this._myCollisionsEndToProcess.push(physXComponent.object);
            this._myCollisionsStartToProcess.pp_removeAll(function (element) {
                return element.pp_equals(physXComponent.object);
            });
        }

        if (this._myLogEnabled) {
            console.log("Collision End -", this._myCollisions.length);
        }

        this._myCollisionEndEmitter.notify(this._myPhysX, physXComponent, type);
    }

    _triggerDesyncFix(dt) {
        // Implemented outside class definition
    }

    destroy() {
        this._myDestroyed = true;

        if (this._myCollisionCallbackID != null) {
            this._myPhysX.removeCollisionCallback(this._myCollisionCallbackID);
            this._myCollisionCallbackID = null;
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}




// IMPLEMENTATION

PhysicsCollisionCollector.prototype._triggerDesyncFix = function () {
    let findAllCallback = function (element) {
        let physX = element.pp_getComponentSelf(PhysXComponent);
        return physX == null || !physX.active;
    };
    return function _triggerDesyncFix(dt) {
        this._myTriggerDesyncFixDelay.update(dt);
        if (this._myTriggerDesyncFixDelay.isDone()) {
            this._myTriggerDesyncFixDelay.start();

            let collisionsToEnd = this._myCollisions.pp_findAll(findAllCallback);

            if (collisionsToEnd.length > 0) {
                //console.error("DESYNC RESOLVED");

                for (let i = 0; i < collisionsToEnd.length; i++) {
                    let collision = collisionsToEnd[i];

                    let physX = collision.pp_getComponentSelf(PhysXComponent);
                    if (physX) {
                        this._onCollisionEnd(CollisionEventType.TriggerTouchLost, physX);
                    } else {
                        console.error("NO PHYSX, HOW?");
                    }
                }
            }
        }
    };
}();
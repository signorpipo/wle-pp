export class ObjectPoolParams {

    constructor() {
        // If set to false, it will directly use the specified object prototype,
        // otherwise it will clone it, and use the clone as the actual pool prototype
        this.myCloneObjectPrototype = true;

        this.myInitialPoolSize = 0;
        this.myAmountToAddWhenEmpty = 0;        // If all the objects are busy, this amount will be added to the pool
        this.myPercentageToAddWhenEmpty = 0;    // If all the objects are busy, this percentage of the current pool size will be added to the pool        

        this.myCloneParams = undefined;

        this.myOptimizeObjectsAllocation = true;    // If true it will pre-allocate the memory before adding new objects to the pool

        // These extra functions can be used if u want to use the pool with objects that are not from WL (WL Object)
        this.myCloneCallback = null;                       // Signature: callback(object, cloneParams) -> clonedObject
        this.mySetActiveCallback = null;                   // Signature: callback(object, active)
        this.myEqualCallback = null;                       // Signature: callback(firstObject, secondObject) -> bool
        this.myDestroyCallback = null;                     // Signature: callback(object)
        this.myOptimizeObjectsAllocationCallback = null;   // Signature: callback(object, numberOfObjectsToAllocate)

        this.myLogEnabled = false;
    }
}

export class ObjectPool {

    constructor(objectPrototype, objectPoolParams) {
        this._myObjectPoolParams = objectPoolParams;

        this._myObjectPrototype = objectPrototype;
        if (objectPoolParams.myCloneObjectPrototype) {
            this._myObjectPrototype = this._clone(objectPrototype);
        }

        this._myAvailableObjects = [];
        this._myBusyObjects = [];

        this._addToPool(objectPoolParams.myInitialPoolSize, false);

        this._myDestroyed = false;
    }

    get() {
        let object = this._myAvailableObjects.shift();

        if (object == null) {
            let amountToAdd = Math.ceil(this._myBusyObjects.length * this._myObjectPoolParams.myPercentageToAddWhenEmpty);
            amountToAdd += this._myObjectPoolParams.myAmountToAddWhenEmpty;
            this._addToPool(amountToAdd, this._myObjectPoolParams.myLogEnabled);
            object = this._myAvailableObjects.shift();
        }

        // Object could still be null if the amountToAdd is 0
        if (object != null) {
            this._myBusyObjects.push(object);
        }

        return object;
    }

    has(object) {
        let hasObject = false;

        if (this.isBusy(object) || this.isAvailable(object)) {
            hasObject = true;
        }

        return hasObject;
    }

    isBusy(object) {
        return this._myBusyObjects.pp_has(this._equals.bind(this, object));
    }

    isAvailable(object) {
        return this._myAvailableObjects.pp_has(this._equals.bind(this, object));
    }

    release(object) {
        let released = this._myBusyObjects.pp_remove(this._equals.bind(this, object));
        if (released != null) {
            this._setActive(released, false);
            this._myAvailableObjects.push(released);
        }
    }

    releaseAll() {
        for (let busyObject of this._myBusyObjects) {
            this._setActive(busyObject, false);
            this._myAvailableObjects.push(busyObject);
        }
    }

    increase(amount) {
        this._addToPool(amount, false);
    }

    increasePercentage(percentage) {
        let amount = Math.ceil((this.getSize()) * percentage);
        this._addToPool(amount, false);
    }

    getSize() {
        return this._myBusyObjects.length + this._myAvailableObjects.length;
    }

    getAvailableSize() {
        return this._myAvailableObjects.length;
    }

    getBusySize() {
        return this._myAvailableObjects.length;
    }

    _addToPool(size, logEnabled) {
        if (size <= 0) {
            return;
        }

        if (this._myObjectPoolParams.myOptimizeObjectsAllocation) {
            if (this._myObjectPoolParams.myOptimizeObjectsAllocationCallback != null) {
                this._myObjectPoolParams.myOptimizeObjectsAllocationCallback(this._myObjectPrototype, size);
            } else if (this._myObjectPrototype.pp_reserveObjects != null) {
                this._myObjectPrototype.pp_reserveObjects(size);
            }
        }

        for (let i = 0; i < size; i++) {
            this._myAvailableObjects.push(this._clone(this._myObjectPrototype));
        }

        if (logEnabled) {
            console.warn("Added new elements to the pool:", size);
        }
    }

    _clone(object) {
        let clone = null;

        if (this._myObjectPoolParams.myCloneCallback != null) {
            clone = this._myObjectPoolParams.myCloneCallback(object, this._myObjectPoolParams.myCloneParams);
        } else if (object.pp_clone != null) {
            clone = object.pp_clone(this._myObjectPoolParams.myCloneParams);
        } else if (object.clone != null) {
            clone = object.clone(this._myObjectPoolParams.myCloneParams);
        }

        if (clone == null) {
            console.error("Object not cloneable, pool will return null");
        } else {
            this._setActive(clone, false);
        }

        return clone;
    }

    _setActive(object, active) {
        if (this._myObjectPoolParams.mySetActiveCallback != null) {
            this._myObjectPoolParams.mySetActiveCallback(object, active);
        } else if (object.pp_setActive != null) {
            object.pp_setActive(active);
        } else if (object.setActive != null) {
            object.setActive(active);
        }
    }

    _equals(first, second) {
        let equals = false;

        if (this._myObjectPoolParams.myEqualCallback != null) {
            equals = this._myObjectPoolParams.myEqualCallback(first, second);
        } else if (first.pp_equals != null) {
            equals = first.pp_equals(second);
        } else if (first.equals != null) {
            equals = first.equals(second);
        } else {
            equals = first == second;
        }

        return equals;
    }

    destroy() {
        this._myDestroyed = true;

        for (let object of this._myAvailableObjects) {
            this._destroyObject(object);
        }

        for (let object of this._myBusyObjects) {
            this._destroyObject(object);
        }

        this._destroyObject(this._myObjectPrototype);
    }

    isDestroyed() {
        return this._myDestroyed;
    }

    _destroyObject(object) {
        if (this._myObjectPoolParams.myDestroyCallback != null) {
            this._myObjectPoolParams.myDestroyCallback(object);
        } else if (object.pp_destroy != null) {
            object.pp_destroy();
        } else if (object.destroy != null) {
            object.destroy();
        }
    }
}
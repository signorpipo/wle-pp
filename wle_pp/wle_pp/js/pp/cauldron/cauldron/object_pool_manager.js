PP.ObjectPoolManager = class ObjectPoolManager {
    constructor() {
        this._myPools = new Map();
    }

    addPool(poolID, poolObject, objectPoolParams = new PP.ObjectPoolParams()) {
        if (!this._myPools.has(poolID)) {
            let pool = new PP.ObjectPool(poolObject, objectPoolParams);
            this._myPools.set(poolID, pool);
        } else {
            console.error("Pool already created with this ID");
        }
    }

    increasePool(poolID, amount) {
        let pool = this._myPools.get(poolID);
        if (pool) {
            pool.increase(amount);
        }
    }

    increasePoolPercentage(poolID, percentage) {
        let pool = this._myPools.get(poolID);
        if (pool) {
            pool.increasePercentage(percentage);
        }
    }

    getPool(poolID) {
        return this._myPools.get(poolID);
    }

    hasPool(poolID) {
        return this._myPools.has(poolID);
    }

    getObject(poolID) {
        if (this._myPools.has(poolID)) {
            return this._myPools.get(poolID).get();
        }

        return null;
    }

    releaseObject(poolID, object) {
        this._myPools.get(poolID).release(object);
    }
};

PP.ObjectPoolParams = class ObjectPoolParams {
    constructor() {
        this.myInitialPoolSize = 0;
        this.myAmountToAddWhenEmpty = 0;        //If all the objects are busy, this amount will be added to the pool
        this.myPercentageToAddWhenEmpty = 0;    //If all the objects are busy, this percentage of the current pool size will be added to the pool        

        this.myCloneParams = undefined;

        this.myOptimizeObjectsAllocation = true;    //If true it will pre-allocate the memory before adding new objects to the pool

        //These extra functions can be used if u want to use the pool with objects that are not from WLE (WL.Object)
        this.myCloneCallback = undefined;                       //Signature: callback(object, cloneParams) -> clonedObject
        this.mySetActiveCallback = undefined;                   //Signature: callback(object, active)
        this.myEqualCallback = undefined;                       //Signature: callback(firstObject, secondObject) -> bool
        this.myOptimizeObjectsAllocationCallback = undefined;   //Signature: callback(object, numberOfObjectsToAllocate)

        this.myEnableDebugLog = true;
    }
};

PP.ObjectPool = class ObjectPool {
    constructor(poolObject, objectPoolParams) {
        this._myObjectPoolParams = objectPoolParams;
        this._myPrototype = this._clone(poolObject);

        this._myAvailableObjects = [];
        this._myBusyObjects = [];

        this._addToPool(objectPoolParams.myInitialPoolSize, false);
    }

    get() {
        let object = this._myAvailableObjects.shift();

        if (object == null) {
            let amountToAdd = Math.ceil(this._myBusyObjects.length * this._myObjectPoolParams.myPercentageToAddWhenEmpty);
            amountToAdd += this._myObjectPoolParams.myAmountToAddWhenEmpty;
            this._addToPool(amountToAdd, this._myObjectPoolParams.myEnableDebugLog);
            object = this._myAvailableObjects.shift();
        }

        //object could still be null if the amountToAdd is 0
        if (object != null) {
            this._myBusyObjects.push(object);
        }

        return object;
    }

    release(object) {
        let released = this._myBusyObjects.pp_remove(this._equals.bind(this, object));
        if (released) {
            this._setActive(released, false);
            this._myAvailableObjects.push(released);
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

    _addToPool(size, log) {
        if (size <= 0) {
            return;
        }

        if (this._myObjectPoolParams.myOptimizeObjectsAllocation) {
            if (this._myObjectPoolParams.myOptimizeObjectsAllocationCallback) {
                this._myObjectPoolParams.myOptimizeObjectsAllocationCallback(this._myPrototype, size);
            } else if (this._myPrototype.pp_reserveObjectsHierarchy != null) {
                this._myPrototype.pp_reserveObjectsHierarchy(size);
            }
        }

        for (let i = 0; i < size; i++) {
            this._myAvailableObjects.push(this._clone(this._myPrototype));
        }

        if (log) {
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
};
PP.ObjectPoolsManager = class ObjectPoolsManager {
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

    releaseObject(poolIDOrObject, object) {
        if (object === undefined) {
            for (let pool of this._myPools.values()) {
                pool.release(poolIDOrObject);
            }
        } else {
            this._myPools.get(poolIDOrObject).release(object);
        }
    }
};
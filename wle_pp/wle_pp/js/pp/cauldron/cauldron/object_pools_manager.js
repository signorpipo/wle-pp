import { ObjectPool, ObjectPoolParams } from "./object_pool";

export class ObjectPoolsManager {

    constructor() {
        this._myPools = new Map();

        this._myDestroyed = false;
    }

    addPool(poolID, poolObject, objectPoolParams = new ObjectPoolParams()) {
        if (!this._myPools.has(poolID)) {
            let pool = new ObjectPool(poolObject, objectPoolParams);
            this._myPools.set(poolID, pool);
        } else {
            console.error("Pool already created with this ID");
        }
    }

    get(poolID) {
        if (this._myPools.has(poolID)) {
            return this._myPools.get(poolID).get();
        }

        return null;
    }

    release(poolIDOrObject, object) {
        if (object === undefined) {
            for (let pool of this._myPools.values()) {
                pool.release(poolIDOrObject);
            }
        } else {
            this._myPools.get(poolIDOrObject).release(object);
        }
    }

    releaseAll(poolID = undefined) {
        if (poolID === undefined) {
            for (let pool of this._myPools.values()) {
                pool.releaseAll();
            }
        } else {
            this._myPools.get(poolID).releaseAll();
        }
    }

    increase(poolID, amount) {
        let pool = this._myPools.get(poolID);
        if (pool) {
            pool.increase(amount);
        }
    }

    increasePercentage(poolID, percentage) {
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

    destroy() {
        this._myDestroyed = true;

        for (let pool of this._myPools.values()) {
            pool.destroy();
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
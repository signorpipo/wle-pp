export class ObjectPoolManager {

    constructor() {
        this._myPools = new Map();

        this._myDestroyed = false;
    }

    addPool(poolID, pool) {
        if (!this._myPools.has(poolID)) {
            this._myPools.set(poolID, pool);
        } else {
            console.warn("Trying to add a Pool with an ID that has been already used:", poolID);
        }
    }

    destroyPool(poolID) {
        let poolToRemove = this._myPools.get(poolID);
        if (poolToRemove != null) {
            this._myPools.delete(poolID);
            poolToRemove.destroy();
        }
    }

    getPool(poolID) {
        return this._myPools.get(poolID);
    }

    hasPool(poolID) {
        return this._myPools.has(poolID);
    }

    get(poolID) {
        if (this._myPools.has(poolID)) {
            return this._myPools.get(poolID).get();
        }

        return null;
    }

    has(poolIDOrObject, object = undefined) {
        let hasObject = false;

        if (object == null) {
            for (let pool of this._myPools.values()) {
                if (pool.has(poolIDOrObject)) {
                    hasObject = true;
                    break;
                }
            }
        } else {
            hasObject = this._myPools.get(poolIDOrObject).has(object);
        }

        return hasObject;
    }

    isBusy(poolIDOrObject, object = undefined) {
        let busy = false;

        if (object == null) {
            for (let pool of this._myPools.values()) {
                if (pool.isBusy(poolIDOrObject)) {
                    busy = true;
                    break;
                }
            }
        } else {
            busy = this._myPools.get(poolIDOrObject).isBusy(object);
        }

        return busy;
    }

    isAvailable(poolIDOrObject, object = undefined) {
        let available = false;

        if (object == null) {
            for (let pool of this._myPools.values()) {
                if (pool.isAvailable(poolIDOrObject)) {
                    available = true;
                    break;
                }
            }
        } else {
            available = this._myPools.get(poolIDOrObject).isAvailable(object);
        }

        return available;
    }

    release(poolIDOrObject, object = undefined) {
        if (object == null) {
            for (let pool of this._myPools.values()) {
                pool.release(poolIDOrObject);
            }
        } else {
            this._myPools.get(poolIDOrObject).release(object);
        }
    }

    releaseAll(poolID = undefined) {
        if (poolID == null) {
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

    getSize(poolID) {
        if (this._myPools.has(poolID)) {
            return this._myPools.get(poolID).getSize();
        }

        return null;
    }

    getAvailableSize(poolID) {
        if (this._myPools.has(poolID)) {
            return this._myPools.get(poolID).getAvailableSize();
        }

        return null;
    }

    getBusySize(poolID) {
        if (this._myPools.has(poolID)) {
            return this._myPools.get(poolID).getBusySize();
        }

        return null;
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
import { BaseObjectPool } from "./object_pool.js";

export class ObjectPoolManager {

    private readonly _myPools: Map<unknown, BaseObjectPool> = new Map();

    private _myDestroyed: boolean = false;

    constructor() {
        this._myPools = new Map();

        this._myDestroyed = false;
    }

    public addPool(poolID: unknown, pool: BaseObjectPool): void {
        if (!this._myPools.has(poolID)) {
            this._myPools.set(poolID, pool);
        } else {
            console.warn("Trying to add a Pool with an ID that has been already used:", poolID);
        }
    }

    public destroyPool(poolID: unknown): void {
        const poolToRemove = this._myPools.get(poolID);
        if (poolToRemove != null) {
            this._myPools.delete(poolID);
            poolToRemove.destroy();
        }
    }

    public getPool<ObjectPoolType extends BaseObjectPool>(poolID: unknown): ObjectPoolType | null {
        const objectPool = this._myPools.get(poolID);
        return objectPool != null ? objectPool as ObjectPoolType : null;
    }

    public hasPool(poolID: unknown): boolean {
        return this._myPools.has(poolID);
    }

    public get<PoolObjectType>(poolID: unknown): PoolObjectType | null {
        if (this._myPools.has(poolID)) {
            return this._myPools.get(poolID)!.get() as PoolObjectType | null;
        }

        return null;
    }

    public has<PoolObjectType>(poolID: unknown, object: PoolObjectType): boolean;
    public has<PoolObjectType>(object: PoolObjectType): boolean;
    public has<PoolObjectType>(poolIDOrObject: unknown | PoolObjectType, object?: PoolObjectType): boolean {
        let hasObject = false;

        if (object == null) {
            for (const pool of this._myPools.values()) {
                if (pool.has(poolIDOrObject)) {
                    hasObject = true;
                    break;
                }
            }
        } else if (this._myPools.has(poolIDOrObject)) {
            hasObject = this._myPools.get(poolIDOrObject)!.has(object);
        }

        return hasObject;
    }

    public isBusy<PoolObjectType>(poolID: unknown, object: PoolObjectType): boolean;
    public isBusy<PoolObjectType>(object: PoolObjectType): boolean;
    public isBusy<PoolObjectType>(poolIDOrObject: unknown | PoolObjectType, object?: PoolObjectType): boolean {
        let busy = false;

        if (object == null) {
            for (const pool of this._myPools.values()) {
                if (pool.isBusy(poolIDOrObject)) {
                    busy = true;
                    break;
                }
            }
        } else if (this._myPools.has(poolIDOrObject)) {
            busy = this._myPools.get(poolIDOrObject)!.isBusy(object);
        }

        return busy;
    }

    public isAvailable<PoolObjectType>(poolID: unknown, object: PoolObjectType): boolean;
    public isAvailable<PoolObjectType>(object: PoolObjectType): boolean;
    public isAvailable<PoolObjectType>(poolIDOrObject: unknown | PoolObjectType, object?: PoolObjectType): boolean {
        let available = false;

        if (object == null) {
            for (const pool of this._myPools.values()) {
                if (pool.isAvailable(poolIDOrObject)) {
                    available = true;
                    break;
                }
            }
        } else if (this._myPools.has(poolIDOrObject)) {
            available = this._myPools.get(poolIDOrObject)!.isAvailable(object);
        }

        return available;
    }

    public release<PoolObjectType>(poolID: unknown, object: PoolObjectType): void;
    public release<PoolObjectType>(object: PoolObjectType): void;
    public release<PoolObjectType>(poolIDOrObject: unknown | PoolObjectType, object?: PoolObjectType): void {
        if (object == null) {
            for (const pool of this._myPools.values()) {
                pool.release(poolIDOrObject);
            }
        } else if (this._myPools.has(poolIDOrObject)) {
            this._myPools.get(poolIDOrObject)!.release(object);
        }
    }

    public releaseAll(poolID?: unknown): void {
        if (poolID == null) {
            for (const pool of this._myPools.values()) {
                pool.releaseAll();
            }
        } else if (this._myPools.has(poolID)) {
            this._myPools.get(poolID)!.releaseAll();
        }
    }

    public increase(poolID: unknown, amount: number): void {
        const pool = this._myPools.get(poolID);
        if (pool) {
            pool.increase(amount);
        }
    }

    public increasePercentage(poolID: unknown, percentage: number): void {
        const pool = this._myPools.get(poolID);
        if (pool) {
            pool.increasePercentage(percentage);
        }
    }

    public getSize(poolID: unknown): number {
        if (this._myPools.has(poolID)) {
            return this._myPools.get(poolID)!.getSize();
        }

        return 0;
    }

    public getAvailableSize(poolID: unknown): number {
        if (this._myPools.has(poolID)) {
            return this._myPools.get(poolID)!.getAvailableSize();
        }

        return 0;
    }

    public getBusySize(poolID: unknown): number {
        if (this._myPools.has(poolID)) {
            return this._myPools.get(poolID)!.getBusySize();
        }

        return 0;
    }

    public destroy(): void {
        this._myDestroyed = true;

        for (const pool of this._myPools.values()) {
            pool.destroy();
        }
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }
}
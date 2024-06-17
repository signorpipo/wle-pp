import { Object3D } from "@wonderlandengine/api";
import { ObjectCloneParams, ObjectUtils } from "../wl/utils/object_utils.js";

/** For the Wonderland Engine `Object3D` you can omit the callbacks (like `myCloneCallback`), since they are already handled directly as a speciale case */
export class ObjectPoolParams<PoolObjectType, PoolObjectCloneParamsType = unknown> {

    public myInitialPoolSize: number = 0;

    /** If all the objects are busy, this amount will be added to the pool */
    public myAmountToAddWhenEmpty: number = 0;

    /** If all the objects are busy, this percentage of the current pool size will be added to the pool */
    public myPercentageToAddWhenEmpty: number = 0;


    public myCloneParams: Readonly<PoolObjectCloneParamsType> | null = null;


    /** For the Wonderland Engine `Object3D` you can omit this, since it's already handled directly as a speciale case */
    public myCloneCallback: ((object: Readonly<PoolObjectType>, cloneParams?: Readonly<PoolObjectCloneParamsType>) => PoolObjectType) | null = null;

    /** For the Wonderland Engine `Object3D` you can omit this, since it's already handled directly as a speciale case */
    public mySetActiveCallback: ((object: PoolObjectType, active: boolean) => void) | null = null;

    /** For the Wonderland Engine `Object3D` you can omit this, since it's already handled directly as a speciale case */
    public myEqualCallback: ((first: Readonly<PoolObjectType>, second: Readonly<PoolObjectType>) => boolean) | null = null;

    /** For the Wonderland Engine `Object3D` you can omit this, since it's already handled directly as a speciale case */
    public myDestroyCallback: ((object: PoolObjectType) => void) | null = null;

    /** For the Wonderland Engine `Object3D` you can omit this, since it's already handled directly as a speciale case */
    public myOptimizeObjectsAllocationCallback: ((object: Readonly<PoolObjectType>, numberOfObjectsToAllocate: number) => void) | null = null;


    public myLogEnabled: boolean = false;
}

export interface BaseObjectPool {
    get(): unknown | null;

    has(object: unknown): boolean;

    isBusy(object: unknown): boolean;
    isAvailable(object: unknown): boolean;

    release(object: unknown): void;
    releaseAll(): void;

    increase(amount: number): void;
    increasePercentage(percentage: number): void;

    getObjects(): Readonly<unknown[]>;
    getSize(): number;

    getAvailableObjects(): Readonly<unknown[]>;
    getAvailableSize(): number;

    getBusyObjects(): Readonly<unknown[]>;
    getBusySize(): number;

    destroy(): void;
}

export class ObjectPool<PoolObjectType, PoolObjectCloneParamsType = unknown> implements BaseObjectPool {

    private readonly _myObjectPrototype: Readonly<PoolObjectType>;
    private readonly _myObjectPoolParams: Readonly<ObjectPoolParams<PoolObjectType, PoolObjectCloneParamsType>>;

    private readonly _myAvailableObjects: PoolObjectType[] = [];
    private readonly _myBusyObjects: PoolObjectType[] = [];

    private _myDestroyed: boolean = false;

    private _myIsObject3D = false;
    private _myIsObject3DCloneParams = false;

    constructor(objectPrototype: Readonly<PoolObjectType>, objectPoolParams: Readonly<ObjectPoolParams<PoolObjectType, PoolObjectCloneParamsType>>) {
        this._myObjectPrototype = objectPrototype;
        this._myObjectPoolParams = objectPoolParams;

        if (objectPrototype instanceof Object3D) {
            this._myIsObject3D = true;

            if (this._myObjectPoolParams.myCloneParams == null || this._myObjectPoolParams.myCloneParams instanceof ObjectCloneParams) {
                this._myIsObject3DCloneParams = true;
            }
        }

        this._addToPool(objectPoolParams.myInitialPoolSize, false);
    }

    public get(): PoolObjectType | null {
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

        return object != null ? object : null;
    }

    public has(object: Readonly<PoolObjectType>): boolean {
        let hasObject = false;

        if (this.isBusy(object) || this.isAvailable(object)) {
            hasObject = true;
        }

        return hasObject;
    }

    public isBusy(object: Readonly<PoolObjectType>): boolean {
        return this._myBusyObjects.pp_has(this._equals.bind(this, object));
    }

    public isAvailable(object: Readonly<PoolObjectType>): boolean {
        return this._myAvailableObjects.pp_has(this._equals.bind(this, object));
    }

    public release(object: Readonly<PoolObjectType>): void {
        const released = this._myBusyObjects.pp_remove(this._equals.bind(this, object));
        if (released != null) {
            this._setActive(released, false);
            this._myAvailableObjects.push(released);
        }
    }

    public releaseAll(): void {
        for (const busyObject of this._myBusyObjects) {
            this._setActive(busyObject, false);
            this._myAvailableObjects.push(busyObject);
        }
    }

    public increase(amount: number): void {
        this._addToPool(amount, false);
    }

    public increasePercentage(percentage: number): void {
        const amount = Math.ceil((this.getSize()) * percentage);
        this._addToPool(amount, false);
    }

    public getObjects(): Readonly<PoolObjectType[]> {
        const objects = [];
        objects.push(...this._myAvailableObjects);
        objects.push(...this._myBusyObjects);

        return objects;
    }

    public getSize(): number {
        return this._myBusyObjects.length + this._myAvailableObjects.length;
    }

    public getAvailableObjects(): Readonly<PoolObjectType[]> {
        return this._myAvailableObjects;
    }

    public getAvailableSize(): number {
        return this._myAvailableObjects.length;
    }

    public getBusyObjects(): Readonly<PoolObjectType[]> {
        return this._myBusyObjects;
    }

    public getBusySize(): number {
        return this._myBusyObjects.length;
    }

    private _addToPool(size: number, logEnabled: boolean): void {
        if (size <= 0) {
            return;
        }

        if (this._myObjectPoolParams.myOptimizeObjectsAllocationCallback != null) {
            this._myObjectPoolParams.myOptimizeObjectsAllocationCallback(this._myObjectPrototype, size);
        } else if (this._myIsObject3D) {
            const object3DPrototype = this._myObjectPrototype as unknown as Object3D;
            ObjectUtils.reserveObjects(object3DPrototype, size);
        }

        for (let i = 0; i < size; i++) {
            const clonedObject = this._clonePrototype();
            if (clonedObject != null) {
                this._myAvailableObjects.push(clonedObject);
            }
        }

        if (logEnabled) {
            console.warn("Added new elements to the pool:", size);
        }
    }

    private _clonePrototype(): PoolObjectType | null {
        let clone: PoolObjectType | null = null;

        const cloneParams = this._myObjectPoolParams.myCloneParams != null ? this._myObjectPoolParams.myCloneParams! : undefined;
        if (this._myObjectPoolParams.myCloneCallback != null) {
            clone = this._myObjectPoolParams.myCloneCallback(this._myObjectPrototype, cloneParams);
        } else if (this._myIsObject3D && this._myIsObject3DCloneParams) {
            const object3DPrototype = this._myObjectPrototype as unknown as Object3D;
            clone = ObjectUtils.clone(object3DPrototype, cloneParams as unknown as ObjectCloneParams) as PoolObjectType;
        } else {
            console.error("No way have been provided to clone the object");
        }

        if (clone != null) {
            this._setActive(clone, false);
        }

        return clone;
    }

    private _setActive(object: PoolObjectType, active: boolean): void {
        if (this._myObjectPoolParams.mySetActiveCallback != null) {
            this._myObjectPoolParams.mySetActiveCallback(object, active);
        } else if (this._myIsObject3D) {
            const object3D = object as unknown as Object3D;
            ObjectUtils.setActive(object3D, active);
        } else {
            console.error("No way have been provided to set the active state of the object");
        }
    }

    private _equals(first: Readonly<PoolObjectType>, second: Readonly<PoolObjectType>): boolean {
        let equals = false;

        if (this._myObjectPoolParams.myEqualCallback != null) {
            equals = this._myObjectPoolParams.myEqualCallback(first, second);
        } else if (this._myIsObject3D) {
            const firstObject3D = first as unknown as Object3D;
            const secondObject3D = second as unknown as Object3D;
            equals = ObjectUtils.equals(firstObject3D, secondObject3D);
        } else {
            equals = first == second;
        }

        return equals;
    }

    public destroy(): void {
        this._myDestroyed = true;

        for (const object of this._myAvailableObjects) {
            this._destroyObject(object);
        }

        for (const object of this._myBusyObjects) {
            this._destroyObject(object);
        }

        this._destroyObject(this._myObjectPrototype);
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }

    private _destroyObject(object: PoolObjectType): void {
        if (this._myObjectPoolParams.myDestroyCallback != null) {
            this._myObjectPoolParams.myDestroyCallback(object);
        } else if (this._myIsObject3D) {
            const object3D = object as unknown as Object3D;
            ObjectUtils.destroy(object3D);
        } else {
            console.error("No way have been provided to destroy the object");
        }
    }
}
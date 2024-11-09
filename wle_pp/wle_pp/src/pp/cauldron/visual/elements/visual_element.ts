import { Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { VisualElementDefaultType } from "./visual_element_types.js";

export interface VisualElementParams {
    myType: unknown | VisualElementDefaultType;

    /** If not specified it will default to `Globals.getSceneObjects().myVisualElements` */
    myParent: Object3D;

    copyGeneric(other: Readonly<VisualElementParams>, deepCopy: boolean): void;
    cloneGeneric(deepClone: boolean): VisualElementParams;

    equalsGeneric(other: Readonly<VisualElementParams>): boolean;
}

export abstract class AbstractVisualElementParams<T extends AbstractVisualElementParams<T>> implements VisualElementParams {
    public abstract myType: unknown | VisualElementDefaultType;

    public myParent: Object3D;

    constructor(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!) {
        this.myParent = Globals.getSceneObjects(engine)!.myVisualElements!;
    }

    public copy(other: Readonly<T>, deepCopy: boolean = true): void {
        this.myParent = other.myParent;

        this._copyHook(other, deepCopy);
    }

    public clone(deepClone: boolean = true): T {
        const clonedParams = this._new();
        clonedParams.copyGeneric(this, deepClone);
        return clonedParams;
    }

    public equals(other: Readonly<T>): boolean {
        if (this as unknown as T == other) return true;

        if (this.myParent != other.myParent) return false;

        return this._equalsHook(other);
    }

    public copyGeneric(other: Readonly<VisualElementParams>, deepCopy: boolean = true): void {
        if (other.myType != this.myType) {
            throw new Error("Trying to copy from params with a different type - From Type: " + other.myType + " - To Type: " + this.myType);
        }

        this.copy(other as Readonly<T>, deepCopy);
    }

    public cloneGeneric(deepClone: boolean = true): VisualElementParams {
        return this.clone(deepClone);
    }

    public equalsGeneric(other: Readonly<VisualElementParams>): boolean {
        return this.equals(other as Readonly<T>);
    }

    protected abstract _copyHook(other: Readonly<T>, deepCopy: boolean): void;
    protected abstract _new(): T;

    protected abstract _equalsHook(other: Readonly<T>): boolean;
}

export interface VisualElement {
    update(dt: number): void;

    setVisible(visible: boolean): void;

    refresh(): void;
    setAutoRefresh(autoRefresh: boolean): void;

    getParamsGeneric(): VisualElementParams;
    setParamsGeneric(params: VisualElementParams): void;
    copyParamsGeneric(params: VisualElementParams): void;

    paramsUpdated(): void;

    clone(): VisualElement;

    destroy(): void;
}

export abstract class AbstractVisualElement<VisualElementType extends AbstractVisualElement<VisualElementType, VisualElementParamsType>, VisualElementParamsType extends AbstractVisualElementParams<VisualElementParamsType>> implements VisualElement {

    protected _myParams: VisualElementParamsType;
    protected _myPrevParams: VisualElementParamsType;

    protected _myVisible: boolean = false;
    protected _myAutoRefresh: boolean = true;

    protected _myDirty: boolean = false;

    protected _myDestroyed: boolean = false;

    constructor(params: VisualElementParamsType) {
        this._myParams = params;
        this._myPrevParams = this._myParams.clone();
    }

    public update(dt: number): void {
        if (this._myDirty) {
            this._refresh();

            this._myDirty = false;
        }

        this._updateHook(dt);
    }

    public setVisible(visible: boolean): void {
        if (this._myVisible != visible) {
            this._myVisible = visible;

            this._visibleChanged();
        }
    }

    public refresh(): void {
        this.update(0);
    }

    public setAutoRefresh(autoRefresh: boolean): void {
        this._myAutoRefresh = autoRefresh;
    }

    public getParams(): VisualElementParamsType {
        return this._myParams;
    }

    public setParams(params: VisualElementParamsType): void {
        this._myParams = params;
        this.paramsUpdated();
    }

    public copyParams(params: VisualElementParamsType): void {
        this._myParams.copy(params);
        this.paramsUpdated();
    }

    public getParamsGeneric(): VisualElementParams {
        return this._myParams;
    }

    public setParamsGeneric(params: VisualElementParams): void {
        if (params.myType != this._myParams.myType) {
            throw new Error("Trying to set params with a different type - Current Type: " + params.myType + " - New Type: " + this._myParams.myType);
        }

        this.setParams(params as VisualElementParamsType);
    }

    public copyParamsGeneric(params: VisualElementParams): void {
        if (params.myType != this._myParams.myType) {
            throw new Error("Trying to copy from params with a different type - From Type: " + params.myType + " - To Type: " + this._myParams.myType);
        }

        this.copyParams(params as VisualElementParamsType);
    }

    public paramsUpdated(): void {
        if (!this._myParams.equals(this._myPrevParams)) {
            this._markDirty();
        }
    }

    private _markDirty(): void {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    public clone(): VisualElementType {
        const clonedParams = this._myParams.clone();

        const clone = this._new(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }

    protected _prepare(): void {
        this._myPrevParams.copy(this._myParams, false);

        this._build();

        this._myDirty = true;
        this.refresh();

        this.setVisible(true);
    }

    private _refresh(): void {
        this._myPrevParams.copy(this._myParams, false);

        this._refreshHook();
    }

    protected _updateHook(dt: number): void { }

    protected _visibleChanged(): void { }

    protected abstract _build(): void;
    protected abstract _refreshHook(): void;

    protected abstract _new(params: VisualElementParamsType): VisualElementType;

    protected _destroyHook(): void { }

    public destroy(): void {
        this._myDestroyed = true;

        this._destroyHook();
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }
}
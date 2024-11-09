import { Object3D, WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { Timer } from "../cauldron/timer.js";
import { ObjectPool, ObjectPoolParams } from "../object_pool/object_pool.js";
import { VisualArrow, VisualArrowParams } from "./elements/visual_arrow.js";
import { VisualElement, VisualElementParams } from "./elements/visual_element.js";
import { VisualElementDefaultType } from "./elements/visual_element_types.js";
import { VisualLine, VisualLineParams } from "./elements/visual_line.js";
import { VisualMesh, VisualMeshParams } from "./elements/visual_mesh.js";
import { VisualPoint, VisualPointParams } from "./elements/visual_point.js";
import { VisualRaycast, VisualRaycastParams } from "./elements/visual_raycast.js";
import { VisualText, VisualTextParams } from "./elements/visual_text.js";
import { VisualTorus, VisualTorusParams } from "./elements/visual_torus.js";
import { VisualTransform, VisualTransformParams } from "./elements/visual_transform.js";

export class VisualManager {

    private readonly _myVisualElementPrototypeCreationCallbacks: Map<unknown | VisualElementDefaultType, () => VisualElement> = new Map();

    private readonly _myVisualElementsTypeMap: Map<unknown | VisualElementDefaultType, Map<unknown, [VisualElement, Timer]>> = new Map();
    private _myVisualElementLastID: number = 0;
    private readonly _myVisualElementsToShow: VisualElement[] = [];

    private _myVisualElementsParent: Object3D | null = null;
    private _myActive: boolean = true;

    private readonly _myObjectPoolManagerPrefix: string;
    private readonly _myTypePoolIDs: Map<unknown | VisualElementDefaultType, string> = new Map();

    private readonly _myEngine: Readonly<WonderlandEngine>;

    private _myDestroyed: boolean = false;

    constructor(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!) {
        this._myEngine = engine;

        this._myObjectPoolManagerPrefix = this._getClassName() + "_" + Math.pp_randomUUID() + "_visual_element_type_";

        this._addDefaultVisualElementTypes();
    }

    public setActive(active: boolean): void {
        if (this._myActive != active) {
            this._myActive = active;

            if (!this._myActive) {
                this.clearAllVisualElements();
            } else {
                this._myVisualElementsParent = Globals.getSceneObjects(this._myEngine)?.myVisualElements ?? null;
            }
        }
    }

    public isActive(): boolean {
        return this._myActive && this._myVisualElementsParent != null;
    }

    public start(): void {
        if (this._myActive) {
            this._myVisualElementsParent = Globals.getSceneObjects(this._myEngine)?.myVisualElements ?? null;
        }
    }

    public update(dt: number): void {
        if (this._myActive) {
            this._myVisualElementsParent = Globals.getSceneObjects(this._myEngine)?.myVisualElements ?? null;

            this._updateDraw(dt);
        }
    }

    /** `lifetimeSeconds` can be `null`, in that case the element will be drawn until cleared */
    public draw(visualElementParams: VisualElementParams, lifetimeSeconds: number | null = 0, idToReuse?: unknown): unknown | null {
        if (!this.isActive()) {
            return null;
        }

        let visualElement = null;
        let idReused = false;
        if (idToReuse != null) {
            if (this._myVisualElementsTypeMap.has(visualElementParams.myType)) {
                const visualElements = this._myVisualElementsTypeMap.get(visualElementParams.myType)!;
                if (visualElements.has(idToReuse)) {
                    visualElement = visualElements.get(idToReuse)![0];
                    visualElement.copyParamsGeneric(visualElementParams);
                    visualElement.setVisible(false);
                    idReused = true;
                }
            }
        }

        if (visualElement == null) {
            visualElement = this._getVisualElementFromPool(visualElementParams);
        }

        if (visualElement == null) {
            console.error("Couldn't create the requested visual element");
            return null;
        }

        if (!this._myVisualElementsTypeMap.has(visualElementParams.myType)) {
            this._myVisualElementsTypeMap.set(visualElementParams.myType, new Map());
        }
        const visualElements = this._myVisualElementsTypeMap.get(visualElementParams.myType)!;

        let elementID = null;
        if (!idReused) {
            elementID = this._myVisualElementLastID + 1;
            this._myVisualElementLastID = elementID;

            visualElements.set(elementID, [visualElement, new Timer(lifetimeSeconds != null ? lifetimeSeconds : 0, lifetimeSeconds != null)]);
        } else {
            elementID = idToReuse;
            const visualElementPair = visualElements.get(elementID)!;
            visualElementPair[0] = visualElement;
            if (lifetimeSeconds != null) {
                visualElementPair[1].reset(lifetimeSeconds);
                visualElementPair[1].start();
            } else {
                visualElementPair[1].reset();
            }
        }

        this._myVisualElementsToShow.push(visualElement);

        return elementID;
    }

    public getVisualElement(elementID: unknown): VisualElement | null {
        let visualElement = null;

        for (const visualElements of this._myVisualElementsTypeMap.values()) {
            if (visualElements.has(elementID)) {
                const visualElementPair = visualElements.get(elementID)!;
                visualElement = visualElementPair[0];
                break;
            }
        }

        return visualElement;
    }

    public getVisualElementParams(elementID: unknown): VisualElementParams | null {
        const visualElement = this.getVisualElement(elementID);
        return visualElement != null ? visualElement.getParamsGeneric() : null;
    }

    public getVisualElementID(visualElement: Readonly<VisualElement>): unknown {
        let elementID = null;
        for (const currentVisualElements of this._myVisualElementsTypeMap.values()) {
            for (const [currentElementID, currentVisualElement] of currentVisualElements.entries()) {
                if (currentVisualElement[0] == visualElement) {
                    elementID = currentElementID;
                    break;
                }
            }

            if (elementID != null) {
                break;
            }
        }

        return elementID;
    }

    public clearAllVisualElements(): void {
        if (!this.isActive()) return;

        for (const visualElements of this._myVisualElementsTypeMap.values()) {
            for (const visualElement of visualElements.values()) {
                this._releaseElement(visualElement[0]);
            }
        }

        this._myVisualElementsToShow.pp_clear();
        this._myVisualElementsTypeMap.clear();
        this._myVisualElementLastID = 0;
    }

    public clearVisualElement(elementID: unknown): void {
        if (!this.isActive()) return;

        for (const visualElements of this._myVisualElementsTypeMap.values()) {
            if (visualElements.has(elementID)) {
                const visualElementPair = visualElements.get(elementID)!;
                this._releaseElement(visualElementPair[0]);
                visualElements.delete(elementID);

                this._myVisualElementsToShow.pp_removeEqual(visualElementPair[0]);
                break;
            }
        }
    }

    public allocateVisualElementType(visualElementType: unknown | VisualElementDefaultType, amount: number): void {
        if (!this.isActive()) return;

        if (!Globals.getObjectPoolManager(this._myEngine)!.hasPool(this._getTypePoolID(visualElementType))) {
            this._addVisualElementTypeToPool(visualElementType);
        }

        const pool = Globals.getObjectPoolManager(this._myEngine)!.getPool(this._getTypePoolID(visualElementType))!;

        const difference = pool.getAvailableSize() - amount;
        if (difference < 0) {
            pool.increase(-difference);
        }
    }

    public addVisualElementType(visualElementType: unknown | VisualElementDefaultType, visuaElementPrototypeCreationCallback: () => VisualElement): void {
        this._myVisualElementPrototypeCreationCallbacks.set(visualElementType, visuaElementPrototypeCreationCallback);
    }

    public removeVisualElementType(visualElementType: unknown | VisualElementDefaultType): void {
        this._myVisualElementPrototypeCreationCallbacks.delete(visualElementType);
    }

    private _updateDraw(dt: number): void {
        for (const visualElement of this._myVisualElementsToShow) {
            visualElement.setVisible(true);
        }
        this._myVisualElementsToShow.pp_clear();

        for (const visualElements of this._myVisualElementsTypeMap.values()) {
            const idsToRemove = [];
            for (const visualElementsEntry of visualElements.entries()) {
                const visualElement = visualElementsEntry[1];
                if (visualElement[1].isDone()) {
                    this._releaseElement(visualElement[0]);
                    idsToRemove.push(visualElementsEntry[0]);
                } else {
                    visualElement[0].update(dt);
                    visualElement[1].update(dt);
                }
            }

            for (const id of idsToRemove) {
                visualElements.delete(id);
            }
        }
    }

    private _getVisualElementFromPool(params: VisualElementParams): VisualElement | null {
        let element = null;

        if (!Globals.getObjectPoolManager(this._myEngine)!.hasPool(this._getTypePoolID(params.myType))) {
            this._addVisualElementTypeToPool(params.myType);
        }

        element = Globals.getObjectPoolManager(this._myEngine)!.get<VisualElement>(this._getTypePoolID(params.myType));

        if (element != null) {
            element.copyParamsGeneric(params);
        }

        return element;
    }

    private _addVisualElementTypeToPool(visualElementType: unknown | VisualElementDefaultType): void {
        const objectPoolParams = new ObjectPoolParams<VisualElement>();
        objectPoolParams.myInitialPoolSize = 10;
        objectPoolParams.myAmountToAddWhenEmpty = 0;
        objectPoolParams.myPercentageToAddWhenEmpty = 0.5;
        objectPoolParams.myCloneCallback = function (visualElement: VisualElement): VisualElement {
            return visualElement.clone();
        };
        objectPoolParams.mySetActiveCallback = function (visualElement: VisualElement, active: boolean): void {
            visualElement.setVisible(active);
        };
        objectPoolParams.myDestroyCallback = function (visualElement: VisualElement): void {
            visualElement.destroy();
        };

        let visualElementPrototype = null;
        if (this._myVisualElementPrototypeCreationCallbacks.has(visualElementType)) {
            visualElementPrototype = this._myVisualElementPrototypeCreationCallbacks.get(visualElementType)!();
        }

        if (visualElementPrototype != null) {
            visualElementPrototype.setVisible(false);
            visualElementPrototype.setAutoRefresh(true);

            Globals.getObjectPoolManager(this._myEngine)!.addPool(this._getTypePoolID(visualElementType), new ObjectPool(visualElementPrototype, objectPoolParams));
        } else {
            console.error("Visual element type not supported: " + visualElementType);
        }
    }

    private _addDefaultVisualElementTypes(): void {
        this.addVisualElementType(VisualElementDefaultType.LINE, () => new VisualLine(new VisualLineParams(this._myEngine)));
        this.addVisualElementType(VisualElementDefaultType.MESH, () => new VisualMesh(new VisualMeshParams(this._myEngine)));
        this.addVisualElementType(VisualElementDefaultType.POINT, () => new VisualPoint(new VisualPointParams(this._myEngine)));
        this.addVisualElementType(VisualElementDefaultType.ARROW, () => new VisualArrow(new VisualArrowParams(this._myEngine)));
        this.addVisualElementType(VisualElementDefaultType.TEXT, () => new VisualText(new VisualTextParams(this._myEngine)));
        this.addVisualElementType(VisualElementDefaultType.TRANSFORM, () => new VisualTransform(new VisualTransformParams(this._myEngine)));
        this.addVisualElementType(VisualElementDefaultType.RAYCAST, () => new VisualRaycast(new VisualRaycastParams(this._myEngine)));
        this.addVisualElementType(VisualElementDefaultType.TORUS, () => new VisualTorus(new VisualTorusParams(this._myEngine)));
    }

    private _getTypePoolID(visualElementType: unknown | VisualElementDefaultType): string {
        let typePoolID = this._myTypePoolIDs.get(visualElementType);

        if (typePoolID == null) {
            typePoolID = this._myObjectPoolManagerPrefix + visualElementType;
            this._myTypePoolIDs.set(visualElementType, typePoolID);
        }

        return typePoolID;
    }

    private _releaseElement(visualElement: VisualElement): void {
        if (this._myVisualElementsParent != null) {
            if (visualElement.getParamsGeneric().myParent != this._myVisualElementsParent) {
                visualElement.getParamsGeneric().myParent = this._myVisualElementsParent;
                visualElement.paramsUpdated();
                visualElement.refresh(); // just used to trigger the parent change, I'm lazy
            }
        }

        Globals.getObjectPoolManager(this._myEngine)?.release(this._getTypePoolID(visualElement.getParamsGeneric().myType), visualElement);
    }

    private _getClassName(): string {
        return "visual_manager";
    }

    public destroy(): void {
        this._myDestroyed = true;

        this.setActive(false);

        for (const poolID of this._myTypePoolIDs.values()) {
            Globals.getObjectPoolManager(this._myEngine)?.destroyPool(poolID);
        }
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }
}
import { Globals } from "../../pp/globals";
import { Timer } from "../cauldron/timer";
import { ObjectPool, ObjectPoolParams } from "../object_pool/object_pool";
import { VisualArrow, VisualArrowParams } from "./elements/visual_arrow";
import { VisualElementType } from "./elements/visual_element_types";
import { VisualLine, VisualLineParams } from "./elements/visual_line";
import { VisualMesh, VisualMeshParams } from "./elements/visual_mesh";
import { VisualPoint, VisualPointParams } from "./elements/visual_point";
import { VisualRaycast, VisualRaycastParams } from "./elements/visual_raycast";
import { VisualText, VisualTextParams } from "./elements/visual_text";
import { VisualTorus, VisualTorusParams } from "./elements/visual_torus";
import { VisualTransform, VisualTransformParams } from "./elements/visual_transform";

export class VisualManager {

    constructor(engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._myVisualElementPrototypeCreationCallbacks = new Map();

        this._myVisualElementsTypeMap = new Map();
        this._myVisualElementLastID = 0;
        this._myVisualElementsToShow = [];

        this._myActive = true;

        this._myDestroyed = false;

        this._myObjectPoolManagerPrefix = this._getClassName() + "_" + Math.pp_randomUUID() + "_visual_element_type_";
        this._myTypePoolIDs = new Map();

        this._addStandardVisualElementTypes();
    }

    setActive(active) {
        if (this._myActive != active) {
            this._myActive = active;

            if (!this._myActive) {
                this.clearVisualElement();
            }
        }
    }

    isActive() {
        return this._myActive;
    }

    start() {

    }

    update(dt) {
        if (this._myActive) {
            this._updateDraw(dt);
        }
    }

    // lifetimeSeconds can be null, in that case the element will be drawn until cleared
    draw(visualElementParams, lifetimeSeconds = 0, idToReuse = null) {
        if (!this._myActive) {
            return 0;
        }

        let visualElement = null;
        let idReused = false;
        if (idToReuse != null) {
            if (this._myVisualElementsTypeMap.has(visualElementParams.myType)) {
                let visualElements = this._myVisualElementsTypeMap.get(visualElementParams.myType);
                if (visualElements.has(idToReuse)) {
                    visualElement = visualElements.get(idToReuse)[0];
                    visualElement.copyParams(visualElementParams);
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
        let visualElements = this._myVisualElementsTypeMap.get(visualElementParams.myType);

        let elementID = null;
        if (!idReused) {
            elementID = this._myVisualElementLastID + 1;
            this._myVisualElementLastID = elementID;

            visualElements.set(elementID, [visualElement, new Timer(lifetimeSeconds, lifetimeSeconds != null)]);
        } else {
            elementID = idToReuse;
            let visualElementPair = visualElements.get(elementID);
            visualElementPair[0] = visualElement;
            visualElementPair[1].reset(lifetimeSeconds);
            if (lifetimeSeconds != null) {
                visualElementPair[1].start();
            }
        }

        this._myVisualElementsToShow.push(visualElement);

        return elementID;
    }

    getVisualElement(elementID) {
        let visualElement = null;

        for (let visualElements of this._myVisualElementsTypeMap.values()) {
            if (visualElements.has(elementID)) {
                let visualElementPair = visualElements.get(elementID);
                visualElement = visualElementPair[0];
                break;
            }
        }

        return visualElement;
    }

    getVisualElementParams(elementID) {
        return this.getVisualElement(elementID).getParams();
    }

    getVisualElementID(visualElement) {
        let elementID = null;
        for (let currentVisualElements of this._myVisualElementsTypeMap.values()) {
            for (let [currentElementID, currentVisualElement] of currentVisualElements.entries()) {
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

    clearVisualElement(elementID = null) {
        if (elementID == null) {
            for (let visualElements of this._myVisualElementsTypeMap.values()) {
                for (let visualElement of visualElements.values()) {
                    this._releaseElement(visualElement[0]);
                }
            }

            this._myVisualElementsToShow = [];
            this._myVisualElementsTypeMap = new Map();
            this._myVisualElementLastID = 0;
        } else {
            for (let visualElements of this._myVisualElementsTypeMap.values()) {
                if (visualElements.has(elementID)) {
                    let visualElementPair = visualElements.get(elementID);
                    this._releaseElement(visualElementPair[0]);
                    visualElements.delete(elementID);

                    this._myVisualElementsToShow.pp_removeEqual(visualElementPair[0]);
                    break;
                }
            }
        }
    }

    allocateVisualElementType(visualElementType, amount) {
        if (!Globals.getObjectPoolManager(this._myEngine).hasPool(this._getTypePoolID(visualElementType))) {
            this._addVisualElementTypeToPool(visualElementType);
        }

        let pool = Globals.getObjectPoolManager(this._myEngine).getPool(this._getTypePoolID(visualElementType));

        let difference = pool.getAvailableSize() - amount;
        if (difference < 0) {
            pool.increase(-difference);
        }
    }

    addVisualElementType(visualElementType, visuaElementPrototypeCreationCallback) {
        this._myVisualElementPrototypeCreationCallbacks.set(visualElementType, visuaElementPrototypeCreationCallback);
    }

    removeVisualElementType(visualElementType) {
        this._myVisualElementPrototypeCreationCallbacks.delete(visualElementType);
    }

    _updateDraw(dt) {
        for (let visualElement of this._myVisualElementsToShow) {
            visualElement.setVisible(true);
        }
        this._myVisualElementsToShow.pp_clear();

        for (let visualElements of this._myVisualElementsTypeMap.values()) {
            let idsToRemove = [];
            for (let visualElementsEntry of visualElements.entries()) {
                let visualElement = visualElementsEntry[1];
                if (visualElement[1].isDone()) {
                    this._releaseElement(visualElement[0]);
                    idsToRemove.push(visualElementsEntry[0]);
                } else {
                    visualElement[0].update(dt);
                    visualElement[1].update(dt);
                }
            }

            for (let id of idsToRemove) {
                visualElements.delete(id);
            }
        }
    }

    _getVisualElementFromPool(params) {
        let element = null;

        if (!Globals.getObjectPoolManager(this._myEngine).hasPool(this._getTypePoolID(params.myType))) {
            this._addVisualElementTypeToPool(params.myType);
        }

        element = Globals.getObjectPoolManager(this._myEngine).get(this._getTypePoolID(params.myType));

        if (element != null) {
            element.copyParams(params);
        }

        return element;
    }

    _addVisualElementTypeToPool(type) {
        let objectPoolParams = new ObjectPoolParams();
        objectPoolParams.myInitialPoolSize = 10;
        objectPoolParams.myAmountToAddWhenEmpty = 0;
        objectPoolParams.myPercentageToAddWhenEmpty = 0.5;
        objectPoolParams.mySetActiveCallback = function (object, active) {
            object.setVisible(active);
        };

        let visualElementPrototype = null;
        if (this._myVisualElementPrototypeCreationCallbacks.has(type)) {
            visualElementPrototype = this._myVisualElementPrototypeCreationCallbacks.get(type)();
        }

        if (visualElementPrototype != null) {
            visualElementPrototype.setVisible(false);
            visualElementPrototype.setAutoRefresh(true);

            Globals.getObjectPoolManager(this._myEngine).addPool(this._getTypePoolID(type), new ObjectPool(visualElementPrototype, objectPoolParams));
        } else {
            console.error("Visual element type not supported");
        }
    }

    _addStandardVisualElementTypes() {
        this.addVisualElementType(VisualElementType.LINE, () => new VisualLine(new VisualLineParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.MESH, () => new VisualMesh(new VisualMeshParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.POINT, () => new VisualPoint(new VisualPointParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.ARROW, () => new VisualArrow(new VisualArrowParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.TEXT, () => new VisualText(new VisualTextParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.TRANSFORM, () => new VisualTransform(new VisualTransformParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.RAYCAST, () => new VisualRaycast(new VisualRaycastParams(this._myEngine)));
        this.addVisualElementType(VisualElementType.TORUS, () => new VisualTorus(new VisualTorusParams(this._myEngine)));
    }

    _getTypePoolID(type) {
        let typePoolID = this._myTypePoolIDs.get(type);

        if (typePoolID == null) {
            typePoolID = this._myObjectPoolManagerPrefix + type;
            this._myTypePoolIDs.set(type, typePoolID);
        }

        return typePoolID;
    }

    _releaseElement(visualElement) {
        let defaultElementsParent = Globals.getSceneObjects(this._myEngine).myVisualElements;
        if (visualElement.getParams().myParent != defaultElementsParent) {
            visualElement.getParams().myParent = defaultElementsParent;
            visualElement.forceRefresh(); // just used to trigger the parent change, I'm lazy
        }

        Globals.getObjectPoolManager(this._myEngine).release(this._getTypePoolID(visualElement.getParams().myType), visualElement);
    }

    _getClassName() {
        return "visual_manager";
    }

    destroy() {
        this._myDestroyed = true;

        for (let poolID of this._myTypePoolIDs.values()) {
            Globals.getObjectPoolManager(this._myEngine)?.removePool(poolID);
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
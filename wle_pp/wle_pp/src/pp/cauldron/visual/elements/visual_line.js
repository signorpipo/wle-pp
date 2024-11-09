import { MeshComponent } from "@wonderlandengine/api";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { AbstractVisualElement, AbstractVisualElementParams } from "./visual_element.js";
import { VisualElementDefaultType } from "./visual_element_types.js";

export class VisualLineParams extends AbstractVisualElementParams {

    /**
     * TS type inference helper
     * 
     * @param {any} engine
     */
    constructor(engine = Globals.getMainEngine()) {
        super(engine);

        this.myStart = vec3_create();
        this.myDirection = vec3_create(0, 0, 1);
        this.myLength = 0;

        this.myThickness = 0.005;

        this.myMesh = null;         // The mesh is scaled along up axis, null means it will default on myDefaultResources.myMeshes.myCylinder

        this.myMaterial = null;     // null means it will default on myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // If this is set and material is null, it will use the default flat opaque material with this color

        this.myLocal = false;

        this.myType = VisualElementDefaultType.LINE;
    }

    setStartEnd(start, end) {
        end.vec3_sub(start, this.myDirection);
        this.myLength = this.myDirection.vec3_length();
        this.myDirection.vec3_normalize(this.myDirection);
        this.myStart.vec3_copy(start);

        return this;
    }

    _copyHook(other, deepCopy) {
        // Implemented outside class definition
    }

    _new() {
        return new VisualLineParams(this.myParent.pp_getEngine());
    }

    _equalsHook(other) {
        return this.myThickness == other.myThickness &&
            this.myLength == other.myLength &&
            this.myMesh == other.myMesh &&
            this.myMaterial == other.myMaterial &&
            this.myLocal == other.myLocal &&
            (this.myColor == other.myColor || (this.myColor != null && other.myColor != null && this.myColor.vec_equals(other.myColor))) &&
            this.myStart.vec3_equals(other.myStart) &&
            this.myDirection.vec3_equals(other.myDirection);
    }
}

/**
 * Example:
 * 
 * ```js  
 * const visualParams = new VisualLineParams();
 * visualParams.myStart.vec3_copy(start);
 * visualParams.myDirection.vec3_copy(direction);
 * visualParams.myLength = 0.2;
 * visualParams.myMaterial = Globals.getDefaultMaterials().myFlatOpaque.clone();
 * visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
 * const visualLine = new VisualLine(visualParams);
 * 
 * // OR
 * 
 * Globals.getVisualManager().draw(visualParams);
 * ```
*/
export class VisualLine extends AbstractVisualElement {

    constructor(params = new VisualLineParams()) {
        super(params);

        this._myLineParentObject = null;
        this._myLineObject = null;
        this._myLineMeshComponent = null;

        this._myFlatOpaqueMaterial = null;

        this._prepare();
    }

    _visibleChanged() {
        this._myLineParentObject.pp_setActive(this._myVisible);
    }

    _build() {
        this._myLineParentObject = Globals.getSceneObjects(this._myParams.myParent.pp_getEngine()).myVisualElements.pp_addChild();
        this._myLineObject = this._myLineParentObject.pp_addChild();

        this._myLineMeshComponent = this._myLineObject.pp_addComponent(MeshComponent);
    }

    _refreshHook() {
        // Implemented outside class definition
    }

    _new(params) {
        return new VisualLine(params);
    }

    _destroyHook() {
        this._myLineParentObject.pp_destroy();
    }
}



// IMPLEMENTATION

VisualLine.prototype._refreshHook = function () {
    let scaleLine = vec3_create();
    let translateLine = vec3_create();

    let forward = vec3_create(0, 1, 0);
    return function _refreshHook() {
        this._myLineParentObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myLocal) {
            this._myLineParentObject.pp_setPositionLocal(this._myParams.myStart);
        } else {
            this._myLineParentObject.pp_setPosition(this._myParams.myStart);
        }

        scaleLine.vec3_set(this._myParams.myThickness / 2, this._myParams.myLength / 2, this._myParams.myThickness / 2);
        if (this._myParams.myLocal) {
            this._myLineObject.pp_setScaleLocal(scaleLine);
        } else {
            this._myLineObject.pp_setScale(scaleLine);
        }

        if (this._myParams.myLocal) {
            this._myLineObject.pp_setUpLocal(this._myParams.myDirection, forward);
        } else {
            this._myLineObject.pp_setUp(this._myParams.myDirection, forward);
        }

        this._myLineObject.pp_resetPositionLocal();
        translateLine.vec3_set(0, this._myParams.myLength / 2, 0);
        this._myLineObject.pp_translateObject(translateLine);

        if (this._myParams.myMesh != null) {
            this._myLineMeshComponent.mesh = this._myParams.myMesh;
        } else {
            this._myLineMeshComponent.mesh = Globals.getDefaultMeshes(this._myParams.myParent.pp_getEngine()).myCylinder;
        }

        if (this._myParams.myMaterial == null) {
            if (this._myParams.myColor == null) {
                this._myLineMeshComponent.material = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myMesh;
            } else {
                if (this._myFlatOpaqueMaterial == null) {
                    this._myFlatOpaqueMaterial = Globals.getDefaultMaterials(this._myParams.myParent.pp_getEngine()).myFlatOpaque.clone();
                }
                this._myLineMeshComponent.material = this._myFlatOpaqueMaterial;
                this._myFlatOpaqueMaterial.color = this._myParams.myColor;
            }
        } else {
            this._myLineMeshComponent.material = this._myParams.myMaterial;
        }
    };
}();

VisualLineParams.prototype._copyHook = function _copyHook(other, deepCopy) {
    this.myStart.vec3_copy(other.myStart);
    this.myDirection.vec3_copy(other.myDirection);
    this.myLength = other.myLength;
    this.myThickness = other.myThickness;

    this.myMesh = other.myMesh;

    if (other.myMaterial != null && deepCopy) {
        this.myMaterial = other.myMaterial.clone();
    } else {
        this.myMaterial = other.myMaterial;
    }

    if (other.myColor != null) {
        if (this.myColor != null) {
            this.myColor.vec4_copy(other.myColor);
        } else {
            this.myColor = other.myColor.vec4_clone();
        }
    } else {
        this.myColor = null;
    }

    this.myLocal = other.myLocal;
};
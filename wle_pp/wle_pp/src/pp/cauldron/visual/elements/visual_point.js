import { MeshComponent } from "@wonderlandengine/api";
import { vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { AbstractVisualElement, AbstractVisualElementParams } from "./visual_element.js";
import { VisualElementDefaultType } from "./visual_element_types.js";

export class VisualPointParams extends AbstractVisualElementParams {

    /**
     * TS type inference helper
     * 
     * @param {any} engine
     */
    constructor(engine = Globals.getMainEngine()) {
        super(engine);

        this.myPosition = vec3_create();
        this.myRadius = 0.005;

        this.myMesh = null;         // The mesh is scaled along up axis, null means it will default on myDefaultResources.myMeshes.mySphere

        this.myMaterial = null;     // null means it will default on myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // If this is set and material is null, it will use the default flat opaque material with this color

        this.myLocal = false;

        this.myType = VisualElementDefaultType.POINT;
    }

    _copyHook(other) {
        // Implemented outside class definition
    }

    _new() {
        return new VisualPointParams();
    }
}

/**
 * Example:
 * 
 * ```js  
 * const visualParams = new VisualPointParams();
 * visualParams.myPosition.vec3_copy(position);
 * visualParams.myRadius = 0.005;
 * visualParams.myMaterial = Globals.getDefaultMaterials().myFlatOpaque.clone();
 * visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
 * const visualPoint = new VisualPoint(visualParams);
 * 
 * // OR
 * 
 * Globals.getVisualManager().draw(visualParams);
 * ```
*/
export class VisualPoint extends AbstractVisualElement {

    constructor(params = new VisualPointParams()) {
        super(params);

        this._myPointObject = null;
        this._myPointMeshComponent = null;

        this._myFlatOpaqueMaterial = null;

        this._prepare();
    }

    _visibleChanged() {
        this._myPointObject.pp_setActive(this._myVisible);
    }

    _build() {
        this._myPointObject = Globals.getSceneObjects(this._myParams.myParent.pp_getEngine()).myVisualElements.pp_addObject();

        this._myPointMeshComponent = this._myPointObject.pp_addComponent(MeshComponent);
    }

    _refresh() {
        // Implemented outside class definition
    }

    _new(params) {
        return new VisualPoint(params);
    }

    _destroyHook() {
        this._myPointObject.pp_destroy();
    }
}



// IMPLEMENTATION

VisualPoint.prototype._refresh = function () {
    let rotation = vec3_create(0, 0, 0);
    return function _refresh() {
        this._myPointObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myLocal) {
            this._myPointObject.pp_setPositionLocal(this._myParams.myPosition);
            this._myPointObject.pp_setRotationLocal(rotation);
            this._myPointObject.pp_setScaleLocal(this._myParams.myRadius);
        } else {
            this._myPointObject.pp_setPosition(this._myParams.myPosition);
            this._myPointObject.pp_setRotation(rotation);
            this._myPointObject.pp_setScale(this._myParams.myRadius);
        }

        if (this._myParams.myMesh != null) {
            this._myPointMeshComponent.mesh = this._myParams.myMesh;
        } else {
            this._myPointMeshComponent.mesh = Globals.getDefaultMeshes(this._myParams.myParent.pp_getEngine()).mySphere;
        }

        if (this._myParams.myMaterial == null) {
            if (this._myParams.myColor == null) {
                this._myPointMeshComponent.material = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myMesh;
            } else {
                if (this._myFlatOpaqueMaterial == null) {
                    this._myFlatOpaqueMaterial = Globals.getDefaultMaterials(this._myParams.myParent.pp_getEngine()).myFlatOpaque.clone();
                }
                this._myPointMeshComponent.material = this._myFlatOpaqueMaterial;
                this._myFlatOpaqueMaterial.color = this._myParams.myColor;
            }
        } else {
            this._myPointMeshComponent.material = this._myParams.myMaterial;
        }
    };
}();

VisualPointParams.prototype._copyHook = function _copyHook(other) {
    this.myPosition.vec3_copy(other.myPosition);
    this.myRadius = other.myRadius;

    this.myMesh = other.myMesh;

    if (other.myMaterial != null) {
        this.myMaterial = other.myMaterial.clone();
    } else {
        this.myMaterial = null;
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
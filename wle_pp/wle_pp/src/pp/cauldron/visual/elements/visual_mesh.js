/*
let visualParams = new VisualMeshParams();
visualParams.myTransform = transform;
visualParams.myMesh = myDefaultResources.myMeshes.mySphere;
visualParams.myMaterial = myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
Globals.getVisualManager().draw(visualParams);

or

let visualMesh = new VisualMesh(visualParams);
*/

import { MeshComponent } from "@wonderlandengine/api";
import { mat4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { VisualElementType } from "./visual_element_types.js";

export class VisualMeshParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myTransform = mat4_create();

        this.myMesh = null;
        this.myMaterial = null;

        this.myParent = Globals.getSceneObjects(engine).myVisualElements;
        this.myLocal = false;

        this.myType = VisualElementType.MESH;
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class VisualMesh {

    constructor(params = new VisualMeshParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myMeshObject = null;
        this._myMeshComponent = null;

        this._myDestroyed = false;

        this._build();
        this.forceRefresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myMeshObject.pp_setActive(visible);
        }
    }

    setAutoRefresh(autoRefresh) {
        this._myAutoRefresh = autoRefresh;
    }

    getParams() {
        return this._myParams;
    }

    setParams(params) {
        this._myParams = params;
        this._markDirty();
    }

    copyParams(params) {
        this._myParams.copy(params);
        this._markDirty();
    }

    paramsUpdated() {
        this._markDirty();
    }

    refresh() {
        this.update(0);
    }

    forceRefresh() {
        this._refresh();
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();

            this._myDirty = false;
        }
    }

    _refresh() {
        this._myMeshObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myLocal) {
            this._myMeshObject.pp_setTransformLocal(this._myParams.myTransform);
        } else {
            this._myMeshObject.pp_setTransform(this._myParams.myTransform);
        }

        if (this._myParams.myMesh == null) {
            this._myMeshComponent.mesh = Globals.getDefaultMeshes(this._myParams.myParent.pp_getEngine()).mySphere;
        } else {
            this._myMeshComponent.mesh = this._myParams.myMesh;
        }

        if (this._myParams.myMaterial == null) {
            this._myMeshComponent.material = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myMesh;
        } else {
            this._myMeshComponent.material = this._myParams.myMaterial;
        }
    }

    _build() {
        this._myMeshObject = Globals.getSceneObjects(this._myParams.myParent.pp_getEngine()).myVisualElements.pp_addObject();

        this._myMeshComponent = this._myMeshObject.pp_addComponent(MeshComponent);
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new VisualMeshParams(this._myParams.myParent.pp_getEngine());
        clonedParams.copy(this._myParams);

        let clone = new VisualMesh(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }

    destroy() {
        this._myDestroyed = true;

        this._myMeshObject.pp_destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

VisualMeshParams.prototype.copy = function copy(other) {
    this.myTransform.pp_copy(other.myTransform);

    if (other.myMesh != null) {
        this.myMesh = other.myMesh;
    } else {
        this.myMesh = null;
    }

    if (other.myMaterial != null) {
        this.myMaterial = other.myMaterial.clone();
    } else {
        this.myMaterial = null;
    }

    this.myParent = other.myParent;
    this.myLocal = other.myLocal;

    this.myType = other.myType;
};
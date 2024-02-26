/*
let visualParams = new VisualLineParams();
visualParams.myStart.vec3_copy(start);
visualParams.myDirection.vec3_copy(direction);
visualParams.myLength = 0.2;
visualParams.myMaterial = myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
Globals.getVisualManager().draw(visualParams);

or

let visualLine = new VisualLine(visualParams);
*/

import { MeshComponent } from "@wonderlandengine/api";
import { vec3_create } from "../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../pp/globals";
import { VisualElementType } from "./visual_element_types";

export class VisualLineParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myStart = vec3_create();
        this.myDirection = vec3_create(0, 0, 1);
        this.myLength = 0;

        this.myThickness = 0.005;

        this.myMesh = null;         // The mesh is scaled along up axis, null means it will default on myDefaultResources.myMeshes.myCylinder

        this.myMaterial = null;     // null means it will default on myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // If this is set and material is null, it will use the default flat opaque material with this color

        this.myParent = Globals.getSceneObjects(engine).myVisualElements;
        this.myLocal = false;

        this.myType = VisualElementType.LINE;
    }

    setStartEnd(start, end) {
        end.vec3_sub(start, this.myDirection);
        this.myLength = this.myDirection.vec3_length();
        this.myDirection.vec3_normalize(this.myDirection);
        this.myStart.vec3_copy(start);

        return this;
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class VisualLine {

    constructor(params = new VisualLineParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myLineParentObject = null;
        this._myLineObject = null;
        this._myLineMeshComponent = null;

        this._myFlatOpaqueMaterial = null;

        this._myDestroyed = false;

        this._build();
        this.forceRefresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myLineParentObject.pp_setActive(visible);
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

    _build() {
        this._myLineParentObject = Globals.getSceneObjects(this._myParams.myParent.pp_getEngine()).myVisualElements.pp_addObject();
        this._myLineObject = this._myLineParentObject.pp_addObject();

        this._myLineMeshComponent = this._myLineObject.pp_addComponent(MeshComponent);
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new VisualLineParams(this._myParams.myParent.pp_getEngine());
        clonedParams.copy(this._myParams);

        let clone = new VisualLine(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }

    _refresh() {
        // Implemented outside class definition
    }

    destroy() {
        this._myDestroyed = true;

        this._myLineParentObject.pp_destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

VisualLine.prototype._refresh = function () {
    let scaleLine = vec3_create();
    let translateLine = vec3_create();

    let forward = vec3_create(0, 1, 0);
    return function _refresh() {
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

VisualLineParams.prototype.copy = function copy(other) {
    this.myStart.vec3_copy(other.myStart);
    this.myDirection.vec3_copy(other.myDirection);
    this.myLength = other.myLength;
    this.myThickness = other.myThickness;

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

    this.myParent = other.myParent;
    this.myLocal = other.myLocal;

    this.myType = other.myType;
};
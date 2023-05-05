/*
let visualParams = new VisualTorusParams();
visualParams.myRadius = 1;
visualParams.mySegmentsAmount = 12;
visualParams.mySegmentThickness = 0.05;
visualParams.myTransform.mat4_copy(transform);
visualParams.myMaterial = myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
Globals.getVisualManager().draw(visualParams);

or

let visualTorus = new VisualTorus(visualParams);
*/

import { mat4_create, vec3_create } from "../../../plugin/js/extensions/array_extension";
import { Globals } from "../../../pp/globals";
import { VisualElementType } from "./visual_element_types";
import { VisualLine, VisualLineParams } from "./visual_line";

export class VisualTorusParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myTransform = mat4_create();
        this.myRadius = 0;

        this.mySegmentsAmount = 12;
        this.mySegmentThickness = 0.05;

        this.mySegmentMesh = null;  // The mesh is scaled along up axis, null means it will default on myDefaultResources.myMeshes.myCylinder

        this.myMaterial = null;     // null means it will default on myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // If this is set and material is null, it will use the default flat opaque material with this color

        this.myParent = Globals.getSceneObjects(engine).myVisualElements;
        this.myLocal = false;

        this.myType = VisualElementType.TORUS;
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class VisualTorus {

    constructor(params = new VisualTorusParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myTorusParentObject = null;

        this._myVisualSegmentList = [];

        this._myFlatOpaqueMaterial = null;

        this._myDestroyed = false;

        this._build();
        this.forceRefresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;

            if (this._myVisible) {
                let segmentToShow = Math.min(this._myParams.mySegmentsAmount, this._myVisualSegmentList.length);

                for (let i = 0; i < segmentToShow; i++) {
                    let visualSegment = this._myVisualSegmentList[i];
                    visualSegment.setVisible(true);
                }
            } else {
                for (let visualSegment of this._myVisualSegmentList) {
                    visualSegment.setVisible(false);
                }
            }
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

        let segmentToRefresh = Math.min(this._myParams.mySegmentsAmount, this._myVisualSegmentList.length);

        for (let i = 0; i < segmentToRefresh; i++) {
            let visualSegment = this._myVisualSegmentList[i];
            visualSegment.forceRefresh();
        }
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();

            this._myDirty = false;
        }

        for (let visualSegment of this._myVisualSegmentList) {
            visualSegment.update(dt);
        }
    }

    _build() {
        this._myTorusParentObject = Globals.getSceneObjects(this._myParams.myParent.pp_getEngine()).myVisualElements.pp_addObject();

        this._fillSegmentList();
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    _fillSegmentList() {
        while (this._myVisualSegmentList.length < this._myParams.mySegmentsAmount) {
            let visualSegment = new VisualLine(new VisualLineParams(this._myParams.myParent.pp_getEngine()));

            visualSegment.setAutoRefresh(false);
            visualSegment.setVisible(false);

            visualSegment.getParams().myParent = this._myTorusParentObject;
            visualSegment.getParams().myLocal = true;

            this._myVisualSegmentList.push(visualSegment);
        }
    }

    clone() {
        let clonedParams = new VisualTorusParams(this._myParams.myParent.pp_getEngine());
        clonedParams.copy(this._myParams);

        let clone = new VisualTorus(clonedParams);
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

        for (let visualSegment of this._myVisualSegmentList) {
            visualSegment.destroy();
        }
        this._myTorusParentObject.pp_destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

VisualTorus.prototype._refresh = function () {
    let segmentStart = vec3_create();
    let segmentEnd = vec3_create();

    let segmentDirection = vec3_create();

    let fixedSegmentStart = vec3_create();
    let fixedSegmentEnd = vec3_create();

    let up = vec3_create(0, 1, 0);
    return function _refresh() {
        this._fillSegmentList();

        for (let visualSegment of this._myVisualSegmentList) {
            visualSegment.setVisible(false);
        }

        this._myTorusParentObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myLocal) {
            this._myTorusParentObject.pp_setTransformLocal(this._myParams.myTransform);
        } else {
            this._myTorusParentObject.pp_setTransform(this._myParams.myTransform);
        }

        let sliceAngle = 2 * Math.PI / this._myParams.mySegmentsAmount;
        segmentStart.vec3_set(this._myParams.myRadius, 0, 0);
        for (let i = 0; i < this._myParams.mySegmentsAmount; i++) {
            segmentEnd = segmentStart.vec3_rotateAxisRadians(sliceAngle, up, segmentEnd);

            segmentDirection = segmentEnd.vec3_sub(segmentStart, segmentDirection).vec3_normalize(segmentDirection);

            let extraLength = Math.tan(sliceAngle / 2) * this._myParams.mySegmentThickness / 2;

            fixedSegmentStart = segmentStart.vec3_sub(segmentDirection.vec3_scale(extraLength, fixedSegmentStart), fixedSegmentStart);
            fixedSegmentEnd = segmentEnd.vec3_add(segmentDirection.vec3_scale(extraLength, fixedSegmentEnd), fixedSegmentEnd);

            let visualSegment = this._myVisualSegmentList[i];

            let visualSegmentParams = visualSegment.getParams();
            visualSegmentParams.setStartEnd(fixedSegmentStart, fixedSegmentEnd);
            visualSegmentParams.myThickness = this._myParams.mySegmentThickness;

            visualSegmentParams.myMesh = this._myParams.mySegmentMesh;

            if (this._myParams.myMaterial == null) {
                if (this._myParams.myColor == null) {
                    visualSegmentParams.myMaterial = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myMesh;
                } else {
                    if (this._myFlatOpaqueMaterial == null) {
                        this._myFlatOpaqueMaterial = Globals.getDefaultMaterials(this._myParams.myParent.pp_getEngine()).myFlatOpaque.clone();
                    }
                    visualSegmentParams.myMaterial = this._myFlatOpaqueMaterial;
                    this._myFlatOpaqueMaterial.color = this._myParams.myColor;
                }
            } else {
                visualSegmentParams.myMaterial = this._myParams.myMaterial;
            }

            visualSegment.paramsUpdated();

            visualSegment.setVisible(this._myVisible);

            segmentStart.vec3_copy(segmentEnd);
        }
    };
}();

VisualTorusParams.prototype.copy = function copy(other) {
    this.myRadius = other.myRadius;
    this.mySegmentsAmount = other.mySegmentsAmount;
    this.mySegmentThickness = other.mySegmentThickness;

    this.myTransform.mat4_copy(other.myTransform);

    this.mySegmentMesh = other.mySegmentMesh;

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
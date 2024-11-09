import { mat4_create, vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { AbstractVisualElement, AbstractVisualElementParams } from "./visual_element.js";
import { VisualElementDefaultType } from "./visual_element_types.js";
import { VisualLine, VisualLineParams } from "./visual_line.js";

export class VisualTorusParams extends AbstractVisualElementParams {

    /**
     * TS type inference helper
     * 
     * @param {any} engine
     */
    constructor(engine = Globals.getMainEngine()) {
        super(engine);

        this.myTransform = mat4_create();
        this.myRadius = 0;

        this.mySegmentsAmount = 12;
        this.mySegmentThickness = 0.05;

        this.mySegmentMesh = null;  // The mesh is scaled along up axis, null means it will default on myDefaultResources.myMeshes.myCylinder

        this.myMaterial = null;     // null means it will default on myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // If this is set and material is null, it will use the default flat opaque material with this color

        this.myLocal = false;

        this.myType = VisualElementDefaultType.TORUS;
    }

    _copyHook(other, deepCopy) {
        // Implemented outside class definition
    }

    _new() {
        return new VisualTorusParams(this.myParent.pp_getEngine());
    }

    _equalsHook(other) {
        return this.myRadius == other.myRadius &&
            this.mySegmentsAmount == other.mySegmentsAmount &&
            this.mySegmentThickness == other.mySegmentThickness &&
            this.mySegmentMesh == other.mySegmentMesh &&
            this.myMaterial == other.myMaterial &&
            this.myLocal == other.myLocal &&
            (this.myColor == other.myColor || (this.myColor != null && other.myColor != null && this.myColor.vec_equals(other.myColor))) &&
            this.myTransform.vec_equals(other.myTransform);
    }
}

/**
 * Example:
 * 
 * ```js  
 * const visualParams = new VisualTorusParams();
 * visualParams.myRadius = 1;
 * visualParams.mySegmentsAmount = 12;
 * visualParams.mySegmentThickness = 0.05;
 * visualParams.myTransform.mat4_copy(transform);
 * visualParams.myMaterial = Globals.getDefaultMaterials().myFlatOpaque.clone();
 * visualParams.myMaterial.color = vec4_create(1, 1, 1, 1);
 * const visualTorus = new VisualTorus(visualParams);
 * 
 * // OR
 * 
 * Globals.getVisualManager().draw(visualParams);
 * ```
*/
export class VisualTorus extends AbstractVisualElement {

    constructor(params = new VisualTorusParams()) {
        super(params);

        this._myTorusParentObject = null;

        this._myVisualSegmentList = [];

        this._myFlatOpaqueMaterial = null;

        this._prepare();
    }

    _visibleChanged() {
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

    _updateHook(dt) {
        for (let visualSegment of this._myVisualSegmentList) {
            visualSegment.update(dt);
        }
    }

    _build() {
        this._myTorusParentObject = Globals.getSceneObjects(this._myParams.myParent.pp_getEngine()).myVisualElements.pp_addChild();

        this._fillSegmentList();
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

    _refreshHook() {
        // Implemented outside class definition
    }

    _new(params) {
        return new VisualTorus(params);
    }

    _destroyHook() {
        for (let visualSegment of this._myVisualSegmentList) {
            visualSegment.destroy();
        }
        this._myTorusParentObject.pp_destroy();
    }
}



// IMPLEMENTATION

VisualTorus.prototype._refreshHook = function () {
    let segmentStart = vec3_create();
    let segmentEnd = vec3_create();

    let segmentDirection = vec3_create();

    let fixedSegmentStart = vec3_create();
    let fixedSegmentEnd = vec3_create();

    let up = vec3_create(0, 1, 0);
    return function _refreshHook() {
        this._fillSegmentList();

        for (let i = this._myParams.mySegmentsAmount; i < this._myVisualSegmentList.length; i++) {
            let visualSegment = this._myVisualSegmentList[i];
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

VisualTorusParams.prototype._copyHook = function _copyHook(other, deepCopy) {
    this.myRadius = other.myRadius;
    this.mySegmentsAmount = other.mySegmentsAmount;
    this.mySegmentThickness = other.mySegmentThickness;

    this.myTransform.mat4_copy(other.myTransform);

    this.mySegmentMesh = other.mySegmentMesh;

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
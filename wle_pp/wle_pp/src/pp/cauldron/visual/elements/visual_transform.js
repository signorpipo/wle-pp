/*
let visualParams = new VisualTransformParams();
visualParams.myTransform.mat4_copy(transform);
visualParams.myLength = 0.2;
Globals.getVisualManager().draw(visualParams);

or

let visualTransform = new VisualTransform(visualParams);
*/

import { mat4_create, vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { VisualArrow, VisualArrowParams } from "./visual_arrow.js";
import { VisualElementType } from "./visual_element_types.js";

export class VisualTransformParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myTransform = mat4_create();
        this.myLength = 0.2;
        this.myThickness = 0.005;

        this.myForwardMaterial = null;
        this.myUpMaterial = null;
        this.myRightMaterial = null;

        this.myParent = Globals.getSceneObjects(engine).myVisualElements;
        this.myLocal = false;

        this.myType = VisualElementType.TRANSFORM;
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class VisualTransform {

    constructor(params = new VisualTransformParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myVisualRight = new VisualArrow(new VisualArrowParams(this._myParams.myParent.pp_getEngine()));
        this._myVisualUp = new VisualArrow(new VisualArrowParams(this._myParams.myParent.pp_getEngine()));
        this._myVisualForward = new VisualArrow(new VisualArrowParams(this._myParams.myParent.pp_getEngine()));

        this._myVisualRight.setAutoRefresh(false);
        this._myVisualUp.setAutoRefresh(false);
        this._myVisualForward.setAutoRefresh(false);

        this._myDestroyed = false;

        this.forceRefresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myVisualRight.setVisible(visible);
            this._myVisualUp.setVisible(visible);
            this._myVisualForward.setVisible(visible);
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

        this._myVisualRight.forceRefresh();
        this._myVisualUp.forceRefresh();
        this._myVisualForward.forceRefresh();
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();

            this._myDirty = false;
        }

        this._myVisualRight.update(dt);
        this._myVisualUp.update(dt);
        this._myVisualForward.update(dt);
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new VisualTransformParams(this._myParams.myParent.pp_getEngine());
        clonedParams.copy(this._myParams);

        let clone = new VisualTransform(clonedParams);
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

        this._myVisualRight.destroy();
        this._myVisualUp.destroy();
        this._myVisualForward.destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

VisualTransform.prototype._refresh = function () {
    let axes = [vec3_create(), vec3_create(), vec3_create()];
    let scale = vec3_create();
    let position = vec3_create();
    return function _refresh() {
        axes = this._myParams.myTransform.mat4_getAxes(axes);
        scale = this._myParams.myTransform.mat4_getScale(scale);
        let maxValue = 0;
        for (let value of scale) {
            maxValue = Math.max(value, maxValue);
        }

        if (maxValue == 0) {
            scale[0] = 1;
            scale[1] = 1;
            scale[2] = 1;
        } else {
            scale[0] = scale[0] / maxValue;
            scale[1] = scale[1] / maxValue;
            scale[2] = scale[2] / maxValue;
        }

        position = this._myParams.myTransform.mat4_getPosition(position);

        {
            let visualArrowParams = this._myVisualRight.getParams();
            visualArrowParams.myStart.vec3_copy(position);
            visualArrowParams.myDirection = axes[0].vec3_negate(visualArrowParams.myDirection).vec3_normalize(visualArrowParams.myDirection);
            visualArrowParams.myLength = Math.max(this._myParams.myLength * scale[0], 0.001);
            visualArrowParams.myThickness = this._myParams.myThickness;

            if (this._myParams.myRightMaterial == null) {
                visualArrowParams.myMaterial = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myRight;
            } else {
                visualArrowParams.myMaterial = this._myParams.myRightMaterial;
            }

            visualArrowParams.myParent = this._myParams.myParent;
            visualArrowParams.myLocal = this._myParams.myLocal;

            this._myVisualRight.paramsUpdated();
        }

        {
            let visualArrowParams = this._myVisualUp.getParams();
            visualArrowParams.myStart.vec3_copy(position);
            visualArrowParams.myDirection = axes[1].vec3_normalize(visualArrowParams.myDirection);
            visualArrowParams.myLength = Math.max(this._myParams.myLength * scale[1], 0.001);
            visualArrowParams.myThickness = this._myParams.myThickness;

            if (this._myParams.myUpMaterial == null) {
                visualArrowParams.myMaterial = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myUp;
            } else {
                visualArrowParams.myMaterial = this._myParams.myUpMaterial;
            }

            visualArrowParams.myParent = this._myParams.myParent;
            visualArrowParams.myLocal = this._myParams.myLocal;

            this._myVisualUp.paramsUpdated();
        }

        {
            let visualArrowParams = this._myVisualForward.getParams();
            visualArrowParams.myStart.vec3_copy(position);
            visualArrowParams.myDirection = axes[2].vec3_normalize(visualArrowParams.myDirection);
            visualArrowParams.myLength = Math.max(this._myParams.myLength * scale[2], 0.001);
            visualArrowParams.myThickness = this._myParams.myThickness;

            if (this._myParams.myForwardMaterial == null) {
                visualArrowParams.myMaterial = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myForward;
            } else {
                visualArrowParams.myMaterial = this._myParams.myForwardMaterial;
            }

            visualArrowParams.myParent = this._myParams.myParent;
            visualArrowParams.myLocal = this._myParams.myLocal;

            this._myVisualForward.paramsUpdated();
        }
    };
}();

VisualTransformParams.prototype.copy = function copy(other) {
    this.myTransform.mat4_copy(other.myTransform);
    this.myLength = other.myLength;
    this.myThickness = other.myThickness;

    if (other.myRightMaterial != null) {
        this.myRightMaterial = other.myRightMaterial.clone();
    } else {
        this.myRightMaterial = null;
    }

    if (other.myUpMaterial != null) {
        this.myUpMaterial = other.myUpMaterial.clone();
    } else {
        this.myUpMaterial = null;
    }

    if (other.myForwardMaterial != null) {
        this.myForwardMaterial = other.myForwardMaterial.clone();
    } else {
        this.myForwardMaterial = null;
    }

    this.myParent = other.myParent;
    this.myLocal = other.myLocal;

    this.myType = other.myType;
};
import { mat4_create, vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { VisualArrow, VisualArrowParams } from "./visual_arrow.js";
import { AbstractVisualElement, AbstractVisualElementParams } from "./visual_element.js";
import { VisualElementDefaultType } from "./visual_element_types.js";

export class VisualTransformParams extends AbstractVisualElementParams {

    /**
     * TS type inference helper
     * 
     * @param {any} engine
     */
    constructor(engine = Globals.getMainEngine()) {
        super(engine);

        this.myTransform = mat4_create();
        this.myLength = 0.2;
        this.myThickness = 0.005;

        this.myForwardMaterial = null;
        this.myUpMaterial = null;
        this.myRightMaterial = null;

        this.myLocal = false;

        this.myType = VisualElementDefaultType.TRANSFORM;
    }

    _copyHook(other) {
        // Implemented outside class definition
    }

    _new() {
        return new VisualTransformParams();
    }
}

/**
 * Example:
 * 
 * ```js  
 * const visualParams = new VisualTransformParams();
 * visualParams.myTransform.mat4_copy(transform);
 * visualParams.myLength = 0.2;
 * const visualTransform = new VisualTransform(visualParams);
 * 
 * // OR
 * 
 * Globals.getVisualManager().draw(visualParams);
 * ```
*/
export class VisualTransform extends AbstractVisualElement {

    constructor(params = new VisualTransformParams()) {
        super(params);

        this._myVisualRight = new VisualArrow(new VisualArrowParams(this._myParams.myParent.pp_getEngine()));
        this._myVisualUp = new VisualArrow(new VisualArrowParams(this._myParams.myParent.pp_getEngine()));
        this._myVisualForward = new VisualArrow(new VisualArrowParams(this._myParams.myParent.pp_getEngine()));

        this._myVisualRight.setAutoRefresh(false);
        this._myVisualUp.setAutoRefresh(false);
        this._myVisualForward.setAutoRefresh(false);

        this._prepare();
    }

    _updateHook(dt) {
        this._myVisualRight.update(dt);
        this._myVisualUp.update(dt);
        this._myVisualForward.update(dt);
    }

    _visibleChanged() {
        this._myVisualRight.setVisible(this._myVisible);
        this._myVisualUp.setVisible(this._myVisible);
        this._myVisualForward.setVisible(this._myVisible);
    }

    _build() {

    }

    _refresh() {
        // Implemented outside class definition
    }

    _forceRefreshHook() {
        this._myVisualRight.forceRefresh();
        this._myVisualUp.forceRefresh();
        this._myVisualForward.forceRefresh();
    }

    _new(params) {
        return new VisualTransform(params);
    }

    _destroyHook() {
        this._myVisualRight.destroy();
        this._myVisualUp.destroy();
        this._myVisualForward.destroy();
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

VisualTransformParams.prototype._copyHook = function _copyHook(other) {
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

    this.myLocal = other.myLocal;
};
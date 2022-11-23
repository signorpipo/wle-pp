/*
let visualParams = new PP.VisualTransformParams();
visualParams.myTransform.mat4_copy(transform);
visualParams.myLength = 0.2;
PP.myVisualManager.draw(visualParams);

or

let visualTransform = new PP.VisualTransform(visualParams);
*/

PP.VisualTransformParams = class VisualTransformParams {

    constructor() {
        this.myTransform = PP.mat4_create();
        this.myLength = 0.2;
        this.myThickness = 0.005;

        this.myForwardMaterial = null;
        this.myUpMaterial = null;
        this.myRightMaterial = null;

        this.myParent = null; // if this is set the parent will not be the visual root anymore, the positions will be local to this object

        this.myType = PP.VisualElementType.TRANSFORM;
    }
};

PP.VisualTransform = class VisualTransform {

    constructor(params = new PP.VisualTransformParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myVisualRight = new PP.VisualArrow();
        this._myVisualUp = new PP.VisualArrow();
        this._myVisualForward = new PP.VisualArrow();

        this._myVisualRight.setAutoRefresh(false);
        this._myVisualUp.setAutoRefresh(false);
        this._myVisualForward.setAutoRefresh(false);

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
        let clonedParams = new PP.VisualTransformParams();
        clonedParams.myTransform.mat4_copy(this._myParams.myTransform);
        clonedParams.myLength = this._myParams.myLength;
        clonedParams.myThickness = this._myParams.myThickness;

        if (this._myParams.myRightMaterial != null) {
            clonedParams.myRightMaterial = this._myParams.myRightMaterial.clone();
        } else {
            clonedParams.myRightMaterial = null;
        }

        if (this._myParams.myUpMaterial != null) {
            clonedParams.myUpMaterial = this._myParams.myUpMaterial.clone();
        } else {
            clonedParams.myUpMaterial = null;
        }

        if (this._myParams.myForwardMaterial != null) {
            clonedParams.myForwardMaterial = this._myParams.myForwardMaterial.clone();
        } else {
            clonedParams.myForwardMaterial = null;
        }

        clonedParams.myParent = this._myParams.myParent;

        let clone = new PP.VisualTransform(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};

PP.VisualTransform.prototype._refresh = function () {
    let axes = [PP.vec3_create(), PP.vec3_create(), PP.vec3_create()];
    let scale = PP.vec3_create();
    let position = PP.vec3_create();
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
            let visualLineParams = this._myVisualRight.getParams();
            visualLineParams.myStart.vec3_copy(position);
            visualLineParams.myDirection = axes[0].vec3_negate(visualLineParams.myDirection).vec3_normalize(visualLineParams.myDirection);
            visualLineParams.myLength = Math.max(this._myParams.myLength * scale[0], 0.001);
            visualLineParams.myThickness = this._myParams.myThickness;

            if (this._myParams.myRightMaterial == null) {
                visualLineParams.myMaterial = PP.myVisualData.myDefaultMaterials.myDefaultRightMaterial;
            } else {
                visualLineParams.myMaterial = this._myParams.myRightMaterial;
            }

            visualLineParams.myParent = this._myParams.myParent;

            this._myVisualRight.paramsUpdated();
        }

        {
            let visualLineParams = this._myVisualUp.getParams();
            visualLineParams.myStart.vec3_copy(position);
            visualLineParams.myDirection = axes[1].vec3_normalize(visualLineParams.myDirection);
            visualLineParams.myLength = Math.max(this._myParams.myLength * scale[1], 0.001);
            visualLineParams.myThickness = this._myParams.myThickness;

            if (this._myParams.myUpMaterial == null) {
                visualLineParams.myMaterial = PP.myVisualData.myDefaultMaterials.myDefaultUpMaterial;
            } else {
                visualLineParams.myMaterial = this._myParams.myUpMaterial;
            }

            visualLineParams.myParent = this._myParams.myParent;

            this._myVisualUp.paramsUpdated();
        }

        {
            let visualLineParams = this._myVisualForward.getParams();
            visualLineParams.myStart.vec3_copy(position);
            visualLineParams.myDirection = axes[2].vec3_normalize(visualLineParams.myDirection);
            visualLineParams.myLength = Math.max(this._myParams.myLength * scale[2], 0.001);
            visualLineParams.myThickness = this._myParams.myThickness;

            if (this._myParams.myForwardMaterial == null) {
                visualLineParams.myMaterial = PP.myVisualData.myDefaultMaterials.myDefaultForwardMaterial;
            } else {
                visualLineParams.myMaterial = this._myParams.myForwardMaterial;
            }

            visualLineParams.myParent = this._myParams.myParent;

            this._myVisualForward.paramsUpdated();
        }
    };
}();



Object.defineProperty(PP.VisualTransform.prototype, "_refresh", { enumerable: false });
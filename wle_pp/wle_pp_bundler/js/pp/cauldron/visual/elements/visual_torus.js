/*
let visualParams = new PP.VisualTorusParams();
visualParams.myRadius = 1;
visualParams.mySegmentsAmount = 12;
visualParams.mySegmentThickness = 0.05;
visualParams.myTransform.mat4_copy(transform);
visualParams.myMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = PP.vec4_create(1, 1, 1, 1);
PP.myVisualManager.draw(visualParams);

or

let visualTorus = new PP.VisualTorus(visualParams);
*/

PP.VisualTorusParams = class VisualTorusParams {

    constructor() {
        this.myTransform = PP.mat4_create();
        this.myRadius = 0;

        this.mySegmentsAmount = 12;
        this.mySegmentThickness = 0.05;

        this.mySegmentMesh = null;  // the mesh is scaled along up axis, null means it will default on PP.myDefaultResources.myMeshes.myCylinder

        this.myMaterial = null;     // null means it will default on PP.myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // if this is set and material is null, it will use the default flat opaque material with this color

        this.myParent = PP.myVisualData.myRootObject;
        this.myIsLocal = false;

        this.myType = PP.VisualElementType.TORUS;
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.VisualTorus = class VisualTorus {

    constructor(params = new PP.VisualTorusParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myTorusRootObject = null;

        this._myVisualSegmentList = [];

        this._myFlatOpaqueMaterial = null;

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
        this._myTorusRootObject = WL.scene.addObject(null);

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
            let visualSegment = new PP.VisualLine();

            visualSegment.setAutoRefresh(false);
            visualSegment.setVisible(false);

            visualSegment.getParams().myParent = this._myTorusRootObject;
            visualSegment.getParams().myIsLocal = true;

            this._myVisualSegmentList.push(visualSegment);
        }
    }

    clone() {
        let clonedParams = new PP.VisualTorusParams();
        clonedParams.copy(this._myParams);

        let clone = new PP.VisualTorus(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};

PP.VisualTorus.prototype._refresh = function () {
    let segmentStart = PP.vec3_create();
    let segmentEnd = PP.vec3_create();

    let segmentDirection = PP.vec3_create();

    let fixedSegmentStart = PP.vec3_create();
    let fixedSegmentEnd = PP.vec3_create();

    let up = PP.vec3_create(0, 1, 0);
    return function _refresh() {
        this._fillSegmentList();

        for (let visualSegment of this._myVisualSegmentList) {
            visualSegment.setVisible(false);
        }

        this._myTorusRootObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myIsLocal) {
            this._myTorusRootObject.pp_setTransformLocal(this._myParams.myTransform);
        } else {
            this._myTorusRootObject.pp_setTransform(this._myParams.myTransform);
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
                    visualSegmentParams.myMaterial = PP.myVisualData.myDefaultMaterials.myDefaultMeshMaterial;
                } else {
                    if (this._myFlatOpaqueMaterial == null) {
                        this._myFlatOpaqueMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
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

PP.VisualTorusParams.prototype.copy = function copy(other) {
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
    this.myIsLocal = other.myIsLocal;

    this.myType = other.myType;
};



Object.defineProperty(PP.VisualTorus.prototype, "_refresh", { enumerable: false });
Object.defineProperty(PP.VisualTorusParams.prototype, "copy", { enumerable: false });
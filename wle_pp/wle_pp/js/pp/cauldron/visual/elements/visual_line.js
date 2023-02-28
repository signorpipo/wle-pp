/*
let visualParams = new PP.VisualLineParams();
visualParams.myStart.vec3_copy(start);
visualParams.myDirection.vec3_copy(direction);
visualParams.myLength = 0.2;
visualParams.myMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = PP.vec4_create(1, 1, 1, 1);
PP.myVisualManager.draw(visualParams);

or

let visualLine = new PP.VisualLine(visualParams);
*/

PP.VisualLineParams = class VisualLineParams {

    constructor() {
        this.myStart = PP.vec3_create();
        this.myDirection = PP.vec3_create(0, 0, 1);
        this.myLength = 0;

        this.myThickness = 0.005;

        this.myMesh = null;         // the mesh is scaled along up axis, null means it will default on PP.myDefaultResources.myMeshes.myCylinder

        this.myMaterial = null;     // null means it will default on PP.myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // if this is set and material is null, it will use the default flat opaque material with this color

        this.myParent = PP.myVisualData.myRootObject;
        this.myIsLocal = false;

        this.myType = PP.VisualElementType.LINE;
    }

    setStartEnd(start, end) {
        end.vec3_sub(start, this.myDirection);
        this.myLength = this.myDirection.vec3_length();
        this.myDirection.vec3_normalize(this.myDirection);
        this.myStart.vec3_copy(start);

        return this;
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.VisualLine = class VisualLine {

    constructor(params = new PP.VisualLineParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myLineRootObject = null;
        this._myLineObject = null;
        this._myLineMeshComponent = null;

        this._myFlatOpaqueMaterial = null;

        this._build();
        this.forceRefresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myLineRootObject.pp_setActive(visible);
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
        this._myLineRootObject = WL.scene.addObject(null);
        this._myLineObject = WL.scene.addObject(this._myLineRootObject);

        this._myLineMeshComponent = this._myLineObject.addComponent('mesh');
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.VisualLineParams();
        clonedParams.copy(this._myParams);

        let clone = new PP.VisualLine(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};

PP.VisualLine.prototype._refresh = function () {
    let scaleLine = PP.vec3_create();
    let translateLine = PP.vec3_create();

    let forward = PP.vec3_create(0, 1, 0);
    return function _refresh() {
        this._myLineRootObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myIsLocal) {
            this._myLineRootObject.pp_setPositionLocal(this._myParams.myStart);
        } else {
            this._myLineRootObject.pp_setPosition(this._myParams.myStart);
        }

        scaleLine.vec3_set(this._myParams.myThickness / 2, this._myParams.myLength / 2, this._myParams.myThickness / 2);
        if (this._myParams.myIsLocal) {
            this._myLineObject.pp_setScaleLocal(scaleLine);
        } else {
            this._myLineObject.pp_setScale(scaleLine);
        }

        if (this._myParams.myIsLocal) {
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
            this._myLineMeshComponent.mesh = PP.myDefaultResources.myMeshes.myCylinder;
        }

        if (this._myParams.myMaterial == null) {
            if (this._myParams.myColor == null) {
                this._myLineMeshComponent.material = PP.myVisualData.myDefaultMaterials.myDefaultMeshMaterial;
            } else {
                if (this._myFlatOpaqueMaterial == null) {
                    this._myFlatOpaqueMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
                }
                this._myLineMeshComponent.material = this._myFlatOpaqueMaterial;
                this._myFlatOpaqueMaterial.color = this._myParams.myColor;
            }
        } else {
            this._myLineMeshComponent.material = this._myParams.myMaterial;
        }
    };
}();

PP.VisualLineParams.prototype.copy = function copy(other) {
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
    this.myIsLocal = other.myIsLocal;

    this.myType = other.myType;
};



Object.defineProperty(PP.VisualLine.prototype, "_refresh", { enumerable: false });
Object.defineProperty(PP.VisualLineParams.prototype, "copy", { enumerable: false });
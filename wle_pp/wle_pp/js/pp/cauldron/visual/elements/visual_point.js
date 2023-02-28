/*
let visualParams = new PP.VisualPointParams();
visualParams.myPosition.vec3_copy(position);
visualParams.myRadius = 0.005;
visualParams.myMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = PP.vec4_create(1, 1, 1, 1);
PP.myVisualManager.draw(visualParams);

or

let visualPoint = new PP.VisualPoint(visualParams);
*/

PP.VisualPointParams = class VisualPointParams {

    constructor() {
        this.myPosition = PP.vec3_create();
        this.myRadius = 0.005;

        this.myMesh = null;         // the mesh is scaled along up axis, null means it will default on PP.myDefaultResources.myMeshes.mySphere

        this.myMaterial = null;     // null means it will default on PP.myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // if this is set and material is null, it will use the default flat opaque material with this color

        this.myParent = PP.myVisualData.myRootObject;
        this.myIsLocal = false;

        this.myType = PP.VisualElementType.POINT;
    }

    copy(other) {
        // implemented outside class definition
    }
};

PP.VisualPoint = class VisualPoint {

    constructor(params = new PP.VisualPointParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myPointObject = null;
        this._myPointMeshComponent = null;

        this._myFlatOpaqueMaterial = null;

        this._build();
        this.forceRefresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myPointObject.pp_setActive(visible);
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
        this._myPointObject = WL.scene.addObject(null);

        this._myPointMeshComponent = this._myPointObject.addComponent('mesh');
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.VisualPointParams();
        clonedParams.copy(this._myParams);

        let clone = new PP.VisualPoint(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};

PP.VisualPoint.prototype._refresh = function () {
    let rotation = PP.vec3_create(0, 0, 0);
    return function _refresh() {
        this._myPointObject.pp_setParent(this._myParams.myParent, false);

        if (this._myParams.myIsLocal) {
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
            this._myPointMeshComponent.mesh = PP.myDefaultResources.myMeshes.mySphere;
        }

        if (this._myParams.myMaterial == null) {
            if (this._myParams.myColor == null) {
                this._myPointMeshComponent.material = PP.myVisualData.myDefaultMaterials.myDefaultMeshMaterial;
            } else {
                if (this._myFlatOpaqueMaterial == null) {
                    this._myFlatOpaqueMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
                }
                this._myPointMeshComponent.material = this._myFlatOpaqueMaterial;
                this._myFlatOpaqueMaterial.color = this._myParams.myColor;
            }
        } else {
            this._myPointMeshComponent.material = this._myParams.myMaterial;
        }
    }
}();

PP.VisualPointParams.prototype.copy = function copy(other) {
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

    this.myParent = other.myParent;
    this.myIsLocal = other.myIsLocal;

    this.myType = other.myType;
};



Object.defineProperty(PP.VisualPoint.prototype, "_refresh", { enumerable: false });
Object.defineProperty(PP.VisualPointParams.prototype, "copy", { enumerable: false });
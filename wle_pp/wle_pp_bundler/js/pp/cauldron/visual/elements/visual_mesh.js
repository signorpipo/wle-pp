/*
let visualParams = new PP.VisualMeshParams();
visualParams.myTransform = transform;
visualParams.myMesh = PP.myDefaultResources.myMeshes.mySphere;
visualParams.myMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = [1, 1, 1, 1];
PP.myVisualManager.draw(visualParams);

or

let visualMesh = new PP.VisualMesh(visualParams);
*/

PP.VisualMeshParams = class VisualMeshParams {

    constructor() {
        this.myTransform = PP.mat4_create();

        this.myMesh = null;
        this.myMaterial = null;

        this.myParent = null; // if this is set the parent will not be the visual root anymore, the positions will be local to this object

        this.myType = PP.VisualElementType.MESH;
    }
};

PP.VisualMesh = class VisualMesh {

    constructor(params = new PP.VisualMeshParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myMeshObject = null;
        this._myMeshComponent = null;

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
        this._myMeshObject.pp_setParent(this._myParams.myParent == null ? PP.myVisualData.myRootObject : this._myParams.myParent, false);
        this._myMeshObject.pp_setTransformLocal(this._myParams.myTransform);

        if (this._myParams.myMesh == null) {
            this._myMeshComponent.mesh = PP.myDefaultResources.myMeshes.mySphere;
        } else {
            this._myMeshComponent.mesh = this._myParams.myMesh;
        }

        if (this._myParams.myMaterial == null) {
            this._myMeshComponent.material = PP.myVisualData.myDefaultMaterials.myDefaultMeshMaterial;
        } else {
            this._myMeshComponent.material = this._myParams.myMaterial;
        }
    }

    _build() {
        this._myMeshObject = WL.scene.addObject(null);

        this._myMeshComponent = this._myMeshObject.addComponent('mesh');
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.VisualMeshParams();
        clonedParams.myTransform.pp_copy(this._myParams.myTransform);

        if (this._myParams.myMesh != null) {
            clonedParams.myMesh = this._myParams.myMesh;
        } else {
            clonedParams.myMesh = null;
        }

        if (this._myParams.myMaterial != null) {
            clonedParams.myMaterial = this._myParams.myMaterial.clone();
        } else {
            clonedParams.myMaterial = null;
        }

        clonedParams.myParent = this._myParams.myParent;

        let clone = new PP.VisualMesh(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};
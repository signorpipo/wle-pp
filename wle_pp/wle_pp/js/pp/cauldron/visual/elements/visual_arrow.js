/*
let visualParams = new PP.VisualArrowParams();
visualParams.myStart.vec3_copy(start);
visualParams.myDirection.vec3_copy(direction);
visualParams.myLength = 0.2;
visualParams.myMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = [1, 1, 1, 1];
PP.myVisualManager.draw(visualParams);

or

let visualArrow = new PP.VisualArrow(visualParams);
*/

PP.VisualArrowParams = class VisualArrowParams {
    constructor() {
        this.myStart = [0, 0, 0];
        this.myDirection = [0, 0, 1];
        this.myLength = 0;

        this.myThickness = 0.005;

        this.myLineMesh = null;     // the mesh is scaled along up axis, null means it will default on PP.myDefaultResources.myMeshes.myCylinder
        this.myArrowMesh = null;    // the mesh is scaled along up axis, null means it will default on PP.myDefaultResources.myMeshes.myCone

        this.myMaterial = null;     // null means it will default on PP.myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // if this is set and material is null, it will use the default flat opaque material with this color

        this.myParent = null;       // if this is set the parent will not be the visual root anymore, the positions will be local to this object

        this.myType = PP.VisualElementType.ARROW;
    }

    setStartEnd(start, end) {
        end.vec3_sub(start, this.myDirection);
        this.myLength = this.myDirection.vec3_length();
        this.myDirection.vec3_normalize(this.myDirection);
        this.myStart.vec3_copy(start);

        return this;
    }
};

PP.VisualArrow = class VisualArrow {

    constructor(params = new PP.VisualArrowParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myVisualLine = new PP.VisualLine();
        this._myVisualLine.setAutoRefresh(false);

        this._myArrowRootObject = null;
        this._myArrowObject = null;
        this._myArrowMeshComponent = null;

        this._myFlatOpaqueMaterial = null;

        this._build();
        this.forceRefresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myVisualLine.setVisible(visible);
            this._myArrowRootObject.pp_setActive(visible);
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

        this._myVisualLine.forceRefresh();
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();
            this._myDirty = false;
        }

        this._myVisualLine.update(dt);
    }

    _build() {
        this._myArrowRootObject = WL.scene.addObject(null);
        this._myArrowObject = WL.scene.addObject(this._myArrowRootObject);

        this._myArrowMeshComponent = this._myArrowObject.addComponent('mesh');
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.VisualArrowParams();
        clonedParams.myStart.vec3_copy(this._myParams.myStart);
        clonedParams.myDirection.vec3_copy(this._myParams.myDirection);
        clonedParams.myLength = this._myParams.myLength;
        clonedParams.myThickness = this._myParams.myThickness;

        clonedParams.myArrowMesh = this._myParams.myArrowMesh;
        clonedParams.myLineMesh = this._myParams.myLineMesh;

        if (this._myParams.myMaterial != null) {
            clonedParams.myMaterial = this._myParams.myMaterial.clone();
        } else {
            clonedParams.myMaterial = null;
        }

        if (this._myParams.myColor != null) {
            clonedParams.myColor.vec4_copy(this._myParams.myColor);
        } else {
            clonedParams.myColor = null;
        }

        clonedParams.myParent = this._myParams.myParent;

        let clone = new PP.VisualArrow(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};

PP.VisualArrow.prototype._refresh = function () {
    let end = PP.vec3_create();
    let translateRoot = PP.vec3_create();
    let scaleArrow = PP.vec3_create();
    let direction = PP.vec3_create();

    let forward = PP.vec3_create(0, 1, 0);
    return function _refresh() {
        this._myArrowRootObject.pp_setParent(this._myParams.myParent == null ? PP.myVisualData.myRootObject : this._myParams.myParent, false);

        this._myParams.myDirection.vec3_scale(Math.max(0.001, this._myParams.myLength - this._myParams.myThickness * 4), end);
        end.vec3_add(this._myParams.myStart, end);

        this._myArrowRootObject.pp_setPositionLocal(end);
        this._myArrowRootObject.pp_setUpLocal(this._myParams.myDirection, forward);

        translateRoot.vec3_set(0, this._myParams.myThickness * 2 - 0.00001, 0);
        this._myArrowRootObject.pp_translateObject(translateRoot);

        this._myArrowObject.pp_resetScaleLocal();
        scaleArrow.vec3_set(this._myParams.myThickness * 1.25, this._myParams.myThickness * 2, this._myParams.myThickness * 1.25);
        this._myArrowObject.pp_scaleObject(scaleArrow);

        if (this._myParams.myArrowMesh != null) {
            this._myArrowMeshComponent.mesh = this._myParams.myArrowMesh;
        } else {
            this._myArrowMeshComponent.mesh = PP.myDefaultResources.myMeshes.myCone;
        }

        if (this._myParams.myMaterial == null) {
            if (this._myParams.myColor == null) {
                this._myArrowMeshComponent.material = PP.myVisualData.myDefaultMaterials.myDefaultMeshMaterial;
            } else {
                if (this._myFlatOpaqueMaterial == null) {
                    this._myFlatOpaqueMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
                }
                this._myArrowMeshComponent.material = this._myFlatOpaqueMaterial;
                this._myFlatOpaqueMaterial.color = this._myParams.myColor;
            }
        } else {
            this._myArrowMeshComponent.material = this._myParams.myMaterial;
        }

        direction = end.vec3_sub(this._myParams.myStart, direction);
        let visualLineParams = this._myVisualLine.getParams();
        visualLineParams.myStart.vec3_copy(this._myParams.myStart);
        visualLineParams.myDirection = direction.vec3_normalize(visualLineParams.myDirection);
        visualLineParams.myLength = direction.vec3_length();
        visualLineParams.myThickness = this._myParams.myThickness;
        visualLineParams.myMesh = this._myParams.myLineMesh;

        visualLineParams.myMaterial = this._myArrowMeshComponent.material;

        visualLineParams.myParent = this._myParams.myParent;

        this._myVisualLine.paramsUpdated();
    };
}();



Object.defineProperty(PP.VisualArrow.prototype, "_refresh", { enumerable: false });
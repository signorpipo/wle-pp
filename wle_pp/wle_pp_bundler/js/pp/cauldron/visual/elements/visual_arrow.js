/*
let visualParams = new PP.VisualArrowParams();
visualParams.myStart.vec3_copy(start);
visualParams.myDirection.vec3_copy(direction);
visualParams.myLength = 0.2;
visualParams.myMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = PP.vec4_create(1, 1, 1, 1);
PP.myVisualManager.draw(visualParams);

or

let visualArrow = new PP.VisualArrow(visualParams);
*/

PP.VisualArrowParams = class VisualArrowParams {
    constructor() {
        this.myStart = PP.vec3_create();
        this.myDirection = PP.vec3_create(0, 0, 1);
        this.myLength = 0;

        this.myThickness = 0.005;

        this.myLineMesh = null;     // the mesh is scaled along up axis, null means it will default on PP.myDefaultResources.myMeshes.myCylinder
        this.myArrowMesh = null;    // the mesh is scaled along up axis, null means it will default on PP.myDefaultResources.myMeshes.myCone

        this.myMaterial = null;     // null means it will default on PP.myDefaultResources.myMaterials.myFlatOpaque
        this.myColor = null;        // if this is set and material is null, it will use the default flat opaque material with this color

        this.myParent = PP.myVisualData.myRootObject;
        this.myIsLocal = false;

        this.myType = PP.VisualElementType.ARROW;
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
        clonedParams.copy(this._myParams);

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
        this._myArrowRootObject.pp_setParent(this._myParams.myParent, false);

        this._myParams.myDirection.vec3_scale(Math.max(0.001, this._myParams.myLength - this._myParams.myThickness * 4), end);
        end.vec3_add(this._myParams.myStart, end);

        if (this._myParams.myIsLocal) {
            this._myArrowRootObject.pp_setPositionLocal(end);
            this._myArrowRootObject.pp_setUpLocal(this._myParams.myDirection, forward);
        } else {
            this._myArrowRootObject.pp_setPosition(end);
            this._myArrowRootObject.pp_setUp(this._myParams.myDirection, forward);
        }

        translateRoot.vec3_set(0, this._myParams.myThickness * 2 - 0.00001, 0);
        this._myArrowRootObject.pp_translateObject(translateRoot);

        scaleArrow.vec3_set(this._myParams.myThickness * 1.25, this._myParams.myThickness * 2, this._myParams.myThickness * 1.25);
        if (this._myParams.myIsLocal) {
            this._myArrowObject.pp_setScaleLocal(scaleArrow);
        } else {
            this._myArrowObject.pp_setScale(scaleArrow);
        }

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
        visualLineParams.myIsLocal = this._myParams.myIsLocal;

        this._myVisualLine.paramsUpdated();
    };
}();

PP.VisualArrowParams.prototype.copy = function copy(other) {
    this.myStart.vec3_copy(other.myStart);
    this.myDirection.vec3_copy(other.myDirection);
    this.myLength = other.myLength;
    this.myThickness = other.myThickness;

    this.myArrowMesh = other.myArrowMesh;
    this.myLineMesh = other.myLineMesh;

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



Object.defineProperty(PP.VisualArrow.prototype, "_refresh", { enumerable: false });
Object.defineProperty(PP.VisualArrowParams.prototype, "copy", { enumerable: false });
PP.DebugPointParams = class DebugPointParams {

    constructor() {
        this.myPosition = [0, 0, 0];
        this.myRadius = 0;

        this.myColor = [0.7, 0.7, 0.7, 1];

        this.myType = PP.DebugDrawObjectType.POINT;
    }
};

PP.DebugPoint = class DebugPoint {

    constructor(params = new PP.DebugPointParams()) {
        this._myParams = params;

        this._myRootObject = null;

        this._myVisible = true;
        this._myDirty = false;
        this._myAutoRefresh = true;

        this._build();
        this._refresh();
        this.setVisible(false);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myRootObject.pp_setActive(visible);
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

    setPosition(position) {
        this._myParams.myPosition = position;

        this._markDirty();
    }

    setRadius(radius) {
        this._myParams.myRadius = radius;

        this._markDirty();
    }

    setColor(color) {
        this._myParams.myColor = color;

        this._markDirty();
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();

            this._myDirty = false;
        }
    }

    _refresh() {
        this._myRootObject.pp_setPosition(this._myParams.myPosition);
        this._myPointObject.pp_setScale(this._myParams.myRadius);
        this._myPointMesh.material.color = this._myParams.myColor;
    }

    _build() {
        this._myRootObject = WL.scene.addObject(PP.myDebugData.myRootObject);
        this._myPointObject = WL.scene.addObject(this._myRootObject);

        this._myPointMesh = this._myPointObject.addComponent('mesh');
        this._myPointMesh.mesh = PP.myDebugData.mySphereMesh;
        this._myPointMesh.material = PP.myDebugData.myFlatMaterial.clone();
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.DebugPointParams();
        clonedParams.myPosition.pp_copy(this._myParams.myPosition);
        clonedParams.myRadius = this._myParams.myRadius;
        clonedParams.myColor.pp_copy(this._myParams.myColor);

        let clone = new PP.DebugPoint(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};
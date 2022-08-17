PP.DebugLineParams = class DebugLineParams {

    constructor() {
        this.myStart = [0, 0, 0];
        this.myDirection = [0, 0, 1];
        this.myLength = 0;

        this.myThickness = 0.005;

        this.myColor = [0, 1, 0, 1];

        this.myType = PP.DebugDrawObjectType.LINE;
    }

    setStartEnd(start, end) {
        end.vec3_sub(start, this.myDirection);
        this.myLength = this.myDirection.vec3_length();
        this.myDirection.vec3_normalize(this.myDirection);
        this.myStart.vec3_copy(start);

        return this;
    }
};

PP.DebugLine = class DebugLine {

    constructor(params = new PP.DebugLineParams()) {
        this._myParams = params;
        this._myParams.myDirection.vec3_normalize(this._myParams.myDirection);

        this._myLineRootObject = null;

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
        this._myParams.myDirection.vec3_normalize(this._myParams.myDirection);
        this._markDirty();
    }

    setStartEnd(start, end) {
        this._myParams.setStartEnd(start, end);
        this._markDirty();
    }

    setStartDirectionLength(start, direction, length) {
        this._myParams.myStart.vec3_copy(start);
        this._myParams.myDirection.vec3_copy(direction);
        this._myParams.myDirection.vec3_normalize(this._myParams.myDirection);
        this._myParams.myLength = length;

        this._markDirty();
    }

    setColor(color) {
        this._myParams.myColor = color;

        this._markDirty();
    }

    setThickness(thickness) {
        this._myParams.myThickness = thickness;

        this._markDirty();
    }

    refresh() {
        this.update(0);
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();

            this._myDirty = false;
        }
    }

    _refresh() {
        this._myLineRootObject.pp_setPosition(this._myParams.myStart);

        this._myLineObject.pp_resetPositionLocal();
        this._myLineObject.pp_resetScaleLocal();

        this._myLineObject.pp_scaleObject([this._myParams.myThickness / 2, this._myParams.myThickness / 2, this._myParams.myLength / 2]);

        this._myLineObject.pp_lookTo(this._myParams.myDirection);
        this._myLineObject.pp_translateObject([0, 0, this._myParams.myLength / 2]);

        this._myLineMesh.material.color = this._myParams.myColor;
    }

    _build() {
        this._myLineRootObject = WL.scene.addObject(PP.myDebugData.myRootObject);
        this._myLineObject = WL.scene.addObject(this._myLineRootObject);

        this._myLineMesh = this._myLineObject.addComponent('mesh');
        this._myLineMesh.mesh = PP.myDebugData.myCubeMesh;
        this._myLineMesh.material = PP.myDebugData.myDebugMaterial.clone();
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.DebugLineParams();
        clonedParams.myStart.pp_copy(this._myParams.myStart);
        clonedParams.myDirection.pp_copy(this._myParams.myDirection);
        clonedParams.myLength = this._myParams.myLength;
        clonedParams.myThickness = this._myParams.myThickness;
        clonedParams.myColor.pp_copy(this._myParams.myColor);

        let clone = new PP.DebugLine(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};
PP.DebugTransformParams = class DebugTransformParams {

    constructor() {
        this.myTransform = PP.mat4_create();
        this.myLength = 0.1;
        this.myThickness = 0.005;
        this.myPositionOffset = PP.vec3_create();

        this.myType = PP.DebugDrawObjectType.TRANSFORM;
    }
};

PP.DebugTransform = class DebugTransform {

    constructor(params = new PP.DebugTransformParams()) {
        this._myParams = params;

        this._myDebugRight = new PP.DebugArrow();
        this._myDebugUp = new PP.DebugArrow();
        this._myDebugForward = new PP.DebugArrow();
        this._myDebugRight.setColor([1, 0, 0, 1]);
        this._myDebugUp.setColor([0, 1, 0, 1]);
        this._myDebugForward.setColor([0, 0, 1, 1]);

        this._myVisible = true;
        this._myDirty = false;
        this._myAutoRefresh = true;

        this._myDebugRight.setAutoRefresh(false);
        this._myDebugUp.setAutoRefresh(false);
        this._myDebugForward.setAutoRefresh(false);

        this._refresh();

        this.setVisible(false);
    }

    setVisible(visible) {
        this._myVisible = visible;
        this._myDebugRight.setVisible(visible);
        this._myDebugUp.setVisible(visible);
        this._myDebugForward.setVisible(visible);
    }

    setAutoRefresh(autoRefresh) {
        this._myAutoRefresh = autoRefresh;
        this._myDebugRight.setAutoRefresh(autoRefresh);
        this._myDebugUp.setAutoRefresh(autoRefresh);
        this._myDebugForward.setAutoRefresh(autoRefresh);
    }

    getParams() {
        return this._myParams;
    }

    setParams(params) {
        this._myParams = params;
        this._markDirty();
    }

    setTransform(transform) {
        if (transform.length == 8) {
            transform.quat2_toMatrix(this._myParams.myTransform);
        } else {
            this._myParams.myTransform.mat4_copy(transform);
        }

        this._markDirty();
    }

    setLength(length) {
        this._myParams.myLength = length;

        this._markDirty();
    }

    setThickness(thickness) {
        this._myParams.myThickness = thickness;

        this._markDirty();
    }

    setPositionOffset(offset) {
        this._myPositionOffset.vec3_copy(offset);

        this._markDirty();
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();
            this._myDirty = false;
        }

        this._myDebugForward.update(dt);
        this._myDebugUp.update(dt);
        this._myDebugRight.update(dt);
    }

    _refresh() {
        let axes = this._myParams.myTransform.mat4_getAxes();
        let scale = this._myParams.myTransform.mat4_getScale();
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

        let position = this._myParams.myTransform.mat4_getPosition();
        position.vec3_add(this._myParams.myPositionOffset, position);
        this._myDebugRight.setStartDirectionLength(position, axes[0].vec3_negate(), Math.max(this._myParams.myLength * scale[0], 0.001));
        this._myDebugUp.setStartDirectionLength(position, axes[1], Math.max(this._myParams.myLength * scale[1], 0.001));
        this._myDebugForward.setStartDirectionLength(position, axes[2], Math.max(this._myParams.myLength * scale[2], 0.001));

        this._myDebugRight.setThickness(this._myParams.myThickness);
        this._myDebugUp.setThickness(this._myParams.myThickness);
        this._myDebugForward.setThickness(this._myParams.myThickness);
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.DebugTransformParams();
        clonedParams.myTransform.pp_copy(this._myParams.myTransform);
        clonedParams.myPositionOffset.pp_copy(this._myParams.myPositionOffset);
        clonedParams.myLength = this._myParams.myLength;
        clonedParams.myThickness = this._myParams.myThickness;

        let clone = new PP.DebugTransform(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};
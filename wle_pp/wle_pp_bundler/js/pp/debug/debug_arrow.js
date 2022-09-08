/*
let debugParams = new PP.DebugArrowParams();
debugParams.myStart = start;
debugParams.myDirection = direction;
debugParams.myLength = 0.1;
debugParams.myColor = [0, 1, 0, 1];
PP.myDebugManager.draw(debugParams);
*/

PP.DebugArrowParams = class DebugArrowParams extends PP.DebugLineParams {
    constructor() {
        super();

        this.myType = PP.DebugDrawObjectType.ARROW;
    }
};

PP.DebugArrow = class DebugArrow {

    constructor(params = new PP.DebugArrowParams()) {
        this._myParams = params;
        this._myParams.myDirection.vec3_normalize(this._myParams.myDirection);

        this._myDebugLine = new PP.DebugLine();
        this._myDebugLine.setAutoRefresh(false);

        this._myArrowRootObject = null;

        this._myVisible = true;
        this._myDirty = false;
        this._myAutoRefresh = true;

        //SUPPORT VARIABLES
        this._myEnd = [0, 0, 0];

        this._build();
        this._refresh();
        this.setVisible(false);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myDebugLine.setVisible(visible);
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
        this._myParams.myColor.vec4_copy(color);

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

        this._myDebugLine.update(dt);
    }

    _refresh() {
        this._myParams.myDirection.vec3_scale(Math.max(0.001, this._myParams.myLength - this._myParams.myThickness * 4), this._myEnd);
        this._myEnd.vec3_add(this._myParams.myStart, this._myEnd);

        this._myArrowRootObject.pp_setPosition(this._myEnd);
        this._myArrowRootObject.pp_lookTo(this._myParams.myDirection);
        this._myArrowRootObject.pp_translateObject([0, 0, this._myParams.myThickness * 2 - 0.00001]);

        this._myArrowObject.pp_resetScaleLocal();
        this._myArrowObject.pp_scaleObject([this._myParams.myThickness * 1.25, this._myParams.myThickness * 2, this._myParams.myThickness * 1.25]);

        this._myArrowMesh.material.color = this._myParams.myColor;

        let direction = this._myEnd.vec3_sub(this._myParams.myStart);
        this._myDebugLine.setStartDirectionLength(this._myParams.myStart, direction.vec3_normalize(), direction.vec3_length());
        this._myDebugLine.setColor(this._myParams.myColor);
        this._myDebugLine.setThickness(this._myParams.myThickness);
    }

    _build() {
        this._myArrowRootObject = WL.scene.addObject(PP.myDebugData.myRootObject);

        this._myArrowPivotObject = WL.scene.addObject(this._myArrowRootObject);
        this._myArrowPivotObject.pp_rotate([90, 0, 0]);

        this._myArrowObject = WL.scene.addObject(this._myArrowPivotObject);
        this._myArrowObject.scale([0.01, 0.01, 0.01]);

        this._myArrowMesh = this._myArrowObject.addComponent('mesh');
        this._myArrowMesh.mesh = PP.myDefaultResources.myMeshes.myCone;
        this._myArrowMesh.material = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.DebugArrowParams();
        clonedParams.myStart.pp_copy(this._myParams.myStart);
        clonedParams.myDirection.pp_copy(this._myParams.myDirection);
        clonedParams.myLength = this._myParams.myLength;
        clonedParams.myThickness = this._myParams.myThickness;
        clonedParams.myColor.pp_copy(this._myParams.myColor);

        let clone = new PP.DebugArrow(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};
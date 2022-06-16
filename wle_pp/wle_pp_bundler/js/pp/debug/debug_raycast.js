PP.DebugRaycastParams = class DebugRaycastParams {

    constructor() {
        this.myOrigin = [0, 0, 0];
        this.myDirection = [0, 0, 1];
        this.myDistance = 0;

        this.myNormalLength = 0.1;

        this.myThickness = 0.005;

        this.myRaycastResult = null;

        this.myType = PP.DebugDrawObjectType.RAYCAST;
    }
};

PP.DebugRaycast = class DebugRaycast {

    constructor(params = new PP.DebugRaycastParams()) {
        this._myParams = params;

        this._myDebugRaycast = new PP.DebugArrow();
        this._myDebugRaycastHit = new PP.DebugArrow();
        this._myDebugRaycast.setColor([0, 1, 0, 1]);
        this._myDebugRaycastHit.setColor([1, 0, 0, 1]);

        this._myVisible = true;
        this._myDirty = false;
        this._myAutoRefresh = true;

        this._refresh();
        this.setVisible(false);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myDebugRaycast.setVisible(visible);
            if (this._myParams.myRaycastResult != null && this._myParams.myRaycastResult.hitCount > 0) {
                this._myDebugRaycastHit.setVisible(visible);
            } else {
                this._myDebugRaycastHit.setVisible(false);
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

    setRaycastSetup(origin, direction, distance) {
        this._myParams.myOrigin = origin;
        this._myParams.myDirection = direction;
        this._myParams.myDistance = distance;
        this._markDirty();
    }

    setRaycastResult(raycastResult) {
        this._myParams.myRaycastResult = raycastResult;

        this._markDirty();
    }

    setThickness(thickness) {
        this._myParams.myThickness = thickness;

        this._markDirty();
    }


    update(dt) {
        if (this._myDirty) {
            this._refresh();
            this._myDirty = false;
        }

        this._myDebugRaycast.update(dt);
        this._myDebugRaycastHit.update(dt);
    }

    _refresh() {
        this._myDebugRaycast.setStartDirectionLength(this._myParams.myOrigin, this._myParams.myDirection, this._myParams.myDistance);

        if (this._myParams.myRaycastResult != null && this._myParams.myRaycastResult.hitCount > 0) {
            this._myDebugRaycastHit.setStartDirectionLength(this._myParams.myRaycastResult.locations[0], this._myParams.myRaycastResult.normals[0], this._myParams.myNormalLength);
            this._myDebugRaycastHit.setVisible(this._myVisible);

            this._myDebugRaycast.setStartDirectionLength(this._myParams.myOrigin, this._myParams.myDirection, this._myParams.myRaycastResult.distances[0]);
        } else {
            this._myDebugRaycast.setStartDirectionLength(this._myParams.myOrigin, this._myParams.myDirection, this._myParams.myDistance);
            this._myDebugRaycastHit.setVisible(false);
        }

        this._myDebugRaycast.setThickness(this._myParams.myThickness);
        this._myDebugRaycastHit.setThickness(this._myParams.myThickness);
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.DebugRaycastParams();
        clonedParams.myOrigin.pp_copy(this._myParams.myOrigin);
        clonedParams.myDirection.pp_copy(this._myParams.myDirection);
        clonedParams.myDistance = this._myParams.myDistance;
        clonedParams.myNormalLength = this._myParams.myNormalLength;
        clonedParams.myThickness = this._myParams.myThickness;
        clonedParams.myRaycastResult = this._myParams.myRaycastResult;

        let clone = new PP.DebugRaycast(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};
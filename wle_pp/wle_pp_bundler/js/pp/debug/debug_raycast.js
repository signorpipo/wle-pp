PP.DebugRaycastParams = class DebugRaycastParams {

    constructor() {
        this._myRaycastResult = new PP.RaycastResult();

        this.myNormalLength = 0.1;
        this.myThickness = 0.005;

        this.myShowOnlyFirstHit = true;

        this.myType = PP.DebugDrawObjectType.RAYCAST;
    }

    get myRaycastResult() {
        return this._myRaycastResult;
    }

    set myRaycastResult(result) {
        this._myRaycastResult.copy(result);
    }
};

PP.DebugRaycast = class DebugRaycast {

    constructor(params = new PP.DebugRaycastParams()) {
        this._myParams = params;

        this._myDebugRaycast = new PP.DebugArrow();
        this._myDebugRaycast.setColor([0, 1, 0, 1]);
        this._myDebugRaycast.setAutoRefresh(false);

        this._myDebugRaycastHitList = [];
        this._addDebugRaycastHit();

        this._myVisible = true;
        this._myDirty = false;
        this._myAutoRefresh = true;

        this._refresh();
        this.setVisible(false);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            if (this._myParams.myRaycastResult.myRaycastSetup != null) {
                this._myDebugRaycast.setVisible(visible);
            } else {
                this._myDebugRaycast.setVisible(false);
            }

            if (this._myParams.myRaycastResult.myHits.length > 0) {
                for (let debugRaycastHit of this._myDebugRaycastHitList) {
                    debugRaycastHit.setVisible(visible);
                }
            } else {
                for (let debugRaycastHit of this._myDebugRaycastHitList) {
                    debugRaycastHit.setVisible(false);
                }
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

    setRaycastResult(raycastResult) {
        this._myParams.myRaycastResult = raycastResult;

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

        this._myDebugRaycast.update(dt);
        for (let debugRaycastHit of this._myDebugRaycastHitList) {
            debugRaycastHit.update(dt);
        }
    }

    _refresh() {
        for (let debugRaycastHit of this._myDebugRaycastHitList) {
            debugRaycastHit.setVisible(false);
        }

        if (this._myParams.myRaycastResult.myHits.length > 0) {
            let raycastDistance = this._myParams.myShowOnlyFirstHit ?
                this._myParams.myRaycastResult.myHits.pp_first().myDistance :
                this._myParams.myRaycastResult.myHits.pp_last().myDistance;

            this._myDebugRaycast.setStartDirectionLength(
                this._myParams.myRaycastResult.myRaycastSetup.myOrigin,
                this._myParams.myRaycastResult.myRaycastSetup.myDirection,
                raycastDistance);

            let hitsToShow = this._myParams.myShowOnlyFirstHit ? 1 : this._myParams.myRaycastResult.myHits.length;
            while (hitsToShow > this._myDebugRaycastHitList.length) {
                this._addDebugRaycastHit();
            }

            for (let i = 0; i < hitsToShow; i++) {
                let debugRaycastHit = this._myDebugRaycastHitList[i];
                debugRaycastHit.setStartDirectionLength(
                    this._myParams.myRaycastResult.myHits[i].myPosition,
                    this._myParams.myRaycastResult.myHits[i].myNormal,
                    this._myParams.myNormalLength);
                debugRaycastHit.setThickness(this._myParams.myThickness);
                debugRaycastHit.setVisible(this._myVisible);
            }

        } else if (this._myParams.myRaycastResult.myRaycastSetup != null) {
            this._myDebugRaycast.setStartDirectionLength(
                this._myParams.myRaycastResult.myRaycastSetup.myOrigin,
                this._myParams.myRaycastResult.myRaycastSetup.myDirection,
                this._myParams.myRaycastResult.myRaycastSetup.myDistance);
        } else {
            this._myDebugRaycast.setVisible(false);
        }

        this._myDebugRaycast.setThickness(this._myParams.myThickness);
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new PP.DebugRaycastParams();
        clonedParams.myRaycastResult = this._myParams.myRaycastResult;
        clonedParams.myNormalLength = this._myParams.myNormalLength;
        clonedParams.myThickness = this._myParams.myThickness;

        let clone = new PP.DebugRaycast(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }

    _addDebugRaycastHit() {
        let debugRaycastHit = new PP.DebugArrow();
        debugRaycastHit.setColor([1, 0, 0, 1]);
        debugRaycastHit.setAutoRefresh(false);

        this._myDebugRaycastHitList.push(debugRaycastHit);
    }
};
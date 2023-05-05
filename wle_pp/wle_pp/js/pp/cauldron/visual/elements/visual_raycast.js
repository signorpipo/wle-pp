/*
let visualParams = new VisualRaycastParams();
visualParams.myRaycastResults = raycastResults;
Globals.getVisualManager().draw(visualParams);

or

let visualRaycast = new VisualRaycast(visualParams);
*/

import { Globals } from "../../../pp/globals";
import { RaycastResults } from "../../physics/physics_raycast_params";
import { VisualArrow, VisualArrowParams } from "./visual_arrow";
import { VisualElementType } from "./visual_element_types";

export class VisualRaycastParams {

    constructor(engine = Globals.getMainEngine()) {
        this._myRaycastResults = new RaycastResults();

        this.myHitNormalLength = 0.2;
        this.myThickness = 0.005;

        this.myShowOnlyFirstHit = true;

        this.myRayMaterial = null;
        this.myHitNormalMaterial = null;

        this.myParent = Globals.getSceneObjects(engine).myVisualElements;
        this.myLocal = false;

        this.myType = VisualElementType.RAYCAST;
    }

    get myRaycastResults() {
        return this._myRaycastResults;
    }

    set myRaycastResults(result) {
        this._myRaycastResults.copy(result);
    }

    copy(other) {
        // Implemented outside class definition
    }
}

export class VisualRaycast {

    constructor(params = new VisualRaycastParams()) {
        this._myParams = params;

        this._myVisible = false;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._myVisualRaycast = new VisualArrow(new VisualArrowParams(this._myParams.myParent.pp_getEngine()));

        this._myVisualRaycast.setAutoRefresh(false);

        this._myVisualRaycastHitList = [];

        this._myDestroyed = false;

        this._addVisualRaycastHit();

        this.forceRefresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;

            if (this._myVisible) {
                if (this._myParams.myRaycastResults.myRaycastParams != null) {
                    this._myVisualRaycast.setVisible(true);
                }

                if (this._myParams.myRaycastResults.myHits.length > 0) {
                    let hitsToShow = Math.min(this._myParams.myRaycastResults.myHits.length, this._myVisualRaycastHitList.length);

                    for (let i = 0; i < hitsToShow; i++) {
                        let visualRaycastHit = this._myVisualRaycastHitList[i];
                        visualRaycastHit.setVisible(true);
                    }
                }
            } else {
                this._myVisualRaycast.setVisible(false);

                for (let visualRaycastHit of this._myVisualRaycastHitList) {
                    visualRaycastHit.setVisible(false);
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

        this._myVisualRaycast.forceRefresh();

        if (this._myParams.myRaycastResults.myHits.length > 0) {
            let hitsToRefresh = Math.min(this._myParams.myRaycastResults.myHits.length, this._myVisualRaycastHitList.length);

            for (let i = 0; i < hitsToRefresh; i++) {
                let visualRaycastHit = this._myVisualRaycastHitList[i];
                visualRaycastHit.forceRefresh();
            }
        }
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();
            this._myDirty = false;
        }

        this._myVisualRaycast.update(dt);
        for (let visualRaycastHit of this._myVisualRaycastHitList) {
            visualRaycastHit.update(dt);
        }
    }

    _refresh() {
        for (let visualRaycastHit of this._myVisualRaycastHitList) {
            visualRaycastHit.setVisible(false);
        }

        if (this._myParams.myRaycastResults.myHits.length > 0) {
            let raycastDistance = this._myParams.myShowOnlyFirstHit ?
                this._myParams.myRaycastResults.myHits.pp_first().myDistance :
                this._myParams.myRaycastResults.myHits.pp_last().myDistance;

            {
                let visualRaycastParams = this._myVisualRaycast.getParams();
                visualRaycastParams.myStart.vec3_copy(this._myParams.myRaycastResults.myRaycastParams.myOrigin);
                visualRaycastParams.myDirection.vec3_copy(this._myParams.myRaycastResults.myRaycastParams.myDirection);
                visualRaycastParams.myLength = raycastDistance;
                visualRaycastParams.myThickness = this._myParams.myThickness;

                if (this._myParams.myRayMaterial == null) {
                    visualRaycastParams.myMaterial = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myRay;
                } else {
                    visualRaycastParams.myMaterial = this._myParams.myRayMaterial;
                }

                visualRaycastParams.myParent = this._myParams.myParent;
                visualRaycastParams.myLocal = this._myParams.myLocal;

                this._myVisualRaycast.paramsUpdated();

                this._myVisualRaycast.setVisible(this._myVisible);
            }

            let hitsToShow = this._myParams.myShowOnlyFirstHit ? 1 : this._myParams.myRaycastResults.myHits.length;
            while (hitsToShow > this._myVisualRaycastHitList.length) {
                this._addVisualRaycastHit();
            }

            for (let i = 0; i < hitsToShow; i++) {
                let visualRaycastHit = this._myVisualRaycastHitList[i];

                {
                    let visualRaycastHitParams = visualRaycastHit.getParams();
                    visualRaycastHitParams.myStart.vec3_copy(this._myParams.myRaycastResults.myHits[i].myPosition);
                    visualRaycastHitParams.myDirection.vec3_copy(this._myParams.myRaycastResults.myHits[i].myNormal);
                    visualRaycastHitParams.myLength = this._myParams.myHitNormalLength;
                    visualRaycastHitParams.myThickness = this._myParams.myThickness;

                    if (this._myParams.myHitNormalMaterial == null) {
                        visualRaycastHitParams.myMaterial = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myHitNormal;
                    } else {
                        visualRaycastHitParams.myMaterial = this._myParams.myHitNormalMaterial;
                    }

                    visualRaycastHitParams.myParent = this._myParams.myParent;
                    visualRaycastHitParams.myLocal = this._myParams.myLocal;

                    visualRaycastHit.paramsUpdated();

                    visualRaycastHit.setVisible(this._myVisible);
                }
            }

        } else if (this._myParams.myRaycastResults.myRaycastParams != null) {
            {
                let visualRaycastParams = this._myVisualRaycast.getParams();
                visualRaycastParams.myStart.vec3_copy(this._myParams.myRaycastResults.myRaycastParams.myOrigin);
                visualRaycastParams.myDirection.vec3_copy(this._myParams.myRaycastResults.myRaycastParams.myDirection);
                visualRaycastParams.myLength = this._myParams.myRaycastResults.myRaycastParams.myDistance;
                visualRaycastParams.myThickness = this._myParams.myThickness;

                if (this._myParams.myRayMaterial == null) {
                    visualRaycastParams.myMaterial = Globals.getVisualResources(this._myParams.myParent.pp_getEngine()).myDefaultMaterials.myRay;
                } else {
                    visualRaycastParams.myMaterial = this._myParams.myRayMaterial;
                }

                visualRaycastParams.myParent = this._myParams.myParent;
                visualRaycastParams.myLocal = this._myParams.myLocal;

                this._myVisualRaycast.paramsUpdated();

                this._myVisualRaycast.setVisible(this._myVisible);
            }
        } else {
            this._myVisualRaycast.setVisible(false);
        }
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    clone() {
        let clonedParams = new VisualRaycastParams(this._myParams.myParent.pp_getEngine());
        clonedParams.copy(this._myParams);

        let clone = new VisualRaycast(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }

    _addVisualRaycastHit() {
        let visualRaycastHit = new VisualArrow(new VisualArrowParams(this._myParams.myParent.pp_getEngine()));

        visualRaycastHit.setAutoRefresh(false);
        visualRaycastHit.setVisible(false);

        this._myVisualRaycastHitList.push(visualRaycastHit);
    }

    destroy() {
        this._myDestroyed = true;

        this._myVisualRaycast.destroy();
        for (let visualRaycastHit of this._myVisualRaycastHitList) {
            visualRaycastHit.destroy();
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}



// IMPLEMENTATION

VisualRaycastParams.prototype.copy = function copy(other) {
    this.myRaycastResults = other.myRaycastResults;
    this.myHitNormalLength = other.myHitNormalLength;
    this.myThickness = other.myThickness;
    this.myShowOnlyFirstHit = other.myShowOnlyFirstHit;

    if (other.myRayMaterial != null) {
        this.myRayMaterial = other.myRayMaterial.clone();
    } else {
        this.myRayMaterial = null;
    }

    if (other.myHitNormalMaterial != null) {
        this.myHitNormalMaterial = other.myHitNormalMaterial.clone();
    } else {
        this.myHitNormalMaterial = null;
    }

    this.myParent = other.myParent;
    this.myLocal = other.myLocal;

    this.myType = other.myType;
};
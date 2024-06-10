import { Globals } from "../../../pp/globals.js";
import { RaycastResults } from "../../physics/physics_raycast_params.js";
import { VisualArrow, VisualArrowParams } from "./visual_arrow.js";
import { AbstractVisualElement, AbstractVisualElementParams } from "./visual_element.js";
import { VisualElementDefaultType } from "./visual_element_types.js";

export class VisualRaycastParams extends AbstractVisualElementParams {

    /**
     * TS type inference helper
     * 
     * @param {any} engine
     */
    constructor(engine = Globals.getMainEngine()) {
        super(engine);

        this._myRaycastResults = new RaycastResults();

        this.myHitNormalLength = 0.2;
        this.myThickness = 0.005;

        this.myShowOnlyFirstHit = true;

        this.myRayMaterial = null;
        this.myHitNormalMaterial = null;

        this.myLocal = false;

        this.myType = VisualElementDefaultType.RAYCAST;
    }

    get myRaycastResults() {
        return this._myRaycastResults;
    }

    set myRaycastResults(result) {
        this._myRaycastResults.copy(result);
    }

    _copyHook(other) {
        // Implemented outside class definition
    }

    _new() {
        return new VisualRaycastParams();
    }
}

/**
 * Example:
 * 
 * ```js  
 * const visualParams = new VisualRaycastParams();
 * visualParams.myRaycastResults = raycastResults;
 * const visualRaycast = new VisualRaycast(visualParams);
 * 
 * // OR
 * 
 * Globals.getVisualManager().draw(visualParams);
 * ```
*/
export class VisualRaycast extends AbstractVisualElement {

    constructor(params = new VisualRaycastParams()) {
        super(params);

        this._myVisualRaycast = new VisualArrow(new VisualArrowParams(this._myParams.myParent.pp_getEngine()));

        this._myVisualRaycast.setAutoRefresh(false);

        this._myVisualRaycastHitList = [];

        this._addVisualRaycastHit();

        this._prepare();
    }

    _updateHook(dt) {
        this._myVisualRaycast.update(dt);
        for (let visualRaycastHit of this._myVisualRaycastHitList) {
            visualRaycastHit.update(dt);
        }
    }

    _visibleChanged() {
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

    _build() {

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


    _forceRefreshHook() {
        this._myVisualRaycast.forceRefresh();

        if (this._myParams.myRaycastResults.myHits.length > 0) {
            let hitsToRefresh = Math.min(this._myParams.myRaycastResults.myHits.length, this._myVisualRaycastHitList.length);

            for (let i = 0; i < hitsToRefresh; i++) {
                let visualRaycastHit = this._myVisualRaycastHitList[i];
                visualRaycastHit.forceRefresh();
            }
        }
    }

    _new(params) {
        return new VisualRaycast(params);
    }

    _addVisualRaycastHit() {
        let visualRaycastHit = new VisualArrow(new VisualArrowParams(this._myParams.myParent.pp_getEngine()));

        visualRaycastHit.setAutoRefresh(false);
        visualRaycastHit.setVisible(false);

        this._myVisualRaycastHitList.push(visualRaycastHit);
    }

    _destroyHook() {
        this._myVisualRaycast.destroy();
        for (let visualRaycastHit of this._myVisualRaycastHitList) {
            visualRaycastHit.destroy();
        }
    }
}



// IMPLEMENTATION

VisualRaycastParams.prototype._copyHook = function _copyHook(other) {
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
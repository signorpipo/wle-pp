/*
let raycastSetup = new PP.RaycastSetup();

raycastSetup.myOrigin.vec3_copy(origin);
raycastSetup.myDirection.vec3_copy(direction);
raycastSetup.myDistance = distance;
raycastSetup.myBlockLayerFlags.setMask(flags);
raycastSetup.myObjectsToIgnore.pp_clear();
raycastSetup.myIgnoreHitsInsideCollision = false;

let raycastResults = PP.PhysicsUtils.raycast(raycastSetup);
*/

PP.RaycastSetup = class RaycastSetup {
    constructor() {
        this.myOrigin = PP.vec3_create();
        this.myDirection = PP.vec3_create();
        this.myDistance = 0;

        this.myBlockLayerFlags = new PP.PhysicsLayerFlags();

        this.myObjectsToIgnore = [];
        this.myIgnoreHitsInsideCollision = false;
    }

    copy(setup) {
        this.myOrigin.vec3_copy(setup.myOrigin);
        this.myDirection.vec3_copy(setup.myDirection);
        this.myDistance = setup.myDistance;

        this.myBlockLayerFlags.copy(setup.myBlockLayerFlags);

        this.myObjectsToIgnore.pp_copy(setup.myObjectsToIgnore);
        this.myIgnoreHitsInsideCollision = setup.myIgnoreHitsInsideCollision;
    }

    reset() {
        this.myOrigin.vec3_zero();
        this.myDirection.vec3_zero();
        this.myDistance = 0;

        this.myBlockLayerFlags.setAllFlagsActive(false);

        this.myObjectsToIgnore.pp_clear();
        this.myIgnoreHitsInsideCollision = false;
    }
};

PP.RaycastResults = class RaycastResult {
    constructor() {
        this.myRaycastSetup = null;
        this.myHits = [];

        this._myUnusedHits = null;
    }

    isColliding(ignoreHitsInsideCollision = false) {
        return ignoreHitsInsideCollision ? this.getFirstHitOutsideCollision() != null : this.myHits.length > 0;
    }

    getFirstHitInsideCollision() {
        let firstHit = null;

        for (let hit of this.myHits) {
            if (hit.myIsInsideCollision) {
                firstHit = hit;
                break;
            }
        }

        return firstHit;
    }

    getFirstHitOutsideCollision() {
        let firstHit = null;

        for (let hit of this.myHits) {
            if (!hit.myIsInsideCollision) {
                firstHit = hit;
                break;
            }
        }

        return firstHit;
    }

    getHitsInsideCollision() {
        let hits = [];

        for (let hit of this.myHits) {
            if (hit.myIsInsideCollision) {
                hits.push(hit);
            }
        }

        return hits;
    }

    getHitsOutsideCollision() {
        let hits = [];

        for (let hit of this.myHits) {
            if (!hit.myIsInsideCollision) {
                hits.push(hit);
            }
        }

        return hits;
    }

    removeHit(hitIndex) {
        let removedHit = this.myHits.pp_removeIndex(hitIndex);

        if (removedHit != null) {
            if (this._myUnusedHits == null) {
                this._myUnusedHits = [];
            }

            this._myUnusedHits.push(removedHit);
        }

        return removedHit;
    }

    removeAllHits() {
        if (this._myUnusedHits == null) {
            this._myUnusedHits = [];
        }

        this._myUnusedHits.push(...this.myHits);

        this.myHits.pp_clear();
    }

    copy(result) {
        // implemented outside class definition
    }

    reset() {
        if (this.myRaycastSetup != null) {
            this.myRaycastSetup.reset();
        }

        this.removeAllHits();
    }
};

PP.RaycastHit = class RaycastHit {
    constructor() {
        this.myPosition = PP.vec3_create();
        this.myNormal = PP.vec3_create();
        this.myDistance = 0;
        this.myObject = null;

        this.myIsInsideCollision = false;
    }

    isValid() {
        return this.myObject != null;
    }

    copy(hit) {
        this.myPosition.vec3_copy(hit.myPosition);
        this.myNormal.vec3_copy(hit.myNormal);
        this.myDistance = hit.myDistance;
        this.myObject = hit.myObject;
        this.myIsInsideCollision = hit.myIsInsideCollision;
    }

    reset() {
        this.myPosition.vec3_zero();
        this.myNormal.vec3_zero();
        this.myDistance = 0;
        this.myObject = null;
        this.myIsInsideCollision = false;
    }
};



// IMPLEMENTATION

PP.RaycastResults.prototype.copy = function () {
    let copyHitCallback = function (currentElement, elementToCopy) {
        if (currentElement == null) {
            currentElement = new PP.RaycastHit();
        }

        currentElement.copy(elementToCopy);

        return currentElement;
    };

    return function copy(result) {
        if (result.myRaycastSetup == null) {
            this.myRaycastSetup = null;
        } else {
            if (this.myRaycastSetup == null) {
                this.myRaycastSetup = new PP.RaycastSetup();
            }

            this.myRaycastSetup.copy(result.myRaycastSetup);
        }

        if (this.myHits.length > result.myHits.length) {
            if (this._myUnusedHits == null) {
                this._myUnusedHits = [];
            }

            for (let i = 0; i < this.myHits.length - result.myHits.length; i++) {
                this._myUnusedHits.push(this.myHits.pop());
            }
        } else if (this.myHits.length < result.myHits.length) {
            if (this._myUnusedHits != null) {
                let length = Math.min(this._myUnusedHits.length, result.myHits.length - this.myHits.length);

                for (let i = 0; i < length; i++) {
                    this.myHits.push(this._myUnusedHits.pop());
                }
            }
        }

        this.myHits.pp_copy(result.myHits, copyHitCallback);
    };
}();



Object.defineProperty(PP.RaycastResults.prototype, "copy", { enumerable: false });
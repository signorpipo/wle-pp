/*
let raycastParams = new RaycastParams();

raycastParams.myOrigin.vec3_copy(origin);
raycastParams.myDirection.vec3_copy(direction);
raycastParams.myDistance = distance;
raycastParams.myBlockLayerFlags.setMask(flags);
raycastParams.myObjectsToIgnore.pp_clear();
raycastParams.myIgnoreHitsInsideCollision = false;

let raycastResults = PhysicsUtils.raycast(raycastParams);
*/

import { vec3_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../pp/globals.js";
import { PhysicsLayerFlags } from "./physics_layer_flags.js";

export class RaycastParams {

    constructor(physics = Globals.getPhysics()) {
        this.myOrigin = vec3_create();
        this.myDirection = vec3_create();
        this.myDistance = 0;

        this.myBlockLayerFlags = new PhysicsLayerFlags();

        this.myObjectsToIgnore = [];
        this.myIgnoreHitsInsideCollision = false;

        this.myPhysics = physics;
    }

    copy(other) {
        this.myOrigin.vec3_copy(other.myOrigin);
        this.myDirection.vec3_copy(other.myDirection);
        this.myDistance = other.myDistance;

        this.myBlockLayerFlags.copy(other.myBlockLayerFlags);

        this.myObjectsToIgnore.pp_copy(other.myObjectsToIgnore);
        this.myIgnoreHitsInsideCollision = other.myIgnoreHitsInsideCollision;

        this.myPhysics = other.myPhysics;
    }

    reset() {
        this.myOrigin.vec3_zero();
        this.myDirection.vec3_zero();
        this.myDistance = 0;

        this.myBlockLayerFlags.setAllFlagsActive(false);

        this.myObjectsToIgnore.pp_clear();
        this.myIgnoreHitsInsideCollision = false;
    }
}

export class RaycastResults {

    constructor() {
        this.myRaycastParams = null;
        this.myHits = [];

        this._myUnusedHits = null;
    }

    isColliding(ignoreHitsInsideCollision = false) {
        return ignoreHitsInsideCollision ? this.getFirstHitOutsideCollision() != null : this.myHits.length > 0;
    }

    getFirstHitInsideCollision() {
        let firstHit = null;

        for (let i = 0; i < this.myHits.length; i++) {
            let hit = this.myHits[i];
            if (hit.myInsideCollision) {
                firstHit = hit;
                break;
            }
        }

        return firstHit;
    }

    getFirstHitOutsideCollision() {
        let firstHit = null;

        for (let i = 0; i < this.myHits.length; i++) {
            let hit = this.myHits[i];
            if (!hit.myInsideCollision) {
                firstHit = hit;
                break;
            }
        }

        return firstHit;
    }

    getHitsInsideCollision() {
        let hits = [];

        for (let i = 0; i < this.myHits.length; i++) {
            let hit = this.myHits[i];
            if (hit.myInsideCollision) {
                hits.push(hit);
            }
        }

        return hits;
    }

    getHitsOutsideCollision() {
        let hits = [];

        for (let i = 0; i < this.myHits.length; i++) {
            let hit = this.myHits[i];
            if (!hit.myInsideCollision) {
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

        for (let i = 0; i < this.myHits.length; i++) {
            this._myUnusedHits.push(this.myHits[i]);
        }

        this.myHits.pp_clear();
    }

    copy(other) {
        // Implemented outside class definition
    }

    reset() {
        if (this.myRaycastParams != null) {
            this.myRaycastParams.reset();
        }

        this.removeAllHits();
    }
}

export class RaycastHit {

    constructor() {
        this.myPosition = vec3_create();
        this.myNormal = vec3_create();
        this.myDistance = 0;
        this.myObject = null;

        this.myInsideCollision = false;
    }

    isValid() {
        return this.myObject != null;
    }

    copy(other) {
        this.myPosition.vec3_copy(other.myPosition);
        this.myNormal.vec3_copy(other.myNormal);
        this.myDistance = other.myDistance;
        this.myObject = other.myObject;
        this.myInsideCollision = other.myInsideCollision;
    }

    reset() {
        this.myPosition.vec3_zero();
        this.myNormal.vec3_zero();
        this.myDistance = 0;
        this.myObject = null;
        this.myInsideCollision = false;
    }
}



// IMPLEMENTATION

RaycastResults.prototype.copy = function () {
    let copyHitCallback = function (elementToCopy, currentElement) {
        if (currentElement == null) {
            currentElement = new RaycastHit();
        }

        currentElement.copy(elementToCopy);

        return currentElement;
    };

    return function copy(other) {
        if (other.myRaycastParams == null) {
            this.myRaycastParams = null;
        } else {
            if (this.myRaycastParams == null) {
                this.myRaycastParams = new RaycastParams(other.myRaycastParams.myPhysics);
            }

            this.myRaycastParams.copy(other.myRaycastParams);
        }

        if (this.myHits.length > other.myHits.length) {
            if (this._myUnusedHits == null) {
                this._myUnusedHits = [];
            }

            for (let i = 0; i < this.myHits.length - other.myHits.length; i++) {
                this._myUnusedHits.push(this.myHits.pop());
            }
        } else if (this.myHits.length < other.myHits.length) {
            if (this._myUnusedHits != null) {
                let length = Math.min(this._myUnusedHits.length, other.myHits.length - this.myHits.length);

                for (let i = 0; i < length; i++) {
                    this.myHits.push(this._myUnusedHits.pop());
                }
            }
        }

        this.myHits.pp_copy(other.myHits, copyHitCallback);
    };
}();
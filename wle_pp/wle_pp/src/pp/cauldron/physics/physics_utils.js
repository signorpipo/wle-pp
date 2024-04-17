import { vec3_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../pp/globals.js";
import { RaycastHit, RaycastParams, RaycastResults } from "./physics_raycast_params.js";

let _myLayerFlagsNames = ["0", "1", "2", "3", "4", "5", "6", "7"];

let _myRaycastCount = new WeakMap();
let _myRaycastVisualDebugEnabled = new WeakMap();

export function setLayerFlagsNames(layerFlagsNames) {
    _myLayerFlagsNames = layerFlagsNames;
}

export function getLayerFlagsNames() {
    return _myLayerFlagsNames;
}

export function getRaycastCount(physics = Globals.getPhysics()) {
    let raycastCount = _myRaycastCount.get(physics);
    return raycastCount != null ? raycastCount : 0;
}

export function resetRaycastCount(physics = Globals.getPhysics()) {
    _myRaycastCount.set(physics, 0);
}

export function isRaycastVisualDebugEnabled(physics = Globals.getPhysics()) {
    return _myRaycastVisualDebugEnabled.get(physics);
}

export function setRaycastVisualDebugEnabled(visualDebugEnabled, physics = Globals.getPhysics()) {
    _myRaycastVisualDebugEnabled.set(physics, visualDebugEnabled);
}

export let raycast = function () {
    // These initializations assume that there can't be more than @maxHitCount hits within a single rayCast call
    // if the hitCount is greater, these arrays will be allocated again
    let maxHitCount = 20;
    let objects = new Array(maxHitCount);
    let distances = new Float32Array(maxHitCount);
    let locations = Array.from({ length: maxHitCount }, () => new Float32Array(3));
    let normals = Array.from({ length: maxHitCount }, () => new Float32Array(3));

    let insideCheckSubVector = vec3_create();
    let invertedRaycastDirection = vec3_create();
    let objectsEqualCallback = (first, second) => first.pp_equals(second);
    return function raycast(raycastParams, raycastResults = new RaycastResults()) {
        let internalRaycastResults = raycastParams.myPhysics.rayCast(raycastParams.myOrigin, raycastParams.myDirection, raycastParams.myBlockLayerFlags.getMask(), raycastParams.myDistance);

        if (raycastResults.myRaycastParams == null) {
            raycastResults.myRaycastParams = new RaycastParams(raycastParams.myPhysics);
        }

        raycastResults.myRaycastParams.copy(raycastParams);

        let currentValidHitIndex = 0;
        let validHitsCount = 0;

        let hitCount = internalRaycastResults.hitCount;
        if (hitCount != 0) {
            if (hitCount > maxHitCount) {
                console.warn("Raycast hitcount is more than the expected one: " + hitCount + " - Allocation of needed resources performed");

                maxHitCount = Math.ceil(hitCount + hitCount * 0.5);
                objects = new Array(maxHitCount);
                distances = new Float32Array(maxHitCount);
                locations = Array.from({ length: maxHitCount }, () => new Float32Array(3));
                normals = Array.from({ length: maxHitCount }, () => new Float32Array(3));
            }

            let objectsAlreadyGet = false;
            let distancesAlreadyGet = false;
            let locationsAlreadyGet = false;
            let normalsAlreadyGet = false;

            invertedRaycastDirection = raycastParams.myDirection.vec3_negate(invertedRaycastDirection);

            for (let i = 0; i < hitCount; i++) {
                if (raycastParams.myObjectsToIgnore.length != 0) {
                    if (!objectsAlreadyGet) {
                        objectsAlreadyGet = true;
                        internalRaycastResults.pp_getObjects(objects);
                    }

                    if (raycastParams.myObjectsToIgnore.pp_hasEqual(objects[i], objectsEqualCallback)) {
                        continue;
                    }
                }

                if (!distancesAlreadyGet) {
                    distancesAlreadyGet = true;
                    internalRaycastResults.pp_getDistances(distances);
                }

                let hitInsideCollision = distances[i] == 0;
                if (hitInsideCollision) {
                    if (!locationsAlreadyGet) {
                        locationsAlreadyGet = true;
                        internalRaycastResults.pp_getLocations(locations);
                    }

                    hitInsideCollision &&= raycastParams.myOrigin.vec3_sub(locations[i], insideCheckSubVector).vec3_isZero(Math.PP_EPSILON);

                    if (hitInsideCollision) {
                        if (!normalsAlreadyGet) {
                            normalsAlreadyGet = true;
                            internalRaycastResults.pp_getNormals(normals);
                        }

                        hitInsideCollision &&= invertedRaycastDirection.vec3_equals(normals[i], Math.PP_EPSILON_DEGREES);
                    }
                }

                if (!raycastParams.myIgnoreHitsInsideCollision || !hitInsideCollision) {
                    let hit = null;

                    if (currentValidHitIndex < raycastResults.myHits.length) {
                        hit = raycastResults.myHits[currentValidHitIndex];
                    } else if (raycastResults._myUnusedHits != null && raycastResults._myUnusedHits.length > 0) {
                        hit = raycastResults._myUnusedHits.pop();
                        raycastResults.myHits.push(hit);
                    } else {
                        hit = new RaycastHit();
                        raycastResults.myHits.push(hit);
                    }

                    if (!objectsAlreadyGet) {
                        objectsAlreadyGet = true;
                        internalRaycastResults.pp_getObjects(objects);
                    }

                    if (!locationsAlreadyGet) {
                        locationsAlreadyGet = true;
                        internalRaycastResults.pp_getLocations(locations);
                    }

                    if (!normalsAlreadyGet) {
                        normalsAlreadyGet = true;
                        internalRaycastResults.pp_getNormals(normals);
                    }

                    hit.myPosition.vec3_copy(locations[i]);
                    hit.myNormal.vec3_copy(normals[i]);
                    hit.myDistance = distances[i];
                    hit.myObject = objects[i];
                    hit.myInsideCollision = hitInsideCollision;

                    validHitsCount++;
                    currentValidHitIndex++;
                }
            }
        }

        if (raycastResults.myHits.length > validHitsCount) {
            if (raycastResults._myUnusedHits == null) {
                raycastResults._myUnusedHits = [];
            }

            let hitsToRemove = raycastResults.myHits.length - validHitsCount;
            for (let i = 0; i < hitsToRemove; i++) {
                raycastResults._myUnusedHits.push(raycastResults.myHits.pop());
            }
        }

        if (Globals.isDebugEnabled(raycastParams.myPhysics.pp_getEngine())) {
            if (PhysicsUtils.isRaycastVisualDebugEnabled(raycastParams.myPhysics)) {
                Globals.getDebugVisualManager(raycastParams.myPhysics.pp_getEngine()).drawRaycast(0, raycastResults);
            }

            _increaseRaycastCount(raycastParams.myPhysics);
        }

        return raycastResults;
    };
}();

export let PhysicsUtils = {
    setLayerFlagsNames,
    getLayerFlagsNames,
    getRaycastCount,
    resetRaycastCount,
    isRaycastVisualDebugEnabled,
    setRaycastVisualDebugEnabled,
    raycast
};



function _increaseRaycastCount(physics = Globals.getPhysics()) {
    let raycastCount = _myRaycastCount.get(physics);

    if (raycastCount == null) {
        _myRaycastCount.set(physics, 1);
    } else {
        _myRaycastCount.set(physics, raycastCount + 1);
    }
}
import { vec3_create } from "../../plugin/js/extensions/array_extension";
import { RaycastHit, RaycastParams, RaycastResults } from "./physics_raycast_params";

let _myLayerFlagsNames = ["0", "1", "2", "3", "4", "5", "6", "7"];

export function setLayerFlagsNames(layerFlagsNames) {
    _myLayerFlagsNames = layerFlagsNames;
}

export function getLayerFlagsNames() {
    return _myLayerFlagsNames;
}

export let raycast = function () {
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
            let objects = null;
            let distances = null;
            let locations = null;
            let normals = null;

            invertedRaycastDirection = raycastParams.myDirection.vec3_negate(invertedRaycastDirection);

            for (let i = 0; i < hitCount; i++) {
                if (raycastParams.myObjectsToIgnore.length != 0) {
                    if (objects == null) {
                        objects = internalRaycastResults.objects;
                    }

                    if (raycastParams.myObjectsToIgnore.pp_hasEqual(objects[i], objectsEqualCallback)) {
                        continue;
                    }
                }

                if (distances == null) {
                    distances = internalRaycastResults.distances;
                }

                let hitInsideCollision = distances[i] == 0;
                if (hitInsideCollision) {
                    if (locations == null) {
                        locations = internalRaycastResults.locations;
                    }

                    hitInsideCollision &&= raycastParams.myOrigin.vec3_sub(locations[i], insideCheckSubVector).vec3_isZero(Math.PP_EPSILON);

                    if (hitInsideCollision) {
                        if (!normals) {
                            normals = internalRaycastResults.normals;
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

                    if (objects == null) {
                        objects = internalRaycastResults.objects;
                    }

                    if (locations == null) {
                        locations = internalRaycastResults.locations;
                    }

                    if (normals == null) {
                        normals = internalRaycastResults.normals;
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

        return raycastResults;
    };
}();

export let PhysicsUtils = {
    setLayerFlagsNames,
    getLayerFlagsNames,
    raycast
};
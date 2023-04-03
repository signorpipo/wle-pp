import { vec3_create } from "../../plugin/js/extensions/array_extension";
import { RaycastHit, RaycastResults, RaycastSetup } from "./physics_raycast_data";

let _myLayerFlagsNames = ["0", "1", "2", "3", "4", "5", "6", "7"];

export function setLayerFlagsNames(layerFlagsNames) {
    _myLayerFlagsNames = layerFlagsNames;
}

export function getLayerFlagsNames() {
    return _myLayerFlagsNames;
}

export let raycast = function () {
    let isInsideSubVector = vec3_create();
    let invertedRaycastDirection = vec3_create();
    let objectsEqualCallback = (first, second) => first.pp_equals(second);
    return function raycast(raycastSetup, raycastResults = new RaycastResults()) {
        let internalRaycastResults = raycastSetup.myPhysics.rayCast(raycastSetup.myOrigin, raycastSetup.myDirection, raycastSetup.myBlockLayerFlags.getMask(), raycastSetup.myDistance);

        if (raycastResults.myRaycastSetup == null) {
            raycastResults.myRaycastSetup = new RaycastSetup(raycastSetup.myPhysics);
        }

        raycastResults.myRaycastSetup.copy(raycastSetup);

        let currentValidHitIndex = 0;
        let validHitsCount = 0;

        let hitCount = internalRaycastResults.hitCount;
        if (hitCount != 0) {
            let objects = null;
            let distances = null;
            let locations = null;
            let normals = null;

            invertedRaycastDirection = raycastSetup.myDirection.vec3_negate(invertedRaycastDirection);

            for (let i = 0; i < hitCount; i++) {
                if (raycastSetup.myObjectsToIgnore.length != 0) {
                    if (objects == null) {
                        objects = internalRaycastResults.objects;
                    }

                    if (raycastSetup.myObjectsToIgnore.pp_hasEqual(objects[i], objectsEqualCallback)) {
                        continue;
                    }
                }

                if (distances == null) {
                    distances = internalRaycastResults.distances;
                }

                let isHitInsideCollision = distances[i] == 0;
                if (isHitInsideCollision) {
                    if (locations == null) {
                        locations = internalRaycastResults.locations;
                    }

                    isHitInsideCollision &&= raycastSetup.myOrigin.vec3_sub(locations[i], isInsideSubVector).vec3_isZero(Math.PP_EPSILON);

                    if (isHitInsideCollision) {
                        if (!normals) {
                            normals = internalRaycastResults.normals;
                        }

                        isHitInsideCollision &&= invertedRaycastDirection.vec3_equals(normals[i], Math.PP_EPSILON_DEGREES);
                    }
                }

                if (!raycastSetup.myIgnoreHitsInsideCollision || !isHitInsideCollision) {
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
                    hit.myIsInsideCollision = isHitInsideCollision;

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
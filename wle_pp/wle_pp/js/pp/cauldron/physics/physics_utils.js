PP.PhysicsUtils = {
    _myLayerFlagsAmount: 8,
    _myLayerFlagsNames: ["0", "1", "2", "3", "4", "5", "6", "7"],
    setLayerFlagsAmount: function (layerFlagsAmount) {
        PP.PhysicsUtils._myLayerFlagsAmount = layerFlagsAmount;
    },
    setLayerFlagsNames: function (layerFlagsNames) {
        PP.PhysicsUtils._myLayerFlagsNames = layerFlagsNames;
    },
    getLayerFlagsAmount: function () {
        return PP.PhysicsUtils._myLayerFlagsAmount;
    },
    getLayerFlagsNames: function () {
        return PP.PhysicsUtils._myLayerFlagsNames;
    },
    raycast: function () {
        let isInsideSubVector = PP.vec3_create();
        let invertedRaycastDirection = PP.vec3_create();
        let objectsEqualCallback = (first, second) => first.pp_equals(second);
        return function raycast(raycastSetup, raycastResults = new PP.RaycastResults()) {
            let internalRaycastResults = WL.physics.rayCast(raycastSetup.myOrigin, raycastSetup.myDirection, raycastSetup.myBlockLayerFlags.getMask(), raycastSetup.myDistance);

            if (raycastResults.myRaycastSetup == null) {
                raycastResults.myRaycastSetup = new PP.RaycastSetup();
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

                        isHitInsideCollision &&= raycastSetup.myOrigin.vec3_sub(locations[i], isInsideSubVector).vec3_isZero(Math.PP_EPSILON_NUMBER);

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
                            hit = new PP.RaycastHit();
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
    }()
};
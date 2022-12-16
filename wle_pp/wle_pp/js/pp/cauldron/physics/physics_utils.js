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
        let objectsEqualCallback = (first, second) => first.pp_equals(second);
        return function raycast(raycastSetup, raycastResult = new PP.RaycastResult()) {
            let internalRaycastResult = WL.physics.rayCast(raycastSetup.myOrigin, raycastSetup.myDirection, raycastSetup.myBlockLayerFlags.getMask(), raycastSetup.myDistance);

            raycastResult.myRaycastSetup = raycastSetup;

            let currentValidHitIndex = 0;
            let validHitsCount = 0;

            for (let i = 0; i < internalRaycastResult.hitCount; i++) {
                let isHitValid = true;

                isHitValid = isHitValid &&
                    (raycastSetup.myObjectsToIgnore.length == 0 ||
                        !raycastSetup.myObjectsToIgnore.pp_hasEqual(internalRaycastResult.objects[i], objectsEqualCallback));

                let isHitInsideCollision = isHitValid &&
                    internalRaycastResult.distances[i] == 0 &&
                    (raycastSetup.myOrigin.vec3_distance(internalRaycastResult.locations[i]) < 0.00001 &&
                        Math.abs(raycastSetup.myDirection.vec3_angle(internalRaycastResult.normals[i]) - 180) < 0.00001);

                isHitValid = isHitValid && (!raycastSetup.myIgnoreHitsInsideCollision || !isHitInsideCollision);

                if (isHitValid) {
                    let hit = null;

                    if (currentValidHitIndex < raycastResult.myHits.length) {
                        hit = raycastResult.myHits[currentValidHitIndex];
                    } else if (raycastResult._myUnusedHits != null && raycastResult._myUnusedHits.length > 0) {
                        hit = raycastResult._myUnusedHits.pop();
                        raycastResult.myHits.push(hit);
                    } else {
                        hit = new PP.RaycastHit();
                        raycastResult.myHits.push(hit);
                    }

                    hit.myPosition.vec3_copy(internalRaycastResult.locations[i]);
                    hit.myNormal.vec3_copy(internalRaycastResult.normals[i]);
                    hit.myDistance = internalRaycastResult.distances[i];
                    hit.myObject = internalRaycastResult.objects[i];
                    hit.myIsInsideCollision = isHitInsideCollision;

                    validHitsCount++;
                    currentValidHitIndex++;
                }
            }

            if (raycastResult.myHits.length > validHitsCount) {
                if (raycastResult._myUnusedHits == null) {
                    raycastResult._myUnusedHits = [];
                }

                let hitsToRemove = raycastResult.myHits.length - validHitsCount;
                for (let i = 0; i < hitsToRemove; i++) {
                    raycastResult._myUnusedHits.push(raycastResult.myHits.pop());
                }
            }

            return raycastResult;
        };
    }()
};
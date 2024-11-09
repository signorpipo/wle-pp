import { Object3D, PhysXComponent, Physics } from "@wonderlandengine/api";
import { vec3_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../pp/globals.js";
import { RaycastBlockColliderType, RaycastHit, RaycastParams, RaycastResults } from "./physics_raycast_params.js";

let _myLayerFlagsNames = ["0", "1", "2", "3", "4", "5", "6", "7"];

const _myRaycastCount: WeakMap<Readonly<Physics>, number> = new WeakMap();
const _myRaycastVisualDebugEnabled: WeakMap<Readonly<Physics>, boolean> = new WeakMap();

export function setLayerFlagsNames(layerFlagsNames: string[]): void {
    _myLayerFlagsNames = layerFlagsNames;
}

export function getLayerFlagsNames(): string[] {
    return _myLayerFlagsNames;
}

export function getRaycastCount(physics: Readonly<Physics> = Globals.getPhysics()!): number {
    const raycastCount = _myRaycastCount.get(physics);
    return raycastCount != null ? raycastCount : 0;
}

export function resetRaycastCount(physics: Readonly<Physics> = Globals.getPhysics()!): void {
    _myRaycastCount.set(physics, 0);
}

export function isRaycastVisualDebugEnabled(physics: Readonly<Physics> = Globals.getPhysics()!): boolean {
    return _myRaycastVisualDebugEnabled.get(physics) || false;
}

export function setRaycastVisualDebugEnabled(visualDebugEnabled: boolean, physics: Readonly<Physics> = Globals.getPhysics()!): void {
    _myRaycastVisualDebugEnabled.set(physics, visualDebugEnabled);
}

export const raycast = function () {
    // These initializations assume that there can't be more than @maxHitCount hits within a single rayCast call
    // if the hitCount is greater, these arrays will be allocated again
    let maxHitCount: number = 20;
    let objects: Object3D[] = new Array(maxHitCount);
    let distances: Float32Array = new Float32Array(maxHitCount);
    let locations: Float32Array[] = Array.from({ length: maxHitCount }, () => new Float32Array(3));
    let normals: Float32Array[] = Array.from({ length: maxHitCount }, () => new Float32Array(3));

    const insideCheckSubVector = vec3_create();
    const invertedRaycastDirection = vec3_create();
    const objectsEqualCallback = (first: Readonly<Object3D>, second: Readonly<Object3D>): boolean => first == second;
    return function raycast(raycastParams: Readonly<RaycastParams>, raycastResults: RaycastResults = new RaycastResults()): RaycastResults {
        const internalRaycastResults = raycastParams.myPhysics.rayCast(raycastParams.myOrigin, raycastParams.myDirection, raycastParams.myBlockLayerFlags.getMask(), raycastParams.myDistance);

        if (raycastResults.myRaycastParams == null) {
            raycastResults.myRaycastParams = new RaycastParams(raycastParams.myPhysics);
        }

        raycastResults.myRaycastParams.copy(raycastParams);

        let currentValidHitIndex = 0;
        let validHitsCount = 0;

        const hitCount = internalRaycastResults.hitCount;
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

            raycastParams.myDirection.vec3_negate(invertedRaycastDirection);

            for (let i = 0; i < hitCount; i++) {
                if (raycastParams.myObjectsToIgnore.length != 0) {
                    if (!objectsAlreadyGet) {
                        objectsAlreadyGet = true;
                        internalRaycastResults.getObjects(objects);
                    }

                    if (raycastParams.myObjectsToIgnore.pp_hasEqual(objects[i], objectsEqualCallback)) {
                        continue;
                    }
                }

                if (!distancesAlreadyGet) {
                    distancesAlreadyGet = true;
                    internalRaycastResults.getDistances(distances);
                }

                let colliderTypeValid = true;
                if (raycastParams.myBlockColliderType != RaycastBlockColliderType.BOTH) {
                    colliderTypeValid = false;

                    if (!objectsAlreadyGet) {
                        objectsAlreadyGet = true;
                        internalRaycastResults.getObjects(objects);
                    }

                    const physXComponent = objects[i].pp_getComponentSelf(PhysXComponent)!;
                    colliderTypeValid = (physXComponent.trigger && raycastParams.myBlockColliderType == RaycastBlockColliderType.TRIGGER) || (!physXComponent.trigger && raycastParams.myBlockColliderType == RaycastBlockColliderType.NORMAL);
                }

                if (colliderTypeValid) {
                    let hitInsideCollision = distances[i] == 0;
                    if (hitInsideCollision) {
                        if (!locationsAlreadyGet) {
                            locationsAlreadyGet = true;
                            internalRaycastResults.getLocations(locations);
                        }

                        hitInsideCollision &&= raycastParams.myOrigin.vec3_sub(locations[i], insideCheckSubVector).vec3_isZero(Math.PP_EPSILON);

                        if (hitInsideCollision) {
                            if (!normalsAlreadyGet) {
                                normalsAlreadyGet = true;
                                internalRaycastResults.getNormals(normals);
                            }

                            hitInsideCollision &&= invertedRaycastDirection.vec3_equals(normals[i], Math.PP_EPSILON_DEGREES);
                        }
                    }

                    if ((!raycastParams.myIgnoreHitsInsideCollision || !hitInsideCollision)) {
                        let hit: RaycastHit | null = null;

                        const raycastResultsUnusedHits = (raycastResults as unknown as { _myUnusedHits: RaycastHit[] | null })._myUnusedHits;
                        if (currentValidHitIndex < raycastResults.myHits.length) {
                            hit = raycastResults.myHits[currentValidHitIndex];
                        } else if (raycastResultsUnusedHits != null && raycastResultsUnusedHits.length > 0) {
                            hit = raycastResultsUnusedHits.pop()!;
                            raycastResults.myHits.push(hit!);
                        } else {
                            hit = new RaycastHit();
                            raycastResults.myHits.push(hit);
                        }

                        if (!objectsAlreadyGet) {
                            objectsAlreadyGet = true;
                            internalRaycastResults.getObjects(objects);
                        }

                        if (!locationsAlreadyGet) {
                            locationsAlreadyGet = true;
                            internalRaycastResults.getLocations(locations);
                        }

                        if (!normalsAlreadyGet) {
                            normalsAlreadyGet = true;
                            internalRaycastResults.getNormals(normals);
                        }

                        hit!.myPosition.vec3_copy(locations[i]);
                        hit!.myNormal.vec3_copy(normals[i]);
                        hit!.myDistance = distances[i];
                        hit!.myObject = objects[i];
                        hit!.myInsideCollision = hitInsideCollision;

                        validHitsCount++;
                        currentValidHitIndex++;
                    }
                }
            }
        }

        if (raycastResults.myHits.length > validHitsCount) {
            let raycastResultsUnusedHits = (raycastResults as unknown as { _myUnusedHits: RaycastHit[] | null })._myUnusedHits;
            if (raycastResultsUnusedHits == null) {
                raycastResultsUnusedHits = [];
                (raycastResults as unknown as { _myUnusedHits: RaycastHit[] | null })._myUnusedHits = raycastResultsUnusedHits;

            }

            const hitsToRemove = raycastResults.myHits.length - validHitsCount;
            for (let i = 0; i < hitsToRemove; i++) {
                raycastResultsUnusedHits!.push(raycastResults.myHits.pop()!);
            }
        }

        if (Globals.isDebugEnabled(raycastParams.myPhysics.engine)) {
            if (PhysicsUtils.isRaycastVisualDebugEnabled(raycastParams.myPhysics)) {
                Globals.getDebugVisualManager(raycastParams.myPhysics.engine)!.drawRaycast(0, raycastResults);
            }

            _increaseRaycastCount(raycastParams.myPhysics);
        }

        return raycastResults;
    };
}();

export const PhysicsUtils = {
    setLayerFlagsNames,
    getLayerFlagsNames,
    getRaycastCount,
    resetRaycastCount,
    isRaycastVisualDebugEnabled,
    setRaycastVisualDebugEnabled,
    raycast
} as const;



function _increaseRaycastCount(physics: Readonly<Physics> = Globals.getPhysics()!): void {
    const raycastCount = _myRaycastCount.get(physics);

    if (raycastCount == null) {
        _myRaycastCount.set(physics, 1);
    } else {
        _myRaycastCount.set(physics, raycastCount + 1);
    }
}
import { Object3D, Physics, RayHit, WonderlandEngine } from "@wonderlandengine/api";
import { Vector, Vector3 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { Vec3Utils } from "../../../cauldron/utils/array/vec3_utils.js";
import { VecUtils } from "../../../cauldron/utils/array/vec_utils.js";
import { PluginUtils } from "../../utils/plugin_utils.js";

import "./cauldron_type_extensions.js";

export function initCauldronExtensions(): void {
    _initPhysicsExtensionPrototype();
    _initRayHitExtensionPrototype();
}

function _initPhysicsExtensionPrototype(): void {

    const physicsExtension: Record<string, any> = {};

    physicsExtension.pp_getEngine = function pp_getEngine(this: Readonly<Physics>): WonderlandEngine {
        return (this as unknown as { _engine: WonderlandEngine })._engine;
    };

    PluginUtils.injectProperties(physicsExtension, Physics.prototype, false, true, true);
}

function _initRayHitExtensionPrototype(): void {

    const rayHitExtension: Record<string, any> = {};

    rayHitExtension.pp_getEngine = function pp_getEngine(this: Readonly<Physics>): WonderlandEngine {
        return (this as unknown as { _engine: WonderlandEngine })._engine;
    };

    rayHitExtension.pp_getLocations = function pp_getLocations<T extends Vector3>(this: Readonly<RayHit>, out: Vector3[] | T[] = _createGetLocationsOut(this.hitCount)): Vector3[] | T[] {
        const wasm = this.pp_getEngine().wasm;
        const ptr = (this as unknown as { _ptr: number })._ptr;
        const alignedPtr = ptr / 4; // Align F32

        for (let i = 0; i < this.hitCount; ++i) {
            const locationPtr = alignedPtr + 3 * i;
            out[i][0] = wasm.HEAPF32[locationPtr];
            out[i][1] = wasm.HEAPF32[locationPtr + 1];
            out[i][2] = wasm.HEAPF32[locationPtr + 2];
        }

        return out;
    };

    rayHitExtension.pp_getNormals = function pp_getNormals<T extends Vector3>(this: Readonly<RayHit>, out: Vector3[] | T[] = _createGetNormalsOut(this.hitCount)): Vector3[] | T[] {
        const wasm = this.pp_getEngine().wasm;
        const ptr = (this as unknown as { _ptr: number })._ptr;
        const alignedPtr = (ptr + 48) / 4; // Align F32

        for (let i = 0; i < this.hitCount; ++i) {
            const normalPtr = alignedPtr + 3 * i;
            out[i][0] = wasm.HEAPF32[normalPtr];
            out[i][1] = wasm.HEAPF32[normalPtr + 1];
            out[i][2] = wasm.HEAPF32[normalPtr + 2];
        }

        return out;
    };

    rayHitExtension.pp_getDistances = function pp_getDistances<T extends Vector>(this: Readonly<RayHit>, out: Vector | T = VecUtils.create(this.hitCount)): Vector | T {
        const wasm = this.pp_getEngine().wasm;
        const ptr = (this as unknown as { _ptr: number })._ptr;
        const alignedPtr = (ptr + 48 * 2) / 4; // Align F32

        for (let i = 0; i < this.hitCount; ++i) {
            const distancePtr = alignedPtr + i;
            out[i] = wasm.HEAPF32[distancePtr];
        }

        return out;
    };

    rayHitExtension.pp_getObjects = function pp_getObjects(this: Readonly<RayHit>, out: Object3D[] = new Array(this.hitCount)): Object3D[] {
        const HEAPU16 = this.pp_getEngine().wasm.HEAPU16;
        const ptr = (this as unknown as { _ptr: number })._ptr;
        const alignedPtr = (ptr + (48 * 2 + 16)) >> 1;

        for (let i = 0; i < this.hitCount; ++i) {
            const objectPtr = alignedPtr + i;
            out[i] = this.pp_getEngine().wrapObject(HEAPU16[objectPtr + i]);
        }

        return out;
    };

    PluginUtils.injectProperties(rayHitExtension, RayHit.prototype, false, true, true);
}



function _createGetLocationsOut(hitCount: number): Vector[] {
    return Array.from({ length: hitCount }, () => Vec3Utils.create());
}

function _createGetNormalsOut(hitCount: number): Vector[] {
    return Array.from({ length: hitCount }, () => Vec3Utils.create());
}
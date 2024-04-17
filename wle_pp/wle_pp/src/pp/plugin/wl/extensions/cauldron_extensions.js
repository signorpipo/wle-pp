import { Physics, RayHit } from "@wonderlandengine/api";
import { PluginUtils } from "../../utils/plugin_utils.js";

export function initCauldronExtensions() {
    _initPhysicsExtensionPrototype();
    _initRayHitExtensionPrototype();
}

function _initPhysicsExtensionPrototype() {

    let extension = {};

    extension.pp_getEngine = function pp_getEngine() {
        return this._engine;
    };

    PluginUtils.injectProperties(extension, Physics.prototype, false, true, true);
}

function _initRayHitExtensionPrototype() {

    let extension = {};

    extension.pp_getLocations = function pp_getLocations(out) {
        if (!out) out = Array.from({ length: this.hitCount }, () => new Float32Array(3));

        const wasm = this._engine.wasm;
        const alignedPtr = this._ptr / 4; /* Align F32 */
        for (let i = 0; i < this.hitCount; ++i) {
            const locationPtr = alignedPtr + 3 * i;
            out[i][0] = wasm.HEAPF32[locationPtr];
            out[i][1] = wasm.HEAPF32[locationPtr + 1];
            out[i][2] = wasm.HEAPF32[locationPtr + 2];
        }
        return out;
    };

    extension.pp_getNormals = function pp_getNormals(out) {
        if (!out) out = Array.from({ length: this.hitCount }, () => new Float32Array(3));

        const wasm = this._engine.wasm;
        const alignedPtr = (this._ptr + 48) / 4; /* Align F32 */
        for (let i = 0; i < this.hitCount; ++i) {
            const normalPtr = alignedPtr + 3 * i;
            out[i][0] = wasm.HEAPF32[normalPtr];
            out[i][1] = wasm.HEAPF32[normalPtr + 1];
            out[i][2] = wasm.HEAPF32[normalPtr + 2];
        }
        return out;
    };

    extension.pp_getDistances = function pp_getDistances(out = new Float32Array(this.hitCount)) {
        const wasm = this._engine.wasm;
        const alignedPtr = (this._ptr + 48 * 2) / 4; /* Align F32 */
        for (let i = 0; i < this.hitCount; ++i) {
            const distancePtr = alignedPtr + i;
            out[i] = wasm.HEAPF32[distancePtr];
        }
        return out;
    };

    extension.pp_getObjects = function pp_getObjects(out = new Array(this.hitCount)) {
        const HEAPU16 = this._engine.wasm.HEAPU16;
        const alignedPtr = (this._ptr + (48 * 2 + 16)) >> 1;
        for (let i = 0; i < this.hitCount; ++i) {
            const objectPtr = alignedPtr + i;
            out[i] = this._engine.wrapObject(HEAPU16[objectPtr + i]);
        }
        return out;
    };



    PluginUtils.injectProperties(extension, RayHit.prototype, false, true, true);
}
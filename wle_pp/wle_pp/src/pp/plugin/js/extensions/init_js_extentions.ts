import { initArrayExtension } from "./array/array_extension.js";
import { initArrayExtensionLegacy } from "./array/array_extension_legacy.js";
import { initMat3Extension } from "./array/mat3_extension.js";
import { initVec2Extension } from "./array/vec2_extension.js";
import { initVecExtension } from "./array/vec_extension.js";
import { initMathExtension } from "./math_extension.js";
import { initNumberExtension } from "./number_extension.js";

/**
 *  TS import preserver
 * 
 *  This is only needed to make it so the import is not removed, since it makes the type extensions available to the Typescript 
 */
import "./array/array_extension.js";
import "./array/mat3_extension.js";
import "./array/vec2_extension.js";
import "./array/vec_extension.js";
import "./math_extension.js";
import "./number_extension.js";

export function initJSExtensions(): void {
    initMathExtension();

    initArrayExtension();
    initVecExtension();
    initVec2Extension();
    initMat3Extension();
    initArrayExtensionLegacy();

    initNumberExtension();
}
import { initArrayExtension } from "./array/array_extension.js";
import { initMat3Extension } from "./array/mat3_extension.js";
import { initMat4Extension } from "./array/mat4_extension.js";
import { initQuat2Extension } from "./array/quat2_extension.js";
import { initQuatExtension } from "./array/quat_extension.js";
import { initVec2Extension } from "./array/vec2_extension.js";
import { initVec3Extension } from "./array/vec3_extension.js";
import { initVec4Extension } from "./array/vec4_extension.js";
import { initVecExtension } from "./array/vec_extension.js";
import { initMathExtension } from "./math_extension.js";
import { initNumberExtension } from "./number_extension.js";

/**
 * TS import preserver
 * 
 * This is only needed to make it so the import is not removed, since it makes the type extensions available to the Typescript 
 */
import "./array/array_extension.js";
import "./array/mat3_extension.js";
import "./array/mat4_extension.js";
import "./array/quat2_extension.js";
import "./array/quat_extension.js";
import "./array/vec2_extension.js";
import "./array/vec3_extension.js";
import "./array/vec4_extension.js";
import "./array/vec_extension.js";
import "./math_extension.js";
import "./number_extension.js";

export function initJSExtensions(): void {
    initMathExtension();

    initArrayExtension();
    initVecExtension();
    initVec2Extension();
    initVec3Extension();
    initVec4Extension();
    initQuatExtension();
    initQuat2Extension();
    initMat3Extension();
    initMat4Extension();

    initNumberExtension();
}
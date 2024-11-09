import { Vector4 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { Vec4Utils } from "../../../../cauldron/utils/array/vec4_utils.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";
import { Vector4Extension } from "./vec4_type_extension.js";

import "./vec4_type_extension.js";

export function initVec4Extension(): void {
    _initVec4ExtensionProtoype();
}

function _initVec4ExtensionProtoype(): void {

    const vec4Extension: Vector4Extension<Vector4> = {

        vec4_set<T extends Vector4>(this: T, x: number, y?: number, z?: number, w?: number): T {
            return Vec4Utils.set(this, x, y!, z!, w!);
        },

        vec4_copy<T extends Vector4>(this: T, vector: Readonly<Vector4>): T {
            return Vec4Utils.copy(vector, this);
        },

        vec4_clone<T extends Vector4>(this: Readonly<T>): T {
            return Vec4Utils.clone(this);
        },

        vec4_equals(this: Readonly<Vector4>, vector: Readonly<Vector4>, epsilon?: number): boolean {
            return Vec4Utils.equals(this, vector, epsilon);
        },

        vec4_lerp<T extends Vector4, U extends Vector4>(this: Readonly<T>, to: Readonly<Vector4>, interpolationFactor: number, out?: T | U): T | U {
            return Vec4Utils.lerp(this, to, interpolationFactor, out!);
        },

        vec4_interpolate<T extends Vector4, U extends Vector4>(this: Readonly<T>, to: Readonly<Vector4>, interpolationFactor: number, easingFunction?: EasingFunction, out?: T | U): T | U {
            return Vec4Utils.interpolate(this, to, interpolationFactor, easingFunction!, out!);
        }
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectOwnProperties(vec4Extension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}
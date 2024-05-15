import { Vector4 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { Vec4Utils } from "../../../../cauldron/utils/array/vec4_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";
import { Vector4Extension } from "./vec4_type_extension.js";

import "./vec4_type_extension.js";

export function initVec4Extension(): void {
    _initVec4ExtensionProtoype();
}

function _initVec4ExtensionProtoype(): void {

    const vec4Extension: Vector4Extension<Vector4> = {

        vec4_set: function vec4_set<T extends Vector4>(this: T, x: number, y?: number, z?: number, w?: number): T {
            return Vec4Utils.set(this, x, y!, z!, w!);
        },

        vec4_copy: function vec4_copy<T extends Vector4>(this: T, vector: Readonly<Vector4>): T {
            return Vec4Utils.copy(vector, this);
        },

        vec4_clone: function vec4_clone<T extends Vector4>(this: Readonly<T>): T {
            return Vec4Utils.clone(this);
        }
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectOwnProperties(vec4Extension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}
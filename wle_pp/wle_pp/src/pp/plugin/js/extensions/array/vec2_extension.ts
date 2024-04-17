import { Vector2 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { Vec2Utils } from "../../../../cauldron/utils/array/vec2_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";

import "./vec2_type_extension.js";

export function initVec2Extension(): void {
    _initVec2ExtensionProtoype();
}

function _initVec2ExtensionProtoype(): void {

    const vec2Extension: Record<string, any> = {};

    vec2Extension.vec2_set = function vec2_set<T extends Vector2>(this: T, x: number, y?: number): T {
        return Vec2Utils.set(this, x, y!);
    };

    vec2Extension.vec2_copy = function vec2_copy<T extends Vector2>(this: T, vector: Readonly<Vector2>): T {
        return Vec2Utils.copy(vector, this);
    };

    vec2Extension.vec2_clone = function vec2_clone<T extends Vector2>(this: Readonly<T>): T {
        return Vec2Utils.clone<T>(this);
    };

    vec2Extension.vec2_length = function vec2_length(this: Readonly<Vector2>): number {
        return Vec2Utils.length(this);
    };

    vec2Extension.vec2_normalize = function vec2_normalize<T extends Vector2, S extends Vector2>(this: Readonly<T>, out?: S): S {
        return Vec2Utils.normalize(this, out!);
    };

    vec2Extension.vec2_zero = function vec2_zero<T extends Vector2>(this: T): T {
        return Vec2Utils.zero(this);
    };

    vec2Extension.vec2_isZero = function vec2_isZero(this: Readonly<Vector2>, epsilon?: number): boolean {
        return Vec2Utils.isZero(this, epsilon);
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectProperties(vec2Extension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}
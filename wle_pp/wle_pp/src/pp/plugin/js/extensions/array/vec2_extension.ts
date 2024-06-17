import { Vector2 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { Vec2Utils } from "../../../../cauldron/utils/array/vec2_utils.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";
import { Vector2Extension } from "./vec2_type_extension.js";

import "./vec2_type_extension.js";

export function initVec2Extension(): void {
    _initVec2ExtensionProtoype();
}

function _initVec2ExtensionProtoype(): void {

    const vec2Extension: Vector2Extension<Vector2> = {

        vec2_set<T extends Vector2>(this: T, x: number, y?: number): T {
            return Vec2Utils.set(this, x, y!);
        },

        vec2_copy<T extends Vector2>(this: T, vector: Readonly<Vector2>): T {
            return Vec2Utils.copy(vector, this);
        },

        vec2_clone<T extends Vector2>(this: Readonly<T>): T {
            return Vec2Utils.clone(this);
        },

        vec2_length(this: Readonly<Vector2>): number {
            return Vec2Utils.length(this);
        },

        vec2_normalize<T extends Vector2, U extends Vector2>(this: Readonly<T>, out?: U): U {
            return Vec2Utils.normalize(this, out!);
        },

        vec2_zero<T extends Vector2>(this: T): T {
            return Vec2Utils.zero(this);
        },

        vec2_isZero(this: Readonly<Vector2>, epsilon?: number): boolean {
            return Vec2Utils.isZero(this, epsilon);
        },

        vec2_lerp<T extends Vector2, U extends Vector2>(this: Readonly<T>, to: Readonly<Vector2>, interpolationFactor: number, out?: T | U): T | U {
            return Vec2Utils.lerp(this, to, interpolationFactor, out!);
        },

        vec2_interpolate<T extends Vector2, U extends Vector2>(this: Readonly<T>, to: Readonly<Vector2>, interpolationFactor: number, easingFunction?: EasingFunction, out?: T | U): T | U {
            return Vec2Utils.interpolate(this, to, interpolationFactor, easingFunction!, out!);
        }
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectOwnProperties(vec2Extension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}
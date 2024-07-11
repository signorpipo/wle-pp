import { Vector } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { VecUtils } from "../../../../cauldron/utils/array/vec_utils.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";
import { VectorExtension } from "./vec_type_extension.js";

import "./vec_type_extension.js";

export function initVecExtension(): void {
    _initVecExtensionProtoype();
}

function _initVecExtensionProtoype(): void {

    const vecExtension: VectorExtension<Vector> = {

        vec_set<T extends Vector>(this: T, firstValue: number, ...remainingValues: number[]): T {
            return VecUtils.set(this, firstValue, ...remainingValues);
        },

        vec_copy<T extends Vector>(this: T, vector: Readonly<Vector>): T {
            return VecUtils.copy(vector, this);
        },

        vec_clone<T extends Vector>(this: Readonly<T>): T {
            return VecUtils.clone(this);
        },

        vec_equals(this: Readonly<Vector>, vector: Readonly<Vector>, epsilon?: number): boolean {
            return VecUtils.equals(this, vector, epsilon);
        },

        vec_zero<T extends Vector>(this: T): T {
            return VecUtils.zero(this);
        },

        vec_isZero(this: Readonly<Vector>, epsilon?: number): boolean {
            return VecUtils.isZero(this, epsilon);
        },

        vec_scale<T extends Vector, U extends Vector>(this: Readonly<T>, value: number, out?: U): U {
            return VecUtils.scale(this, value, out!);
        },

        vec_round<T extends Vector, U extends Vector>(this: Readonly<T>, out?: U): U {
            return VecUtils.round(this, out!);
        },

        vec_floor<T extends Vector, U extends Vector>(this: Readonly<T>, out?: U): U {
            return VecUtils.floor(this, out!);
        },

        vec_ceil<T extends Vector, U extends Vector>(this: Readonly<T>, out?: U): U {
            return VecUtils.ceil(this, out!);
        },

        vec_clamp<T extends Vector, U extends Vector>(this: Readonly<T>, start?: number, end?: number, out?: U): U {
            return VecUtils.clamp(this, start!, end!, out!);
        },

        vec_lerp<T extends Vector, U extends Vector>(this: Readonly<T>, to: Readonly<Vector>, interpolationFactor: number, out?: T | U): T | U {
            return VecUtils.lerp(this, to, interpolationFactor, out!);
        },

        vec_interpolate<T extends Vector, U extends Vector>(this: Readonly<T>, to: Readonly<Vector>, interpolationFactor: number, easingFunction?: EasingFunction, out?: T | U): T | U {
            return VecUtils.interpolate(this, to, interpolationFactor, easingFunction!, out!);
        },

        vec_toString(this: Readonly<Vector>, decimalPlaces?: number): string {
            return VecUtils.toString(this, decimalPlaces);
        },

        vec_log(this: Readonly<Vector>, decimalPlaces?: number): Vector {
            return VecUtils.log(this, decimalPlaces);
        },

        vec_error(this: Readonly<Vector>, decimalPlaces?: number): Vector {
            return VecUtils.error(this, decimalPlaces);
        },

        vec_warn(this: Readonly<Vector>, decimalPlaces?: number): Vector {
            return VecUtils.warn(this, decimalPlaces);
        }
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectOwnProperties(vecExtension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}
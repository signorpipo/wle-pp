import { Vector } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { VecUtils } from "../../../../cauldron/utils/array/vec_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";
import { VectorExtension } from "./vec_type_extension.js";

import "./vec_type_extension.js";

export function initVecExtension(): void {
    _initVecExtensionProtoype();
}

function _initVecExtensionProtoype(): void {

    const vecExtension: VectorExtension<Vector> = {

        vec_set: function vec_set<T extends Vector>(this: T, firstValue: number, ...remainingValues: number[]): T {
            return VecUtils.set(this, firstValue, ...remainingValues);
        },

        vec_clone: function vec_clone<T extends Vector>(this: Readonly<T>): T {
            return VecUtils.clone(this);
        },

        vec_equals: function vec_equals(this: Readonly<Vector>, vector: Readonly<Vector>, epsilon?: number): boolean {
            return VecUtils.equals(this, vector, epsilon);
        },

        vec_zero: function vec_zero<T extends Vector>(this: T): T {
            return VecUtils.zero(this);
        },

        vec_isZero: function vec_isZero(this: Readonly<Vector>, epsilon?: number): boolean {
            return VecUtils.isZero(this, epsilon);
        },

        vec_scale: function vec_scale<T extends Vector, U extends Vector>(this: Readonly<T>, value: number, out?: U): U {
            return VecUtils.scale(this, value, out!);
        },

        vec_round: function vec_round<T extends Vector, U extends Vector>(this: Readonly<T>, out?: U): U {
            return VecUtils.round(this, out!);
        },

        vec_floor: function vec_floor<T extends Vector, U extends Vector>(this: Readonly<T>, out?: U): U {
            return VecUtils.floor(this, out!);
        },

        vec_ceil: function vec_ceil<T extends Vector, U extends Vector>(this: Readonly<T>, out?: U): U {
            return VecUtils.ceil(this, out!);
        },

        vec_clamp: function vec_clamp<T extends Vector, U extends Vector>(this: Readonly<T>, start: number, end: number, out?: U): U {
            return VecUtils.clamp(this, start, end, out!);
        },

        vec_toString: function vec_toString(this: Readonly<Vector>, decimalPlaces?: number): string {
            return VecUtils.toString(this, decimalPlaces);
        },

        vec_log: function vec_log(this: Readonly<Vector>, decimalPlaces?: number): Vector {
            return VecUtils.log(this, decimalPlaces);
        },

        vec_error: function vec_error(this: Readonly<Vector>, decimalPlaces?: number): Vector {
            return VecUtils.error(this, decimalPlaces);
        },

        vec_warn: function vec_warn(this: Readonly<Vector>, decimalPlaces?: number): Vector {
            return VecUtils.warn(this, decimalPlaces);
        }
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectOwnProperties(vecExtension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}
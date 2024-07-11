import { Vector } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";

/**
 * #WARN this type extension is actually added at runtime only if you call `initVecExtension`  
 * The `initPP` function, which is automatically called by the `pp-gateway` component, does this for you
 */
export interface VectorExtension<VectorType extends Vector> {
    vec_set<T extends VectorType>(this: T, uniformValue: number): this;
    vec_set<T extends VectorType>(this: T, firstValue: number, ...remainingValues: number[]): this;

    vec_copy<T extends VectorType>(this: T, vector: Readonly<Vector>): this;
    vec_clone<T extends VectorType>(this: Readonly<T>): T;

    vec_equals<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector>, epsilon?: number): boolean;

    vec_zero<T extends VectorType>(this: T): this;
    vec_isZero<T extends VectorType>(this: Readonly<T>, epsilon?: number): boolean;

    vec_scale<T extends VectorType>(this: Readonly<T>, value: number): T;
    vec_scale<T extends VectorType, U extends Vector>(this: Readonly<T>, value: number, out: U): U;



    vec_round<T extends VectorType>(this: Readonly<T>): T;
    vec_round<T extends VectorType, U extends Vector>(this: Readonly<T>, out: U): U;

    vec_floor<T extends VectorType>(this: Readonly<T>): T;
    vec_floor<T extends VectorType, U extends Vector>(this: Readonly<T>, out: U): U;

    vec_ceil<T extends VectorType>(this: Readonly<T>): T;
    vec_ceil<T extends VectorType, U extends Vector>(this: Readonly<T>, out: U): U;

    vec_clamp<T extends VectorType>(this: Readonly<T>, start?: number, end?: number): T;
    vec_clamp<T extends VectorType, U extends Vector>(this: Readonly<T>, start: number, end: number, out: U): U;


    vec_lerp<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector>, interpolationFactor: number): T;
    vec_lerp<T extends VectorType, U extends Vector>(this: Readonly<T>, to: Readonly<Vector>, interpolationFactor: number, out: U): U;

    vec_interpolate<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector>, interpolationFactor: number, easingFunction?: EasingFunction): T;
    vec_interpolate<T extends VectorType, U extends Vector>(this: Readonly<T>, to: Readonly<Vector>, interpolationFactor: number, easingFunction: EasingFunction, out: U): U;



    vec_toString<T extends VectorType>(this: Readonly<T>, decimalPlaces?: number): string;

    vec_log<T extends VectorType>(this: Readonly<T>, decimalPlaces?: number): this;
    vec_error<T extends VectorType>(this: Readonly<T>, decimalPlaces?: number): this;
    vec_warn<T extends VectorType>(this: Readonly<T>, decimalPlaces?: number): this;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> extends VectorExtension<Array<number>> { }
}

declare global {
    interface Uint8ClampedArray extends VectorExtension<Uint8ClampedArray> { }
}

declare global {
    interface Uint8Array extends VectorExtension<Uint8Array> { }
}

declare global {
    interface Uint16Array extends VectorExtension<Uint16Array> { }
}

declare global {
    interface Uint32Array extends VectorExtension<Uint32Array> { }
}

declare global {
    interface Int8Array extends VectorExtension<Int8Array> { }
}

declare global {
    interface Int16Array extends VectorExtension<Int16Array> { }
}

declare global {
    interface Int32Array extends VectorExtension<Int32Array> { }
}

declare global {
    interface Float32Array extends VectorExtension<Float32Array> { }
}

declare global {
    interface Float64Array extends VectorExtension<Float64Array> { }
}

declare module "../../../../cauldron/type_definitions/array_type_definitions.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ArrayLike<T> extends VectorExtension<ArrayLike<number>> { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface DynamicArrayLike<T> extends VectorExtension<DynamicArrayLike<number>> { }

    interface Vector extends VectorExtension<Vector> { }

    interface Vector2 extends VectorExtension<Vector2> { }

    interface Vector3 extends VectorExtension<Vector3> { }

    interface Vector4 extends VectorExtension<Vector4> { }

    interface Quaternion extends VectorExtension<Quaternion> { }

    interface Quaternion2 extends VectorExtension<Quaternion2> { }

    interface Matrix2 extends VectorExtension<Matrix2> { }

    interface Matrix3 extends VectorExtension<Matrix3> { }

    interface Matrix4 extends VectorExtension<Matrix4> { }
}
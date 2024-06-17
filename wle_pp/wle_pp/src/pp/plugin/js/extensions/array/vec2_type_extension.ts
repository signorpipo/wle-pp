import { Vector2 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";

/**
 * #WARN this type extension is actually added at runtime only if you call `initVec2Extension`  
 * The `initPP` function, which is automatically called by the `pp-gateway` component, does this for you
 */
export interface Vector2Extension<VectorType extends Vector2> {
    vec2_set<T extends VectorType>(this: T, x: number, y: number): this;
    vec2_set<T extends VectorType>(this: T, uniformValue: number): this;

    vec2_copy<T extends VectorType>(this: T, vector: Readonly<Vector2>): this;
    vec2_clone<T extends VectorType>(this: Readonly<T>): T;

    vec2_length<T extends VectorType>(this: Readonly<T>): number;

    vec2_normalize<T extends VectorType>(this: Readonly<T>): T;
    vec2_normalize<T extends VectorType, U extends Vector2>(this: Readonly<T>, out: U): U;

    vec2_zero<T extends VectorType>(this: T): this;
    vec2_isZero<T extends VectorType>(this: Readonly<T>, epsilon?: number): boolean;

    vec2_lerp<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector2>, interpolationFactor: number): T;
    vec2_lerp<T extends VectorType, U extends Vector2>(this: Readonly<T>, to: Readonly<Vector2>, interpolationFactor: number, out: U): U;

    vec2_interpolate<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector2>, interpolationFactor: number, easingFunction?: EasingFunction): T;
    vec2_interpolate<T extends VectorType, U extends Vector2>(this: Readonly<T>, to: Readonly<Vector2>, interpolationFactor: number, easingFunction: EasingFunction, out: U): U;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> extends Vector2Extension<Array<number>> { }
}

declare global {
    interface Uint8ClampedArray extends Vector2Extension<Uint8ClampedArray> { }
}

declare global {
    interface Uint8Array extends Vector2Extension<Uint8Array> { }
}

declare global {
    interface Uint16Array extends Vector2Extension<Uint16Array> { }
}

declare global {
    interface Uint32Array extends Vector2Extension<Uint32Array> { }
}

declare global {
    interface Int8Array extends Vector2Extension<Int8Array> { }
}

declare global {
    interface Int16Array extends Vector2Extension<Int16Array> { }
}

declare global {
    interface Int32Array extends Vector2Extension<Int32Array> { }
}

declare global {
    interface Float32Array extends Vector2Extension<Float32Array> { }
}

declare global {
    interface Float64Array extends Vector2Extension<Float64Array> { }
}

declare module "../../../../cauldron/type_definitions/array_type_definitions.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ArrayLike<T> extends Vector2Extension<ArrayLike<number>> { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface DynamicArrayLike<T> extends Vector2Extension<DynamicArrayLike<number>> { }

    interface Vector extends Vector2Extension<Vector> { }

    interface Vector2 extends Vector2Extension<Vector2> { }

    interface Vector3 extends Vector2Extension<Vector3> { }

    interface Vector4 extends Vector2Extension<Vector4> { }

    interface Quaternion extends Vector2Extension<Quaternion> { }

    interface Quaternion2 extends Vector2Extension<Quaternion2> { }

    interface Matrix2 extends Vector2Extension<Matrix2> { }

    interface Matrix3 extends Vector2Extension<Matrix3> { }

    interface Matrix4 extends Vector2Extension<Matrix4> { }
}
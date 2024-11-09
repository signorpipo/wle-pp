import { Vector4 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";

/**
 * #WARN this type extension is actually added at runtime only if you call `initVec4Extension`  
 * The `initPP` function, which is automatically called by the `pp-gateway` component, does this for you
 */
export interface Vector4Extension<VectorType extends Vector4> {
    vec4_set<T extends VectorType>(this: T, x: number, y: number, z: number, w: number): this;
    vec4_set<T extends VectorType>(this: T, uniformValue: number): this;

    vec4_copy<T extends VectorType>(this: T, vector: Readonly<Vector4>): this;
    vec4_clone<T extends VectorType>(this: Readonly<T>): T;

    vec4_equals<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector4>, epsilon?: number): boolean;

    vec4_lerp<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector4>, interpolationFactor: number): T;
    vec4_lerp<T extends VectorType, U extends Vector4>(this: Readonly<T>, to: Readonly<Vector4>, interpolationFactor: number, out: U): U;

    vec4_interpolate<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector4>, interpolationFactor: number, easingFunction?: EasingFunction): T;
    vec4_interpolate<T extends VectorType, U extends Vector4>(this: Readonly<T>, to: Readonly<Vector4>, interpolationFactor: number, easingFunction: EasingFunction, out: U): U;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> extends Vector4Extension<Array<number>> { }
}

declare global {
    interface Uint8ClampedArray extends Vector4Extension<Uint8ClampedArray> { }
}

declare global {
    interface Uint8Array extends Vector4Extension<Uint8Array> { }
}

declare global {
    interface Uint16Array extends Vector4Extension<Uint16Array> { }
}

declare global {
    interface Uint32Array extends Vector4Extension<Uint32Array> { }
}

declare global {
    interface Int8Array extends Vector4Extension<Int8Array> { }
}

declare global {
    interface Int16Array extends Vector4Extension<Int16Array> { }
}

declare global {
    interface Int32Array extends Vector4Extension<Int32Array> { }
}

declare global {
    interface Float32Array extends Vector4Extension<Float32Array> { }
}

declare global {
    interface Float64Array extends Vector4Extension<Float64Array> { }
}

declare module "../../../../cauldron/type_definitions/array_type_definitions.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ArrayLike<T> extends Vector4Extension<ArrayLike<number>> { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface DynamicArrayLike<T> extends Vector4Extension<DynamicArrayLike<number>> { }

    interface Vector extends Vector4Extension<Vector> { }

    interface Vector2 extends Vector4Extension<Vector2> { }

    interface Vector3 extends Vector4Extension<Vector3> { }

    interface Vector4 extends Vector4Extension<Vector4> { }

    interface Quaternion extends Vector4Extension<Quaternion> { }

    interface Quaternion2 extends Vector4Extension<Quaternion2> { }

    interface Matrix2 extends Vector4Extension<Matrix2> { }

    interface Matrix3 extends Vector4Extension<Matrix3> { }

    interface Matrix4 extends Vector4Extension<Matrix4> { }
}
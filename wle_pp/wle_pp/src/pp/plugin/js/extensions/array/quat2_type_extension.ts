import { Matrix4, Quaternion, Quaternion2, Vector3 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";

/**
 * #WARN this type extension is actually added at runtime only if you call `initQuat2Extension`  
 * The `initPP` function, which is automatically called by the `pp-gateway` component, does this for you
 * 
 * -
 * 
 * How to use
 * 
 * By default rotations are in `Degrees` and transforms are `Matrix4` (and not `Quat2`)  
 * For functions that work with rotations, `Matrix` means `Matrix3` and `Quat` means `Quat`  
 * For functions that work with transforms, `Matrix` means `Matrix4` and `Quat` means `Quat2`
 * 
 * For rotations u can add a suffix like `Degrees`/`Radians`/`Quat`/`Matrix` to use a specific version, example:  
 *     - `quat2_getRotationRadians`  
 *     - `quat2_setRotationQuat`
 * 
 * The functions leave u the choice of forwarding an out parameter or just get the return value, example:  
 *     - `let position = this.quat2_getPosition()`  
 *     - `this.quat2_getPosition(position)`  
 *     - the out parameter is always the last one
 */
export interface Quaternion2Extension<QuaternionType extends Quaternion2> {

    quat2_set<T extends QuaternionType>(this: T, x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): this;
    quat2_set<T extends QuaternionType>(this: T, uniformValue: number): this;



    quat2_copy<T extends QuaternionType>(this: T, quat: Readonly<Quaternion2>): this;
    quat2_clone<T extends QuaternionType>(this: Readonly<T>): T;



    quat2_isNormalized<T extends QuaternionType>(this: Readonly<T>, epsilon?: number): boolean;

    quat2_normalize<T extends QuaternionType>(this: Readonly<T>): T;
    quat2_normalize<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, out: U): U;

    quat2_length<T extends QuaternionType>(this: Readonly<T>): number;
    quat2_lengthSquared<T extends QuaternionType>(this: Readonly<T>): number;



    quat2_identity<T extends QuaternionType>(this: T): this;


    quat2_mul<T extends QuaternionType>(this: Readonly<T>, quat: Readonly<Quaternion2>): T;
    quat2_mul<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, quat: Readonly<Quaternion2>, out: U): U;


    quat2_invert<T extends QuaternionType>(this: Readonly<T>): T;
    quat2_invert<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, out: U): U;


    quat2_conjugate<T extends QuaternionType>(this: Readonly<T>): T;
    quat2_conjugate<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, out: U): U;


    quat2_lerp<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number): T;
    quat2_lerp<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, out: U): U;

    quat2_interpolate<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, easingFunction?: EasingFunction): T;
    quat2_interpolate<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, easingFunction: EasingFunction, out: U): U;

    quat2_slerp<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number): T;
    quat2_slerp<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, out: U): U;

    quat2_interpolateSpherical<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, easingFunction?: EasingFunction): T;
    quat2_interpolateSpherical<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, easingFunction: EasingFunction, out: U): U;



    quat2_getPosition<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat2_getPosition<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;


    quat2_getRotation<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat2_getRotation<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat2_getRotationDegrees<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat2_getRotationDegrees<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat2_getRotationRadians<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat2_getRotationRadians<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat2_getRotationQuat<T extends QuaternionType>(this: Readonly<T>): Quaternion;
    quat2_getRotationQuat<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, out: U): U;



    quat2_setPosition<T extends QuaternionType>(this: T, position: Readonly<Vector3>): this;


    quat2_setRotation<T extends QuaternionType>(this: T, rotation: Readonly<Vector3>): this;
    quat2_setRotationDegrees<T extends QuaternionType>(this: T, rotation: Readonly<Vector3>): this;
    quat2_setRotationRadians<T extends QuaternionType>(this: T, rotation: Readonly<Vector3>): this;
    quat2_setRotationQuat<T extends QuaternionType>(this: T, rotation: Readonly<Quaternion>): this;


    quat2_setPositionRotation<T extends QuaternionType>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): this;
    quat2_setPositionRotationDegrees<T extends QuaternionType>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): this;
    quat2_setPositionRotationRadians<T extends QuaternionType>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): this;
    quat2_setPositionRotationQuat<T extends QuaternionType>(this: T, position: Readonly<Vector3>, rotation: Readonly<Quaternion>): this;



    quat2_getAxes<T extends QuaternionType>(this: Readonly<T>): [Vector3, Vector3, Vector3];
    quat2_getAxes<T extends QuaternionType, U extends Vector3, V extends Vector3, W extends Vector3>(this: Readonly<T>, out: [U, V, W]): [U, V, W];

    quat2_getForward<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat2_getForward<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat2_getBackward<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat2_getBackward<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat2_getLeft<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat2_getLeft<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat2_getRight<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat2_getRight<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat2_getUp<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat2_getUp<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat2_getDown<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat2_getDown<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;



    quat2_rotateAxis<T extends QuaternionType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    quat2_rotateAxis<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: U): U;

    quat2_rotateAxisDegrees<T extends QuaternionType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    quat2_rotateAxisDegrees<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: U): U;
    quat2_rotateAxisRadians<T extends QuaternionType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    quat2_rotateAxisRadians<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: U): U;



    quat2_toWorld<T extends QuaternionType>(this: Readonly<T>, parentTransformQuat: Readonly<Quaternion2>): T;
    quat2_toWorld<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, parentTransformQuat: Readonly<Quaternion2>, out: U): U;

    quat2_toLocal<T extends QuaternionType>(this: Readonly<T>, parentTransformQuat: Readonly<Quaternion2>): T;
    quat2_toLocal<T extends QuaternionType, U extends Quaternion2>(this: Readonly<T>, parentTransformQuat: Readonly<Quaternion2>, out: U): U;



    quat2_toMatrix<T extends QuaternionType>(this: Readonly<T>): Matrix4;
    quat2_toMatrix<T extends QuaternionType, U extends Matrix4>(this: Readonly<T>, out: U): U;

    quat2_fromMatrix<T extends QuaternionType>(this: T, matrix: Readonly<Matrix4>): this;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> extends Quaternion2Extension<Array<number>> { }
}

declare global {
    interface Uint8ClampedArray extends Quaternion2Extension<Uint8ClampedArray> { }
}

declare global {
    interface Uint8Array extends Quaternion2Extension<Uint8Array> { }
}

declare global {
    interface Uint16Array extends Quaternion2Extension<Uint16Array> { }
}

declare global {
    interface Uint32Array extends Quaternion2Extension<Uint32Array> { }
}

declare global {
    interface Int8Array extends Quaternion2Extension<Int8Array> { }
}

declare global {
    interface Int16Array extends Quaternion2Extension<Int16Array> { }
}

declare global {
    interface Int32Array extends Quaternion2Extension<Int32Array> { }
}

declare global {
    interface Float32Array extends Quaternion2Extension<Float32Array> { }
}

declare global {
    interface Float64Array extends Quaternion2Extension<Float64Array> { }
}

declare module "../../../../cauldron/type_definitions/array_type_definitions.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ArrayLike<T> extends Quaternion2Extension<ArrayLike<number>> { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface DynamicArrayLike<T> extends Quaternion2Extension<DynamicArrayLike<number>> { }

    interface Vector extends Quaternion2Extension<Vector> { }

    interface Vector2 extends Quaternion2Extension<Vector2> { }

    interface Vector3 extends Quaternion2Extension<Vector3> { }

    interface Vector4 extends Quaternion2Extension<Vector4> { }

    interface Quaternion extends Quaternion2Extension<Quaternion> { }

    interface Quaternion2 extends Quaternion2Extension<Quaternion2> { }

    interface Matrix2 extends Quaternion2Extension<Matrix2> { }

    interface Matrix3 extends Quaternion2Extension<Matrix3> { }

    interface Matrix4 extends Quaternion2Extension<Matrix4> { }
}
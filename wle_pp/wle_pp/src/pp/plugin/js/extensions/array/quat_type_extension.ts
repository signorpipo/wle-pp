import { Matrix3, Quaternion, Vector3 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";

/**
 * #WARN this type extension is actually added at runtime only if you call `initQuatExtension`  
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
 *     - `quat_getAngleRadians`  
 *     - `quat_addRotationQuat`
 * 
 * The functions leave u the choice of forwarding an out parameter or just get the return value, example:  
 *     - `let forward = this.quat_getForward()`  
 *     - `this.quat_getForward(forward)`  
 *     - the out parameter is always the last one
 */
export interface QuaternionExtension<QuaternionType extends Quaternion> {

    quat_set<T extends QuaternionType>(this: T, x: number, y: number, z: number, w: number): this;
    quat_set<T extends QuaternionType>(this: T, uniformValue: number): this;



    quat_copy<T extends QuaternionType>(this: T, quat: Readonly<Quaternion>): this;
    quat_clone<T extends QuaternionType>(this: Readonly<T>): T;



    quat_isNormalized<T extends QuaternionType>(this: Readonly<T>, epsilon?: number): boolean;

    quat_normalize<T extends QuaternionType>(this: Readonly<T>): T;
    quat_normalize<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, out: U): U;

    quat_length<T extends QuaternionType>(this: Readonly<T>): number;
    quat_lengthSquared<T extends QuaternionType>(this: Readonly<T>): number;



    quat_identity<T extends QuaternionType>(this: T): this;


    quat_mul<T extends QuaternionType>(this: Readonly<T>, quat: Readonly<Quaternion>): T;
    quat_mul<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, quat: Readonly<Quaternion>, out: U): U;


    quat_invert<T extends QuaternionType>(this: Readonly<T>): T;
    quat_invert<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, out: U): U;


    quat_conjugate<T extends QuaternionType>(this: Readonly<T>): T;
    quat_conjugate<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, out: U): U;


    quat_lerp<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number): T;
    quat_lerp<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, out: U): U;

    quat_interpolate<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction?: EasingFunction): T;
    quat_interpolate<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction: EasingFunction, out: U): U;

    quat_slerp<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number): T;
    quat_slerp<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, out: U): U;

    quat_interpolateSpherical<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction?: EasingFunction): T;
    quat_interpolateSpherical<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction: EasingFunction, out: U): U;



    quat_getAngle<T extends QuaternionType>(this: Readonly<T>): number;
    quat_getAngleDegrees<T extends QuaternionType>(this: Readonly<T>): number;
    quat_getAngleRadians<T extends QuaternionType>(this: Readonly<T>): number;

    quat_getAxis<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_getAxis<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;


    quat_getAxisScaled<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_getAxisScaled<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat_getAxisScaledDegrees<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_getAxisScaledDegrees<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat_getAxisScaledRadians<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_getAxisScaledRadians<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;



    quat_getAxes<T extends QuaternionType>(this: Readonly<T>): [Vector3, Vector3, Vector3];
    quat_getAxes<T extends QuaternionType, U extends Vector3, V extends Vector3, W extends Vector3>(this: Readonly<T>, out: [U, V, W]): [U, V, W];

    quat_getForward<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_getForward<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat_getBackward<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_getBackward<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat_getLeft<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_getLeft<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat_getRight<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_getRight<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat_getUp<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_getUp<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat_getDown<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_getDown<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;



    quat_setAxes<T extends QuaternionType>(this: T, left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>): this;
    quat_setForward<T extends QuaternionType>(this: T, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    quat_setBackward<T extends QuaternionType>(this: T, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    quat_setUp<T extends QuaternionType>(this: T, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    quat_setDown<T extends QuaternionType>(this: T, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    quat_setLeft<T extends QuaternionType>(this: T, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;
    quat_setRight<T extends QuaternionType>(this: T, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;



    quat_toWorld<T extends QuaternionType>(this: Readonly<T>, parentRotationQuat: Readonly<Quaternion>): T;
    quat_toWorld<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, parentRotationQuat: Readonly<Quaternion>, out: U): U;

    quat_toLocal<T extends QuaternionType>(this: Readonly<T>, parentRotationQuat: Readonly<Quaternion>): T;
    quat_toLocal<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, parentRotationQuat: Readonly<Quaternion>, out: U): U;



    quat_addRotation<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    quat_addRotation<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    quat_addRotationDegrees<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    quat_addRotationDegrees<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    quat_addRotationRadians<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    quat_addRotationRadians<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    quat_addRotationQuat<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Quaternion>): T;
    quat_addRotationQuat<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Quaternion>, out: U): U;


    quat_subRotation<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    quat_subRotation<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    quat_subRotationDegrees<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    quat_subRotationDegrees<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    quat_subRotationRadians<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    quat_subRotationRadians<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    quat_subRotationQuat<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Quaternion>): T;
    quat_subRotationQuat<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Quaternion>, out: U): U;



    quat_rotationTo<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Vector3>): T;
    quat_rotationTo<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, to: Readonly<Vector3>, out: U): U;

    quat_rotationToDegrees<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Vector3>): T;
    quat_rotationToDegrees<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, to: Readonly<Vector3>, out: U): U;

    quat_rotationToRadians<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Vector3>): T;
    quat_rotationToRadians<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, to: Readonly<Vector3>, out: U): U;

    quat_rotationToQuat<T extends QuaternionType>(this: Readonly<T>, to: Readonly<Quaternion>): T;
    quat_rotationToQuat<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, to: Readonly<Quaternion>, out: U): U;



    quat_rotationAroundAxis<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, axis: Readonly<U>): U;
    quat_rotationAroundAxis<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, out: U): U;

    quat_rotationAroundAxisDegrees<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, axis: Readonly<U>): U;
    quat_rotationAroundAxisDegrees<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, out: U): U;

    quat_rotationAroundAxisRadians<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, axis: Readonly<U>): U;
    quat_rotationAroundAxisRadians<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, out: U): U;

    quat_rotationAroundAxisQuat<T extends QuaternionType>(this: Readonly<T>, axis: Readonly<Vector3>): T;
    quat_rotationAroundAxisQuat<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, axis: Readonly<Vector3>, out: U): U;



    quat_getTwist<T extends QuaternionType>(this: Readonly<T>, axis: Readonly<Vector3>): T;
    quat_getTwist<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, axis: Readonly<Vector3>, out: U): U;

    quat_getSwing<T extends QuaternionType>(this: Readonly<T>, axis: Readonly<Vector3>): T;
    quat_getSwing<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, axis: Readonly<Vector3>, out: U): U;

    quat_getSwingFromTwist<T extends QuaternionType>(this: Readonly<T>, axis: Readonly<Vector3>): T;
    quat_getSwingFromTwist<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, axis: Readonly<Vector3>, out: U): U;

    quat_getTwistFromSwing<T extends QuaternionType>(this: Readonly<T>, swing: Readonly<Quaternion>): T;
    quat_getTwistFromSwing<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, swing: Readonly<Quaternion>, out: U): U;

    quat_fromTwistSwing<T extends QuaternionType>(this: T, twist: Readonly<Quaternion>, swing: Readonly<Quaternion>): this;



    quat_rotate<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    quat_rotate<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    quat_rotateDegrees<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    quat_rotateDegrees<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    quat_rotateRadians<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    quat_rotateRadians<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    quat_rotateQuat<T extends QuaternionType>(this: Readonly<T>, rotation: Readonly<Quaternion>): T;
    quat_rotateQuat<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Quaternion>, out: U): U;



    quat_rotateAxis<T extends QuaternionType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    quat_rotateAxis<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: U): U;

    quat_rotateAxisDegrees<T extends QuaternionType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    quat_rotateAxisDegrees<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: U): U;

    quat_rotateAxisRadians<T extends QuaternionType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    quat_rotateAxisRadians<T extends QuaternionType, U extends Quaternion>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: U): U;



    quat_fromDegrees<T extends QuaternionType>(this: T, rotation: Readonly<Vector3>): this;
    quat_fromRadians<T extends QuaternionType>(this: T, rotation: Readonly<Vector3>): this;

    quat_fromAxis<T extends QuaternionType>(this: T, angle: number, axis: Readonly<Vector3>): this;
    quat_fromAxisDegrees<T extends QuaternionType>(this: T, angle: number, axis: Readonly<Vector3>): this;
    quat_fromAxisRadians<T extends QuaternionType>(this: T, angle: number, axis: Readonly<Vector3>): this;

    quat_fromAxes<T extends QuaternionType>(this: T, left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>): this;



    quat_toDegrees<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_toDegrees<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat_toRadians<T extends QuaternionType>(this: Readonly<T>): Vector3;
    quat_toRadians<T extends QuaternionType, U extends Vector3>(this: Readonly<T>, out: U): U;

    quat_toMatrix<T extends QuaternionType>(this: Readonly<T>): Matrix3;
    quat_toMatrix<T extends QuaternionType, U extends Matrix3>(this: Readonly<T>, out: U): U;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> extends QuaternionExtension<Array<number>> { }
}

declare global {
    interface Uint8ClampedArray extends QuaternionExtension<Uint8ClampedArray> { }
}

declare global {
    interface Uint8Array extends QuaternionExtension<Uint8Array> { }
}

declare global {
    interface Uint16Array extends QuaternionExtension<Uint16Array> { }
}

declare global {
    interface Uint32Array extends QuaternionExtension<Uint32Array> { }
}

declare global {
    interface Int8Array extends QuaternionExtension<Int8Array> { }
}

declare global {
    interface Int16Array extends QuaternionExtension<Int16Array> { }
}

declare global {
    interface Int32Array extends QuaternionExtension<Int32Array> { }
}

declare global {
    interface Float32Array extends QuaternionExtension<Float32Array> { }
}

declare global {
    interface Float64Array extends QuaternionExtension<Float64Array> { }
}

declare module "../../../../cauldron/type_definitions/array_type_definitions.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ArrayLike<T> extends QuaternionExtension<ArrayLike<number>> { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface DynamicArrayLike<T> extends QuaternionExtension<DynamicArrayLike<number>> { }

    interface Vector extends QuaternionExtension<Vector> { }

    interface Vector2 extends QuaternionExtension<Vector2> { }

    interface Vector3 extends QuaternionExtension<Vector3> { }

    interface Vector4 extends QuaternionExtension<Vector4> { }

    interface Quaternion extends QuaternionExtension<Quaternion> { }

    interface Quaternion2 extends QuaternionExtension<Quaternion2> { }

    interface Matrix2 extends QuaternionExtension<Matrix2> { }

    interface Matrix3 extends QuaternionExtension<Matrix3> { }

    interface Matrix4 extends QuaternionExtension<Matrix4> { }
}
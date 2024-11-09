import { Matrix3, Matrix4, Quaternion, Vector3 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";

/**
 * #WARN this type extension is actually added at runtime only if you call `initVec3Extension`  
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
 *     - `vec3_angleDegrees`  
 *     - `vec3_rotateQuat`
 *     
 * For transform u can add a suffix like `Quat`/`Matrix` to use a specific version, example:  
 *     - vec3_convertPositionToWorldMatrix  
 *     - vec3_convertDirectionToWorldQuat
 * 
 * Some functions let u add a prefix to specify if the vector represent a rotation in `Degrees` or `Radians`, where `Degrees` is the default:  
 *     - vec3_toQuat  
 *     - vec3_degreesToQuat  
 *     - vec3_radiansToQuat  
 *     - vec3_degreesAddRotation
 * 
 * Rotation operations return a rotation of the same kind of the starting variable:  
 *     - vec3_degreesAddRotationQuat     -> returns a rotation in `Degrees`  
 *     - vec3_radiansAddRotationDegrees  -> returns a rotation in `Radians`
 * 
 * The functions leave u the choice of forwarding an out parameter or just get the return value, example:  
 *     - `let vector = this.vec3_negate()`  
 *     - `this.vec3_negate(vector)`  
 *     - the out parameter is always the last one
 */
export interface Vector3Extension<VectorType extends Vector3> {

    vec3_set<T extends VectorType>(this: T, x: number, y: number, z: number): this;
    vec3_set<T extends VectorType>(this: T, uniformValue: number): this;

    vec3_copy<T extends VectorType>(this: T, vector: Readonly<Vector3>): this;
    vec3_clone<T extends VectorType>(this: Readonly<T>): T;

    vec3_equals<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, epsilon?: number): boolean;



    vec3_isNormalized<T extends VectorType>(this: Readonly<T>, epsilon?: number): boolean;

    vec3_normalize<T extends VectorType>(this: Readonly<T>): T;
    vec3_normalize<T extends VectorType, U extends Vector3>(this: Readonly<T>, out: U): U;

    vec3_isZero<T extends VectorType>(this: Readonly<T>, epsilon?: number): boolean;

    vec3_zero<T extends VectorType>(this: T): this;

    vec3_length<T extends VectorType>(this: Readonly<T>): number;
    vec3_lengthSquared<T extends VectorType>(this: Readonly<T>): number;
    vec3_lengthSigned<T extends VectorType>(this: Readonly<T>, positiveDirection: Readonly<Vector3>): number;

    vec3_distance<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): number;
    vec3_distanceSquared<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): number;



    vec3_add<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): T;
    vec3_add<T extends VectorType, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, out: U): U;

    vec3_sub<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): T;
    vec3_sub<T extends VectorType, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, out: U): U;

    vec3_mul<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): T;
    vec3_mul<T extends VectorType, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, out: U): U;

    vec3_div<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): T;
    vec3_div<T extends VectorType, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, out: U): U;

    vec3_scale<T extends VectorType>(this: Readonly<T>, value: number): T;
    vec3_scale<T extends VectorType, U extends Vector3>(this: Readonly<T>, value: number, out: U): U;


    vec3_negate<T extends VectorType>(this: Readonly<T>): T;
    vec3_negate<T extends VectorType, U extends Vector3>(this: Readonly<T>, out: U): U;


    vec3_dot<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): number;

    vec3_cross<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): T;
    vec3_cross<T extends VectorType, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, out: U): U;


    vec3_transformQuat<T extends VectorType>(this: Readonly<T>, quat: Readonly<Quaternion>): T;
    vec3_transformQuat<T extends VectorType, U extends Vector3>(this: Readonly<T>, quat: Readonly<Quaternion>, out: U): U;

    vec3_transformMat3<T extends VectorType>(this: Readonly<T>, matrix: Readonly<Matrix3>): T;
    vec3_transformMat3<T extends VectorType, U extends Vector3>(this: Readonly<T>, matrix: Readonly<Matrix3>, out: U): U;

    vec3_transformMat4<T extends VectorType>(this: Readonly<T>, matrix: Readonly<Matrix4>): T;
    vec3_transformMat4<T extends VectorType, U extends Vector3>(this: Readonly<T>, matrix: Readonly<Matrix4>, out: U): U;


    vec3_lerp<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector3>, interpolationFactor: number): T;
    vec3_lerp<T extends VectorType, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, interpolationFactor: number, out: U): U;

    vec3_interpolate<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector3>, interpolationFactor: number, easingFunction?: EasingFunction): T;
    vec3_interpolate<T extends VectorType, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, interpolationFactor: number, easingFunction: EasingFunction, out: U): U;



    vec3_angle<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): number;
    vec3_angleDegrees<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): number;
    vec3_angleRadians<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): number;

    vec3_angleSigned<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number;
    vec3_angleSignedDegrees<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number;
    vec3_angleSignedRadians<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number;

    vec3_anglePivoted<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number;
    vec3_anglePivotedDegrees<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number;
    vec3_anglePivotedRadians<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number;

    vec3_anglePivotedSigned<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number;
    vec3_anglePivotedSignedDegrees<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number;
    vec3_anglePivotedSignedRadians<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number;



    vec3_valueAlongAxis<T extends VectorType>(this: Readonly<T>, axis: Readonly<Vector3>): number;

    vec3_valueAlongPlane<T extends VectorType>(this: Readonly<T>, planeNormal: Readonly<Vector3>): number;

    vec3_componentAlongAxis<T extends VectorType>(this: Readonly<T>, axis: Readonly<Vector3>): T;
    vec3_componentAlongAxis<T extends VectorType, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, out: U): U;

    vec3_removeComponentAlongAxis<T extends VectorType>(this: Readonly<T>, axis: Readonly<Vector3>): T;
    vec3_removeComponentAlongAxis<T extends VectorType, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, out: U): U;

    vec3_copyComponentAlongAxis<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, axis: Readonly<Vector3>): T;
    vec3_copyComponentAlongAxis<T extends VectorType, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, axis: Readonly<Vector3>, out: U): U;

    vec3_isConcordant<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>): boolean;

    vec3_isFartherAlongAxis<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, axis: Readonly<Vector3>): boolean;

    vec3_isToTheRight<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): boolean;

    vec3_signTo<T extends VectorType>(this: Readonly<T>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>, zeroSign?: number): number;



    vec3_projectOnAxis<T extends VectorType>(this: Readonly<T>, axis: Readonly<Vector3>): T;
    vec3_projectOnAxis<T extends VectorType, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, out: U): U;

    vec3_projectOnAxisAlongAxis<T extends VectorType>(this: Readonly<T>, axis: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>): T;
    vec3_projectOnAxisAlongAxis<T extends VectorType, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>, out: U): U;

    vec3_projectOnPlane<T extends VectorType>(this: Readonly<T>, planeNormal: Readonly<Vector3>): T;
    vec3_projectOnPlane<T extends VectorType, U extends Vector3>(this: Readonly<T>, planeNormal: Readonly<Vector3>, out: U): U;

    vec3_projectOnPlaneAlongAxis<T extends VectorType>(this: Readonly<T>, planeNormal: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>): T;
    vec3_projectOnPlaneAlongAxis<T extends VectorType, U extends Vector3>(this: Readonly<T>, planeNormal: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>, out: U): U;

    vec3_isOnAxis<T extends VectorType>(this: Readonly<T>, axis: Readonly<Vector3>): boolean;

    vec3_isOnPlane<T extends VectorType>(this: Readonly<T>, planeNormal: Readonly<Vector3>): boolean;

    vec3_perpendicularAny<T extends VectorType>(this: Readonly<T>): T;
    vec3_perpendicularAny<T extends VectorType, U extends Vector3>(this: Readonly<T>, out: U): U;



    vec3_rotate<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    vec3_rotate<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_rotateDegrees<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    vec3_rotateDegrees<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_rotateRadians<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    vec3_rotateRadians<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_rotateQuat<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Quaternion>): T;
    vec3_rotateQuat<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Quaternion>, out: U): U;

    vec3_rotateAxis<T extends VectorType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    vec3_rotateAxis<T extends VectorType, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: U): U;


    vec3_rotateAxisDegrees<T extends VectorType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    vec3_rotateAxisDegrees<T extends VectorType, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: U): U;

    vec3_rotateAxisRadians<T extends VectorType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    vec3_rotateAxisRadians<T extends VectorType, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: U): U;


    vec3_rotateAround<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): T;
    vec3_rotateAround<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out: U): U;

    vec3_rotateAroundDegrees<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): T;
    vec3_rotateAroundDegrees<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out: U): U;

    vec3_rotateAroundRadians<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): T;
    vec3_rotateAroundRadians<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out: U): U;

    vec3_rotateAroundQuat<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): T;
    vec3_rotateAroundQuat<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>, out: U): U;


    vec3_rotateAroundAxis<T extends VectorType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): T;
    vec3_rotateAroundAxis<T extends VectorType, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out: U): U;

    vec3_rotateAroundAxisDegrees<T extends VectorType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): T;
    vec3_rotateAroundAxisDegrees<T extends VectorType, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out: U): U;

    vec3_rotateAroundAxisRadians<T extends VectorType>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): T;
    vec3_rotateAroundAxisRadians<T extends VectorType, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out: U): U;



    vec3_addRotation<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    vec3_addRotation<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_addRotationDegrees<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    vec3_addRotationDegrees<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_addRotationRadians<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    vec3_addRotationRadians<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_addRotationQuat<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Quaternion>): T;
    vec3_addRotationQuat<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Quaternion>, out: U): U;

    vec3_degreesAddRotation<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    vec3_degreesAddRotation<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_degreesAddRotationDegrees<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>, out: T): T;
    vec3_degreesAddRotationDegrees<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_degreesAddRotationRadians<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>, out: T): T;
    vec3_degreesAddRotationRadians<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_degreesAddRotationQuat<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Quaternion>, out: T): T;
    vec3_degreesAddRotationQuat<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Quaternion>, out: U): U;

    vec3_radiansAddRotation<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>): T;
    vec3_radiansAddRotation<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_radiansAddRotationDegrees<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>, out: T): T;
    vec3_radiansAddRotationDegrees<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_radiansAddRotationRadians<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Vector3>, out: T): T;
    vec3_radiansAddRotationRadians<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out: U): U;

    vec3_radiansAddRotationQuat<T extends VectorType>(this: Readonly<T>, rotation: Readonly<Quaternion>, out: T): T;
    vec3_radiansAddRotationQuat<T extends VectorType, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Quaternion>, out: U): U;



    vec3_rotationTo<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector3>): T;
    vec3_rotationTo<T extends VectorType, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, out: U): U;

    vec3_rotationToDegrees<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector3>): T;
    vec3_rotationToDegrees<T extends VectorType, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, out: U): U;

    vec3_rotationToRadians<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector3>): T;
    vec3_rotationToRadians<T extends VectorType, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, out: U): U;

    vec3_rotationToQuat<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector3>): Quaternion;
    vec3_rotationToQuat<T extends VectorType, U extends Quaternion>(this: Readonly<T>, to: Readonly<Vector3>, out: U): U;


    vec3_rotationToPivoted<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>): T;
    vec3_rotationToPivoted<T extends VectorType, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: U): U;

    vec3_rotationToPivotedDegrees<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>): T;
    vec3_rotationToPivotedDegrees<T extends VectorType, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: U): U;

    vec3_rotationToPivotedRadians<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>): T;
    vec3_rotationToPivotedRadians<T extends VectorType, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: U): U;

    vec3_rotationToPivotedQuat<T extends VectorType>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>): Quaternion;
    vec3_rotationToPivotedQuat<T extends VectorType, U extends Quaternion>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: U): U;



    vec3_convertPositionToWorld<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    vec3_convertPositionToWorld<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out: U): U;

    vec3_convertPositionToLocal<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    vec3_convertPositionToLocal<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out: U): U;


    vec3_convertPositionToWorldMatrix<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    vec3_convertPositionToWorldMatrix<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out: U): U;

    vec3_convertPositionToLocalMatrix<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    vec3_convertPositionToLocalMatrix<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out: U): U;


    vec3_convertPositionToWorldQuat<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Quaternion>): T;
    vec3_convertPositionToWorldQuat<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Quaternion>, out: U): U;

    vec3_convertPositionToLocalQuat<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Quaternion>): T;
    vec3_convertPositionToLocalQuat<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Quaternion>, out: U): U;


    vec3_convertDirectionToWorld<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    vec3_convertDirectionToWorld<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out: U): U;

    vec3_convertDirectionToLocal<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    vec3_convertDirectionToLocal<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out: U): U;


    vec3_convertDirectionToWorldMatrix<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    vec3_convertDirectionToWorldMatrix<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out: U): U;

    vec3_convertDirectionToLocalMatrix<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    vec3_convertDirectionToLocalMatrix<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out: U): U;


    vec3_convertDirectionToWorldQuat<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Quaternion>): T;
    vec3_convertDirectionToWorldQuat<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Quaternion>, out: U): U;

    vec3_convertDirectionToLocalQuat<T extends VectorType>(this: Readonly<T>, parentTransform: Readonly<Quaternion>): T;
    vec3_convertDirectionToLocalQuat<T extends VectorType, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Quaternion>, out: U): U;



    vec3_toRadians<T extends VectorType>(this: Readonly<T>): T;
    vec3_toRadians<T extends VectorType, U extends Vector3>(this: Readonly<T>, out: U): U;

    vec3_toDegrees<T extends VectorType>(this: Readonly<T>): T;
    vec3_toDegrees<T extends VectorType, U extends Vector3>(this: Readonly<T>, out: U): U;


    vec3_toQuat<T extends VectorType>(this: Readonly<T>): Quaternion;
    vec3_toQuat<T extends VectorType, U extends Quaternion>(this: Readonly<T>, out: U): U;

    vec3_radiansToQuat<T extends VectorType>(this: Readonly<T>): Quaternion;
    vec3_radiansToQuat<T extends VectorType, U extends Quaternion>(this: Readonly<T>, out: U): U;

    vec3_degreesToQuat<T extends VectorType>(this: Readonly<T>): Quaternion;
    vec3_degreesToQuat<T extends VectorType, U extends Quaternion>(this: Readonly<T>, out: U): U;


    vec3_toMatrix<T extends VectorType>(this: Readonly<T>): Matrix3;
    vec3_toMatrix<T extends VectorType, U extends Matrix3>(this: Readonly<T>, out: U): U;

    vec3_degreesToMatrix<T extends VectorType>(this: Readonly<T>): Matrix3;
    vec3_degreesToMatrix<T extends VectorType, U extends Matrix3>(this: Readonly<T>, out: U): U;

    vec3_radiansToMatrix<T extends VectorType>(this: Readonly<T>): Matrix3;
    vec3_radiansToMatrix<T extends VectorType, U extends Matrix3>(this: Readonly<T>, out: U): U;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Array<T> extends Vector3Extension<Array<number>> { }
}

declare global {
    interface Uint8ClampedArray extends Vector3Extension<Uint8ClampedArray> { }
}

declare global {
    interface Uint8Array extends Vector3Extension<Uint8Array> { }
}

declare global {
    interface Uint16Array extends Vector3Extension<Uint16Array> { }
}

declare global {
    interface Uint32Array extends Vector3Extension<Uint32Array> { }
}

declare global {
    interface Int8Array extends Vector3Extension<Int8Array> { }
}

declare global {
    interface Int16Array extends Vector3Extension<Int16Array> { }
}

declare global {
    interface Int32Array extends Vector3Extension<Int32Array> { }
}

declare global {
    interface Float32Array extends Vector3Extension<Float32Array> { }
}

declare global {
    interface Float64Array extends Vector3Extension<Float64Array> { }
}

declare module "../../../../cauldron/type_definitions/array_type_definitions.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ArrayLike<T> extends Vector3Extension<ArrayLike<number>> { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface DynamicArrayLike<T> extends Vector3Extension<DynamicArrayLike<number>> { }

    interface Vector extends Vector3Extension<Vector> { }

    interface Vector2 extends Vector3Extension<Vector2> { }

    interface Vector3 extends Vector3Extension<Vector3> { }

    interface Vector4 extends Vector3Extension<Vector4> { }

    interface Quaternion extends Vector3Extension<Quaternion> { }

    interface Quaternion2 extends Vector3Extension<Quaternion2> { }

    interface Matrix2 extends Vector3Extension<Matrix2> { }

    interface Matrix3 extends Vector3Extension<Matrix3> { }

    interface Matrix4 extends Vector3Extension<Matrix4> { }
}
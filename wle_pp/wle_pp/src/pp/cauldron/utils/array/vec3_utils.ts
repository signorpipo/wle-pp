import { vec3 as gl_vec3, type mat3 as gl_mat3_type, type mat4 as gl_mat4_type, type quat as gl_quat_type, type vec3 as gl_vec3_type } from "gl-matrix";
import { Matrix3, Matrix4, Quaternion, Vector3 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { EasingFunction, MathUtils } from "../math_utils.js";
import { Mat3Utils } from "./mat3_utils.js";
import { Mat4Utils, create as mat4_utils_create } from "./mat4_utils.js";
import { Quat2Utils } from "./quat2_utils.js";
import { QuatUtils, create as quat_utils_create } from "./quat_utils.js";
import { getVector3AllocationFunction, setVector3AllocationFunction } from "./vec_allocation_utils.js";

export function create(): Vector3;
export function create(x: number, y: number, z: number): Vector3;
export function create(uniformValue: number): Vector3;
export function create(x?: number, y?: number, z?: number): Vector3 {
    const out = getAllocationFunction()();

    if (x != null) {
        Vec3Utils.set(out, x, y!, z!);
    }

    return out;
}

export function getAllocationFunction(): () => Vector3 {
    return getVector3AllocationFunction();
}

/** Specify the function that will be used to allocate the vector when calling the {@link create} function */
export function setAllocationFunction(allocationFunction: () => Vector3): void {
    setVector3AllocationFunction(allocationFunction);
}

export function set<T extends Vector3>(vector: T, x: number, y: number, z: number): T;
export function set<T extends Vector3>(vector: T, uniformValue: number): T;
export function set<T extends Vector3>(vector: T, x: number, y?: number, z?: number): T {
    if (y == null) {
        gl_vec3.set(vector as unknown as gl_vec3_type, x, x, x);
    } else {
        gl_vec3.set(vector as unknown as gl_vec3_type, x, y, z!);
    }

    return vector;
}

export function copy<T extends Vector3>(from: Readonly<Vector3>, to: T): T {
    gl_vec3.copy(to as unknown as gl_vec3_type, from as unknown as gl_vec3_type);
    return to;
}

/** The overload where `T extends Vector3` does also get `array` as `Readonly<T>`, but is not marked as such due to 
    Typescript having issues with inferring the proper type of `T` when `Readonly` is used */
export function clone<T extends Vector3>(vector: Readonly<T>): T;
export function clone(vector: Readonly<number[]>): number[];
export function clone<T extends Vector3>(vector: T): T;
export function clone<T extends Vector3>(vector: Readonly<T>): T {
    return vector.slice(0) as T;
}

export function isNormalized(vector: Readonly<Vector3>, epsilon: number = MathUtils.EPSILON): boolean {
    return Math.abs(Vec3Utils.lengthSquared(vector) - 1) < epsilon;
}

export function normalize<T extends Vector3>(vector: Readonly<T>): T;
export function normalize<T extends Vector3>(vector: Readonly<Vector3>, out: T): T;
export function normalize<T extends Vector3, U extends Vector3>(vector: Readonly<T>, out: T | U = Vec3Utils.clone(vector)): T | U {
    gl_vec3.normalize(out as unknown as gl_vec3_type, vector as unknown as gl_vec3_type);
    return out;
}

export function isZero(vector: Readonly<Vector3>, epsilon: number = 0): boolean {
    return Vec3Utils.lengthSquared(vector) <= (epsilon * epsilon);
}

export function zero<T extends Vector3>(vector: T): T {
    gl_vec3.zero(vector as unknown as gl_vec3_type);
    return vector;
}

export function length(vector: Readonly<Vector3>): number {
    return gl_vec3.length(vector as unknown as gl_vec3_type);
}

export function lengthSquared(vector: Readonly<Vector3>): number {
    return gl_vec3.squaredLength(vector as unknown as gl_vec3_type);
}

export function lengthSigned(vector: Readonly<Vector3>, positiveDirection: Readonly<Vector3>): number {
    let signedLength = Vec3Utils.length(vector);
    if (!Vec3Utils.isConcordant(vector, positiveDirection)) {
        signedLength *= -1;
    }

    return signedLength;
}

export function distance(first: Readonly<Vector3>, second: Readonly<Vector3>): number {
    return gl_vec3.dist(first as unknown as gl_vec3_type, second as unknown as gl_vec3_type);
}

export function distanceSquared(first: Readonly<Vector3>, second: Readonly<Vector3>): number {
    return gl_vec3.squaredDistance(first as unknown as gl_vec3_type, second as unknown as gl_vec3_type);
}

export function equals(first: Readonly<Vector3>, second: Readonly<Vector3>, epsilon: number = 0): boolean {
    let equals = first.length == second.length;

    if (equals) {
        equals &&= (Math.abs(first[0] - second[0]) <= epsilon);
        equals &&= (Math.abs(first[1] - second[1]) <= epsilon);
        equals &&= (Math.abs(first[2] - second[2]) <= epsilon);
    }

    return equals;
}

export function add<T extends Vector3>(first: Readonly<T>, second: Readonly<Vector3>): T;
export function add<T extends Vector3>(first: Readonly<Vector3>, second: Readonly<Vector3>, out: T): T;
export function add<T extends Vector3, U extends Vector3>(first: Readonly<T>, second: Readonly<Vector3>, out: T | U = Vec3Utils.clone(first)): T | U {
    gl_vec3.add(out as unknown as gl_vec3_type, first as unknown as gl_vec3_type, second as unknown as gl_vec3_type);
    return out;
}

export function sub<T extends Vector3>(first: Readonly<T>, second: Readonly<Vector3>): T;
export function sub<T extends Vector3>(first: Readonly<Vector3>, second: Readonly<Vector3>, out: T): T;
export function sub<T extends Vector3, U extends Vector3>(first: Readonly<T>, second: Readonly<Vector3>, out: T | U = Vec3Utils.clone(first)): T | U {
    gl_vec3.sub(out as unknown as gl_vec3_type, first as unknown as gl_vec3_type, second as unknown as gl_vec3_type);
    return out;
}

export function mul<T extends Vector3>(first: Readonly<T>, second: Readonly<Vector3>): T;
export function mul<T extends Vector3>(first: Readonly<Vector3>, second: Readonly<Vector3>, out: T): T;
export function mul<T extends Vector3, U extends Vector3>(first: Readonly<T>, second: Readonly<Vector3>, out: T | U = Vec3Utils.clone(first)): T | U {
    gl_vec3.mul(out as unknown as gl_vec3_type, first as unknown as gl_vec3_type, second as unknown as gl_vec3_type);
    return out;
}


export function div<T extends Vector3>(first: Readonly<T>, second: Readonly<Vector3>): T;
export function div<T extends Vector3>(first: Readonly<Vector3>, second: Readonly<Vector3>, out: T): T;
export function div<T extends Vector3, U extends Vector3>(first: Readonly<T>, second: Readonly<Vector3>, out: T | U = Vec3Utils.clone(first)): T | U {
    gl_vec3.div(out as unknown as gl_vec3_type, first as unknown as gl_vec3_type, second as unknown as gl_vec3_type);
    return out;
}

export function scale<T extends Vector3>(vector: Readonly<T>, value: number): T;
export function scale<T extends Vector3>(vector: Readonly<Vector3>, value: number, out: T): T;
export function scale<T extends Vector3, U extends Vector3>(vector: Readonly<T>, value: number, out: T | U = Vec3Utils.clone(vector)): T | U {
    gl_vec3.scale(out as unknown as gl_vec3_type, vector as unknown as gl_vec3_type, value);
    return out;
}

export function negate<T extends Vector3>(vector: Readonly<T>): T;
export function negate<T extends Vector3>(vector: Readonly<Vector3>, out: T): T;
export function negate<T extends Vector3, U extends Vector3>(vector: Readonly<T>, out: T | U = Vec3Utils.clone(vector)): T | U {
    gl_vec3.negate(out as unknown as gl_vec3_type, vector as unknown as gl_vec3_type);
    return out;
}

export function dot(first: Readonly<Vector3>, second: Readonly<Vector3>): number {
    return gl_vec3.dot(first as unknown as gl_vec3_type, second as unknown as gl_vec3_type);
}

export function cross<T extends Vector3>(first: Readonly<T>, second: Readonly<Vector3>): T;
export function cross<T extends Vector3>(first: Readonly<Vector3>, second: Readonly<Vector3>, out: T): T;
export function cross<T extends Vector3, U extends Vector3>(first: Readonly<T>, second: Readonly<Vector3>, out: T | U = Vec3Utils.clone(first)): T | U {
    gl_vec3.cross(out as unknown as gl_vec3_type, first as unknown as gl_vec3_type, second as unknown as gl_vec3_type);
    return out;
}

export function transformQuat<T extends Vector3>(vector: Readonly<T>, quat: Readonly<Quaternion>): T;
export function transformQuat<T extends Vector3>(vector: Readonly<Vector3>, quat: Readonly<Quaternion>, out: T): T;
export function transformQuat<T extends Vector3, U extends Vector3>(vector: Readonly<T>, quat: Readonly<Quaternion>, out: T | U = Vec3Utils.clone(vector)): T | U {
    gl_vec3.transformQuat(out as unknown as gl_vec3_type, vector as unknown as gl_vec3_type, quat as unknown as gl_quat_type);
    return out;
}

export function transformMat3<T extends Vector3>(vector: Readonly<T>, matrix: Readonly<Matrix3>): T;
export function transformMat3<T extends Vector3>(vector: Readonly<Vector3>, matrix: Readonly<Matrix3>, out: T): T;
export function transformMat3<T extends Vector3, U extends Vector3>(vector: Readonly<T>, matrix: Readonly<Matrix3>, out: T | U = Vec3Utils.clone(vector)): T | U {
    gl_vec3.transformMat3(out as unknown as gl_vec3_type, vector as unknown as gl_vec3_type, matrix as unknown as gl_mat3_type);
    return out;
}

export function transformMat4<T extends Vector3>(vector: Readonly<T>, matrix: Readonly<Matrix4>): T;
export function transformMat4<T extends Vector3>(vector: Readonly<Vector3>, matrix: Readonly<Matrix4>, out: T): T;
export function transformMat4<T extends Vector3, U extends Vector3>(vector: Readonly<T>, matrix: Readonly<Matrix4>, out: T | U = Vec3Utils.clone(vector)): T | U {
    gl_vec3.transformMat4(out as unknown as gl_vec3_type, vector as unknown as gl_vec3_type, matrix as unknown as gl_mat4_type);
    return out;
}

export function lerp<T extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, interpolationFactor: number): T;
export function lerp<T extends Vector3>(from: Readonly<Vector3>, to: Readonly<Vector3>, interpolationFactor: number, out: T): T;
export function lerp<T extends Vector3, U extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, interpolationFactor: number, out: T | U = Vec3Utils.clone(from)): T | U {
    if (interpolationFactor <= 0) {
        Vec3Utils.copy(from, out);
        return out;
    } else if (interpolationFactor >= 1) {
        Vec3Utils.copy(to, out);
        return out;
    }

    gl_vec3.lerp(out as unknown as gl_vec3_type, from as unknown as gl_vec3_type, to as unknown as gl_vec3_type, interpolationFactor);
    return out;
}

export function interpolate<T extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, interpolationFactor: number, easingFunction?: EasingFunction): T;
export function interpolate<T extends Vector3>(from: Readonly<Vector3>, to: Readonly<Vector3>, interpolationFactor: number, easingFunction: EasingFunction, out: T): T;
export function interpolate<T extends Vector3, U extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, interpolationFactor: number, easingFunction: EasingFunction = EasingFunction.linear, out: T | U = Vec3Utils.clone(from)): T | U {
    const lerpFactor = easingFunction(interpolationFactor);
    return Vec3Utils.lerp(from, to, lerpFactor, out);
}

export function angle(first: Readonly<Vector3>, second: Readonly<Vector3>): number {
    return Vec3Utils.angleDegrees(first, second);
}

export function angleDegrees(first: Readonly<Vector3>, second: Readonly<Vector3>): number {
    return MathUtils.toDegrees(Vec3Utils.angleRadians(first, second));
}

export function angleRadians(first: Readonly<Vector3>, second: Readonly<Vector3>): number {
    const firstX = first[0];
    const firstY = first[1];
    const firstZ = first[2];

    const secondX = second[0];
    const secondY = second[1];
    const secondZ = second[2];

    const firstLengthSquared = (firstX * firstX + firstY * firstY + firstZ * firstZ);
    const secondLengthSquared = (secondX * secondX + secondY * secondY + secondZ * secondZ);

    const lengthSquared = firstLengthSquared * secondLengthSquared;

    let angle = 0;
    if (lengthSquared > MathUtils.EPSILON_SQUARED) {
        const length = Math.sqrt(lengthSquared);

        const cos = Vec3Utils.dot(first, second) / length;
        angle = Math.acos(MathUtils.clamp(cos, -1, 1));
    }

    return angle;
}

export function angleSigned(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
    return Vec3Utils.angleSignedDegrees(first, second, referenceAxis);
}

export function angleSignedDegrees(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
    return MathUtils.toDegrees(Vec3Utils.angleSignedRadians(first, second, referenceAxis));
}

export const angleSignedRadians = function () {
    const crossAxis = create();
    return function angleSignedRadians(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
        Vec3Utils.cross(first, second, crossAxis);
        let angle = Vec3Utils.angleRadians(first, second);
        if (!Vec3Utils.isConcordant(crossAxis, referenceAxis)) {
            angle = -angle;
        }

        return angle;
    };
}();

export function anglePivoted(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
    return Vec3Utils.anglePivotedDegrees(first, second, referenceAxis);
}

export function anglePivotedDegrees(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
    return MathUtils.toDegrees(Vec3Utils.anglePivotedRadians(first, second, referenceAxis));
}

export const anglePivotedRadians = function () {
    const flatFirst = create();
    const flatSecond = create();
    return function anglePivotedRadians(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
        Vec3Utils.removeComponentAlongAxis(first, referenceAxis, flatFirst);
        Vec3Utils.removeComponentAlongAxis(second, referenceAxis, flatSecond);

        return Vec3Utils.angleRadians(flatFirst, flatSecond);
    };
}();

export function anglePivotedSigned(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
    return Vec3Utils.anglePivotedSignedDegrees(first, second, referenceAxis);
}

export function anglePivotedSignedDegrees(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
    return MathUtils.toDegrees(Vec3Utils.anglePivotedSignedRadians(first, second, referenceAxis));
}

export const anglePivotedSignedRadians = function () {
    const flatFirst = create();
    const flatSecond = create();
    return function anglePivotedSignedRadians(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
        Vec3Utils.removeComponentAlongAxis(first, referenceAxis, flatFirst);
        Vec3Utils.removeComponentAlongAxis(second, referenceAxis, flatSecond);

        return Vec3Utils.angleSignedRadians(flatFirst, flatSecond, referenceAxis);
    };
}();

export function valueAlongAxis(vector: Readonly<Vector3>, axis: Readonly<Vector3>): number {
    const valueAlongAxis = Vec3Utils.dot(vector, axis);
    return valueAlongAxis;
}

export const valueAlongPlane = function () {
    const componentAlong = create();
    return function valueAlongPlane(vector: Readonly<Vector3>, planeNormal: Readonly<Vector3>): number {
        Vec3Utils.removeComponentAlongAxis(vector, planeNormal, componentAlong);
        return Vec3Utils.length(componentAlong);
    };
}();

export function componentAlongAxis<T extends Vector3>(vector: Readonly<T>, axis: Readonly<Vector3>): T;
export function componentAlongAxis<T extends Vector3>(vector: Readonly<Vector3>, axis: Readonly<Vector3>, out: T): T;
export function componentAlongAxis<T extends Vector3, U extends Vector3>(vector: Readonly<T>, axis: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
    const valueAlongAxis = Vec3Utils.valueAlongAxis(vector, axis);

    Vec3Utils.copy(axis, out);
    Vec3Utils.scale(out, valueAlongAxis, out);
    return out;
}

export const removeComponentAlongAxis = function () {
    const componentAlong = create();

    function removeComponentAlongAxis<T extends Vector3>(vector: Readonly<T>, axis: Readonly<Vector3>): T;
    function removeComponentAlongAxis<T extends Vector3>(vector: Readonly<Vector3>, axis: Readonly<Vector3>, out: T): T;
    function removeComponentAlongAxis<T extends Vector3, U extends Vector3>(vector: Readonly<T>, axis: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Vec3Utils.componentAlongAxis(vector, axis, componentAlong);
        Vec3Utils.sub(vector, componentAlong, out);
        return out;
    }

    return removeComponentAlongAxis;
}();

export const copyComponentAlongAxis = function () {
    const componentAlong = create();

    function copyComponentAlongAxis<T extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, axis: Readonly<Vector3>): T;
    function copyComponentAlongAxis<T extends Vector3>(from: Readonly<Vector3>, to: Readonly<Vector3>, axis: Readonly<Vector3>, out: T): T;
    function copyComponentAlongAxis<T extends Vector3, U extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, axis: Readonly<Vector3>, out: T | U = Vec3Utils.clone(from)): T | U {
        Vec3Utils.removeComponentAlongAxis(to, axis, out);
        Vec3Utils.componentAlongAxis(from, axis, componentAlong);
        Vec3Utils.add(out, componentAlong, out);

        return out;
    }

    return copyComponentAlongAxis;
}();

export function isConcordant(first: Readonly<Vector3>, second: Readonly<Vector3>): boolean {
    return Vec3Utils.dot(first, second) >= 0;
}

export function isFartherAlongAxis(first: Readonly<Vector3>, second: Readonly<Vector3>, axis: Readonly<Vector3>): boolean {
    return Vec3Utils.valueAlongAxis(first, axis) > Vec3Utils.valueAlongAxis(second, axis);
}

export function isToTheRight(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): boolean {
    return Vec3Utils.signTo(first, second, referenceAxis) >= 0;
}

export const signTo = function () {
    const componentAlongThis = create();
    const componentAlongVector = create();
    return function signTo(first: Readonly<Vector3>, second: Readonly<Vector3>, referenceAxis: Readonly<Vector3>, zeroSign: number = 1): number {
        Vec3Utils.removeComponentAlongAxis(first, referenceAxis, componentAlongThis);
        Vec3Utils.removeComponentAlongAxis(second, referenceAxis, componentAlongVector);

        const angleSignedResult = Vec3Utils.angleSigned(first, second, referenceAxis);
        return angleSignedResult > 0 ? 1 : (angleSignedResult == 0 ? zeroSign : -1);
    };
}();

export function projectOnAxis<T extends Vector3>(vector: Readonly<T>, axis: Readonly<Vector3>): T;
export function projectOnAxis<T extends Vector3>(vector: Readonly<Vector3>, axis: Readonly<Vector3>, out: T): T;
export function projectOnAxis<T extends Vector3, U extends Vector3>(vector: Readonly<T>, axis: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
    Vec3Utils.componentAlongAxis(vector, axis, out);
    return out;
}

// The result can easily be not 100% exact due to precision errors
export const projectOnAxisAlongAxis = function () {
    const up = create();
    const vectorProjectedToAxis = create();
    const fixedProjectAlongAxis = create();

    function projectOnAxisAlongAxis<T extends Vector3>(vector: Readonly<T>, axis: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>): T;
    function projectOnAxisAlongAxis<T extends Vector3>(vector: Readonly<Vector3>, axis: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>, out: T): T;
    function projectOnAxisAlongAxis<T extends Vector3, U extends Vector3>(vector: Readonly<T>, axis: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
        if (Vec3Utils.isOnAxis(vector, axis) || Vec3Utils.isOnAxis(projectAlongAxis, axis)) {
            Vec3Utils.copy(vector, out);
        } else {
            Vec3Utils.cross(projectAlongAxis, axis, up);
            Vec3Utils.normalize(up, up);

            if (Vec3Utils.isZero(up)) {
                Vec3Utils.perpendicularAny(projectAlongAxis, up);
                Vec3Utils.normalize(up, up);
            }

            Vec3Utils.removeComponentAlongAxis(vector, up, out);
            if (!Vec3Utils.isOnAxis(out, axis)) {
                Vec3Utils.projectOnAxis(out, axis, vectorProjectedToAxis);
                Vec3Utils.sub(vectorProjectedToAxis, out, vectorProjectedToAxis);

                if (Vec3Utils.isConcordant(vectorProjectedToAxis, projectAlongAxis)) {
                    Vec3Utils.copy(projectAlongAxis, fixedProjectAlongAxis);
                } else {
                    Vec3Utils.negate(projectAlongAxis, fixedProjectAlongAxis);
                }

                const angleWithAlongAxis = Vec3Utils.angleRadians(fixedProjectAlongAxis, vectorProjectedToAxis);
                const lengthToRemove = Vec3Utils.length(vectorProjectedToAxis) / Math.cos(angleWithAlongAxis);

                Vec3Utils.scale(fixedProjectAlongAxis, lengthToRemove, fixedProjectAlongAxis);
                Vec3Utils.add(out, fixedProjectAlongAxis, out);

                Vec3Utils.projectOnAxis(out, axis, out); // Snap on the axis, due to float precision error
            }
        }

        return out;
    }

    return projectOnAxisAlongAxis;
}();

export function projectOnPlane<T extends Vector3>(vector: Readonly<T>, planeNormal: Readonly<Vector3>): T;
export function projectOnPlane<T extends Vector3>(vector: Readonly<Vector3>, planeNormal: Readonly<Vector3>, out: T): T;
export function projectOnPlane<T extends Vector3, U extends Vector3>(vector: Readonly<T>, planeNormal: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
    Vec3Utils.removeComponentAlongAxis(vector, planeNormal, out);
    return out;
}

// The result can easily be not 100% exact due to precision errors
export const projectOnPlaneAlongAxis = function () {
    const vectorProjectedToPlane = create();
    const fixedProjectAlongAxis = create();

    function projectOnPlaneAlongAxis<T extends Vector3>(vector: Readonly<T>, planeNormal: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>): T;
    function projectOnPlaneAlongAxis<T extends Vector3>(vector: Readonly<Vector3>, planeNormal: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>, out: T): T;
    function projectOnPlaneAlongAxis<T extends Vector3, U extends Vector3>(vector: Readonly<T>, planeNormal: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
        if (Vec3Utils.isOnPlane(vector, planeNormal) || Vec3Utils.isOnPlane(projectAlongAxis, planeNormal)) {
            Vec3Utils.copy(vector, out);
        } else {
            Vec3Utils.copy(vector, out);

            Vec3Utils.projectOnPlane(out, planeNormal, vectorProjectedToPlane);
            Vec3Utils.sub(vectorProjectedToPlane, out, vectorProjectedToPlane);

            if (Vec3Utils.isConcordant(vectorProjectedToPlane, projectAlongAxis)) {
                Vec3Utils.copy(projectAlongAxis, fixedProjectAlongAxis);
            } else {
                Vec3Utils.negate(projectAlongAxis, fixedProjectAlongAxis);
            }

            const angleWithAlongAxis = Vec3Utils.angleRadians(fixedProjectAlongAxis, vectorProjectedToPlane);
            const lengthToRemove = Vec3Utils.length(vectorProjectedToPlane) / Math.cos(angleWithAlongAxis);

            Vec3Utils.scale(fixedProjectAlongAxis, lengthToRemove, fixedProjectAlongAxis);
            Vec3Utils.add(out, fixedProjectAlongAxis, out);

            Vec3Utils.projectOnPlane(out, planeNormal, out); // Snap on the axis, due to float precision error
        }

        return out;
    }

    return projectOnPlaneAlongAxis;
}();

export function isOnAxis(vector: Readonly<Vector3>, axis: Readonly<Vector3>): boolean {
    const angleResult = Vec3Utils.angle(vector, axis);
    return Math.abs(angleResult) < MathUtils.EPSILON_DEGREES || Math.abs(angleResult - 180) < MathUtils.EPSILON_DEGREES;
}

export function isOnPlane(vector: Readonly<Vector3>, planeNormal: Readonly<Vector3>): boolean {
    const angleResult = Vec3Utils.angle(vector, planeNormal);
    return Math.abs(angleResult - 90) < MathUtils.EPSILON_DEGREES;
}

export const perpendicularAny = function () {
    const notVector = create();

    function perpendicularAny<T extends Vector3>(vector: Readonly<T>): T;
    function perpendicularAny<T extends Vector3>(vector: Readonly<Vector3>, out: T): T;
    function perpendicularAny<T extends Vector3, U extends Vector3>(vector: Readonly<T>, out: T | U = Vec3Utils.clone(vector)): T | U {
        if (Vec3Utils.isZero(vector)) {
            return Vec3Utils.zero(out);
        }

        Vec3Utils.copy(vector, notVector);

        let zeroAmount = 0;
        for (let i = 0; i < 3; i++) {
            if (vector[i] == 0) {
                zeroAmount++;
            }
        }

        if (zeroAmount == 2) {
            if (notVector[0] == 0) {
                notVector[0] = 1;
            } else if (notVector[1] == 0) {
                notVector[1] = 1;
            } else if (notVector[2] == 0) {
                notVector[2] = 1;
            }
        } else {
            if (notVector[0] != 0) {
                notVector[0] = -notVector[0];
            } else if (notVector[1] != 0) {
                notVector[1] = -notVector[1];
            } else if (notVector[2] != 0) {
                notVector[2] = -notVector[2];
            }
        }

        Vec3Utils.cross(notVector, vector, out);

        return out;
    }

    return perpendicularAny;
}();

export function rotate<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>): T;
export function rotate<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
export function rotate<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.rotateDegrees(vector, rotation, out!);
}

export const rotateDegrees = function () {
    const zero = create();

    function rotateDegrees<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>): T;
    function rotateDegrees<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
    function rotateDegrees<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
        return Vec3Utils.rotateAroundDegrees(vector, rotation, zero, out!);
    }

    return rotateDegrees;
}();

export const rotateRadians = function () {
    const zero = create();

    function rotateRadians<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>): T;
    function rotateRadians<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
    function rotateRadians<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
        return Vec3Utils.rotateAroundRadians(vector, rotation, zero, out!);
    }

    return rotateRadians;
}();

export const rotateQuat = function () {
    const zero = create();

    function rotateQuat<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Quaternion>): T;
    function rotateQuat<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Quaternion>, out: T): T;
    function rotateQuat<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Quaternion>, out?: T | U): T | U {
        return Vec3Utils.rotateAroundQuat(vector, rotation, zero, out!);
    }

    return rotateQuat;
}();

export function rotateAxis<T extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
export function rotateAxis<T extends Vector3>(vector: Readonly<Vector3>, angle: number, axis: Readonly<Vector3>, out: T): T;
export function rotateAxis<T extends Vector3, U extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.rotateAxisDegrees(vector, angle, axis, out!);
}

export const rotateAxisDegrees = function () {
    const zero = create();

    function rotateAxisDegrees<T extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    function rotateAxisDegrees<T extends Vector3>(vector: Readonly<Vector3>, angle: number, axis: Readonly<Vector3>, out: T): T;
    function rotateAxisDegrees<T extends Vector3, U extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
        return Vec3Utils.rotateAroundAxisDegrees(vector, angle, axis, zero, out!);
    }

    return rotateAxisDegrees;
}();

export const rotateAxisRadians = function () {
    const zero = create();

    function rotateAxisRadians<T extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    function rotateAxisRadians<T extends Vector3>(vector: Readonly<Vector3>, angle: number, axis: Readonly<Vector3>, out: T): T;
    function rotateAxisRadians<T extends Vector3, U extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
        return Vec3Utils.rotateAroundAxisRadians(vector, angle, axis, zero, out!);
    }

    return rotateAxisRadians;
}();

export function rotateAround<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): T;
export function rotateAround<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out: T): T;
export function rotateAround<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.rotateAroundDegrees(vector, rotation, origin, out!);
}

export const rotateAroundDegrees = function () {
    const quat = quat_utils_create();

    function rotateAroundDegrees<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): T;
    function rotateAroundDegrees<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out: T): T;
    function rotateAroundDegrees<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Vec3Utils.degreesToQuat(rotation, quat);
        return Vec3Utils.rotateAroundQuat(vector, quat, origin, out);
    }

    return rotateAroundDegrees;
}();

export const rotateAroundRadians = function () {
    const quat = quat_utils_create();

    function rotateAroundRadians<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): T;
    function rotateAroundRadians<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out: T): T;
    function rotateAroundRadians<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Vec3Utils.radiansToQuat(rotation, quat);
        return Vec3Utils.rotateAroundQuat(vector, quat, origin, out);
    }

    return rotateAroundRadians;
}();

export function rotateAroundQuat<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): T;
export function rotateAroundQuat<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>, out: T): T;
export function rotateAroundQuat<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
    Vec3Utils.sub(vector, origin, out);
    Vec3Utils.transformQuat(out, rotation, out);
    Vec3Utils.add(out, origin, out);
    return out;
}

export function rotateAroundAxis<T extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): T;
export function rotateAroundAxis<T extends Vector3>(vector: Readonly<Vector3>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out: T): T;
export function rotateAroundAxis<T extends Vector3, U extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.rotateAroundAxisDegrees(vector, angle, axis, origin, out!);
}

export function rotateAroundAxisDegrees<T extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): T;
export function rotateAroundAxisDegrees<T extends Vector3>(vector: Readonly<Vector3>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out: T): T;
export function rotateAroundAxisDegrees<T extends Vector3, U extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.rotateAroundAxisRadians(vector, MathUtils.toRadians(angle), axis, origin, out!);
}
export const rotateAroundAxisRadians = function () {
    const quat = quat_utils_create();

    function rotateAroundAxisRadians<T extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): T;
    function rotateAroundAxisRadians<T extends Vector3>(vector: Readonly<Vector3>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out: T): T;
    function rotateAroundAxisRadians<T extends Vector3, U extends Vector3>(vector: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
        QuatUtils.fromAxisRadians(angle, axis, quat);
        return Vec3Utils.rotateAroundQuat(vector, quat, origin, out);
    }

    return rotateAroundAxisRadians;
}();

export function addRotation<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>): T;
export function addRotation<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
export function addRotation<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.degreesAddRotation(vector, rotation, out!);
}

export function addRotationDegrees<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>): T;
export function addRotationDegrees<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
export function addRotationDegrees<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.degreesAddRotationDegrees(vector, rotation, out!);
}

export function addRotationRadians<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>): T;
export function addRotationRadians<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
export function addRotationRadians<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.degreesAddRotationRadians(vector, rotation, out!);
}

export function addRotationQuat<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Quaternion>): T;
export function addRotationQuat<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Quaternion>, out: T): T;
export function addRotationQuat<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Quaternion>, out?: T | U): T | U {
    return Vec3Utils.degreesAddRotationQuat(vector, rotation, out!);
}

export function degreesAddRotation<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>): T;
export function degreesAddRotation<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
export function degreesAddRotation<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.degreesAddRotationDegrees(vector, rotation, out!);
}

export const degreesAddRotationDegrees = function () {
    const quat = quat_utils_create();

    function degreesAddRotationDegrees<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out: T): T;
    function degreesAddRotationDegrees<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
    function degreesAddRotationDegrees<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Vec3Utils.degreesToQuat(vector, quat);
        return QuatUtils.toDegrees(QuatUtils.addRotationDegrees(quat, rotation, quat), out);
    }

    return degreesAddRotationDegrees;
}();

export const degreesAddRotationRadians = function () {
    const quat = quat_utils_create();

    function degreesAddRotationRadians<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out: T): T;
    function degreesAddRotationRadians<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
    function degreesAddRotationRadians<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Vec3Utils.degreesToQuat(vector, quat);
        return QuatUtils.toDegrees(QuatUtils.addRotationRadians(quat, rotation, quat), out);
    }

    return degreesAddRotationRadians;
}();

export const degreesAddRotationQuat = function () {
    const quat = quat_utils_create();

    function degreesAddRotationQuat<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Quaternion>, out: T): T;
    function degreesAddRotationQuat<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Quaternion>, out: T): T;
    function degreesAddRotationQuat<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Quaternion>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Vec3Utils.degreesToQuat(vector, quat);
        return QuatUtils.toDegrees(QuatUtils.addRotationQuat(quat, rotation, quat), out);
    }

    return degreesAddRotationQuat;
}();

export function radiansAddRotation<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>): T;
export function radiansAddRotation<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
export function radiansAddRotation<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.radiansAddRotationDegrees(vector, rotation, out!);
}

export const radiansAddRotationDegrees = function () {
    const quat = quat_utils_create();

    function radiansAddRotationDegrees<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out: T): T;
    function radiansAddRotationDegrees<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
    function radiansAddRotationDegrees<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Vec3Utils.radiansToQuat(vector, quat);
        return QuatUtils.toRadians(QuatUtils.addRotationDegrees(quat, rotation, quat), out);
    }

    return radiansAddRotationDegrees;
}();

export const radiansAddRotationRadians = function () {
    const quat = quat_utils_create();

    function radiansAddRotationRadians<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out: T): T;
    function radiansAddRotationRadians<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Vector3>, out: T): T;
    function radiansAddRotationRadians<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Vector3>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Vec3Utils.radiansToQuat(vector, quat);
        return QuatUtils.toRadians(QuatUtils.addRotationRadians(quat, rotation, quat), out);
    }

    return radiansAddRotationRadians;
}();

export const radiansAddRotationQuat = function () {
    const quat = quat_utils_create();

    function radiansAddRotationQuat<T extends Vector3>(vector: Readonly<T>, rotation: Readonly<Quaternion>, out: T): T;
    function radiansAddRotationQuat<T extends Vector3>(vector: Readonly<Vector3>, rotation: Readonly<Quaternion>, out: T): T;
    function radiansAddRotationQuat<T extends Vector3, U extends Vector3>(vector: Readonly<T>, rotation: Readonly<Quaternion>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Vec3Utils.radiansToQuat(vector, quat);
        return QuatUtils.toRadians(QuatUtils.addRotationQuat(quat, rotation, quat), out);
    }

    return radiansAddRotationQuat;
}();

export function rotationTo<T extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>): T;
export function rotationTo<T extends Vector3>(from: Readonly<Vector3>, to: Readonly<Vector3>, out: T): T;
export function rotationTo<T extends Vector3, U extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.rotationToDegrees(from, to, out!);
}

export const rotationToDegrees = function () {
    const rotationQuat = quat_utils_create();

    function rotationToDegrees<T extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>): T;
    function rotationToDegrees<T extends Vector3>(from: Readonly<Vector3>, to: Readonly<Vector3>, out: T): T;
    function rotationToDegrees<T extends Vector3, U extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, out: T | U = Vec3Utils.clone(from)): T | U {
        Vec3Utils.rotationToQuat(from, to, rotationQuat);
        QuatUtils.toDegrees(rotationQuat, out);
        return out;
    }

    return rotationToDegrees;
}();

export const rotationToRadians = function () {
    const rotationQuat = quat_utils_create();

    function rotationToRadians<T extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>): T;
    function rotationToRadians<T extends Vector3>(from: Readonly<Vector3>, to: Readonly<Vector3>, out: T): T;
    function rotationToRadians<T extends Vector3, U extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, out: T | U = Vec3Utils.clone(from)): T | U {
        Vec3Utils.rotationToQuat(from, to, rotationQuat);
        QuatUtils.toRadians(rotationQuat, out);
        return out;
    }

    return rotationToRadians;
}();

export const rotationToQuat = function () {
    const rotationAxis = create();

    function rotationToQuat(from: Readonly<Vector3>, to: Readonly<Vector3>): Quaternion;
    function rotationToQuat<T extends Quaternion>(from: Readonly<Vector3>, to: Readonly<Vector3>, out: T): T;
    function rotationToQuat<T extends Quaternion>(from: Readonly<Vector3>, to: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
        Vec3Utils.cross(from, to, rotationAxis);
        Vec3Utils.normalize(rotationAxis, rotationAxis);

        if (Vec3Utils.isZero(rotationAxis)) {
            Vec3Utils.perpendicularAny(from, rotationAxis);
            Vec3Utils.normalize(rotationAxis, rotationAxis);
        }

        const signedAngle = Vec3Utils.angleSigned(from, to, rotationAxis);
        QuatUtils.fromAxisRadians(signedAngle, rotationAxis, out);
        return out;
    }

    return rotationToQuat;
}();

export function rotationToPivoted<T extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>): T;
export function rotationToPivoted<T extends Vector3>(from: Readonly<Vector3>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: T): T;
export function rotationToPivoted<T extends Vector3, U extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out?: T | U): T | U {
    return Vec3Utils.rotationToPivotedDegrees(from, to, pivotAxis, out!);
}

export const rotationToPivotedDegrees = function () {
    const rotationQuat = quat_utils_create();

    function rotationToPivotedDegrees<T extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>): T;
    function rotationToPivotedDegrees<T extends Vector3>(from: Readonly<Vector3>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: T): T;
    function rotationToPivotedDegrees<T extends Vector3, U extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: T | U = Vec3Utils.clone(from)): T | U {
        Vec3Utils.rotationToPivotedQuat(from, to, pivotAxis, rotationQuat);
        QuatUtils.toDegrees(rotationQuat, out);
        return out;
    }

    return rotationToPivotedDegrees;
}();

export const rotationToPivotedRadians = function () {
    const rotationQuat = quat_utils_create();

    function rotationToPivotedRadians<T extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>): T;
    function rotationToPivotedRadians<T extends Vector3>(from: Readonly<Vector3>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: T): T;
    function rotationToPivotedRadians<T extends Vector3, U extends Vector3>(from: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: T | U = Vec3Utils.clone(from)): T | U {
        Vec3Utils.rotationToPivotedQuat(from, to, pivotAxis, rotationQuat);
        QuatUtils.toRadians(rotationQuat, out);
        return out;
    }

    return rotationToPivotedRadians;
}();

export const rotationToPivotedQuat = function () {
    const fromFlat = create();
    const toFlat = create();
    const rotationAxis = create();

    function rotationToPivotedQuat(from: Readonly<Vector3>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>): Quaternion;
    function rotationToPivotedQuat<T extends Quaternion>(from: Readonly<Vector3>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: T): T;
    function rotationToPivotedQuat<T extends Quaternion>(from: Readonly<Vector3>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
        Vec3Utils.removeComponentAlongAxis(from, pivotAxis, fromFlat);
        Vec3Utils.removeComponentAlongAxis(to, pivotAxis, toFlat);

        Vec3Utils.cross(fromFlat, toFlat, rotationAxis);
        Vec3Utils.normalize(rotationAxis, rotationAxis);

        if (Vec3Utils.isZero(rotationAxis)) {
            Vec3Utils.perpendicularAny(fromFlat, rotationAxis);
            Vec3Utils.normalize(rotationAxis, rotationAxis);
        }

        const signedAngle = Vec3Utils.angleSignedRadians(fromFlat, toFlat, rotationAxis);
        QuatUtils.fromAxisRadians(signedAngle, rotationAxis, out);
        return out;
    }

    return rotationToPivotedQuat;
}();

export function convertPositionToWorld<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
export function convertPositionToWorld<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Matrix4>, out: T): T;
export function convertPositionToWorld<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
    return Vec3Utils.convertPositionToWorldMatrix(vector, parentTransform, out!);
}

export function convertPositionToLocal<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
export function convertPositionToLocal<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Matrix4>, out: T): T;
export function convertPositionToLocal<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
    return Vec3Utils.convertPositionToLocalMatrix(vector, parentTransform, out!);
}

export function convertPositionToWorldMatrix<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
export function convertPositionToWorldMatrix<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Matrix4>, out: T): T;
export function convertPositionToWorldMatrix<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>, out: T | U = Vec3Utils.clone(vector)): T | U {
    Vec3Utils.transformMat4(vector, parentTransform, out);
    return out;
}

export const convertPositionToLocalMatrix = function () {
    const inverse = mat4_utils_create();

    function convertPositionToLocalMatrix<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    function convertPositionToLocalMatrix<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Matrix4>, out: T): T;
    function convertPositionToLocalMatrix<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Mat4Utils.invert(parentTransform, inverse);
        Vec3Utils.transformMat4(vector, inverse, out);
        return out;
    }

    return convertPositionToLocalMatrix;
}();

export const convertPositionToWorldQuat = function () {
    const parentTransformMatrix = mat4_utils_create();
    const position = create();
    const rotation = quat_utils_create();
    const one = create();
    set(one, 1, 1, 1);

    function convertPositionToWorldQuat<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Quaternion>): T;
    function convertPositionToWorldQuat<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Quaternion>, out: T): T;
    function convertPositionToWorldQuat<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Quaternion>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Quat2Utils.getPosition(parentTransform, position);
        Quat2Utils.getRotationQuat(parentTransform, rotation);
        Mat4Utils.setPositionRotationQuatScale(parentTransformMatrix, position, rotation, one);
        return Vec3Utils.convertPositionToWorldMatrix(vector, parentTransformMatrix, out);
    }

    return convertPositionToWorldQuat;
}();

export const convertPositionToLocalQuat = function () {
    const parentTransformMatrix = mat4_utils_create();
    const position = create();
    const rotation = quat_utils_create();
    const one = create();
    set(one, 1, 1, 1);

    function convertPositionToLocalQuat<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Quaternion>): T;
    function convertPositionToLocalQuat<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Quaternion>, out: T): T;
    function convertPositionToLocalQuat<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Quaternion>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Quat2Utils.getPosition(parentTransform, position);
        Quat2Utils.getRotationQuat(parentTransform, rotation);
        Mat4Utils.setPositionRotationQuatScale(parentTransformMatrix, position, rotation, one);
        return Vec3Utils.convertPositionToLocalMatrix(vector, parentTransformMatrix, out);
    }

    return convertPositionToLocalQuat;
}();

export function convertDirectionToWorld<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
export function convertDirectionToWorld<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Matrix4>, out: T): T;
export function convertDirectionToWorld<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
    return Vec3Utils.convertDirectionToWorldMatrix(vector, parentTransform, out!);
}

export function convertDirectionToLocal<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
export function convertDirectionToLocal<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Matrix4>, out: T): T;
export function convertDirectionToLocal<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
    return Vec3Utils.convertDirectionToLocalMatrix(vector, parentTransform, out!);
}

export const convertDirectionToWorldMatrix = function () {
    const rotation = quat_utils_create();

    function convertDirectionToWorldMatrix<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    function convertDirectionToWorldMatrix<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Matrix4>, out: T): T;
    function convertDirectionToWorldMatrix<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Mat4Utils.getRotationQuat(parentTransform, rotation);
        Vec3Utils.transformQuat(vector, rotation, out);
        return out;
    }

    return convertDirectionToWorldMatrix;
}();

export const convertDirectionToLocalMatrix = function () {
    const rotation = quat_utils_create();

    function convertDirectionToLocalMatrix<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>): T;
    function convertDirectionToLocalMatrix<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Matrix4>, out: T): T;
    function convertDirectionToLocalMatrix<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Matrix4>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Mat4Utils.getRotationQuat(parentTransform, rotation);
        QuatUtils.conjugate(rotation, rotation);
        Vec3Utils.transformQuat(vector, rotation, out);
        return out;
    }

    return convertDirectionToLocalMatrix;
}();


export const convertDirectionToWorldQuat = function () {
    const rotation = quat_utils_create();

    function convertDirectionToWorldQuat<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Quaternion>): T;
    function convertDirectionToWorldQuat<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Quaternion>, out: T): T;
    function convertDirectionToWorldQuat<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Quaternion>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Quat2Utils.getRotationQuat(parentTransform, rotation);
        Vec3Utils.transformQuat(vector, rotation, out);
        return out;
    }

    return convertDirectionToWorldQuat;
}();

export const convertDirectionToLocalQuat = function () {
    const rotation = quat_utils_create();

    function convertDirectionToLocalQuat<T extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Quaternion>): T;
    function convertDirectionToLocalQuat<T extends Vector3>(vector: Readonly<Vector3>, parentTransform: Readonly<Quaternion>, out: T): T;
    function convertDirectionToLocalQuat<T extends Vector3, U extends Vector3>(vector: Readonly<T>, parentTransform: Readonly<Quaternion>, out: T | U = Vec3Utils.clone(vector)): T | U {
        Quat2Utils.getRotationQuat(parentTransform, rotation);
        QuatUtils.conjugate(rotation, rotation);
        Vec3Utils.transformQuat(vector, rotation, out);
        return out;
    }

    return convertDirectionToLocalQuat;
}();

export function toRadians<T extends Vector3>(vector: Readonly<T>): T;
export function toRadians<T extends Vector3>(vector: Readonly<Vector3>, out: T): T;
export function toRadians<T extends Vector3, U extends Vector3>(vector: Readonly<T>, out: T | U = Vec3Utils.clone(vector)): T | U {
    Vec3Utils.set(out, MathUtils.toRadians(vector[0]), MathUtils.toRadians(vector[1]), MathUtils.toRadians(vector[2]));
    return out;
}

export function toDegrees<T extends Vector3>(vector: Readonly<T>): T;
export function toDegrees<T extends Vector3>(vector: Readonly<Vector3>, out: T): T;
export function toDegrees<T extends Vector3, U extends Vector3>(vector: Readonly<T>, out: T | U = Vec3Utils.clone(vector)): T | U {
    Vec3Utils.set(out, MathUtils.toDegrees(vector[0]), MathUtils.toDegrees(vector[1]), MathUtils.toDegrees(vector[2]));
    return out;
}

export function toQuat(vector: Readonly<Vector3>): Quaternion;
export function toQuat<T extends Quaternion>(vector: Readonly<Vector3>, out: T): T;
export function toQuat<T extends Quaternion>(vector: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
    return Vec3Utils.degreesToQuat(vector, out);
}

export function radiansToQuat(vector: Readonly<Vector3>): Quaternion;
export function radiansToQuat<T extends Quaternion>(vector: Readonly<Vector3>, out: T): T;
export function radiansToQuat<T extends Quaternion>(vector: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
    QuatUtils.fromRadians(vector, out);
    return out;
}

export function degreesToQuat(vector: Readonly<Vector3>): Quaternion;
export function degreesToQuat<T extends Quaternion>(vector: Readonly<Vector3>, out: T): T;
export function degreesToQuat<T extends Quaternion>(vector: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
    QuatUtils.fromDegrees(vector, out);
    return out;
}

export function toMatrix(vector: Readonly<Vector3>): Matrix3;
export function toMatrix<T extends Matrix3>(vector: Readonly<Vector3>, out: T): T;
export function toMatrix<T extends Matrix3>(vector: Readonly<Vector3>, out: Matrix3 | T = Mat3Utils.create()): Matrix3 | T {
    return Vec3Utils.degreesToMatrix(vector, out);
}

export const degreesToMatrix = function () {
    const quat = quat_utils_create();

    function degreesToMatrix(vector: Readonly<Vector3>): Matrix3;
    function degreesToMatrix<T extends Matrix3>(vector: Readonly<Vector3>, out: T): T;
    function degreesToMatrix<T extends Matrix3>(vector: Readonly<Vector3>, out: Matrix3 | T = Mat3Utils.create()): Matrix3 | T {
        Vec3Utils.degreesToQuat(vector, quat);
        return QuatUtils.toMatrix(quat, out);
    }

    return degreesToMatrix;
}();

export const radiansToMatrix = function () {
    const quat = quat_utils_create();

    function radiansToMatrix(vector: Readonly<Vector3>): Matrix3;
    function radiansToMatrix<T extends Matrix3>(vector: Readonly<Vector3>, out: T): T;
    function radiansToMatrix<T extends Matrix3>(vector: Readonly<Vector3>, out: Matrix3 | T = Mat3Utils.create()): Matrix3 | T {
        Vec3Utils.radiansToQuat(vector, quat);
        return QuatUtils.toMatrix(quat, out);
    }

    return radiansToMatrix;
}();

/**
 * How to use
 * 
 * By default rotations are in `Degrees` and transforms are `Matrix4` (and not `Quat2`)  
 * For functions that work with rotations, `Matrix` means `Matrix3` and `Quat` means `Quat`  
 * For functions that work with transforms, `Matrix` means `Matrix4` and `Quat` means `Quat2`
 * 
 * For rotations u can add a suffix like `Degrees`/`Radians`/`Quat`/`Matrix` to use a specific version, example:  
 *     - `angleDegrees`  
 *     - `rotateQuat`
 *     
 * For transform u can add a suffix like `Quat`/`Matrix` to use a specific version, example:  
 *     - convertPositionToWorldMatrix  
 *     - convertDirectionToWorldQuat
 * 
 * Some functions let u add a prefix to specify if the vector represent a rotation in `Degrees` or `Radians`, where `Degrees` is the default:  
 *     - toQuat  
 *     - degreesToQuat  
 *     - radiansToQuat  
 *     - degreesAddRotation
 * 
 * Rotation operations return a rotation of the same kind of the starting variable:  
 *     - degreesAddRotationQuat     -> returns a rotation in `Degrees`  
 *     - radiansAddRotationDegrees  -> returns a rotation in `Radians`
 * 
 * The functions leave u the choice of forwarding an out parameter or just get the return value, example:  
 *     - `let negate = Vec3Utils.negate(vector)`  
 *     - `Vec3Utils.negate(vector, negate)`  
 *     - the out parameter is always the last one
 */
export const Vec3Utils = {
    create,
    getAllocationFunction,
    setAllocationFunction,
    set,
    copy,
    clone,
    isNormalized,
    normalize,
    isZero,
    zero,
    length,
    lengthSquared,
    lengthSigned,
    distance,
    distanceSquared,
    equals,
    add,
    sub,
    mul,
    div,
    scale,
    negate,
    dot,
    cross,
    transformQuat,
    transformMat3,
    transformMat4,
    lerp,
    interpolate,
    angle,
    angleDegrees,
    angleRadians,
    angleSigned,
    angleSignedDegrees,
    angleSignedRadians,
    anglePivoted,
    anglePivotedDegrees,
    anglePivotedRadians,
    anglePivotedSigned,
    anglePivotedSignedDegrees,
    anglePivotedSignedRadians,
    valueAlongAxis,
    valueAlongPlane,
    componentAlongAxis,
    removeComponentAlongAxis,
    copyComponentAlongAxis,
    isConcordant,
    isFartherAlongAxis,
    isToTheRight,
    signTo,
    projectOnAxis,
    projectOnAxisAlongAxis,
    projectOnPlane,
    projectOnPlaneAlongAxis,
    isOnAxis,
    isOnPlane,
    perpendicularAny,
    rotate,
    rotateDegrees,
    rotateRadians,
    rotateQuat,
    rotateAxis,
    rotateAxisDegrees,
    rotateAxisRadians,
    rotateAround,
    rotateAroundDegrees,
    rotateAroundRadians,
    rotateAroundQuat,
    rotateAroundAxis,
    rotateAroundAxisDegrees,
    rotateAroundAxisRadians,
    addRotation,
    addRotationDegrees,
    addRotationRadians,
    addRotationQuat,
    degreesAddRotation,
    degreesAddRotationDegrees,
    degreesAddRotationRadians,
    degreesAddRotationQuat,
    radiansAddRotation,
    radiansAddRotationDegrees,
    radiansAddRotationRadians,
    radiansAddRotationQuat,
    rotationTo,
    rotationToDegrees,
    rotationToRadians,
    rotationToQuat,
    rotationToPivoted,
    rotationToPivotedDegrees,
    rotationToPivotedRadians,
    rotationToPivotedQuat,
    convertPositionToWorld,
    convertPositionToLocal,
    convertPositionToWorldMatrix,
    convertPositionToLocalMatrix,
    convertPositionToWorldQuat,
    convertPositionToLocalQuat,
    convertDirectionToWorld,
    convertDirectionToLocal,
    convertDirectionToWorldMatrix,
    convertDirectionToLocalMatrix,
    convertDirectionToWorldQuat,
    convertDirectionToLocalQuat,
    toRadians,
    toDegrees,
    toQuat,
    radiansToQuat,
    degreesToQuat,
    toMatrix,
    degreesToMatrix,
    radiansToMatrix
} as const;
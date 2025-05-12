import { mat3 as gl_mat3, quat as gl_quat, type mat3 as gl_mat3_type, type quat as gl_quat_type, type vec3 as gl_vec3_type } from "gl-matrix";
import { Matrix3, Quaternion, Vector3 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { EasingFunction, MathUtils } from "../math_utils.js";
import { ArrayUtils } from "./array_utils.js";
import { Mat3Utils, create as mat3_utils_create } from "./mat3_utils.js";
import { Vec3Utils, create as vec3_utils_create } from "./vec3_utils.js";
import { getQuaternionAllocationFunction, setQuaternionAllocationFunction } from "./vec_allocation_utils.js";

export function create(): Quaternion;
export function create(x: number, y: number, z: number, w: number): Quaternion;
export function create(uniformValue: number): Quaternion;
export function create(x?: number, y?: number, z?: number, w?: number): Quaternion {
    const out = getAllocationFunction()();

    if (x != null) {
        QuatUtils.set(out, x, y!, z!, w!);
    }

    return out;
}

export function getAllocationFunction(): () => Quaternion {
    return getQuaternionAllocationFunction();
}

/** Specify the function that will be used to allocate the quaternion when calling the {@link create} function */
export function setAllocationFunction(allocationFunction: () => Quaternion): void {
    setQuaternionAllocationFunction(allocationFunction);
}

export function set<T extends Quaternion>(quat: T, x: number, y: number, z: number, w: number): T;
export function set<T extends Quaternion>(quat: T, uniformValue: number): T;
export function set<T extends Quaternion>(quat: T, x: number, y?: number, z?: number, w?: number): T {
    if (y == null) {
        gl_quat.set(quat as unknown as gl_quat_type, x, x, x, x);
    } else {
        gl_quat.set(quat as unknown as gl_quat_type, x, y, z!, w!);
    }

    return quat;
}

export function copy<T extends Quaternion>(from: Readonly<Quaternion>, to: T): T {
    gl_quat.copy(to as unknown as gl_quat_type, from as unknown as gl_quat_type);
    return to;
}

/** The overload where `T extends Quaternion` does also get `array` as `Readonly<T>`, but is not marked as such due to 
    Typescript having issues with inferring the proper type of `T` when `Readonly` is used */
export function clone<T extends Quaternion>(quat: Readonly<T>): T;
export function clone(quat: Readonly<number[]>): number[];
export function clone<T extends Quaternion>(quat: T): T;
export function clone<T extends Quaternion>(quat: Readonly<T>): T {
    return quat.slice(0) as T;
}

export function equals(first: Readonly<Quaternion>, second: Readonly<Quaternion>, epsilon: number = 0): boolean {
    let equals = first.length == second.length;

    if (equals) {
        equals &&= (Math.abs(first[0] - second[0]) <= epsilon);
        equals &&= (Math.abs(first[1] - second[1]) <= epsilon);
        equals &&= (Math.abs(first[2] - second[2]) <= epsilon);
        equals &&= (Math.abs(first[3] - second[3]) <= epsilon);
    }

    return equals;
}

export function isNormalized(quat: Readonly<Quaternion>, epsilon: number = MathUtils.EPSILON): boolean {
    return Math.abs(QuatUtils.lengthSquared(quat) - 1) < epsilon;
}

export function normalize<T extends Quaternion>(quat: Readonly<T>): T;
export function normalize<T extends Quaternion>(quat: Readonly<Quaternion>, out: T): T;
export function normalize<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, out: T | U = QuatUtils.clone(quat)): T | U {
    gl_quat.normalize(out as unknown as gl_quat_type, quat as unknown as gl_quat_type);
    return out;
}

export function length(quat: Readonly<Quaternion>): number {
    return gl_quat.length(quat as unknown as gl_quat_type);
}

export function lengthSquared(quat: Readonly<Quaternion>): number {
    return gl_quat.squaredLength(quat as unknown as gl_quat_type);
}

export function identity<T extends Quaternion>(quat: T): T {
    gl_quat.identity(quat as unknown as gl_quat_type);
    return quat;
}

export function mul<T extends Quaternion>(first: Readonly<T>, second: Readonly<Quaternion>): T;
export function mul<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Quaternion>, out: T): T;
export function mul<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Quaternion>, out: T | U = QuatUtils.clone(first)): T | U {
    gl_quat.mul(out as unknown as gl_quat_type, first as unknown as gl_quat_type, second as unknown as gl_quat_type);
    return out;
}

export function invert<T extends Quaternion>(quat: Readonly<T>): T;
export function invert<T extends Quaternion>(quat: Readonly<Quaternion>, out: T): T;
export function invert<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, out: T | U = QuatUtils.clone(quat)): T | U {
    gl_quat.invert(out as unknown as gl_quat_type, quat as unknown as gl_quat_type);
    return out;
}

export function conjugate<T extends Quaternion>(quat: Readonly<T>): T;
export function conjugate<T extends Quaternion>(quat: Readonly<Quaternion>, out: T): T;
export function conjugate<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, out: T | U = QuatUtils.clone(quat)): T | U {
    gl_quat.conjugate(out as unknown as gl_quat_type, quat as unknown as gl_quat_type);
    return out;
}

export function lerp<T extends Quaternion>(from: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number): T;
export function lerp<T extends Quaternion>(from: Readonly<Quaternion>, to: Readonly<Quaternion>, interpolationFactor: number, out: T): T;
export function lerp<T extends Quaternion, U extends Quaternion>(from: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, out: T | U = QuatUtils.clone(from)): T | U {
    if (interpolationFactor <= 0) {
        QuatUtils.copy(from, out);
        return out;
    } else if (interpolationFactor >= 1) {
        QuatUtils.copy(to, out);
        return out;
    }

    gl_quat.lerp(out as unknown as gl_quat_type, from as unknown as gl_quat_type, to as unknown as gl_quat_type, interpolationFactor);
    return out;
}

export function interpolate<T extends Quaternion>(from: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction?: EasingFunction): T;
export function interpolate<T extends Quaternion>(from: Readonly<Quaternion>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction: EasingFunction, out: T): T;
export function interpolate<T extends Quaternion, U extends Quaternion>(from: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction: EasingFunction = EasingFunction.linear, out: T | U = QuatUtils.clone(from)): T | U {
    const lerpFactor = easingFunction(interpolationFactor);
    return QuatUtils.lerp(from, to, lerpFactor, out);
}

export function slerp<T extends Quaternion>(from: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number): T;
export function slerp<T extends Quaternion>(from: Readonly<Quaternion>, to: Readonly<Quaternion>, interpolationFactor: number, out: T): T;
export function slerp<T extends Quaternion, U extends Quaternion>(from: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, out: T | U = QuatUtils.clone(from)): T | U {
    if (interpolationFactor <= 0) {
        QuatUtils.copy(from, out);
        return out;
    } else if (interpolationFactor >= 1) {
        QuatUtils.copy(to, out);
        return out;
    }

    gl_quat.slerp(out as unknown as gl_quat_type, from as unknown as gl_quat_type, to as unknown as gl_quat_type, interpolationFactor);
    return out;
}

export function interpolateSpherical<T extends Quaternion>(from: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction?: EasingFunction): T;
export function interpolateSpherical<T extends Quaternion>(from: Readonly<Quaternion>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction: EasingFunction, out: T): T;
export function interpolateSpherical<T extends Quaternion, U extends Quaternion>(from: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction: EasingFunction = EasingFunction.linear, out: T | U = QuatUtils.clone(from)): T | U {
    const lerpFactor = easingFunction(interpolationFactor);
    return QuatUtils.slerp(from, to, lerpFactor, out);
}

export function getAngle(quat: Readonly<Quaternion>): number {
    return QuatUtils.getAngleDegrees(quat);
}

export function getAngleDegrees(quat: Readonly<Quaternion>): number {
    const angle = QuatUtils.getAngleRadians(quat);
    return MathUtils.toDegrees(angle);
}

export const getAngleRadians = function () {
    const vector = vec3_utils_create();
    return function getAngleRadians(quat: Readonly<Quaternion>): number {
        const angle = gl_quat.getAxisAngle(vector as unknown as gl_vec3_type, quat as unknown as gl_quat_type);
        return angle;
    };
}();

export const getAxis = function () {
    const zero = vec3_utils_create(0, 0, 0);

    function getAxis(quat: Readonly<Quaternion>): Vector3;
    function getAxis<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
    function getAxis<T extends Vector3>(quat: Readonly<Quaternion>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        const angle = gl_quat.getAxisAngle(out as unknown as gl_vec3_type, quat as unknown as gl_quat_type);
        if (angle <= MathUtils.EPSILON) {
            Vec3Utils.copy(zero, out);
        }
        return out;
    }

    return getAxis;
}();


export function getAxisScaled(quat: Readonly<Quaternion>): Vector3;
export function getAxisScaled<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
export function getAxisScaled<T extends Vector3>(quat: Readonly<Quaternion>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    return QuatUtils.getAxisScaledDegrees(quat, out);
}

export function getAxisScaledDegrees(quat: Readonly<Quaternion>): Vector3;
export function getAxisScaledDegrees<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
export function getAxisScaledDegrees<T extends Vector3>(quat: Readonly<Quaternion>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    QuatUtils.getAxis(quat, out);
    const angle = QuatUtils.getAngleDegrees(quat);
    Vec3Utils.scale(out, angle, out);
    return out;
}

export const getAxisScaledRadians = function () {
    const zero = vec3_utils_create(0, 0, 0);

    function getAxisScaledRadians(quat: Readonly<Quaternion>): Vector3;
    function getAxisScaledRadians<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
    function getAxisScaledRadians<T extends Vector3>(quat: Readonly<Quaternion>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        QuatUtils.getAxis(quat, out);
        const angle = QuatUtils.getAngleRadians(quat);
        if (angle <= MathUtils.EPSILON) {
            Vec3Utils.copy(zero, out);
        } else {
            Vec3Utils.scale(out, angle, out);
        }
        return out;
    }

    return getAxisScaledRadians;
}();

export function getAxes(quat: Readonly<Quaternion>): [Vector3, Vector3, Vector3];
export function getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(quat: Readonly<Quaternion>, out: [T, U, V]): [T, U, V];
export function getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(quat: Readonly<Quaternion>, out: [Vector3, Vector3, Vector3] | [T, U, V] = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]): [Vector3, Vector3, Vector3] | [T, U, V] {
    QuatUtils.getLeft(quat, out[0]);
    QuatUtils.getUp(quat, out[1]);
    QuatUtils.getForward(quat, out[2]);
    return out;
}

export const getForward = function () {
    const rotationMatrix = mat3_utils_create();

    function getForward(quat: Readonly<Quaternion>): Vector3;
    function getForward<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
    function getForward<T extends Vector3>(quat: Readonly<Quaternion>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);

        return out;
    }

    return getForward;
}();

export function getBackward(quat: Readonly<Quaternion>): Vector3;
export function getBackward<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
export function getBackward<T extends Vector3>(quat: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
    out = QuatUtils.getForward(quat, out!);
    Vec3Utils.negate(out, out);
    return out!;
}

export const getLeft = function () {
    const rotationMatrix = mat3_utils_create();

    function getLeft(quat: Readonly<Quaternion>): Vector3;
    function getLeft<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
    function getLeft<T extends Vector3>(quat: Readonly<Quaternion>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);

        return out;
    }

    return getLeft;
}();

export function getRight(quat: Readonly<Quaternion>): Vector3;
export function getRight<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
export function getRight<T extends Vector3>(quat: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
    out = QuatUtils.getLeft(quat, out!);
    Vec3Utils.negate(out, out);
    return out!;
}

export const getUp = function () {
    const rotationMatrix = mat3_utils_create();

    function getUp(quat: Readonly<Quaternion>): Vector3;
    function getUp<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
    function getUp<T extends Vector3>(quat: Readonly<Quaternion>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);

        return out;
    }

    return getUp;
}();

export function getDown(quat: Readonly<Quaternion>): Vector3;
export function getDown<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
export function getDown<T extends Vector3>(quat: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
    out = QuatUtils.getUp(quat, out!);
    Vec3Utils.negate(out, out);
    return out!;
}

export function setAxes<T extends Quaternion>(quat: T, left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>): T {
    if (forward != null) {
        return QuatUtils.setForward(quat, forward, up, left);
    } else if (up != null) {
        return QuatUtils.setUp(quat, up, forward, left);
    } else {
        return QuatUtils.setLeft(quat, left, up, forward);
    }
}

export const setForward = function () {
    const axes: [Readonly<Vector3> | null, Readonly<Vector3> | null, Readonly<Vector3> | null] = [null, null, null];
    const priority = [2, 1, 0];
    return function setForward<T extends Quaternion>(quat: T, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): T {
        axes[0] = left!;
        axes[1] = up!;
        axes[2] = forward;

        _setAxes(quat, axes, priority);

        axes[0] = null;
        axes[1] = null;
        axes[2] = null;

        return quat;
    };
}();

export const setBackward = function () {
    const forward = vec3_utils_create();

    const axes: [Readonly<Vector3> | null, Readonly<Vector3> | null, Readonly<Vector3> | null] = [null, null, null];
    const priority = [2, 1, 0];
    return function setBackward<T extends Quaternion>(quat: T, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): T {
        Vec3Utils.negate(backward, forward);

        axes[0] = left || null;
        axes[1] = up || null;
        axes[2] = forward;

        _setAxes(quat, axes, priority);

        axes[0] = null;
        axes[1] = null;
        axes[2] = null;

        return quat;
    };
}();

export const setUp = function () {
    const axes: [Readonly<Vector3> | null, Readonly<Vector3> | null, Readonly<Vector3> | null] = [null, null, null];
    const priority = [1, 2, 0];
    return function setUp<T extends Quaternion>(quat: T, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): T {
        axes[0] = left || null;
        axes[1] = up;
        axes[2] = forward || null;

        _setAxes(quat, axes, priority);

        axes[0] = null;
        axes[1] = null;
        axes[2] = null;

        return quat;
    };
}();

export const setDown = function () {
    const up = vec3_utils_create();

    const axes: [Readonly<Vector3> | null, Readonly<Vector3> | null, Readonly<Vector3> | null] = [null, null, null];
    const priority = [1, 2, 0];
    return function setDown<T extends Quaternion>(quat: T, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): T {
        Vec3Utils.negate(down, up);

        axes[0] = left || null;
        axes[1] = up;
        axes[2] = forward || null;

        _setAxes(quat, axes, priority);

        axes[0] = null;
        axes[1] = null;
        axes[2] = null;

        return quat;
    };
}();

export const setLeft = function () {
    const axes: [Readonly<Vector3> | null, Readonly<Vector3> | null, Readonly<Vector3> | null] = [null, null, null];
    const priority = [0, 1, 2];
    return function setLeft<T extends Quaternion>(quat: T, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): T {
        axes[0] = left;
        axes[1] = up || null;
        axes[2] = forward || null;

        _setAxes(quat, axes, priority);

        axes[0] = null;
        axes[1] = null;
        axes[2] = null;

        return quat;
    };
}();

export const setRight = function () {
    const left = vec3_utils_create();

    const axes: [Readonly<Vector3> | null, Readonly<Vector3> | null, Readonly<Vector3> | null] = [null, null, null];
    const priority = [0, 1, 2];
    return function setRight<T extends Quaternion>(quat: T, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): T {
        Vec3Utils.negate(right, left);

        axes[0] = left;
        axes[1] = up || null;
        axes[2] = forward || null;

        _setAxes(quat, axes, priority);

        axes[0] = null;
        axes[1] = null;
        axes[2] = null;

        return quat;
    };
}();

export function toWorld<T extends Quaternion>(quat: Readonly<T>, parentRotationQuat: Readonly<Quaternion>): T;
export function toWorld<T extends Quaternion>(quat: Readonly<Quaternion>, parentRotationQuat: Readonly<Quaternion>, out: T): T;
export function toWorld<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, parentRotationQuat: Readonly<Quaternion>, out: T | U = QuatUtils.clone(quat)): T | U {
    QuatUtils.mul(parentRotationQuat, quat, out);
    return out;
}

export const toLocal = function () {
    const invertQuat = create();

    function toLocal<T extends Quaternion>(quat: Readonly<T>, parentRotationQuat: Readonly<Quaternion>): T;
    function toLocal<T extends Quaternion>(quat: Readonly<Quaternion>, parentRotationQuat: Readonly<Quaternion>, out: T): T;
    function toLocal<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, parentRotationQuat: Readonly<Quaternion>, out: T | U = QuatUtils.clone(quat)): T | U {
        QuatUtils.conjugate(parentRotationQuat, invertQuat);
        QuatUtils.mul(invertQuat, quat, out);
        return out;
    }

    return toLocal;
}();

export function fromDegrees(rotation: Readonly<Vector3>): Quaternion;
export function fromDegrees<T extends Quaternion>(rotation: Readonly<Vector3>, out: T): T;
export function fromDegrees<T extends Quaternion>(rotation: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
    gl_quat.fromEuler(out as unknown as gl_quat_type, rotation[0], rotation[1], rotation[2]);
    return out;
}

export const fromRadians = function () {
    const vector = vec3_utils_create();

    function fromRadians(rotation: Readonly<Vector3>): Quaternion;
    function fromRadians<T extends Quaternion>(rotation: Readonly<Vector3>, out: T): T;
    function fromRadians<T extends Quaternion>(rotation: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
        Vec3Utils.toDegrees(rotation, vector);
        return QuatUtils.fromDegrees(vector, out);
    }

    return fromRadians;
}();

export function fromAxis(angle: number, axis: Readonly<Vector3>): Quaternion;
export function fromAxis<T extends Quaternion>(angle: number, axis: Readonly<Vector3>, out: T): T;
export function fromAxis<T extends Quaternion>(angle: number, axis: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
    return QuatUtils.fromAxisDegrees(angle, axis, out);
}

export function fromAxisDegrees(angle: number, axis: Readonly<Vector3>): Quaternion;
export function fromAxisDegrees<T extends Quaternion>(angle: number, axis: Readonly<Vector3>, out: T): T;
export function fromAxisDegrees<T extends Quaternion>(angle: number, axis: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
    QuatUtils.fromAxisRadians(MathUtils.toRadians(angle), axis, out);
    return out;
}

export function fromAxisRadians(angle: number, axis: Readonly<Vector3>): Quaternion;
export function fromAxisRadians<T extends Quaternion>(angle: number, axis: Readonly<Vector3>, out: T): T;
export function fromAxisRadians<T extends Quaternion>(angle: number, axis: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
    gl_quat.setAxisAngle(out as unknown as gl_quat_type, axis as unknown as gl_vec3_type, angle);
    return out;
}

export const fromAxes = function () {
    const matrix = mat3_utils_create();

    function fromAxes(left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>): Quaternion;
    function fromAxes<T extends Quaternion>(left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>, out: T): T;
    function fromAxes<T extends Quaternion>(left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
        Mat3Utils.fromAxes(left, up, forward, matrix);
        return Mat3Utils.toQuat(matrix, out);
    }

    return fromAxes;
}();

export function toDegrees(quat: Readonly<Quaternion>): Vector3;
export function toDegrees<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
export function toDegrees<T extends Vector3>(quat: Readonly<Quaternion>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    QuatUtils.toRadians(quat, out);
    Vec3Utils.toDegrees(out, out);
    return out;
}

export const toRadians = function () {
    const matrix = mat3_utils_create();

    function toRadians(quat: Readonly<Quaternion>): Vector3;
    function toRadians<T extends Vector3>(quat: Readonly<Quaternion>, out: T): T;
    function toRadians<T extends Vector3>(quat: Readonly<Quaternion>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        QuatUtils.toMatrix(quat, matrix);

        // Rotation order is ZYX 
        out[1] = Math.asin(-MathUtils.clamp(matrix[2], -1, 1));

        if (Math.abs(matrix[2]) < (1 - MathUtils.EPSILON)) {
            out[0] = Math.atan2(matrix[5], matrix[8]);
            out[2] = Math.atan2(matrix[1], matrix[0]);
        } else {
            out[0] = 0;
            out[2] = Math.atan2(-matrix[3], matrix[4]);
        }

        return out;
    }

    return toRadians;
}();

export function toMatrix(quat: Readonly<Quaternion>): Matrix3;
export function toMatrix<T extends Matrix3>(quat: Readonly<Quaternion>, out: T): T;
export function toMatrix<T extends Matrix3>(quat: Readonly<Quaternion>, out: Matrix3 | T = Mat3Utils.create()): Matrix3 | T {
    gl_mat3.fromQuat(out as unknown as gl_mat3_type, quat as unknown as gl_quat_type);
    return out;
}

export function addRotation<T extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>): T;
export function addRotation<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Vector3>, out: T): T;
export function addRotation<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>, out?: T | U): T | U {
    return QuatUtils.addRotationDegrees(first, second, out!);
}

export const addRotationDegrees = function () {
    const secondQuat = create();

    function addRotationDegrees<T extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>): T;
    function addRotationDegrees<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Vector3>, out: T): T;
    function addRotationDegrees<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>, out?: T | U): T | U {
        Vec3Utils.degreesToQuat(second, secondQuat);
        return QuatUtils.addRotationQuat(first, secondQuat, out!);
    }

    return addRotationDegrees;
}();

export const addRotationRadians = function () {
    const secondQuat = create();

    function addRotationRadians<T extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>): T;
    function addRotationRadians<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Vector3>, out: T): T;
    function addRotationRadians<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>, out?: T | U): T | U {
        Vec3Utils.radiansToQuat(second, secondQuat);
        return QuatUtils.addRotationQuat(first, secondQuat, out!);
    }

    return addRotationRadians;
}();

export function addRotationQuat<T extends Quaternion>(first: Readonly<T>, second: Readonly<Quaternion>): T;
export function addRotationQuat<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Quaternion>, out: T): T;
export function addRotationQuat<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Quaternion>, out: T | U = QuatUtils.clone(first)): T | U {
    QuatUtils.mul(second, first, out);
    return out;
}

export function subRotation<T extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>): T;
export function subRotation<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Vector3>, out: T): T;
export function subRotation<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>, out?: T | U): T | U {
    return QuatUtils.subRotationDegrees(first, second, out!);
}

export const subRotationDegrees = function () {
    const secondQuat = create();

    function subRotationDegrees<T extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>): T;
    function subRotationDegrees<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Vector3>, out: T): T;
    function subRotationDegrees<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>, out?: T | U): T | U {
        Vec3Utils.degreesToQuat(second, secondQuat);
        return QuatUtils.subRotationQuat(first, secondQuat, out!);
    }

    return subRotationDegrees;
}();

export const subRotationRadians = function () {
    const secondQuat = create();

    function subRotationRadians<T extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>): T;
    function subRotationRadians<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Vector3>, out: T): T;
    function subRotationRadians<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>, out?: T | U): T | U {
        Vec3Utils.radiansToQuat(second, secondQuat);
        return QuatUtils.subRotationQuat(first, secondQuat, out!);
    }

    return subRotationRadians;
}();

export const subRotationQuat = function () {
    const inverse = create();

    function subRotationQuat<T extends Quaternion>(first: Readonly<T>, second: Readonly<Quaternion>): T;
    function subRotationQuat<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Quaternion>, out: T): T;
    function subRotationQuat<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Quaternion>, out: T | U = QuatUtils.clone(first)): T | U {
        QuatUtils.invert(second, inverse);
        QuatUtils.mul(first, inverse, out);
        return out;
    }

    return subRotationQuat;
}();

export function rotationTo<T extends Quaternion>(from: Readonly<T>, to: Readonly<Vector3>): T;
export function rotationTo<T extends Quaternion>(from: Readonly<Quaternion>, to: Readonly<Vector3>, out: T): T;
export function rotationTo<T extends Quaternion, U extends Quaternion>(from: Readonly<T>, to: Readonly<Vector3>, out?: T | U): T | U {
    return QuatUtils.rotationToDegrees(from, to, out!);
}

export const rotationToDegrees = function () {
    const toQuat = create();

    function rotationToDegrees<T extends Quaternion>(from: Readonly<T>, to: Readonly<Vector3>): T;
    function rotationToDegrees<T extends Quaternion>(from: Readonly<Quaternion>, to: Readonly<Vector3>, out: T): T;
    function rotationToDegrees<T extends Quaternion, U extends Quaternion>(from: Readonly<T>, to: Readonly<Vector3>, out?: T | U): T | U {
        Vec3Utils.degreesToQuat(to, toQuat);
        return QuatUtils.rotationToQuat(from, toQuat, out!);
    }

    return rotationToDegrees;
}();

export const rotationToRadians = function () {
    const toQuat = create();

    function rotationToRadians<T extends Quaternion>(from: Readonly<T>, to: Readonly<Vector3>): T;
    function rotationToRadians<T extends Quaternion>(from: Readonly<Quaternion>, to: Readonly<Vector3>, out: T): T;
    function rotationToRadians<T extends Quaternion, U extends Quaternion>(from: Readonly<T>, to: Readonly<Vector3>, out?: T | U): T | U {
        Vec3Utils.radiansToQuat(to, toQuat);
        return QuatUtils.rotationToQuat(from, toQuat, out!);
    }

    return rotationToRadians;
}();

export function rotationToQuat<T extends Quaternion>(from: Readonly<T>, to: Readonly<Quaternion>): T;
export function rotationToQuat<T extends Quaternion>(from: Readonly<Quaternion>, to: Readonly<Quaternion>, out: T): T;
export function rotationToQuat<T extends Quaternion, U extends Quaternion>(from: Readonly<T>, to: Readonly<Quaternion>, out?: T | U): T | U {
    return QuatUtils.normalize(QuatUtils.subRotationQuat(to, from, out!), out!);
}


export function rotationAroundAxis<T extends Vector3>(quat: Readonly<Quaternion>, axis: Readonly<T>): T;
export function rotationAroundAxis<T extends Vector3>(quat: Readonly<Quaternion>, axis: Readonly<Vector3>, out: T): T;
export function rotationAroundAxis<T extends Vector3, U extends Vector3>(quat: Readonly<Quaternion>, axis: Readonly<T>, out?: T | U): T | U {
    return QuatUtils.rotationAroundAxisDegrees(quat, axis, out!);
}

export const rotationAroundAxisDegrees = function () {
    const rotationAroundQuat = create();

    function rotationAroundAxisDegrees<T extends Vector3>(quat: Readonly<Quaternion>, axis: Readonly<T>): T;
    function rotationAroundAxisDegrees<T extends Vector3>(quat: Readonly<Quaternion>, axis: Readonly<Vector3>, out: T): T;
    function rotationAroundAxisDegrees<T extends Vector3, U extends Vector3>(quat: Readonly<Quaternion>, axis: Readonly<T>, out: T | U = Vec3Utils.clone(axis)): T | U {
        QuatUtils.rotationAroundAxisQuat(quat, axis, rotationAroundQuat);
        return QuatUtils.toDegrees(rotationAroundQuat, out);
    }

    return rotationAroundAxisDegrees;
}();

export const rotationAroundAxisRadians = function () {
    const rotationAroundQuat = create();

    function rotationAroundAxisRadians<T extends Vector3>(quat: Readonly<Quaternion>, axis: Readonly<T>): T;
    function rotationAroundAxisRadians<T extends Vector3>(quat: Readonly<Quaternion>, axis: Readonly<Vector3>, out: T): T;
    function rotationAroundAxisRadians<T extends Vector3, U extends Vector3>(quat: Readonly<Quaternion>, axis: Readonly<T>, out: T | U = Vec3Utils.clone(axis)): T | U {
        QuatUtils.rotationAroundAxisQuat(quat, axis, rotationAroundQuat);
        return QuatUtils.toRadians(rotationAroundQuat, out);
    }

    return rotationAroundAxisRadians;
}();

export function rotationAroundAxisQuat<T extends Quaternion>(quat: Readonly<T>, axis: Readonly<Vector3>): T;
export function rotationAroundAxisQuat<T extends Quaternion>(quat: Readonly<Quaternion>, axis: Readonly<Vector3>, out: T): T;
export function rotationAroundAxisQuat<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, axis: Readonly<Vector3>, out: T | U = QuatUtils.clone(quat)): T | U {
    return QuatUtils.getTwist(quat, axis, out);
}

export const getTwist = function () {
    const rotationAxis = vec3_utils_create();
    const projection = vec3_utils_create();
    const rotationAlongAxis = create();

    function getTwist<T extends Quaternion>(quat: Readonly<T>, axis: Readonly<Vector3>): T;
    function getTwist<T extends Quaternion>(quat: Readonly<Quaternion>, axis: Readonly<Vector3>, out: T): T;
    function getTwist<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, axis: Readonly<Vector3>, out: T | U = QuatUtils.clone(quat)): T | U {
        rotationAxis[0] = quat[0];
        rotationAxis[1] = quat[1];
        rotationAxis[2] = quat[2];

        const dotProd = Vec3Utils.dot(axis, rotationAxis);
        Vec3Utils.scale(axis, dotProd, projection);
        rotationAlongAxis[0] = projection[0];
        rotationAlongAxis[1] = projection[1];
        rotationAlongAxis[2] = projection[2];
        rotationAlongAxis[3] = quat[3];
        QuatUtils.normalize(rotationAlongAxis, rotationAlongAxis);
        if (dotProd < 0) {
            rotationAlongAxis[0] = -rotationAlongAxis[0];
            rotationAlongAxis[1] = -rotationAlongAxis[1];
            rotationAlongAxis[2] = -rotationAlongAxis[2];
            rotationAlongAxis[3] = -rotationAlongAxis[3];
        }

        return QuatUtils.copy(rotationAlongAxis, out);
    }

    return getTwist;
}();

export const getSwing = function () {
    const twist = create();

    function getSwing<T extends Quaternion>(quat: Readonly<T>, axis: Readonly<Vector3>): T;
    function getSwing<T extends Quaternion>(quat: Readonly<Quaternion>, axis: Readonly<Vector3>, out: T): T;
    function getSwing<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, axis: Readonly<Vector3>, out: T | U = QuatUtils.clone(quat)): T | U {
        QuatUtils.getTwist(quat, axis, twist);
        QuatUtils.getSwingFromTwist(quat, twist, out);
        return out;
    }

    return getSwing;
}();

export function getSwingFromTwist<T extends Quaternion>(quat: Readonly<T>, axis: Readonly<Vector3>): T;
export function getSwingFromTwist<T extends Quaternion>(quat: Readonly<Quaternion>, axis: Readonly<Vector3>, out: T): T;
export function getSwingFromTwist<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, twist: Readonly<Quaternion>, out: T | U = QuatUtils.clone(quat)): T | U {
    return QuatUtils.subRotationQuat(quat, twist, out);
}

export const getTwistFromSwing = function () {
    const inverse = create();

    function getTwistFromSwing<T extends Quaternion>(quat: Readonly<T>, swing: Readonly<Quaternion>): T;
    function getTwistFromSwing<T extends Quaternion>(quat: Readonly<Quaternion>, swing: Readonly<Quaternion>, out: T): T;
    function getTwistFromSwing<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, swing: Readonly<Quaternion>, out: T | U = QuatUtils.clone(quat)): T | U {
        QuatUtils.conjugate(swing, inverse);
        QuatUtils.addRotationQuat(quat, inverse, out);
        return out;
    }

    return getTwistFromSwing;
}();

export function fromTwistSwing<T extends Quaternion>(twist: Readonly<T>, swing: Readonly<Quaternion>): T;
export function fromTwistSwing<T extends Quaternion>(twist: Readonly<Quaternion>, swing: Readonly<Quaternion>, out: T): T;
export function fromTwistSwing<T extends Quaternion, U extends Quaternion>(twist: Readonly<T>, swing: Readonly<Quaternion>, out: T | U = QuatUtils.clone(twist)): T | U {
    return QuatUtils.addRotationQuat(twist, swing, out);
}

export function rotate<T extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>): T;
export function rotate<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Vector3>, out: T): T;
export function rotate<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>, out?: T | U): T | U {
    return QuatUtils.rotateDegrees(first, second, out!);
}

export function rotateDegrees<T extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>): T;
export function rotateDegrees<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Vector3>, out: T): T;
export function rotateDegrees<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>, out?: T | U): T | U {
    return QuatUtils.addRotationDegrees(first, second, out!);
}

export function rotateRadians<T extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>): T;
export function rotateRadians<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Vector3>, out: T): T;
export function rotateRadians<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Vector3>, out?: T | U): T | U {
    return QuatUtils.addRotationRadians(first, second, out!);
}

export function rotateQuat<T extends Quaternion>(first: Readonly<T>, second: Readonly<Quaternion>): T;
export function rotateQuat<T extends Quaternion>(first: Readonly<Quaternion>, second: Readonly<Quaternion>, out: T): T;
export function rotateQuat<T extends Quaternion, U extends Quaternion>(first: Readonly<T>, second: Readonly<Quaternion>, out?: T | U): T | U {
    return QuatUtils.addRotationQuat(first, second, out!);
}

export function rotateAxis<T extends Quaternion>(quat: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
export function rotateAxis<T extends Quaternion>(quat: Readonly<Quaternion>, angle: number, axis: Readonly<Vector3>, out?: T): T;
export function rotateAxis<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
    return QuatUtils.rotateAxisDegrees(quat, angle, axis, out);
}

export const rotateAxisDegrees = function () {
    const secondQuat = create();

    function rotateAxisDegrees<T extends Quaternion>(quat: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    function rotateAxisDegrees<T extends Quaternion>(quat: Readonly<Quaternion>, angle: number, axis: Readonly<Vector3>, out?: T): T;
    function rotateAxisDegrees<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
        QuatUtils.fromAxisDegrees(angle, axis, secondQuat);
        return QuatUtils.rotateQuat(quat, secondQuat, out!);
    }

    return rotateAxisDegrees;
}();

export const rotateAxisRadians = function () {
    const secondQuat = create();

    function rotateAxisRadians<T extends Quaternion>(quat: Readonly<T>, angle: number, axis: Readonly<Vector3>): T;
    function rotateAxisRadians<T extends Quaternion>(quat: Readonly<Quaternion>, angle: number, axis: Readonly<Vector3>, out?: T): T;
    function rotateAxisRadians<T extends Quaternion, U extends Quaternion>(quat: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
        QuatUtils.fromAxisRadians(angle, axis, secondQuat);
        return QuatUtils.rotateQuat(quat, secondQuat, out!);
    }

    return rotateAxisRadians;
}();

/**
 * How to use
 * 
 * By default rotations are in `Degrees` and transforms are `Matrix4` (and not `Quat2`)  
 * For functions that work with rotations, `Matrix` means `Matrix3` and `Quat` means `Quat`  
 * For functions that work with transforms, `Matrix` means `Matrix4` and `Quat` means `Quat2`
 * 
 * For rotations u can add a suffix like `Degrees`/`Radians`/`Quat`/`Matrix` to use a specific version, example:  
 *     - `getAngleRadians`  
 *     - `addRotationQuat`
 * 
 * The functions leave u the choice of forwarding an out parameter or just get the return value, example:  
 *     - `let forward = QuatUtils.getForward(quat)`  
 *     - `QuatUtils.getForward(quat, forward)`  
 *     - the out parameter is always the last one
 */
export const QuatUtils = {
    create,
    getAllocationFunction,
    setAllocationFunction,
    set,
    copy,
    clone,
    equals,
    isNormalized,
    normalize,
    length,
    lengthSquared,
    identity,
    mul,
    invert,
    conjugate,
    lerp,
    interpolate,
    slerp,
    interpolateSpherical,
    getAngle,
    getAngleDegrees,
    getAngleRadians,
    getAxis,
    getAxisScaled,
    getAxisScaledDegrees,
    getAxisScaledRadians,
    getAxes,
    getForward,
    getBackward,
    getLeft,
    getRight,
    getUp,
    getDown,
    setAxes,
    setForward,
    setBackward,
    setUp,
    setDown,
    setLeft,
    setRight,
    toWorld,
    toLocal,
    addRotation,
    addRotationDegrees,
    addRotationRadians,
    addRotationQuat,
    subRotation,
    subRotationDegrees,
    subRotationRadians,
    subRotationQuat,
    rotationTo,
    rotationToDegrees,
    rotationToRadians,
    rotationToQuat,
    rotationAroundAxis,
    rotationAroundAxisDegrees,
    rotationAroundAxisRadians,
    rotationAroundAxisQuat,
    getTwist,
    getSwing,
    getSwingFromTwist,
    getTwistFromSwing,
    fromTwistSwing,
    rotate,
    rotateDegrees,
    rotateRadians,
    rotateQuat,
    rotateAxis,
    rotateAxisDegrees,
    rotateAxisRadians,
    fromDegrees,
    fromRadians,
    fromAxis,
    fromAxisDegrees,
    fromAxisRadians,
    fromAxes,
    toDegrees,
    toRadians,
    toMatrix
} as const;



const _setAxes = function () {
    const fixedAxes = [vec3_utils_create(), vec3_utils_create(), vec3_utils_create()];

    const fixedAxesFixSignMap = [
        [1, -1, 1],
        [1, 1, -1],
        [-1, 1, -1]
    ];

    const fixedLeft = vec3_utils_create();
    const fixedUp = vec3_utils_create();
    const fixedForward = vec3_utils_create();

    const currentAxis = vec3_utils_create();

    const rotationAxis = vec3_utils_create();
    const rotationMat = mat3_utils_create();
    const rotationQuat = create();
    return function _setAxes(quat: Quaternion, axes: Readonly<[Readonly<Vector3> | null, Readonly<Vector3> | null, Readonly<Vector3> | null]>, priority: Readonly<Vector3>): Quaternion {
        const firstAxis = axes[priority[0]];
        const secondAxis = axes[priority[1]];
        const thirdAxis = axes[priority[2]];

        if (firstAxis == null || Vec3Utils.isZero(firstAxis, MathUtils.EPSILON)) {
            return quat;
        }

        let secondAxisValid = false;
        if (secondAxis != null) {
            const angleBetween = Vec3Utils.angleRadians(firstAxis, secondAxis);
            if (angleBetween > MathUtils.EPSILON) {
                secondAxisValid = true;
            }
        }

        let thirdAxisValid = false;
        if (thirdAxis != null) {
            const angleBetween = Vec3Utils.angleRadians(firstAxis, thirdAxis);
            if (angleBetween > MathUtils.EPSILON) {
                thirdAxisValid = true;
            }
        }

        if (secondAxisValid || thirdAxisValid) {
            let crossAxis = null;
            let secondAxisIndex = null;
            let thirdAxisIndex = null;
            if (secondAxisValid) {
                crossAxis = secondAxis;
                secondAxisIndex = 1;
                thirdAxisIndex = 2;
            } else {
                crossAxis = thirdAxis;
                secondAxisIndex = 2;
                thirdAxisIndex = 1;
            }

            const fixSignMap = fixedAxesFixSignMap[priority[0]];

            Vec3Utils.cross(firstAxis, crossAxis!, fixedAxes[thirdAxisIndex]);
            Vec3Utils.scale(fixedAxes[thirdAxisIndex], fixSignMap[priority[thirdAxisIndex]], fixedAxes[thirdAxisIndex]);

            Vec3Utils.cross(firstAxis, fixedAxes[thirdAxisIndex], fixedAxes[secondAxisIndex]);
            Vec3Utils.scale(fixedAxes[secondAxisIndex], fixSignMap[priority[secondAxisIndex]], fixedAxes[secondAxisIndex]);

            Vec3Utils.cross(fixedAxes[1], fixedAxes[2], fixedAxes[0]);
            Vec3Utils.scale(fixedAxes[0], fixSignMap[priority[0]], fixedAxes[0]);

            Vec3Utils.normalize(fixedAxes[ArrayUtils.findIndexEqual(priority, 0)], fixedLeft);
            Vec3Utils.normalize(fixedAxes[ArrayUtils.findIndexEqual(priority, 1)], fixedUp);
            Vec3Utils.normalize(fixedAxes[ArrayUtils.findIndexEqual(priority, 2)], fixedForward);

            Mat3Utils.set(rotationMat,
                fixedLeft[0], fixedLeft[1], fixedLeft[2],
                fixedUp[0], fixedUp[1], fixedUp[2],
                fixedForward[0], fixedForward[1], fixedForward[2]
            );

            Mat3Utils.toQuat(rotationMat, rotationQuat);

            QuatUtils.copy(rotationQuat, quat);
        } else {
            if (priority[0] == 0) {
                QuatUtils.getLeft(quat, currentAxis);
            } else if (priority[0] == 1) {
                QuatUtils.getUp(quat, currentAxis);
            } else {
                QuatUtils.getForward(quat, currentAxis);
            }

            const angleBetween = Vec3Utils.angleRadians(firstAxis, currentAxis);
            if (angleBetween > (Math.PI - MathUtils.EPSILON)) {
                if (priority[1] == 0) {
                    QuatUtils.getLeft(quat, rotationAxis);
                } else if (priority[1] == 1) {
                    QuatUtils.getUp(quat, rotationAxis);
                } else {
                    QuatUtils.getForward(quat, rotationAxis);
                }

                QuatUtils.fromAxisRadians(Math.PI, rotationAxis, rotationQuat);
                QuatUtils.rotateQuat(quat, rotationQuat, quat);
            } else if (angleBetween > MathUtils.EPSILON) {
                Vec3Utils.cross(currentAxis, firstAxis, rotationAxis);
                Vec3Utils.normalize(rotationAxis, rotationAxis);

                if (Vec3Utils.isZero(rotationAxis)) {
                    Vec3Utils.perpendicularAny(currentAxis, rotationAxis);
                    Vec3Utils.normalize(rotationAxis, rotationAxis);
                }

                QuatUtils.fromAxisRadians(angleBetween, rotationAxis, rotationQuat);
                QuatUtils.rotateQuat(quat, rotationQuat, quat);
            }
        }

        return quat;
    };
}();
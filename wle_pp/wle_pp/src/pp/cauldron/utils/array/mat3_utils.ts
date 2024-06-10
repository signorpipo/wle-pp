import { mat3 as gl_mat3, quat as gl_quat, type mat3 as gl_mat3_type, type quat as gl_quat_type } from "gl-matrix";
import { Matrix3, Quaternion, Vector3 } from "../../type_definitions/array_type_definitions.js";
import { QuatUtils, create as quat_utils_create } from "./quat_utils.js";
import { Vec3Utils } from "./vec3_utils.js";

export function create(): Matrix3;
export function create(m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number): Matrix3;
export function create(uniformValue: number): Matrix3;
export function create(
    m00?: number, m01?: number, m02?: number,
    m10?: number, m11?: number, m12?: number,
    m20?: number, m21?: number, m22?: number): Matrix3 {

    const out = gl_mat3.create() as unknown as Matrix3;

    if (m00 != null) {
        Mat3Utils.set(out,
            m00, m01!, m02!,
            m10!, m11!, m12!,
            m20!, m21!, m22!);
    }

    return out;
}

export function set<T extends Matrix3>(matrix: T, m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number): T;
export function set<T extends Matrix3>(matrix: T, uniformValue: number): T;
export function set<T extends Matrix3>(matrix: T,
    m00: number, m01?: number, m02?: number,
    m10?: number, m11?: number, m12?: number,
    m20?: number, m21?: number, m22?: number): T {

    if (m01 == null) {
        gl_mat3.set(matrix as unknown as gl_mat3_type,
            m00!, m00, m00,
            m00, m00, m00,
            m00, m00, m00);
    } else {
        gl_mat3.set(matrix as unknown as gl_mat3_type,
            m00, m01, m02!,
            m10!, m11!, m12!,
            m20!, m21!, m22!);
    }

    return matrix;
}

export function copy<T extends Matrix3>(from: Readonly<Matrix3>, to: T): T {
    gl_mat3.copy(to as unknown as gl_mat3_type, from as unknown as gl_mat3_type);
    return to;
}

/** The overload where `T extends Vector2` does also get `array` as `Readonly<T>`, but is not marked as such due to 
    Typescript having issues with inferring the proper type of `T` when `Readonly` is used */
export function clone<T extends Matrix3>(matrix: Readonly<T>): T;
export function clone(matrix: Readonly<number[]>): number[];
export function clone<T extends Matrix3>(matrix: T): T;
export function clone<T extends Matrix3>(matrix: Readonly<T>): T {
    return matrix.slice(0) as T;
}

export const toDegrees = function () {
    const quat = quat_utils_create();

    function toDegrees(matrix: Readonly<Matrix3>): Vector3;
    function toDegrees<T extends Vector3>(matrix: Readonly<Matrix3>, out: T): T;
    function toDegrees<T extends Vector3>(matrix: Readonly<Matrix3>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        Mat3Utils.toQuat(matrix, quat);
        QuatUtils.toDegrees(quat, out);
        return out;
    }

    return toDegrees;
}();

export const toRadians = function () {
    const quat = quat_utils_create();

    function toRadians(matrix: Readonly<Matrix3>): Vector3;
    function toRadians<T extends Vector3>(matrix: Readonly<Matrix3>, out: T): T;
    function toRadians<T extends Vector3>(matrix: Readonly<Matrix3>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        Mat3Utils.toQuat(matrix, quat);
        QuatUtils.toRadians(quat, out);
        return out;
    }

    return toRadians;
}();

export function toQuat(matrix: Readonly<Matrix3>): Quaternion;
export function toQuat<T extends Quaternion>(matrix: Readonly<Matrix3>, out: T): T;
export function toQuat<T extends Quaternion>(matrix: Readonly<Matrix3>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
    gl_quat.fromMat3(out as unknown as gl_quat_type, matrix as unknown as gl_mat3_type);
    return out;
}

export function fromAxes(left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>): Matrix3;
export function fromAxes<T extends Matrix3>(left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>, out: T): T;
export function fromAxes<T extends Matrix3>(left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>, out: Matrix3 | T = Mat3Utils.create()): Matrix3 | T {
    Mat3Utils.set(out,
        left[0], left[1], left[2],
        up[0], up[1], up[2],
        forward[0], forward[1], forward[2]);
    return out;
}

export const Mat3Utils = {
    create,
    set,
    copy,
    clone,
    toDegrees,
    toRadians,
    toQuat,
    fromAxes
} as const;
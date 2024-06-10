
import { mat4 as gl_mat4, type mat4 as gl_mat4_type, type vec3 as gl_vec3_type } from "gl-matrix";
import { Matrix4, Quaternion, Quaternion2, Vector3 } from "../../type_definitions/array_type_definitions.js";
import { MathUtils } from "../math_utils.js";
import { Quat2Utils } from "./quat2_utils.js";
import { QuatUtils, create as quat_utils_create } from "./quat_utils.js";
import { Vec3Utils, create as vec3_utils_create, set as vec3_utils_set } from "./vec3_utils.js";

export function create(): Matrix4;
export function create(
    m00: number, m01: number, m02: number, m03: number,
    m10: number, m11: number, m12: number, m13: number,
    m20: number, m21: number, m22: number, m23: number,
    m30: number, m31: number, m32: number, m33: number): Matrix4;
export function create(uniformValue: number): Matrix4;
export function create(
    m00?: number, m01?: number, m02?: number, m03?: number,
    m10?: number, m11?: number, m12?: number, m13?: number,
    m20?: number, m21?: number, m22?: number, m23?: number,
    m30?: number, m31?: number, m32?: number, m33?: number): Matrix4 {
    const out = gl_mat4.create() as unknown as Matrix4;

    if (m00 != null) {
        Mat4Utils.set(
            out,
            m00, m01!, m02!, m03!,
            m10!, m11!, m12!, m13!,
            m20!, m21!, m22!, m23!,
            m30!, m31!, m32!, m33!);
    }

    return out;
}

export function set<T extends Matrix4>(matrix: T,
    m00: number, m01: number, m02: number, m03: number,
    m10: number, m11: number, m12: number, m13: number,
    m20: number, m21: number, m22: number, m23: number,
    m30: number, m31: number, m32: number, m33: number): T;
export function set<T extends Matrix4>(matrix: T, uniformValue: number): T;
export function set<T extends Matrix4>(matrix: T,
    m00: number, m01?: number, m02?: number, m03?: number,
    m10?: number, m11?: number, m12?: number, m13?: number,
    m20?: number, m21?: number, m22?: number, m23?: number,
    m30?: number, m31?: number, m32?: number, m33?: number): T {
    if (m01 == null) {
        gl_mat4.set(matrix as unknown as gl_mat4_type,
            m00, m00, m00, m00,
            m00, m00, m00, m00,
            m00, m00, m00, m00,
            m00, m00, m00, m00);
    } else {
        gl_mat4.set(matrix as unknown as gl_mat4_type,
            m00, m01, m02!, m03!,
            m10!, m11!, m12!, m13!,
            m20!, m21!, m22!, m23!,
            m30!, m31!, m32!, m33!);
    }

    return matrix;
}

export function copy<T extends Matrix4>(from: Readonly<Matrix4>, to: T): T {
    gl_mat4.copy(to as unknown as gl_mat4_type, from as unknown as gl_mat4_type);
    return to;
}

/** The overload where `T extends Matrix4` does also get `array` as `Readonly<T>`, but is not marked as such due to 
    Typescript having issues with inferring the proper type of `T` when `Readonly` is used */
export function clone<T extends Matrix4>(matrix: Readonly<T>): T;
export function clone(matrix: Readonly<number[]>): number[];
export function clone<T extends Matrix4>(matrix: T): T;
export function clone<T extends Matrix4>(matrix: Readonly<T>): T {
    return matrix.slice(0) as T;
}

export function identity<T extends Matrix4>(matrix: T): T {
    gl_mat4.identity(matrix as unknown as gl_mat4_type);
    return matrix;
}

export function invert<T extends Matrix4>(matrix: Readonly<T>): T;
export function invert<T extends Matrix4>(matrix: Readonly<Matrix4>, out: T): T;
export function invert<T extends Matrix4, U extends Matrix4>(matrix: Readonly<T>, out: T | U = Mat4Utils.clone(matrix)): T | U {
    gl_mat4.invert(out as unknown as gl_mat4_type, matrix as unknown as gl_mat4_type);
    return out;
}

export function mul<T extends Matrix4>(first: Readonly<T>, second: Readonly<Matrix4>): T;
export function mul<T extends Matrix4>(first: Readonly<Matrix4>, second: Readonly<Matrix4>, out: T): T;
export function mul<T extends Matrix4, U extends Matrix4>(first: Readonly<T>, second: Readonly<Matrix4>, out: T | U = Mat4Utils.clone(first)): T | U {
    gl_mat4.mul(out as unknown as gl_mat4_type, first as unknown as gl_mat4_type, second as unknown as gl_mat4_type);
    return out;
}

export function scale<T extends Matrix4>(matrix: Readonly<T>, vector: Readonly<Vector3>): T;
export function scale<T extends Matrix4>(matrix: Readonly<Matrix4>, vector: Readonly<Vector3>, out: T): T;
export function scale<T extends Matrix4, U extends Matrix4>(matrix: Readonly<T>, vector: Readonly<Vector3>, out: T | U = Mat4Utils.clone(matrix)): T | U {
    gl_mat4.scale(out as unknown as gl_mat4_type, matrix as unknown as gl_mat4_type, vector as unknown as gl_vec3_type);
    return out;
}

export function getPosition(matrix: Readonly<Matrix4>): Vector3;
export function getPosition<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
export function getPosition<T extends Vector3>(matrix: Readonly<Matrix4>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    gl_mat4.getTranslation(out as unknown as gl_vec3_type, matrix as unknown as gl_mat4_type);
    return out;
}

export function getRotation(matrix: Readonly<Matrix4>): Vector3;
export function getRotation<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
export function getRotation<T extends Vector3>(matrix: Readonly<Matrix4>, out?: Vector3 | T): Vector3 | T {
    return Mat4Utils.getRotationDegrees(matrix, out!);
}

export const getRotationDegrees = function () {
    const quat = quat_utils_create();

    function getRotationDegrees(matrix: Readonly<Matrix4>): Vector3;
    function getRotationDegrees<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
    function getRotationDegrees<T extends Vector3>(matrix: Readonly<Matrix4>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        Mat4Utils.getRotationQuat(matrix, quat);
        QuatUtils.toDegrees(quat, out);
        return out;
    }

    return getRotationDegrees;
}();

export const getRotationRadians = function () {
    const quat = quat_utils_create();

    function getRotationRadians(matrix: Readonly<Matrix4>): Vector3;
    function getRotationRadians<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
    function getRotationRadians<T extends Vector3>(matrix: Readonly<Matrix4>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        Mat4Utils.getRotationQuat(matrix, quat);
        QuatUtils.toRadians(quat, out);
        return out;
    }

    return getRotationRadians;
}();

export const getRotationQuat = function () {
    const tempScale = vec3_utils_create();
    const transformMatrixNoScale = create();
    const inverseScale = vec3_utils_create();
    const one = vec3_utils_create();
    vec3_utils_set(one, 1, 1, 1);

    function getRotationQuat(matrix: Readonly<Matrix4>): Quaternion;
    function getRotationQuat<T extends Quaternion>(matrix: Readonly<Matrix4>, out: T): T;
    function getRotationQuat<T extends Quaternion>(matrix: Readonly<Matrix4>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
        Mat4Utils.getScale(matrix, tempScale);
        Vec3Utils.div(one, tempScale, inverseScale);
        Mat4Utils.scale(matrix, inverseScale, transformMatrixNoScale);
        _customGLMatrixGetRotation(out, transformMatrixNoScale);
        return out;
    }

    return getRotationQuat;
}();

export function getScale(matrix: Readonly<Matrix4>): Vector3;
export function getScale<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
export function getScale<T extends Vector3>(matrix: Readonly<Matrix4>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    gl_mat4.getScaling(out as unknown as gl_vec3_type, matrix as unknown as gl_mat4_type);
    return out;
}

export function setPosition<T extends Matrix4>(matrix: T, position: Readonly<Vector3>): T {
    matrix[12] = position[0];
    matrix[13] = position[1];
    matrix[14] = position[2];
    return matrix;
}

export function setRotation<T extends Matrix4>(matrix: T, rotation: Readonly<Vector3>): T {
    Mat4Utils.setRotationDegrees(matrix, rotation);
    return matrix;
}

export const setRotationDegrees = function () {
    const quat = quat_utils_create();
    return function setRotationDegrees<T extends Matrix4>(matrix: T, rotation: Readonly<Vector3>): T {
        Mat4Utils.setRotationQuat(matrix, Vec3Utils.degreesToQuat(rotation, quat));
        return matrix;
    };
}();

export const setRotationRadians = function () {
    const vector = vec3_utils_create();
    return function setRotationRadians<T extends Matrix4>(matrix: T, rotation: Readonly<Vector3>): T {
        Mat4Utils.setRotationDegrees(matrix, Vec3Utils.toDegrees(rotation, vector));
        return matrix;
    };
}();

export const setRotationQuat = function () {
    const position = vec3_utils_create();
    const scale = vec3_utils_create();
    return function setRotationQuat<T extends Matrix4>(matrix: T, rotation: Readonly<Quaternion>): T {
        Mat4Utils.getPosition(matrix, position);
        Mat4Utils.getScale(matrix, scale);
        Mat4Utils.setPositionRotationQuatScale(matrix, position, rotation, scale);
        return matrix;
    };
}();

export const setScale = function () {
    const tempScale = vec3_utils_create();
    return function setScale<T extends Matrix4>(matrix: T, scale: Readonly<Vector3>): T {
        Mat4Utils.getScale(matrix, tempScale);
        Vec3Utils.div(scale, tempScale, tempScale);
        Mat4Utils.scale(matrix, tempScale, matrix);
        return matrix;
    };
}();

export function setPositionRotationScale<T extends Matrix4>(matrix: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>, scale: Readonly<Vector3>): T {
    Mat4Utils.setPositionRotationDegreesScale(matrix, position, rotation, scale);
    return matrix;
}

export const setPositionRotationDegreesScale = function () {
    const quat = quat_utils_create();
    return function setPositionRotationDegreesScale<T extends Matrix4>(matrix: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>, scale: Readonly<Vector3>): T {
        Mat4Utils.setPositionRotationQuatScale(matrix, position, Vec3Utils.degreesToQuat(rotation, quat), scale);
        return matrix;
    };
}();

export const setPositionRotationRadiansScale = function () {
    const vector = vec3_utils_create();
    return function setPositionRotationRadiansScale<T extends Matrix4>(matrix: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>, scale: Readonly<Vector3>): T {
        Mat4Utils.setPositionRotationDegreesScale(matrix, position, Vec3Utils.toDegrees(rotation, vector), scale);
        return matrix;
    };
}();

export function setPositionRotationQuatScale<T extends Matrix4>(matrix: T, position: Readonly<Vector3>, rotation: Readonly<Quaternion>, scale: Readonly<Vector3>): T {
    gl_mat4.fromRotationTranslationScale(matrix as unknown as gl_mat4_type, rotation as unknown as gl_vec3_type, position as unknown as gl_vec3_type, scale as unknown as gl_vec3_type);
    return matrix;
}

export function setPositionRotation<T extends Matrix4>(matrix: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
    Mat4Utils.setPositionRotationDegrees(matrix, position, rotation);
    return matrix;
}

export const setPositionRotationDegrees = function () {
    const quat = quat_utils_create();
    return function setPositionRotationDegrees<T extends Matrix4>(matrix: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
        Mat4Utils.setPositionRotationQuat(matrix, position, Vec3Utils.degreesToQuat(rotation, quat));
        return matrix;
    };
}();

export const setPositionRotationRadians = function () {
    const vector = vec3_utils_create();
    return function setPositionRotationRadians<T extends Matrix4>(matrix: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
        Mat4Utils.setPositionRotationDegrees(matrix, position, Vec3Utils.toDegrees(rotation, vector));
        return matrix;
    };
}();

export function setPositionRotationQuat<T extends Matrix4>(matrix: T, position: Readonly<Vector3>, rotation: Readonly<Quaternion>): T {
    gl_mat4.fromRotationTranslation(matrix as unknown as gl_mat4_type, rotation as unknown as gl_vec3_type, position as unknown as gl_vec3_type);
    return matrix;
}

export function getAxes(matrix: Readonly<Matrix4>): [Vector3, Vector3, Vector3];
export function getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(matrix: Readonly<Matrix4>, out: [T, U, V]): [T, U, V];
export function getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(matrix: Readonly<Matrix4>, out: [Vector3, Vector3, Vector3] | [T, U, V] = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]): [Vector3, Vector3, Vector3] | [T, U, V] {
    Mat4Utils.getLeft(matrix, out[0]);
    Mat4Utils.getUp(matrix, out[1]);
    Mat4Utils.getForward(matrix, out[2]);

    return out;
}

export function getForward(matrix: Readonly<Matrix4>): Vector3;
export function getForward<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
export function getForward<T extends Vector3>(matrix: Readonly<Matrix4>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    Vec3Utils.set(out, matrix[8], matrix[9], matrix[10]);
    Vec3Utils.normalize(out, out);
    return out;
}

export function getBackward(matrix: Readonly<Matrix4>): Vector3;
export function getBackward<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
export function getBackward<T extends Vector3>(matrix: Readonly<Matrix4>, out?: Vector3 | T): Vector3 | T {
    out = Mat4Utils.getForward(matrix, out!);
    Vec3Utils.negate(out, out);
    return out;
}

export function getLeft(matrix: Readonly<Matrix4>): Vector3;
export function getLeft<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
export function getLeft<T extends Vector3>(matrix: Readonly<Matrix4>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    Vec3Utils.set(out, matrix[0], matrix[1], matrix[2]);
    Vec3Utils.normalize(out, out);
    return out;
}

export function getRight(matrix: Readonly<Matrix4>): Vector3;
export function getRight<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
export function getRight<T extends Vector3>(matrix: Readonly<Matrix4>, out?: Vector3 | T): Vector3 | T {
    out = Mat4Utils.getLeft(matrix, out!);
    Vec3Utils.negate(out, out);
    return out;
}

export function getUp(matrix: Readonly<Matrix4>): Vector3;
export function getUp<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
export function getUp<T extends Vector3>(matrix: Readonly<Matrix4>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    Vec3Utils.set(out, matrix[4], matrix[5], matrix[6]);
    Vec3Utils.normalize(out, out);
    return out;
}

export function getDown(matrix: Readonly<Matrix4>): Vector3;
export function getDown<T extends Vector3>(matrix: Readonly<Matrix4>, out: T): T;
export function getDown<T extends Vector3>(matrix: Readonly<Matrix4>, out?: Vector3 | T): Vector3 | T {
    out = Mat4Utils.getUp(matrix, out!);
    Vec3Utils.negate(out, out);
    return out;
}

export const hasUniformScale = function () {
    const scale = vec3_utils_create();
    return function hasUniformScale(matrix: Readonly<Matrix4>): boolean {
        Mat4Utils.getScale(matrix, scale);
        return Math.abs(scale[0] - scale[1]) < MathUtils.EPSILON && Math.abs(scale[1] - scale[2]) < MathUtils.EPSILON && Math.abs(scale[0] - scale[2]) < MathUtils.EPSILON;
    };
}();

export const toWorld = function () {
    const convertTransform = create();
    const position = vec3_utils_create();
    const tempScale = vec3_utils_create();
    const inverseScale = vec3_utils_create();
    const one = vec3_utils_create();
    vec3_utils_set(one, 1, 1, 1);

    function toWorld<T extends Matrix4>(matrix: Readonly<T>, parentTransformMatrix: Readonly<Matrix4>): T;
    function toWorld<T extends Matrix4>(matrix: Readonly<Matrix4>, parentTransformMatrix: Readonly<Matrix4>, out: T): T;
    function toWorld<T extends Matrix4, U extends Matrix4>(matrix: Readonly<T>, parentTransformMatrix: Readonly<Matrix4>, out: T | U = Mat4Utils.clone(matrix)): T | U {
        if (Mat4Utils.hasUniformScale(parentTransformMatrix)) {
            Mat4Utils.mul(parentTransformMatrix, matrix, out);
        } else {
            Vec3Utils.set(position, matrix[12], matrix[13], matrix[14]);
            Vec3Utils.convertPositionToWorldMatrix(position, parentTransformMatrix, position);

            Mat4Utils.getScale(parentTransformMatrix, tempScale);
            Vec3Utils.div(one, tempScale, inverseScale);
            Mat4Utils.scale(parentTransformMatrix, inverseScale, convertTransform);

            Mat4Utils.mul(convertTransform, matrix, out);
            Mat4Utils.scale(out, tempScale, out);

            out[12] = position[0];
            out[13] = position[1];
            out[14] = position[2];
            out[15] = 1;
        }
        return out;
    }

    return toWorld;
}();

export const toLocal = function () {
    const convertTransform = create();
    const position = vec3_utils_create();
    const tempScale = vec3_utils_create();
    const inverseScale = vec3_utils_create();
    const one = vec3_utils_create();
    vec3_utils_set(one, 1, 1, 1);

    function toLocal<T extends Matrix4>(matrix: Readonly<T>, parentTransformMatrix: Readonly<Matrix4>): T;
    function toLocal<T extends Matrix4>(matrix: Readonly<Matrix4>, parentTransformMatrix: Readonly<Matrix4>, out: T): T;
    function toLocal<T extends Matrix4, U extends Matrix4>(matrix: Readonly<T>, parentTransformMatrix: Readonly<Matrix4>, out: T | U = Mat4Utils.clone(matrix)): T | U {
        if (Mat4Utils.hasUniformScale(parentTransformMatrix)) {
            Mat4Utils.invert(parentTransformMatrix, convertTransform);
            Mat4Utils.mul(convertTransform, matrix, out);
        } else {
            Vec3Utils.set(position, matrix[12], matrix[13], matrix[14]);
            Vec3Utils.convertPositionToLocalMatrix(position, parentTransformMatrix, position);

            Mat4Utils.getScale(parentTransformMatrix, tempScale);
            Vec3Utils.div(one, tempScale, inverseScale);
            Mat4Utils.scale(parentTransformMatrix, inverseScale, convertTransform);

            Mat4Utils.invert(convertTransform, convertTransform);
            Mat4Utils.mul(convertTransform, matrix, out);
            Mat4Utils.scale(out, inverseScale, out);

            out[12] = position[0];
            out[13] = position[1];
            out[14] = position[2];
            out[15] = 1;
        }
        return out;
    }

    return toLocal;
}();

export const toQuat = function () {
    const position = vec3_utils_create();
    const rotation = quat_utils_create();

    function toQuat(matrix: Readonly<Matrix4>): Quaternion2;
    function toQuat<T extends Quaternion2>(matrix: Readonly<Matrix4>, out: T): T;
    function toQuat<T extends Quaternion2>(matrix: Readonly<Matrix4>, out: Quaternion2 | T = Quat2Utils.create()): Quaternion2 | T {
        Mat4Utils.getPosition(matrix, position);
        Mat4Utils.getRotationQuat(matrix, rotation);
        Quat2Utils.setPositionRotationQuat(out, position, rotation);
        return out;
    }

    return toQuat;
}();

export function fromQuat(quat: Readonly<Quaternion2>): Matrix4;
export function fromQuat<T extends Matrix4>(quat: Readonly<Quaternion2>, out: T): T;
export function fromQuat<T extends Matrix4>(quat: Readonly<Quaternion2>, out: Matrix4 | T = Mat4Utils.create()): Matrix4 | T {
    Quat2Utils.toMatrix(quat, out);
    return out;
}

/**
 * How to use
 * 
 * By default rotations are in `Degrees` and transforms are `Matrix4` (and not `Quat2`)  
 * For functions that work with rotations, `Matrix` means `Matrix3` and `Quat` means `Quat`  
 * For functions that work with transforms, `Matrix` means `Matrix4` and `Quat` means `Quat2`
 * 
 * For rotations u can add a suffix like `Degrees`/`Radians`/`Quat`/`Matrix` to use a specific version, example:  
 *     - `getRotationRadians`  
 *     - `setRotationQuat`
 * 
 * The functions leave u the choice of forwarding an out parameter or just get the return value, example:  
 *     - `let position = Mat4Utils.getPosition(matrix)`  
 *     - `Mat4Utils.getPosition(matrix, position)`  
 *     - the out parameter is always the last one
 */
export const Mat4Utils = {
    create,
    set,
    copy,
    clone,
    identity,
    invert,
    mul,
    scale,
    getPosition,
    getRotation,
    getRotationDegrees,
    getRotationRadians,
    getRotationQuat,
    getScale,
    setPosition,
    setRotation,
    setRotationDegrees,
    setRotationRadians,
    setRotationQuat,
    setScale,
    setPositionRotationScale,
    setPositionRotationDegreesScale,
    setPositionRotationRadiansScale,
    setPositionRotationQuatScale,
    setPositionRotation,
    setPositionRotationDegrees,
    setPositionRotationRadians,
    setPositionRotationQuat,
    getAxes,
    getForward,
    getBackward,
    getLeft,
    getRight,
    getUp,
    getDown,
    hasUniformScale,
    toWorld,
    toLocal,
    toQuat,
    fromQuat
} as const;



/** This is used in place of the glMatrix one to avoid the array allocation */
const _customGLMatrixGetRotation = function () {
    const scaling = vec3_utils_create();
    return function _customGLMatrixGetRotation(out: Quaternion, mat: Matrix4): Quaternion {
        gl_mat4.getScaling(scaling as unknown as gl_vec3_type, mat as unknown as gl_mat4_type);

        const is1 = 1 / scaling[0];
        const is2 = 1 / scaling[1];
        const is3 = 1 / scaling[2];

        const sm11 = mat[0] * is1;
        const sm12 = mat[1] * is2;
        const sm13 = mat[2] * is3;
        const sm21 = mat[4] * is1;
        const sm22 = mat[5] * is2;
        const sm23 = mat[6] * is3;
        const sm31 = mat[8] * is1;
        const sm32 = mat[9] * is2;
        const sm33 = mat[10] * is3;

        const trace = sm11 + sm22 + sm33;

        if (trace > 0) {
            const s = Math.sqrt(trace + 1.0) * 2;
            out[3] = 0.25 * s;
            out[0] = (sm23 - sm32) / s;
            out[1] = (sm31 - sm13) / s;
            out[2] = (sm12 - sm21) / s;
        } else if (sm11 > sm22 && sm11 > sm33) {
            const s = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
            out[3] = (sm23 - sm32) / s;
            out[0] = 0.25 * s;
            out[1] = (sm12 + sm21) / s;
            out[2] = (sm31 + sm13) / s;
        } else if (sm22 > sm33) {
            const s = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
            out[3] = (sm31 - sm13) / s;
            out[0] = (sm12 + sm21) / s;
            out[1] = 0.25 * s;
            out[2] = (sm23 + sm32) / s;
        } else {
            const s = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
            out[3] = (sm12 - sm21) / s;
            out[0] = (sm31 + sm13) / s;
            out[1] = (sm23 + sm32) / s;
            out[2] = 0.25 * s;
        }

        return out;
    };
}();
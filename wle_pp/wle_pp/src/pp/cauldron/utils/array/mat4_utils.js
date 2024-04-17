
import { mat4 as gl_mat4 } from "gl-matrix";
import { MathUtils } from "../math_utils.js";
import { Quat2Utils } from "./quat2_utils.js";
import { QuatUtils, create as quat_utils_create } from "./quat_utils.js";
import { Vec3Utils, create as vec3_utils_create, set as vec3_utils_set } from "./vec3_utils.js";

export function create(
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33) {
    let out = gl_mat4.create();
    if (m00 != null) {
        set(
            out,
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33);
    }
    return out;
}

export function set(matrix,
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33) {
    if (m01 == null) {
        gl_mat4.set(matrix,
            m00, m00, m00, m00,
            m00, m00, m00, m00,
            m00, m00, m00, m00,
            m00, m00, m00, m00);
    } else {
        gl_mat4.set(matrix,
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33);
    }
    return matrix;
}

export function copy(from, to) {
    gl_mat4.copy(to, from);
    return to;
}

export function identity(matrix) {
    gl_mat4.identity(matrix);
    return matrix;
}

export function invert(matrix, out = Mat4Utils.create()) {
    gl_mat4.invert(out, matrix);
    return out;
}

export function mul(first, second, out = Mat4Utils.create()) {
    gl_mat4.mul(out, first, second);
    return out;
}

export function scale(matrix, vector, out = Mat4Utils.create()) {
    gl_mat4.scale(out, matrix, vector);
    return out;
}

export function clone(matrix, out = Mat4Utils.create()) {
    Mat4Utils.copy(matrix, out);
    return out;
}

export function getPosition(matrix, out = Vec3Utils.create()) {
    gl_mat4.getTranslation(out, matrix);
    return out;
}

export function getRotation(matrix, out = Vec3Utils.create()) {
    return Mat4Utils.getRotationDegrees(matrix, out);
}

export let getRotationDegrees = function () {
    let quat = quat_utils_create();
    return function getRotationDegrees(matrix, out = Vec3Utils.create()) {
        Mat4Utils.getRotationQuat(matrix, quat);
        QuatUtils.toDegrees(quat, out);
        return out;
    };
}();

export let getRotationRadians = function () {
    let quat = quat_utils_create();
    return function getRotationRadians(matrix, out = Vec3Utils.create()) {
        Mat4Utils.getRotationQuat(matrix, quat);
        QuatUtils.toRadians(quat, out);
        return out;
    };
}();

export let getRotationQuat = function () {
    let tempScale = vec3_utils_create();
    let transformMatrixNoScale = create();
    let inverseScale = vec3_utils_create();
    let one = vec3_utils_create();
    vec3_utils_set(one, 1, 1, 1);
    return function getRotationQuat(matrix, out = QuatUtils.create()) {
        Mat4Utils.getScale(matrix, tempScale);
        Vec3Utils.div(one, tempScale, inverseScale);
        Mat4Utils.scale(matrix, inverseScale, transformMatrixNoScale);
        _customGLMatrixGetRotation(out, transformMatrixNoScale);
        return out;
    };
}();

export function getScale(matrix, out = Vec3Utils.create()) {
    gl_mat4.getScaling(out, matrix);
    return out;
}

export function setPosition(matrix, position) {
    matrix[12] = position[0];
    matrix[13] = position[1];
    matrix[14] = position[2];
    return matrix;
}

export function setRotation(matrix, rotation) {
    Mat4Utils.setRotationDegrees(matrix, rotation);
    return matrix;
}

export let setRotationDegrees = function () {
    let quat = quat_utils_create();
    return function setRotationDegrees(matrix, rotation) {
        Mat4Utils.setRotationQuat(matrix, Vec3Utils.degreesToQuat(rotation, quat));
        return matrix;
    };
}();

export let setRotationRadians = function () {
    let vector = vec3_utils_create();
    return function setRotationRadians(matrix, rotation) {
        Mat4Utils.setRotationDegrees(matrix, Vec3Utils.toDegrees(rotation, vector));
        return matrix;
    };
}();

export let setRotationQuat = function () {
    let position = vec3_utils_create();
    let scale = vec3_utils_create();
    return function setRotationQuat(matrix, rotation) {
        Mat4Utils.getPosition(matrix, position);
        Mat4Utils.getScale(matrix, scale);
        Mat4Utils.setPositionRotationQuatScale(matrix, position, rotation, scale);
        return matrix;
    };
}();

export let setScale = function () {
    let tempScale = vec3_utils_create();
    return function setScale(matrix, scaleToSet) {
        Mat4Utils.getScale(matrix, tempScale);
        Vec3Utils.div(scaleToSet, tempScale, tempScale);
        Mat4Utils.scale(matrix, tempScale, matrix);
        return matrix;
    };
}();

export function setPositionRotationScale(matrix, position, rotation, scale) {
    Mat4Utils.setPositionRotationDegreesScale(matrix, position, rotation, scale);
    return matrix;
}

export let setPositionRotationDegreesScale = function () {
    let quat = quat_utils_create();
    return function setPositionRotationDegreesScale(matrix, position, rotation, scale) {
        Mat4Utils.setPositionRotationQuatScale(matrix, position, Vec3Utils.degreesToQuat(rotation, quat), scale);
        return matrix;
    };
}();

export let setPositionRotationRadiansScale = function () {
    let vector = vec3_utils_create();
    return function setPositionRotationRadiansScale(matrix, position, rotation, scale) {
        Mat4Utils.setPositionRotationDegreesScale(matrix, position, Vec3Utils.toDegrees(rotation, vector), scale);
        return matrix;
    };
}();

export function setPositionRotationQuatScale(matrix, position, rotation, scale) {
    gl_mat4.fromRotationTranslationScale(matrix, rotation, position, scale);
    return matrix;
}

export function setPositionRotation(matrix, position, rotation) {
    Mat4Utils.setPositionRotationDegrees(matrix, position, rotation);
    return matrix;
}

export let setPositionRotationDegrees = function () {
    let quat = quat_utils_create();
    return function setPositionRotationDegrees(matrix, position, rotation) {
        Mat4Utils.setPositionRotationQuat(matrix, position, Vec3Utils.degreesToQuat(rotation, quat));
        return matrix;
    };
}();

export let setPositionRotationRadians = function () {
    let vector = vec3_utils_create();
    return function setPositionRotationRadians(matrix, position, rotation) {
        Mat4Utils.setPositionRotationDegrees(matrix, position, Vec3Utils.toDegrees(rotation, vector));
        return matrix;
    };
}();

export function setPositionRotationQuat(matrix, position, rotation) {
    gl_mat4.fromRotationTranslation(matrix, rotation, position);
    return matrix;
}

export function getAxes(matrix, out = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]) {
    Mat4Utils.getLeft(matrix, out[0]);
    Mat4Utils.getUp(matrix, out[1]);
    Mat4Utils.getForward(matrix, out[2]);

    return out;
}

export function getForward(matrix, out = Vec3Utils.create()) {
    Vec3Utils.set(out, matrix[8], matrix[9], matrix[10]);
    Vec3Utils.normalize(out, out);
    return out;
}

export function getBackward(matrix, out) {
    out = Mat4Utils.getForward(matrix, out);
    Vec3Utils.negate(out, out);
    return out;
}

export function getLeft(matrix, out = Vec3Utils.create()) {
    Vec3Utils.set(out, matrix[0], matrix[1], matrix[2]);
    Vec3Utils.normalize(out, out);
    return out;
}

export function getRight(matrix, out) {
    out = Mat4Utils.getLeft(matrix, out);
    Vec3Utils.negate(out, out);
    return out;
}

export function getUp(matrix, out = Vec3Utils.create()) {
    Vec3Utils.set(out, matrix[4], matrix[5], matrix[6]);
    Vec3Utils.normalize(out, out);
    return out;
}

export function getDown(matrix, out) {
    out = Mat4Utils.getUp(matrix, out);
    Vec3Utils.negate(out, out);
    return out;
}

export let toWorld = function () {
    let convertTransform = create();
    let position = vec3_utils_create();
    let tempScale = vec3_utils_create();
    let inverseScale = vec3_utils_create();
    let one = vec3_utils_create();
    vec3_utils_set(one, 1, 1, 1);
    return function toWorld(matrix, parentTransformMatrix, out = Mat4Utils.create()) {
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
    };
}();

export let toLocal = function () {
    let convertTransform = create();
    let position = vec3_utils_create();
    let tempScale = vec3_utils_create();
    let inverseScale = vec3_utils_create();
    let one = vec3_utils_create();
    vec3_utils_set(one, 1, 1, 1);
    return function toLocal(matrix, parentTransformMatrix, out = Mat4Utils.create()) {
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
    };
}();

export let hasUniformScale = function () {
    let scale = vec3_utils_create();
    return function hasUniformScale(matrix) {
        Mat4Utils.getScale(matrix, scale);
        return Math.abs(scale[0] - scale[1]) < MathUtils.EPSILON && Math.abs(scale[1] - scale[2]) < MathUtils.EPSILON && Math.abs(scale[0] - scale[2]) < MathUtils.EPSILON;
    };
}();

export let toQuat = function () {
    let position = vec3_utils_create();
    let rotation = quat_utils_create();
    return function toQuat(matrix, out = Quat2Utils.create()) {
        Mat4Utils.getPosition(matrix, position);
        Mat4Utils.getRotationQuat(matrix, rotation);
        Quat2Utils.setPositionRotationQuat(out, position, rotation);
        return out;
    };
}();

export function fromQuat(quat, out = Mat4Utils.create()) {
    Quat2Utils.toMatrix(quat, out);
    return out;
}

export let Mat4Utils = {
    create,
    set,
    copy,
    identity,
    invert,
    mul,
    scale,
    clone,
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
    toWorld,
    toLocal,
    hasUniformScale,
    toQuat,
    fromQuat
};




// This is used in place of the glMatrix one to avoid the array allocation
let _customGLMatrixGetRotation = function () {
    let scaling = vec3_utils_create();
    return function _customGLMatrixGetRotation(out, mat) {
        gl_mat4.getScaling(scaling, mat);

        let is1 = 1 / scaling[0];
        let is2 = 1 / scaling[1];
        let is3 = 1 / scaling[2];

        let sm11 = mat[0] * is1;
        let sm12 = mat[1] * is2;
        let sm13 = mat[2] * is3;
        let sm21 = mat[4] * is1;
        let sm22 = mat[5] * is2;
        let sm23 = mat[6] * is3;
        let sm31 = mat[8] * is1;
        let sm32 = mat[9] * is2;
        let sm33 = mat[10] * is3;

        let trace = sm11 + sm22 + sm33;

        if (trace > 0) {
            let s = Math.sqrt(trace + 1.0) * 2;
            out[3] = 0.25 * s;
            out[0] = (sm23 - sm32) / s;
            out[1] = (sm31 - sm13) / s;
            out[2] = (sm12 - sm21) / s;
        } else if (sm11 > sm22 && sm11 > sm33) {
            let s = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
            out[3] = (sm23 - sm32) / s;
            out[0] = 0.25 * s;
            out[1] = (sm12 + sm21) / s;
            out[2] = (sm31 + sm13) / s;
        } else if (sm22 > sm33) {
            let s = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
            out[3] = (sm31 - sm13) / s;
            out[0] = (sm12 + sm21) / s;
            out[1] = 0.25 * s;
            out[2] = (sm23 + sm32) / s;
        } else {
            let s = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
            out[3] = (sm12 - sm21) / s;
            out[0] = (sm31 + sm13) / s;
            out[1] = (sm23 + sm32) / s;
            out[2] = 0.25 * s;
        }

        return out;
    };
}();
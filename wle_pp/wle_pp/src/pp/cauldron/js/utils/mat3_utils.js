import { mat3 as gl_mat3, quat as gl_quat } from "gl-matrix";
import { QuatUtils, create as quat_utils_create } from "./quat_utils";
import { Vec3Utils } from "./vec3_utils";

// glMatrix Bridge

export function create(
    m00, m01, m02,
    m10, m11, m12,
    m20, m21, m22) {
    let out = gl_mat3.create();

    if (m00 !== undefined) {
        set(out,
            m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22);
    }

    return out;
}

export function set(matrix,
    m00, m01, m02,
    m10, m11, m12,
    m20, m21, m22) {
    if (m01 === undefined) {
        gl_mat3.set(matrix,
            m00, m00, m00,
            m00, m00, m00,
            m00, m00, m00);
    } else {
        gl_mat3.set(matrix,
            m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22);
    }
    return matrix;
}

// New Functions

export let toDegrees = function () {
    let quat = quat_utils_create();
    return function toDegrees(matrix, out = Vec3Utils.create()) {
        Mat3Utils.toQuat(matrix, quat);
        QuatUtils.toDegrees(quat, out);
        return out;
    };
}();

export let toRadians = function () {
    let quat = quat_utils_create();
    return function toRadians(matrix, out = Vec3Utils.create()) {
        Mat3Utils.toQuat(matrix, quat);
        QuatUtils.toRadians(quat, out);
        return out;
    };
}();

export function toQuat(matrix, out = QuatUtils.create()) {
    gl_quat.fromMat3(out, matrix);
    return out;
}

export function fromAxes(leftAxis, upAxis, forwardAxis, out = Mat3Utils.create()) {
    Mat3Utils.set(out,
        leftAxis[0], leftAxis[1], leftAxis[2],
        upAxis[0], upAxis[1], upAxis[2],
        forwardAxis[0], forwardAxis[1], forwardAxis[2]);
    return out;
}

export let Mat3Utils = {
    create,
    set,
    toDegrees,
    toRadians,
    toQuat,
    fromAxes
};
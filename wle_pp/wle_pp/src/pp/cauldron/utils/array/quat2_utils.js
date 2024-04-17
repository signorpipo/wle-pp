import { mat4 as gl_mat4, quat2 as gl_quat2 } from "gl-matrix";
import { EasingFunction, MathUtils } from "../math_utils.js";
import { create as mat3_utils_create } from "./mat3_utils.js";
import { Mat4Utils } from "./mat4_utils.js";
import { QuatUtils, create as quat_utils_create } from "./quat_utils.js";
import { Vec3Utils, create as vec3_utils_create } from "./vec3_utils.js";

export function create(x1, y1, z1, w1, x2, y2, z2, w2) {
    let out = gl_quat2.create();
    if (x1 != null) {
        set(out, x1, y1, z1, w1, x2, y2, z2, w2);
    }
    return out;
}

export function set(quat, x1, y1, z1, w1, x2, y2, z2, w2) {
    if (y1 == null) {
        gl_quat2.set(quat, x1, x1, x1, x1, x1, x1, x1, x1);
    } else {
        gl_quat2.set(quat, x1, y1, z1, w1, x2, y2, z2, w2);
    }

    return quat;
}

export function normalize(quat, out = Quat2Utils.create()) {
    gl_quat2.normalize(out, quat);
    return out;
}

export function invert(quat, out = Quat2Utils.create()) {
    gl_quat2.invert(out, quat);
    return out;
}

export function conjugate(quat, out = Quat2Utils.create()) {
    gl_quat2.conjugate(out, quat);
    return out;
}

export function copy(from, to) {
    gl_quat2.copy(to, from);
    return to;
}

export function identity(quat) {
    gl_quat2.identity(quat);
    return quat;
}

export function getPosition(quat, out = Vec3Utils.create()) {
    gl_quat2.getTranslation(out, quat);
    return out;
}

export function getRotation(quat, out) {
    return Quat2Utils.getRotationDegrees(quat, out);
}

export let getRotationDegrees = function () {
    let rotationQuat = quat_utils_create();
    return function getRotationDegrees(quat, out = Vec3Utils.create()) {
        QuatUtils.toDegrees(Quat2Utils.getRotationQuat(quat, rotationQuat), out);
        return out;
    };
}();

export let getRotationRadians = function () {
    let rotationQuat = quat_utils_create();
    return function getRotationRadians(quat, out = Vec3Utils.create()) {
        QuatUtils.toRadians(Quat2Utils.getRotationQuat(quat, rotationQuat), out);
        return out;
    };
}();

export function getRotationQuat(quat, out = QuatUtils.create()) {
    QuatUtils.copy(quat, out);
    return out;
}

export let setPosition = function () {
    let rotationQuat = quat_utils_create();
    return function setPosition(quat, position) {
        Quat2Utils.getRotationQuat(quat, rotationQuat);
        Quat2Utils.setPositionRotationQuat(quat, position, rotationQuat);
        return quat;
    };
}();

export function setRotation(quat, rotation) {
    return Quat2Utils.setRotationDegrees(quat, rotation);
}

export let setRotationDegrees = function () {
    let position = vec3_utils_create();
    return function setRotationDegrees(quat, rotation) {
        Quat2Utils.getPosition(quat, position);
        Quat2Utils.setPositionRotationDegrees(quat, position, rotation);
        return quat;
    };
}();

export let setRotationRadians = function () {
    let position = vec3_utils_create();
    return function setRotationRadians(quat, rotation) {
        Quat2Utils.getPosition(quat, position);
        Quat2Utils.setPositionRotationRadians(quat, position, rotation);
        return quat;
    };
}();

export let setRotationQuat = function () {
    let position = vec3_utils_create();
    return function setRotationQuat(quat, rotation) {
        Quat2Utils.getPosition(quat, position);
        Quat2Utils.setPositionRotationQuat(quat, position, rotation);
        return quat;
    };
}();

export function setPositionRotation(quat, position, rotation) {
    return Quat2Utils.setPositionRotationDegrees(quat, position, rotation);
}

export let setPositionRotationDegrees = function () {
    let rotationQuat = quat_utils_create();
    return function setPositionRotationDegrees(quat, position, rotation) {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        Quat2Utils.setPositionRotationQuat(quat, position, rotationQuat);

        return quat;
    };
}();

export let setPositionRotationRadians = function () {
    let rotationQuat = quat_utils_create();
    return function setPositionRotationRadians(quat, position, rotation) {
        Vec3Utils.radiansToQuat(rotation, rotationQuat);
        Quat2Utils.setPositionRotationQuat(quat, position, rotationQuat);
        return quat;
    };
}();

export function setPositionRotationQuat(quat, position, rotation) {
    gl_quat2.fromRotationTranslation(quat, rotation, position);
    return quat;
}

export function isNormalized(quat, epsilon = MathUtils.EPSILON) {
    return Math.abs(Quat2Utils.lengthSquared(quat) - 1) < epsilon;
}

export function length(quat) {
    return gl_quat2.length(quat);
}

export function lengthSquared(quat) {
    return gl_quat2.squaredLength(quat);
}

export function mul(first, second, out = Quat2Utils.create()) {
    gl_quat2.mul(out, first, second);
    return out;
}

export function getAxes(quat, out = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]) {
    Quat2Utils.getLeft(quat, out[0]);
    Quat2Utils.getUp(quat, out[1]);
    Quat2Utils.getForward(quat, out[2]);
    return out;
}

export let getForward = function () {
    let rotationMatrix = mat3_utils_create();
    return function getForward(quat, out = Vec3Utils.create()) {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);

        return out;
    };
}();

export function getBackward(quat, out) {
    out = Quat2Utils.getForward(quat, out);
    Vec3Utils.negate(out, out);
    return out;
}

export let getLeft = function () {
    let rotationMatrix = mat3_utils_create();
    return function getLeft(quat, out = Vec3Utils.create()) {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);

        return out;
    };
}();

export function getRight(quat, out) {
    out = Quat2Utils.getLeft(quat, out);
    Vec3Utils.negate(out, out);
    return out;
}

export let getUp = function () {
    let rotationMatrix = mat3_utils_create();
    return function getUp(quat, out = Vec3Utils.create()) {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);

        return out;
    };
}();

export function getDown(quat, out) {
    out = Quat2Utils.getUp(quat, out);
    Vec3Utils.negate(out, out);
    return out;
}

export function toWorld(quat, parentTransformQuat, out = Quat2Utils.create()) {
    Quat2Utils.mul(parentTransformQuat, quat, out);
    return out;
}

export let toLocal = function () {
    let invertQuat = create();
    return function toLocal(quat, parentTransformQuat, out = Quat2Utils.create()) {
        Quat2Utils.conjugate(parentTransformQuat, invertQuat);
        Quat2Utils.mul(invertQuat, quat, out);
        return out;
    };
}();

export function rotateAxis(quat, angle, axis, out) {
    return Quat2Utils.rotateAxisDegrees(quat, angle, axis, out);
}

export function rotateAxisDegrees(quat, angle, axis, out) {
    return Quat2Utils.rotateAxisRadians(quat, MathUtils.toRadians(angle), axis, out);
}

export let rotateAxisRadians = function () {
    let rotationQuat = quat_utils_create();
    return function rotateAxisRadians(quat, angle, axis, out = Quat2Utils.create()) {
        Quat2Utils.getRotationQuat(quat, rotationQuat);
        QuatUtils.rotateAxisRadians(rotationQuat, angle, axis, rotationQuat);
        Quat2Utils.copy(quat, out);
        Quat2Utils.setRotationQuat(out, rotationQuat);
        return out;
    };
}();

export function toMatrix(quat, out = Mat4Utils.create()) {
    _customGLMatrixFromQuat2(out, quat);
    return out;
}

export function fromMatrix(matrix, out = Quat2Utils.create()) {
    Mat4Utils.toQuat(matrix, out);
    return out;
}

export function lerp(from, to, interpolationFactor, out = Quat2Utils.create()) {
    if (interpolationFactor <= 0) {
        Quat2Utils.copy(from, out);
        return out;
    } else if (interpolationFactor >= 1) {
        Quat2Utils.copy(to, out);
        return out;
    }

    gl_quat2.lerp(out, from, to, interpolationFactor);
    return out;
}

export function interpolate(from, to, interpolationFactor, easingFunction = EasingFunction.linear, out = Quat2Utils.create()) {
    let lerpFactor = easingFunction(interpolationFactor);
    return Quat2Utils.lerp(from, to, lerpFactor, out);
}

export let slerp = function () {
    let fromPosition = vec3_utils_create();
    let toPosition = vec3_utils_create();
    let interpolatedPosition = vec3_utils_create();
    let fromRotationQuat = quat_utils_create();
    let toRotationQuat = quat_utils_create();
    let interpolatedRotationQuat = quat_utils_create();
    return function slerp(from, to, interpolationFactor, out = Quat2Utils.create()) {
        if (interpolationFactor <= 0) {
            Quat2Utils.copy(from, out);
            return out;
        } else if (interpolationFactor >= 1) {
            Quat2Utils.copy(to, out);
            return out;
        }

        Quat2Utils.getPosition(from, fromPosition);
        Quat2Utils.getPosition(to, toPosition);

        Quat2Utils.getRotationQuat(from, fromRotationQuat);
        Quat2Utils.getRotationQuat(to, toRotationQuat);

        Vec3Utils.lerp(fromPosition, toPosition, interpolationFactor, interpolatedPosition);
        QuatUtils.slerp(fromRotationQuat, toRotationQuat, interpolationFactor, interpolatedRotationQuat);

        Quat2Utils.setPositionRotationQuat(out, interpolatedPosition, interpolatedRotationQuat);
        return out;
    };
}();

export function sinterpolate(from, to, interpolationFactor, easingFunction = EasingFunction.linear, out = Quat2Utils.create()) {
    let lerpFactor = easingFunction(interpolationFactor);
    return Quat2Utils.slerp(from, to, lerpFactor, out);
}

export let Quat2Utils = {
    create,
    set,
    normalize,
    invert,
    conjugate,
    copy,
    identity,
    getPosition,
    getRotation,
    getRotationDegrees,
    getRotationRadians,
    getRotationQuat,
    setPosition,
    setRotation,
    setRotationDegrees,
    setRotationRadians,
    setRotationQuat,
    setPositionRotation,
    setPositionRotationDegrees,
    setPositionRotationRadians,
    setPositionRotationQuat,
    isNormalized,
    length,
    lengthSquared,
    mul,
    getAxes,
    getForward,
    getBackward,
    getLeft,
    getRight,
    getUp,
    getDown,
    toWorld,
    toLocal,
    rotateAxis,
    rotateAxisDegrees,
    rotateAxisRadians,
    toMatrix,
    fromMatrix,
    lerp,
    interpolate,
    slerp,
    sinterpolate
};




// This is used in place of the glMatrix one to avoid the array allocation
let _customGLMatrixFromQuat2 = function () {
    let translation = vec3_utils_create();
    return function _customGLMatrixFromQuat2(out, a) {
        let bx = -a[0],
            by = -a[1],
            bz = -a[2],
            bw = a[3],
            ax = a[4],
            ay = a[5],
            az = a[6],
            aw = a[7];

        let magnitude = bx * bx + by * by + bz * bz + bw * bw;
        //Only scale if it makes sense
        if (magnitude > 0) {
            translation[0] = ((ax * bw + aw * bx + ay * bz - az * by) * 2) / magnitude;
            translation[1] = ((ay * bw + aw * by + az * bx - ax * bz) * 2) / magnitude;
            translation[2] = ((az * bw + aw * bz + ax * by - ay * bx) * 2) / magnitude;
        } else {
            translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
            translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
            translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
        }
        gl_mat4.fromRotationTranslation(out, a, translation);
        return out;
    };
}();
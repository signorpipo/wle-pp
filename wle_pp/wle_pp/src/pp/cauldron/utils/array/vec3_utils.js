import { vec3 as gl_vec3 } from "gl-matrix";
import { EasingFunction, MathUtils } from "../math_utils.js";
import { Mat3Utils } from "./mat3_utils.js";
import { Mat4Utils, create as mat4_utils_create } from "./mat4_utils.js";
import { Quat2Utils } from "./quat2_utils.js";
import { QuatUtils, create as quat_utils_create } from "./quat_utils.js";

export function create(x, y, z) {
    let out = gl_vec3.create();

    if (x != null) {
        set(out, x, y, z);
    }

    return out;
}

export function set(vector, x, y, z) {
    if (y == null) {
        gl_vec3.set(vector, x, x, x);
    } else {
        gl_vec3.set(vector, x, y, z);
    }

    return vector;
}

export function normalize(vector, out = Vec3Utils.create()) {
    gl_vec3.normalize(out, vector);
    return out;
}

export function copy(from, to) {
    gl_vec3.copy(to, from);
    return to;
}

export function clone(vector, out = Vec3Utils.create()) {
    Vec3Utils.copy(vector, out);
    return out;
}

export function zero(vector) {
    gl_vec3.zero(vector);
    return vector;
}

export function angle(first, second) {
    return Vec3Utils.angleDegrees(first, second);
}

export function angleDegrees(first, second) {
    return MathUtils.toDegrees(Vec3Utils.angleRadians(first, second));
}

export function angleRadians(first, second) {
    let firstX = first[0];
    let firstY = first[1];
    let firstZ = first[2];

    let secondX = second[0];
    let secondY = second[1];
    let secondZ = second[2];

    let firstLengthSquared = (firstX * firstX + firstY * firstY + firstZ * firstZ);
    let secondLengthSquared = (secondX * secondX + secondY * secondY + secondZ * secondZ);

    let lengthSquared = firstLengthSquared * secondLengthSquared;

    let angle = 0;
    if (lengthSquared > MathUtils.EPSILON_SQUARED) {
        let length = Math.sqrt(lengthSquared);

        let cos = Vec3Utils.dot(first, second) / length;
        angle = Math.acos(MathUtils.clamp(cos, -1, 1));
    }

    return angle;
}

export function equals(first, second, epsilon = 0) {
    let equals = first.length == second.length;

    if (equals) {
        equals &&= (Math.abs(first[0] - second[0]) <= epsilon);
        equals &&= (Math.abs(first[1] - second[1]) <= epsilon);
        equals &&= (Math.abs(first[2] - second[2]) <= epsilon);
    }

    return equals;
}

export function length(vector) {
    return gl_vec3.length(vector);
}

export function lengthSquared(vector) {
    return gl_vec3.squaredLength(vector);
}

export function distance(first, second) {
    return gl_vec3.dist(first, second);
}

export function distanceSquared(first, second) {
    return gl_vec3.squaredDistance(first, second);
}

export function add(first, second, out = Vec3Utils.create()) {
    gl_vec3.add(out, first, second);
    return out;
}

export function sub(first, second, out = Vec3Utils.create()) {
    gl_vec3.sub(out, first, second);
    return out;
}

export function mul(first, second, out = Vec3Utils.create()) {
    gl_vec3.mul(out, first, second);
    return out;
}

export function div(first, second, out = Vec3Utils.create()) {
    gl_vec3.div(out, first, second);
    return out;
}

export function scale(vector, value, out = Vec3Utils.create()) {
    gl_vec3.scale(out, vector, value);
    return out;
}

export function dot(first, second) {
    return gl_vec3.dot(first, second);
}

export function negate(vector, out = Vec3Utils.create()) {
    gl_vec3.negate(out, vector);
    return out;
}

export function cross(first, second, out = Vec3Utils.create()) {
    gl_vec3.cross(out, first, second);
    return out;
}

export function transformQuat(vector, quat, out = Vec3Utils.create()) {
    gl_vec3.transformQuat(out, vector, quat);
    return out;
}

export function transformMat3(vector, matrix, out = Vec3Utils.create()) {
    gl_vec3.transformMat3(out, vector, matrix);
    return out;
}

export function transformMat4(vector, mat4, out = Vec3Utils.create()) {
    gl_vec3.transformMat4(out, vector, mat4);
    return out;
}

export function lengthSigned(vector, positiveDirection) {
    let signedLength = Vec3Utils.length(vector);
    if (!Vec3Utils.isConcordant(vector, positiveDirection)) {
        signedLength *= -1;
    }

    return signedLength;
}

export function angleSigned(first, second, referenceAxis) {
    return Vec3Utils.angleSignedDegrees(first, second, referenceAxis);
}

export function angleSignedDegrees(first, second, referenceAxis) {
    return MathUtils.toDegrees(Vec3Utils.angleSignedRadians(first, second, referenceAxis));
}

export let angleSignedRadians = function () {
    let crossAxis = create();
    return function angleSignedRadians(first, second, referenceAxis) {
        Vec3Utils.cross(first, second, crossAxis);
        let angle = Vec3Utils.angleRadians(first, second);
        if (!Vec3Utils.isConcordant(crossAxis, referenceAxis)) {
            angle = -angle;
        }

        return angle;
    };
}();

export function anglePivoted(first, second, referenceAxis) {
    return Vec3Utils.anglePivotedDegrees(first, second, referenceAxis);
}

export function anglePivotedDegrees(first, second, referenceAxis) {
    return MathUtils.toDegrees(Vec3Utils.anglePivotedRadians(first, second, referenceAxis));
}

export let anglePivotedRadians = function () {
    let flatFirst = create();
    let flatSecond = create();
    return function anglePivotedRadians(first, second, referenceAxis) {
        Vec3Utils.removeComponentAlongAxis(first, referenceAxis, flatFirst);
        Vec3Utils.removeComponentAlongAxis(second, referenceAxis, flatSecond);

        return Vec3Utils.angleRadians(flatFirst, flatSecond);
    };
}();

export function anglePivotedSigned(first, second, referenceAxis) {
    return Vec3Utils.anglePivotedSignedDegrees(first, second, referenceAxis);
}

export function anglePivotedSignedDegrees(first, second, referenceAxis) {
    return MathUtils.toDegrees(Vec3Utils.anglePivotedSignedRadians(first, second, referenceAxis));
}

export let anglePivotedSignedRadians = function () {
    let flatFirst = create();
    let flatSecond = create();
    return function anglePivotedSignedRadians(first, second, referenceAxis) {
        Vec3Utils.removeComponentAlongAxis(first, referenceAxis, flatFirst);
        Vec3Utils.removeComponentAlongAxis(second, referenceAxis, flatSecond);

        return Vec3Utils.angleSignedRadians(flatFirst, flatSecond, referenceAxis);
    };
}();

export function toRadians(vector, out = Vec3Utils.create()) {
    Vec3Utils.set(out, MathUtils.toRadians(vector[0]), MathUtils.toRadians(vector[1]), MathUtils.toRadians(vector[2]));
    return out;
}

export function toDegrees(vector, out = Vec3Utils.create()) {
    Vec3Utils.set(out, MathUtils.toDegrees(vector[0]), MathUtils.toDegrees(vector[1]), MathUtils.toDegrees(vector[2]));
    return out;
}

export function toQuat(vector, out) {
    return Vec3Utils.degreesToQuat(vector, out);
}

export function radiansToQuat(vector, out = QuatUtils.create()) {
    QuatUtils.fromRadians(vector, out);
    return out;
}

export function degreesToQuat(vector, out = QuatUtils.create()) {
    QuatUtils.fromDegrees(vector, out);
    return out;
}

export function isNormalized(vector, epsilon = MathUtils.EPSILON) {
    return Math.abs(Vec3Utils.lengthSquared(vector) - 1) < epsilon;
}

export function isZero(vector, epsilon = 0) {
    return Vec3Utils.lengthSquared(vector) <= (epsilon * epsilon);
}

export function valueAlongAxis(vector, axis) {
    let valueAlongAxis = Vec3Utils.dot(vector, axis);
    return valueAlongAxis;
}

export let valueAlongPlane = function () {
    let componentAlong = create();
    return function valueAlongPlane(vector, planeNormal) {
        Vec3Utils.removeComponentAlongAxis(vector, planeNormal, componentAlong);
        return Vec3Utils.length(componentAlong);
    };
}();

export function componentAlongAxis(vector, axis, out = Vec3Utils.create()) {
    let valueAlongAxis = Vec3Utils.valueAlongAxis(vector, axis);

    Vec3Utils.copy(axis, out);
    Vec3Utils.scale(out, valueAlongAxis, out);
    return out;
}

export let removeComponentAlongAxis = function () {
    let componentAlong = create();
    return function removeComponentAlongAxis(vector, axis, out = Vec3Utils.create()) {
        Vec3Utils.componentAlongAxis(vector, axis, componentAlong);
        Vec3Utils.sub(vector, componentAlong, out);
        return out;
    };
}();

export let copyComponentAlongAxis = function () {
    let componentAlong = create();
    return function copyComponentAlongAxis(from, to, axis, out = Vec3Utils.create()) {
        Vec3Utils.removeComponentAlongAxis(to, axis, out);
        Vec3Utils.componentAlongAxis(from, axis, componentAlong);
        Vec3Utils.add(out, componentAlong, out);

        return out;
    };
}();

export function isConcordant(first, second) {
    return Vec3Utils.dot(first, second) >= 0;
}

export function isFartherAlongAxis(first, second, axis) {
    return Vec3Utils.valueAlongAxis(first, axis) > Vec3Utils.valueAlongAxis(second, axis);
}

export function isToTheRight(first, second, referenceAxis) {
    return Vec3Utils.signTo(first, second, referenceAxis) >= 0;
}

export let signTo = function () {
    let componentAlongThis = create();
    let componentAlongVector = create();
    return function signTo(first, second, referenceAxis, zeroSign = 1) {
        Vec3Utils.removeComponentAlongAxis(first, referenceAxis, componentAlongThis);
        Vec3Utils.removeComponentAlongAxis(second, referenceAxis, componentAlongVector);

        let angleSignedResult = Vec3Utils.angleSigned(first, second, referenceAxis);
        return angleSignedResult > 0 ? 1 : (angleSignedResult == 0 ? zeroSign : -1);
    };
}();

export function projectOnAxis(vector, axis, out = Vec3Utils.create()) {
    Vec3Utils.componentAlongAxis(vector, axis, out);
    return out;
}

// The result can easily be not 100% exact due to precision errors
export let projectOnAxisAlongAxis = function () {
    let up = create();
    let vectorProjectedToAxis = create();
    let fixedProjectAlongAxis = create();
    return function projectOnAxisAlongAxis(vector, axis, projectAlongAxis, out = Vec3Utils.create()) {

        if (Vec3Utils.isOnAxis(vector, axis) || Vec3Utils.isOnAxis(projectAlongAxis, axis)) {
            Vec3Utils.copy(vector, out);
        } else {
            Vec3Utils.cross(projectAlongAxis, axis, up);
            Vec3Utils.normalize(up, up);

            if (Vec3Utils.isZero(up)) {
                Vec3Utils.perpendicularRandom(projectAlongAxis, up);
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

                let angleWithAlongAxis = Vec3Utils.angleRadians(fixedProjectAlongAxis, vectorProjectedToAxis);
                let lengthToRemove = Vec3Utils.length(vectorProjectedToAxis) / Math.cos(angleWithAlongAxis);

                Vec3Utils.scale(fixedProjectAlongAxis, lengthToRemove, fixedProjectAlongAxis);
                Vec3Utils.add(out, fixedProjectAlongAxis, out);

                Vec3Utils.projectOnAxis(out, axis, out); // Snap on the axis, due to float precision error
            }
        }

        return out;
    };
}();

export function projectOnPlane(vector, planeNormal, out = Vec3Utils.create()) {
    Vec3Utils.removeComponentAlongAxis(vector, planeNormal, out);
    return out;
}

// The result can easily be not 100% exact due to precision errors
export let projectOnPlaneAlongAxis = function () {
    let vectorProjectedToPlane = create();
    let fixedProjectAlongAxis = create();
    return function projectOnPlaneAlongAxis(vector, planeNormal, projectAlongAxis, out = Vec3Utils.create()) {
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

            let angleWithAlongAxis = Vec3Utils.angleRadians(fixedProjectAlongAxis, vectorProjectedToPlane);
            let lengthToRemove = Vec3Utils.length(vectorProjectedToPlane) / Math.cos(angleWithAlongAxis);

            Vec3Utils.scale(fixedProjectAlongAxis, lengthToRemove, fixedProjectAlongAxis);
            Vec3Utils.add(out, fixedProjectAlongAxis, out);

            Vec3Utils.projectOnPlane(out, planeNormal, out); // Snap on the axis, due to float precision error
        }

        return out;
    };
}();

export function isOnAxis(vector, axis) {
    let angleResult = Vec3Utils.angle(vector, axis);
    return Math.abs(angleResult) < MathUtils.EPSILON_DEGREES || Math.abs(angleResult - 180) < MathUtils.EPSILON_DEGREES;
}

export function isOnPlane(vector, planeNormal) {
    let angleResult = Vec3Utils.angle(vector, planeNormal);
    return Math.abs(angleResult - 90) < MathUtils.EPSILON_DEGREES;
}

export function rotate(vector, rotation, out) {
    return Vec3Utils.rotateDegrees(vector, rotation, out);
}

export let rotateDegrees = function () {
    let zero = create();
    return function rotateDegrees(vector, rotation, out) {
        return Vec3Utils.rotateAroundDegrees(vector, rotation, zero, out);
    };
}();

export let rotateRadians = function () {
    let zero = create();
    return function rotateRadians(vector, rotation, out) {
        return Vec3Utils.rotateAroundRadians(vector, rotation, zero, out);
    };
}();

export let rotateQuat = function () {
    let zero = create();
    return function rotateQuat(vector, rotation, out) {
        return Vec3Utils.rotateAroundQuat(vector, rotation, zero, out);
    };
}();

export function rotateAxis(vector, angle, axis, out) {
    return Vec3Utils.rotateAxisDegrees(vector, angle, axis, out);
}

export let rotateAxisDegrees = function () {
    let zero = create();
    return function rotateAxisDegrees(vector, angle, axis, out) {
        return Vec3Utils.rotateAroundAxisDegrees(vector, angle, axis, zero, out);
    };
}();

export let rotateAxisRadians = function () {
    let zero = create();
    return function rotateAxisRadians(vector, angle, axis, out) {
        return Vec3Utils.rotateAroundAxisRadians(vector, angle, axis, zero, out);
    };
}();

export function rotateAround(vector, rotation, origin, out) {
    return Vec3Utils.rotateAroundDegrees(vector, rotation, origin, out);
}

export let rotateAroundDegrees = function () {
    let quat = quat_utils_create();
    return function rotateAroundDegrees(vector, rotation, origin, out = Vec3Utils.create()) {
        Vec3Utils.degreesToQuat(rotation, quat);
        return Vec3Utils.rotateAroundQuat(vector, quat, origin, out);
    };
}();

export let rotateAroundRadians = function () {
    let quat = quat_utils_create();
    return function rotateAroundRadians(vector, rotation, origin, out = Vec3Utils.create()) {
        Vec3Utils.radiansToQuat(rotation, quat);
        return Vec3Utils.rotateAroundQuat(vector, quat, origin, out);
    };
}();

export function rotateAroundQuat(vector, rotation, origin, out = Vec3Utils.create()) {
    Vec3Utils.sub(vector, origin, out);
    Vec3Utils.transformQuat(out, rotation, out);
    Vec3Utils.add(out, origin, out);
    return out;
}

export function rotateAroundAxis(vector, angle, axis, origin, out) {
    return Vec3Utils.rotateAroundAxisDegrees(vector, angle, axis, origin, out);
}

export function rotateAroundAxisDegrees(vector, angle, axis, origin, out) {
    return Vec3Utils.rotateAroundAxisRadians(vector, MathUtils.toRadians(angle), axis, origin, out);
}

export let rotateAroundAxisRadians = function () {
    let quat = quat_utils_create();
    return function rotateAroundAxisRadians(vector, angle, axis, origin, out = Vec3Utils.create()) {
        QuatUtils.fromAxisRadians(angle, axis, quat);
        return Vec3Utils.rotateAroundQuat(vector, quat, origin, out);
    };
}();

export function convertPositionToWorld(vector, parentTransform, out) {
    return Vec3Utils.convertPositionToWorldMatrix(vector, parentTransform, out);
}

export function convertPositionToLocal(vector, parentTransform, out) {
    return Vec3Utils.convertPositionToLocalMatrix(vector, parentTransform, out);
}

export function convertPositionToWorldMatrix(vector, parentTransform, out = Vec3Utils.create()) {
    Vec3Utils.transformMat4(vector, parentTransform, out);
    return out;
}

export let convertPositionToLocalMatrix = function () {
    let inverse = mat4_utils_create();
    return function convertPositionToLocalMatrix(vector, parentTransform, out = Vec3Utils.create()) {
        Mat4Utils.invert(parentTransform, inverse);
        Vec3Utils.transformMat4(vector, inverse, out);
        return out;
    };
}();

export let convertPositionToWorldQuat = function () {
    let parentTransformMatrix = mat4_utils_create();
    let position = create();
    let rotation = quat_utils_create();
    let one = create();
    set(one, 1, 1, 1);
    return function convertPositionToWorldQuat(vector, parentTransform, out = Vec3Utils.create()) {
        Quat2Utils.getPosition(parentTransform, position);
        Quat2Utils.getRotationQuat(parentTransform, rotation);
        Mat4Utils.setPositionRotationQuatScale(parentTransformMatrix, position, rotation, one);
        return Vec3Utils.convertPositionToWorldMatrix(vector, parentTransformMatrix, out);
    };
}();

export let convertPositionToLocalQuat = function () {
    let parentTransformMatrix = mat4_utils_create();
    let position = create();
    let rotation = quat_utils_create();
    let one = create();
    set(one, 1, 1, 1);
    return function convertPositionToLocalQuat(vector, parentTransform, out = Vec3Utils.create()) {
        Quat2Utils.getPosition(parentTransform, position);
        Quat2Utils.getRotationQuat(parentTransform, rotation);
        Mat4Utils.setPositionRotationQuatScale(parentTransformMatrix, position, rotation, one);
        return Vec3Utils.convertPositionToLocalMatrix(vector, parentTransformMatrix, out);
    };
}();

export function convertDirectionToWorld(vector, parentTransform, out) {
    return Vec3Utils.convertDirectionToWorldMatrix(vector, parentTransform, out);
}

export function convertDirectionToLocal(vector, parentTransform, out) {
    return Vec3Utils.convertDirectionToLocalMatrix(vector, parentTransform, out);
}

export let convertDirectionToWorldMatrix = function () {
    let rotation = quat_utils_create();
    return function convertDirectionToWorldMatrix(vector, parentTransform, out = Vec3Utils.create()) {
        Mat4Utils.getRotationQuat(parentTransform, rotation);
        Vec3Utils.transformQuat(vector, rotation, out);
        return out;
    };
}();

export let convertDirectionToLocalMatrix = function () {
    let rotation = quat_utils_create();
    return function convertDirectionToLocalMatrix(vector, parentTransform, out = Vec3Utils.create()) {
        Mat4Utils.getRotationQuat(parentTransform, rotation);
        QuatUtils.conjugate(rotation, rotation);
        Vec3Utils.transformQuat(vector, rotation, out);
        return out;
    };
}();


export let convertDirectionToWorldQuat = function () {
    let rotation = quat_utils_create();
    return function convertDirectionToWorldQuat(vector, parentTransform, out = Vec3Utils.create()) {
        Quat2Utils.getRotationQuat(parentTransform, rotation);
        Vec3Utils.transformQuat(vector, rotation, out);
        return out;
    };
}();

export let convertDirectionToLocalQuat = function () {
    let rotation = quat_utils_create();
    return function convertDirectionToLocalQuat(vector, parentTransform, out = Vec3Utils.create()) {
        Quat2Utils.getRotationQuat(parentTransform, rotation);
        QuatUtils.conjugate(rotation, rotation);
        Vec3Utils.transformQuat(vector, rotation, out);
        return out;
    };
}();

export function addRotation(vector, rotation, out) {
    return Vec3Utils.degreesAddRotation(vector, rotation, out);
}

export function addRotationDegrees(vector, rotation, out) {
    return Vec3Utils.degreesAddRotationDegrees(vector, rotation, out);
}

export function addRotationRadians(vector, rotation, out) {
    return Vec3Utils.degreesAddRotationRadians(vector, rotation, out);
}

export function addRotationQuat(vector, rotation, out) {
    return Vec3Utils.degreesAddRotationQuat(vector, rotation, out);
}

export function degreesAddRotation(vector, rotation, out) {
    return Vec3Utils.degreesAddRotationDegrees(vector, rotation, out);
}

export let degreesAddRotationDegrees = function () {
    let quat = quat_utils_create();
    return function degreesAddRotationDegrees(vector, rotation, out = Vec3Utils.create()) {
        Vec3Utils.degreesToQuat(vector, quat);
        return QuatUtils.toDegrees(QuatUtils.addRotationDegrees(quat, rotation, quat), out);
    };
}();

export let degreesAddRotationRadians = function () {
    let quat = quat_utils_create();
    return function degreesAddRotationRadians(vector, rotation, out = Vec3Utils.create()) {
        Vec3Utils.degreesToQuat(vector, quat);
        return QuatUtils.toDegrees(QuatUtils.addRotationRadians(quat, rotation, quat), out);
    };
}();

export let degreesAddRotationQuat = function () {
    let quat = quat_utils_create();
    return function degreesAddRotationQuat(vector, rotation, out = Vec3Utils.create()) {
        Vec3Utils.degreesToQuat(vector, quat);
        return QuatUtils.toDegrees(QuatUtils.addRotationQuat(quat, rotation, quat), out);
    };
}();

export function radiansAddRotation(vector, rotation, out) {
    return Vec3Utils.radiansAddRotationDegrees(vector, rotation, out);
}

export let radiansAddRotationDegrees = function () {
    let quat = quat_utils_create();
    return function radiansAddRotationDegrees(vector, rotation, out = Vec3Utils.create()) {
        Vec3Utils.radiansToQuat(vector, quat);
        return QuatUtils.toRadians(QuatUtils.addRotationDegrees(quat, rotation, quat), out);
    };
}();

export let radiansAddRotationRadians = function () {
    let quat = quat_utils_create();
    return function radiansAddRotationRadians(vector, rotation, out = Vec3Utils.create()) {
        Vec3Utils.radiansToQuat(vector, quat);
        return QuatUtils.toRadians(QuatUtils.addRotationRadians(quat, rotation, quat), out);
    };
}();

export let radiansAddRotationQuat = function () {
    let quat = quat_utils_create();
    return function radiansAddRotationQuat(vector, rotation, out = Vec3Utils.create()) {
        Vec3Utils.radiansToQuat(vector, quat);
        return QuatUtils.toRadians(QuatUtils.addRotationQuat(quat, rotation, quat), out);
    };
}();

export function toMatrix(vector, out = Mat3Utils.create()) {
    return Vec3Utils.degreesToMatrix(vector, out);
}

export let degreesToMatrix = function () {
    let quat = quat_utils_create();
    return function degreesToMatrix(vector, out = Mat3Utils.create()) {
        Vec3Utils.degreesToQuat(vector, quat);
        return QuatUtils.toMatrix(quat, out);
    };
}();

export let radiansToMatrix = function () {
    let quat = quat_utils_create();
    return function radiansToMatrix(vector, out = Mat3Utils.create()) {
        Vec3Utils.radiansToQuat(vector, quat);
        return QuatUtils.toMatrix(quat, out);
    };
}();

export function rotationTo(from, to, out) {
    return Vec3Utils.rotationToDegrees(from, to, out);
}

export let rotationToDegrees = function () {
    let rotationQuat = quat_utils_create();
    return function rotationToDegrees(from, to, out = Vec3Utils.create()) {
        Vec3Utils.rotationToQuat(from, to, rotationQuat);
        QuatUtils.toDegrees(rotationQuat, out);
        return out;
    };
}();

export let rotationToRadians = function () {
    let rotationQuat = quat_utils_create();
    return function rotationToRadians(from, to, out = Vec3Utils.create()) {
        Vec3Utils.rotationToQuat(from, to, rotationQuat);
        QuatUtils.toRadians(rotationQuat, out);
        return out;
    };
}();

export let rotationToQuat = function () {
    let rotationAxis = create();
    return function rotationToQuat(from, to, out = QuatUtils.create()) {
        Vec3Utils.cross(from, to, rotationAxis);
        Vec3Utils.normalize(rotationAxis, rotationAxis);

        if (Vec3Utils.isZero(rotationAxis)) {
            Vec3Utils.perpendicularRandom(from, rotationAxis);
            Vec3Utils.normalize(rotationAxis, rotationAxis);
        }

        let signedAngle = Vec3Utils.angleSigned(from, to, rotationAxis);
        QuatUtils.fromAxisRadians(signedAngle, rotationAxis, out);
        return out;
    };
}();

export function rotationToPivoted(from, to, pivotAxis, out) {
    return Vec3Utils.rotationToPivotedDegrees(from, to, pivotAxis, out);
}

export let rotationToPivotedDegrees = function () {
    let rotationQuat = quat_utils_create();
    return function rotationToPivotedDegrees(from, to, pivotAxis, out = Vec3Utils.create()) {
        Vec3Utils.rotationToPivotedQuat(from, to, pivotAxis, rotationQuat);
        QuatUtils.toDegrees(rotationQuat, out);
        return out;
    };
}();

export let rotationToPivotedRadians = function () {
    let rotationQuat = quat_utils_create();
    return function rotationToPivotedRadians(from, to, pivotAxis, out = Vec3Utils.create()) {
        Vec3Utils.rotationToPivotedQuat(from, to, pivotAxis, rotationQuat);
        QuatUtils.toRadians(rotationQuat, out);
        return out;
    };
}();

export let rotationToPivotedQuat = function () {
    let fromFlat = create();
    let toFlat = create();
    let rotationAxis = create();
    return function rotationToPivotedQuat(from, to, pivotAxis, out = QuatUtils.create()) {
        Vec3Utils.removeComponentAlongAxis(from, pivotAxis, fromFlat);
        Vec3Utils.removeComponentAlongAxis(to, pivotAxis, toFlat);

        Vec3Utils.cross(fromFlat, toFlat, rotationAxis);
        Vec3Utils.normalize(rotationAxis, rotationAxis);

        if (Vec3Utils.isZero(rotationAxis)) {
            Vec3Utils.perpendicularRandom(fromFlat, rotationAxis);
            Vec3Utils.normalize(rotationAxis, rotationAxis);
        }

        let signedAngle = Vec3Utils.angleSignedRadians(fromFlat, toFlat, rotationAxis);
        QuatUtils.fromAxisRadians(signedAngle, rotationAxis, out);
        return out;
    };
}();

export function lerp(from, to, interpolationFactor, out = Vec3Utils.create()) {
    if (interpolationFactor <= 0) {
        Vec3Utils.copy(from, out);
        return out;
    } else if (interpolationFactor >= 1) {
        Vec3Utils.copy(to, out);
        return out;
    }

    gl_vec3.lerp(out, from, to, interpolationFactor);
    return out;
}

export function interpolate(from, to, interpolationFactor, easingFunction = EasingFunction.linear, out = Vec3Utils.create()) {
    let lerpFactor = easingFunction(interpolationFactor);
    return Vec3Utils.lerp(from, to, lerpFactor, out);
}

export let perpendicularRandom = function () {
    let notVector = create();
    return function perpendicularRandom(vector, out = Vec3Utils.create()) {
        if (Vec3Utils.isZero(vector)) {
            return Vec3Utils.zero(out);
        }

        Vec3Utils.copy(vector, notVector);

        let zeroAmount = false;
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
    };
}();

export let Vec3Utils = {
    create,
    set,
    normalize,
    copy,
    clone,
    zero,
    angle,
    angleDegrees,
    angleRadians,
    equals,
    length,
    lengthSquared,
    distance,
    distanceSquared,
    add,
    sub,
    mul,
    div,
    scale,
    dot,
    negate,
    cross,
    transformQuat,
    transformMat3,
    transformMat4,
    lengthSigned,
    angleSigned,
    angleSignedDegrees,
    angleSignedRadians,
    anglePivoted,
    anglePivotedDegrees,
    anglePivotedRadians,
    anglePivotedSigned,
    anglePivotedSignedDegrees,
    anglePivotedSignedRadians,
    toRadians,
    toDegrees,
    toQuat,
    radiansToQuat,
    degreesToQuat,
    isNormalized,
    isZero,
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
    toMatrix,
    degreesToMatrix,
    radiansToMatrix,
    rotationTo,
    rotationToDegrees,
    rotationToRadians,
    rotationToQuat,
    rotationToPivoted,
    rotationToPivotedDegrees,
    rotationToPivotedRadians,
    rotationToPivotedQuat,
    lerp,
    interpolate,
    perpendicularRandom
};
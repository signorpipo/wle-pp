import { Matrix3, Matrix4, Quaternion, Vector3 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { Vec3Utils } from "../../../../cauldron/utils/array/vec3_utils.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";
import { Vector3Extension } from "./vec3_type_extension.js";

import "./vec3_type_extension.js";

export function initVec3Extension(): void {
    _initVec3ExtensionProtoype();
}

function _initVec3ExtensionProtoype(): void {

    const vec3Extension: Vector3Extension<Vector3> = {

        vec3_set<T extends Vector3>(this: T, x: number, y?: number, z?: number): T {
            return Vec3Utils.set(this, x!, y!, z!);
        },

        vec3_copy<T extends Vector3>(this: T, vector: Readonly<Vector3>): T {
            return Vec3Utils.copy(vector, this);
        },

        vec3_clone<T extends Vector3>(this: Readonly<T>): T {
            return Vec3Utils.clone(this);
        },

        vec3_isNormalized(this: Readonly<Vector3>, epsilon?: number): boolean {
            return Vec3Utils.isNormalized(this, epsilon);
        },

        vec3_normalize<T extends Vector3, U extends Vector3>(this: Readonly<T>, out?: T | U): T | U {
            return Vec3Utils.normalize(this, out!);
        },
        vec3_isZero(this: Readonly<Vector3>, epsilon?: number): boolean {
            return Vec3Utils.isZero(this, epsilon);
        },
        vec3_zero<T extends Vector3>(this: T): T {
            return Vec3Utils.zero(this);
        },

        vec3_length(this: Readonly<Vector3>): number {
            return Vec3Utils.length(this);
        },

        vec3_lengthSquared(this: Readonly<Vector3>): number {
            return Vec3Utils.lengthSquared(this);
        },

        vec3_lengthSigned(this: Readonly<Vector3>, positiveDirection: Readonly<Vector3>): number {
            return Vec3Utils.lengthSigned(this, positiveDirection);
        },

        vec3_distance(this: Readonly<Vector3>, vector: Readonly<Vector3>): number {
            return Vec3Utils.distance(this, vector);
        },

        vec3_distanceSquared(this: Readonly<Vector3>, vector: Readonly<Vector3>): number {
            return Vec3Utils.distanceSquared(this, vector);
        },

        vec3_equals(this: Readonly<Vector3>, vector: Readonly<Vector3>, epsilon?: number): boolean {
            return Vec3Utils.equals(this, vector, epsilon);
        },

        vec3_add<T extends Vector3, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.add(this, vector, out!);
        },

        vec3_sub<T extends Vector3, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.sub(this, vector, out!);
        },

        vec3_mul<T extends Vector3, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.mul(this, vector, out!);
        },

        vec3_div<T extends Vector3, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.div(this, vector, out!);
        },

        vec3_scale<T extends Vector3, U extends Vector3>(this: Readonly<T>, value: number, out?: T | U): T | U {
            return Vec3Utils.scale(this, value, out!);
        },

        vec3_negate<T extends Vector3, U extends Vector3>(this: Readonly<T>, out?: T | U): T | U {
            return Vec3Utils.negate(this, out!);
        },

        vec3_dot(this: Readonly<Vector3>, vector: Readonly<Vector3>): number {
            return Vec3Utils.dot(this, vector);
        },

        vec3_cross<T extends Vector3, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.cross(this, vector, out!);
        },

        vec3_transformQuat<T extends Vector3, U extends Vector3>(this: Readonly<T>, quat: Readonly<Quaternion>, out?: T | U): T | U {
            return Vec3Utils.transformQuat(this, quat, out!);
        },

        vec3_transformMat3<T extends Vector3, U extends Vector3>(this: Readonly<T>, matrix: Readonly<Matrix3>, out?: T | U): T | U {
            return Vec3Utils.transformMat3(this, matrix, out!);
        },

        vec3_transformMat4<T extends Vector3, U extends Vector3>(this: Readonly<T>, matrix: Readonly<Matrix4>, out?: T | U): T | U {
            return Vec3Utils.transformMat4(this, matrix, out!);
        },

        vec3_lerp<T extends Vector3, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, interpolationFactor: number, out?: T | U): T | U {
            return Vec3Utils.lerp(this, to, interpolationFactor, out!);
        },

        vec3_interpolate<T extends Vector3, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, interpolationFactor: number, easingFunction?: EasingFunction, out?: T | U): T | U {
            return Vec3Utils.interpolate(this, to, interpolationFactor, easingFunction!, out!);
        },

        vec3_angle(this: Readonly<Vector3>, vector: Readonly<Vector3>): number {
            return Vec3Utils.angle(this, vector);
        },

        vec3_angleDegrees(this: Readonly<Vector3>, vector: Readonly<Vector3>): number {
            return Vec3Utils.angleDegrees(this, vector);
        },

        vec3_angleRadians(this: Readonly<Vector3>, vector: Readonly<Vector3>): number {
            return Vec3Utils.angleRadians(this, vector);
        },

        vec3_angleSigned(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
            return Vec3Utils.angleSigned(this, vector, referenceAxis);
        },

        vec3_angleSignedDegrees(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
            return Vec3Utils.angleSignedDegrees(this, vector, referenceAxis);
        },

        vec3_angleSignedRadians(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
            return Vec3Utils.angleSignedRadians(this, vector, referenceAxis);
        },

        vec3_anglePivoted(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
            return Vec3Utils.anglePivoted(this, vector, referenceAxis);
        },

        vec3_anglePivotedDegrees(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
            return Vec3Utils.anglePivotedDegrees(this, vector, referenceAxis);
        },

        vec3_anglePivotedRadians(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
            return Vec3Utils.anglePivotedRadians(this, vector, referenceAxis);
        },

        vec3_anglePivotedSigned(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
            return Vec3Utils.anglePivotedSigned(this, vector, referenceAxis);
        },

        vec3_anglePivotedSignedDegrees(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
            return Vec3Utils.anglePivotedSignedDegrees(this, vector, referenceAxis);
        },

        vec3_anglePivotedSignedRadians(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): number {
            return Vec3Utils.anglePivotedSignedRadians(this, vector, referenceAxis);
        },

        vec3_valueAlongAxis(this: Readonly<Vector3>, axis: Readonly<Vector3>): number {
            return Vec3Utils.valueAlongAxis(this, axis);
        },

        vec3_valueAlongPlane(this: Readonly<Vector3>, planeNormal: Readonly<Vector3>): number {
            return Vec3Utils.valueAlongPlane(this, planeNormal);
        },

        vec3_componentAlongAxis<T extends Vector3, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.componentAlongAxis(this, axis, out!);
        },

        vec3_removeComponentAlongAxis<T extends Vector3, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.removeComponentAlongAxis(this, axis, out!);
        },

        vec3_copyComponentAlongAxis<T extends Vector3, U extends Vector3>(this: Readonly<T>, vector: Readonly<Vector3>, axis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.copyComponentAlongAxis(vector, this, axis, out!);
        },
        vec3_isConcordant(this: Readonly<Vector3>, vector: Readonly<Vector3>): boolean {
            return Vec3Utils.isConcordant(this, vector);
        },

        vec3_isFartherAlongAxis(this: Readonly<Vector3>, vector: Readonly<Vector3>, axis: Readonly<Vector3>): boolean {
            return Vec3Utils.isFartherAlongAxis(this, vector, axis);
        },

        vec3_isToTheRight(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>): boolean {
            return Vec3Utils.isToTheRight(this, vector, referenceAxis);
        },

        vec3_signTo(this: Readonly<Vector3>, vector: Readonly<Vector3>, referenceAxis: Readonly<Vector3>, zeroSign?: number): number {
            return Vec3Utils.signTo(this, vector, referenceAxis, zeroSign);
        },

        vec3_projectOnAxis<T extends Vector3, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.projectOnAxis(this, axis, out!);
        },

        vec3_projectOnAxisAlongAxis<T extends Vector3, U extends Vector3>(this: Readonly<T>, axis: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.projectOnAxisAlongAxis(this, axis, projectAlongAxis, out!);
        },

        vec3_projectOnPlane<T extends Vector3, U extends Vector3>(this: Readonly<T>, planeNormal: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.projectOnPlane(this, planeNormal, out!);
        },

        vec3_projectOnPlaneAlongAxis<T extends Vector3, U extends Vector3>(this: Readonly<T>, planeNormal: Readonly<Vector3>, projectAlongAxis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.projectOnPlaneAlongAxis(this, planeNormal, projectAlongAxis, out!);
        },

        vec3_isOnAxis(this: Readonly<Vector3>, axis: Readonly<Vector3>): boolean {
            return Vec3Utils.isOnAxis(this, axis);
        },

        vec3_isOnPlane(this: Readonly<Vector3>, planeNormal: Readonly<Vector3>): boolean {
            return Vec3Utils.isOnPlane(this, planeNormal);
        },

        vec3_perpendicularAny<T extends Vector3, U extends Vector3>(this: Readonly<T>, out?: T | U): T | U {
            return Vec3Utils.perpendicularAny(this, out!);
        },

        vec3_rotate<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotate(this, rotation, out!);
        },

        vec3_rotateDegrees<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateDegrees(this, rotation, out!);
        },

        vec3_rotateRadians<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateRadians(this, rotation, out!);
        },

        vec3_rotateQuat<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Quaternion>, out?: T | U): T | U {
            return Vec3Utils.rotateQuat(this, rotation, out!);
        },

        vec3_rotateAxis<T extends Vector3, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateAxis(this, angle, axis, out!);
        },

        vec3_rotateAxisDegrees<T extends Vector3, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateAxisDegrees(this, angle, axis, out!);
        },

        vec3_rotateAxisRadians<T extends Vector3, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateAxisRadians(this, angle, axis, out!);
        },

        vec3_rotateAround<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateAround(this, rotation, origin, out!);
        },

        vec3_rotateAroundDegrees<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateAroundDegrees(this, rotation, origin, out!);
        },

        vec3_rotateAroundRadians<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, origin: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateAroundRadians(this, rotation, origin, out!);
        },

        vec3_rotateAroundQuat<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateAroundQuat(this, rotation, origin, out!);
        },

        vec3_rotateAroundAxis<T extends Vector3, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateAroundAxis(this, angle, axis, origin, out!);
        },

        vec3_rotateAroundAxisDegrees<T extends Vector3, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateAroundAxisDegrees(this, angle, axis, origin, out!);
        },

        vec3_rotateAroundAxisRadians<T extends Vector3, U extends Vector3>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotateAroundAxisRadians(this, angle, axis, origin, out!);
        },

        vec3_addRotation<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.addRotation(this, rotation, out!);
        },

        vec3_addRotationDegrees<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.addRotationDegrees(this, rotation, out!);
        },

        vec3_addRotationRadians<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.addRotationRadians(this, rotation, out!);
        },

        vec3_addRotationQuat<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Quaternion>, out?: T | U): T | U {
            return Vec3Utils.addRotationQuat(this, rotation, out!);
        },

        vec3_degreesAddRotation<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.degreesAddRotation(this, rotation, out!);
        },

        vec3_degreesAddRotationDegrees<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.degreesAddRotationDegrees(this, rotation, out!);
        },

        vec3_degreesAddRotationRadians<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.degreesAddRotationRadians(this, rotation, out!);
        },

        vec3_degreesAddRotationQuat<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Quaternion>, out?: T | U): T | U {
            return Vec3Utils.degreesAddRotationQuat(this, rotation, out!);
        },

        vec3_radiansAddRotation<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.radiansAddRotation(this, rotation, out!);
        },

        vec3_radiansAddRotationDegrees<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.radiansAddRotationDegrees(this, rotation, out!);
        },

        vec3_radiansAddRotationRadians<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.radiansAddRotationRadians(this, rotation, out!);
        },

        vec3_radiansAddRotationQuat<T extends Vector3, U extends Vector3>(this: Readonly<T>, rotation: Readonly<Quaternion>, out?: T | U): T | U {
            return Vec3Utils.radiansAddRotationQuat(this, rotation, out!);
        },

        vec3_rotationTo<T extends Vector3, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotationTo(this, to, out!);
        },

        vec3_rotationToDegrees<T extends Vector3, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotationToDegrees(this, to, out!);
        },

        vec3_rotationToRadians<T extends Vector3, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotationToRadians(this, to, out!);
        },

        vec3_rotationToQuat<T extends Quaternion>(this: Readonly<Vector3>, to: Readonly<Vector3>, out?: Quaternion | T): Quaternion | T {
            return Vec3Utils.rotationToQuat(this, to, out!);
        },

        vec3_rotationToPivoted<T extends Vector3, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotationToPivoted(this, to, pivotAxis, out!);
        },

        vec3_rotationToPivotedDegrees<T extends Vector3, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotationToPivotedDegrees(this, to, pivotAxis, out!);
        },

        vec3_rotationToPivotedRadians<T extends Vector3, U extends Vector3>(this: Readonly<T>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out?: T | U): T | U {
            return Vec3Utils.rotationToPivotedRadians(this, to, pivotAxis, out!);
        },

        vec3_rotationToPivotedQuat<T extends Quaternion>(this: Readonly<Vector3>, to: Readonly<Vector3>, pivotAxis: Readonly<Vector3>, out?: Quaternion | T): Quaternion | T {
            return Vec3Utils.rotationToPivotedQuat(this, to, pivotAxis, out!);
        },

        vec3_convertPositionToWorld<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
            return Vec3Utils.convertPositionToWorld(this, parentTransform, out!);
        },

        vec3_convertPositionToLocal<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
            return Vec3Utils.convertPositionToLocal(this, parentTransform, out!);
        },

        vec3_convertPositionToWorldMatrix<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
            return Vec3Utils.convertPositionToWorldMatrix(this, parentTransform, out!);
        },

        vec3_convertPositionToLocalMatrix<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
            return Vec3Utils.convertPositionToLocalMatrix(this, parentTransform, out!);
        },

        vec3_convertPositionToWorldQuat<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Quaternion>, out?: T | U): T | U {
            return Vec3Utils.convertPositionToWorldQuat(this, parentTransform, out!);
        },

        vec3_convertPositionToLocalQuat<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Quaternion>, out?: T | U): T | U {
            return Vec3Utils.convertPositionToLocalQuat(this, parentTransform, out!);
        },

        vec3_convertDirectionToWorld<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
            return Vec3Utils.convertDirectionToWorld(this, parentTransform, out!);
        },

        vec3_convertDirectionToLocal<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
            return Vec3Utils.convertDirectionToLocal(this, parentTransform, out!);
        },

        vec3_convertDirectionToWorldMatrix<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
            return Vec3Utils.convertDirectionToWorldMatrix(this, parentTransform, out!);
        },

        vec3_convertDirectionToLocalMatrix<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Matrix4>, out?: T | U): T | U {
            return Vec3Utils.convertDirectionToLocalMatrix(this, parentTransform, out!);
        },

        vec3_convertDirectionToWorldQuat<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Quaternion>, out?: T | U): T | U {
            return Vec3Utils.convertDirectionToWorldQuat(this, parentTransform, out!);
        },

        vec3_convertDirectionToLocalQuat<T extends Vector3, U extends Vector3>(this: Readonly<T>, parentTransform: Readonly<Quaternion>, out?: T | U): T | U {
            return Vec3Utils.convertDirectionToLocalQuat(this, parentTransform, out!);
        },

        vec3_toRadians<T extends Vector3, U extends Vector3>(this: Readonly<T>, out?: T | U): T | U {
            return Vec3Utils.toRadians(this, out!);
        },

        vec3_toDegrees<T extends Vector3, U extends Vector3>(this: Readonly<T>, out?: T | U): T | U {
            return Vec3Utils.toDegrees(this, out!);
        },

        vec3_toQuat<T extends Quaternion>(this: Readonly<Vector3>, out?: Quaternion | T): Quaternion | T {
            return Vec3Utils.toQuat(this, out!);
        },

        vec3_radiansToQuat<T extends Quaternion>(this: Readonly<Vector3>, out?: Quaternion | T): Quaternion | T {
            return Vec3Utils.radiansToQuat(this, out!);
        },

        vec3_degreesToQuat<T extends Quaternion>(this: Readonly<Vector3>, out?: Quaternion | T): Quaternion | T {
            return Vec3Utils.degreesToQuat(this, out!);
        },

        vec3_toMatrix<T extends Matrix3>(this: Readonly<Vector3>, out?: Matrix3 | T): Matrix3 | T {
            return Vec3Utils.toMatrix(this, out!);
        },

        vec3_degreesToMatrix<T extends Matrix3>(this: Readonly<Vector3>, out?: Matrix3 | T): Matrix3 | T {
            return Vec3Utils.degreesToMatrix(this, out!);
        },

        vec3_radiansToMatrix<T extends Matrix3>(this: Readonly<Vector3>, out?: Matrix3 | T): Matrix3 | T {
            return Vec3Utils.radiansToMatrix(this, out!);
        }
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectOwnProperties(vec3Extension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}
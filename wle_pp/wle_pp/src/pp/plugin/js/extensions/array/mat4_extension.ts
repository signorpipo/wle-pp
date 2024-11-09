import { Matrix4, Quaternion, Quaternion2, Vector3 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { Mat4Utils } from "../../../../cauldron/utils/array/mat4_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";
import { Matrix4Extension } from "./mat4_type_extension.js";

import "./mat4_type_extension.js";

export function initMat4Extension(): void {
    _initMat4ExtensionProtoype();
}

function _initMat4ExtensionProtoype(): void {

    const matrix4Extension: Matrix4Extension<Matrix4> = {

        mat4_set<T extends Matrix4>(this: T,
            m00: number, m01?: number, m02?: number, m03?: number,
            m10?: number, m11?: number, m12?: number, m13?: number,
            m20?: number, m21?: number, m22?: number, m23?: number,
            m30?: number, m31?: number, m32?: number, m33?: number): T {
            return Mat4Utils.set(this,
                m00, m01!, m02!, m03!,
                m10!, m11!, m12!, m13!,
                m20!, m21!, m22!, m23!,
                m30!, m31!, m32!, m33!
            );
        },

        mat4_copy<T extends Matrix4>(this: T, matrix: Readonly<Matrix4>): T {
            return Mat4Utils.copy(matrix, this);
        },

        mat4_clone<T extends Matrix4>(this: Readonly<T>): T {
            return Mat4Utils.clone(this);
        },

        mat4_equals(this: Readonly<Matrix4>, matrix: Readonly<Matrix4>, epsilon?: number): boolean {
            return Mat4Utils.equals(this, matrix, epsilon);
        },

        mat4_identity<T extends Matrix4>(this: T): T {
            return Mat4Utils.identity(this);
        },

        mat4_invert<T extends Matrix4, U extends Matrix4>(this: Readonly<T>, out?: T | U): T | U {
            return Mat4Utils.invert(this, out!);
        },

        mat4_mul<T extends Matrix4, U extends Matrix4>(this: Readonly<T>, matrix: Readonly<Matrix4>, out?: T | U): T | U {
            return Mat4Utils.mul(this, matrix, out!);
        },

        mat4_scale<T extends Matrix4, U extends Matrix4>(this: Readonly<T>, vector: Readonly<Vector3>, out?: T | U): T | U {
            return Mat4Utils.scale(this, vector, out!);
        },

        mat4_getPosition<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3): Vector3 | T {
            return Mat4Utils.getPosition(this, out!);
        },

        mat4_getRotation<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3): Vector3 | T {
            return Mat4Utils.getRotation(this, out!);
        },

        mat4_getRotationDegrees<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3): Vector3 | T {
            return Mat4Utils.getRotationDegrees(this, out!);
        },

        mat4_getRotationRadians<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3): Vector3 | T {
            return Mat4Utils.getRotationRadians(this, out!);
        },

        mat4_getRotationQuat<T extends Quaternion>(this: Readonly<Matrix4>, out?: Quaternion | T): Quaternion | T {
            return Mat4Utils.getRotationQuat(this, out!);
        },

        mat4_getScale<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3): Vector3 | T {
            return Mat4Utils.getScale(this, out!);
        },

        mat4_setPosition<T extends Matrix4>(this: T, position: Readonly<Vector3>): T {
            return Mat4Utils.setPosition(this, position);
        },

        mat4_setRotation<T extends Matrix4>(this: T, rotation: Readonly<Vector3>): T {
            return Mat4Utils.setRotation(this, rotation);
        },

        mat4_setRotationDegrees<T extends Matrix4>(this: T, rotation: Readonly<Vector3>): T {
            return Mat4Utils.setRotationDegrees(this, rotation);
        },

        mat4_setRotationRadians<T extends Matrix4>(this: T, rotation: Readonly<Vector3>): T {
            return Mat4Utils.setRotationRadians(this, rotation);
        },

        mat4_setRotationQuat<T extends Matrix4>(this: T, rotation: Readonly<Quaternion>): T {
            return Mat4Utils.setRotationQuat(this, rotation);
        },

        mat4_setScale<T extends Matrix4>(this: T, scale: Readonly<Vector3>): T {
            return Mat4Utils.setScale(this, scale);
        },

        mat4_setPositionRotationScale<T extends Matrix4>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>, scale: Readonly<Vector3>): T {
            return Mat4Utils.setPositionRotationScale(this, position, rotation, scale);
        },

        mat4_setPositionRotationDegreesScale<T extends Matrix4>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>, scale: Readonly<Vector3>): T {
            return Mat4Utils.setPositionRotationDegreesScale(this, position, rotation, scale);
        },

        mat4_setPositionRotationRadiansScale<T extends Matrix4>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>, scale: Readonly<Vector3>): T {
            return Mat4Utils.setPositionRotationRadiansScale(this, position, rotation, scale);
        },

        mat4_setPositionRotationQuatScale<T extends Matrix4>(this: T, position: Readonly<Vector3>, rotation: Readonly<Quaternion>, scale: Readonly<Vector3>): T {
            return Mat4Utils.setPositionRotationQuatScale(this, position, rotation, scale);
        },

        mat4_setPositionRotation<T extends Matrix4>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
            return Mat4Utils.setPositionRotation(this, position, rotation);
        },

        mat4_setPositionRotationDegrees<T extends Matrix4>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
            return Mat4Utils.setPositionRotationDegrees(this, position, rotation);
        },

        mat4_setPositionRotationRadians<T extends Matrix4>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
            return Mat4Utils.setPositionRotationRadians(this, position, rotation);
        },

        mat4_setPositionRotationQuat<T extends Matrix4>(this: T, position: Readonly<Vector3>, rotation: Readonly<Quaternion>): T {
            return Mat4Utils.setPositionRotationQuat(this, position, rotation);
        },

        mat4_getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(this: Readonly<Matrix4>, out?: [Vector3, Vector3, Vector3] | [T, U, V]): [Vector3, Vector3, Vector3] | [T, U, V] {
            return Mat4Utils.getAxes(this, out!);
        },

        mat4_getForward<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3): Vector3 | T {
            return Mat4Utils.getForward(this, out!);
        },

        mat4_getBackward<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3 | T): Vector3 | T {
            return Mat4Utils.getBackward(this, out!);
        },

        mat4_getLeft<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3): Vector3 | T {
            return Mat4Utils.getLeft(this, out!);
        },

        mat4_getRight<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3 | T): Vector3 | T {
            return Mat4Utils.getRight(this, out!);
        },

        mat4_getUp<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3): Vector3 | T {
            return Mat4Utils.getUp(this, out!);
        },

        mat4_getDown<T extends Vector3>(this: Readonly<Matrix4>, out?: Vector3 | T): Vector3 | T {
            return Mat4Utils.getDown(this, out!);
        },

        mat4_hasUniformScale(this: Readonly<Matrix4>): boolean {
            return Mat4Utils.hasUniformScale(this);
        },

        mat4_toWorld<T extends Matrix4, U extends Matrix4>(this: Readonly<T>, parentTransformMatrix: Readonly<Matrix4>, out?: T | U): T | U {
            return Mat4Utils.toWorld(this, parentTransformMatrix, out!);
        },

        mat4_toLocal<T extends Matrix4, U extends Matrix4>(this: Readonly<T>, parentTransformMatrix: Readonly<Matrix4>, out?: T | U): T | U {
            return Mat4Utils.toLocal(this, parentTransformMatrix, out!);
        },

        mat4_toQuat<T extends Quaternion2>(this: Readonly<Matrix4>, out?: Quaternion2 | T): Quaternion2 | T {
            return Mat4Utils.toQuat(this, out!);
        },

        mat4_fromQuat<T extends Matrix4>(this: T, quat: Readonly<Quaternion2>): T {
            return Mat4Utils.fromQuat(quat, this);
        }
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectOwnProperties(matrix4Extension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}
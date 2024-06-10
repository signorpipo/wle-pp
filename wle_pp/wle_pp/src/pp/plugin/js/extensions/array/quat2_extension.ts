import { Matrix4, Quaternion, Quaternion2, Vector3 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { Quat2Utils } from "../../../../cauldron/utils/array/quat2_utils.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";
import { Quaternion2Extension } from "./quat2_type_extension.js";

import "./quat2_type_extension.js";

export function initQuat2Extension(): void {
    _initQuat2ExtensionProtoype();
}

function _initQuat2ExtensionProtoype(): void {

    const quat2Extension: Quaternion2Extension<Quaternion2> = {

        quat2_set<T extends Quaternion2>(this: T, x1: number, y1?: number, z1?: number, w1?: number, x2?: number, y2?: number, z2?: number, w2?: number): T {
            return Quat2Utils.set(this, x1, y1!, z1!, w1!, x2!, y2!, z2!, w2!);
        },

        quat2_copy<T extends Quaternion2>(this: T, quat: Readonly<Quaternion2>): T {
            return Quat2Utils.copy(quat, this);
        },

        quat2_clone<T extends Quaternion2>(this: Readonly<T>): T {
            return Quat2Utils.clone(this);
        },

        quat2_isNormalized(this: Readonly<Quaternion2>, epsilon?: number): boolean {
            return Quat2Utils.isNormalized(this, epsilon);
        },

        quat2_normalize<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, out?: T | U): T | U {
            return Quat2Utils.normalize(this, out!);
        },

        quat2_length(this: Readonly<Quaternion2>): number {
            return Quat2Utils.length(this);
        },

        quat2_lengthSquared(this: Readonly<Quaternion2>): number {
            return Quat2Utils.lengthSquared(this);
        },

        quat2_identity<T extends Quaternion2>(this: T): T {
            return Quat2Utils.identity(this);
        },

        quat2_mul<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, quat: Readonly<Quaternion2>, out?: T | U): T | U {
            return Quat2Utils.mul(this, quat, out!);
        },

        quat2_invert<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, out?: T | U): T | U {
            return Quat2Utils.invert(this, out!);
        },

        quat2_conjugate<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, out?: T | U): T | U {
            return Quat2Utils.conjugate(this, out!);
        },

        quat2_lerp<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, out?: T | U): T | U {
            return Quat2Utils.lerp(this, to, interpolationFactor, out!);
        },

        quat2_interpolate<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, easingFunction?: EasingFunction, out?: T | U): T | U {
            return Quat2Utils.interpolate(this, to, interpolationFactor, easingFunction!, out!);
        },

        quat2_slerp<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, out?: T | U): T | U {
            return Quat2Utils.slerp(this, to, interpolationFactor, out!);
        },

        quat2_interpolateSpherical<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, easingFunction?: EasingFunction, out?: T | U): T | U {
            return Quat2Utils.interpolateSpherical(this, to, interpolationFactor, easingFunction!, out!);
        },

        quat2_getPosition<T extends Vector3>(this: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
            return Quat2Utils.getPosition(this, out!);
        },

        quat2_getRotation<T extends Vector3>(this: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
            return Quat2Utils.getRotation(this, out!);
        },

        quat2_getRotationDegrees<T extends Vector3>(this: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
            return Quat2Utils.getRotationDegrees(this, out!);
        },

        quat2_getRotationRadians<T extends Vector3>(this: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
            return Quat2Utils.getRotationRadians(this, out!);
        },

        quat2_getRotationQuat<T extends Quaternion>(this: Readonly<Quaternion2>, out?: Quaternion | T): Quaternion | T {
            return Quat2Utils.getRotationQuat(this, out!);
        },

        quat2_setPosition<T extends Quaternion2>(this: T, position: Readonly<Vector3>): T {
            return Quat2Utils.setPosition(this, position);
        },

        quat2_setRotation<T extends Quaternion2>(this: T, rotation: Readonly<Vector3>): T {
            return Quat2Utils.setRotation(this, rotation);
        },

        quat2_setRotationDegrees<T extends Quaternion2>(this: T, rotation: Readonly<Vector3>): T {
            return Quat2Utils.setRotationDegrees(this, rotation);
        },

        quat2_setRotationRadians<T extends Quaternion2>(this: T, rotation: Readonly<Vector3>): T {
            return Quat2Utils.setRotationRadians(this, rotation);
        },

        quat2_setRotationQuat<T extends Quaternion2>(this: T, rotation: Readonly<Quaternion>): T {
            return Quat2Utils.setRotationQuat(this, rotation);
        },

        quat2_setPositionRotation<T extends Quaternion2>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
            return Quat2Utils.setPositionRotation(this, position, rotation);
        },

        quat2_setPositionRotationDegrees<T extends Quaternion2>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
            return Quat2Utils.setPositionRotationDegrees(this, position, rotation);
        },

        quat2_setPositionRotationRadians<T extends Quaternion2>(this: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
            return Quat2Utils.setPositionRotationRadians(this, position, rotation);
        },

        quat2_setPositionRotationQuat<T extends Quaternion2>(this: T, position: Readonly<Vector3>, rotation: Readonly<Quaternion>): T {
            return Quat2Utils.setPositionRotationQuat(this, position, rotation);
        },

        quat2_getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(this: Readonly<Quaternion2>, out?: [Vector3, Vector3, Vector3] | [T, U, V]): [Vector3, Vector3, Vector3] | [T, U, V] {
            return Quat2Utils.getAxes(this, out!);
        },

        quat2_getForward<T extends Vector3>(this: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
            return Quat2Utils.getForward(this, out!);
        },

        quat2_getBackward<T extends Vector3>(this: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
            return Quat2Utils.getBackward(this, out!);
        },

        quat2_getLeft<T extends Vector3>(this: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
            return Quat2Utils.getLeft(this, out!);
        },

        quat2_getRight<T extends Vector3>(this: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
            return Quat2Utils.getRight(this, out!);
        },

        quat2_getUp<T extends Vector3>(this: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
            return Quat2Utils.getUp(this, out!);
        },

        quat2_getDown<T extends Vector3>(this: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
            return Quat2Utils.getDown(this, out!);
        },

        quat2_rotateAxis<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
            return Quat2Utils.rotateAxis(this, angle, axis, out!);
        },

        quat2_rotateAxisDegrees<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
            return Quat2Utils.rotateAxisDegrees(this, angle, axis, out!);
        },

        quat2_rotateAxisRadians<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
            return Quat2Utils.rotateAxisRadians(this, angle, axis, out!);
        },

        quat2_toWorld<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, parentTransformQuat: Readonly<Quaternion2>, out?: T | U): T | U {
            return Quat2Utils.toWorld(this, parentTransformQuat, out!);
        },

        quat2_toLocal<T extends Quaternion2, U extends Quaternion2>(this: Readonly<T>, parentTransformQuat: Readonly<Quaternion2>, out?: T | U): T | U {
            return Quat2Utils.toLocal(this, parentTransformQuat, out!);
        },

        quat2_toMatrix<T extends Matrix4>(this: Readonly<Quaternion2>, out?: Matrix4 | T): Matrix4 | T {
            return Quat2Utils.toMatrix(this, out!);
        },

        quat2_fromMatrix<T extends Quaternion2>(this: T, matrix: Readonly<Matrix4>): T {
            return Quat2Utils.fromMatrix(matrix, this);
        }
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectOwnProperties(quat2Extension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}
import { Matrix3, Quaternion, Vector3 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { QuatUtils } from "../../../../cauldron/utils/array/quat_utils.js";
import { EasingFunction } from "../../../../cauldron/utils/math_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";
import { QuaternionExtension } from "./quat_type_extension.js";

import "./quat_type_extension.js";

export function initQuatExtension(): void {
    _initQuatExtensionProtoype();
}

function _initQuatExtensionProtoype(): void {

    const quatExtension: QuaternionExtension<Quaternion> = {

        quat_set<T extends Quaternion>(this: T, x: number, y?: number, z?: number, w?: number): T {
            return QuatUtils.set(this, x!, y!, z!, w!);
        },

        quat_copy<T extends Quaternion>(this: T, quat: Readonly<Quaternion>): T {
            return QuatUtils.copy(quat, this);
        },

        quat_clone<T extends Quaternion>(this: Readonly<T>): T {
            return QuatUtils.clone(this);
        },

        quat_equals(this: Readonly<Quaternion>, quat: Readonly<Quaternion>, epsilon?: number): boolean {
            return QuatUtils.equals(this, quat, epsilon);
        },

        quat_isNormalized(this: Readonly<Quaternion>, epsilon?: number): boolean {
            return QuatUtils.isNormalized(this, epsilon);
        },

        quat_normalize<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, out?: T | U): T | U {
            return QuatUtils.normalize(this, out!);
        },

        quat_length(this: Readonly<Quaternion>): number {
            return QuatUtils.length(this);
        },

        quat_lengthSquared(this: Readonly<Quaternion>): number {
            return QuatUtils.lengthSquared(this);
        },

        quat_identity<T extends Quaternion>(this: T): T {
            return QuatUtils.identity(this);
        },

        quat_mul<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, quat: Readonly<Quaternion>, out?: T | U): T | U {
            return QuatUtils.mul(this, quat, out!);
        },

        quat_invert<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, out?: T | U): T | U {
            return QuatUtils.invert(this, out!);
        },

        quat_conjugate<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, out?: T | U): T | U {
            return QuatUtils.conjugate(this, out!);
        },

        quat_lerp<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, out?: T | U): T | U {
            return QuatUtils.lerp(this, to, interpolationFactor, out!);
        },

        quat_interpolate<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction?: EasingFunction, out?: T | U): T | U {
            return QuatUtils.interpolate(this, to, interpolationFactor, easingFunction!, out!);
        },

        quat_slerp<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, out?: T | U): T | U {
            return QuatUtils.slerp(this, to, interpolationFactor, out!);
        },

        quat_interpolateSpherical<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, to: Readonly<Quaternion>, interpolationFactor: number, easingFunction?: EasingFunction, out?: T | U): T | U {
            return QuatUtils.interpolateSpherical(this, to, interpolationFactor, easingFunction!, out!);
        },
        quat_getAngle(this: Readonly<Quaternion>): number {
            return QuatUtils.getAngle(this);
        },

        quat_getAngleDegrees(this: Readonly<Quaternion>): number {
            return QuatUtils.getAngleDegrees(this);
        },

        quat_getAngleRadians(this: Readonly<Quaternion>): number {
            return QuatUtils.getAngleRadians(this);
        },

        quat_getAxis<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.getAxis(this, out!);
        },

        quat_getAxisScaled<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.getAxisScaled(this, out!);
        },

        quat_getAxisScaledDegrees<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.getAxisScaledDegrees(this, out!);
        },

        quat_getAxisScaledRadians<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.getAxisScaledRadians(this, out!);
        },

        quat_getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(this: Readonly<Quaternion>, out?: [Vector3, Vector3, Vector3] | [T, U, V]): [Vector3, Vector3, Vector3] | [T, U, V] {
            return QuatUtils.getAxes(this, out!);
        },

        quat_getForward<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.getForward(this, out!);
        },

        quat_getBackward<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.getBackward(this, out!);
        },

        quat_getLeft<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.getLeft(this, out!);
        },

        quat_getRight<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.getRight(this, out!);
        },

        quat_getUp<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.getUp(this, out!);
        },

        quat_getDown<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.getDown(this, out!);
        },

        quat_setAxes<T extends Quaternion>(this: T, left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>): T {
            return QuatUtils.setAxes(this, left, up, forward);
        },

        quat_setForward<T extends Quaternion>(this: T, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): T {
            return QuatUtils.setForward(this, forward, up, left);
        },

        quat_setBackward<T extends Quaternion>(this: T, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): T {
            return QuatUtils.setBackward(this, backward, up, left);
        },

        quat_setUp<T extends Quaternion>(this: T, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): T {
            return QuatUtils.setUp(this, up, forward, left);
        },

        quat_setDown<T extends Quaternion>(this: T, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): T {
            return QuatUtils.setDown(this, down, forward, left);
        },

        quat_setLeft<T extends Quaternion>(this: T, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): T {
            return QuatUtils.setLeft(this, left, up, forward);
        },

        quat_setRight<T extends Quaternion>(this: T, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): T {
            return QuatUtils.setRight(this, right, up, forward);
        },

        quat_toWorld<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, parentRotationQuat: Readonly<Quaternion>, out?: T | U): T | U {
            return QuatUtils.toWorld(this, parentRotationQuat, out!);
        },

        quat_toLocal<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, parentRotationQuat: Readonly<Quaternion>, out?: T | U): T | U {
            return QuatUtils.toLocal(this, parentRotationQuat, out!);
        },

        quat_addRotation<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.addRotation(this, rotation, out!);
        },

        quat_addRotationDegrees<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.addRotationDegrees(this, rotation, out!);
        },

        quat_addRotationRadians<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.addRotationRadians(this, rotation, out!);
        },

        quat_addRotationQuat<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Quaternion>, out?: T | U): T | U {
            return QuatUtils.addRotationQuat(this, rotation, out!);
        },

        quat_subRotation<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.subRotation(this, rotation, out!);
        },

        quat_subRotationDegrees<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.subRotationDegrees(this, rotation, out!);
        },

        quat_subRotationRadians<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.subRotationRadians(this, rotation, out!);
        },

        quat_subRotationQuat<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Quaternion>, out?: T | U): T | U {
            return QuatUtils.subRotationQuat(this, rotation, out!);
        },

        quat_rotationTo<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, to: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotationTo(this, to, out!);
        },

        quat_rotationToDegrees<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, to: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotationToDegrees(this, to, out!);
        },

        quat_rotationToRadians<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, to: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotationToRadians(this, to, out!);
        },

        quat_rotationToQuat<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, to: Readonly<Quaternion>, out?: T | U): T | U {
            return QuatUtils.rotationToQuat(this, to, out!);
        },

        quat_rotationAroundAxis<T extends Vector3, U extends Vector3>(this: Readonly<Quaternion>, axis: Readonly<T>, out?: T | U): T | U {
            return QuatUtils.rotationAroundAxis(this, axis, out!);
        },

        quat_rotationAroundAxisDegrees<T extends Vector3, U extends Vector3>(this: Readonly<Quaternion>, axis: Readonly<T>, out?: T | U): T | U {
            return QuatUtils.rotationAroundAxisDegrees(this, axis, out!);
        },

        quat_rotationAroundAxisRadians<T extends Vector3, U extends Vector3>(this: Readonly<Quaternion>, axis: Readonly<T>, out?: T | U): T | U {
            return QuatUtils.rotationAroundAxisRadians(this, axis, out!);
        },

        quat_rotationAroundAxisQuat<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, axis: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotationAroundAxisQuat(this, axis, out!);
        },

        quat_getTwist<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, axis: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.getTwist(this, axis, out!);
        },

        quat_getSwing<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, axis: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.getSwing(this, axis, out!);
        },

        quat_getSwingFromTwist<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, twist: Readonly<Quaternion>, out?: T | U): T | U {
            return QuatUtils.getSwingFromTwist(this, twist, out!);
        },

        quat_getTwistFromSwing<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, swing: Readonly<Quaternion>, out?: T | U): T | U {
            return QuatUtils.getTwistFromSwing(this, swing, out!);
        },

        quat_fromTwistSwing<T extends Quaternion>(this: T, twist: Readonly<Quaternion>, swing: Readonly<Quaternion>): T {
            return QuatUtils.fromTwistSwing(twist, swing, this);
        },

        quat_rotate<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotate(this, rotation, out!);
        },

        quat_rotateDegrees<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotateDegrees(this, rotation, out!);
        },

        quat_rotateRadians<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotateRadians(this, rotation, out!);
        },

        quat_rotateQuat<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, rotation: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotateQuat(this, rotation, out!);
        },

        quat_rotateAxis<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotateAxis(this, angle, axis, out!);
        },

        quat_rotateAxisDegrees<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotateAxisDegrees(this, angle, axis, out!);
        },

        quat_rotateAxisRadians<T extends Quaternion, U extends Quaternion>(this: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U): T | U {
            return QuatUtils.rotateAxisRadians(this, angle, axis, out!);
        },

        quat_fromDegrees<T extends Quaternion>(this: T, rotation: Readonly<Vector3>): T {
            return QuatUtils.fromDegrees(rotation, this);
        },

        quat_fromRadians<T extends Quaternion>(this: T, rotation: Readonly<Vector3>): T {
            return QuatUtils.fromRadians(rotation, this);
        },

        quat_fromAxis<T extends Quaternion>(this: T, angle: number, axis: Readonly<Vector3>): T {
            return QuatUtils.fromAxis(angle, axis, this);
        },

        quat_fromAxisDegrees<T extends Quaternion>(this: T, angle: number, axis: Readonly<Vector3>): T {
            return QuatUtils.fromAxisDegrees(angle, axis, this);
        },

        quat_fromAxisRadians<T extends Quaternion>(this: T, angle: number, axis: Readonly<Vector3>): T {
            return QuatUtils.fromAxisRadians(angle, axis, this);
        },

        quat_fromAxes<T extends Quaternion>(this: T, left: Readonly<Vector3>, up: Readonly<Vector3>, forward: Readonly<Vector3>): Quaternion | T {
            return QuatUtils.fromAxes(left, up, forward, this);
        },

        quat_toDegrees<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.toDegrees(this, out!);
        },

        quat_toRadians<T extends Vector3>(this: Readonly<Quaternion>, out?: Vector3 | T): Vector3 | T {
            return QuatUtils.toRadians(this, out!);
        },

        quat_toMatrix<T extends Matrix3>(this: Readonly<Quaternion>, out?: Matrix3 | T): Matrix3 | T {
            return QuatUtils.toMatrix(this, out!);
        }
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectOwnProperties(quatExtension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}
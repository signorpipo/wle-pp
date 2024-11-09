import { Component, Object3D, WonderlandEngine, type ComponentConstructor } from "@wonderlandengine/api";
import { Matrix3, Matrix4, Quaternion, Quaternion2, Vector3 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { ObjectCloneParams, ObjectUtils } from "../../../cauldron/wl/utils/object_utils.js";
import { PluginUtils } from "../../utils/plugin_utils.js";
import { Object3DExtension } from "./object_type_extension.js";

import "./object_type_extension.js";

export function initObjectExtension(): void {
    _initObjectExtensionProtoype();
}

function _initObjectExtensionProtoype(): void {

    const objectExtension: Object3DExtension = {
        pp_getPosition<T extends Vector3>(this: Readonly<Object3D>, outPosition?: T): T {
            return ObjectUtils.getPosition(this, outPosition!);
        },

        pp_getPositionWorld<T extends Vector3>(this: Readonly<Object3D>, outPosition?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getPositionWorld(this, outPosition!);
        },

        pp_getPositionLocal<T extends Vector3>(this: Readonly<Object3D>, outPosition?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getPositionLocal(this, outPosition!);
        },

        pp_getRotation<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotation(this, outRotation!);
        },

        pp_getRotationDegrees<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationDegrees(this, outRotation!);
        },

        pp_getRotationRadians<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationRadians(this, outRotation!);
        },

        pp_getRotationMatrix<T extends Matrix3>(this: Readonly<Object3D>, outRotation?: Matrix3 | T): Matrix3 | T {
            return ObjectUtils.getRotationMatrix(this, outRotation!);
        },

        pp_getRotationQuat<T extends Quaternion>(this: Readonly<Object3D>, outRotation?: Quaternion | T): Quaternion | T {
            return ObjectUtils.getRotationQuat(this, outRotation!);
        },

        pp_getRotationWorld<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationWorld(this, outRotation!);
        },

        pp_getRotationWorldDegrees<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationWorldDegrees(this, outRotation!);
        },

        pp_getRotationWorldRadians<T extends Vector3>(this: Readonly<Object3D>, outRotation?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getRotationWorldRadians(this, outRotation!);
        },

        pp_getRotationWorldMatrix<T extends Matrix3>(this: Readonly<Object3D>, outRotation?: Matrix3 | T): Matrix3 | T {
            return ObjectUtils.getRotationWorldMatrix(this, outRotation!);
        },

        pp_getRotationWorldQuat<T extends Quaternion>(this: Readonly<Object3D>, outRotation?: Quaternion | T): Quaternion | T {
            return ObjectUtils.getRotationWorldQuat(this, outRotation!);
        },

        pp_getRotationLocal<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationLocal(this, outRotation!);
        },

        pp_getRotationLocalDegrees<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationLocalDegrees(this, outRotation!);
        },

        pp_getRotationLocalRadians<T extends Vector3>(this: Readonly<Object3D>, outRotation?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getRotationLocalRadians(this, outRotation!);
        },

        pp_getRotationLocalMatrix<T extends Matrix3>(this: Readonly<Object3D>, outRotation?: Matrix3 | T): Matrix3 | T {
            return ObjectUtils.getRotationLocalMatrix(this, outRotation!);
        },

        pp_getRotationLocalQuat<T extends Quaternion>(this: Readonly<Object3D>, outRotation?: Quaternion | T): Quaternion | T {
            return ObjectUtils.getRotationLocalQuat(this, outRotation!);
        },

        pp_getScale<T extends Vector3>(this: Readonly<Object3D>, outScale?: T): T {
            return ObjectUtils.getScale(this, outScale!);
        },

        pp_getScaleWorld<T extends Vector3>(this: Readonly<Object3D>, outScale?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getScaleWorld(this, outScale!);
        },

        pp_getScaleLocal<T extends Vector3>(this: Readonly<Object3D>, outScale?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getScaleLocal(this, outScale!);
        },

        pp_getTransform<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: Matrix4 | T): Matrix4 | T {
            return ObjectUtils.getTransform(this, outTransform!);
        },

        pp_getTransformMatrix<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: Matrix4 | T): Matrix4 | T {
            return ObjectUtils.getTransformMatrix(this, outTransform!);
        },

        pp_getTransformQuat<T extends Quaternion2>(this: Readonly<Object3D>, outTransform?: Quaternion2 | T): Quaternion2 | T {
            return ObjectUtils.getTransformQuat(this, outTransform!);
        },

        pp_getTransformWorld<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: Matrix4 | T): Matrix4 | T {
            return ObjectUtils.getTransformWorld(this, outTransform!);
        },

        pp_getTransformWorldMatrix<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: Matrix4 | T): Matrix4 | T {
            return ObjectUtils.getTransformWorldMatrix(this, outTransform!);
        },

        pp_getTransformWorldQuat<T extends Quaternion2>(this: Readonly<Object3D>, outTransform?: Quaternion2 | T): Quaternion2 | T {
            return ObjectUtils.getTransformWorldQuat(this, outTransform!);
        },

        pp_getTransformLocal<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: Matrix4 | T): Matrix4 | T {
            return ObjectUtils.getTransformLocal(this, outTransform!);
        },

        pp_getTransformLocalMatrix<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: Matrix4 | T): Matrix4 | T {
            return ObjectUtils.getTransformLocalMatrix(this, outTransform!);
        },

        pp_getTransformLocalQuat<T extends Quaternion2>(this: Readonly<Object3D>, outTransform?: Quaternion2 | T): Quaternion2 | T {
            return ObjectUtils.getTransformLocalQuat(this, outTransform!);
        },

        pp_getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(this: Readonly<Object3D>, outAxes?: [Vector3, Vector3, Vector3] | [T, U, V]): [Vector3, Vector3, Vector3] | [T, U, V] {
            return ObjectUtils.getAxes(this, outAxes!);
        },

        pp_getAxesWorld<T extends Vector3, U extends Vector3, V extends Vector3>(this: Readonly<Object3D>, outAxes?: [Vector3, Vector3, Vector3] | [T, U, V]): [Vector3, Vector3, Vector3] | [T, U, V] {
            return ObjectUtils.getAxesWorld(this, outAxes!);
        },

        pp_getAxesLocal<T extends Vector3, U extends Vector3, V extends Vector3>(this: Readonly<Object3D>, outAxes?: [Vector3, Vector3, Vector3] | [T, U, V]): [Vector3, Vector3, Vector3] | [T, U, V] {
            return ObjectUtils.getAxesLocal(this, outAxes!);
        },

        pp_getForward<T extends Vector3>(this: Readonly<Object3D>, outForward?: T): T {
            return ObjectUtils.getForward(this, outForward!);
        },

        pp_getForwardWorld<T extends Vector3>(this: Readonly<Object3D>, outForward?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getForwardWorld(this, outForward!);
        },

        pp_getForwardLocal<T extends Vector3>(this: Readonly<Object3D>, outForward?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getForwardLocal(this, outForward!);
        },

        pp_getBackward<T extends Vector3>(this: Readonly<Object3D>, outBackward?: T): T {
            return ObjectUtils.getBackward(this, outBackward!);
        },

        pp_getBackwardWorld<T extends Vector3>(this: Readonly<Object3D>, outBackward?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getBackwardWorld(this, outBackward!);
        },

        pp_getBackwardLocal<T extends Vector3>(this: Readonly<Object3D>, outBackward?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getBackwardLocal(this, outBackward!);
        },

        pp_getUp<T extends Vector3>(this: Readonly<Object3D>, outUp?: T): T {
            return ObjectUtils.getUp(this, outUp!);
        },

        pp_getUpWorld<T extends Vector3>(this: Readonly<Object3D>, outUp?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getUpWorld(this, outUp!);
        },

        pp_getUpLocal<T extends Vector3>(this: Readonly<Object3D>, outUp?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getUpLocal(this, outUp!);
        },

        pp_getDown<T extends Vector3>(this: Readonly<Object3D>, outDown?: T): T {
            return ObjectUtils.getDown(this, outDown!);
        },

        pp_getDownWorld<T extends Vector3>(this: Readonly<Object3D>, outDown?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getDownWorld(this, outDown!);
        },

        pp_getDownLocal<T extends Vector3>(this: Readonly<Object3D>, outDown?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getDownLocal(this, outDown!);
        },

        pp_getLeft<T extends Vector3>(this: Readonly<Object3D>, outLeft?: T): T {
            return ObjectUtils.getLeft(this, outLeft!);
        },

        pp_getLeftWorld<T extends Vector3>(this: Readonly<Object3D>, outLeft?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getLeftWorld(this, outLeft!);
        },

        pp_getLeftLocal<T extends Vector3>(this: Readonly<Object3D>, outLeft?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getLeftLocal(this, outLeft!);
        },

        pp_getRight<T extends Vector3>(this: Readonly<Object3D>, outRight?: T): T {
            return ObjectUtils.getRight(this, outRight!);
        },

        pp_getRightWorld<T extends Vector3>(this: Readonly<Object3D>, outRight?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getRightWorld(this, outRight!);
        },

        pp_getRightLocal<T extends Vector3>(this: Readonly<Object3D>, outRight?: Vector3 | T): Vector3 | T {
            return ObjectUtils.getRightLocal(this, outRight!);
        },

        pp_setPosition(this: Object3D, position: Readonly<Vector3>): Object3D {
            return ObjectUtils.setPosition(this, position);
        },

        pp_setPositionWorld(this: Object3D, position: Readonly<Vector3>): Object3D {
            return ObjectUtils.setPositionWorld(this, position);
        },

        pp_setPositionLocal(this: Object3D, position: Readonly<Vector3>): Object3D {
            return ObjectUtils.setPositionLocal(this, position);
        },

        pp_setRotation(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotation(this, rotation);
        },

        pp_setRotationDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationDegrees(this, rotation);
        },

        pp_setRotationRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationRadians(this, rotation);
        },

        pp_setRotationMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.setRotationMatrix(this, rotation);
        },

        pp_setRotationQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.setRotationQuat(this, rotation);
        },

        pp_setRotationWorld(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationWorld(this, rotation);
        },

        pp_setRotationWorldDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationWorldDegrees(this, rotation);
        },

        pp_setRotationWorldRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationWorldRadians(this, rotation);
        },

        pp_setRotationWorldMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.setRotationWorldMatrix(this, rotation);
        },

        pp_setRotationWorldQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.setRotationWorldQuat(this, rotation);
        },

        pp_setRotationLocal(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationLocal(this, rotation);
        },

        pp_setRotationLocalDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationLocalDegrees(this, rotation);
        },

        pp_setRotationLocalRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationLocalRadians(this, rotation);
        },

        pp_setRotationLocalMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.setRotationLocalMatrix(this, rotation);
        },

        pp_setRotationLocalQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.setRotationLocalQuat(this, rotation);
        },

        pp_setScale(this: Object3D, scale: Readonly<Vector3> | number): Object3D {
            return ObjectUtils.setScale(this, scale as Vector3);
        },

        pp_setScaleWorld(this: Object3D, scale: Readonly<Vector3> | number): Object3D {
            return ObjectUtils.setScaleWorld(this, scale as Vector3);
        },

        pp_setScaleLocal(this: Object3D, scale: Readonly<Vector3> | number): Object3D {
            return ObjectUtils.setScaleLocal(this, scale as Vector3);
        },

        pp_setAxes(this: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setAxes(this, left, up, forward);
        },

        pp_setAxesWorld(this: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setAxesWorld(this, left, up, forward);
        },

        pp_setAxesLocal(this: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setAxesLocal(this, left, up, forward);
        },

        pp_setForward(this: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setForward(this, forward, up, left);
        },

        pp_setForwardWorld(this: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setForwardWorld(this, forward, up, left);
        },

        pp_setForwardLocal(this: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setForwardLocal(this, forward, up, left);
        },

        pp_setBackward(this: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setBackward(this, backward, up, left);
        },

        pp_setBackwardWorld(this: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setBackwardWorld(this, backward, up, left);
        },

        pp_setBackwardLocal(this: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setBackwardLocal(this, backward, up, left);
        },

        pp_setUp(this: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setUp(this, up, forward, left);
        },

        pp_setUpWorld(this: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setUpWorld(this, up, forward, left);
        },

        pp_setUpLocal(this: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setUpLocal(this, up, forward, left);
        },

        pp_setDown(this: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setDown(this, down, forward, left);
        },

        pp_setDownWorld(this: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setDownWorld(this, down, forward, left);
        },

        pp_setDownLocal(this: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setDownLocal(this, down, forward, left);
        },

        pp_setLeft(this: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setLeft(this, left, up, forward);
        },

        pp_setLeftWorld(this: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setLeftWorld(this, left, up, forward);
        },

        pp_setLeftLocal(this: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setLeftLocal(this, left, up, forward);
        },

        pp_setRight(this: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRight(this, right, up, forward);
        },

        pp_setRightWorld(this: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRightWorld(this, right, up, forward);
        },

        pp_setRightLocal(this: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRightLocal(this, right, up, forward);
        },

        pp_setTransform(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransform(this, transform);
        },

        pp_setTransformMatrix(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransformMatrix(this, transform);
        },

        pp_setTransformQuat(this: Object3D, transform: Readonly<Quaternion2>): Object3D {
            return ObjectUtils.setTransformQuat(this, transform);
        },

        pp_setTransformWorld(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransformWorld(this, transform);
        },

        pp_setTransformWorldMatrix(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransformWorldMatrix(this, transform);
        },

        pp_setTransformWorldQuat(this: Object3D, transform: Readonly<Quaternion2>): Object3D {
            return ObjectUtils.setTransformWorldQuat(this, transform);
        },

        pp_setTransformLocal(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransformLocal(this, transform);
        },

        pp_setTransformLocalMatrix(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransformLocalMatrix(this, transform);
        },

        pp_setTransformLocalQuat(this: Object3D, transform: Readonly<Quaternion2>): Object3D {
            return ObjectUtils.setTransformLocalQuat(this, transform);
        },

        pp_resetPosition(this: Object3D): Object3D {
            return ObjectUtils.resetPosition(this);
        },

        pp_resetPositionWorld(this: Object3D): Object3D {
            return ObjectUtils.resetPositionWorld(this);
        },

        pp_resetPositionLocal(this: Object3D): Object3D {
            return ObjectUtils.resetPositionLocal(this);
        },

        pp_resetRotation(this: Object3D): Object3D {
            return ObjectUtils.resetRotation(this);
        },

        pp_resetRotationWorld(this: Object3D): Object3D {
            return ObjectUtils.resetRotationWorld(this);
        },

        pp_resetRotationLocal(this: Object3D): Object3D {
            return ObjectUtils.resetRotationLocal(this);
        },

        pp_resetScale(this: Object3D): Object3D {
            return ObjectUtils.resetScale(this);
        },

        pp_resetScaleWorld(this: Object3D): Object3D {
            return ObjectUtils.resetScaleWorld(this);
        },

        pp_resetScaleLocal(this: Object3D): Object3D {
            return ObjectUtils.resetScaleLocal(this);
        },

        pp_resetTransform(this: Object3D): Object3D {
            return ObjectUtils.resetTransform(this);
        },

        pp_resetTransformWorld(this: Object3D): Object3D {
            return ObjectUtils.resetTransformWorld(this);
        },

        pp_resetTransformLocal(this: Object3D): Object3D {
            return ObjectUtils.resetTransformLocal(this);
        },

        pp_translate(this: Object3D, translation: Readonly<Vector3>): Object3D {
            return ObjectUtils.translate(this, translation);
        },

        pp_translateWorld(this: Object3D, translation: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateWorld(this, translation);
        },

        pp_translateLocal(this: Object3D, translation: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateLocal(this, translation);
        },

        pp_translateObject(this: Object3D, translation: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateObject(this, translation);
        },

        pp_translateAxis(this: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateAxis(this, amount, direction);
        },

        pp_translateAxisWorld(this: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateAxisWorld(this, amount, direction);
        },

        pp_translateAxisLocal(this: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateAxisLocal(this, amount, direction);
        },

        pp_translateAxisObject(this: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateAxisObject(this, amount, direction);
        },

        pp_rotate(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotate(this, rotation);
        },

        pp_rotateDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateDegrees(this, rotation);
        },

        pp_rotateRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateRadians(this, rotation);
        },

        pp_rotateMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.rotateMatrix(this, rotation);
        },

        pp_rotateQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.rotateQuat(this, rotation);
        },

        pp_rotateWorld(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateWorld(this, rotation);
        },

        pp_rotateWorldDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateWorldDegrees(this, rotation);
        },

        pp_rotateWorldRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateWorldRadians(this, rotation);
        },

        pp_rotateWorldMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.rotateWorldMatrix(this, rotation);
        },

        pp_rotateWorldQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.rotateWorldQuat(this, rotation);
        },

        pp_rotateLocal(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateLocal(this, rotation);
        },

        pp_rotateLocalDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateLocalDegrees(this, rotation);
        },

        pp_rotateLocalRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateLocalRadians(this, rotation);
        },

        pp_rotateLocalMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.rotateLocalMatrix(this, rotation);
        },

        pp_rotateLocalQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.rotateLocalQuat(this, rotation);
        },

        pp_rotateObject(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateObject(this, rotation);
        },

        pp_rotateObjectDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateObjectDegrees(this, rotation);
        },

        pp_rotateObjectRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateObjectRadians(this, rotation);
        },

        pp_rotateObjectMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.rotateObjectMatrix(this, rotation);
        },

        pp_rotateObjectQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.rotateObjectQuat(this, rotation);
        },

        pp_rotateAxis(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxis(this, angle, axis);
        },

        pp_rotateAxisDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisDegrees(this, angle, axis);
        },

        pp_rotateAxisRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisRadians(this, angle, axis);
        },

        pp_rotateAxisWorld(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisWorld(this, angle, axis);
        },

        pp_rotateAxisWorldDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisWorldDegrees(this, angle, axis);
        },

        pp_rotateAxisWorldRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisWorldRadians(this, angle, axis);
        },

        pp_rotateAxisLocal(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisLocal(this, angle, axis);
        },

        pp_rotateAxisLocalDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisLocalDegrees(this, angle, axis);
        },

        pp_rotateAxisLocalRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisLocalRadians(this, angle, axis);
        },

        pp_rotateAxisObject(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisObject(this, angle, axis);
        },

        pp_rotateAxisObjectDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisObjectDegrees(this, angle, axis);
        },

        pp_rotateAxisObjectRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisObjectRadians(this, angle, axis);
        },

        pp_rotateAround(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAround(this, rotation, origin);
        },

        pp_rotateAroundDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundDegrees(this, rotation, origin);
        },

        pp_rotateAroundRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundRadians(this, rotation, origin);
        },

        pp_rotateAroundMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundMatrix(this, rotation, origin);
        },

        pp_rotateAroundQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundQuat(this, rotation, origin);
        },

        pp_rotateAroundWorld(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundWorld(this, rotation, origin);
        },

        pp_rotateAroundWorldDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundWorldDegrees(this, rotation, origin);
        },

        pp_rotateAroundWorldRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundWorldRadians(this, rotation, origin);
        },

        pp_rotateAroundWorldMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundWorldMatrix(this, rotation, origin);
        },

        pp_rotateAroundWorldQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundWorldQuat(this, rotation, origin);
        },

        pp_rotateAroundLocal(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundLocal(this, rotation, origin);
        },

        pp_rotateAroundLocalDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundLocalDegrees(this, rotation, origin);
        },

        pp_rotateAroundLocalRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundLocalRadians(this, rotation, origin);
        },

        pp_rotateAroundLocalMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundLocalMatrix(this, rotation, origin);
        },

        pp_rotateAroundLocalQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundLocalQuat(this, rotation, origin);
        },

        pp_rotateAroundObject(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundObject(this, rotation, origin);
        },

        pp_rotateAroundObjectDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundObjectDegrees(this, rotation, origin);
        },

        pp_rotateAroundObjectRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundObjectRadians(this, rotation, origin);
        },

        pp_rotateAroundObjectMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundObjectMatrix(this, rotation, origin);
        },

        pp_rotateAroundObjectQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundObjectQuat(this, rotation, origin);
        },

        pp_rotateAroundAxis(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxis(this, angle, axis, origin);
        },

        pp_rotateAroundAxisDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisDegrees(this, angle, axis, origin);
        },

        pp_rotateAroundAxisRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisRadians(this, angle, axis, origin);
        },

        pp_rotateAroundAxisWorld(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisWorld(this, angle, axis, origin);
        },

        pp_rotateAroundAxisWorldDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisWorldDegrees(this, angle, axis, origin);
        },

        pp_rotateAroundAxisWorldRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisWorldRadians(this, angle, axis, origin);
        },

        pp_rotateAroundAxisLocal(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisLocal(this, angle, axis, origin);
        },

        pp_rotateAroundAxisLocalDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisLocalDegrees(this, angle, axis, origin);
        },

        pp_rotateAroundAxisLocalRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisLocalRadians(this, angle, axis, origin);
        },

        pp_rotateAroundAxisObject(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisObject(this, angle, axis, origin);
        },

        pp_rotateAroundAxisObjectDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisObjectDegrees(this, angle, axis, origin);
        },

        pp_rotateAroundAxisObjectRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisObjectRadians(this, angle, axis, origin);
        },

        pp_scaleObject(this: Object3D, scale: Readonly<Vector3> | number): Object3D {
            return ObjectUtils.scaleObject(this, scale as Vector3);
        },

        pp_lookAt(this: Object3D, position: Readonly<Vector3>, up?: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookAt(this, position, up);
        },

        pp_lookAtWorld(this: Object3D, position: Readonly<Vector3>, up?: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookAtWorld(this, position, up);
        },

        pp_lookAtLocal(this: Object3D, position: Readonly<Vector3>, up?: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookAtLocal(this, position, up);
        },

        pp_lookTo(this: Object3D, direction: Readonly<Vector3>, up?: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookTo(this, direction, up);
        },

        pp_lookToWorld(this: Object3D, direction: Readonly<Vector3>, up?: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookToWorld(this, direction, up);
        },

        pp_lookToLocal(this: Object3D, direction: Readonly<Vector3>, up?: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookToLocal(this, direction, up);
        },

        pp_convertPositionObjectToWorld<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertPositionObjectToWorld(this, position, outPosition!);
        },

        pp_convertDirectionObjectToWorld<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertDirectionObjectToWorld(this, direction, outDirection!);
        },

        pp_convertPositionWorldToObject<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertPositionWorldToObject(this, position, outPosition!);
        },

        pp_convertDirectionWorldToObject<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertDirectionWorldToObject(this, direction, outDirection!);
        },

        pp_convertPositionLocalToWorld<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertPositionLocalToWorld(this, position, outPosition!);
        },

        pp_convertDirectionLocalToWorld<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertDirectionLocalToWorld(this, direction, outDirection!);
        },

        pp_convertPositionWorldToLocal<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertPositionWorldToLocal(this, position, outPosition!);
        },

        pp_convertDirectionWorldToLocal<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertDirectionWorldToLocal(this, direction, outDirection!);
        },

        pp_convertPositionObjectToLocal<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertPositionObjectToLocal(this, position, outPosition!);
        },

        pp_convertDirectionObjectToLocal<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertDirectionObjectToLocal(this, direction, outDirection!);
        },

        pp_convertPositionLocalToObject<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertPositionLocalToObject(this, position, outPosition!);
        },

        pp_convertDirectionLocalToObject<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: Vector3 | T): Vector3 | T {
            return ObjectUtils.convertDirectionLocalToObject(this, direction, outDirection!);
        },

        pp_convertTransformObjectToWorld<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformObjectToWorld(this, transform, outTransform!);
        },

        pp_convertTransformObjectToWorldMatrix<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformObjectToWorldMatrix(this, transform, outTransform!);
        },

        pp_convertTransformObjectToWorldQuat<T extends Quaternion2, U extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformObjectToWorldQuat(this, transform, outTransform!);
        },

        pp_convertTransformWorldToObject<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformWorldToObject(this, transform, outTransform!);
        },

        pp_convertTransformWorldToObjectMatrix<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformWorldToObjectMatrix(this, transform, outTransform!);
        },

        pp_convertTransformWorldToObjectQuat<T extends Quaternion2, U extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformWorldToObjectQuat(this, transform, outTransform!);
        },

        pp_convertTransformLocalToWorld<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformLocalToWorld(this, transform, outTransform!);
        },

        pp_convertTransformLocalToWorldMatrix<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformLocalToWorldMatrix(this, transform, outTransform!);
        },

        pp_convertTransformLocalToWorldQuat<T extends Quaternion2, U extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformLocalToWorldQuat(this, transform, outTransform!);
        },

        pp_convertTransformWorldToLocal<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformWorldToLocal(this, transform, outTransform!);
        },

        pp_convertTransformWorldToLocalMatrix<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformWorldToLocalMatrix(this, transform, outTransform!);
        },

        pp_convertTransformWorldToLocalQuat<T extends Quaternion2, U extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformWorldToLocalQuat(this, transform, outTransform!);
        },

        pp_convertTransformObjectToLocal<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformObjectToLocal(this, transform, outTransform!);
        },

        pp_convertTransformObjectToLocalMatrix<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformObjectToLocalMatrix(this, transform, outTransform!);
        },

        pp_convertTransformObjectToLocalQuat<T extends Quaternion2, U extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformObjectToLocalQuat(this, transform, outTransform!);
        },

        pp_convertTransformLocalToObject<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformLocalToObject(this, transform, outTransform!);
        },

        pp_convertTransformLocalToObjectMatrix<T extends Matrix4, U extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformLocalToObjectMatrix(this, transform, outTransform!);
        },

        pp_convertTransformLocalToObjectQuat<T extends Quaternion2, U extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
            return ObjectUtils.convertTransformLocalToObjectQuat(this, transform, outTransform!);
        },

        pp_setParent(this: Object3D, newParent: Object3D, keepTransformWorld?: boolean): Object3D {
            return ObjectUtils.setParent(this, newParent, keepTransformWorld);
        },

        pp_getParent(this: Readonly<Object3D>): Object3D | null {
            return ObjectUtils.getParent(this);
        },

        pp_addComponent<T extends Component>(this: Object3D, classOrType: ComponentConstructor<T> | string, paramsOrActive?: Record<string, unknown> | boolean, active?: boolean): T | null {
            return ObjectUtils.addComponent(this, classOrType, paramsOrActive, active);
        },

        pp_getComponent<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponent(this, classOrType, index);
        },

        pp_getComponentSelf<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentSelf(this, classOrType, index);
        },

        pp_getComponentHierarchy<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentHierarchy(this, classOrType, index);
        },

        pp_getComponentHierarchyBreadth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentHierarchyBreadth(this, classOrType, index);
        },

        pp_getComponentHierarchyDepth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentHierarchyDepth(this, classOrType, index);
        },

        pp_getComponentDescendants<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentDescendants(this, classOrType, index);
        },

        pp_getComponentDescendantsBreadth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentDescendantsBreadth(this, classOrType, index);
        },

        pp_getComponentDescendantsDepth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentDescendantsDepth(this, classOrType, index);
        },

        pp_getComponentChildren<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentChildren(this, classOrType, index);
        },

        pp_getComponents<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponents(this, classOrType);
        },

        pp_getComponentsSelf<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsSelf(this, classOrType);
        },

        pp_getComponentsHierarchy<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsHierarchy(this, classOrType);
        },

        pp_getComponentsHierarchyBreadth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsHierarchyBreadth(this, classOrType);
        },

        pp_getComponentsHierarchyDepth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsHierarchyDepth(this, classOrType);
        },

        pp_getComponentsDescendants<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsDescendants(this, classOrType);
        },

        pp_getComponentsDescendantsBreadth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsDescendantsBreadth(this, classOrType);
        },

        pp_getComponentsDescendantsDepth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsDescendantsDepth(this, classOrType);
        },

        pp_getComponentsChildren<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsChildren(this, classOrType);
        },

        pp_setActive(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActive(this, active);
        },

        pp_setActiveSelf(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveSelf(this, active);
        },

        pp_setActiveHierarchy(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveHierarchy(this, active);
        },

        pp_setActiveHierarchyBreadth(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveHierarchyBreadth(this, active);
        },

        pp_setActiveHierarchyDepth(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveHierarchyDepth(this, active);
        },

        pp_setActiveDescendants(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveDescendants(this, active);
        },

        pp_setActiveDescendantsBreadth(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveDescendantsBreadth(this, active);
        },

        pp_setActiveDescendantsDepth(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveDescendantsDepth(this, active);
        },

        pp_setActiveChildren(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveChildren(this, active);
        },

        pp_hasUniformScale(this: Readonly<Object3D>): boolean {
            return ObjectUtils.hasUniformScale(this);
        },

        pp_hasUniformScaleWorld(this: Readonly<Object3D>): boolean {
            return ObjectUtils.hasUniformScaleWorld(this);
        },

        pp_hasUniformScaleLocal(this: Readonly<Object3D>): boolean {
            return ObjectUtils.hasUniformScaleLocal(this);
        },

        pp_clone(this: Readonly<Object3D>, cloneParams?: Readonly<ObjectCloneParams>): Object3D | null {
            return ObjectUtils.clone(this, cloneParams);
        },

        pp_isCloneable(this: Readonly<Object3D>, cloneParams?: Readonly<ObjectCloneParams>): boolean {
            return ObjectUtils.isCloneable(this, cloneParams);
        },

        pp_toString(this: Readonly<Object3D>): string {
            return ObjectUtils.toString(this);
        },

        pp_toStringExtended(this: Readonly<Object3D>): string {
            return ObjectUtils.toStringExtended(this);
        },

        pp_toStringCompact(this: Readonly<Object3D>): string {
            return ObjectUtils.toStringCompact(this);
        },

        pp_log(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.log(this);
        },

        pp_logExtended(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.logExtended(this);
        },

        pp_logCompact(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.logCompact(this);
        },

        pp_warn(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.warn(this);
        },

        pp_warnExtended(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.warnExtended(this);
        },

        pp_warnCompact(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.warnCompact(this);
        },

        pp_error(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.error(this);
        },

        pp_errorExtended(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.errorExtended(this);
        },

        pp_errorCompact(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.errorCompact(this);
        },

        pp_getObjectByName(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByName(this, name, isRegex, index);
        },

        pp_getObjectByNameHierarchy(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameHierarchy(this, name, isRegex, index);
        },

        pp_getObjectByNameHierarchyBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameHierarchyBreadth(this, name, isRegex, index);
        },

        pp_getObjectByNameHierarchyDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameHierarchyDepth(this, name, isRegex, index);
        },

        pp_getObjectByNameDescendants(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameDescendants(this, name, isRegex, index);
        },

        pp_getObjectByNameDescendantsBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameDescendantsBreadth(this, name, isRegex, index);
        },

        pp_getObjectByNameDescendantsDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameDescendantsDepth(this, name, isRegex, index);
        },

        pp_getObjectByNameChildren(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameChildren(this, name, isRegex, index);
        },

        pp_getObjectsByName(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByName(this, name, isRegex);
        },

        pp_getObjectsByNameHierarchy(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameHierarchy(this, name, isRegex);
        },

        pp_getObjectsByNameHierarchyBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameHierarchyBreadth(this, name, isRegex);
        },

        pp_getObjectsByNameHierarchyDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameHierarchyDepth(this, name, isRegex);
        },

        pp_getObjectsByNameDescendants(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameDescendants(this, name, isRegex);
        },

        pp_getObjectsByNameDescendantsBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameDescendantsBreadth(this, name, isRegex);
        },

        pp_getObjectsByNameDescendantsDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameDescendantsDepth(this, name, isRegex);
        },

        pp_getObjectsByNameChildren(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameChildren(this, name, isRegex);
        },

        pp_getObjectByID(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByID(this, id);
        },

        pp_getObjectByIDHierarchy(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDHierarchy(this, id);
        },

        pp_getObjectByIDHierarchyBreadth(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDHierarchyBreadth(this, id);
        },

        pp_getObjectByIDHierarchyDepth(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDHierarchyDepth(this, id);
        },

        pp_getObjectByIDDescendants(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDDescendants(this, id);
        },

        pp_getObjectByIDDescendantsBreadth(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDDescendantsBreadth(this, id);
        },

        pp_getObjectByIDDescendantsDepth(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDDescendantsDepth(this, id);
        },

        pp_getObjectByIDChildren(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDChildren(this, id);
        },

        pp_getHierarchy(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getHierarchy(this);
        },

        pp_getHierarchyBreadth(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getHierarchyBreadth(this);
        },

        pp_getHierarchyDepth(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getHierarchyDepth(this);
        },

        pp_getDescendants(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getDescendants(this);
        },

        pp_getDescendantsBreadth(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getDescendantsBreadth(this);
        },

        pp_getDescendantsDepth(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getDescendantsDepth(this);
        },

        pp_getChildren(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getChildren(this);
        },

        pp_getSelf(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.getSelf(this);
        },

        pp_addChild(this: Object3D): Object3D {
            return ObjectUtils.addChild(this);
        },

        pp_getName(this: Readonly<Object3D>): string {
            return ObjectUtils.getName(this);
        },

        pp_setName(this: Object3D, name: string): Object3D {
            return ObjectUtils.setName(this, name);
        },

        pp_getEngine(this: Readonly<Object3D>): WonderlandEngine {
            return ObjectUtils.getEngine(this);
        },

        pp_getID(this: Readonly<Object3D>): number {
            return ObjectUtils.getID(this);
        },

        pp_markDirty(this: Object3D): Object3D {
            return ObjectUtils.markDirty(this);
        },

        pp_isTransformChanged(this: Readonly<Object3D>): boolean {
            return ObjectUtils.isTransformChanged(this);
        },

        pp_destroy(this: Object3D): void {
            return ObjectUtils.destroy(this);
        },

        pp_reserveObjects(this: Readonly<Object3D>, count: number): Object3D {
            return ObjectUtils.reserveObjects(this, count);
        },

        pp_reserveObjectsSelf(this: Readonly<Object3D>, count: number): Object3D {
            return ObjectUtils.reserveObjectsSelf(this, count);
        },

        pp_reserveObjectsHierarchy(this: Readonly<Object3D>, count: number): Object3D {
            return ObjectUtils.reserveObjectsHierarchy(this, count);
        },

        pp_reserveObjectsDescendants(this: Readonly<Object3D>, count: number): Object3D {
            return ObjectUtils.reserveObjectsDescendants(this, count);
        },

        pp_reserveObjectsChildren(this: Readonly<Object3D>, count: number): Object3D {
            return ObjectUtils.reserveObjectsChildren(this, count);
        },

        pp_getComponentsAmountMap(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number> {
            return ObjectUtils.getComponentsAmountMap(this, outComponentsAmountMap!);
        },

        pp_getComponentsAmountMapSelf(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number> {
            return ObjectUtils.getComponentsAmountMapSelf(this, outComponentsAmountMap!);
        },

        pp_getComponentsAmountMapHierarchy(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number> {
            return ObjectUtils.getComponentsAmountMapHierarchy(this, outComponentsAmountMap!);
        },

        pp_getComponentsAmountMapDescendants(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number> {
            return ObjectUtils.getComponentsAmountMapDescendants(this, outComponentsAmountMap!);
        },

        pp_getComponentsAmountMapChildren(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number> {
            return ObjectUtils.getComponentsAmountMapChildren(this, outComponentsAmountMap!);
        }
    };

    PluginUtils.injectOwnProperties(objectExtension, Object3D.prototype, false, true, true);
}


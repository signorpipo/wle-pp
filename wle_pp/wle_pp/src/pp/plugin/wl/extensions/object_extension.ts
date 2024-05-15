import { Component, Object3D, WonderlandEngine, type ComponentConstructor } from "@wonderlandengine/api";
import { Matrix3, Matrix4, Quaternion, Quaternion2, Vector3 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { CloneParams, ObjectUtils } from "../../../cauldron/wl/utils/object_utils.js";
import { PluginUtils } from "../../utils/plugin_utils.js";
import { Object3DExtension } from "./object_type_extension.js";

import "./object_type_extension.js";

export function initObjectExtension(): void {
    _initObjectExtensionProtoype();
}

function _initObjectExtensionProtoype(): void {

    const objectExtension: Object3DExtension = {

        // GETTER

        // Position

        pp_getPosition: function pp_getPosition<T extends Vector3>(this: Readonly<Object3D>, outPosition?: T): T {
            return ObjectUtils.getPosition(this, outPosition);
        },

        pp_getPositionWorld: function pp_getPositionWorld<T extends Vector3>(this: Readonly<Object3D>, outPosition?: T): T {
            return ObjectUtils.getPositionWorld(this, outPosition);
        },

        pp_getPositionLocal: function pp_getPositionLocal<T extends Vector3>(this: Readonly<Object3D>, outPosition?: T): T {
            return ObjectUtils.getPositionLocal(this, outPosition);
        },

        // Rotation

        pp_getRotation: function pp_getRotation<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotation(this, outRotation);
        },

        pp_getRotationDegrees: function pp_getRotationDegrees<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationDegrees(this, outRotation);
        },

        pp_getRotationRadians: function pp_getRotationRadians<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationRadians(this, outRotation);
        },

        pp_getRotationMatrix: function pp_getRotationMatrix<T extends Matrix3>(this: Readonly<Object3D>, outRotation?: Matrix3 | T): Matrix3 | T {
            return ObjectUtils.getRotationMatrix(this, outRotation!);
        },

        pp_getRotationQuat: function pp_getRotationQuat<T extends Quaternion>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationQuat(this, outRotation);
        },

        // Rotation World

        pp_getRotationWorld: function pp_getRotationWorld<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationWorld(this, outRotation);
        },

        pp_getRotationWorldDegrees: function pp_getRotationWorldDegrees<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationWorldDegrees(this, outRotation);
        },

        pp_getRotationWorldRadians: function pp_getRotationWorldRadians<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationWorldRadians(this, outRotation);
        },

        pp_getRotationWorldMatrix: function pp_getRotationWorldMatrix<T extends Matrix3>(this: Readonly<Object3D>, outRotation?: Matrix3 | T): Matrix3 | T {
            return ObjectUtils.getRotationWorldMatrix(this, outRotation!);
        },

        pp_getRotationWorldQuat: function pp_getRotationWorldQuat<T extends Quaternion>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationWorldQuat(this, outRotation);
        },

        // Rotation Local

        pp_getRotationLocal: function pp_getRotationLocal<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationLocal(this, outRotation);
        },

        pp_getRotationLocalDegrees: function pp_getRotationLocalDegrees<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationLocalDegrees(this, outRotation);
        },

        pp_getRotationLocalRadians: function pp_getRotationLocalRadians<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationLocalRadians(this, outRotation);
        },

        pp_getRotationLocalMatrix: function pp_getRotationLocalMatrix<T extends Matrix3>(this: Readonly<Object3D>, outRotation?: Matrix3 | T): Matrix3 | T {
            return ObjectUtils.getRotationLocalMatrix(this, outRotation!);
        },

        pp_getRotationLocalQuat: function pp_getRotationLocalQuat<T extends Quaternion>(this: Readonly<Object3D>, outRotation?: T): T {
            return ObjectUtils.getRotationLocalQuat(this, outRotation);
        },

        // Scale

        pp_getScale: function pp_getScale<T extends Vector3>(this: Readonly<Object3D>, outScale?: T): T {
            return ObjectUtils.getScale(this, outScale);
        },

        pp_getScaleWorld: function pp_getScaleWorld<T extends Vector3>(this: Readonly<Object3D>, outScale?: T): T {
            return ObjectUtils.getScaleWorld(this, outScale);
        },

        pp_getScaleLocal: function pp_getScaleLocal<T extends Vector3>(this: Readonly<Object3D>, outScale?: T): T {
            return ObjectUtils.getScaleLocal(this, outScale);
        },

        // Transform

        pp_getTransform: function pp_getTransform<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T {
            return ObjectUtils.getTransform(this, outTransform!);
        },

        pp_getTransformMatrix: function pp_getTransformMatrix<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T {
            return ObjectUtils.getTransformMatrix(this, outTransform!);
        },

        pp_getTransformQuat: function pp_getTransformQuat<T extends Quaternion2>(this: Readonly<Object3D>, outTransform?: T): T {
            return ObjectUtils.getTransformQuat(this, outTransform);
        },

        // Transform World

        pp_getTransformWorld: function pp_getTransformWorld<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T {
            return ObjectUtils.getTransformWorld(this, outTransform!);
        },

        pp_getTransformWorldMatrix: function pp_getTransformWorldMatrix<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T {
            return ObjectUtils.getTransformWorldMatrix(this, outTransform!);
        },

        pp_getTransformWorldQuat: function pp_getTransformWorldQuat<T extends Quaternion2>(this: Readonly<Object3D>, outTransform?: T): T {
            return ObjectUtils.getTransformWorldQuat(this, outTransform);
        },

        // Transform Local

        pp_getTransformLocal: function pp_getTransformLocal<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T {
            return ObjectUtils.getTransformLocal(this, outTransform!);
        },

        pp_getTransformLocalMatrix: function pp_getTransformLocalMatrix<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T {
            return ObjectUtils.getTransformLocalMatrix(this, outTransform!);
        },

        pp_getTransformLocalQuat: function pp_getTransformLocalQuat<T extends Quaternion2>(this: Readonly<Object3D>, outTransform?: T): T {
            return ObjectUtils.getTransformLocalQuat(this, outTransform);
        },

        // Axes

        pp_getAxes: function pp_getAxes(this: Readonly<Object3D>, outAxes?: [Vector3, Vector3, Vector3]): [Vector3, Vector3, Vector3] {
            return ObjectUtils.getAxes(this, outAxes);
        },

        pp_getAxesWorld: function pp_getAxesWorld(this: Readonly<Object3D>, outAxes?: [Vector3, Vector3, Vector3]): [Vector3, Vector3, Vector3] {
            return ObjectUtils.getAxesWorld(this, outAxes);
        },

        pp_getAxesLocal: function pp_getAxesLocal(this: Readonly<Object3D>, outAxes?: [Vector3, Vector3, Vector3]): [Vector3, Vector3, Vector3] {
            return ObjectUtils.getAxesLocal(this, outAxes);
        },

        // Forward

        pp_getForward: function pp_getForward<T extends Vector3>(this: Readonly<Object3D>, outForward?: T): T {
            return ObjectUtils.getForward(this, outForward);
        },

        pp_getForwardWorld: function pp_getForwardWorld<T extends Vector3>(this: Readonly<Object3D>, outForward?: T): T {
            return ObjectUtils.getForwardWorld(this, outForward);
        },

        pp_getForwardLocal: function pp_getForwardLocal<T extends Vector3>(this: Readonly<Object3D>, outForward?: T): T {
            return ObjectUtils.getForwardLocal(this, outForward);
        },

        // Backward

        pp_getBackward: function pp_getBackward<T extends Vector3>(this: Readonly<Object3D>, outBackward?: T): T {
            return ObjectUtils.getBackward(this, outBackward);
        },

        pp_getBackwardWorld: function pp_getBackwardWorld<T extends Vector3>(this: Readonly<Object3D>, outBackward?: T): T {
            return ObjectUtils.getBackwardWorld(this, outBackward);
        },

        pp_getBackwardLocal: function pp_getBackwardLocal<T extends Vector3>(this: Readonly<Object3D>, outBackward?: T): T {
            return ObjectUtils.getBackwardLocal(this, outBackward);
        },

        // Up

        pp_getUp: function pp_getUp<T extends Vector3>(this: Readonly<Object3D>, outUp?: T): T {
            return ObjectUtils.getUp(this, outUp);
        },

        pp_getUpWorld: function pp_getUpWorld<T extends Vector3>(this: Readonly<Object3D>, outUp?: T): T {
            return ObjectUtils.getUpWorld(this, outUp);
        },

        pp_getUpLocal: function pp_getUpLocal<T extends Vector3>(this: Readonly<Object3D>, outUp?: T): T {
            return ObjectUtils.getUpLocal(this, outUp);
        },

        // Down

        pp_getDown: function pp_getDown<T extends Vector3>(this: Readonly<Object3D>, outDown?: T): T {
            return ObjectUtils.getDown(this, outDown);
        },

        pp_getDownWorld: function pp_getDownWorld<T extends Vector3>(this: Readonly<Object3D>, outDown?: T): T {
            return ObjectUtils.getDownWorld(this, outDown);
        },

        pp_getDownLocal: function pp_getDownLocal<T extends Vector3>(this: Readonly<Object3D>, outDown?: T): T {
            return ObjectUtils.getDownLocal(this, outDown);
        },

        // Left

        pp_getLeft: function pp_getLeft<T extends Vector3>(this: Readonly<Object3D>, outLeft?: T): T {
            return ObjectUtils.getLeft(this, outLeft);
        },

        pp_getLeftWorld: function pp_getLeftWorld<T extends Vector3>(this: Readonly<Object3D>, outLeft?: T): T {
            return ObjectUtils.getLeftWorld(this, outLeft);
        },

        pp_getLeftLocal: function pp_getLeftLocal<T extends Vector3>(this: Readonly<Object3D>, outLeft?: T): T {
            return ObjectUtils.getLeftLocal(this, outLeft);
        },

        // Right

        pp_getRight: function pp_getRight<T extends Vector3>(this: Readonly<Object3D>, outRight?: T): T {
            return ObjectUtils.getRight(this, outRight);
        },

        pp_getRightWorld: function pp_getRightWorld<T extends Vector3>(this: Readonly<Object3D>, outRight?: T): T {
            return ObjectUtils.getRightWorld(this, outRight);
        },

        pp_getRightLocal: function pp_getRightLocal<T extends Vector3>(this: Readonly<Object3D>, outRight?: T): T {
            return ObjectUtils.getRightLocal(this, outRight);
        },

        // SETTER

        // Position

        pp_setPosition: function pp_setPosition(this: Object3D, position: Readonly<Vector3>): Object3D {
            return ObjectUtils.setPosition(this, position);
        },

        pp_setPositionWorld: function pp_setPositionWorld(this: Object3D, position: Readonly<Vector3>): Object3D {
            return ObjectUtils.setPositionWorld(this, position);
        },

        pp_setPositionLocal: function pp_setPositionLocal(this: Object3D, position: Readonly<Vector3>): Object3D {
            return ObjectUtils.setPositionLocal(this, position);
        },

        // Rotation

        pp_setRotation: function pp_setRotation(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotation(this, rotation);
        },

        pp_setRotationDegrees: function pp_setRotationDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationDegrees(this, rotation);
        },

        pp_setRotationRadians: function pp_setRotationRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationRadians(this, rotation);
        },

        pp_setRotationMatrix: function pp_setRotationMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.setRotationMatrix(this, rotation);
        },

        pp_setRotationQuat: function pp_setRotationQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.setRotationQuat(this, rotation);
        },

        // Rotation World

        pp_setRotationWorld: function pp_setRotationWorld(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationWorld(this, rotation);
        },

        pp_setRotationWorldDegrees: function pp_setRotationWorldDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationWorldDegrees(this, rotation);
        },

        pp_setRotationWorldRadians: function pp_setRotationWorldRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationWorldRadians(this, rotation);
        },

        pp_setRotationWorldMatrix: function pp_setRotationWorldMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.setRotationWorldMatrix(this, rotation);
        },

        pp_setRotationWorldQuat: function pp_setRotationWorldQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.setRotationWorldQuat(this, rotation);
        },

        // Rotation Local

        pp_setRotationLocal: function pp_setRotationLocal(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationLocal(this, rotation);
        },

        pp_setRotationLocalDegrees: function pp_setRotationLocalDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationLocalDegrees(this, rotation);
        },

        pp_setRotationLocalRadians: function pp_setRotationLocalRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRotationLocalRadians(this, rotation);
        },

        pp_setRotationLocalMatrix: function pp_setRotationLocalMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.setRotationLocalMatrix(this, rotation);
        },

        pp_setRotationLocalQuat: function pp_setRotationLocalQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.setRotationLocalQuat(this, rotation);
        },

        // Scale

        pp_setScale: function pp_setScale(this: Object3D, scale: Vector3 | number): Object3D {
            return ObjectUtils.setScale(this, scale as Vector3);
        },

        pp_setScaleWorld: function pp_setScaleWorld(this: Object3D, scale: Vector3 | number): Object3D {
            return ObjectUtils.setScaleWorld(this, scale as Vector3);
        },

        pp_setScaleLocal: function pp_setScaleLocal(this: Object3D, scale: Vector3 | number): Object3D {
            return ObjectUtils.setScaleLocal(this, scale as Vector3);
        },

        // Axes    

        pp_setAxes: function pp_setAxes(this: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setAxes(this, left, up, forward);
        },

        pp_setAxesWorld: function pp_setAxesWorld(this: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setAxesWorld(this, left, up, forward);
        },

        pp_setAxesLocal: function pp_setAxesLocal(this: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setAxesLocal(this, left, up, forward);
        },

        // Forward

        pp_setForward: function pp_setForward(this: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setForward(this, forward, up, left);
        },

        pp_setForwardWorld: function pp_setForwardWorld(this: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setForwardWorld(this, forward, up, left);
        },

        pp_setForwardLocal: function pp_setForwardLocal(this: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setForwardLocal(this, forward, up, left);
        },

        // Backward

        pp_setBackward: function pp_setBackward(this: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setBackward(this, backward, up, left);
        },

        pp_setBackwardWorld: function pp_setBackwardWorld(this: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setBackwardWorld(this, backward, up, left);
        },

        pp_setBackwardLocal: function pp_setBackwardLocal(this: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setBackwardLocal(this, backward, up, left);
        },

        // Up

        pp_setUp: function pp_setUp(this: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setUp(this, up, forward, left);
        },

        pp_setUpWorld: function pp_setUpWorld(this: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setUpWorld(this, up, forward, left);
        },

        pp_setUpLocal: function pp_setUpLocal(this: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setUpLocal(this, up, forward, left);
        },

        // Down

        pp_setDown: function pp_setDown(this: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setDown(this, down, forward, left);
        },

        pp_setDownWorld: function pp_setDownWorld(this: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setDownWorld(this, down, forward, left);
        },

        pp_setDownLocal: function pp_setDownLocal(this: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setDownLocal(this, down, forward, left);
        },

        // Left

        pp_setLeft: function pp_setLeft(this: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setLeft(this, left, up, forward);
        },

        pp_setLeftWorld: function pp_setLeftWorld(this: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setLeftWorld(this, left, up, forward);
        },

        pp_setLeftLocal: function pp_setLeftLocal(this: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setLeftLocal(this, left, up, forward);
        },

        // Right

        pp_setRight: function pp_setRight(this: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRight(this, right, up, forward);
        },

        pp_setRightWorld: function pp_setRightWorld(this: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRightWorld(this, right, up, forward);
        },

        pp_setRightLocal: function pp_setRightLocal(this: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
            return ObjectUtils.setRightLocal(this, right, up, forward);
        },

        // Transform

        pp_setTransform: function pp_setTransform(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransform(this, transform);
        },

        pp_setTransformMatrix: function pp_setTransformMatrix(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransformMatrix(this, transform);
        },

        pp_setTransformQuat: function pp_setTransformQuat(this: Object3D, transform: Readonly<Quaternion2>): Object3D {
            return ObjectUtils.setTransformQuat(this, transform);
        },

        // Transform World

        pp_setTransformWorld: function pp_setTransformWorld(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransformWorld(this, transform);
        },

        pp_setTransformWorldMatrix: function pp_setTransformWorldMatrix(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransformWorldMatrix(this, transform);
        },

        pp_setTransformWorldQuat: function pp_setTransformWorldQuat(this: Object3D, transform: Readonly<Quaternion2>): Object3D {
            return ObjectUtils.setTransformWorldQuat(this, transform);
        },

        // Transform Local

        pp_setTransformLocal: function pp_setTransformLocal(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransformLocal(this, transform);
        },

        pp_setTransformLocalMatrix: function pp_setTransformLocalMatrix(this: Object3D, transform: Readonly<Matrix4>): Object3D {
            return ObjectUtils.setTransformLocalMatrix(this, transform);
        },

        pp_setTransformLocalQuat: function pp_setTransformLocalQuat(this: Object3D, transform: Readonly<Quaternion2>): Object3D {
            return ObjectUtils.setTransformLocalQuat(this, transform);
        },

        // RESET

        // Position

        pp_resetPosition: function pp_resetPosition(this: Object3D): Object3D {
            return ObjectUtils.resetPosition(this);
        },

        pp_resetPositionWorld: function pp_resetPositionWorld(this: Object3D): Object3D {
            return ObjectUtils.resetPositionWorld(this);
        },

        pp_resetPositionLocal: function pp_resetPositionLocal(this: Object3D): Object3D {
            return ObjectUtils.resetPositionLocal(this);
        },

        // Rotation

        pp_resetRotation: function pp_resetRotation(this: Object3D): Object3D {
            return ObjectUtils.resetRotation(this);
        },

        pp_resetRotationWorld: function pp_resetRotationWorld(this: Object3D): Object3D {
            return ObjectUtils.resetRotationWorld(this);
        },

        pp_resetRotationLocal: function pp_resetRotationLocal(this: Object3D): Object3D {
            return ObjectUtils.resetRotationLocal(this);
        },

        // Scale

        pp_resetScale: function pp_resetScale(this: Object3D): Object3D {
            return ObjectUtils.resetScale(this);
        },

        pp_resetScaleWorld: function pp_resetScaleWorld(this: Object3D): Object3D {
            return ObjectUtils.resetScaleWorld(this);
        },

        pp_resetScaleLocal: function pp_resetScaleLocal(this: Object3D): Object3D {
            return ObjectUtils.resetScaleLocal(this);
        },

        // Transform

        pp_resetTransform: function pp_resetTransform(this: Object3D): Object3D {
            return ObjectUtils.resetTransform(this);
        },

        pp_resetTransformWorld: function pp_resetTransformWorld(this: Object3D): Object3D {
            return ObjectUtils.resetTransformWorld(this);
        },

        pp_resetTransformLocal: function pp_resetTransformLocal(this: Object3D): Object3D {
            return ObjectUtils.resetTransformLocal(this);
        },

        // TRANSFORMATIONS

        // Translate

        pp_translate: function pp_translate(this: Object3D, translation: Readonly<Vector3>): Object3D {
            return ObjectUtils.translate(this, translation);
        },

        pp_translateWorld: function pp_translateWorld(this: Object3D, translation: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateWorld(this, translation);
        },

        pp_translateLocal: function pp_translateLocal(this: Object3D, translation: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateLocal(this, translation);
        },

        pp_translateObject: function pp_translateObject(this: Object3D, translation: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateObject(this, translation);
        },

        // Translate Axis

        pp_translateAxis: function pp_translateAxis(this: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateAxis(this, amount, direction);
        },

        pp_translateAxisWorld: function pp_translateAxisWorld(this: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateAxisWorld(this, amount, direction);
        },

        pp_translateAxisLocal: function pp_translateAxisLocal(this: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateAxisLocal(this, amount, direction);
        },

        pp_translateAxisObject: function pp_translateAxisObject(this: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
            return ObjectUtils.translateAxisObject(this, amount, direction);
        },

        // Rotate

        pp_rotate: function pp_rotate(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotate(this, rotation);
        },

        pp_rotateDegrees: function pp_rotateDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateDegrees(this, rotation);
        },

        pp_rotateRadians: function pp_rotateRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateRadians(this, rotation);
        },

        pp_rotateMatrix: function pp_rotateMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.rotateMatrix(this, rotation);
        },

        pp_rotateQuat: function pp_rotateQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.rotateQuat(this, rotation);
        },

        // Rotate World

        pp_rotateWorld: function pp_rotateWorld(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateWorld(this, rotation);
        },

        pp_rotateWorldDegrees: function pp_rotateWorldDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateWorldDegrees(this, rotation);
        },

        pp_rotateWorldRadians: function pp_rotateWorldRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateWorldRadians(this, rotation);
        },

        pp_rotateWorldMatrix: function pp_rotateWorldMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.rotateWorldMatrix(this, rotation);
        },

        pp_rotateWorldQuat: function pp_rotateWorldQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.rotateWorldQuat(this, rotation);
        },

        // Rotate Local

        pp_rotateLocal: function pp_rotateLocal(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateLocal(this, rotation);
        },

        pp_rotateLocalDegrees: function pp_rotateLocalDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateLocalDegrees(this, rotation);
        },

        pp_rotateLocalRadians: function pp_rotateLocalRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateLocalRadians(this, rotation);
        },

        pp_rotateLocalMatrix: function pp_rotateLocalMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.rotateLocalMatrix(this, rotation);
        },

        pp_rotateLocalQuat: function pp_rotateLocalQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.rotateLocalQuat(this, rotation);
        },

        // Rotate Object

        pp_rotateObject: function pp_rotateObject(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateObject(this, rotation);
        },

        pp_rotateObjectDegrees: function pp_rotateObjectDegrees(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateObjectDegrees(this, rotation);
        },

        pp_rotateObjectRadians: function pp_rotateObjectRadians(this: Object3D, rotation: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateObjectRadians(this, rotation);
        },

        pp_rotateObjectMatrix: function pp_rotateObjectMatrix(this: Object3D, rotation: Readonly<Matrix3>): Object3D {
            return ObjectUtils.rotateObjectMatrix(this, rotation);
        },

        pp_rotateObjectQuat: function pp_rotateObjectQuat(this: Object3D, rotation: Readonly<Quaternion>): Object3D {
            return ObjectUtils.rotateObjectQuat(this, rotation);
        },

        // Rotate Axis

        pp_rotateAxis: function pp_rotateAxis(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxis(this, angle, axis);
        },

        pp_rotateAxisDegrees: function pp_rotateAxisDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisDegrees(this, angle, axis);
        },

        pp_rotateAxisRadians: function pp_rotateAxisRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisRadians(this, angle, axis);
        },

        // Rotate Axis World

        pp_rotateAxisWorld: function pp_rotateAxisWorld(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisWorld(this, angle, axis);
        },

        pp_rotateAxisWorldDegrees: function pp_rotateAxisWorldDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisWorldDegrees(this, angle, axis);
        },

        pp_rotateAxisWorldRadians: function pp_rotateAxisWorldRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisWorldRadians(this, angle, axis);
        },

        // Rotate Axis Local

        pp_rotateAxisLocal: function pp_rotateAxisLocal(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisLocal(this, angle, axis);
        },

        pp_rotateAxisLocalDegrees: function pp_rotateAxisLocalDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisLocalDegrees(this, angle, axis);
        },

        pp_rotateAxisLocalRadians: function pp_rotateAxisLocalRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisLocalRadians(this, angle, axis);
        },

        // Rotate Axis Object

        pp_rotateAxisObject: function pp_rotateAxisObject(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisObject(this, angle, axis);
        },

        pp_rotateAxisObjectDegrees: function pp_rotateAxisObjectDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisObjectDegrees(this, angle, axis);
        },

        pp_rotateAxisObjectRadians: function pp_rotateAxisObjectRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAxisObjectRadians(this, angle, axis);
        },

        // Rotate Around

        pp_rotateAround: function pp_rotateAround(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAround(this, rotation, origin);
        },

        pp_rotateAroundDegrees: function pp_rotateAroundDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundDegrees(this, rotation, origin);
        },

        pp_rotateAroundRadians: function pp_rotateAroundRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundRadians(this, rotation, origin);
        },

        pp_rotateAroundMatrix: function pp_rotateAroundMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundMatrix(this, rotation, origin);
        },

        pp_rotateAroundQuat: function pp_rotateAroundQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundQuat(this, rotation, origin);
        },

        // Rotate Around World

        pp_rotateAroundWorld: function pp_rotateAroundWorld(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundWorld(this, rotation, origin);
        },

        pp_rotateAroundWorldDegrees: function pp_rotateAroundWorldDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundWorldDegrees(this, rotation, origin);
        },

        pp_rotateAroundWorldRadians: function pp_rotateAroundWorldRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundWorldRadians(this, rotation, origin);
        },

        pp_rotateAroundWorldMatrix: function pp_rotateAroundWorldMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundWorldMatrix(this, rotation, origin);
        },

        pp_rotateAroundWorldQuat: function pp_rotateAroundWorldQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundWorldQuat(this, rotation, origin);
        },

        // Rotate Around Local

        pp_rotateAroundLocal: function pp_rotateAroundLocal(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundLocal(this, rotation, origin);
        },

        pp_rotateAroundLocalDegrees: function pp_rotateAroundLocalDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundLocalDegrees(this, rotation, origin);
        },

        pp_rotateAroundLocalRadians: function pp_rotateAroundLocalRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundLocalRadians(this, rotation, origin);
        },

        pp_rotateAroundLocalMatrix: function pp_rotateAroundLocalMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundLocalMatrix(this, rotation, origin);
        },

        pp_rotateAroundLocalQuat: function pp_rotateAroundLocalQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundLocalQuat(this, rotation, origin);
        },

        // Rotate Around Object

        pp_rotateAroundObject: function pp_rotateAroundObject(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundObject(this, rotation, origin);
        },

        pp_rotateAroundObjectDegrees: function pp_rotateAroundObjectDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundObjectDegrees(this, rotation, origin);
        },

        pp_rotateAroundObjectRadians: function pp_rotateAroundObjectRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundObjectRadians(this, rotation, origin);
        },

        pp_rotateAroundObjectMatrix: function pp_rotateAroundObjectMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundObjectMatrix(this, rotation, origin);
        },

        pp_rotateAroundObjectQuat: function pp_rotateAroundObjectQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundObjectQuat(this, rotation, origin);
        },

        // Rotate Around Axis

        pp_rotateAroundAxis: function pp_rotateAroundAxis(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxis(this, angle, axis, origin);
        },

        pp_rotateAroundAxisDegrees: function pp_rotateAroundAxisDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisDegrees(this, angle, axis, origin);
        },

        pp_rotateAroundAxisRadians: function pp_rotateAroundAxisRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisRadians(this, angle, axis, origin);
        },

        // Rotate Around Axis World

        pp_rotateAroundAxisWorld: function pp_rotateAroundAxisWorld(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisWorld(this, angle, axis, origin);
        },

        pp_rotateAroundAxisWorldDegrees: function pp_rotateAroundAxisWorldDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisWorldDegrees(this, angle, axis, origin);
        },

        pp_rotateAroundAxisWorldRadians: function pp_rotateAroundAxisWorldRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisWorldRadians(this, angle, axis, origin);
        },

        // Rotate Around Axis Local

        pp_rotateAroundAxisLocal: function pp_rotateAroundAxisLocal(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisLocal(this, angle, axis, origin);
        },

        pp_rotateAroundAxisLocalDegrees: function pp_rotateAroundAxisLocalDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisLocalDegrees(this, angle, axis, origin);
        },

        pp_rotateAroundAxisLocalRadians: function pp_rotateAroundAxisLocalRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisLocalRadians(this, angle, axis, origin);
        },

        // Rotate Around Axis Object

        pp_rotateAroundAxisObject: function pp_rotateAroundAxisObject(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisObject(this, angle, axis, origin);
        },

        pp_rotateAroundAxisObjectDegrees: function pp_rotateAroundAxisObjectDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisObjectDegrees(this, angle, axis, origin);
        },

        pp_rotateAroundAxisObjectRadians: function pp_rotateAroundAxisObjectRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
            return ObjectUtils.rotateAroundAxisObjectRadians(this, angle, axis, origin);
        },

        // Scale

        pp_scaleObject: function pp_scaleObject(this: Object3D, scale: Vector3 | number): Object3D {
            return ObjectUtils.scaleObject(this, scale as Vector3);
        },

        // Look At

        pp_lookAt: function pp_lookAt(this: Object3D, position: Readonly<Vector3>, up: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookAt(this, position, up);
        },

        pp_lookAtWorld: function pp_lookAtWorld(this: Object3D, position: Readonly<Vector3>, up: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookAtWorld(this, position, up);
        },

        pp_lookAtLocal: function pp_lookAtLocal(this: Object3D, position: Readonly<Vector3>, up: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookAtLocal(this, position, up);
        },

        pp_lookTo: function pp_lookTo(this: Object3D, direction: Readonly<Vector3>, up: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookTo(this, direction, up);
        },

        pp_lookToWorld: function pp_lookToWorld(this: Object3D, direction: Readonly<Vector3>, up: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookToWorld(this, direction, up);
        },

        pp_lookToLocal: function pp_lookToLocal(this: Object3D, direction: Readonly<Vector3>, up: Readonly<Vector3>): Object3D {
            return ObjectUtils.lookToLocal(this, direction, up);
        },

        // EXTRA

        // Convert Vector Object World

        pp_convertPositionObjectToWorld: function pp_convertPositionObjectToWorld<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T {
            return ObjectUtils.convertPositionObjectToWorld(this, position, outPosition);
        },

        pp_convertDirectionObjectToWorld: function pp_convertDirectionObjectToWorld<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T {
            return ObjectUtils.convertDirectionObjectToWorld(this, direction, outDirection);
        },

        pp_convertPositionWorldToObject: function pp_convertPositionWorldToObject<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T {
            return ObjectUtils.convertPositionWorldToObject(this, position, outPosition);
        },

        pp_convertDirectionWorldToObject: function pp_convertDirectionWorldToObject<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T {
            return ObjectUtils.convertDirectionWorldToObject(this, direction, outDirection);
        },

        // Convert Vector Local World

        pp_convertPositionLocalToWorld: function pp_convertPositionLocalToWorld<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T {
            return ObjectUtils.convertPositionLocalToWorld(this, position, outPosition);
        },

        pp_convertDirectionLocalToWorld: function pp_convertDirectionLocalToWorld<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T {
            return ObjectUtils.convertDirectionLocalToWorld(this, direction, outDirection);
        },

        pp_convertPositionWorldToLocal: function pp_convertPositionWorldToLocal<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T {
            return ObjectUtils.convertPositionWorldToLocal(this, position, outPosition);
        },

        pp_convertDirectionWorldToLocal: function pp_convertDirectionWorldToLocal<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T {
            return ObjectUtils.convertDirectionWorldToLocal(this, direction, outDirection);
        },

        // Convert Vector Local Object

        pp_convertPositionObjectToLocal: function pp_convertPositionObjectToLocal<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T {
            return ObjectUtils.convertPositionObjectToLocal(this, position, outPosition);
        },

        pp_convertDirectionObjectToLocal: function pp_convertDirectionObjectToLocal<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T {
            return ObjectUtils.convertDirectionObjectToLocal(this, direction, outDirection);
        },

        pp_convertPositionLocalToObject: function pp_convertPositionLocalToObject<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T {
            return ObjectUtils.convertPositionLocalToObject(this, position, outPosition);
        },

        pp_convertDirectionLocalToObject: function pp_convertDirectionLocalToObject<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T {
            return ObjectUtils.convertDirectionLocalToObject(this, direction, outDirection);
        },

        // Convert Transform Object World

        pp_convertTransformObjectToWorld: function pp_convertTransformObjectToWorld<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformObjectToWorld(this, transform, outTransform!);
        },

        pp_convertTransformObjectToWorldMatrix: function pp_convertTransformObjectToWorldMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformObjectToWorldMatrix(this, transform, outTransform!);
        },

        pp_convertTransformObjectToWorldQuat: function pp_convertTransformObjectToWorldQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T {
            return ObjectUtils.convertTransformObjectToWorldQuat(this, transform, outTransform);
        },

        pp_convertTransformWorldToObject: function pp_convertTransformWorldToObject<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformWorldToObject(this, transform, outTransform!);
        },

        pp_convertTransformWorldToObjectMatrix: function pp_convertTransformWorldToObjectMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformWorldToObjectMatrix(this, transform, outTransform!);
        },

        pp_convertTransformWorldToObjectQuat: function pp_convertTransformWorldToObjectQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T {
            return ObjectUtils.convertTransformWorldToObjectQuat(this, transform, outTransform);
        },

        // Convert Transform Local World

        pp_convertTransformLocalToWorld: function pp_convertTransformLocalToWorld<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformLocalToWorld(this, transform, outTransform!);
        },

        pp_convertTransformLocalToWorldMatrix: function pp_convertTransformLocalToWorldMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformLocalToWorldMatrix(this, transform, outTransform!);
        },

        pp_convertTransformLocalToWorldQuat: function pp_convertTransformLocalToWorldQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T {
            return ObjectUtils.convertTransformLocalToWorldQuat(this, transform, outTransform);
        },

        pp_convertTransformWorldToLocal: function pp_convertTransformWorldToLocal<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformWorldToLocal(this, transform, outTransform!);
        },

        pp_convertTransformWorldToLocalMatrix: function pp_convertTransformWorldToLocalMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformWorldToLocalMatrix(this, transform, outTransform!);
        },

        pp_convertTransformWorldToLocalQuat: function pp_convertTransformWorldToLocalQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T {
            return ObjectUtils.convertTransformWorldToLocalQuat(this, transform, outTransform);
        },

        // Convert Transform Object Local

        pp_convertTransformObjectToLocal: function pp_convertTransformObjectToLocal<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformObjectToLocal(this, transform, outTransform!);
        },

        pp_convertTransformObjectToLocalMatrix: function pp_convertTransformObjectToLocalMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformObjectToLocalMatrix(this, transform, outTransform!);
        },

        pp_convertTransformObjectToLocalQuat: function pp_convertTransformObjectToLocalQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T {
            return ObjectUtils.convertTransformObjectToLocalQuat(this, transform, outTransform);
        },

        pp_convertTransformLocalToObject: function pp_convertTransformLocalToObject<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformLocalToObject(this, transform, outTransform!);
        },

        pp_convertTransformLocalToObjectMatrix: function pp_convertTransformLocalToObjectMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T {
            return ObjectUtils.convertTransformLocalToObjectMatrix(this, transform, outTransform!);
        },

        pp_convertTransformLocalToObjectQuat: function pp_convertTransformLocalToObjectQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T {
            return ObjectUtils.convertTransformLocalToObjectQuat(this, transform, outTransform);
        },

        // Parent

        pp_setParent: function pp_setParent(this: Object3D, newParent: Object3D, keepTransformWorld?: boolean): Object3D {
            return ObjectUtils.setParent(this, newParent, keepTransformWorld);
        },

        pp_getParent: function pp_getParent(this: Readonly<Object3D>): Object3D | null {
            return ObjectUtils.getParent(this);
        },

        // Component

        pp_addComponent: function pp_addComponent<T extends Component>(this: Object3D, classOrType: ComponentConstructor<T> | string, paramsOrActive?: Record<string, unknown> | boolean, active?: boolean): T | null {
            return ObjectUtils.addComponent(this, classOrType, paramsOrActive, active);
        },

        pp_getComponent: function pp_getComponent<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponent(this, classOrType, index);
        },

        pp_getComponentSelf: function pp_getComponentSelf<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentSelf(this, classOrType, index);
        },

        pp_getComponentHierarchy: function pp_getComponentHierarchy<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentHierarchy(this, classOrType, index);
        },

        pp_getComponentHierarchyBreadth: function pp_getComponentHierarchyBreadth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentHierarchyBreadth(this, classOrType, index);
        },

        pp_getComponentHierarchyDepth: function pp_getComponentHierarchyDepth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentHierarchyDepth(this, classOrType, index);
        },

        pp_getComponentDescendants: function pp_getComponentDescendants<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentDescendants(this, classOrType, index);
        },

        pp_getComponentDescendantsBreadth: function pp_getComponentDescendantsBreadth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentDescendantsBreadth(this, classOrType, index);
        },

        pp_getComponentDescendantsDepth: function pp_getComponentDescendantsDepth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentDescendantsDepth(this, classOrType, index);
        },

        pp_getComponentChildren: function pp_getComponentChildren<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null {
            return ObjectUtils.getComponentChildren(this, classOrType, index);
        },

        pp_getComponents: function pp_getComponents<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponents(this, classOrType);
        },

        pp_getComponentsSelf: function pp_getComponentsSelf<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsSelf(this, classOrType);
        },

        pp_getComponentsHierarchy: function pp_getComponentsHierarchy<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsHierarchy(this, classOrType);
        },

        pp_getComponentsHierarchyBreadth: function pp_getComponentsHierarchyBreadth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsHierarchyBreadth(this, classOrType);
        },

        pp_getComponentsHierarchyDepth: function pp_getComponentsHierarchyDepth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsHierarchyDepth(this, classOrType);
        },

        pp_getComponentsDescendants: function pp_getComponentsDescendants<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsDescendants(this, classOrType);
        },

        pp_getComponentsDescendantsBreadth: function pp_getComponentsDescendantsBreadth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsDescendantsBreadth(this, classOrType);
        },

        pp_getComponentsDescendantsDepth: function pp_getComponentsDescendantsDepth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsDescendantsDepth(this, classOrType);
        },

        pp_getComponentsChildren: function pp_getComponentsChildren<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
            return ObjectUtils.getComponentsChildren(this, classOrType);
        },

        // Active

        pp_setActive: function pp_setActive(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActive(this, active);
        },

        pp_setActiveSelf: function pp_setActiveSelf(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveSelf(this, active);
        },

        pp_setActiveHierarchy: function pp_setActiveHierarchy(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveHierarchy(this, active);
        },

        pp_setActiveHierarchyBreadth: function pp_setActiveHierarchyBreadth(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveHierarchyBreadth(this, active);
        },

        pp_setActiveHierarchyDepth: function pp_setActiveHierarchyDepth(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveHierarchyDepth(this, active);
        },

        pp_setActiveDescendants: function pp_setActiveDescendants(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveDescendants(this, active);
        },

        pp_setActiveDescendantsBreadth: function pp_setActiveDescendantsBreadth(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveDescendantsBreadth(this, active);
        },

        pp_setActiveDescendantsDepth: function pp_setActiveDescendantsDepth(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveDescendantsDepth(this, active);
        },

        pp_setActiveChildren: function pp_setActiveChildren(this: Object3D, active: boolean): Object3D {
            return ObjectUtils.setActiveChildren(this, active);
        },

        // Uniform Scale

        pp_hasUniformScale: function pp_hasUniformScale(this: Readonly<Object3D>): boolean {
            return ObjectUtils.hasUniformScale(this);
        },

        pp_hasUniformScaleWorld: function pp_hasUniformScaleWorld(this: Readonly<Object3D>): boolean {
            return ObjectUtils.hasUniformScaleWorld(this);
        },

        pp_hasUniformScaleLocal: function pp_hasUniformScaleLocal(this: Readonly<Object3D>): boolean {
            return ObjectUtils.hasUniformScaleLocal(this);
        },

        // Clone

        pp_clone: function pp_clone(this: Readonly<Object3D>, cloneParams?: Readonly<CloneParams>): Object3D | null {
            return ObjectUtils.clone(this, cloneParams);
        },

        pp_isCloneable: function pp_isCloneable(this: Readonly<Object3D>, cloneParams?: Readonly<CloneParams>): boolean {
            return ObjectUtils.isCloneable(this, cloneParams);
        },

        // To String

        pp_toString: function pp_toString(this: Readonly<Object3D>): string {
            return ObjectUtils.toString(this);
        },

        pp_toStringExtended: function pp_toStringExtended(this: Readonly<Object3D>): string {
            return ObjectUtils.toStringExtended(this);
        },

        pp_toStringCompact: function pp_toStringCompact(this: Readonly<Object3D>): string {
            return ObjectUtils.toStringCompact(this);
        },

        // Get Object By Name

        pp_getObjectByName: function pp_getObjectByName(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByName(this, name, isRegex, index);
        },

        pp_getObjectByNameHierarchy: function pp_getObjectByNameHierarchy(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameHierarchy(this, name, isRegex, index);
        },

        pp_getObjectByNameHierarchyBreadth: function pp_getObjectByNameHierarchyBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameHierarchyBreadth(this, name, isRegex, index);
        },

        pp_getObjectByNameHierarchyDepth: function pp_getObjectByNameHierarchyDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameHierarchyDepth(this, name, isRegex, index);
        },

        pp_getObjectByNameDescendants: function pp_getObjectByNameDescendants(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameDescendants(this, name, isRegex, index);
        },

        pp_getObjectByNameDescendantsBreadth: function pp_getObjectByNameDescendantsBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameDescendantsBreadth(this, name, isRegex, index);
        },

        pp_getObjectByNameDescendantsDepth: function pp_getObjectByNameDescendantsDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameDescendantsDepth(this, name, isRegex, index);
        },

        pp_getObjectByNameChildren: function pp_getObjectByNameChildren(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null {
            return ObjectUtils.getObjectByNameChildren(this, name, isRegex, index);
        },

        pp_getObjectsByName: function pp_getObjectsByName(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByName(this, name, isRegex);
        },

        pp_getObjectsByNameHierarchy: function pp_getObjectsByNameHierarchy(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameHierarchy(this, name, isRegex);
        },

        pp_getObjectsByNameHierarchyBreadth: function pp_getObjectsByNameHierarchyBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameHierarchyBreadth(this, name, isRegex);
        },

        pp_getObjectsByNameHierarchyDepth: function pp_getObjectsByNameHierarchyDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameHierarchyDepth(this, name, isRegex);
        },

        pp_getObjectsByNameDescendants: function pp_getObjectsByNameDescendants(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameDescendants(this, name, isRegex);
        },

        pp_getObjectsByNameDescendantsBreadth: function pp_getObjectsByNameDescendantsBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameDescendantsBreadth(this, name, isRegex);
        },

        pp_getObjectsByNameDescendantsDepth: function pp_getObjectsByNameDescendantsDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameDescendantsDepth(this, name, isRegex);
        },

        pp_getObjectsByNameChildren: function pp_getObjectsByNameChildren(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[] {
            return ObjectUtils.getObjectsByNameChildren(this, name, isRegex);
        },

        // Get Object By ID

        pp_getObjectByID: function pp_getObjectByID(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByID(this, id);
        },

        pp_getObjectByIDHierarchy: function pp_getObjectByIDHierarchy(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDHierarchy(this, id);
        },

        pp_getObjectByIDHierarchyBreadth: function pp_getObjectByIDHierarchyBreadth(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDHierarchyBreadth(this, id);
        },

        pp_getObjectByIDHierarchyDepth: function pp_getObjectByIDHierarchyDepth(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDHierarchyDepth(this, id);
        },

        pp_getObjectByIDDescendants: function pp_getObjectByIDDescendants(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDDescendants(this, id);
        },

        pp_getObjectByIDDescendantsBreadth: function pp_getObjectByIDDescendantsBreadth(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDDescendantsBreadth(this, id);
        },

        pp_getObjectByIDDescendantsDepth: function pp_getObjectByIDDescendantsDepth(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDDescendantsDepth(this, id);
        },

        pp_getObjectByIDChildren: function pp_getObjectByIDChildren(this: Readonly<Object3D>, id: number): Object3D | null {
            return ObjectUtils.getObjectByIDChildren(this, id);
        },

        // Get Hierarchy

        pp_getHierarchy: function pp_getHierarchy(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getHierarchy(this);
        },

        pp_getHierarchyBreadth: function pp_getHierarchyBreadth(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getHierarchyBreadth(this);
        },

        pp_getHierarchyDepth: function pp_getHierarchyDepth(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getHierarchyDepth(this);
        },

        pp_getDescendants: function pp_getDescendants(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getDescendants(this);
        },

        pp_getDescendantsBreadth: function pp_getDescendantsBreadth(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getDescendantsBreadth(this);
        },

        pp_getDescendantsDepth: function pp_getDescendantsDepth(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getDescendantsDepth(this);
        },

        pp_getChildren: function pp_getChildren(this: Readonly<Object3D>): Object3D[] {
            return ObjectUtils.getChildren(this);
        },

        pp_getSelf: function pp_getSelf(this: Readonly<Object3D>): Object3D {
            return ObjectUtils.getSelf(this);
        },

        // Cauldron

        pp_addObject: function pp_addObject(this: Object3D): Object3D {
            return ObjectUtils.addObject(this);
        },

        pp_getName: function pp_getName(this: Readonly<Object3D>): string {
            return ObjectUtils.getName(this);
        },

        pp_setName: function pp_setName(this: Object3D, name: string): Object3D {
            return ObjectUtils.setName(this, name);
        },

        pp_getEngine: function pp_getEngine(this: Readonly<Object3D>): WonderlandEngine {
            return ObjectUtils.getEngine(this);
        },

        pp_getID: function pp_getID(this: Readonly<Object3D>): number {
            return ObjectUtils.getID(this);
        },

        pp_markDirty: function pp_markDirty(this: Object3D): Object3D {
            return ObjectUtils.markDirty(this);
        },

        pp_isTransformChanged: function pp_isTransformChanged(this: Readonly<Object3D>): boolean {
            return ObjectUtils.isTransformChanged(this);
        },

        pp_equals: function pp_equals(this: Readonly<Object3D>, object: Readonly<Object3D>): boolean {
            return ObjectUtils.equals(this, object);
        },

        pp_destroy: function pp_destroy(this: Object3D): void {
            return ObjectUtils.destroy(this);
        },

        pp_reserveObjects: function pp_reserveObjects(this: Readonly<Object3D>, count: number): Object3D {
            return ObjectUtils.reserveObjects(this, count);
        },

        pp_reserveObjectsSelf: function pp_reserveObjectsSelf(this: Readonly<Object3D>, count: number): Object3D {
            return ObjectUtils.reserveObjectsSelf(this, count);
        },

        pp_reserveObjectsHierarchy: function pp_reserveObjectsHierarchy(this: Readonly<Object3D>, count: number): Object3D {
            return ObjectUtils.reserveObjectsHierarchy(this, count);
        },

        pp_reserveObjectsDescendants: function pp_reserveObjectsDescendants(this: Readonly<Object3D>, count: number): Object3D {
            return ObjectUtils.reserveObjectsDescendants(this, count);
        },

        pp_reserveObjectsChildren: function pp_reserveObjectsChildren(this: Readonly<Object3D>, count: number): Object3D {
            return ObjectUtils.reserveObjectsChildren(this, count);
        },

        pp_getComponentsAmountMap: function pp_getComponentsAmountMap(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number> {
            return ObjectUtils.getComponentsAmountMap(this, outComponentsAmountMap);
        },

        pp_getComponentsAmountMapSelf: function pp_getComponentsAmountMapSelf(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number> {
            return ObjectUtils.getComponentsAmountMapSelf(this, outComponentsAmountMap);
        },

        pp_getComponentsAmountMapHierarchy: function pp_getComponentsAmountMapHierarchy(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number> {
            return ObjectUtils.getComponentsAmountMapHierarchy(this, outComponentsAmountMap);
        },

        pp_getComponentsAmountMapDescendants: function pp_getComponentsAmountMapDescendants(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number> {
            return ObjectUtils.getComponentsAmountMapDescendants(this, outComponentsAmountMap);
        },

        pp_getComponentsAmountMapChildren: function pp_getComponentsAmountMapChildren(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number> {
            return ObjectUtils.getComponentsAmountMapChildren(this, outComponentsAmountMap);
        }
    };

    PluginUtils.injectOwnProperties(objectExtension, Object3D.prototype, false, true, true);
}
/**
 * Warning: this type extension is actually added at runtime only if you call `initObjectExtension`
 *          the `initPP` function, which is automatically called by the `pp-gateway` component, does this for you
 */

/**
 *  How to use
 * 
 *  By default the functions work on World space, rotations are in Degrees and transforms are Matrix (and not Quat 2) 
 *  For functions that work with rotations, Matrix means Matrix 3 and Quat means Quat
 *  For functions that work with transforms, Matrix means Matrix 4 and Quat means Quat 2
 * 
 * 
 *  You can add a suffix like World/Local/Object at the end of some functions to specify the space, example:
 *      - pp_getPositionLocal to get the position in local space (parent space)
 *      - pp_translateObject to translate in object space
 * 
 * 
 *  For rotations u can add a suffix like Degrees/Radians/Quat/Matrix to use a specific version, example:
 *      - pp_getRotationDegrees
 *      - pp_setRotationLocalMatrix
 *      - pp_rotateWorldQuat
 *      
 * 
 *  For transform u can add a suffix like Quat/Matrix to use a specific version, example:
 *      - pp_getTransformQuat
 *      - pp_setTransformWorldMatrix
 *      
 * 
 *  Some functions let you specify if u want them to work on the Hierarchy/Descendants/Children/Self where:
 *      - Self: the current object only
 *      - Children: direct children of the object
 *      - Descendants: all the children of the object, including child of child and so on 
 *      - Hierarchy: Descendants plus the current object
 * 
 *  Examples:
 *      - pp_getComponent
 *      - pp_getComponentHierarchy
 *      - pp_getComponentsAmountMapDescendants
 *      - pp_setActiveChildren
 *      - pp_setActiveSelf
 * 
 *  By default the functions work on the Hierarchy
 * 
 *  On some of the functions where u can specify Hierarchy/Descendants u can also specify if the algorithm should explore by Breadth/Depth, example:
 *      - pp_getComponentHierarchyBreadth
 *      - pp_setActiveDescendantsDepth
 * 
 *  By default the functions explore by Breadth
 * 
 * 
 *  The functions leave u the choice of forwarding an out parameter or just get the return value, example:
 *      - let position = this.object.pp_getPosition()
 *      - this.object.pp_getPosition(position)
 *      - the out parameter is always the last one
 * 
 * 
 *  If a method require an engine parameter, u can always avoid specifying it and it will by default use the current main engine
 *  If a method require a scene parameter, u can always avoid specifying it and it will by default use the scene from the current main engine
*/

import { Component, Object3D, WonderlandEngine, type ComponentConstructor } from "@wonderlandengine/api";
import { Matrix3, Matrix4, Quaternion, Quaternion2, Vector3 } from "../../../cauldron/type_definitions/array_type_definitions.js";
import { CloneParams } from "../../../cauldron/wl/utils/object_utils.js";

export interface Object3DExtension {
    pp_getPosition<T extends Vector3>(this: Readonly<Object3D>, outPosition?: T): T;
    pp_getPositionWorld<T extends Vector3>(this: Readonly<Object3D>, outPosition?: T): T;
    pp_getPositionLocal<T extends Vector3>(this: Readonly<Object3D>, outPosition?: T): T;


    pp_getRotation<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T;
    pp_getRotationDegrees<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T;
    pp_getRotationRadians<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T;

    pp_getRotationMatrix(this: Readonly<Object3D>): Matrix3;
    pp_getRotationMatrix<T extends Matrix3>(this: Readonly<Object3D>, outRotation: T): T;

    pp_getRotationQuat<T extends Quaternion>(this: Readonly<Object3D>, outRotation?: T): T;


    pp_getRotationWorld<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T;
    pp_getRotationWorldDegrees<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T;
    pp_getRotationWorldRadians<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T;

    pp_getRotationWorldMatrix(this: Readonly<Object3D>): Matrix3;
    pp_getRotationWorldMatrix<T extends Matrix3>(this: Readonly<Object3D>, outRotation: T): T;

    pp_getRotationWorldQuat<T extends Quaternion>(this: Readonly<Object3D>, outRotation?: T): T;


    pp_getRotationLocal<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T;
    pp_getRotationLocalDegrees<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T;
    pp_getRotationLocalRadians<T extends Vector3>(this: Readonly<Object3D>, outRotation?: T): T;

    pp_getRotationLocalMatrix(this: Readonly<Object3D>): Matrix3;
    pp_getRotationLocalMatrix<T extends Matrix3>(this: Readonly<Object3D>, outRotation: T): T;

    pp_getRotationLocalQuat<T extends Quaternion>(this: Readonly<Object3D>, outRotation?: T): T;


    pp_getScale<T extends Vector3>(this: Readonly<Object3D>, outScale?: T): T;
    pp_getScaleWorld<T extends Vector3>(this: Readonly<Object3D>, outScale?: T): T;
    pp_getScaleLocal<T extends Vector3>(this: Readonly<Object3D>, outScale?: T): T;

    pp_getTransform<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T;
    pp_getTransformMatrix<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T;
    pp_getTransformQuat<T extends Quaternion2>(this: Readonly<Object3D>, outTransform?: T): T;

    pp_getTransformWorld<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T;
    pp_getTransformWorldMatrix<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T;
    pp_getTransformWorldQuat<T extends Quaternion2>(this: Readonly<Object3D>, outTransform?: T): T;

    pp_getTransformLocal<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T;
    pp_getTransformLocalMatrix<T extends Matrix4>(this: Readonly<Object3D>, outTransform?: T): T;
    pp_getTransformLocalQuat<T extends Quaternion2>(this: Readonly<Object3D>, outTransform?: T): T;

    pp_getAxes(this: Readonly<Object3D>, outAxes?: [Vector3, Vector3, Vector3]): [Vector3, Vector3, Vector3];
    pp_getAxesWorld(this: Readonly<Object3D>, outAxes?: [Vector3, Vector3, Vector3]): [Vector3, Vector3, Vector3];
    pp_getAxesLocal(this: Readonly<Object3D>, outAxes?: [Vector3, Vector3, Vector3]): [Vector3, Vector3, Vector3];

    pp_getForward<T extends Vector3>(this: Readonly<Object3D>, outForward?: T): T;
    pp_getForwardWorld<T extends Vector3>(this: Readonly<Object3D>, outForward?: T): T;
    pp_getForwardLocal<T extends Vector3>(this: Readonly<Object3D>, outForward?: T): T;

    pp_getBackward<T extends Vector3>(this: Readonly<Object3D>, outBackward?: T): T;
    pp_getBackwardWorld<T extends Vector3>(this: Readonly<Object3D>, outBackward?: T): T;
    pp_getBackwardLocal<T extends Vector3>(this: Readonly<Object3D>, outBackward?: T): T;

    pp_getUp<T extends Vector3>(this: Readonly<Object3D>, outUp?: T): T;
    pp_getUpWorld<T extends Vector3>(this: Readonly<Object3D>, outUp?: T): T;
    pp_getUpLocal<T extends Vector3>(this: Readonly<Object3D>, outUp?: T): T;

    pp_getDown<T extends Vector3>(this: Readonly<Object3D>, outDown?: T): T;
    pp_getDownWorld<T extends Vector3>(this: Readonly<Object3D>, outDown?: T): T;
    pp_getDownLocal<T extends Vector3>(this: Readonly<Object3D>, outDown?: T): T;

    pp_getLeft<T extends Vector3>(this: Readonly<Object3D>, outLeft?: T): T;
    pp_getLeftWorld<T extends Vector3>(this: Readonly<Object3D>, outLeft?: T): T;
    pp_getLeftLocal<T extends Vector3>(this: Readonly<Object3D>, outLeft?: T): T;

    pp_getRight<T extends Vector3>(this: Readonly<Object3D>, outRight?: T): T;
    pp_getRightWorld<T extends Vector3>(this: Readonly<Object3D>, outRight?: T): T;
    pp_getRightLocal<T extends Vector3>(this: Readonly<Object3D>, outRight?: T): T;

    pp_setPosition(this: Object3D, position: Readonly<Vector3>): this;
    pp_setPositionWorld(this: Object3D, position: Readonly<Vector3>): this;
    pp_setPositionLocal(this: Object3D, position: Readonly<Vector3>): this;

    pp_setRotation(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_setRotationDegrees(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_setRotationRadians(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_setRotationMatrix(this: Object3D, rotation: Readonly<Matrix3>): this;
    pp_setRotationQuat(this: Object3D, rotation: Readonly<Quaternion>): this;

    pp_setRotationWorld(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_setRotationWorldDegrees(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_setRotationWorldRadians(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_setRotationWorldMatrix(this: Object3D, rotation: Readonly<Matrix3>): this;
    pp_setRotationWorldQuat(this: Object3D, rotation: Readonly<Quaternion>): this;

    pp_setRotationLocal(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_setRotationLocalDegrees(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_setRotationLocalRadians(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_setRotationLocalMatrix(this: Object3D, rotation: Readonly<Matrix3>): this;
    pp_setRotationLocalQuat(this: Object3D, rotation: Readonly<Quaternion>): this;

    pp_setScale(this: Object3D, scale: Vector3): this;
    pp_setScale(this: Object3D, uniformScale: number): this;
    pp_setScaleWorld(this: Object3D, scale: Vector3): this;
    pp_setScaleWorld(this: Object3D, uniformScale: number): this;
    pp_setScaleLocal(this: Object3D, scale: Vector3): this;
    pp_setScaleLocal(this: Object3D, uniformScale: number): this;

    pp_setAxes(this: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;
    pp_setAxesWorld(this: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;
    pp_setAxesLocal(this: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;

    pp_setForward(this: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    pp_setForwardWorld(this: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    pp_setForwardLocal(this: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): this;

    pp_setBackward(this: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    pp_setBackwardWorld(this: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    pp_setBackwardLocal(this: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): this;

    pp_setUp(this: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    pp_setUpWorld(this: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    pp_setUpLocal(this: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): this;

    pp_setDown(this: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    pp_setDownWorld(this: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): this;
    pp_setDownLocal(this: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): this;

    pp_setLeft(this: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;
    pp_setLeftWorld(this: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;
    pp_setLeftLocal(this: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;

    pp_setRight(this: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;
    pp_setRightWorld(this: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;
    pp_setRightLocal(this: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): this;

    pp_setTransform(this: Object3D, transform: Readonly<Matrix4>): this;
    pp_setTransformMatrix(this: Object3D, transform: Readonly<Matrix4>): this;
    pp_setTransformQuat(this: Object3D, transform: Readonly<Quaternion2>): this;

    pp_setTransformWorld(this: Object3D, transform: Readonly<Matrix4>): this;
    pp_setTransformWorldMatrix(this: Object3D, transform: Readonly<Matrix4>): this;
    pp_setTransformWorldQuat(this: Object3D, transform: Readonly<Quaternion2>): this;

    pp_setTransformLocal(this: Object3D, transform: Readonly<Matrix4>): this;
    pp_setTransformLocalMatrix(this: Object3D, transform: Readonly<Matrix4>): this;
    pp_setTransformLocalQuat(this: Object3D, transform: Readonly<Quaternion2>): this;

    pp_resetPosition(this: Object3D): this;
    pp_resetPositionWorld(this: Object3D): this;
    pp_resetPositionLocal(this: Object3D): this;

    pp_resetRotation(this: Object3D): this;
    pp_resetRotationWorld(this: Object3D): this;
    pp_resetRotationLocal(this: Object3D): this;

    pp_resetScale(this: Object3D): this;
    pp_resetScaleWorld(this: Object3D): this;
    pp_resetScaleLocal(this: Object3D): this;

    pp_resetTransform(this: Object3D): this;
    pp_resetTransformWorld(this: Object3D): this;
    pp_resetTransformLocal(this: Object3D): this;

    pp_translate(this: Object3D, translation: Readonly<Vector3>): this;
    pp_translateWorld(this: Object3D, translation: Readonly<Vector3>): this;
    pp_translateLocal(this: Object3D, translation: Readonly<Vector3>): this;
    pp_translateObject(this: Object3D, translation: Readonly<Vector3>): this;

    pp_translateAxis(this: Object3D, amount: number, direction: Readonly<Vector3>): this;
    pp_translateAxisWorld(this: Object3D, amount: number, direction: Readonly<Vector3>): this;
    pp_translateAxisLocal(this: Object3D, amount: number, direction: Readonly<Vector3>): this;
    pp_translateAxisObject(this: Object3D, amount: number, direction: Readonly<Vector3>): this;

    pp_rotate(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateDegrees(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateRadians(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateMatrix(this: Object3D, rotation: Readonly<Matrix3>): this;
    pp_rotateQuat(this: Object3D, rotation: Readonly<Quaternion>): this;

    pp_rotateWorld(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateWorldDegrees(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateWorldRadians(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateWorldMatrix(this: Object3D, rotation: Readonly<Matrix3>): this;
    pp_rotateWorldQuat(this: Object3D, rotation: Readonly<Quaternion>): this;

    pp_rotateLocal(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateLocalDegrees(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateLocalRadians(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateLocalMatrix(this: Object3D, rotation: Readonly<Matrix3>): this;
    pp_rotateLocalQuat(this: Object3D, rotation: Readonly<Quaternion>): this;

    pp_rotateObject(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateObjectDegrees(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateObjectRadians(this: Object3D, rotation: Readonly<Vector3>): this;
    pp_rotateObjectMatrix(this: Object3D, rotation: Readonly<Matrix3>): this;
    pp_rotateObjectQuat(this: Object3D, rotation: Readonly<Quaternion>): this;

    pp_rotateAxis(this: Object3D, angle: number, axis: Readonly<Vector3>): this;
    pp_rotateAxisDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): this;
    pp_rotateAxisRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): this;

    pp_rotateAxisWorld(this: Object3D, angle: number, axis: Readonly<Vector3>): this;
    pp_rotateAxisWorldDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): this;
    pp_rotateAxisWorldRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): this;

    pp_rotateAxisLocal(this: Object3D, angle: number, axis: Readonly<Vector3>): this;
    pp_rotateAxisLocalDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): this;
    pp_rotateAxisLocalRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): this;

    pp_rotateAxisObject(this: Object3D, angle: number, axis: Readonly<Vector3>): this;
    pp_rotateAxisObjectDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>): this;
    pp_rotateAxisObjectRadians(this: Object3D, angle: number, axis: Readonly<Vector3>): this;

    pp_rotateAround(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): this;

    pp_rotateAroundWorld(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundWorldDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundWorldRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundWorldMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundWorldQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): this;

    pp_rotateAroundLocal(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundLocalDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundLocalRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundLocalMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundLocalQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): this;

    pp_rotateAroundObject(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundObjectDegrees(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundObjectRadians(this: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundObjectMatrix(this: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundObjectQuat(this: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): this;

    pp_rotateAroundAxis(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundAxisDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundAxisRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;

    pp_rotateAroundAxisWorld(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundAxisWorldDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundAxisWorldRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;

    pp_rotateAroundAxisLocal(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundAxisLocalDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundAxisLocalRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;

    pp_rotateAroundAxisObject(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundAxisObjectDegrees(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;
    pp_rotateAroundAxisObjectRadians(this: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): this;

    pp_scaleObject(this: Object3D, scale: Vector3): this;
    pp_scaleObject(this: Object3D, uniformScale: number): this;

    pp_lookAt(this: Object3D, position: Readonly<Vector3>, up: Readonly<Vector3>): this;
    pp_lookAtWorld(this: Object3D, position: Readonly<Vector3>, up: Readonly<Vector3>): this;
    pp_lookAtLocal(this: Object3D, position: Readonly<Vector3>, up: Readonly<Vector3>): this;

    pp_lookTo(this: Object3D, direction: Readonly<Vector3>, up: Readonly<Vector3>): this;
    pp_lookToWorld(this: Object3D, direction: Readonly<Vector3>, up: Readonly<Vector3>): this;
    pp_lookToLocal(this: Object3D, direction: Readonly<Vector3>, up: Readonly<Vector3>): this;

    pp_convertPositionObjectToWorld<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T;
    pp_convertDirectionObjectToWorld<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T;
    pp_convertPositionWorldToObject<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T;
    pp_convertDirectionWorldToObject<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T;

    pp_convertPositionLocalToWorld<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T;
    pp_convertDirectionLocalToWorld<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T;
    pp_convertPositionWorldToLocal<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T;
    pp_convertDirectionWorldToLocal<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T;

    pp_convertPositionObjectToLocal<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T;
    pp_convertDirectionObjectToLocal<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T;
    pp_convertPositionLocalToObject<T extends Vector3>(this: Readonly<Object3D>, position: Readonly<Vector3>, outPosition?: T): T;
    pp_convertDirectionLocalToObject<T extends Vector3>(this: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection?: T): T;

    pp_convertTransformObjectToWorld<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformObjectToWorldMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformObjectToWorldQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T;
    pp_convertTransformWorldToObject<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformWorldToObjectMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformWorldToObjectQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T;

    pp_convertTransformLocalToWorld<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformLocalToWorldMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformLocalToWorldQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T;
    pp_convertTransformWorldToLocal<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformWorldToLocalMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformWorldToLocalQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T;

    pp_convertTransformObjectToLocal<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformObjectToLocalMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformObjectToLocalQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T;
    pp_convertTransformLocalToObject<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformLocalToObjectMatrix<T extends Matrix4>(this: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform?: T): T;
    pp_convertTransformLocalToObjectQuat<T extends Quaternion2>(this: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform?: T): T;

    pp_setParent(this: Object3D, newParent: Object3D, keepTransformWorld?: boolean): this;
    pp_getParent(this: Readonly<Object3D>): Object3D | null;

    pp_addComponent<T extends Component>(this: Object3D, classOrType: ComponentConstructor<T> | string, paramsOrActive?: Record<string, any> | boolean, active?: boolean): T | null;

    pp_getComponent<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null;
    pp_getComponentSelf<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null;
    pp_getComponentHierarchy<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null;
    pp_getComponentHierarchyBreadth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null;
    pp_getComponentHierarchyDepth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null;
    pp_getComponentDescendants<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null;
    pp_getComponentDescendantsBreadth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null;
    pp_getComponentDescendantsDepth<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null;
    pp_getComponentChildren<T extends Component>(this: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index?: number): T | null;
    pp_getComponents<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[];
    pp_getComponentsSelf<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[];
    pp_getComponentsHierarchy<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[];
    pp_getComponentsHierarchyBreadth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[];
    pp_getComponentsHierarchyDepth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[];
    pp_getComponentsDescendants<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[];
    pp_getComponentsDescendantsBreadth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[];
    pp_getComponentsDescendantsDepth<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[];
    pp_getComponentsChildren<T extends Component>(this: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[];

    pp_setActive(this: Object3D, active: boolean): this;
    pp_setActiveSelf(this: Object3D, active: boolean): this;
    pp_setActiveHierarchy(this: Object3D, active: boolean): this;
    pp_setActiveHierarchyBreadth(this: Object3D, active: boolean): this;
    pp_setActiveHierarchyDepth(this: Object3D, active: boolean): this;
    pp_setActiveDescendants(this: Object3D, active: boolean): this;
    pp_setActiveDescendantsBreadth(this: Object3D, active: boolean): this;
    pp_setActiveDescendantsDepth(this: Object3D, active: boolean): this;
    pp_setActiveChildren(this: Object3D, active: boolean): this;

    pp_hasUniformScale(this: Readonly<Object3D>): boolean;
    pp_hasUniformScaleWorld(this: Readonly<Object3D>): boolean;
    pp_hasUniformScaleLocal(this: Readonly<Object3D>): boolean;

    pp_clone(this: Readonly<Object3D>, cloneParams?: Readonly<CloneParams>): Object3D | null;
    pp_isCloneable(this: Readonly<Object3D>, cloneParams?: Readonly<CloneParams>): boolean;

    pp_toString(this: Readonly<Object3D>): string;
    pp_toStringExtended(this: Readonly<Object3D>): string;
    pp_toStringCompact(this: Readonly<Object3D>): string;

    pp_getObjectByName(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null;
    pp_getObjectByNameHierarchy(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null;
    pp_getObjectByNameHierarchyBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null;
    pp_getObjectByNameHierarchyDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null;
    pp_getObjectByNameDescendants(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null;
    pp_getObjectByNameDescendantsBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null;
    pp_getObjectByNameDescendantsDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null;
    pp_getObjectByNameChildren(this: Readonly<Object3D>, name: string, isRegex?: boolean, index?: number): Object3D | null;
    pp_getObjectsByName(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[];
    pp_getObjectsByNameHierarchy(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[];
    pp_getObjectsByNameHierarchyBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[];
    pp_getObjectsByNameHierarchyDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[];
    pp_getObjectsByNameDescendants(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[];
    pp_getObjectsByNameDescendantsBreadth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[];
    pp_getObjectsByNameDescendantsDepth(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[];
    pp_getObjectsByNameChildren(this: Readonly<Object3D>, name: string, isRegex?: boolean): Object3D[];

    pp_getObjectByID(this: Readonly<Object3D>, id: number): Object3D | null;
    pp_getObjectByIDHierarchy(this: Readonly<Object3D>, id: number): Object3D | null;
    pp_getObjectByIDHierarchyBreadth(this: Readonly<Object3D>, id: number): Object3D | null;
    pp_getObjectByIDHierarchyDepth(this: Readonly<Object3D>, id: number): Object3D | null;
    pp_getObjectByIDDescendants(this: Readonly<Object3D>, id: number): Object3D | null;
    pp_getObjectByIDDescendantsBreadth(this: Readonly<Object3D>, id: number): Object3D | null;
    pp_getObjectByIDDescendantsDepth(this: Readonly<Object3D>, id: number): Object3D | null;
    pp_getObjectByIDChildren(this: Readonly<Object3D>, id: number): Object3D | null;

    pp_getHierarchyBreadth(this: Readonly<Object3D>): Object3D[];
    pp_getHierarchyDepth(this: Readonly<Object3D>): Object3D[];
    pp_getDescendants(this: Readonly<Object3D>): Object3D[];
    pp_getDescendantsBreadth(this: Readonly<Object3D>): Object3D[];
    pp_getDescendantsDepth(this: Readonly<Object3D>): Object3D[];
    pp_getChildren(this: Readonly<Object3D>): Object3D[];
    pp_getSelf(this: Readonly<Object3D>): this;

    pp_addObject(this: Object3D): Object3D;
    pp_getName(this: Readonly<Object3D>): string;
    pp_setName(this: Object3D, name: string): this;
    pp_getEngine(this: Readonly<Object3D>): WonderlandEngine;
    pp_getID(this: Readonly<Object3D>): number;
    pp_markDirty(this: Object3D): this;
    pp_isTransformChanged(this: Readonly<Object3D>): boolean;
    pp_equals(this: Readonly<Object3D>, object: Readonly<Object3D>): boolean;
    pp_destroy(this: Object3D): void;

    pp_reserveObjects(this: Readonly<Object3D>, count: number): this;
    pp_reserveObjectsSelf(this: Readonly<Object3D>, count: number): this;
    pp_reserveObjectsHierarchy(this: Readonly<Object3D>, count: number): this;
    pp_reserveObjectsDescendants(this: Readonly<Object3D>, count: number): this;
    pp_reserveObjectsChildren(this: Readonly<Object3D>, count: number): this;

    pp_getComponentsAmountMap(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number>;
    pp_getComponentsAmountMapSelf(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number>;
    pp_getComponentsAmountMapHierarchy(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number>;
    pp_getComponentsAmountMapDescendants(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number>;
    pp_getComponentsAmountMapChildren(this: Readonly<Object3D>, outComponentsAmountMap?: Map<string, number>): Map<string, number>;
}

declare module "@wonderlandengine/api" {
    export interface Object3D extends Object3DExtension { }
}
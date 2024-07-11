import { Component, Object3D, Scene, WonderlandEngine, type ComponentConstructor } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { Matrix3, Matrix4, Quaternion, Quaternion2, Vector3 } from "../../type_definitions/array_type_definitions.js";
import { Mat3Utils } from "../../utils/array/mat3_utils.js";
import { Mat4Utils } from "../../utils/array/mat4_utils.js";
import { Quat2Utils } from "../../utils/array/quat2_utils.js";
import { QuatUtils } from "../../utils/array/quat_utils.js";
import { Vec3Utils } from "../../utils/array/vec3_utils.js";
import { MathUtils } from "../../utils/math_utils.js";
import { ComponentCustomCloneParams, ComponentDeepCloneParams, ComponentUtils } from "./component_utils.js";

export class ObjectCloneParams {

    /** Defaults to the object to clone parent, null can be used to specify u want the scene root as the parent */
    public myCloneParent: Object3D | null | undefined = undefined;


    /** Ignores components that are not clonable */
    public myIgnoreNonCloneable: boolean = false;
    /** All components are ignored, cloning only the object hierarchy */
    public myIgnoreComponents: boolean = false;
    /** Clones only the given object without the descendants */
    public myIgnoreDescendants: boolean = false;


    /** Ignores all component types in this list (example: `["mesh"]`), has lower priority over `myComponentsToInclude` */
    public myComponentsToIgnore: string[] = [];
    /** Clones only the component types in this list (example: `["mesh"]`), has higher priority over `myComponentsToIgnore`, if empty it's ignored */
    public myComponentsToInclude: string[] = [];
    /** Returns true if the component must be ignored. It's called after the previous filters */
    public myIgnoreComponentCallback: ((component: Component) => boolean) | null = null;


    /** Ignores all the objects in this list, has lower priority over `myDescendantsToInclude` */
    public myDescendantsToIgnore: Object3D[] = [];
    /** Clones only the objects in this list, has higher priority over `myDescendantsToIgnore`, if empty it's ignored */
    public myDescendantsToInclude: Object3D[] = [];
    /** Returns true if the object must be ignored. It's called after the previous filters */
    public myIgnoreDescendantCallback: ((component: Object3D) => boolean) | null = null;


    /** Uses the default component clone function */
    public myUseDefaultComponentClone: boolean = false;
    /** Uses the default component clone function only as fallback, that is if there is no custom component clone */
    public myUseDefaultComponentCloneAsFallback: boolean = false;
    /** Automatically starts the component even if it's cloned not activated, keeping it not active. This also triggers `onActivate` and `onDeactivate` once */
    public myDefaultComponentCloneAutoStartIfNotActive: boolean = true;


    /** Uses the default object clone function, ignoring all the other clone settings but `myCloneParent` and `myDefaultComponentCloneAutoStartIfNotActive` */
    public myUseDefaultObjectClone: boolean = false;
    /** Uses the default object clone function only as fallback, that is if the object is not PP cloneable */
    public myUseDefaultObjectCloneAsFallback: boolean = false;


    /** Used to specify if the object components must be deep cloned or not, you can also override the behavior for specific components and variables */
    public myComponentDeepCloneParams: ComponentDeepCloneParams = new ComponentDeepCloneParams();


    /** This class can be filled with whatever custom paramater the component clone functions could need */
    public myComponentCustomCloneParams: ComponentCustomCloneParams = new ComponentCustomCloneParams();
}

// GETTER

// Position

export function getPosition(object: Readonly<Object3D>): Vector3;
export function getPosition<T extends Vector3>(object: Readonly<Object3D>, outPosition: T): T;
export function getPosition<T extends Vector3>(object: Readonly<Object3D>, outPosition?: T): T {
    return ObjectUtils.getPositionWorld(object, outPosition!);
}

export function getPositionWorld(object: Readonly<Object3D>): Vector3;
export function getPositionWorld<T extends Vector3>(object: Readonly<Object3D>, outPosition: T): T;
export function getPositionWorld<T extends Vector3>(object: Readonly<Object3D>, outPosition: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    object.getPositionWorld(outPosition);
    return outPosition;
}

export function getPositionLocal(object: Readonly<Object3D>): Matrix3;
export function getPositionLocal<T extends Vector3>(object: Readonly<Object3D>, outPosition: T): T;
export function getPositionLocal<T extends Vector3>(object: Readonly<Object3D>, outPosition: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    object.getPositionLocal(outPosition);
    return outPosition;
}

// Rotation

export function getRotation(object: Readonly<Object3D>): Vector3;
export function getRotation<T extends Vector3>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotation<T extends Vector3>(object: Readonly<Object3D>, outRotation?: T): T {
    return ObjectUtils.getRotationWorld(object, outRotation!);
}

export function getRotationDegrees(object: Readonly<Object3D>): Vector3;
export function getRotationDegrees<T extends Vector3>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotationDegrees<T extends Vector3>(object: Readonly<Object3D>, outRotation?: T): T {
    return ObjectUtils.getRotationWorldDegrees(object, outRotation!);
}

export function getRotationRadians(object: Readonly<Object3D>): Vector3;
export function getRotationRadians<T extends Vector3>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotationRadians<T extends Vector3>(object: Readonly<Object3D>, outRotation?: T): T {
    return ObjectUtils.getRotationWorldRadians(object, outRotation!);
}

export function getRotationMatrix(object: Readonly<Object3D>): Matrix3;
export function getRotationMatrix<T extends Matrix3>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotationMatrix<T extends Matrix3>(object: Readonly<Object3D>, outRotation?: Matrix3 | T): Matrix3 | T {
    return ObjectUtils.getRotationWorldMatrix(object, outRotation!);
}

export function getRotationQuat(object: Readonly<Object3D>): Quaternion;
export function getRotationQuat<T extends Quaternion>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotationQuat<T extends Quaternion>(object: Readonly<Object3D>, outRotation?: Quaternion | T): Quaternion | T {
    return ObjectUtils.getRotationWorldQuat(object, outRotation!);
}

// Rotation World

export function getRotationWorld(object: Readonly<Object3D>): Vector3;
export function getRotationWorld<T extends Vector3>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotationWorld<T extends Vector3>(object: Readonly<Object3D>, outRotation?: T): T {
    return ObjectUtils.getRotationWorldDegrees(object, outRotation!);
}

export function getRotationWorldDegrees(object: Readonly<Object3D>): Vector3;
export function getRotationWorldDegrees<T extends Vector3>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotationWorldDegrees<T extends Vector3>(object: Readonly<Object3D>, outRotation?: T): T {
    outRotation = ObjectUtils.getRotationWorldRadians(object, outRotation!);
    Vec3Utils.toDegrees(outRotation, outRotation);
    return outRotation!;
}

export const getRotationWorldRadians = function () {
    const quat = QuatUtils.create();

    function getRotationWorldRadians(object: Readonly<Object3D>): Vector3;
    function getRotationWorldRadians<T extends Vector3>(object: Readonly<Object3D>, outRotation: T): T;
    function getRotationWorldRadians<T extends Vector3>(object: Readonly<Object3D>, outRotation: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.toRadians(quat, outRotation);
        return outRotation;
    }

    return getRotationWorldRadians;
}();

export const getRotationWorldMatrix = function () {
    const quat = QuatUtils.create();

    function getRotationWorldMatrix(object: Readonly<Object3D>): Matrix3;
    function getRotationWorldMatrix<T extends Matrix3>(object: Readonly<Object3D>, outRotation: T): T;
    function getRotationWorldMatrix<T extends Matrix3>(object: Readonly<Object3D>, outRotation: Matrix3 | T = Mat3Utils.create()): Matrix3 | T {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.toMatrix(quat, outRotation);
        return outRotation;
    }

    return getRotationWorldMatrix;
}();

export function getRotationWorldQuat(object: Readonly<Object3D>): Quaternion;
export function getRotationWorldQuat<T extends Quaternion>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotationWorldQuat<T extends Quaternion>(object: Readonly<Object3D>, outRotation: Quaternion | T = QuatUtils.create()): Quaternion | T {
    object.getRotationWorld(outRotation);
    return outRotation;
}

// Rotation Local

export function getRotationLocal(object: Readonly<Object3D>): Vector3;
export function getRotationLocal<T extends Vector3>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotationLocal<T extends Vector3>(object: Readonly<Object3D>, outRotation?: T): T {
    return ObjectUtils.getRotationLocalDegrees(object, outRotation!);
}

export function getRotationLocalDegrees(object: Readonly<Object3D>): Vector3;
export function getRotationLocalDegrees<T extends Vector3>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotationLocalDegrees<T extends Vector3>(object: Readonly<Object3D>, outRotation?: T): T {
    outRotation = ObjectUtils.getRotationLocalRadians(object, outRotation!);
    Vec3Utils.toDegrees(outRotation, outRotation);
    return outRotation!;
}

export const getRotationLocalRadians = function () {
    const quat = QuatUtils.create();

    function getRotationLocalRadians(object: Readonly<Object3D>): Vector3;
    function getRotationLocalRadians<T extends Vector3>(object: Readonly<Object3D>, outRotation: T): T;
    function getRotationLocalRadians<T extends Vector3>(object: Readonly<Object3D>, outRotation: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.toRadians(quat, outRotation);
        return outRotation;
    }

    return getRotationLocalRadians;
}();

export const getRotationLocalMatrix = function () {
    const quat = QuatUtils.create();

    function getRotationLocalMatrix(object: Readonly<Object3D>): Matrix3;
    function getRotationLocalMatrix<T extends Matrix3>(object: Readonly<Object3D>, outRotation: T): T;
    function getRotationLocalMatrix<T extends Matrix3>(object: Readonly<Object3D>, outRotation: Matrix3 | T = Mat3Utils.create()): Matrix3 | T {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.toMatrix(quat, outRotation);
        return outRotation;
    }

    return getRotationLocalMatrix;
}();

export function getRotationLocalQuat(object: Readonly<Object3D>): Quaternion;
export function getRotationLocalQuat<T extends Quaternion>(object: Readonly<Object3D>, outRotation: T): T;
export function getRotationLocalQuat<T extends Quaternion>(object: Readonly<Object3D>, outRotation: Quaternion | T = QuatUtils.create()): Quaternion | T {
    object.getRotationLocal(outRotation);
    return outRotation;
}

// Scale

export function getScale(object: Readonly<Object3D>): Vector3;
export function getScale<T extends Vector3>(object: Readonly<Object3D>, outScale: T): T;
export function getScale<T extends Vector3>(object: Readonly<Object3D>, outScale?: T): T {
    return ObjectUtils.getScaleWorld(object, outScale!);
}

export function getScaleWorld(object: Readonly<Object3D>): Vector3;
export function getScaleWorld<T extends Vector3>(object: Readonly<Object3D>, outScale: T): T;
export function getScaleWorld<T extends Vector3>(object: Readonly<Object3D>, outScale: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    object.getScalingWorld(outScale);
    return outScale;
}

export function getScaleLocal(object: Readonly<Object3D>): Vector3;
export function getScaleLocal<T extends Vector3>(object: Readonly<Object3D>, outScale: T): T;
export function getScaleLocal<T extends Vector3>(object: Readonly<Object3D>, outScale: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    object.getScalingLocal(outScale);
    return outScale;
}

// Transform

export function getTransform(object: Readonly<Object3D>): Matrix4;
export function getTransform<T extends Matrix4>(object: Readonly<Object3D>, outTransform: T): T;
export function getTransform<T extends Matrix4>(object: Readonly<Object3D>, outTransform?: Matrix4 | T): Matrix4 | T {
    return ObjectUtils.getTransformWorld(object, outTransform!);
}

export function getTransformMatrix(object: Readonly<Object3D>): Matrix4;
export function getTransformMatrix<T extends Matrix4>(object: Readonly<Object3D>, outTransform: T): T;
export function getTransformMatrix<T extends Matrix4>(object: Readonly<Object3D>, outTransform?: Matrix4 | T): Matrix4 | T {
    return ObjectUtils.getTransformWorldMatrix(object, outTransform!);
}

export function getTransformQuat(object: Readonly<Object3D>): Quaternion2;
export function getTransformQuat<T extends Quaternion2>(object: Readonly<Object3D>, outTransform: T): T;
export function getTransformQuat<T extends Quaternion2>(object: Readonly<Object3D>, outTransform?: Quaternion2 | T): Quaternion2 | T {
    return ObjectUtils.getTransformWorldQuat(object, outTransform!);
}

// Transform World

export function getTransformWorld(object: Readonly<Object3D>): Matrix4;
export function getTransformWorld<T extends Matrix4>(object: Readonly<Object3D>, outTransform: T): T;
export function getTransformWorld<T extends Matrix4>(object: Readonly<Object3D>, outTransform?: Matrix4 | T): Matrix4 | T {
    return ObjectUtils.getTransformWorldMatrix(object, outTransform!);
}

export const getTransformWorldMatrix = function () {
    const transformQuat = Quat2Utils.create();
    const scale = Vec3Utils.create();

    function getTransformWorldMatrix(object: Readonly<Object3D>): Matrix4;
    function getTransformWorldMatrix<T extends Matrix4>(object: Readonly<Object3D>, outTransform: T): T;
    function getTransformWorldMatrix<T extends Matrix4>(object: Readonly<Object3D>, outTransform: Matrix4 | T = Mat4Utils.create()): Matrix4 | T {
        ObjectUtils.getTransformWorldQuat(object, transformQuat);
        ObjectUtils.getScaleWorld(object, scale);
        Mat4Utils.fromQuat(transformQuat, outTransform);
        Mat4Utils.scale(outTransform, scale, outTransform);
        return outTransform;
    }

    return getTransformWorldMatrix;
}();

export function getTransformWorldQuat(object: Readonly<Object3D>): Quaternion2;
export function getTransformWorldQuat<T extends Quaternion2>(object: Readonly<Object3D>, outTransform: T): T;
export function getTransformWorldQuat<T extends Quaternion2>(object: Readonly<Object3D>, outTransform: Quaternion2 | T = Quat2Utils.create()): Quaternion2 | T {
    object.getTransformWorld(outTransform);
    return outTransform;
}

// Transform Local

export function getTransformLocal(object: Readonly<Object3D>): Matrix4;
export function getTransformLocal<T extends Matrix4>(object: Readonly<Object3D>, outTransform: T): T;
export function getTransformLocal<T extends Matrix4>(object: Readonly<Object3D>, outTransform?: Matrix4 | T): Matrix4 | T {
    return ObjectUtils.getTransformLocalMatrix(object, outTransform!);
}

export const getTransformLocalMatrix = function () {
    const transformQuat = Quat2Utils.create();
    const scale = Vec3Utils.create();

    function getTransformLocalMatrix(object: Readonly<Object3D>): Matrix4;
    function getTransformLocalMatrix<T extends Matrix4>(object: Readonly<Object3D>, outTransform: T): T;
    function getTransformLocalMatrix<T extends Matrix4>(object: Readonly<Object3D>, outTransform: Matrix4 | T = Mat4Utils.create()): Matrix4 | T {
        ObjectUtils.getTransformLocalQuat(object, transformQuat);
        ObjectUtils.getScaleLocal(object, scale);
        Mat4Utils.fromQuat(transformQuat, outTransform);
        Mat4Utils.scale(outTransform, scale, outTransform);
        return outTransform;
    }

    return getTransformLocalMatrix;
}();

export function getTransformLocalQuat(object: Readonly<Object3D>): Quaternion2;
export function getTransformLocalQuat<T extends Quaternion2>(object: Readonly<Object3D>, outTransform: T): T;
export function getTransformLocalQuat<T extends Quaternion2>(object: Readonly<Object3D>, outTransform: Quaternion2 | T = Quat2Utils.create()): Quaternion2 | T {
    object.getTransformLocal(outTransform);
    return outTransform;
}

// Axes

export function getAxes(object: Readonly<Object3D>): [Vector3, Vector3, Vector3];
export function getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(object: Readonly<Object3D>, outAxes: [T, U, V]): [T, U, V];
export function getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(object: Readonly<Object3D>, outAxes: [Vector3, Vector3, Vector3] | [T, U, V] = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]): [Vector3, Vector3, Vector3] | [T, U, V] {
    return ObjectUtils.getAxesWorld(object, outAxes);
}

export function getAxesWorld(object: Readonly<Object3D>): [Vector3, Vector3, Vector3];
export function getAxesWorld<T extends Vector3, U extends Vector3, V extends Vector3>(object: Readonly<Object3D>, outAxes: [T, U, V]): [T, U, V];
export function getAxesWorld<T extends Vector3, U extends Vector3, V extends Vector3>(object: Readonly<Object3D>, outAxes: [Vector3, Vector3, Vector3] | [T, U, V] = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]): [Vector3, Vector3, Vector3] | [T, U, V] {
    ObjectUtils.getLeftWorld(object, outAxes[0]);
    ObjectUtils.getUpWorld(object, outAxes[1]);
    ObjectUtils.getForwardWorld(object, outAxes[2]);
    return outAxes;
}

export function getAxesLocal(object: Readonly<Object3D>): [Vector3, Vector3, Vector3];
export function getAxesLocal<T extends Vector3, U extends Vector3, V extends Vector3>(object: Readonly<Object3D>, outAxes: [T, U, V]): [T, U, V];
export function getAxesLocal<T extends Vector3, U extends Vector3, V extends Vector3>(object: Readonly<Object3D>, outAxes: [Vector3, Vector3, Vector3] | [T, U, V] = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]): [Vector3, Vector3, Vector3] | [T, U, V] {
    ObjectUtils.getLeftLocal(object, outAxes[0]);
    ObjectUtils.getUpLocal(object, outAxes[1]);
    ObjectUtils.getForwardLocal(object, outAxes[2]);
    return outAxes;
}

// Forward

export function getForward(object: Readonly<Object3D>): Vector3;
export function getForward<T extends Vector3>(object: Readonly<Object3D>, outForward: T): T;
export function getForward<T extends Vector3>(object: Readonly<Object3D>, outForward?: T): T {
    return ObjectUtils.getForwardWorld(object, outForward!);
}

export const getForwardWorld = function () {
    const rotation = Mat3Utils.create();

    function getForwardWorld(object: Readonly<Object3D>): Vector3;
    function getForwardWorld<T extends Vector3>(object: Readonly<Object3D>, outForward: T): T;
    function getForwardWorld<T extends Vector3>(object: Readonly<Object3D>, outForward: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        outForward[0] = rotation[6];
        outForward[1] = rotation[7];
        outForward[2] = rotation[8];
        return outForward;
    }

    return getForwardWorld;
}();

export const getForwardLocal = function () {
    const rotation = Mat3Utils.create();

    function getForwardLocal(object: Readonly<Object3D>): Vector3;
    function getForwardLocal<T extends Vector3>(object: Readonly<Object3D>, outForward: T): T;
    function getForwardLocal<T extends Vector3>(object: Readonly<Object3D>, outForward: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        outForward[0] = rotation[6];
        outForward[1] = rotation[7];
        outForward[2] = rotation[8];
        return outForward;
    }

    return getForwardLocal;
}();

// Backward

export function getBackward(object: Readonly<Object3D>): Vector3;
export function getBackward<T extends Vector3>(object: Readonly<Object3D>, outBackward: T): T;
export function getBackward<T extends Vector3>(object: Readonly<Object3D>, outBackward?: T): T {
    return ObjectUtils.getBackwardWorld(object, outBackward!);
}

export const getBackwardWorld = function () {
    const rotation = Mat3Utils.create();

    function getBackwardWorld(object: Readonly<Object3D>): Vector3;
    function getBackwardWorld<T extends Vector3>(object: Readonly<Object3D>, outBackward: T): T;
    function getBackwardWorld<T extends Vector3>(object: Readonly<Object3D>, outBackward: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        outBackward[0] = -rotation[6];
        outBackward[1] = -rotation[7];
        outBackward[2] = -rotation[8];
        return outBackward;
    }

    return getBackwardWorld;
}();

export const getBackwardLocal = function () {
    const rotation = Mat3Utils.create();

    function getBackwardLocal(object: Readonly<Object3D>): Vector3;
    function getBackwardLocal<T extends Vector3>(object: Readonly<Object3D>, outBackward: T): T;
    function getBackwardLocal<T extends Vector3>(object: Readonly<Object3D>, outBackward: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        outBackward[0] = -rotation[6];
        outBackward[1] = -rotation[7];
        outBackward[2] = -rotation[8];
        return outBackward;
    }

    return getBackwardLocal;
}();

// Up

export function getUp(object: Readonly<Object3D>): Vector3;
export function getUp<T extends Vector3>(object: Readonly<Object3D>, outUp: T): T;
export function getUp<T extends Vector3>(object: Readonly<Object3D>, outUp?: T): T {
    return ObjectUtils.getUpWorld(object, outUp!);
}

export const getUpWorld = function () {
    const rotation = Mat3Utils.create();

    function getUpWorld(object: Readonly<Object3D>): Vector3;
    function getUpWorld<T extends Vector3>(object: Readonly<Object3D>, outUp: T): T;
    function getUpWorld<T extends Vector3>(object: Readonly<Object3D>, outUp: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        outUp[0] = rotation[3];
        outUp[1] = rotation[4];
        outUp[2] = rotation[5];
        return outUp;
    }

    return getUpWorld;
}();

export const getUpLocal = function () {
    const rotation = Mat3Utils.create();

    function getUpLocal(object: Readonly<Object3D>): Vector3;
    function getUpLocal<T extends Vector3>(object: Readonly<Object3D>, outUp: T): T;
    function getUpLocal<T extends Vector3>(object: Readonly<Object3D>, outUp: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        outUp[0] = rotation[3];
        outUp[1] = rotation[4];
        outUp[2] = rotation[5];
        return outUp;
    }

    return getUpLocal;
}();

// Down

export function getDown(object: Readonly<Object3D>): Vector3;
export function getDown<T extends Vector3>(object: Readonly<Object3D>, outDown: T): T;
export function getDown<T extends Vector3>(object: Readonly<Object3D>, outDown?: T): T {
    return ObjectUtils.getDownWorld(object, outDown!);
}

export const getDownWorld = function () {
    const rotation = Mat3Utils.create();

    function getDownWorld(object: Readonly<Object3D>): Vector3;
    function getDownWorld<T extends Vector3>(object: Readonly<Object3D>, outDown: T): T;
    function getDownWorld<T extends Vector3>(object: Readonly<Object3D>, outDown: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        outDown[0] = -rotation[3];
        outDown[1] = -rotation[4];
        outDown[2] = -rotation[5];
        return outDown;
    }

    return getDownWorld;
}();

export const getDownLocal = function () {
    const rotation = Mat3Utils.create();

    function getDownLocal(object: Readonly<Object3D>): Vector3;
    function getDownLocal<T extends Vector3>(object: Readonly<Object3D>, outDown: T): T;
    function getDownLocal<T extends Vector3>(object: Readonly<Object3D>, outDown: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        outDown[0] = -rotation[3];
        outDown[1] = -rotation[4];
        outDown[2] = -rotation[5];
        return outDown;
    }

    return getDownLocal;
}();

// Left

export function getLeft(object: Readonly<Object3D>): Vector3;
export function getLeft<T extends Vector3>(object: Readonly<Object3D>, outLeft: T): T;
export function getLeft<T extends Vector3>(object: Readonly<Object3D>, outLeft?: T): T {
    return ObjectUtils.getLeftWorld(object, outLeft!);
}

export const getLeftWorld = function () {
    const rotation = Mat3Utils.create();

    function getLeftWorld(object: Readonly<Object3D>): Vector3;
    function getLeftWorld<T extends Vector3>(object: Readonly<Object3D>, outLeft: T): T;
    function getLeftWorld<T extends Vector3>(object: Readonly<Object3D>, outLeft: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        outLeft[0] = rotation[0];
        outLeft[1] = rotation[1];
        outLeft[2] = rotation[2];
        return outLeft;
    }

    return getLeftWorld;
}();

export const getLeftLocal = function () {
    const rotation = Mat3Utils.create();

    function getLeftLocal(object: Readonly<Object3D>): Vector3;
    function getLeftLocal<T extends Vector3>(object: Readonly<Object3D>, outLeft: T): T;
    function getLeftLocal<T extends Vector3>(object: Readonly<Object3D>, outLeft: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        outLeft[0] = rotation[0];
        outLeft[1] = rotation[1];
        outLeft[2] = rotation[2];
        return outLeft;
    }

    return getLeftLocal;
}();

// Right

export function getRight(object: Readonly<Object3D>): Vector3;
export function getRight<T extends Vector3>(object: Readonly<Object3D>, outRight: T): T;
export function getRight<T extends Vector3>(object: Readonly<Object3D>, outRight?: T): T {
    return ObjectUtils.getRightWorld(object, outRight!);
}

export const getRightWorld = function () {
    const rotation = Mat3Utils.create();

    function getRightWorld(object: Readonly<Object3D>): Vector3;
    function getRightWorld<T extends Vector3>(object: Readonly<Object3D>, outRight: T): T;
    function getRightWorld<T extends Vector3>(object: Readonly<Object3D>, outRight: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        outRight[0] = -rotation[0];
        outRight[1] = -rotation[1];
        outRight[2] = -rotation[2];
        return outRight;
    }

    return getRightWorld;
}();

export const getRightLocal = function () {
    const rotation = Mat3Utils.create();

    function getRightLocal(object: Readonly<Object3D>): Vector3;
    function getRightLocal<T extends Vector3>(object: Readonly<Object3D>, outRight: T): T;
    function getRightLocal<T extends Vector3>(object: Readonly<Object3D>, outRight: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        outRight[0] = -rotation[0];
        outRight[1] = -rotation[1];
        outRight[2] = -rotation[2];
        return outRight;
    }

    return getRightLocal;
}();

// SETTER

// Position

export function setPosition(object: Object3D, position: Readonly<Vector3>): Object3D {
    return ObjectUtils.setPositionWorld(object, position);
}

export function setPositionWorld(object: Object3D, position: Readonly<Vector3>): Object3D {
    return object.setPositionWorld(position);
}

export function setPositionLocal(object: Object3D, position: Readonly<Vector3>): Object3D {
    return object.setPositionLocal(position);
}

// Rotation

export function setRotation(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.setRotationWorld(object, rotation);
}

export function setRotationDegrees(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.setRotationWorldDegrees(object, rotation);
}

export function setRotationRadians(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.setRotationWorldRadians(object, rotation);
}

export function setRotationMatrix(object: Object3D, rotation: Readonly<Matrix3>): Object3D {
    return ObjectUtils.setRotationWorldMatrix(object, rotation);
}

export function setRotationQuat(object: Object3D, rotation: Readonly<Quaternion>): Object3D {
    return ObjectUtils.setRotationWorldQuat(object, rotation);
}

// Rotation World

export function setRotationWorld(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.setRotationWorldDegrees(object, rotation);
}

export const setRotationWorldDegrees = function () {
    const quat = QuatUtils.create();
    return function setRotationWorldDegrees(object: Object3D, rotation: Readonly<Vector3>): Object3D {
        Vec3Utils.degreesToQuat(rotation, quat);
        return ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export const setRotationWorldRadians = function () {
    const degreesRotation = Vec3Utils.create();
    return function setRotationWorldRadians(object: Object3D, rotation: Readonly<Vector3>): Object3D {
        Vec3Utils.toDegrees(rotation, degreesRotation);
        return ObjectUtils.setRotationWorldDegrees(object, degreesRotation);
    };
}();

export const setRotationWorldMatrix = function () {
    const quat = QuatUtils.create();
    return function setRotationWorldMatrix(object: Object3D, rotation: Readonly<Matrix3>): Object3D {
        Mat3Utils.toQuat(rotation, quat);
        return ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export function setRotationWorldQuat(object: Object3D, rotation: Readonly<Quaternion>): Object3D {
    return object.setRotationWorld(rotation);
}

// Rotation Local

export function setRotationLocal(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.setRotationLocalDegrees(object, rotation);
}

export const setRotationLocalDegrees = function () {
    const quat = QuatUtils.create();
    return function setRotationLocalDegrees(object: Object3D, rotation: Readonly<Vector3>): Object3D {
        Vec3Utils.degreesToQuat(rotation, quat);
        return ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

export const setRotationLocalRadians = function () {
    const degreesRotation = Vec3Utils.create();
    return function setRotationLocalRadians(object: Object3D, rotation: Readonly<Vector3>): Object3D {
        Vec3Utils.toDegrees(rotation, degreesRotation);
        return ObjectUtils.setRotationLocalDegrees(object, degreesRotation);
    };
}();

export const setRotationLocalMatrix = function () {
    const quat = QuatUtils.create();
    return function setRotationLocalMatrix(object: Object3D, rotation: Readonly<Matrix3>): Object3D {
        Mat3Utils.toQuat(rotation, quat);
        return ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

export function setRotationLocalQuat(object: Object3D, rotation: Readonly<Quaternion>): Object3D {
    return object.setRotationLocal(rotation);
}

// Scale

export function setScale(object: Object3D, scale: Readonly<Vector3>): Object3D;
export function setScale(object: Object3D, uniformScale: number): Object3D;
export function setScale(object: Object3D, scale: Readonly<Vector3> | number): Object3D {
    return ObjectUtils.setScaleWorld(object, scale as Vector3);
}

export const setScaleWorld = function () {
    const vector = Vec3Utils.create();

    function setScaleWorld(object: Object3D, scale: Readonly<Vector3>): Object3D;
    function setScaleWorld(object: Object3D, uniformScale: number): Object3D;
    function setScaleWorld(object: Object3D, scale: Readonly<Vector3> | number): Object3D {
        if (isNaN(scale as number)) {
            return object.setScalingWorld(scale as Vector3);
        } else {
            Vec3Utils.set(vector, scale as number);
            return object.setScalingWorld(vector);
        }
    }

    return setScaleWorld;
}();

export const setScaleLocal = function () {
    const vector = Vec3Utils.create();

    function setScaleLocal(object: Object3D, scale: Readonly<Vector3>): Object3D;
    function setScaleLocal(object: Object3D, uniformScale: number): Object3D;
    function setScaleLocal(object: Object3D, scale: Readonly<Vector3> | number): Object3D {
        if (isNaN(scale as number)) {
            return object.setScalingLocal(scale as Vector3);
        } else {
            Vec3Utils.set(vector, scale as number);
            return object.setScalingLocal(vector);
        }
    }

    return setScaleLocal;
}();

// Axes    

export function setAxes(object: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
    return ObjectUtils.setAxesWorld(object, left, up, forward);
}

export function setAxesWorld(object: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
    if (forward != null) {
        return ObjectUtils.setForwardWorld(object, forward, up, left);
    } else if (up != null) {
        return ObjectUtils.setUpWorld(object, up, forward, left);
    } else if (left != null) {
        return ObjectUtils.setLeftWorld(object, left, up, forward);
    }

    return object;
}

export function setAxesLocal(object: Object3D, left?: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
    if (forward != null) {
        return ObjectUtils.setForwardLocal(object, forward, up, left);
    } else if (up != null) {
        return ObjectUtils.setUpLocal(object, up, forward, left);
    } else if (left != null) {
        return ObjectUtils.setLeftLocal(object, left, up, forward);
    }

    return object;
}

// Forward

export function setForward(object: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
    return ObjectUtils.setForwardWorld(object, forward, up, left);
}

export const setForwardWorld = function () {
    const quat = QuatUtils.create();
    return function setForwardWorld(object: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setForward(quat, forward, up, left);
        return ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export const setForwardLocal = function () {
    const quat = QuatUtils.create();
    return function setForwardLocal(object: Object3D, forward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setForward(quat, forward, up, left);
        return ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Backward

export function setBackward(object: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
    return ObjectUtils.setBackwardWorld(object, backward, up, left);
}

export const setBackwardWorld = function () {
    const quat = QuatUtils.create();
    return function setBackwardWorld(object: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setBackward(quat, backward, up, left);
        return ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export const setBackwardLocal = function () {
    const quat = QuatUtils.create();
    return function setBackwardLocal(object: Object3D, backward: Readonly<Vector3>, up?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setBackward(quat, backward, up, left);
        return ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Up

export function setUp(object: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
    return ObjectUtils.setUpWorld(object, up, forward, left);
}

export const setUpWorld = function () {
    const quat = QuatUtils.create();
    return function setUpWorld(object: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setUp(quat, up, forward, left);
        return ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export const setUpLocal = function () {
    const quat = QuatUtils.create();
    return function setUpLocal(object: Object3D, up: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setUp(quat, up, forward, left);
        return ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Down

export function setDown(object: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
    return ObjectUtils.setDownWorld(object, down, forward, left);
}

export const setDownWorld = function () {
    const quat = QuatUtils.create();
    return function setDownWorld(object: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setDown(quat, down, forward, left);
        return ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export const setDownLocal = function () {
    const quat = QuatUtils.create();
    return function setDownLocal(object: Object3D, down: Readonly<Vector3>, forward?: Readonly<Vector3>, left?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setDown(quat, down, forward, left);
        return ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Left

export function setLeft(object: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
    return ObjectUtils.setLeftWorld(object, left, up, forward);
}

export const setLeftWorld = function () {
    const quat = QuatUtils.create();
    return function setLeftWorld(object: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setLeft(quat, left, up, forward);
        return ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export const setLeftLocal = function () {
    const quat = QuatUtils.create();
    return function setLeftLocal(object: Object3D, left: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setLeft(quat, left, up, forward);
        return ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Right

export function setRight(object: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
    return ObjectUtils.setRightWorld(object, right, up, forward);
}

export const setRightWorld = function () {
    const quat = QuatUtils.create();
    return function setRightWorld(object: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setRight(quat, right, up, forward);
        return ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export const setRightLocal = function () {
    const quat = QuatUtils.create();
    return function setRightLocal(object: Object3D, right: Readonly<Vector3>, up?: Readonly<Vector3>, forward?: Readonly<Vector3>): Object3D {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setRight(quat, right, up, forward);
        return ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Transform

export function setTransform(object: Object3D, transform: Readonly<Matrix4>): Object3D {
    return ObjectUtils.setTransformWorld(object, transform);
}

export function setTransformMatrix(object: Object3D, transform: Readonly<Matrix4>): Object3D {
    return ObjectUtils.setTransformWorldMatrix(object, transform);
}

export function setTransformQuat(object: Object3D, transform: Readonly<Quaternion2>): Object3D {
    return ObjectUtils.setTransformWorldQuat(object, transform);
}

// Transform World

export function setTransformWorld(object: Object3D, transform: Readonly<Matrix4>): Object3D {
    return ObjectUtils.setTransformWorldMatrix(object, transform);
}

export const setTransformWorldMatrix = function () {
    const position = Vec3Utils.create();
    const rotation = QuatUtils.create();
    const scale = Vec3Utils.create();
    const transformMatrixNoScale = Mat4Utils.create();
    const inverseScale = Vec3Utils.create();
    const one = Vec3Utils.create(1);
    return function setTransformWorldMatrix(object: Object3D, transform: Readonly<Matrix4>): Object3D {
        Mat4Utils.getPosition(transform, position);
        Mat4Utils.getScale(transform, scale);
        Vec3Utils.div(one, scale, inverseScale);
        Mat4Utils.scale(transform, inverseScale, transformMatrixNoScale);
        Mat4Utils.getRotationQuat(transformMatrixNoScale, rotation);
        QuatUtils.normalize(rotation, rotation);
        ObjectUtils.setScaleWorld(object, scale);
        ObjectUtils.setRotationWorldQuat(object, rotation);
        ObjectUtils.setPositionWorld(object, position);

        return object;
    };
}();

export function setTransformWorldQuat(object: Object3D, transform: Readonly<Quaternion2>): Object3D {
    return object.setTransformWorld(transform);
}

// Transform Local

export function setTransformLocal(object: Object3D, transform: Readonly<Matrix4>): Object3D {
    return ObjectUtils.setTransformLocalMatrix(object, transform);
}

export const setTransformLocalMatrix = function () {
    const position = Vec3Utils.create();
    const rotation = QuatUtils.create();
    const scale = Vec3Utils.create();
    const transformMatrixNoScale = Mat4Utils.create();
    const inverseScale = Vec3Utils.create();
    const one = Vec3Utils.create(1);
    return function setTransformLocalMatrix(object: Object3D, transform: Readonly<Matrix4>): Object3D {
        Mat4Utils.getPosition(transform, position);
        Mat4Utils.getScale(transform, scale);
        Vec3Utils.div(one, scale, inverseScale);
        Mat4Utils.scale(transform, inverseScale, transformMatrixNoScale);
        Mat4Utils.getRotationQuat(transformMatrixNoScale, rotation);
        QuatUtils.normalize(rotation, rotation);
        ObjectUtils.setScaleLocal(object, scale);
        ObjectUtils.setRotationLocalQuat(object, rotation);
        ObjectUtils.setPositionLocal(object, position);

        return object;
    };
}();

export function setTransformLocalQuat(object: Object3D, transform: Readonly<Quaternion2>): Object3D {
    return object.setTransformLocal(transform);
}

// RESET

// Position

export function resetPosition(object: Object3D): Object3D {
    return ObjectUtils.resetPositionWorld(object);
}

export const resetPositionWorld = function () {
    const zero = Vec3Utils.create();
    return function resetPositionWorld(object: Object3D): Object3D {
        return ObjectUtils.setPositionWorld(object, zero);
    };
}();

export const resetPositionLocal = function () {
    const zero = Vec3Utils.create();
    return function resetPositionLocal(object: Object3D): Object3D {
        return ObjectUtils.setPositionLocal(object, zero);
    };
}();

// Rotation

export function resetRotation(object: Object3D): Object3D {
    return ObjectUtils.resetRotationWorld(object);
}

export const resetRotationWorld = function () {
    const identity = QuatUtils.create();
    return function resetRotationWorld(object: Object3D): Object3D {
        return ObjectUtils.setRotationWorldQuat(object, identity);
    };
}();

export const resetRotationLocal = function () {
    const identity = QuatUtils.create();
    return function resetRotationLocal(object: Object3D): Object3D {
        return ObjectUtils.setRotationLocalQuat(object, identity);
    };
}();

// Scale

export function resetScale(object: Object3D): Object3D {
    return ObjectUtils.resetScaleWorld(object);
}

export const resetScaleWorld = function () {
    const one = Vec3Utils.create(1);
    return function resetScaleWorld(object: Object3D): Object3D {
        return ObjectUtils.setScaleWorld(object, one);
    };
}();

export const resetScaleLocal = function () {
    const one = Vec3Utils.create(1);
    return function resetScaleLocal(object: Object3D): Object3D {
        return ObjectUtils.setScaleLocal(object, one);
    };
}();

// Transform

export function resetTransform(object: Object3D): Object3D {
    return ObjectUtils.resetTransformWorld(object);
}

export function resetTransformWorld(object: Object3D): Object3D {
    ObjectUtils.resetScaleWorld(object);
    ObjectUtils.resetRotationWorld(object);
    ObjectUtils.resetPositionWorld(object);

    return object;
}

export function resetTransformLocal(object: Object3D): Object3D {
    ObjectUtils.resetScaleLocal(object);
    ObjectUtils.resetRotationLocal(object);
    ObjectUtils.resetPositionLocal(object);

    return object;
}

// TRANSFORMATIONS

// Translate

export function translate(object: Object3D, translation: Readonly<Vector3>): Object3D {
    return ObjectUtils.translateWorld(object, translation);
}

export function translateWorld(object: Object3D, translation: Readonly<Vector3>): Object3D {
    return object.translateWorld(translation);
}

export function translateLocal(object: Object3D, translation: Readonly<Vector3>): Object3D {
    return object.translateLocal(translation);
}

export function translateObject(object: Object3D, translation: Readonly<Vector3>): Object3D {
    return object.translateObject(translation);
}

// Translate Axis

export function translateAxis(object: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
    return ObjectUtils.translateAxisWorld(object, amount, direction);
}

export const translateAxisWorld = function () {
    const translation = Vec3Utils.create();
    return function translateAxisWorld(object: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
        Vec3Utils.scale(direction, amount, translation);
        return ObjectUtils.translateWorld(object, translation);
    };
}();

export const translateAxisLocal = function () {
    const translation = Vec3Utils.create();
    return function translateAxisLocal(object: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
        Vec3Utils.scale(direction, amount, translation);
        return ObjectUtils.translateLocal(object, translation);
    };
}();

export const translateAxisObject = function () {
    const translation = Vec3Utils.create();
    return function translateAxisObject(object: Object3D, amount: number, direction: Readonly<Vector3>): Object3D {
        Vec3Utils.scale(direction, amount, translation);
        return ObjectUtils.translateObject(object, translation);
    };
}();

// Rotate

export function rotate(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateWorld(object, rotation);
}

export function rotateDegrees(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateWorldDegrees(object, rotation);
}

export function rotateRadians(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateWorldRadians(object, rotation);
}

export function rotateMatrix(object: Object3D, rotation: Readonly<Matrix3>): Object3D {
    return ObjectUtils.rotateWorldMatrix(object, rotation);
}

export function rotateQuat(object: Object3D, rotation: Readonly<Quaternion>): Object3D {
    return ObjectUtils.rotateWorldQuat(object, rotation);
}

// Rotate World

export function rotateWorld(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateWorldDegrees(object, rotation);
}

export const rotateWorldDegrees = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateWorldDegrees(object: Object3D, rotation: Readonly<Vector3>): Object3D {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        return ObjectUtils.rotateWorldQuat(object, rotationQuat);
    };
}();

export const rotateWorldRadians = function () {
    const degreesRotation = Vec3Utils.create();
    return function rotateWorldRadians(object: Object3D, rotation: Readonly<Vector3>): Object3D {
        Vec3Utils.toDegrees(rotation, degreesRotation);
        return ObjectUtils.rotateWorldDegrees(object, degreesRotation);
    };
}();

export const rotateWorldMatrix = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateWorldMatrix(object: Object3D, rotation: Readonly<Matrix3>): Object3D {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        return ObjectUtils.rotateWorldQuat(object, rotationQuat);
    };
}();

export const rotateWorldQuat = function () {
    const currentRotationQuat = QuatUtils.create();
    return function rotateWorldQuat(object: Object3D, rotation: Readonly<Quaternion>): Object3D {
        ObjectUtils.getRotationWorldQuat(object, currentRotationQuat);
        QuatUtils.mul(rotation, currentRotationQuat, currentRotationQuat);
        QuatUtils.normalize(currentRotationQuat, currentRotationQuat);
        return ObjectUtils.setRotationWorldQuat(object, currentRotationQuat);
    };
}();

// Rotate Local

export function rotateLocal(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateLocalDegrees(object, rotation);
}

export const rotateLocalDegrees = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateLocalDegrees(object: Object3D, rotation: Readonly<Vector3>): Object3D {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        return ObjectUtils.rotateLocalQuat(object, rotationQuat);
    };
}();

export const rotateLocalRadians = function () {
    const degreesRotation = Vec3Utils.create();
    return function rotateLocalRadians(object: Object3D, rotation: Readonly<Vector3>): Object3D {
        Vec3Utils.toDegrees(rotation, degreesRotation);
        return ObjectUtils.rotateLocalDegrees(object, degreesRotation);
    };
}();

export const rotateLocalMatrix = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateLocalMatrix(object: Object3D, rotation: Readonly<Matrix3>): Object3D {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        return ObjectUtils.rotateLocalQuat(object, rotationQuat);
    };
}();

export const rotateLocalQuat = function () {
    const currentRotationQuat = QuatUtils.create();
    return function rotateLocalQuat(object: Object3D, rotation: Readonly<Quaternion>): Object3D {
        ObjectUtils.getRotationLocalQuat(object, currentRotationQuat);
        QuatUtils.mul(rotation, currentRotationQuat, currentRotationQuat);
        QuatUtils.normalize(currentRotationQuat, currentRotationQuat);
        return ObjectUtils.setRotationLocalQuat(object, currentRotationQuat);
    };
}();

// Rotate Object

export function rotateObject(object: Object3D, rotation: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateObjectDegrees(object, rotation);
}

export const rotateObjectDegrees = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateObjectDegrees(object: Object3D, rotation: Readonly<Vector3>): Object3D {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        return ObjectUtils.rotateObjectQuat(object, rotationQuat);
    };
}();

export const rotateObjectRadians = function () {
    const degreesRotation = Vec3Utils.create();
    return function rotateObjectRadians(object: Object3D, rotation: Readonly<Vector3>): Object3D {
        Vec3Utils.toDegrees(rotation, degreesRotation);
        return ObjectUtils.rotateObjectDegrees(object, degreesRotation);
    };
}();

export const rotateObjectMatrix = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateObjectMatrix(object: Object3D, rotation: Readonly<Matrix3>): Object3D {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        return ObjectUtils.rotateObjectQuat(object, rotationQuat);
    };
}();

export function rotateObjectQuat(object: Object3D, rotation: Readonly<Quaternion>): Object3D {
    return object.rotateObject(rotation);
}

// Rotate Axis

export function rotateAxis(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAxisWorld(object, angle, axis);
}

export function rotateAxisDegrees(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAxisWorldDegrees(object, angle, axis);
}

export function rotateAxisRadians(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAxisWorldRadians(object, angle, axis);
}

// Rotate Axis World

export function rotateAxisWorld(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAxisWorldDegrees(object, angle, axis);
}

export function rotateAxisWorldDegrees(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAxisWorldRadians(object, MathUtils.toRadians(angle), axis);
}

export const rotateAxisWorldRadians = function () {
    const rotation = QuatUtils.create();
    return function rotateAxisWorldRadians(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
        QuatUtils.fromAxisRadians(angle, axis, rotation);
        return ObjectUtils.rotateWorldQuat(object, rotation);
    };
}();

// Rotate Axis Local

export function rotateAxisLocal(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAxisLocalDegrees(object, angle, axis);
}

export function rotateAxisLocalDegrees(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAxisLocalRadians(object, MathUtils.toRadians(angle), axis);
}

export const rotateAxisLocalRadians = function () {
    const rotation = QuatUtils.create();
    return function rotateAxisLocalRadians(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
        QuatUtils.fromAxisRadians(angle, axis, rotation);
        return ObjectUtils.rotateLocalQuat(object, rotation);
    };
}();

// Rotate Axis Object

export function rotateAxisObject(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAxisObjectDegrees(object, angle, axis);
}

export function rotateAxisObjectDegrees(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAxisObjectRadians(object, MathUtils.toRadians(angle), axis);
}

export const rotateAxisObjectRadians = function () {
    const rotation = QuatUtils.create();
    return function rotateAxisObjectRadians(object: Object3D, angle: number, axis: Readonly<Vector3>): Object3D {
        QuatUtils.fromAxisRadians(angle, axis, rotation);
        return ObjectUtils.rotateObjectQuat(object, rotation);
    };
}();

// Rotate Around

export function rotateAround(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundWorld(object, rotation, origin);
}

export function rotateAroundDegrees(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundWorldDegrees(object, rotation, origin);
}

export function rotateAroundRadians(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundWorldRadians(object, rotation, origin);
}

export function rotateAroundMatrix(object: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundWorldMatrix(object, rotation, origin);
}

export function rotateAroundQuat(object: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundWorldQuat(object, rotation, origin);
}

// Rotate Around World

export function rotateAroundWorld(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundWorldDegrees(object, rotation, origin);
}

export const rotateAroundWorldDegrees = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateAroundWorldDegrees(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        return ObjectUtils.rotateAroundWorldQuat(object, rotationQuat, origin);
    };
}();

export const rotateAroundWorldRadians = function () {
    const degreesRotation = Vec3Utils.create();
    return function rotateAroundWorldRadians(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
        Vec3Utils.toDegrees(rotation, degreesRotation);
        return ObjectUtils.rotateAroundWorldDegrees(object, degreesRotation, origin);
    };
}();

export const rotateAroundWorldMatrix = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateAroundWorldMatrix(object: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        return ObjectUtils.rotateAroundWorldQuat(object, rotationQuat, origin);
    };
}();

export const rotateAroundWorldQuat = function () {
    const axis = Vec3Utils.create();
    return function rotateAroundWorldQuat(object: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
        QuatUtils.getAxis(rotation, axis);
        const angle = QuatUtils.getAngleRadians(rotation,);
        return ObjectUtils.rotateAroundAxisWorldRadians(object, angle, axis, origin);
    };
}();

// Rotate Around Local

export function rotateAroundLocal(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundLocalDegrees(object, rotation, origin);
}

export const rotateAroundLocalDegrees = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateAroundLocalDegrees(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        return ObjectUtils.rotateAroundLocalQuat(object, rotationQuat, origin);
    };
}();

export const rotateAroundLocalRadians = function () {
    const degreesRotation = Vec3Utils.create();
    return function rotateAroundLocalRadians(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
        Vec3Utils.toDegrees(rotation, degreesRotation);
        return ObjectUtils.rotateAroundLocalDegrees(object, degreesRotation, origin);
    };
}();

export const rotateAroundLocalMatrix = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateAroundLocalMatrix(object: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        return ObjectUtils.rotateAroundLocalQuat(object, rotationQuat, origin);
    };
}();

export const rotateAroundLocalQuat = function () {
    const axis = Vec3Utils.create();
    return function rotateAroundLocalQuat(object: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
        QuatUtils.getAxis(rotation, axis);
        const angle = QuatUtils.getAngleRadians(rotation,);
        return ObjectUtils.rotateAroundAxisLocalRadians(object, angle, axis, origin);
    };
}();

// Rotate Around Object

export function rotateAroundObject(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundObjectDegrees(object, rotation, origin);
}

export const rotateAroundObjectDegrees = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateAroundObjectDegrees(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        return ObjectUtils.rotateAroundObjectQuat(object, rotationQuat, origin);
    };
}();

export const rotateAroundObjectRadians = function () {
    const degreesRotation = Vec3Utils.create();
    return function rotateAroundObjectRadians(object: Object3D, rotation: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
        Vec3Utils.toDegrees(rotation, degreesRotation);
        return ObjectUtils.rotateAroundObjectDegrees(object, degreesRotation, origin);
    };
}();

export const rotateAroundObjectMatrix = function () {
    const rotationQuat = QuatUtils.create();
    return function rotateAroundObjectMatrix(object: Object3D, rotation: Readonly<Matrix3>, origin: Readonly<Vector3>): Object3D {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        return ObjectUtils.rotateAroundObjectQuat(object, rotationQuat, origin);
    };
}();

export const rotateAroundObjectQuat = function () {
    const axis = Vec3Utils.create();
    return function rotateAroundObjectQuat(object: Object3D, rotation: Readonly<Quaternion>, origin: Readonly<Vector3>): Object3D {
        QuatUtils.getAxis(rotation, axis);
        const angle = QuatUtils.getAngleRadians(rotation,);
        return ObjectUtils.rotateAroundAxisObjectRadians(object, angle, axis, origin);
    };
}();

// Rotate Around Axis

export function rotateAroundAxis(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundAxisWorld(object, angle, axis, origin);
}

export function rotateAroundAxisDegrees(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundAxisWorldDegrees(object, angle, axis, origin);
}

export function rotateAroundAxisRadians(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundAxisWorldRadians(object, angle, axis, origin);
}

// Rotate Around Axis World

export function rotateAroundAxisWorld(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundAxisWorldDegrees(object, angle, axis, origin);
}

export function rotateAroundAxisWorldDegrees(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundAxisWorldRadians(object, MathUtils.toRadians(angle), axis, origin);
}

export const rotateAroundAxisWorldRadians = function () {
    const transformToRotate = Quat2Utils.create();
    const transformToRotateConjugate = Quat2Utils.create();
    const transformQuat = Quat2Utils.create();
    const defaultQuat = QuatUtils.create();
    return function rotateAroundAxisWorldRadians(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
        Quat2Utils.setPositionRotationQuat(transformToRotate, origin, defaultQuat);
        ObjectUtils.getTransformWorldQuat(object, transformQuat);
        Quat2Utils.conjugate(transformToRotate, transformToRotateConjugate);
        Quat2Utils.mul(transformToRotateConjugate, transformQuat, transformQuat);
        Quat2Utils.rotateAxisRadians(transformToRotate, angle, axis, transformToRotate);
        Quat2Utils.mul(transformToRotate, transformQuat, transformQuat);
        return ObjectUtils.setTransformWorldQuat(object, transformQuat);
    };
}();

// Rotate Around Axis Local

export function rotateAroundAxisLocal(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundAxisLocalDegrees(object, angle, axis, origin);
}

export function rotateAroundAxisLocalDegrees(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundAxisLocalRadians(object, MathUtils.toRadians(angle), axis, origin);
}

export const rotateAroundAxisLocalRadians = function () {
    const convertedPosition = Vec3Utils.create();
    const convertedAxis = Vec3Utils.create();
    return function rotateAroundAxisLocalRadians(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
        ObjectUtils.convertPositionLocalToWorld(object, origin, convertedPosition);
        ObjectUtils.convertDirectionLocalToWorld(object, axis, convertedAxis);
        return ObjectUtils.rotateAroundAxisWorldRadians(object, angle, convertedAxis, convertedPosition);
    };
}();

// Rotate Around Axis Object

export function rotateAroundAxisObject(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundAxisObjectDegrees(object, angle, axis, origin);
}

export function rotateAroundAxisObjectDegrees(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
    return ObjectUtils.rotateAroundAxisObjectRadians(object, MathUtils.toRadians(angle), axis, origin);
}

export const rotateAroundAxisObjectRadians = function () {
    const convertedPosition = Vec3Utils.create();
    const convertedAxis = Vec3Utils.create();
    return function rotateAroundAxisObjectRadians(object: Object3D, angle: number, axis: Readonly<Vector3>, origin: Readonly<Vector3>): Object3D {
        ObjectUtils.convertPositionObjectToWorld(object, origin, convertedPosition);
        ObjectUtils.convertDirectionObjectToWorld(object, axis, convertedAxis);
        return ObjectUtils.rotateAroundAxisWorldRadians(object, angle, convertedAxis, convertedPosition);
    };
}();

// Scale

// #TODO For now it does not really make sense in WL to scale in world space or parent space
// so there is no scale default function

export const scaleObject = function () {
    const vector = Vec3Utils.create();

    function scaleObject(object: Object3D, scale: Readonly<Vector3>): Object3D;
    function scaleObject(object: Object3D, uniformScale: number): Object3D;
    function scaleObject(object: Object3D, scale: Readonly<Vector3> | number): Object3D {
        if (isNaN(scale as number)) {
            return object.scaleLocal(scale as Vector3);
        } else {
            Vec3Utils.set(vector, scale as number);
            return object.scaleLocal(vector);
        }
    }

    return scaleObject;
}();

// Look At

export function lookAt(object: Object3D, position: Readonly<Vector3>, up?: Readonly<Vector3>): Object3D {
    return ObjectUtils.lookAtWorld(object, position, up);
}

export const lookAtWorld = function () {
    const direction = Vec3Utils.create();
    return function lookAtWorld(object: Object3D, position: Readonly<Vector3>, up?: Readonly<Vector3>): Object3D {
        ObjectUtils.getPositionWorld(object, direction);
        Vec3Utils.sub(position, direction, direction);
        return ObjectUtils.lookToWorld(object, direction, up);
    };
}();

export const lookAtLocal = function () {
    const direction = Vec3Utils.create();
    return function lookAtLocal(object: Object3D, position: Readonly<Vector3>, up?: Readonly<Vector3>): Object3D {
        ObjectUtils.getPositionLocal(object, direction);
        Vec3Utils.sub(position, direction, direction);
        return ObjectUtils.lookToLocal(object, direction, up);
    };
}();

export function lookTo(object: Object3D, direction: Readonly<Vector3>, up?: Readonly<Vector3>): Object3D {
    return ObjectUtils.lookToWorld(object, direction, up);
}

export const lookToWorld: (object: Object3D, direction: Readonly<Vector3>, up?: Readonly<Vector3>) => Object3D = function () {
    const internalUp = Vec3Utils.create();
    return function lookToWorld(object: Object3D, direction: Readonly<Vector3>, up: Readonly<Vector3> = ObjectUtils.getUpWorld(object, internalUp)): Object3D {
        return ObjectUtils.setForwardWorld(object, direction, up);
    };
}();

export const lookToLocal: (object: Object3D, direction: Readonly<Vector3>, up?: Readonly<Vector3>) => Object3D = function () {
    const internalUp = Vec3Utils.create();
    return function lookToLocal(object: Object3D, direction: Readonly<Vector3>, up: Readonly<Vector3> = ObjectUtils.getUpLocal(object, internalUp)): Object3D {
        return ObjectUtils.setForwardLocal(object, direction, up);
    };
}();

// EXTRA

// Convert Vector Object World

export const convertPositionObjectToWorld = function () {
    const matrix = Mat4Utils.create();

    function convertPositionObjectToWorld(object: Readonly<Object3D>, position: Readonly<Vector3>): Vector3;
    function convertPositionObjectToWorld<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: T): T;
    function convertPositionObjectToWorld<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getTransformWorldMatrix(object, matrix);
        Vec3Utils.transformMat4(position, matrix, outPosition);
        return outPosition;
    }

    return convertPositionObjectToWorld;
}();

export const convertDirectionObjectToWorld = function () {
    const rotation = QuatUtils.create();

    function convertDirectionObjectToWorld(object: Readonly<Object3D>, direction: Readonly<Vector3>): Vector3;
    function convertDirectionObjectToWorld<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: T): T;
    function convertDirectionObjectToWorld<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationWorldQuat(object, rotation);
        Vec3Utils.transformQuat(direction, rotation, outDirection);
        return outDirection;
    }

    return convertDirectionObjectToWorld;
}();

export const convertPositionWorldToObject = function () {
    const matrix = Mat4Utils.create();

    function convertPositionWorldToObject(object: Readonly<Object3D>, position: Readonly<Vector3>): Vector3;
    function convertPositionWorldToObject<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: T): T;
    function convertPositionWorldToObject<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getTransformWorldMatrix(object, matrix);
        Mat4Utils.invert(matrix, matrix);
        Vec3Utils.transformMat4(position, matrix, outPosition);
        return outPosition;
    }

    return convertPositionWorldToObject;
}();

export const convertDirectionWorldToObject = function () {
    const rotation = QuatUtils.create();

    function convertDirectionWorldToObject(object: Readonly<Object3D>, direction: Readonly<Vector3>): Vector3;
    function convertDirectionWorldToObject<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: T): T;
    function convertDirectionWorldToObject<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        ObjectUtils.getRotationWorldQuat(object, rotation);
        QuatUtils.conjugate(rotation, rotation);
        Vec3Utils.transformQuat(direction, rotation, outDirection);
        return outDirection;
    }

    return convertDirectionWorldToObject;
}();

// Convert Vector Local World

export function convertPositionLocalToWorld(object: Readonly<Object3D>, position: Readonly<Vector3>): Vector3;
export function convertPositionLocalToWorld<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: T): T;
export function convertPositionLocalToWorld<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    if (ObjectUtils.getParent(object) != null) {
        ObjectUtils.convertPositionObjectToWorld(ObjectUtils.getParent(object)!, position, outPosition);
    } else {
        Vec3Utils.copy(position, outPosition);
    }
    return outPosition;
}

export function convertDirectionLocalToWorld(object: Readonly<Object3D>, direction: Readonly<Vector3>): Vector3;
export function convertDirectionLocalToWorld<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: T): T;
export function convertDirectionLocalToWorld<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    if (ObjectUtils.getParent(object) != null) {
        ObjectUtils.convertDirectionObjectToWorld(ObjectUtils.getParent(object)!, direction, outDirection);
    } else {
        Vec3Utils.copy(direction, outDirection);
    }
    return outDirection;
}

export function convertPositionWorldToLocal(object: Readonly<Object3D>, position: Readonly<Vector3>): Vector3;
export function convertPositionWorldToLocal<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: T): T;
export function convertPositionWorldToLocal<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    if (ObjectUtils.getParent(object) != null) {
        ObjectUtils.convertPositionWorldToObject(ObjectUtils.getParent(object)!, position, outPosition);
    } else {
        Vec3Utils.copy(position, outPosition);
    }
    return outPosition;
}

export function convertDirectionWorldToLocal(object: Readonly<Object3D>, direction: Readonly<Vector3>): Vector3;
export function convertDirectionWorldToLocal<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: T): T;
export function convertDirectionWorldToLocal<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    if (ObjectUtils.getParent(object) != null) {
        ObjectUtils.convertDirectionWorldToObject(ObjectUtils.getParent(object)!, direction, outDirection);
    } else {
        Vec3Utils.copy(direction, outDirection);
    }
    return outDirection;
}

// Convert Vector Local Object

// I need to use the converson to world and then local also use the parent scale that changes the position in local space

export function convertPositionObjectToLocal(object: Readonly<Object3D>, position: Readonly<Vector3>): Vector3;
export function convertPositionObjectToLocal<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: T): T;
export function convertPositionObjectToLocal<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    ObjectUtils.convertPositionObjectToWorld(object, position, outPosition);
    ObjectUtils.convertPositionWorldToLocal(object, outPosition, outPosition);
    return outPosition;
}

export function convertDirectionObjectToLocal(object: Readonly<Object3D>, direction: Readonly<Vector3>): Vector3;
export function convertDirectionObjectToLocal<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: T): T;
export function convertDirectionObjectToLocal<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    ObjectUtils.convertDirectionObjectToWorld(object, direction, outDirection);
    ObjectUtils.convertDirectionWorldToLocal(object, outDirection, outDirection);
    return outDirection;
}

export function convertPositionLocalToObject(object: Readonly<Object3D>, position: Readonly<Vector3>): Vector3;
export function convertPositionLocalToObject<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: T): T;
export function convertPositionLocalToObject<T extends Vector3>(object: Readonly<Object3D>, position: Readonly<Vector3>, outPosition: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    ObjectUtils.convertPositionLocalToWorld(object, position, outPosition);
    ObjectUtils.convertPositionWorldToObject(object, outPosition, outPosition);
    return outPosition;
}

export function convertDirectionLocalToObject(object: Readonly<Object3D>, direction: Readonly<Vector3>): Vector3;
export function convertDirectionLocalToObject<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: T): T;
export function convertDirectionLocalToObject<T extends Vector3>(object: Readonly<Object3D>, direction: Readonly<Vector3>, outDirection: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    ObjectUtils.convertDirectionLocalToWorld(object, direction, outDirection);
    ObjectUtils.convertDirectionWorldToObject(object, outDirection, outDirection);
    return outDirection;
}

// Convert Transform Object World

export function convertTransformObjectToWorld<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformObjectToWorld<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
export function convertTransformObjectToWorld<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
    return ObjectUtils.convertTransformObjectToWorldMatrix(object, transform, outTransform!);
}

export const convertTransformObjectToWorldMatrix = function () {
    const convertTransform = Mat4Utils.create();
    const position = Vec3Utils.create();
    const scale = Vec3Utils.create();
    const inverseScale = Vec3Utils.create();
    const one = Vec3Utils.create(1);

    function convertTransformObjectToWorldMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
    function convertTransformObjectToWorldMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
    function convertTransformObjectToWorldMatrix<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform: T | U = Mat4Utils.clone(transform)): T | U {
        ObjectUtils.getTransformWorldMatrix(object, convertTransform);
        if (ObjectUtils.hasUniformScaleWorld(object)) {
            Mat4Utils.mul(convertTransform, transform, outTransform);
        } else {
            Vec3Utils.set(position, transform[12], transform[13], transform[14]);
            ObjectUtils.convertPositionObjectToWorld(object, position, position);

            Mat4Utils.getScale(convertTransform, scale);
            Vec3Utils.div(one, scale, inverseScale);
            Mat4Utils.scale(convertTransform, inverseScale, convertTransform);

            Mat4Utils.mul(convertTransform, transform, outTransform);
            Mat4Utils.scale(outTransform, scale, outTransform);

            outTransform[12] = position[0];
            outTransform[13] = position[1];
            outTransform[14] = position[2];
            outTransform[15] = 1;
        }
        return outTransform;
    }

    return convertTransformObjectToWorldMatrix;
}();

export const convertTransformObjectToWorldQuat = function () {
    const position = Vec3Utils.create();
    const rotation = QuatUtils.create();

    function convertTransformObjectToWorldQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>): T;
    function convertTransformObjectToWorldQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform: T): T;
    function convertTransformObjectToWorldQuat<T extends Quaternion2, U extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform: T | U = Quat2Utils.clone(transform)): T | U {
        ObjectUtils.getRotationWorldQuat(object, rotation);
        QuatUtils.mul(rotation, transform, rotation);
        Quat2Utils.getPosition(transform, position);
        ObjectUtils.convertPositionObjectToWorld(object, position, position);
        Quat2Utils.setPositionRotationQuat(outTransform, position, rotation);
        return outTransform;
    }

    return convertTransformObjectToWorldQuat;
}();


export function convertTransformWorldToObject<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformWorldToObject<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
export function convertTransformWorldToObject<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
    return ObjectUtils.convertTransformWorldToObjectMatrix(object, transform, outTransform!);
}

export const convertTransformWorldToObjectMatrix = function () {
    const convertTransform = Mat4Utils.create();
    const position = Vec3Utils.create();
    const scale = Vec3Utils.create();
    const inverseScale = Vec3Utils.create();
    const one = Vec3Utils.create(1);

    function convertTransformWorldToObjectMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
    function convertTransformWorldToObjectMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
    function convertTransformWorldToObjectMatrix<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform: T | U = Mat4Utils.clone(transform)): T | U {
        ObjectUtils.getTransformWorldMatrix(object, convertTransform);
        if (ObjectUtils.hasUniformScaleWorld(object)) {
            Mat4Utils.invert(convertTransform, convertTransform);
            Mat4Utils.mul(convertTransform, transform, outTransform);
        } else {
            Vec3Utils.set(position, transform[12], transform[13], transform[14]);
            ObjectUtils.convertPositionWorldToObject(object, position, position);

            Mat4Utils.getScale(convertTransform, scale);
            Vec3Utils.div(one, scale, inverseScale);
            Mat4Utils.scale(convertTransform, inverseScale, convertTransform);

            Mat4Utils.invert(convertTransform, convertTransform);
            Mat4Utils.mul(convertTransform, transform, outTransform);
            Mat4Utils.scale(outTransform, inverseScale, outTransform);

            outTransform[12] = position[0];
            outTransform[13] = position[1];
            outTransform[14] = position[2];
            outTransform[15] = 1;
        }
        return outTransform;
    }

    return convertTransformWorldToObjectMatrix;
}();

export const convertTransformWorldToObjectQuat = function () {
    const position = Vec3Utils.create();
    const rotation = QuatUtils.create();

    function convertTransformWorldToObjectQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>): T;
    function convertTransformWorldToObjectQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform: T): T;
    function convertTransformWorldToObjectQuat<T extends Quaternion2, U extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform: T | U = Quat2Utils.clone(transform)): T | U {
        ObjectUtils.getRotationWorldQuat(object, rotation);
        QuatUtils.conjugate(rotation, rotation);
        QuatUtils.mul(rotation, transform, rotation);
        Quat2Utils.getPosition(transform, position);
        ObjectUtils.convertPositionWorldToObject(object, position, position);
        Quat2Utils.setPositionRotationQuat(outTransform, position, rotation);
        return outTransform;
    }

    return convertTransformWorldToObjectQuat;
}();

// Convert Transform Local World


export function convertTransformLocalToWorld<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformLocalToWorld<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
export function convertTransformLocalToWorld<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
    return ObjectUtils.convertTransformLocalToWorldMatrix(object, transform, outTransform!);
}


export function convertTransformLocalToWorldMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformLocalToWorldMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
export function convertTransformLocalToWorldMatrix<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform: T | U = Mat4Utils.clone(transform)): T | U {
    if (ObjectUtils.getParent(object) != null) {
        ObjectUtils.convertTransformObjectToWorldMatrix(ObjectUtils.getParent(object)!, transform, outTransform!);
    } else {
        Mat4Utils.copy(transform, outTransform);
    }
    return outTransform!;
}

export function convertTransformLocalToWorldQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformLocalToWorldQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform: T): T;
export function convertTransformLocalToWorldQuat<T extends Quaternion2, U extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform: T | U = Quat2Utils.clone(transform)): T | U {
    if (ObjectUtils.getParent(object) != null) {
        ObjectUtils.convertTransformObjectToWorldQuat(ObjectUtils.getParent(object)!, transform, outTransform);
    } else {
        Quat2Utils.copy(transform, outTransform);
    }
    return outTransform;
}

export function convertTransformWorldToLocal<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformWorldToLocal<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
export function convertTransformWorldToLocal<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
    return ObjectUtils.convertTransformWorldToLocalMatrix(object, transform, outTransform!);
}

export function convertTransformWorldToLocalMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformWorldToLocalMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
export function convertTransformWorldToLocalMatrix<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform: T | U = Mat4Utils.clone(transform)): T | U {
    if (ObjectUtils.getParent(object) != null) {
        ObjectUtils.convertTransformWorldToObjectMatrix(ObjectUtils.getParent(object)!, transform, outTransform!);
    } else {
        Mat4Utils.copy(transform, outTransform);
    }
    return outTransform!;
}

export function convertTransformWorldToLocalQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformWorldToLocalQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform: T): T;
export function convertTransformWorldToLocalQuat<T extends Quaternion2, U extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform: T | U = Quat2Utils.clone(transform)): T | U {
    if (ObjectUtils.getParent(object) != null) {
        ObjectUtils.convertTransformWorldToObjectQuat(ObjectUtils.getParent(object)!, transform, outTransform);
    } else {
        Quat2Utils.copy(transform, outTransform);
    }
    return outTransform;
}

// Convert Transform Object Local

// I need to use the conversion to world and then local to also use the parent scale that changes the position in local space


export function convertTransformObjectToLocal<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformObjectToLocal<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
export function convertTransformObjectToLocal<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
    return ObjectUtils.convertTransformObjectToLocalMatrix(object, transform, outTransform!);
}

export function convertTransformObjectToLocalMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformObjectToLocalMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
export function convertTransformObjectToLocalMatrix<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
    outTransform = ObjectUtils.convertTransformObjectToWorldMatrix(object, transform, outTransform!);
    ObjectUtils.convertTransformWorldToLocalMatrix(object, outTransform, outTransform);
    return outTransform!;
}

export function convertTransformObjectToLocalQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformObjectToLocalQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform: T): T;
export function convertTransformObjectToLocalQuat<T extends Quaternion2, U extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
    outTransform = ObjectUtils.convertTransformObjectToWorldQuat(object, transform, outTransform!);
    ObjectUtils.convertTransformWorldToLocalQuat(object, outTransform, outTransform);
    return outTransform;
}

export function convertTransformLocalToObject<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformLocalToObject<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
export function convertTransformLocalToObject<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
    return ObjectUtils.convertTransformLocalToObjectMatrix(object, transform, outTransform!);
}

export function convertTransformLocalToObjectMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformLocalToObjectMatrix<T extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<Matrix4>, outTransform: T): T;
export function convertTransformLocalToObjectMatrix<T extends Matrix4, U extends Matrix4>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
    outTransform = ObjectUtils.convertTransformLocalToWorldMatrix(object, transform, outTransform!);
    ObjectUtils.convertTransformWorldToObjectMatrix(object, outTransform, outTransform);
    return outTransform!;
}

export function convertTransformLocalToObjectQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>): T;
export function convertTransformLocalToObjectQuat<T extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<Quaternion2>, outTransform: T): T;
export function convertTransformLocalToObjectQuat<T extends Quaternion2, U extends Quaternion2>(object: Readonly<Object3D>, transform: Readonly<T>, outTransform?: T | U): T | U {
    outTransform = ObjectUtils.convertTransformLocalToWorldQuat(object, transform, outTransform!);
    ObjectUtils.convertTransformWorldToObjectQuat(object, outTransform, outTransform);
    return outTransform;
}

// Parent

export const setParent = function () {
    const position = Vec3Utils.create();
    const rotation = QuatUtils.create();
    const scale = Vec3Utils.create();
    return function setParent(object: Object3D, newParent: Object3D, keepTransformWorld: boolean = true): Object3D {
        if (!keepTransformWorld) {
            object.parent = newParent;
        } else {
            ObjectUtils.getPositionWorld(object, position);
            ObjectUtils.getRotationWorldQuat(object, rotation);
            ObjectUtils.getScaleWorld(object, scale);
            object.parent = newParent;
            ObjectUtils.setScaleWorld(object, scale);
            ObjectUtils.setRotationWorldQuat(object, rotation);
            ObjectUtils.setPositionWorld(object, position);
        }

        return object;
    };
}();

export function getParent(object: Readonly<Object3D>): Object3D | null {
    return object.parent;
}

// Component

export function addComponent<T extends Component>(object: Object3D, classOrType: ComponentConstructor<T> | string, paramsOrActive?: Record<string, unknown> | boolean, active?: boolean): T | null {
    let params: Record<string, unknown> | undefined = undefined;

    if (typeof paramsOrActive == "boolean") {
        params = {};
        params["active"] = paramsOrActive;
    } else {
        if (paramsOrActive != null) {
            params = paramsOrActive;
        }

        if (active != null) {
            if (params == null) {
                params = {};
            }

            params["active"] = active;
        }
    }

    return object.addComponent(classOrType as ComponentConstructor<T>, params);
}

export function getComponent<T extends Component>(object: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index: number = 0): T | null {
    return ObjectUtils.getComponentHierarchy(object, classOrType, index);
}

export function getComponentSelf<T extends Component>(object: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index: number = 0): T | null {
    return object.getComponent(classOrType as ComponentConstructor<T>, index);
}

export function getComponentHierarchy<T extends Component>(object: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index: number = 0): T | null {
    return ObjectUtils.getComponentHierarchyBreadth(object, classOrType, index);
}

export function getComponentHierarchyBreadth<T extends Component>(object: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index: number = 0): T | null {
    const objects = ObjectUtils.getHierarchyBreadth(object);
    return ObjectUtils.getComponentObjects(objects, classOrType, index);
}

export function getComponentHierarchyDepth<T extends Component>(object: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index: number = 0): T | null {
    const objects = ObjectUtils.getHierarchyDepth(object);
    return ObjectUtils.getComponentObjects(objects, classOrType, index);
}

export function getComponentDescendants<T extends Component>(object: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index: number = 0): T | null {
    return ObjectUtils.getComponentDescendantsBreadth(object, classOrType, index);
}

export function getComponentDescendantsBreadth<T extends Component>(object: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index: number = 0): T | null {
    const objects = ObjectUtils.getDescendantsBreadth(object);
    return ObjectUtils.getComponentObjects(objects, classOrType, index);
}

export function getComponentDescendantsDepth<T extends Component>(object: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index: number = 0): T | null {
    const objects = ObjectUtils.getDescendantsDepth(object);
    return ObjectUtils.getComponentObjects(objects, classOrType, index);
}

export function getComponentChildren<T extends Component>(object: Readonly<Object3D>, classOrType: ComponentConstructor<T> | string, index: number = 0): T | null {
    const objects = ObjectUtils.getChildren(object);
    return ObjectUtils.getComponentObjects(objects, classOrType, index);
}

export function getComponents<T extends Component>(object: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
    return ObjectUtils.getComponentsHierarchy(object, classOrType);
}

export function getComponentsSelf<T extends Component>(object: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
    return object.getComponents(classOrType as ComponentConstructor<T>);
}

export function getComponentsHierarchy<T extends Component>(object: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
    return ObjectUtils.getComponentsHierarchyBreadth(object, classOrType);
}

export function getComponentsHierarchyBreadth<T extends Component>(object: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
    const objects = ObjectUtils.getHierarchyBreadth(object);
    return ObjectUtils.getComponentsObjects(objects, classOrType);
}

export function getComponentsHierarchyDepth<T extends Component>(object: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
    const objects = ObjectUtils.getHierarchyDepth(object);
    return ObjectUtils.getComponentsObjects(objects, classOrType);
}

export function getComponentsDescendants<T extends Component>(object: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
    return ObjectUtils.getComponentsDescendantsBreadth(object, classOrType);
}

export function getComponentsDescendantsBreadth<T extends Component>(object: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
    const objects = ObjectUtils.getDescendantsBreadth(object);
    return ObjectUtils.getComponentsObjects(objects, classOrType);
}

export function getComponentsDescendantsDepth<T extends Component>(object: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
    const objects = ObjectUtils.getDescendantsDepth(object);
    return ObjectUtils.getComponentsObjects(objects, classOrType);
}

export function getComponentsChildren<T extends Component>(object: Readonly<Object3D>, classOrType?: ComponentConstructor<T> | string): T[] {
    const objects = ObjectUtils.getChildren(object);
    return ObjectUtils.getComponentsObjects(objects, classOrType);
}

// Active

export function setActive(object: Object3D, active: boolean): Object3D {
    return ObjectUtils.setActiveHierarchy(object, active);
}

export function setActiveSelf(object: Object3D, active: boolean): Object3D {
    object.active = active;
    return object;
}

export function setActiveHierarchy(object: Object3D, active: boolean): Object3D {
    return ObjectUtils.setActiveHierarchyBreadth(object, active);
}

export function setActiveHierarchyBreadth(object: Object3D, active: boolean): Object3D {
    const objects = ObjectUtils.getHierarchyBreadth(object);
    ObjectUtils.setActiveObjects(objects, active);

    return object;
}

export function setActiveHierarchyDepth(object: Object3D, active: boolean): Object3D {
    const objects = ObjectUtils.getHierarchyDepth(object);
    ObjectUtils.setActiveObjects(objects, active);

    return object;
}

export function setActiveDescendants(object: Object3D, active: boolean): Object3D {
    return ObjectUtils.setActiveDescendantsBreadth(object, active);
}

export function setActiveDescendantsBreadth(object: Object3D, active: boolean): Object3D {
    const objects = ObjectUtils.getDescendantsBreadth(object);
    ObjectUtils.setActiveObjects(objects, active);

    return object;
}

export function setActiveDescendantsDepth(object: Object3D, active: boolean): Object3D {
    const objects = ObjectUtils.getDescendantsDepth(object);
    ObjectUtils.setActiveObjects(objects, active);

    return object;
}

export function setActiveChildren(object: Object3D, active: boolean): Object3D {
    const objects = ObjectUtils.getChildren(object);
    ObjectUtils.setActiveObjects(objects, active);

    return object;
}

// Uniform Scale

export function hasUniformScale(object: Readonly<Object3D>): boolean {
    return ObjectUtils.hasUniformScaleWorld(object);
}

export const hasUniformScaleWorld = function () {
    const scale = Vec3Utils.create();
    return function hasUniformScaleWorld(object: Readonly<Object3D>): boolean {
        ObjectUtils.getScaleWorld(object, scale);
        return Math.abs(scale[0] - scale[1]) < MathUtils.EPSILON && Math.abs(scale[1] - scale[2]) < MathUtils.EPSILON && Math.abs(scale[0] - scale[2]) < MathUtils.EPSILON;
    };
}();

export const hasUniformScaleLocal = function () {
    const scale = Vec3Utils.create();
    return function hasUniformScaleLocal(object: Readonly<Object3D>): boolean {
        ObjectUtils.getScaleLocal(object, scale);
        return Math.abs(scale[0] - scale[1]) < MathUtils.EPSILON && Math.abs(scale[1] - scale[2]) < MathUtils.EPSILON && Math.abs(scale[0] - scale[2]) < MathUtils.EPSILON;
    };
}();

// Clone

export const clone = function () {
    const scale = Vec3Utils.create();
    const transformQuat = Quat2Utils.create();
    return function clone(object: Readonly<Object3D>, cloneParams: Readonly<ObjectCloneParams> = new ObjectCloneParams()): Object3D | null {
        let clonedObject = null;

        const cloneParent = cloneParams.myCloneParent === undefined ? ObjectUtils.getParent(object) : cloneParams.myCloneParent;

        if (cloneParams.myUseDefaultObjectClone) {
            clonedObject = object.clone(cloneParent);

            if (cloneParams.myDefaultComponentCloneAutoStartIfNotActive) {
                const clonedComponents = ObjectUtils.getComponents(clonedObject);
                for (const clonedComponent of clonedComponents) {

                    // Trigger start, which otherwise would be called later, on first activation
                    if (cloneParams.myDefaultComponentCloneAutoStartIfNotActive && !clonedComponent.active) {
                        clonedComponent.active = true;
                        clonedComponent.active = false;
                    }
                }
            }
        } else if (ObjectUtils.isCloneable(object, cloneParams)) {
            const objectsToCloneData: [Object3D | null, Readonly<Object3D>][] = [];
            objectsToCloneData.push([cloneParent, object]);

            // Create the object hierarchy
            const objectsToCloneComponentsData: [Readonly<Object3D>, Object3D][] = [];
            while (objectsToCloneData.length > 0) {
                const cloneData = objectsToCloneData.shift();
                const parent = cloneData![0];
                const objectToClone = cloneData![1];

                const currentClonedObject = (parent != null) ? ObjectUtils.addObject(parent) : ObjectUtils.addObject(Globals.getRootObject(ObjectUtils.getEngine(object))!);
                ObjectUtils.setName(currentClonedObject, ObjectUtils.getName(objectToClone));

                ObjectUtils.setScaleLocal(currentClonedObject, ObjectUtils.getScaleLocal(objectToClone, scale));
                ObjectUtils.setTransformLocalQuat(currentClonedObject, ObjectUtils.getTransformLocalQuat(objectToClone, transformQuat));

                if (!cloneParams.myIgnoreComponents) {
                    objectsToCloneComponentsData.push([objectToClone, currentClonedObject]);
                }

                if (!cloneParams.myIgnoreDescendants) {
                    for (const child of ObjectUtils.getChildren(objectToClone)) {
                        let cloneDescendant = false;
                        if (cloneParams.myDescendantsToInclude.length > 0) {
                            cloneDescendant = cloneParams.myDescendantsToInclude.find(descendantToInclude => ObjectUtils.equals(descendantToInclude, child)) != null;
                        } else {
                            cloneDescendant = cloneParams.myDescendantsToIgnore.find(descendantToIgnore => ObjectUtils.equals(descendantToIgnore, child)) == null;
                        }

                        if (cloneDescendant && cloneParams.myIgnoreDescendantCallback != null) {
                            cloneDescendant = !cloneParams.myIgnoreDescendantCallback(child);
                        }

                        if (cloneDescendant) {
                            objectsToCloneData.push([currentClonedObject, child]);
                        }
                    }
                }

                if (clonedObject == null) {
                    clonedObject = currentClonedObject;
                }
            }

            // Get the components to clone
            const componentsToCloneData: [Component, Object3D][] = [];
            while (objectsToCloneComponentsData.length > 0) {
                const cloneData = objectsToCloneComponentsData.shift();
                const objectToClone = cloneData![0];
                const currentClonedObject = cloneData![1];

                const components = ObjectUtils.getComponentsSelf(objectToClone);
                for (const component of components) {
                    if (ComponentUtils.isCloneable(component.type, cloneParams.myUseDefaultComponentClone || cloneParams.myUseDefaultComponentCloneAsFallback, ObjectUtils.getEngine(object))) {
                        let cloneComponent = false;
                        if (cloneParams.myComponentsToInclude.length > 0) {
                            cloneComponent = cloneParams.myComponentsToInclude.indexOf(component.type) != -1;
                        } else {
                            cloneComponent = cloneParams.myComponentsToIgnore.indexOf(component.type) == -1;
                        }

                        if (cloneComponent && cloneParams.myIgnoreComponentCallback != null) {
                            cloneComponent = !cloneParams.myIgnoreComponentCallback(component);
                        }

                        if (cloneComponent) {
                            componentsToCloneData.push([component, currentClonedObject]);
                        }
                    }
                }
            }

            // Clone the components
            const componentsToPostProcessData: [Component, Component][] = [];
            while (componentsToCloneData.length > 0) {
                const cloneData = componentsToCloneData.shift();
                const componentToClone = cloneData![0];
                const currentClonedObject = cloneData![1];
                let clonedComponent = null;

                if (!cloneParams.myUseDefaultComponentClone) {
                    clonedComponent = ComponentUtils.clone(componentToClone, currentClonedObject, cloneParams.myComponentDeepCloneParams, cloneParams.myComponentCustomCloneParams, cloneParams.myUseDefaultComponentCloneAsFallback, cloneParams.myDefaultComponentCloneAutoStartIfNotActive);
                } else {
                    clonedComponent = ComponentUtils.cloneDefault(componentToClone, currentClonedObject, cloneParams.myDefaultComponentCloneAutoStartIfNotActive);
                }

                if (clonedComponent != null) {
                    if (ComponentUtils.hasClonePostProcess(componentToClone.type, ObjectUtils.getEngine(object))) {
                        componentsToPostProcessData.push([componentToClone, clonedComponent]);
                    }
                }
            }

            // Clone post process
            // Can be useful if you have to get some data from other components in the hierarchy which have now been created
            while (componentsToPostProcessData.length > 0) {
                const cloneData = componentsToPostProcessData.shift();
                const componentToClone = cloneData![0];
                const currentClonedComponent = cloneData![1];

                ComponentUtils.clonePostProcess(componentToClone, currentClonedComponent, cloneParams.myComponentDeepCloneParams, cloneParams.myComponentCustomCloneParams);
            }
        } else if (cloneParams.myUseDefaultObjectCloneAsFallback) {
            clonedObject = object.clone(cloneParent);

            if (cloneParams.myDefaultComponentCloneAutoStartIfNotActive) {
                const clonedComponents = ObjectUtils.getComponents(clonedObject);
                for (const clonedComponent of clonedComponents) {
                    // Trigger start, which otherwise would be called later, on first activation
                    if (cloneParams.myDefaultComponentCloneAutoStartIfNotActive && !clonedComponent.active) {
                        clonedComponent.active = true;
                        clonedComponent.active = false;
                    }
                }
            }
        }

        return clonedObject;
    };
}();

export function isCloneable(object: Readonly<Object3D>, cloneParams: Readonly<ObjectCloneParams> = new ObjectCloneParams()): boolean {
    if (cloneParams.myIgnoreNonCloneable || cloneParams.myIgnoreComponents || cloneParams.myUseDefaultComponentClone || cloneParams.myUseDefaultComponentCloneAsFallback) {
        return true;
    }

    let cloneable = true;

    const objectsToClone: Readonly<Object3D>[] = [];
    objectsToClone.push(object);

    while (cloneable && objectsToClone.length > 0) {
        const objectToClone = objectsToClone.shift()!;

        const components = ObjectUtils.getComponentsSelf(objectToClone);
        for (const component of components) {
            let cloneComponent = false;
            if (cloneParams.myComponentsToInclude.length > 0) {
                cloneComponent = cloneParams.myComponentsToInclude.indexOf(component.type) != -1;
            } else {
                cloneComponent = cloneParams.myComponentsToIgnore.indexOf(component.type) == -1;
            }

            if (cloneComponent && cloneParams.myIgnoreComponentCallback != null) {
                cloneComponent = !cloneParams.myIgnoreComponentCallback(component);
            }

            if (cloneComponent && !ComponentUtils.isCloneable(component.type, false, ObjectUtils.getEngine(object))) {
                cloneable = false;
                break;
            }
        }

        if (cloneable && !cloneParams.myIgnoreDescendants) {
            for (const child of ObjectUtils.getChildren(objectToClone)) {
                let cloneDescendant = false;
                if (cloneParams.myDescendantsToInclude.length > 0) {
                    cloneDescendant = cloneParams.myDescendantsToInclude.find(descendantToInclude => ObjectUtils.equals(descendantToInclude, child)) != null;
                } else {
                    cloneDescendant = cloneParams.myDescendantsToIgnore.find(descendantToInclude => ObjectUtils.equals(descendantToInclude, child)) == null;
                }

                if (cloneDescendant && cloneParams.myIgnoreDescendantCallback != null) {
                    cloneDescendant = !cloneParams.myIgnoreDescendantCallback(child);
                }

                if (cloneDescendant) {
                    objectsToClone.push(child);
                }
            }
        }
    }

    return cloneable;
}

// To String

export function toString(object: Readonly<Object3D>): string {
    return ObjectUtils.toStringCompact(object);
}

export const toStringExtended = function () {
    const tab = "    ";
    const newLine = "\n";
    const startObject = "{";
    const endObject = "}";
    const nameLabel = "name: ";
    const idLabel = "id: ";
    const componentsLabel = "components: ";
    const typeLabel = "type: ";
    const childrenLabel = "children: ";
    const startComponents = "[";
    const endComponents = "]";
    const startChildren = startComponents;
    const endChildren = endComponents;
    const separator = ",";
    const newLineTab = newLine.concat(tab, tab);
    return function toStringExtended(object: Readonly<Object3D>): string {
        let objectString = "";
        objectString = objectString.concat(startObject, newLine);

        const components = ObjectUtils.getComponentsSelf(object);
        const children = ObjectUtils.getChildren(object);
        const name = ObjectUtils.getName(object);

        if (components.length > 0 || children.length > 0 || name.length > 0) {
            objectString = objectString.concat(tab, idLabel, ObjectUtils.getID(object).toString(), separator, newLine);
        } else {
            objectString = objectString.concat(tab, idLabel, ObjectUtils.getID(object).toString(), newLine);
        }

        if (name.length > 0) {
            if (components.length > 0 || children.length > 0) {
                objectString = objectString.concat(tab, nameLabel, ObjectUtils.getName(object), separator, newLine);
            } else {
                objectString = objectString.concat(tab, nameLabel, ObjectUtils.getName(object), newLine);
            }
        }

        if (components.length > 0) {
            objectString = objectString.concat(tab, componentsLabel, newLine, tab, startComponents, newLine);
            for (let i = 0; i < components.length; i++) {
                const component = components[i];

                objectString = objectString.concat(tab, tab, startObject, newLine);
                objectString = objectString.concat(tab, tab, tab, typeLabel, component.type, separator, newLine);
                objectString = objectString.concat(tab, tab, tab, idLabel, component._id.toString(), separator, newLine);
                objectString = objectString.concat(tab, tab, endObject);

                if (i != components.length - 1) {
                    objectString = objectString.concat(separator, newLine);
                } else {
                    objectString = objectString.concat(newLine);
                }
            }

            if (children.length > 0) {
                objectString = objectString.concat(tab, endComponents, separator, newLine);
            } else {
                objectString = objectString.concat(tab, endComponents, newLine);
            }
        }

        if (children.length > 0) {
            objectString = objectString.concat(tab, childrenLabel, newLine, tab, startChildren, newLine);
            for (let i = 0; i < children.length; i++) {
                const child = children[i];

                let childString = ObjectUtils.toStringExtended(child);
                childString = childString.replaceAll(newLine, newLineTab);
                childString = tab.concat(tab, childString);
                objectString = objectString.concat(childString);

                if (i != children.length - 1) {
                    objectString = objectString.concat(separator, newLine);
                } else {
                    objectString = objectString.concat(newLine);
                }
            }
            objectString = objectString.concat(tab, endChildren, newLine);
        }

        objectString = objectString.concat(endObject);

        return objectString;
    };
}();

export const toStringCompact = function () {
    const tab = "    ";
    const newLine = "\n";
    const emptyName = "<none>";
    const nameLabel = "name: ";
    const componentsLabel = "components: ";
    const separator = ", ";
    const newLineTab = newLine.concat(tab);
    return function toStringCompact(object: Readonly<Object3D>): string {
        let objectString = "";

        const name = ObjectUtils.getName(object);
        if (name.length > 0) {
            objectString = objectString.concat(nameLabel, name);
        } else {
            objectString = objectString.concat(nameLabel, emptyName);
        }

        const components = ObjectUtils.getComponentsSelf(object);
        if (components.length > 0) {
            objectString = objectString.concat(separator, componentsLabel);
            for (let i = 0; i < components.length; i++) {
                const component = components[i];

                objectString = objectString.concat(component.type);

                if (i != components.length - 1) {
                    objectString = objectString.concat(separator);
                }
            }
        }

        const children = ObjectUtils.getChildren(object);
        if (children.length > 0) {
            objectString = objectString.concat(newLine);
            for (let i = 0; i < children.length; i++) {
                const child = children[i];

                let childString = ObjectUtils.toStringCompact(child);
                childString = childString.replaceAll(newLine, newLineTab);
                childString = tab.concat(childString);
                objectString = objectString.concat(childString);

                if (i != children.length - 1) {
                    objectString = objectString.concat(newLine);
                }
            }
        }

        return objectString;
    };
}();

export function log(object: Readonly<Object3D>): Object3D {
    return ObjectUtils.logCompact(object);
}

export function logExtended(object: Readonly<Object3D>): Object3D {
    console.log(ObjectUtils.toStringExtended(object));
    return object as Object3D;
}

export function logCompact(object: Readonly<Object3D>): Object3D {
    console.log(ObjectUtils.toStringCompact(object));
    return object as Object3D;
}

export function warn(object: Readonly<Object3D>): Object3D {
    return ObjectUtils.warnCompact(object);
}

export function warnExtended(object: Readonly<Object3D>): Object3D {
    console.warn(ObjectUtils.toStringExtended(object));
    return object as Object3D;
}

export function warnCompact(object: Readonly<Object3D>): Object3D {
    console.warn(ObjectUtils.toStringCompact(object));
    return object as Object3D;
}

export function error(object: Readonly<Object3D>): Object3D {
    return ObjectUtils.errorCompact(object);
}

export function errorExtended(object: Readonly<Object3D>): Object3D {
    console.error(ObjectUtils.toStringExtended(object));
    return object as Object3D;
}

export function errorCompact(object: Readonly<Object3D>): Object3D {
    console.error(ObjectUtils.toStringCompact(object));
    return object as Object3D;
}

// Get Object By Name

export function getObjectByName(object: Readonly<Object3D>, name: string, isRegex: boolean = false, index: number = 0): Object3D | null {
    return ObjectUtils.getObjectByNameHierarchy(object, name, isRegex, index);
}

export function getObjectByNameHierarchy(object: Readonly<Object3D>, name: string, isRegex: boolean = false, index: number = 0): Object3D | null {
    return ObjectUtils.getObjectByNameHierarchyBreadth(object, name, isRegex, index);
}

export function getObjectByNameHierarchyBreadth(object: Readonly<Object3D>, name: string, isRegex: boolean = false, index: number = 0): Object3D | null {
    const objects = ObjectUtils.getHierarchyBreadth(object);
    return ObjectUtils.getObjectByNameObjects(objects, name, isRegex, index);
}

export function getObjectByNameHierarchyDepth(object: Readonly<Object3D>, name: string, isRegex: boolean = false, index: number = 0): Object3D | null {
    const objects = ObjectUtils.getHierarchyDepth(object);
    return ObjectUtils.getObjectByNameObjects(objects, name, isRegex, index);
}

export function getObjectByNameDescendants(object: Readonly<Object3D>, name: string, isRegex: boolean = false, index: number = 0): Object3D | null {
    return ObjectUtils.getObjectByNameDescendantsBreadth(object, name, isRegex, index);
}

export function getObjectByNameDescendantsBreadth(object: Readonly<Object3D>, name: string, isRegex: boolean = false, index: number = 0): Object3D | null {
    const objects = ObjectUtils.getDescendantsBreadth(object);
    return ObjectUtils.getObjectByNameObjects(objects, name, isRegex, index);
}

export function getObjectByNameDescendantsDepth(object: Readonly<Object3D>, name: string, isRegex: boolean = false, index: number = 0): Object3D | null {
    const objects = ObjectUtils.getDescendantsDepth(object);
    return ObjectUtils.getObjectByNameObjects(objects, name, isRegex, index);
}

export function getObjectByNameChildren(object: Readonly<Object3D>, name: string, isRegex: boolean = false, index: number = 0): Object3D | null {
    const objects = ObjectUtils.getChildren(object);
    return ObjectUtils.getObjectByNameObjects(objects, name, isRegex, index);
}

export function getObjectsByName(object: Readonly<Object3D>, name: string, isRegex: boolean = false): Object3D[] {
    return ObjectUtils.getObjectsByNameHierarchy(object, name, isRegex);
}

export function getObjectsByNameHierarchy(object: Readonly<Object3D>, name: string, isRegex: boolean = false): Object3D[] {
    return ObjectUtils.getObjectsByNameHierarchyBreadth(object, name, isRegex);
}

export function getObjectsByNameHierarchyBreadth(object: Readonly<Object3D>, name: string, isRegex: boolean = false): Object3D[] {
    const objects = ObjectUtils.getHierarchyBreadth(object);
    return ObjectUtils.getObjectsByNameObjects(objects, name, isRegex);
}

export function getObjectsByNameHierarchyDepth(object: Readonly<Object3D>, name: string, isRegex: boolean = false): Object3D[] {
    const objects = ObjectUtils.getHierarchyDepth(object);
    return ObjectUtils.getObjectsByNameObjects(objects, name, isRegex);
}

export function getObjectsByNameDescendants(object: Readonly<Object3D>, name: string, isRegex: boolean = false): Object3D[] {
    return ObjectUtils.getObjectsByNameDescendantsBreadth(object, name, isRegex);
}

export function getObjectsByNameDescendantsBreadth(object: Readonly<Object3D>, name: string, isRegex: boolean = false): Object3D[] {
    const objects = ObjectUtils.getDescendantsBreadth(object);
    return ObjectUtils.getObjectsByNameObjects(objects, name, isRegex);
}

export function getObjectsByNameDescendantsDepth(object: Readonly<Object3D>, name: string, isRegex: boolean = false): Object3D[] {
    const objects = ObjectUtils.getDescendantsDepth(object);
    return ObjectUtils.getObjectsByNameObjects(objects, name, isRegex);
}

export function getObjectsByNameChildren(object: Readonly<Object3D>, name: string, isRegex: boolean = false): Object3D[] {
    const objects = ObjectUtils.getChildren(object);
    return ObjectUtils.getObjectsByNameObjects(objects, name, isRegex);
}

// Get Object By ID

export function getObjectByID(object: Readonly<Object3D>, id: number): Object3D | null {
    return ObjectUtils.getObjectByIDHierarchy(object, id);
}

export function getObjectByIDHierarchy(object: Readonly<Object3D>, id: number): Object3D | null {
    return ObjectUtils.getObjectByIDHierarchyBreadth(object, id);
}

export function getObjectByIDHierarchyBreadth(object: Readonly<Object3D>, id: number): Object3D | null {
    const objects = ObjectUtils.getHierarchyBreadth(object);
    return ObjectUtils.getObjectByIDObjects(objects, id);
}

export function getObjectByIDHierarchyDepth(object: Readonly<Object3D>, id: number): Object3D | null {
    const objects = ObjectUtils.getHierarchyDepth(object);
    return ObjectUtils.getObjectByIDObjects(objects, id);
}

export function getObjectByIDDescendants(object: Readonly<Object3D>, id: number): Object3D | null {
    return ObjectUtils.getObjectByIDDescendantsBreadth(object, id);
}

export function getObjectByIDDescendantsBreadth(object: Readonly<Object3D>, id: number): Object3D | null {
    const objects = ObjectUtils.getDescendantsBreadth(object);
    return ObjectUtils.getObjectByIDObjects(objects, id);
}

export function getObjectByIDDescendantsDepth(object: Readonly<Object3D>, id: number): Object3D | null {
    const objects = ObjectUtils.getDescendantsDepth(object);
    return ObjectUtils.getObjectByIDObjects(objects, id);
}

export function getObjectByIDChildren(object: Readonly<Object3D>, id: number): Object3D | null {
    const objects = ObjectUtils.getChildren(object);
    return ObjectUtils.getObjectByIDObjects(objects, id);
}

// Get Hierarchy

export function getHierarchy(object: Readonly<Object3D>): Object3D[] {
    return ObjectUtils.getHierarchyBreadth(object);
}

export function getHierarchyBreadth(object: Readonly<Object3D>): Object3D[] {
    const hierarchy = ObjectUtils.getDescendantsBreadth(object);

    hierarchy.unshift(object as Object3D);

    return hierarchy;
}

export function getHierarchyDepth(object: Readonly<Object3D>): Object3D[] {
    const hierarchy = ObjectUtils.getDescendantsDepth(object);

    hierarchy.unshift(object as Object3D);

    return hierarchy;
}

export function getDescendants(object: Readonly<Object3D>): Object3D[] {
    return ObjectUtils.getDescendantsBreadth(object);
}

export function getDescendantsBreadth(object: Readonly<Object3D>): Object3D[] {
    const descendants: Object3D[] = [];

    const descendantsQueue = ObjectUtils.getChildren(object);

    while (descendantsQueue.length > 0) {
        const descendant = descendantsQueue.shift()!;
        descendants.push(descendant);
        for (const child of ObjectUtils.getChildren(descendant)) {
            descendantsQueue.push(child);
        }
    }

    return descendants;
}

export function getDescendantsDepth(object: Readonly<Object3D>): Object3D[] {
    const descendants: Object3D[] = [];

    const children = ObjectUtils.getChildren(object);

    for (const child of children) {
        descendants.push(child);

        const childDescendants = ObjectUtils.getDescendantsDepth(child);
        for (let i = 0; i < childDescendants.length; i++) {
            descendants.push(childDescendants[i]);
        }
    }

    return descendants;
}

export function getChildren(object: Readonly<Object3D>): Object3D[] {
    return object.children;
}

export function getSelf(object: Readonly<Object3D>): Object3D {
    return object as Object3D;
}

// Cauldron

export function addObject(object: Object3D): Object3D {
    return Globals.getScene(ObjectUtils.getEngine(object)).addObject(object);
}

export function getName(object: Readonly<Object3D>): string {
    return object.name;
}

export function setName(object: Object3D, name: string): Object3D {
    object.name = name;
    return object;
}

export function getEngine(object: Readonly<Object3D>): WonderlandEngine {
    return object.engine;
}

export function getID(object: Readonly<Object3D>): number {
    return object.objectId;
}

export function markDirty(object: Object3D): Object3D {
    object.setDirty();
    return object;
}

export function isTransformChanged(object: Readonly<Object3D>): boolean {
    return object.changed;
}

export function equals(first: Readonly<Object3D>, second: Readonly<Object3D>): boolean {
    return first.equals(second as Object3D);
}

export function destroy(object: Object3D): void {
    let destroyReturnValue = undefined;

    try {
        destroyReturnValue = object.destroy();
    } catch (error) {
        // Do nothing
    }

    return destroyReturnValue;
}

export function reserveObjects(object: Readonly<Object3D>, count: number): Object3D {
    return ObjectUtils.reserveObjectsHierarchy(object, count);
}

export function reserveObjectsSelf(object: Readonly<Object3D>, count: number): Object3D {
    const componentsAmountMap = ObjectUtils.getComponentsAmountMapSelf(object);
    _reserveObjects(count, componentsAmountMap, Globals.getScene(ObjectUtils.getEngine(object)));

    return object as Object3D;
}

export function reserveObjectsHierarchy(object: Readonly<Object3D>, count: number): Object3D {
    const componentsAmountMap = ObjectUtils.getComponentsAmountMapHierarchy(object);
    _reserveObjects(count, componentsAmountMap, Globals.getScene(ObjectUtils.getEngine(object)));

    return object as Object3D;
}

export function reserveObjectsDescendants(object: Readonly<Object3D>, count: number): Object3D {
    const componentsAmountMap = ObjectUtils.getComponentsAmountMapDescendants(object);
    _reserveObjects(count, componentsAmountMap, Globals.getScene(ObjectUtils.getEngine(object)));

    return object as Object3D;
}

export function reserveObjectsChildren(object: Readonly<Object3D>, count: number): Object3D {
    const componentsAmountMap = ObjectUtils.getComponentsAmountMapChildren(object);
    _reserveObjects(count, componentsAmountMap, Globals.getScene(ObjectUtils.getEngine(object)));

    return object as Object3D;
}

export function getComponentsAmountMap(object: Readonly<Object3D>): Map<string, number>;
export function getComponentsAmountMap(object: Readonly<Object3D>, outComponentsAmountMap: Map<string, number>): Map<string, number>;
export function getComponentsAmountMap(object: Readonly<Object3D>, outComponentsAmountMap: Map<string, number> = new Map()): Map<string, number> {
    return ObjectUtils.getComponentsAmountMapHierarchy(object, outComponentsAmountMap);
}

export function getComponentsAmountMapSelf(object: Readonly<Object3D>): Map<string, number>;
export function getComponentsAmountMapSelf(object: Readonly<Object3D>, outComponentsAmountMap: Map<string, number>): Map<string, number>;
export function getComponentsAmountMapSelf(object: Readonly<Object3D>, outComponentsAmountMap: Map<string, number> = new Map()): Map<string, number> {
    let objectsAmount = outComponentsAmountMap.get("object");
    if (objectsAmount == null) {
        objectsAmount = 0;
    }
    objectsAmount += 1;
    outComponentsAmountMap.set("object", objectsAmount);

    const components = ObjectUtils.getComponentsSelf(object);
    for (const component of components) {
        const type = component.type;
        let typeAmount = outComponentsAmountMap.get(type);
        if (typeAmount == null) {
            typeAmount = 0;
        }
        typeAmount += 1;
        outComponentsAmountMap.set(type, typeAmount);
    }

    return outComponentsAmountMap;
}

export function getComponentsAmountMapHierarchy(object: Readonly<Object3D>): Map<string, number>;
export function getComponentsAmountMapHierarchy(object: Readonly<Object3D>, outComponentsAmountMap: Map<string, number>): Map<string, number>;
export function getComponentsAmountMapHierarchy(object: Readonly<Object3D>, outComponentsAmountMap: Map<string, number> = new Map()): Map<string, number> {
    const hierarchy = ObjectUtils.getHierarchy(object);

    for (const hierarchyObject of hierarchy) {
        ObjectUtils.getComponentsAmountMapSelf(hierarchyObject, outComponentsAmountMap);
    }

    return outComponentsAmountMap;
}

export function getComponentsAmountMapDescendants(object: Readonly<Object3D>): Map<string, number>;
export function getComponentsAmountMapDescendants(object: Readonly<Object3D>, outComponentsAmountMap: Map<string, number>): Map<string, number>;
export function getComponentsAmountMapDescendants(object: Readonly<Object3D>, outComponentsAmountMap: Map<string, number> = new Map()): Map<string, number> {
    const descendants = ObjectUtils.getDescendants(object);

    for (const descendant of descendants) {
        ObjectUtils.getComponentsAmountMapSelf(descendant, outComponentsAmountMap);
    }

    return outComponentsAmountMap;
}

export function getComponentsAmountMapChildren(object: Readonly<Object3D>): Map<string, number>;
export function getComponentsAmountMapChildren(object: Readonly<Object3D>, outComponentsAmountMap: Map<string, number>): Map<string, number>;
export function getComponentsAmountMapChildren(object: Readonly<Object3D>, outComponentsAmountMap: Map<string, number> = new Map()): Map<string, number> {
    const children = ObjectUtils.getChildren(object);

    for (const child of children) {
        ObjectUtils.getComponentsAmountMapSelf(child, outComponentsAmountMap);
    }

    return outComponentsAmountMap;
}

// GLOBALS

export function getComponentObjects<T extends Component>(objects: Object3D[], classOrType: ComponentConstructor<T> | string, index: number = 0): T | null {
    let component = null;

    for (const object of objects) {
        component = object.getComponent(classOrType as ComponentConstructor<T>, index);

        if (component != null) {
            break;
        }
    }

    return component;
}

export function getComponentsObjects<T extends Component>(objects: Object3D[], classOrType?: ComponentConstructor<T> | string): T[] {
    const components: T[] = [];

    for (const currentObject of objects) {
        const currentObjectComponents = currentObject.getComponents(classOrType as ComponentConstructor<T>);

        for (let i = 0; i < currentObjectComponents.length; i++) {
            components.push(currentObjectComponents[i]);
        }
    }

    return components;
}

export function setActiveObjects(objects: Object3D[], active: boolean): void {
    for (const currentObject of objects) {
        currentObject.active = active;
    }
}

export function getObjectByNameObjects(objects: Object3D[], name: string, isRegex: boolean = false, index: number = 0): Object3D | null {
    let objectFound = null;

    let currentIndex = index;
    for (const currentObject of objects) {
        const objectName = ObjectUtils.getName(currentObject);
        if ((!isRegex && objectName == name) || (isRegex && objectName.match(name) != null)) {
            if (currentIndex == 0) {
                objectFound = currentObject;
                break;
            }

            currentIndex--;
        }
    }

    return objectFound;
}

export function getObjectsByNameObjects(objects: Object3D[], name: string, isRegex: boolean = false): Object3D[] {
    const objectsFound: Object3D[] = [];

    for (const currentObject of objects) {
        const objectName = ObjectUtils.getName(currentObject);
        if ((!isRegex && objectName == name) || (isRegex && objectName.match(name) != null)) {
            objectsFound.push(currentObject);
        }
    }

    return objectsFound;
}

export function getObjectByIDObjects(objects: Object3D[], id: number, index: number = 0): Object3D | null {
    let objectFound = null;

    let currentIndex = index;
    for (const currentObject of objects) {
        if (ObjectUtils.getID(currentObject) == id) {
            if (currentIndex == 0) {
                objectFound = currentObject;
                break;
            }

            currentIndex--;
        }
    }

    return objectFound;
}

export function getObjectsByIDObjects(objects: Object3D[], id: number): Object3D[] {
    const objectsFound: Object3D[] = [];

    for (const currentObject of objects) {
        if (ObjectUtils.getID(currentObject) == id) {
            objectsFound.push(currentObject);
        }
    }

    return objectsFound;
}

export function wrapObject(id: number, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): Object3D | null {
    return engine != null ? engine.wrapObject(id) : null;
}

/**
 * How to use
 * 
 * By default the functions work on `World` space, rotations are in `Degrees` and transforms are `Matrix4` (and not `Quat2`)  
 * For functions that work with rotations, `Matrix` means `Matrix3` and `Quat` means `Quat`  
 * For functions that work with transforms, `Matrix` means `Matrix4` and `Quat` means `Quat2`
 * 
 * 
 * You can add a suffix like `World`/`Local`/`Object` at the end of some functions to specify the space, example:  
 *     - `getPositionLocal` to get the position in local space (parent space)  
 *     - `translateObject` to translate in object space
 * 
 * 
 * For rotations u can add a suffix like `Degrees`/`Radians`/`Quat`/`Matrix` to use a specific version, example:  
 *     - `getRotationDegrees`  
 *     - `setRotationLocalMatrix`  
 *     - `rotateWorldQuat`
 *     
 * 
 * For transform u can add a suffix like `Quat`/`Matrix` to use a specific version, example:  
 *     - `getTransformQuat`  
 *     - `setTransformWorldMatrix`
 *     
 * 
 * Some functions let you specify if u want them to work on the `Hierarchy`/`Descendants`/`Children`/`Self` where:  
 *     - `Self`: the current object only  
 *     - `Children`: direct children of the object  
 *     - `Descendants`: all the children of the object, including child of child and so on  
 *     - `Hierarchy`: `Descendants` plus the current object
 * 
 * Examples:  
 *     - `getComponent`  
 *     - `getComponentHierarchy`  
 *     - `getComponentsAmountMapDescendants`  
 *     - `setActiveChildren`  
 *     - `setActiveSelf`
 * 
 * By default the functions work on the `Hierarchy`
 * 
 * On some of the functions where u can specify `Hierarchy`/`Descendants` u can also specify if the algorithm should explore by `Breadth`/`Depth`, example:  
 *     - `getComponentHierarchyBreadth`  
 *     - `setActiveDescendantsDepth`
 * 
 * By default the functions explore by `Breadth`
 * 
 * The functions leave u the choice of forwarding an out parameter or just get the return value, example:  
 *     - `let position = ObjectUtils.getPosition(object)`  
 *     - `ObjectUtils.getPosition(object, position)`  
 *     - the out parameter is always the last one
 * 
 * 
 * If a method require an engine parameter, u can always avoid specifying it and it will by default use the current main engine  
 * If a method require a scene parameter, u can always avoid specifying it and it will by default use the scene from the current main engine
 */
export const ObjectUtils = {
    getPosition,
    getPositionWorld,
    getPositionLocal,
    getRotation,
    getRotationDegrees,
    getRotationRadians,
    getRotationMatrix,
    getRotationQuat,
    getRotationWorld,
    getRotationWorldDegrees,
    getRotationWorldRadians,
    getRotationWorldMatrix,
    getRotationWorldQuat,
    getRotationLocal,
    getRotationLocalDegrees,
    getRotationLocalRadians,
    getRotationLocalMatrix,
    getRotationLocalQuat,
    getScale,
    getScaleWorld,
    getScaleLocal,
    getTransform,
    getTransformMatrix,
    getTransformQuat,
    getTransformWorld,
    getTransformWorldMatrix,
    getTransformWorldQuat,
    getTransformLocal,
    getTransformLocalMatrix,
    getTransformLocalQuat,
    getAxes,
    getAxesWorld,
    getAxesLocal,
    getForward,
    getForwardWorld,
    getForwardLocal,
    getBackward,
    getBackwardWorld,
    getBackwardLocal,
    getUp,
    getUpWorld,
    getUpLocal,
    getDown,
    getDownWorld,
    getDownLocal,
    getLeft,
    getLeftWorld,
    getLeftLocal,
    getRight,
    getRightWorld,
    getRightLocal,
    setPosition,
    setPositionWorld,
    setPositionLocal,
    setRotation,
    setRotationDegrees,
    setRotationRadians,
    setRotationMatrix,
    setRotationQuat,
    setRotationWorld,
    setRotationWorldDegrees,
    setRotationWorldRadians,
    setRotationWorldMatrix,
    setRotationWorldQuat,
    setRotationLocal,
    setRotationLocalDegrees,
    setRotationLocalRadians,
    setRotationLocalMatrix,
    setRotationLocalQuat,
    setScale,
    setScaleWorld,
    setScaleLocal,
    setAxes,
    setAxesWorld,
    setAxesLocal,
    setForward,
    setForwardWorld,
    setForwardLocal,
    setBackward,
    setBackwardWorld,
    setBackwardLocal,
    setUp,
    setUpWorld,
    setUpLocal,
    setDown,
    setDownWorld,
    setDownLocal,
    setLeft,
    setLeftWorld,
    setLeftLocal,
    setRight,
    setRightWorld,
    setRightLocal,
    setTransform,
    setTransformMatrix,
    setTransformQuat,
    setTransformWorld,
    setTransformWorldMatrix,
    setTransformWorldQuat,
    setTransformLocal,
    setTransformLocalMatrix,
    setTransformLocalQuat,
    resetPosition,
    resetPositionWorld,
    resetPositionLocal,
    resetRotation,
    resetRotationWorld,
    resetRotationLocal,
    resetScale,
    resetScaleWorld,
    resetScaleLocal,
    resetTransform,
    resetTransformWorld,
    resetTransformLocal,
    translate,
    translateWorld,
    translateLocal,
    translateObject,
    translateAxis,
    translateAxisWorld,
    translateAxisLocal,
    translateAxisObject,
    rotate,
    rotateDegrees,
    rotateRadians,
    rotateMatrix,
    rotateQuat,
    rotateWorld,
    rotateWorldDegrees,
    rotateWorldRadians,
    rotateWorldMatrix,
    rotateWorldQuat,
    rotateLocal,
    rotateLocalDegrees,
    rotateLocalRadians,
    rotateLocalMatrix,
    rotateLocalQuat,
    rotateObject,
    rotateObjectDegrees,
    rotateObjectRadians,
    rotateObjectMatrix,
    rotateObjectQuat,
    rotateAxis,
    rotateAxisDegrees,
    rotateAxisRadians,
    rotateAxisWorld,
    rotateAxisWorldDegrees,
    rotateAxisWorldRadians,
    rotateAxisLocal,
    rotateAxisLocalDegrees,
    rotateAxisLocalRadians,
    rotateAxisObject,
    rotateAxisObjectDegrees,
    rotateAxisObjectRadians,
    rotateAround,
    rotateAroundDegrees,
    rotateAroundRadians,
    rotateAroundMatrix,
    rotateAroundQuat,
    rotateAroundWorld,
    rotateAroundWorldDegrees,
    rotateAroundWorldRadians,
    rotateAroundWorldMatrix,
    rotateAroundWorldQuat,
    rotateAroundLocal,
    rotateAroundLocalDegrees,
    rotateAroundLocalRadians,
    rotateAroundLocalMatrix,
    rotateAroundLocalQuat,
    rotateAroundObject,
    rotateAroundObjectDegrees,
    rotateAroundObjectRadians,
    rotateAroundObjectMatrix,
    rotateAroundObjectQuat,
    rotateAroundAxis,
    rotateAroundAxisDegrees,
    rotateAroundAxisRadians,
    rotateAroundAxisWorld,
    rotateAroundAxisWorldDegrees,
    rotateAroundAxisWorldRadians,
    rotateAroundAxisLocal,
    rotateAroundAxisLocalDegrees,
    rotateAroundAxisLocalRadians,
    rotateAroundAxisObject,
    rotateAroundAxisObjectDegrees,
    rotateAroundAxisObjectRadians,
    scaleObject,
    lookAt,
    lookAtWorld,
    lookAtLocal,
    lookTo,
    lookToWorld,
    lookToLocal,
    convertPositionObjectToWorld,
    convertDirectionObjectToWorld,
    convertPositionWorldToObject,
    convertDirectionWorldToObject,
    convertPositionLocalToWorld,
    convertDirectionLocalToWorld,
    convertPositionWorldToLocal,
    convertDirectionWorldToLocal,
    convertPositionObjectToLocal,
    convertDirectionObjectToLocal,
    convertPositionLocalToObject,
    convertDirectionLocalToObject,
    convertTransformObjectToWorld,
    convertTransformObjectToWorldMatrix,
    convertTransformObjectToWorldQuat,
    convertTransformWorldToObject,
    convertTransformWorldToObjectMatrix,
    convertTransformWorldToObjectQuat,
    convertTransformLocalToWorld,
    convertTransformLocalToWorldMatrix,
    convertTransformLocalToWorldQuat,
    convertTransformWorldToLocal,
    convertTransformWorldToLocalMatrix,
    convertTransformWorldToLocalQuat,
    convertTransformObjectToLocal,
    convertTransformObjectToLocalMatrix,
    convertTransformObjectToLocalQuat,
    convertTransformLocalToObject,
    convertTransformLocalToObjectMatrix,
    convertTransformLocalToObjectQuat,
    setParent,
    getParent,
    addComponent,
    getComponent,
    getComponentSelf,
    getComponentHierarchy,
    getComponentHierarchyBreadth,
    getComponentHierarchyDepth,
    getComponentDescendants,
    getComponentDescendantsBreadth,
    getComponentDescendantsDepth,
    getComponentChildren,
    getComponents,
    getComponentsSelf,
    getComponentsHierarchy,
    getComponentsHierarchyBreadth,
    getComponentsHierarchyDepth,
    getComponentsDescendants,
    getComponentsDescendantsBreadth,
    getComponentsDescendantsDepth,
    getComponentsChildren,
    setActive,
    setActiveSelf,
    setActiveHierarchy,
    setActiveHierarchyBreadth,
    setActiveHierarchyDepth,
    setActiveDescendants,
    setActiveDescendantsBreadth,
    setActiveDescendantsDepth,
    setActiveChildren,
    hasUniformScale,
    hasUniformScaleWorld,
    hasUniformScaleLocal,
    clone,
    isCloneable,
    toString,
    toStringExtended,
    toStringCompact,
    log,
    logExtended,
    logCompact,
    warn,
    warnExtended,
    warnCompact,
    error,
    errorExtended,
    errorCompact,
    getObjectByName,
    getObjectByNameHierarchy,
    getObjectByNameHierarchyBreadth,
    getObjectByNameHierarchyDepth,
    getObjectByNameDescendants,
    getObjectByNameDescendantsBreadth,
    getObjectByNameDescendantsDepth,
    getObjectByNameChildren,
    getObjectsByName,
    getObjectsByNameHierarchy,
    getObjectsByNameHierarchyBreadth,
    getObjectsByNameHierarchyDepth,
    getObjectsByNameDescendants,
    getObjectsByNameDescendantsBreadth,
    getObjectsByNameDescendantsDepth,
    getObjectsByNameChildren,
    getObjectByID,
    getObjectByIDHierarchy,
    getObjectByIDHierarchyBreadth,
    getObjectByIDHierarchyDepth,
    getObjectByIDDescendants,
    getObjectByIDDescendantsBreadth,
    getObjectByIDDescendantsDepth,
    getObjectByIDChildren,
    getHierarchy,
    getHierarchyBreadth,
    getHierarchyDepth,
    getDescendants,
    getDescendantsBreadth,
    getDescendantsDepth,
    getChildren,
    getSelf,
    addObject,
    getName,
    setName,
    getEngine,
    getID,
    markDirty,
    isTransformChanged,
    equals,
    destroy,
    reserveObjects,
    reserveObjectsSelf,
    reserveObjectsHierarchy,
    reserveObjectsDescendants,
    reserveObjectsChildren,
    getComponentsAmountMap,
    getComponentsAmountMapSelf,
    getComponentsAmountMapHierarchy,
    getComponentsAmountMapDescendants,
    getComponentsAmountMapChildren,
    getComponentObjects,
    getComponentsObjects,
    setActiveObjects,
    getObjectByNameObjects,
    getObjectsByNameObjects,
    getObjectByIDObjects,
    getObjectsByIDObjects,
    wrapObject
} as const;



function _reserveObjects(count: number, componentsAmountMap: Readonly<Map<string, number>>, scene: Scene): void {
    if (componentsAmountMap.has("object")) {
        const objectsToReserve = componentsAmountMap.get("object")! * count;

        const componentsToReserve: Record<string, number> = {};
        for (const [componentName, componentCount] of componentsAmountMap.entries()) {
            if (componentName != "object") {
                componentsToReserve[componentName] = componentCount * count;
            }
        }

        scene.reserveObjects(objectsToReserve, componentsToReserve);
    }
}
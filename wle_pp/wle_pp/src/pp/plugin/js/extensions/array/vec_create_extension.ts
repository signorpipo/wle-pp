import { Matrix3, Matrix4, Quaternion, Quaternion2, Vector, Vector2, Vector3, Vector4 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { Mat3Utils } from "../../../../cauldron/utils/array/mat3_utils.js";
import { Mat4Utils } from "../../../../cauldron/utils/array/mat4_utils.js";
import { Quat2Utils } from "../../../../cauldron/utils/array/quat2_utils.js";
import { QuatUtils } from "../../../../cauldron/utils/array/quat_utils.js";
import { Vec2Utils } from "../../../../cauldron/utils/array/vec2_utils.js";
import { Vec3Utils } from "../../../../cauldron/utils/array/vec3_utils.js";
import { Vec4Utils } from "../../../../cauldron/utils/array/vec4_utils.js";
import { VecUtils } from "../../../../cauldron/utils/array/vec_utils.js";

export function vec_create(length: number): Vector;
export function vec_create(firstValue: number, ...remainingValues: number[]): Vector;
export function vec_create(firstValue: number, ...remainingValues: number[]): Vector {
    return VecUtils.create(firstValue, ...remainingValues);
}

export function vec_getAllocationFunction(): (length: number) => Vector {
    return VecUtils.getAllocationFunction();
}

export function vec_setAllocationFunction(allocationFunction: (length: number) => Vector): void {
    VecUtils.setAllocationFunction(allocationFunction);
}



export function vec2_create(): Vector2;
export function vec2_create(x: number, y: number): Vector2;
export function vec2_create(uniformValue: number): Vector2;
export function vec2_create(x?: number, y?: number): Vector2 {
    return Vec2Utils.create(x!, y!);
}

export function vec2_getAllocationFunction(): () => Vector2 {
    return Vec2Utils.getAllocationFunction();
}

export function vec2_setAllocationFunction(allocationFunction: () => Vector2): void {
    Vec2Utils.setAllocationFunction(allocationFunction);
}



export function vec3_create(): Vector3;
export function vec3_create(x: number, y: number, z: number): Vector3;
export function vec3_create(uniformValue: number): Vector3;
export function vec3_create(x?: number, y?: number, z?: number): Vector3 {
    return Vec3Utils.create(x!, y!, z!);
}

export function vec3_getAllocationFunction(): () => Vector3 {
    return Vec3Utils.getAllocationFunction();
}

export function vec3_setAllocationFunction(allocationFunction: () => Vector3): void {
    Vec3Utils.setAllocationFunction(allocationFunction);
}



export function vec4_create(): Vector4;
export function vec4_create(x: number, y: number, z: number, w: number): Vector4;
export function vec4_create(uniformValue: number): Vector4;
export function vec4_create(x?: number, y?: number, z?: number, w?: number): Vector4 {
    return Vec4Utils.create(x!, y!, z!, w!);
}

export function vec4_getAllocationFunction(): () => Vector4 {
    return Vec4Utils.getAllocationFunction();
}

export function vec4_setAllocationFunction(allocationFunction: () => Vector4): void {
    Vec4Utils.setAllocationFunction(allocationFunction);
}



export function quat_create(): Quaternion;
export function quat_create(x: number, y: number, z: number, w: number): Quaternion;
export function quat_create(uniformValue: number): Quaternion;
export function quat_create(x?: number, y?: number, z?: number, w?: number): Quaternion {
    return QuatUtils.create(x!, y!, z!, w!);
}

export function quat_getAllocationFunction(): () => Quaternion {
    return QuatUtils.getAllocationFunction();
}

export function quat_setAllocationFunction(allocationFunction: () => Quaternion): void {
    QuatUtils.setAllocationFunction(allocationFunction);
}



export function quat2_create(): Quaternion2;
export function quat2_create(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Quaternion2;
export function quat2_create(uniformValue: number): Quaternion2;
export function quat2_create(x1?: number, y1?: number, z1?: number, w1?: number, x2?: number, y2?: number, z2?: number, w2?: number): Quaternion2 {
    return Quat2Utils.create(x1!, y1!, z1!, w1!, x2!, y2!, z2!, w2!);
}

export function quat2_getAllocationFunction(): () => Quaternion2 {
    return Quat2Utils.getAllocationFunction();
}

export function quat2_setAllocationFunction(allocationFunction: () => Quaternion2): void {
    Quat2Utils.setAllocationFunction(allocationFunction);
}



export function mat3_create(): Matrix3;
export function mat3_create(
    m00: number, m01: number, m02: number,
    m10: number, m11: number, m12: number,
    m20: number, m21: number, m22: number): Matrix3;
export function mat3_create(uniformValue: number): Matrix3;
export function mat3_create(
    m00?: number, m01?: number, m02?: number,
    m10?: number, m11?: number, m12?: number,
    m20?: number, m21?: number, m22?: number): Matrix3 {
    return Mat3Utils.create(
        m00!, m01!, m02!,
        m10!, m11!, m12!,
        m20!, m21!, m22!
    );
}

export function mat3_getAllocationFunction(): () => Matrix3 {
    return Mat3Utils.getAllocationFunction();
}

export function mat3_setAllocationFunction(allocationFunction: () => Matrix3): void {
    Mat3Utils.setAllocationFunction(allocationFunction);
}



export function mat4_create(): Matrix4;
export function mat4_create(
    m00: number, m01: number, m02: number, m03: number,
    m10: number, m11: number, m12: number, m13: number,
    m20: number, m21: number, m22: number, m23: number,
    m30: number, m31: number, m32: number, m33: number): Matrix4;
export function mat4_create(uniformValue: number): Matrix4;
export function mat4_create(
    m00?: number, m01?: number, m02?: number, m03?: number,
    m10?: number, m11?: number, m12?: number, m13?: number,
    m20?: number, m21?: number, m22?: number, m23?: number,
    m30?: number, m31?: number, m32?: number, m33?: number): Matrix4 {
    return Mat4Utils.create(
        m00!, m01!, m02!, m03!,
        m10!, m11!, m12!, m13!,
        m20!, m21!, m22!, m23!,
        m30!, m31!, m32!, m33!
    );
}

export function mat4_getAllocationFunction(): () => Matrix4 {
    return Mat4Utils.getAllocationFunction();
}

export function mat4_setAllocationFunction(allocationFunction: () => Matrix4): void {
    Mat4Utils.setAllocationFunction(allocationFunction);
}
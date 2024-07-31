import { mat3 as gl_mat3, mat4 as gl_mat4, quat as gl_quat, quat2 as gl_quat2, vec2 as gl_vec2, vec3 as gl_vec3, vec4 as gl_vec4, glMatrix } from "gl-matrix";
import { Matrix3, Matrix4, Quaternion, Quaternion2, Vector, Vector2, Vector3, Vector4 } from "../../type_definitions/array_type_definitions.js";

export let _myVectorAllocationFunction: (length: number) => Vector = () => { return new glMatrix.ARRAY_TYPE(length); };

export function setVectorAllocationFunction(allocationFunction: (length: number) => Vector): void {
    _myVectorAllocationFunction = allocationFunction;
}

export function getVectorAllocationFunction(): (length: number) => Vector {
    return _myVectorAllocationFunction;
}



export let _myVector2AllocationFunction: () => Vector2 = gl_vec2.create;

export function setVector2AllocationFunction(allocationFunction: () => Vector2): void {
    _myVector2AllocationFunction = allocationFunction;
}

export function getVector2AllocationFunction(): () => Vector2 {
    return _myVector2AllocationFunction;
}



export let _myVector3AllocationFunction: () => Vector3 = gl_vec3.create;

export function setVector3AllocationFunction(allocationFunction: () => Vector3): void {
    _myVector3AllocationFunction = allocationFunction;
}

export function getVector3AllocationFunction(): () => Vector3 {
    return _myVector3AllocationFunction;
}



export let _myVector4AllocationFunction: () => Vector4 = gl_vec4.create;

export function setVector4AllocationFunction(allocationFunction: () => Vector4): void {
    _myVector4AllocationFunction = allocationFunction;
}

export function getVector4AllocationFunction(): () => Vector4 {
    return _myVector4AllocationFunction;
}



export let _myQuaternionAllocationFunction: () => Quaternion = gl_quat.create;

export function setQuaternionAllocationFunction(allocationFunction: () => Quaternion): void {
    _myQuaternionAllocationFunction = allocationFunction;
}

export function getQuaternionAllocationFunction(): () => Quaternion {
    return _myQuaternionAllocationFunction;
}



export let _myQuaternion2AllocationFunction: () => Quaternion2 = gl_quat2.create;

export function setQuaternion2AllocationFunction(allocationFunction: () => Quaternion2): void {
    _myQuaternion2AllocationFunction = allocationFunction;
}

export function getQuaternion2AllocationFunction(): () => Quaternion2 {
    return _myQuaternion2AllocationFunction;
}



export let _myMatrix3AllocationFunction: () => Matrix3 = gl_mat3.create;

export function setMatrix3AllocationFunction(allocationFunction: () => Matrix3): void {
    _myMatrix3AllocationFunction = allocationFunction;
}

export function getMatrix3AllocationFunction(): () => Matrix3 {
    return _myMatrix3AllocationFunction;
}



export let _myMatrix4AllocationFunction: () => Matrix4 = gl_mat4.create;

export function setMatrix4AllocationFunction(allocationFunction: () => Matrix4): void {
    _myMatrix4AllocationFunction = allocationFunction;
}

export function getMatrix4AllocationFunction(): () => Matrix4 {
    return _myMatrix4AllocationFunction;
}



export const VecAllocationUtils = {
    setVectorAllocationFunction,
    getVectorAllocationFunction,
    setVector2AllocationFunction,
    getVector2AllocationFunction,
    setVector3AllocationFunction,
    getVector3AllocationFunction,
    setVector4AllocationFunction,
    getVector4AllocationFunction,
    setQuaternionAllocationFunction,
    getQuaternionAllocationFunction,
    setQuaternion2AllocationFunction,
    getQuaternion2AllocationFunction,
    setMatrix3AllocationFunction,
    getMatrix3AllocationFunction,
    setMatrix4AllocationFunction,
    getMatrix4AllocationFunction
} as const;
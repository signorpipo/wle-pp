import { vec4 as gl_vec4, type vec4 as gl_vec4_type } from "gl-matrix";
import { Vector4 } from "../../type_definitions/array_type_definitions.js";
import { EasingFunction } from "../math_utils.js";
import { getVector4AllocationFunction, setVector4AllocationFunction } from "./vec_allocation_utils.js";

export function create(): Vector4;
export function create(x: number, y: number, z: number, w: number): Vector4;
export function create(uniformValue: number): Vector4;
export function create(x?: number, y?: number, z?: number, w?: number): Vector4 {
    const out = getAllocationFunction()();

    if (x != null) {
        Vec4Utils.set(out, x, y!, z!, w!);
    }

    return out;
}

export function getAllocationFunction(): () => Vector4 {
    return getVector4AllocationFunction();
}

/** Specify the function that will be used to allocate the vector when calling the {@link create} function */
export function setAllocationFunction(allocationFunction: () => Vector4): void {
    setVector4AllocationFunction(allocationFunction);
}

export function set<T extends Vector4>(vector: T, x: number, y: number, z: number, w: number): T;
export function set<T extends Vector4>(vector: T, uniformValue: number): T;
export function set<T extends Vector4>(vector: T, x: number, y?: number, z?: number, w?: number): T {
    if (y == null) {
        gl_vec4.set(vector as unknown as gl_vec4_type, x, x, x, x);
    } else {
        gl_vec4.set(vector as unknown as gl_vec4_type, x, y, z!, w!);
    }

    return vector;
}

export function copy<T extends Vector4>(from: Readonly<Vector4>, to: T): T {
    gl_vec4.copy(to as unknown as gl_vec4_type, from as unknown as gl_vec4_type);
    return to;
}

/** The overload where `T extends Vector4` does also get `array` as `Readonly<T>`, but is not marked as such due to 
    Typescript having issues with inferring the proper type of `T` when `Readonly` is used */
export function clone<T extends Vector4>(vector: Readonly<T>): T;
export function clone(vector: Readonly<number[]>): number[];
export function clone<T extends Vector4>(vector: T): T;
export function clone<T extends Vector4>(vector: Readonly<T>): T {
    return vector.slice(0) as T;
}

export function lerp<T extends Vector4>(from: Readonly<T>, to: Readonly<Vector4>, interpolationFactor: number): T;
export function lerp<T extends Vector4>(from: Readonly<Vector4>, to: Readonly<Vector4>, interpolationFactor: number, out: T): T;
export function lerp<T extends Vector4, U extends Vector4>(from: Readonly<T>, to: Readonly<Vector4>, interpolationFactor: number, out: T | U = Vec4Utils.clone(from)): T | U {
    if (interpolationFactor <= 0) {
        Vec4Utils.copy(from, out);
        return out;
    } else if (interpolationFactor >= 1) {
        Vec4Utils.copy(to, out);
        return out;
    }

    gl_vec4.lerp(out as unknown as gl_vec4_type, from as unknown as gl_vec4_type, to as unknown as gl_vec4_type, interpolationFactor);
    return out;
}

export function interpolate<T extends Vector4>(from: Readonly<T>, to: Readonly<Vector4>, interpolationFactor: number, easingFunction?: EasingFunction): T;
export function interpolate<T extends Vector4>(from: Readonly<Vector4>, to: Readonly<Vector4>, interpolationFactor: number, easingFunction: EasingFunction, out: T): T;
export function interpolate<T extends Vector4, U extends Vector4>(from: Readonly<T>, to: Readonly<Vector4>, interpolationFactor: number, easingFunction: EasingFunction = EasingFunction.linear, out: T | U = Vec4Utils.clone(from)): T | U {
    const lerpFactor = easingFunction(interpolationFactor);
    return Vec4Utils.lerp(from, to, lerpFactor, out);
}

export const Vec4Utils = {
    create,
    getAllocationFunction,
    setAllocationFunction,
    set,
    copy,
    clone,
    lerp,
    interpolate
} as const;
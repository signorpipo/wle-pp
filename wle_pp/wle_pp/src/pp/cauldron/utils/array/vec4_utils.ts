import { vec4 as gl_vec4, type vec4 as gl_vec4_type } from "gl-matrix";
import { Vector4 } from "../../type_definitions/array_type_definitions.js";

export function create(): Vector4;
export function create(x: number, y: number, z: number, w: number): Vector4;
export function create(uniformValue: number): Vector4;
export function create(x?: number, y?: number, z?: number, w?: number): Vector4 {
    const out = gl_vec4.create() as unknown as Vector4;

    if (x != null) {
        Vec4Utils.set(out, x, y!, z!, w!);
    }

    return out;
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

export const Vec4Utils = {
    create,
    set,
    copy,
    clone
} as const;
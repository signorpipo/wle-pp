import { vec2 as gl_vec2, type vec2 as gl_vec2_type } from "gl-matrix";
import { Vector2 } from "../../type_definitions/array_type_definitions.js";

export function create(): Vector2;
export function create(x: number, y: number): Vector2;
export function create(uniformValue: number): Vector2;
export function create(x?: number, y?: number): Vector2 {
    const out = gl_vec2.create() as unknown as Vector2;

    if (x != null) {
        set(out, x, y!);
    }

    return out;
}

export function set<T extends Vector2>(vector: T, x: number, y: number): T;
export function set<T extends Vector2>(vector: T, uniformValue: number): T;
export function set<T extends Vector2>(vector: T, x: number, y?: number): T {
    if (y == null) {
        gl_vec2.set(vector as unknown as gl_vec2_type, x, x);
    } else {
        gl_vec2.set(vector as unknown as gl_vec2_type, x, y);
    }

    return vector;
}

export function copy<T extends Vector2>(from: Readonly<Vector2>, to: T): T {
    gl_vec2.copy(to as unknown as gl_vec2_type, from as unknown as gl_vec2_type);
    return to;
}

/** The overload where `T extends Vector2` does also get `array` as `Readonly<T>`, but is not marked as such due to 
 *  Typescript having issues with inferring the proper type of `T` when `Readonly` is used */
export function clone<T extends Vector2>(vector: Readonly<T>): T;
export function clone(vector: Readonly<number[]>): number[];
export function clone<T extends Vector2>(vector: T): T;
export function clone<T extends Vector2>(vector: Readonly<T>): T {
    return vector.slice(0) as T;
}

export function length(vector: Readonly<Vector2>): number {
    return gl_vec2.length(vector as unknown as gl_vec2_type);
}

export function normalize<T extends Vector2>(vector: Readonly<T>): T;
export function normalize<T extends Vector2, S extends Vector2>(vector: Readonly<T>, out: S): S;
export function normalize<T extends Vector2, S extends Vector2>(vector: Readonly<T>, out: T | S = Vec2Utils.clone<T>(vector)): T | S {
    gl_vec2.normalize(out as unknown as gl_vec2_type, vector as unknown as gl_vec2_type);
    return out;
}

export function zero<T extends Vector2>(vector: T): T {
    gl_vec2.zero(vector as unknown as gl_vec2_type);
    return vector;
}

export function isZero(vector: Readonly<Vector2>, epsilon: number = 0): boolean {
    return Vec2Utils.length(vector) <= epsilon;
}

export const Vec2Utils = {
    create,
    set,
    copy,
    clone,
    length,
    normalize,
    zero,
    isZero
} as const;
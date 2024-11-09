import { vec2 as gl_vec2, type vec2 as gl_vec2_type } from "gl-matrix";
import { Vector2 } from "../../type_definitions/array_type_definitions.js";
import { EasingFunction } from "../math_utils.js";
import { getVector2AllocationFunction, setVector2AllocationFunction } from "./vec_allocation_utils.js";

export function create(): Vector2;
export function create(x: number, y: number): Vector2;
export function create(uniformValue: number): Vector2;
export function create(x?: number, y?: number): Vector2 {
    const out = getAllocationFunction()();

    if (x != null) {
        Vec2Utils.set(out, x, y!);
    }

    return out;
}

export function getAllocationFunction(): () => Vector2 {
    return getVector2AllocationFunction();
}

/** Specify the function that will be used to allocate the vector when calling the {@link create} function */
export function setAllocationFunction(allocationFunction: () => Vector2): void {
    setVector2AllocationFunction(allocationFunction);
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
    Typescript having issues with inferring the proper type of `T` when `Readonly` is used */
export function clone<T extends Vector2>(vector: Readonly<T>): T;
export function clone(vector: Readonly<number[]>): number[];
export function clone<T extends Vector2>(vector: T): T;
export function clone<T extends Vector2>(vector: Readonly<T>): T {
    return vector.slice(0) as T;
}

export function equals(first: Readonly<Vector2>, second: Readonly<Vector2>, epsilon: number = 0): boolean {
    let equals = first.length == second.length;

    if (equals) {
        equals &&= (Math.abs(first[0] - second[0]) <= epsilon);
        equals &&= (Math.abs(first[1] - second[1]) <= epsilon);
    }

    return equals;
}

export function length(vector: Readonly<Vector2>): number {
    return gl_vec2.length(vector as unknown as gl_vec2_type);
}

export function normalize<T extends Vector2>(vector: Readonly<T>): T;
export function normalize<T extends Vector2>(vector: Readonly<Vector2>, out: T): T;
export function normalize<T extends Vector2, U extends Vector2>(vector: Readonly<T>, out: T | U = Vec2Utils.clone(vector)): T | U {
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

export function lerp<T extends Vector2>(from: Readonly<T>, to: Readonly<Vector2>, interpolationFactor: number): T;
export function lerp<T extends Vector2>(from: Readonly<Vector2>, to: Readonly<Vector2>, interpolationFactor: number, out: T): T;
export function lerp<T extends Vector2, U extends Vector2>(from: Readonly<T>, to: Readonly<Vector2>, interpolationFactor: number, out: T | U = Vec2Utils.clone(from)): T | U {
    if (interpolationFactor <= 0) {
        Vec2Utils.copy(from, out);
        return out;
    } else if (interpolationFactor >= 1) {
        Vec2Utils.copy(to, out);
        return out;
    }

    gl_vec2.lerp(out as unknown as gl_vec2_type, from as unknown as gl_vec2_type, to as unknown as gl_vec2_type, interpolationFactor);
    return out;
}

export function interpolate<T extends Vector2>(from: Readonly<T>, to: Readonly<Vector2>, interpolationFactor: number, easingFunction?: EasingFunction): T;
export function interpolate<T extends Vector2>(from: Readonly<Vector2>, to: Readonly<Vector2>, interpolationFactor: number, easingFunction: EasingFunction, out: T): T;
export function interpolate<T extends Vector2, U extends Vector2>(from: Readonly<T>, to: Readonly<Vector2>, interpolationFactor: number, easingFunction: EasingFunction = EasingFunction.linear, out: T | U = Vec2Utils.clone(from)): T | U {
    const lerpFactor = easingFunction(interpolationFactor);
    return Vec2Utils.lerp(from, to, lerpFactor, out);
}

export const Vec2Utils = {
    create,
    getAllocationFunction,
    setAllocationFunction,
    set,
    copy,
    clone,
    equals,
    length,
    normalize,
    zero,
    isZero,
    lerp,
    interpolate
} as const;
import { vec2 as gl_vec2 } from "gl-matrix";

// glMatrix Bridge

export function create(x, y) {
    let out = gl_vec2.create();

    if (x !== undefined) {
        set(out, x, y);
    }

    return out;
}

export function set(vector, x, y) {
    if (y === undefined) {
        gl_vec2.set(vector, x, x);
    } else {
        gl_vec2.set(vector, x, y);
    }

    return vector;
}

export function length(vector) {
    return gl_vec2.length(vector);
}

export function normalize(vector, out = create()) {
    gl_vec2.normalize(out, vector);
    return out;
}

export function copy(from, to) {
    gl_vec2.copy(to, from);
    return to;
}

export function clone(vector, out = create()) {
    Vec2Utils.copy(vector, out);
    return out;
}

export function zero(vector) {
    gl_vec2.zero(vector);
    return vector;
}

// New Functions

export function isZero(vector, epsilon = 0) {
    return Vec2Utils.length(vector) <= epsilon;
}

export let Vec2Utils = {
    create,
    set,
    length,
    normalize,
    copy,
    clone,
    zero,
    isZero
};
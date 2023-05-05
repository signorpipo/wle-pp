import { vec4 as gl_vec4 } from "gl-matrix";

// glMatrix Bridge

export function create(x, y, z, w) {
    let out = gl_vec4.create();

    if (x !== undefined) {
        set(out, x, y, z, w);
    }

    return out;
}

export function set(vector, x, y, z, w) {
    if (y === undefined) {
        gl_vec4.set(vector, x, x, x, x);
    } else {
        gl_vec4.set(vector, x, y, z, w);
    }

    return vector;
}

export function copy(from, to) {
    gl_vec4.copy(to, from);
    return to;
}

export function clone(vector, out = create()) {
    Vec4Utils.copy(vector, out);
    return out;
}

export let Vec4Utils = {
    create,
    set,
    copy,
    clone
};
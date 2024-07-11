import { Vector4 } from "../type_definitions/array_type_definitions.js";
import { Vec4Utils } from "./array/vec4_utils.js";

export enum ColorModel {
    RGB,
    HSV
}

/** `rgb` is in the `[0, 1]` space, alpha is not changed  */
export function rgbToHSV<T extends Vector4>(rgb: Readonly<T>): T;
export function rgbToHSV<T extends Vector4>(rgb: Readonly<Vector4>, out: T): T;
export function rgbToHSV<T extends Vector4, U extends Vector4>(rgb: Readonly<T>, out: T | U = Vec4Utils.clone(rgb)): T | U {
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const d = max - min;

    let h = 0;
    const s = (max == 0 ? 0 : d / max);
    const v = max;

    switch (max) {
        case min:
            h = 0;
            break;
        case r:
            h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d;
            break;
        case g:
            h = (b - r) + d * 2; h /= 6 * d;
            break;
        case b:
            h = (r - g) + d * 4; h /= 6 * d;
            break;
    }

    out[0] = h;
    out[1] = s;
    out[2] = v;
    out[3] = rgb[3];

    return out;
}

/** alpha is not changed */
export function hsvToRGB<T extends Vector4>(hsv: Readonly<T>): T;
export function hsvToRGB<T extends Vector4>(hsv: Readonly<Vector4>, out: T): T;
export function hsvToRGB<T extends Vector4, U extends Vector4>(hsv: Readonly<T>, out: T | U = Vec4Utils.clone(hsv)): T | U {
    const h = hsv[0];
    const s = hsv[1];
    const v = hsv[2];

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r = 0;
    let g = 0;
    let b = 0;

    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }

    out[0] = r;
    out[1] = g;
    out[2] = b;
    out[3] = hsv[3];

    return out;
}

export function colorNormalizedToInt<T extends Vector4>(color: Readonly<T>): T;
export function colorNormalizedToInt<T extends Vector4>(color: Readonly<Vector4>, out: T): T;
export function colorNormalizedToInt<T extends Vector4, U extends Vector4>(color: Readonly<T>, out: T | U = Vec4Utils.clone(color)): T | U {
    for (let i = 0; i < out.length; i++) {
        out[i] = Math.round(color[i] * 255);
        out[i] = Math.pp_clamp(out[i], 0, 255);
    }

    return out;
}

export function colorIntToNormalized<T extends Vector4>(color: Readonly<T>): T;
export function colorIntToNormalized<T extends Vector4>(color: Readonly<Vector4>, out: T): T;
export function colorIntToNormalized<T extends Vector4, U extends Vector4>(color: Readonly<T>, out: T | U = Vec4Utils.clone(color)): T | U {
    for (let i = 0; i < out.length; i++) {
        out[i] = color[i] / 255;
        out[i] = Math.pp_clamp(out[i], 0, 1);
    }

    return out;
}

export const ColorUtils = {
    rgbToHSV,
    hsvToRGB,
    colorNormalizedToInt,
    colorIntToNormalized
} as const;
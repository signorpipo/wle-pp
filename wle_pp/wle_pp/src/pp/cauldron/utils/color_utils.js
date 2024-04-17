// RGB is in [0,1], alpha is not changed
export function rgbToHSV(rgb) {
    let hsv = rgb.pp_clone();

    let r = rgb[0];
    let g = rgb[1];
    let b = rgb[2];

    let max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max == 0 ? 0 : d / max),
        v = max;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    hsv[0] = h;
    hsv[1] = s;
    hsv[2] = v;

    return hsv;
}

// Alpha is not changed
export function hsvToRGB(hsv) {
    let rgb = hsv.pp_clone();

    let h = hsv[0];
    let s = hsv[1];
    let v = hsv[2];

    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    rgb[0] = r;
    rgb[1] = g;
    rgb[2] = b;

    return rgb;
}

export function rgbCodeToHuman(rgb) {
    return ColorUtils.color1To255(rgb);
}

export function rgbHumanToCode(rgb) {
    return ColorUtils.color255To1(rgb);
}

export function hsvCodeToHuman(hsv) {
    return ColorUtils.color1To255(hsv);
}

export function hsvHumanToCode(hsv) {
    return ColorUtils.color255To1(hsv);
}

export function color255To1(color) {
    let result = color.pp_clone();

    for (let i = 0; i < result.length; i++) {
        result[i] /= 255;
        result[i] = Math.pp_clamp(result[i], 0, 1);
    }

    return result;
}

export function color1To255(color) {
    let result = color.pp_clone();

    for (let i = 0; i < result.length; i++) {
        result[i] = Math.round(result[i] * 255);
        result[i] = Math.pp_clamp(result[i], 0, 255);
    }

    return result;
}

export let ColorUtils = {
    rgbToHSV,
    hsvToRGB,
    rgbCodeToHuman,
    rgbHumanToCode,
    hsvCodeToHuman,
    hsvHumanToCode,
    color255To1,
    color1To255
};
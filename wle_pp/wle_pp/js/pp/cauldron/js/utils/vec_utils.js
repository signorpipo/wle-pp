import { ArrayUtils } from "./array_utils";
import { MathUtils } from "./math_utils";

export function toString(vector, decimalPlaces = null) {
    let message = _buildConsoleMessage(vector, decimalPlaces);
    return message;
}

export function log(vector, decimalPlaces = 4) {
    let message = _buildConsoleMessage(vector, decimalPlaces);
    console.log(message);
}

export function error(vector, decimalPlaces = 4) {
    let message = _buildConsoleMessage(vector, decimalPlaces);
    console.error(message);
}

export function warn(vector, decimalPlaces = 4) {
    let message = _buildConsoleMessage(vector, decimalPlaces);
    console.warn(message);
}

export function scale(vector, value, out = null) {
    out = _prepareOut(vector, out);

    for (let i = 0; i < out.length; i++) {
        out[i] = out[i] * value;
    }

    return out;
}

export function round(vector, out = null) {
    out = _prepareOut(vector, out);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.round(out[i]);
    }

    return out;
}

export function floor(vector, out = null) {
    out = _prepareOut(vector, out);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.floor(out[i]);
    }

    return out;
}

export function ceil(vector, out = null) {
    out = _prepareOut(vector, out);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.ceil(out[i]);
    }

    return out;
}

export function clamp(vector, start, end, out = null) {
    out = _prepareOut(vector, out);

    let fixedStart = (start != null) ? start : -Number.MAX_VALUE;
    let fixedEnd = (end != null) ? end : Number.MAX_VALUE;
    let min = Math.min(fixedStart, fixedEnd);
    let max = Math.max(fixedStart, fixedEnd);

    for (let i = 0; i < out.length; i++) {
        out[i] = MathUtils.clamp(out[i], min, max);
    }

    return out;
}

export function equals(vector, other, epsilon = 0) {
    let equals = vector.length == other.length;

    for (let i = 0; i < vector.length && equals; i++) {
        equals = equals && (Math.abs(vector[i] - other[i]) <= epsilon);
    }

    return equals;
}

export let VecUtils = {
    toString,
    log,
    error,
    warn,
    scale,
    round,
    floor,
    ceil,
    clamp,
    equals
};



function _buildConsoleMessage(vector, decimalPlaces) {
    let message = "[";

    for (let i = 0; i < vector.length; i++) {
        if (i != 0) {
            message = message.concat(", ");
        }

        if (decimalPlaces != null) {
            message = message.concat(vector[i].toFixed(decimalPlaces));
        } else {
            message = message.concat(vector[i].toString());
        }
    }

    message = message.concat("]");
    return message;
}

function _prepareOut(vector, out) {
    if (out == null) {
        out = ArrayUtils.clone(vector);
    } else if (out != vector) {
        ArrayUtils.copy(vector, out);
    }

    return out;
}
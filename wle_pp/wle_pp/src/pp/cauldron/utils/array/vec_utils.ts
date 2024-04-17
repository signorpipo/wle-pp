import { Vector } from "../../type_definitions/array_type_definitions.js";
import { MathUtils } from "../math_utils.js";

/** The overload where `T extends Vector` does also get `array` as `Readonly<T>`, but is not marked as such due to 
 *  Typescript having issues with inferring the proper type of `T` when `Readonly` is used */
export function clone<T extends Vector>(vector: Readonly<T>): T;
export function clone(vector: Readonly<number[]>): number[];
export function clone<T extends Vector>(vector: T): T;
export function clone<T extends Vector>(vector: Readonly<T>): T {
    return vector.slice(0) as T;
}

export function equals(vector: Readonly<Vector>, other: Readonly<Vector>, epsilon: number = 0): boolean {
    let equals = vector.length == other.length;

    for (let i = 0; i < vector.length && equals; i++) {
        equals = equals && (Math.abs(vector[i] - other[i]) <= epsilon);
    }

    return equals;
}

export function zero<T extends Vector>(vector: T): T {
    for (let i = 0; i < vector.length; i++) {
        vector[i] = 0;
    }

    return vector;
}

export function isZero(vector: Readonly<Vector>, epsilon = 0): boolean {
    let zero = true;

    for (let i = 0; i < vector.length && zero; i++) {
        zero = zero && (Math.abs(vector[i]) <= epsilon);
    }

    return zero;
}

export function scale<T extends Vector>(vector: Readonly<T>, value: number): T;
export function scale<T extends Vector, S extends Vector>(vector: Readonly<T>, value: number, out: S): S;
export function scale<T extends Vector, S extends Vector>(vector: Readonly<T>, value: number, out: T | S = VecUtils.clone<T>(vector)): T | S {
    for (let i = 0; i < vector.length; i++) {
        out[i] = vector[i] * value;
    }

    return out;
}

export function round<T extends Vector>(vector: Readonly<T>): T;
export function round<T extends Vector, S extends Vector>(vector: Readonly<T>, out: S): S;
export function round<T extends Vector, S extends Vector>(vector: Readonly<T>, out: T | S = VecUtils.clone<T>(vector)): T | S {
    for (let i = 0; i < vector.length; i++) {
        out[i] = Math.round(vector[i]);
    }

    return out;
}

export function floor<T extends Vector>(vector: Readonly<T>): T;
export function floor<T extends Vector, S extends Vector>(vector: Readonly<T>, out: S): S;
export function floor<T extends Vector, S extends Vector>(vector: Readonly<T>, out: T | S = VecUtils.clone<T>(vector)): T | S {
    for (let i = 0; i < vector.length; i++) {
        out[i] = Math.floor(vector[i]);
    }

    return out;
}

export function ceil<T extends Vector>(vector: Readonly<T>): T;
export function ceil<T extends Vector, S extends Vector>(vector: Readonly<T>, out: S): S;
export function ceil<T extends Vector, S extends Vector>(vector: Readonly<T>, out: T | S = VecUtils.clone<T>(vector)): T | S {
    for (let i = 0; i < vector.length; i++) {
        out[i] = Math.ceil(vector[i]);
    }

    return out;
}

export function clamp<T extends Vector>(vector: Readonly<T>, start: number, end: number): T;
export function clamp<T extends Vector, S extends Vector>(vector: Readonly<T>, start: number, end: number, out: S): S;
export function clamp<T extends Vector, S extends Vector>(vector: Readonly<T>, start: number, end: number, out: T | S = VecUtils.clone<T>(vector)): T | S {
    const fixedStart = (start != null) ? start : -Number.MAX_VALUE;
    const fixedEnd = (end != null) ? end : Number.MAX_VALUE;
    const min = Math.min(fixedStart, fixedEnd);
    const max = Math.max(fixedStart, fixedEnd);

    for (let i = 0; i < vector.length; i++) {
        out[i] = MathUtils.clamp(vector[i], min, max);
    }

    return out;
}

export function toString(vector: Readonly<Vector>, decimalPlaces: number = 4): string {
    const message = _buildConsoleMessage(vector, decimalPlaces);
    return message;
}

export function log(vector: Readonly<Vector>, decimalPlaces: number = 4): Vector {
    const message = _buildConsoleMessage(vector, decimalPlaces);
    console.log(message);

    return vector;
}

export function error(vector: Readonly<Vector>, decimalPlaces: number = 4): Vector {
    const message = _buildConsoleMessage(vector, decimalPlaces);
    console.error(message);

    return vector;
}

export function warn(vector: Readonly<Vector>, decimalPlaces: number = 4): Vector {
    const message = _buildConsoleMessage(vector, decimalPlaces);
    console.warn(message);

    return vector;
}

export const VecUtils = {
    clone,
    equals,
    zero,
    isZero,
    scale,
    round,
    floor,
    ceil,
    clamp,
    toString,
    log,
    error,
    warn
} as const;



function _buildConsoleMessage(vector: Readonly<Vector>, decimalPlaces?: number): string {
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
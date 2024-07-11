import { glMatrix } from "gl-matrix";
import { Vector } from "../../type_definitions/array_type_definitions.js";
import { EasingFunction, MathUtils } from "../math_utils.js";

export function create(length: number): Vector;
export function create(firstValue: number, ...remainingValues: number[]): Vector;
export function create(firstValue: number, ...remainingValues: number[]): Vector {
    let out: Vector | null = null;

    if (remainingValues.length == 0) {
        const length = firstValue;
        out = new glMatrix.ARRAY_TYPE(length);
        for (let i = 0; i < length; i++) {
            out[i] = 0;
        }
    } else {
        out = new glMatrix.ARRAY_TYPE(remainingValues.length + 1);
        out[0] = firstValue;
        for (let i = 0; i < remainingValues.length; i++) {
            out[i + 1] = remainingValues[i];
        }
    }

    return out;
}

export function set<T extends Vector>(vector: T, uniformValue: number): T;
export function set<T extends Vector>(vector: T, firstValue: number, ...remainingValues: number[]): T;
export function set<T extends Vector>(vector: T, firstValue: number, ...remainingValues: number[]): T {
    if (remainingValues.length == 0) {
        for (let i = 0; i < vector.length; i++) {
            vector[i] = firstValue;
        }
    } else {
        vector[0] = firstValue;
        for (let i = 0; i < remainingValues.length && i < vector.length - 1; i++) {
            vector[i + 1] = remainingValues[i];
        }
    }

    return vector;
}

export function copy<T extends Vector>(from: Readonly<Vector>, to: T): T {
    const minLength = Math.min(from.length, to.length);
    for (let i = 0; i < minLength; i++) {
        to[i] = from[i];
    }
    return to;
}

/** The overload where `T extends Vector` does also get `array` as `Readonly<T>`, but is not marked as such due to 
    Typescript having issues with inferring the proper type of `T` when `Readonly` is used */
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

export function isZero(vector: Readonly<Vector>, epsilon: number = 0): boolean {
    let zero = true;

    for (let i = 0; i < vector.length && zero; i++) {
        zero = zero && (Math.abs(vector[i]) <= epsilon);
    }

    return zero;
}

export function scale<T extends Vector>(vector: Readonly<T>, value: number): T;
export function scale<T extends Vector>(vector: Readonly<Vector>, value: number, out: T): T;
export function scale<T extends Vector, U extends Vector>(vector: Readonly<T>, value: number, out: T | U = VecUtils.clone(vector)): T | U {
    for (let i = 0; i < vector.length; i++) {
        out[i] = vector[i] * value;
    }

    return out;
}

export function round<T extends Vector>(vector: Readonly<T>): T;
export function round<T extends Vector>(vector: Readonly<Vector>, out: T): T;
export function round<T extends Vector, U extends Vector>(vector: Readonly<T>, out: T | U = VecUtils.clone(vector)): T | U {
    for (let i = 0; i < vector.length; i++) {
        out[i] = Math.round(vector[i]);
    }

    return out;
}

export function floor<T extends Vector>(vector: Readonly<T>): T;
export function floor<T extends Vector>(vector: Readonly<Vector>, out: T): T;
export function floor<T extends Vector, U extends Vector>(vector: Readonly<T>, out: T | U = VecUtils.clone(vector)): T | U {
    for (let i = 0; i < vector.length; i++) {
        out[i] = Math.floor(vector[i]);
    }

    return out;
}

export function ceil<T extends Vector>(vector: Readonly<T>): T;
export function ceil<T extends Vector>(vector: Readonly<Vector>, out: T): T;
export function ceil<T extends Vector, U extends Vector>(vector: Readonly<T>, out: T | U = VecUtils.clone(vector)): T | U {
    for (let i = 0; i < vector.length; i++) {
        out[i] = Math.ceil(vector[i]);
    }

    return out;
}

export function clamp<T extends Vector>(vector: Readonly<T>, start?: number, end?: number): T;
export function clamp<T extends Vector>(vector: Readonly<Vector>, start: number, end: number, out: T): T;
export function clamp<T extends Vector, U extends Vector>(vector: Readonly<T>, start: number = -Number.MAX_VALUE, end: number = Number.MAX_VALUE, out: T | U = VecUtils.clone(vector)): T | U {
    const min = Math.min(start, end);
    const max = Math.max(start, end);

    for (let i = 0; i < vector.length; i++) {
        out[i] = MathUtils.clamp(vector[i], min, max);
    }

    return out;
}

export function lerp<T extends Vector>(from: Readonly<T>, to: Readonly<Vector>, interpolationFactor: number): T;
export function lerp<T extends Vector>(from: Readonly<Vector>, to: Readonly<Vector>, interpolationFactor: number, out: T): T;
export function lerp<T extends Vector, U extends Vector>(from: Readonly<T>, to: Readonly<Vector>, interpolationFactor: number, out: T | U = VecUtils.clone(from)): T | U {
    if (interpolationFactor <= 0) {
        VecUtils.copy(from, out);
        return out;
    } else if (interpolationFactor >= 1) {
        VecUtils.copy(to, out);
        return out;
    }

    const minLength = Math.min(from.length, to.length, out.length);
    for (let i = 0; i < minLength; i++) {
        const fromCurrentValue = from[i];
        const toCurrentValue = to[i];

        out[i] = fromCurrentValue + interpolationFactor * (toCurrentValue - fromCurrentValue);
    }

    return out;
}

export function interpolate<T extends Vector>(from: Readonly<T>, to: Readonly<Vector>, interpolationFactor: number, easingFunction?: EasingFunction): T;
export function interpolate<T extends Vector>(from: Readonly<Vector>, to: Readonly<Vector>, interpolationFactor: number, easingFunction: EasingFunction, out: T): T;
export function interpolate<T extends Vector, U extends Vector>(from: Readonly<T>, to: Readonly<Vector>, interpolationFactor: number, easingFunction: EasingFunction = EasingFunction.linear, out: T | U = VecUtils.clone(from)): T | U {
    const lerpFactor = easingFunction(interpolationFactor);
    return VecUtils.lerp(from, to, lerpFactor, out);
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
    create,
    set,
    copy,
    clone,
    equals,
    zero,
    isZero,
    scale,
    round,
    floor,
    ceil,
    clamp,
    lerp,
    interpolate,
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
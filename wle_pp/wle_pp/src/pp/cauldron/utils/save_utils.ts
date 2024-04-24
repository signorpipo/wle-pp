import { Vector } from "../type_definitions/array_type_definitions.js";

export function save(id: string, value: string): void {
    if (value != null) {
        localStorage.setItem(id, value);
    }
}

export function has(id: string): boolean {
    return SaveUtils.loadString(id) != null;
}

export function remove(id: string): void {
    return localStorage.removeItem(id);
}

export function clear(): void {
    return localStorage.clear();
}

export function load(id: string, defaultValue: string | null): string;
export function load(id: string): string | null;
export function load(id: string, defaultValue: string | null = null): string | null {
    return SaveUtils.loadString(id, defaultValue!);
}

export function loadString(id: string, defaultValue: string): string;
export function loadString(id: string): string | null;
export function loadString(id: string, defaultValue: string | null = null): string | null {
    const item = localStorage.getItem(id);

    if (item != null) {
        return item;
    }

    return defaultValue;
}

export function loadNumber(id: string, defaultValue: number): number;
export function loadNumber(id: string): number | null;
export function loadNumber(id: string, defaultValue: number | null = null): number | null {
    const item = SaveUtils.loadString(id);

    if (item != null && item.trim() != "" && (item == "NaN" || !isNaN(Number(item)))) {
        return Number(item);
    }

    return defaultValue;
}

export function loadBool(id: string, defaultValue: boolean): boolean;
export function loadBool(id: string): boolean | null;
export function loadBool(id: string, defaultValue: boolean | null = null): boolean | null {
    const item = SaveUtils.loadString(id);

    if (item == "true") {
        return true;
    } else if (item == "false") {
        return false;
    }

    return defaultValue;
}

export function loadObject(id: string, defaultValue: Readonly<object>): object;
export function loadObject(id: string): object | null;
export function loadObject(id: string, defaultValue: Readonly<object> | null = null): object | null {
    const item = SaveUtils.loadString(id);

    if (item != null) {
        try {
            const parsedObject = JSON.parse(item);
            if (parsedObject.constructor == Object) {
                return parsedObject;
            }
        } catch (error) {
            // Do nothing
        }
    }

    return defaultValue;
}

export function loadArray<T>(id: string, defaultValue: Readonly<T[]>): T[];
export function loadArray<T>(id: string): T[] | null;
export function loadArray<T>(id: string, defaultValue: Readonly<T[]> | null = null): T[] | null {
    const item = SaveUtils.loadString(id);

    if (item != null) {
        try {
            const parsedArray = JSON.parse(item);
            if (Array.isArray(parsedArray)) {
                return parsedArray;
            }
        } catch (error) {
            // Do nothing
        }
    }

    return defaultValue as T[] | null;
}

export function loadVector(id: string, defaultValue: Readonly<Vector>): Vector;
export function loadVector(id: string): Vector | null;
export function loadVector(id: string, defaultValue: Readonly<Vector> | null = null): Vector | null {
    const item = SaveUtils.loadString(id);

    if (item != null) {
        try {
            const parsedVector = JSON.parse(item);
            if (Array.isArray(parsedVector)) {
                let areAllNumbers = true;
                for (const value of parsedVector) {
                    if (typeof value != "number") {
                        areAllNumbers = false;
                        break;
                    }
                }

                if (areAllNumbers) {
                    return parsedVector;
                }
            }
        } catch (error) {
            // Do nothing
        }
    }

    return defaultValue as Vector | null;
}

export const SaveUtils = {
    save,
    has,
    remove,
    clear,
    load,
    loadString,
    loadNumber,
    loadBool,
    loadObject,
    loadArray,
    loadVector
} as const;
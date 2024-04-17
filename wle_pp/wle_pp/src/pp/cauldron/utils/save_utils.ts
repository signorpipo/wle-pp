export function save(id: string, value: string): void {
    if (value != null) {
        localStorage.setItem(id, value);
    }
}

export function has(id: string): boolean {
    return SaveUtils.loadString(id, null) != null;
}

export function remove(id: string): void {
    return localStorage.removeItem(id);
}

export function clear(): void {
    return localStorage.clear();
}

export function load(id: string, defaultValue: string | null = null): string | null {
    return SaveUtils.loadString(id, defaultValue);
}

export function loadString(id: string, defaultValue: string | null = null): string | null {
    const item = localStorage.getItem(id);

    if (item != null) {
        return item;
    }

    return defaultValue;
}

export function loadNumber(id: string, defaultValue: number | null = null): number | null {
    const item = SaveUtils.loadString(id);

    if (item != null) {
        return Number(item);
    }

    return defaultValue;
}

export function loadBool(id: string, defaultValue: boolean | null = null): boolean | null {
    const item = SaveUtils.loadString(id);

    if (item == "true") {
        return true;
    } else if (item == "false") {
        return false;
    }

    return defaultValue;
}

export function loadObject(id: string, defaultValue: Readonly<object> | null = null): object | null {
    const item = SaveUtils.loadString(id);

    if (item != null) {
        try {
            const parsedValue = JSON.parse(item);
            if (parsedValue.constructor == Object) {
                return parsedValue;
            }
        } catch (error) {
            // Do nothing
        }
    }

    return defaultValue;
}

export function loadArray<T>(id: string, defaultValue: Readonly<T[]> | null = null): T[] | null {
    const item = SaveUtils.loadString(id);

    if (item != null) {
        try {
            const parsedValue = JSON.parse(item);
            if (Array.isArray(parsedValue)) {
                return parsedValue;
            }
        } catch (error) {
            // Do nothing
        }
    }

    return defaultValue as T[] | null;
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
    loadArray
} as const;
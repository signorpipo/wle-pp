import { ArrayLike, DynamicArrayLike } from "../../type_definitions/array_type_definitions.js";

export function copy<ArrayType extends ArrayLike<T>, T>(from: Readonly<ArrayLike<T>>, to: ArrayType, copyCallback?: (fromElement: T, toElement: T) => T): ArrayType {
    const _to = to as (ArrayType & { pop: () => T | undefined });
    if (_to.pop != null) {
        while (to.length > from.length) {
            _to.pop();
        }
    }

    for (let i = 0; i < from.length; i++) {
        if (copyCallback == null) {
            to[i] = from[i];
        } else {
            to[i] = copyCallback(from[i], to[i]);
        }
    }

    return to;
}

/** The overload where `ArrayType extends ArrayLike<number>` does also get `array` as `Readonly<ArrayType>`, but is not marked as such due to 
    Typescript having issues with inferring the proper type of `ArrayType` when `Readonly` */
export function clone<ArrayType extends ArrayLike<T>, T>(array: Readonly<ArrayType>, cloneCallback?: (elementToClone: T) => T): ArrayType;
export function clone<T>(array: Readonly<T[]>, cloneCallback?: (elementToClone: T) => T): T[];
export function clone<ArrayType extends ArrayLike<number>>(array: ArrayType, cloneCallback?: (elementToClone: number) => number): ArrayType;
export function clone<ArrayType extends ArrayLike<T>, T>(array: Readonly<ArrayType>, cloneCallback?: (elementToClone: T) => T): ArrayType {
    const clonedArray = array.slice(0) as ArrayType;

    if (cloneCallback != null) {
        for (let i = 0; i < array.length; i++) {
            clonedArray[i] = cloneCallback(array[i]);
        }
    }

    return clonedArray;
}

export function equals<T>(array: Readonly<ArrayLike<T>>, other: Readonly<ArrayLike<T>>, elementsEqualCallback?: (arrayElement: T, otherElement: T) => boolean): boolean {
    let equals = true;

    if (other != null && array.length == other.length) {
        for (let i = 0; i < array.length; i++) {
            if ((elementsEqualCallback != null && !elementsEqualCallback(array[i], other[i])) ||
                (elementsEqualCallback == null && array[i] != other[i])) {
                equals = false;
                break;
            }
        }
    } else {
        equals = false;
    }

    return equals;
}

export function first<T>(array: Readonly<ArrayLike<T>>): T | undefined {
    return array.length > 0 ? array[0] : undefined;
}

export function last<T>(array: Readonly<ArrayLike<T>>): T | undefined {
    return array.length > 0 ? array[array.length - 1] : undefined;
}

export function has<T>(array: Readonly<ArrayLike<T>>, callback: (elementToCheck: T, elementIndex: number) => boolean): boolean {
    return ArrayUtils.find(array, callback) != undefined;
}

export function hasEqual<T>(array: Readonly<ArrayLike<T>>, elementToFind: T, elementsEqualCallback?: (elementToCheck: T, elementToFind: T) => boolean): boolean {
    return ArrayUtils.findEqual(array, elementToFind, elementsEqualCallback) != undefined;
}

export function find<T>(array: Readonly<ArrayLike<T>>, callback: (elementToCheck: T, elementIndex: number) => boolean): T | undefined {
    let elementFound = undefined;

    const index = ArrayUtils.findIndex(array, callback);
    if (index >= 0) {
        elementFound = array[index];
    }

    return elementFound;
}

export function findIndex<T>(array: Readonly<ArrayLike<T>>, callback: (elementToCheck: T, elementIndex: number) => boolean): number {
    return array.findIndex(callback);
}

export function findAll<T>(array: Readonly<ArrayLike<T>>, callback: (elementToCheck: T, elementIndex: number) => boolean): T[] {
    const elementsFound = [];

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (callback(element, i)) {
            elementsFound.push(element);
        }
    }

    return elementsFound;
}

export function findAllIndexes<T>(array: Readonly<ArrayLike<T>>, callback: (elementToCheck: T, elementIndex: number) => boolean): number[] {
    const indexes = [];

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (callback(element, i)) {
            indexes.push(i);
        }
    }

    return indexes;
}

export function findEqual<T>(array: Readonly<ArrayLike<T>>, elementToFind: T, elementsEqualCallback?: (elementToCheck: T, elementToFind: T) => boolean): T | undefined {
    if (elementsEqualCallback == null) {
        const index = ArrayUtils.findIndexEqual(array, elementToFind);
        return index < 0 ? undefined : array[index];
    }

    let elementFound = undefined;
    for (let i = 0; i < array.length; i++) {
        const currentElement = array[i];
        if (elementsEqualCallback(currentElement, elementToFind)) {
            elementFound = currentElement;
            break;
        }
    }

    return elementFound;
}

export function findAllEqual<T>(array: Readonly<ArrayLike<T>>, elementToFind: T, elementsEqualCallback?: (elementToCheck: T, elementToFind: T) => boolean): T[] {
    if (elementsEqualCallback == null) {
        return _findAllEqualOptimized(array, elementToFind);
    }

    const elementsFound = [];

    for (let i = 0; i < array.length; i++) {
        const currentElement = array[i];
        if (elementsEqualCallback(currentElement, elementToFind)) {
            elementsFound.push(currentElement);
        }
    }

    return elementsFound;
}

export function findIndexEqual<T>(array: Readonly<ArrayLike<T>>, elementToFind: T, elementsEqualCallback?: (elementToCheck: T, elementToFind: T) => boolean): number {
    if (elementsEqualCallback == null) {
        return array.indexOf(elementToFind);
    }

    let indexFound = -1;
    for (let i = 0; i < array.length; i++) {
        const currentElement = array[i];
        if (elementsEqualCallback(currentElement, elementToFind)) {
            indexFound = i;
            break;
        }
    }

    return indexFound;
}

export function findAllIndexesEqual<T>(array: Readonly<ArrayLike<T>>, elementToFind: T, elementsEqualCallback?: (elementToCheck: T, elementToFind: T) => boolean): number[] {
    if (elementsEqualCallback == null) {
        return _findAllIndexesEqualOptimized(array, elementToFind);
    }

    const indexesFound = [];
    for (let i = 0; i < array.length; i++) {
        const currentElement = array[i];
        if (elementsEqualCallback(currentElement, elementToFind)) {
            indexesFound.push(i);
        }
    }
    return indexesFound;
}

export function remove<T>(array: DynamicArrayLike<T>, callback: (elementToCheck: T, elementIndex: number) => boolean): T | undefined {
    let elementRemoved = undefined;

    const index = array.findIndex(callback);
    if (index >= 0) {
        elementRemoved = ArrayUtils.removeIndex(array, index);
    }

    return elementRemoved;
}

export function removeIndex<T>(array: DynamicArrayLike<T>, index: number): T | undefined {
    let elementRemoved = undefined;

    if (index >= 0 && index < array.length) {
        const arrayRemoved = array.splice(index, 1);
        if (arrayRemoved.length == 1) {
            elementRemoved = arrayRemoved[0];
        }
    }

    return elementRemoved;
}

export function removeAll<T>(array: DynamicArrayLike<T>, callback: (elementToCheck: T, elementIndex: number) => boolean): T[] {
    const elementsRemoved = [];

    let currentElement = undefined;
    do {
        currentElement = ArrayUtils.remove(array, callback);
        if (currentElement !== undefined) {
            elementsRemoved.push(currentElement);
        }
    } while (currentElement !== undefined);

    return elementsRemoved;
}

export function removeAllIndexes<T>(array: DynamicArrayLike<T>, indexes: ArrayLike<number>): T[] {
    const elementsRemoved = [];

    for (const index of indexes) {
        const elementRemoved = ArrayUtils.removeIndex(array, index);
        if (elementRemoved !== undefined) {
            elementsRemoved.push(elementRemoved);
        }
    }

    return elementsRemoved;
}

export function removeEqual<T>(array: DynamicArrayLike<T>, elementToRemove: T, elementsEqualCallback?: (elementToCheck: T, elementToRemove: T) => boolean): T | undefined {
    return ArrayUtils.removeIndex(array, ArrayUtils.findIndexEqual(array, elementToRemove, elementsEqualCallback));
}

export function removeAllEqual<T>(array: DynamicArrayLike<T>, elementToRemove: T, elementsEqualCallback?: (elementToCheck: T, elementToRemove: T) => boolean): T[] {
    return ArrayUtils.removeAllIndexes(array, ArrayUtils.findAllIndexesEqual(array, elementToRemove, elementsEqualCallback));
}

export function clear<ArrayType extends DynamicArrayLike<T>, T>(array: ArrayType): ArrayType {
    array.length = 0;

    return array;
}

export function pushUnique<T>(array: DynamicArrayLike<T>, elementToAdd: T, elementsEqualCallback?: (elementToCheck: T, elementToAdd: T) => boolean): number {
    let length = array.length;

    const hasElement = ArrayUtils.hasEqual(array, elementToAdd, elementsEqualCallback);

    if (!hasElement) {
        length = array.push(elementToAdd);
    }

    return length;
}

export function unshiftUnique<T>(array: DynamicArrayLike<T>, elementToAdd: T, elementsEqualCallback?: (elementToCheck: T, elementToAdd: T) => boolean): number {
    let length = array.length;

    const hasElement = ArrayUtils.hasEqual(array, elementToAdd, elementsEqualCallback);

    if (!hasElement) {
        length = array.unshift(elementToAdd);
    }

    return length;
}

export const ArrayUtils = {
    copy,
    clone,
    equals,
    first,
    last,
    has,
    hasEqual,
    find,
    findIndex,
    findAll,
    findAllIndexes,
    findEqual,
    findAllEqual,
    findIndexEqual,
    findAllIndexesEqual,
    remove,
    removeIndex,
    removeAll,
    removeAllIndexes,
    removeEqual,
    removeAllEqual,
    clear,
    pushUnique,
    unshiftUnique
} as const;



function _findAllEqualOptimized<T>(array: Readonly<ArrayLike<T>>, elementToFind: T): T[] {
    // Adapted from: https:// stackoverflow.com/a/20798567

    const elementsFound = [];

    let index = -1;
    while ((index = array.indexOf(elementToFind, index + 1)) >= 0) {
        elementsFound.push(array[index]);
    }

    return elementsFound;
}

function _findAllIndexesEqualOptimized<T>(array: Readonly<ArrayLike<T>>, elementToFind: T): number[] {
    // Adapted from: https:// stackoverflow.com/a/20798567

    const elementsFound = [];

    let index = -1;
    while ((index = array.indexOf(elementToFind, index + 1)) >= 0) {
        elementsFound.push(index);
    }

    return elementsFound;
}
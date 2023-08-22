export function first(array) {
    return array.length > 0 ? array[0] : undefined;
}

export function last(array) {
    return array.length > 0 ? array[array.length - 1] : undefined;
}

export function has(array, callback) {
    return ArrayUtils.find(array, callback) != undefined;
}

export function hasEqual(array, elementToFind, elementsEqualCallback = null) {
    return ArrayUtils.findEqual(array, elementToFind, elementsEqualCallback) != undefined;
}

export function find(array, callback) {
    let elementFound = undefined;

    let index = array.findIndex(callback);
    if (index >= 0) {
        elementFound = array[index];
    }

    return elementFound;
}

export function findIndex(array, callback) {
    return array.findIndex(callback);
}

export function findAll(array, callback) {
    let elementsFound = array.filter(callback);

    return elementsFound;
}

export function findAllIndexes(array, callback) {
    let indexes = [];
    for (let i = 0; i < array.length; i++) {
        let element = array[i];
        if (callback(element)) {
            indexes.push(i);
        }
    }
    return indexes;
}

export function findEqual(array, elementToFind, elementsEqualCallback = null) {
    if (elementsEqualCallback == null) {
        let index = ArrayUtils.findIndexEqual(array, elementToFind);
        return index < 0 ? undefined : array[index];
    }

    let elementFound = undefined
    for (let i = 0; i < array.length; i++) {
        let currentElement = array[i];
        if (elementsEqualCallback(currentElement, elementToFind)) {
            elementFound = currentElement;
            break;
        }
    }
    return elementFound;
}

export function findAllEqual(array, elementToFind, elementsEqualCallback = null) {
    if (elementsEqualCallback == null) {
        return _findAllEqualOptimized(array, elementToFind, false);
    }

    let elementsFound = [];
    for (let i = 0; i < array.length; i++) {
        let currentElement = array[i];
        if (elementsEqualCallback(currentElement, elementToFind)) {
            elementsFound.push(currentElement);
        }
    }
    return elementsFound;
}

export function findIndexEqual(array, elementToFind, elementsEqualCallback = null) {
    if (elementsEqualCallback == null) {
        return array.indexOf(elementToFind);
    }

    let indexFound = -1;
    for (let i = 0; i < array.length; i++) {
        let currentElement = array[i];
        if (elementsEqualCallback(currentElement, elementToFind)) {
            indexFound = i;
            break;
        }
    }
    return indexFound;
}

export function findAllIndexesEqual(array, elementToFind, elementsEqualCallback = null) {
    if (elementsEqualCallback == null) {
        return _findAllEqualOptimized(array, elementToFind, true);
    }

    let indexesFound = [];
    for (let i = 0; i < array.length; i++) {
        let currentElement = array[i];
        if (elementsEqualCallback(currentElement, elementToFind)) {
            indexesFound.push(i);
        }
    }
    return indexesFound;
}

export function removeIndex(array, index) {
    let elementRemoved = undefined;

    if (index >= 0 && index < array.length) {
        let arrayRemoved = array.splice(index, 1);
        if (arrayRemoved.length == 1) {
            elementRemoved = arrayRemoved[0];
        }
    }

    return elementRemoved;
}

export function removeAllIndexes(array, indexes) {
    let elementsRemoved = [];

    for (let index of indexes) {
        let elementRemoved = ArrayUtils.removeIndex(array, index);
        if (elementRemoved !== undefined) {
            elementsRemoved.push(elementRemoved);
        }
    }

    return elementsRemoved;
}

export function remove(array, callback) {
    let elementRemoved = undefined;

    let index = array.findIndex(callback);
    if (index >= 0) {
        elementRemoved = ArrayUtils.removeIndex(array, index);
    }

    return elementRemoved;
}

export function removeAll(array, callback) {
    let elementsRemoved = [];

    let currentElement = undefined;
    do {
        currentElement = ArrayUtils.remove(array, callback);
        if (currentElement !== undefined) {
            elementsRemoved.push(currentElement);
        }
    } while (currentElement !== undefined);

    return elementsRemoved;
}

export function removeEqual(array, elementToRemove, elementsEqualCallback = null) {
    return ArrayUtils.removeIndex(array, ArrayUtils.findIndexEqual(array, elementToRemove, elementsEqualCallback));
}

export function removeAllEqual(array, elementToRemove, elementsEqualCallback = null) {
    return ArrayUtils.removeAllIndexes(array, ArrayUtils.findAllIndexesEqual(array, elementToRemove, elementsEqualCallback));
}

export function pushUnique(array, element, elementsEqualCallback = null) {
    let length = array.length;

    let hasElement = ArrayUtils.hasEqual(array, element, elementsEqualCallback);

    if (!hasElement) {
        length = array.push(element);
    }

    return length;
}

export function unshiftUnique(array, element, elementsEqualCallback = null) {
    let length = array.length;

    let hasElement = ArrayUtils.hasEqual(array, element, elementsEqualCallback);

    if (!hasElement) {
        length = array.unshift(element);
    }

    return length;
}

export function copy(from, to, copyCallback = null) {
    while (to.length > from.length) {
        to.pop();
    }

    for (let i = 0; i < from.length; i++) {
        if (copyCallback == null) {
            to[i] = from[i];
        } else {
            to[i] = copyCallback(to[i], from[i]);
        }
    }

    return to;
}

export function clone(array, cloneCallback = null) {
    if (cloneCallback == null) {
        return array.slice(0);
    }

    let clone = null;
    switch (array.constructor.name) {
        case "Array":
            clone = new Array(array.length);
            break;
        case "Uint8ClampedArray":
            clone = new Uint8ClampedArray(array.length);
            break;
        case "Uint8Array":
            clone = new Uint8Array(array.length);
            break;
        case "Uint16Array":
            clone = new Uint16Array(array.length);
            break;
        case "Uint32Array":
            clone = new Uint32Array(array.length);
            break;
        case "Int8Array":
            clone = new Int8Array(array.length);
            break;
        case "Int16Array":
            clone = new Int16Array(array.length);
            break;
        case "Int32Array":
            clone = new Int32Array(array.length);
            break;
        case "Float32Array":
            clone = new Float32Array(array.length);
            break;
        case "Float64Array":
            clone = new Float64Array(array.length);
            break;
        default:
            clone = new Array(array.length);
            console.error("Cloned array type not supported!");
            break;
    }

    for (let i = 0; i < array.length; i++) {
        clone[i] = ArrayUtils.cloneCallback(array[i]);
    }

    return clone;
}

export function equals(array, other, elementsEqualCallback = null) {
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

export function clear(array) {
    array.length = 0;

    return array;
}

export let ArrayUtils = {
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
    removeIndex,
    removeAllIndexes,
    remove,
    removeAll,
    removeEqual,
    removeAllEqual,
    pushUnique,
    unshiftUnique,
    copy,
    clone,
    equals,
    clear
};



function _findAllEqualOptimized(array, elementToFind, getIndexes) {
    // Adapted from: https:// stackoverflow.com/a/20798567

    let elementsFound = [];
    let index = -1;
    while ((index = array.indexOf(elementToFind, index + 1)) >= 0) {
        elementsFound.push(getIndexes ? index : array[index]);
    }

    return elementsFound;
}
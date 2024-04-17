import { ArrayLike } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { ArrayUtils } from "../../../../cauldron/utils/array/array_utils.js";
import { PluginUtils } from "../../../utils/plugin_utils.js";
import { ArrayExtensionUtils } from "./array_extension_utils.js";

import "./array_type_extension.js";

export function initArrayExtension(): void {
    _initArrayLikeExtensionProtoypes();
    _initArrayExtensionProtoype();
}

function _initArrayLikeExtensionProtoypes(): void {

    const arrayLikeExtension: Record<string, any> = {};

    arrayLikeExtension.pp_copy = function pp_copy<ArrayType extends ArrayLike<T>, T>(this: ArrayType, array: Readonly<ArrayLike<T>>, copyCallback?: (arrayElement: T, thisElement: T) => T): ArrayType {
        return ArrayUtils.copy(array, this, copyCallback);
    };

    arrayLikeExtension.pp_clone = function pp_clone<ArrayType extends ArrayLike<T>, T>(this: Readonly<ArrayType>, cloneCallback?: (elementToClone: T) => T): ArrayType {
        return ArrayUtils.clone(this, cloneCallback);
    };

    arrayLikeExtension.pp_equals = function pp_equals<T>(this: Readonly<ArrayLike<T>>, array: Readonly<ArrayLike<T>>, elementsEqualCallback?: (thisElement: T, arrayElement: T) => boolean): boolean {
        return ArrayUtils.equals(this, array, elementsEqualCallback);
    };

    arrayLikeExtension.pp_first = function pp_first<T>(this: Readonly<ArrayLike<T>>): T | undefined {
        return ArrayUtils.first(this);
    };

    arrayLikeExtension.pp_last = function pp_last<T>(this: Readonly<ArrayLike<T>>): T | undefined {
        return ArrayUtils.last(this);
    };

    arrayLikeExtension.pp_has = function pp_has<T>(this: Readonly<ArrayLike<T>>, callback: (elementToCheck: T, elementIndex: number) => boolean): boolean {
        return ArrayUtils.has(this, callback);
    };

    arrayLikeExtension.pp_hasEqual = function pp_hasEqual<T>(this: Readonly<ArrayLike<T>>, elementToFind: T, elementsEqualCallback?: (elementToCheck: T, elementToFind: T) => boolean): boolean {
        return ArrayUtils.hasEqual(this, elementToFind, elementsEqualCallback);
    };

    arrayLikeExtension.pp_find = function pp_find<T>(this: Readonly<ArrayLike<T>>, callback: (elementToCheck: T, elementIndex: number) => boolean): T | undefined {
        return ArrayUtils.find(this, callback);
    };

    arrayLikeExtension.pp_findIndex = function pp_findIndex<T>(this: Readonly<ArrayLike<T>>, callback: (elementToCheck: T, elementIndex: number) => boolean): number {
        return ArrayUtils.findIndex(this, callback);
    };

    arrayLikeExtension.pp_findAll = function pp_findAll<T>(this: Readonly<ArrayLike<T>>, callback: (elementToCheck: T, elementIndex: number) => boolean): T[] {
        return ArrayUtils.findAll(this, callback);
    };

    arrayLikeExtension.pp_findAllIndexes = function pp_findAllIndexes<T>(this: Readonly<ArrayLike<T>>, callback: (elementToCheck: T, elementIndex: number) => boolean): number[] {
        return ArrayUtils.findAllIndexes(this, callback);
    };

    arrayLikeExtension.pp_findEqual = function pp_findEqual<T>(this: Readonly<ArrayLike<T>>, elementToFind: T, elementsEqualCallback?: (elementToCheck: T, elementToFind: T) => boolean): T | undefined {
        return ArrayUtils.findEqual(this, elementToFind, elementsEqualCallback);
    };

    arrayLikeExtension.pp_findAllEqual = function pp_findAllEqual<T>(this: Readonly<ArrayLike<T>>, elementToFind: T, elementsEqualCallback?: (elementToCheck: T, elementToFind: T) => boolean): T[] {
        return ArrayUtils.findAllEqual(this, elementToFind, elementsEqualCallback);
    };

    arrayLikeExtension.pp_findIndexEqual = function pp_findIndexEqual<T>(this: Readonly<ArrayLike<T>>, elementToFind: T, elementsEqualCallback?: (elementToCheck: T, elementToFind: T) => boolean): number {
        return ArrayUtils.findIndexEqual(this, elementToFind, elementsEqualCallback);
    };

    arrayLikeExtension.pp_findAllIndexesEqual = function pp_findAllIndexesEqual<T>(this: Readonly<ArrayLike<T>>, elementToFind: T, elementsEqualCallback?: (elementToCheck: T, elementToFind: T) => boolean): number[] {
        return ArrayUtils.findAllIndexesEqual(this, elementToFind, elementsEqualCallback);
    };

    for (const arrayLikeClassToExtend of ArrayExtensionUtils.ARRAY_LIKE_CLASSES) {
        PluginUtils.injectProperties(arrayLikeExtension, arrayLikeClassToExtend.prototype, false, true, true);
    }
}

function _initArrayExtensionProtoype(): void {

    const arrayExtension: Record<string, any> = {};

    arrayExtension.pp_remove = function pp_remove<T>(this: T[], callback: (elementToCheck: T, elementIndex: number) => boolean): T | undefined {
        return ArrayUtils.remove(this, callback);
    };

    arrayExtension.pp_removeIndex = function pp_removeIndex<T>(this: T[], index: number): T | undefined {
        return ArrayUtils.removeIndex(this, index);
    };

    arrayExtension.pp_removeAll = function pp_removeAll<T>(this: T[], callback: (elementToCheck: T, elementIndex: number) => boolean): T[] {
        return ArrayUtils.removeAll(this, callback);
    };

    arrayExtension.pp_removeAllIndexes = function pp_removeAllIndexes<T>(this: T[], indexes: number[]): T[] {
        return ArrayUtils.removeAllIndexes(this, indexes);
    };

    arrayExtension.pp_removeEqual = function pp_removeEqual<T>(this: T[], elementToRemove: T, elementsEqualCallback?: (elementToCheck: T, elementToRemove: T) => boolean): T | undefined {
        return ArrayUtils.removeEqual(this, elementToRemove, elementsEqualCallback);
    };

    arrayExtension.pp_removeAllEqual = function pp_removeAllEqual<T>(this: T[], elementToRemove: T, elementsEqualCallback?: (elementToCheck: T, elementToRemove: T) => boolean): T[] {
        return ArrayUtils.removeAllEqual(this, elementToRemove, elementsEqualCallback);
    };

    arrayExtension.pp_clear = function pp_clear<T>(this: T[]): T[] {
        return ArrayUtils.clear(this);
    };

    arrayExtension.pp_pushUnique = function pp_pushUnique<T>(this: T[], elementToAdd: T, elementsEqualCallback?: (elementToCheck: T, elementToAdd: T) => boolean): number {
        return ArrayUtils.pushUnique(this, elementToAdd, elementsEqualCallback);
    };

    arrayExtension.pp_unshiftUnique = function pp_unshiftUnique<T>(this: T[], elementToAdd: T, elementsEqualCallback?: (elementToCheck: T, elementToAdd: T) => boolean): number {
        return ArrayUtils.unshiftUnique(this, elementToAdd, elementsEqualCallback);
    };

    PluginUtils.injectProperties(arrayExtension, Array.prototype, false, true, true);
}
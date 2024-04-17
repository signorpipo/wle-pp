export const ARRAY_LIKE_CLASSES = [
    Array,
    Uint8ClampedArray,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Float32Array,
    Float64Array
] as const;

export const ArrayExtensionUtils = {
    ARRAY_LIKE_CLASSES
} as const;
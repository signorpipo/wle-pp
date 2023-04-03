/*
    How to use

    Warning: The extension is a WIP so not all the functions are available for all kinds of vector.

    By default rotations are in Degrees and transforms are Matrix 4 (and not Quat 2)    
    For functions that work with rotations, Matrix means Matrix 3 and Quat means Quat
    For functions that work with transforms, Matrix means Matrix 4 and Quat means Quat 2
    
    For rotations u can add a suffix like Degrees/Radians/Quat/Matrix to use a specific version, example:
        - vec3_rotateAroundRadians
        - vec3_degreesAddRotationDegrees
        
    For transform u can add a suffix like Quat/Matrix to use a specific version, example:
        - vec3_convertPositionToWorldMatrix
        - vec3_convertDirectionToWorldQuat

    Some vec3 functions let u add a prefix to specify if the vec3 represent a rotation in degrees or radians, where degrees is the default:
        - vec3_toQuat
        - vec3_degreesToQuat
        - vec3_radiansToQuat
        - vec3_degreesAddRotation

    Rotation operations return a rotation of the same kind of the starting variable:
        - vec3_degreesAddRotationQuat   -> returns a rotation in degrees
        - quat_addRotationDegrees       -> returns a rotation in quat

    The functions leave u the choice of forwarding an out parameter or just get the return value, example:
        - let quat = this.vec3_toQuat()
        - this.vec3_toQuat(quat)
        - the out parameter is always the last one

    List of functions:
        Notes:
            - If a group of functions starts with ○ it means it modifies the variable itself
            - The suffixes (like Matrix or Radians) or prefixes (like degrees) are omitted 

        CREATION (u can call these functions without any object):
            - vec2_create

            - vec3_create

            - vec4_create

            - quat_create

            - quat2_create
            - quat2_fromPositionRotation

            - mat3_create

            - mat4_create
            - mat4_fromPositionRotation     / mat4_fromPositionRotationScale

        ARRAY:
            - pp_first      / pp_last
            - pp_has        / pp_hasEqual
            - pp_find       / pp_findIndex      / pp_findAll            / pp_findAllIndexes / pp_findEqual      / pp_findAllEqual   / pp_findIndexEqual / pp_findAllIndexesEqual
            ○ pp_remove     / pp_removeIndex    / pp_removeAllIndexes   / pp_removeAll      / pp_removeEqual    / pp_removeAllEqual
            ○ pp_pushUnique / pp_unshiftUnique
            ○ pp_copy    
            - pp_clone      
            - pp_equals      
            ○ pp_clear      

        GENERIC VECTOR (array with only numbers):
            - vec_scale
            - vec_round     / vec_floor         / vec_ceil      / vec_clamp
            - vec_log       / vec_error         / vec_warn   
            - vec_equals   

        VECTOR 2:
            ○ vec2_set      / vec2_copy     / vec2_zero
            - vec2_clone 
            - vec2_normalize
            - vec2_length
            - vec2_isZero

        VECTOR 3:
            ○ vec3_set      / vec3_copy     / vec3_zero
            - vec3_clone 
            - vec3_normalize    / vec3_negate
            - vec3_isNormalized / vec3_isZero
            - vec3_length       / vec3_lengthSquared        / vec3_lengthSigned
            - vec3_distance     / vec3_distanceSquared
            - vec3_add              / vec3_sub              / vec3_mul      / vec3_div      / vec3_scale    / vec3_dot
            - vec3_equals
            - vec3_transformQuat    / vec3_transformMat3    / vec3_transformMat4
            - vec3_componentAlongAxis           / vec3_removeComponentAlongAxis / vec3_copyComponentAlongAxis   / vec3_valueAlongAxis  
            - vec3_isConcordant
            - vec3_isFartherAlongAxis
            - vec3_isToTheRight
            - vec3_isOnAxis
            - vec3_isOnPlane
            - vec3_signTo
            - vec3_projectOnAxis                / vec3_projectOnAxisAlongAxis
            - vec3_projectOnPlane               / vec3_projectOnPlaneAlongAxis
            - vec3_convertPositionToWorld       / vec3_convertPositionToLocal 
            - vec3_convertDirectionToWorld      / vec3_convertDirectionToLocal   
            - vec3_angle
            - vec3_rotate           / vec3_rotateAxis           / vec3_rotateAround / vec3_rotateAroundAxis
            - vec3_rotationTo       / vec3_rotationToPivoted
            - vec3_toRadians        / vec3_toDegrees            / vec3_toQuat       / vec3_toMatrix
            - vec3_addRotation
            - vec3_log       / vec3_error         / vec3_warn    
            - vec3_lerp      / vec3_interpolate 
            
        VECTOR 4:
            ○ vec4_set      / vec4_copy
            - vec4_clone 

        QUAT:
            ○ quat_set          / quat_copy     / quat_identity
            - quat_clone 
            - quat_normalize    / quat_invert   / quat_conjugate
            - quat_isNormalized
            - quat_length       / quat_lengthSquared
            - quat_mul
            - quat_getAxis          / quat_getAngle         / quat_getAxisScaled
            - quat_getAxes          / quat_getRight         / quat_getUp    / quat_getForward   / quat_getLeft  / quat_getDown  / quat_getBackward
            ○ quat_setAxes          / quat_setRight         / quat_setUp    / quat_setForward   / quat_setLeft  / quat_setDown  / quat_setBackward
            - quat_toWorld          / quat_toLocal
            - quat_rotate           / quat_rotateAxis  
            - quat_rotationTo     
            - quat_getTwist         / quat_getSwing         / quat_getTwistFromSwing    / quat_getSwingFromTwist    / quat_fromTwistSwing
            ○ quat_fromRadians      / quat_fromDegrees      / quat_fromAxis / quat_fromAxes
            - quat_toRadians        / quat_toDegrees        / quat_toMatrix
            - quat_addRotation      / quat_subRotation
            - quat_lerp             / quat_interpolate      / quat_slerp    / quat_sinterpolate

        QUAT 2:
            ○ quat2_set             / quat2_copy        / quat2_identity
            - quat2_normalize       / quat2_invert      / quat2_conjugate
            - quat2_isNormalized
            - quat2_length          / quat2_lengthSquared
            - quat2_mul
            - quat2_getPosition     / quat2_getRotation
            ○ quat2_setPosition     / quat2_setRotation     / quat2_setPositionRotation
            - quat2_getAxes     / quat2_getRight    / quat2_getUp   / quat2_getForward  / quat2_getLeft    / quat2_getDown   / quat2_getBackward
            - quat2_toWorld     / quat2_toLocal
            - quat2_rotateAxis  
            - quat2_toMatrix
            ○ quat2_fromMatrix
            - quat2_lerp        / quat2_interpolate

        MATRIX 3:
            ○ mat3_set
            - mat3_toDegrees    / mat3_toRadians    / mat3_toQuat
            - mat3_fromAxes

        MATRIX 4:
            ○ mat4_set          / mat4_copy         / mat4_identity
            - mat4_clone
            - mat4_invert
            - mat_mul           / mat4_scale
            - mat4_getPosition  / mat4_getRotation  / mat4_getScale
            ○ mat4_setPosition  / mat4_setRotation  / mat4_setScale
            ○ mat4_setPositionRotation      / mat4_setPositionRotationScale
            - mat4_getAxes     / mat4_getRight    / mat4_getUp   / mat4_getForward  / mat4_getLeft    / mat4_getDown   / mat4_getBackward
            - mat4_toWorld      / mat4_toLocal
            - mat4_hasUniformScale
            - mat4_toQuat
            ○ mat4_fromQuat
*/

import * as glMatrix from "gl-matrix";
import { ExtensionUtils } from "../../utils/extension_utils";

export function initArrayExtension() {
    initArrayExtensionProtoype();
}

export function vec2_create(x, y) {
    let out = glMatrix.vec2.create();
    if (x !== undefined) {
        _vec2_set(out, x, y);
    }
    return out;
};

export function vec3_create(x, y, z) {
    let out = glMatrix.vec3.create();
    if (x !== undefined) {
        _vec3_set(out, x, y, z);
    }
    return out;
};

export function vec4_create(x, y, z, w) {
    let out = glMatrix.vec4.create();
    if (x !== undefined) {
        _vec4_set(out, x, y, z, w);
    }
    return out;
};

export function quat_create(x, y, z, w) {
    let out = glMatrix.quat.create();
    if (x !== undefined) {
        _quat_set(out, x, y, z, w);
    }
    return out;
};

export function quat2_create(x1, y1, z1, w1, x2, y2, z2, w2) {
    let out = glMatrix.quat2.create();
    if (x1 !== undefined) {
        _quat2_set(out, x1, y1, z1, w1, x2, y2, z2, w2);
    }
    return out;
};

export function mat3_create(
    m00, m01, m02,
    m10, m11, m12,
    m20, m21, m22) {
    let out = glMatrix.mat3.create();
    if (m00 !== undefined) {
        _mat3_set(
            out,
            m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22);
    }
    return out;
};

export function mat4_create(
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33) {
    let out = glMatrix.mat4.create();
    if (m00 !== undefined) {
        _mat4_set(
            out,
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33);
    }
    return out;
};

export function quat2_fromPositionRotation(position, rotation) {
    return quat2_fromPositionRotationDegrees(position, rotation);
};

export function quat2_fromPositionRotationDegrees(position, rotation) {
    let out = quat2_create();
    out.quat2_setPositionRotationDegrees(position, rotation);
    return out;
};

export function quat2_fromPositionRotationRadians(position, rotation) {
    let out = quat2_create();
    out.quat2_setPositionRotationRadians(position, rotation);
    return out;
};

export function quat2_fromPositionRotationQuat(position, rotation) {
    let out = quat2_create();
    out.quat2_setPositionRotationQuat(position, rotation);
    return out;
};

export function mat4_fromPositionRotation(position, rotation) {
    return mat4_fromPositionRotationDegrees(position, rotation);
};

export function mat4_fromPositionRotationDegrees(position, rotation) {
    let out = mat4_create();
    out.mat4_setPositionRotationDegrees(position, rotation);
    return out;
};

export function mat4_fromPositionRotationRadians(position, rotation) {
    let out = mat4_create();
    out.mat4_setPositionRotationRadians(position, rotation);
    return out;
};

export function mat4_fromPositionRotationQuat(position, rotation) {
    let out = mat4_create();
    out.mat4_setPositionRotationQuat(position, rotation);
    return out;
};

export function mat4_fromPositionRotationScale(position, rotation, scale) {
    return mat4_fromPositionRotationDegreesScale(position, rotation, scale);
};

export function mat4_fromPositionRotationDegreesScale(position, rotation, scale) {
    let out = mat4_create();
    out.mat4_setPositionRotationDegreesScale(position, rotation, scale);
    return out;
};

export function mat4_fromPositionRotationRadiansScale(position, rotation, scale) {
    let out = mat4_create();
    out.mat4_setPositionRotationRadiansScale(position, rotation, scale);
    return out;
};

export function mat4_fromPositionRotationQuatScale(position, rotation, scale) {
    let out = mat4_create();
    out.mat4_setPositionRotationQuatScale(position, rotation, scale);
    return out;
};

export function initArrayExtensionProtoype() {

    // SETTER

    let arrayExtension = {};

    arrayExtension.vec2_set = function vec2_set(x, y) {
        return _vec2_set(this, x, y);
    };

    arrayExtension.vec3_set = function vec3_set(x, y, z) {
        return _vec3_set(this, x, y, z);
    };

    arrayExtension.vec4_set = function vec4_set(x, y, z, w) {
        return _vec4_set(this, x, y, z, w);
    };

    arrayExtension.quat_set = function quat_set(x, y, z, w) {
        return _quat_set(this, x, y, z, w);
    };

    arrayExtension.quat2_set = function quat2_set(x1, y1, z1, w1, x2, y2, z2, w2) {
        return _quat2_set(this, x1, y1, z1, w1, x2, y2, z2, w2);
    };

    arrayExtension.mat3_set = function mat3_set(
        m00, m01, m02,
        m10, m11, m12,
        m20, m21, m22) {
        return _mat3_set(
            this,
            m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22);
    };

    arrayExtension.mat4_set = function mat4_set(
        m00, m01, m02, m03,
        m10, m11, m12, m13,
        m20, m21, m22, m23,
        m30, m31, m32, m33) {
        return _mat4_set(
            this,
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33);
    };

    // ARRAY

    // New Functions

    arrayExtension.pp_first = function pp_first() {
        return this.length > 0 ? this[0] : undefined;
    };

    arrayExtension.pp_last = function pp_last() {
        return this.length > 0 ? this[this.length - 1] : undefined;
    };

    arrayExtension.pp_has = function pp_has(callback) {
        return this.pp_find(callback) != undefined;
    };

    arrayExtension.pp_hasEqual = function pp_hasEqual(elementToFind, elementsEqualCallback = null) {
        return this.pp_findEqual(elementToFind, elementsEqualCallback) != undefined;
    };

    arrayExtension.pp_find = function pp_find(callback) {
        let elementFound = undefined;

        let index = this.findIndex(callback);
        if (index >= 0) {
            elementFound = this[index];
        }

        return elementFound;
    };

    arrayExtension.pp_findIndex = function pp_findIndex(callback) {
        return this.findIndex(callback);
    };

    arrayExtension.pp_findAll = function pp_findAll(callback) {
        let elementsFound = this.filter(callback);

        return elementsFound;
    };

    arrayExtension.pp_findAllIndexes = function pp_findAllIndexes(callback) {
        let indexes = [];
        for (let i = 0; i < this.length; i++) {
            let element = this[i];
            if (callback(element)) {
                indexes.push(i);
            }
        }
        return indexes;
    };

    arrayExtension.pp_findEqual = function pp_findEqual(elementToFind, elementsEqualCallback = null) {
        if (elementsEqualCallback == null) {
            let index = this.pp_findIndexEqual(elementToFind);
            return index < 0 ? undefined : this[index];
        }

        let elementFound = undefined
        for (let i = 0; i < this.length; i++) {
            let currentElement = this[i];
            if (elementsEqualCallback(currentElement, elementToFind)) {
                elementFound = currentElement;
                break;
            }
        }
        return elementFound;
    };

    arrayExtension.pp_findAllEqual = function pp_findAllEqual(elementToFind, elementsEqualCallback = null) {
        if (elementsEqualCallback == null) {
            return _findAllEqualOptimized(this, elementToFind, false);
        }

        let elementsFound = [];
        for (let i = 0; i < this.length; i++) {
            let currentElement = this[i];
            if (elementsEqualCallback(currentElement, elementToFind)) {
                elementsFound.push(currentElement);
            }
        }
        return elementsFound;
    };

    arrayExtension.pp_findIndexEqual = function pp_findIndexEqual(elementToFind, elementsEqualCallback = null) {
        if (elementsEqualCallback == null) {
            return this.indexOf(elementToFind);
        }

        let indexFound = -1;
        for (let i = 0; i < this.length; i++) {
            let currentElement = this[i];
            if (elementsEqualCallback(currentElement, elementToFind)) {
                indexFound = i;
                break;
            }
        }
        return indexFound;
    };

    arrayExtension.pp_findAllIndexesEqual = function pp_findAllIndexesEqual(elementToFind, elementsEqualCallback = null) {
        if (elementsEqualCallback == null) {
            return _findAllEqualOptimized(this, elementToFind, true);
        }

        let indexesFound = [];
        for (let i = 0; i < this.length; i++) {
            let currentElement = this[i];
            if (elementsEqualCallback(currentElement, elementToFind)) {
                indexesFound.push(i);
            }
        }
        return indexesFound;
    };

    arrayExtension.pp_removeIndex = function pp_removeIndex(index) {
        let elementRemoved = undefined;

        if (index >= 0 && index < this.length) {
            let arrayRemoved = this.splice(index, 1);
            if (arrayRemoved.length == 1) {
                elementRemoved = arrayRemoved[0];
            }
        }

        return elementRemoved;
    };

    arrayExtension.pp_removeAllIndexes = function pp_removeAllIndexes(indexes) {
        let elementsRemoved = [];

        for (let index of indexes) {
            let elementRemoved = this.pp_removeIndex(index);
            if (elementRemoved !== undefined) {
                elementsRemoved.push(elementRemoved);
            }
        }

        return elementsRemoved;
    };

    arrayExtension.pp_remove = function pp_remove(callback) {
        let elementRemoved = undefined;

        let index = this.findIndex(callback);
        if (index >= 0) {
            elementRemoved = this.pp_removeIndex(index);
        }

        return elementRemoved;
    };

    arrayExtension.pp_removeAll = function pp_removeAll(callback) {
        let elementsRemoved = [];

        let currentElement = undefined;
        do {
            currentElement = this.pp_remove(callback);
            if (currentElement !== undefined) {
                elementsRemoved.push(currentElement);
            }
        } while (currentElement !== undefined);

        return elementsRemoved;
    };

    arrayExtension.pp_removeEqual = function pp_removeEqual(elementToRemove, elementsEqualCallback = null) {
        return this.pp_removeIndex(this.pp_findIndexEqual(elementToRemove, elementsEqualCallback));
    };

    arrayExtension.pp_removeAllEqual = function pp_removeAllEqual(elementToRemove, elementsEqualCallback = null) {
        return this.pp_removeAllIndexes(this.pp_findAllIndexesEqual(elementToRemove, elementsEqualCallback));
    };

    arrayExtension.pp_pushUnique = function pp_pushUnique(element, elementsEqualCallback = null) {
        let length = this.length;

        let hasElement = this.pp_hasEqual(element, elementsEqualCallback);

        if (!hasElement) {
            length = this.push(element);
        }

        return length;
    };

    arrayExtension.pp_unshiftUnique = function pp_unshiftUnique(element, elementsEqualCallback = null) {
        let length = this.length;

        let hasElement = this.pp_hasEqual(element, elementsEqualCallback);

        if (!hasElement) {
            length = this.unshift(element);
        }

        return length;
    };

    arrayExtension.pp_copy = function pp_copy(array, copyCallback = null) {
        while (this.length > array.length) {
            this.pop();
        }

        for (let i = 0; i < array.length; i++) {
            if (copyCallback == null) {
                this[i] = array[i];
            } else {
                this[i] = copyCallback(this[i], array[i]);
            }
        }

        return this;
    };

    arrayExtension.pp_clone = function pp_clone(cloneCallback = null) {
        if (cloneCallback == null) {
            return this.slice(0);
        }

        let clone = null;
        switch (this.constructor.name) {
            case "Array":
                clone = new Array(this.length);
                break;
            case "Uint8ClampedArray":
                clone = new Uint8ClampedArray(this.length);
                break;
            case "Uint8Array":
                clone = new Uint8Array(this.length);
                break;
            case "Uint16Array":
                clone = new Uint16Array(this.length);
                break;
            case "Uint32Array":
                clone = new Uint32Array(this.length);
                break;
            case "Int8Array":
                clone = new Int8Array(this.length);
                break;
            case "Int16Array":
                clone = new Int16Array(this.length);
                break;
            case "Int32Array":
                clone = new Int32Array(this.length);
                break;
            case "Float32Array":
                clone = new Float32Array(this.length);
                break;
            case "Float64Array":
                clone = new Float64Array(this.length);
                break;
            default:
                clone = new Array(this.length);
                console.error("Cloned array type not supported!");
                break;
        }

        for (let i = 0; i < this.length; i++) {
            clone[i] = cloneCallback(this[i]);
        }

        return clone;
    };

    arrayExtension.pp_equals = function pp_equals(array, elementsEqualCallback = null) {
        let equals = true;

        if (array != null && this.length == array.length) {
            for (let i = 0; i < this.length; i++) {
                if ((elementsEqualCallback != null && !elementsEqualCallback(this[i], array[i])) ||
                    (elementsEqualCallback == null && this[i] != array[i])) {
                    equals = false;
                    break;
                }
            }
        } else {
            equals = false;
        }

        return equals;
    };

    arrayExtension.pp_clear = function pp_clear() {
        this.length = 0;

        return this;
    };

    // GENERIC VECTOR

    // New Functions

    arrayExtension.vec_toString = function vec_toString(decimalPlaces = null) {
        let message = _vec_buildConsoleMessage(this, decimalPlaces);
        return message;
    };

    arrayExtension.vec_log = function vec_log(decimalPlaces = 4) {
        let message = _vec_buildConsoleMessage(this, decimalPlaces);
        console.log(message);
    };

    arrayExtension.vec_error = function vec_error(decimalPlaces = 4) {
        let message = _vec_buildConsoleMessage(this, decimalPlaces);
        console.error(message);
    };

    arrayExtension.vec_warn = function vec_warn(decimalPlaces = 4) {
        let message = _vec_buildConsoleMessage(this, decimalPlaces);
        console.warn(message);
    };

    arrayExtension.vec_scale = function vec_scale(value, out = null) {
        out = _vec_prepareOut(this, out);

        for (let i = 0; i < out.length; i++) {
            out[i] = out[i] * value;
        }

        return out;
    };

    arrayExtension.vec_round = function vec_round(out = null) {
        out = _vec_prepareOut(this, out);

        for (let i = 0; i < out.length; i++) {
            out[i] = Math.round(out[i]);
        }

        return out;
    };

    arrayExtension.vec_floor = function vec_floor(out = null) {
        out = _vec_prepareOut(this, out);

        for (let i = 0; i < out.length; i++) {
            out[i] = Math.floor(out[i]);
        }

        return out;
    };

    arrayExtension.vec_ceil = function vec_ceil(out = null) {
        out = _vec_prepareOut(this, out);

        for (let i = 0; i < out.length; i++) {
            out[i] = Math.ceil(out[i]);
        }

        return out;
    };

    arrayExtension.vec_clamp = function vec_clamp(start, end, out = null) {
        out = _vec_prepareOut(this, out);

        let fixedStart = (start != null) ? start : -Number.MAX_VALUE;
        let fixedEnd = (end != null) ? end : Number.MAX_VALUE;
        let min = Math.min(fixedStart, fixedEnd);
        let max = Math.max(fixedStart, fixedEnd);

        for (let i = 0; i < out.length; i++) {
            out[i] = Math.pp_clamp(out[i], min, max);
        }

        return out;
    };

    arrayExtension.vec_equals = function vec_equals(vector, epsilon = 0) {
        let equals = this.length == vector.length;

        for (let i = 0; i < this.length && equals; i++) {
            equals = equals && (Math.abs(this[i] - vector[i]) <= epsilon);
        }

        return equals;
    };

    // VECTOR 2

    // glMatrix Bridge

    arrayExtension.vec2_length = function vec2_length() {
        return glMatrix.vec2.length(this);
    };

    arrayExtension.vec2_normalize = function vec2_normalize(out = vec2_create()) {
        glMatrix.vec2.normalize(out, this);
        return out;
    };

    arrayExtension.vec2_copy = function vec2_copy(vector) {
        glMatrix.vec2.copy(this, vector);
        return this;
    };

    arrayExtension.vec2_clone = function vec2_clone(out = vec2_create()) {
        glMatrix.vec2.copy(out, this);
        return out;
    };

    arrayExtension.vec2_zero = function vec2_zero() {
        glMatrix.vec2.zero(this);
        return this;
    };

    // New Functions

    arrayExtension.vec2_isZero = function vec2_isZero(epsilon = 0) {
        return this.vec2_length() <= epsilon;
    };

    // VECTOR 3

    // glMatrix Bridge

    arrayExtension.vec3_normalize = function vec3_normalize(out = vec3_create()) {
        glMatrix.vec3.normalize(out, this);
        return out;
    };

    arrayExtension.vec3_copy = function vec3_copy(vector) {
        glMatrix.vec3.copy(this, vector);
        return this;
    };

    arrayExtension.vec3_clone = function vec3_clone(out = vec3_create()) {
        glMatrix.vec3.copy(out, this);
        return out;
    };

    arrayExtension.vec3_zero = function vec3_zero() {
        glMatrix.vec3.zero(this);
        return this;
    };

    arrayExtension.vec3_angle = function vec3_angle(vector) {
        return this.vec3_angleDegrees(vector);
    };

    arrayExtension.vec3_angleDegrees = function vec3_angleDegrees(vector) {
        return Math.pp_toDegrees(this.vec3_angleRadians(vector));
    };

    arrayExtension.vec3_angleRadians = function vec3_angleRadians(vector) {
        let thisX = this[0];
        let thisY = this[1];
        let thisZ = this[2];

        let vectorX = vector[0];
        let vectorY = vector[1];
        let vectorZ = vector[2];

        let thisLengthSquared = (thisX * thisX + thisY * thisY + thisZ * thisZ);
        let vectorLengthSquared = (vectorX * vectorX + vectorY * vectorY + vectorZ * vectorZ);

        let lengthSquared = thisLengthSquared * vectorLengthSquared;

        let angle = 0;
        if (lengthSquared > Math.PP_EPSILON_SQUARED) {
            let length = Math.sqrt(lengthSquared);

            let cos = this.vec3_dot(vector) / length;
            angle = Math.acos(Math.pp_clamp(cos, -1, 1));
        }

        return angle;
    };

    arrayExtension.vec3_equals = function vec3_equals(vector, epsilon = 0) {
        let equals = this.length == vector.length;

        if (equals) {
            equals &&= (Math.abs(this[0] - vector[0]) <= epsilon);
            equals &&= (Math.abs(this[1] - vector[1]) <= epsilon);
            equals &&= (Math.abs(this[2] - vector[2]) <= epsilon);
        }

        return equals;
    };

    arrayExtension.vec3_length = function vec3_length() {
        return glMatrix.vec3.length(this);
    };

    arrayExtension.vec3_lengthSquared = function vec3_lengthSquared() {
        return glMatrix.vec3.squaredLength(this);
    };

    arrayExtension.vec3_distance = function vec3_distance(vector) {
        return glMatrix.vec3.dist(this, vector);
    };

    arrayExtension.vec3_distanceSquared = function vec3_distanceSquared(vector) {
        return glMatrix.vec3.squaredDistance(this, vector);
    };

    arrayExtension.vec3_add = function vec3_add(vector, out = vec3_create()) {
        glMatrix.vec3.add(out, this, vector);
        return out;
    };

    arrayExtension.vec3_sub = function vec3_sub(vector, out = vec3_create()) {
        glMatrix.vec3.sub(out, this, vector);
        return out;
    };

    arrayExtension.vec3_mul = function vec3_mul(vector, out = vec3_create()) {
        glMatrix.vec3.mul(out, this, vector);
        return out;
    };

    arrayExtension.vec3_div = function vec3_div(vector, out = vec3_create()) {
        glMatrix.vec3.div(out, this, vector);
        return out;
    };

    arrayExtension.vec3_scale = function vec3_scale(value, out = vec3_create()) {
        glMatrix.vec3.scale(out, this, value);
        return out;
    };

    arrayExtension.vec3_dot = function vec3_dot(vector) {
        return glMatrix.vec3.dot(this, vector);
    };

    arrayExtension.vec3_negate = function vec3_negate(out = vec3_create()) {
        glMatrix.vec3.negate(out, this);
        return out;
    };

    arrayExtension.vec3_cross = function vec3_cross(vector, out = vec3_create()) {
        glMatrix.vec3.cross(out, this, vector);
        return out;
    };

    arrayExtension.vec3_transformQuat = function vec3_transformQuat(quat, out = vec3_create()) {
        glMatrix.vec3.transformQuat(out, this, quat);
        return out;
    };

    arrayExtension.vec3_transformMat3 = function vec3_transformMat3(mat3, out = vec3_create()) {
        glMatrix.vec3.transformMat3(out, this, mat3);
        return out;
    };

    arrayExtension.vec3_transformMat4 = function vec3_transformMat4(mat4, out = vec3_create()) {
        glMatrix.vec3.transformMat4(out, this, mat4);
        return out;
    };

    // New Functions

    arrayExtension.vec3_lengthSigned = function vec3_lengthSigned(positiveDirection) {
        let signedLength = this.vec3_length();
        if (!this.vec3_isConcordant(positiveDirection)) {
            signedLength *= -1;
        }

        return signedLength;
    };

    arrayExtension.vec3_angleSigned = function vec3_angleSigned(vector, upAxis) {
        return this.vec3_angleSignedDegrees(vector, upAxis);
    };

    arrayExtension.vec3_angleSignedDegrees = function vec3_angleSignedDegrees(vector, upAxis) {
        return Math.pp_toDegrees(this.vec3_angleSignedRadians(vector, upAxis));
    };

    arrayExtension.vec3_angleSignedRadians = function () {
        let crossAxis = vec3_create();
        return function vec3_angleSignedRadians(vector, upAxis) {
            this.vec3_cross(vector, crossAxis);
            let angle = this.vec3_angleRadians(vector);
            if (!crossAxis.vec3_isConcordant(upAxis)) {
                angle = -angle;
            }

            return angle;
        };
    }();

    arrayExtension.vec3_toRadians = function vec3_toRadians(out = vec3_create()) {
        glMatrix.vec3.set(out, glMatrix.glMatrix.toRadian(this[0]), glMatrix.glMatrix.toRadian(this[1]), glMatrix.glMatrix.toRadian(this[2]));
        return out;
    };

    arrayExtension.vec3_toDegrees = function vec3_toDegrees(out = vec3_create()) {
        glMatrix.vec3.set(out, Math.pp_toDegrees(this[0]), Math.pp_toDegrees(this[1]), Math.pp_toDegrees(this[2]));
        return out;
    };

    arrayExtension.vec3_toQuat = function vec3_toQuat(out) {
        return this.vec3_degreesToQuat(out);
    };

    arrayExtension.vec3_radiansToQuat = function vec3_radiansToQuat(out = quat_create()) {
        out.quat_fromRadians(this);
        return out;
    };

    arrayExtension.vec3_degreesToQuat = function vec3_degreesToQuat(out = quat_create()) {
        out.quat_fromDegrees(this);
        return out;
    };

    arrayExtension.vec3_isNormalized = function vec3_isNormalized(epsilon = Math.PP_EPSILON) {
        return Math.abs(this.vec3_lengthSquared() - 1) < epsilon;
    };

    arrayExtension.vec3_isZero = function vec3_isZero(epsilon = 0) {
        return this.vec3_lengthSquared() <= (epsilon * epsilon);
    };

    arrayExtension.vec3_componentAlongAxis = function vec3_componentAlongAxis(axis, out = vec3_create()) {
        let componentAlongAxisLength = this.vec3_dot(axis);

        glMatrix.vec3.copy(out, axis);
        glMatrix.vec3.scale(out, out, componentAlongAxisLength);
        return out;
    };

    arrayExtension.vec3_valueAlongAxis = function vec3_valueAlongAxis(axis) {
        let valueAlongAxis = this.vec3_dot(axis);
        return valueAlongAxis;
    };

    arrayExtension.vec3_removeComponentAlongAxis = function () {
        let componentAlong = vec3_create();
        return function vec3_removeComponentAlongAxis(axis, out = vec3_create()) {
            this.vec3_componentAlongAxis(axis, componentAlong);
            glMatrix.vec3.sub(out, this, componentAlong);
            return out;
        };
    }();

    arrayExtension.vec3_copyComponentAlongAxis = function () {
        let componentAlong = vec3_create();
        return function vec3_copyComponentAlongAxis(vector, axis, out = vec3_create()) {
            this.vec3_removeComponentAlongAxis(axis, out);
            vector.vec3_componentAlongAxis(axis, componentAlong);
            out.vec3_add(componentAlong, out);

            return out;
        };
    }();

    arrayExtension.vec3_isConcordant = function vec3_isConcordant(vector) {
        return this.vec3_dot(vector) >= 0;
    };

    arrayExtension.vec3_isFartherAlongAxis = function vec3_isFartherAlongAxis(vector, axis) {
        return this.vec3_valueAlongAxis(axis) > vector.vec3_valueAlongAxis(axis);
    };

    arrayExtension.vec3_isToTheRight = function vec3_isToTheRight(vector, upAxis) {
        return this.vec3_signTo(vector, upAxis) >= 0;
    };

    arrayExtension.vec3_signTo = function () {
        let componentAlongThis = vec3_create();
        let componentAlongVector = vec3_create();
        return function vec3_signTo(vector, upAxis, zeroSign = 1) {
            this.vec3_removeComponentAlongAxis(upAxis, componentAlongThis);
            vector.vec3_removeComponentAlongAxis(upAxis, componentAlongVector);

            let angleSigned = this.vec3_angleSigned(vector, upAxis);
            return angleSigned > 0 ? 1 : (angleSigned == 0 ? zeroSign : -1);
        };
    }();

    arrayExtension.vec3_projectOnAxis = function vec3_projectOnAxis(axis, out = vec3_create()) {
        this.vec3_componentAlongAxis(axis, out);
        return out;
    };

    // The result can easily be not 100% exact due to precision errors
    arrayExtension.vec3_projectOnAxisAlongAxis = function () {
        let up = vec3_create();

        let thisToAxis = vec3_create();

        let fixedProjectAlongAxis = vec3_create();
        return function vec3_projectOnAxisAlongAxis(axis, projectAlongAxis, out = vec3_create()) {

            if (this.vec3_isOnAxis(axis) || projectAlongAxis.vec3_isOnAxis(axis)) {
                out.vec3_copy(this);
            } else {
                projectAlongAxis.vec3_cross(axis, up);
                up.vec3_normalize(up);

                this.vec3_removeComponentAlongAxis(up, out);
                if (!out.vec3_isOnAxis(axis)) {
                    out.vec3_projectOnAxis(axis, thisToAxis);
                    thisToAxis.vec3_sub(out, thisToAxis);

                    if (thisToAxis.vec3_isConcordant(projectAlongAxis)) {
                        fixedProjectAlongAxis.vec3_copy(projectAlongAxis);
                    } else {
                        projectAlongAxis.vec3_negate(fixedProjectAlongAxis);
                    }

                    let angleWithAlongAxis = fixedProjectAlongAxis.vec3_angleRadians(thisToAxis);
                    let lengthToRemove = thisToAxis.vec3_length() / Math.cos(angleWithAlongAxis);

                    fixedProjectAlongAxis.vec3_normalize(fixedProjectAlongAxis);
                    fixedProjectAlongAxis.vec3_scale(lengthToRemove, fixedProjectAlongAxis);
                    out.vec3_add(fixedProjectAlongAxis, out);

                    out.vec3_projectOnAxis(axis, out); // Snap on the axis, due to float precision error
                }
            }

            return out;
        };
    }();

    arrayExtension.vec3_projectOnPlane = function vec3_projectOnPlane(planeNormal, out = vec3_create()) {
        this.vec3_removeComponentAlongAxis(planeNormal, out);
        return out;
    };

    // The result can easily be not 100% exact due to precision errors
    arrayExtension.vec3_projectOnPlaneAlongAxis = function () {
        let thisToPlane = vec3_create();

        let fixedProjectAlongAxis = vec3_create();
        return function vec3_projectOnPlaneAlongAxis(planeNormal, projectAlongAxis, out = vec3_create()) {
            if (this.vec3_isOnPlane(planeNormal) || projectAlongAxis.vec3_isOnPlane(planeNormal)) {
                out.vec3_copy(this);
            } else {
                out.vec3_copy(this);

                out.vec3_projectOnPlane(planeNormal, thisToPlane);
                thisToPlane.vec3_sub(out, thisToPlane);

                if (thisToPlane.vec3_isConcordant(projectAlongAxis)) {
                    fixedProjectAlongAxis.vec3_copy(projectAlongAxis);
                } else {
                    projectAlongAxis.vec3_negate(fixedProjectAlongAxis);
                }

                let angleWithAlongAxis = fixedProjectAlongAxis.vec3_angleRadians(thisToPlane);
                let lengthToRemove = thisToPlane.vec3_length() / Math.cos(angleWithAlongAxis);

                fixedProjectAlongAxis.vec3_normalize(fixedProjectAlongAxis);
                fixedProjectAlongAxis.vec3_scale(lengthToRemove, fixedProjectAlongAxis);
                out.vec3_add(fixedProjectAlongAxis, out);

                out.vec3_projectOnPlane(planeNormal, out); // Snap on the axis, due to float precision error
            }

            return out;
        };
    }();

    arrayExtension.vec3_isOnAxis = function vec3_isOnAxis(axis) {
        let angle = this.vec3_angle(axis);
        return Math.abs(angle) < Math.PP_EPSILON_DEGREES || Math.abs(angle - 180) < Math.PP_EPSILON_DEGREES;
    };

    arrayExtension.vec3_isOnPlane = function vec3_isOnPlane(planeNormal) {
        let angle = this.vec3_angle(planeNormal);
        return Math.abs(angle - 90) < Math.PP_EPSILON_DEGREES;
    };

    arrayExtension.vec3_rotate = function vec3_rotate(rotation, out) {
        return this.vec3_rotateDegrees(rotation, out);
    };

    arrayExtension.vec3_rotateDegrees = function () {
        let zero = vec3_create();
        return function vec3_rotateDegrees(rotation, out) {
            return this.vec3_rotateAroundDegrees(rotation, zero, out);
        };
    }();

    arrayExtension.vec3_rotateRadians = function () {
        let zero = vec3_create();
        return function vec3_rotateRadians(rotation, out) {
            return this.vec3_rotateAroundRadians(rotation, zero, out);
        };
    }();

    arrayExtension.vec3_rotateQuat = function () {
        let zero = vec3_create();
        return function vec3_rotateQuat(rotation, out) {
            return this.vec3_rotateAroundQuat(rotation, zero, out);
        };
    }();

    arrayExtension.vec3_rotateAxis = function vec3_rotateAxis(angle, axis, out) {
        return this.vec3_rotateAxisDegrees(angle, axis, out);
    };

    arrayExtension.vec3_rotateAxisDegrees = function () {
        let zero = vec3_create();
        return function vec3_rotateAxisDegrees(angle, axis, out) {
            return this.vec3_rotateAroundAxisDegrees(angle, axis, zero, out);
        };
    }();

    arrayExtension.vec3_rotateAxisRadians = function () {
        let zero = vec3_create();
        return function vec3_rotateAxisRadians(angle, axis, out) {
            return this.vec3_rotateAroundAxisRadians(angle, axis, zero, out);
        };
    }();

    arrayExtension.vec3_rotateAround = function vec3_rotateAround(rotation, origin, out) {
        return this.vec3_rotateAroundDegrees(rotation, origin, out);
    };

    arrayExtension.vec3_rotateAroundDegrees = function () {
        let quat = quat_create();
        return function vec3_rotateAroundDegrees(rotation, origin, out = vec3_create()) {
            rotation.vec3_degreesToQuat(quat);
            return this.vec3_rotateAroundQuat(quat, origin, out);
        };
    }();

    arrayExtension.vec3_rotateAroundRadians = function () {
        let quat = quat_create();
        return function vec3_rotateAroundRadians(rotation, origin, out = vec3_create()) {
            rotation.vec3_radiansToQuat(quat);
            return this.vec3_rotateAroundQuat(quat, origin, out);
        };
    }();

    arrayExtension.vec3_rotateAroundQuat = function vec3_rotateAroundQuat(rotation, origin, out = vec3_create()) {
        glMatrix.vec3.sub(out, this, origin);
        glMatrix.vec3.transformQuat(out, out, rotation);
        glMatrix.vec3.add(out, out, origin);
        return out;
    };

    arrayExtension.vec3_rotateAroundAxis = function vec3_rotateAroundAxis(angle, axis, origin, out) {
        return this.vec3_rotateAroundAxisDegrees(angle, axis, origin, out);
    };

    arrayExtension.vec3_rotateAroundAxisDegrees = function vec3_rotateAroundAxisDegrees(angle, axis, origin, out) {
        return this.vec3_rotateAroundAxisRadians(glMatrix.glMatrix.toRadian(angle), axis, origin, out);
    };

    arrayExtension.vec3_rotateAroundAxisRadians = function () {
        let quat = quat_create();
        return function vec3_rotateAroundAxisRadians(angle, axis, origin, out = vec3_create()) {
            glMatrix.quat.setAxisAngle(quat, axis, angle);
            return this.vec3_rotateAroundQuat(quat, origin, out);
        };
    }();

    arrayExtension.vec3_convertPositionToWorld = function vec3_convertPositionToWorld(parentTransform, out) {
        return this.vec3_convertPositionToWorldMatrix(parentTransform, out);
    };

    arrayExtension.vec3_convertPositionToLocal = function vec3_convertPositionToLocal(parentTransform, out) {
        return this.vec3_convertPositionToLocalMatrix(parentTransform, out);
    };

    arrayExtension.vec3_convertPositionToWorldMatrix = function vec3_convertPositionToWorldMatrix(parentTransform, out = vec3_create()) {
        glMatrix.vec3.transformMat4(out, this, parentTransform);
        return out;
    };

    arrayExtension.vec3_convertPositionToLocalMatrix = function () {
        let inverse = mat4_create();
        return function vec3_convertPositionToLocalMatrix(parentTransform, out = vec3_create()) {
            glMatrix.mat4.invert(inverse, parentTransform);
            glMatrix.vec3.transformMat4(out, this, inverse);
            return out;
        };
    }();

    arrayExtension.vec3_convertPositionToWorldQuat = function () {
        let parentTransformMatrix = mat4_create();
        let position = vec3_create();
        let rotation = quat_create();
        let one = vec3_create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function vec3_convertPositionToWorldQuat(parentTransform, out = vec3_create()) {
            parentTransform.quat2_getPosition(position);
            parentTransform.quat2_getRotationQuat(rotation);
            parentTransformMatrix.mat4_setPositionRotationQuatScale(position, rotation, one);
            return this.vec3_convertPositionToWorldMatrix(parentTransformMatrix, out);
        };
    }();

    arrayExtension.vec3_convertPositionToLocalQuat = function () {
        let parentTransformMatrix = mat4_create();
        let position = vec3_create();
        let rotation = quat_create();
        let one = vec3_create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function vec3_convertPositionToLocalQuat(parentTransform, out = vec3_create()) {
            parentTransform.quat2_getPosition(position);
            parentTransform.quat2_getRotationQuat(rotation);
            parentTransformMatrix.mat4_setPositionRotationQuatScale(position, rotation, one);
            return this.vec3_convertPositionToLocalMatrix(parentTransformMatrix, out);
        };
    }();

    arrayExtension.vec3_convertDirectionToWorld = function vec3_convertDirectionToWorld(parentTransform, out) {
        return this.vec3_convertDirectionToWorldMatrix(parentTransform, out);
    };

    arrayExtension.vec3_convertDirectionToLocal = function vec3_convertDirectionToLocal(parentTransform, out) {
        return this.vec3_convertDirectionToLocalMatrix(parentTransform, out);
    };

    arrayExtension.vec3_convertDirectionToWorldMatrix = function () {
        let rotation = quat_create();
        return function vec3_convertDirectionToWorldMatrix(parentTransform, out = vec3_create()) {
            parentTransform.mat4_getRotationQuat(rotation);
            glMatrix.vec3.transformQuat(out, this, rotation);
            return out;
        };
    }();

    arrayExtension.vec3_convertDirectionToLocalMatrix = function () {
        let rotation = quat_create();
        return function vec3_convertDirectionToLocalMatrix(parentTransform, out = vec3_create()) {
            parentTransform.mat4_getRotationQuat(rotation);
            glMatrix.quat.conjugate(rotation, rotation);
            glMatrix.vec3.transformQuat(out, this, rotation);
            return out;
        };
    }();


    arrayExtension.vec3_convertDirectionToWorldQuat = function () {
        let rotation = quat_create();
        return function vec3_convertDirectionToWorldQuat(parentTransform, out = vec3_create()) {
            parentTransform.quat2_getRotationQuat(rotation);
            glMatrix.vec3.transformQuat(out, this, rotation);
            return out;
        };
    }();

    arrayExtension.vec3_convertDirectionToLocalQuat = function () {
        let rotation = quat_create();
        return function vec3_convertDirectionToLocalQuat(parentTransform, out = vec3_create()) {
            parentTransform.quat2_getRotationQuat(rotation);
            glMatrix.quat.conjugate(rotation, rotation);
            glMatrix.vec3.transformQuat(out, this, rotation);
            return out;
        };
    }();

    arrayExtension.vec3_log = function vec3_log(decimalPlaces = 4) {
        this.vec_log(decimalPlaces);
    };

    arrayExtension.vec3_error = function vec3_error(decimalPlaces = 4) {
        this.vec_error(decimalPlaces);
    };

    arrayExtension.vec3_warn = function vec3_warn(decimalPlaces = 4) {
        this.vec_warn(decimalPlaces);
    };

    arrayExtension.vec3_addRotation = function vec3_addRotation(rotation, out) {
        return this.vec3_degreesAddRotation(rotation, out);
    };

    arrayExtension.vec3_addRotationDegrees = function vec3_addRotationDegrees(rotation, out) {
        return quat.vec3_degreesAddRotationDegrees(rotation, out);
    };

    arrayExtension.vec3_addRotationRadians = function vec3_addRotationRadians(rotation, out) {
        return quat.vec3_degreesAddRotationRadians(rotation, out);
    };

    arrayExtension.vec3_addRotationQuat = function vec3_addRotationQuat(rotation, out) {
        return quat.vec3_degreesAddRotationQuat(rotation, out);
    };

    arrayExtension.vec3_degreesAddRotation = function vec3_degreesAddRotation(rotation, out) {
        return this.vec3_degreesAddRotationDegrees(rotation, out);
    };

    arrayExtension.vec3_degreesAddRotationDegrees = function () {
        let quat = quat_create();
        return function vec3_degreesAddRotationDegrees(rotation, out = vec3_create()) {
            this.vec3_degreesToQuat(quat);
            return quat.quat_addRotationDegrees(rotation, quat).quat_toDegrees(out);
        };
    }();

    arrayExtension.vec3_degreesAddRotationRadians = function () {
        let quat = quat_create();
        return function vec3_degreesAddRotationRadians(rotation, out = vec3_create()) {
            this.vec3_degreesToQuat(quat);
            return quat.quat_addRotationRadians(rotation, quat).quat_toDegrees(out);
        };
    }();

    arrayExtension.vec3_degreesAddRotationQuat = function () {
        let quat = quat_create();
        return function vec3_degreesAddRotationQuat(rotation, out = vec3_create()) {
            this.vec3_degreesToQuat(quat);
            return quat.quat_addRotationQuat(rotation, quat).quat_toDegrees(out);
        };
    }();

    arrayExtension.vec3_radiansAddRotation = function vec3_radiansAddRotation(rotation, out) {
        return this.vec3_radiansAddRotationDegrees(rotation, out);
    };

    arrayExtension.vec3_radiansAddRotationDegrees = function () {
        let quat = quat_create();
        return function vec3_radiansAddRotationDegrees(rotation, out = vec3_create()) {
            this.vec3_radiansToQuat(quat);
            return quat.quat_addRotationDegrees(rotation, quat).quat_toRadians(out);
        };
    }();

    arrayExtension.vec3_radiansAddRotationRadians = function () {
        let quat = quat_create();
        return function vec3_radiansAddRotationRadians(rotation, out = vec3_create()) {
            this.vec3_radiansToQuat(quat);
            return quat.quat_addRotationRadians(rotation, quat).quat_toRadians(out);
        };
    }();

    arrayExtension.vec3_radiansAddRotationQuat = function () {
        let quat = quat_create();
        return function vec3_radiansAddRotationQuat(rotation, out = vec3_create()) {
            this.vec3_radiansToQuat(quat);
            return quat.quat_addRotationQuat(rotation, quat).quat_toRadians(out);
        };
    }();

    arrayExtension.vec3_toMatrix = function vec3_toMatrix(out = mat3_create()) {
        return this.vec3_degreesToMatrix(out);
    };

    arrayExtension.vec3_degreesToMatrix = function () {
        let quat = quat_create();
        return function vec3_degreesToMatrix(out = mat3_create()) {
            this.vec3_degreesToQuat(quat);
            return quat.quat_toMatrix(out);
        };
    }();

    arrayExtension.vec3_radiansToMatrix = function () {
        let quat = quat_create();
        return function vec3_radiansToMatrix(out = mat3_create()) {
            this.vec3_radiansToQuat(quat);
            return quat.quat_toMatrix(out);
        };
    }();

    arrayExtension.vec3_rotationTo = function vec3_rotationTo(direction, out) {
        return this.vec3_rotationToDegrees(direction, out);
    };

    arrayExtension.vec3_rotationToDegrees = function () {
        let rotationQuat = quat_create();
        return function vec3_rotationToDegrees(direction, out = vec3_create()) {
            this.vec3_rotationToQuat(direction, rotationQuat);
            rotationQuat.quat_toDegrees(out);
            return out;
        };
    }();

    arrayExtension.vec3_rotationToRadians = function () {
        let rotationQuat = quat_create();
        return function vec3_rotationToRadians(direction, out = vec3_create()) {
            this.vec3_rotationToQuat(direction, rotationQuat);
            rotationQuat.quat_toRadians(out);
            return out;
        };
    }();

    arrayExtension.vec3_rotationToQuat = function () {
        let rotationAxis = vec3_create();
        return function vec3_rotationToQuat(direction, out = quat_create()) {
            this.vec3_cross(direction, rotationAxis);
            rotationAxis.vec3_normalize(rotationAxis);
            let signedAngle = this.vec3_angleSigned(direction, rotationAxis);
            out.quat_fromAxis(signedAngle, rotationAxis);
            return out;
        };
    }();

    arrayExtension.vec3_rotationToPivoted = function vec3_rotationToPivoted(direction, pivotAxis, out) {
        return this.vec3_rotationToPivotedDegrees(direction, pivotAxis, out);
    };

    arrayExtension.vec3_rotationToPivotedDegrees = function () {
        let rotationQuat = quat_create();
        return function vec3_rotationToPivotedDegrees(direction, pivotAxis, out = vec3_create()) {
            this.vec3_rotationToPivotedQuat(direction, pivotAxis, rotationQuat);
            rotationQuat.quat_toDegrees(out);
            return out;
        };
    }();

    arrayExtension.vec3_rotationToPivotedRadians = function () {
        let rotationQuat = quat_create();
        return function vec3_rotationToPivotedRadians(direction, pivotAxis, out = vec3_create()) {
            this.vec3_rotationToPivotedQuat(direction, pivotAxis, rotationQuat);
            rotationQuat.quat_toRadians(out);
            return out;
        };
    }();

    arrayExtension.vec3_rotationToPivotedQuat = function () {
        let thisFlat = vec3_create();
        let directionFlat = vec3_create();
        let rotationAxis = vec3_create();
        return function vec3_rotationToPivotedQuat(direction, pivotAxis, out = quat_create()) {
            this.vec3_removeComponentAlongAxis(pivotAxis, thisFlat);
            direction.vec3_removeComponentAlongAxis(pivotAxis, directionFlat);

            thisFlat.vec3_cross(directionFlat, rotationAxis);
            rotationAxis.vec3_normalize(rotationAxis);
            let signedAngle = thisFlat.vec3_angleSigned(directionFlat, rotationAxis);
            out.quat_fromAxis(signedAngle, rotationAxis);
            return out;
        };
    }();

    arrayExtension.vec3_lerp = function vec3_lerp(to, interpolationValue, out = vec3_create()) {
        if (interpolationValue <= 0) {
            out.vec3_copy(this);
            return out;
        } else if (interpolationValue >= 1) {
            out.vec3_copy(to);
            return out;
        }

        glMatrix.vec3.lerp(out, this, to, interpolationValue);
        return out;
    };

    arrayExtension.vec3_interpolate = function vec3_interpolate(to, interpolationValue, easingFunction = EasingFunction.linear, out = vec3_create()) {
        let lerpValue = easingFunction(interpolationValue);
        return this.vec3_lerp(to, lerpValue, out);
    };

    // VECTOR 4

    // glMatrix Bridge

    arrayExtension.vec4_copy = function vec4_copy(vector) {
        glMatrix.vec4.copy(this, vector);
        return this;
    };

    arrayExtension.vec4_clone = function vec4_clone(out = vec4_create()) {
        glMatrix.vec4.copy(out, this);
        return out;
    };

    // QUAT

    // glMatrix Bridge

    arrayExtension.quat_normalize = function quat_normalize(out = quat_create()) {
        glMatrix.quat.normalize(out, this);
        return out;
    };

    arrayExtension.quat_copy = function quat_copy(quat) {
        glMatrix.quat.copy(this, quat);
        return this;
    };

    arrayExtension.quat_clone = function quat_clone(out = quat_create()) {
        glMatrix.quat.copy(out, this);
        return out;
    };

    arrayExtension.quat_identity = function quat_identity() {
        glMatrix.quat.identity(this);
        return this;
    };

    arrayExtension.quat_length = function quat_length() {
        return glMatrix.quat.length(this);
    };

    arrayExtension.quat_lengthSquared = function quat_lengthSquared() {
        return glMatrix.quat.squaredLength(this);
    };

    arrayExtension.quat_invert = function quat_invert(out = quat_create()) {
        glMatrix.quat.invert(out, this);
        return out;
    };

    arrayExtension.quat_conjugate = function quat_conjugate(out = quat_create()) {
        glMatrix.quat.conjugate(out, this);
        return out;
    };

    arrayExtension.quat_mul = function quat_mul(rotation, out = quat_create()) {
        glMatrix.quat.mul(out, this, rotation);
        return out;
    };

    arrayExtension.quat_getAxis = function () {
        let zero = vec3_create(0, 0, 0);
        return function quat_getAxis(out = vec3_create()) {
            let angle = glMatrix.quat.getAxisAngle(out, this);
            if (angle <= Math.PP_EPSILON) {
                out.vec3_copy(zero);
            }
            return out;
        };
    }();

    arrayExtension.quat_getAngle = function quat_getAngle() {
        return this.quat_getAngleDegrees();
    };


    arrayExtension.quat_getAngleDegrees = function quat_getAngleDegrees() {
        let angle = this.quat_getAngleRadians();
        return Math.pp_toDegrees(angle);
    };

    arrayExtension.quat_getAngleRadians = function () {
        let vector = vec3_create();
        return function quat_getAngleRadians() {
            let angle = glMatrix.quat.getAxisAngle(vector, this);
            return angle;
        };
    }();

    arrayExtension.quat_getAxisScaled = function quat_getAxisScaled(out = vec3_create()) {
        return this.quat_getAxisScaledDegrees(out);
    };

    arrayExtension.quat_getAxisScaledDegrees = function quat_getAxisScaledDegrees(out = vec3_create()) {
        this.quat_getAxis(out);
        let angle = this.quat_getAngleDegrees();
        out.vec3_scale(angle, out);
        return out;
    };

    arrayExtension.quat_getAxisScaledRadians = function () {
        let zero = vec3_create(0, 0, 0);
        return function quat_getAxisScaledRadians(out = vec3_create()) {
            this.quat_getAxis(out);
            let angle = this.quat_getAngleRadians();
            if (angle <= Math.PP_EPSILON) {
                out.vec3_copy(zero);
            } else {
                out.vec3_scale(angle, out);
            }
            return out;
        };
    }();

    arrayExtension.quat_getAxes = function quat_getAxes(out = [vec3_create(), vec3_create(), vec3_create()]) {
        this.quat_getLeft(out[0]);
        this.quat_getUp(out[1]);
        this.quat_getForward(out[2]);

        return out;
    };

    arrayExtension.quat_getForward = function () {
        let rotationMatrix = mat3_create();
        return function quat_getForward(out = vec3_create()) {
            glMatrix.mat3.fromQuat(rotationMatrix, this);

            glMatrix.vec3.set(out, rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);
            glMatrix.vec3.normalize(out, out);

            return out;
        };
    }();

    arrayExtension.quat_getBackward = function quat_getBackward(out) {
        out = this.quat_getForward(out);
        out.vec3_negate(out);
        return out;
    };

    arrayExtension.quat_getLeft = function () {
        let rotationMatrix = mat3_create();
        return function quat_getLeft(out = vec3_create()) {
            glMatrix.mat3.fromQuat(rotationMatrix, this);

            glMatrix.vec3.set(out, rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);
            glMatrix.vec3.normalize(out, out);

            return out;
        };
    }();

    arrayExtension.quat_getRight = function quat_getRight(out) {
        out = this.quat_getLeft(out);
        out.vec3_negate(out);
        return out;
    };

    arrayExtension.quat_getUp = function () {
        let rotationMatrix = mat3_create();
        return function quat_getUp(out = vec3_create()) {
            glMatrix.mat3.fromQuat(rotationMatrix, this);

            glMatrix.vec3.set(out, rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);
            glMatrix.vec3.normalize(out, out);

            return out;
        };
    }();

    arrayExtension.quat_getDown = function quat_getDown(out) {
        out = this.quat_getUp(out);
        out.vec3_negate(out);
        return out;
    };

    arrayExtension.quat_setAxes = function quat_setAxes(left, up, forward) {
        if (forward != null) {
            return this.quat_setForward(forward, up, left);
        } else if (up != null) {
            return this.quat_setUp(up, forward, left);
        } else {
            return this.quat_setLeft(left, up, forward);
        }
    };

    arrayExtension.quat_setForward = function quat_setForward(forward, up = null, left = null) {
        return _quat_setAxes(this, [left, up, forward], [2, 1, 0]);
    };

    arrayExtension.quat_setBackward = function () {
        let forward = vec3_create();
        return function quat_setBackward(backward, up = null, left = null) {
            backward.vec3_negate(forward);
            return _quat_setAxes(this, [left, up, forward], [2, 1, 0]);
        };
    }();

    arrayExtension.quat_setUp = function quat_setUp(up, forward = null, left = null) {
        return _quat_setAxes(this, [left, up, forward], [1, 2, 0]);
    };

    arrayExtension.quat_setDown = function () {
        let up = vec3_create();
        return function quat_setDown(down, forward = null, left = null) {
            down.vec3_negate(up);
            return _quat_setAxes(this, [left, up, forward], [1, 2, 0]);
        };
    }();

    arrayExtension.quat_setLeft = function quat_setLeft(left, up = null, forward = null) {
        return _quat_setAxes(this, [left, up, forward], [0, 1, 2]);
    };

    arrayExtension.quat_setRight = function () {
        let left = vec3_create();
        return function quat_setRight(right, up = null, forward = null) {
            right.vec3_negate(left);
            return _quat_setAxes(this, [left, up, forward], [0, 1, 2]);
        };
    }();

    arrayExtension.quat_toWorld = function quat_toWorld(parentQuat, out = quat_create()) {
        glMatrix.quat.mul(out, parentQuat, this);
        return out;
    };

    arrayExtension.quat_toLocal = function () {
        let invertQuat = quat_create();
        return function quat_toLocal(parentQuat, out = quat_create()) {
            glMatrix.quat.conjugate(invertQuat, parentQuat);
            glMatrix.quat.mul(out, invertQuat, this);
            return out;
        };
    }();

    arrayExtension.quat_fromAxis = function quat_fromAxis(angle, axis) {
        return this.quat_fromAxisDegrees(angle, axis);
    };

    arrayExtension.quat_fromAxisDegrees = function quat_fromAxisDegrees(angle, axis) {
        glMatrix.quat.setAxisAngle(this, axis, glMatrix.glMatrix.toRadian(angle));
        return this;
    };

    arrayExtension.quat_fromAxisRadians = function quat_fromAxisRadians(angle, axis) {
        glMatrix.quat.setAxisAngle(this, axis, angle);
        return this;
    };

    arrayExtension.quat_fromAxes = function () {
        let mat3 = mat3_create();
        return function quat_fromAxes(leftAxis, upAxis, forwardAxis) {
            mat3.mat3_fromAxes(leftAxis, upAxis, forwardAxis);
            return mat3.mat3_toQuat(this);
        };
    }();

    // New Functions

    arrayExtension.quat_fromRadians = function () {
        let vector = vec3_create();
        return function quat_fromRadians(radiansRotation) {
            radiansRotation.vec3_toDegrees(vector);
            return this.quat_fromDegrees(vector);
        };
    }();

    arrayExtension.quat_fromDegrees = function quat_fromDegrees(degreesRotation) {
        glMatrix.quat.fromEuler(this, degreesRotation[0], degreesRotation[1], degreesRotation[2]);
        return this;
    };

    arrayExtension.quat_toRadians = function () {
        let mat3 = mat3_create();
        return function quat_toRadians(out = vec3_create()) {
            glMatrix.mat3.fromQuat(mat3, this);

            // Rotation order is ZYX 
            out[1] = Math.asin(-Math.pp_clamp(mat3[2], -1, 1));

            if (Math.abs(mat3[2]) < (1 - Math.PP_EPSILON)) {
                out[0] = Math.atan2(mat3[5], mat3[8]);
                out[2] = Math.atan2(mat3[1], mat3[0]);
            } else {
                out[0] = 0;
                out[2] = Math.atan2(-mat3[3], mat3[4]);
            }

            return out;
        };
    }();

    arrayExtension.quat_toDegrees = function quat_toDegrees(out = vec3_create()) {
        this.quat_toRadians(out);
        out.vec3_toDegrees(out);
        return out;
    };

    arrayExtension.quat_isNormalized = function quat_isNormalized(epsilon = Math.PP_EPSILON) {
        return Math.abs(this.quat_lengthSquared() - 1) < epsilon;
    };

    arrayExtension.quat_addRotation = function quat_addRotation(rotation, out) {
        return this.quat_addRotationDegrees(rotation, out);
    };

    arrayExtension.quat_addRotationDegrees = function () {
        let quat = quat_create();
        return function quat_addRotationDegrees(rotation, out) {
            rotation.vec3_degreesToQuat(quat);
            return this.quat_addRotationQuat(quat, out);
        };
    }();

    arrayExtension.quat_addRotationRadians = function () {
        let quat = quat_create();
        return function quat_addRotationRadians(rotation, out) {
            rotation.vec3_radiansToQuat(quat);
            return this.quat_addRotationQuat(quat, out);
        };
    }();

    arrayExtension.quat_addRotationQuat = function quat_addRotationQuat(rotation, out = quat_create()) {
        rotation.quat_mul(this, out);
        return out;
    };

    arrayExtension.quat_subRotation = function quat_subRotation(rotation, out) {
        return this.quat_subRotationDegrees(rotation, out);
    };

    arrayExtension.quat_subRotationDegrees = function () {
        let quat = quat_create();
        return function quat_subRotationDegrees(rotation, out) {
            rotation.vec3_degreesToQuat(quat);
            return this.quat_subRotationQuat(quat, out);
        };
    }();

    arrayExtension.quat_subRotationRadians = function () {
        let quat = quat_create();
        return function quat_subRotationRadians(rotation, out) {
            rotation.vec3_radiansToQuat(quat);
            return this.quat_subRotationQuat(quat, out);
        };
    }();

    arrayExtension.quat_subRotationQuat = function () {
        let inverse = quat_create();
        return function quat_subRotationQuat(rotation, out = quat_create()) {
            rotation.quat_invert(inverse);
            this.quat_mul(inverse, out);

            if (this.quat_isNormalized() && rotation.quat_isNormalized()) {
                // I would normally not normalize this result since you may want the untouched sub
                // But for normalized params it should be normalized
                // It seems though that for some small error the quat will not be exactly normalized, so I fix it
                out.quat_normalize(out);
            }

            return out;
        };
    }();

    arrayExtension.quat_rotationTo = function quat_rotationTo(rotation, out) {
        return this.quat_rotationToDegrees(rotation, out);
    };

    arrayExtension.quat_rotationToDegrees = function () {
        let rotationQuat = quat_create();
        return function quat_rotationToDegrees(rotation, out) {
            rotation.vec3_degreesToQuat(rotationQuat);
            return this.quat_rotationToQuat(rotationQuat, out);
        };
    }();

    arrayExtension.quat_rotationToRadians = function () {
        let rotationQuat = quat_create();
        return function quat_rotationToRadians(rotation, out) {
            rotation.vec3_radiansToQuat(rotationQuat);
            return this.quat_rotationToQuat(rotationQuat, out);
        };
    }();

    arrayExtension.quat_rotationToQuat = function quat_rotationToQuat(rotation, out) {
        return rotation.quat_subRotationQuat(this, out);
    };

    arrayExtension.quat_getTwist = function () {
        let rotationAxis = vec3_create();
        let projection = vec3_create();
        let rotationAlongAxis = quat_create();
        return function quat_getTwist(axis, out = quat_create()) {
            rotationAxis[0] = this[0];
            rotationAxis[1] = this[1];
            rotationAxis[2] = this[2];

            let dotProd = glMatrix.vec3.dot(axis, rotationAxis);
            axis.vec3_scale(dotProd, projection);
            rotationAlongAxis[0] = projection[0];
            rotationAlongAxis[1] = projection[1];
            rotationAlongAxis[2] = projection[2];
            rotationAlongAxis[3] = this[3];
            rotationAlongAxis.quat_normalize(rotationAlongAxis);
            if (dotProd < 0) {
                rotationAlongAxis[0] = -rotationAlongAxis[0];
                rotationAlongAxis[1] = -rotationAlongAxis[1];
                rotationAlongAxis[2] = -rotationAlongAxis[2];
                rotationAlongAxis[3] = -rotationAlongAxis[3];
            }

            return out.quat_copy(rotationAlongAxis);
        };
    }();

    arrayExtension.quat_getSwing = function () {
        let twist = quat_create();
        return function quat_getSwing(axis, out = quat_create()) {
            this.quat_getTwist(axis, twist);
            this.quat_getSwingFromTwist(twist, out);
            return out;
        };
    }();

    arrayExtension.quat_getSwingFromTwist = function quat_getSwingFromTwist(twist, out = quat_create()) {
        return this.quat_subRotationQuat(twist, out);
    };

    arrayExtension.quat_getTwistFromSwing = function () {
        let inverse = quat_create();
        return function quat_getTwistFromSwing(swing, out = quat_create()) {
            swing.quat_invert(inverse);
            this.quat_addRotationQuat(inverse, out);
            return out;
        };
    }();

    arrayExtension.quat_fromTwistSwing = function quat_fromTwistSwing(twist, swing) {
        return twist.quat_addRotationQuat(swing, this);
    };

    arrayExtension.quat_toMatrix = function quat_toMatrix(out = mat3_create()) {
        glMatrix.mat3.fromQuat(out, this);
        return out;
    };

    arrayExtension.quat_rotate = function quat_rotate(rotation, out) {
        return this.quat_rotateDegrees(rotation, out);
    };

    arrayExtension.quat_rotateDegrees = function quat_rotateDegrees(rotation, out) {
        return this.quat_addRotationDegrees(rotation, out);
    };

    arrayExtension.quat_rotateRadians = function quat_rotateRadians(rotation, out) {
        return this.quat_addRotationRadians(rotation, out);
    };

    arrayExtension.quat_rotateQuat = function quat_rotateQuat(rotation, out) {
        return this.quat_addRotationQuat(rotation, out);
    };

    arrayExtension.quat_rotateAxis = function quat_rotateAxis(angle, axis, out) {
        return this.quat_rotateAxisDegrees(angle, axis, out);
    };

    arrayExtension.quat_rotateAxisDegrees = function () {
        let rotationQuat = quat_create();
        return function quat_rotateAxisDegrees(angle, axis, out) {
            rotationQuat.quat_fromAxisDegrees(angle, axis);
            return this.quat_rotateQuat(rotationQuat, out);
        };
    }();

    arrayExtension.quat_rotateAxisRadians = function () {
        let rotationQuat = quat_create();
        return function quat_rotateAxisRadians(angle, axis, out) {
            rotationQuat.quat_fromAxisRadians(angle, axis);
            return this.quat_rotateQuat(rotationQuat, out);
        };
    }();

    arrayExtension.quat_lerp = function quat_lerp(to, interpolationValue, out = quat_create()) {
        if (interpolationValue <= 0) {
            out.quat_copy(this);
            return out;
        } else if (interpolationValue >= 1) {
            out.quat_copy(to);
            return out;
        }

        glMatrix.quat.lerp(out, this, to, interpolationValue);
        return out;
    };

    arrayExtension.quat_interpolate = function quat_interpolate(to, interpolationValue, easingFunction = EasingFunction.linear, out = quat_create()) {
        let lerpValue = easingFunction(interpolationValue);
        return this.quat_lerp(to, lerpValue, out);
    };

    arrayExtension.quat_slerp = function quat_slerp(to, interpolationValue, out = quat_create()) {
        if (interpolationValue <= 0) {
            out.quat_copy(this);
            return out;
        } else if (interpolationValue >= 1) {
            out.quat_copy(to);
            return out;
        }

        glMatrix.quat.slerp(out, this, to, interpolationValue);
        return out;
    };

    arrayExtension.quat_sinterpolate = function quat_sinterpolate(to, interpolationValue, easingFunction = EasingFunction.linear, out = quat_create()) {
        let lerpValue = easingFunction(interpolationValue);
        return this.quat_slerp(to, lerpValue, out);
    };

    // QUAT 2

    // glMatrix Bridge

    arrayExtension.quat2_normalize = function quat2_normalize(out = quat2_create()) {
        glMatrix.quat2.normalize(out, this);
        return out;
    };

    arrayExtension.quat2_invert = function quat2_invert(out = quat2_create()) {
        glMatrix.quat2.invert(out, this);
        return out;
    };

    arrayExtension.quat2_conjugate = function quat2_conjugate(out = quat2_create()) {
        glMatrix.quat2.conjugate(out, this);
        return out;
    };

    arrayExtension.quat2_copy = function quat2_copy(quat2) {
        glMatrix.quat2.copy(this, quat2);
        return this;
    };

    arrayExtension.quat2_identity = function quat2_identity() {
        glMatrix.quat2.identity(this);
        return this;
    };

    arrayExtension.quat2_getPosition = function quat2_getPosition(out = vec3_create()) {
        glMatrix.quat2.getTranslation(out, this);
        return out;
    };

    arrayExtension.quat2_getRotation = function quat2_getRotation(out) {
        return this.quat2_getRotationDegrees(out);
    };
    arrayExtension.quat2_getRotationDegrees = function () {
        let rotationQuat = quat_create();
        return function quat2_getRotationDegrees(out = vec3_create()) {
            this.quat2_getRotationQuat(rotationQuat).quat_toDegrees(out);
            return out;
        };
    }();

    arrayExtension.quat2_getRotationRadians = function () {
        let rotationQuat = quat_create();
        return function quat2_getRotationRadians(out = vec3_create()) {
            this.quat2_getRotationQuat(rotationQuat).quat_toRadians(out);
            return out;
        };
    }();

    arrayExtension.quat2_getRotationQuat = function quat2_getRotationQuat(out = quat_create()) {
        glMatrix.quat.copy(out, this);
        return out;
    };

    arrayExtension.quat2_setPosition = function () {
        let rotationQuat = quat_create();
        return function quat2_setPosition(position) {
            this.quat2_getRotationQuat(rotationQuat);
            this.quat2_setPositionRotationQuat(position, rotationQuat);
            return this;
        };
    }();

    arrayExtension.quat2_setRotation = function quat2_setRotation(rotation) {
        return this.quat2_setRotationDegrees(rotation);
    };

    arrayExtension.quat2_setRotationDegrees = function () {
        let position = vec3_create();
        return function quat2_setRotationDegrees(rotation) {
            this.quat2_getPosition(position);
            this.quat2_setPositionRotationDegrees(position, rotation);
            return this;
        };
    }();

    arrayExtension.quat2_setRotationRadians = function () {
        let position = vec3_create();
        return function quat2_setRotationRadians(rotation) {
            this.quat2_getPosition(position);
            this.quat2_setPositionRotationRadians(position, rotation);
            return this;
        };
    }();

    arrayExtension.quat2_setRotationQuat = function () {
        let position = vec3_create();
        return function quat2_setRotationQuat(rotation) {
            this.quat2_getPosition(position);
            this.quat2_setPositionRotationQuat(position, rotation);
            return this;
        };
    }();

    arrayExtension.quat2_setPositionRotation = function quat2_setPositionRotation(position, rotation) {
        return this.quat2_setPositionRotationDegrees(position, rotation);
    };

    arrayExtension.quat2_setPositionRotationDegrees = function () {
        let rotationQuat = quat_create();
        return function quat2_setPositionRotationDegrees(position, rotation) {
            rotation.vec3_degreesToQuat(rotationQuat);
            glMatrix.quat2.fromRotationTranslation(this, rotationQuat, position);

            return this;
        };
    }();

    arrayExtension.quat2_setPositionRotationRadians = function () {
        let rotationQuat = quat_create();
        return function quat2_setPositionRotationRadians(position, rotation) {
            rotation.vec3_radiansToQuat(rotationQuat);
            glMatrix.quat2.fromRotationTranslation(this, rotationQuat, position);

            return this;
        };
    }();

    arrayExtension.quat2_setPositionRotationQuat = function quat2_setPositionRotationQuat(position, rotation) {
        glMatrix.quat2.fromRotationTranslation(this, rotation, position);
        return this;
    };

    // New Functions

    arrayExtension.quat2_isNormalized = function quat2_isNormalized(epsilon = Math.PP_EPSILON) {
        return Math.abs(this.quat2_lengthSquared() - 1) < epsilon;
    };

    arrayExtension.quat2_length = function quat2_length() {
        return glMatrix.quat2.length(this);
    };

    arrayExtension.quat2_lengthSquared = function quat2_lengthSquared() {
        return glMatrix.quat2.squaredLength(this);
    };

    arrayExtension.quat2_mul = function quat2_mul(quat2, out = quat2_create()) {
        glMatrix.quat2.mul(out, this, quat2);
        return out;
    };

    arrayExtension.quat2_getAxes = function quat2_getAxes(out = [vec3_create(), vec3_create(), vec3_create()]) {
        this.quat2_getLeft(out[0]);
        this.quat2_getUp(out[1]);
        this.quat2_getForward(out[2]);

        return out;
    };

    arrayExtension.quat2_getForward = function () {
        let rotationMatrix = mat3_create();
        return function quat2_getForward(out = vec3_create()) {
            glMatrix.mat3.fromQuat(rotationMatrix, this);

            glMatrix.vec3.set(out, rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);
            glMatrix.vec3.normalize(out, out);

            return out;
        };
    }();

    arrayExtension.quat2_getBackward = function quat2_getBackward(out) {
        out = this.quat2_getForward(out);
        out.vec3_negate(out);
        return out;
    };

    arrayExtension.quat2_getLeft = function () {
        let rotationMatrix = mat3_create();
        return function quat2_getLeft(out = vec3_create()) {
            glMatrix.mat3.fromQuat(rotationMatrix, this);

            glMatrix.vec3.set(out, rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);
            glMatrix.vec3.normalize(out, out);

            return out;
        };
    }();

    arrayExtension.quat2_getRight = function quat2_getRight(out) {
        out = this.quat2_getLeft(out);
        out.vec3_negate(out);
        return out;
    };

    arrayExtension.quat2_getUp = function () {
        let rotationMatrix = mat3_create();
        return function quat2_getUp(out = vec3_create()) {
            glMatrix.mat3.fromQuat(rotationMatrix, this);

            glMatrix.vec3.set(out, rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);
            glMatrix.vec3.normalize(out, out);

            return out;
        };
    }();

    arrayExtension.quat2_getDown = function quat2_getDown(out) {
        out = this.quat2_getUp(out);
        out.vec3_negate(out);
        return out;
    };

    arrayExtension.quat2_toWorld = function quat2_toWorld(parentTransformQuat, out = quat2_create()) {
        glMatrix.quat2.mul(out, parentTransformQuat, this);
        return out;
    };

    arrayExtension.quat2_toLocal = function () {
        let invertQuat = quat2_create();
        return function quat2_toLocal(parentTransformQuat, out = quat2_create()) {
            glMatrix.quat2.conjugate(invertQuat, parentTransformQuat);
            glMatrix.quat2.mul(out, invertQuat, this);
            return out;
        };
    }();

    arrayExtension.quat2_rotateAxis = function quat2_rotateAxis(angle, axis, out) {
        return this.quat2_rotateAxisDegrees(angle, axis, out);
    };

    arrayExtension.quat2_rotateAxisDegrees = function quat2_rotateAxisDegrees(angle, axis, out) {
        return this.quat2_rotateAxisRadians(glMatrix.glMatrix.toRadian(angle), axis, out);
    };

    arrayExtension.quat2_rotateAxisRadians = function () {
        let rotationQuat = quat_create();
        return function quat2_rotateAxisRadians(angle, axis, out) {
            this.quat2_getRotationQuat(rotationQuat);
            rotationQuat.quat_rotateAxisRadians(angle, axis, rotationQuat);
            out.quat2_copy(this);
            out.quat2_setRotationQuat(rotationQuat);
            return out;
        };
    }();

    arrayExtension.quat2_toMatrix = function quat2_toMatrix(out = mat4_create()) {
        glMatrix.mat4.fromQuat2(out, this);
        return out;
    };

    arrayExtension.quat2_fromMatrix = function quat2_fromMatrix(mat4) {
        mat4.mat4_toQuat(this);
        return this;
    };

    arrayExtension.quat2_lerp = function quat2_lerp(to, interpolationValue, out = quat2_create()) {
        if (interpolationValue <= 0) {
            out.quat2_copy(this);
            return out;
        } else if (interpolationValue >= 1) {
            out.quat2_copy(to);
            return out;
        }

        glMatrix.quat2.lerp(out, this, to, interpolationValue);
        return out;
    };

    arrayExtension.quat2_interpolate = function quat2_interpolate(to, interpolationValue, easingFunction = EasingFunction.linear, out = quat2_create()) {
        let lerpValue = easingFunction(interpolationValue);
        return this.quat2_lerp(to, lerpValue, out);
    };

    // MATRIX 3

    // glMatrix Bridge

    // New Functions

    arrayExtension.mat3_toDegrees = function () {
        let quat = quat_create();
        return function mat3_toDegrees(out = vec3_create()) {
            this.mat3_toQuat(quat);
            quat.quat_toDegrees(out);
            return out;
        };
    }();

    arrayExtension.mat3_toRadians = function () {
        let quat = quat_create();
        return function mat3_toRadians(out = vec3_create()) {
            this.mat3_toQuat(quat);
            quat.quat_toRadians(out);
            return out;
        };
    }();

    arrayExtension.mat3_toQuat = function mat3_toQuat(out = quat_create()) {
        glMatrix.quat.fromMat3(out, this);
        return out;
    };

    arrayExtension.mat3_fromAxes = function mat3_fromAxes(leftAxis, upAxis, forwardAxis) {
        glMatrix.mat3.set(this,
            leftAxis[0], leftAxis[1], leftAxis[2],
            upAxis[0], upAxis[1], upAxis[2],
            forwardAxis[0], forwardAxis[1], forwardAxis[2]);
        return this;
    };

    // MATRIX 4

    // glMatrix Bridge

    arrayExtension.mat4_copy = function mat4_copy(mat4) {
        glMatrix.mat4.copy(this, mat4);
        return this;
    };

    arrayExtension.mat4_identity = function mat4_identity() {
        glMatrix.mat4.identity(this);
        return this;
    };

    arrayExtension.mat4_invert = function mat4_invert(out = mat4_create()) {
        glMatrix.mat4.invert(out, this);
        return out;
    };

    arrayExtension.mat4_mul = function mat4_mul(mat4, out = mat4_create()) {
        glMatrix.mat4.mul(out, this, mat4);
        return out;
    };

    arrayExtension.mat4_scale = function mat4_scale(vector, out = mat4_create()) {
        glMatrix.mat4.scale(out, this, vector);
        return out;
    };

    arrayExtension.mat4_clone = function mat4_clone(out = mat4_create()) {
        glMatrix.mat4.copy(out, this);
        return out;
    };

    arrayExtension.mat4_getPosition = function mat4_getPosition(out = vec3_create()) {
        glMatrix.mat4.getTranslation(out, this);
        return out;
    };

    arrayExtension.mat4_getRotation = function mat4_getRotation(out = vec3_create()) {
        return this.mat4_getRotationDegrees(out);
    };

    arrayExtension.mat4_getRotationDegrees = function () {
        let quat = quat_create();
        return function mat4_getRotationDegrees(out = vec3_create()) {
            this.mat4_getRotationQuat(quat);
            quat.quat_toDegrees(out);
            return out;
        };
    }();

    arrayExtension.mat4_getRotationRadians = function () {
        let quat = quat_create();
        return function mat4_getRotationRadians(out = vec3_create()) {
            this.mat4_getRotationQuat(quat);
            quat.quat_toRadians(out);
            return out;
        };
    }();

    arrayExtension.mat4_getRotationQuat = function () {
        let scale = vec3_create();
        let transformMatrixNoScale = mat4_create();
        let inverseScale = vec3_create();
        let one = vec3_create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function mat4_getRotationQuat(out = quat_create()) {
            glMatrix.mat4.getScaling(scale, this);
            glMatrix.vec3.divide(inverseScale, one, scale);
            glMatrix.mat4.scale(transformMatrixNoScale, this, inverseScale);
            glMatrix.mat4.getRotation(out, transformMatrixNoScale);
            glMatrix.quat.normalize(out, out);
            return out;
        };
    }();

    arrayExtension.mat4_getScale = function mat4_getScale(out = vec3_create()) {
        glMatrix.mat4.getScaling(out, this);
        return out;
    };

    // New Functions

    arrayExtension.mat4_setPosition = function mat4_setPosition(position) {
        this[12] = position[0];
        this[13] = position[1];
        this[14] = position[2];
        return this;
    };

    arrayExtension.mat4_setRotation = function mat4_setRotation(rotation) {
        this.mat4_setRotationDegrees(rotation);
        return this;
    };

    arrayExtension.mat4_setRotationDegrees = function () {
        let quat = quat_create();
        return function mat4_setRotationDegrees(rotation) {
            this.mat4_setRotationQuat(rotation.vec3_degreesToQuat(quat));
            return this;
        };
    }();

    arrayExtension.mat4_setRotationRadians = function () {
        let vector = vec3_create();
        return function mat4_setRotationRadians(rotation) {
            this.mat4_setRotationDegrees(rotation.vec3_toDegrees(vector));
            return this;
        };
    }();

    arrayExtension.mat4_setRotationQuat = function () {
        let position = vec3_create();
        let scale = vec3_create();
        return function mat4_setRotationQuat(rotation) {
            this.mat4_getPosition(position);
            this.mat4_getScale(scale);
            this.mat4_setPositionRotationQuatScale(position, rotation, scale);
            return this;
        };
    }();

    arrayExtension.mat4_setScale = function () {
        let tempScale = vec3_create();
        return function mat4_setScale(scale) {
            glMatrix.mat4.getScaling(tempScale, this);
            glMatrix.vec3.divide(tempScale, scale, tempScale);
            glMatrix.mat4.scale(this, this, tempScale);
            return this;
        };
    }();

    arrayExtension.mat4_setPositionRotationScale = function mat4_setPositionRotationScale(position, rotation, scale) {
        this.mat4_setPositionRotationDegreesScale(position, rotation, scale);
        return this;
    };

    arrayExtension.mat4_setPositionRotationDegreesScale = function () {
        let quat = quat_create();
        return function mat4_setPositionRotationDegreesScale(position, rotation, scale) {
            this.mat4_setPositionRotationQuatScale(position, rotation.vec3_degreesToQuat(quat), scale);
            return this;
        };
    }();

    arrayExtension.mat4_setPositionRotationRadiansScale = function () {
        let vector = vec3_create();
        return function mat4_setPositionRotationRadiansScale(position, rotation, scale) {
            this.mat4_setPositionRotationDegreesScale(position, rotation.vec3_toDegrees(vector), scale);
            return this;
        };
    }();

    arrayExtension.mat4_setPositionRotationQuatScale = function mat4_setPositionRotationQuatScale(position, rotation, scale) {
        glMatrix.mat4.fromRotationTranslationScale(this, rotation, position, scale);
        return this;
    };

    arrayExtension.mat4_setPositionRotation = function mat4_setPositionRotation(position, rotation) {
        this.mat4_setPositionRotationDegrees(position, rotation);
        return this;
    };

    arrayExtension.mat4_setPositionRotationDegrees = function () {
        let quat = quat_create();
        return function mat4_setPositionRotationDegrees(position, rotation) {
            this.mat4_setPositionRotationQuat(position, rotation.vec3_degreesToQuat(quat));
            return this;
        };
    }();

    arrayExtension.mat4_setPositionRotationRadians = function () {
        let vector = vec3_create();
        return function mat4_setPositionRotationRadians(position, rotation) {
            this.mat4_setPositionRotationDegrees(position, rotation.vec3_toDegrees(vector));
            return this;
        };
    }();

    arrayExtension.mat4_setPositionRotationQuat = function mat4_setPositionRotationQuat(position, rotation) {
        glMatrix.mat4.fromRotationTranslation(this, rotation, position);
        return this;
    };

    arrayExtension.mat4_getAxes = function mat4_getAxes(out = [vec3_create(), vec3_create(), vec3_create()]) {
        this.mat4_getLeft(out[0]);
        this.mat4_getUp(out[1]);
        this.mat4_getForward(out[2]);

        return out;
    };

    arrayExtension.mat4_getForward = function mat4_getForward(out = vec3_create()) {
        glMatrix.vec3.set(out, this[8], this[9], this[10]);
        glMatrix.vec3.normalize(out, out);
        return out;
    };

    arrayExtension.mat4_getBackward = function mat4_getBackward(out) {
        out = this.mat4_getForward(out);
        out.vec3_negate(out);
        return out;
    };

    arrayExtension.mat4_getLeft = function mat4_getLeft(out = vec3_create()) {
        glMatrix.vec3.set(out, this[0], this[1], this[2]);
        glMatrix.vec3.normalize(out, out);
        return out;
    };

    arrayExtension.mat4_getRight = function mat4_getRight(out) {
        out = this.mat4_getLeft(out);
        out.vec3_negate(out);
        return out;
    };

    arrayExtension.mat4_getUp = function mat4_getUp(out = vec3_create()) {
        glMatrix.vec3.set(out, this[4], this[5], this[6]);
        glMatrix.vec3.normalize(out, out);
        return out;
    };

    arrayExtension.mat4_getDown = function mat4_getDown(out) {
        out = this.mat4_getUp(out);
        out.vec3_negate(out);
        return out;
    };

    arrayExtension.mat4_toWorld = function () {
        let convertTransform = mat4_create();
        let position = vec3_create();
        let scale = vec3_create();
        let inverseScale = vec3_create();
        let one = vec3_create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function mat4_toWorld(parentTransformMatrix, out = mat4_create()) {
            if (parentTransformMatrix.mat4_hasUniformScale()) {
                glMatrix.mat4.mul(out, parentTransformMatrix, this);
            } else {
                glMatrix.vec3.set(position, this[12], this[13], this[14]);
                position.vec3_convertPositionToWorldMatrix(parentTransformMatrix, position);

                glMatrix.mat4.getScaling(scale, parentTransformMatrix);
                glMatrix.vec3.divide(inverseScale, one, scale);
                glMatrix.mat4.scale(convertTransform, parentTransformMatrix, inverseScale);

                glMatrix.mat4.mul(out, convertTransform, this);
                glMatrix.mat4.scale(out, out, scale);

                out[12] = position[0];
                out[13] = position[1];
                out[14] = position[2];
                out[15] = 1;
            }
            return out;
        };
    }();

    arrayExtension.mat4_toLocal = function () {
        let convertTransform = mat4_create();
        let position = vec3_create();
        let scale = vec3_create();
        let inverseScale = vec3_create();
        let one = vec3_create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function mat4_toLocal(parentTransformMatrix, out = mat4_create()) {
            if (parentTransformMatrix.mat4_hasUniformScale()) {
                glMatrix.mat4.invert(convertTransform, parentTransformMatrix);
                glMatrix.mat4.mul(out, convertTransform, this);
            } else {
                glMatrix.vec3.set(position, this[12], this[13], this[14]);
                position.vec3_convertPositionToLocalMatrix(parentTransformMatrix, position);

                glMatrix.mat4.getScaling(scale, parentTransformMatrix);
                glMatrix.vec3.divide(inverseScale, one, scale);
                glMatrix.mat4.scale(convertTransform, parentTransformMatrix, inverseScale);

                glMatrix.mat4.invert(convertTransform, convertTransform);
                glMatrix.mat4.mul(out, convertTransform, this);
                glMatrix.mat4.scale(out, out, inverseScale);

                out[12] = position[0];
                out[13] = position[1];
                out[14] = position[2];
                out[15] = 1;
            }
            return out;
        };
    }();

    arrayExtension.mat4_hasUniformScale = function () {
        let scale = vec3_create();
        return function mat4_hasUniformScale() {
            glMatrix.mat4.getScaling(scale, this);
            return Math.abs(scale[0] - scale[1]) < Math.PP_EPSILON && Math.abs(scale[1] - scale[2]) < Math.PP_EPSILON && Math.abs(scale[0] - scale[2]) < Math.PP_EPSILON;
        };
    }();

    arrayExtension.mat4_toQuat = function () {
        let position = vec3_create();
        let rotation = quat_create();
        return function mat4_toQuat(out = quat2_create()) {
            glMatrix.mat4.getTranslation(position, this);
            this.mat4_getRotationQuat(rotation);
            glMatrix.quat2.fromRotationTranslation(out, rotation, position);
            return out;
        };
    }();

    arrayExtension.mat4_fromQuat = function mat4_fromQuat(quat2) {
        quat2.quat2_toMatrix(this);
        return this;
    };



    let arrayPrototypesToExtend = [
        Array.prototype, Uint8ClampedArray.prototype, Uint8Array.prototype, Uint16Array.prototype, Uint32Array.prototype, Int8Array.prototype,
        Int16Array.prototype, Int32Array.prototype, Float32Array.prototype, Float64Array.prototype];

    for (let arrayPrototypeToExtend of arrayPrototypesToExtend) {
        ExtensionUtils.assignProperties(arrayExtension, arrayPrototypeToExtend, false, true, true);
    }
}



function _vec_buildConsoleMessage(vector, decimalPlaces) {
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
};

function _vec_prepareOut(vector, out) {
    if (out == null) {
        out = vector.pp_clone();
    } else if (out != vector) {
        out.pp_copy(vector);
    }

    return out;
};

function _findAllEqualOptimized(array, elementToFind, getIndexes) {
    // Adapted from: https:// stackoverflow.com/a/20798567

    let elementsFound = [];
    let index = -1;
    while ((index = array.indexOf(elementToFind, index + 1)) >= 0) {
        elementsFound.push(getIndexes ? index : array[index]);
    }

    return elementsFound;
};

let _quat_setAxes = function () {
    let fixedAxes = [vec3_create(), vec3_create(), vec3_create()];

    let fixedAxesFixSignMap = [
        [1, -1, 1],
        [1, 1, -1],
        [-1, 1, -1]
    ];

    let fixedLeft = vec3_create();
    let fixedUp = vec3_create();
    let fixedForward = vec3_create();

    let currentAxis = vec3_create();

    let rotationAxis = vec3_create();
    let rotationMat = mat3_create();
    let rotationQuat = quat_create();
    return function _quat_setAxes(vector, axes, priority) {
        let firstAxis = axes[priority[0]];
        let secondAxis = axes[priority[1]];
        let thirdAxis = axes[priority[2]];

        if (firstAxis == null || firstAxis.vec3_isZero(Math.PP_EPSILON)) {
            return;
        }

        let secondAxisValid = false;
        if (secondAxis != null) {
            let angleBetween = firstAxis.vec3_angleRadians(secondAxis);
            if (angleBetween > Math.PP_EPSILON) {
                secondAxisValid = true;
            }
        }

        let thirdAxisValid = false;
        if (thirdAxis != null) {
            let angleBetween = firstAxis.vec3_angleRadians(thirdAxis);
            if (angleBetween > Math.PP_EPSILON) {
                thirdAxisValid = true;
            }
        }

        if (secondAxisValid || thirdAxisValid) {
            let crossAxis = null;
            let secondAxisIndex = null;
            let thirdAxisIndex = null;
            if (secondAxisValid) {
                crossAxis = secondAxis;
                secondAxisIndex = 1;
                thirdAxisIndex = 2;
            } else {
                crossAxis = thirdAxis;
                secondAxisIndex = 2;
                thirdAxisIndex = 1;
            }

            let fixSignMap = fixedAxesFixSignMap[priority[0]];

            glMatrix.vec3.cross(fixedAxes[thirdAxisIndex], firstAxis, crossAxis);
            glMatrix.vec3.scale(fixedAxes[thirdAxisIndex], fixedAxes[thirdAxisIndex], fixSignMap[priority[thirdAxisIndex]]);

            glMatrix.vec3.cross(fixedAxes[secondAxisIndex], firstAxis, fixedAxes[thirdAxisIndex]);
            glMatrix.vec3.scale(fixedAxes[secondAxisIndex], fixedAxes[secondAxisIndex], fixSignMap[priority[secondAxisIndex]]);

            glMatrix.vec3.cross(fixedAxes[0], fixedAxes[1], fixedAxes[2]);
            glMatrix.vec3.scale(fixedAxes[0], fixedAxes[0], fixSignMap[priority[0]]);

            glMatrix.vec3.normalize(fixedLeft, fixedAxes[priority.pp_findIndexEqual(0)]);
            glMatrix.vec3.normalize(fixedUp, fixedAxes[priority.pp_findIndexEqual(1)]);
            glMatrix.vec3.normalize(fixedForward, fixedAxes[priority.pp_findIndexEqual(2)]);

            glMatrix.mat3.set(rotationMat,
                fixedLeft[0], fixedLeft[1], fixedLeft[2],
                fixedUp[0], fixedUp[1], fixedUp[2],
                fixedForward[0], fixedForward[1], fixedForward[2]
            );

            glMatrix.quat.fromMat3(rotationQuat, rotationMat);
            glMatrix.quat.normalize(rotationQuat, rotationQuat);

            vector.quat_copy(rotationQuat);
        } else {
            if (priority[0] == 0) {
                vector.quat_getLeft(currentAxis);
            } else if (priority[0] == 1) {
                vector.quat_getUp(currentAxis);
            } else {
                vector.quat_getForward(currentAxis);
            }

            let angleBetween = firstAxis.vec3_angleRadians(currentAxis);
            if (angleBetween > Math.PP_EPSILON) {
                glMatrix.vec3.cross(rotationAxis, currentAxis, firstAxis);
                glMatrix.vec3.normalize(rotationAxis, rotationAxis);
                glMatrix.quat.setAxisAngle(rotationQuat, rotationAxis, angleBetween);

                vector.quat_rotateQuat(rotationQuat, vector);
            }
        }

        return vector;
    };
}();


function _vec2_set(vector, x, y) {
    if (y === undefined) {
        glMatrix.vec2.set(vector, x, x);
    } else {
        glMatrix.vec2.set(vector, x, y);
    }
    return vector;
};

function _vec3_set(vector, x, y, z) {
    if (y === undefined) {
        glMatrix.vec3.set(vector, x, x, x);
    } else {
        glMatrix.vec3.set(vector, x, y, z);
    }
    return vector;
};

function _vec4_set(vector, x, y, z, w) {
    if (y === undefined) {
        glMatrix.vec4.set(vector, x, x, x, x);
    } else {
        glMatrix.vec4.set(vector, x, y, z, w);
    }
    return vector;
};

function _quat_set(vector, x, y, z, w) {
    if (y === undefined) {
        glMatrix.quat.set(vector, x, x, x, x);
    } else {
        glMatrix.quat.set(vector, x, y, z, w);
    }
    return vector;
};

function _quat2_set(vector, x1, y1, z1, w1, x2, y2, z2, w2) {
    if (y1 === undefined) {
        glMatrix.quat2.set(vector, x1, x1, x1, x1, x1, x1, x1, x1);
    } else {
        glMatrix.quat2.set(vector, x1, y1, z1, w1, x2, y2, z2, w2);
    }
    return vector;
}

function _mat3_set(
    vector,
    m00, m01, m02,
    m10, m11, m12,
    m20, m21, m22) {
    if (m01 === undefined) {
        glMatrix.mat3.set(vector,
            m00, m00, m00,
            m00, m00, m00,
            m00, m00, m00);
    } else {
        glMatrix.mat3.set(vector,
            m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22);
    }
    return vector;
}

function _mat4_set(
    vector,
    m00, m01, m02, m03,
    m10, m11, m12, m13,
    m20, m21, m22, m23,
    m30, m31, m32, m33) {
    if (m01 === undefined) {
        glMatrix.mat4.set(vector,
            m00, m00, m00, m00,
            m00, m00, m00, m00,
            m00, m00, m00, m00,
            m00, m00, m00, m00);
    } else {
        glMatrix.mat4.set(vector,
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33);
    }
    return vector;
}
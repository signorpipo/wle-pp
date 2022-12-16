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
            - PP.vec2_create

            - PP.vec3_create

            - PP.vec4_create

            - PP.quat_create

            - PP.quat2_create
            - PP.quat2_fromPositionRotation

            - PP.mat4_create
            - PP.mat4_fromPositionRotation     / PP.mat4_fromPositionRotationScale

        ARRAY:
            - pp_first      / pp_last
            - pp_has        / pp_hasEqual
            - pp_find       / pp_findIndex      / pp_findAll        / pp_findAllIndexes / pp_findEqual      / pp_findAllEqual   / pp_findIndexEqual / pp_findAllIndexesEqual
            ○ pp_remove     / pp_removeIndex    / pp_removeAll      / pp_removeEqual    / pp_removeAllEqual
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
            - vec3_length       / vec3_lengthSigned
            - vec3_distance
            - vec3_add              / vec3_sub              / vec3_mul      / vec3_div      / vec3_scale
            - vec3_transformQuat    / vec3_transformMat4
            - vec3_componentAlongAxis           / vec3_removeComponentAlongAxis / vec3_copyComponentAlongAxis   / vec3_valueAlongAxis  
            - vec3_isConcordant
            - vec3_isFurtherAlongAxis
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

        QUAT:
            ○ quat_set          / quat_copy     / quat_identity
            - quat_clone 
            - quat_normalize    / quat_invert
            - quat_isNormalized
            - quat_length
            - quat_mul
            - quat_getAxis          / quat_getAngle
            - quat_getAxes          / quat_getRight         / quat_getUp    / quat_getForward   / quat_getLeft  / quat_getDown  / quat_getBackward
            ○ quat_setAxes          / quat_setRight         / quat_setUp    / quat_setForward   / quat_setLeft  / quat_setDown  / quat_setBackward
            - quat_toWorld          / quat_toLocal
            - quat_rotate           / quat_rotateAxis  
            - quat_rotationTo     
            ○ quat_fromRadians      / quat_fromDegrees      / quat_fromAxis / quat_fromAxes
            - quat_toRadians        / quat_toDegrees        / quat_toMatrix
            - quat_addRotation      / quat_subRotation
            - quat_lerp             / quat_interpolate      / quat_slerp    / quat_sinterpolate

        QUAT 2:
            ○ quat2_copy        / quat2_identity
            - quat2_normalize
            - quat2_getPosition     / quat2_getRotation
            ○ quat2_setPositionRotation
            - quat2_getAxes     / quat2_getRight    / quat2_getUp   / quat2_getForward  / quat2_getLeft    / quat2_getDown   / quat2_getBackward
            - quat2_toWorld     / quat2_toLocal
            - quat2_toMatrix
            ○ quat2_fromMatrix
            - quat2_lerp        / quat2_interpolate

        MATRIX 3:
            - mat3_toDegrees    / mat3_toRadians    / mat3_toQuat
            - mat3_fromAxes

        MATRIX 4:
            ○ mat4_copy         / mat4_identity
            - mat4_clone
            - mat4_invert
            - mat4_getPosition  / mat4_getRotation  / mat4_getScale
            ○ mat4_setPosition  / mat4_setRotation  / mat4_setScale
            ○ mat4_setPositionRotation      / mat4_setPositionRotationScale
            - mat4_getAxes     / mat4_getRight    / mat4_getUp   / mat4_getForward  / mat4_getLeft    / mat4_getDown   / mat4_getBackward
            - mat4_toWorld      / mat4_toLocal
            - mat4_hasUniformScale
            - mat4_toQuat
            ○ mat4_fromQuat
*/

import * as glMatrix from 'gl-matrix';

//ARRAY

//New Functions

Array.prototype.pp_first = function () {
    return this.length > 0 ? this[0] : undefined;
};

Array.prototype.pp_last = function () {
    return this.length > 0 ? this[this.length - 1] : undefined;
};

Array.prototype.pp_has = function (callback) {
    return this.pp_find(callback) != undefined;
};

Array.prototype.pp_hasEqual = function (elementToFind, elementsEqualCallback = null) {
    return this.pp_findEqual(elementToFind, elementsEqualCallback) != undefined;
};

Array.prototype.pp_find = function (callback) {
    let elementFound = undefined;

    let index = this.findIndex(callback);
    if (index >= 0) {
        elementFound = this[index];
    }

    return elementFound;
};

Array.prototype.pp_findIndex = function (callback) {
    return this.findIndex(callback);
};

Array.prototype.pp_findAll = function (callback) {
    let elementsFound = this.filter(callback);

    return elementsFound;
};

Array.prototype.pp_findAllIndexes = function (callback) {
    let indexes = [];
    for (let i = 0; i < this.length; i++) {
        let element = this[i];
        if (callback(element)) {
            indexes.push(i);
        }
    }
    return indexes;
};

Array.prototype.pp_findEqual = function (elementToFind, elementsEqualCallback = null) {
    if (elementsEqualCallback == null) {
        return this.pp_find(element => element === elementToFind);
    }
    return this.pp_find(element => elementsEqualCallback(element, elementToFind));
};

Array.prototype.pp_findAllEqual = function (elementToFind, elementsEqualCallback = null) {
    if (elementsEqualCallback == null) {
        return this.pp_findAll(element => element === elementToFind);
    }
    return this.pp_findAll(element => elementsEqualCallback(element, elementToFind));
};

Array.prototype.pp_findIndexEqual = function (elementToFind, elementsEqualCallback = null) {
    if (elementsEqualCallback == null) {
        return this.findIndex(element => element === elementToFind);
    }
    return this.findIndex(element => elementsEqualCallback(element, elementToFind));
};

Array.prototype.pp_findAllIndexesEqual = function (elementToFind, elementsEqualCallback = null) {
    if (elementsEqualCallback == null) {
        return this.pp_findAllIndexes(element => element === elementToFind);
    }
    return this.pp_findAllIndexes(element => elementsEqualCallback(element, elementToFind));
};

Array.prototype.pp_removeIndex = function (index) {
    let elementRemoved = undefined;

    if (index >= 0 && index < this.length) {
        let arrayRemoved = this.splice(index, 1);
        if (arrayRemoved.length == 1) {
            elementRemoved = arrayRemoved[0];
        }
    }

    return elementRemoved;
};

Array.prototype.pp_remove = function (callback) {
    let elementRemoved = undefined;

    let index = this.findIndex(callback);
    if (index >= 0) {
        elementRemoved = this.pp_removeIndex(index);
    }

    return elementRemoved;
};

Array.prototype.pp_removeAll = function (callback) {
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

Array.prototype.pp_removeEqual = function (elementToRemove, elementsEqualCallback = null) {
    if (elementsEqualCallback == null) {
        return this.pp_remove(element => element === elementToRemove);
    }
    return this.pp_remove(element => elementsEqualCallback(element, elementToRemove));
};

Array.prototype.pp_removeAllEqual = function (elementToRemove, elementsEqualCallback = null) {
    if (elementsEqualCallback == null) {
        return this.pp_removeAll(element => element === elementToRemove);
    }
    return this.pp_removeAll(element => elementsEqualCallback(element, elementToRemove));
};

Array.prototype.pp_pushUnique = function (element, elementsEqualCallback = null) {
    let length = this.length;

    let hasElement = this.pp_hasEqual(element, elementsEqualCallback);

    if (!hasElement) {
        length = this.push(element);
    }

    return length;
};

Array.prototype.pp_unshiftUnique = function (element, elementsEqualCallback = null) {
    let length = this.length;

    let hasElement = this.pp_hasEqual(element, elementsEqualCallback);

    if (!hasElement) {
        length = this.unshift(element);
    }

    return length;
};

Array.prototype.pp_copy = function (array, copyCallback = null) {
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

Array.prototype.pp_clone = function (cloneCallback = null) {
    if (cloneCallback == null) {
        return this.slice(0);
    }

    let clone = null;
    switch (this.constructor.name) {
        case "Array":
            clone = new Array(this.length);
            break;
        case "Uint32Array":
            clone = new Uint32Array(this.length);
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

Array.prototype.pp_equals = function (array, elementsEqualCallback = null) {
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

Array.prototype.pp_clear = function () {
    this.length = 0;

    return this;
};

// GENERIC VECTOR

//New Functions

Array.prototype.vec_toString = function (decimalPlaces = null) {
    let message = this._vec_buildConsoleMessage(decimalPlaces);
    return message;
};

Array.prototype.vec_log = function (decimalPlaces = 4) {
    let message = this._vec_buildConsoleMessage(decimalPlaces);
    console.log(message);
};

Array.prototype.vec_error = function (decimalPlaces = 4) {
    let message = this._vec_buildConsoleMessage(decimalPlaces);
    console.error(message);
};

Array.prototype.vec_warn = function (decimalPlaces = 4) {
    let message = this._vec_buildConsoleMessage(decimalPlaces);
    console.warn(message);
};

Array.prototype.vec_scale = function (value, out = null) {
    out = this._vec_prepareOut(out);

    for (let i = 0; i < out.length; i++) {
        out[i] = out[i] * value;
    }

    return out;
};

Array.prototype.vec_round = function (out = null) {
    out = this._vec_prepareOut(out);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.round(out[i]);
    }

    return out;
};

Array.prototype.vec_floor = function (out = null) {
    out = this._vec_prepareOut(out);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.floor(out[i]);
    }

    return out;
};

Array.prototype.vec_ceil = function (out = null) {
    out = this._vec_prepareOut(out);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.ceil(out[i]);
    }

    return out;
};

Array.prototype.vec_clamp = function (start, end, out = null) {
    out = this._vec_prepareOut(out);

    let fixedStart = (start != null) ? start : -Number.MAX_VALUE;
    let fixedEnd = (end != null) ? end : Number.MAX_VALUE;
    let min = Math.min(fixedStart, fixedEnd);
    let max = Math.max(fixedStart, fixedEnd);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.min(Math.max(out[i], min), max);
    }

    return out;
};

Array.prototype.vec_equals = function (vector, epsilon = 0) {
    let equals = this.length == vector.length;

    for (let i = 0; i < this.length && equals; i++) {
        equals = equals && (Math.abs(this[i] - vector[i]) <= epsilon);
    }

    return equals;
};

// VECTOR 2

// glMatrix Bridge

Array.prototype.vec2_set = function (x, y = null) {
    if (y == null) {
        glMatrix.vec2.set(this, x, x);
    } else {
        glMatrix.vec2.set(this, x, y);
    }
    return this;
};

Array.prototype.vec2_length = function () {
    return glMatrix.vec2.length(this);
};

Array.prototype.vec2_normalize = function (out = glMatrix.vec2.create()) {
    glMatrix.vec2.normalize(out, this);
    return out;
};

Array.prototype.vec2_copy = function (vector) {
    glMatrix.vec2.copy(this, vector);
    return this;
};

Array.prototype.vec2_clone = function (out = glMatrix.vec2.create()) {
    glMatrix.vec2.copy(out, this);
    return out;
};

Array.prototype.vec2_zero = function () {
    glMatrix.vec2.zero(this);
    return this;
};

// New Functions

Array.prototype.vec2_isZero = function () {
    return this.vec2_length() == 0;
};

// VECTOR 3

// glMatrix Bridge

Array.prototype.vec3_normalize = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.normalize(out, this);
    return out;
};

Array.prototype.vec3_copy = function (vector) {
    glMatrix.vec3.copy(this, vector);
    return this;
};

Array.prototype.vec3_clone = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.copy(out, this);
    return out;
};

Array.prototype.vec3_set = function (x, y = null, z = null) {
    if (y == null) {
        glMatrix.vec3.set(this, x, x, x);
    } else {
        glMatrix.vec3.set(this, x, y, z);
    }
    return this;
};

Array.prototype.vec3_zero = function () {
    glMatrix.vec3.zero(this);
    return this;
};

Array.prototype.vec3_angle = function (vector) {
    return this.vec3_angleDegrees(vector);
};

Array.prototype.vec3_angleDegrees = function (vector) {
    return this.vec3_angleRadians(vector) * (180 / Math.PI);
};

Array.prototype.vec3_angleRadians = function (vector) {
    return (this.vec3_isZero() || vector.vec3_isZero()) ? 0 : glMatrix.vec3.angle(this, vector);
};

Array.prototype.vec3_length = function () {
    return glMatrix.vec3.length(this);
};

Array.prototype.vec3_distance = function (vector) {
    return glMatrix.vec3.dist(this, vector);
};

Array.prototype.vec3_add = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.add(out, this, vector);
    return out;
};

Array.prototype.vec3_sub = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.sub(out, this, vector);
    return out;
};

Array.prototype.vec3_mul = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.mul(out, this, vector);
    return out;
};

Array.prototype.vec3_div = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.div(out, this, vector);
    return out;
};

Array.prototype.vec3_scale = function (value, out = glMatrix.vec3.create()) {
    glMatrix.vec3.scale(out, this, value);
    return out;
};

Array.prototype.vec3_negate = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.negate(out, this);
    return out;
};

Array.prototype.vec3_cross = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.cross(out, this, vector);
    return out;
};

Array.prototype.vec3_transformQuat = function (quat, out = glMatrix.vec3.create()) {
    glMatrix.vec3.transformQuat(out, this, quat);
    return out;
};

Array.prototype.vec3_transformMat4 = function (mat4, out = glMatrix.vec3.create()) {
    glMatrix.vec3.transformMat4(out, this, mat4);
    return out;
};

// New Functions

Array.prototype.vec3_lengthSigned = function (positiveDirection) {
    let signedLength = glMatrix.vec3.length(this);
    if (!this.vec3_isConcordant(positiveDirection)) {
        signedLength *= -1;
    }

    return signedLength;
};

Array.prototype.vec3_angleSigned = function (vector, upAxis) {
    return this.vec3_angleSignedDegrees(vector, upAxis);
};

Array.prototype.vec3_angleSignedDegrees = function (vector, upAxis) {
    return this.vec3_angleSignedRadians(vector, upAxis) * (180 / Math.PI);
};

Array.prototype.vec3_angleSignedRadians = function () {
    let crossAxis = glMatrix.vec3.create();
    return function vec3_angleSignedRadians(vector, upAxis) {
        this.vec3_cross(vector, crossAxis);
        let angle = this.vec3_angleRadians(vector);
        if (!crossAxis.vec3_isConcordant(upAxis)) {
            angle = -angle;
        }

        return angle;
    };
}();

Array.prototype.vec3_toRadians = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, glMatrix.glMatrix.toRadian(this[0]), glMatrix.glMatrix.toRadian(this[1]), glMatrix.glMatrix.toRadian(this[2]));
    return out;
};

Array.prototype.vec3_toDegrees = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, this[0] * (180 / Math.PI), this[1] * (180 / Math.PI), this[2] * (180 / Math.PI));
    return out;
};

Array.prototype.vec3_toQuat = function (out) {
    return this.vec3_degreesToQuat(out);
};

Array.prototype.vec3_radiansToQuat = function (out = glMatrix.quat.create()) {
    out.quat_fromRadians(this);
    return out;
};

Array.prototype.vec3_degreesToQuat = function (out = glMatrix.quat.create()) {
    out.quat_fromDegrees(this);
    return out;
};

Array.prototype.vec3_isNormalized = function () {
    return Math.abs(glMatrix.vec3.length(this) - 1) < this._pp_epsilon;
};

Array.prototype.vec3_isZero = function (epsilon = 0) {
    return this.vec3_length() <= epsilon;
};

Array.prototype.vec3_componentAlongAxis = function (axis, out = glMatrix.vec3.create()) {
    let angle = glMatrix.vec3.angle(this, axis);
    let length = Math.cos(angle) * glMatrix.vec3.length(this);

    glMatrix.vec3.copy(out, axis);
    glMatrix.vec3.scale(out, out, length);
    return out;
};

Array.prototype.vec3_valueAlongAxis = function () {
    let componentAlong = glMatrix.vec3.create();
    return function vec3_valueAlongAxis(axis) {
        this.vec3_componentAlongAxis(axis, componentAlong);
        let value = componentAlong.vec3_length();
        if (!componentAlong.vec3_isConcordant(axis)) {
            value = -value;
        }
        return value;
    };
}();

Array.prototype.vec3_removeComponentAlongAxis = function () {
    let componentAlong = glMatrix.vec3.create();
    return function vec3_removeComponentAlongAxis(axis, out = glMatrix.vec3.create()) {
        this.vec3_componentAlongAxis(axis, componentAlong);
        glMatrix.vec3.sub(out, this, componentAlong);
        return out;
    };
}();

Array.prototype.vec3_copyComponentAlongAxis = function () {
    let componentAlong = glMatrix.vec3.create();
    return function vec3_copyComponentAlongAxis(vector, axis, out = glMatrix.vec3.create()) {
        this.vec3_removeComponentAlongAxis(axis, out);
        vector.vec3_componentAlongAxis(axis, componentAlong);
        out.vec3_add(componentAlong, out);

        return out;
    };
}();

Array.prototype.vec3_isConcordant = function (vector) {
    return glMatrix.vec3.angle(this, vector) <= Math.PI / 2;
};

Array.prototype.vec3_isFurtherAlongAxis = function () {
    let componentAlong = glMatrix.vec3.create();
    return function vec3_isFurtherAlongAxis(vector, axis) {
        let thisAxisLength = this.vec3_componentAlongAxis(axis, componentAlong).vec3_length();
        let thisAxisLengthSigned = this.vec3_isConcordant(axis) ? thisAxisLength : -thisAxisLength;

        let vectorAxisLength = vector.vec3_componentAlongAxis(axis, componentAlong).vec3_length();
        let vectorAxisLengthSigned = vector.vec3_isConcordant(axis) ? vectorAxisLength : -vectorAxisLength;

        return thisAxisLengthSigned > vectorAxisLengthSigned;
    };
}();

Array.prototype.vec3_isToTheRight = function (vector, upAxis) {
    return this.vec3_signTo(vector, upAxis) >= 0;
};

Array.prototype.vec3_signTo = function () {
    let componentAlongThis = glMatrix.vec3.create();
    let componentAlongVector = glMatrix.vec3.create();
    return function vec3_signTo(vector, upAxis, zeroSign = 1) {
        this.vec3_removeComponentAlongAxis(upAxis, componentAlongThis);
        vector.vec3_removeComponentAlongAxis(upAxis, componentAlongVector);

        let angleSigned = this.vec3_angleSigned(vector, upAxis);
        return angleSigned > 0 ? 1 : (angleSigned == 0 ? zeroSign : -1);
    };
}();

Array.prototype.vec3_projectOnAxis = function (axis, out = glMatrix.vec3.create()) {
    this.vec3_componentAlongAxis(axis, out);
    return out;
};

// the result can easily be not 100% exact due to precision errors
Array.prototype.vec3_projectOnAxisAlongAxis = function () {
    let up = glMatrix.vec3.create();

    let thisToAxis = glMatrix.vec3.create();

    let fixedProjectAlongAxis = glMatrix.vec3.create();
    return function vec3_projectOnAxisAlongAxis(axis, projectAlongAxis, out = glMatrix.vec3.create()) {

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

                out.vec3_projectOnAxis(axis, out); // snap on the axis, due to float precision error
            }
        }

        return out;
    };
}();

Array.prototype.vec3_projectOnPlane = function (planeNormal, out = glMatrix.vec3.create()) {
    this.vec3_removeComponentAlongAxis(planeNormal, out);
    return out;
};

// the result can easily be not 100% exact due to precision errors
Array.prototype.vec3_projectOnPlaneAlongAxis = function () {
    let thisToPlane = glMatrix.vec3.create();

    let fixedProjectAlongAxis = glMatrix.vec3.create();
    return function vec3_projectOnPlaneAlongAxis(planeNormal, projectAlongAxis, out = glMatrix.vec3.create()) {
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

            out.vec3_projectOnPlane(planeNormal, out); // snap on the axis, due to float precision error
        }

        return out;
    };
}();

Array.prototype.vec3_isOnAxis = function (axis) {
    let angle = this.vec3_angle(axis);
    return Math.abs(angle) < this._pp_degreesEpsilon || Math.abs(angle - 180) < this._pp_degreesEpsilon;
};

Array.prototype.vec3_isOnPlane = function (planeNormal) {
    let angle = this.vec3_angle(planeNormal);
    return Math.abs(angle - 90) < this._pp_degreesEpsilon;
};

Array.prototype.vec3_rotate = function (rotation, out) {
    return this.vec3_rotateDegrees(rotation, out);
};

Array.prototype.vec3_rotateDegrees = function () {
    let zero = glMatrix.vec3.create();
    return function vec3_rotateDegrees(rotation, out) {
        return this.vec3_rotateAroundDegrees(rotation, zero, out);
    };
}();

Array.prototype.vec3_rotateRadians = function () {
    let zero = glMatrix.vec3.create();
    return function vec3_rotateRadians(rotation, out) {
        return this.vec3_rotateAroundRadians(rotation, zero, out);
    };
}();

Array.prototype.vec3_rotateQuat = function () {
    let zero = glMatrix.vec3.create();
    return function vec3_rotateQuat(rotation, out) {
        return this.vec3_rotateAroundQuat(rotation, zero, out);
    };
}();

Array.prototype.vec3_rotateAxis = function (angle, axis, out) {
    return this.vec3_rotateAxisDegrees(angle, axis, out);
};

Array.prototype.vec3_rotateAxisDegrees = function () {
    let zero = glMatrix.vec3.create();
    return function vec3_rotateAxisDegrees(angle, axis, out) {
        return this.vec3_rotateAroundAxisDegrees(angle, axis, zero, out);
    };
}();

Array.prototype.vec3_rotateAxisRadians = function () {
    let zero = glMatrix.vec3.create();
    return function vec3_rotateAxisRadians(angle, axis, out) {
        return this.vec3_rotateAroundAxisRadians(angle, axis, zero, out);
    };
}();

Array.prototype.vec3_rotateAround = function (rotation, origin, out) {
    return this.vec3_rotateAroundDegrees(rotation, origin, out);
};

Array.prototype.vec3_rotateAroundDegrees = function () {
    let quat = glMatrix.quat.create();
    return function vec3_rotateAroundDegrees(rotation, origin, out = glMatrix.vec3.create()) {
        rotation.vec3_degreesToQuat(quat);
        return this.vec3_rotateAroundQuat(quat, origin, out);
    };
}();

Array.prototype.vec3_rotateAroundRadians = function () {
    let quat = glMatrix.quat.create();
    return function vec3_rotateAroundRadians(rotation, origin, out = glMatrix.vec3.create()) {
        rotation.vec3_radiansToQuat(quat);
        return this.vec3_rotateAroundQuat(quat, origin, out);
    };
}();

Array.prototype.vec3_rotateAroundQuat = function (rotation, origin, out = glMatrix.vec3.create()) {
    glMatrix.vec3.sub(out, this, origin);
    glMatrix.vec3.transformQuat(out, out, rotation);
    glMatrix.vec3.add(out, out, origin);
    return out;
};

Array.prototype.vec3_rotateAroundAxis = function (angle, axis, origin, out) {
    return this.vec3_rotateAroundAxisDegrees(angle, axis, origin, out);
};

Array.prototype.vec3_rotateAroundAxisDegrees = function (angle, axis, origin, out) {
    return this.vec3_rotateAroundAxisRadians(glMatrix.glMatrix.toRadian(angle), axis, origin, out);
};

Array.prototype.vec3_rotateAroundAxisRadians = function () {
    let quat = glMatrix.quat.create();
    return function vec3_rotateAroundAxisRadians(angle, axis, origin, out = glMatrix.vec3.create()) {
        glMatrix.quat.setAxisAngle(quat, axis, angle);
        return this.vec3_rotateAroundQuat(quat, origin, out);
    };
}();

Array.prototype.vec3_convertPositionToWorld = function (parentTransform, out) {
    return this.vec3_convertPositionToWorldMatrix(parentTransform, out);
};

Array.prototype.vec3_convertPositionToLocal = function (parentTransform, out) {
    return this.vec3_convertPositionToLocalMatrix(parentTransform, out);
};

Array.prototype.vec3_convertPositionToWorldMatrix = function (parentTransform, out = glMatrix.vec3.create()) {
    glMatrix.vec3.transformMat4(out, this, parentTransform);
    return out;
};

Array.prototype.vec3_convertPositionToLocalMatrix = function () {
    let inverse = glMatrix.mat4.create();
    return function vec3_convertPositionToLocalMatrix(parentTransform, out = glMatrix.vec3.create()) {
        glMatrix.mat4.invert(inverse, parentTransform);
        glMatrix.vec3.transformMat4(out, this, inverse);
        return out;
    };
}();

Array.prototype.vec3_convertPositionToWorldQuat = function () {
    let parentTransformMatrix = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function vec3_convertPositionToWorldQuat(parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getPosition(position);
        parentTransform.quat2_getRotationQuat(rotation);
        parentTransformMatrix.mat4_setPositionRotationQuatScale(position, rotation, one);
        return this.vec3_convertPositionToWorldMatrix(parentTransformMatrix, out);
    };
}();

Array.prototype.vec3_convertPositionToLocalQuat = function () {
    let parentTransformMatrix = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function vec3_convertPositionToLocalQuat(parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getPosition(position);
        parentTransform.quat2_getRotationQuat(rotation);
        parentTransformMatrix.mat4_setPositionRotationQuatScale(position, rotation, one);
        return this.vec3_convertPositionToLocalMatrix(parentTransformMatrix, out);
    };
}();

Array.prototype.vec3_convertDirectionToWorld = function (parentTransform, out) {
    return this.vec3_convertDirectionToWorldMatrix(parentTransform, out);
};

Array.prototype.vec3_convertDirectionToLocal = function (parentTransform, out) {
    return this.vec3_convertDirectionToLocalMatrix(parentTransform, out);
};

Array.prototype.vec3_convertDirectionToWorldMatrix = function () {
    let rotation = glMatrix.quat.create();
    return function vec3_convertDirectionToWorldMatrix(parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.mat4_getRotationQuat(rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

Array.prototype.vec3_convertDirectionToLocalMatrix = function () {
    let rotation = glMatrix.quat.create();
    return function vec3_convertDirectionToLocalMatrix(parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.mat4_getRotationQuat(rotation);
        glMatrix.quat.conjugate(rotation, rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();


Array.prototype.vec3_convertDirectionToWorldQuat = function () {
    let rotation = glMatrix.quat.create();
    return function vec3_convertDirectionToWorldQuat(parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getRotationQuat(rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

Array.prototype.vec3_convertDirectionToLocalQuat = function () {
    let rotation = glMatrix.quat.create();
    return function vec3_convertDirectionToLocalQuat(parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getRotationQuat(rotation);
        glMatrix.quat.conjugate(rotation, rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

Array.prototype.vec3_log = function (decimalPlaces = 4) {
    this.vec_log(decimalPlaces);
};

Array.prototype.vec3_error = function (decimalPlaces = 4) {
    this.vec_error(decimalPlaces);
};

Array.prototype.vec3_warn = function (decimalPlaces = 4) {
    this.vec_warn(decimalPlaces);
};

Array.prototype.vec3_addRotation = function (rotation, out) {
    return this.vec3_degreesAddRotation(rotation, out);
};

Array.prototype.vec3_addRotationDegrees = function (rotation, out) {
    return quat.vec3_degreesAddRotationDegrees(rotation, out);
};

Array.prototype.vec3_addRotationRadians = function (rotation, out) {
    return quat.vec3_degreesAddRotationRadians(rotation, out);
};

Array.prototype.vec3_addRotationQuat = function (rotation, out) {
    return quat.vec3_degreesAddRotationQuat(rotation, out);
};

Array.prototype.vec3_degreesAddRotation = function (rotation, out) {
    return this.vec3_degreesAddRotationDegrees(rotation, out);
};

Array.prototype.vec3_degreesAddRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function vec3_degreesAddRotationDegrees(rotation, out = glMatrix.vec3.create()) {
        this.vec3_degreesToQuat(quat);
        return quat.quat_addRotationDegrees(rotation, quat).quat_toDegrees(out);
    };
}();

Array.prototype.vec3_degreesAddRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function vec3_degreesAddRotationRadians(rotation, out = glMatrix.vec3.create()) {
        this.vec3_degreesToQuat(quat);
        return quat.quat_addRotationRadians(rotation, quat).quat_toDegrees(out);
    };
}();

Array.prototype.vec3_degreesAddRotationQuat = function () {
    let quat = glMatrix.quat.create();
    return function vec3_degreesAddRotationQuat(rotation, out = glMatrix.vec3.create()) {
        this.vec3_degreesToQuat(quat);
        return quat.quat_addRotationQuat(rotation, quat).quat_toDegrees(out);
    };
}();

Array.prototype.vec3_radiansAddRotation = function (rotation, out) {
    return this.vec3_radiansAddRotationDegrees(rotation, out);
};

Array.prototype.vec3_radiansAddRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function vec3_radiansAddRotationDegrees(rotation, out = glMatrix.vec3.create()) {
        this.vec3_radiansToQuat(quat);
        return quat.quat_addRotationDegrees(rotation, quat).quat_toRadians(out);
    };
}();

Array.prototype.vec3_radiansAddRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function vec3_radiansAddRotationRadians(rotation, out = glMatrix.vec3.create()) {
        this.vec3_radiansToQuat(quat);
        return quat.quat_addRotationRadians(rotation, quat).quat_toRadians(out);
    };
}();

Array.prototype.vec3_radiansAddRotationQuat = function () {
    let quat = glMatrix.quat.create();
    return function vec3_radiansAddRotationQuat(rotation, out = glMatrix.vec3.create()) {
        this.vec3_radiansToQuat(quat);
        return quat.quat_addRotationQuat(rotation, quat).quat_toRadians(out);
    };
}();

Array.prototype.vec3_toMatrix = function (out = glMatrix.mat3.create()) {
    return this.vec3_degreesToMatrix(out);
};

Array.prototype.vec3_degreesToMatrix = function () {
    let quat = glMatrix.quat.create();
    return function vec3_degreesToMatrix(out = glMatrix.mat3.create()) {
        this.vec3_degreesToQuat(quat);
        return quat.quat_toMatrix(out);
    };
}();

Array.prototype.vec3_radiansToMatrix = function () {
    let quat = glMatrix.quat.create();
    return function vec3_radiansToMatrix(out = glMatrix.mat3.create()) {
        this.vec3_radiansToQuat(quat);
        return quat.quat_toMatrix(out);
    };
}();

Array.prototype.vec3_rotationTo = function (direction, out) {
    return this.vec3_rotationToDegrees(direction, out);
};

Array.prototype.vec3_rotationToDegrees = function () {
    let rotationQuat = glMatrix.quat.create();
    return function vec3_rotationToDegrees(direction, out = glMatrix.vec3.create()) {
        this.vec3_rotationToQuat(direction, rotationQuat);
        rotationQuat.quat_toDegrees(out);
        return out;
    };
}();

Array.prototype.vec3_rotationToRadians = function () {
    let rotationQuat = glMatrix.quat.create();
    return function vec3_rotationToRadians(direction, out = glMatrix.vec3.create()) {
        this.vec3_rotationToQuat(direction, rotationQuat);
        rotationQuat.quat_toRadians(out);
        return out;
    };
}();

Array.prototype.vec3_rotationToQuat = function () {
    let rotationAxis = glMatrix.vec3.create();
    return function vec3_rotationToQuat(direction, out = glMatrix.quat.create()) {
        this.vec3_cross(direction, rotationAxis);
        rotationAxis.vec3_normalize(rotationAxis);
        let signedAngle = this.vec3_angleSigned(direction, rotationAxis);
        out.quat_fromAxis(signedAngle, rotationAxis);
        out.quat_normalize(out);
        return out;
    };
}();

Array.prototype.vec3_rotationToPivoted = function (direction, pivotAxis, out) {
    return this.vec3_rotationToPivotedDegrees(direction, pivotAxis, out);
};

Array.prototype.vec3_rotationToPivotedDegrees = function () {
    let rotationQuat = glMatrix.quat.create();
    return function vec3_rotationToPivotedDegrees(direction, pivotAxis, out = glMatrix.vec3.create()) {
        this.vec3_rotationToPivotedQuat(direction, pivotAxis, rotationQuat);
        rotationQuat.quat_toDegrees(out);
        return out;
    };
}();

Array.prototype.vec3_rotationToPivotedRadians = function () {
    let rotationQuat = glMatrix.quat.create();
    return function vec3_rotationToPivotedRadians(direction, pivotAxis, out = glMatrix.vec3.create()) {
        this.vec3_rotationToPivotedQuat(direction, pivotAxis, rotationQuat);
        rotationQuat.quat_toRadians(out);
        return out;
    };
}();

Array.prototype.vec3_rotationToPivotedQuat = function () {
    let thisFlat = glMatrix.vec3.create();
    let directionFlat = glMatrix.vec3.create();
    let rotationAxis = glMatrix.vec3.create();
    return function vec3_rotationToPivotedQuat(direction, pivotAxis, out = glMatrix.quat.create()) {
        this.vec3_removeComponentAlongAxis(pivotAxis, thisFlat);
        direction.vec3_removeComponentAlongAxis(pivotAxis, directionFlat);

        thisFlat.vec3_cross(directionFlat, rotationAxis);
        rotationAxis.vec3_normalize(rotationAxis);
        let signedAngle = thisFlat.vec3_angleSigned(directionFlat, rotationAxis);
        out.quat_fromAxis(signedAngle, rotationAxis);
        out.quat_normalize(out);
        return out;
    };
}();

Array.prototype.vec3_lerp = function (to, interpolationValue, out = glMatrix.vec3.create()) {
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

Array.prototype.vec3_interpolate = function (to, interpolationValue, easingFunction = PP.EasingFunction.linear, out = glMatrix.vec3.create()) {
    let lerpValue = easingFunction(interpolationValue);
    return this.vec3_lerp(to, lerpValue, out);
};

// VECTOR 4

// glMatrix Bridge

Array.prototype.vec4_set = function (x, y = null, z = null, w = null) {
    if (y == null) {
        glMatrix.vec4.set(this, x, x, x, x);
    } else {
        glMatrix.vec4.set(this, x, y, z, w);
    }
    return this;
};

Array.prototype.vec4_copy = function (vector) {
    glMatrix.vec4.copy(this, vector);
    return this;
};

//QUAT

// glMatrix Bridge

Array.prototype.quat_normalize = function (out = glMatrix.quat.create()) {
    glMatrix.quat.normalize(out, this);
    return out;
};

Array.prototype.quat_copy = function (quat) {
    glMatrix.quat.copy(this, quat);
    return this;
};

Array.prototype.quat_clone = function (out = glMatrix.quat.create()) {
    glMatrix.quat.copy(out, this);
    return out;
};

Array.prototype.quat_set = function (x, y = null, z = null, w = null) {
    if (y == null) {
        glMatrix.quat.set(this, x, x, x, x);
    } else {
        glMatrix.quat.set(this, x, y, z, w);
    }
    return this;
};

Array.prototype.quat_identity = function () {
    glMatrix.quat.identity(this);
    return this;
};

Array.prototype.quat_length = function () {
    return glMatrix.quat.length(this);
};

Array.prototype.quat_invert = function (out = glMatrix.quat.create()) {
    glMatrix.quat.invert(out, this);
    return out;
};

Array.prototype.quat_mul = function (rotation, out = glMatrix.quat.create()) {
    glMatrix.quat.mul(out, this, rotation);
    return out;
};

Array.prototype.quat_getAxis = function (out = glMatrix.vec3.create()) {
    glMatrix.quat.getAxisAngle(out, this);
    return out;
};

Array.prototype.quat_getAngle = function () {
    return this.quat_getAngleDegrees();
};


Array.prototype.quat_getAngleDegrees = function () {
    let angle = this.quat_getAngleRadians();
    return angle * (180 / Math.PI);
};

Array.prototype.quat_getAngleRadians = function () {
    let vector = glMatrix.vec3.create();
    return function quat_getAngleRadians() {
        let angle = glMatrix.quat.getAxisAngle(vector, this);
        return angle;
    };
}();

Array.prototype.quat_getAxes = function (out = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()]) {
    this.quat_getLeft(out[0]);
    this.quat_getUp(out[1]);
    this.quat_getForward(out[2]);

    return out;
};

Array.prototype.quat_getForward = function () {
    let rotationMatrix = glMatrix.mat3.create();
    return function quat_getForward(out = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(rotationMatrix, this);

        glMatrix.vec3.set(out, rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);
        glMatrix.vec3.normalize(out, out);

        return out;
    };
}();

Array.prototype.quat_getBackward = function (out) {
    out = this.quat_getForward(out);
    out.vec3_negate(out);
    return out;
};

Array.prototype.quat_getLeft = function () {
    let rotationMatrix = glMatrix.mat3.create();
    return function quat_getLeft(out = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(rotationMatrix, this);

        glMatrix.vec3.set(out, rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);
        glMatrix.vec3.normalize(out, out);

        return out;
    };
}();

Array.prototype.quat_getRight = function (out) {
    out = this.quat_getLeft(out);
    out.vec3_negate(out);
    return out;
};

Array.prototype.quat_getUp = function () {
    let rotationMatrix = glMatrix.mat3.create();
    return function quat_getUp(out = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(rotationMatrix, this);

        glMatrix.vec3.set(out, rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);
        glMatrix.vec3.normalize(out, out);

        return out;
    };
}();

Array.prototype.quat_getDown = function (out) {
    out = this.quat_getUp(out);
    out.vec3_negate(out);
    return out;
};

Array.prototype.quat_setAxes = function (left, up, forward) {
    if (forward != null) {
        return this.quat_setForward(forward, up, left);
    } else if (up != null) {
        return this.quat_setUp(up, forward, left);
    } else {
        return this.quat_setLeft(left, up, forward);
    }
};

Array.prototype.quat_setForward = function (forward, up = null, left = null) {
    return this._quat_setAxes([left, up, forward], [2, 1, 0]);
};

Array.prototype.quat_setBackward = function () {
    let forward = glMatrix.vec3.create();
    return function quat_setBackward(backward, up = null, left = null) {
        backward.vec3_negate(forward);
        return this._quat_setAxes([left, up, forward], [2, 1, 0]);
    };
}();

Array.prototype.quat_setUp = function (up, forward = null, left = null) {
    return this._quat_setAxes([left, up, forward], [1, 2, 0]);
};

Array.prototype.quat_setDown = function () {
    let up = glMatrix.vec3.create();
    return function quat_setDown(down, forward = null, left = null) {
        down.vec3_negate(up);
        return this._quat_setAxes([left, up, forward], [1, 2, 0]);
    };
}();

Array.prototype.quat_setLeft = function (left, up = null, forward = null) {
    return this._quat_setAxes([left, up, forward], [0, 1, 2]);
};

Array.prototype.quat_setRight = function () {
    let left = glMatrix.vec3.create();
    return function quat_setRight(right, up = null, forward = null) {
        right.vec3_negate(left);
        return this._quat_setAxes([left, up, forward], [0, 1, 2]);
    };
}();

Array.prototype.quat_toWorld = function (parentQuat, out = glMatrix.quat.create()) {
    glMatrix.quat.mul(out, parentQuat, this);
    return out;
};

Array.prototype.quat_toLocal = function () {
    let invertQuat = glMatrix.quat.create();
    return function quat_toLocal(parentQuat, out = glMatrix.quat.create()) {
        glMatrix.quat.conjugate(invertQuat, parentQuat);
        glMatrix.quat.mul(out, invertQuat, this);
        return out;
    };
}();

Array.prototype.quat_fromAxis = function (angle, axis) {
    return this.quat_fromAxisDegrees(angle, axis);
};

Array.prototype.quat_fromAxisDegrees = function (angle, axis) {
    glMatrix.quat.setAxisAngle(this, axis, glMatrix.glMatrix.toRadian(angle));
    return this;
};

Array.prototype.quat_fromAxisRadians = function (angle, axis) {
    glMatrix.quat.setAxisAngle(this, axis, angle);
    return this;
};

Array.prototype.quat_fromAxes = function () {
    let mat3 = glMatrix.mat3.create();
    return function quat_fromAxes(leftAxis, upAxis, forwardAxis) {
        mat3.mat3_fromAxes(leftAxis, upAxis, forwardAxis);
        return mat3.mat3_toQuat(this);
    };
}();

// New Functions

Array.prototype.quat_fromRadians = function () {
    let vector = glMatrix.vec3.create();
    return function quat_fromRadians(radiansRotation) {
        radiansRotation.vec3_toDegrees(vector);
        return this.quat_fromDegrees(vector);
    };
}();

Array.prototype.quat_fromDegrees = function (degreesRotation) {
    glMatrix.quat.fromEuler(this, degreesRotation[0], degreesRotation[1], degreesRotation[2]);
    return this;
};

Array.prototype.quat_toRadians = function () {
    let mat3 = glMatrix.mat3.create();
    return function quat_toRadians(out = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(mat3, this);

        //Rotation order is ZYX 
        out[1] = Math.asin(-this._pp_clamp(mat3[2], -1, 1));

        if (Math.abs(mat3[2]) < (1 - this._pp_epsilon)) {
            out[0] = Math.atan2(mat3[5], mat3[8]);
            out[2] = Math.atan2(mat3[1], mat3[0]);
        } else {
            out[0] = 0;
            out[2] = Math.atan2(-mat3[3], mat3[4]);
        }

        return out;
    };
}();

Array.prototype.quat_toDegrees = function (out = glMatrix.vec3.create()) {
    this.quat_toRadians(out);
    out.vec3_toDegrees(out);
    return out;
};

Array.prototype.quat_isNormalized = function () {
    return Math.abs(glMatrix.quat.length(this) - 1) < this._pp_epsilon;
};

Array.prototype.quat_addRotation = function (rotation, out) {
    return this.quat_addRotationDegrees(rotation, out);
};

Array.prototype.quat_addRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function quat_addRotationDegrees(rotation, out) {
        rotation.vec3_degreesToQuat(quat);
        return this.quat_addRotationQuat(quat, out);
    };
}();

Array.prototype.quat_addRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function quat_addRotationRadians(rotation, out) {
        rotation.vec3_radiansToQuat(quat);
        return this.quat_addRotationQuat(quat, out);
    };
}();

Array.prototype.quat_addRotationQuat = function (rotation, out = glMatrix.quat.create()) {
    rotation.quat_mul(this, out);
    return out;
};

Array.prototype.quat_subRotation = function (rotation, out) {
    return this.quat_subRotationDegrees(rotation, out);
};

Array.prototype.quat_subRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function quat_subRotationDegrees(rotation, out) {
        rotation.vec3_degreesToQuat(quat);
        return this.quat_subRotationQuat(quat, out);
    };
}();

Array.prototype.quat_subRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function quat_subRotationRadians(rotation, out) {
        rotation.vec3_radiansToQuat(quat);
        return this.quat_subRotationQuat(quat, out);
    };
}();

Array.prototype.quat_subRotationQuat = function () {
    let inverse = glMatrix.quat.create();
    return function quat_subRotationQuat(rotation, out = glMatrix.quat.create()) {
        rotation.quat_invert(inverse);
        this.quat_mul(inverse, out);
        out.quat_normalize(out);
        return out;
    };
}();

Array.prototype.quat_rotationTo = function (quat, out) {
    return this.quat_rotationToDegrees(quat, out);
};

Array.prototype.quat_rotationToDegrees = function () {
    let rotationQuat = glMatrix.quat.create();
    return function quat_rotationToDegrees(quat, out) {
        this.quat_rotationToQuat(quat, rotationQuat);
        return rotationQuat.quat_toDegrees(out);
    };
}();

Array.prototype.quat_rotationToRadians = function () {
    let rotationQuat = glMatrix.quat.create();
    return function quat_rotationToRadians(quat, out) {
        this.quat_rotationToQuat(quat, rotationQuat);
        return rotationQuat.quat_toRadians(out);
    };
}();

Array.prototype.quat_rotationToQuat = function (quat, out) {
    return quat.quat_subRotationQuat(this, out);
};

Array.prototype.quat_toMatrix = function (out = glMatrix.mat3.create()) {
    glMatrix.mat3.fromQuat(out, this);
    return out;
};

Array.prototype.quat_rotate = function (rotation, out) {
    return this.quat_rotateDegrees(rotation, out);
};

Array.prototype.quat_rotateDegrees = function (rotation, out) {
    return this.quat_addRotationDegrees(rotation, out);
};

Array.prototype.quat_rotateRadians = function (rotation, out) {
    return this.quat_addRotationRadians(rotation, out);
};

Array.prototype.quat_rotateQuat = function (rotation, out) {
    return this.quat_addRotationQuat(rotation, out);
};

Array.prototype.quat_rotateAxis = function (angle, axis, out) {
    return this.quat_rotateAxisDegrees(angle, axis, out);
};

Array.prototype.quat_rotateAxisDegrees = function () {
    let rotationQuat = glMatrix.quat.create();
    return function quat_rotateAxisDegrees(angle, axis, out) {
        rotationQuat.quat_fromAxisDegrees(angle, axis);
        return this.quat_rotateQuat(rotationQuat, out);
    };
}();

Array.prototype.quat_rotateAxisRadians = function () {
    let rotationQuat = glMatrix.quat.create();
    return function quat_rotateAxisRadians(angle, axis, out) {
        rotationQuat.quat_fromAxisRadians(angle, axis);
        return this.quat_rotateQuat(rotationQuat, out);
    };
}();

Array.prototype.quat_lerp = function (to, interpolationValue, out = glMatrix.quat.create()) {
    if (interpolationValue <= 0) {
        out.quat_copy(this);
        return out;
    } else if (interpolationValue >= 1) {
        out.quat_copy(to);
        return out;
    }

    glMatrix.quat.lerp(out, this, to, interpolationValue);
    out.quat_normalize(out);
    return out;
};

Array.prototype.quat_interpolate = function (to, interpolationValue, easingFunction = PP.EasingFunction.linear, out = glMatrix.quat.create()) {
    let lerpValue = easingFunction(interpolationValue);
    return this.quat_lerp(to, lerpValue, out);
};

Array.prototype.quat_slerp = function (to, interpolationValue, out = glMatrix.quat.create()) {
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

Array.prototype.quat_sinterpolate = function (to, interpolationValue, easingFunction = PP.EasingFunction.linear, out = glMatrix.quat.create()) {
    let lerpValue = easingFunction(interpolationValue);
    return this.quat_slerp(to, lerpValue, out);
};

//QUAT 2

// glMatrix Bridge

Array.prototype.quat2_normalize = function (out = glMatrix.quat2.create()) {
    glMatrix.quat2.normalize(out, this);
    return out;
};

Array.prototype.quat2_copy = function (quat2) {
    glMatrix.quat2.copy(this, quat2);
    return this;
};

Array.prototype.quat2_identity = function () {
    glMatrix.quat2.identity(this);
    return this;
};

Array.prototype.quat2_getPosition = function (out = glMatrix.vec3.create()) {
    glMatrix.quat2.getTranslation(out, this);
    return out;
};

Array.prototype.quat2_getRotation = function (out) {
    return this.quat2_getRotationDegrees(out);
};
Array.prototype.quat2_getRotationDegrees = function () {
    let rotationQuat = glMatrix.quat.create();
    return function quat2_getRotationDegrees(out = glMatrix.vec3.create()) {
        this.quat2_getRotationQuat(rotationQuat).quat_toDegrees(out);
        return out;
    };
}();

Array.prototype.quat2_getRotationRadians = function () {
    let rotationQuat = glMatrix.quat.create();
    return function quat2_getRotationRadians(out = glMatrix.vec3.create()) {
        this.quat2_getRotationQuat(rotationQuat).quat_toRadians(out);
        return out;
    };
}();

Array.prototype.quat2_getRotationQuat = function (out = glMatrix.quat.create()) {
    glMatrix.quat.copy(out, this);
    return out;
};

Array.prototype.quat2_setPositionRotation = function (position, rotation) {
    return this.quat2_setPositionRotationDegrees(position, rotation);
};

Array.prototype.quat2_setPositionRotationDegrees = function () {
    let rotationQuat = glMatrix.quat.create();
    return function quat2_setPositionRotationDegrees(position, rotation) {
        rotation.vec3_degreesToQuat(rotationQuat);
        glMatrix.quat2.fromRotationTranslation(this, rotationQuat, position);

        return this;
    };
}();

Array.prototype.quat2_setPositionRotationRadians = function () {
    let rotationQuat = glMatrix.quat.create();
    return function quat2_setPositionRotationRadians(position, rotation) {
        rotation.vec3_radiansToQuat(rotationQuat);
        glMatrix.quat2.fromRotationTranslation(this, rotationQuat, position);

        return this;
    };
}();

Array.prototype.quat2_setPositionRotationQuat = function (position, rotation) {
    glMatrix.quat2.fromRotationTranslation(this, rotation, position);
    return this;
};

// New Functions

Array.prototype.quat2_getAxes = function (out = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()]) {
    this.quat2_getLeft(out[0]);
    this.quat2_getUp(out[1]);
    this.quat2_getForward(out[2]);

    return out;
};

Array.prototype.quat2_getForward = function () {
    let rotationMatrix = glMatrix.mat3.create();
    return function quat2_getForward(out = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(rotationMatrix, this);

        glMatrix.vec3.set(out, rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);
        glMatrix.vec3.normalize(out, out);

        return out;
    };
}();

Array.prototype.quat2_getBackward = function (out) {
    out = this.quat2_getForward(out);
    out.vec3_negate(out);
    return out;
};

Array.prototype.quat2_getLeft = function () {
    let rotationMatrix = glMatrix.mat3.create();
    return function quat2_getLeft(out = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(rotationMatrix, this);

        glMatrix.vec3.set(out, rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);
        glMatrix.vec3.normalize(out, out);

        return out;
    };
}();

Array.prototype.quat2_getRight = function (out) {
    out = this.quat2_getLeft(out);
    out.vec3_negate(out);
    return out;
};

Array.prototype.quat2_getUp = function () {
    let rotationMatrix = glMatrix.mat3.create();
    return function quat2_getUp(out = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(rotationMatrix, this);

        glMatrix.vec3.set(out, rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);
        glMatrix.vec3.normalize(out, out);

        return out;
    };
}();

Array.prototype.quat2_getDown = function (out) {
    out = this.quat2_getUp(out);
    out.vec3_negate(out);
    return out;
};

Array.prototype.quat2_toWorld = function (parentTransformQuat, out = glMatrix.quat2.create()) {
    glMatrix.quat2.mul(out, parentTransformQuat, this);
    return out;
};

Array.prototype.quat2_toLocal = function () {
    let invertQuat = glMatrix.quat2.create();
    return function quat2_toLocal(parentTransformQuat, out = glMatrix.quat2.create()) {
        glMatrix.quat2.conjugate(invertQuat, parentTransformQuat);
        glMatrix.quat2.mul(out, invertQuat, this);
        return out;
    };
}();

Array.prototype.quat2_toMatrix = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.fromQuat2(out, this);
    return out;
};

Array.prototype.quat2_fromMatrix = function (transformMatrix) {
    transformMatrix.mat4_toQuat(this);
    return this;
};

Array.prototype.quat2_lerp = function (to, interpolationValue, out = glMatrix.quat2.create()) {
    if (interpolationValue <= 0) {
        out.quat2_copy(this);
        return out;
    } else if (interpolationValue >= 1) {
        out.quat2_copy(to);
        return out;
    }

    glMatrix.quat2.lerp(out, this, to, interpolationValue);
    out.quat2_normalize(out);
    return out;
};

Array.prototype.quat2_interpolate = function (to, interpolationValue, easingFunction = PP.EasingFunction.linear, out = glMatrix.quat2.create()) {
    let lerpValue = easingFunction(interpolationValue);
    return this.quat2_lerp(to, lerpValue, out);
};

//MATRIX 3

// glMatrix Bridge

// New Functions

Array.prototype.mat3_toDegrees = function () {
    let quat = glMatrix.quat.create();
    return function mat3_toDegrees(out = glMatrix.vec3.create()) {
        this.mat3_toQuat(quat);
        quat.quat_toDegrees(out);
        return out;
    };
}();

Array.prototype.mat3_toRadians = function () {
    let quat = glMatrix.quat.create();
    return function mat3_toRadians(out = glMatrix.vec3.create()) {
        this.mat3_toQuat(quat);
        quat.quat_toRadians(out);
        return out;
    };
}();

Array.prototype.mat3_toQuat = function (out = glMatrix.quat.create()) {
    glMatrix.quat.fromMat3(out, this);
    out.quat_normalize(out);
    return out;
};

Array.prototype.mat3_fromAxes = function (leftAxis, upAxis, forwardAxis) {
    glMatrix.mat3.set(this,
        leftAxis[0], leftAxis[1], leftAxis[2],
        upAxis[0], upAxis[1], upAxis[2],
        forwardAxis[0], forwardAxis[1], forwardAxis[2]);
    return this;
};

//MATRIX 4

// glMatrix Bridge

Array.prototype.mat4_copy = function (mat4) {
    glMatrix.mat4.copy(this, mat4);
    return this;
};

Array.prototype.mat4_identity = function () {
    glMatrix.mat4.identity(this);
    return this;
};

Array.prototype.mat4_invert = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.invert(out, this);
    return out;
};

Array.prototype.mat4_clone = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.copy(out, this);
    return out;
};

Array.prototype.mat4_getPosition = function (out = glMatrix.vec3.create()) {
    glMatrix.mat4.getTranslation(out, this);
    return out;
};

Array.prototype.mat4_getRotation = function (out = glMatrix.vec3.create()) {
    return this.mat4_getRotationDegrees(out);
};

Array.prototype.mat4_getRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function mat4_getRotationDegrees(out = glMatrix.vec3.create()) {
        this.mat4_getRotationQuat(quat);
        quat.quat_toDegrees(out);
        return out;
    };
}();

Array.prototype.mat4_getRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function mat4_getRotationRadians(out = glMatrix.vec3.create()) {
        this.mat4_getRotationQuat(quat);
        quat.quat_toRadians(out);
        return out;
    };
}();

Array.prototype.mat4_getRotationQuat = function () {
    let scale = glMatrix.vec3.create();
    let transformMatrixNoScale = glMatrix.mat4.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function mat4_getRotationQuat(out = glMatrix.quat.create()) {
        glMatrix.mat4.getScaling(scale, this);
        glMatrix.vec3.divide(inverseScale, one, scale);
        glMatrix.mat4.scale(transformMatrixNoScale, this, inverseScale);
        glMatrix.mat4.getRotation(out, transformMatrixNoScale);
        glMatrix.quat.normalize(out, out);
        return out;
    };
}();

Array.prototype.mat4_getScale = function (out = glMatrix.vec3.create()) {
    glMatrix.mat4.getScaling(out, this);
    return out;
};

// New Functions

Array.prototype.mat4_setPosition = function (position) {
    this[12] = position[0];
    this[13] = position[1];
    this[14] = position[2];
    return this;
};

Array.prototype.mat4_setRotation = function (rotation) {
    this.mat4_setRotationDegrees(rotation);
    return this;
};

Array.prototype.mat4_setRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function mat4_setRotationDegrees(rotation) {
        this.mat4_setRotationQuat(rotation.vec3_degreesToQuat(quat));
        return this;
    };
}();

Array.prototype.mat4_setRotationRadians = function () {
    let vector = glMatrix.vec3.create();
    return function mat4_setRotationRadians(rotation) {
        this.mat4_setRotationDegrees(rotation.vec3_toDegrees(vector));
        return this;
    };
}();

Array.prototype.mat4_setRotationQuat = function () {
    let position = glMatrix.vec3.create();
    let scale = glMatrix.vec3.create();
    return function mat4_setRotationQuat(rotation) {
        this.mat4_getPosition(position);
        this.mat4_getScale(scale);
        this.mat4_setPositionRotationQuatScale(position, rotation, scale);
        return this;
    };
}();

Array.prototype.mat4_setScale = function () {
    let tempScale = glMatrix.vec3.create();
    return function mat4_setScale(scale) {
        glMatrix.mat4.getScaling(tempScale, this);
        glMatrix.vec3.divide(tempScale, scale, tempScale);
        glMatrix.mat4.scale(this, this, tempScale);
        return this;
    };
}();

Array.prototype.mat4_setPositionRotationScale = function (position, rotation, scale) {
    this.mat4_setPositionRotationDegreesScale(position, rotation, scale);
    return this;
};

Array.prototype.mat4_setPositionRotationDegreesScale = function () {
    let quat = glMatrix.quat.create();
    return function mat4_setPositionRotationDegreesScale(position, rotation, scale) {
        this.mat4_setPositionRotationQuatScale(position, rotation.vec3_degreesToQuat(quat), scale);
        return this;
    };
}();

Array.prototype.mat4_setPositionRotationRadiansScale = function () {
    let vector = glMatrix.vec3.create();
    return function mat4_setPositionRotationRadiansScale(position, rotation, scale) {
        this.mat4_setPositionRotationDegreesScale(position, rotation.vec3_toDegrees(vector), scale);
        return this;
    };
}();

Array.prototype.mat4_setPositionRotationQuatScale = function (position, rotation, scale) {
    glMatrix.mat4.fromRotationTranslationScale(this, rotation, position, scale);
    return this;
};

Array.prototype.mat4_setPositionRotation = function (position, rotation) {
    this.mat4_setPositionRotationDegrees(position, rotation);
    return this;
};

Array.prototype.mat4_setPositionRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function mat4_setPositionRotationDegrees(position, rotation) {
        this.mat4_setPositionRotationQuat(position, rotation.vec3_degreesToQuat(quat));
        return this;
    };
}();

Array.prototype.mat4_setPositionRotationRadians = function () {
    let vector = glMatrix.vec3.create();
    return function mat4_setPositionRotationRadians(position, rotation) {
        this.mat4_setPositionRotationDegrees(position, rotation.vec3_toDegrees(vector));
        return this;
    };
}();

Array.prototype.mat4_setPositionRotationQuat = function (position, rotation) {
    glMatrix.mat4.fromRotationTranslation(this, rotation, position);
    return this;
};

Array.prototype.mat4_getAxes = function (out = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()]) {
    this.mat4_getLeft(out[0]);
    this.mat4_getUp(out[1]);
    this.mat4_getForward(out[2]);

    return out;
};

Array.prototype.mat4_getForward = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, this[8], this[9], this[10]);
    glMatrix.vec3.normalize(out, out);
    return out;
};

Array.prototype.mat4_getBackward = function (out) {
    out = this.mat4_getForward(out);
    out.vec3_negate(out);
    return out;
};

Array.prototype.mat4_getLeft = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, this[0], this[1], this[2]);
    glMatrix.vec3.normalize(out, out);
    return out;
};

Array.prototype.mat4_getRight = function (out) {
    out = this.mat4_getLeft(out);
    out.vec3_negate(out);
    return out;
};

Array.prototype.mat4_getUp = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, this[4], this[5], this[6]);
    glMatrix.vec3.normalize(out, out);
    return out;
};

Array.prototype.mat4_getDown = function (out) {
    out = this.mat4_getUp(out);
    out.vec3_negate(out);
    return out;
};

Array.prototype.mat4_toWorld = function () {
    let convertTransform = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let scale = glMatrix.vec3.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function mat4_toWorld(parentTransformMatrix, out = glMatrix.mat4.create()) {
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

Array.prototype.mat4_toLocal = function () {
    let convertTransform = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let scale = glMatrix.vec3.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function mat4_toLocal(parentTransformMatrix, out = glMatrix.mat4.create()) {
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

Array.prototype.mat4_hasUniformScale = function () {
    let scale = glMatrix.vec3.create();
    return function mat4_hasUniformScale() {
        glMatrix.mat4.getScaling(scale, this);
        return Math.abs(scale[0] - scale[1]) < this._pp_epsilon && Math.abs(scale[1] - scale[2]) < this._pp_epsilon && Math.abs(scale[0] - scale[2]) < this._pp_epsilon;
    };
}();

Array.prototype.mat4_toQuat = function () {
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    return function mat4_toQuat(out = glMatrix.quat2.create()) {
        glMatrix.mat4.getTranslation(position, this);
        this.mat4_getRotationQuat(rotation);
        glMatrix.quat2.fromRotationTranslation(out, rotation, position);
        return out;
    };
}();

Array.prototype.mat4_fromQuat = function (transformQuat) {
    transformQuat.quat2_toMatrix(this);
    return this;
};

//CREATION

PP.vec2_create = function (x = null, y = null) {
    let out = glMatrix.vec2.create();
    if (x != null) {
        out.vec2_set(x, y);
    }
    return out;
};

PP.vec3_create = function (x = null, y = null, z = null) {
    let out = glMatrix.vec3.create();
    if (x != null) {
        out.vec3_set(x, y, z);
    }
    return out;
};

PP.vec4_create = function (x = null, y = null, z = null, w = null) {
    let out = glMatrix.vec4.create();
    if (x != null) {
        out.vec4_set(x, y, z, w);
    }
    return out;
};

PP.quat_create = function (x = null, y = null, z = null, w = null) {
    let out = glMatrix.quat.create();
    if (x != null) {
        out.quat_set(x, y, z, w);
    }
    return out;
};

PP.quat2_create = function () {
    let out = glMatrix.quat2.create();
    return out;
};

PP.quat2_fromPositionRotation = function (position, rotation) {
    return quat2_fromPositionRotationDegrees(position, rotation);
};

PP.quat2_fromPositionRotationDegrees = function (position, rotation) {
    let out = glMatrix.mat4.create();
    out.quat2_setPositionRotationDegrees(position, rotation);
    return out;
};

PP.quat2_fromPositionRotationRadians = function (position, rotation) {
    let out = glMatrix.mat4.create();
    out.quat2_setPositionRotationRadians(position, rotation);
    return out;
};

PP.quat2_fromPositionRotationQuat = function (position, rotation) {
    let out = glMatrix.quat2.create();
    out.quat2_setPositionRotationQuat(position, rotation);
    return out;
};

PP.mat4_create = function () {
    let out = glMatrix.mat4.create();
    return out;
};

PP.mat4_fromPositionRotation = function (position, rotation) {
    return mat4_fromPositionRotationDegrees(position, rotation);
};

PP.mat4_fromPositionRotationDegrees = function (position, rotation) {
    let out = glMatrix.mat4.create();
    out.mat4_setPositionRotationDegrees(position, rotation);
    return out;
};

PP.mat4_fromPositionRotationRadians = function (position, rotation) {
    let out = glMatrix.mat4.create();
    out.mat4_setPositionRotationRadians(position, rotation);
    return out;
};

PP.mat4_fromPositionRotationQuat = function (position, rotation) {
    let out = glMatrix.mat4.create();
    out.mat4_setPositionRotationQuat(position, rotation);
    return out;
};

PP.mat4_fromPositionRotationScale = function (position, rotation, scale) {
    return mat4_fromPositionRotationDegreesScale(position, rotation, scale);
};

PP.mat4_fromPositionRotationDegreesScale = function (position, rotation, scale) {
    let out = glMatrix.mat4.create();
    out.mat4_setPositionRotationDegreesScale(position, rotation, scale);
    return out;
};

PP.mat4_fromPositionRotationRadiansScale = function (position, rotation, scale) {
    let out = glMatrix.mat4.create();
    out.mat4_setPositionRotationRadiansScale(position, rotation, scale);
    return out;
};

PP.mat4_fromPositionRotationQuatScale = function (position, rotation, scale) {
    let out = glMatrix.mat4.create();
    out.mat4_setPositionRotationQuatScale(position, rotation, scale);
    return out;
};

//UTILS

Array.prototype._pp_epsilon = 0.000001;
Array.prototype._pp_degreesEpsilon = 0.00001;

Array.prototype._pp_clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};

Array.prototype._vec_buildConsoleMessage = function (decimalPlaces) {
    let message = "[";

    for (let i = 0; i < this.length; i++) {
        if (i != 0) {
            message = message.concat(", ");
        }

        if (decimalPlaces != null) {
            message = message.concat(this[i].toFixed(decimalPlaces));
        } else {
            message = message.concat(this[i].toString());
        }
    }

    message = message.concat("]");
    return message;
};

Array.prototype._vec_prepareOut = function (out) {
    if (out == null) {
        out = this.pp_clone();
    } else if (out != this) {
        out.pp_copy(this);
    }

    return out;
};


Array.prototype._quat_setAxes = function () {
    let fixedAxes = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()];

    let fixedAxesFixSignMap = [
        [1, -1, 1],
        [1, 1, -1],
        [-1, 1, -1]
    ];

    let fixedLeft = glMatrix.vec3.create();
    let fixedUp = glMatrix.vec3.create();
    let fixedForward = glMatrix.vec3.create();

    let currentAxis = glMatrix.vec3.create();

    let rotationAxis = glMatrix.vec3.create();
    let rotationMat = glMatrix.mat3.create();
    let rotationQuat = glMatrix.quat.create();
    return function _quat_setAxes(axes, priority) {
        let firstAxis = axes[priority[0]];
        let secondAxis = axes[priority[1]];
        let thirdAxis = axes[priority[2]];

        if (firstAxis == null) {
            return this;
        }

        let secondAxisValid = false;
        if (secondAxis != null) {
            let angleBetween = glMatrix.vec3.angle(firstAxis, secondAxis);
            if (angleBetween > this._pp_epsilon) {
                secondAxisValid = true;
            }
        }

        let thirdAxisValid = false;
        if (thirdAxis != null) {
            let angleBetween = glMatrix.vec3.angle(firstAxis, thirdAxis);
            if (angleBetween > this._pp_epsilon) {
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

            this.quat_copy(rotationQuat);
        } else {
            if (priority[0] == 0) {
                this.quat_getLeft(currentAxis);
            } else if (priority[0] == 1) {
                this.quat_getUp(currentAxis);
            } else {
                this.quat_getForward(currentAxis);
            }

            let angle = glMatrix.vec3.angle(firstAxis, currentAxis);
            if (angle != 0) {
                glMatrix.vec3.cross(rotationAxis, currentAxis, firstAxis);
                glMatrix.vec3.normalize(rotationAxis, rotationAxis);
                glMatrix.quat.setAxisAngle(rotationQuat, rotationAxis, angle);

                this.quat_rotateQuat(rotationQuat, this);
            }
        }

        return this;
    };
}();




for (let key in Array.prototype) {
    let prefixes = ["pp_", "vec_", "vec2_", "vec3_", "vec4_", "quat_", "quat2_", "mat3_", "mat4_", "_pp_", "_vec_", "_quat_",];

    let found = false;
    for (let prefix of prefixes) {
        if (key.startsWith(prefix)) {
            found = true;
            break;
        }
    }

    if (found) {
        Object.defineProperty(Array.prototype, key, { enumerable: false });

        Uint8ClampedArray.prototype[key] = Array.prototype[key];
        Object.defineProperty(Uint8ClampedArray.prototype, key, { enumerable: false });

        Uint8ClampedArray.prototype[key] = Array.prototype[key];
        Object.defineProperty(Uint8ClampedArray.prototype, key, { enumerable: false });

        Uint8Array.prototype[key] = Array.prototype[key];
        Object.defineProperty(Uint8Array.prototype, key, { enumerable: false });

        Uint16Array.prototype[key] = Array.prototype[key];
        Object.defineProperty(Uint16Array.prototype, key, { enumerable: false });

        Uint32Array.prototype[key] = Array.prototype[key];
        Object.defineProperty(Uint32Array.prototype, key, { enumerable: false });

        Int8Array.prototype[key] = Array.prototype[key];
        Object.defineProperty(Int8Array.prototype, key, { enumerable: false });

        Int16Array.prototype[key] = Array.prototype[key];
        Object.defineProperty(Int16Array.prototype, key, { enumerable: false });

        Int32Array.prototype[key] = Array.prototype[key];
        Object.defineProperty(Int32Array.prototype, key, { enumerable: false });

        Float32Array.prototype[key] = Array.prototype[key];
        Object.defineProperty(Float32Array.prototype, key, { enumerable: false });

        Float64Array.prototype[key] = Array.prototype[key];
        Object.defineProperty(Float64Array.prototype, key, { enumerable: false });
    }
}
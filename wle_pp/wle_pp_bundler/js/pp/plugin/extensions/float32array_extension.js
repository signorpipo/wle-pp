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
        - quat_rotationToDegrees        -> returns a rotation in quat

    The functions leave u the choice of forwarding an out parameter or just get the return value, example:
        - let quat = this.vec3_toQuat()
        - this.vec3_toQuat(quat)
        - the out parameter is always the last one

    List of functions:
        Notes:
            - If a group of functions starts with ○ it means it modifies the variable itself
            - The suffixes (like Matrix or Radians) or prefixes (like degrees) are omitted 

        CREATION (u can call these functions without any object):
            - PP.vec3_create

            - PP.vec4_create

            - PP.quat_create

            - PP.quat2_create
            - PP.quat2_fromPositionRotation

            - PP.mat4_create
            - PP.mat4_fromPositionRotation     / PP.mat4_fromPositionRotationScale

        ARRAY:
            - pp_has        / pp_hasEqual
            - pp_find       / pp_findAll        / pp_findEqual / pp_findAllEqual
            ○ pp_remove     / pp_removeIndex    / pp_removeAll  / pp_removeEqual    / pp_removeAllEqual
            ○ pp_pushUnique / pp_unshiftUnique
            ○ pp_copy    
            - pp_clone      
            - pp_equals      

        GENERIC VECTOR (array with only numbers):
            - vec_scale
            - vec_round     / vec_floor         / vec_ceil      / vec_clamp
            - vec_log       / vec_error         / vec_warn      

        VECTOR 3:
            ○ vec3_set      / vec3_copy     / vec3_zero
            - vec3_clone 
            - vec3_normalize    / vec3_negate
            - vec3_isNormalized
            - vec3_length
            - vec3_distance
            - vec3_add      / vec3_sub          / vec3_mul      / vec3_div      / vec3_scale
            - vec3_transformQuat
            - vec3_componentAlongAxis           / vec3_removeComponentAlongAxis
            - vec3_isConcordant
            - vec3_convertPositionToWorld       / vec3_convertPositionToLocal 
            - vec3_convertDirectionToWorld      / vec3_convertDirectionToLocal   
            - vec3_angle
            - vec3_toRadians        / vec3_toDegrees            / vec3_toQuat       / vec3_toMatrix
            - vec3_rotate           / vec3_rotateAxis           / vec3_rotateAround / vec3_rotateAroundAxis
            - vec3_addRotation
            - vec3_log       / vec3_error         / vec3_warn     
            
        VECTOR 4:
            ○ vec4_set      / vec4_copy

        QUAT:
            ○ quat_set          / quat_copy     / quat_identity
            - quat_normalize    / quat_invert
            - quat_isNormalized
            - quat_length
            - quat_mul
            - quat_getAxis  / quat_getAngle
            - quat_getAxes
            ○ quat_fromRadians      / quat_fromDegrees      / quat_fromAxis
            - quat_toRadians        / quat_toDegrees        / quat_toMatrix
            - quat_rotate           / quat_rotateAxis       / quat_addRotation      / quat_subRotation
            - quat_rotationTo

        QUAT 2:
            ○ quat2_copy        / quat2_identity
            - quat2_normalize
            - quat2_getPosition     / quat2_getRotation
            ○ quat2_setPositionRotation
            - quat2_getAxes
            - quat2_toWorld     / quat2_toLocal
            - quat2_toMatrix
            ○ quat2_fromMatrix

        MATRIX 3:
            - mat3_toDegrees    / mat3_toRadians    / mat3_toQuat

        MATRIX 4:
            ○ mat4_copy         / mat4_identity
            - mat4_clone
            - mat4_invert
            - mat4_getPosition  / mat4_getRotation  / mat4_getScale
            ○ mat4_setPosition  / mat4_setRotation  / mat4_setScale
            ○ mat4_setPositionRotation      / mat4_setPositionRotationScale
            - mat4_getAxes
            - mat4_toWorld      / mat4_toLocal
            - mat4_hasUniformScale
            - mat4_toQuat
            ○ mat4_fromQuat
*/

import * as glMatrix from 'gl-matrix';

//ARRAY

//New Functions

Float32Array.prototype.pp_has = function (callback) {
    return this.pp_find(callback) != undefined;
};

Float32Array.prototype.pp_hasEqual = function (elementToFind) {
    return this.pp_findEqual(elementToFind) != undefined;
};

Float32Array.prototype.pp_find = function (callback) {
    let elementFound = undefined;

    let index = this.findIndex(callback);
    if (index >= 0) {
        elementFound = this[index];
    }

    return elementFound;
};

Float32Array.prototype.pp_findAll = function (callback) {
    let elementsFound = this.filter(callback);

    return elementsFound;
};

Float32Array.prototype.pp_findEqual = function (elementToFind) {
    return this.pp_find(element => element === elementToFind);
};

Float32Array.prototype.pp_findAllEqual = function (elementToFind) {
    return this.pp_findAll(element => element === elementToFind);
};

Float32Array.prototype.pp_removeIndex = function (index) {
    let elementRemoved = undefined;

    if (index >= 0 && index < this.length) {
        let arrayRemoved = this.splice(index, 1);
        if (arrayRemoved.length == 1) {
            elementRemoved = arrayRemoved[0];
        }
    }

    return elementRemoved;
};

Float32Array.prototype.pp_remove = function (callback) {
    let elementRemoved = undefined;

    let index = this.findIndex(callback);
    if (index >= 0) {
        elementRemoved = this.pp_removeIndex(index);
    }

    return elementRemoved;
};

Float32Array.prototype.pp_removeAll = function (callback) {
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

Float32Array.prototype.pp_removeEqual = function (elementToRemove) {
    return this.pp_remove(element => element === elementToRemove);
};

Float32Array.prototype.pp_removeAllEqual = function (elementToRemove) {
    return this.pp_removeAll(element => element === elementToRemove);
};

Float32Array.prototype.pp_pushUnique = function (element, hasElementCallback = null) {
    let length = this.length;

    let hasElement = false;
    if (hasElementCallback != null) {
        hasElement = this.pp_has(hasElementCallback);
    } else {
        hasElement = this.pp_hasEqual(element);
    }

    if (!hasElement) {
        length = this.push(element);
    }

    return length;
};

Float32Array.prototype.pp_unshiftUnique = function (element, hasElementCallback = null) {
    let length = this.length;

    let hasElement = false;
    if (hasElementCallback != null) {
        hasElement = this.pp_has(hasElementCallback);
    } else {
        hasElement = this.pp_hasEqual(element);
    }

    if (!hasElement) {
        length = this.unshift(element);
    }

    return length;
};

Float32Array.prototype.pp_copy = function (array) {
    while (this.length > array.length) {
        this.pop();
    }

    for (let i = 0; i < array.length; i++) {
        this[i] = array[i];
    }

    return this;
};

Float32Array.prototype.pp_clone = function () {
    return this.slice(0);
};

Float32Array.prototype.pp_equals = function (array, elementEqualsCallback = null) {
    let equals = true;

    if (array != null && this.length == array.length) {
        for (let i = 0; i < this.length; i++) {
            if ((elementEqualsCallback != null && !elementEqualsCallback(this[i], array[i])) ||
                (elementEqualsCallback == null && this[i] != array[i])) {
                equals = false;
                break;
            }
        }
    } else {
        equals = false;
    }

    return equals;
};

// GENERIC VECTOR

//New Functions

Float32Array.prototype.vec_toString = function (decimalPlaces = 4) {
    let message = this._vec_buildConsoleMessage(decimalPlaces);
    return message;
};

Float32Array.prototype.vec_log = function (decimalPlaces = 4) {
    let message = this._vec_buildConsoleMessage(decimalPlaces);
    console.log(message);
};

Float32Array.prototype.vec_error = function (decimalPlaces = 4) {
    let message = this._vec_buildConsoleMessage(decimalPlaces);
    console.error(message);
};

Float32Array.prototype.vec_warn = function (decimalPlaces = 4) {
    let message = this._vec_buildConsoleMessage(decimalPlaces);
    console.warn(message);
};

Float32Array.prototype.vec_scale = function (value, out = null) {
    out = this._vec_prepareOut(out);

    for (let i = 0; i < out.length; i++) {
        out[i] = out[i] * value;
    }

    return out;
};

Float32Array.prototype.vec_round = function (out = null) {
    out = this._vec_prepareOut(out);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.round(out[i]);
    }

    return out;
};

Float32Array.prototype.vec_floor = function (out = null) {
    out = this._vec_prepareOut(out);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.floor(out[i]);
    }

    return out;
};

Float32Array.prototype.vec_ceil = function (out = null) {
    out = this._vec_prepareOut(out);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.ceil(out[i]);
    }

    return out;
};

Float32Array.prototype.vec_clamp = function (start, end, out = null) {
    out = this._vec_prepareOut(out);

    let fixedStart = (start != null) ? start : Number.MIN_VALUE;
    let fixedEnd = (end != null) ? end : Number.MAX_VALUE;
    let min = Math.min(fixedStart, fixedEnd);
    let max = Math.max(fixedStart, fixedEnd);

    for (let i = 0; i < out.length; i++) {
        out[i] = Math.min(Math.max(out[i], min), max);
    }

    return out;
};

Float32Array.prototype.vec_equals = function (vector) {
    let equals = this.length == vector.length;

    for (let i = 0; i < this.length && equals; i++) {
        equals &= Math.abs(this[i] - vector[i]) < this._pp_epsilon;
    }

    return equals;
};

// VECTOR 3

// glMatrix Bridge

Float32Array.prototype.vec3_normalize = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.normalize(out, this);
    return out;
};

Float32Array.prototype.vec3_copy = function (vector) {
    glMatrix.vec3.copy(this, vector);
    return this;
};

Float32Array.prototype.vec3_clone = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.copy(out, this);
    return out;
};

Float32Array.prototype.vec3_set = function (x, y = null, z = null) {
    if (y == null) {
        glMatrix.vec3.set(this, x, x, x);
    } else {
        glMatrix.vec3.set(this, x, y, z);
    }
    return this;
};

Float32Array.prototype.vec3_zero = function () {
    glMatrix.vec3.zero(this);
    return this;
};

Float32Array.prototype.vec3_angle = function (vector) {
    return this.vec3_angleDegrees(vector);
};

Float32Array.prototype.vec3_angleDegrees = function (vector) {
    return this.vec3_angleRadians(vector) * (180 / Math.PI);
};

Float32Array.prototype.vec3_angleRadians = function (vector) {
    return glMatrix.vec3.angle(this, vector);
};

Float32Array.prototype.vec3_length = function () {
    return glMatrix.vec3.length(this);
};

Float32Array.prototype.vec3_distance = function (vector) {
    return glMatrix.vec3.dist(this, vector);
};

Float32Array.prototype.vec3_add = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.add(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_sub = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.sub(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_mul = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.mul(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_div = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.div(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_scale = function (value, out = glMatrix.vec3.create()) {
    glMatrix.vec3.scale(out, this, value);
    return out;
};

Float32Array.prototype.vec3_negate = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.negate(out, this);
    return out;
};

Float32Array.prototype.vec3_cross = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.cross(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_transformQuat = function (quat, out = glMatrix.vec3.create()) {
    glMatrix.vec3.transformQuat(out, this, quat);
    return out;
};

// New Functions

Float32Array.prototype.vec3_angleSigned = function (vector, axis) {
    return this.vec3_angleSignedDegrees(vector, axis);
};

Float32Array.prototype.vec3_angleSignedDegrees = function (vector, axis) {
    return this.vec3_angleSignedRadians(vector, axis) * (180 / Math.PI);
};

Float32Array.prototype.vec3_angleSignedRadians = function () {
    let crossAxis = glMatrix.vec3.create();
    return function (vector, axis) {
        this.vec3_cross(vector, crossAxis);
        let angle = this.vec3_angleRadians(vector);
        if (!crossAxis.vec3_isConcordant(axis)) {
            angle = -angle;
        }

        return angle;
    };
}();

Float32Array.prototype.vec3_toRadians = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, glMatrix.glMatrix.toRadian(this[0]), glMatrix.glMatrix.toRadian(this[1]), glMatrix.glMatrix.toRadian(this[2]));
    return out;
};

Float32Array.prototype.vec3_toDegrees = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, this[0] * (180 / Math.PI), this[1] * (180 / Math.PI), this[2] * (180 / Math.PI));
    return out;
};

Float32Array.prototype.vec3_toQuat = function (out) {
    return this.vec3_degreesToQuat(out);
};

Float32Array.prototype.vec3_radiansToQuat = function (out = glMatrix.quat.create()) {
    out.quat_fromRadians(this);
    return out;
};

Float32Array.prototype.vec3_degreesToQuat = function (out = glMatrix.quat.create()) {
    out.quat_fromDegrees(this);
    return out;
};

Float32Array.prototype.vec3_isNormalized = function () {
    return Math.abs(glMatrix.vec3.length(this) - 1) < this._pp_epsilon;
};

Float32Array.prototype.vec3_componentAlongAxis = function (axis, out = glMatrix.vec3.create()) {
    let angle = glMatrix.vec3.angle(this, axis);
    let length = Math.cos(angle) * glMatrix.vec3.length(this);

    glMatrix.vec3.copy(out, axis);
    glMatrix.vec3.scale(out, out, length);
    return out;
};

Float32Array.prototype.vec3_removeComponentAlongAxis = function () {
    let componentAlong = glMatrix.vec3.create();
    return function (axis, out = glMatrix.vec3.create()) {
        this.vec3_componentAlongAxis(axis, componentAlong);
        glMatrix.vec3.sub(out, this, componentAlong);
        return out;
    };
}();

Float32Array.prototype.vec3_isConcordant = function (vector) {
    return glMatrix.vec3.angle(this, vector) <= Math.PI / 2;
};

Float32Array.prototype.vec3_rotate = function (rotation, out) {
    return this.vec3_rotateDegrees(rotation, out);
};

Float32Array.prototype.vec3_rotateDegrees = function () {
    let zero = glMatrix.vec3.create();
    return function (rotation, out) {
        return this.vec3_rotateAroundDegrees(rotation, zero, out);
    };
}();

Float32Array.prototype.vec3_rotateRadians = function () {
    let zero = glMatrix.vec3.create();
    return function (rotation, out) {
        return this.vec3_rotateAroundRadians(rotation, zero, out);
    };
}();

Float32Array.prototype.vec3_rotateQuat = function () {
    let zero = glMatrix.vec3.create();
    return function (rotation, out) {
        return this.vec3_rotateAroundQuat(rotation, zero, out);
    };
}();

Float32Array.prototype.vec3_rotateAxis = function (angle, axis, out) {
    return this.vec3_rotateAxisDegrees(angle, axis, out);
};

Float32Array.prototype.vec3_rotateAxisDegrees = function () {
    let zero = glMatrix.vec3.create();
    return function (angle, axis, out) {
        return this.vec3_rotateAroundAxisDegrees(angle, axis, zero, out);
    };
}();

Float32Array.prototype.vec3_rotateAxisRadians = function () {
    let zero = glMatrix.vec3.create();
    return function (angle, axis, out) {
        return this.vec3_rotateAroundAxisRadians(angle, axis, zero, out);
    };
}();

Float32Array.prototype.vec3_rotateAround = function (rotation, origin, out) {
    return this.vec3_rotateAroundDegrees(rotation, origin, out);
};

Float32Array.prototype.vec3_rotateAroundDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, origin, out = glMatrix.vec3.create()) {
        rotation.vec3_degreesToQuat(quat);
        return this.vec3_rotateAroundQuat(quat, origin, out);
    };
}();

Float32Array.prototype.vec3_rotateAroundRadians = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, origin, out = glMatrix.vec3.create()) {
        rotation.vec3_radiansToQuat(quat);
        return this.vec3_rotateAroundQuat(quat, origin, out);
    };
}();

Float32Array.prototype.vec3_rotateAroundQuat = function (rotation, origin, out = glMatrix.vec3.create()) {
    glMatrix.vec3.sub(out, this, origin);
    glMatrix.vec3.transformQuat(out, out, rotation);
    glMatrix.vec3.add(out, out, origin);
    return out;
};

Float32Array.prototype.vec3_rotateAroundAxis = function (angle, axis, origin, out) {
    return this.vec3_rotateAroundAxisDegrees(angle, axis, origin, out);
};

Float32Array.prototype.vec3_rotateAroundAxisDegrees = function (angle, axis, origin, out) {
    return this.vec3_rotateAroundAxisRadians(glMatrix.glMatrix.toRadian(angle), axis, origin, out);
};

Float32Array.prototype.vec3_rotateAroundAxisRadians = function () {
    let quat = glMatrix.quat.create();
    return function (angle, axis, origin, out = glMatrix.vec3.create()) {
        glMatrix.quat.setAxisAngle(quat, axis, angle);
        return this.vec3_rotateAroundQuat(quat, origin, out);
    };
}();

Float32Array.prototype.vec3_convertPositionToWorld = function (parentTransform, out) {
    return this.vec3_convertPositionToWorldMatrix(parentTransform, out);
};

Float32Array.prototype.vec3_convertPositionToLocal = function (parentTransform, out) {
    return this.vec3_convertPositionToLocalMatrix(parentTransform, out);
};

Float32Array.prototype.vec3_convertPositionToWorldMatrix = function (parentTransform, out = glMatrix.vec3.create()) {
    glMatrix.vec3.transformMat4(out, this, parentTransform);
    return out;
};

Float32Array.prototype.vec3_convertPositionToLocalMatrix = function () {
    let inverse = glMatrix.mat4.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        glMatrix.mat4.invert(inverse, parentTransform);
        glMatrix.vec3.transformMat4(out, this, inverse);
        return out;
    };
}();

Float32Array.prototype.vec3_convertPositionToWorldQuat = function () {
    let parentTransformMatrix = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getPosition(position);
        parentTransform.quat2_getRotationQuat(rotation);
        parentTransformMatrix.mat4_setPositionRotationQuatScale(position, rotation, one);
        return this.vec3_convertPositionToWorldMatrix(parentTransformMatrix, out);
    };
}();

Float32Array.prototype.vec3_convertPositionToLocalQuat = function () {
    let parentTransformMatrix = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getPosition(position);
        parentTransform.quat2_getRotationQuat(rotation);
        parentTransformMatrix.mat4_setPositionRotationQuatScale(position, rotation, one);
        return this.vec3_convertPositionToLocalMatrix(parentTransformMatrix, out);
    };
}();

Float32Array.prototype.vec3_convertDirectionToWorld = function (parentTransform, out) {
    return this.vec3_convertDirectionToWorldMatrix(parentTransform, out);
};

Float32Array.prototype.vec3_convertDirectionToLocal = function (parentTransform, out) {
    return this.vec3_convertDirectionToLocalMatrix(parentTransform, out);
};

Float32Array.prototype.vec3_convertDirectionToWorldMatrix = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.mat4_getRotationQuat(rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

Float32Array.prototype.vec3_convertDirectionToLocalMatrix = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.mat4_getRotationQuat(rotation);
        glMatrix.quat.conjugate(rotation, rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();


Float32Array.prototype.vec3_convertDirectionToWorldQuat = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getRotationQuat(rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

Float32Array.prototype.vec3_convertDirectionToLocalQuat = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getRotationQuat(rotation);
        glMatrix.quat.conjugate(rotation, rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

Float32Array.prototype.vec3_log = function (decimalPlaces = 4) {
    this.vec_log(decimalPlaces);
};

Float32Array.prototype.vec3_error = function (decimalPlaces = 4) {
    this.vec_error(decimalPlaces);
};

Float32Array.prototype.vec3_warn = function (decimalPlaces = 4) {
    this.vec_warn(decimalPlaces);
};

Float32Array.prototype.vec3_addRotation = function (rotation, out) {
    return this.vec3_degreesAddRotation(rotation, out);
};

Float32Array.prototype.vec3_addRotationDegrees = function (rotation, out) {
    return quat.vec3_degreesAddRotationDegrees(rotation, out);
};

Float32Array.prototype.vec3_addRotationRadians = function (rotation, out) {
    return quat.vec3_degreesAddRotationRadians(rotation, out);
};

Float32Array.prototype.vec3_addRotationQuat = function (rotation, out) {
    return quat.vec3_degreesAddRotationQuat(rotation, out);
};

Float32Array.prototype.vec3_degreesAddRotation = function (rotation, out) {
    return this.vec3_degreesAddRotationDegrees(rotation, out);
};

Float32Array.prototype.vec3_degreesAddRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, out = glMatrix.vec3.create()) {
        this.vec3_degreesToQuat(quat);
        return quat.quat_addRotationDegrees(rotation, quat).quat_toDegrees(out);
    };
}();

Float32Array.prototype.vec3_degreesAddRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, out = glMatrix.vec3.create()) {
        this.vec3_degreesToQuat(quat);
        return quat.quat_addRotationRadians(rotation, quat).quat_toDegrees(out);
    };
}();

Float32Array.prototype.vec3_degreesAddRotationQuat = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, out = glMatrix.vec3.create()) {
        this.vec3_degreesToQuat(quat);
        return quat.quat_addRotationQuat(rotation, quat).quat_toDegrees(out);
    };
}();

Float32Array.prototype.vec3_radiansAddRotation = function (rotation, out) {
    return this.vec3_radiansAddRotationDegrees(rotation, out);
};

Float32Array.prototype.vec3_radiansAddRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, out = glMatrix.vec3.create()) {
        this.vec3_radiansToQuat(quat);
        return quat.quat_addRotationDegrees(rotation, quat).quat_toRadians(out);
    };
}();

Float32Array.prototype.vec3_radiansAddRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, out = glMatrix.vec3.create()) {
        this.vec3_radiansToQuat(quat);
        return quat.quat_addRotationRadians(rotation, quat).quat_toRadians(out);
    };
}();

Float32Array.prototype.vec3_radiansAddRotationQuat = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, out = glMatrix.vec3.create()) {
        this.vec3_radiansToQuat(quat);
        return quat.quat_addRotationQuat(rotation, quat).quat_toRadians(out);
    };
}();

Float32Array.prototype.vec3_toMatrix = function (out = glMatrix.mat3.create()) {
    return this.vec3_degreesToMatrix(out);
};

Float32Array.prototype.vec3_degreesToMatrix = function () {
    let quat = glMatrix.quat.create();
    return function (out = glMatrix.mat3.create()) {
        this.vec3_degreesToQuat(quat);
        return quat.quat_toMatrix(out);
    };
}();

Float32Array.prototype.vec3_radiansToMatrix = function () {
    let quat = glMatrix.quat.create();
    return function (out = glMatrix.mat3.create()) {
        this.vec3_radiansToQuat(quat);
        return quat.quat_toMatrix(out);
    };
}();

// VECTOR 4

// glMatrix Bridge

Float32Array.prototype.vec4_set = function (x, y = null, z = null, w = null) {
    if (y == null) {
        glMatrix.vec4.set(this, x, x, x, x);
    } else {
        glMatrix.vec4.set(this, x, y, z, w);
    }
    return this;
};

Float32Array.prototype.vec4_copy = function (vector) {
    glMatrix.vec4.copy(this, vector);
    return this;
};

//QUAT

// glMatrix Bridge

Float32Array.prototype.quat_normalize = function (out = glMatrix.quat.create()) {
    glMatrix.quat.normalize(out, this);
    return out;
};

Float32Array.prototype.quat_copy = function (quat) {
    glMatrix.quat.copy(this, quat);
    return this;
};

Float32Array.prototype.quat_set = function (x, y = null, z = null, w = null) {
    if (y == null) {
        glMatrix.quat.set(this, x, x, x, x);
    } else {
        glMatrix.quat.set(this, x, y, z, w);
    }
    return this;
};

Float32Array.prototype.quat_identity = function () {
    glMatrix.quat.identity(this);
    return this;
};

Float32Array.prototype.quat_length = function () {
    return glMatrix.quat.length(this);
};

Float32Array.prototype.quat_invert = function (out = glMatrix.quat.create()) {
    glMatrix.quat.invert(out, this);
    return out;
};

Float32Array.prototype.quat_mul = function (rotation, out = glMatrix.quat.create()) {
    glMatrix.quat.mul(out, this, rotation);
    return out;
};

Float32Array.prototype.quat_getAxis = function (out = glMatrix.vec3.create()) {
    glMatrix.quat.getAxisAngle(out, this);
    return out;
};

Float32Array.prototype.quat_getAngle = function () {
    let vector = glMatrix.vec3.create();
    return function () {
        let angle = glMatrix.quat.getAxisAngle(vector, this);
        return angle;
    };
}();

Float32Array.prototype.quat_getAxes = function () {
    let rotationMatrix = glMatrix.mat3.create();
    return function (out = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()]) {
        glMatrix.mat3.fromQuat(rotationMatrix, this);

        glMatrix.vec3.set(out[0], rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);
        glMatrix.vec3.set(out[1], rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);
        glMatrix.vec3.set(out[2], rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);

        glMatrix.vec3.normalize(out[0], out[0]);
        glMatrix.vec3.normalize(out[1], out[1]);
        glMatrix.vec3.normalize(out[2], out[2]);

        return out;
    };
}();

Float32Array.prototype.quat_fromAxis = function (angle, axis) {
    return this.quat_fromAxisDegrees(angle, axis);
};

Float32Array.prototype.quat_fromAxisDegrees = function (angle, axis) {
    glMatrix.quat.setAxisAngle(this, axis, glMatrix.glMatrix.toRadian(angle));
    return this;
};

Float32Array.prototype.quat_fromAxisRadians = function (angle, axis) {
    glMatrix.quat.setAxisAngle(this, axis, angle);
    return this;
};

// New Functions

Float32Array.prototype.quat_fromRadians = function () {
    let vector = glMatrix.vec3.create();
    return function (radiansRotation) {
        radiansRotation.vec3_toDegrees(vector);
        return this.quat_fromDegrees(vector);
    };
}();

Float32Array.prototype.quat_fromDegrees = function (degreesRotation) {
    glMatrix.quat.fromEuler(this, degreesRotation[0], degreesRotation[1], degreesRotation[2]);
    return this;
};

Float32Array.prototype.quat_toRadians = function () {
    let mat3 = glMatrix.mat3.create();
    return function (out = glMatrix.vec3.create()) {
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

Float32Array.prototype.quat_toDegrees = function (out = glMatrix.vec3.create()) {
    this.quat_toRadians(out);
    out.vec3_toDegrees(out);
    return out;
};

Float32Array.prototype.quat_isNormalized = function () {
    return Math.abs(glMatrix.quat.length(this) - 1) < this._pp_epsilon;
};

Float32Array.prototype.quat_addRotation = function (rotation, out) {
    return this.quat_addRotationDegrees(rotation, out);
};

Float32Array.prototype.quat_addRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, out) {
        rotation.vec3_degreesToQuat(quat);
        return this.quat_addRotationQuat(quat, out);
    };
}();

Float32Array.prototype.quat_addRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, out) {
        rotation.vec3_radiansToQuat(quat);
        return this.quat_addRotationQuat(quat, out);
    };
}();

Float32Array.prototype.quat_addRotationQuat = function (rotation, out = glMatrix.quat.create()) {
    rotation.quat_mul(this, out);
    return out;
};

Float32Array.prototype.quat_subRotation = function (rotation, out) {
    return this.quat_subRotationDegrees(rotation, out);
};

Float32Array.prototype.quat_subRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, out) {
        rotation.vec3_degreesToQuat(quat);
        return this.quat_subRotationQuat(quat, out);
    };
}();

Float32Array.prototype.quat_subRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function (rotation, out) {
        rotation.vec3_radiansToQuat(quat);
        return this.quat_subRotationQuat(quat, out);
    };
}();

Float32Array.prototype.quat_subRotationQuat = function () {
    let inverse = glMatrix.quat.create();
    return function (rotation, out = glMatrix.quat.create()) {
        rotation.quat_invert(inverse);
        this.quat_mul(inverse, out);
        return out;
    };
}();

Float32Array.prototype.quat_rotationTo = function (rotation, out) {
    return this.quat_rotationToDegrees(rotation, out);
};

Float32Array.prototype.quat_rotationToDegrees = function (rotation, out) {
    return rotation.quat_subRotationDegrees(this, out);
};

Float32Array.prototype.quat_rotationToRadians = function (rotation, out) {
    return rotation.quat_subRotationRadians(this, out);
};

Float32Array.prototype.quat_rotationToQuat = function (rotation, out) {
    return rotation.quat_subRotationQuat(this, out);
};

Float32Array.prototype.quat_toMatrix = function (out = glMatrix.mat3.create()) {
    glMatrix.mat3.fromQuat(out, this);
    return out;
};

Float32Array.prototype.quat_rotate = function (rotation, out) {
    return this.quat_rotateDegrees(rotation, out);
};

Float32Array.prototype.quat_rotateDegrees = function (rotation, out) {
    return this.quat_addRotationDegrees(rotation, out);
};

Float32Array.prototype.quat_rotateRadians = function (rotation, out) {
    return this.quat_addRotationRadians(rotation, out);
};

Float32Array.prototype.quat_rotateQuat = function (rotation, out) {
    return this.quat_addRotationQuat(rotation, out);
};

Float32Array.prototype.quat_rotateAxis = function (angle, axis, out) {
    return this.quat_rotateAxisDegrees(angle, axis, out);
};

Float32Array.prototype.quat_rotateAxisDegrees = function () {
    let rotationQuat = glMatrix.quat.create();
    return function (angle, axis, out) {
        rotationQuat.quat_fromAxisDegrees(angle, axis);
        return this.quat_rotateQuat(rotationQuat, out);
    };
}();

Float32Array.prototype.quat_rotateAxisRadians = function () {
    let rotationQuat = glMatrix.quat.create();
    return function (angle, axis, out) {
        rotationQuat.quat_fromAxisRadians(angle, axis);
        return this.quat_rotateQuat(rotationQuat, out);
    };
}();

//QUAT 2

// glMatrix Bridge

Float32Array.prototype.quat2_normalize = function (out = glMatrix.quat2.create()) {
    glMatrix.quat2.normalize(out, this);
    return out;
};

Float32Array.prototype.quat2_copy = function (quat2) {
    glMatrix.quat2.copy(this, quat2);
    return this;
};

Float32Array.prototype.quat2_identity = function () {
    glMatrix.quat2.identity(this);
    return this;
};

Float32Array.prototype.quat2_getPosition = function (out = glMatrix.vec3.create()) {
    glMatrix.quat2.getTranslation(out, this);
    return this;
};

Float32Array.prototype.quat2_getRotation = function (out) {
    return this.quat2_getRotationDegrees(out);
};
Float32Array.prototype.quat2_getRotationDegrees = function () {
    let rotationQuat = glMatrix.quat.create();
    return function (out = glMatrix.vec3.create()) {
        this.quat2_getRotationQuat(rotationQuat).quat_toDegrees(out);
        return out;
    };
}();

Float32Array.prototype.quat2_getRotationRadians = function () {
    let rotationQuat = glMatrix.quat.create();
    return function (out = glMatrix.vec3.create()) {
        this.quat2_getRotationQuat(rotationQuat).quat_toRadians(out);
        return out;
    };
}();

Float32Array.prototype.quat2_getRotationQuat = function (out = glMatrix.quat.create()) {
    glMatrix.quat.copy(out, this);
    return this;
};

Float32Array.prototype.quat2_setPositionRotation = function (position, rotation) {
    return this.quat2_setPositionRotationDegrees(position, rotation);
};

Float32Array.prototype.quat2_setPositionRotationDegrees = function () {
    let rotationQuat = glMatrix.quat.create();
    return function (position, rotation) {
        rotation.vec3_degreesToQuat(rotationQuat);
        glMatrix.quat2.fromRotationTranslation(this, rotationQuat, position);

        return this;
    };
}();

Float32Array.prototype.quat2_setPositionRotationRadians = function () {
    let rotationQuat = glMatrix.quat.create();
    return function (position, rotation) {
        rotation.vec3_radiansToQuat(rotationQuat);
        glMatrix.quat2.fromRotationTranslation(this, rotationQuat, position);

        return this;
    };
}();

Float32Array.prototype.quat2_setPositionRotationQuat = function (position, rotation) {
    glMatrix.quat2.fromRotationTranslation(this, rotation, position);
    return this;
};

// New Functions

Float32Array.prototype.quat2_getAxes = function () {
    let rotationMatrix = glMatrix.mat3.create();
    return function (out = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()]) {
        glMatrix.mat3.fromQuat(rotationMatrix, this);

        glMatrix.vec3.set(out[0], rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);
        glMatrix.vec3.set(out[1], rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);
        glMatrix.vec3.set(out[2], rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);

        glMatrix.vec3.normalize(out[0], out[0]);
        glMatrix.vec3.normalize(out[1], out[1]);
        glMatrix.vec3.normalize(out[2], out[2]);

        return out;
    };
}();

Float32Array.prototype.quat2_toLocal = function () {
    let invertQuat = glMatrix.quat2.create();
    return function (parentTransform, out = glMatrix.quat2.create()) {
        glMatrix.quat2.conjugate(invertQuat, parentTransform);
        glMatrix.quat2.mul(out, invertQuat, this);
        return out;
    };
}();

Float32Array.prototype.quat2_toWorld = function (parentTransform, out = glMatrix.quat2.create()) {
    glMatrix.quat2.mul(out, parentTransform, this);
    return out;
};

Float32Array.prototype.quat2_toMatrix = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.fromQuat2(out, this);
    return out;
};

Float32Array.prototype.quat2_fromMatrix = function (transformMatrix) {
    transformMatrix.mat4_toQuat(this);
    return this;
};

//MATRIX 3

// glMatrix Bridge

// New Functions

Float32Array.prototype.mat3_toDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (out = glMatrix.vec3.create()) {
        this.mat3_toQuat(quat);
        quat.quat_toDegrees(out);
        return out;
    };
}();

Float32Array.prototype.mat3_toRadians = function () {
    let quat = glMatrix.quat.create();
    return function (out = glMatrix.vec3.create()) {
        this.mat3_toQuat(quat);
        quat.quat_toRadians(out);
        return out;
    };
}();

Float32Array.prototype.mat3_toQuat = function (out = glMatrix.quat.create()) {
    glMatrix.quat.fromMat3(out, this);
    return out;
};

//MATRIX 4

// glMatrix Bridge

Float32Array.prototype.mat4_copy = function (mat4) {
    glMatrix.mat4.copy(this, mat4);
    return this;
};

Float32Array.prototype.mat4_identity = function () {
    glMatrix.mat4.identity(this);
    return this;
};

Float32Array.prototype.mat4_invert = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.invert(out, this);
    return out;
};

Float32Array.prototype.mat4_clone = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.copy(out, this);
    return out;
};

Float32Array.prototype.mat4_getPosition = function (out = glMatrix.vec3.create()) {
    glMatrix.mat4.getTranslation(out, this);
    return out;
};

Float32Array.prototype.mat4_getRotation = function (out = glMatrix.vec3.create()) {
    return this.mat4_getRotationDegrees(out);
};

Float32Array.prototype.mat4_getRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (out = glMatrix.vec3.create()) {
        this.mat4_getRotationQuat(quat);
        quat.quat_toDegrees(out);
        return out;
    };
}();

Float32Array.prototype.mat4_getRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function (out = glMatrix.vec3.create()) {
        this.mat4_getRotationQuat(quat);
        quat.quat_toRadians(out);
        return out;
    };
}();

Float32Array.prototype.mat4_getRotationQuat = function () {
    let scale = glMatrix.vec3.create();
    let transformMatrixNoScale = glMatrix.mat4.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (out = glMatrix.quat.create()) {
        glMatrix.mat4.getScaling(scale, this);
        glMatrix.vec3.divide(inverseScale, one, scale);
        glMatrix.mat4.scale(transformMatrixNoScale, this, inverseScale);
        glMatrix.mat4.getRotation(out, transformMatrixNoScale);
        glMatrix.quat.normalize(out, out);
        return out;
    };
}();

Float32Array.prototype.mat4_getScale = function (out = glMatrix.vec3.create()) {
    glMatrix.mat4.getScaling(out, this);
    return out;
};

// New Functions

Float32Array.prototype.mat4_setPosition = function (position) {
    this[12] = position[0];
    this[13] = position[1];
    this[14] = position[2];
    return this;
};

Float32Array.prototype.mat4_setRotation = function (rotation) {
    this.mat4_setRotationDegrees(rotation);
    return this;
};

Float32Array.prototype.mat4_setRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (rotation) {
        this.mat4_setRotationQuat(rotation.vec3_degreesToQuat(quat));
        return this;
    };
}();

Float32Array.prototype.mat4_setRotationRadians = function () {
    let vector = glMatrix.vec3.create();
    return function (rotation) {
        this.mat4_setRotationDegrees(rotation.vec3_toDegrees(vector));
        return this;
    };
}();

Float32Array.prototype.mat4_setRotationQuat = function () {
    let position = glMatrix.vec3.create();
    let scale = glMatrix.vec3.create();
    return function (rotation) {
        this.mat4_getPosition(position);
        this.mat4_getScale(scale);
        this.mat4_setPositionRotationQuatScale(position, rotation, scale);
        return this;
    };
}();

Float32Array.prototype.mat4_setScale = function () {
    let tempScale = glMatrix.vec3.create();
    return function (scale) {
        glMatrix.mat4.getScaling(tempScale, this);
        glMatrix.vec3.divide(tempScale, scale, tempScale);
        glMatrix.mat4.scale(this, this, tempScale);
        return this;
    };
}();

Float32Array.prototype.mat4_setPositionRotationScale = function (position, rotation, scale) {
    this.mat4_setPositionRotationDegreesScale(position, rotation, scale);
    return this;
};

Float32Array.prototype.mat4_setPositionRotationDegreesScale = function () {
    let quat = glMatrix.quat.create();
    return function (position, rotation, scale) {
        this.mat4_setPositionRotationQuatScale(position, rotation.vec3_degreesToQuat(quat), scale);
        return this;
    };
}();

Float32Array.prototype.mat4_setPositionRotationRadiansScale = function () {
    let vector = glMatrix.vec3.create();
    return function (position, rotation, scale) {
        this.mat4_setPositionRotationDegreesScale(position, rotation.vec3_toDegrees(vector), scale);
        return this;
    };
}();

Float32Array.prototype.mat4_setPositionRotationQuatScale = function (position, rotation, scale) {
    glMatrix.mat4.fromRotationTranslationScale(this, rotation, position, scale);
    return this;
};

Float32Array.prototype.mat4_setPositionRotation = function (position, rotation) {
    this.mat4_setPositionRotationDegrees(position, rotation);
    return this;
};

Float32Array.prototype.mat4_setPositionRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (position, rotation) {
        this.mat4_setPositionRotationQuat(position, rotation.vec3_degreesToQuat(quat));
        return this;
    };
}();

Float32Array.prototype.mat4_setPositionRotationRadians = function () {
    let vector = glMatrix.vec3.create();
    return function (position, rotation) {
        this.mat4_setPositionRotationDegrees(position, rotation.vec3_toDegrees(vector));
        return this;
    };
}();

Float32Array.prototype.mat4_setPositionRotationQuat = function (position, rotation) {
    glMatrix.mat4.fromRotationTranslation(this, rotation, position);
    return this;
};

Float32Array.prototype.mat4_getAxes = function (out = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()]) {
    glMatrix.vec3.set(out[0], this[0], this[1], this[2]);
    glMatrix.vec3.set(out[1], this[4], this[5], this[6]);
    glMatrix.vec3.set(out[2], this[8], this[9], this[10]);

    glMatrix.vec3.normalize(out[0], out[0]);
    glMatrix.vec3.normalize(out[1], out[1]);
    glMatrix.vec3.normalize(out[2], out[2]);

    return out;
};

Float32Array.prototype.mat4_toWorld = function () {
    let convertTransform = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let scale = glMatrix.vec3.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (parentTransform, out = glMatrix.mat4.create()) {
        if (parentTransform.mat4_hasUniformScale()) {
            glMatrix.mat4.mul(out, parentTransform, this);
        } else {
            glMatrix.vec3.set(position, this[12], this[13], this[14]);
            position.vec3_convertPositionToWorldMatrix(parentTransform, position);

            glMatrix.mat4.getScaling(scale, parentTransform);
            glMatrix.vec3.divide(inverseScale, one, scale);
            glMatrix.mat4.scale(convertTransform, parentTransform, inverseScale);

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

Float32Array.prototype.mat4_toLocal = function () {
    let convertTransform = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let scale = glMatrix.vec3.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (parentTransform, out = glMatrix.mat4.create()) {
        if (parentTransform.mat4_hasUniformScale()) {
            glMatrix.mat4.invert(convertTransform, parentTransform);
            glMatrix.mat4.mul(out, convertTransform, this);
        } else {
            glMatrix.vec3.set(position, this[12], this[13], this[14]);
            position.vec3_convertPositionToLocalMatrix(parentTransform, position);

            glMatrix.mat4.getScaling(scale, parentTransform);
            glMatrix.vec3.divide(inverseScale, one, scale);
            glMatrix.mat4.scale(convertTransform, parentTransform, inverseScale);

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

Float32Array.prototype.mat4_hasUniformScale = function () {
    let scale = glMatrix.vec3.create();
    return function () {
        glMatrix.mat4.getScaling(scale, this);
        return Math.abs(scale[0] - scale[1]) < this._pp_epsilon && Math.abs(scale[1] - scale[2]) < this._pp_epsilon && Math.abs(scale[0] - scale[2]) < this._pp_epsilon;
    };
}();

Float32Array.prototype.mat4_toQuat = function () {
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    return function (out = glMatrix.quat2.create()) {
        glMatrix.mat4.getTranslation(position, this);
        this.mat4_getRotationQuat(rotation);
        glMatrix.quat2.fromRotationTranslation(out, rotation, position);
        return out;
    };
}();

Float32Array.prototype.mat4_fromQuat = function (transformQuat) {
    transformQuat.quat2_toMatrix(this);
    return this;
};

//CREATION

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

Float32Array.prototype._pp_epsilon = 0.000001;

Float32Array.prototype._pp_clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};

Float32Array.prototype._vec_buildConsoleMessage = function (decimalPlaces) {
    let message = "[";

    for (let i = 0; i < this.length; i++) {
        if (i != 0) {
            message = message.concat(", ");
        }

        message = message.concat(this[i].toFixed(decimalPlaces));
    }

    message = message.concat("]");
    return message;
};

Float32Array.prototype._vec_prepareOut = function (out) {
    if (out == null) {
        out = this.pp_clone();
    } else if (out != this) {
        out.pp_copy(this);
    }

    return out;
};

for (let key in Float32Array.prototype) {
    let prefixes = ["pp_", "vec_", "vec3_", "vec4_", "quat_", "quat2_", "mat3_", "mat4_", "_pp_", "_vec_",];

    let found = false;
    for (let prefix of prefixes) {
        if (key.startsWith(prefix)) {
            found = true;
            break;
        }
    }

    if (found) {
        Object.defineProperty(Float32Array.prototype, key, { enumerable: false });
    }
}
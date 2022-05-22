/*
    How to use

    By default the functions work on World space, rotations are in Degrees and transforms are Matrix (and not Quat 2) 
    For functions that work with rotations, Matrix means Matrix 3 and Quat means Quat
    For functions that work with transforms, Matrix means Matrix 4 and Quat means Quat 2

    You can add a suffix like World/Local/Object at the end of some functions to specify the space, example:
        - pp_getPositionLocal to get the position in local space (parent space)
        - pp_translateObject to translate in object space

    For rotations u can add a suffix like Degrees/Radians/Quat/Matrix to use a specific version, example:
        - pp_getRotationDegrees
        - pp_setRotationLocalMatrix
        - pp_rotateWorldQuat
        
    For transform u can add a suffix like Quat/Matrix to use a specific version, example:
        - pp_getTransformQuat
        - pp_setTransformWorldMatrix
        
    Some functions let you specify if u want them to work on the Hierarchy/Descendants/Children where:
        - Children: direct children of the object
        - Descendants: all the children of the object, including child of child and so on 
        - Hierarchy: Descendants plus the current object
    By default the functions work on the current object alone:
        - pp_getComponent
        - pp_getComponentHierarchy
        - pp_getComponentAmountMapDescendants
        - pp_setActiveChildren

    The functions leave u the choice of forwarding an out parameter or just get the return value, example:
        - let position = this.object.pp_getPosition()
        - this.object.pp_getPosition(position)
        - the out parameter is always the last one

    List of functions:
        Notes:
            - The suffixes (like World or Radians) are omitted 

        - pp_getPosition    / pp_setPosition    / pp_resetPosition
        - pp_getRotation    / pp_setRotation    / pp_resetRotation
        - pp_getScale       / pp_setScale (u can specify a single number instead of a vector to uniform scale easily)   / pp_resetScale 
        - pp_getTransform   / pp_setTransform   / pp_resetTransform

        - pp_getLeft        / pp_getRight
        - pp_getUp          / pp_getDown
        - pp_getForward     / pp_getBackward

        - pp_translate      / pp_translateAxis
        - pp_rotate         / pp_rotateAxis     / pp_rotateAround    / pp_rotateAroundAxis
        - pp_scaleObject (for now scale only have this variant) (u can specify a single number instead of a vector to uniform scale easily)

        - pp_lookAt         / pp_lookTo (u can avoid to specify up and the function will pickup the object up by default)

        - pp_getParent      / pp_setParent (let u specify if u want to keep the transform or not)

        - pp_convertPositionObjectToWorld (you can use all the combinations between Object/Local/World)
        - pp_convertDirectionObjectToWorld (you can use all the combinations between Object/Local/World)
        - pp_convertTransformObjectToWorld (you can use all the combinations between Object/Local/World) (u also have Quat and Matrix version)

        - pp_hasUniformScale

        - pp_addComponent  /  pp_getComponent  / pp_getComponentHierarchy / pp_getComponentDescendants / pp_getComponentChildren
        - pp_getComponents  / pp_getComponentsHierarchy / pp_getComponentsDescendants / pp_getComponentsChildren

        - pp_setActive  / pp_setActiveHierarchy / pp_setActiveDescendants / pp_setActiveChildren

        - pp_clone      / pp_isCloneable

        - pp_getName    / pp_setName
        - pp_getID
        - pp_getHierarchy / pp_getDescendants / pp_getChildren
        - pp_reserveObjects / pp_reserveObjectsHierarchy / pp_reserveObjectsDescendants / pp_reserveObjectsChildren
        - pp_getComponentAmountMap / pp_getComponentAmountMapHierarchy / pp_getComponentAmountMapDescendants / pp_getComponentAmountMapChildren
        - pp_markDirty
        - pp_equals
        - pp_destroy
*/

import * as glMatrix from 'gl-matrix';

if (WL && WL.Object) {

    //GETTER

    //Position

    WL.Object.prototype.pp_getPosition = function (position) {
        return this.pp_getPositionWorld(position);
    };

    WL.Object.prototype.pp_getPositionWorld = function (position = glMatrix.vec3.create()) {
        this.getTranslationWorld(position);
        return position;
    };

    WL.Object.prototype.pp_getPositionLocal = function (position = glMatrix.vec3.create()) {
        this.getTranslationLocal(position);
        return position;
    };

    //Rotation

    WL.Object.prototype.pp_getRotation = function (rotation) {
        return this.pp_getRotationWorld(rotation);
    };
    WL.Object.prototype.pp_getRotationDegrees = function (rotation) {
        return this.pp_getRotationWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_getRotationRadians = function (rotation) {
        return this.pp_getRotationWorldRadians(rotation);
    };

    WL.Object.prototype.pp_getRotationMatrix = function (rotation) {
        return this.pp_getRotationWorldMatrix(rotation);
    };

    WL.Object.prototype.pp_getRotationQuat = function (rotation) {
        return this.pp_getRotationWorldQuat(rotation);
    };

    //Rotation World

    WL.Object.prototype.pp_getRotationWorld = function (rotation) {
        return this.pp_getRotationWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_getRotationWorldDegrees = function (rotation) {
        rotation = this.pp_getRotationWorldRadians(rotation);
        rotation.forEach(function (value, index, array) {
            array[index] = this._pp_toDegrees(value);
        }.bind(this));
        return rotation;
    };

    WL.Object.prototype.pp_getRotationWorldRadians = function () {
        let quat = glMatrix.quat.create();
        return function (rotation = glMatrix.vec3.create()) {
            this.pp_getRotationWorldQuat(quat);
            this._pp_quaternionToRadians(quat, rotation);
            return rotation;
        };
    }();

    WL.Object.prototype.pp_getRotationWorldMatrix = function () {
        let quat = glMatrix.quat.create();
        return function (rotation = glMatrix.mat3.create()) {
            this.pp_getRotationWorldQuat(quat);
            glMatrix.mat3.fromQuat(rotation, quat);
            return rotation;
        };
    }();

    WL.Object.prototype.pp_getRotationWorldQuat = function (rotation = glMatrix.quat.create()) {
        glMatrix.quat.copy(rotation, this.rotationWorld);
        return rotation;
    };

    //Rotation Local

    WL.Object.prototype.pp_getRotationLocal = function (rotation) {
        return this.pp_getRotationLocalDegrees(rotation);
    };

    WL.Object.prototype.pp_getRotationLocalDegrees = function (rotation) {
        rotation = this.pp_getRotationLocalRadians(rotation);
        rotation.forEach(function (value, index, array) {
            array[index] = this._pp_toDegrees(value);
        }.bind(this));
        return rotation;
    };

    WL.Object.prototype.pp_getRotationLocalRadians = function () {
        let quat = glMatrix.quat.create();
        return function (rotation = glMatrix.vec3.create()) {
            this.pp_getRotationLocalQuat(quat);
            this._pp_quaternionToRadians(quat, rotation);
            return rotation;
        };
    }();

    WL.Object.prototype.pp_getRotationLocalMatrix = function () {
        let quat = glMatrix.quat.create();
        return function (rotation = glMatrix.mat3.create()) {
            this.pp_getRotationLocalQuat(quat);
            glMatrix.mat3.fromQuat(rotation, quat);
            return rotation;
        };
    }();

    WL.Object.prototype.pp_getRotationLocalQuat = function (rotation = glMatrix.quat.create()) {
        glMatrix.quat.copy(rotation, this.rotationLocal);
        return rotation;
    };

    //Scale

    WL.Object.prototype.pp_getScale = function (scale) {
        return this.pp_getScaleWorld(scale);
    };

    WL.Object.prototype.pp_getScaleWorld = function (scale = glMatrix.vec3.create()) {
        glMatrix.vec3.copy(scale, this.scalingWorld);
        return scale;
    };

    WL.Object.prototype.pp_getScaleLocal = function (scale = glMatrix.vec3.create()) {
        glMatrix.vec3.copy(scale, this.scalingLocal);
        return scale;
    };

    //Transform

    WL.Object.prototype.pp_getTransform = function (transform) {
        return this.pp_getTransformWorld(transform);
    };

    WL.Object.prototype.pp_getTransformMatrix = function (transform) {
        return this.pp_getTransformWorldMatrix(transform);
    };

    WL.Object.prototype.pp_getTransformQuat = function (transform) {
        return this.pp_getTransformWorldQuat(transform);
    };

    //Transform World

    WL.Object.prototype.pp_getTransformWorld = function (transform) {
        return this.pp_getTransformWorldMatrix(transform);
    };

    WL.Object.prototype.pp_getTransformWorldMatrix = function () {
        let transformQuat = glMatrix.quat2.create();
        let scale = glMatrix.vec3.create();
        return function (transform = glMatrix.mat4.create()) {
            this.pp_getTransformWorldQuat(transformQuat);
            this.pp_getScaleWorld(scale);
            glMatrix.mat4.fromQuat2(transform, transformQuat);
            glMatrix.mat4.scale(transform, transform, scale);
            return transform;
        };
    }();

    WL.Object.prototype.pp_getTransformWorldQuat = function (transform = glMatrix.quat2.create()) {
        glMatrix.quat2.copy(transform, this.transformWorld);
        return transform;
    };

    //Transform Local

    WL.Object.prototype.pp_getTransformLocal = function (transform) {
        return this.pp_getTransformLocalMatrix(transform);
    };

    WL.Object.prototype.pp_getTransformLocalMatrix = function () {
        let transformQuat = glMatrix.quat2.create();
        let scale = glMatrix.vec3.create();
        return function (transform = glMatrix.mat4.create()) {
            this.pp_getTransformLocalQuat(transformQuat);
            this.pp_getScaleLocal(scale);
            glMatrix.mat4.fromQuat2(transform, transformQuat);
            glMatrix.mat4.scale(transform, transform, scale);
            return transform;
        };
    }();

    WL.Object.prototype.pp_getTransformLocalQuat = function (transform = glMatrix.quat2.create()) {
        glMatrix.quat2.copy(transform, this.transformLocal);
        return transform;
    };

    //Forward

    WL.Object.prototype.pp_getForward = function (forward) {
        return this.pp_getForwardWorld(forward);
    };

    WL.Object.prototype.pp_getForwardWorld = function () {
        let rotation = glMatrix.mat3.create();
        return function (forward = glMatrix.vec3.create()) {
            this.pp_getRotationWorldMatrix(rotation);
            forward[0] = rotation[6];
            forward[1] = rotation[7];
            forward[2] = rotation[8];
            return forward;
        };
    }();

    WL.Object.prototype.pp_getForwardLocal = function () {
        let rotation = glMatrix.mat3.create();
        return function (forward = glMatrix.vec3.create()) {
            this.pp_getRotationLocalMatrix(rotation);
            forward[0] = rotation[6];
            forward[1] = rotation[7];
            forward[2] = rotation[8];
            return forward;
        };
    }();

    //Backward

    WL.Object.prototype.pp_getBackward = function (backward) {
        return this.pp_getBackwardWorld(backward);
    };

    WL.Object.prototype.pp_getBackwardWorld = function () {
        let rotation = glMatrix.mat3.create();
        return function (backward = glMatrix.vec3.create()) {
            this.pp_getRotationWorldMatrix(rotation);
            backward[0] = -rotation[6];
            backward[1] = -rotation[7];
            backward[2] = -rotation[8];
            return backward;
        };
    }();

    WL.Object.prototype.pp_getBackwardLocal = function () {
        let rotation = glMatrix.mat3.create();
        return function (backward = glMatrix.vec3.create()) {
            this.pp_getRotationLocalMatrix(rotation);
            backward[0] = -rotation[6];
            backward[1] = -rotation[7];
            backward[2] = -rotation[8];
            return backward;
        };
    }();

    //Up

    WL.Object.prototype.pp_getUp = function (up) {
        return this.pp_getUpWorld(up);
    };

    WL.Object.prototype.pp_getUpWorld = function () {
        let rotation = glMatrix.mat3.create();
        return function (up = glMatrix.vec3.create()) {
            this.pp_getRotationWorldMatrix(rotation);
            up[0] = rotation[3];
            up[1] = rotation[4];
            up[2] = rotation[5];
            return up;
        };
    }();

    WL.Object.prototype.pp_getUpLocal = function () {
        let rotation = glMatrix.mat3.create();
        return function (up = glMatrix.vec3.create()) {
            this.pp_getRotationLocalMatrix(rotation);
            up[0] = rotation[3];
            up[1] = rotation[4];
            up[2] = rotation[5];
            return up;
        };
    }();

    //Down

    WL.Object.prototype.pp_getDown = function (down) {
        return this.pp_getDownWorld(down);
    };

    WL.Object.prototype.pp_getDownWorld = function () {
        let rotation = glMatrix.mat3.create();
        return function (down = glMatrix.vec3.create()) {
            this.pp_getRotationWorldMatrix(rotation);
            down[0] = -rotation[3];
            down[1] = -rotation[4];
            down[2] = -rotation[5];
            return down;
        };
    }();

    WL.Object.prototype.pp_getDownLocal = function () {
        let rotation = glMatrix.mat3.create();
        return function (down = glMatrix.vec3.create()) {
            this.pp_getRotationLocalMatrix(rotation);
            down[0] = -rotation[3];
            down[1] = -rotation[4];
            down[2] = -rotation[5];
            return down;
        };
    }();

    //Left

    WL.Object.prototype.pp_getLeft = function (left) {
        return this.pp_getLeftWorld(left);
    };

    WL.Object.prototype.pp_getLeftWorld = function () {
        let rotation = glMatrix.mat3.create();
        return function (left = glMatrix.vec3.create()) {
            this.pp_getRotationWorldMatrix(rotation);
            left[0] = rotation[0];
            left[1] = rotation[1];
            left[2] = rotation[2];
            return left;
        };
    }();

    WL.Object.prototype.pp_getLeftLocal = function () {
        let rotation = glMatrix.mat3.create();
        return function (left = glMatrix.vec3.create()) {
            this.pp_getRotationLocalMatrix(rotation);
            left[0] = rotation[0];
            left[1] = rotation[1];
            left[2] = rotation[2];
            return left;
        };
    }();

    //Right

    WL.Object.prototype.pp_getRight = function (right) {
        return this.pp_getRightWorld(right);
    };

    WL.Object.prototype.pp_getRightWorld = function () {
        let rotation = glMatrix.mat3.create();
        return function (right = glMatrix.vec3.create()) {
            this.pp_getRotationWorldMatrix(rotation);
            right[0] = -rotation[0];
            right[1] = -rotation[1];
            right[2] = -rotation[2];
            return right;
        };
    }();

    WL.Object.prototype.pp_getRightLocal = function () {
        let rotation = glMatrix.mat3.create();
        return function (right = glMatrix.vec3.create()) {
            this.pp_getRotationLocalMatrix(rotation);
            right[0] = -rotation[0];
            right[1] = -rotation[1];
            right[2] = -rotation[2];
            return right;
        };
    }();

    //SETTER

    //Position

    WL.Object.prototype.pp_setPosition = function (position) {
        this.pp_setPositionWorld(position);
    };

    WL.Object.prototype.pp_setPositionWorld = function (position) {
        this.setTranslationWorld(position);
    };

    WL.Object.prototype.pp_setPositionLocal = function (position) {
        this.setTranslationLocal(position);
    };

    //Rotation

    WL.Object.prototype.pp_setRotation = function (rotation) {
        this.pp_setRotationWorld(rotation);
    };
    WL.Object.prototype.pp_setRotationDegrees = function (rotation) {
        this.pp_setRotationWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_setRotationRadians = function (rotation) {
        this.pp_setRotationWorldRadians(rotation);
    };

    WL.Object.prototype.pp_setRotationMatrix = function (rotation) {
        this.pp_setRotationWorldMatrix(rotation);
    };

    WL.Object.prototype.pp_setRotationQuat = function (rotation) {
        this.pp_setRotationWorldQuat(rotation);
    };

    //Rotation World

    WL.Object.prototype.pp_setRotationWorld = function (rotation) {
        this.pp_setRotationWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_setRotationWorldDegrees = function () {
        let quat = glMatrix.quat.create();
        return function (rotation) {
            this._pp_degreesToQuaternion(rotation, quat);
            this.pp_setRotationWorldQuat(quat);
        };
    }();

    WL.Object.prototype.pp_setRotationWorldRadians = function () {
        let degreesRotation = glMatrix.vec3.create();
        return function (rotation) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_setRotationWorldDegrees(degreesRotation);
        };
    }();

    WL.Object.prototype.pp_setRotationWorldMatrix = function () {
        let quat = glMatrix.quat.create();
        return function (rotation) {
            glMatrix.quat.fromMat3(quat, rotation);
            this.pp_setRotationWorldQuat(quat);
        };
    }();

    WL.Object.prototype.pp_setRotationWorldQuat = function (rotation) {
        this.rotationWorld = rotation;
    };

    //Rotation Local

    WL.Object.prototype.pp_setRotationLocal = function (rotation) {
        this.pp_setRotationLocalDegrees(rotation);
    };

    WL.Object.prototype.pp_setRotationLocalDegrees = function () {
        let quat = glMatrix.quat.create();
        return function (rotation) {
            this._pp_degreesToQuaternion(rotation, quat);
            this.pp_setRotationLocalQuat(quat);
        };
    }();

    WL.Object.prototype.pp_setRotationLocalRadians = function () {
        let degreesRotation = glMatrix.vec3.create();
        return function (rotation) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_setRotationLocalDegrees(degreesRotation);
        };
    }();

    WL.Object.prototype.pp_setRotationLocalMatrix = function () {
        let quat = glMatrix.quat.create();
        return function (rotation) {
            glMatrix.quat.fromMat3(quat, rotation);
            this.pp_setRotationLocalQuat(quat);
        };
    }();

    WL.Object.prototype.pp_setRotationLocalQuat = function (rotation) {
        this.rotationLocal = rotation;
    };

    //Scale

    WL.Object.prototype.pp_setScale = function (scale) {
        this.pp_setScaleWorld(scale);
    };

    WL.Object.prototype.pp_setScaleWorld = function () {
        let vector = glMatrix.vec3.create();
        return function (scale) {
            if (isNaN(scale)) {
                this.scalingWorld = scale;
            } else {
                glMatrix.vec3.set(vector, scale, scale, scale);
                this.scalingWorld = vector;
            }
        };
    }();

    WL.Object.prototype.pp_setScaleLocal = function () {
        let vector = glMatrix.vec3.create();
        return function (scale) {
            if (isNaN(scale)) {
                this.scalingLocal = scale;
            } else {
                glMatrix.vec3.set(vector, scale, scale, scale);
                this.scalingLocal = vector;
            }
        };
    }();

    //Transform

    WL.Object.prototype.pp_setTransform = function (transform) {
        this.pp_setTransformWorld(transform);
    };

    WL.Object.prototype.pp_setTransformMatrix = function (transform) {
        this.pp_setTransformWorldMatrix(transform);
    };

    WL.Object.prototype.pp_setTransformQuat = function (transform) {
        this.pp_setTransformWorldQuat(transform);
    };

    //Transform World

    WL.Object.prototype.pp_setTransformWorld = function (transform) {
        return this.pp_setTransformWorldMatrix(transform);
    };

    WL.Object.prototype.pp_setTransformWorldMatrix = function () {
        let position = glMatrix.vec3.create();
        let rotation = glMatrix.quat.create();
        let scale = glMatrix.vec3.create();
        let transformMatrixNoScale = glMatrix.mat4.create();
        let inverseScale = glMatrix.vec3.create();
        let one = glMatrix.vec3.create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function (transform) {
            glMatrix.mat4.getTranslation(position, transform);
            glMatrix.mat4.getScaling(scale, transform);
            glMatrix.vec3.divide(inverseScale, one, scale);
            glMatrix.mat4.scale(transformMatrixNoScale, transform, inverseScale);
            glMatrix.mat4.getRotation(rotation, transformMatrixNoScale);
            glMatrix.quat.normalize(rotation, rotation);
            this.pp_setScaleWorld(scale);
            this.pp_setRotationWorldQuat(rotation);
            this.pp_setPositionWorld(position);
        };
    }();

    WL.Object.prototype.pp_setTransformWorldQuat = function (transform) {
        this.transformWorld = transform;
    };

    //Transform Local

    WL.Object.prototype.pp_setTransformLocal = function (transform) {
        return this.pp_setTransformLocalMatrix(transform);
    };

    WL.Object.prototype.pp_setTransformLocalMatrix = function () {
        let position = glMatrix.vec3.create();
        let rotation = glMatrix.quat.create();
        let scale = glMatrix.vec3.create();
        let transformMatrixNoScale = glMatrix.mat4.create();
        let inverseScale = glMatrix.vec3.create();
        let one = glMatrix.vec3.create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function (transform) {
            glMatrix.mat4.getTranslation(position, transform);
            glMatrix.mat4.getScaling(scale, transform);
            glMatrix.vec3.divide(inverseScale, one, scale);
            glMatrix.mat4.scale(transformMatrixNoScale, transform, inverseScale);
            glMatrix.mat4.getRotation(rotation, transformMatrixNoScale);
            glMatrix.quat.normalize(rotation, rotation);
            this.pp_setScaleLocal(scale);
            this.pp_setRotationLocalQuat(rotation);
            this.pp_setPositionLocal(position);
        };
    }();

    WL.Object.prototype.pp_setTransformLocalQuat = function (transform) {
        this.transformLocal = transform;
    };

    //RESET

    //Position

    WL.Object.prototype.pp_resetPosition = function () {
        this.pp_resetPositionWorld();
    };

    WL.Object.prototype.pp_resetPositionWorld = function () {
        let zero = glMatrix.vec3.create();
        return function () {
            this.pp_setPositionWorld(zero);
        };
    }();

    WL.Object.prototype.pp_resetPositionLocal = function () {
        let zero = glMatrix.vec3.create();
        return function () {
            this.pp_setPositionLocal(zero);
        };
    }();

    //Rotation

    WL.Object.prototype.pp_resetRotation = function () {
        this.pp_resetRotationWorld();
    };

    WL.Object.prototype.pp_resetRotationWorld = function () {
        let identity = glMatrix.quat.create();
        return function () {
            this.pp_setRotationWorldQuat(identity);
        };
    }();

    WL.Object.prototype.pp_resetRotationLocal = function () {
        let identity = glMatrix.quat.create();
        return function () {
            this.pp_setRotationLocalQuat(identity);
        };
    }();

    //Scale

    WL.Object.prototype.pp_resetScale = function () {
        this.pp_resetScaleWorld();
    };

    WL.Object.prototype.pp_resetScaleWorld = function () {
        let one = glMatrix.vec3.create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function () {
            this.pp_setScaleWorld(one);
        };
    }();

    WL.Object.prototype.pp_resetScaleLocal = function () {
        let one = glMatrix.vec3.create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function () {
            this.pp_setScaleLocal(one);
        };
    }();

    //Transform

    WL.Object.prototype.pp_resetTransform = function () {
        this.pp_resetTransformWorld();
    };

    WL.Object.prototype.pp_resetTransformWorld = function () {
        this.pp_resetScaleWorld();
        this.pp_resetRotationWorld();
        this.pp_resetPositionWorld();
    };

    WL.Object.prototype.pp_resetTransformLocal = function () {
        this.pp_resetScaleLocal();
        this.pp_resetRotationLocal();
        this.pp_resetPositionLocal();
    };

    //TRANSFORMATIONS

    //Translate

    WL.Object.prototype.pp_translate = function (translation) {
        this.pp_translateWorld(translation);
    };

    WL.Object.prototype.pp_translateWorld = function (translation) {
        this.translateWorld(translation);
    };

    WL.Object.prototype.pp_translateLocal = function (translation) {
        this.translate(translation);
    };

    WL.Object.prototype.pp_translateObject = function (translation) {
        this.translateObject(translation);
    };

    //Translate Axis

    WL.Object.prototype.pp_translateAxis = function (direction, amount) {
        this.pp_translateAxisWorld(direction, amount);
    };

    WL.Object.prototype.pp_translateAxisWorld = function () {
        let translation = glMatrix.vec3.create();
        return function (direction, amount) {
            glMatrix.vec3.scale(translation, direction, amount);
            this.pp_translateWorld(translation);
        };
    }();

    WL.Object.prototype.pp_translateAxisLocal = function () {
        let translation = glMatrix.vec3.create();
        return function (direction, amount) {
            glMatrix.vec3.scale(translation, direction, amount);
            this.pp_translateLocal(translation);
        };
    }();

    WL.Object.prototype.pp_translateAxisObject = function () {
        let translation = glMatrix.vec3.create();
        return function (direction, amount) {
            glMatrix.vec3.scale(translation, direction, amount);
            this.pp_translateObject(translation);
        };
    }();

    //Rotate

    WL.Object.prototype.pp_rotate = function (rotation) {
        this.pp_rotateWorld(rotation);
    };

    WL.Object.prototype.pp_rotateDegrees = function (rotation) {
        this.pp_rotateWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_rotateRadians = function (rotation) {
        this.pp_rotateWorldRadians(rotation);
    };

    WL.Object.prototype.pp_rotateMatrix = function (rotation) {
        this.pp_rotateWorldMatrix(rotation);
    };

    WL.Object.prototype.pp_rotateQuat = function (rotation) {
        this.pp_rotateWorldQuat(rotation);
    };

    //Rotate World

    WL.Object.prototype.pp_rotateWorld = function (rotation) {
        this.pp_rotateWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_rotateWorldDegrees = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateWorldQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateWorldRadians = function () {
        let degreesRotation = glMatrix.vec3.create();
        return function (rotation) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateWorldDegrees(degreesRotation);
        };
    }();

    WL.Object.prototype.pp_rotateWorldMatrix = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation) {
            glMatrix.quat.fromMat3(rotationQuat, rotation);
            glMatrix.quat.normalize(rotationQuat, rotationQuat);
            this.pp_rotateWorldQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateWorldQuat = function () {
        let currentRotationQuat = glMatrix.quat.create();
        return function (rotation) {
            this.pp_getRotationWorldQuat(currentRotationQuat);
            glMatrix.quat.mul(currentRotationQuat, rotation, currentRotationQuat);
            glMatrix.quat.normalize(currentRotationQuat, currentRotationQuat);
            this.pp_setRotationWorldQuat(currentRotationQuat);
        };
    }();

    //Rotate Local

    WL.Object.prototype.pp_rotateLocal = function (rotation) {
        this.pp_rotateLocalDegrees(rotation);
    };

    WL.Object.prototype.pp_rotateLocalDegrees = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateLocalQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateLocalRadians = function () {
        let degreesRotation = glMatrix.vec3.create();
        return function (rotation) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateLocalDegrees(degreesRotation);
        };
    }();

    WL.Object.prototype.pp_rotateLocalMatrix = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation) {
            glMatrix.quat.fromMat3(rotationQuat, rotation);
            glMatrix.quat.normalize(rotationQuat, rotationQuat);
            this.pp_rotateLocalQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateLocalQuat = function () {
        let currentRotationQuat = glMatrix.quat.create();
        return function (rotation) {
            this.pp_getRotationLocalQuat(currentRotationQuat);
            glMatrix.quat.mul(currentRotationQuat, rotation, currentRotationQuat);
            glMatrix.quat.normalize(currentRotationQuat, currentRotationQuat);
            this.pp_setRotationLocalQuat(currentRotationQuat);
        };
    }();

    //Rotate Object

    WL.Object.prototype.pp_rotateObject = function (rotation) {
        this.pp_rotateObjectDegrees(rotation);
    };

    WL.Object.prototype.pp_rotateObjectDegrees = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateObjectQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateObjectRadians = function () {
        let degreesRotation = glMatrix.vec3.create();
        return function (rotation) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateObjectDegrees(degreesRotation);
        };
    }();

    WL.Object.prototype.pp_rotateObjectMatrix = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation) {
            glMatrix.quat.fromMat3(rotationQuat, rotation);
            glMatrix.quat.normalize(rotationQuat, rotationQuat);
            this.pp_rotateObjectQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateObjectQuat = function (rotation) {
        this.rotateObject(rotation);
    };

    //Rotate Axis

    WL.Object.prototype.pp_rotateAxis = function (angle, axis) {
        this.pp_rotateAxisWorld(angle, axis);
    };

    WL.Object.prototype.pp_rotateAxisDegrees = function (angle, axis) {
        this.pp_rotateAxisWorldDegrees(angle, axis);
    };

    WL.Object.prototype.pp_rotateAxisRadians = function (angle, axis) {
        this.pp_rotateAxisWorldRadians(angle, axis);
    };

    //Rotate Axis World

    WL.Object.prototype.pp_rotateAxisWorld = function (angle, axis) {
        this.pp_rotateAxisWorldDegrees(angle, axis);
    };

    WL.Object.prototype.pp_rotateAxisWorldDegrees = function (angle, axis) {
        this.pp_rotateAxisWorldRadians(glMatrix.glMatrix.toRadian(angle), axis);
    };

    WL.Object.prototype.pp_rotateAxisWorldRadians = function () {
        let rotation = glMatrix.quat.create();
        return function (angle, axis) {
            glMatrix.quat.setAxisAngle(rotation, axis, angle);
            this.pp_rotateWorldQuat(rotation);
        };
    }();

    //Rotate Axis Local

    WL.Object.prototype.pp_rotateAxisLocal = function (angle, axis) {
        this.pp_rotateAxisLocalDegrees(angle, axis);
    };

    WL.Object.prototype.pp_rotateAxisLocalDegrees = function (angle, axis) {
        this.pp_rotateAxisLocalRadians(glMatrix.glMatrix.toRadian(angle), axis);
    };

    WL.Object.prototype.pp_rotateAxisLocalRadians = function () {
        let rotation = glMatrix.quat.create();
        return function (angle, axis) {
            glMatrix.quat.setAxisAngle(rotation, axis, angle);
            this.pp_rotateLocalQuat(rotation);
        };
    }();

    //Rotate Axis Object

    WL.Object.prototype.pp_rotateAxisObject = function (angle, axis) {
        this.pp_rotateAxisObjectDegrees(angle, axis);
    };

    WL.Object.prototype.pp_rotateAxisObjectDegrees = function (angle, axis) {
        this.pp_rotateAxisObjectRadians(glMatrix.glMatrix.toRadian(angle), axis);
    };

    WL.Object.prototype.pp_rotateAxisObjectRadians = function () {
        let rotation = glMatrix.quat.create();
        return function (angle, axis) {
            glMatrix.quat.setAxisAngle(rotation, axis, angle);
            this.pp_rotateObjectQuat(rotation);
        };
    }();

    //Rotate Around

    WL.Object.prototype.pp_rotateAround = function (rotation, origin) {
        this.pp_rotateAroundWorld(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundDegrees = function (rotation, origin) {
        this.pp_rotateAroundWorldDegrees(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundRadians = function (rotation, origin) {
        this.pp_rotateAroundWorldRadians(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundMatrix = function (rotation, origin) {
        this.pp_rotateAroundWorldMatrix(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundQuat = function (rotation, origin) {
        this.pp_rotateAroundWorldQuat(rotation, origin);
    };

    //Rotate Around World

    WL.Object.prototype.pp_rotateAroundWorld = function (rotation, origin) {
        this.pp_rotateAroundWorldDegrees(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundWorldDegrees = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation, origin) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateAroundWorldQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundWorldRadians = function () {
        let degreesRotation = glMatrix.vec3.create();
        return function (rotation, origin) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateAroundWorldDegrees(degreesRotation, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundWorldMatrix = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation, origin) {
            glMatrix.quat.fromMat3(rotationQuat, rotation);
            glMatrix.quat.normalize(rotationQuat, rotationQuat);
            this.pp_rotateAroundWorldQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundWorldQuat = function () {
        let axis = glMatrix.vec3.create();
        return function (rotation, origin) {
            let angle = glMatrix.quat.getAxisAngle(axis, rotation);
            this.pp_rotateAroundAxisWorldRadians(angle, axis, origin);
        };
    }();

    //Rotate Around Local

    WL.Object.prototype.pp_rotateAroundLocal = function (rotation, origin) {
        this.pp_rotateAroundLocalDegrees(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundLocalDegrees = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation, origin) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateAroundLocalQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundLocalRadians = function () {
        let degreesRotation = glMatrix.vec3.create();
        return function (rotation, origin) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateAroundLocalDegrees(degreesRotation, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundLocalMatrix = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation, origin) {
            glMatrix.quat.fromMat3(rotationQuat, rotation);
            glMatrix.quat.normalize(rotationQuat, rotationQuat);
            this.pp_rotateAroundLocalQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundLocalQuat = function () {
        let axis = glMatrix.vec3.create();
        return function (rotation, origin) {
            let angle = glMatrix.quat.getAxisAngle(axis, rotation);
            this.pp_rotateAroundAxisLocalRadians(angle, axis, origin);
        };
    }();

    //Rotate Around Object

    WL.Object.prototype.pp_rotateAroundObject = function (rotation, origin) {
        this.pp_rotateAroundObjectDegrees(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundObjectDegrees = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation, origin) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateAroundObjectQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundObjectRadians = function () {
        let degreesRotation = glMatrix.vec3.create();
        return function (rotation, origin) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateAroundObjectDegrees(degreesRotation, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundObjectMatrix = function () {
        let rotationQuat = glMatrix.quat.create();
        return function (rotation, origin) {
            glMatrix.quat.fromMat3(rotationQuat, rotation);
            glMatrix.quat.normalize(rotationQuat, rotationQuat);
            this.pp_rotateAroundObjectQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundObjectQuat = function () {
        let axis = glMatrix.vec3.create();
        return function (rotation, origin) {
            let angle = glMatrix.quat.getAxisAngle(axis, rotation);
            this.pp_rotateAroundAxisObjectRadians(angle, axis, origin);
        };
    }();

    //Rotate Around Axis

    WL.Object.prototype.pp_rotateAroundAxis = function (angle, axis, origin) {
        this.pp_rotateAroundAxisWorld(angle, axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisDegrees = function (angle, axis, origin) {
        this.pp_rotateAroundAxisWorldDegrees(angle, axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisRadians = function (angle, axis, origin) {
        this.pp_rotateAroundAxisWorldRadians(angle, axis, origin);
    };

    //Rotate Around Axis World

    WL.Object.prototype.pp_rotateAroundAxisWorld = function (angle, axis, origin) {
        this.pp_rotateAroundAxisWorldDegrees(angle, axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisWorldDegrees = function (angle, axis, origin) {
        this.pp_rotateAroundAxisWorldRadians(glMatrix.glMatrix.toRadian(angle), axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisWorldRadians = function () {
        let transformToRotate = glMatrix.quat2.create();
        let transformToRotateConjugate = glMatrix.quat2.create();
        let transformQuat = glMatrix.quat2.create();
        let defaultQuat = glMatrix.quat.create();
        return function (angle, axis, origin) {
            glMatrix.quat2.fromRotationTranslation(transformToRotate, defaultQuat, origin);
            this.pp_getTransformWorldQuat(transformQuat);
            glMatrix.quat2.conjugate(transformToRotateConjugate, transformToRotate);
            glMatrix.quat2.mul(transformQuat, transformToRotateConjugate, transformQuat);
            glMatrix.quat2.rotateAroundAxis(transformToRotate, transformToRotate, axis, angle);
            glMatrix.quat2.mul(transformQuat, transformToRotate, transformQuat);
            this.pp_setTransformWorldQuat(transformQuat);
        };
    }();

    //Rotate Around Axis Local

    WL.Object.prototype.pp_rotateAroundAxisLocal = function (angle, axis, origin) {
        this.pp_rotateAroundAxisLocalDegrees(angle, axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisLocalDegrees = function (angle, axis, origin) {
        this.pp_rotateAroundAxisLocalRadians(glMatrix.glMatrix.toRadian(angle), axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisLocalRadians = function () {
        let convertedPosition = glMatrix.vec3.create();
        let convertedAxis = glMatrix.vec3.create();
        return function (angle, axis, origin) {
            this.pp_convertPositionLocalToWorld(origin, convertedPosition);
            this.pp_convertDirectionLocalToWorld(axis, convertedAxis);
            this.pp_rotateAroundAxisWorldRadians(angle, convertedAxis, convertedPosition);
        };
    }();

    //Rotate Around Axis Object

    WL.Object.prototype.pp_rotateAroundAxisObject = function (angle, axis, origin) {
        this.pp_rotateAroundAxisObjectDegrees(angle, axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisObjectDegrees = function (angle, axis, origin) {
        this.pp_rotateAroundAxisObjectRadians(glMatrix.glMatrix.toRadian(angle), axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisObjectRadians = function () {
        let convertedPosition = glMatrix.vec3.create();
        let convertedAxis = glMatrix.vec3.create();
        return function (angle, axis, origin) {
            this.pp_convertPositionObjectToWorld(origin, convertedPosition);
            this.pp_convertDirectionObjectToWorld(axis, convertedAxis);
            this.pp_rotateAroundAxisWorldRadians(angle, convertedAxis, convertedPosition);
        };
    }();

    //Scale

    //For now it does not really make sense in wle to scale in world space or parent space
    //so there is no pp_scale default function

    WL.Object.prototype.pp_scaleObject = function () {
        let vector = glMatrix.vec3.create();
        return function (scale) {
            if (isNaN(scale)) {
                this.scale(scale);
            } else {
                glMatrix.vec3.set(vector, scale, scale, scale);
                this.scale(vector);
            }
        };
    }();

    //Look At

    WL.Object.prototype.pp_lookAt = function (position, up) {
        this.pp_lookAtWorld(position, up);
    };

    WL.Object.prototype.pp_lookAtWorld = function () {
        let direction = glMatrix.vec3.create();
        return function (position, up) {
            this.pp_getPositionWorld(direction);
            glMatrix.vec3.sub(direction, position, direction);
            this.pp_lookToWorld(direction, up);
        };
    }();

    WL.Object.prototype.pp_lookAtLocal = function () {
        let direction = glMatrix.vec3.create();
        return function (position, up) {
            this.pp_getPositionLocal(direction);
            glMatrix.vec3.sub(direction, position, direction);
            this.pp_lookToLocal(direction, up);
        };
    }();

    WL.Object.prototype.pp_lookTo = function (direction, up) {
        this.pp_lookToWorld(direction, up);
    };

    WL.Object.prototype.pp_lookToWorld = function () {
        let internalUp = glMatrix.vec3.create();
        let currentPosition = glMatrix.vec3.create();
        let targetPosition = glMatrix.vec3.create();
        let targetToMatrix = glMatrix.mat4.create();
        let rotation = glMatrix.quat.create();
        return function (direction, up = this.pp_getUpWorld(internalUp)) {
            glMatrix.vec3.copy(internalUp, up); //to avoid changing the forwarded up
            let angle = glMatrix.vec3.angle(direction, internalUp);
            if (angle < this._pp_epsilon || angle > Math.PI - this._pp_epsilon) {
                //direction and up are too similar, trying with the default up
                this.pp_getUpWorld(internalUp);
                angle = glMatrix.vec3.angle(direction, internalUp);
                if (angle < this._pp_epsilon || angle > Math.PI - this._pp_epsilon) {
                    //this means we want the forward to become up, so getting forward as the up
                    this.pp_getForwardWorld(internalUp);
                    if (angle < this._pp_epsilon) {
                        glMatrix.vec3.negate(internalUp, internalUp);
                    }
                }
            }

            this.pp_getPositionWorld(currentPosition);
            glMatrix.vec3.add(targetPosition, currentPosition, direction);
            glMatrix.mat4.targetTo(targetToMatrix, targetPosition, currentPosition, internalUp);
            glMatrix.mat4.getRotation(rotation, targetToMatrix);
            glMatrix.quat.normalize(rotation, rotation);

            this.pp_setRotationWorldQuat(rotation);
        };
    }();

    WL.Object.prototype.pp_lookToLocal = function () {
        let internalUp = glMatrix.vec3.create();
        let currentPosition = glMatrix.vec3.create();
        let targetPosition = glMatrix.vec3.create();
        let targetToMatrix = glMatrix.mat4.create();
        let rotation = glMatrix.quat.create();
        return function (direction, up = this.pp_getUpLocal(internalUp)) {
            glMatrix.vec3.copy(internalUp, up); //to avoid changing the forwarded up
            let angle = glMatrix.vec3.angle(direction, internalUp);
            if (angle < this._pp_epsilon || angle > Math.PI - this._pp_epsilon) {
                //direction and up are too similar, trying with the default up
                this.pp_getUpLocal(internalUp);
                angle = glMatrix.vec3.angle(direction, internalUp);
                if (angle < this._pp_epsilon || angle > Math.PI - this._pp_epsilon) {
                    //this means we want the forward to become up, so getting forward as the up
                    this.pp_getForwardLocal(internalUp);
                    if (angle < this._pp_epsilon) {
                        glMatrix.vec3.negate(internalUp, internalUp);
                    }
                }
            }

            this.pp_getPositionLocal(currentPosition);
            glMatrix.vec3.add(targetPosition, currentPosition, direction);
            glMatrix.mat4.targetTo(targetToMatrix, targetPosition, currentPosition, internalUp);
            glMatrix.mat4.getRotation(rotation, targetToMatrix);
            glMatrix.quat.normalize(rotation, rotation);

            this.pp_setRotationLocalQuat(rotation);
        };
    }();

    //EXTRA

    //Parent

    WL.Object.prototype.pp_setParent = function () {
        let position = glMatrix.vec3.create();
        let rotation = glMatrix.quat.create();
        let scale = glMatrix.vec3.create();
        return function (newParent, keepTransform = true) {
            if (!keepTransform) {
                this.parent = newParent;
            } else {
                this.pp_getPositionWorld(position);
                this.pp_getRotationWorldQuat(rotation);
                this.pp_getScaleWorld(scale);
                this.parent = newParent;
                this.pp_setScaleWorld(scale);
                this.pp_setRotationWorldQuat(rotation);
                this.pp_setPositionWorld(position);
            }
        };
    }();

    WL.Object.prototype.pp_getParent = function () {
        return this.parent;
    };

    //Convert Vector Object World

    WL.Object.prototype.pp_convertPositionObjectToWorld = function () {
        let matrix = glMatrix.mat4.create();
        return function (position, resultPosition = glMatrix.vec3.create()) {
            this.pp_getTransformWorldMatrix(matrix);
            glMatrix.vec3.transformMat4(resultPosition, position, matrix);
            return resultPosition;
        };
    }();

    WL.Object.prototype.pp_convertDirectionObjectToWorld = function () {
        let rotation = glMatrix.quat.create();
        return function (direction, resultDirection = glMatrix.vec3.create()) {
            this.pp_getRotationWorldQuat(rotation);
            glMatrix.vec3.transformQuat(resultDirection, direction, rotation);
            return resultDirection;
        };
    }();

    WL.Object.prototype.pp_convertPositionWorldToObject = function () {
        let matrix = glMatrix.mat4.create();
        return function (position, resultPosition = glMatrix.vec3.create()) {
            this.pp_getTransformWorldMatrix(matrix);
            glMatrix.mat4.invert(matrix, matrix);
            glMatrix.vec3.transformMat4(resultPosition, position, matrix);
            return resultPosition;
        };
    }();

    WL.Object.prototype.pp_convertDirectionWorldToObject = function () {
        let rotation = glMatrix.quat.create();
        return function (direction, resultDirection = glMatrix.vec3.create()) {
            this.pp_getRotationWorldQuat(rotation);
            glMatrix.quat.conjugate(rotation, rotation);
            glMatrix.vec3.transformQuat(resultDirection, direction, rotation);
            return resultDirection;
        };
    }();

    //Convert Vector Local World

    WL.Object.prototype.pp_convertPositionLocalToWorld = function (position, resultPosition = glMatrix.vec3.create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertPositionObjectToWorld(position, resultPosition);
        } else {
            glMatrix.vec3.copy(resultPosition, position);
        }
        return resultPosition;
    };

    WL.Object.prototype.pp_convertDirectionLocalToWorld = function (direction, resultDirection = glMatrix.vec3.create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertDirectionObjectToWorld(direction, resultDirection);
        } else {
            glMatrix.vec3.copy(resultDirection, direction);
        }
        return resultDirection;
    };

    WL.Object.prototype.pp_convertPositionWorldToLocal = function (position, resultPosition = glMatrix.vec3.create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertPositionWorldToObject(position, resultPosition);
        } else {
            glMatrix.vec3.copy(resultPosition, position);
        }
        return resultPosition;
    };

    WL.Object.prototype.pp_convertDirectionWorldToLocal = function (direction, resultDirection = glMatrix.vec3.create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertDirectionWorldToObject(direction, resultDirection);
        } else {
            glMatrix.vec3.copy(resultDirection, direction);
        }
        return resultDirection;
    };

    //Convert Vector Local Object

    //I need to use the converson to world and then local also use the parent scale that changes the position in local space

    WL.Object.prototype.pp_convertPositionObjectToLocal = function (position, resultPosition = glMatrix.vec3.create()) {
        this.pp_convertPositionObjectToWorld(position, resultPosition);
        this.pp_convertPositionWorldToLocal(resultPosition, resultPosition);
        return resultPosition;
    };

    WL.Object.prototype.pp_convertDirectionObjectToLocal = function (direction, resultDirection = glMatrix.vec3.create()) {
        this.pp_convertDirectionObjectToWorld(direction, resultDirection);
        this.pp_convertDirectionWorldToLocal(resultDirection, resultDirection);
        return resultDirection;
    };

    WL.Object.prototype.pp_convertPositionLocalToObject = function (position, resultPosition = glMatrix.vec3.create()) {
        this.pp_convertPositionLocalToWorld(position, resultPosition);
        this.pp_convertPositionWorldToObject(resultPosition, resultPosition);
        return resultPosition;
    };

    WL.Object.prototype.pp_convertDirectionLocalToObject = function (direction, resultDirection = glMatrix.vec3.create()) {
        this.pp_convertDirectionLocalToWorld(direction, resultDirection);
        this.pp_convertDirectionWorldToObject(resultDirection, resultDirection);
        return resultDirection;
    };

    //Convert Transform Object World

    WL.Object.prototype.pp_convertTransformObjectToWorld = function (transform, resultTransform) {
        return this.pp_convertTransformObjectToWorldMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformObjectToWorldMatrix = function () {
        let convertTransform = glMatrix.mat4.create();
        let position = glMatrix.vec3.create();
        let scale = glMatrix.vec3.create();
        let inverseScale = glMatrix.vec3.create();
        let one = glMatrix.vec3.create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function (transform, resultTransform = glMatrix.mat4.create()) {
            this.pp_getTransformWorldMatrix(convertTransform);
            if (this.pp_hasUniformScaleWorld()) {
                glMatrix.mat4.mul(resultTransform, convertTransform, transform);
            } else {
                glMatrix.vec3.set(position, transform[12], transform[13], transform[14]);
                this.pp_convertPositionObjectToWorld(position, position);

                glMatrix.mat4.getScaling(scale, convertTransform);
                glMatrix.vec3.divide(inverseScale, one, scale);
                glMatrix.mat4.scale(convertTransform, convertTransform, inverseScale);

                glMatrix.mat4.mul(resultTransform, convertTransform, transform);
                glMatrix.mat4.scale(resultTransform, resultTransform, scale);

                resultTransform[12] = position[0];
                resultTransform[13] = position[1];
                resultTransform[14] = position[2];
                resultTransform[15] = 1;
            }
            return resultTransform;
        };
    }();

    WL.Object.prototype.pp_convertTransformObjectToWorldQuat = function () {
        let position = glMatrix.vec3.create();
        let rotation = glMatrix.quat.create();
        return function (transform, resultTransform = glMatrix.quat2.create()) {
            this.pp_getRotationWorldQuat(rotation);
            glMatrix.quat.mul(rotation, rotation, transform);
            glMatrix.quat2.getTranslation(position, transform);
            this.pp_convertPositionObjectToWorld(position, position);
            glMatrix.quat2.fromRotationTranslation(resultTransform, rotation, position);
            return resultTransform;
        };
    }();

    WL.Object.prototype.pp_convertTransformWorldToObject = function (transform, resultTransform) {
        return this.pp_convertTransformWorldToObjectMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformWorldToObjectMatrix = function () {
        let convertTransform = glMatrix.mat4.create();
        let position = glMatrix.vec3.create();
        let scale = glMatrix.vec3.create();
        let inverseScale = glMatrix.vec3.create();
        let one = glMatrix.vec3.create();
        glMatrix.vec3.set(one, 1, 1, 1);
        return function (transform, resultTransform = glMatrix.mat4.create()) {
            this.pp_getTransformWorldMatrix(convertTransform);
            if (this.pp_hasUniformScaleWorld()) {
                glMatrix.mat4.invert(convertTransform, convertTransform);
                glMatrix.mat4.mul(resultTransform, convertTransform, transform);
            } else {
                glMatrix.vec3.set(position, transform[12], transform[13], transform[14]);
                this.pp_convertPositionWorldToObject(position, position);

                glMatrix.mat4.getScaling(scale, convertTransform);
                glMatrix.vec3.divide(inverseScale, one, scale);
                glMatrix.mat4.scale(convertTransform, convertTransform, inverseScale);

                glMatrix.mat4.invert(convertTransform, convertTransform);
                glMatrix.mat4.mul(resultTransform, convertTransform, transform);
                glMatrix.mat4.scale(resultTransform, resultTransform, inverseScale);

                resultTransform[12] = position[0];
                resultTransform[13] = position[1];
                resultTransform[14] = position[2];
                resultTransform[15] = 1;
            }
            return resultTransform;
        };
    }();

    WL.Object.prototype.pp_convertTransformWorldToObjectQuat = function () {
        let position = glMatrix.vec3.create();
        let rotation = glMatrix.quat.create();
        return function (transform, resultTransform = glMatrix.quat2.create()) {
            this.pp_getRotationWorldQuat(rotation);
            glMatrix.quat.conjugate(rotation, rotation);
            glMatrix.quat.mul(rotation, rotation, transform);
            glMatrix.quat2.getTranslation(position, transform);
            this.pp_convertPositionWorldToObject(position, position);
            glMatrix.quat2.fromRotationTranslation(resultTransform, rotation, position);
            return resultTransform;
        };
    }();

    //Convert Transform Local World

    WL.Object.prototype.pp_convertTransformLocalToWorld = function (transform, resultTransform) {
        return this.pp_convertTransformLocalToWorldMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformLocalToWorldMatrix = function (transform, resultTransform = glMatrix.mat4.create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertTransformObjectToWorldMatrix(transform, resultTransform);
        } else {
            glMatrix.mat4.copy(resultTransform, transform);
        }
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformLocalToWorldQuat = function (transform, resultTransform = glMatrix.quat2.create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertTransformObjectToWorldQuat(transform, resultTransform);
        } else {
            glMatrix.quat2.copy(resultTransform, transform);
        }
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformWorldToLocal = function (transform, resultTransform) {
        return this.pp_convertTransformWorldToLocalMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformWorldToLocalMatrix = function (transform, resultTransform = glMatrix.mat4.create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertTransformWorldToObjectMatrix(transform, resultTransform);
        } else {
            glMatrix.mat4.copy(resultTransform, transform);
        }
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformWorldToLocalQuat = function (transform, resultTransform = glMatrix.quat2.create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertTransformWorldToObjectQuat(transform, resultTransform);
        } else {
            glMatrix.quat2.copy(resultTransform, transform);
        }
        return resultTransform;
    };

    //Convert Transform Object Local

    //I need to use the converson to world and then local also use the parent scale that changes the position in local space

    WL.Object.prototype.pp_convertTransformObjectToLocal = function (transform, resultTransform) {
        return this.pp_convertTransformObjectToLocalMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformObjectToLocalMatrix = function (transform, resultTransform = glMatrix.mat4.create()) {
        this.pp_convertTransformObjectToWorldMatrix(transform, resultTransform);
        this.pp_convertTransformWorldToLocalMatrix(resultTransform, resultTransform);
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformObjectToLocalQuat = function (transform, resultTransform = glMatrix.quat2.create()) {
        this.pp_convertTransformObjectToWorldQuat(transform, resultTransform);
        this.pp_convertTransformWorldToLocalQuat(resultTransform, resultTransform);
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformLocalToObject = function (transform, resultTransform) {
        return this.pp_convertTransformLocalToObjectMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformLocalToObjectMatrix = function (transform, resultTransform = glMatrix.mat4.create()) {
        this.pp_convertTransformLocalToWorldMatrix(transform, resultTransform);
        this.pp_convertTransformWorldToObjectMatrix(resultTransform, resultTransform);
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformLocalToObjectQuat = function (transform, resultTransform = glMatrix.quat2.create()) {
        this.pp_convertTransformLocalToWorldQuat(transform, resultTransform);
        this.pp_convertTransformWorldToObjectQuat(resultTransform, resultTransform);
        return resultTransform;
    };

    //Component

    WL.Object.prototype.pp_addComponent = function (type, paramsOrActive, active = null) {
        let params = null;

        if (typeof paramsOrActive == "boolean") {
            params = {};
            params["active"] = paramsOrActive;
        } else {
            params = paramsOrActive;

            if (active != null) {
                if (params == null) {
                    params = {};
                }
                params["active"] = active;
            }
        }

        return this.addComponent(type, params);
    };

    WL.Object.prototype.pp_getComponent = function (type, index) {
        return this.getComponent(type, index);
    };

    WL.Object.prototype.pp_getComponents = function (type) {
        return this.getComponents(type);
    };

    WL.Object.prototype.pp_getComponentHierarchy = function (type, index) {
        let component = this.getComponent(type, index);

        if (!component) {
            component = this.pp_getComponentDescendants(type, index);
        }

        return component;
    };

    WL.Object.prototype.pp_getComponentDescendants = function (type, index) {
        let component = null;

        let descendants = this.children;
        while (!component && descendants.length > 0) {
            let descendant = descendants.shift();
            component = descendant.getComponent(type, index);
            if (!component) {
                for (let object of descendant.children) {
                    descendants.push(object);
                }
            }
        }

        return component;
    };
    WL.Object.prototype.pp_getComponentChildren = function (type, index) {
        let component = null;

        let children = this.children;
        for (let child of children) {
            component = child.getComponent(type, index);
            if (component) {
                break;
            }
        }

        return component;
    };

    WL.Object.prototype.pp_getComponentsHierarchy = function (type) {
        let components = this.getComponents(type);

        let descendantsComponents = this.pp_getComponentsDescendants(type);
        for (let component of descendantsComponents) {
            components.push(component);
        }

        return components;
    };

    WL.Object.prototype.pp_getComponentsDescendants = function (type) {
        let components = [];

        let descendants = this.children;
        while (descendants.length > 0) {
            let descendant = descendants.shift();
            let descendantComponents = descendant.getComponents(type);
            for (let component of descendantComponents) {
                components.push(component);
            }
            for (let object of descendant.children) {
                descendants.push(object);
            }
        }

        return components;
    };

    WL.Object.prototype.pp_getComponentsChildren = function (type) {
        let components = [];

        let children = this.children;
        for (let child of children) {
            let childComponents = child.getComponents(type);
            for (let component of childComponents) {
                components.push(component);
            }
        }

        return components;
    };

    //Active

    WL.Object.prototype.pp_setActive = function (active, applyToHierarchy = true) {
        if (applyToHierarchy) {
            this.pp_setActiveHierarchy(active);
        } else {
            this.active = active;
        }
    };

    WL.Object.prototype.pp_setActiveHierarchy = function (active) {
        this.active = active;
        this.pp_setActiveDescendants(active);
    };

    WL.Object.prototype.pp_setActiveDescendants = function (active) {
        let descendants = this.children;
        while (descendants.length > 0) {
            let descendant = descendants.shift();
            descendant.active = active;
            for (let object of descendant.children) {
                descendants.push(object);
            }
        }
    };

    WL.Object.prototype.pp_setActiveChildren = function (active) {
        let children = this.children;
        for (let child of children) {
            child.active = active;
        }
    };

    //Uniform Scale

    WL.Object.prototype.pp_hasUniformScale = function () {
        return this.pp_hasUniformScaleWorld();
    };

    WL.Object.prototype.pp_hasUniformScaleWorld = function () {
        let scale = glMatrix.vec3.create();
        return function () {
            this.pp_getScaleWorld(scale);
            return Math.abs(scale[0] - scale[1]) < this._pp_epsilon && Math.abs(scale[1] - scale[2]) < this._pp_epsilon && Math.abs(scale[0] - scale[2]) < this._pp_epsilon;
        };
    }();

    WL.Object.prototype.pp_hasUniformScaleLocal = function () {
        let scale = glMatrix.vec3.create();
        return function () {
            this.pp_getScaleLocal(scale);
            return Math.abs(scale[0] - scale[1]) < this._pp_epsilon && Math.abs(scale[1] - scale[2]) < this._pp_epsilon && Math.abs(scale[0] - scale[2]) < this._pp_epsilon;
        };
    }();

    //Clone

    PP.CloneParams = class CloneParams {
        constructor() {
            this.myIgnoreNonCloneable = false; // Ignores components that are not clonable
            this.myIgnoreComponents = false; // All components are ignored, cloning only the object hierarchy
            this.myIgnoreChildren = false; // Clones only the given object without the children

            this.myComponentsToIgnore = []; // Ignores all component types in this list (example: "mesh"), has lower priority over myComponentsToInclude
            this.myComponentsToInclude = []; // Clones only the component types in this list (example: "mesh"), has higher priority over myComponentsToIgnore, if empty it's ignored
            this.myIgnoreComponentCallback = null; // Signature: callback(component) returns true if the component must be ignored, it is called after the previous filters

            this.myChildrenToIgnore = []; // Ignores all the objects in this list (example: "mesh"), has lower priority over myChildrenToInclude
            this.myChildrenToInclude = []; // Clones only the objects in this list (example: "mesh"), has higher priority over myChildrenToIgnore, if empty it's ignored
            this.myIgnoreChildCallback = null; // Signature: callback(object) returns true if the object must be ignored, it is called after the previous filters

            this.myDeepCloneParams = new PP.DeepCloneParams(); // Used to specify if the object must be deep cloned or not, you can also override the behavior for specific components and variables

            this.myExtraData = new Map(); // This map can be filled with whatever extra data the component clone function could need
        }
    };

    PP.DeepCloneParams = class DeepCloneParams {
        constructor() {
            this._myDeepCloneObject = false;
            this._myOverrideDeepCloneComponentMap = new Map();
            this._myOverrideDeepCloneComponentVariableMap = new Map();
        }

        // The implementation is component dependant, not every component implements the deep clone
        setDeepCloneObject(deepClone) {
            this._myDeepCloneObject = deepClone;
        }

        // This value override the deep clone object value
        // The implementation is component dependant, not every component implements the deep clone
        setDeepCloneComponent(componentName, deepClone) {
            this._myOverrideDeepCloneComponentMap.set(componentName, deepClone);
        }

        // This value override both the deep clone object value and the deep clone component one
        // The implementation is component dependant, not every component variable override is taken into consideration
        setDeepCloneComponentVariable(componentName, variableName, deepClone) {
            let componentMap = null;

            if (!this._myOverrideDeepCloneComponentVariableMap.has(componentName)) {
                this._myOverrideDeepCloneComponentVariableMap.set(componentName, new Map());
            }

            componentMap = this._myOverrideDeepCloneComponentVariableMap.get(componentName);

            componentMap.set(variableName, deepClone);
        }

        isDeepCloneComponent(componentName) {
            let overrideValue = this._myOverrideDeepCloneComponentMap.get(componentName);

            if (overrideValue != null) {
                return overrideValue;
            }

            return this._myDeepCloneObject;
        }

        isDeepCloneComponentVariable(componentName, variableName) {
            let componentMap = this._myOverrideDeepCloneComponentVariableMap.get(componentName);
            if (componentMap != null) {
                let overrideValue = componentMap.get(variableName);
                if (overrideValue != null) {
                    return overrideValue;
                }
            }

            return this.isDeepCloneComponent(componentName);
        }
    };

    WL.Object.prototype.pp_clone = function () {
        let scale = glMatrix.vec3.create();
        let transformQuat = glMatrix.quat2.create();
        return function (params = new PP.CloneParams()) {
            let clonedObject = null;

            if (this.pp_isCloneable(params)) {
                let objectsToCloneData = [];
                objectsToCloneData.push([this.parent, this]);

                //Create object hierarchy
                let objectsToCloneComponentsData = [];
                while (objectsToCloneData.length > 0) {
                    let cloneData = objectsToCloneData.shift();
                    let parent = cloneData[0];
                    let objectToClone = cloneData[1];

                    let currentClonedObject = WL.scene.addObject(parent);
                    currentClonedObject.name = objectToClone.name;

                    currentClonedObject.pp_setScaleLocal(objectToClone.pp_getScaleLocal(scale));
                    currentClonedObject.pp_setTransformLocalQuat(objectToClone.pp_getTransformLocalQuat(transformQuat));

                    if (!params.myIgnoreComponents) {
                        objectsToCloneComponentsData.push([objectToClone, currentClonedObject]);
                    }

                    if (!params.myIgnoreChildren) {
                        for (let child of objectToClone.children) {
                            let cloneChild = false;
                            if (params.myChildrenToInclude.length > 0) {
                                cloneChild = params.myChildrenToInclude.find(childToInclude => childToInclude.pp_equals(child)) != null;
                            } else {
                                cloneChild = params.myChildrenToIgnore.find(childToIgnore => childToIgnore.pp_equals(child)) == null;
                            }

                            if (cloneChild && params.myIgnoreChildCallback != null) {
                                cloneChild = !params.myIgnoreChildCallback(child);
                            }

                            if (cloneChild) {
                                objectsToCloneData.push([currentClonedObject, child]);
                            }
                        }
                    }

                    if (clonedObject == null) {
                        clonedObject = currentClonedObject;
                    }
                }

                //Create components
                let componentsToCloneData = [];
                while (objectsToCloneComponentsData.length > 0) {
                    let cloneData = objectsToCloneComponentsData.shift();
                    let objectToClone = cloneData[0];
                    let currentClonedObject = cloneData[1];

                    let components = objectToClone.pp_getComponents();
                    for (let component of components) {
                        if (component.pp_clone != null) {
                            let cloneComponent = false;
                            if (params.myComponentsToInclude.length > 0) {
                                cloneComponent = params.myComponentsToInclude.indexOf(component.type) != -1;
                            } else {
                                cloneComponent = params.myComponentsToIgnore.indexOf(component.type) == -1;
                            }

                            if (cloneComponent && params.myIgnoreComponentCallback != null) {
                                cloneComponent = !params.myIgnoreComponentCallback(component);
                            }

                            if (cloneComponent) {
                                //Not managing the fact that inactive components from editor haven't called start yet, but clones do, since there is no way to know
                                let clonedComponent = currentClonedObject.pp_addComponent(component.type);
                                clonedComponent.active = component.active;
                                componentsToCloneData.push([component, clonedComponent]);
                            }
                        }
                    }
                }

                //Now that all the hierarchy is completed (with components) we can clone them
                while (componentsToCloneData.length > 0) {
                    let cloneData = componentsToCloneData.shift();
                    let componentToClone = cloneData[0];
                    let currentClonedComponent = cloneData[1];

                    componentToClone.pp_clone(currentClonedComponent, params.myDeepCloneParams, params.myExtraData);
                }
            }

            return clonedObject;
        };
    }();

    WL.Object.prototype.pp_isCloneable = function (params = new PP.CloneParams()) {
        if (params.myIgnoreNonCloneable || params.myIgnoreComponents) {
            return true;
        }

        let isCloneable = true;

        let objects = [];
        objects.push(this);

        while (isCloneable && objects.length > 0) {
            let object = objects.shift();

            let components = this.pp_getComponents();
            for (let component of components) {
                let cloneComponent = false;
                if (params.myComponentsToInclude.length > 0) {
                    cloneComponent = params.myComponentsToInclude.indexOf(component.type) != -1;
                } else {
                    cloneComponent = params.myComponentsToIgnore.indexOf(component.type) == -1;
                }

                if (cloneComponent && params.myIgnoreComponentCallback != null) {
                    cloneComponent = !params.myIgnoreComponentCallback(component);
                }

                if (cloneComponent && component.pp_clone == null) {
                    isCloneable = false;
                    break;
                }
            }

            if (isCloneable && !params.myIgnoreChildren) {
                for (let child of object.children) {
                    let cloneChild = false;
                    if (params.myChildrenToInclude.length > 0) {
                        cloneChild = params.myChildrenToInclude.find(childToInclude => childToInclude.pp_equals(child)) != null;
                    } else {
                        cloneChild = params.myChildrenToIgnore.find(childToInclude => childToInclude.pp_equals(child)) == null;
                    }

                    if (cloneChild && params.myIgnoreChildCallback != null) {
                        cloneChild = !params.myIgnoreChildCallback(child);
                    }

                    if (cloneChild) {
                        objects.push(child);
                    }
                }
            }
        }

        return isCloneable;
    };

    //Cauldron

    WL.Object.prototype.pp_getName = function () {
        return this.name;
    };

    WL.Object.prototype.pp_setName = function (name) {
        this.name = name;
    };

    WL.Object.prototype.pp_getID = function () {
        return this.objectId;
    };

    WL.Object.prototype.pp_getHierarchy = function () {
        let hierarchy = this.pp_getDescendants();

        hierarchy.unshift(this);

        return hierarchy;
    };

    WL.Object.prototype.pp_getDescendants = function () {
        let descendants = [];

        let descendantsQueue = this.children;

        while (descendantsQueue.length > 0) {
            let descendant = descendantsQueue.shift();
            descendants.push(descendant);
            for (let object of descendant.children) {
                descendantsQueue.push(object);
            }
        }

        return descendants;
    };

    WL.Object.prototype.pp_getChildren = function () {
        return this.children;
    };

    WL.Object.prototype.pp_markDirty = function () {
        return this.setDirty();
    };

    WL.Object.prototype.pp_equals = function (otherObject) {
        return this.equals(otherObject);
    };

    WL.Object.prototype.pp_destroy = function () {
        return this.destroy();
    };

    WL.Object.prototype.pp_reserveObjects = function (count) {
        let componentAmountMap = this.pp_getComponentAmountMap();
        this._pp_reserveObjects(count, componentAmountMap);
    };

    WL.Object.prototype.pp_reserveObjectsHierarchy = function (count) {
        let componentAmountMap = this.pp_getComponentAmountMapHierarchy();
        this._pp_reserveObjects(count, componentAmountMap);
    };

    WL.Object.prototype.pp_reserveObjectsDescendants = function (count) {
        let componentAmountMap = this.pp_getComponentAmountMapDescendants();
        this._pp_reserveObjects(count, componentAmountMap);
    };

    WL.Object.prototype.pp_reserveObjectsChildren = function (count) {
        let componentAmountMap = this.pp_getComponentAmountMapChildren();
        this._pp_reserveObjects(count, componentAmountMap);
    };

    WL.Object.prototype.pp_getComponentAmountMap = function (amountMap = new Map()) {
        let objectAmount = amountMap.get("object");
        if (objectAmount == null) {
            objectAmount = 0;
        }
        objectAmount += 1;
        amountMap.set("object", objectAmount);

        let components = this.pp_getComponents();
        for (let component of components) {
            let type = component.type;
            let typeAmount = amountMap.get(type);
            if (typeAmount == null) {
                typeAmount = 0;
            }
            typeAmount += 1;
            amountMap.set(type, typeAmount);
        }

        return amountMap;
    };

    WL.Object.prototype.pp_getComponentAmountMapHierarchy = function (amountMap = new Map()) {
        let hierarchy = this.pp_getHierarchy();

        for (let object of hierarchy) {
            object.pp_getComponentAmountMap(amountMap);
        }

        return amountMap;
    };

    WL.Object.prototype.pp_getComponentAmountMapDescendants = function (amountMap = new Map()) {
        let descendants = this.pp_getDescendants();

        for (let object of descendants) {
            object.pp_getComponentAmountMap(amountMap);
        }

        return amountMap;
    };

    WL.Object.prototype.pp_getComponentAmountMapChildren = function (amountMap = new Map()) {
        let children = this.children;

        for (let object of children) {
            object.pp_getComponentAmountMap(amountMap);
        }

        return amountMap;
    };

    //Private Utils

    WL.Object.prototype._pp_epsilon = 0.000001;

    WL.Object.prototype._pp_quaternionToRadians = function () {
        let mat3 = glMatrix.mat3.create();
        return function (quatRotation, radiansRotation = glMatrix.vec3.create()) {
            glMatrix.mat3.fromQuat(mat3, quatRotation);

            //Rotation order is ZYX
            radiansRotation[1] = Math.asin(-this._pp_clamp(mat3[2], -1, 1));

            if (Math.abs(mat3[2]) < 0.9999999) {

                radiansRotation[0] = Math.atan2(mat3[5], mat3[8]);
                radiansRotation[2] = Math.atan2(mat3[1], mat3[0]);

            } else {

                radiansRotation[0] = 0;
                radiansRotation[2] = Math.atan2(-mat3[3], mat3[4]);
            }

            return radiansRotation;
        };
    }();

    WL.Object.prototype._pp_degreesToQuaternion = function (degreesRotation, quatRotation = glMatrix.quat.create()) {
        glMatrix.quat.fromEuler(quatRotation, degreesRotation[0], degreesRotation[1], degreesRotation[2]);
        return quatRotation;
    };

    WL.Object.prototype._pp_toDegrees = function (angle) {
        return angle * (180 / Math.PI);
    };

    WL.Object.prototype._pp_clamp = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    };

    WL.Object.prototype._pp_reserveObjects = function (count, componentAmountMap) {
        let objectsToReserve = componentAmountMap.get("object") * count;
        componentAmountMap.delete("object");

        let componentsToReserve = {};
        for (let [componentName, componentCount] of componentAmountMap.entries()) {
            componentsToReserve[componentName] = componentCount * count;
        }

        WL.scene.reserveObjects(objectsToReserve, componentsToReserve);
    };

    for (let key in WL.Object.prototype) {
        let prefixes = ["pp_", "_pp_"];

        let found = false;
        for (let prefix of prefixes) {
            if (key.startsWith(prefix)) {
                found = true;
                break;
            }
        }

        if (found) {
            Object.defineProperty(WL.Object.prototype, key, { enumerable: false });
        }
    }

}
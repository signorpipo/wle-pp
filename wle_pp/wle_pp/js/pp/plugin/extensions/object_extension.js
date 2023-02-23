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
        
    Some functions let you specify if u want them to work on the Hierarchy/Descendants/Children/Self where:
        - Self: the current object only
        - Children: direct children of the object
        - Descendants: all the children of the object, including child of child and so on 
        - Hierarchy: Descendants plus the current object
    Examples:
        - pp_getComponent
        - pp_getComponentHierarchy
        - pp_getComponentsAmountMapDescendants
        - pp_setActiveChildren
        - pp_setActiveSelf
    By default the functions work on the Hierarchy
    On some of the functions where u can specify Hierarchy/Descendants u can also specify 
    if the algorithm should explore by Breadth/Depth, example:
        - pp_getComponentHierarchyBreadth
        - pp_setActiveDescendantsDepth
    By default the functions explore by Breadth

    In static functions (accessible directly through WL.Object) the suffix Objects means it will work on a given object list, example:
        - pp_getComponentsObjects
        - pp_getObjectByNameObjects

    The functions leave u the choice of forwarding an out parameter or just get the return value, example:
        - let position = this.object.pp_getPosition()
        - this.object.pp_getPosition(position)
        - the out parameter is always the last one

    List of functions:
        Notes:
            - The suffixes (like World or Radians) are omitted 

        - pp_getPosition    / pp_setPosition    / pp_resetPosition
        - pp_getRotation    / pp_setRotation    / pp_resetRotation
        - pp_getScale       / pp_setScale       (u can specify a single number instead of a vector to uniform scale easily) / pp_resetScale 
        - pp_getTransform   / pp_setTransform   / pp_resetTransform

        - pp_getAxes        / pp_setAxes
        - pp_getLeft        / pp_getRight       / pp_setLeft        / pp_setRight
        - pp_getUp          / pp_getDown        / pp_setUp          / pp_setDown
        - pp_getForward     / pp_getBackward    / pp_setForward     / pp_setBackward

        - pp_translate      / pp_translateAxis
        - pp_rotate         / pp_rotateAxis     / pp_rotateAround    / pp_rotateAroundAxis
        - pp_scaleObject    (for now scale only have this variant) (u can specify a single number instead of a vector to uniform scale easily)

        - pp_lookAt         / pp_lookTo (u can avoid to specify up and the function will pickup the object up by default)

        - pp_getParent      / pp_setParent (let u specify if u want to keep the transform or not)

        - pp_convertPositionObjectToWorld (you can use all the combinations between Object/Local/World)
        - pp_convertDirectionObjectToWorld (you can use all the combinations between Object/Local/World)
        - pp_convertTransformObjectToWorld (you can use all the combinations between Object/Local/World) (u also have Quat and Matrix version)

        - pp_hasUniformScale

        - pp_addComponent
        - pp_getComponent   / pp_getComponentHierarchy  / pp_getComponentDescendants  / pp_getComponentChildren / pp_getComponentSelf
        - pp_getComponents  / pp_getComponentsHierarchy / pp_getComponentsDescendants / pp_getComponentsChildren / pp_getComponentsSelf

        - pp_setActive  / pp_setActiveHierarchy / pp_setActiveDescendants / pp_setActiveChildren / pp_setActiveSelf

        - pp_clone      / pp_isCloneable
        
        - pp_toString   / pp_toStringCompact / pp_toStringExtended
        
        - pp_getObjectByName  / pp_getObjectByNameHierarchy / pp_getObjectByNameDescendants / pp_getObjectByNameChildren
        - pp_getObjectsByName  / pp_getObjectsByNameHierarchy / pp_getObjectsByNameDescendants / pp_getObjectsByNameChildren

        - pp_getHierarchy / pp_getHierarchyBreadth / pp_getHierarchyDepth 
        - pp_getDescendants / pp_getDescendantsBreadth / pp_getDescendantsDepth 
        - pp_getChildren
        - pp_getSelf

        - pp_addObject
        - pp_getName    / pp_setName
        - pp_getID
        - pp_reserveObjects / pp_reserveObjectsHierarchy / pp_reserveObjectsDescendants / pp_reserveObjectsChildren / pp_reserveObjectsSelf
        - pp_getComponentsAmountMap / pp_getComponentsAmountMapHierarchy / pp_getComponentsAmountMapDescendants / pp_getComponentsAmountMapChildren / pp_getComponentsAmountMapSelf
        - pp_markDirty
        - pp_equals
        - pp_destroy

        STATIC FUNCTIONS:
        - pp_getComponentObjects
        - pp_getComponentsObjects
        - pp_setActiveObjects
        - pp_getObjectByNameObjects
        - pp_getObjectsByNameObjects
*/

if (WL && WL.Object) {

    //GETTER

    //Position

    WL.Object.prototype.pp_getPosition = function pp_getPosition(position) {
        return this.pp_getPositionWorld(position);
    };

    WL.Object.prototype.pp_getPositionWorld = function pp_getPositionWorld(position = PP.vec3_create()) {
        this.getTranslationWorld(position);
        return position;
    };

    WL.Object.prototype.pp_getPositionLocal = function pp_getPositionLocal(position = PP.vec3_create()) {
        this.getTranslationLocal(position);
        return position;
    };

    //Rotation

    WL.Object.prototype.pp_getRotation = function pp_getRotation(rotation) {
        return this.pp_getRotationWorld(rotation);
    };
    WL.Object.prototype.pp_getRotationDegrees = function pp_getRotationDegrees(rotation) {
        return this.pp_getRotationWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_getRotationRadians = function pp_getRotationRadians(rotation) {
        return this.pp_getRotationWorldRadians(rotation);
    };

    WL.Object.prototype.pp_getRotationMatrix = function pp_getRotationMatrix(rotation) {
        return this.pp_getRotationWorldMatrix(rotation);
    };

    WL.Object.prototype.pp_getRotationQuat = function pp_getRotationQuat(rotation) {
        return this.pp_getRotationWorldQuat(rotation);
    };

    //Rotation World

    WL.Object.prototype.pp_getRotationWorld = function pp_getRotationWorld(rotation) {
        return this.pp_getRotationWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_getRotationWorldDegrees = function pp_getRotationWorldDegrees(rotation) {
        rotation = this.pp_getRotationWorldRadians(rotation);
        rotation.forEach(function (value, index, array) {
            array[index] = this._pp_toDegrees(value);
        }.bind(this));
        return rotation;
    };

    WL.Object.prototype.pp_getRotationWorldRadians = function () {
        let quat = PP.quat_create();
        return function pp_getRotationWorldRadians(rotation = PP.vec3_create()) {
            this.pp_getRotationWorldQuat(quat);
            this._pp_quaternionToRadians(quat, rotation);
            return rotation;
        };
    }();

    WL.Object.prototype.pp_getRotationWorldMatrix = function () {
        let quat = PP.quat_create();
        return function pp_getRotationWorldMatrix(rotation = PP.mat3_create()) {
            this.pp_getRotationWorldQuat(quat);
            quat.quat_toMatrix(rotation);
            return rotation;
        };
    }();

    WL.Object.prototype.pp_getRotationWorldQuat = function pp_getRotationWorldQuat(rotation = PP.quat_create()) {
        rotation.quat_copy(this.rotationWorld);
        return rotation;
    };

    //Rotation Local

    WL.Object.prototype.pp_getRotationLocal = function pp_getRotationLocal(rotation) {
        return this.pp_getRotationLocalDegrees(rotation);
    };

    WL.Object.prototype.pp_getRotationLocalDegrees = function pp_getRotationLocalDegrees(rotation) {
        rotation = this.pp_getRotationLocalRadians(rotation);
        rotation.forEach(function (value, index, array) {
            array[index] = this._pp_toDegrees(value);
        }.bind(this));
        return rotation;
    };

    WL.Object.prototype.pp_getRotationLocalRadians = function () {
        let quat = PP.quat_create();
        return function pp_getRotationLocalRadians(rotation = PP.vec3_create()) {
            this.pp_getRotationLocalQuat(quat);
            this._pp_quaternionToRadians(quat, rotation);
            return rotation;
        };
    }();

    WL.Object.prototype.pp_getRotationLocalMatrix = function () {
        let quat = PP.quat_create();
        return function pp_getRotationLocalMatrix(rotation = PP.mat3_create()) {
            this.pp_getRotationLocalQuat(quat);
            quat.quat_toMatrix(rotation);
            return rotation;
        };
    }();

    WL.Object.prototype.pp_getRotationLocalQuat = function pp_getRotationLocalQuat(rotation = PP.quat_create()) {
        rotation.quat_copy(this.rotationLocal);
        return rotation;
    };

    //Scale

    WL.Object.prototype.pp_getScale = function pp_getScale(scale) {
        return this.pp_getScaleWorld(scale);
    };

    WL.Object.prototype.pp_getScaleWorld = function pp_getScaleWorld(scale = PP.vec3_create()) {
        scale.vec3_copy(this.scalingWorld);
        return scale;
    };

    WL.Object.prototype.pp_getScaleLocal = function pp_getScaleLocal(scale = PP.vec3_create()) {
        scale.vec3_copy(this.scalingLocal);
        return scale;
    };

    //Transform

    WL.Object.prototype.pp_getTransform = function pp_getTransform(transform) {
        return this.pp_getTransformWorld(transform);
    };

    WL.Object.prototype.pp_getTransformMatrix = function pp_getTransformMatrix(transform) {
        return this.pp_getTransformWorldMatrix(transform);
    };

    WL.Object.prototype.pp_getTransformQuat = function pp_getTransformQuat(transform) {
        return this.pp_getTransformWorldQuat(transform);
    };

    //Transform World

    WL.Object.prototype.pp_getTransformWorld = function pp_getTransformWorld(transform) {
        return this.pp_getTransformWorldMatrix(transform);
    };

    WL.Object.prototype.pp_getTransformWorldMatrix = function () {
        let transformQuat = PP.quat2_create();
        let scale = PP.vec3_create();
        return function pp_getTransformWorldMatrix(transform = PP.mat4_create()) {
            this.pp_getTransformWorldQuat(transformQuat);
            this.pp_getScaleWorld(scale);
            transform.mat4_fromQuat(transformQuat);
            transform.mat4_scale(scale, transform);
            return transform;
        };
    }();

    WL.Object.prototype.pp_getTransformWorldQuat = function pp_getTransformWorldQuat(transform = PP.quat2_create()) {
        transform.quat2_copy(this.transformWorld);
        return transform;
    };

    //Transform Local

    WL.Object.prototype.pp_getTransformLocal = function (transform) {
        return this.pp_getTransformLocalMatrix(transform);
    };

    WL.Object.prototype.pp_getTransformLocalMatrix = function pp_getTransformLocalMatrix() {
        let transformQuat = PP.quat2_create();
        let scale = PP.vec3_create();
        return function pp_getTransformLocal(transform = PP.mat4_create()) {
            this.pp_getTransformLocalQuat(transformQuat);
            this.pp_getScaleLocal(scale);
            transform.mat4_fromQuat(transformQuat);
            transform.mat4_scale(scale, transform);
            return transform;
        };
    }();

    WL.Object.prototype.pp_getTransformLocalQuat = function pp_getTransformLocalQuat(transform = PP.quat2_create()) {
        transform.quat2_copy(this.transformLocal);
        return transform;
    };

    //Axes

    WL.Object.prototype.pp_getAxes = function pp_getAxes(axes) {
        return this.pp_getAxesWorld(axes);
    };

    WL.Object.prototype.pp_getAxesWorld = function pp_getAxesWorld(axes = [PP.vec3_create(), PP.vec3_create(), PP.vec3_create()]) {
        this.pp_getLeftWorld(axes[0]);
        this.pp_getUpWorld(axes[1]);
        this.pp_getForwardWorld(axes[2]);
        return axes;
    };

    WL.Object.prototype.pp_getAxesLocal = function pp_getAxesLocal(axes = [PP.vec3_create(), PP.vec3_create(), PP.vec3_create()]) {
        this.pp_getLeftLocal(axes[0]);
        this.pp_getUpLocal(axes[1]);
        this.pp_getForwardLocal(axes[2]);
        return axes;
    };

    //Forward

    WL.Object.prototype.pp_getForward = function pp_getForward(forward) {
        return this.pp_getForwardWorld(forward);
    };

    WL.Object.prototype.pp_getForwardWorld = function () {
        let rotation = PP.mat3_create();
        return function pp_getForwardWorld(forward = PP.vec3_create()) {
            this.pp_getRotationWorldMatrix(rotation);
            forward[0] = rotation[6];
            forward[1] = rotation[7];
            forward[2] = rotation[8];
            return forward;
        };
    }();

    WL.Object.prototype.pp_getForwardLocal = function () {
        let rotation = PP.mat3_create();
        return function pp_getForwardLocal(forward = PP.vec3_create()) {
            this.pp_getRotationLocalMatrix(rotation);
            forward[0] = rotation[6];
            forward[1] = rotation[7];
            forward[2] = rotation[8];
            return forward;
        };
    }();

    //Backward

    WL.Object.prototype.pp_getBackward = function pp_getBackward(backward) {
        return this.pp_getBackwardWorld(backward);
    };

    WL.Object.prototype.pp_getBackwardWorld = function () {
        let rotation = PP.mat3_create();
        return function pp_getBackwardWorld(backward = PP.vec3_create()) {
            this.pp_getRotationWorldMatrix(rotation);
            backward[0] = -rotation[6];
            backward[1] = -rotation[7];
            backward[2] = -rotation[8];
            return backward;
        };
    }();

    WL.Object.prototype.pp_getBackwardLocal = function () {
        let rotation = PP.mat3_create();
        return function pp_getBackwardLocal(backward = PP.vec3_create()) {
            this.pp_getRotationLocalMatrix(rotation);
            backward[0] = -rotation[6];
            backward[1] = -rotation[7];
            backward[2] = -rotation[8];
            return backward;
        };
    }();

    //Up

    WL.Object.prototype.pp_getUp = function pp_getUp(up) {
        return this.pp_getUpWorld(up);
    };

    WL.Object.prototype.pp_getUpWorld = function () {
        let rotation = PP.mat3_create();
        return function pp_getUpWorld(up = PP.vec3_create()) {
            this.pp_getRotationWorldMatrix(rotation);
            up[0] = rotation[3];
            up[1] = rotation[4];
            up[2] = rotation[5];
            return up;
        };
    }();

    WL.Object.prototype.pp_getUpLocal = function () {
        let rotation = PP.mat3_create();
        return function pp_getUpLocal(up = PP.vec3_create()) {
            this.pp_getRotationLocalMatrix(rotation);
            up[0] = rotation[3];
            up[1] = rotation[4];
            up[2] = rotation[5];
            return up;
        };
    }();

    //Down

    WL.Object.prototype.pp_getDown = function pp_getDown(down) {
        return this.pp_getDownWorld(down);
    };

    WL.Object.prototype.pp_getDownWorld = function () {
        let rotation = PP.mat3_create();
        return function pp_getDownWorld(down = PP.vec3_create()) {
            this.pp_getRotationWorldMatrix(rotation);
            down[0] = -rotation[3];
            down[1] = -rotation[4];
            down[2] = -rotation[5];
            return down;
        };
    }();

    WL.Object.prototype.pp_getDownLocal = function () {
        let rotation = PP.mat3_create();
        return function pp_getDownLocal(down = PP.vec3_create()) {
            this.pp_getRotationLocalMatrix(rotation);
            down[0] = -rotation[3];
            down[1] = -rotation[4];
            down[2] = -rotation[5];
            return down;
        };
    }();

    //Left

    WL.Object.prototype.pp_getLeft = function pp_getLeft(left) {
        return this.pp_getLeftWorld(left);
    };

    WL.Object.prototype.pp_getLeftWorld = function () {
        let rotation = PP.mat3_create();
        return function pp_getLeftWorld(left = PP.vec3_create()) {
            this.pp_getRotationWorldMatrix(rotation);
            left[0] = rotation[0];
            left[1] = rotation[1];
            left[2] = rotation[2];
            return left;
        };
    }();

    WL.Object.prototype.pp_getLeftLocal = function () {
        let rotation = PP.mat3_create();
        return function pp_getLeftLocal(left = PP.vec3_create()) {
            this.pp_getRotationLocalMatrix(rotation);
            left[0] = rotation[0];
            left[1] = rotation[1];
            left[2] = rotation[2];
            return left;
        };
    }();

    //Right

    WL.Object.prototype.pp_getRight = function pp_getRight(right) {
        return this.pp_getRightWorld(right);
    };

    WL.Object.prototype.pp_getRightWorld = function () {
        let rotation = PP.mat3_create();
        return function pp_getRightWorld(right = PP.vec3_create()) {
            this.pp_getRotationWorldMatrix(rotation);
            right[0] = -rotation[0];
            right[1] = -rotation[1];
            right[2] = -rotation[2];
            return right;
        };
    }();

    WL.Object.prototype.pp_getRightLocal = function () {
        let rotation = PP.mat3_create();
        return function pp_getRightLocal(right = PP.vec3_create()) {
            this.pp_getRotationLocalMatrix(rotation);
            right[0] = -rotation[0];
            right[1] = -rotation[1];
            right[2] = -rotation[2];
            return right;
        };
    }();

    //SETTER

    //Position

    WL.Object.prototype.pp_setPosition = function pp_setPosition(position) {
        this.pp_setPositionWorld(position);
    };

    WL.Object.prototype.pp_setPositionWorld = function pp_setPositionWorld(position) {
        this.setTranslationWorld(position);
    };

    WL.Object.prototype.pp_setPositionLocal = function pp_setPositionLocal(position) {
        this.setTranslationLocal(position);
    };

    //Rotation

    WL.Object.prototype.pp_setRotation = function pp_setRotation(rotation) {
        this.pp_setRotationWorld(rotation);
    };
    WL.Object.prototype.pp_setRotationDegrees = function pp_setRotationDegrees(rotation) {
        this.pp_setRotationWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_setRotationRadians = function pp_setRotationRadians(rotation) {
        this.pp_setRotationWorldRadians(rotation);
    };

    WL.Object.prototype.pp_setRotationMatrix = function pp_setRotationMatrix(rotation) {
        this.pp_setRotationWorldMatrix(rotation);
    };

    WL.Object.prototype.pp_setRotationQuat = function pp_setRotationQuat(rotation) {
        this.pp_setRotationWorldQuat(rotation);
    };

    //Rotation World

    WL.Object.prototype.pp_setRotationWorld = function pp_setRotationWorld(rotation) {
        this.pp_setRotationWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_setRotationWorldDegrees = function () {
        let quat = PP.quat_create();
        return function pp_setRotationWorldDegrees(rotation) {
            this._pp_degreesToQuaternion(rotation, quat);
            this.pp_setRotationWorldQuat(quat);
        };
    }();

    WL.Object.prototype.pp_setRotationWorldRadians = function () {
        let degreesRotation = PP.vec3_create();
        return function pp_setRotationWorldRadians(rotation) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_setRotationWorldDegrees(degreesRotation);
        };
    }();

    WL.Object.prototype.pp_setRotationWorldMatrix = function () {
        let quat = PP.quat_create();
        return function pp_setRotationWorldMatrix(rotation) {
            rotation.mat3_toQuat(quat);
            this.pp_setRotationWorldQuat(quat);
        };
    }();

    WL.Object.prototype.pp_setRotationWorldQuat = function pp_setRotationWorldQuat(rotation) {
        this.rotationWorld = rotation;
    };

    //Rotation Local

    WL.Object.prototype.pp_setRotationLocal = function pp_setRotationLocal(rotation) {
        this.pp_setRotationLocalDegrees(rotation);
    };

    WL.Object.prototype.pp_setRotationLocalDegrees = function () {
        let quat = PP.quat_create();
        return function pp_setRotationLocalDegrees(rotation) {
            this._pp_degreesToQuaternion(rotation, quat);
            this.pp_setRotationLocalQuat(quat);
        };
    }();

    WL.Object.prototype.pp_setRotationLocalRadians = function () {
        let degreesRotation = PP.vec3_create();
        return function pp_setRotationLocalRadians(rotation) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_setRotationLocalDegrees(degreesRotation);
        };
    }();

    WL.Object.prototype.pp_setRotationLocalMatrix = function () {
        let quat = PP.quat_create();
        return function pp_setRotationLocalMatrix(rotation) {
            rotation.mat3_toQuat(quat);
            this.pp_setRotationLocalQuat(quat);
        };
    }();

    WL.Object.prototype.pp_setRotationLocalQuat = function pp_setRotationLocalQuat(rotation) {
        this.rotationLocal = rotation;
    };

    //Scale

    WL.Object.prototype.pp_setScale = function pp_setScale(scale) {
        this.pp_setScaleWorld(scale);
    };

    WL.Object.prototype.pp_setScaleWorld = function () {
        let vector = PP.vec3_create();
        return function pp_setScaleWorld(scale) {
            if (isNaN(scale)) {
                this.scalingWorld = scale;
            } else {
                vector.vec3_set(scale);
                this.scalingWorld = vector;
            }
        };
    }();

    WL.Object.prototype.pp_setScaleLocal = function () {
        let vector = PP.vec3_create();
        return function pp_setScaleLocal(scale) {
            if (isNaN(scale)) {
                this.scalingLocal = scale;
            } else {
                vector.vec3_set(scale);
                this.scalingLocal = vector;
            }
        };
    }();

    //Axes    

    WL.Object.prototype.pp_setAxes = function pp_setAxes(left, up, forward) {
        this.pp_setAxesWorld(left, up, forward);
    };

    WL.Object.prototype.pp_setAxesWorld = function pp_setAxesWorld(left, up, forward) {
        if (forward != null) {
            this.pp_setForwardWorld(forward, up, left);
        } else if (up != null) {
            this.pp_setUpWorld(up, forward, left);
        } else {
            this.pp_setLeftWorld(left, up, forward);
        }
    };

    WL.Object.prototype.pp_setAxesLocal = function pp_setAxesLocal(left, up, forward) {
        if (forward != null) {
            this.pp_setForwardLocal(forward, up, left);
        } else if (up != null) {
            this.pp_setUpLocal(up, forward, left);
        } else {
            this.pp_setLeftLocal(left, up, forward);
        }
    };

    //Forward

    WL.Object.prototype.pp_setForward = function pp_setForward(forward, up, left) {
        this.pp_setForwardWorld(forward, up, left);
    };

    WL.Object.prototype.pp_setForwardWorld = function pp_setForwardWorld(forward, up = null, left = null) {
        this._pp_setAxes([left, up, forward], [2, 1, 0], false);
    };

    WL.Object.prototype.pp_setForwardLocal = function pp_setForwardLocal(forward, up = null, left = null) {
        this._pp_setAxes([left, up, forward], [2, 1, 0], true);
    };

    //Backward

    WL.Object.prototype.pp_setBackward = function pp_setBackward(backward, up, left) {
        this.pp_setBackwardWorld(backward, up, left);
    };

    WL.Object.prototype.pp_setBackwardWorld = function () {
        let forward = PP.vec3_create();
        return function pp_setBackwardWorld(backward, up = null, left = null) {
            backward.vec3_negate(forward);
            this._pp_setAxes([left, up, forward], [2, 1, 0], false);
        };
    }();

    WL.Object.prototype.pp_setBackwardLocal = function () {
        let forward = PP.vec3_create();
        return function pp_setBackwardLocal(backward, up = null, left = null) {
            backward.vec3_negate(forward);
            this._pp_setAxes([left, up, forward], [2, 1, 0], true);
        };
    }();

    //Up

    WL.Object.prototype.pp_setUp = function pp_setUp(up, forward, left) {
        this.pp_setUpWorld(up, forward, left);
    };

    WL.Object.prototype.pp_setUpWorld = function pp_setUpWorld(up, forward = null, left = null) {
        this._pp_setAxes([left, up, forward], [1, 2, 0], false);
    };

    WL.Object.prototype.pp_setUpLocal = function pp_setUpLocal(up, forward = null, left = null) {
        this._pp_setAxes([left, up, forward], [1, 2, 0], true);
    };

    //Down

    WL.Object.prototype.pp_setDown = function pp_setDown(down, forward, left) {
        this.pp_setDownWorld(down, forward, left);
    };

    WL.Object.prototype.pp_setDownWorld = function () {
        let up = PP.vec3_create();
        return function pp_setDownWorld(down, forward = null, left = null) {
            down.vec3_negate(up);
            this._pp_setAxes([left, up, forward], [1, 2, 0], false);
        };
    }();

    WL.Object.prototype.pp_setDownLocal = function () {
        let up = PP.vec3_create();
        return function pp_setDownLocal(down, forward = null, left = null) {
            down.vec3_negate(up);
            this._pp_setAxes([left, up, forward], [1, 2, 0], true);
        };
    }();

    //Left

    WL.Object.prototype.pp_setLeft = function pp_setLeft(left, up, forward) {
        this.pp_setLeftWorld(left, up, forward);
    };

    WL.Object.prototype.pp_setLeftWorld = function pp_setLeftWorld(left, up = null, forward = null) {
        this._pp_setAxes([left, up, forward], [0, 1, 2], false);
    };

    WL.Object.prototype.pp_setLeftLocal = function pp_setLeftLocal(left, up = null, forward = null) {
        this._pp_setAxes([left, up, forward], [0, 1, 2], true);
    };

    //Right

    WL.Object.prototype.pp_setRight = function pp_setRight(right, up, forward) {
        this.pp_setRightWorld(right, up, forward);
    };

    WL.Object.prototype.pp_setRightWorld = function () {
        let left = PP.vec3_create();
        return function pp_setRightWorld(right, up = null, forward = null) {
            right.vec3_negate(left);
            this._pp_setAxes([left, up, forward], [0, 1, 2], false);
        };
    }();

    WL.Object.prototype.pp_setRightLocal = function () {
        let left = PP.vec3_create();
        return function pp_setRightLocal(right, up = null, forward = null) {
            right.vec3_negate(left);
            this._pp_setAxes([left, up, forward], [0, 1, 2], true);
        };
    }();

    //Transform

    WL.Object.prototype.pp_setTransform = function pp_setTransform(transform) {
        this.pp_setTransformWorld(transform);
    };

    WL.Object.prototype.pp_setTransformMatrix = function pp_setTransformMatrix(transform) {
        this.pp_setTransformWorldMatrix(transform);
    };

    WL.Object.prototype.pp_setTransformQuat = function pp_setTransformQuat(transform) {
        this.pp_setTransformWorldQuat(transform);
    };

    //Transform World

    WL.Object.prototype.pp_setTransformWorld = function pp_setTransformWorld(transform) {
        return this.pp_setTransformWorldMatrix(transform);
    };

    WL.Object.prototype.pp_setTransformWorldMatrix = function () {
        let position = PP.vec3_create();
        let rotation = PP.quat_create();
        let scale = PP.vec3_create();
        let transformMatrixNoScale = PP.mat4_create();
        let inverseScale = PP.vec3_create();
        let one = PP.vec3_create(1);
        return function pp_setTransformWorldMatrix(transform) {
            transform.mat4_getPosition(position);
            transform.mat4_getScale(scale);
            one.vec3_div(scale, inverseScale);
            transform.mat4_scale(inverseScale, transformMatrixNoScale);
            transformMatrixNoScale.mat4_getRotationQuat(rotation);
            rotation.quat_normalize(rotation);
            this.pp_setScaleWorld(scale);
            this.pp_setRotationWorldQuat(rotation);
            this.pp_setPositionWorld(position);
        };
    }();

    WL.Object.prototype.pp_setTransformWorldQuat = function pp_setTransformWorldQuat(transform) {
        this.transformWorld = transform;
    };

    //Transform Local

    WL.Object.prototype.pp_setTransformLocal = function pp_setTransformLocal(transform) {
        return this.pp_setTransformLocalMatrix(transform);
    };

    WL.Object.prototype.pp_setTransformLocalMatrix = function () {
        let position = PP.vec3_create();
        let rotation = PP.quat_create();
        let scale = PP.vec3_create();
        let transformMatrixNoScale = PP.mat4_create();
        let inverseScale = PP.vec3_create();
        let one = PP.vec3_create(1);
        return function pp_setTransformLocalMatrix(transform) {
            transform.mat4_getPosition(position);
            transform.mat4_getScale(scale);
            one.vec3_div(scale, inverseScale);
            transform.mat4_scale(inverseScale, transformMatrixNoScale);
            transformMatrixNoScale.mat4_getRotationQuat(rotation);
            rotation.quat_normalize(rotation);
            this.pp_setScaleLocal(scale);
            this.pp_setRotationLocalQuat(rotation);
            this.pp_setPositionLocal(position);
        };
    }();

    WL.Object.prototype.pp_setTransformLocalQuat = function pp_setTransformLocalQuat(transform) {
        this.transformLocal = transform;
    };

    //RESET

    //Position

    WL.Object.prototype.pp_resetPosition = function pp_resetPosition() {
        this.pp_resetPositionWorld();
    };

    WL.Object.prototype.pp_resetPositionWorld = function () {
        let zero = PP.vec3_create();
        return function pp_resetPositionWorld() {
            this.pp_setPositionWorld(zero);
        };
    }();

    WL.Object.prototype.pp_resetPositionLocal = function () {
        let zero = PP.vec3_create();
        return function pp_resetPositionLocal() {
            this.pp_setPositionLocal(zero);
        };
    }();

    //Rotation

    WL.Object.prototype.pp_resetRotation = function pp_resetRotation() {
        this.pp_resetRotationWorld();
    };

    WL.Object.prototype.pp_resetRotationWorld = function () {
        let identity = PP.quat_create();
        return function pp_resetRotationWorld() {
            this.pp_setRotationWorldQuat(identity);
        };
    }();

    WL.Object.prototype.pp_resetRotationLocal = function () {
        let identity = PP.quat_create();
        return function pp_resetRotationLocal() {
            this.pp_setRotationLocalQuat(identity);
        };
    }();

    //Scale

    WL.Object.prototype.pp_resetScale = function pp_resetScale() {
        this.pp_resetScaleWorld();
    };

    WL.Object.prototype.pp_resetScaleWorld = function () {
        let one = PP.vec3_create(1);
        return function pp_resetScaleWorld() {
            this.pp_setScaleWorld(one);
        };
    }();

    WL.Object.prototype.pp_resetScaleLocal = function () {
        let one = PP.vec3_create(1);
        return function pp_resetScaleLocal() {
            this.pp_setScaleLocal(one);
        };
    }();

    //Transform

    WL.Object.prototype.pp_resetTransform = function pp_resetTransform() {
        this.pp_resetTransformWorld();
    };

    WL.Object.prototype.pp_resetTransformWorld = function pp_resetTransformWorld() {
        this.pp_resetScaleWorld();
        this.pp_resetRotationWorld();
        this.pp_resetPositionWorld();
    };

    WL.Object.prototype.pp_resetTransformLocal = function pp_resetTransformLocal() {
        this.pp_resetScaleLocal();
        this.pp_resetRotationLocal();
        this.pp_resetPositionLocal();
    };

    //TRANSFORMATIONS

    //Translate

    WL.Object.prototype.pp_translate = function pp_translate(translation) {
        this.pp_translateWorld(translation);
    };

    WL.Object.prototype.pp_translateWorld = function pp_translateWorld(translation) {
        this.translateWorld(translation);
    };

    WL.Object.prototype.pp_translateLocal = function pp_translateLocal(translation) {
        this.translate(translation);
    };

    WL.Object.prototype.pp_translateObject = function pp_translateObject(translation) {
        this.translateObject(translation);
    };

    //Translate Axis

    WL.Object.prototype.pp_translateAxis = function pp_translateAxis(amount, direction) {
        this.pp_translateAxisWorld(amount, direction);
    };

    WL.Object.prototype.pp_translateAxisWorld = function () {
        let translation = PP.vec3_create();
        return function pp_translateAxisWorld(amount, direction) {
            direction.vec3_scale(amount, translation);
            this.pp_translateWorld(translation);
        };
    }();

    WL.Object.prototype.pp_translateAxisLocal = function () {
        let translation = PP.vec3_create();
        return function pp_translateAxisLocal(amount, direction) {
            direction.vec3_scale(amount, translation);
            this.pp_translateLocal(translation);
        };
    }();

    WL.Object.prototype.pp_translateAxisObject = function () {
        let translation = PP.vec3_create();
        return function pp_translateAxisObject(amount, direction) {
            direction.vec3_scale(amount, translation);
            this.pp_translateObject(translation);
        };
    }();

    //Rotate

    WL.Object.prototype.pp_rotate = function pp_rotate(rotation) {
        this.pp_rotateWorld(rotation);
    };

    WL.Object.prototype.pp_rotateDegrees = function pp_rotateDegrees(rotation) {
        this.pp_rotateWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_rotateRadians = function pp_rotateRadians(rotation) {
        this.pp_rotateWorldRadians(rotation);
    };

    WL.Object.prototype.pp_rotateMatrix = function pp_rotateMatrix(rotation) {
        this.pp_rotateWorldMatrix(rotation);
    };

    WL.Object.prototype.pp_rotateQuat = function pp_rotateQuat(rotation) {
        this.pp_rotateWorldQuat(rotation);
    };

    //Rotate World

    WL.Object.prototype.pp_rotateWorld = function pp_rotateWorld(rotation) {
        this.pp_rotateWorldDegrees(rotation);
    };

    WL.Object.prototype.pp_rotateWorldDegrees = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateWorldDegrees(rotation) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateWorldQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateWorldRadians = function () {
        let degreesRotation = PP.vec3_create();
        return function pp_rotateWorldRadians(rotation) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateWorldDegrees(degreesRotation);
        };
    }();

    WL.Object.prototype.pp_rotateWorldMatrix = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateWorldMatrix(rotation) {
            rotation.mat3_toQuat(rotationQuat);
            rotationQuat.quat_normalize(rotationQuat);
            this.pp_rotateWorldQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateWorldQuat = function () {
        let currentRotationQuat = PP.quat_create();
        return function pp_rotateWorldQuat(rotation) {
            this.pp_getRotationWorldQuat(currentRotationQuat);
            rotation.quat_mul(currentRotationQuat, currentRotationQuat);
            currentRotationQuat.quat_normalize(currentRotationQuat);
            this.pp_setRotationWorldQuat(currentRotationQuat);
        };
    }();

    //Rotate Local

    WL.Object.prototype.pp_rotateLocal = function pp_rotateLocal(rotation) {
        this.pp_rotateLocalDegrees(rotation);
    };

    WL.Object.prototype.pp_rotateLocalDegrees = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateLocalDegrees(rotation) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateLocalQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateLocalRadians = function () {
        let degreesRotation = PP.vec3_create();
        return function pp_rotateLocalRadians(rotation) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateLocalDegrees(degreesRotation);
        };
    }();

    WL.Object.prototype.pp_rotateLocalMatrix = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateLocalMatrix(rotation) {
            rotation.mat3_toQuat(rotationQuat);
            rotationQuat.quat_normalize(rotationQuat);
            this.pp_rotateLocalQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateLocalQuat = function () {
        let currentRotationQuat = PP.quat_create();
        return function pp_rotateLocalQuat(rotation) {
            this.pp_getRotationLocalQuat(currentRotationQuat);
            rotation.quat_mul(currentRotationQuat, currentRotationQuat);
            currentRotationQuat.quat_normalize(currentRotationQuat);
            this.pp_setRotationLocalQuat(currentRotationQuat);
        };
    }();

    //Rotate Object

    WL.Object.prototype.pp_rotateObject = function pp_rotateObject(rotation) {
        this.pp_rotateObjectDegrees(rotation);
    };

    WL.Object.prototype.pp_rotateObjectDegrees = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateObjectDegrees(rotation) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateObjectQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateObjectRadians = function () {
        let degreesRotation = PP.vec3_create();
        return function pp_rotateObjectRadians(rotation) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateObjectDegrees(degreesRotation);
        };
    }();

    WL.Object.prototype.pp_rotateObjectMatrix = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateObjectMatrix(rotation) {
            rotation.mat3_toQuat(rotationQuat);
            rotationQuat.quat_normalize(rotationQuat);
            this.pp_rotateObjectQuat(rotationQuat);
        };
    }();

    WL.Object.prototype.pp_rotateObjectQuat = function pp_rotateObjectQuat(rotation) {
        this.rotateObject(rotation);
    };

    //Rotate Axis

    WL.Object.prototype.pp_rotateAxis = function pp_rotateAxis(angle, axis) {
        this.pp_rotateAxisWorld(angle, axis);
    };

    WL.Object.prototype.pp_rotateAxisDegrees = function pp_rotateAxisDegrees(angle, axis) {
        this.pp_rotateAxisWorldDegrees(angle, axis);
    };

    WL.Object.prototype.pp_rotateAxisRadians = function pp_rotateAxisRadians(angle, axis) {
        this.pp_rotateAxisWorldRadians(angle, axis);
    };

    //Rotate Axis World

    WL.Object.prototype.pp_rotateAxisWorld = function pp_rotateAxisWorld(angle, axis) {
        this.pp_rotateAxisWorldDegrees(angle, axis);
    };

    WL.Object.prototype.pp_rotateAxisWorldDegrees = function pp_rotateAxisWorldDegrees(angle, axis) {
        this.pp_rotateAxisWorldRadians(Math.pp_toRadians(angle), axis);
    };

    WL.Object.prototype.pp_rotateAxisWorldRadians = function () {
        let rotation = PP.quat_create();
        return function pp_rotateAxisWorldRadians(angle, axis) {
            rotation.quat_fromAxisRadians(angle, axis);
            this.pp_rotateWorldQuat(rotation);
        };
    }();

    //Rotate Axis Local

    WL.Object.prototype.pp_rotateAxisLocal = function pp_rotateAxisLocal(angle, axis) {
        this.pp_rotateAxisLocalDegrees(angle, axis);
    };

    WL.Object.prototype.pp_rotateAxisLocalDegrees = function pp_rotateAxisLocalDegrees(angle, axis) {
        this.pp_rotateAxisLocalRadians(Math.pp_toRadians(angle), axis);
    };

    WL.Object.prototype.pp_rotateAxisLocalRadians = function () {
        let rotation = PP.quat_create();
        return function pp_rotateAxisLocalRadians(angle, axis) {
            rotation.quat_fromAxisRadians(angle, axis);
            this.pp_rotateLocalQuat(rotation);
        };
    }();

    //Rotate Axis Object

    WL.Object.prototype.pp_rotateAxisObject = function pp_rotateAxisObject(angle, axis) {
        this.pp_rotateAxisObjectDegrees(angle, axis);
    };

    WL.Object.prototype.pp_rotateAxisObjectDegrees = function pp_rotateAxisObjectDegrees(angle, axis) {
        this.pp_rotateAxisObjectRadians(Math.pp_toRadians(angle), axis);
    };

    WL.Object.prototype.pp_rotateAxisObjectRadians = function () {
        let rotation = PP.quat_create();
        return function pp_rotateAxisObjectRadians(angle, axis) {
            rotation.quat_fromAxisRadians(angle, axis);
            this.pp_rotateObjectQuat(rotation);
        };
    }();

    //Rotate Around

    WL.Object.prototype.pp_rotateAround = function pp_rotateAround(rotation, origin) {
        this.pp_rotateAroundWorld(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundDegrees = function pp_rotateAroundDegrees(rotation, origin) {
        this.pp_rotateAroundWorldDegrees(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundRadians = function pp_rotateAroundRadians(rotation, origin) {
        this.pp_rotateAroundWorldRadians(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundMatrix = function pp_rotateAroundMatrix(rotation, origin) {
        this.pp_rotateAroundWorldMatrix(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundQuat = function pp_rotateAroundQuat(rotation, origin) {
        this.pp_rotateAroundWorldQuat(rotation, origin);
    };

    //Rotate Around World

    WL.Object.prototype.pp_rotateAroundWorld = function pp_rotateAroundWorld(rotation, origin) {
        this.pp_rotateAroundWorldDegrees(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundWorldDegrees = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateAroundWorldDegrees(rotation, origin) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateAroundWorldQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundWorldRadians = function () {
        let degreesRotation = PP.vec3_create();
        return function pp_rotateAroundWorldRadians(rotation, origin) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateAroundWorldDegrees(degreesRotation, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundWorldMatrix = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateAroundWorldMatrix(rotation, origin) {
            rotation.mat3_toQuat(rotationQuat);
            rotationQuat.quat_normalize(rotationQuat);
            this.pp_rotateAroundWorldQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundWorldQuat = function () {
        let axis = PP.vec3_create();
        return function pp_rotateAroundWorldQuat(rotation, origin) {
            rotation.quat_getAxis(axis);
            let angle = rotation.quat_getAngleRadians();
            this.pp_rotateAroundAxisWorldRadians(angle, axis, origin);
        };
    }();

    //Rotate Around Local

    WL.Object.prototype.pp_rotateAroundLocal = function pp_rotateAroundLocal(rotation, origin) {
        this.pp_rotateAroundLocalDegrees(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundLocalDegrees = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateAroundLocalDegrees(rotation, origin) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateAroundLocalQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundLocalRadians = function () {
        let degreesRotation = PP.vec3_create();
        return function pp_rotateAroundLocalRadians(rotation, origin) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateAroundLocalDegrees(degreesRotation, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundLocalMatrix = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateAroundLocalMatrix(rotation, origin) {
            rotation.mat3_toQuat(rotationQuat);
            rotationQuat.quat_normalize(rotationQuat);
            this.pp_rotateAroundLocalQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundLocalQuat = function () {
        let axis = PP.vec3_create();
        return function pp_rotateAroundLocalQuat(rotation, origin) {
            rotation.quat_getAxis(axis);
            let angle = rotation.quat_getAngleRadians();
            this.pp_rotateAroundAxisLocalRadians(angle, axis, origin);
        };
    }();

    //Rotate Around Object

    WL.Object.prototype.pp_rotateAroundObject = function pp_rotateAroundObject(rotation, origin) {
        this.pp_rotateAroundObjectDegrees(rotation, origin);
    };

    WL.Object.prototype.pp_rotateAroundObjectDegrees = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateAroundObjectDegrees(rotation, origin) {
            this._pp_degreesToQuaternion(rotation, rotationQuat);
            this.pp_rotateAroundObjectQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundObjectRadians = function () {
        let degreesRotation = PP.vec3_create();
        return function pp_rotateAroundObjectRadians(rotation, origin) {
            rotation.forEach(function (value, index, array) {
                degreesRotation[index] = this._pp_toDegrees(value);
            }.bind(this));
            this.pp_rotateAroundObjectDegrees(degreesRotation, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundObjectMatrix = function () {
        let rotationQuat = PP.quat_create();
        return function pp_rotateAroundObjectMatrix(rotation, origin) {
            rotation.mat3_toQuat(rotationQuat);
            rotationQuat.quat_normalize(rotationQuat);
            this.pp_rotateAroundObjectQuat(rotationQuat, origin);
        };
    }();

    WL.Object.prototype.pp_rotateAroundObjectQuat = function () {
        let axis = PP.vec3_create();
        return function pp_rotateAroundObjectQuat(rotation, origin) {
            rotation.quat_getAxis(axis);
            let angle = rotation.quat_getAngleRadians();
            this.pp_rotateAroundAxisObjectRadians(angle, axis, origin);
        };
    }();

    //Rotate Around Axis

    WL.Object.prototype.pp_rotateAroundAxis = function pp_rotateAroundAxis(angle, axis, origin) {
        this.pp_rotateAroundAxisWorld(angle, axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisDegrees = function pp_rotateAroundAxisDegrees(angle, axis, origin) {
        this.pp_rotateAroundAxisWorldDegrees(angle, axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisRadians = function pp_rotateAroundAxisRadians(angle, axis, origin) {
        this.pp_rotateAroundAxisWorldRadians(angle, axis, origin);
    };

    //Rotate Around Axis World

    WL.Object.prototype.pp_rotateAroundAxisWorld = function pp_rotateAroundAxisWorld(angle, axis, origin) {
        this.pp_rotateAroundAxisWorldDegrees(angle, axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisWorldDegrees = function pp_rotateAroundAxisWorldDegrees(angle, axis, origin) {
        this.pp_rotateAroundAxisWorldRadians(Math.pp_toRadians(angle), axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisWorldRadians = function () {
        let transformToRotate = PP.quat2_create();
        let transformToRotateConjugate = PP.quat2_create();
        let transformQuat = PP.quat2_create();
        let defaultQuat = PP.quat_create();
        return function pp_rotateAroundAxisWorldRadians(angle, axis, origin) {
            transformToRotate.quat2_setPositionRotationQuat(origin, defaultQuat);
            this.pp_getTransformWorldQuat(transformQuat);
            transformToRotate.quat2_conjugate(transformToRotateConjugate);
            transformToRotateConjugate.quat2_mul(transformQuat, transformQuat);
            transformToRotate.quat2_rotateAxisRadians(angle, axis, transformToRotate);
            transformToRotate.quat2_mul(transformQuat, transformQuat);
            this.pp_setTransformWorldQuat(transformQuat);
        };
    }();

    //Rotate Around Axis Local

    WL.Object.prototype.pp_rotateAroundAxisLocal = function pp_rotateAroundAxisLocal(angle, axis, origin) {
        this.pp_rotateAroundAxisLocalDegrees(angle, axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisLocalDegrees = function pp_rotateAroundAxisLocalDegrees(angle, axis, origin) {
        this.pp_rotateAroundAxisLocalRadians(Math.pp_toRadians(angle), axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisLocalRadians = function () {
        let convertedPosition = PP.vec3_create();
        let convertedAxis = PP.vec3_create();
        return function pp_rotateAroundAxisLocalRadians(angle, axis, origin) {
            this.pp_convertPositionLocalToWorld(origin, convertedPosition);
            this.pp_convertDirectionLocalToWorld(axis, convertedAxis);
            this.pp_rotateAroundAxisWorldRadians(angle, convertedAxis, convertedPosition);
        };
    }();

    //Rotate Around Axis Object

    WL.Object.prototype.pp_rotateAroundAxisObject = function pp_rotateAroundAxisObject(angle, axis, origin) {
        this.pp_rotateAroundAxisObjectDegrees(angle, axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisObjectDegrees = function pp_rotateAroundAxisObjectDegrees(angle, axis, origin) {
        this.pp_rotateAroundAxisObjectRadians(Math.pp_toRadians(angle), axis, origin);
    };

    WL.Object.prototype.pp_rotateAroundAxisObjectRadians = function () {
        let convertedPosition = PP.vec3_create();
        let convertedAxis = PP.vec3_create();
        return function pp_rotateAroundAxisObjectRadians(angle, axis, origin) {
            this.pp_convertPositionObjectToWorld(origin, convertedPosition);
            this.pp_convertDirectionObjectToWorld(axis, convertedAxis);
            this.pp_rotateAroundAxisWorldRadians(angle, convertedAxis, convertedPosition);
        };
    }();

    //Scale

    //For now it does not really make sense in wle to scale in world space or parent space
    //so there is no pp_scale default function

    WL.Object.prototype.pp_scaleObject = function () {
        let vector = PP.vec3_create();
        return function pp_scaleObject(scale) {
            if (isNaN(scale)) {
                this.scale(scale);
            } else {
                vector.vec3_set(scale);
                this.scale(vector);
            }
        };
    }();

    //Look At

    WL.Object.prototype.pp_lookAt = function pp_lookAt(position, up) {
        this.pp_lookAtWorld(position, up);
    };

    WL.Object.prototype.pp_lookAtWorld = function () {
        let direction = PP.vec3_create();
        return function pp_lookAtWorld(position, up) {
            this.pp_getPositionWorld(direction);
            position.vec3_sub(direction, direction);
            this.pp_lookToWorld(direction, up);
        };
    }();

    WL.Object.prototype.pp_lookAtLocal = function () {
        let direction = PP.vec3_create();
        return function pp_lookAtLocal(position, up) {
            this.pp_getPositionLocal(direction);
            position.vec3_sub(direction, direction);
            this.pp_lookToLocal(direction, up);
        };
    }();

    WL.Object.prototype.pp_lookTo = function pp_lookTo(direction, up) {
        this.pp_lookToWorld(direction, up);
    };

    WL.Object.prototype.pp_lookToWorld = function () {
        let internalUp = PP.vec3_create();
        return function pp_lookToWorld(direction, up = this.pp_getUpWorld(internalUp)) {
            this.pp_setForwardWorld(direction, up);
        };
    }();

    WL.Object.prototype.pp_lookToLocal = function () {
        let internalUp = PP.vec3_create();
        return function pp_lookToLocal(direction, up = this.pp_getUpLocal(internalUp)) {
            this.pp_setForwardLocal(direction, up);
        };
    }();

    //EXTRA

    //Parent

    WL.Object.prototype.pp_setParent = function () {
        let position = PP.vec3_create();
        let rotation = PP.quat_create();
        let scale = PP.vec3_create();
        return function pp_setParent(newParent, keepTransform = true) {
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

    WL.Object.prototype.pp_getParent = function pp_getParent() {
        return this.parent;
    };

    //Convert Vector Object World

    WL.Object.prototype.pp_convertPositionObjectToWorld = function () {
        let matrix = PP.mat4_create();
        return function pp_convertPositionObjectToWorld(position, resultPosition = PP.vec3_create()) {
            this.pp_getTransformWorldMatrix(matrix);
            position.vec3_transformMat4(matrix, resultPosition);
            return resultPosition;
        };
    }();

    WL.Object.prototype.pp_convertDirectionObjectToWorld = function () {
        let rotation = PP.quat_create();
        return function pp_convertDirectionObjectToWorld(direction, resultDirection = PP.vec3_create()) {
            this.pp_getRotationWorldQuat(rotation);
            direction.vec3_transformQuat(rotation, resultDirection);
            return resultDirection;
        };
    }();

    WL.Object.prototype.pp_convertPositionWorldToObject = function () {
        let matrix = PP.mat4_create();
        return function pp_convertPositionWorldToObject(position, resultPosition = PP.vec3_create()) {
            this.pp_getTransformWorldMatrix(matrix);
            matrix.mat4_invert(matrix);
            position.vec3_transformMat4(matrix, resultPosition);
            return resultPosition;
        };
    }();

    WL.Object.prototype.pp_convertDirectionWorldToObject = function () {
        let rotation = PP.quat_create();
        return function pp_convertDirectionWorldToObject(direction, resultDirection = PP.vec3_create()) {
            this.pp_getRotationWorldQuat(rotation);
            rotation.quat_conjugate(rotation);
            direction.vec3_transformQuat(rotation, resultDirection);
            return resultDirection;
        };
    }();

    //Convert Vector Local World

    WL.Object.prototype.pp_convertPositionLocalToWorld = function pp_convertPositionLocalToWorld(position, resultPosition = PP.vec3_create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertPositionObjectToWorld(position, resultPosition);
        } else {
            resultPosition.vec3_copy(position);
        }
        return resultPosition;
    };

    WL.Object.prototype.pp_convertDirectionLocalToWorld = function pp_convertDirectionLocalToWorld(direction, resultDirection = PP.vec3_create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertDirectionObjectToWorld(direction, resultDirection);
        } else {
            resultDirection.vec3_copy(direction);
        }
        return resultDirection;
    };

    WL.Object.prototype.pp_convertPositionWorldToLocal = function pp_convertPositionWorldToLocal(position, resultPosition = PP.vec3_create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertPositionWorldToObject(position, resultPosition);
        } else {
            resultPosition.vec3_copy(position);
        }
        return resultPosition;
    };

    WL.Object.prototype.pp_convertDirectionWorldToLocal = function pp_convertDirectionWorldToLocal(direction, resultDirection = PP.vec3_create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertDirectionWorldToObject(direction, resultDirection);
        } else {
            resultDirection.vec3_copy(direction);
        }
        return resultDirection;
    };

    //Convert Vector Local Object

    //I need to use the converson to world and then local also use the parent scale that changes the position in local space

    WL.Object.prototype.pp_convertPositionObjectToLocal = function pp_convertPositionObjectToLocal(position, resultPosition = PP.vec3_create()) {
        this.pp_convertPositionObjectToWorld(position, resultPosition);
        this.pp_convertPositionWorldToLocal(resultPosition, resultPosition);
        return resultPosition;
    };

    WL.Object.prototype.pp_convertDirectionObjectToLocal = function pp_convertDirectionObjectToLocal(direction, resultDirection = PP.vec3_create()) {
        this.pp_convertDirectionObjectToWorld(direction, resultDirection);
        this.pp_convertDirectionWorldToLocal(resultDirection, resultDirection);
        return resultDirection;
    };

    WL.Object.prototype.pp_convertPositionLocalToObject = function pp_convertPositionLocalToObject(position, resultPosition = PP.vec3_create()) {
        this.pp_convertPositionLocalToWorld(position, resultPosition);
        this.pp_convertPositionWorldToObject(resultPosition, resultPosition);
        return resultPosition;
    };

    WL.Object.prototype.pp_convertDirectionLocalToObject = function pp_convertDirectionLocalToObject(direction, resultDirection = PP.vec3_create()) {
        this.pp_convertDirectionLocalToWorld(direction, resultDirection);
        this.pp_convertDirectionWorldToObject(resultDirection, resultDirection);
        return resultDirection;
    };

    //Convert Transform Object World

    WL.Object.prototype.pp_convertTransformObjectToWorld = function pp_convertTransformObjectToWorld(transform, resultTransform) {
        return this.pp_convertTransformObjectToWorldMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformObjectToWorldMatrix = function () {
        let convertTransform = PP.mat4_create();
        let position = PP.vec3_create();
        let scale = PP.vec3_create();
        let inverseScale = PP.vec3_create();
        let one = PP.vec3_create(1);
        return function pp_convertTransformObjectToWorldMatrix(transform, resultTransform = PP.mat4_create()) {
            this.pp_getTransformWorldMatrix(convertTransform);
            if (this.pp_hasUniformScaleWorld()) {
                convertTransform.mat4_mul(transform, resultTransform);
            } else {
                position.vec3_set(transform[12], transform[13], transform[14]);
                this.pp_convertPositionObjectToWorld(position, position);

                convertTransform.mat4_getScale(scale);
                one.vec3_div(scale, inverseScale);
                convertTransform.mat4_scale(inverseScale, convertTransform);

                convertTransform.mat4_mul(transform, resultTransform);
                resultTransform.mat4_scale(scale, resultTransform);

                resultTransform[12] = position[0];
                resultTransform[13] = position[1];
                resultTransform[14] = position[2];
                resultTransform[15] = 1;
            }
            return resultTransform;
        };
    }();

    WL.Object.prototype.pp_convertTransformObjectToWorldQuat = function () {
        let position = PP.vec3_create();
        let rotation = PP.quat_create();
        return function pp_convertTransformObjectToWorldQuat(transform, resultTransform = PP.quat2_create()) {
            this.pp_getRotationWorldQuat(rotation);
            rotation.quat_mul(transform, rotation);
            transform.quat2_getPosition(position);
            this.pp_convertPositionObjectToWorld(position, position);
            resultTransform.quat2_setPositionRotationQuat(position, rotation);
            return resultTransform;
        };
    }();

    WL.Object.prototype.pp_convertTransformWorldToObject = function pp_convertTransformWorldToObject(transform, resultTransform) {
        return this.pp_convertTransformWorldToObjectMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformWorldToObjectMatrix = function () {
        let convertTransform = PP.mat4_create();
        let position = PP.vec3_create();
        let scale = PP.vec3_create();
        let inverseScale = PP.vec3_create();
        let one = PP.vec3_create(1);
        return function pp_convertTransformWorldToObjectMatrix(transform, resultTransform = PP.mat4_create()) {
            this.pp_getTransformWorldMatrix(convertTransform);
            if (this.pp_hasUniformScaleWorld()) {
                convertTransform.mat4_invert(convertTransform);
                convertTransform.mat4_mul(transform, resultTransform);
            } else {
                position.vec3_set(transform[12], transform[13], transform[14]);
                this.pp_convertPositionWorldToObject(position, position);

                convertTransform.mat4_getScale(scale);
                one.vec3_div(scale, inverseScale);
                convertTransform.mat4_scale(inverseScale, convertTransform);

                convertTransform.mat4_invert(convertTransform);
                convertTransform.mat4_mul(transform, resultTransform);
                resultTransform.mat4_scale(inverseScale, resultTransform);

                resultTransform[12] = position[0];
                resultTransform[13] = position[1];
                resultTransform[14] = position[2];
                resultTransform[15] = 1;
            }
            return resultTransform;
        };
    }();

    WL.Object.prototype.pp_convertTransformWorldToObjectQuat = function () {
        let position = PP.vec3_create();
        let rotation = PP.quat_create();
        return function pp_convertTransformWorldToObjectQuat(transform, resultTransform = PP.quat2_create()) {
            this.pp_getRotationWorldQuat(rotation);
            rotation.quat_conjugate(rotation);
            rotation.quat_mul(transform, rotation);
            transform.quat2_getPosition(position);
            this.pp_convertPositionWorldToObject(position, position);
            resultTransform.quat2_setPositionRotationQuat(position, rotation);
            return resultTransform;
        };
    }();

    //Convert Transform Local World

    WL.Object.prototype.pp_convertTransformLocalToWorld = function pp_convertTransformLocalToWorld(transform, resultTransform) {
        return this.pp_convertTransformLocalToWorldMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformLocalToWorldMatrix = function pp_convertTransformLocalToWorldMatrix(transform, resultTransform = PP.mat4_create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertTransformObjectToWorldMatrix(transform, resultTransform);
        } else {
            resultTransform.mat4_copy(transform);
        }
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformLocalToWorldQuat = function pp_convertTransformLocalToWorldQuat(transform, resultTransform = PP.quat2_create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertTransformObjectToWorldQuat(transform, resultTransform);
        } else {
            resultTransform.quat2_copy(transform);
        }
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformWorldToLocal = function pp_convertTransformWorldToLocal(transform, resultTransform) {
        return this.pp_convertTransformWorldToLocalMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformWorldToLocalMatrix = function pp_convertTransformWorldToLocalMatrix(transform, resultTransform = PP.mat4_create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertTransformWorldToObjectMatrix(transform, resultTransform);
        } else {
            resultTransform.mat4_copy(transform);
        }
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformWorldToLocalQuat = function pp_convertTransformWorldToLocalQuat(transform, resultTransform = PP.quat2_create()) {
        if (this.pp_getParent()) {
            this.pp_getParent().pp_convertTransformWorldToObjectQuat(transform, resultTransform);
        } else {
            resultTransform.quat2_copy(transform);
        }
        return resultTransform;
    };

    //Convert Transform Object Local

    //I need to use the converson to world and then local also use the parent scale that changes the position in local space

    WL.Object.prototype.pp_convertTransformObjectToLocal = function pp_convertTransformObjectToLocal(transform, resultTransform) {
        return this.pp_convertTransformObjectToLocalMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformObjectToLocalMatrix = function pp_convertTransformObjectToLocalMatrix(transform, resultTransform = PP.mat4_create()) {
        this.pp_convertTransformObjectToWorldMatrix(transform, resultTransform);
        this.pp_convertTransformWorldToLocalMatrix(resultTransform, resultTransform);
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformObjectToLocalQuat = function pp_convertTransformObjectToLocalQuat(transform, resultTransform = PP.quat2_create()) {
        this.pp_convertTransformObjectToWorldQuat(transform, resultTransform);
        this.pp_convertTransformWorldToLocalQuat(resultTransform, resultTransform);
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformLocalToObject = function pp_convertTransformLocalToObject(transform, resultTransform) {
        return this.pp_convertTransformLocalToObjectMatrix(transform, resultTransform);
    };

    WL.Object.prototype.pp_convertTransformLocalToObjectMatrix = function pp_convertTransformLocalToObjectMatrix(transform, resultTransform = PP.mat4_create()) {
        this.pp_convertTransformLocalToWorldMatrix(transform, resultTransform);
        this.pp_convertTransformWorldToObjectMatrix(resultTransform, resultTransform);
        return resultTransform;
    };

    WL.Object.prototype.pp_convertTransformLocalToObjectQuat = function pp_convertTransformLocalToObjectQuat(transform, resultTransform = PP.quat2_create()) {
        this.pp_convertTransformLocalToWorldQuat(transform, resultTransform);
        this.pp_convertTransformWorldToObjectQuat(resultTransform, resultTransform);
        return resultTransform;
    };

    //Component

    WL.Object.prototype.pp_addComponent = function pp_addComponent(type, paramsOrActive, active = null) {
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

    WL.Object.prototype.pp_getComponent = function pp_getComponent(type, index = 0) {
        return this.pp_getComponentHierarchy(type, index);
    };

    WL.Object.prototype.pp_getComponentSelf = function pp_getComponentSelf(type, index = 0) {
        return this.getComponent(type, index);
    };

    WL.Object.prototype.pp_getComponentHierarchy = function pp_getComponentHierarchy(type, index = 0) {
        return this.pp_getComponentHierarchyBreadth(type, index);
    };

    WL.Object.prototype.pp_getComponentHierarchyBreadth = function pp_getComponentHierarchyBreadth(type, index = 0) {
        let objects = this.pp_getHierarchyBreadth();
        return WL.Object.pp_getComponentObjects(objects, type, index);
    };

    WL.Object.prototype.pp_getComponentHierarchyDepth = function pp_getComponentHierarchyDepth(type, index = 0) {
        let objects = this.pp_getHierarchyDepth();
        return WL.Object.pp_getComponentObjects(objects, type, index);
    };

    WL.Object.prototype.pp_getComponentDescendants = function pp_getComponentDescendants(type, index = 0) {
        return this.pp_getComponentDescendantsBreadth(type, index);
    };

    WL.Object.prototype.pp_getComponentDescendantsBreadth = function pp_getComponentDescendantsBreadth(type, index = 0) {
        let objects = this.pp_getDescendantsBreadth();
        return WL.Object.pp_getComponentObjects(objects, type, index);
    };

    WL.Object.prototype.pp_getComponentDescendantsDepth = function pp_getComponentDescendantsDepth(type, index = 0) {
        let objects = this.pp_getDescendantsDepth();
        return WL.Object.pp_getComponentObjects(objects, type, index);
    };

    WL.Object.prototype.pp_getComponentChildren = function pp_getComponentChildren(type, index = 0) {
        let objects = this.pp_getChildren();
        return WL.Object.pp_getComponentObjects(objects, type, index);
    };

    WL.Object.prototype.pp_getComponents = function pp_getComponents(type) {
        return this.pp_getComponentsHierarchy(type);
    };

    WL.Object.prototype.pp_getComponentsSelf = function pp_getComponentsSelf(type) {
        return this.getComponents(type);
    };

    WL.Object.prototype.pp_getComponentsHierarchy = function pp_getComponentsHierarchy(type) {
        return this.pp_getComponentsHierarchyBreadth(type);
    };

    WL.Object.prototype.pp_getComponentsHierarchyBreadth = function pp_getComponentsHierarchyBreadth(type) {
        let objects = this.pp_getHierarchyBreadth();
        return WL.Object.pp_getComponentsObjects(objects, type);
    };

    WL.Object.prototype.pp_getComponentsHierarchyDepth = function pp_getComponentsHierarchyDepth(type) {
        let objects = this.pp_getHierarchyDepth();
        return WL.Object.pp_getComponentsObjects(objects, type);
    };

    WL.Object.prototype.pp_getComponentsDescendants = function pp_getComponentsDescendants(type) {
        return this.pp_getComponentsDescendantsBreadth(type);
    };

    WL.Object.prototype.pp_getComponentsDescendantsBreadth = function pp_getComponentsDescendantsBreadth(type) {
        let objects = this.pp_getDescendantsBreadth();
        return WL.Object.pp_getComponentsObjects(objects, type);
    };

    WL.Object.prototype.pp_getComponentsDescendantsDepth = function pp_getComponentsDescendantsDepth(type) {
        let objects = this.pp_getDescendantsDepth();
        return WL.Object.pp_getComponentsObjects(objects, type);
    };

    WL.Object.prototype.pp_getComponentsChildren = function pp_getComponentsChildren(type) {
        let objects = this.pp_getChildren();
        return WL.Object.pp_getComponentsObjects(objects, type);
    };

    //Active

    WL.Object.prototype.pp_setActive = function pp_setActive(active, applyToHierarchy = true) {
        if (applyToHierarchy) {
            this.pp_setActiveHierarchy(active);
        } else {
            this.active = active;
        }
    };

    WL.Object.prototype.pp_setActiveSelf = function pp_setActiveSelf(active) {
        this.pp_setActive(active, false);
    };

    WL.Object.prototype.pp_setActiveHierarchy = function pp_setActiveHierarchy(active) {
        this.pp_setActiveHierarchyBreadth(active);
    };

    WL.Object.prototype.pp_setActiveHierarchyBreadth = function pp_setActiveHierarchyBreadth(active) {
        let objects = this.pp_getHierarchyBreadth();
        return WL.Object.pp_setActiveObjects(objects, active);
    };

    WL.Object.prototype.pp_setActiveHierarchyDepth = function pp_setActiveHierarchyDepth(active) {
        let objects = this.pp_getHierarchyDepth();
        return WL.Object.pp_setActiveObjects(objects, active);
    };

    WL.Object.prototype.pp_setActiveDescendants = function pp_setActiveDescendants(active) {
        this.pp_setActiveDescendantsBreadth(active);
    };

    WL.Object.prototype.pp_setActiveDescendantsBreadth = function pp_setActiveDescendantsBreadth(active) {
        let objects = this.pp_getDescendantsBreadth();
        return WL.Object.pp_setActiveObjects(objects, active);
    };

    WL.Object.prototype.pp_setActiveDescendantsDepth = function pp_setActiveDescendantsDepth(active) {
        let objects = this.pp_getDescendantsDepth();
        return WL.Object.pp_setActiveObjects(objects, active);
    };

    WL.Object.prototype.pp_setActiveChildren = function pp_setActiveChildren(active) {
        let objects = this.pp_getChildren();
        return WL.Object.pp_setActiveObjects(objects, active);
    };

    //Uniform Scale

    WL.Object.prototype.pp_hasUniformScale = function pp_hasUniformScale() {
        return this.pp_hasUniformScaleWorld();
    };

    WL.Object.prototype.pp_hasUniformScaleWorld = function () {
        let scale = PP.vec3_create();
        return function pp_hasUniformScaleWorld() {
            this.pp_getScaleWorld(scale);
            return Math.abs(scale[0] - scale[1]) < this._pp_epsilon && Math.abs(scale[1] - scale[2]) < this._pp_epsilon && Math.abs(scale[0] - scale[2]) < this._pp_epsilon;
        };
    }();

    WL.Object.prototype.pp_hasUniformScaleLocal = function () {
        let scale = PP.vec3_create();
        return function pp_hasUniformScaleLocal() {
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

            this.myCustomParamsMap = new Map(); // This map can be filled with whatever custom paramater the component clone function could need
        }
    };

    PP.DeepCloneParams = class DeepCloneParams {
        constructor() {
            this._myDeepCloneObject = false;
            this._myOverrideDeepCloneComponentsMap = new Map();
            this._myOverrideDeepCloneComponentsVariablesMap = new Map();
        }

        // The implementation is component dependant, not every component implements the deep clone
        setDeepCloneObject(deepClone) {
            this._myDeepCloneObject = deepClone;
        }

        // This value override the deep clone object value
        // The implementation is component dependant, not every component implements the deep clone
        setDeepCloneComponent(componentName, deepClone) {
            this._myOverrideDeepCloneComponentsMap.set(componentName, deepClone);
        }

        // This value override both the deep clone object value and the deep clone component one
        // The implementation is component dependant, not every component variable override is taken into consideration
        setDeepCloneComponentVariable(componentName, variableName, deepClone) {
            let componentsVariablesMap = null;

            if (!this._myOverrideDeepCloneComponentsVariablesMap.has(componentName)) {
                this._myOverrideDeepCloneComponentsVariablesMap.set(componentName, new Map());
            }

            componentsVariablesMap = this._myOverrideDeepCloneComponentsVariablesMap.get(componentName);

            componentsVariablesMap.set(variableName, deepClone);
        }

        isDeepCloneComponent(componentName) {
            let overrideValue = this._myOverrideDeepCloneComponentsMap.get(componentName);

            if (overrideValue != null) {
                return overrideValue;
            }

            return this._myDeepCloneObject;
        }

        isDeepCloneComponentVariable(componentName, variableName) {
            let componentsVariablesMap = this._myOverrideDeepCloneComponentsVariablesMap.get(componentName);
            if (componentsVariablesMap != null) {
                let overrideValue = componentsVariablesMap.get(variableName);
                if (overrideValue != null) {
                    return overrideValue;
                }
            }

            return this.isDeepCloneComponent(componentName);
        }
    };

    WL.Object.prototype.pp_clone = function () {
        let scale = PP.vec3_create();
        let transformQuat = PP.quat2_create();
        return function pp_clone(params = new PP.CloneParams()) {
            let clonedObject = null;

            if (this.pp_isCloneable(params)) {
                let objectsToCloneData = [];
                objectsToCloneData.push([this.parent, this]);

                // Create the object hierarchy
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

                // Get the components to clone
                let componentsToCloneData = [];
                while (objectsToCloneComponentsData.length > 0) {
                    let cloneData = objectsToCloneComponentsData.shift();
                    let objectToClone = cloneData[0];
                    let currentClonedObject = cloneData[1];

                    let components = objectToClone.pp_getComponentsSelf();
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
                                componentsToCloneData.push([component, currentClonedObject]);
                            }
                        }
                    }
                }

                // Clone the components
                let componentsToPostProcessData = [];
                while (componentsToCloneData.length > 0) {
                    let cloneData = componentsToCloneData.shift();
                    let componentToClone = cloneData[0];
                    let currentClonedObject = cloneData[1];

                    let clonedComponent = componentToClone.pp_clone(currentClonedObject, params.myDeepCloneParams, params.myCustomParamsMap);
                    if (componentToClone.pp_clonePostProcess != null) {
                        componentsToPostProcessData.push([componentToClone, clonedComponent]);
                    }
                }

                // Clone post process
                // Can be useful if you have to get some data from other components in the hierarchy which have now been created
                while (componentsToCloneData.length > 0) {
                    let cloneData = componentsToCloneData.shift();
                    let componentToClone = cloneData[0];
                    let currentClonedComponent = cloneData[1];

                    componentToClone.pp_clonePostProcess(currentClonedComponent, params.myDeepCloneParams, params.myCustomParamsMap);
                }
            }

            return clonedObject;
        };
    }();

    WL.Object.prototype.pp_isCloneable = function pp_isCloneable(params = new PP.CloneParams()) {
        if (params.myIgnoreNonCloneable || params.myIgnoreComponents) {
            return true;
        }

        let isCloneable = true;

        let objects = [];
        objects.push(this);

        while (isCloneable && objects.length > 0) {
            let object = objects.shift();

            let components = this.pp_getComponentsSelf();
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

    //To String

    WL.Object.prototype.pp_toString = function pp_toString() {
        return this.pp_toStringCompact();
    }

    WL.Object.prototype.pp_toStringExtended = function () {
        let tab = "    ";
        let newLine = "\n";
        let startObject = "{";
        let endObject = "}";
        let nameLabel = "name: ";
        let idLabel = "id: ";
        let componentsLabel = "components: ";
        let typeLabel = "type: ";
        let childrenLabel = "children: ";
        let startComponents = "[";
        let endComponents = "]";
        let startChildren = startComponents;
        let endChildren = endComponents;
        let separator = ",";
        let newLineTab = newLine.concat(tab, tab);
        return function pp_toStringExtended() {
            let objectString = "";
            objectString = objectString.concat(startObject, newLine);

            let components = this.pp_getComponentsSelf();
            let children = this.pp_getChildren();
            let name = this.pp_getName();

            if (components.length > 0 || children.length > 0 || name.length > 0) {
                objectString = objectString.concat(tab, idLabel, this.pp_getID(), separator, newLine);
            } else {
                objectString = objectString.concat(tab, idLabel, this.pp_getID(), newLine);
            }

            if (name.length > 0) {
                if (components.length > 0 || children.length > 0) {
                    objectString = objectString.concat(tab, nameLabel, this.pp_getName(), separator, newLine);
                } else {
                    objectString = objectString.concat(tab, nameLabel, this.pp_getName(), newLine);
                }
            }

            if (components.length > 0) {
                objectString = objectString.concat(tab, componentsLabel, newLine, tab, startComponents, newLine);
                for (let i = 0; i < components.length; i++) {
                    let component = components[i];

                    objectString = objectString.concat(tab, tab, startObject, newLine);
                    objectString = objectString.concat(tab, tab, tab, typeLabel, component.type, separator, newLine);
                    objectString = objectString.concat(tab, tab, tab, idLabel, component._id, separator, newLine);
                    objectString = objectString.concat(tab, tab, endObject);

                    if (i != components.length - 1) {
                        objectString = objectString.concat(separator, newLine);
                    } else {
                        objectString = objectString.concat(newLine);
                    }
                }

                if (children.length > 0) {
                    objectString = objectString.concat(tab, endComponents, separator, newLine);
                } else {
                    objectString = objectString.concat(tab, endComponents, newLine);
                }
            }

            if (children.length > 0) {
                objectString = objectString.concat(tab, childrenLabel, newLine, tab, startChildren, newLine);
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];

                    let childString = child.pp_toStringExtended();
                    childString = childString.replaceAll(newLine, newLineTab);
                    childString = tab.concat(tab, childString);
                    objectString = objectString.concat(childString);

                    if (i != children.length - 1) {
                        objectString = objectString.concat(separator, newLine);
                    } else {
                        objectString = objectString.concat(newLine);
                    }
                }
                objectString = objectString.concat(tab, endChildren, newLine);
            }

            objectString = objectString.concat(endObject);

            return objectString;
        };
    }();

    WL.Object.prototype.pp_toStringCompact = function () {
        let tab = "    ";
        let newLine = "\n";
        let emptyName = "<none>";
        let nameLabel = "name: ";
        let componentsLabel = "components: ";
        let separator = ", ";
        let newLineTab = newLine.concat(tab);
        return function pp_toStringCompact() {
            let objectString = "";

            let name = this.pp_getName();
            if (name.length > 0) {
                objectString = objectString.concat(nameLabel, name);
            } else {
                objectString = objectString.concat(nameLabel, emptyName);
            }

            let components = this.pp_getComponentsSelf();
            if (components.length > 0) {
                objectString = objectString.concat(separator, componentsLabel);
                for (let i = 0; i < components.length; i++) {
                    let component = components[i];

                    objectString = objectString.concat(component.type);

                    if (i != components.length - 1) {
                        objectString = objectString.concat(separator);
                    }
                }
            }

            let children = this.pp_getChildren();
            if (children.length > 0) {
                objectString = objectString.concat(newLine);
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];

                    let childString = child.pp_toStringCompact();
                    childString = childString.replaceAll(newLine, newLineTab);
                    childString = tab.concat(childString);
                    objectString = objectString.concat(childString);

                    if (i != children.length - 1) {
                        objectString = objectString.concat(newLine);
                    }
                }
            }

            return objectString;
        };
    }();

    //Get By Name

    WL.Object.prototype.pp_getObjectByName = function pp_getObjectByName(name) {
        return this.pp_getObjectByNameHierarchy(name);
    }

    WL.Object.prototype.pp_getObjectByNameHierarchy = function pp_getObjectByNameHierarchy(name) {
        return this.pp_getObjectByNameHierarchyBreadth(name);
    }

    WL.Object.prototype.pp_getObjectByNameHierarchyBreadth = function pp_getObjectByNameHierarchyBreadth(name) {
        let objects = this.pp_getHierarchyBreadth();
        return WL.Object.pp_getObjectByNameObjects(objects, name);
    }

    WL.Object.prototype.pp_getObjectByNameHierarchyDepth = function pp_getObjectByNameHierarchyDepth(name) {
        let objects = this.pp_getHierarchyDepth();
        return WL.Object.pp_getObjectByNameObjects(objects, name);
    }

    WL.Object.prototype.pp_getObjectByNameDescendants = function pp_getObjectByNameDescendants(name) {
        return this.pp_getObjectByNameDescendantsBreadth(name);
    }

    WL.Object.prototype.pp_getObjectByNameDescendantsBreadth = function pp_getObjectByNameDescendantsBreadth(name) {
        let objects = this.pp_getDescendantsBreadth();
        return WL.Object.pp_getObjectByNameObjects(objects, name);
    }

    WL.Object.prototype.pp_getObjectByNameDescendantsDepth = function pp_getObjectByNameDescendantsDepth(name) {
        let objects = this.pp_getDescendantsDepth();
        return WL.Object.pp_getObjectByNameObjects(objects, name);
    }

    WL.Object.prototype.pp_getObjectByNameChildren = function pp_getObjectByNameChildren(name) {
        let objects = this.pp_getChildren();
        return WL.Object.pp_getObjectByNameObjects(objects, name);
    }

    WL.Object.prototype.pp_getObjectsByName = function pp_getObjectsByName(name) {
        return this.pp_getObjectsByNameHierarchy(name);
    }

    WL.Object.prototype.pp_getObjectsByNameHierarchy = function pp_getObjectsByNameHierarchy(name) {
        return this.pp_getObjectsByNameHierarchyBreadth(name);
    }

    WL.Object.prototype.pp_getObjectsByNameHierarchyBreadth = function pp_getObjectsByNameHierarchyBreadth(name) {
        let objects = this.pp_getHierarchyBreadth();
        return WL.Object.pp_getObjectsByNameObjects(objects, name);
    }

    WL.Object.prototype.pp_getObjectsByNameHierarchyDepth = function pp_getObjectsByNameHierarchyDepth(name) {
        let objects = this.pp_getHierarchyDepth();
        return WL.Object.pp_getObjectsByNameObjects(objects, name);
    }

    WL.Object.prototype.pp_getObjectsByNameDescendants = function pp_getObjectsByNameDescendants(name) {
        return this.pp_getObjectsByNameDescendantsBreadth(name);
    }

    WL.Object.prototype.pp_getObjectsByNameDescendantsBreadth = function pp_getObjectsByNameDescendantsBreadth(name) {
        let objects = this.pp_getDescendantsBreadth();
        return WL.Object.pp_getObjectsByNameObjects(objects, name);
    }

    WL.Object.prototype.pp_getObjectsByNameDescendantsDepth = function pp_getObjectsByNameDescendantsDepth(name) {
        let objects = this.pp_getDescendantsDepth();
        return WL.Object.pp_getObjectsByNameObjects(objects, name);
    }

    WL.Object.prototype.pp_getObjectsByNameChildren = function pp_getObjectsByNameChildren(name) {
        let objects = this.pp_getChildren();
        return WL.Object.pp_getObjectsByNameObjects(objects, name);
    }

    //Get Hierarchy

    WL.Object.prototype.pp_getHierarchy = function pp_getHierarchy() {
        return this.pp_getHierarchyBreadth();
    };

    WL.Object.prototype.pp_getHierarchyBreadth = function pp_getHierarchyBreadth() {
        let hierarchy = this.pp_getDescendantsBreadth();

        hierarchy.unshift(this);

        return hierarchy;
    };

    WL.Object.prototype.pp_getHierarchyDepth = function pp_getHierarchyDepth() {
        let hierarchy = this.pp_getDescendantsDepth();

        hierarchy.unshift(this);

        return hierarchy;
    };

    WL.Object.prototype.pp_getDescendants = function pp_getDescendants() {
        return this.pp_getDescendantsBreadth();
    };

    WL.Object.prototype.pp_getDescendantsBreadth = function pp_getDescendantsBreadth() {
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

    WL.Object.prototype.pp_getDescendantsDepth = function pp_getDescendantsDepth() {
        let descendants = [];

        let children = this.pp_getChildren();

        for (let child of children) {
            descendants.push(child);

            let childDescendants = child.pp_getDescendantsDepth();
            if (childDescendants.length > 0) {
                descendants.push(...childDescendants);
            }
        }

        return descendants;
    };

    WL.Object.prototype.pp_getChildren = function pp_getChildren() {
        return this.children;
    };

    WL.Object.prototype.pp_getSelf = function pp_getSelf() {
        return this;
    };

    //Cauldron

    WL.Object.prototype.pp_addObject = function pp_addObject() {
        return WL.scene.addObject(this);
    };

    WL.Object.prototype.pp_getName = function pp_getName() {
        return this.name;
    };

    WL.Object.prototype.pp_setName = function pp_setName(name) {
        this.name = name;
    };

    WL.Object.prototype.pp_getID = function pp_getID() {
        return this.objectId;
    };

    WL.Object.prototype.pp_markDirty = function pp_markDirty() {
        return this.setDirty();
    };

    WL.Object.prototype.pp_equals = function pp_equals(otherObject) {
        return this.equals(otherObject);
    };

    WL.Object.prototype.pp_destroy = function pp_destroy() {
        return this.destroy();
    };

    WL.Object.prototype.pp_reserveObjects = function pp_reserveObjects(count) {
        this.pp_reserveObjectsHierarchy(count);
    };

    WL.Object.prototype.pp_reserveObjectsSelf = function pp_reserveObjectsSelf(count) {
        let componentsAmountMap = this.pp_getComponentsAmountMapSelf();
        this._pp_reserveObjects(count, componentsAmountMap);
    };

    WL.Object.prototype.pp_reserveObjectsHierarchy = function pp_reserveObjectsHierarchy(count) {
        let componentsAmountMap = this.pp_getComponentsAmountMapHierarchy();
        this._pp_reserveObjects(count, componentsAmountMap);
    };

    WL.Object.prototype.pp_reserveObjectsDescendants = function pp_reserveObjectsDescendants(count) {
        let componentsAmountMap = this.pp_getComponentsAmountMapDescendants();
        this._pp_reserveObjects(count, componentsAmountMap);
    };

    WL.Object.prototype.pp_reserveObjectsChildren = function pp_reserveObjectsChildren(count) {
        let componentsAmountMap = this.pp_getComponentsAmountMapChildren();
        this._pp_reserveObjects(count, componentsAmountMap);
    };

    WL.Object.prototype.pp_getComponentsAmountMap = function pp_getComponentsAmountMap(amountMap = new Map()) {
        return this.pp_getComponentsAmountMapHierarchy(amountMap);
    };

    WL.Object.prototype.pp_getComponentsAmountMapSelf = function pp_getComponentsAmountMapSelf(amountMap = new Map()) {
        let objectsAmount = amountMap.get("object");
        if (objectsAmount == null) {
            objectsAmount = 0;
        }
        objectsAmount += 1;
        amountMap.set("object", objectsAmount);

        let components = this.pp_getComponentsSelf();
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

    WL.Object.prototype.pp_getComponentsAmountMapHierarchy = function pp_getComponentsAmountMapHierarchy(amountMap = new Map()) {
        let hierarchy = this.pp_getHierarchy();

        for (let object of hierarchy) {
            object.pp_getComponentsAmountMapSelf(amountMap);
        }

        return amountMap;
    };

    WL.Object.prototype.pp_getComponentsAmountMapDescendants = function pp_getComponentsAmountMapDescendants(amountMap = new Map()) {
        let descendants = this.pp_getDescendants();

        for (let object of descendants) {
            object.pp_getComponentsAmountMapSelf(amountMap);
        }

        return amountMap;
    };

    WL.Object.prototype.pp_getComponentsAmountMapChildren = function pp_getComponentsAmountMapChildren(amountMap = new Map()) {
        let children = this.pp_getChildren();

        for (let object of children) {
            object.pp_getComponentsAmountMapSelf(amountMap);
        }

        return amountMap;
    };

    //Static

    WL.Object.pp_getComponentObjects = function pp_getComponentObjects(objects, type, index = 0) {
        let component = null;

        for (let object of objects) {
            component = object.getComponent(type, index);
            if (component != null) {
                break;
            }
        }

        return component;
    };

    WL.Object.pp_getComponentsObjects = function pp_getComponentsObjects(objects, type) {
        let components = [];

        for (let object of objects) {
            components.push(...object.getComponents(type));
        }

        return components;
    };

    WL.Object.pp_setActiveObjects = function pp_setActiveObjects(objects, active) {
        for (let object of objects) {
            object.active = active;
        }
    };

    WL.Object.pp_getObjectByNameObjects = function pp_getObjectByNameObjects(objects, name) {
        let objectFound = null;

        for (let object of objects) {
            if (object.pp_getName() == name) {
                objectFound = object;
                break;
            }
        }

        return objectFound;
    }

    WL.Object.pp_getObjectsByNameObjects = function pp_getObjectsByNameObjects(objects, name) {
        let objectsFound = [];

        for (let object of objects) {
            if (object.pp_getName() == name) {
                objectsFound.push(object);
            }
        }

        return objectsFound;
    }

    //Private Utils

    WL.Object.prototype._pp_epsilon = 0.000001;

    WL.Object.prototype._pp_quaternionToRadians = function () {
        let mat3 = PP.mat3_create();
        return function _pp_quaternionToRadians(quatRotation, radiansRotation = PP.vec3_create()) {
            quatRotation.quat_toMatrix(mat3);

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

    WL.Object.prototype._pp_degreesToQuaternion = function _pp_degreesToQuaternion(degreesRotation, quatRotation = PP.quat_create()) {
        quatRotation.quat_fromDegrees(degreesRotation);
        return quatRotation;
    };

    WL.Object.prototype._pp_toDegrees = function _pp_toDegrees(angle) {
        return angle * (180 / Math.PI);
    };

    WL.Object.prototype._pp_clamp = function _pp_clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    };

    WL.Object.prototype._pp_reserveObjects = function _pp_reserveObjects(count, componentsAmountMap) {
        let objectsToReserve = componentsAmountMap.get("object") * count;
        componentsAmountMap.delete("object");

        let componentsToReserve = {};
        for (let [componentName, componentCount] of componentsAmountMap.entries()) {
            componentsToReserve[componentName] = componentCount * count;
        }

        WL.scene.reserveObjects(objectsToReserve, componentsToReserve);
    };

    WL.Object.prototype._pp_setAxes = function () {
        let fixedAxes = [PP.vec3_create(), PP.vec3_create(), PP.vec3_create()];

        let fixedAxesFixSignMap = [
            [1, -1, 1],
            [1, 1, -1],
            [-1, 1, -1]
        ];

        let fixedLeft = PP.vec3_create();
        let fixedUp = PP.vec3_create();
        let fixedForward = PP.vec3_create();

        let currentAxis = PP.vec3_create();

        let rotationAxis = PP.vec3_create();
        let rotationMat = PP.mat3_create();
        let rotationQuat = PP.quat_create();
        return function _pp_setAxes(axes, priority, isLocal) {
            let firstAxis = axes[priority[0]];
            let secondAxis = axes[priority[1]];
            let thirdAxis = axes[priority[2]];

            if (firstAxis == null || firstAxis.vec3_length() <= this._pp_epsilon) {
                return;
            }

            let secondAxisValid = false;
            if (secondAxis != null) {
                let angleBetween = firstAxis.vec3_angleRadians(secondAxis);
                if (angleBetween > this._pp_epsilon) {
                    secondAxisValid = true;
                }
            }

            let thirdAxisValid = false;
            if (thirdAxis != null) {
                let angleBetween = firstAxis.vec3_angleRadians(thirdAxis);
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

                firstAxis.vec3_cross(crossAxis, fixedAxes[thirdAxisIndex]);
                fixedAxes[thirdAxisIndex].vec3_scale(fixSignMap[priority[thirdAxisIndex]], fixedAxes[thirdAxisIndex]);

                firstAxis.vec3_cross(fixedAxes[thirdAxisIndex], fixedAxes[secondAxisIndex]);
                fixedAxes[secondAxisIndex].vec3_scale(fixSignMap[priority[secondAxisIndex]], fixedAxes[secondAxisIndex]);

                fixedAxes[1].vec3_cross(fixedAxes[2], fixedAxes[0]);
                fixedAxes[0].vec3_scale(fixSignMap[priority[0]], fixedAxes[0]);

                fixedAxes[priority.pp_findIndexEqual(0)].vec3_normalize(fixedLeft);
                fixedAxes[priority.pp_findIndexEqual(1)].vec3_normalize(fixedUp);
                fixedAxes[priority.pp_findIndexEqual(2)].vec3_normalize(fixedForward);

                rotationMat.mat3_set(
                    fixedLeft[0], fixedLeft[1], fixedLeft[2],
                    fixedUp[0], fixedUp[1], fixedUp[2],
                    fixedForward[0], fixedForward[1], fixedForward[2]
                );

                rotationMat.mat3_toQuat(rotationQuat);
                rotationQuat.quat_normalize(rotationQuat);

                if (isLocal) {
                    this.pp_setRotationLocalQuat(rotationQuat);
                } else {
                    this.pp_setRotationWorldQuat(rotationQuat);
                }
            } else {
                if (priority[0] == 0) {
                    if (isLocal) {
                        this.pp_getLeftLocal(currentAxis);
                    } else {
                        this.pp_getLeftWorld(currentAxis);
                    }
                } else if (priority[0] == 1) {
                    if (isLocal) {
                        this.pp_getUpLocal(currentAxis);
                    } else {
                        this.pp_getUpWorld(currentAxis);
                    }
                } else {
                    if (isLocal) {
                        this.pp_getForwardLocal(currentAxis);
                    } else {
                        this.pp_getForwardWorld(currentAxis);
                    }
                }

                let angleBetween = firstAxis.vec3_angleRadians(currentAxis);
                if (angleBetween != 0) {
                    currentAxis.vec3_cross(firstAxis, rotationAxis);
                    rotationAxis.vec3_normalize(rotationAxis);
                    rotationQuat.quat_fromAxisRadians(angleBetween, rotationAxis);

                    if (isLocal) {
                        this.pp_rotateLocalQuat(rotationQuat);
                    } else {
                        this.pp_rotateWorldQuat(rotationQuat);
                    }
                }
            }
        };
    }();



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
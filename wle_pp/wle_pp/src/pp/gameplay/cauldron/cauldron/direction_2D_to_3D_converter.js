import { quat_create, vec3_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";

export class Direction2DTo3DConverterParams {

    constructor() {
        this.myStartFlyingForward = false;
        this.myStartFlyingRight = false;

        this.myAutoUpdateFlyForward = false;
        this.myAutoUpdateFlyRight = false;

        this.myResetFlyForwardWhenZero = false;
        this.myResetFlyRightWhenZero = false;

        this.myMinAngleToFlyForwardUp = 90;
        this.myMinAngleToFlyForwardDown = 90;
        this.myMinAngleToFlyRightUp = 90;
        this.myMinAngleToFlyRightDown = 90;

        // Settings when flying is not active, used to adjust the directions and flat them
        this.myAdjustForwardWhenCloseToUp = true;
        this.myAdjustRightWhenCloseToUp = true;
        this.myAdjustForwardWhenCloseToUpAngleThreshold = 10;
        this.myAdjustRightWhenCloseToUpAngleThreshold = 10;

        this.myInvertForwardWhenUpsideDown = false;
        this.myInvertRightWhenUpsideDown = false;

        this.myAdjustLastValidFlatForwardOverConversionReferenceRotation = true;
        this.myAdjustLastValidFlatRightOverConversionReferenceRotation = true;
    }
}

export class Direction2DTo3DConverter {

    constructor(params = new Direction2DTo3DConverterParams()) {
        this._myParams = params;

        this._myFlyingForward = this._myParams.myStartFlyingForward;
        this._myFlyingRight = this._myParams.myStartFlyingRight;

        this._myLastConvertRotationQuat = quat_create();
        this._myLastConvertRotationQuatValid = false;

        this._myLastValidFlatForward = vec3_create();
        this._myLastValidFlatRight = vec3_create();
    }

    // @direction3DUp can be used to flat the direction if the @conversionTransform is not aligned with it
    // It's also needed to specify the fly axis, if different from the @conversionTransform up
    // If @direction3DUp is null, @conversionTransform up is used
    convert(direction2D, conversionTransform, direction3DUp = null, outDirection3D = vec3_create()) {
        return this.convertTransform(direction2D, conversionTransform, direction3DUp, outDirection3D);
    }

    isFlying() {
        return this._myFlyingForward || this._myFlyingRight;
    }

    isFlyingForward() {
        return this._myFlyingForward;
    }

    isFlyingRight() {
        return this._myFlyingRight;
    }

    startFlying() {
        this._myFlyingForward = true;
        this._myFlyingRight = true;
    }

    startFlyingForward() {
        this._myFlyingForward = true;
    }

    startFlyingRight() {
        this._myFlyingRight = true;
    }

    stopFlying() {
        this._myFlyingForward = false;
        this._myFlyingRight = false;
    }

    stopFlyingForward() {
        this._myFlyingForward = false;
    }

    stopFlyingRight() {
        this._myFlyingRight = false;
    }

    resetFly() {
        this.resetFlyForward();
        this.resetFlyRight();
    }

    resetFlyForward() {
        if (this._myParams.myStartFlyingForward) {
            this.startFlyingForward();
        } else {
            this.stopFlyingForward();
        }
    }

    resetFlyRight() {
        if (this._myParams.myStartFlyingRight) {
            this.startFlyingRight();
        } else {
            this.stopFlyingRight();
        }
    }

    resetLastValidFlatDirections() {
        this._myLastValidFlatForward.vec3_zero();
        this._myLastValidFlatRight.vec3_zero();
    }

    resetLastValidFlatForward() {
        this._myLastValidFlatForward.vec3_zero();
    }

    resetLastValidFlatRight() {
        this._myLastValidFlatRight.vec3_zero();
    }

    resetLastConvertTransform() {
        this._myLastConvertRotationQuatValid = false;
        this._myLastConvertRotationQuat.quat_identity();
    }

    // Convert Alternatives

    // If @direction3DUp is null, vec3_create(0, 1, 0) is used
    // Does not work properly if @conversionForward is aligned with @direction3DUp
    convertForward(direction2D, conversionForward, direction3DUp = null, outDirection3D = vec3_create()) {
        // Implemented outside class definition
    }

    // @direction3DUp can be used to flat the direction if the @conversionTransform is not aligned with it
    // It's also needed to specify the fly axis, if different from the @conversionTransform up
    // If @direction3DUp is null, conversionTransform up is used
    convertTransform(direction2D, conversionTransform, direction3DUp = null, outDirection3D = vec3_create()) {
        return this.convertTransformMatrix(direction2D, conversionTransform, direction3DUp, outDirection3D);
    }

    convertTransformMatrix(direction2D, conversionTransformMatrix, direction3DUp = null, outDirection3D = vec3_create()) {
        // Implemented outside class definition
    }

    convertTransformQuat(direction2D, conversionTransformQuat, direction3DUp = null, outDirection3D = vec3_create()) {
        // Implemented outside class definition
    }

    convertRotationQuat(direction2D, conversionRotationQuat, direction3DUp = null, outDirection3D = vec3_create()) {
        // Implemented outside class definition
    }
}

Direction2DTo3DConverter.prototype.convertForward = function () {
    let rotationQuat = quat_create();
    return function convertForward(direction2D, conversionForward, direction3DUp = null, outDirection3D = vec3_create()) {
        rotationQuat.quat_identity();
        rotationQuat.quat_setForward(conversionForward, direction3DUp);
        return this.convertRotationQuat(direction2D, rotationQuat, direction3DUp, outDirection3D);
    };
}();

Direction2DTo3DConverter.prototype.convertTransformMatrix = function () {
    let rotationQuat = quat_create();
    return function convertTransformMatrix(direction2D, conversionTransformMatrix, direction3DUp = null, outDirection3D = vec3_create()) {
        rotationQuat = conversionTransformMatrix.mat4_getRotationQuat(rotationQuat);
        return this.convertRotationQuat(direction2D, rotationQuat, direction3DUp, outDirection3D);
    };
}();

Direction2DTo3DConverter.prototype.convertTransformQuat = function () {
    let rotationQuat = quat_create();
    return function convertTransformQuat(direction2D, conversionTransformQuat, direction3DUp = null, outDirection3D = vec3_create()) {
        rotationQuat = conversionTransformQuat.quat2_getRotationQuat(rotationQuat);
        return this.convertRotationQuat(direction2D, rotationQuat, direction3DUp, outDirection3D);
    };
}();

Direction2DTo3DConverter.prototype.convertRotationQuat = function () {
    let forward = vec3_create();
    let right = vec3_create();
    let up = vec3_create();
    let direction3DUpNegate = vec3_create();
    let forwardScaled = vec3_create();
    let rightScaled = vec3_create();
    let rotationToNewConvertPivoted = quat_create();
    return function convertRotationQuat(direction2D, conversionRotationQuat, direction3DUp = null, outDirection3D = vec3_create()) {
        outDirection3D.vec3_zero();

        if (this._myParams.myAdjustLastValidFlatForwardOverConversionReferenceRotation || this._myParams.myAdjustLastValidFlatRightOverConversionReferenceRotation) {
            if (direction3DUp != null) {
                if (this._myLastConvertRotationQuatValid) {
                    rotationToNewConvertPivoted = this._myLastConvertRotationQuat.quat_rotationToQuat(conversionRotationQuat, rotationToNewConvertPivoted).
                        quat_rotationAroundAxisQuat(direction3DUp, rotationToNewConvertPivoted);
                    if (Math.pp_angleClamp(rotationToNewConvertPivoted.quat_getAngle(), true) > Math.PP_EPSILON_DEGREES) {
                        if (this._myParams.myAdjustLastValidFlatForwardOverConversionReferenceRotation) {
                            this._myLastValidFlatForward.vec3_rotateQuat(rotationToNewConvertPivoted, this._myLastValidFlatForward);
                        }

                        if (this._myParams.myAdjustLastValidFlatRightOverConversionReferenceRotation) {
                            this._myLastValidFlatRight.vec3_rotateQuat(rotationToNewConvertPivoted, this._myLastValidFlatRight);
                        }
                    }
                }
            }
        }

        if (direction2D.vec2_isZero()) {
            let resetFlyForward = this._myParams.myAutoUpdateFlyForward && this._myParams.myResetFlyForwardWhenZero;
            if (resetFlyForward) {
                this.resetFlyForward();
            }

            let resetFlyRight = this._myParams.myAutoUpdateFlyRight && this._myParams.myResetFlyRightWhenZero;
            if (resetFlyRight) {
                this.resetFlyRight();
            }
        } else {

            forward = conversionRotationQuat.quat_getForward(forward);
            right = conversionRotationQuat.quat_getRight(right);
            up = conversionRotationQuat.quat_getUp(up);

            if (direction3DUp != null) {
                let upsideDown = !direction3DUp.vec3_isConcordant(up);

                direction3DUpNegate = direction3DUp.vec3_negate(direction3DUpNegate);

                // Check if it is flying based on the convert transform orientation 
                if (this._myParams.myAutoUpdateFlyForward) {
                    let angleForwardWithDirectionUp = forward.vec3_angle(direction3DUp);
                    this._myFlyingForward = this._myFlyingForward ||
                        (angleForwardWithDirectionUp < 90 - this._myParams.myMinAngleToFlyForwardUp || angleForwardWithDirectionUp > 90 + this._myParams.myMinAngleToFlyForwardDown);
                }

                if (this._myParams.myAutoUpdateFlyRight) {
                    let angleRightWithDirectionUp = right.vec3_angle(direction3DUp);
                    this._myFlyingRight = this._myFlyingRight ||
                        (angleRightWithDirectionUp < 90 - this._myParams.myMinAngleToFlyRightUp || angleRightWithDirectionUp > 90 + this._myParams.myMinAngleToFlyRightDown);
                }

                // Remove the component to prevent flying, if needed
                if (!this._myFlyingForward) {
                    // If the forward is too similar to the up (or down) take the last valid forward
                    if (this._myParams.myAdjustForwardWhenCloseToUp && !this._myLastValidFlatForward.vec3_isZero(Math.PP_EPSILON) &&
                        (forward.vec3_angle(direction3DUp) < this._myParams.myAdjustForwardWhenCloseToUpAngleThreshold ||
                            forward.vec3_angle(direction3DUpNegate) < this._myParams.myAdjustForwardWhenCloseToUpAngleThreshold)) {
                        forward.pp_copy(this._myLastValidFlatForward);
                    } else if (upsideDown && this._myParams.myInvertForwardWhenUpsideDown) {
                        forward.vec3_negate(forward);
                    }

                    forward = forward.vec3_removeComponentAlongAxis(direction3DUp, forward);
                    forward.vec3_normalize(forward);


                    if (forward.vec3_isZero(Math.PP_EPSILON)) {
                        if (!this._myLastValidFlatForward.vec3_isZero(Math.PP_EPSILON)) {
                            forward.pp_copy(this._myLastValidFlatForward);
                        } else {
                            forward.vec3_set(0, 0, 1);
                        }
                    }
                }

                if (!this._myFlyingRight) {
                    // If the right is too similar to the up (or down) take the last valid right
                    if (this._myParams.myAdjustRightWhenCloseToUp && !this._myLastValidFlatRight.vec3_isZero(Math.PP_EPSILON) &&
                        (right.vec3_angle(direction3DUp) < this._myParams.myAdjustRightWhenCloseToUpAngleThreshold ||
                            right.vec3_angle(direction3DUpNegate) < this._myParams.myAdjustRightWhenCloseToUpAngleThreshold)) {
                        right.pp_copy(this._myLastValidFlatRight);
                    } else if (upsideDown && this._myParams.myInvertRightWhenUpsideDown) {
                        right.vec3_negate(right);
                    }

                    right = right.vec3_removeComponentAlongAxis(direction3DUp, right);
                    right.vec3_normalize(right);

                    if (right.vec3_isZero(Math.PP_EPSILON)) {
                        if (!this._myLastValidFlatRight.vec3_isZero(Math.PP_EPSILON)) {
                            right.pp_copy(this._myLastValidFlatRight);
                        } else {
                            right.vec3_set(-1, 0, 0);
                        }
                    }
                }

                // Update last valid
                if ((forward.vec3_angle(direction3DUp) >= this._myParams.myAdjustForwardWhenCloseToUpAngleThreshold && forward.vec3_angle(direction3DUpNegate) >= this._myParams.myAdjustForwardWhenCloseToUpAngleThreshold) ||
                    (direction2D[1] != 0 && this._myLastValidFlatForward.vec3_isZero(Math.PP_EPSILON))) {
                    this._myLastValidFlatForward = forward.vec3_removeComponentAlongAxis(direction3DUp, this._myLastValidFlatForward);
                    this._myLastValidFlatForward.vec3_normalize(this._myLastValidFlatForward);
                }

                if ((right.vec3_angle(direction3DUp) >= this._myParams.myAdjustRightWhenCloseToUpAngleThreshold && right.vec3_angle(direction3DUpNegate) >= this._myParams.myAdjustRightWhenCloseToUpAngleThreshold) ||
                    (direction2D[0] != 0 && this._myLastValidFlatRight.vec3_isZero(Math.PP_EPSILON))) {
                    this._myLastValidFlatRight = right.vec3_removeComponentAlongAxis(direction3DUp, this._myLastValidFlatRight);
                    this._myLastValidFlatRight.vec3_normalize(this._myLastValidFlatRight);
                }
            }

            // Compute direction 3D
            outDirection3D = right.vec3_scale(direction2D[0], rightScaled).vec3_add(forward.vec3_scale(direction2D[1], forwardScaled), outDirection3D);

            if (direction3DUp != null && !this._myFlyingForward && !this._myFlyingRight) {
                outDirection3D = outDirection3D.vec3_removeComponentAlongAxis(direction3DUp, outDirection3D);
            }

            outDirection3D.vec3_normalize(outDirection3D);
        }

        this._myLastConvertRotationQuat.quat_copy(conversionRotationQuat);
        this._myLastConvertRotationQuatValid = true;

        return outDirection3D;
    };
}();
PP.Direction2DTo3DConverterParams = class Direction2DTo3DConverterParams {
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
    }
};

PP.Direction2DTo3DConverter = class Direction2DTo3DConverter {

    constructor(params = new PP.Direction2DTo3DConverterParams()) {
        this._myParams = params;

        this._myIsFlyingForward = this._myParams.myStartFlyingForward;
        this._myIsFlyingRight = this._myParams.myStartFlyingRight;

        this._myLastValidFlatForward = PP.vec3_create();
        this._myLastValidFlatRight = PP.vec3_create();

        //Setup
        this._myMinAngleToBeValid = 5;
    }

    // directionUp is needed when u want to understand when the direction is going to fly or not
    // if you don't want the direction to be flat (so like it's always flying) you can avoid specifying it
    convert(direction2D, referenceTransformQuat, directionUp = null, outDirection3D = PP.vec3_create()) {
        // implemented outside class definition
    }

    isFlying() {
        return this._myIsFlyingForward || this._myIsFlyingRight;
    }

    isFlyingForward() {
        return this._myIsFlyingForward;
    }

    isFlyingRight() {
        return this._myIsFlyingRight;
    }

    startFlying() {
        this._myIsFlyingForward = true;
        this._myIsFlyingRight = true;
    }

    startFlyingForward() {
        this._myIsFlyingForward = true;
    }

    startFlyingRight() {
        this._myIsFlyingRight = true;
    }

    stopFlying() {
        this._myIsFlyingForward = false;
        this._myIsFlyingRight = false;
    }

    stopFlyingForward() {
        this._myIsFlyingForward = false;
    }

    stopFlyingRight() {
        this._myIsFlyingRight = false;
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

        this._myLastValidFlatForward.vec3_zero();
    }

    resetFlyRight() {
        if (this._myParams.myStartFlyingRight) {
            this.startFlyingRight();
        } else {
            this.stopFlyingRight();
        }

        this._myLastValidFlatRight.vec3_zero();
    }
};

PP.Direction2DTo3DConverter.prototype.convert = function () {
    let forward = PP.vec3_create();
    let right = PP.vec3_create();
    let directionUpNegate = PP.vec3_create();
    let forwardScaled = PP.vec3_create();
    let rightScaled = PP.vec3_create();
    return function convert(direction2D, referenceTransformQuat, directionUp = null, outDirection3D = PP.vec3_create()) {
        if (direction2D.vec2_isZero()) {
            let resetFlyForward = this._myParams.myAutoUpdateFlyForward && this._myParams.myResetFlyForwardWhenZero;
            if (resetFlyForward) {
                this.resetFlyForward();
            }

            let resetFlyRight = this._myParams.myAutoUpdateFlyRight && this._myParams.myResetFlyRightWhenZero;
            if (resetFlyRight) {
                this.resetFlyRight();
            }

            return [0, 0, 0];
        } else {
            if (direction2D[0] == 0) {
                this._myLastValidFlatRight.vec3_zero();
            }

            if (direction2D[1] == 0) {
                this._myLastValidFlatForward.vec3_zero();
            }
        }

        forward = referenceTransformQuat.quat2_getForward(forward);
        right = referenceTransformQuat.quat2_getRight(right);

        if (directionUp != null) {
            directionUpNegate = directionUp.vec3_negate(directionUpNegate);

            // check if it is flying based on the convert transform orientation 
            if (this._myParams.myAutoUpdateFlyForward) {
                let angleForwardWithDirectionUp = forward.vec3_angle(directionUp);
                this._myIsFlyingForward = this._myIsFlyingForward ||
                    (angleForwardWithDirectionUp < 90 - this._myParams.myMinAngleToFlyForwardUp || angleForwardWithDirectionUp > 90 + this._myParams.myMinAngleToFlyForwardDown);
            }

            if (this._myParams.myAutoUpdateFlyRight) {
                let angleRightWithDirectionUp = right.vec3_angle(directionUp);
                this._myIsFlyingRight = this._myIsFlyingRight ||
                    (angleRightWithDirectionUp < 90 - this._myParams.myMinAngleToFlyRightUp || angleRightWithDirectionUp > 90 + this._myParams.myMinAngleToFlyRightDown);
            }

            // remove the component to prevent flying, if needed
            if (!this._myIsFlyingForward) {
                // if the forward is too similar to the up (or down) take the last valid forward
                if (!this._myLastValidFlatForward.vec3_isZero(0.000001) && (forward.vec3_angle(directionUp) < this._myMinAngleToBeValid || forward.vec3_angle(directionUpNegate) < this._myMinAngleToBeValid)) {
                    if (forward.vec3_isConcordant(this._myLastValidFlatForward)) {
                        forward.pp_copy(this._myLastValidFlatForward);
                    } else {
                        forward = this._myLastValidFlatForward.vec3_negate(forward);
                    }
                }

                forward = forward.vec3_removeComponentAlongAxis(directionUp, forward);
                forward.vec3_normalize(forward);
            }

            if (!this._myIsFlyingRight) {
                // if the right is too similar to the up (or down) take the last valid right
                if (!this._myLastValidFlatRight.vec3_isZero(0.000001) && (right.vec3_angle(directionUp) < this._myMinAngleToBeValid || right.vec3_angle(directionUpNegate) < this._myMinAngleToBeValid)) {
                    if (right.vec3_isConcordant(this._myLastValidFlatRight)) {
                        right.pp_copy(this._myLastValidFlatRight);
                    } else {
                        right = this._myLastValidFlatRight.vec3_negate(right);
                    }
                }

                right = right.vec3_removeComponentAlongAxis(directionUp, right);
                right.vec3_normalize(right);
            }

            // update last valid
            if ((forward.vec3_angle(directionUp) > this._myMinAngleToBeValid && forward.vec3_angle(directionUpNegate) > this._myMinAngleToBeValid) ||
                (direction2D[1] != 0 && this._myLastValidFlatForward.vec3_isZero(0.000001))) {
                this._myLastValidFlatForward = forward.vec3_removeComponentAlongAxis(directionUp, this._myLastValidFlatForward);
                this._myLastValidFlatForward.vec3_normalize(this._myLastValidFlatForward);
            }

            if ((right.vec3_angle(directionUp) > this._myMinAngleToBeValid && right.vec3_angle(directionUpNegate) > this._myMinAngleToBeValid) ||
                (direction2D[0] != 0 && this._myLastValidFlatRight.vec3_isZero(0.000001))) {
                this._myLastValidFlatRight = right.vec3_removeComponentAlongAxis(directionUp, this._myLastValidFlatRight);
                this._myLastValidFlatRight.vec3_normalize(this._myLastValidFlatRight);
            }
        }

        // compute direction 3D
        outDirection3D = right.vec3_scale(direction2D[0], rightScaled).vec3_add(forward.vec3_scale(direction2D[1], forwardScaled), outDirection3D);

        if (directionUp != null && !this._myIsFlyingForward && !this._myIsFlyingRight) {
            outDirection3D = outDirection3D.vec3_removeComponentAlongAxis(directionUp, outDirection3D);
        }

        outDirection3D.vec3_normalize(outDirection3D);

        return outDirection3D;
    };
}();
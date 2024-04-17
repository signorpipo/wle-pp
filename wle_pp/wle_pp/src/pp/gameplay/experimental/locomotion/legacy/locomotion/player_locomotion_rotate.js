import { XRUtils } from "../../../../../cauldron/utils/xr_utils.js";
import { Handedness } from "../../../../../input/cauldron/input_types.js";
import { GamepadAxesID } from "../../../../../input/gamepad/gamepad_buttons.js";
import { quat_create, vec3_create } from "../../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../../pp/globals.js";

export class PlayerLocomotionRotateParams {

    constructor(engine = Globals.getMainEngine()) {
        this.myPlayerHeadManager = null;

        this.myHorizontalRotationEnabled = true;
        this.myVerticalRotationEnabled = true;

        this.myMaxRotationSpeed = 0;
        this.myIsSnapTurn = false;
        this.mySnapTurnOnlyVR = false;

        this.mySmoothSnapEnabled = true;
        this.mySmoothSnapSpeedDegrees = 240;

        this.myRotationMinStickIntensityThreshold = 0;
        this.mySnapTurnActivateThreshold = 0;
        this.mySnapTurnResetThreshold = 0;

        this.myClampVerticalAngle = true;
        this.myMaxVerticalAngle = 89;

        this.myHandedness = Handedness.RIGHT;

        this.myEngine = engine;
    }
}

export class PlayerLocomotionRotate {

    constructor(params) {
        this._myParams = params;

        this._mySnapCharge = false;

        this._mySmoothSnapHorizontalRunning = false;
        this._mySmoothSnapHorizontalAngleToPerform = 0;

        this._mySmoothSnapVerticalRunning = false;
        this._mySmoothSnapVerticalAngleToPerform = 0;

        //Globals.getEasyTuneVariables(this._myParams.myEngine).add(new EasyTuneNumber("Teleport Smooth Speed", this._myParams.mySmoothSnapSpeedDegrees, 10, 3, 0, undefined, undefined, this._myParams.myEngine));
    }

    start() {

    }

    stop() {
        this._mySmoothSnapHorizontalRunning = false;
        this._mySmoothSnapHorizontalAngleToPerform = 0;

        this._mySmoothSnapVerticalRunning = false;
        this._mySmoothSnapVerticalAngleToPerform = 0;
    }

    getParams() {
        return this._myParams;
    }

    update(dt) {
        //this._myParams.mySmoothSnapSpeedDegrees = Globals.getEasyTuneVariables(this._myParams.myEngine).get("Teleport Smooth Speed");

        if (this._myParams.myHorizontalRotationEnabled) {
            this._rotateHeadHorizontally(dt);
        }

        if (this._myParams.myVerticalRotationEnabled && this._myParams.myPlayerHeadManager.canRotateHead()) {
            this._rotateHeadVertically(dt);
        }
    }

    _rotateHeadHorizontally(dt) {
        // Implemented outside class definition
    }

    _rotateHeadVertically(dt) {
        // Implemented outside class definition
    }
}



// IMPLEMENTATION

PlayerLocomotionRotate.prototype._rotateHeadHorizontally = function () {
    let playerUp = vec3_create();
    let headRotation = quat_create();
    return function _rotateHeadHorizontally(dt) {
        playerUp = this._myParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

        headRotation.quat_identity();

        let axes = Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getAxesInfo(GamepadAxesID.THUMBSTICK).getAxes();

        if (!this._myParams.myIsSnapTurn || (this._myParams.mySnapTurnOnlyVR && !XRUtils.isSessionActive(this._myParams.myEngine))) {
            if (Math.abs(axes[0]) > this._myParams.myRotationMinStickIntensityThreshold) {
                let rotationIntensity = -axes[0];
                let speed = Math.pp_lerp(0, this._myParams.myMaxRotationSpeed, Math.abs(rotationIntensity)) * Math.pp_sign(rotationIntensity);

                headRotation.quat_fromAxis(speed * dt, playerUp);
            }
        } else {
            if (!this._mySnapCharge) {
                if (Math.abs(axes.vec2_length()) < this._myParams.mySnapTurnResetThreshold) {
                    this._mySnapCharge = true;
                }
            } else if (!this._mySmoothSnapHorizontalRunning) {
                if (Math.abs(axes[0]) > this._myParams.mySnapTurnActivateThreshold) {
                    let angleToRotate = -Math.pp_sign(axes[0]) * this._myParams.mySnapTurnAngle;

                    if (!this._myParams.mySmoothSnapEnabled) {
                        headRotation.quat_fromAxis(angleToRotate, playerUp);
                    } else {
                        this._mySmoothSnapHorizontalRunning = true;
                        this._mySmoothSnapHorizontalAngleToPerform = angleToRotate;
                    }

                    this._mySnapCharge = false;
                }
            }
        }

        if (this._mySmoothSnapHorizontalRunning) {
            let angleToRotate = Math.pp_sign(this._mySmoothSnapHorizontalAngleToPerform) * (this._myParams.mySmoothSnapSpeedDegrees * dt);
            if (Math.abs(angleToRotate) > Math.abs(this._mySmoothSnapHorizontalAngleToPerform) - Math.PP_EPSILON) {
                angleToRotate = this._mySmoothSnapHorizontalAngleToPerform;
            }

            headRotation.quat_fromAxis(angleToRotate, playerUp);
            this._mySmoothSnapHorizontalAngleToPerform -= angleToRotate;

            if (Math.abs(this._mySmoothSnapHorizontalAngleToPerform) < Math.PP_EPSILON) {
                this._mySmoothSnapHorizontalRunning = false;
                this._mySmoothSnapHorizontalAngleToPerform = 0;
            }
        }

        if (headRotation.quat_getAngle() > Math.PP_EPSILON_DEGREES) {
            this._myParams.myPlayerTransformManager.rotateQuat(headRotation);
        }
    };
}();

PlayerLocomotionRotate.prototype._rotateHeadVertically = function () {
    let headForward = vec3_create();
    let headUp = vec3_create();
    let referenceUp = vec3_create();
    let referenceUpNegate = vec3_create();
    let referenceRight = vec3_create();
    let newUp = vec3_create();
    let headRotation = quat_create();
    return function _rotateHeadVertically(dt) {
        let head = this._myParams.myPlayerHeadManager.getHead();

        headForward = head.pp_getForward(headForward);
        headUp = head.pp_getUp(headUp);

        referenceUp = this._myParams.myPlayerHeadManager.getPlayer().pp_getUp(referenceUp);
        referenceUpNegate = referenceUp.vec3_negate(referenceUpNegate);
        referenceRight = headForward.vec3_cross(referenceUp, referenceRight);

        let minAngle = 1;
        if (headForward.vec3_angle(referenceUp) < minAngle) {
            referenceRight = headUp.vec3_negate(referenceRight).vec3_cross(referenceUp, referenceRight);
        } else if (headForward.vec3_angle(referenceUpNegate) < minAngle) {
            referenceRight = headUp.vec3_cross(referenceUp, referenceRight);
        } else if (!headUp.vec3_isConcordant(referenceUp)) {
            referenceRight.vec3_negate(referenceRight);
        }

        referenceRight.vec3_normalize(referenceRight);

        let axes = Globals.getGamepads(this._myParams.myEngine)[this._myParams.myHandedness].getAxesInfo(GamepadAxesID.THUMBSTICK).getAxes();
        let angleToRotate = 0;

        if (!this._myParams.myIsSnapTurn || (this._myParams.mySnapTurnOnlyVR && !XRUtils.isSessionActive(this._myParams.myEngine))) {
            if (Math.abs(axes[1]) > this._myParams.myRotationMinStickIntensityThreshold) {
                let rotationIntensity = axes[1];
                angleToRotate = Math.pp_lerp(0, this._myParams.myMaxRotationSpeed, Math.abs(rotationIntensity)) * Math.pp_sign(rotationIntensity) * dt;
            }
        } else {
            if (!this._mySnapCharge) {
                if (Math.abs(axes.vec2_length()) < this._myParams.mySnapTurnResetThreshold) {
                    this._mySnapCharge = true;
                }
            } else if (!this._mySmoothSnapVerticalRunning) {
                if (Math.abs(axes[1]) > this._myParams.mySnapTurnActivateThreshold) {
                    angleToRotate = Math.pp_sign(axes[1]) * this._myParams.mySnapTurnAngle;

                    // Adjust rotation to closest snap step

                    let angleWithUp = Math.pp_angleClamp(headUp.vec3_angleSigned(referenceUp, referenceRight));
                    let snapStep = Math.round(angleWithUp / this._myParams.mySnapTurnAngle);

                    let snapAngle = Math.pp_angleClamp(snapStep * this._myParams.mySnapTurnAngle);
                    let angleToAlign = -Math.pp_angleDistanceSigned(angleWithUp, snapAngle);

                    if (Math.abs(angleToAlign) > 1) {
                        if (Math.pp_sign(angleToRotate) == Math.pp_sign(angleToAlign)) {
                            angleToRotate = angleToAlign;
                        } else {
                            angleToRotate = (-Math.pp_sign(angleToAlign) * this._myParams.mySnapTurnAngle) + angleToAlign;
                        }
                    } else if (Math.abs(angleToAlign) > Math.PP_EPSILON_DEGREES) {
                        angleToRotate += angleToAlign;
                    }

                    if (this._myParams.mySmoothSnapEnabled) {
                        this._mySmoothSnapVerticalRunning = true;
                        this._mySmoothSnapVerticalAngleToPerform = angleToRotate;
                    }

                    this._mySnapCharge = false;
                }
            }
        }

        if (this._mySmoothSnapVerticalRunning) {
            angleToRotate = Math.pp_sign(this._mySmoothSnapVerticalAngleToPerform) * (this._myParams.mySmoothSnapSpeedDegrees * dt);
            if (Math.abs(angleToRotate) > Math.abs(this._mySmoothSnapVerticalAngleToPerform) - Math.PP_EPSILON) {
                angleToRotate = this._mySmoothSnapVerticalAngleToPerform;
            }

            this._mySmoothSnapVerticalAngleToPerform -= angleToRotate;

            if (Math.abs(this._mySmoothSnapVerticalAngleToPerform) < Math.PP_EPSILON) {
                this._mySmoothSnapVerticalRunning = false;
                this._mySmoothSnapVerticalAngleToPerform = 0;
            }
        }

        if (angleToRotate != 0) {
            headRotation.quat_fromAxis(angleToRotate, referenceRight);
            this._myParams.myPlayerHeadManager.rotateHeadQuat(headRotation);

            if (this._myParams.myClampVerticalAngle) {
                let maxVerticalAngle = Math.max(0, this._myParams.myMaxVerticalAngle - 0.0001);
                newUp = head.pp_getUp(newUp);
                let angleWithUp = Math.pp_angleClamp(newUp.vec3_angleSigned(referenceUp, referenceRight));
                if (Math.abs(angleWithUp) > maxVerticalAngle) {
                    let fixAngle = (Math.abs(angleWithUp) - maxVerticalAngle) * Math.pp_sign(angleWithUp);
                    headRotation.quat_fromAxis(fixAngle, referenceRight);
                    this._myParams.myPlayerHeadManager.rotateHeadQuat(headRotation);
                }
            }
        }
    };
}();
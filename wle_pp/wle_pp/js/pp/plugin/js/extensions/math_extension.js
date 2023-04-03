/*
    How to use

    By default the rotations are in Degrees

    For rotations u can add a suffix like Degrees/Radians to use a specific version, example:
        - pp_angleDistanceSignedDegrees
        - pp_isInsideAngleRangeRadians
        
    List of constants:
        - PP_EPSILON / PP_EPSILON_SQUARED / PP_EPSILON_DEGREES

    List of functions:
        Notes:
            - The suffixes (like Degrees or Radians) are omitted 

        - pp_clamp
        - pp_sign
        - pp_toDegrees      / pp_toRadians
        - pp_roundDecimal
        - pp_mapToRange
        - pp_random         / pp_randomInt    / pp_randomInt        / pp_randomSign / pp_randomPick
        - pp_lerp           / pp_interpolate  / EasingFunction
        - pp_angleDistance  / pp_angleDistanceSigned
        - pp_angleClamp
        - pp_isInsideAngleRange
*/

import { ExtensionUtils } from "../../utils/extension_utils";

export function initMathExtension() {
    initMathExtensionStatic();
}

export let EasingFunction = {
    linear: t => t,
    easeIn: t => t * t * t,
    easeOut: t => (t - 1) * (t - 1) * (t - 1) + 1,
    easeInOut: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};

export function initMathExtensionStatic() {

    let mathExtension = {};

    mathExtension.PP_EPSILON = 0.000001;
    mathExtension.PP_EPSILON_SQUARED = mathExtension.PP_EPSILON * mathExtension.PP_EPSILON;
    mathExtension.PP_EPSILON_DEGREES = 0.00001;

    mathExtension.pp_clamp = function pp_clamp(value, start, end) {
        let fixedStart = (start != null) ? start : -Number.MAX_VALUE;
        let fixedEnd = (end != null) ? end : Number.MAX_VALUE;

        let min = Math.min(fixedStart, fixedEnd);
        let max = Math.max(fixedStart, fixedEnd);
        return Math.min(Math.max(value, min), max);
    };

    mathExtension.pp_sign = function pp_sign(value, zeroSign = 1) {
        let sign = Math.sign(value);
        if (sign == 0) {
            sign = Math.sign(zeroSign);
        }
        return sign;
    };

    mathExtension.pp_toDegrees = function pp_toDegrees(angle) {
        return angle * (180 / Math.PI);
    };

    mathExtension.pp_toRadians = function pp_toRadians(angle) {
        return angle * (Math.PI / 180);
    };

    mathExtension.pp_roundDecimal = function pp_roundDecimal(number, decimalPlaces) {
        let factor = Math.pow(10, decimalPlaces);
        number = Math.round(number * factor) / factor;

        return number;
    };

    // Start range value doesn't need to be lower than the end one, so you can map from [0,1] to [3,2], where 3 is greater than 2
    mathExtension.pp_mapToRange = function pp_mapToRange(value, originRangeStart, originRangeEnd, newRangeStart, newRangeEnd) {
        if (originRangeStart == originRangeEnd) {
            return newRangeStart;
        }

        let clampedValue = this.pp_clamp(value, originRangeStart, originRangeEnd);

        if (clampedValue == originRangeStart) {
            return newRangeStart;
        } else if (clampedValue == originRangeEnd) {
            return newRangeEnd;
        }

        let newValue = newRangeStart + ((newRangeEnd - newRangeStart) / (originRangeEnd - originRangeStart)) * (clampedValue - originRangeStart);
        let clampedNewValue = this.pp_clamp(newValue, newRangeStart, newRangeEnd);
        return clampedNewValue;
    };

    // Range is [start, end)
    mathExtension.pp_random = function pp_random(start = 0, end = 1) {
        return Math.random() * (end - start) + start;
    };

    // Range is [start, end]
    mathExtension.pp_randomInt = function pp_randomInt(start, end) {
        let min = Math.min(start, end);
        let max = Math.max(start, end);
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    mathExtension.pp_randomBool = function pp_randomBool() {
        return this.pp_randomInt(0, 1) == 0;
    };

    // Return 1 or -1
    mathExtension.pp_randomSign = function pp_randomSign() {
        return (Math.random() < 0.5) ? 1 : -1;
    };

    // You give it a list of parameters and returns one
    mathExtension.pp_randomPick = function pp_randomPick(...args) {
        let random = null;

        if (args.length > 0) {
            if (args.length == 1 && args[0].length != null) {
                if (args[0].length > 0) {
                    let randomIndex = this.pp_randomInt(0, args[0].length - 1);
                    random = args[0][randomIndex];
                }
            } else {
                let randomIndex = this.pp_randomInt(0, args.length - 1);
                random = args[randomIndex];
            }
        }

        return random;
    };

    mathExtension.pp_lerp = function pp_lerp(from, to, interpolationValue) {
        if (interpolationValue <= 0) {
            return from;
        } else if (interpolationValue >= 1) {
            return to;
        }

        return interpolationValue * (to - from) + from;
    };

    mathExtension.pp_interpolate = function pp_interpolate(from, to, interpolationValue, easingFunction = EasingFunction.linear) {
        let lerpValue = easingFunction(interpolationValue);
        return this.pp_lerp(from, to, lerpValue);
    };

    mathExtension.pp_angleDistance = function pp_angleDistance(from, to) {
        return this.pp_angleDistanceDegrees(from, to);
    };

    mathExtension.pp_angleDistanceDegrees = function pp_angleDistanceDegrees(from, to) {
        return Math.abs(this.pp_angleDistanceSignedDegrees(from, to));
    };

    mathExtension.pp_angleDistanceRadians = function pp_angleDistanceRadians(from, to) {
        return Math.abs(this.pp_angleDistanceSignedRadians(from, to));
    };

    mathExtension.pp_angleDistanceSigned = function pp_angleDistanceSigned(from, to) {
        return this.pp_angleDistanceSignedDegrees(from, to);
    };

    mathExtension.pp_angleDistanceSignedDegrees = function pp_angleDistanceSignedDegrees(from, to) {
        let clampedFrom = this.pp_angleClampDegrees(from, true);
        let clampedTo = this.pp_angleClampDegrees(to, true);

        let distance = clampedTo - clampedFrom;
        if (clampedTo - clampedFrom > 180) {
            distance = (clampedTo - clampedFrom) - 360;
        } else if (clampedTo - clampedFrom < -180) {
            distance = (clampedTo - clampedFrom) + 360;
        }

        return distance;
    };

    mathExtension.pp_angleDistanceSignedRadians = function pp_angleDistanceSignedRadians(from, to) {
        return this.pp_toRadians(this.pp_angleDistanceSignedDegrees(this.pp_toDegrees(from), this.pp_toDegrees(to)));
    };

    // Clamp the angle to -180/+180, so that, for example, 270 will be -90
    // If usePositiveRange is true, the angle will be clamped to 0/360
    mathExtension.pp_angleClamp = function pp_angleClamp(angle, usePositiveRange = false) {
        return this.pp_angleClampDegrees(angle, usePositiveRange);
    };

    // Clamp the angle to -180/+180, so that, for example, 270 will be -90
    // If usePositiveRange is true, the angle will be clamped to 0/360
    mathExtension.pp_angleClampDegrees = function pp_angleClampDegrees(angle, usePositiveRange = false) {
        let clampedAngle = angle % 360;

        if (clampedAngle < 0) {
            clampedAngle += 360;
        }

        if (!usePositiveRange) {
            if (clampedAngle > 180) {
                clampedAngle -= 360;
            }
        }

        return clampedAngle;
    };

    // Clamp the angle to -Pi/+Pi, so that, for example, 270 will be -90
    // If usePositiveRange is true, the angle will be clamped to 0/2Pi
    mathExtension.pp_angleClampRadians = function pp_angleClampRadians(angle, usePositiveRange = false) {
        return this.pp_toRadians(this.pp_angleClampDegrees(this.pp_toDegrees(angle), usePositiveRange));
    };

    // The range goes from start to end by going toward the positive direction (if useShortestAngle is false)
    // [20,300] is a 280 degrees range, [300, 20] is an 80 degrees range, [-150,-170] = [210, 190] is a 240 degrees range, [0, -10] = [0, 350] is a 350 degrees range
    mathExtension.pp_isInsideAngleRange = function pp_isInsideAngleRange(angle, start, end, useShortestAngle = false) {
        return this.pp_isInsideAngleRangeDegrees(angle, start, end, useShortestAngle);
    };

    mathExtension.pp_isInsideAngleRangeDegrees = function pp_isInsideAngleRangeDegrees(angle, start, end, useShortestAngle = false) {
        let isInside = false;

        let anglePositive = this.pp_angleClampDegrees(angle, true);
        let startPositive = this.pp_angleClampDegrees(start, true);
        let endPositive = this.pp_angleClampDegrees(end, true);

        if (useShortestAngle) {
            if (this.pp_angleDistanceSignedDegrees(startPositive, endPositive) < 0) {
                let temp = startPositive;
                startPositive = endPositive;
                endPositive = temp;
            }
        }

        if (startPositive < endPositive) {
            isInside = anglePositive >= startPositive && anglePositive <= endPositive;
        } else {
            isInside = anglePositive >= startPositive || anglePositive <= endPositive;
        }

        return isInside;
    };

    mathExtension.pp_isInsideAngleRangeRadians = function pp_isInsideAngleRangeRadians(angle, start, end, useShortestAngle = false) {
        return this.pp_isInsideAngleRangeDegrees(this.pp_toDegrees(angle), this.pp_toDegrees(start), this.pp_toDegrees(end), useShortestAngle);
    };



    ExtensionUtils.assignProperties(mathExtension, Math, false, true, true);

}
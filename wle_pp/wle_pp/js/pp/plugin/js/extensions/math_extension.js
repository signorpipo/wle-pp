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
        - pp_lerp           / pp_interpolate
        - pp_angleDistance  / pp_angleDistanceSigned
        - pp_angleClamp
        - pp_isInsideAngleRange
*/

import { EasingFunction, MathUtils } from "../../../cauldron/js/utils/math_utils";
import { PluginUtils } from "../../utils/plugin_utils";

export function initMathExtension() {
    initMathExtensionStatic();
}

export function initMathExtensionStatic() {

    let mathExtension = {};

    Object.defineProperty(mathExtension, "PP_EPSILON", {
        get() {
            return MathUtils.EPSILON;
        },
        set(value) {
            MathUtils.EPSILON = value;
        }
    });

    Object.defineProperty(mathExtension, "PP_EPSILON_SQUARED", {
        get() {
            return MathUtils.EPSILON_SQUARED;
        },
        set(value) {
            MathUtils.EPSILON = value;
        }
    });

    Object.defineProperty(mathExtension, "PP_EPSILON_DEGREES", {
        get() {
            return MathUtils.EPSILON_DEGREES;
        },
        set(value) {
            MathUtils.EPSILON = value;
        }
    });

    mathExtension.pp_clamp = function pp_clamp(value, start, end) {
        return MathUtils.clamp(...arguments);
    };

    mathExtension.pp_sign = function pp_sign(value, zeroSign = 1) {
        return MathUtils.sign(...arguments);
    };

    mathExtension.pp_toDegrees = function pp_toDegrees(angle) {
        return MathUtils.toDegrees(...arguments);
    };

    mathExtension.pp_toRadians = function pp_toRadians(angle) {
        return MathUtils.toRadians(...arguments);
    };

    mathExtension.pp_roundDecimal = function pp_roundDecimal(number, decimalPlaces) {
        return MathUtils.roundDecimal(...arguments);
    };

    mathExtension.pp_mapToRange = function pp_mapToRange(value, originRangeStart, originRangeEnd, newRangeStart, newRangeEnd) {
        return MathUtils.mapToRange(...arguments);
    };

    mathExtension.pp_random = function pp_random(start = 0, end = 1) {
        return MathUtils.random(...arguments);
    };

    mathExtension.pp_randomInt = function pp_randomInt(start, end) {
        return MathUtils.randomInt(...arguments);
    };

    mathExtension.pp_randomBool = function pp_randomBool() {
        return MathUtils.randomBool(...arguments);
    };

    mathExtension.pp_randomSign = function pp_randomSign() {
        return MathUtils.randomSign(...arguments);
    };

    mathExtension.pp_randomPick = function pp_randomPick(...args) {
        return MathUtils.randomPick(...arguments);
    };

    mathExtension.pp_randomUUID = function pp_randomUUID() {
        return MathUtils.randomUUID(...arguments);
    };

    mathExtension.pp_lerp = function pp_lerp(from, to, interpolationFactor) {
        return MathUtils.lerp(...arguments);
    };

    mathExtension.pp_interpolate = function pp_interpolate(from, to, interpolationFactor, easingFunction = EasingFunction.linear) {
        return MathUtils.interpolate(...arguments);
    };

    mathExtension.pp_angleDistance = function pp_angleDistance(from, to) {
        return MathUtils.angleDistance(...arguments);
    };

    mathExtension.pp_angleDistanceDegrees = function pp_angleDistanceDegrees(from, to) {
        return MathUtils.angleDistanceDegrees(...arguments);
    };

    mathExtension.pp_angleDistanceRadians = function pp_angleDistanceRadians(from, to) {
        return MathUtils.angleDistanceRadians(...arguments);
    };

    mathExtension.pp_angleDistanceSigned = function pp_angleDistanceSigned(from, to) {
        return MathUtils.angleDistanceSigned(...arguments);
    };

    mathExtension.pp_angleDistanceSignedDegrees = function pp_angleDistanceSignedDegrees(from, to) {
        return MathUtils.angleDistanceSignedDegrees(...arguments);
    };

    mathExtension.pp_angleDistanceSignedRadians = function pp_angleDistanceSignedRadians(from, to) {
        return MathUtils.angleDistanceSignedRadians(...arguments);
    };

    mathExtension.pp_angleClamp = function pp_angleClamp(angle, usePositiveRange = false) {
        return MathUtils.angleClamp(...arguments);
    };

    mathExtension.pp_angleClampDegrees = function pp_angleClampDegrees(angle, usePositiveRange = false) {
        return MathUtils.angleClampDegrees(...arguments);
    };

    mathExtension.pp_angleClampRadians = function pp_angleClampRadians(angle, usePositiveRange = false) {
        return MathUtils.angleClampRadians(...arguments);
    };

    mathExtension.pp_isInsideAngleRange = function pp_isInsideAngleRange(angle, start, end, useShortestAngle = false) {
        return MathUtils.isInsideAngleRange(...arguments);
    };

    mathExtension.pp_isInsideAngleRangeDegrees = function pp_isInsideAngleRangeDegrees(angle, start, end, useShortestAngle = false) {
        return MathUtils.isInsideAngleRangeDegrees(...arguments);
    };

    mathExtension.pp_isInsideAngleRangeRadians = function pp_isInsideAngleRangeRadians(angle, start, end, useShortestAngle = false) {
        return MathUtils.isInsideAngleRangeRadians(...arguments);
    };



    PluginUtils.injectProperties(mathExtension, Math, false, true, true);
}
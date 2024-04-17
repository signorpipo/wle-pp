import { EasingFunction, MathUtils } from "../../../cauldron/utils/math_utils.js";
import { PluginUtils } from "../../utils/plugin_utils.js";

import "./math_type_extension.js";

export function initMathExtension(): void {
    _initMathExtensionInstance();
}

function _initMathExtensionInstance(): void {

    const mathExtension: Record<string, any> = {};

    Object.defineProperty(mathExtension, "PP_EPSILON", {
        get(): number {
            return MathUtils.EPSILON;
        }
    });

    Object.defineProperty(mathExtension, "PP_EPSILON_SQUARED", {
        get(): number {
            return MathUtils.EPSILON_SQUARED;
        }
    });

    Object.defineProperty(mathExtension, "PP_EPSILON_DEGREES", {
        get(): number {
            return MathUtils.EPSILON_DEGREES;
        }
    });

    mathExtension.pp_clamp = function pp_clamp(value: number, start: number, end: number): number {
        return MathUtils.clamp(value, start, end);
    };

    mathExtension.pp_sign = function pp_sign(value: number, zeroSign?: number): number {
        return MathUtils.sign(value, zeroSign);
    };

    mathExtension.pp_toDegrees = function pp_toDegrees(angle: number): number {
        return MathUtils.toDegrees(angle);
    };

    mathExtension.pp_toRadians = function pp_toRadians(angle: number): number {
        return MathUtils.toRadians(angle);
    };

    mathExtension.pp_roundDecimal = function pp_roundDecimal(number: number, decimalPlaces: number): number {
        return MathUtils.roundDecimal(number, decimalPlaces);
    };

    mathExtension.pp_mapToRange = function pp_mapToRange(value: number, originRangeStart: number, originRangeEnd: number, newRangeStart: number, newRangeEnd: number): number {
        return MathUtils.mapToRange(value, originRangeStart, originRangeEnd, newRangeStart, newRangeEnd);
    };

    mathExtension.pp_random = function pp_random(start?: number, end?: number): number {
        return MathUtils.random(start, end);
    };

    mathExtension.pp_randomInt = function pp_randomInt(start: number, end: number): number {
        return MathUtils.randomInt(start, end);
    };

    mathExtension.pp_randomBool = function pp_randomBool(): boolean {
        return MathUtils.randomBool();
    };

    mathExtension.pp_randomSign = function pp_randomSign(): number {
        return MathUtils.randomSign();
    };

    mathExtension.pp_randomPick = function pp_randomPick<T>(...args: T[]): T | null {
        return MathUtils.randomPick(...args);
    };

    mathExtension.pp_randomUUID = function pp_randomUUID(): string {
        return MathUtils.randomUUID();
    };

    mathExtension.pp_lerp = function pp_lerp(from: number, to: number, interpolationFactor: number): number {
        return MathUtils.lerp(from, to, interpolationFactor);
    };

    mathExtension.pp_interpolate = function pp_interpolate(from: number, to: number, interpolationFactor: number, easingFunction?: EasingFunction): number {
        return MathUtils.interpolate(from, to, interpolationFactor, easingFunction);
    };

    mathExtension.pp_interpolatePeriodic = function pp_interpolatePeriodic(from: number, to: number, interpolationFactor: number, easingFunction?: EasingFunction): number {
        return MathUtils.interpolatePeriodic(from, to, interpolationFactor, easingFunction);
    };

    mathExtension.pp_angleDistance = function pp_angleDistance(from: number, to: number): number {
        return MathUtils.angleDistance(from, to);
    };

    mathExtension.pp_angleDistanceDegrees = function pp_angleDistanceDegrees(from: number, to: number): number {
        return MathUtils.angleDistanceDegrees(from, to);
    };

    mathExtension.pp_angleDistanceRadians = function pp_angleDistanceRadians(from: number, to: number): number {
        return MathUtils.angleDistanceRadians(from, to);
    };

    mathExtension.pp_angleDistanceSigned = function pp_angleDistanceSigned(from: number, to: number): number {
        return MathUtils.angleDistanceSigned(from, to);
    };

    mathExtension.pp_angleDistanceSignedDegrees = function pp_angleDistanceSignedDegrees(from: number, to: number): number {
        return MathUtils.angleDistanceSignedDegrees(from, to);
    };

    mathExtension.pp_angleDistanceSignedRadians = function pp_angleDistanceSignedRadians(from: number, to: number): number {
        return MathUtils.angleDistanceSignedRadians(from, to);
    };

    mathExtension.pp_angleClamp = function pp_angleClamp(angle: number, usePositiveRange?: boolean): number {
        return MathUtils.angleClamp(angle, usePositiveRange);
    };

    mathExtension.pp_angleClampDegrees = function pp_angleClampDegrees(angle: number, usePositiveRange?: boolean): number {
        return MathUtils.angleClampDegrees(angle, usePositiveRange);
    };

    mathExtension.pp_angleClampRadians = function pp_angleClampRadians(angle: number, usePositiveRange?: boolean): number {
        return MathUtils.angleClampRadians(angle, usePositiveRange);
    };

    mathExtension.pp_isInsideAngleRange = function pp_isInsideAngleRange(angle: number, start: number, end: number, useShortestAngle?: boolean): boolean {
        return MathUtils.isInsideAngleRange(angle, start, end, useShortestAngle);
    };

    mathExtension.pp_isInsideAngleRangeDegrees = function pp_isInsideAngleRangeDegrees(angle: number, start: number, end: number, useShortestAngle?: boolean): boolean {
        return MathUtils.isInsideAngleRangeDegrees(angle, start, end, useShortestAngle);
    };

    mathExtension.pp_isInsideAngleRangeRadians = function pp_isInsideAngleRangeRadians(angle: number, start: number, end: number, useShortestAngle?: boolean): boolean {
        return MathUtils.isInsideAngleRangeRadians(angle, start, end, useShortestAngle);
    };



    PluginUtils.injectProperties(mathExtension, Math, false, true, true);
}
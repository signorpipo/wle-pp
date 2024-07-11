import { EasingFunction, EasingFunctionName, MathUtils } from "../../../cauldron/utils/math_utils.js";
import { PluginUtils } from "../../utils/plugin_utils.js";
import { MathExtension } from "./math_type_extension.js";

import "./math_type_extension.js";

export function initMathExtension(): void {
    _initMathExtensionInstance();
}

function _initMathExtensionInstance(): void {

    const mathExtension: MathExtension = {

        get PP_EPSILON() {
            return MathUtils.EPSILON;
        },

        get PP_EPSILON_SQUARED() {
            return MathUtils.EPSILON_SQUARED;
        },

        get PP_EPSILON_DEGREES() {
            return MathUtils.EPSILON_DEGREES;
        },

        pp_clamp(value: number, start?: number, end?: number): number {
            return MathUtils.clamp(value, start, end);
        },

        pp_sign(value: number, zeroSign?: number): number {
            return MathUtils.sign(value, zeroSign);
        },

        pp_toDegrees(angle: number): number {
            return MathUtils.toDegrees(angle);
        },

        pp_toRadians(angle: number): number {
            return MathUtils.toRadians(angle);
        },

        pp_roundDecimal(number: number, decimalPlaces: number): number {
            return MathUtils.roundDecimal(number, decimalPlaces);
        },

        pp_mapToRange(value: number, originRangeStart: number, originRangeEnd: number, newRangeStart: number, newRangeEnd: number): number {
            return MathUtils.mapToRange(value, originRangeStart, originRangeEnd, newRangeStart, newRangeEnd);
        },

        pp_random(start?: number, end?: number): number {
            return MathUtils.random(start!, end!);
        },

        pp_randomInt(start: number, end: number): number {
            return MathUtils.randomInt(start, end);
        },

        pp_randomBool(): boolean {
            return MathUtils.randomBool();
        },

        pp_randomSign(): number {
            return MathUtils.randomSign();
        },

        pp_randomPick<T>(...args: T[]): T | null {
            return MathUtils.randomPick(...args);
        },

        pp_randomUUID(): string {
            return MathUtils.randomUUID();
        },

        pp_lerp(from: number, to: number, interpolationFactor: number): number {
            return MathUtils.lerp(from, to, interpolationFactor);
        },

        pp_interpolate(from: number, to: number, interpolationFactor: number, easingFunction?: EasingFunction): number {
            return MathUtils.interpolate(from, to, interpolationFactor, easingFunction);
        },

        pp_interpolatePeriodic(from: number, to: number, interpolationFactor: number, easingFunction?: EasingFunction): number {
            return MathUtils.interpolatePeriodic(from, to, interpolationFactor, easingFunction);
        },

        pp_getEasingFunctionByName(easingFunctionName: EasingFunctionName): EasingFunction {
            return MathUtils.getEasingFunctionByName(easingFunctionName);
        },

        pp_getEasingFunctionNameByIndex(index: number): EasingFunctionName | null {
            return MathUtils.getEasingFunctionNameByIndex(index);
        },

        pp_angleDistance(from: number, to: number): number {
            return MathUtils.angleDistance(from, to);
        },

        pp_angleDistanceDegrees(from: number, to: number): number {
            return MathUtils.angleDistanceDegrees(from, to);
        },

        pp_angleDistanceRadians(from: number, to: number): number {
            return MathUtils.angleDistanceRadians(from, to);
        },

        pp_angleDistanceSigned(from: number, to: number): number {
            return MathUtils.angleDistanceSigned(from, to);
        },

        pp_angleDistanceSignedDegrees(from: number, to: number): number {
            return MathUtils.angleDistanceSignedDegrees(from, to);
        },

        pp_angleDistanceSignedRadians(from: number, to: number): number {
            return MathUtils.angleDistanceSignedRadians(from, to);
        },

        pp_angleClamp(angle: number, usePositiveRange?: boolean): number {
            return MathUtils.angleClamp(angle, usePositiveRange);
        },

        pp_angleClampDegrees(angle: number, usePositiveRange?: boolean): number {
            return MathUtils.angleClampDegrees(angle, usePositiveRange);
        },

        pp_angleClampRadians(angle: number, usePositiveRange?: boolean): number {
            return MathUtils.angleClampRadians(angle, usePositiveRange);
        },

        pp_isInsideAngleRange(angle: number, start: number, end: number, useShortestAngle?: boolean): boolean {
            return MathUtils.isInsideAngleRange(angle, start, end, useShortestAngle);
        },

        pp_isInsideAngleRangeDegrees(angle: number, start: number, end: number, useShortestAngle?: boolean): boolean {
            return MathUtils.isInsideAngleRangeDegrees(angle, start, end, useShortestAngle);
        },

        pp_isInsideAngleRangeRadians(angle: number, start: number, end: number, useShortestAngle?: boolean): boolean {
            return MathUtils.isInsideAngleRangeRadians(angle, start, end, useShortestAngle);
        }
    };

    PluginUtils.injectOwnProperties(mathExtension, Math, false, true, true);
}
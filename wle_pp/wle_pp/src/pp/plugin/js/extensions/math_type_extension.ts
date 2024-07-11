import { EasingFunction, EasingFunctionName } from "../../../cauldron/utils/math_utils.js";

/**
 * #WARN this type extension is actually added at runtime only if you call `initMathExtension`  
 * The `initPP` function, which is automatically called by the `pp-gateway` component, does this for you
 * 
 * -
 * 
 * How to use
 * 
 * By default the rotations are in `Degrees`
 * 
 * For rotations u can add a suffix like `Degrees`/`Radians` to use a specific version, example:  
 *     - `pp_angleDistanceSignedDegrees`  
 *     - `pp_isInsideAngleRangeRadians`
 */
export interface MathExtension {
    PP_EPSILON: number;
    PP_EPSILON_SQUARED: number;
    PP_EPSILON_DEGREES: number;

    pp_clamp(value: number, start?: number, end?: number): number;

    pp_sign(value: number, zeroSign?: number): number;

    pp_toDegrees(angle: number): number;
    pp_toRadians(angle: number): number;

    pp_roundDecimal(number: number, decimalPlaces: number): number;

    /** Start range value doesn't need to be lower than the end one, so you can map from `[0, 1]` to `[3, 2]`, where `3` is greater than `2` */
    pp_mapToRange(value: number, originRangeStart: number, originRangeEnd: number, newRangeStart: number, newRangeEnd: number): number;



    /** Range is `[0, 1)` */
    pp_random(): number;
    /** Range is `[start, end)` */
    pp_random(start: number, end: number): number;

    /** Range is `[start, end]` */
    pp_randomInt(start: number, end: number): number;

    pp_randomBool(): boolean;

    /** Return `1` or `-1` */
    pp_randomSign(): number;

    /** You give it a list of parameters and returns a random one */
    pp_randomPick<T>(array: T[]): T | null;
    pp_randomPick<T>(...args: T[]): T | null;

    pp_randomUUID(): string;



    /** `[from, to]` range is mapped to an `interpolationFactor` in the range `[0, 1]` */
    pp_lerp(from: number, to: number, interpolationFactor: number): number;

    /** `[from, to]` range is mapped to an `interpolationFactor` in the range `[0, 1]` */
    pp_interpolate(from: number, to: number, interpolationFactor: number, easingFunction?: EasingFunction): number;

    /** `[from, to]` range is mapped to an `interpolationFactor` in the range `[0, 1]`  
        `interpolationFactor` can go outside the `[0, 1]` range, periodically repeating the interpolation in the given range */
    pp_interpolatePeriodic(from: number, to: number, interpolationFactor: number, easingFunction?: EasingFunction): number;

    pp_getEasingFunctionByName(easingFunctionName: EasingFunctionName): EasingFunction;
    pp_getEasingFunctionNameByIndex(index: number): EasingFunctionName | null;



    pp_angleDistance(from: number, to: number): number;
    pp_angleDistanceDegrees(from: number, to: number): number;
    pp_angleDistanceRadians(from: number, to: number): number;

    pp_angleDistanceSigned(from: number, to: number): number;
    pp_angleDistanceSignedDegrees(from: number, to: number): number;
    pp_angleDistanceSignedRadians(from: number, to: number): number;



    /** Clamp the angle to `-180 / +180`, so that, for example, `270` will be `-90`  
        If `usePositiveRange` is `true`, the angle will be clamped to `0 / 360` */
    pp_angleClamp(angle: number, usePositiveRange?: boolean): number;

    /** Clamp the angle to `-180 / +180`, so that, for example, `270` will be `-90`  
        If `usePositiveRange` is `true`, the angle will be clamped to `0 / 360` */
    pp_angleClampDegrees(angle: number, usePositiveRange?: boolean): number;

    /** Clamp the angle to `-PI / +PI`, so that, for example, `1.5PI` will be `-0.5PI`  
        If `usePositiveRange` is `true`, the angle will be clamped to `0 / 2PI` */
    pp_angleClampRadians(angle: number, usePositiveRange?: boolean): number;



    /** The range goes from `start` to `end` by going toward the positive direction (if `useShortestAngle` is `false`)  
        `[20, 300]` is a `280` degrees range, `[300, 20]` is an `80` degrees range,  
        `[-150, -170]` = `[210, 190]` is a `240` degrees range,  
        `[0, -10]` = `[0, 350]` is a `350` degrees range */
    pp_isInsideAngleRange(angle: number, start: number, end: number, useShortestAngle?: boolean): boolean;

    pp_isInsideAngleRangeDegrees(angle: number, start: number, end: number, useShortestAngle?: boolean): boolean;
    pp_isInsideAngleRangeRadians(angle: number, start: number, end: number, useShortestAngle?: boolean): boolean;
}

declare global {
    interface Math extends MathExtension { }
}
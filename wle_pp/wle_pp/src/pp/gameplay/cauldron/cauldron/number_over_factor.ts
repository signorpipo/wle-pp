import { EasingFunction } from "../../../cauldron/utils/math_utils.js";

/** You can just put `fromValue` if u want a value that doesn't actually change -> `new NumberOverFactor(0)` */
export class NumberOverFactor {

    private readonly _myFromValue: number;
    private readonly _myToValue: number;

    private readonly _myFromFactor: number;
    private readonly _myToFactor: number;

    private readonly _myEasingFunction: EasingFunction;

    /** `Math.round` / `Math.floor` / `Math.ceil` can be used */
    private readonly _myRoundingFunction: ((valueToRound: number, fromValue: number, toValue: number) => number) | null;

    constructor(fromValue: number, toValue: number = fromValue, fromFactor: number = 0, toFactor: number = 0, easingFunction: EasingFunction = EasingFunction.linear, roundingFunction: ((valueToRound: number, fromValue: number, toValue: number) => number) | null = null) {
        this._myFromValue = fromValue;
        this._myToValue = toValue;

        this._myFromFactor = fromFactor;
        this._myToFactor = toFactor;

        this._myEasingFunction = easingFunction;

        this._myRoundingFunction = roundingFunction;
    }

    public get(factor: number): number {
        const interpolationFactor = this._myEasingFunction(Math.pp_mapToRange(factor, this._myFromFactor, this._myToFactor, 0, 1));
        let currentValue = Math.pp_lerp(this._myFromValue, this._myToValue, interpolationFactor);

        if (this._myRoundingFunction != null) {
            currentValue = this._myRoundingFunction(currentValue, this._myFromValue, this._myToValue);
        }

        return currentValue;
    }

    public getAverage(factor: number): number {
        return this.get(factor);
    }

    public getRange(factor: number): [number, number] {
        const currentValue = this.get(factor);
        return [currentValue, currentValue];
    }

    public getMax(factor: number): number {
        return this.get(factor);
    }

    public getMin(factor: number): number {
        return this.get(factor);
    }

    public isInside(value: number, factor: number): boolean {
        const currentValue = this.get(factor);

        return currentValue == value;
    }

    public isInsideAngleRange(value: number, factor: number): boolean {
        return this.isInsideAngleRangeDegrees(value, factor);
    }

    public isInsideAngleRangeDegrees(value: number, factor: number): boolean {
        const currentValue = this.get(factor);

        const clampedValue = Math.pp_angleClampDegrees(value);
        const clampedCurrentValue = Math.pp_angleClampDegrees(currentValue);

        return clampedValue == clampedCurrentValue;
    }

    public isInsideAngleRangeRadians(value: number, factor: number): boolean {
        const currentValue = this.get(factor);

        const clampedValue = Math.pp_angleClampRadians(value);
        const clampedCurrentValue = Math.pp_angleClampRadians(currentValue);

        return clampedValue == clampedCurrentValue;
    }
}

export class IntOverFactor extends NumberOverFactor {

    constructor(fromValue: number, toValue: number = fromValue, fromFactor: number = 0, toFactor: number = 0, easingFunction: EasingFunction = EasingFunction.linear, roundingFunction: ((valueToRound: number, fromValue: number, toValue: number) => number) | null = null) {
        if (roundingFunction == null) {
            roundingFunction = function (valueToRound: number, fromValue: number, toValue: number): number {
                let roundedValue = null;

                const useFloor = fromValue <= toValue;
                if (useFloor) {
                    roundedValue = Math.floor(valueToRound);
                } else {
                    roundedValue = Math.ceil(valueToRound);
                }

                return roundedValue;
            };
        }

        super(fromValue, toValue, fromFactor, toFactor, easingFunction, roundingFunction);
    }
}

/** You can just put `fromRange` if u want a range that doesn't actually change -> `new NumberOverFactor([1, 25])` */
export class NumberRangeOverFactor {

    private readonly _myRangeStartOverFactor: NumberOverFactor;
    private readonly _myRangeEndOverFactor: NumberOverFactor;

    private readonly _myRoundingFunction: ((valueToRound: number, fromValue: number, toValue: number) => number) | null; // Math.round/floor/ceil can be used

    constructor(fromRange: Readonly<[number, number]>, toRange: Readonly<[number, number]> = fromRange, fromFactor: number = 0, toFactor: number = 0, easingFunction = EasingFunction.linear, roundingFunction: ((valueToRound: number, fromValue: number, toValue: number) => number) | null = null) {

        this._myRangeStartOverFactor = new NumberOverFactor(fromRange[0], toRange[0], fromFactor, toFactor, easingFunction, roundingFunction);
        this._myRangeEndOverFactor = new NumberOverFactor(fromRange[1], toRange[1], fromFactor, toFactor, easingFunction, roundingFunction);

        this._myRoundingFunction = roundingFunction;
    }

    public get(factor: number): number {
        const rangeStart = this._myRangeStartOverFactor.get(factor);
        const rangeEnd = this._myRangeEndOverFactor.get(factor);

        let randomValue = null;

        if (this._myRoundingFunction) {
            randomValue = Math.pp_randomInt(rangeStart, rangeEnd);
        } else {
            randomValue = Math.pp_random(rangeStart, rangeEnd);
        }

        return randomValue;
    }

    public getAverage(factor: number): number {
        const rangeStart = this._myRangeStartOverFactor.get(factor);
        const rangeEnd = this._myRangeEndOverFactor.get(factor);

        let averageValue = (rangeStart + rangeEnd) / 2;
        if (this._myRoundingFunction) {
            averageValue = this._myRoundingFunction(averageValue, rangeStart, rangeEnd);
        }

        return averageValue;
    }

    public getRange(factor: number): [number, number] {
        const rangeStart = this._myRangeStartOverFactor.get(factor);
        const rangeEnd = this._myRangeEndOverFactor.get(factor);

        return [rangeStart, rangeEnd];
    }

    public getMax(factor: number): number {
        const rangeStart = this._myRangeStartOverFactor.get(factor);
        const rangeEnd = this._myRangeEndOverFactor.get(factor);

        return Math.max(rangeStart, rangeEnd);
    }

    public getMin(factor: number): number {
        const rangeStart = this._myRangeStartOverFactor.get(factor);
        const rangeEnd = this._myRangeEndOverFactor.get(factor);

        return Math.min(rangeStart, rangeEnd);
    }

    public isInside(value: number, factor: number): boolean {
        const rangeStart = this._myRangeStartOverFactor.get(factor);
        const rangeEnd = this._myRangeEndOverFactor.get(factor);

        const min = Math.min(rangeStart, rangeEnd);
        const max = Math.max(rangeStart, rangeEnd);

        return value >= min && value <= max;
    }

    public isInsideAngleRange(value: number, factor: number): boolean {
        return this.isInsideAngleRangeDegrees(value, factor);
    }

    public isInsideAngleRangeDegrees(value: number, factor: number): boolean {
        const rangeStart = this._myRangeStartOverFactor.get(factor);
        const rangeEnd = this._myRangeEndOverFactor.get(factor);

        return Math.pp_isInsideAngleRangeDegrees(value, rangeStart, rangeEnd);
    }

    public isInsideAngleRangeRadians(value: number, factor: number): boolean {
        const rangeStart = this._myRangeStartOverFactor.get(factor);
        const rangeEnd = this._myRangeEndOverFactor.get(factor);

        return Math.pp_isInsideAngleRangeRadians(value, rangeStart, rangeEnd);
    }
}

export class IntRangeOverFactor extends NumberRangeOverFactor {

    constructor(fromRange: Readonly<[number, number]>, toRange: Readonly<[number, number]> = fromRange, fromFactor: number = 0, toFactor: number = 0, easingFunction = EasingFunction.linear, roundingFunction: ((valueToRound: number, fromValue: number, toValue: number) => number) | null = null) {
        if (roundingFunction == null) {
            roundingFunction = function (valueToRound: number, fromValue: number, toValue: number): number {
                let roundedValue = null;

                const useFloor = fromValue <= toValue;
                if (useFloor) {
                    roundedValue = Math.floor(valueToRound);
                } else {
                    roundedValue = Math.ceil(valueToRound);
                }

                return roundedValue;
            };
        }

        super(fromRange, toRange, fromFactor, toFactor, easingFunction, roundingFunction);
    }
}
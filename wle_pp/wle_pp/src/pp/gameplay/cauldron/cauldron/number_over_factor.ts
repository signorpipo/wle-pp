import { EasingFunction } from "../../../cauldron/utils/math_utils.js";

export type RoundingFunction = (numberToRound: number, fromNumber: number, toNumber: number) => number;

// You can just put fromNumber if u want a number that doesn't actually change -> new NumberOverFactor(0)
export class NumberOverFactor {

    private _myFromNumber: number;
    private _myToNumber: number;

    private _myFromFactor: number;
    private _myToFactor: number;

    private _myEasingFunction: EasingFunction;

    private _myRoundingFunction: RoundingFunction | null; // Math.round/floor/ceil can be used

    constructor(fromNumber: number, toNumber: number = fromNumber, fromFactor: number = 0, toFactor: number = 0, easingFunction: EasingFunction = EasingFunction.linear, roundingFunction: RoundingFunction | null = null) {
        this._myFromNumber = fromNumber;
        this._myToNumber = toNumber;

        this._myFromFactor = fromFactor;
        this._myToFactor = toFactor;

        this._myEasingFunction = easingFunction;

        this._myRoundingFunction = roundingFunction;
    }

    get(factor: number): number {
        const interpolationFactor = this._myEasingFunction(Math.pp_mapToRange(factor, this._myFromFactor, this._myToFactor, 0, 1));
        let numberOverFactor = Math.pp_lerp(this._myFromNumber, this._myToNumber, interpolationFactor);

        if (this._myRoundingFunction != null) {
            numberOverFactor = this._myRoundingFunction(numberOverFactor, this._myFromNumber, this._myToNumber);
        }

        return numberOverFactor;
    }

    getAverage(factor: number): number {
        return this.get(factor);
    }

    getRange(factor: number): [number, number] {
        const numberOverFactor = this.get(factor);
        return [numberOverFactor, numberOverFactor];
    }

    getMax(factor: number): number {
        return this.get(factor);
    }

    getMin(factor: number): number {
        return this.get(factor);
    }

    isInside(number: number, factor: number): boolean {
        const numberOverFactor = this.get(factor);

        return numberOverFactor == number;
    }

    isInsideAngleRange(number: number, factor: number): boolean {
        return this.isInsideAngleRangeDegrees(number, factor);
    }

    isInsideAngleRangeDegrees(number: number, factor: number): boolean {
        const numberOverFactor = this.get(factor);

        const clampedNumber = Math.pp_angleClampDegrees(number);
        const clampedNumberOverFactor = Math.pp_angleClampDegrees(numberOverFactor);

        return clampedNumber == clampedNumberOverFactor;
    }

    isInsideAngleRangeRadians(number: number, factor: number): boolean {
        const numberOverFactor = this.get(factor);

        const clampedNumber = Math.pp_angleClampRadians(number);
        const clampedNumberOverFactor = Math.pp_angleClampRadians(numberOverFactor);

        return clampedNumber == clampedNumberOverFactor;
    }
}

export class IntOverFactor extends NumberOverFactor {

    constructor(fromNumber: number, toNumber: number = fromNumber, fromFactor: number = 0, toFactor: number = 0, easingFunction: EasingFunction = EasingFunction.linear, roundingFunction: RoundingFunction | null = null) {
        if (roundingFunction == null) {
            roundingFunction = function (numberToRound: number, fromNumber: number, toNumber: number): number {
                let roundedNumber = null;

                const useFloor = fromNumber <= toNumber;
                if (useFloor) {
                    roundedNumber = Math.floor(numberToRound);
                } else {
                    roundedNumber = Math.ceil(numberToRound);
                }

                return roundedNumber;
            };
        }

        super(fromNumber, toNumber, fromFactor, toFactor, easingFunction, roundingFunction);
    }
}

// You can just put fromRange if u want a range that doesn't actually change -> new NumberOverFactor([1, 25])
export class NumberRangeOverFactor {

    private _myFromNumberOverFactor: NumberOverFactor;
    private _myToNumberOverFactor: NumberOverFactor;

    private _myRoundingFunction: RoundingFunction | null; // Math.round/floor/ceil can be used

    constructor(fromRange: [number, number], toRange: [number, number] = fromRange, fromFactor: number = 0, toFactor: number = 0, easingFunction = EasingFunction.linear, roundingFunction: RoundingFunction | null = null) {

        this._myFromNumberOverFactor = new NumberOverFactor(fromRange[0], toRange[0], fromFactor, toFactor, easingFunction, roundingFunction);
        this._myToNumberOverFactor = new NumberOverFactor(fromRange[1], toRange[1], fromFactor, toFactor, easingFunction, roundingFunction);

        this._myRoundingFunction = roundingFunction;
    }

    get(factor: number): number {
        const fromNumber = this._myFromNumberOverFactor.get(factor);
        const toNumber = this._myToNumberOverFactor.get(factor);

        let randomNumberOverFactor = null;

        if (this._myRoundingFunction) {
            randomNumberOverFactor = Math.pp_randomInt(fromNumber, toNumber);
        } else {
            randomNumberOverFactor = Math.pp_random(fromNumber, toNumber);
        }

        return randomNumberOverFactor;
    }

    getAverage(factor: number): number {
        const fromNumber = this._myFromNumberOverFactor.get(factor);
        const toNumber = this._myToNumberOverFactor.get(factor);

        let averageNumberOverFactor = (fromNumber + toNumber) / 2;
        if (this._myRoundingFunction) {
            averageNumberOverFactor = this._myRoundingFunction(averageNumberOverFactor, fromNumber, toNumber);
        }

        return averageNumberOverFactor;
    }

    getRange(factor: number): [number, number] {
        const fromNumber = this._myFromNumberOverFactor.get(factor);
        const toNumber = this._myToNumberOverFactor.get(factor);

        return [fromNumber, toNumber];
    }

    getMax(factor: number): number {
        const fromNumber = this._myFromNumberOverFactor.get(factor);
        const toNumber = this._myToNumberOverFactor.get(factor);

        return Math.max(fromNumber, toNumber);
    }

    getMin(factor: number): number {
        const fromNumber = this._myFromNumberOverFactor.get(factor);
        const toNumber = this._myToNumberOverFactor.get(factor);

        return Math.min(fromNumber, toNumber);
    }

    isInside(number: number, factor: number): boolean {
        const fromNumber = this._myFromNumberOverFactor.get(factor);
        const toNumber = this._myToNumberOverFactor.get(factor);

        const min = Math.min(fromNumber, toNumber);
        const max = Math.max(fromNumber, toNumber);

        return number >= min && number <= max;
    }

    isInsideAngleRange(number: number, factor: number): boolean {
        return this.isInsideAngleRangeDegrees(number, factor);
    }

    isInsideAngleRangeDegrees(number: number, factor: number): boolean {
        const fromNumber = this._myFromNumberOverFactor.get(factor);
        const toNumber = this._myToNumberOverFactor.get(factor);

        return Math.pp_isInsideAngleRangeDegrees(number, fromNumber, toNumber);
    }

    isInsideAngleRangeRadians(number: number, factor: number): boolean {
        const fromNumber = this._myFromNumberOverFactor.get(factor);
        const toNumber = this._myToNumberOverFactor.get(factor);

        return Math.pp_isInsideAngleRangeRadians(number, fromNumber, toNumber);
    }
}

export class IntRangeOverFactor extends NumberRangeOverFactor {

    constructor(fromRange: [number, number], toRange: [number, number] = fromRange, fromFactor: number = 0, toFactor: number = 0, easingFunction = EasingFunction.linear, roundingFunction: RoundingFunction | null = null) {
        if (roundingFunction == null) {
            roundingFunction = function (numberToRound: number, fromNumber: number, toNumber: number): number {
                let roundedNumber = null;

                const useFloor = fromNumber <= toNumber;
                if (useFloor) {
                    roundedNumber = Math.floor(numberToRound);
                } else {
                    roundedNumber = Math.ceil(numberToRound);
                }

                return roundedNumber;
            };
        }

        super(fromRange, toRange, fromFactor, toFactor, easingFunction, roundingFunction);
    }
}
import { EasingFunction } from "../../../cauldron/js/utils/math_utils";

// You can just put fromNumberOverFactor if u want a number that doesn't actually change -> new NumberOverFactor(0)
export class NumberOverFactor {

    constructor(fromNumberOverFactor, toNumberOverFactor = null, fromFactor = 0, toFactor = 0, easingFunction = EasingFunction.linear, roundingFunction = null) {
        if (toNumberOverFactor == null) {
            toNumberOverFactor = fromNumberOverFactor;
        }

        this._myFromNumber = fromNumberOverFactor;
        this._myToNumber = toNumberOverFactor;

        this._myFromFactor = fromFactor;
        this._myToFactor = toFactor;

        this._myEasingFunction = easingFunction;
        this._myRoundingFunction = roundingFunction;    // Signature: function(numberToRound, fromNumberOverFactor = null, toNumberOverFactor = null) -> int, Math.round/floor/ceil can be used
    }

    get(factor) {
        let interpolationFactor = this._myEasingFunction(Math.pp_mapToRange(factor, this._myFromFactor, this._myToFactor, 0, 1));
        let numberOverFactor = Math.pp_lerp(this._myFromNumber, this._myToNumber, interpolationFactor);

        if (this._myRoundingFunction) {
            numberOverFactor = this._myRoundingFunction(numberOverFactor, this._myFromNumber, this._myToNumber);
        }

        return numberOverFactor;
    }

    getAverage(factor) {
        return this.get(factor);
    }

    getRange(factor) {
        let numberOverFactor = this.get(factor);
        return [numberOverFactor, numberOverFactor];
    }

    getMax(factor) {
        return this.get(factor);
    }

    getMin(factor) {
        return this.get(factor);
    }

    isInside(number, factor) {
        let numberOverFactor = this.get(factor);

        return numberOverFactor == number;
    }

    isInsideAngleRange(number, factor) {
        return this.isInsideAngleRangeDegrees(number, factor);
    }

    isInsideAngleRangeDegrees(number, factor) {
        let numberOverFactor = this.get(factor);

        let clampedNumber = Math.pp_angleClampDegrees(number);
        let clampedNumberOverFactor = Math.pp_angleClampDegrees(numberOverFactor);

        return clampedNumber == clampedNumberOverFactor;
    }

    isInsideAngleRangeRadians(number, factor) {
        let numberOverFactor = this.get(factor);

        let clampedNumber = Math.pp_angleClampRadians(number);
        let clampedNumberOverFactor = Math.pp_angleClampRadians(numberOverFactor);

        return clampedNumber == clampedNumberOverFactor;
    }
}

export class IntOverFactor extends NumberOverFactor {

    constructor(fromNumberOverFactor, toNumberOverFactor, fromFactor, toFactor, easingFunction = EasingFunction.linear, roundingFunction = null) {
        if (roundingFunction == null) {
            roundingFunction = function (numberToRound, fromNumberOverFactor, toNumberOverFactor) {
                let roundedNumber = null;

                let useFloor = fromNumberOverFactor <= toNumberOverFactor;
                if (useFloor) {
                    roundedNumber = Math.floor(numberToRound);
                } else {
                    roundedNumber = Math.ceil(numberToRound);
                }

                return roundedNumber;
            };
        }

        super(fromNumberOverFactor, toNumberOverFactor, fromFactor, toFactor, easingFunction, roundingFunction);
    }
}

// You can just put fromRange if u want a range that doesn't actually change -> new NumberOverFactor([1,25])
export class NumberRangeOverFactor {

    constructor(fromRange, toRange = null, fromFactor = 0, toFactor = 0, easingFunction = EasingFunction.linear, roundingFunction = null) {
        if (toRange == null) {
            toRange = fromRange;
        }

        this._myFromNumberOverFactor = new NumberOverFactor(fromRange[0], toRange[0], fromFactor, toFactor, easingFunction, roundingFunction);
        this._myToNumberOverFactor = new NumberOverFactor(fromRange[1], toRange[1], fromFactor, toFactor, easingFunction, roundingFunction);

        this._myRoundingFunction = roundingFunction;    // Signature: function(numberToRound, fromNumberOverFactor = null, toNumberOverFactor = null) -> int, Math.round/floor/ceil can be used
    }

    get(factor) {
        let fromNumberOverFactor = this._myFromNumberOverFactor.get(factor);
        let toNumberOverFactor = this._myToNumberOverFactor.get(factor);

        let randomNumberOverFactor = null;

        if (this._myRoundingFunction) {
            randomNumberOverFactor = Math.pp_randomInt(fromNumberOverFactor, toNumberOverFactor);
        } else {
            randomNumberOverFactor = Math.pp_random(fromNumberOverFactor, toNumberOverFactor);
        }

        return randomNumberOverFactor;
    }

    getAverage(factor) {
        let fromNumberOverFactor = this._myFromNumberOverFactor.get(factor);
        let toNumberOverFactor = this._myToNumberOverFactor.get(factor);

        let averageNumberOverFactor = (fromNumberOverFactor + toNumberOverFactor) / 2;
        if (this._myRoundingFunction) {
            averageNumberOverFactor = this._myRoundingFunction(averageNumberOverFactor, fromNumberOverFactor, toNumberOverFactor);
        }

        return averageNumberOverFactor;
    }

    getRange(factor) {
        let fromNumberOverFactor = this._myFromNumberOverFactor.get(factor);
        let toNumberOverFactor = this._myToNumberOverFactor.get(factor);

        return [fromNumberOverFactor, toNumberOverFactor];
    }

    getMax(factor) {
        let fromNumberOverFactor = this._myFromNumberOverFactor.get(factor);
        let toNumberOverFactor = this._myToNumberOverFactor.get(factor);

        return Math.max(fromNumberOverFactor, toNumberOverFactor);
    }

    getMin(factor) {
        let fromNumberOverFactor = this._myFromNumberOverFactor.get(factor);
        let toNumberOverFactor = this._myToNumberOverFactor.get(factor);

        return Math.min(fromNumberOverFactor, toNumberOverFactor);
    }

    isInside(number, factor) {
        let fromNumberOverFactor = this._myFromNumberOverFactor.get(factor);
        let toNumberOverFactor = this._myToNumberOverFactor.get(factor);

        let min = Math.min(fromNumberOverFactor, toNumberOverFactor);
        let max = Math.max(fromNumberOverFactor, toNumberOverFactor);

        return number >= min && number <= max;
    }

    isInsideAngleRange(number, factor) {
        return this.isInsideAngleRangeDegrees(number, factor);
    }

    isInsideAngleRangeDegrees(number, factor) {
        let fromNumberOverFactor = this._myFromNumberOverFactor.get(factor);
        let toNumberOverFactor = this._myToNumberOverFactor.get(factor);

        return Math.pp_isInsideAngleRangeDegrees(number, fromNumberOverFactor, toNumberOverFactor);
    }

    isInsideAngleRangeRadians(number, factor) {
        let fromNumberOverFactor = this._myFromNumberOverFactor.get(factor);
        let toNumberOverFactor = this._myToNumberOverFactor.get(factor);

        return Math.pp_isInsideAngleRangeRadians(number, fromNumberOverFactor, toNumberOverFactor);
    }
}

export class IntRangeOverFactor extends NumberRangeOverFactor {

    constructor(fromRange, toRange, fromFactor, toFactor, easingFunction = EasingFunction.linear, roundingFunction = null) {
        if (roundingFunction == null) {
            roundingFunction = function (numberToRound, fromNumberOverFactor, toNumberOverFactor) {
                let roundedNumber = null;

                let useFloor = fromNumberOverFactor <= toNumberOverFactor;
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
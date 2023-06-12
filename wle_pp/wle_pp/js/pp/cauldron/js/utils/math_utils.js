export let EasingFunction = {
    linear: t => t,
    easeIn: t => t * t * t,
    easeOut: t => (t - 1) * (t - 1) * (t - 1) + 1,
    easeInOut: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};

export let EPSILON = 0.000001;
export let EPSILON_SQUARED = EPSILON * EPSILON;
export let EPSILON_DEGREES = 0.00001;

export function clamp(value, start, end) {
    let fixedStart = (start != null) ? start : -Number.MAX_VALUE;
    let fixedEnd = (end != null) ? end : Number.MAX_VALUE;

    let min = Math.min(fixedStart, fixedEnd);
    let max = Math.max(fixedStart, fixedEnd);
    return Math.min(Math.max(value, min), max);
}

export function sign(value, zeroSign = 1) {
    let sign = Math.sign(value);
    if (sign == 0) {
        sign = Math.sign(zeroSign);
    }
    return sign;
}

export function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

export function toRadians(angle) {
    return angle * (Math.PI / 180);
}

export function roundDecimal(number, decimalPlaces) {
    let factor = Math.pow(10, decimalPlaces);
    number = Math.round(number * factor) / factor;

    return number;
}

// Start range value doesn't need to be lower than the end one, so you can map from [0,1] to [3,2], where 3 is greater than 2
export function mapToRange(value, originRangeStart, originRangeEnd, newRangeStart, newRangeEnd) {
    if (originRangeStart == originRangeEnd) {
        return newRangeStart;
    }

    let clampedValue = MathUtils.clamp(value, originRangeStart, originRangeEnd);

    if (clampedValue == originRangeStart) {
        return newRangeStart;
    } else if (clampedValue == originRangeEnd) {
        return newRangeEnd;
    }

    let newValue = newRangeStart + ((newRangeEnd - newRangeStart) / (originRangeEnd - originRangeStart)) * (clampedValue - originRangeStart);
    let clampedNewValue = MathUtils.clamp(newValue, newRangeStart, newRangeEnd);
    return clampedNewValue;
}

// Range is [start, end)
export function random(start = 0, end = 1) {
    return Math.random() * (end - start) + start;
}

// Range is [start, end]
export function randomInt(start, end) {
    let min = Math.min(start, end);
    let max = Math.max(start, end);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomBool() {
    return MathUtils.randomInt(0, 1) == 0;
}

// Return 1 or -1
export function randomSign() {
    return (Math.random() < 0.5) ? 1 : -1;
}

// You give it a list of parameters and returns one
export function randomPick(...args) {
    let random = null;

    if (args.length > 0) {
        if (args.length == 1 && args[0].length != null) {
            if (args[0].length > 0) {
                let randomIndex = MathUtils.randomInt(0, args[0].length - 1);
                random = args[0][randomIndex];
            }
        } else {
            let randomIndex = MathUtils.randomInt(0, args.length - 1);
            random = args[randomIndex];
        }
    }

    return random;
}

export function randomUUID() {
    return crypto.randomUUID();
}

export function lerp(from, to, interpolationFactor) {
    if (interpolationFactor <= 0) {
        return from;
    } else if (interpolationFactor >= 1) {
        return to;
    }

    return interpolationFactor * (to - from) + from;
}

export function interpolate(from, to, interpolationFactor, easingFunction = EasingFunction.linear) {
    let lerpFactor = easingFunction(interpolationFactor);
    return MathUtils.lerp(from, to, lerpFactor);
}

export function angleDistance(from, to) {
    return MathUtils.angleDistanceDegrees(from, to);
}

export function angleDistanceDegrees(from, to) {
    return Math.abs(MathUtils.angleDistanceSignedDegrees(from, to));
}

export function angleDistanceRadians(from, to) {
    return Math.abs(MathUtils.angleDistanceSignedRadians(from, to));
}

export function angleDistanceSigned(from, to) {
    return MathUtils.angleDistanceSignedDegrees(from, to);
}

export function angleDistanceSignedDegrees(from, to) {
    let clampedFrom = MathUtils.angleClampDegrees(from, true);
    let clampedTo = MathUtils.angleClampDegrees(to, true);

    let distance = clampedTo - clampedFrom;
    if (clampedTo - clampedFrom > 180) {
        distance = (clampedTo - clampedFrom) - 360;
    } else if (clampedTo - clampedFrom < -180) {
        distance = (clampedTo - clampedFrom) + 360;
    }

    return distance;
}

export function angleDistanceSignedRadians(from, to) {
    return MathUtils.toRadians(MathUtils.angleDistanceSignedDegrees(MathUtils.toDegrees(from), MathUtils.toDegrees(to)));
}

// Clamp the angle to -180/+180, so that, for example, 270 will be -90
// If usePositiveRange is true, the angle will be clamped to 0/360
export function angleClamp(angle, usePositiveRange = false) {
    return MathUtils.angleClampDegrees(angle, usePositiveRange);
}

// Clamp the angle to -180/+180, so that, for example, 270 will be -90
// If usePositiveRange is true, the angle will be clamped to 0/360
export function angleClampDegrees(angle, usePositiveRange = false) {
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
}

// Clamp the angle to -Pi/+Pi, so that, for example, 270 will be -90
// If usePositiveRange is true, the angle will be clamped to 0/2Pi
export function angleClampRadians(angle, usePositiveRange = false) {
    return MathUtils.toRadians(MathUtils.angleClampDegrees(MathUtils.toDegrees(angle), usePositiveRange));
}

// The range goes from start to end by going toward the positive direction (if useShortestAngle is false)
// [20,300] is a 280 degrees range, [300, 20] is an 80 degrees range, [-150,-170] = [210, 190] is a 240 degrees range, [0, -10] = [0, 350] is a 350 degrees range
export function isInsideAngleRange(angle, start, end, useShortestAngle = false) {
    return MathUtils.isInsideAngleRangeDegrees(angle, start, end, useShortestAngle);
}

export function isInsideAngleRangeDegrees(angle, start, end, useShortestAngle = false) {
    let insideAngleRange = false;

    let anglePositive = MathUtils.angleClampDegrees(angle, true);
    let startPositive = MathUtils.angleClampDegrees(start, true);
    let endPositive = MathUtils.angleClampDegrees(end, true);

    if (useShortestAngle) {
        if (MathUtils.angleDistanceSignedDegrees(startPositive, endPositive) < 0) {
            let temp = startPositive;
            startPositive = endPositive;
            endPositive = temp;
        }
    }

    if (startPositive < endPositive) {
        insideAngleRange = anglePositive >= startPositive && anglePositive <= endPositive;
    } else {
        insideAngleRange = anglePositive >= startPositive || anglePositive <= endPositive;
    }

    return insideAngleRange;
}

export function isInsideAngleRangeRadians(angle, start, end, useShortestAngle = false) {
    return MathUtils.isInsideAngleRangeDegrees(MathUtils.toDegrees(angle), MathUtils.toDegrees(start), MathUtils.toDegrees(end), useShortestAngle);
}

export let MathUtils = {
    EPSILON,
    EPSILON_SQUARED,
    EPSILON_DEGREES,
    clamp,
    sign,
    toDegrees,
    toRadians,
    roundDecimal,
    mapToRange,
    random,
    randomInt,
    randomBool,
    randomSign,
    randomPick,
    randomUUID,
    lerp,
    interpolate,
    angleDistance,
    angleDistanceDegrees,
    angleDistanceRadians,
    angleDistanceSigned,
    angleDistanceSignedDegrees,
    angleDistanceSignedRadians,
    angleClamp,
    angleClampDegrees,
    angleClampRadians,
    isInsideAngleRange,
    isInsideAngleRangeDegrees,
    isInsideAngleRangeRadians
};
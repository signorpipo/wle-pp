import { Timer } from "../../../cauldron/cauldron/timer.js";
import { EasingFunction, MathUtils } from "../../../cauldron/utils/math_utils.js";

export class AnimatedNumberParams {
    public myInitialValue: number = 0;

    public myAnimationSeconds: number = 0;
    public myAnimationEasingFunction: EasingFunction = EasingFunction.easeInOut;

    /** 
     * If this value is not `null` it will be used as reference for the `myAnimationSeconds` time, which  
     * will then be considered as the time to reach `myReferenceTargetValue` from `myInitialValue`
     * 
     * This means that when a new target value is specified, the time to reach it will automatically be computed  
     * based on this value, while if this value is `null` it will always take the same time (specified with `myAnimationSeconds`)  
     * no matter how far or close the target value is from the current value
    */
    public myReferenceTargetValue: number | null = null;

    /**
     * When setting a new target value, if the animated number still has to reach the old target, do not restart
     * the animation towards the new target from the start of the easing curve, but continue from the current point,
     * but take the new computed time as the time to reach the end of the easing curve.
     * This make it so the "velocity" of the number is kept even when the target changes.
     * 
     * This settings is applid only if {@link myReferenceTargetValue} is specified
     */
    public myKeepAnimationEasingProgressOnTargetUpdate: boolean = true;

    /** `Math.round` / `Math.floor` / `Math.ceil` can be used */
    public myRoundingFunction: ((valueToRound: number) => number) | null = null;
}

export class AnimatedNumber {
    private readonly _myParams: AnimatedNumberParams;

    private _myCurrentValue: number = 0;
    private _myStartValue: number = 0;
    private _myTargetValue: number = 0;

    private readonly _myAnimationTimer: Timer = new Timer(0, false);

    private readonly _myEasingFunction: (valueToEase: number) => number = this._easingFunction.bind(this);
    private _myEasingStartValueToUse: number = 0;
    private _myEasingNextStartValueToUse: number = 0;

    constructor(params: Readonly<AnimatedNumberParams>) {
        this._myParams = params;

        this._myCurrentValue = this._myParams.myInitialValue;
        this._myStartValue = this._myParams.myInitialValue;
        this._myTargetValue = this._myParams.myInitialValue;

        this._myAnimationTimer.reset(this._myParams.myAnimationSeconds);
    }

    public update(dt: number): void {
        if (this._myAnimationTimer.isRunning()) {
            this._myAnimationTimer.update(dt);

            const animationPercentage = this._myAnimationTimer.getPercentage();
            this._myCurrentValue = MathUtils.interpolate(this._myStartValue, this._myTargetValue!, animationPercentage, this._myEasingFunction);
        }
    }

    public getParams(): AnimatedNumberParams {
        return this._myParams;
    }

    public getCurrentValue(): number {
        return this._myCurrentValue;
    }

    public getStartValue(): number {
        return this._myStartValue;
    }

    public getTargetValue(): number {
        return this._myTargetValue;
    }

    public setTargetValue(targetValue: number, forceSet: boolean = false): void {
        if (this._myTargetValue == targetValue && !forceSet) return;

        this._myTargetValue = targetValue;

        if (this._myParams.myReferenceTargetValue == null) {
            this._myStartValue = this._myCurrentValue;

            this._myAnimationTimer.start(this._myParams.myAnimationSeconds);
        } else {
            const distanceFromInitialToReference = Math.abs(this._myParams.myReferenceTargetValue - this._myParams.myInitialValue);
            const distanceFromCurrentToTarget = Math.abs(this._myTargetValue - this._myCurrentValue);

            const secondsToReachTarget = (distanceFromCurrentToTarget / distanceFromInitialToReference) * this._myParams.myAnimationSeconds;

            this._myStartValue = this._myCurrentValue;

            if (this._myAnimationTimer.isRunning() && this._myParams.myKeepAnimationEasingProgressOnTargetUpdate) {
                this._myEasingStartValueToUse = this._myEasingNextStartValueToUse;

                const maxValue = 1 - MathUtils.EPSILON;
                if (this._myEasingStartValueToUse >= maxValue || this._myParams.myAnimationEasingFunction(this._myEasingStartValueToUse) >= maxValue) {
                    this._myEasingStartValueToUse = 0;
                }
            } else {
                this._myEasingStartValueToUse = 0;
            }

            this._myAnimationTimer.start(secondsToReachTarget);
        }
    }

    public end(): void {
        this._myAnimationTimer.end();
        this._myCurrentValue = MathUtils.interpolate(this._myStartValue, this._myTargetValue!, 1, this._myEasingFunction);
    }

    public isDone(): boolean {
        return this._myAnimationTimer.isDone();
    }

    private _easingFunction(valueToEase: number): number {
        const adjustedValueToEase = MathUtils.mapToRange(valueToEase, 0, 1, this._myEasingStartValueToUse, 1);
        this._myEasingNextStartValueToUse = adjustedValueToEase;
        const easedValue = this._myParams.myAnimationEasingFunction(adjustedValueToEase);
        return MathUtils.mapToRange(easedValue, this._myParams.myAnimationEasingFunction(this._myEasingStartValueToUse), 1, 0, 1);
    }
}
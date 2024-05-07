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

    /** `Math.round` / `Math.floor` / `Math.ceil` can be used */
    public myRoundingFunction: ((valueToRound: number) => number) | null = null;
}

export class AnimatedNumber {
    private readonly _myParams: Readonly<AnimatedNumberParams>;

    private _myCurrentValue: number = 0;
    private _myStartValue: number = 0;
    private _myTargetValue: number = 0;

    private _myAnimationTimer: Timer = new Timer(0, false);

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
            this._myCurrentValue = MathUtils.interpolate(this._myStartValue, this._myTargetValue, animationPercentage, this._myParams.myAnimationEasingFunction);
        }
    }

    public getCurrentValue(): number {
        return this._myCurrentValue;
    }

    public updateTargetValue(targetValue: number): void {
        this._myTargetValue = targetValue;

        if (this._myParams.myReferenceTargetValue == null) {
            this._myStartValue = this._myCurrentValue;

            this._myAnimationTimer.start();
        } else {
            const distanceFromInitialToReference = Math.abs(this._myParams.myReferenceTargetValue - this._myParams.myInitialValue);
            const distanceFromCurrentToTarget = Math.abs(this._myTargetValue - this._myCurrentValue);

            const secondsToReachTarget = (distanceFromCurrentToTarget / distanceFromInitialToReference) * this._myParams.myAnimationSeconds;

            this._myStartValue = this._myCurrentValue;

            this._myAnimationTimer.start(secondsToReachTarget);
        }
    }

    public isDone(): boolean {
        return this._myAnimationTimer.isDone();
    }
}
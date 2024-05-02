import { EasingFunction } from "wle-pp/cauldron/utils/math_utils.js";

export class AnimatedNumberParams {
    public myInitialValue: number = 0;

    public myAnimationSeconds: number = 0;
    public myAnimationEasingFunction: EasingFunction = EasingFunction.easeInOut;

    /** 
     * If this value is not `null` it will be used as reference for the `myAnimationSeconds` time, which 
     * will then be considered as the time to reach `myReferenceTargetValue`
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

    private _myDone: boolean = true;

    constructor(params: Readonly<AnimatedNumberParams>) {
        this._myParams = params;
    }

    public update(dt: number): void {

    }

    public setTarget(targetValue: number): void {

    }

    public isDone(): boolean {
        return this._myDone;
    }
}
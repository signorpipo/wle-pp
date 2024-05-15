import { FSM, StateData, TransitionData } from "../../fsm.js";

export abstract class BaseConditionState {

    private _myConditionCallback: () => boolean;

    private _myTransitionToPerformOnEnd: unknown;
    private _myTransitionArgs: unknown[];

    constructor(conditionCallback: () => boolean, transitionToPerformOnEnd: unknown, ...transitionArgs: unknown[]) {
        this._myConditionCallback = conditionCallback;

        this._myTransitionToPerformOnEnd = transitionToPerformOnEnd;
        this._myTransitionArgs = transitionArgs;
    }

    public setTransitionToPerformOnEnd(transitionToPerformOnEnd: unknown, ...transitionArgs: unknown[]): void {
        this._myTransitionToPerformOnEnd = transitionToPerformOnEnd;
        this._myTransitionArgs = transitionArgs;
    }

    protected _setConditionCallback(conditionCallback: () => boolean): void {
        this._myConditionCallback = conditionCallback;
    }

    protected _update(dt: number, fsm: FSM): void {
        if (this._myConditionCallback()) {
            if (this._myTransitionToPerformOnEnd != null) {
                fsm.perform(this._myTransitionToPerformOnEnd, ...this._myTransitionArgs);
            }
        }
    }

    protected _start(fsm: FSM, transitionData: Readonly<TransitionData>, conditionCallback?: () => boolean, transitionToPerformOnEnd?: unknown, ...transitionArgs: unknown[]): void {
        if (conditionCallback != null) {
            this._myConditionCallback = conditionCallback;
        }

        if (transitionToPerformOnEnd != null) {
            this._myTransitionToPerformOnEnd = transitionToPerformOnEnd;
            this._myTransitionArgs = transitionArgs;
        }
    }

    protected _init(fsm: FSM, stateData: Readonly<StateData>, conditionCallback?: () => boolean, transitionToPerformOnEnd?: unknown, ...transitionArgs: unknown[]): void {
        if (conditionCallback != null) {
            this._myConditionCallback = conditionCallback;
        }

        if (transitionToPerformOnEnd != null) {
            this._myTransitionToPerformOnEnd = transitionToPerformOnEnd;
            this._myTransitionArgs = transitionArgs;
        }
    }
}
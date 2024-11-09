import { FSM, StateData, TransitionData } from "../../fsm.js";
import { State } from "../../state.js";
import { BaseConditionState } from "./base_condition_state.js";

export class FramesCountdownState extends BaseConditionState implements State {

    private _myFramesCountdown: number;
    private _myCurrentFramesCountdown: number;

    constructor(framesCountdown: number = 0, transitionToPerformOnEnd: unknown, ...transitionArgs: unknown[]) {
        super(() => this._myCurrentFramesCountdown <= 0, transitionToPerformOnEnd, ...transitionArgs);

        this._myFramesCountdown = framesCountdown;
        this._myCurrentFramesCountdown = this._myFramesCountdown;
    }

    public setFramesCountdown(framesCountdown: number): void {
        this._myFramesCountdown = framesCountdown;
        this._myCurrentFramesCountdown = this._myFramesCountdown;
    }

    public update(dt: number, fsm: FSM): void {
        if (this._myCurrentFramesCountdown > 0) {
            this._myCurrentFramesCountdown--;
        }

        super._update(dt, fsm);
    }

    public start(fsm: FSM, transitionData: Readonly<TransitionData>, duration?: number, transitionToPerformOnEnd?: unknown, ...transitionArgs: unknown[]): void {
        this._myCurrentFramesCountdown = this._myFramesCountdown;

        super._start(fsm, transitionData, undefined, transitionToPerformOnEnd, ...transitionArgs);
    }

    public init(fsm: FSM, stateData: Readonly<StateData>, duration?: number, transitionToPerformOnEnd?: unknown, ...transitionArgs: unknown[]): void {
        this._myCurrentFramesCountdown = this._myFramesCountdown;

        super._init(fsm, stateData, undefined, transitionToPerformOnEnd, ...transitionArgs);
    }
}
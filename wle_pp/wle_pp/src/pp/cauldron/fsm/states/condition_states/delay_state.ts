import { Timer } from "../../../cauldron/timer.js";
import { FSM, StateData, TransitionData } from "../../fsm.js";
import { State } from "../../state.js";
import { BaseConditionState } from "./base_condition_state.js";

export class DelayState extends BaseConditionState implements State {

    private readonly _myTimer: Timer;

    private _myFramesCountdown: number;
    private _myCurrentFramesCountdown: number;

    private _myUpdateTimerAfterFramesCountdown: boolean;

    constructor(duration: number = 0, framesCountdown: number = 0, updateTimerAfterFramesCountdown: boolean = true, transitionToPerformOnEnd: unknown, ...transitionArgs: unknown[]) {
        super(() => this._myCurrentFramesCountdown <= 0 && this._myTimer.isDone(), transitionToPerformOnEnd, ...transitionArgs);

        this._myTimer = new Timer(duration, false);

        this._myFramesCountdown = framesCountdown;
        this._myCurrentFramesCountdown = this._myFramesCountdown;

        this._myUpdateTimerAfterFramesCountdown = updateTimerAfterFramesCountdown;
    }

    public setUpdateTimerAfterFramesCountdown(updateTimerAfterFramesCountdown: boolean): void {
        this._myUpdateTimerAfterFramesCountdown = updateTimerAfterFramesCountdown;
    }

    public setDuration(duration: number): void {
        this._myTimer.setDuration(duration);
    }

    public setFramesCountdown(framesCountdown: number): void {
        this._myFramesCountdown = framesCountdown;
        this._myCurrentFramesCountdown = this._myFramesCountdown;
    }

    public update(dt: number, fsm: FSM): void {
        if (this._myCurrentFramesCountdown > 0) {
            this._myCurrentFramesCountdown--;
        }

        if (!this._myUpdateTimerAfterFramesCountdown || this._myCurrentFramesCountdown <= 0) {
            this._myTimer.update(dt);
        }

        super._update(dt, fsm);
    }

    public start(fsm: FSM, transitionData: Readonly<TransitionData>, duration?: number, transitionToPerformOnEnd?: unknown, ...transitionArgs: unknown[]): void {
        this._myTimer.start(duration);
        this._myCurrentFramesCountdown = this._myFramesCountdown;

        super._start(fsm, transitionData, undefined, transitionToPerformOnEnd, ...transitionArgs);
    }

    public init(fsm: FSM, stateData: Readonly<StateData>, duration?: number, transitionToPerformOnEnd?: unknown, ...transitionArgs: unknown[]): void {
        this._myTimer.start(duration);
        this._myCurrentFramesCountdown = this._myFramesCountdown;

        super._init(fsm, stateData, undefined, transitionToPerformOnEnd, ...transitionArgs);
    }
}
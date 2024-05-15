import { FSM, StateData, TransitionData } from "../../fsm.js";
import { State } from "../../state.js";

/**
 * This state calls the `branchCallback` function every `update` and if it returns a value different from `null` 
 * will perform a transition using that value as `transitionID`
 * 
 * If you want to also forward args for the transition, you have you to return the transition as an array  
 * where the first item is the `transitionID` and the second one are the arguments: `[transitionID, [argument1, argument2, ...]]`
 */
export class BranchState implements State {

    private _myBranchCallback: () => unknown | [unknown, unknown[]];

    constructor(branchCallback: () => unknown | [unknown, unknown[]]) {
        this._myBranchCallback = branchCallback;
    }

    public setBranchCallback(branchCallback: () => unknown | [unknown, unknown[]]): void {
        this._myBranchCallback = branchCallback;
    }

    public update(dt: number, fsm: FSM): void {
        const branchResult = this._myBranchCallback();
        if (branchResult != null) {
            if (Array.isArray(branchResult) && branchResult.length == 2) {
                fsm.perform(branchResult[0], ...branchResult[1]);
            } else {
                fsm.perform(branchResult);
            }
        }
    }

    public start(fsm: FSM, transitionData: Readonly<TransitionData>, branchCallback?: () => unknown | [unknown, unknown[]]): void {
        if (branchCallback != null) {
            this._myBranchCallback = branchCallback;
        }
    }

    public init(fsm: FSM, stateData: Readonly<StateData>, branchCallback?: () => boolean): void {
        if (branchCallback != null) {
            this._myBranchCallback = branchCallback;
        }
    }
}
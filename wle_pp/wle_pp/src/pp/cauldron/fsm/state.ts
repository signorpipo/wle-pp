import { FSM, StateData, TransitionData } from "./fsm.js";

/**
 * There is no need to implements this state, especially since states can simply be functions  
 * It's more like an example of what is needed
 * 
 * If you don't specify some functions the fsm will just skip them
 *
 * The param `stateData` is of type `StateData` and can be used to retrieve the `stateID` and other data  
 * The param `transitionData` is of type `TransitionData` and can be used to retrieve the `transitionID`, the from and to states and other data
 */
export interface State {

    /** Called every frame if this is the current state */
    update?(dt: number, fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]): void;

    /** Called when entering this state if no transition object is specified or it does not have a perform function  
        You can get this state data through the `transitionData` param */
    start?(fsm: FSM, transitionData: Readonly<TransitionData>, ...args: unknown[]): void;

    /** Called when exiting this state if no transition function is specified
        You can get this state data through the `transitionData` param */
    end?(fsm: FSM, transitionData: Readonly<TransitionData>, ...args: unknown[]): void;

    /** Called when the fsm is started with this init state if no init transition object is specified or it does not have a `performInit` function */
    init?(fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]): void;

    /** Used when the FSM is deep cloned */
    clone?(): State;
}
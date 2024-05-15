import { FSM, StateData, TransitionData } from "./fsm.js";

/**
 * There is no need to inherit from this transition, especially since transitions can simply be functions  
 * It's more like an example of what is needed
 * 
 * If you don't specify some functions the fsm will just skip them
 * 
 * The `stateData` param is of type `StateData` and can be used to retrieve the `stateID` and other data  
 * The param `transitionData` is of type `TransitionData` and can be used to retrieve the `transitionID` and other data
 */
export interface Transition {

    /** Called when performing a transition
        You can find the from and to states inside the `transitionData` param*/
    perform?(fsm: FSM, transitionData: Readonly<TransitionData>, ...args: unknown[]): void;

    /** Called if this is used as an init transition for the fsm */
    performInit?(fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]): void;

    /** Used when the FSM is deep cloned */
    clone?(): Transition;
}
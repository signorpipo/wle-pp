/*
    There is no need to inherit from this state, especially since states can be only functions
    It's more like an example of what is needed
    
    If you don't specify some functions the fsm will just skip them
    Or consider them always valid

    The param state is of type StateData and can be used to retrieve the stateID and other data
    The param transition is of type TransitionData and can be used to retrieve the transitionID, the from and to states and other data
*/

export class State {

    // Called every frame if this is the current state
    // You can retrieve this state data by calling fsm.getCurrentState()
    update(dt, fsm, ...args) {
    }

    // Called when the fsm is started with this init state if no init transition object is specified or it does not have a performInit function
    // Since the state is set as the current one after the init, you can't use fsm.getCurrentState() to get it, so it is forwarded as a param if needed
    init(fsm, state, ...args) {
    }

    // Called when entering this state if no transition object is specified or it does not have a perform function
    // You can get this state data by accesing to the to state data inside the transition
    start(fsm, transition, ...args) {
    }

    // Called when exiting this state if no transition function is specified
    // You can get this state data by accesing to the from state data inside the transition
    end(fsm, transition, ...args) {
    }
}
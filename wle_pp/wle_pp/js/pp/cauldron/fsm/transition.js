/*
    There is no need to inherit from this transition, especially since states can be only transitions
    It's more like an example of what is needed
    
    The param transition (forwarded at the end every function) is of type PP.TransitionData and can be used to retrieve the transitionID and other data
    The initState param is of type PP.StateData and can be used to retrieve the stateID and other data
*/

PP.Transition = class Transition {

    //Called if this is used as an init transition for the fsm
    performInit(fsm, initState, ...args) {

    }

    //Called when performing a transition
    //You can find the from and to states inside the transition params
    perform(fsm, transition, ...args) {
    }

};
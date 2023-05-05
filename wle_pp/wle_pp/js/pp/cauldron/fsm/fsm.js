/*
    You can also use plain functions for state/transition if u want to do something simple and quick

    Signatures:
        function stateUpdate(dt, fsm)
        function init(fsm, initStateData)
        function transition(fsm, transitionData)
*/

import { Emitter } from "@wonderlandengine/api";

export class StateData {

    constructor(stateID, stateObject) {
        this.myID = stateID;
        this.myObject = stateObject;
    }
}

export class TransitionData {

    constructor(transitionID, fromStateData, toStateData, transitionObject, skipStateFunction) {
        this.myID = transitionID;
        this.myFromState = fromStateData;
        this.myToState = toStateData;
        this.myObject = transitionObject;
        this.mySkipStateFunction = skipStateFunction;
    }
}

export let PerformMode = {
    IMMEDIATE: 0,
    DELAYED: 1
};

export let PerformDelayedMode = {
    QUEUE: 0,
    KEEP_FIRST: 1,
    KEEP_LAST: 2
};

export let SkipStateFunction = {
    NONE: 0,
    END: 1,
    START: 2,
    BOTH: 3
};

export class FSM {

    constructor(performMode = PerformMode.IMMEDIATE, performDelayedMode = PerformDelayedMode.QUEUE) {
        this._myCurrentStateData = null;

        this._myStates = new Map();
        this._myTransitions = new Map();

        this._myLogEnabled = false;
        this._myLogShowDelayedInfo = false;
        this._myLogFSMName = "FSM";

        this._myPerformMode = performMode;
        this._myPerformDelayedMode = performDelayedMode;
        this._myPendingPerforms = [];
        this._myCurrentlyPerformedTransition = null;

        this._myInitEmitter = new Emitter();             // Signature: listener(fsm, initStateData, initTransitionObject, ...args)
        this._myInitIDEmitters = new Map();              // Signature: listener(fsm, initStateData, initTransitionObject, ...args)
        this._myTransitionEmitter = new Emitter();       // Signature: listener(fsm, fromStateData, toStateData, transitionData, performMode, ...args)
        this._myTransitionIDEmitters = [];               // Signature: listener(fsm, fromStateData, toStateData, transitionData, performMode, ...args)
    }

    addState(stateID, state = null) {
        let stateObject = null;
        if (!state || typeof state == "function") {
            stateObject = {};
            if (typeof state == "function") {
                stateObject.update = function update() { return state(...arguments); };
            } else {
                stateObject.update = null;
            }
            stateObject.clone = function clone() {
                let cloneObject = {};
                cloneObject.update = this.update;
                cloneObject.clone = this.clone;
                return cloneObject;
            };
        } else {
            stateObject = state;
        }

        let stateData = new StateData(stateID, stateObject);
        this._myStates.set(stateID, stateData);
        this._myTransitions.set(stateID, new Map());
    }

    addTransition(fromStateID, toStateID, transitionID, transition = null, skipStateFunction = SkipStateFunction.NONE) {
        let transitionObject = null;
        if (!transition || typeof transition == "function") {
            transitionObject = {};
            if (typeof transition == "function") {
                transitionObject.perform = function perform() { return transition(...arguments); };
            } else {
                transitionObject.perform = null;
            }
            transitionObject.clone = function clone() {
                let cloneObject = {};
                cloneObject.perform = this.perform;
                cloneObject.clone = this.clone;
                return cloneObject;
            };
        } else {
            transitionObject = transition;
        }

        if (this.hasState(fromStateID) && this.hasState(toStateID)) {
            let transitionsFromState = this._getTransitionsFromState(fromStateID);

            let transitionData = new TransitionData(transitionID, this.getState(fromStateID), this.getState(toStateID), transitionObject, skipStateFunction);
            transitionsFromState.set(transitionID, transitionData);
        } else {
            if (!this.hasState(fromStateID) && !this.hasState(toStateID)) {
                console.error("Can't add transition:", transitionID, "- from state not found:", fromStateID, "- to state not found:", toStateID);
            } else if (!this.hasState(fromStateID)) {
                console.error("Can't add transition:", transitionID, "- from state not found:", fromStateID);
            } else if (!this.hasState(toStateID)) {
                console.error("Can't add transition:", transitionID, "- to state not found:", toStateID);
            }
        }
    }

    init(initStateID, initTransition = null, ...args) {
        let initTransitionObject = initTransition;
        if (initTransition && typeof initTransition == "function") {
            initTransitionObject = {};
            initTransitionObject.performInit = initTransition;
        }

        if (this.hasState(initStateID)) {
            let initStateData = this._myStates.get(initStateID);

            if (this._myLogEnabled) {
                console.log(this._myLogFSMName, "- Init:", initStateID);
            }

            if (initTransitionObject && initTransitionObject.performInit) {
                initTransitionObject.performInit(this, initStateData, ...args);
            } else if (initStateData.myObject && initStateData.myObject.init) {
                initStateData.myObject.init(this, initStateData, ...args);
            }

            this._myCurrentStateData = initStateData;

            this._myInitEmitter.notify(this, initStateData, initTransitionObject, ...args);

            if (this._myInitIDEmitters.size > 0) {
                let emitter = this._myInitIDEmitters.get(initStateID);
                if (emitter != null) {
                    emitter.notify(this, initStateData, initTransitionObject, ...args);
                }
            }
        } else if (this._myLogEnabled) {
            console.warn(this._myLogFSMName, "- Init state not found:", initStateID);
        }
    }

    update(dt, ...args) {
        if (this._myPendingPerforms.length > 0) {
            for (let i = 0; i < this._myPendingPerforms.length; i++) {
                this._perform(this._myPendingPerforms[i].myID, PerformMode.DELAYED, ...this._myPendingPerforms[i].myArgs);
            }
            this._myPendingPerforms = [];
        }

        if (this._myCurrentStateData && this._myCurrentStateData.myObject && this._myCurrentStateData.myObject.update) {
            this._myCurrentStateData.myObject.update(dt, this, ...args);
        }
    }

    perform(transitionID, ...args) {
        if (this._myPerformMode == PerformMode.DELAYED) {
            this.performDelayed(transitionID, ...args);
        } else {
            this.performImmediate(transitionID, ...args);
        }
    }

    performDelayed(transitionID, ...args) {
        let performDelayed = false;

        switch (this._myPerformDelayedMode) {
            case PerformDelayedMode.QUEUE:
                this._myPendingPerforms.push(new _PendingPerform(transitionID, ...args));
                performDelayed = true;
                break;
            case PerformDelayedMode.KEEP_FIRST:
                if (!this.hasPendingPerforms()) {
                    this._myPendingPerforms.push(new _PendingPerform(transitionID, ...args));
                    performDelayed = true;
                }
                break;
            case PerformDelayedMode.KEEP_LAST:
                this.resetPendingPerforms();
                this._myPendingPerforms.push(new _PendingPerform(transitionID, ...args));
                performDelayed = true;
                break;
        }

        return performDelayed;
    }

    performImmediate(transitionID, ...args) {
        return this._perform(transitionID, PerformMode.IMMEDIATE, ...args);
    }

    canPerform(transitionID) {
        return this.hasTransitionFromState(this._myCurrentStateData.myID, transitionID);
    }

    canGoTo(stateID, transitionID = null) {
        return this.hasTransitionFromStateToState(this._myCurrentStateData.myID, stateID, transitionID);
    }

    isInState(stateID) {
        return this._myCurrentStateData != null && this._myCurrentStateData.myID == stateID;
    }

    isPerformingTransition() {
        return this._myCurrentlyPerformedTransition != null;
    }

    getCurrentlyPerformedTransition() {
        return this._myCurrentlyPerformedTransition;
    }

    hasBeenInit() {
        return this._myCurrentStateData != null;
    }

    reset() {
        this.resetState();
        this.resetPendingPerforms();
    }

    resetState() {
        this._myCurrentStateData = null;
    }

    resetPendingPerforms() {
        this._myPendingPerforms = [];
    }

    getCurrentState() {
        return this._myCurrentStateData;
    }

    getCurrentTransitions() {
        return this.getTransitionsFromState(this._myCurrentStateData.myID);
    }

    getCurrentTransitionsToState(stateID) {
        return this.getTransitionsFromStateToState(this._myCurrentStateData.myID, stateID);
    }

    getState(stateID) {
        return this._myStates.get(stateID);
    }

    getStates() {
        return this._myStates.values();
    }

    getTransitions() {
        let transitions = [];

        for (let transitionsFromState of this._myTransitions.values()) {
            for (let transitionData of transitionsFromState.values()) {
                transitions.push(transitionData);
            }
        }

        return transitions;
    }

    getTransitionsFromState(fromStateID) {
        let transitionsFromState = this._getTransitionsFromState(fromStateID);
        return Array.from(transitionsFromState.values());
    }

    getTransitionsFromStateToState(fromStateID, toStateID) {
        let transitionsFromState = this._getTransitionsFromState(fromStateID);

        let transitionsToState = [];
        for (let transitionData of transitionsFromState.values()) {
            if (transitionData.myToState.myID == toStateID) {
                transitionsToState.push(transitionData);
            }
        }

        return transitionsToState;
    }

    removeState(stateID) {
        if (this.hasState(stateID)) {
            this._myStates.delete(stateID);
            this._myTransitions.delete(stateID);

            for (let transitionsFromState of this._myTransitions.values()) {
                let toDelete = [];
                for (let [transitionID, transitionData] of transitionsFromState.entries()) {
                    if (transitionData.myToState.myID == stateID) {
                        toDelete.push(transitionID);
                    }
                }

                for (let transitionID of toDelete) {
                    transitionsFromState.delete(transitionID);
                }
            }

            return true;
        }
        return false;
    }

    removeTransitionFromState(fromStateID, transitionID) {
        let fromTransitions = this._getTransitionsFromState(fromStateID);
        if (fromTransitions) {
            return fromTransitions.delete(transitionID);
        }

        return false;
    }

    hasState(stateID) {
        return this._myStates.has(stateID);
    }

    hasTransitionFromState(fromStateID, transitionID) {
        let transitions = this.getTransitionsFromState(fromStateID);

        let transitionIndex = transitions.findIndex(function (transition) {
            return transition.myID == transitionID;
        });

        return transitionIndex >= 0;
    }

    hasTransitionFromStateToState(fromStateID, toStateID, transitionID = null) {
        let transitions = this.getTransitionsFromStateToState(fromStateID, toStateID);

        let hasTransition = false;
        if (transitionID) {
            let transitionIndex = transitions.findIndex(function (transition) {
                return transition.myID == transitionID;
            });

            hasTransition = transitionIndex >= 0;
        } else {
            hasTransition = transitions.length > 0;
        }

        return hasTransition;
    }

    setPerformMode(performMode) {
        this._myPerformMode = performMode;
    }

    getPerformMode() {
        return this._myPerformMode;
    }

    setPerformDelayedMode(performDelayedMode) {
        this._myPerformDelayedMode = performDelayedMode;
    }

    getPerformDelayedMode() {
        return this._myPerformDelayedMode;
    }

    hasPendingPerforms() {
        return this._myPendingPerforms.length > 0;
    }

    getPendingPerforms() {
        return this._myPendingPerforms.pp_clone();
    }

    clone(deepClone = false) {
        if (!this.isCloneable(deepClone)) {
            return null;
        }

        let cloneFSM = new FSM();

        cloneFSM._myLogEnabled = this._myLogEnabled;
        cloneFSM._myLogShowDelayedInfo = this._myLogShowDelayedInfo;
        cloneFSM._myLogFSMName = this._myLogFSMName.slice(0);

        cloneFSM._myPerformMode = this._myPerformMode;
        cloneFSM._myPerformDelayedMode = this._myPerformDelayedMode;
        cloneFSM._myPendingPerforms = this._myPendingPerforms.pp_clone();

        for (let entry of this._myStates.entries()) {
            let stateData = null;

            if (deepClone) {
                stateData = new StateData(entry[1].myID, entry[1].myObject.clone());
            } else {
                stateData = new StateData(entry[1].myID, entry[1].myObject);
            }

            cloneFSM._myStates.set(stateData.myID, stateData);
        }

        for (let entry of this._myTransitions.entries()) {
            let transitionsFromState = new Map();
            cloneFSM._myTransitions.set(entry[0], transitionsFromState);

            for (let transitonEntry of entry[1].entries()) {
                let transitionData = null;

                let fromState = cloneFSM.getState(transitonEntry[1].myFromState.myID);
                let toState = cloneFSM.getState(transitonEntry[1].myToState.myID);

                if (deepClone) {
                    transitionData = new TransitionData(transitonEntry[1].myID, fromState, toState, transitonEntry[1].myObject.clone(), transitonEntry[1].mySkipStateFunction);
                } else {
                    transitionData = new TransitionData(transitonEntry[1].myID, fromState, toState, transitonEntry[1].myObject, transitonEntry[1].mySkipStateFunction);
                }

                transitionsFromState.set(transitionData.myID, transitionData);
            }
        }

        if (this._myCurrentStateData) {
            cloneFSM._myCurrentStateData = cloneFSM.getState(this._myCurrentStateData.myID);
        }

        return cloneFSM;
    }

    isCloneable(deepClone = false) {
        if (!deepClone) {
            return true;
        }

        let deepCloneable = true;

        for (let entry of this._myStates.entries()) {
            deepCloneable = deepCloneable && entry[1].myObject.clone != null;
        }

        for (let entry of this._myTransitions.entries()) {
            for (let transitonEntry of entry[1].entries()) {
                deepCloneable = deepCloneable && transitonEntry[1].myObject.clone != null;
            }
        }

        return deepCloneable;
    }

    setLogEnabled(active, fsmName = null, showDelayedInfo = false) {
        this._myLogEnabled = active;
        this._myLogShowDelayedInfo = showDelayedInfo;
        if (fsmName) {
            this._myLogFSMName = "FSM: ".concat(fsmName);
        }
    }

    registerInitEventListener(listenerID, listener) {
        this._myInitEmitter.add(listener, { id: listenerID });
    }

    unregisterInitEventListener(listenerID) {
        this._myInitEmitter.remove(listenerID);
    }

    registerInitIDEventListener(initStateID, listenerID, listener) {
        let initStateIDEmitter = this._myInitIDEmitters.get(initStateID);
        if (initStateIDEmitter == null) {
            this._myInitIDEmitters.set(initStateID, new Emitter());
            initStateIDEmitter = this._myInitIDEmitters.get(initStateID);
        }

        initStateIDEmitter.add(listener, { id: listenerID });
    }

    unregisterInitIDEventListener(initStateID, listenerID) {
        let initStateIDEmitter = this._myInitIDEmitters.get(initStateID);
        if (initStateIDEmitter != null) {
            initStateIDEmitter.remove(listenerID);

            if (initStateIDEmitter.pp_isEmpty()) {
                this._myInitIDEmitters.delete(initStateID);
            }
        }
    }

    registerTransitionEventListener(listenerID, listener) {
        this._myTransitionEmitter.add(listener, { id: listenerID });
    }

    unregisterTransitionEventListener(listenerID) {
        this._myTransitionEmitter.remove(listenerID);
    }

    // The fsm IDs can be null, that means that the listener is called whenever only the valid IDs match
    // This let you register to all the transitions with a specific ID and from of a specific state but to every state (toStateID == null)
    registerTransitionIDEventListener(fromStateID, toStateID, transitionID, listenerID, listener) {
        let internalTransitionIDEmitter = null;
        for (let value of this._myTransitionIDEmitters) {
            if (value[0] == fromStateID && value[1] == toStateID && value[2] == transitionID) {
                internalTransitionIDEmitter = value[3];
                break;
            }
        }

        if (internalTransitionIDEmitter == null) {
            let transitionIDEmitter = [];
            transitionIDEmitter[0] = fromStateID;
            transitionIDEmitter[1] = toStateID;
            transitionIDEmitter[2] = transitionID;
            transitionIDEmitter[3] = new Emitter();

            internalTransitionIDEmitter = transitionIDEmitter[3];

            this._myTransitionIDEmitters.push(transitionIDEmitter);
        }

        internalTransitionIDEmitter.add(listener, { id: listenerID });
    }

    unregisterTransitionIDEventListener(fromStateID, toStateID, transitionID, listenerID) {
        let internalTransitionIDEmitter = null;
        for (let value of this._myTransitionIDEmitters) {
            if (value[0] == fromStateID && value[1] == toStateID && value[2] == transitionID) {
                internalTransitionIDEmitter = value[3];
                break;
            }
        }

        if (internalTransitionIDEmitter != null) {
            internalTransitionIDEmitter.remove(listenerID);

            if (internalTransitionIDEmitter.pp_isEmpty()) {
                this._myTransitionIDEmitters.pp_remove(element => element[0] == fromStateID && element[1] == toStateID && element[2] == transitionID);
            }
        }
    }

    _perform(transitionID, performMode, ...args) {
        if (this.isPerformingTransition()) {
            let currentlyPerformedTransition = this.getCurrentlyPerformedTransition();
            let consoleArguments = [this._myLogFSMName, "- Trying to perform:", transitionID];
            if (this._myLogShowDelayedInfo) {
                consoleArguments.push(performMode == PerformMode.DELAYED ? "- Delayed" : "- Immediate");
            }
            consoleArguments.push("- But another transition is currently being performed -", currentlyPerformedTransition.myID);
            console.warn(...consoleArguments);

            return false;
        }

        if (this._myCurrentStateData) {
            if (this.canPerform(transitionID)) {
                let transitions = this._myTransitions.get(this._myCurrentStateData.myID);
                let transitionToPerform = transitions.get(transitionID);

                this._myCurrentlyPerformedTransition = transitionToPerform;

                let fromState = this._myCurrentStateData;
                let toState = this._myStates.get(transitionToPerform.myToState.myID);

                if (this._myLogEnabled) {
                    let consoleArguments = [this._myLogFSMName, "- From:", fromState.myID, "- To:", toState.myID, "- With:", transitionID];
                    if (this._myLogShowDelayedInfo) {
                        consoleArguments.push(performMode == PerformMode.DELAYED ? "- Delayed" : "- Immediate");
                    }
                    console.log(...consoleArguments);
                }

                if (transitionToPerform.mySkipStateFunction != SkipStateFunction.END && transitionToPerform.mySkipStateFunction != SkipStateFunction.BOTH &&
                    fromState.myObject && fromState.myObject.end) {
                    fromState.myObject.end(this, transitionToPerform, ...args);
                }

                if (transitionToPerform.myObject && transitionToPerform.myObject.perform) {
                    transitionToPerform.myObject.perform(this, transitionToPerform, ...args);
                }

                if (transitionToPerform.mySkipStateFunction != SkipStateFunction.START && transitionToPerform.mySkipStateFunction != SkipStateFunction.BOTH &&
                    toState.myObject && toState.myObject.start) {
                    toState.myObject.start(this, transitionToPerform, ...args);
                }

                this._myCurrentStateData = transitionToPerform.myToState;

                this._myTransitionEmitter.notify(this, fromState, toState, transitionToPerform, performMode, ...args);

                if (this._myTransitionIDEmitters.length > 0) {
                    let internalTransitionIDEmitters = [];
                    for (let value of this._myTransitionIDEmitters) {
                        if ((value[0] == null || value[0] == fromState.myID) &&
                            (value[1] == null || value[1] == toState.myID) &&
                            (value[2] == null || value[2] == transitionToPerform.myID)) {
                            internalTransitionIDEmitters.push(value[3]);
                        }
                    }

                    for (let emitter of internalTransitionIDEmitters) {
                        emitter.notify(this, fromState, toState, transitionToPerform, performMode, ...args);
                    }
                }

                this._myCurrentlyPerformedTransition = null;

                return true;
            } else if (this._myLogEnabled) {
                let consoleArguments = [this._myLogFSMName, "- No Transition:", transitionID, "- From:", this._myCurrentStateData.myID];
                if (this._myLogShowDelayedInfo) {
                    consoleArguments.push(performMode == PerformMode.DELAYED ? "- Delayed" : "- Immediate");
                }
                console.warn(...consoleArguments);
            }
        } else if (this._myLogEnabled) {
            let consoleArguments = [this._myLogFSMName, "- FSM not initialized yet"];
            if (this._myLogShowDelayedInfo) {
                consoleArguments.push(performMode == PerformMode.DELAYED ? "- Delayed" : "- Immediate");
            }
            console.warn(...consoleArguments);
        }

        return false;
    }

    _getTransitionsFromState(fromStateID) {
        return this._myTransitions.get(fromStateID);
    }
}

class _PendingPerform {

    constructor(transitionID, ...args) {
        this.myID = transitionID;
        this.myArgs = args;
    }
}
/*
    You can also use plain functions for state/transition if u want to do something simple and quick

    Signatures:
        function stateUpdate(dt, fsm)
        function init(fsm, initStateData)
        function transition(fsm, transitionData)
*/

PP.StateData = class StateData {
    constructor(stateID, stateObject) {
        this.myID = stateID;
        this.myObject = stateObject;
    }
};

PP.TransitionData = class TransitionData {
    constructor(transitionID, fromStateData, toStateData, transitionObject, skipStateFunction) {
        this.myID = transitionID;
        this.myFromState = fromStateData;
        this.myToState = toStateData;
        this.myObject = transitionObject;
        this.mySkipStateFunction = skipStateFunction;
    }
};

PP.PendingPerform = class PendingPerform {
    constructor(transitionID, ...args) {
        this.myID = transitionID;
        this.myArgs = args;
    }
};

PP.PerformMode = {
    IMMEDIATE: 0,
    DELAYED: 1
};

PP.PerformDelayedMode = {
    QUEUE: 0,
    KEEP_FIRST: 1,
    KEEP_LAST: 2
};

PP.SkipStateFunction = {
    NONE: 0,
    END: 1,
    START: 2,
    BOTH: 3
};

PP.FSM = class FSM {

    constructor(performMode = PP.PerformMode.IMMEDIATE, performDelayedMode = PP.PerformDelayedMode.QUEUE) {
        this._myCurrentStateData = null;

        this._myStates = new Map();
        this._myTransitions = new Map();

        this._myDebugLogActive = false;
        this._myDebugShowDelayedInfo = false;
        this._myDebugLogName = "FSM";

        this._myPerformMode = performMode;
        this._myPerformDelayedMode = performDelayedMode;
        this._myPendingPerforms = [];
        this._myCurrentlyPerformedTransition = null;

        this._myInitCallbacks = new Map();            // Signature: callback(fsm, initStateData, initTransitionObject, ...args)
        this._myInitIDCallbacks = new Map();          // Signature: callback(fsm, initStateData, initTransitionObject, ...args)
        this._myTransitionCallbacks = new Map();      // Signature: callback(fsm, fromStateData, toStateData, transitionData, performMode, ...args)
        this._myTransitionIDCallbacks = [];           // Signature: callback(fsm, fromStateData, toStateData, transitionData, performMode, ...args)
    }

    addState(stateID, state = null) {
        let stateObject = null;
        if (!state || typeof state == 'function') {
            stateObject = {};
            if (typeof state == 'function') {
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

        let stateData = new PP.StateData(stateID, stateObject);
        this._myStates.set(stateID, stateData);
        this._myTransitions.set(stateID, new Map());
    }

    addTransition(fromStateID, toStateID, transitionID, transition = null, skipStateFunction = PP.SkipStateFunction.NONE) {
        let transitionObject = null;
        if (!transition || typeof transition == 'function') {
            transitionObject = {};
            if (typeof transition == 'function') {
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

            let transitionData = new PP.TransitionData(transitionID, this.getState(fromStateID), this.getState(toStateID), transitionObject, skipStateFunction);
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
        if (initTransition && typeof initTransition == 'function') {
            initTransitionObject = {};
            initTransitionObject.performInit = initTransition;
        }

        if (this.hasState(initStateID)) {
            let initStateData = this._myStates.get(initStateID);

            if (this._myDebugLogActive) {
                console.log(this._myDebugLogName, "- Init:", initStateID);
            }

            if (initTransitionObject && initTransitionObject.performInit) {
                initTransitionObject.performInit(this, initStateData, ...args);
            } else if (initStateData.myObject && initStateData.myObject.init) {
                initStateData.myObject.init(this, initStateData, ...args);
            }

            this._myCurrentStateData = initStateData;

            if (this._myInitCallbacks.size > 0) {
                this._myInitCallbacks.forEach(function (callback) { callback(this, initStateData, initTransitionObject, ...args); }.bind(this));
            }

            if (this._myInitIDCallbacks.size > 0) {
                let callbacks = this._myInitIDCallbacks.get(initStateID);
                if (callbacks != null) {
                    callbacks.forEach(function (callback) { callback(this, initStateData, initTransitionObject, ...args); }.bind(this));
                }
            }
        } else if (this._myDebugLogActive) {
            console.warn(this._myDebugLogName, "- Init state not found:", initStateID);
        }
    }

    update(dt, ...args) {
        if (this._myPendingPerforms.length > 0) {
            for (let i = 0; i < this._myPendingPerforms.length; i++) {
                this._perform(this._myPendingPerforms[i].myID, PP.PerformMode.DELAYED, ...this._myPendingPerforms[i].myArgs);
            }
            this._myPendingPerforms = [];
        }

        if (this._myCurrentStateData && this._myCurrentStateData.myObject && this._myCurrentStateData.myObject.update) {
            this._myCurrentStateData.myObject.update(dt, this, ...args);
        }
    }

    perform(transitionID, ...args) {
        if (this._myPerformMode == PP.PerformMode.DELAYED) {
            this.performDelayed(transitionID, ...args);
        } else {
            this.performImmediate(transitionID, ...args);
        }
    }

    performDelayed(transitionID, ...args) {
        let performDelayed = false;

        switch (this._myPerformDelayedMode) {
            case PP.PerformDelayedMode.QUEUE:
                this._myPendingPerforms.push(new PP.PendingPerform(transitionID, ...args));
                performDelayed = true;
                break;
            case PP.PerformDelayedMode.KEEP_FIRST:
                if (!this.hasPendingPerforms()) {
                    this._myPendingPerforms.push(new PP.PendingPerform(transitionID, ...args));
                    performDelayed = true;
                }
                break;
            case PP.PerformDelayedMode.KEEP_LAST:
                this.resetPendingPerforms();
                this._myPendingPerforms.push(new PP.PendingPerform(transitionID, ...args));
                performDelayed = true;
                break;
        }

        return performDelayed;
    }

    performImmediate(transitionID, ...args) {
        return this._perform(transitionID, PP.PerformMode.IMMEDIATE, ...args);
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
        return this._myPendingPerforms.slice(0);
    }

    clone(deepClone = false) {
        if (!this.isCloneable(deepClone)) {
            return null;
        }

        let cloneFSM = new PP.FSM();

        cloneFSM._myDebugLogActive = this._myDebugLogActive;
        cloneFSM._myDebugShowDelayedInfo = this._myDebugShowDelayedInfo;
        cloneFSM._myDebugLogName = this._myDebugLogName.slice(0);

        cloneFSM._myPerformMode = this._myPerformMode;
        cloneFSM._myPerformDelayedMode = this._myPerformDelayedMode;
        cloneFSM._myPendingPerforms = this._myPendingPerforms.slice(0);

        for (let entry of this._myStates.entries()) {
            let stateData = null;

            if (deepClone) {
                stateData = new PP.StateData(entry[1].myID, entry[1].myObject.clone());
            } else {
                stateData = new PP.StateData(entry[1].myID, entry[1].myObject);
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
                    transitionData = new PP.TransitionData(transitonEntry[1].myID, fromState, toState, transitonEntry[1].myObject.clone(), transitonEntry[1].mySkipStateFunction);
                } else {
                    transitionData = new PP.TransitionData(transitonEntry[1].myID, fromState, toState, transitonEntry[1].myObject, transitonEntry[1].mySkipStateFunction);
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

        let isDeepCloneable = true;

        for (let entry of this._myStates.entries()) {
            isDeepCloneable = isDeepCloneable && entry[1].myObject.clone != null;
        }

        for (let entry of this._myTransitions.entries()) {
            for (let transitonEntry of entry[1].entries()) {
                isDeepCloneable = isDeepCloneable && transitonEntry[1].myObject.clone != null;
            }
        }

        return isDeepCloneable;
    }

    setDebugLogActive(active, debugLogName = null, showDelayedInfo = false) {
        this._myDebugLogActive = active;
        this._myDebugShowDelayedInfo = showDelayedInfo;
        if (debugLogName) {
            this._myDebugLogName = "FSM: ".concat(debugLogName);
        }
    }

    registerInitEventListener(callbackID, callback) {
        this._myInitCallbacks.set(callbackID, callback);
    }

    unregisterInitEventListener(callbackID) {
        this._myInitCallbacks.delete(callbackID);
    }

    registerInitIDEventListener(initStateID, callbackID, callback) {
        let initStateIDCallbacks = this._myInitIDCallbacks.get(initStateID);
        if (initStateIDCallbacks == null) {
            this._myInitIDCallbacks.set(initStateID, new Map());
            initStateIDCallbacks = this._myInitIDCallbacks.get(initStateID);
        }

        initStateIDCallbacks.set(callbackID, callback);
    }

    unregisterInitIDEventListener(initStateID, callbackID) {
        let initStateIDCallbacks = this._myInitIDCallbacks.get(initStateID);
        if (initStateIDCallbacks != null) {
            initStateIDCallbacks.delete(callbackID);

            if (initStateIDCallbacks.size <= 0) {
                this._myInitIDCallbacks.delete(initStateID);
            }
        }
    }

    registerTransitionEventListener(callbackID, callback) {
        this._myTransitionCallbacks.set(callbackID, callback);
    }

    unregisterTransitionEventListener(callbackID) {
        this._myTransitionCallbacks.delete(callbackID);
    }

    //the fsm IDs can be null, that means that the callback is called whenever only the valid IDs match
    //this let you register to all the transitions with a specific ID and from of a specific state but to every state (toStateID == null)
    registerTransitionIDEventListener(fromStateID, toStateID, transitionID, callbackID, callback) {
        let internalTransitionIDCallbacks = null;
        for (let value of this._myTransitionIDCallbacks) {
            if (value[0] == fromStateID && value[1] == toStateID && value[2] == transitionID) {
                internalTransitionIDCallbacks = value[3];
                break;
            }
        }

        if (internalTransitionIDCallbacks == null) {
            let transitionIDCallbacks = [];
            transitionIDCallbacks[0] = fromStateID;
            transitionIDCallbacks[1] = toStateID;
            transitionIDCallbacks[2] = transitionID;
            transitionIDCallbacks[3] = new Map();

            internalTransitionIDCallbacks = transitionIDCallbacks[3];

            this._myTransitionIDCallbacks.push(transitionIDCallbacks);
        }

        internalTransitionIDCallbacks.set(callbackID, callback);
    }

    unregisterTransitionIDEventListener(fromStateID, toStateID, transitionID, callbackID) {
        let internalTransitionIDCallbacks = null;
        for (let value of this._myTransitionIDCallbacks) {
            if (value[0] == fromStateID && value[1] == toStateID && value[2] == transitionID) {
                internalTransitionIDCallbacks = value[3];
                break;
            }
        }

        if (internalTransitionIDCallbacks != null) {
            internalTransitionIDCallbacks.delete(callbackID);

            if (internalTransitionIDCallbacks.size <= 0) {
                this._myTransitionIDCallbacks.pp_remove(element => element[0] == fromStateID && element[1] == toStateID && element[2] == transitionID);
            }
        }
    }

    _perform(transitionID, performMode, ...args) {
        if (this.isPerformingTransition()) {
            let currentlyPerformedTransition = this.getCurrentlyPerformedTransition();
            let consoleArguments = [this._myDebugLogName, "- Trying to perform:", transitionID];
            if (this._myDebugShowDelayedInfo) {
                consoleArguments.push(performMode == PP.PerformMode.DELAYED ? "- Delayed" : "- Immediate");
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

                if (this._myDebugLogActive) {
                    let consoleArguments = [this._myDebugLogName, "- From:", fromState.myID, "- To:", toState.myID, "- With:", transitionID];
                    if (this._myDebugShowDelayedInfo) {
                        consoleArguments.push(performMode == PP.PerformMode.DELAYED ? "- Delayed" : "- Immediate");
                    }
                    console.log(...consoleArguments);
                }

                if (transitionToPerform.mySkipStateFunction != PP.SkipStateFunction.END && transitionToPerform.mySkipStateFunction != PP.SkipStateFunction.BOTH &&
                    fromState.myObject && fromState.myObject.end) {
                    fromState.myObject.end(this, transitionToPerform, ...args);
                }

                if (transitionToPerform.myObject && transitionToPerform.myObject.perform) {
                    transitionToPerform.myObject.perform(this, transitionToPerform, ...args);
                }

                if (transitionToPerform.mySkipStateFunction != PP.SkipStateFunction.START && transitionToPerform.mySkipStateFunction != PP.SkipStateFunction.BOTH &&
                    toState.myObject && toState.myObject.start) {
                    toState.myObject.start(this, transitionToPerform, ...args);
                }

                this._myCurrentStateData = transitionToPerform.myToState;

                if (this._myTransitionCallbacks.size > 0) {
                    this._myTransitionCallbacks.forEach(function (callback) { callback(this, fromState, toState, transitionToPerform, performMode, ...args); }.bind(this));
                }

                if (this._myTransitionIDCallbacks.length > 0) {
                    let internalTransitionIDCallbacks = [];
                    for (let value of this._myTransitionIDCallbacks) {
                        if ((value[0] == null || value[0] == fromState.myID) &&
                            (value[1] == null || value[1] == toState.myID) &&
                            (value[2] == null || value[2] == transitionToPerform.myID)) {
                            internalTransitionIDCallbacks.push(value[3]);
                        }
                    }

                    for (let callbacks of this.internalTransitionIDCallbacks) {
                        callbacks.forEach(function (callback) { callback(this, fromState, toState, transitionToPerform, performMode, ...args); }.bind(this));
                    }
                }

                this._myCurrentlyPerformedTransition = null;

                return true;
            } else if (this._myDebugLogActive) {
                let consoleArguments = [this._myDebugLogName, "- No Transition:", transitionID, "- From:", this._myCurrentStateData.myID];
                if (this._myDebugShowDelayedInfo) {
                    consoleArguments.push(performMode == PP.PerformMode.DELAYED ? "- Delayed" : "- Immediate");
                }
                console.warn(...consoleArguments);
            }
        } else if (this._myDebugLogActive) {
            let consoleArguments = [this._myDebugLogName, "- FSM not initialized yet"];
            if (this._myDebugShowDelayedInfo) {
                consoleArguments.push(performMode == PP.PerformMode.DELAYED ? "- Delayed" : "- Immediate");
            }
            console.warn(...consoleArguments);
        }

        return false;
    }

    _getTransitionsFromState(fromStateID) {
        return this._myTransitions.get(fromStateID);
    }
};
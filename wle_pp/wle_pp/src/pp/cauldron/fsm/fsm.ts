

import { Emitter } from "@wonderlandengine/api";
import { State } from "./state.js";
import { Transition } from "./transition.js";

export class StateData {
    public myID: unknown;
    public myState: State;

    constructor(stateID: unknown, state: State) {
        this.myID = stateID;
        this.myState = state;
    }
}

export class TransitionData {
    public myID: unknown;

    public myFromStateData: Readonly<StateData>;
    public myToStateData: Readonly<StateData>;

    public myTransition: Transition;

    public mySkipStateFunction: SkipStateFunction;

    constructor(transitionID: unknown, fromStateData: Readonly<StateData>, toStateData: Readonly<StateData>, transition: Transition, skipStateFunction: SkipStateFunction) {
        this.myID = transitionID;
        this.myFromStateData = fromStateData;
        this.myToStateData = toStateData;
        this.myTransition = transition;
        this.mySkipStateFunction = skipStateFunction;
    }
}

export class PendingPerform {
    public myID: unknown;
    public myTransitionArgs: unknown[];

    constructor(transitionID: unknown, ...args: unknown[]) {
        this.myID = transitionID;
        this.myTransitionArgs = args;
    }
}

export enum PerformMode {
    IMMEDIATE = 0,
    DELAYED = 1
}

export enum PerformDelayedMode {
    QUEUE = 0,
    KEEP_FIRST = 1,
    KEEP_LAST = 2
}

export enum SkipStateFunction {
    NONE = 0,
    END = 1,
    START = 2,
    BOTH = 3
}

/**
 * You can also use plain functions for state/transition if u want to do something simple and quick
 * 
 * Signatures:
 *     function stateUpdate(dt, fsm, stateData)
 *     function init(fsm, stateData)
 *     function transition(fsm, transitionData)
*/
export class FSM {

    private _myCurrentStateData: Readonly<StateData> | null = null;

    private readonly _myStatesData: Map<unknown, Readonly<StateData>> = new Map();
    private readonly _myTransitionsData: Map<unknown, Map<unknown, Readonly<TransitionData>>> = new Map();

    private _myLogEnabled: boolean = false;
    private _myLogShowDelayedInfo: boolean = false;
    private _myLogFSMName: string = "FSM";

    private _myPerformMode: PerformMode;
    private _myPerformDelayedMode: PerformDelayedMode;
    private readonly _myPendingPerforms: PendingPerform[] = [];
    private _myCurrentlyPerformedTransitionData: Readonly<TransitionData> | null = null;

    private readonly _myInitEmitter: Emitter<[FSM, Readonly<StateData>, ...unknown[]]> = new Emitter();
    private readonly _myInitIDEmitters: Map<unknown, Emitter<[FSM, Readonly<StateData>, ...unknown[]]>> = new Map();
    private readonly _myTransitionEmitter: Emitter<[FSM, Readonly<TransitionData>, PerformMode, ...unknown[]]> = new Emitter();
    private readonly _myTransitionIDEmitters: [unknown, unknown, unknown, Emitter<[FSM, Readonly<TransitionData>, PerformMode, ...unknown[]]>][] = [];

    constructor(performMode = PerformMode.IMMEDIATE, performDelayedMode = PerformDelayedMode.QUEUE) {
        this._myPerformMode = performMode;
        this._myPerformDelayedMode = performDelayedMode;
    }

    public addState(stateID: unknown, state?: State): void;
    public addState(stateID: unknown,
        stateUpdateCallback?: ((dt: number, fsm: FSM, stateData: Readonly<StateData>, ...args: any[]) => void),
        stateStartCallback?: ((fsm: FSM, transitionData: Readonly<TransitionData>, ...args: any[]) => void),
        stateEndCallback?: ((fsm: FSM, transitionData: Readonly<TransitionData>, ...args: any[]) => void),
        stateInitCallback?: ((fsm: FSM, stateData: Readonly<StateData>, ...args: any[]) => void)): void;
    public addState(stateID: unknown,
        state?: State | ((dt: number, fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]) => void),
        stateStartCallback?: ((fsm: FSM, transitionData: Readonly<TransitionData>, ...args: unknown[]) => void),
        stateEndCallback?: ((fsm: FSM, transitionData: Readonly<TransitionData>, ...args: unknown[]) => void),
        stateInitCallback?: ((fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]) => void)): void {
        let adjustedState: State | null = null;
        if (state == null || typeof state == "function") {
            adjustedState = {};

            if (state != null) {
                adjustedState.update = function update(dt: number, fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]): void { return state(dt, fsm, stateData, ...args); };
            }

            if (stateStartCallback != null) {
                adjustedState.start = function start(fsm: FSM, transitionData: Readonly<TransitionData>, ...args: unknown[]): void { return stateStartCallback(fsm, transitionData, ...args); };
            }

            if (stateEndCallback != null) {
                adjustedState.end = function end(fsm: FSM, transitionData: Readonly<TransitionData>, ...args: unknown[]): void { return stateEndCallback(fsm, transitionData, ...args); };
            }

            if (stateInitCallback != null) {
                adjustedState.init = function init(fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]): void { return stateInitCallback(fsm, stateData, ...args); };
            }

            adjustedState.clone = function clone() {
                const clonedState: State = {};
                clonedState.update = this.update;
                clonedState.clone = this.clone;
                return clonedState;
            };
        } else {
            adjustedState = state;
        }

        const stateData = new StateData(stateID, adjustedState);
        this._myStatesData.set(stateID, stateData);
        this._myTransitionsData.set(stateID, new Map());
    }

    public addTransition(fromStateID: unknown, toStateID: unknown, transitionID: unknown, transition?: Transition, skipStateFunction?: SkipStateFunction): void;
    public addTransition(fromStateID: unknown, toStateID: unknown, transitionID: unknown, transitionPerformCallback?: ((fsm: FSM, transitionData: Readonly<TransitionData>, ...args: any[]) => void), skipStateFunction?: SkipStateFunction): void;
    public addTransition(fromStateID: unknown, toStateID: unknown, transitionID: unknown, transition?: Transition | ((fsm: FSM, transitionData: Readonly<TransitionData>, ...args: unknown[]) => void), skipStateFunction: SkipStateFunction = SkipStateFunction.NONE): void {
        let adjustedTransition: Transition | null = null;
        if (transition == null || typeof transition == "function") {
            adjustedTransition = {};

            if (transition != null) {
                adjustedTransition.perform = function perform(fsm: FSM, transitionData: Readonly<TransitionData>, ...args: unknown[]): void { return transition(fsm, transitionData, ...args); };
            }

            adjustedTransition.clone = function clone() {
                const clonedTransition: Transition = {};
                clonedTransition.perform = this.perform;
                clonedTransition.clone = this.clone;
                return clonedTransition;
            };
        } else {
            adjustedTransition = transition;
        }

        if (this.hasState(fromStateID) && this.hasState(toStateID)) {
            const transitionsDataFromState = this._getTransitionsDataFromState(fromStateID)!;

            const transitionData = new TransitionData(transitionID, this.getStateData(fromStateID)!, this.getStateData(toStateID)!, adjustedTransition, skipStateFunction);
            transitionsDataFromState.set(transitionID, transitionData);
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

    public init(stateID: unknown, transition?: Transition): void;
    public init(stateID: unknown, transitionPerformInitCallback?: ((fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]) => void), ...args: unknown[]): void;
    public init(stateID: unknown, transition?: Transition | ((fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]) => void), ...args: unknown[]): void {
        let adjustedInitTransition: Transition | null = null;
        if (transition == null || typeof transition == "function") {
            adjustedInitTransition = {};

            if (transition != null) {
                adjustedInitTransition.performInit = function performInit(fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]): void { return transition(fsm, stateData, ...args); };
            }
        } else {
            adjustedInitTransition = transition;
        }

        if (this.hasState(stateID)) {
            const stateData = this._myStatesData.get(stateID)!;

            if (this._myLogEnabled) {
                console.log(this._myLogFSMName, "- Init:", stateID);
            }

            if (adjustedInitTransition != null && adjustedInitTransition.performInit != null) {
                adjustedInitTransition.performInit(this, stateData, ...args);
            } else if (stateData.myState != null && stateData.myState.init != null) {
                stateData.myState.init(this, stateData, ...args);
            }

            this._myCurrentStateData = stateData;

            this._myInitEmitter.notify(this, stateData, ...args);

            if (this._myInitIDEmitters.size > 0) {
                const emitter = this._myInitIDEmitters.get(stateID);
                if (emitter != null) {
                    emitter.notify(this, stateData, ...args);
                }
            }
        } else if (this._myLogEnabled) {
            console.warn(this._myLogFSMName, "- Init state not found:", stateID);
        }
    }

    public update(dt: number, ...args: unknown[]): void {
        if (this._myPendingPerforms.length > 0) {
            for (let i = 0; i < this._myPendingPerforms.length; i++) {
                this._perform(this._myPendingPerforms[i].myID, PerformMode.DELAYED, ...this._myPendingPerforms[i].myTransitionArgs);
            }

            this._myPendingPerforms.pp_clear();
        }

        if (this._myCurrentStateData != null && this._myCurrentStateData.myState != null && this._myCurrentStateData.myState.update != null) {
            this._myCurrentStateData.myState.update(dt, this, this._myCurrentStateData, ...args);
        }
    }

    public perform(transitionID: unknown, ...args: unknown[]): void {
        if (this._myPerformMode == PerformMode.DELAYED) {
            this.performDelayed(transitionID, ...args);
        } else {
            this.performImmediate(transitionID, ...args);
        }
    }

    public performDelayed(transitionID: unknown, ...args: unknown[]): boolean {
        let performDelayed = false;

        switch (this._myPerformDelayedMode) {
            case PerformDelayedMode.QUEUE:
                this._myPendingPerforms.push(new PendingPerform(transitionID, ...args));
                performDelayed = true;
                break;
            case PerformDelayedMode.KEEP_FIRST:
                if (!this.hasPendingPerforms()) {
                    this._myPendingPerforms.push(new PendingPerform(transitionID, ...args));
                    performDelayed = true;
                }
                break;
            case PerformDelayedMode.KEEP_LAST:
                this.resetPendingPerforms();
                this._myPendingPerforms.push(new PendingPerform(transitionID, ...args));
                performDelayed = true;
                break;
        }

        return performDelayed;
    }

    public performImmediate(transitionID: unknown, ...args: unknown[]): boolean {
        return this._perform(transitionID, PerformMode.IMMEDIATE, ...args);
    }

    public canPerform(transitionID: unknown): boolean {
        if (this._myCurrentStateData == null) {
            return false;
        }

        return this.hasTransitionFromState(this._myCurrentStateData.myID, transitionID);
    }

    public canGoTo(stateID: unknown, transitionID?: unknown): boolean {
        if (this._myCurrentStateData == null) {
            return false;
        }

        return this.hasTransitionFromStateToState(this._myCurrentStateData.myID, stateID, transitionID);
    }

    public isInState(stateID: unknown): boolean {
        return this._myCurrentStateData != null && this._myCurrentStateData.myID == stateID;
    }

    public isPerformingTransition(): boolean {
        return this._myCurrentlyPerformedTransitionData != null;
    }

    public getCurrentlyPerformingTransitionData(): Readonly<TransitionData> | null {
        return this._myCurrentlyPerformedTransitionData;
    }

    public hasBeenInit(): boolean {
        return this._myCurrentStateData != null;
    }

    public reset(): void {
        this.resetCurrentState();
        this.resetPendingPerforms();
    }

    public resetCurrentState(): void {
        this._myCurrentStateData = null;
    }

    public resetPendingPerforms(): void {
        this._myPendingPerforms.pp_clear();
    }

    public getCurrentStateData(): Readonly<StateData> | null {
        return this._myCurrentStateData;
    }

    public getCurrentTransitionsData(): Readonly<TransitionData>[] {
        if (this._myCurrentStateData == null) {
            return [];
        }

        return this.getTransitionsDataFromState(this._myCurrentStateData.myID);
    }

    public getCurrentTransitionsDataToState(stateID: unknown): Readonly<TransitionData>[] {
        if (this._myCurrentStateData == null) {
            return [];
        }

        return this.getTransitionsDataFromStateToState(this._myCurrentStateData.myID, stateID);
    }

    public getStateData(stateID: unknown): Readonly<StateData> | null {
        const stateData = this._myStatesData.get(stateID);
        return stateData != null ? stateData : null;
    }

    public getStatesData(): Readonly<StateData>[] {
        return Array.from(this._myStatesData.values());
    }

    public getTransitionsData(): Readonly<TransitionData>[] {
        const transitionsData = [];

        for (const transitionsDataFromState of this._myTransitionsData.values()) {
            for (const transitionData of transitionsDataFromState.values()) {
                transitionsData.push(transitionData);
            }
        }

        return transitionsData;
    }

    public getTransitionsDataFromState(fromStateID: unknown): Readonly<TransitionData>[] {
        const transitionsDataFromState = this._getTransitionsDataFromState(fromStateID);
        if (transitionsDataFromState == null) {
            return [];
        }

        return Array.from(transitionsDataFromState.values());
    }

    public getTransitionsDataFromStateToState(fromStateID: unknown, toStateID: unknown): Readonly<TransitionData>[] {
        const transitionsDataFromState = this._getTransitionsDataFromState(fromStateID);
        if (transitionsDataFromState == null) {
            return [];
        }

        const transitionsDataToState = [];
        for (const transitionData of transitionsDataFromState.values()) {
            if (transitionData.myToStateData.myID == toStateID) {
                transitionsDataToState.push(transitionData);
            }
        }

        return transitionsDataToState;
    }

    public removeState(stateID: unknown): boolean {
        if (this.hasState(stateID)) {
            this._myStatesData.delete(stateID);
            this._myTransitionsData.delete(stateID);

            for (const transitionsDataFromState of this._myTransitionsData.values()) {
                const toDelete = [];
                for (const [transitionID, transitionData] of transitionsDataFromState.entries()) {
                    if (transitionData.myToStateData.myID == stateID) {
                        toDelete.push(transitionID);
                    }
                }

                for (const transitionID of toDelete) {
                    transitionsDataFromState.delete(transitionID);
                }
            }

            return true;
        }

        return false;
    }

    public removeTransitionFromState(fromStateID: unknown, transitionID: unknown): boolean {
        const transitionsDataFromState = this._getTransitionsDataFromState(fromStateID);
        if (transitionsDataFromState != null) {
            return transitionsDataFromState.delete(transitionID);
        }

        return false;
    }

    public hasState(stateID: unknown): boolean {
        return this._myStatesData.has(stateID);
    }

    public hasTransitionFromState(fromStateID: unknown, transitionID: unknown): boolean {
        const transitionsData = this.getTransitionsDataFromState(fromStateID);

        const transitionIndex = transitionsData.findIndex(function (transition) {
            return transition.myID == transitionID;
        });

        return transitionIndex >= 0;
    }

    public hasTransitionFromStateToState(fromStateID: unknown, toStateID: unknown, transitionID?: unknown): boolean {
        const transitionsData = this.getTransitionsDataFromStateToState(fromStateID, toStateID);

        let hasTransition = false;
        if (transitionID != null) {
            const transitionIndex = transitionsData.findIndex(function (transition) {
                return transition.myID == transitionID;
            });

            hasTransition = transitionIndex >= 0;
        } else {
            hasTransition = transitionsData.length > 0;
        }

        return hasTransition;
    }

    public setPerformMode(performMode: PerformMode): void {
        this._myPerformMode = performMode;
    }

    public getPerformMode(): PerformMode {
        return this._myPerformMode;
    }

    public setPerformDelayedMode(performDelayedMode: PerformDelayedMode): void {
        this._myPerformDelayedMode = performDelayedMode;
    }

    public getPerformDelayedMode(): PerformDelayedMode {
        return this._myPerformDelayedMode;
    }

    public hasPendingPerforms(): boolean {
        return this._myPendingPerforms.length > 0;
    }

    public getPendingPerforms(): Readonly<PendingPerform[]> {
        return this._myPendingPerforms;
    }

    public clone(deepClone: boolean = false): FSM | null {
        if (!this.isCloneable(deepClone)) {
            return null;
        }

        const cloneFSM = new FSM();

        cloneFSM._myLogEnabled = this._myLogEnabled;
        cloneFSM._myLogShowDelayedInfo = this._myLogShowDelayedInfo;
        cloneFSM._myLogFSMName = this._myLogFSMName;

        cloneFSM._myPerformMode = this._myPerformMode;
        cloneFSM._myPerformDelayedMode = this._myPerformDelayedMode;
        (cloneFSM._myPendingPerforms as PendingPerform[]) = this._myPendingPerforms.pp_clone();

        for (const stateData of this._myStatesData.values()) {
            let clonedStateData = null;

            if (deepClone) {
                clonedStateData = new StateData(stateData.myID, stateData.myState.clone!());
            } else {
                clonedStateData = new StateData(stateData.myID, stateData.myState);
            }

            cloneFSM._myStatesData.set(clonedStateData.myID, clonedStateData);
        }

        for (const [stateID, transitionsDataFromState] of this._myTransitionsData.entries()) {
            const clonedTransitionsDataFromState = new Map();
            cloneFSM._myTransitionsData.set(stateID, clonedTransitionsDataFromState);

            for (const transitonData of transitionsDataFromState.values()) {
                let clonedTransitionData = null;

                const fromState = cloneFSM.getStateData(transitonData.myFromStateData.myID)!;
                const toState = cloneFSM.getStateData(transitonData.myToStateData.myID)!;

                if (deepClone) {
                    clonedTransitionData = new TransitionData(transitonData.myID, fromState, toState, transitonData.myTransition.clone!(), transitonData.mySkipStateFunction);
                } else {
                    clonedTransitionData = new TransitionData(transitonData.myID, fromState, toState, transitonData.myTransition, transitonData.mySkipStateFunction);
                }

                clonedTransitionsDataFromState.set(clonedTransitionData.myID, clonedTransitionData);
            }
        }

        if (this._myCurrentStateData != null) {
            cloneFSM._myCurrentStateData = cloneFSM.getStateData(this._myCurrentStateData.myID);
        }

        return cloneFSM;
    }

    public isCloneable(deepClone: boolean = false): boolean {
        if (!deepClone) {
            return true;
        }

        let deepCloneable = true;

        for (const stateData of this._myStatesData.values()) {
            deepCloneable = deepCloneable && stateData.myState.clone != null;
        }

        for (const transitionsData of this._myTransitionsData.values()) {
            for (const transitionsDataFromState of transitionsData.values()) {
                deepCloneable = deepCloneable && transitionsDataFromState.myTransition.clone != null;
            }
        }

        return deepCloneable;
    }

    public setLogEnabled(active: boolean, fsmName?: string, showDelayedInfo: boolean = false): void {
        this._myLogEnabled = active;
        this._myLogShowDelayedInfo = showDelayedInfo;
        if (fsmName != null) {
            this._myLogFSMName = "FSM: ".concat(fsmName);
        }
    }

    public registerInitEventListener(listenerID: unknown, listener: (fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]) => void): void {
        this._myInitEmitter.add(listener, { id: listenerID });
    }

    public unregisterInitEventListener(listenerID: unknown): void {
        this._myInitEmitter.remove(listenerID);
    }

    public registerInitIDEventListener(stateID: unknown, listenerID: unknown, listener: (fsm: FSM, stateData: Readonly<StateData>, ...args: unknown[]) => void): void {
        let stateIDEmitter = this._myInitIDEmitters.get(stateID);
        if (stateIDEmitter == null) {
            this._myInitIDEmitters.set(stateID, new Emitter());
            stateIDEmitter = this._myInitIDEmitters.get(stateID);
        }

        stateIDEmitter!.add(listener, { id: listenerID });
    }

    public unregisterInitIDEventListener(stateID: unknown, listenerID: unknown): void {
        const stateIDEmitter = this._myInitIDEmitters.get(stateID);
        if (stateIDEmitter != null) {
            stateIDEmitter.remove(listenerID);

            if (stateIDEmitter.isEmpty) {
                this._myInitIDEmitters.delete(stateID);
            }
        }
    }

    public registerTransitionEventListener(listenerID: unknown, listener: (fsm: FSM, transitionData: Readonly<TransitionData>, performMode: PerformMode, ...args: unknown[]) => void): void {
        this._myTransitionEmitter.add(listener, { id: listenerID });
    }

    public unregisterTransitionEventListener(listenerID: unknown): void {
        this._myTransitionEmitter.remove(listenerID);
    }

    /** The fsm IDs can be `null`, that means that the listener is called whenever only the valid IDs match
        This let you register to all the transitions with a specific ID and from of a specific state but to every state (`toStateID == null`) */
    public registerTransitionIDEventListener(fromStateID: unknown, toStateID: unknown, transitionID: unknown, listenerID: unknown, listener: (fsm: FSM, transitionData: Readonly<TransitionData>, performMode: PerformMode, ...args: unknown[]) => void): void {
        let internalTransitionIDEmitter: Emitter<[FSM, Readonly<TransitionData>, PerformMode, ...unknown[]]> | null = null;
        for (const value of this._myTransitionIDEmitters) {
            if (value[0] == fromStateID && value[1] == toStateID && value[2] == transitionID) {
                internalTransitionIDEmitter = value[3];
                break;
            }
        }

        if (internalTransitionIDEmitter == null) {
            const transitionIDEmitter: [unknown, unknown, unknown, Emitter<[FSM, Readonly<TransitionData>, PerformMode, ...unknown[]]>] = [
                fromStateID,
                toStateID,
                transitionID,
                new Emitter()
            ];

            internalTransitionIDEmitter = transitionIDEmitter[3];

            this._myTransitionIDEmitters.push(transitionIDEmitter);
        }

        internalTransitionIDEmitter!.add(listener, { id: listenerID });
    }

    public unregisterTransitionIDEventListener(fromStateID: unknown, toStateID: unknown, transitionID: unknown, listenerID: unknown): void {
        let internalTransitionIDEmitter: Emitter<[FSM, Readonly<TransitionData>, PerformMode, ...unknown[]]> | null = null;
        for (const value of this._myTransitionIDEmitters) {
            if (value[0] == fromStateID && value[1] == toStateID && value[2] == transitionID) {
                internalTransitionIDEmitter = value[3];
                break;
            }
        }

        if (internalTransitionIDEmitter != null) {
            internalTransitionIDEmitter.remove(listenerID);

            if (internalTransitionIDEmitter.isEmpty) {
                this._myTransitionIDEmitters.pp_remove(element => element[0] == fromStateID && element[1] == toStateID && element[2] == transitionID);
            }
        }
    }

    private _perform(transitionID: unknown, performMode: PerformMode, ...args: unknown[]): boolean {
        if (this.isPerformingTransition()) {
            const currentlyPerformingTransitionData = this.getCurrentlyPerformingTransitionData()!;
            const consoleArguments = [this._myLogFSMName, "- Trying to perform:", transitionID];
            if (this._myLogShowDelayedInfo) {
                consoleArguments.push(performMode == PerformMode.DELAYED ? "- Delayed" : "- Immediate");
            }
            consoleArguments.push("- But another transition is currently being performed -", currentlyPerformingTransitionData.myID);
            console.warn(...consoleArguments);

            return false;
        }

        if (this._myCurrentStateData != null) {
            if (this.canPerform(transitionID)) {
                const transitionsData = this._myTransitionsData.get(this._myCurrentStateData.myID)!;
                const transitionDataToPerform = transitionsData.get(transitionID)!;

                this._myCurrentlyPerformedTransitionData = transitionDataToPerform;

                const fromStateData = this._myCurrentStateData;
                const toStateData = this._myStatesData.get(transitionDataToPerform.myToStateData.myID)!;

                if (this._myLogEnabled) {
                    const consoleArguments = [this._myLogFSMName, "- From:", fromStateData.myID, "- To:", toStateData.myID, "- With:", transitionID];
                    if (this._myLogShowDelayedInfo) {
                        consoleArguments.push(performMode == PerformMode.DELAYED ? "- Delayed" : "- Immediate");
                    }
                    console.log(...consoleArguments);
                }

                if (transitionDataToPerform.mySkipStateFunction != SkipStateFunction.END && transitionDataToPerform.mySkipStateFunction != SkipStateFunction.BOTH &&
                    fromStateData.myState != null && fromStateData.myState.end != null) {
                    fromStateData.myState.end(this, transitionDataToPerform, ...args);
                }

                if (transitionDataToPerform.myTransition != null && transitionDataToPerform.myTransition.perform != null) {
                    transitionDataToPerform.myTransition.perform(this, transitionDataToPerform, ...args);
                }

                if (transitionDataToPerform.mySkipStateFunction != SkipStateFunction.START && transitionDataToPerform.mySkipStateFunction != SkipStateFunction.BOTH &&
                    toStateData.myState != null && toStateData.myState.start != null) {
                    toStateData.myState.start(this, transitionDataToPerform, ...args);
                }

                this._myCurrentStateData = transitionDataToPerform.myToStateData;

                this._myTransitionEmitter.notify(this, transitionDataToPerform, performMode, ...args);

                if (this._myTransitionIDEmitters.length > 0) {
                    const internalTransitionIDEmitters = [];
                    for (const value of this._myTransitionIDEmitters) {
                        if ((value[0] == null || value[0] == fromStateData.myID) &&
                            (value[1] == null || value[1] == toStateData.myID) &&
                            (value[2] == null || value[2] == transitionDataToPerform.myID)) {
                            internalTransitionIDEmitters.push(value[3]);
                        }
                    }

                    for (const emitter of internalTransitionIDEmitters) {
                        emitter.notify(this, transitionDataToPerform, performMode, ...args);
                    }
                }

                this._myCurrentlyPerformedTransitionData = null;

                return true;
            } else if (this._myLogEnabled) {
                const consoleArguments = [this._myLogFSMName, "- No Transition:", transitionID, "- From:", this._myCurrentStateData.myID];
                if (this._myLogShowDelayedInfo) {
                    consoleArguments.push(performMode == PerformMode.DELAYED ? "- Delayed" : "- Immediate");
                }
                console.warn(...consoleArguments);
            }
        } else if (this._myLogEnabled) {
            const consoleArguments = [this._myLogFSMName, "- FSM not initialized yet"];
            if (this._myLogShowDelayedInfo) {
                consoleArguments.push(performMode == PerformMode.DELAYED ? "- Delayed" : "- Immediate");
            }
            console.warn(...consoleArguments);
        }

        return false;
    }

    private _getTransitionsDataFromState(fromStateID: unknown): Map<unknown, Readonly<TransitionData>> | null {
        const transitionsData = this._myTransitionsData.get(fromStateID);
        return transitionsData != null ? transitionsData : null;
    }
}
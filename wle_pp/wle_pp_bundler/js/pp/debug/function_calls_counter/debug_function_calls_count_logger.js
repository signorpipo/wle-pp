PP.DebugFunctionCallsCountLoggerParams = class DebugFunctionCallsCountLoggerParams {
    constructor() {
        this.myCallsCounter = null;

        this.myLogTitle = "Function Calls Count";
        this.myLogDelay = 1;
        this.myLogFunction = "log";

        this.myLogCollapsed = false;

        this.myLogFunctionsMaxAmount = null;
        this.myLogFunctionsWithCallsCounterAbove = null;

        this.myLogSorted = true;
        this.myLogMaxFunctionCalls = false;

        this.myClearConsoleBeforeLog = false;
    }
};

PP.DebugFunctionCallsCountLogger = class DebugFunctionCallsCountLogger {
    constructor(params) {
        this._myParams = params;

        this._myLogTimer = new PP.Timer(this._myParams.myLogDelay);
    }

    update(dt) {
        if (this._myParams.myCallsCounter == null) {
            return;
        }

        this._myLogTimer.update(dt);
        if (this._myLogTimer.isDone()) {
            this._myLogTimer.start();

            let callsCounters = null;
            if (!this._myParams.myLogMaxFunctionCalls) {
                callsCounters = this._myParams.myCallsCounter.getCallsCount(this._myParams.myLogSorted);
            } else {
                callsCounters = this._myParams.myCallsCounter.getMaxCallsCount(this._myParams.myLogSorted);
            }

            if (this._myParams.myLogFunctionsWithCallsCounterAbove != null) {
                let callsCountersClone = new Map(callsCounters);
                callsCounters = new Map();
                let keys = [...callsCountersClone.keys()];
                for (let i = 0; i < keys.length; i++) {
                    let counter = callsCountersClone.get(keys[i]);
                    if (counter > this._myParams.myLogFunctionsWithCallsCounterAbove) {
                        callsCounters.set(keys[i], counter);
                    }
                }
            }

            if (this._myParams.myLogFunctionsMaxAmount != null) {
                let callsCountersClone = new Map(callsCounters);
                callsCounters = new Map();
                let keys = [...callsCountersClone.keys()];
                for (let i = 0; i < this._myParams.myLogFunctionsMaxAmount && i < keys.length; i++) {
                    let counter = callsCountersClone.get(keys[i]);
                    callsCounters.set(keys[i], counter);
                }
            }

            if (this._myParams.myClearConsoleBeforeLog) {
                console.clear();
            }

            if (this._myParams.myLogCollapsed) {
                console[this._myParams.myLogFunction](this._myParams.myLogTitle, "\n", callsCounters);
            } else {
                let callCountText = "";

                for (let entry of callsCounters.entries()) {
                    callCountText += "\n" + entry[0] + ": " + entry[1];
                }

                console[this._myParams.myLogFunction](this._myParams.myLogTitle, callCountText);
            }
        }

    }
};
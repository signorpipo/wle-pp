
WL.registerComponent('pp-debug-function-calls-counter', {
    _myObjectsByPath: { type: WL.Type.String, default: "" },
    _myClassesByPath: { type: WL.Type.String, default: "" },
    _myDelayStart: { type: WL.Type.Float, default: 0.0 },
    _myLogTitle: { type: WL.Type.String, default: "Function Calls Count" },
    _myLogFunction: { type: WL.Type.Enum, values: ['log', 'error', 'warn', 'debug'], default: 'log' },
    _myLogDelay: { type: WL.Type.Float, default: 1.0 },
    _myLogCollapsed: { type: WL.Type.Bool, default: false },
    _myLogMaxFunctionCalls: { type: WL.Type.Bool, default: false },
    _myLogFunctionsMaxAmount: { type: WL.Type.Int, default: -1 },
    _myLogFunctionsWithCallsCounterAbove: { type: WL.Type.Int, default: -1 },
    _myFunctionNamesToInclude: { type: WL.Type.String, default: "" },
    _myFunctionNamesToExclude: { type: WL.Type.String, default: "" },
    _myExcludeConstructors: { type: WL.Type.Bool, default: false },
    _myExcludeJavascriptObjectFunctions: { type: WL.Type.Bool, default: true },
    _myAddPathPrefix: { type: WL.Type.Bool, default: true },
    _myObjectRecursionDepthLevelforObjects: { type: WL.Type.Int, default: 0 },
    _myObjectRecursionDepthLevelforClasses: { type: WL.Type.Int, default: 0 }
}, {
    init: function () {
        if (!this.active) return;

        this._mySkipFirstUpdate = true;
        this._myStartTimer = new PP.Timer(this._myDelayStart);
        if (this._myDelayStart == 0) {
            this._myStartTimer.end();
            this._mySkipFirstUpdate = false;
            this._start();
        }
    },
    start: function () {
    },
    update: function (dt) {
        if (this._mySkipFirstUpdate) {
            this._mySkipFirstUpdate = false;
            return;
        }

        if (this._myStartTimer.isRunning()) {
            this._myStartTimer.update(dt);
            if (this._myStartTimer.isDone()) {
                this._start();
            }
        } else {
            this._myFunctionCallsCountLogger.update(dt);
            this._myFunctionCallsCounter.resetCallsCount();
        }
    },
    _start: function () {
        let functionCallsCounterParams = new PP.DebugFunctionCallsCounterParams();

        if (this._myObjectsByPath.length > 0) {
            let toIncludeList = [...this._myObjectsByPath.split(",")];
            for (let i = 0; i < toIncludeList.length; i++) {
                toIncludeList[i] = toIncludeList[i].trim();
            }
            functionCallsCounterParams.myObjectsByPath.push(...toIncludeList);
        }

        if (this._myClassesByPath.length > 0) {
            let toIncludeList = [...this._myClassesByPath.split(",")];
            for (let i = 0; i < toIncludeList.length; i++) {
                toIncludeList[i] = toIncludeList[i].trim();
            }
            functionCallsCounterParams.myClassesByPath.push(...toIncludeList);
        }

        functionCallsCounterParams.myExcludeConstructors = this._myExcludeConstructors;
        functionCallsCounterParams.myExcludeJavascriptObjectFunctions = this._myExcludeJavascriptObjectFunctions;
        functionCallsCounterParams.myAddPathPrefix = this._myAddPathPrefix;

        if (this._myFunctionNamesToInclude.length > 0) {
            let toIncludeList = [...this._myFunctionNamesToInclude.split(",")];
            for (let i = 0; i < toIncludeList.length; i++) {
                toIncludeList[i] = toIncludeList[i].trim();
            }
            functionCallsCounterParams.myFunctionNamesToInclude.push(...toIncludeList);
        }

        if (this._myFunctionNamesToExclude.length > 0) {
            let toExcludeList = [...this._myFunctionNamesToExclude.split(",")];
            for (let i = 0; i < toExcludeList.length; i++) {
                toExcludeList[i] = toExcludeList[i].trim();
            }
            functionCallsCounterParams.myFunctionNamesToExclude.push(...toExcludeList);
        }

        functionCallsCounterParams.myObjectRecursionDepthLevelforObjects = this._myObjectRecursionDepthLevelforObjects;
        functionCallsCounterParams.myObjectRecursionDepthLevelforClasses = this._myObjectRecursionDepthLevelforClasses;

        this._myFunctionCallsCounter = new PP.DebugFunctionCallsCounter(functionCallsCounterParams);

        let functionCallsCountLoggerParams = new PP.DebugFunctionCallsCountLoggerParams();
        functionCallsCountLoggerParams.myCallsCounter = this._myFunctionCallsCounter;
        functionCallsCountLoggerParams.myLogTitle = this._myLogTitle;

        functionCallsCountLoggerParams.myLogDelay = this._myLogDelay;
        functionCallsCountLoggerParams.myLogFunction = ['log', 'error', 'warn', 'debug'][this._myLogFunction];
        functionCallsCountLoggerParams.myLogCollapsed = this._myLogCollapsed;
        functionCallsCountLoggerParams.myLogMaxFunctionCalls = this._myLogMaxFunctionCalls;

        this._myFunctionCallsCountLogger = new PP.DebugFunctionCallsCountLogger(functionCallsCountLoggerParams);
    },
});

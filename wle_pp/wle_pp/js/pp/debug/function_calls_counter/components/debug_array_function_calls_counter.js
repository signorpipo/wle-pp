
WL.registerComponent('pp-debug-array-function-calls-counter', {
    _myIncludeOnlyArrayExtensionFunctions: { type: WL.Type.Bool, default: false },
    _myDelayStart: { type: WL.Type.Float, default: 0.0 },
    _myLogFunction: { type: WL.Type.Enum, values: ['log', 'error', 'warn', 'debug'], default: 'log' },
    _myLogDelay: { type: WL.Type.Float, default: 1.0 },
    _myLogCollapsed: { type: WL.Type.Bool, default: false },
    _myLogMaxFunctionCalls: { type: WL.Type.Bool, default: false },
    _myLogFunctionsMaxAmount: { type: WL.Type.Int, default: -1 },
    _myLogFunctionsWithCallsCounterAbove: { type: WL.Type.Int, default: -1 },
    _myFunctionNamesToInclude: { type: WL.Type.String, default: "" },
    _myFunctionNamesToExclude: { type: WL.Type.String, default: "" },
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
    _start() {
        let functionCallsCounterParams = new PP.DebugFunctionCallsCounterParams();
        functionCallsCounterParams.myClassesByPath = [
            "Array", "Uint8ClampedArray", "Uint8Array", "Uint16Array", "Uint32Array", "Int8Array",
            "Int16Array", "Int32Array", "Float32Array", "Float64Array"];
        functionCallsCounterParams.myExcludeConstructors = false;
        functionCallsCounterParams.myExcludeJavascriptObjectFunctions = true;
        functionCallsCounterParams.myAddPathPrefix = true;

        if (this._myIncludeOnlyArrayExtensionFunctions) {
            let prefixes = ["pp_", "vec_", "vec2_", "vec3_", "vec4_", "quat_", "quat2_", "mat3_", "mat4_", "_pp_", "_vec_", "_quat_",];
            functionCallsCounterParams.myFunctionNamesToInclude.push(...prefixes);
        }

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

        this._myFunctionCallsCounter = new PP.DebugFunctionCallsCounter(functionCallsCounterParams);

        let functionCallsCountLoggerParams = new PP.DebugFunctionCallsCountLoggerParams();
        functionCallsCountLoggerParams.myCallsCounter = this._myFunctionCallsCounter;
        functionCallsCountLoggerParams.myLogTitle = "Array " + functionCallsCountLoggerParams.myLogTitle;

        functionCallsCountLoggerParams.myLogDelay = this._myLogDelay;
        functionCallsCountLoggerParams.myLogFunction = ['log', 'error', 'warn', 'debug'][this._myLogFunction];
        functionCallsCountLoggerParams.myLogCollapsed = this._myLogCollapsed;
        functionCallsCountLoggerParams.myLogFunctionsMaxAmount = (this._myLogFunctionsMaxAmount >= 0) ? this._myLogFunctionsMaxAmount : null;
        functionCallsCountLoggerParams.myLogFunctionsWithCallsCounterAbove = (this._myLogFunctionsWithCallsCounterAbove >= 0) ? this._myLogFunctionsWithCallsCounterAbove : null;
        functionCallsCountLoggerParams.myLogMaxFunctionCalls = this._myLogMaxFunctionCalls;

        this._myFunctionCallsCountLogger = new PP.DebugFunctionCallsCountLogger(functionCallsCountLoggerParams);
    }
});

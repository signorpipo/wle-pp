
WL.registerComponent('pp-debug-functions-performance-analyzer', {
    _myObjectsByPath: { type: WL.Type.String, default: "" },
    _myClassesByPath: { type: WL.Type.String, default: "" },
    _myFunctionsByPath: { type: WL.Type.String, default: "" },
    _myDelayStart: { type: WL.Type.Float, default: 0.0 },
    _myLogTitle: { type: WL.Type.String, default: "Functions Performance Analysis Results" },
    _myLogFunction: { type: WL.Type.Enum, values: ["log", "error", "warn", "debug"], default: "log" },
    _mySecondsBetweenLogs: { type: WL.Type.Float, default: 1.0 },
    _myLogMaxResults: { type: WL.Type.Bool, default: false },
    _myLogSortOrder: { type: WL.Type.Enum, values: ["none", "calls count", "total execution time", "average execution time"], default: "none" },
    _myLogCallsCountResults: { type: WL.Type.Bool, default: true },
    _myLogTotalExecutionTimeResults: { type: WL.Type.Bool, default: true },
    _myLogTotalExecutionTimePercentageResults: { type: WL.Type.Bool, default: true },
    _myLogAverageExecutionTimeResults: { type: WL.Type.Bool, default: true },
    _myLogMaxAmountOfFunctions: { type: WL.Type.Int, default: -1 },
    _myLogFunctionsWithCallsCountAbove: { type: WL.Type.Int, default: -1 },
    _myLogFunctionsWithTotalExecutionTimePercentageAbove: { type: WL.Type.Float, default: -1 },
    _myFunctionPathsToInclude: { type: WL.Type.String, default: "" },
    _myFunctionPathsToExclude: { type: WL.Type.String, default: "" },
    _myExcludeConstructors: { type: WL.Type.Bool, default: false },
    _myExcludeJavascriptObjectFunctions: { type: WL.Type.Bool, default: true },
    _myAddPathPrefixToFunctionID: { type: WL.Type.Bool, default: true },
    _myObjectAddObjectDescendantsDepthLevel: { type: WL.Type.Int, default: 0 },
    _myObjectAddClassDescendantsDepthLevel: { type: WL.Type.Int, default: 0 },
    _myClearConsoleBeforeLog: { type: WL.Type.Bool, default: false },
    _myResetMaxResultsShortcutEnabled: { type: WL.Type.Bool, default: false }
}, {
    init() {
        this._myFunctionsPerformanceAnalyzer = null;
        this._myFunctionsPerformanceAnalysisResultsLogger = null;

        this._mySkipFirstUpdate = true;
        this._myStartTimer = new PP.Timer(this._myDelayStart);
        if (this._myDelayStart == 0) {
            this._myStartTimer.end();
            this._mySkipFirstUpdate = false;
            this._start();
        }
    },
    update(dt) {
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
            this._myFunctionsPerformanceAnalysisResultsLogger.update(dt);
            this._myFunctionsPerformanceAnalyzer.resetResults();
        }

        if (this._myResetMaxResultsShortcutEnabled) {
            if (PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.SELECT).isPressEnd(3)) {
                this._myFunctionsPerformanceAnalyzer.resetMaxResults();
            }
        }
    },
    _start() {
        let functionsPerformanceAnalyzerParams = new PP.DebugFunctionsPerformanceAnalyzerParams();

        if (this._myObjectsByPath.length > 0) {
            let toIncludeList = [...this._myObjectsByPath.split(",")];
            for (let i = 0; i < toIncludeList.length; i++) {
                toIncludeList[i] = toIncludeList[i].trim();
            }
            functionsPerformanceAnalyzerParams.myObjectsByPath.push(...toIncludeList);
        }

        if (this._myClassesByPath.length > 0) {
            let toIncludeList = [...this._myClassesByPath.split(",")];
            for (let i = 0; i < toIncludeList.length; i++) {
                toIncludeList[i] = toIncludeList[i].trim();
            }
            functionsPerformanceAnalyzerParams.myClassesByPath.push(...toIncludeList);
        }

        if (this._myFunctionsByPath.length > 0) {
            let toIncludeList = [...this._myFunctionsByPath.split(",")];
            for (let i = 0; i < toIncludeList.length; i++) {
                toIncludeList[i] = toIncludeList[i].trim();
            }
            functionsPerformanceAnalyzerParams.myFunctionsByPath.push(...toIncludeList);
        }

        functionsPerformanceAnalyzerParams.myExcludeConstructors = this._myExcludeConstructors;
        functionsPerformanceAnalyzerParams.myExcludeJavascriptObjectFunctions = this._myExcludeJavascriptObjectFunctions;
        functionsPerformanceAnalyzerParams.myAddPathPrefixToFunctionID = this._myAddPathPrefixToFunctionID;

        if (this._myFunctionPathsToInclude.length > 0) {
            let toIncludeList = [...this._myFunctionPathsToInclude.split(",")];
            for (let i = 0; i < toIncludeList.length; i++) {
                toIncludeList[i] = toIncludeList[i].trim();
            }
            functionsPerformanceAnalyzerParams.myFunctionPathsToInclude.push(...toIncludeList);
        }

        if (this._myFunctionPathsToExclude.length > 0) {
            let toExcludeList = [...this._myFunctionPathsToExclude.split(",")];
            for (let i = 0; i < toExcludeList.length; i++) {
                toExcludeList[i] = toExcludeList[i].trim();
            }
            functionsPerformanceAnalyzerParams.myFunctionPathsToExclude.push(...toExcludeList);
        }

        functionsPerformanceAnalyzerParams.myObjectAddObjectDescendantsDepthLevel = this._myObjectAddObjectDescendantsDepthLevel;
        functionsPerformanceAnalyzerParams.myObjectAddClassDescendantsDepthLevel = this._myObjectAddClassDescendantsDepthLevel;

        functionsPerformanceAnalyzerParams.myExecutionTimeAnalysisEnabled = this._myLogTotalExecutionTimeResults || this._myLogTotalExecutionTimePercentageResults || this._myLogAverageExecutionTimeResults;

        functionsPerformanceAnalyzerParams.myClassesByReference = (this._myClassesByReference != null) ? this._myClassesByReference : [];
        functionsPerformanceAnalyzerParams.myObjectsByReference = (this._myObjectsByReference != null) ? this._myObjectsByReference : [];

        this._myFunctionsPerformanceAnalyzer = new PP.DebugFunctionsPerformanceAnalyzer(functionsPerformanceAnalyzerParams);
        this._myFunctionsPerformanceAnalyzer.overwriteFunctions();

        let functionsPerformanceAnalysisResultsLoggerParams = new PP.DebugFunctionsPerformanceAnalysisResultsLoggerParams();
        functionsPerformanceAnalysisResultsLoggerParams.myPerformanceAnalyzer = this._myFunctionsPerformanceAnalyzer;
        functionsPerformanceAnalysisResultsLoggerParams.myLogTitle = this._myLogTitle;

        functionsPerformanceAnalysisResultsLoggerParams.mySecondsBetweenLogs = this._mySecondsBetweenLogs;
        functionsPerformanceAnalysisResultsLoggerParams.myLogFunction = ['log', 'error', 'warn', 'debug'][this._myLogFunction];
        functionsPerformanceAnalysisResultsLoggerParams.myLogMaxAmountOfFunctions = (this._myLogMaxAmountOfFunctions >= 0) ? this._myLogMaxAmountOfFunctions : null;
        functionsPerformanceAnalysisResultsLoggerParams.myLogFunctionsWithCallsCountAbove = (this._myLogFunctionsWithCallsCountAbove >= 0) ? this._myLogFunctionsWithCallsCountAbove : null;
        functionsPerformanceAnalysisResultsLoggerParams.myLogFunctionsWithTotalExecutionTimePercentageAbove = (this._myLogFunctionsWithTotalExecutionTimePercentageAbove >= 0) ? this._myLogFunctionsWithTotalExecutionTimePercentageAbove : null;
        functionsPerformanceAnalysisResultsLoggerParams.myLogMaxResults = this._myLogMaxResults;
        functionsPerformanceAnalysisResultsLoggerParams.myClearConsoleBeforeLog = this._myClearConsoleBeforeLog;

        functionsPerformanceAnalysisResultsLoggerParams.myLogSortOrder = this._myLogSortOrder;

        functionsPerformanceAnalysisResultsLoggerParams.myLogCallsCountResults = this._myLogCallsCountResults;
        functionsPerformanceAnalysisResultsLoggerParams.myLogTotalExecutionTimeResults = this._myLogTotalExecutionTimeResults;
        functionsPerformanceAnalysisResultsLoggerParams.myLogTotalExecutionTimePercentageResults = this._myLogTotalExecutionTimePercentageResults;
        functionsPerformanceAnalysisResultsLoggerParams.myLogAverageExecutionTimeResults = this._myLogAverageExecutionTimeResults;

        this._myFunctionsPerformanceAnalysisResultsLogger = new PP.DebugFunctionsPerformanceAnalysisResultsLogger(functionsPerformanceAnalysisResultsLoggerParams);
    },
});

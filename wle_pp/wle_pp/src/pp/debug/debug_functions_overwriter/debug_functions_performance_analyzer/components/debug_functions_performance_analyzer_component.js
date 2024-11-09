import { Component, Property } from "@wonderlandengine/api";
import { Timer } from "../../../../cauldron/cauldron/timer.js";
import { GamepadButtonID } from "../../../../input/gamepad/gamepad_buttons.js";
import { Globals } from "../../../../pp/globals.js";
import { DebugFunctionsPerformanceAnalysisResultsLogger, DebugFunctionsPerformanceAnalysisResultsLoggerParams } from "../debug_functions_performance_analysis_results_logger.js";
import { DebugFunctionsPerformanceAnalyzer, DebugFunctionsPerformanceAnalyzerParams } from "../debug_functions_performance_analyzer.js";

export class DebugFunctionsPerformanceAnalyzerComponent extends Component {
    static TypeName = "pp-debug-functions-performance-analyzer";
    static Properties = {
        _myObjectsByPath: Property.string(""),
        _myClassesByPath: Property.string(""),
        _myFunctionsByPath: Property.string(""),
        _myDelayStart: Property.float(0.0),
        _myLogTitle: Property.string("Functions Performance Analysis Results"),
        _myLogFunction: Property.enum(["Log", "Error", "Warn", "Debug"], "Error"),
        _mySecondsBetweenLogs: Property.float(1.0),
        _myLogMaxResults: Property.bool(false),
        _myLogSortOrder: Property.enum(["None", "Calls Count", "Total Execution Time", "Average Execution Time"], "Calls Count"),
        _myLogCallsCountResults: Property.bool(true),
        _myLogTotalExecutionTimeResults: Property.bool(false),
        _myLogTotalExecutionTimePercentageResults: Property.bool(false),
        _myLogAverageExecutionTimeResults: Property.bool(false),
        _myLogMaxAmountOfFunctions: Property.int(-1),
        _myLogFunctionsWithCallsCountAbove: Property.int(0),
        _myLogFunctionsWithTotalExecutionTimePercentageAbove: Property.float(-1),
        _myFunctionPathsToInclude: Property.string(""),
        _myFunctionPathsToExclude: Property.string(""),
        _myExcludeConstructors: Property.bool(false),
        _myExcludeJSObjectFunctions: Property.bool(true),
        _myAddPathPrefixToFunctionID: Property.bool(true),
        _myObjectAddObjectDescendantsDepthLevel: Property.int(0),
        _myObjectAddClassDescendantsDepthLevel: Property.int(0),
        _myClearConsoleBeforeLog: Property.bool(false),
        _myResetMaxResultsShortcutEnabled: Property.bool(false),
        _myClassesByReference: Property.enum(["Code Driven"], "Code Driven"),
        _myObjectsByReference: Property.enum(["Code Driven"], "Code Driven")
    };

    init() {
        this._myActive = false;

        if (Globals.isDebugEnabled(this.engine)) {
            this._init();
        }
    }

    _init() {
        this._myActive = true;

        this._myFunctionsPerformanceAnalyzer = null;
        this._myFunctionsPerformanceAnalysisResultsLogger = null;

        this._mySkipFirstUpdate = true;
        this._myStartTimer = new Timer(this._myDelayStart);
        if (this._myDelayStart == 0) {
            this._myStartTimer.end();
            this._mySkipFirstUpdate = false;
            this._start();
        }
    }

    start() {
        if (!this._myActive && Globals.isDebugEnabled(this.engine)) {
            this._init();
        }
    }

    update(dt) {
        if (!Globals.isDebugEnabled(this.engine)) return;

        if (this._myActive) {
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
                if (Globals.getLeftGamepad(this.engine).getButtonInfo(GamepadButtonID.SELECT).isPressEnd(3)) {
                    this._myFunctionsPerformanceAnalyzer.resetMaxResults();
                }
            }
        }
    }

    _start() {
        let functionsPerformanceAnalyzerParams = new DebugFunctionsPerformanceAnalyzerParams(this.engine);

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
        functionsPerformanceAnalyzerParams.myExcludeJSObjectFunctions = this._myExcludeJSObjectFunctions;
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

        functionsPerformanceAnalyzerParams.myClassesByReference = (this._myClassesByReference != 0) ? this._myClassesByReference : [];
        functionsPerformanceAnalyzerParams.myObjectsByReference = (this._myObjectsByReference != 0) ? this._myObjectsByReference : [];

        this._myFunctionsPerformanceAnalyzer = new DebugFunctionsPerformanceAnalyzer(functionsPerformanceAnalyzerParams);
        this._myFunctionsPerformanceAnalyzer.overwriteFunctions();

        let functionsPerformanceAnalysisResultsLoggerParams = new DebugFunctionsPerformanceAnalysisResultsLoggerParams();
        functionsPerformanceAnalysisResultsLoggerParams.myPerformanceAnalyzer = this._myFunctionsPerformanceAnalyzer;
        functionsPerformanceAnalysisResultsLoggerParams.myLogTitle = this._myLogTitle;

        functionsPerformanceAnalysisResultsLoggerParams.mySecondsBetweenLogs = this._mySecondsBetweenLogs;
        functionsPerformanceAnalysisResultsLoggerParams.myLogFunction = ["log", "error", "warn", "debug"][this._myLogFunction];
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

        this._myFunctionsPerformanceAnalysisResultsLogger = new DebugFunctionsPerformanceAnalysisResultsLogger(functionsPerformanceAnalysisResultsLoggerParams);
    }
}
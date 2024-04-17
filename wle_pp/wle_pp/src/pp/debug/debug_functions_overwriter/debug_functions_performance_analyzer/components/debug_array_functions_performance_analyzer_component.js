
import { Component, Property } from "@wonderlandengine/api";
import { DebugFunctionsPerformanceAnalyzerComponent } from "./debug_functions_performance_analyzer_component.js";

export class DebugArrayFunctionsPerformanceAnalyzerComponent extends Component {
    static TypeName = "pp-debug-array-functions-performance-analyzer";
    static Properties = {
        _myIncludeOnlyMainArrayTypes: Property.bool(true),
        _myIncludeOnlyArrayExtensionFunctions: Property.bool(false),
        _myDelayStart: Property.float(0.0),
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
        _myClearConsoleBeforeLog: Property.bool(false),
        _myResetMaxResultsShortcutEnabled: Property.bool(false)
    };

    init() {
        let classesByPath = "Array, Uint8ClampedArray, Uint8Array, Uint16Array, Uint32Array, Int8Array, Int16Array, Int32Array, Float32Array, Float64Array";
        if (this._myIncludeOnlyMainArrayTypes) {
            classesByPath = "Array, Uint8Array, Uint16Array, Float32Array";
        }

        this.object.pp_addComponent(DebugFunctionsPerformanceAnalyzerComponent, {
            _myClassesByPath: classesByPath,
            _myDelayStart: this._myDelayStart,
            _myLogTitle: "Array Functions Performance Analysis Results",
            _myLogFunction: this._myLogFunction,
            _mySecondsBetweenLogs: this._mySecondsBetweenLogs,
            _myLogMaxResults: this._myLogMaxResults,
            _myLogSortOrder: this._myLogSortOrder,
            _myLogMaxAmountOfFunctions: this._myLogMaxAmountOfFunctions,
            _myLogFunctionsWithCallsCountAbove: this._myLogFunctionsWithCallsCountAbove,
            _myLogFunctionsWithTotalExecutionTimePercentageAbove: this._myLogFunctionsWithTotalExecutionTimePercentageAbove,
            _myLogCallsCountResults: this._myLogCallsCountResults,
            _myLogTotalExecutionTimeResults: this._myLogTotalExecutionTimeResults,
            _myLogTotalExecutionTimePercentageResults: this._myLogTotalExecutionTimePercentageResults,
            _myLogAverageExecutionTimeResults: this._myLogAverageExecutionTimeResults,
            _myFunctionPathsToInclude: this._myFunctionPathsToInclude + (this._myFunctionPathsToInclude.length > 0 && this._myIncludeOnlyArrayExtensionFunctions ? ", " : "") + (this._myIncludeOnlyArrayExtensionFunctions ? "pp_, vec_, vec2_, vec3_, vec4_, quat_, quat2_, mat3_, mat4_, _pp_, _vec_, _quat_" : ""),
            _myFunctionPathsToExclude: this._myFunctionPathsToExclude,
            _myExcludeConstructors: this._myExcludeConstructors,
            _myExcludeJSObjectFunctions: true,
            _myAddPathPrefixToFunctionID: true,
            _myClearConsoleBeforeLog: this._myClearConsoleBeforeLog,
            _myResetMaxResultsShortcutEnabled: this._myResetMaxResultsShortcutEnabled
        });
    }
}
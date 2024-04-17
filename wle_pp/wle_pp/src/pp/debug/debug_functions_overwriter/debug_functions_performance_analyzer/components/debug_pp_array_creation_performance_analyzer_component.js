import { Component, Property } from "@wonderlandengine/api";
import { Mat3Utils } from "../../../../cauldron/utils/array/mat3_utils.js";
import { Mat4Utils } from "../../../../cauldron/utils/array/mat4_utils.js";
import { Quat2Utils } from "../../../../cauldron/utils/array/quat2_utils.js";
import { QuatUtils } from "../../../../cauldron/utils/array/quat_utils.js";
import { Vec2Utils } from "../../../../cauldron/utils/array/vec2_utils.js";
import { Vec3Utils } from "../../../../cauldron/utils/array/vec3_utils.js";
import { Vec4Utils } from "../../../../cauldron/utils/array/vec4_utils.js";
import { DebugFunctionsPerformanceAnalyzerComponent } from "./debug_functions_performance_analyzer_component.js";

export class DebugPPArrayCreationPerformanceAnalyzerComponent extends Component {
    static TypeName = "pp-debug-pp-array-creation-performance-analyzer";
    static Properties = {
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
        _myClearConsoleBeforeLog: Property.bool(false),
        _myResetMaxResultsShortcutEnabled: Property.bool(false)
    };

    init() {
        this.object.pp_addComponent(DebugFunctionsPerformanceAnalyzerComponent, {
            _myObjectsByReference: [
                [Vec2Utils, "Vec2Utils"],
                [Vec3Utils, "Vec3Utils"],
                [Vec4Utils, "Vec4Utils"],
                [QuatUtils, "QuatUtils"],
                [Quat2Utils, "Quat2Utils"],
                [Mat3Utils, "Mat3Utils"],
                [Mat4Utils, "Mat4Utils"]
            ],
            _myDelayStart: this._myDelayStart,
            _myLogTitle: "PP Array Creation Performance Analysis Results",
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
            _myFunctionPathsToInclude: "create",
            _myExcludeConstructors: true,
            _myExcludeJSObjectFunctions: true,
            _myAddPathPrefixToFunctionID: true,
            _myClearConsoleBeforeLog: this._myClearConsoleBeforeLog,
            _myResetMaxResultsShortcutEnabled: this._myResetMaxResultsShortcutEnabled
        });
    }
}
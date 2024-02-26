import { Component, Property } from "@wonderlandengine/api";
import { Mat3Utils } from "../../../../cauldron/js/utils/mat3_utils";
import { Mat4Utils } from "../../../../cauldron/js/utils/mat4_utils";
import { Quat2Utils } from "../../../../cauldron/js/utils/quat2_utils";
import { QuatUtils } from "../../../../cauldron/js/utils/quat_utils";
import { Vec2Utils } from "../../../../cauldron/js/utils/vec2_utils";
import { Vec3Utils } from "../../../../cauldron/js/utils/vec3_utils";
import { Vec4Utils } from "../../../../cauldron/js/utils/vec4_utils";
import { DebugFunctionsPerformanceAnalyzerComponent } from "./debug_functions_performance_analyzer_component";

export class DebugPPArrayCreationPerformanceAnalyzerComponent extends Component {
    static TypeName = "pp-debug-pp-array-creation-performance-analyzer";
    static Properties = {
        _myDelayStart: Property.float(0.0),
        _myLogFunction: Property.enum(["Log", "Error", "Warn", "Debug"], "Log"),
        _mySecondsBetweenLogs: Property.float(1.0),
        _myLogMaxResults: Property.bool(false),
        _myLogSortOrder: Property.enum(["None", "Calls Count", "Total Execution Time", "Average Execution Time"], "None"),
        _myLogCallsCountResults: Property.bool(true),
        _myLogTotalExecutionTimeResults: Property.bool(true),
        _myLogTotalExecutionTimePercentageResults: Property.bool(true),
        _myLogAverageExecutionTimeResults: Property.bool(true),
        _myLogMaxAmountOfFunctions: Property.int(-1),
        _myLogFunctionsWithCallsCountAbove: Property.int(-1),
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
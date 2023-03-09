
WL.registerComponent('pp-debug-wl-components-functions-performance-analyzer', {
    _myAnalyzeComponentTypes: { type: WL.Type.Bool, default: true },
    _myAnalyzeComponentInstances: { type: WL.Type.Bool, default: false },
    _myDelayStart: { type: WL.Type.Float, default: 0.0 },
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
    _myClearConsoleBeforeLog: { type: WL.Type.Bool, default: false },
    _myResetMaxResultsShortcutEnabled: { type: WL.Type.Bool, default: false }
}, {
    init() {
        let objectsByPath = "";

        if (this._myAnalyzeComponentTypes) {
            objectsByPath += "_WL._componentTypes";
        }

        if (this._myAnalyzeComponentInstances) {
            if (objectsByPath.length > 0) {
                objectsByPath += ", ";
            }
            objectsByPath += "_WL._components";
        }

        let objectByReference = [];
        let nativeComponentTypes = ["mesh", "physx", "animation", "collision", "input", "light", "text", "view"];
        for (let nativeComponentType of nativeComponentTypes) {
            objectByReference.push([Object.getPrototypeOf(WL._wrapComponent(nativeComponentType, WL.Object._typeIndexFor(nativeComponentType), 0)), "_WL._componentTypes[\"" + nativeComponentType + "\"]"]);
        }

        this._myAnalyzerComponent = this.object.pp_addComponent("pp-debug-functions-performance-analyzer", {
            _myObjectsByReference: objectByReference,
            _myObjectsByPath: objectsByPath,
            _myDelayStart: this._myDelayStart + 0.001,
            _myLogTitle: "WL Components Performance Analysis Results",
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
            _myFunctionPathsToInclude: this._myFunctionPathsToInclude,
            _myFunctionPathsToExclude: this._myFunctionPathsToExclude + (this._myFunctionPathsToExclude.length > 0 ? ", " : "") + "_WL\\._components\\., _WL\\._componentTypes\\., functions-performance-analyzer",
            _myExcludeConstructors: this._myExcludeConstructors,
            _myExcludeJavascriptObjectFunctions: true,
            _myAddPathPrefixToFunctionID: true,
            _myObjectAddObjectDescendantsDepthLevel: 1,
            _myObjectAddClassDescendantsDepthLevel: 1,
            _myClearConsoleBeforeLog: this._myClearConsoleBeforeLog,
            _myResetMaxResultsShortcutEnabled: this._myResetMaxResultsShortcutEnabled
        });
    },
    update(dt) {
        let a = 2;
        let b = a * 2;
    }
});

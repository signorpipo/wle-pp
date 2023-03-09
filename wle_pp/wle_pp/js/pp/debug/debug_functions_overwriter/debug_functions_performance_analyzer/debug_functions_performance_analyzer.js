PP.DebugFunctionsPerformanceAnalyzerParams = class DebugFunctionsPerformanceAnalyzerParams extends PP.DebugFunctionsOverwriterParams {
    constructor() {
        super();

        this.myExecutionTimeAnalysisEnabled = true;

        this.myAddPathPrefixToFunctionID = true;
        // this works at best when the object/class is specified as path
        // since with reference it's not possible to get the full path or get the variable name of the reference

        this.myFilterDebugFunctionsPerformanceAnalyzerClasses = true;
    }
};

PP.DebugFunctionPerformanceAnalysisResults = class DebugFunctionPerformanceAnalysisResults {
    constructor() {
        this.myReference = null;
        this.myName = "";
        this.myPath = "";
        this.myID = "";

        this.myCallsCount = 0;
        this.myTotalExecutionTime = 0;
        this.myTotalExecutionTimePercentage = 0;
        this.myAverageExecutionTime = 0;
        this.myTimeElapsedSinceLastReset = 0;

        this._myTotalExecutionTimeInternal = 0;
    }

    reset() {
        this.myCallsCount = 0;
        this.myTotalExecutionTime = 0;
        this.myTotalExecutionTimePercentage = 0;
        this.myAverageExecutionTime = 0;
        this.myTimeElapsedSinceLastReset = 0;

        this._myTotalExecutionTimeInternal = 0;
    }

    max(other) {
        this.myCallsCount = Math.max(this.myCallsCount, other.myCallsCount);
        this.myTotalExecutionTime = Math.max(this.myTotalExecutionTime, other.myTotalExecutionTime);
        this.myTotalExecutionTimePercentage = Math.max(this.myTotalExecutionTimePercentage, other.myTotalExecutionTimePercentage);
        this.myAverageExecutionTime = Math.max(this.myAverageExecutionTime, other.myAverageExecutionTime);
    }

    copy(other) {
        this.myReference = other.myReference;
        this.myName = other.myName;
        this.myPath = other.myPath;
        this.myID = other.myID;

        this.myCallsCount = other.myCallsCount;
        this.myTotalExecutionTime = other.myTotalExecutionTime;
        this.myTotalExecutionTimePercentage = other.myTotalExecutionTimePercentage;
        this.myAverageExecutionTime = other.myAverageExecutionTime;
        this.myTimeElapsedSinceLastReset = other.myTimeElapsedSinceLastReset;

        this._myTotalExecutionTimeInternal = other._myTotalExecutionTimeInternal;
    }
};

PP.DebugFunctionsPerformanceAnalyzerSortOrder = {
    NONE: 0,
    CALLS_COUNT: 1,
    TOTAL_EXECUTION_TIME: 2,
    AVERAGE_EXECUTION_TIME: 3
};

PP.DebugFunctionsPerformanceAnalyzer = class DebugFunctionsPerformanceAnalyzer extends PP.DebugFunctionsOverwriter {
    constructor(params = new PP.DebugFunctionsOverwriterParams()) {
        super(params);

        this._myFunctionPerformanceAnalysisResults = new Map();
        this._myFunctionPerformanceAnalysisMaxResults = new Map();

        this._myResultsAlreadyAdded = false;

        this._myExecutionTimes = {
            myOverheadExecutionTimeSinceLastReset: 0,
            myLastFunctionExecutionTime: 0,
            myOriginalFunctionOverheadExecutionTimes: []
        };
        this._myTimeOfLastReset = window.performance.now();
        this._myMaxTimeElapsedSinceLastReset = 0;

        let originalPush = Array.prototype["push"];
        let originalPop = Array.prototype["pop"];
        this._myExecutionTimes.myOriginalFunctionOverheadExecutionTimes.push = function () { return originalPush.bind(this)(...arguments); }
        this._myExecutionTimes.myOriginalFunctionOverheadExecutionTimes.pop = function () { return originalPop.bind(this)(...arguments); }
    }

    overwriteFunctions() {
        super.overwriteFunctions();

        this.resetResults();
        this.resetMaxResults();
    }

    getTimeElapsedSinceLastReset() {
        return window.performance.now() - this._myTimeOfLastReset - this._myExecutionTimes.myOverheadExecutionTimeSinceLastReset;
    }

    getMaxTimeElapsedSinceLastReset() {
        this._myMaxTimeElapsedSinceLastReset = Math.max(this._myMaxTimeElapsedSinceLastReset, this.getTimeElapsedSinceLastReset());
        return this._myMaxTimeElapsedSinceLastReset;
    }

    resetResults() {
        this._updateDerivatesResults();
        this._updateMaxResults();

        for (let property of this._myFunctionPerformanceAnalysisResults.keys()) {
            this._myFunctionPerformanceAnalysisResults.get(property).reset();
        }

        this._myExecutionTimes.myOverheadExecutionTimeSinceLastReset = 0;

        this._myTimeOfLastReset = window.performance.now();
    }

    resetMaxResults() {
        this._myMaxTimeElapsedSinceLastReset = 0;
        for (let property of this._myFunctionPerformanceAnalysisMaxResults.keys()) {
            this._myFunctionPerformanceAnalysisMaxResults.get(property).reset();
        }
    }

    getResults(sortOrder = PP.DebugFunctionsPerformanceAnalyzerSortOrder.NONE) {
        this._updateDerivatesResults();
        this._updateMaxResults();

        let results = this._myFunctionPerformanceAnalysisResults;
        results = this._sortResults(results, sortOrder);
        return results;
    }

    getMaxResults(sortOrder = PP.DebugFunctionsPerformanceAnalyzerSortOrder.NONE) {
        this._updateDerivatesResults();
        this._updateMaxResults();

        let results = this._myFunctionPerformanceAnalysisMaxResults;
        results = this._sortResults(results, sortOrder);
        return results;
    }

    _getOverwrittenFunction(reference, propertyName, referencePath, isClass, isFunction) {
        return this._getOverwrittenFunctionInternal(reference, propertyName, referencePath, isClass, isFunction, false);
    }

    _getOverwrittenConstructor(reference, propertyName, referencePath, isClass, isFunction) {
        return this._getOverwrittenFunctionInternal(reference, propertyName, referencePath, isClass, isFunction, true);
    }

    _onOverwriteSuccess(reference, propertyName, referenceParentForConstructor, referenceNameForConstructor, referencePath, isClass, isFunction, isConstructor) {
        this._myResultsAlreadyAdded = false;
    }

    _onOverwriteFailure(reference, propertyName, referenceParentForConstructor, referenceNameForConstructor, referencePath, isClass, isFunction, isConstructor) {
        if (this._myResultsAlreadyAdded) {
            let propertyID = this._getPropertyID(propertyName, referencePath, isFunction, isConstructor);
            this._myFunctionPerformanceAnalysisResults.delete(propertyID);
        }
    }

    _sortResults(results, sortOrder) {
        let sortedResults = results;

        if (sortOrder != PP.DebugFunctionsPerformanceAnalyzerSortOrder.NONE) {
            sortedResults = new Map([...results.entries()].sort(function (first, second) {
                let sortResult = 0;

                if (sortOrder == PP.DebugFunctionsPerformanceAnalyzerSortOrder.CALLS_COUNT) {
                    sortResult = -(first[1].myCallsCount - second[1].myCallsCount);
                    if (sortResult == 0) {
                        sortResult = -(first[1].myTotalExecutionTime - second[1].myTotalExecutionTime);
                        if (sortResult == 0) {
                            sortResult = -(first[1].myAverageExecutionTime - second[1].myAverageExecutionTime);
                        }
                    }
                } else if (sortOrder == PP.DebugFunctionsPerformanceAnalyzerSortOrder.TOTAL_EXECUTION_TIME) {
                    sortResult = -(first[1].myTotalExecutionTime - second[1].myTotalExecutionTime);
                    if (sortResult == 0) {
                        sortResult = -(first[1].myAverageExecutionTime - second[1].myAverageExecutionTime);
                        if (sortResult == 0) {
                            sortResult = -(first[1].myCallsCount - second[1].myCallsCount);
                        }
                    }
                } else {
                    sortResult = -(first[1].myAverageExecutionTime - second[1].myAverageExecutionTime);
                    if (sortResult == 0) {
                        sortResult = -(first[1].myTotalExecutionTime - second[1].myTotalExecutionTime);
                        if (sortResult == 0) {
                            sortResult = -(first[1].myCallsCount - second[1].myCallsCount);
                        }
                    }
                }

                return sortResult;
            }));
        }

        return sortedResults;
    }

    _getPropertyID(propertyName, referencePath, isFunction, isConstructor) {
        let id = isConstructor ? "constructor" : propertyName;

        if (referencePath != null && this._myParams.myAddPathPrefixToFunctionID) {
            if (!isFunction) {
                id = referencePath + "." + id;
            } else {
                id = referencePath;
            }
        }

        return id;
    }

    _updateDerivatesResults() {
        let timeElapsedSinceLastReset = this.getTimeElapsedSinceLastReset();
        let beforeTime = window.performance.now();

        for (let property of this._myFunctionPerformanceAnalysisResults.keys()) {
            let results = this._myFunctionPerformanceAnalysisResults.get(property);

            if (timeElapsedSinceLastReset != 0) {
                results.myTotalExecutionTimePercentage = results.myTotalExecutionTime / timeElapsedSinceLastReset;
            } else {
                if (results.myCallsCount != 0) {
                    results.myTotalExecutionTimePercentage = 1;
                } else {
                    results.myTotalExecutionTimePercentage = 0;
                }
            }

            if (results.myCallsCount != 0) {
                results.myAverageExecutionTime = results.myTotalExecutionTime / results.myCallsCount;
            } else {
                results.myAverageExecutionTime = 0;
            }

            results.myTimeElapsedSinceLastReset = timeElapsedSinceLastReset;
        }

        this._myExecutionTimes.myOverheadExecutionTimeSinceLastReset += window.performance.now() - beforeTime;
    }

    _updateMaxResults() {
        let beforeTime = window.performance.now();

        this._myMaxTimeElapsedSinceLastReset = Math.max(this._myMaxTimeElapsedSinceLastReset, this.getTimeElapsedSinceLastReset());

        for (let property of this._myFunctionPerformanceAnalysisResults.keys()) {
            if (this._myFunctionPerformanceAnalysisMaxResults.has(property)) {
                this._myFunctionPerformanceAnalysisMaxResults.get(property).max(this._myFunctionPerformanceAnalysisResults.get(property));
            } else {
                let maxResults = new PP.DebugFunctionPerformanceAnalysisResults();
                maxResults.copy(this._myFunctionPerformanceAnalysisResults.get(property));
                this._myFunctionPerformanceAnalysisMaxResults.set(property, maxResults)
            }
        }

        this._myExecutionTimes.myOverheadExecutionTimeSinceLastReset += window.performance.now() - beforeTime;
    }

    _getOverwrittenFunctionInternal(reference, propertyName, referencePath, isClass, isFunction, isConstructor) {
        let newFunction = PP.JSUtils.getReferenceProperty(reference, propertyName);

        if (!this._myParams.myFilterDebugFunctionsPerformanceAnalyzerClasses || !this._isPerformanceAnalyzer(reference, propertyName, isClass)) {
            if (propertyName != "_myPerformanceAnalyzerOriginalFunction") {
                let propertyID = this._getPropertyID(propertyName, referencePath, isFunction, isConstructor);

                this._myResultsAlreadyAdded = this._myFunctionPerformanceAnalysisResults.has(propertyID);
                let analysisResults = new PP.DebugFunctionPerformanceAnalysisResults();

                analysisResults.myReference = reference;
                analysisResults.myName = propertyName;
                analysisResults.myPath = referencePath;
                analysisResults.myID = referencePath;

                this._myFunctionPerformanceAnalysisResults.set(propertyID, analysisResults);

                try {
                    let functionPerformanceAnalysisResults = this._myFunctionPerformanceAnalysisResults.get(propertyID);
                    let executionTimes = this._myExecutionTimes;

                    let originalFunction = reference[propertyName];
                    let functionCallOverhead = 0.000175;     // ms taken by an analyzed function that is empty
                    let overheadError = 0.00035;        // ms to add to adjust a bit for window.performance.now() max precision which is 0.0005

                    let executionTimeAnalysisEnabled = this._myParams.myExecutionTimeAnalysisEnabled;

                    if (!isConstructor) {
                        newFunction = function () {
                            let startTime = window.performance.now();

                            let errorToThrow = null;
                            let returnValue = undefined;
                            let bindFunction = null;
                            let startOriginalFunctionTime = 0;
                            let endOriginalFunctionTime = 0;
                            let originalFunctionOverheadExecutionTime = 0;
                            let executionTimeToAdjust = 0;
                            let executionTime = 0;
                            let beforeOverhead = 0;
                            let inBetweenOverhead = 0;

                            if (executionTimeAnalysisEnabled) {
                                executionTimes.myOriginalFunctionOverheadExecutionTimes.push(0);

                                startOriginalFunctionTime = window.performance.now();
                                endOriginalFunctionTime = window.performance.now();

                                try {
                                    bindFunction = originalFunction.bind(this);
                                    startOriginalFunctionTime = window.performance.now();
                                    returnValue = bindFunction(...arguments);
                                    endOriginalFunctionTime = window.performance.now();
                                } catch (error) {
                                    endOriginalFunctionTime = window.performance.now();
                                    errorToThrow = error;
                                }
                            } else {
                                try {
                                    bindFunction = originalFunction.bind(this);
                                    returnValue = bindFunction(...arguments);
                                } catch (error) {
                                    errorToThrow = error;
                                }
                            }

                            functionPerformanceAnalysisResults.myCallsCount += 1;

                            if (executionTimeAnalysisEnabled) {
                                originalFunctionOverheadExecutionTime = executionTimes.myOriginalFunctionOverheadExecutionTimes.pop();

                                executionTimeToAdjust = endOriginalFunctionTime - startOriginalFunctionTime - originalFunctionOverheadExecutionTime;
                                executionTime = executionTimeToAdjust - functionCallOverhead;
                                if (originalFunction._myPerformanceAnalyzerHasBeenOverwritten) {
                                    executionTime = executionTimes.myLastFunctionExecutionTime;
                                }

                                functionPerformanceAnalysisResults._myTotalExecutionTimeInternal += executionTime;
                                functionPerformanceAnalysisResults.myTotalExecutionTime = Math.max(0, functionPerformanceAnalysisResults._myTotalExecutionTimeInternal);

                                executionTimes.myLastFunctionExecutionTime = executionTime;

                                beforeOverhead = startOriginalFunctionTime - startTime;
                                inBetweenOverhead = beforeOverhead - endOriginalFunctionTime - overheadError;
                                if (executionTimes.myOriginalFunctionOverheadExecutionTimes.length > 0) {
                                    executionTimes.myOriginalFunctionOverheadExecutionTimes[executionTimes.myOriginalFunctionOverheadExecutionTimes.length - 1] +=
                                        inBetweenOverhead + originalFunctionOverheadExecutionTime + overheadError * 2.75;
                                    executionTimes.myOriginalFunctionOverheadExecutionTimes[executionTimes.myOriginalFunctionOverheadExecutionTimes.length - 1] +=
                                        window.performance.now();
                                }

                                executionTimes.myOverheadExecutionTimeSinceLastReset += inBetweenOverhead;
                                executionTimes.myOverheadExecutionTimeSinceLastReset += window.performance.now();
                            }

                            if (errorToThrow != null) {
                                throw errorToThrow;
                            }

                            return returnValue;
                        };
                    } else {
                        newFunction = function () {
                            let startTime = window.performance.now();

                            let errorToThrow = null;
                            let returnValue = undefined;
                            let bindFunction = null;
                            let startOriginalFunctionTime = 0;
                            let endOriginalFunctionTime = 0;
                            let originalFunctionOverheadExecutionTime = 0;
                            let executionTimeToAdjust = 0;
                            let executionTime = 0;
                            let beforeOverhead = 0;
                            let inBetweenOverhead = 0;

                            if (executionTimeAnalysisEnabled) {
                                executionTimes.myOriginalFunctionOverheadExecutionTimes.push(0);

                                startOriginalFunctionTime = window.performance.now();
                                endOriginalFunctionTime = window.performance.now();

                                try {
                                    startOriginalFunctionTime = window.performance.now();
                                    returnValue = new originalFunction(...arguments);
                                    endOriginalFunctionTime = window.performance.now();
                                } catch (error) {
                                    endOriginalFunctionTime = window.performance.now();
                                    errorToThrow = error;
                                }
                            } else {
                                try {
                                    returnValue = new originalFunction(...arguments);
                                } catch (error) {
                                    errorToThrow = error;
                                }
                            }

                            functionPerformanceAnalysisResults.myCallsCount += 1;

                            if (executionTimeAnalysisEnabled) {
                                originalFunctionOverheadExecutionTime = executionTimes.myOriginalFunctionOverheadExecutionTimes.pop();

                                executionTimeToAdjust = endOriginalFunctionTime - startOriginalFunctionTime - originalFunctionOverheadExecutionTime;
                                executionTime = executionTimeToAdjust - functionCallOverhead;
                                if (originalFunction._myPerformanceAnalyzerHasBeenOverwritten) {
                                    executionTime = executionTimes.myLastFunctionExecutionTime;
                                }

                                functionPerformanceAnalysisResults._myTotalExecutionTimeInternal += executionTime;
                                functionPerformanceAnalysisResults.myTotalExecutionTime = Math.max(0, functionPerformanceAnalysisResults._myTotalExecutionTimeInternal);

                                executionTimes.myLastFunctionExecutionTime = executionTime;

                                beforeOverhead = startOriginalFunctionTime - startTime;
                                inBetweenOverhead = beforeOverhead - endOriginalFunctionTime - overheadError;
                                if (executionTimes.myOriginalFunctionOverheadExecutionTimes.length > 0) {
                                    executionTimes.myOriginalFunctionOverheadExecutionTimes[executionTimes.myOriginalFunctionOverheadExecutionTimes.length - 1] +=
                                        inBetweenOverhead + originalFunctionOverheadExecutionTime + overheadError * 2.75;
                                    executionTimes.myOriginalFunctionOverheadExecutionTimes[executionTimes.myOriginalFunctionOverheadExecutionTimes.length - 1] +=
                                        window.performance.now();
                                }

                                executionTimes.myOverheadExecutionTimeSinceLastReset += inBetweenOverhead;
                                executionTimes.myOverheadExecutionTimeSinceLastReset += window.performance.now();
                            }

                            if (errorToThrow != null) {
                                throw errorToThrow;
                            }

                            return returnValue;
                        };
                    }

                    if (newFunction != null) {
                        Object.defineProperty(newFunction, "_myPerformanceAnalyzerHasBeenOverwritten", {
                            value: true,
                            enumerable: false,
                            configurable: false,
                            writable: false
                        });

                        Object.defineProperty(newFunction, "_myPerformanceAnalyzerOriginalFunction", {
                            value: originalFunction,
                            enumerable: false,
                            configurable: false,
                            writable: false
                        });
                    }
                } catch (error) {
                    if (this._myParams.myDebugLogActive) {
                        console.error("Function:", propertyName, "of:", reference, "can't be overwritten.\nError:", error);
                    }
                }
            }
        }

        return newFunction;
    }

    _isPerformanceAnalyzer(reference, propertyName, isClass) {
        let isPerformanceAnalyzer = false;

        if (isClass) {
            if (reference == PP.DebugFunctionsPerformanceAnalyzer.prototype || reference == PP.DebugFunctionPerformanceAnalysisResults.prototype) {
                isPerformanceAnalyzer = true;
            }
        }

        return isPerformanceAnalyzer;
    }
};
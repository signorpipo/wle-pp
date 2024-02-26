import { Timer } from "../../../cauldron/cauldron/timer.js";
import { DebugFunctionsPerformanceAnalyzerSortOrder } from "./debug_functions_performance_analyzer.js";

export class DebugFunctionsPerformanceAnalysisResultsLoggerParams {

    constructor() {
        this.myPerformanceAnalyzer = null;

        this.myLogTitle = "Functions Performance Analysis Results";
        this.mySecondsBetweenLogs = 1;
        this.myLogFunction = "log";

        this.myFormatLog = true;
        this.myFormatLogIndentationCharacter = "-";

        this.myLogMaxResults = false;

        this.myLogSortOrder = DebugFunctionsPerformanceAnalyzerSortOrder.NONE;

        this.myLogMaxAmountOfFunctions = null;

        this.myLogFunctionsWithCallsCountAbove = null;
        this.myLogFunctionsWithTotalExecutionTimePercentageAbove = null;

        this.myLogCallsCountResults = false;
        this.myLogTotalExecutionTimeResults = false;
        this.myLogTotalExecutionTimePercentageResults = false;
        this.myLogAverageExecutionTimeResults = false;

        this.myClearConsoleBeforeLog = false;
    }
}

export class DebugFunctionsPerformanceAnalysisResultsLogger {

    constructor(params) {
        this._myParams = params;

        this._myLogTimer = new Timer(this._myParams.mySecondsBetweenLogs);

        this._myMaxNameLength = 0;
        this._myMaxCallsCountLength = 0;
        this._myMaxTotalExecutionTimeLength = 0;
        this._myMaxTotalExecutionTimePercentageLength = 0;
        this._myMaxAverageExecutionTimeLength = 0;
    }

    update(dt) {
        if (this._myParams.myPerformanceAnalyzer == null) {
            return;
        }

        this._myLogTimer.update(dt);
        if (this._myLogTimer.isDone()) {
            this._myLogTimer.start();

            let timeSinceLastReset = this._myParams.myPerformanceAnalyzer.getTimeElapsedSinceLastReset();
            if (this._myParams.myLogMaxResults) {
                timeSinceLastReset = this._myParams.myPerformanceAnalyzer.getMaxTimeElapsedSinceLastReset();
            }

            let analysisResults = null;
            if (!this._myParams.myLogMaxResults) {
                analysisResults = this._myParams.myPerformanceAnalyzer.getResults(this._myParams.myLogSortOrder);
            } else {
                analysisResults = this._myParams.myPerformanceAnalyzer.getMaxResults(this._myParams.myLogSortOrder);
            }

            if (this._myParams.myLogFunctionsWithCallsCountAbove != null) {
                let analysisResultsClone = new Map(analysisResults);
                analysisResults = new Map();
                let keys = [...analysisResultsClone.keys()];
                for (let i = 0; i < keys.length; i++) {
                    let results = analysisResultsClone.get(keys[i]);
                    if (results.myCallsCount > this._myParams.myLogFunctionsWithCallsCountAbove) {
                        analysisResults.set(keys[i], results);
                    }
                }
            }

            if (this._myParams.myLogFunctionsWithTotalExecutionTimePercentageAbove != null) {
                let analysisResultsClone = new Map(analysisResults);
                analysisResults = new Map();
                let keys = [...analysisResultsClone.keys()];
                for (let i = 0; i < keys.length; i++) {
                    let results = analysisResultsClone.get(keys[i]);
                    if (results.myTotalExecutionTimePercentage * 100 > this._myParams.myLogFunctionsWithTotalExecutionTimePercentageAbove) {
                        analysisResults.set(keys[i], results);
                    }
                }
            }

            if (this._myParams.myLogMaxAmountOfFunctions != null) {
                let analysisResultsClone = new Map(analysisResults);
                analysisResults = new Map();
                let keys = [...analysisResultsClone.keys()];
                for (let i = 0; i < this._myParams.myLogMaxAmountOfFunctions && i < keys.length; i++) {
                    let counter = analysisResultsClone.get(keys[i]);
                    analysisResults.set(keys[i], counter);
                }
            }

            if (this._myParams.myClearConsoleBeforeLog) {
                console.clear();
            }

            let analysisResultsToLog = new Map();
            for (let key of analysisResults.keys()) {
                let currentResults = analysisResults.get(key);

                let resultsToLog = {};
                if (this._myParams.myLogCallsCountResults) {
                    resultsToLog.myCallsCount = currentResults.myCallsCount;
                }

                if (this._myParams.myLogTotalExecutionTimeResults) {
                    resultsToLog.myTotalExecutionTime = currentResults.myTotalExecutionTime;
                }

                if (this._myParams.myLogTotalExecutionTimePercentageResults) {
                    resultsToLog.myTotalExecutionTimePercentage = currentResults.myTotalExecutionTimePercentage;
                }

                if (this._myParams.myLogAverageExecutionTimeResults) {
                    resultsToLog.myAverageExecutionTime = currentResults.myAverageExecutionTime;
                }

                analysisResultsToLog.set(key, resultsToLog);
            }

            let resultsText = "";

            for (let entry of analysisResults.entries()) {
                let name = entry[0];
                let results = entry[1];

                this._myMaxNameLength = Math.max(this._myMaxNameLength, name.length);

                this._myMaxCallsCountLength = Math.max(this._myMaxCallsCountLength, results.myCallsCount.toFixed(0).length);
                this._myMaxTotalExecutionTimeLength = Math.max(this._myMaxTotalExecutionTimeLength, results.myTotalExecutionTime.toFixed(5).length);
                this._myMaxTotalExecutionTimePercentageLength = Math.max(this._myMaxTotalExecutionTimePercentageLength, (results.myTotalExecutionTimePercentage * 100).toFixed(2).length);
                this._myMaxAverageExecutionTimeLength = Math.max(this._myMaxAverageExecutionTimeLength, results.myAverageExecutionTime.toFixed(5).length);
            }

            for (let entry of analysisResults.entries()) {
                let name = entry[0];
                let results = entry[1];

                let parametersToLog = 0;
                if (this._myParams.myLogCallsCountResults) {
                    parametersToLog++;
                }

                if (this._myParams.myLogTotalExecutionTimeResults) {
                    parametersToLog++;
                }

                if (this._myParams.myLogTotalExecutionTimePercentageResults) {
                    parametersToLog++;
                }

                if (this._myParams.myLogAverageExecutionTimeResults) {
                    parametersToLog++;
                }

                let textOrdered = [];

                let callsCountText = ((parametersToLog > 1) ? "Calls Count: " : "");
                if (this._myParams.myFormatLog) {
                    for (let i = 0; i < this._myMaxCallsCountLength - results.myCallsCount.toFixed(0).length; i++) {
                        callsCountText += " ";
                    }
                }
                callsCountText += results.myCallsCount.toFixed(0);

                let totalExecutionTimeText = ((parametersToLog > 1) ? "Total Time: " : "");
                if (this._myParams.myFormatLog) {
                    for (let i = 0; i < this._myMaxTotalExecutionTimeLength - results.myTotalExecutionTime.toFixed(5).length; i++) {
                        totalExecutionTimeText += " ";
                    }
                }
                totalExecutionTimeText += results.myTotalExecutionTime.toFixed(5) + "ms";

                let totalExecutionTimePercentageText = ((parametersToLog > 1) ? "Total Time: " : "");
                if (this._myParams.myFormatLog) {
                    for (let i = 0; i < this._myMaxTotalExecutionTimePercentageLength - (results.myTotalExecutionTimePercentage * 100).toFixed(2).length; i++) {
                        totalExecutionTimePercentageText += " ";
                    }
                }
                totalExecutionTimePercentageText += (results.myTotalExecutionTimePercentage * 100).toFixed(2) + "%";

                let averageExecutionTimeText = ((parametersToLog > 1) ? "Average Time: " : "");
                if (this._myParams.myFormatLog) {
                    for (let i = 0; i < this._myMaxAverageExecutionTimeLength - results.myAverageExecutionTime.toFixed(5).length; i++) {
                        averageExecutionTimeText += " ";
                    }
                }
                averageExecutionTimeText += results.myAverageExecutionTime.toFixed(5) + "ms";

                if (!this._myParams.myLogCallsCountResults) {
                    callsCountText = null;
                }

                if (!this._myParams.myLogTotalExecutionTimeResults) {
                    totalExecutionTimeText = null;
                }

                if (!this._myParams.myLogTotalExecutionTimePercentageResults) {
                    totalExecutionTimePercentageText = null;
                }

                if (!this._myParams.myLogAverageExecutionTimeResults) {
                    averageExecutionTimeText = null;
                }

                switch (this._myParams.myLogSortOrder) {
                    case DebugFunctionsPerformanceAnalyzerSortOrder.CALLS_COUNT:
                        textOrdered.push(callsCountText);
                        textOrdered.push(totalExecutionTimeText);
                        textOrdered.push(totalExecutionTimePercentageText);
                        textOrdered.push(averageExecutionTimeText);
                        break;
                    case DebugFunctionsPerformanceAnalyzerSortOrder.TOTAL_EXECUTION_TIME:
                        textOrdered.push(totalExecutionTimeText);
                        textOrdered.push(totalExecutionTimePercentageText);
                        textOrdered.push(averageExecutionTimeText);
                        textOrdered.push(callsCountText);
                        break;
                    case DebugFunctionsPerformanceAnalyzerSortOrder.AVERAGE_EXECUTION_TIME:
                        textOrdered.push(averageExecutionTimeText);
                        textOrdered.push(totalExecutionTimeText);
                        textOrdered.push(totalExecutionTimePercentageText);
                        textOrdered.push(callsCountText);
                        break;
                    default:
                        textOrdered.push(callsCountText);
                        textOrdered.push(totalExecutionTimeText);
                        textOrdered.push(totalExecutionTimePercentageText);
                        textOrdered.push(averageExecutionTimeText);
                }

                resultsText += "\n";
                if (this._myParams.myFormatLog) {
                    let nameIndented = name + " ";
                    while (nameIndented.length < this._myMaxNameLength + 1) {
                        nameIndented += this._myParams.myFormatLogIndentationCharacter;
                    }
                    nameIndented += this._myParams.myFormatLogIndentationCharacter + " ";
                    resultsText += nameIndented;
                } else {
                    resultsText += name + " - ";
                }

                let avoidFirst = true;
                for (let text of textOrdered) {
                    if (text != null) {
                        if (avoidFirst) {
                            avoidFirst = false;
                        } else {
                            resultsText += " - ";
                        }

                        resultsText += text;
                    }
                }
            }

            if ((this._myParams.myLogTotalExecutionTimeResults || this._myParams.myLogTotalExecutionTimePercentageResults || this._myParams.myLogAverageExecutionTimeResults)) {
                console[this._myParams.myLogFunction]("\n" + this._myParams.myLogTitle, "\n\nTotal Time:", timeSinceLastReset.toFixed(5), "ms\n", resultsText);
            } else {
                console[this._myParams.myLogFunction]("\n" + this._myParams.myLogTitle, "\n", resultsText);
            }
        }
    }
}
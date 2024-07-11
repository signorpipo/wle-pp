import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";

const _mySetWidgetCurrentVariableCallbacks: WeakMap<Readonly<WonderlandEngine>, Map<unknown, (variableName: string) => void>> = new WeakMap();
const _myRefreshWidgetCallbacks: WeakMap<Readonly<WonderlandEngine>, Map<unknown, () => void>> = new WeakMap();

const _myAutoImportEnabledDefaultValues: WeakMap<Readonly<WonderlandEngine>, boolean> = new WeakMap();
const _myManualImportEnabledDefaultValues: WeakMap<Readonly<WonderlandEngine>, boolean> = new WeakMap();
const _myExportEnabledDefaultValues: WeakMap<Readonly<WonderlandEngine>, boolean> = new WeakMap();

export function setWidgetCurrentVariable(variableName: string, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    if (_mySetWidgetCurrentVariableCallbacks.has(engine)) {
        for (const callback of _mySetWidgetCurrentVariableCallbacks.get(engine)!.values()) {
            callback(variableName);
        }
    }
}

export function refreshWidget(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    if (_myRefreshWidgetCallbacks.has(engine)) {
        for (const callback of _myRefreshWidgetCallbacks.get(engine)!.values()) {
            callback();
        }
    }
}

/**
 *  @param fileURL Can contain parameters inside brackets, like `my-url.com/{param}`, which will be replaced with the same one on the current page url, like `www.currentpage.com/?param=2`  
 *                 If `null` or empty, it will import from the clipboard
 */
export function importVariables(fileURL: string | null = null, resetVariablesDefaultValueOnImport: boolean = false, skipValueChangedNotifyOnImport: boolean = false, manualImport: boolean = false, onSuccessCallback?: () => void, onFailureCallback?: () => void, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    if (fileURL == null || fileURL.length == 0) {
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(
                function (clipboard) {
                    Globals.getEasyTuneVariables(engine)!.fromJSON(clipboard, resetVariablesDefaultValueOnImport, skipValueChangedNotifyOnImport, manualImport);

                    EasyTuneUtils.refreshWidget(engine);

                    if (onSuccessCallback != null) {
                        onSuccessCallback();
                    }

                    console.log("Easy Tune Variables Imported from: clipboard");
                    console.log(clipboard);
                }
            ).catch(function (reason) {
                if (onFailureCallback != null) {
                    onFailureCallback();
                }

                console.error("An error occurred while importing the easy tune variables from: clipboard");
                console.error(reason);
            });
        }
    } else {
        const replacedFileURL = _importExportVariablesReplaceFileURLParams(fileURL);

        fetch(replacedFileURL).then(
            function (response) {
                if (response.ok) {
                    response.text().then(
                        function (text) {
                            Globals.getEasyTuneVariables(engine)!.fromJSON(text, resetVariablesDefaultValueOnImport, skipValueChangedNotifyOnImport, manualImport);

                            EasyTuneUtils.refreshWidget(engine);

                            if (onSuccessCallback != null) {
                                onSuccessCallback();
                            }

                            console.log("Easy Tune Variables Imported from:", replacedFileURL);
                            console.log(text);
                        }
                    ).catch(function (reason) {
                        if (onFailureCallback != null) {
                            onFailureCallback();
                        }

                        console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
                        console.error(reason);
                    });
                } else {
                    if (onFailureCallback != null) {
                        onFailureCallback();
                    }

                    console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
                    console.error(response);
                }
            }
        ).catch(function (reason) {
            if (onFailureCallback != null) {
                onFailureCallback();
            }

            console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
            console.error(reason);
        });
    }

    EasyTuneUtils.refreshWidget(engine);
}


/**
 *  @param fileURL Can contain parameters inside brackets, like `my-url.com/{param}`, which will be replaced with the same one on the current page url, like `www.currentpage.com/?param=2`  
 *                 If `null` or empty, it will import from the clipboard
 */
export function getImportVariablesJSON(fileURL: string | null = null, onSuccessCallback?: (variablesJSON: string) => void, onFailureCallback?: () => void, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    if (fileURL == null || fileURL.length == 0) {
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(
                function (clipboard) {
                    if (onSuccessCallback != null) {
                        onSuccessCallback(clipboard);
                    }
                }
            ).catch(function (reason) {
                if (onFailureCallback != null) {
                    onFailureCallback();
                }
            });
        }
    } else {
        const replacedFileURL = _importExportVariablesReplaceFileURLParams(fileURL);

        fetch(replacedFileURL).then(
            function (response) {
                if (response.ok) {
                    response.text().then(
                        function (text) {
                            if (onSuccessCallback != null) {
                                onSuccessCallback(text);
                            }
                        }
                    ).catch(function (reason) {
                        if (onFailureCallback != null) {
                            onFailureCallback();
                        }
                    });
                } else {
                    if (onFailureCallback != null) {
                        onFailureCallback();
                    }
                }
            }
        ).catch(function (reason) {
            if (onFailureCallback != null) {
                onFailureCallback();
            }
        });
    }
}


/**
 *  @param fileURL Can contain parameters inside brackets, like `my-url.com/{param}`, which will be replaced with the same one on the current page url, like `www.currentpage.com/?param=2`  
 *                 If `null` or empty, it will import from the clipboard
 */
export function exportVariables(fileURL: string | null = null, excludeVariablesWithValueAsDefault: boolean, variablesToKeep?: Record<string, unknown>, onSuccessCallback?: () => void, onFailureCallback?: () => void, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    const variablesJSONToExport = Globals.getEasyTuneVariables(engine)!.toJSON(excludeVariablesWithValueAsDefault);
    EasyTuneUtils.exportVariablesJSON(variablesJSONToExport, fileURL, variablesToKeep, onSuccessCallback, onFailureCallback, engine);
}


/**
 *  @param fileURL Can contain parameters inside brackets, like `my-url.com/{param}`, which will be replaced with the same one on the current page url, like `www.currentpage.com/?param=2`  
 *                 If `null` or empty, it will import from the clipboard
 */
export function exportVariablesByName(variableNamesToExport: string[], fileURL: string | null = null, excludeVariablesWithValueAsDefault: boolean, variablesToKeep?: Record<string, unknown>, onSuccessCallback?: () => void, onFailureCallback?: () => void, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    const objectJSON: Record<string, unknown> = {};

    const easyTuneVariables = Globals.getEasyTuneVariables(engine)!;
    for (const variableName of variableNamesToExport) {
        const variable = easyTuneVariables.getEasyTuneVariable(variableName);
        if (variable != null && variable.isExportEnabled()) {
            if (!excludeVariablesWithValueAsDefault || !variable.isValueEqual(variable.getDefaultValue())) {
                objectJSON[variable.getName()] = variable.toJSON();
            }
        }
    }

    const variablesJSONToExport = JSON.stringify(objectJSON);
    EasyTuneUtils.exportVariablesJSON(variablesJSONToExport, fileURL, variablesToKeep, onSuccessCallback, onFailureCallback, engine);
}


/**
 *  @param fileURL Can contain parameters inside brackets, like `my-url.com/{param}`, which will be replaced with the same one on the current page url, like `www.currentpage.com/?param=2`  
 *                 If `null` or empty, it will import from the clipboard
 */
export function exportVariablesJSON(variablesJSONToExport: string, fileURL: string | null = null, variablesToKeep?: Record<string, unknown>, onSuccessCallback?: () => void, onFailureCallback?: () => void, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    // Useful if some variables are not in the json export and therefore would not be there anymore
    if (variablesToKeep != null) {
        try {
            const variablesToExport = JSON.parse(variablesJSONToExport);
            for (const variableName in variablesToKeep) {
                if (!(variableName in variablesToExport)) {
                    variablesToExport[variableName] = variablesToKeep[variableName];
                }
            }

            variablesJSONToExport = JSON.stringify(variablesToExport);
        } catch (error) {
            // Do nothing
        }
    }

    if (fileURL == null || fileURL.length == 0) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(variablesJSONToExport).then(
                function () {
                    if (onSuccessCallback != null) {
                        onSuccessCallback();
                    }

                    console.log("Easy Tune Variables Exported to: clipboard");
                    console.log(variablesJSONToExport);
                },
                function () {
                    if (onFailureCallback != null) {
                        onFailureCallback();
                    }

                    console.error("An error occurred while exporting the easy tune variables to: clipboard");
                }
            ).catch(function (reason) {
                if (onFailureCallback != null) {
                    onFailureCallback();
                }

                console.error("An error occurred while exporting the easy tune variables to: clipboard");
                console.error(reason);
            });
        }
    } else {
        const replacedFileURL = _importExportVariablesReplaceFileURLParams(fileURL);

        fetch(replacedFileURL, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: variablesJSONToExport
        }).then(
            function (response) {
                if (response.ok) {
                    if (onSuccessCallback != null) {
                        onSuccessCallback();
                    }

                    console.log("Easy Tune Variables Exported to:", replacedFileURL);
                    console.log(variablesJSONToExport);
                } else {
                    if (onFailureCallback != null) {
                        onFailureCallback();
                    }

                    console.error("An error occurred while exporting the easy tune variables to:", replacedFileURL);
                    console.error(response);
                }
            },
            function (response) {
                if (onFailureCallback != null) {
                    onFailureCallback();
                }

                console.error("An error occurred while exporting the easy tune variables to:", replacedFileURL);
                console.error(response);
            }
        ).catch(function (reason) {
            if (onFailureCallback != null) {
                onFailureCallback();
            }

            console.error("An error occurred while exporting the easy tune variables to:", replacedFileURL);
            console.error(reason);
        });
    }
}


/**
 *  @param fileURL Can contain parameters inside brackets, like `my-url.com/{param}`, which will be replaced with the same one on the current page url, like `www.currentpage.com/?param=2`  
 *                 If `null` or empty, it will import from the clipboard
 */
export function clearExportedVariables(fileURL: string | null = null, onSuccessCallback?: () => void, onFailureCallback?: () => void, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    EasyTuneUtils.exportVariablesJSON("", fileURL, undefined, onSuccessCallback, onFailureCallback, engine);
}

export function setAutoImportEnabledDefaultValue(defaultValue: boolean, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    _myAutoImportEnabledDefaultValues.set(engine, defaultValue);
}

export function setManualImportEnabledDefaultValue(defaultValue: boolean, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    _myManualImportEnabledDefaultValues.set(engine, defaultValue);
}

export function setExportEnabledDefaultValue(defaultValue: boolean, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    _myExportEnabledDefaultValues.set(engine, defaultValue);
}

export function getAutoImportEnabledDefaultValue(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): boolean {
    let defaultValue = true;

    if (_myAutoImportEnabledDefaultValues.has(engine)) {
        defaultValue = _myAutoImportEnabledDefaultValues.get(engine) ?? false;
    }

    return defaultValue;
}

export function getManualImportEnabledDefaultValue(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): boolean {
    let defaultValue = true;

    if (_myManualImportEnabledDefaultValues.has(engine)) {
        defaultValue = _myManualImportEnabledDefaultValues.get(engine) ?? false;
    }

    return defaultValue;
}

export function getExportEnabledDefaultValue(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): boolean {
    let defaultValue = true;

    if (_myExportEnabledDefaultValues.has(engine)) {
        defaultValue = _myExportEnabledDefaultValues.get(engine) ?? false;
    }

    return defaultValue;
}

export function addSetWidgetCurrentVariableCallback(id: unknown, callback: (variableName: string) => void, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    if (!_mySetWidgetCurrentVariableCallbacks.has(engine)) {
        _mySetWidgetCurrentVariableCallbacks.set(engine, new Map());
    }

    _mySetWidgetCurrentVariableCallbacks.get(engine)!.set(id, callback);
}

export function removeSetWidgetCurrentVariableCallback(id: unknown, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    if (_mySetWidgetCurrentVariableCallbacks.has(engine)) {
        _mySetWidgetCurrentVariableCallbacks.get(engine)!.delete(id);
    }
}

export function addRefreshWidgetCallback(id: unknown, callback: () => void, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    if (!_myRefreshWidgetCallbacks.has(engine)) {
        _myRefreshWidgetCallbacks.set(engine, new Map());
    }

    _myRefreshWidgetCallbacks.get(engine)!.set(id, callback);
}

export function removeRefreshWidgetCallback(id: unknown, engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!): void {
    if (_myRefreshWidgetCallbacks.has(engine)) {
        _myRefreshWidgetCallbacks.get(engine)!.delete(id);
    }
}

export const EasyTuneUtils = {
    setWidgetCurrentVariable,
    refreshWidget,
    importVariables,
    getImportVariablesJSON,
    exportVariables,
    exportVariablesByName,
    exportVariablesJSON,
    clearExportedVariables,
    setAutoImportEnabledDefaultValue,
    setManualImportEnabledDefaultValue,
    setExportEnabledDefaultValue,
    getAutoImportEnabledDefaultValue,
    getManualImportEnabledDefaultValue,
    getExportEnabledDefaultValue,
    addSetWidgetCurrentVariableCallback,
    removeSetWidgetCurrentVariableCallback,
    addRefreshWidgetCallback,
    removeRefreshWidgetCallback
} as const;



const _importExportVariablesReplaceFileURLParams = function () {
    const matchEasyTuneURLParamsRegex = new RegExp("\\{.+?\\}", "g");
    return function _importExportVariablesReplaceFileURLParams(fileURL: string) {
        const params = fileURL.match(matchEasyTuneURLParamsRegex);

        if (params == null || params.length == 0) {
            return fileURL;
        }

        for (let i = 0; i < params.length; i++) {
            params[i] = params[i].replace("{", "");
            params[i] = params[i].replace("}", "");
        }

        const urlQuery = window.location.search;
        const urlSearchParams = new URLSearchParams(urlQuery);

        let replacedFileURL = fileURL;

        for (const param of params) {
            const searchParamValue = urlSearchParams.get(param);
            if (searchParamValue != null) {
                replacedFileURL = replacedFileURL.replace("{" + param + "}", searchParamValue);
            }
        }

        return replacedFileURL;
    };
}();
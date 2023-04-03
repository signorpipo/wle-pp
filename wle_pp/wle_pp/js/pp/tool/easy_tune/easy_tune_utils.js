import { getMainEngine } from "../../cauldron/wl/engine_globals";
import { getEasyTuneVariables } from "./easy_tune_globals";

let _mySetEasyTuneWidgetActiveVariableCallbacks = new WeakMap();
let _myRefreshEasyTuneWidgetCallbacks = new WeakMap();

export function setEasyTuneWidgetActiveVariable(variableName, engine = getMainEngine()) {
    if (_mySetEasyTuneWidgetActiveVariableCallbacks.has(engine)) {
        for (let callback of _mySetEasyTuneWidgetActiveVariableCallbacks.get(engine).values()) {
            callback(variableName);
        }
    }
}

export function refreshEasyTuneWidget(engine = getMainEngine()) {
    if (_myRefreshEasyTuneWidgetCallbacks.has(engine)) {
        for (let callback of _myRefreshEasyTuneWidgetCallbacks.get(engine).values()) {
            callback();
        }
    }
}

// fileURL can contain parameters inside brackets, like {param}
// Those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
export function importEasyTuneVariables(fileURL = null, resetVariablesDefaultValueOnImport = false, onSuccessCallback = null, onFailureCallback = null, engine = getMainEngine()) {
    if (fileURL == null || fileURL.length == 0) {
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(
                function (clipboard) {
                    getEasyTuneVariables(engine).fromJSON(clipboard, resetVariablesDefaultValueOnImport);

                    refreshEasyTuneWidget(engine);

                    if (onSuccessCallback != null) {
                        onSuccessCallback();
                    }

                    console.log("Easy Tune Variables Imported from: clipboard");
                    console.log(clipboard);
                }, function () {
                    if (onFailureCallback != null) {
                        onFailureCallback();
                    }

                    console.error("An error occurred while importing the easy tune variables from: clipboard");
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
        let replacedFileURL = _importExportEasyTuneVariablesReplaceFileURLParams(fileURL);

        fetch(replacedFileURL).then(
            function (response) {
                if (response.ok) {
                    response.text().then(
                        function (text) {
                            getEasyTuneVariables(engine).fromJSON(text, resetVariablesDefaultValueOnImport);

                            refreshEasyTuneWidget(engine);

                            if (onSuccessCallback != null) {
                                onSuccessCallback();
                            }

                            console.log("Easy Tune Variables Imported from:", replacedFileURL);
                            console.log(text);
                        },
                        function (response) {
                            if (onFailureCallback != null) {
                                onFailureCallback();
                            }

                            console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
                            console.error(response);
                        }
                    );
                } else {
                    if (onFailureCallback != null) {
                        onFailureCallback();
                    }

                    console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
                    console.error(response);
                }
            },
            function (response) {
                if (onFailureCallback != null) {
                    onFailureCallback();
                }

                console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
                console.error(response);
            }
        ).catch(function (reason) {
            if (onFailureCallback != null) {
                onFailureCallback();
            }

            console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
            console.error(reason);
        });
    }

    refreshEasyTuneWidget(engine);
}

// fileURL can contain parameters inside brackets, like {param}
// Those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
export function exportEasyTuneVariables(fileURL = null, onSuccessCallback = null, onFailureCallback = null, engine = getMainEngine()) {
    let jsonVariables = getEasyTuneVariables(engine).toJSON();

    if (fileURL == null || fileURL.length == 0) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(jsonVariables).then(
                function () {
                    if (onSuccessCallback != null) {
                        onSuccessCallback();
                    }

                    console.log("Easy Tune Variables Exported to: clipboard");
                    console.log(jsonVariables);
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
        let replacedFileURL = _importExportEasyTuneVariablesReplaceFileURLParams(fileURL);

        fetch(replacedFileURL, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: jsonVariables
        }).then(
            function (response) {
                if (response.ok) {
                    if (onSuccessCallback != null) {
                        onSuccessCallback();
                    }

                    console.log("Easy Tune Variables Exported to:", replacedFileURL);
                    console.log(jsonVariables);
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

export function addSetEasyTuneWidgetActiveVariableCallback(id, callback, engine = getMainEngine()) {
    if (!_mySetEasyTuneWidgetActiveVariableCallbacks.has(engine)) {
        _mySetEasyTuneWidgetActiveVariableCallbacks.set(engine, new Map());
    }

    _mySetEasyTuneWidgetActiveVariableCallbacks.get(engine).set(id, callback);
}

export function removeSetEasyTuneWidgetActiveVariableCallback(id, engine = getMainEngine()) {
    if (_mySetEasyTuneWidgetActiveVariableCallbacks.has(engine)) {
        _mySetEasyTuneWidgetActiveVariableCallbacks.get(engine).delete(id);
    }
}

export function addRefreshEasyTuneWidgetCallback(id, callback, engine = getMainEngine()) {
    if (!_myRefreshEasyTuneWidgetCallbacks.has(engine)) {
        _myRefreshEasyTuneWidgetCallbacks.set(engine, new Map());
    }

    _myRefreshEasyTuneWidgetCallbacks.get(engine).set(id, callback);
}

export function removeRefreshEasyTuneWidgetCallback(id, engine = getMainEngine()) {
    if (_myRefreshEasyTuneWidgetCallbacks.has(engine)) {
        _myRefreshEasyTuneWidgetCallbacks.get(engine).delete(id);
    }
}

export let EasyTuneUtils = {
    setEasyTuneWidgetActiveVariable,
    refreshEasyTuneWidget,
    importEasyTuneVariables,
    exportEasyTuneVariables,
    addSetEasyTuneWidgetActiveVariableCallback,
    removeSetEasyTuneWidgetActiveVariableCallback,
    addRefreshEasyTuneWidgetCallback,
    removeRefreshEasyTuneWidgetCallback
};



function _importExportEasyTuneVariablesReplaceFileURLParams(fileURL) {
    let params = fileURL.match(/\{.+?\}/g);

    if (params == null || params.length == 0) {
        return fileURL;
    }

    for (let i = 0; i < params.length; i++) {
        params[i] = params[i].replace("{", "");
        params[i] = params[i].replace("}", "");
    }

    let urlSearchParams = new URL(document.location).searchParams;

    let replacedFileURL = fileURL;

    for (let param of params) {
        let searchParamValue = urlSearchParams.get(param);
        if (searchParamValue != null) {
            replacedFileURL = replacedFileURL.replace("{" + param + "}", searchParamValue);
        }
    }

    return replacedFileURL;
}
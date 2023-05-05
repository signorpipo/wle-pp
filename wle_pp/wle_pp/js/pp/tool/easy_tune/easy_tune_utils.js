import { Globals } from "../../pp/globals";

let _mySetWidgetActiveVariableCallbacks = new WeakMap();    // Signature: callback(variableName)
let _myRefreshWidgetCallbacks = new WeakMap();              // Signature: callback()

export function setWidgetActiveVariable(variableName, engine = Globals.getMainEngine()) {
    if (_mySetWidgetActiveVariableCallbacks.has(engine)) {
        for (let callback of _mySetWidgetActiveVariableCallbacks.get(engine).values()) {
            callback(variableName);
        }
    }
}

export function refreshWidget(engine = Globals.getMainEngine()) {
    if (_myRefreshWidgetCallbacks.has(engine)) {
        for (let callback of _myRefreshWidgetCallbacks.get(engine).values()) {
            callback();
        }
    }
}

// fileURL can contain parameters inside brackets, like {param}
// Those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
export function importVariables(fileURL = null, resetVariablesDefaultValueOnImport = false, onSuccessCallback = null, onFailureCallback = null, engine = Globals.getMainEngine()) {
    if (fileURL == null || fileURL.length == 0) {
        if (Globals.getNavigator(engine).clipboard) {
            Globals.getNavigator(engine).clipboard.readText().then(
                function (clipboard) {
                    Globals.getEasyTuneVariables(engine).fromJSON(clipboard, resetVariablesDefaultValueOnImport);

                    EasyTuneUtils.refreshWidget(engine);

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
        let replacedFileURL = _importExportVariablesReplaceFileURLParams(fileURL, engine);

        fetch(replacedFileURL).then(
            function (response) {
                if (response.ok) {
                    response.text().then(
                        function (text) {
                            Globals.getEasyTuneVariables(engine).fromJSON(text, resetVariablesDefaultValueOnImport);

                            EasyTuneUtils.refreshWidget(engine);

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

    EasyTuneUtils.refreshWidget(engine);
}

// fileURL can contain parameters inside brackets, like {param}
// Those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
export function exportVariables(fileURL = null, onSuccessCallback = null, onFailureCallback = null, engine = Globals.getMainEngine()) {
    let jsonVariables = Globals.getEasyTuneVariables(engine).toJSON();

    if (fileURL == null || fileURL.length == 0) {
        if (Globals.getNavigator(engine).clipboard) {
            Globals.getNavigator(engine).clipboard.writeText(jsonVariables).then(
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
        let replacedFileURL = _importExportVariablesReplaceFileURLParams(fileURL, engine);

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

export function addSetWidgetActiveVariableCallback(id, callback, engine = Globals.getMainEngine()) {
    if (!_mySetWidgetActiveVariableCallbacks.has(engine)) {
        _mySetWidgetActiveVariableCallbacks.set(engine, new Map());
    }

    _mySetWidgetActiveVariableCallbacks.get(engine).set(id, callback);
}

export function removeSetWidgetActiveVariableCallback(id, engine = Globals.getMainEngine()) {
    if (_mySetWidgetActiveVariableCallbacks.has(engine)) {
        _mySetWidgetActiveVariableCallbacks.get(engine).delete(id);
    }
}

export function addRefreshWidgetCallback(id, callback, engine = Globals.getMainEngine()) {
    if (!_myRefreshWidgetCallbacks.has(engine)) {
        _myRefreshWidgetCallbacks.set(engine, new Map());
    }

    _myRefreshWidgetCallbacks.get(engine).set(id, callback);
}

export function removeRefreshWidgetCallback(id, engine = Globals.getMainEngine()) {
    if (_myRefreshWidgetCallbacks.has(engine)) {
        _myRefreshWidgetCallbacks.get(engine).delete(id);
    }
}

export let EasyTuneUtils = {
    setWidgetActiveVariable,
    refreshWidget,
    importVariables,
    exportVariables,
    addSetWidgetActiveVariableCallback,
    removeSetWidgetActiveVariableCallback,
    addRefreshWidgetCallback,
    removeRefreshWidgetCallback
};



function _importExportVariablesReplaceFileURLParams(fileURL, engine = Globals.getMainEngine()) {
    let params = fileURL.match(/\{.+?\}/g);

    if (params == null || params.length == 0) {
        return fileURL;
    }

    for (let i = 0; i < params.length; i++) {
        params[i] = params[i].replace("{", "");
        params[i] = params[i].replace("}", "");
    }

    let urlSearchParams = new URL(Globals.getDocument(engine).location).searchParams;

    let replacedFileURL = fileURL;

    for (let param of params) {
        let searchParamValue = urlSearchParams.get(param);
        if (searchParamValue != null) {
            replacedFileURL = replacedFileURL.replace("{" + param + "}", searchParamValue);
        }
    }

    return replacedFileURL;
}
PP.myEasyTuneVariables = new PP.EasyTuneVariables();

PP.myEasyTuneTarget = null;

// fileURL can contain parameters inside brackets, like {param}
// those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
PP.importEasyTuneVariables = function importEasyTuneVariables(fileURL = null, resetVariablesDefaultValueOnImport = false, onSuccessCallback = null, onFailureCallback = null) {
    if (fileURL == null || fileURL.length == 0) {
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(
                function (clipboard) {
                    PP.myEasyTuneVariables.fromJSON(clipboard, resetVariablesDefaultValueOnImport);

                    PP.refreshEasyTuneWidget();

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
        let replacedFileURL = PP._importExportEasyTuneVariablesReplaceFileURLParams(fileURL);

        fetch(replacedFileURL).then(
            function (response) {
                if (response.ok) {
                    response.text().then(
                        function (text) {
                            PP.myEasyTuneVariables.fromJSON(text, resetVariablesDefaultValueOnImport);

                            PP.refreshEasyTuneWidget();

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

    PP.refreshEasyTuneWidget();
};

// fileURL can contain parameters inside brackets, like {param}
// those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
PP.exportEasyTuneVariables = function exportEasyTuneVariables(fileURL = null, onSuccessCallback = null, onFailureCallback = null) {
    let jsonVariables = PP.myEasyTuneVariables.toJSON();

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
        let replacedFileURL = PP._importExportEasyTuneVariablesReplaceFileURLParams(fileURL);

        fetch(replacedFileURL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
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
};

PP.mySetEasyTuneWidgetActiveVariableCallbacks = [];
PP.setEasyTuneWidgetActiveVariable = function setEasyTuneWidgetActiveVariable(variableName) {
    for (let callback of PP.mySetEasyTuneWidgetActiveVariableCallbacks) {
        callback(variableName);
    }
};

PP.myRefreshEasyTuneWidgetCallbacks = [];
PP.refreshEasyTuneWidget = function refreshEasyTuneWidget() {
    for (let callback of PP.myRefreshEasyTuneWidgetCallbacks) {
        callback();
    }
};

PP._importExportEasyTuneVariablesReplaceFileURLParams = function _importExportEasyTuneVariablesReplaceFileURLParams(fileURL) {
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
};
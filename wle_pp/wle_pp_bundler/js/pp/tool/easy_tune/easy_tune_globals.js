PP.myEasyTuneVariables = new PP.EasyTuneVariables();

PP.myEasyTuneTarget = null;

// fileURL can contain parameters inside brackets, like {param}
// those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
PP.importEasyTuneVariables = function (fileURL = null, resetDefaultValue = false) {
    if (fileURL == null || fileURL.length == 0) {
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(
                function (clipboard) {
                    PP.myEasyTuneVariables.fromJSON(clipboard, resetDefaultValue);

                    PP.refreshEasyTuneWidget();

                    console.log("Easy Tune Variables Imported from: clipboard");
                    console.log(clipboard);
                }, function () {
                    console.error("An error occurred while importing the easy tune variables from: clipboard");
                }
            ).catch(function (reason) {
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
                            PP.myEasyTuneVariables.fromJSON(text, resetDefaultValue);

                            PP.refreshEasyTuneWidget();

                            console.log("Easy Tune Variables Imported from:", replacedFileURL);
                            console.log(text);
                        },
                        function (response) {
                            console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
                            console.error(response);
                        }
                    );
                } else {
                    console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
                    console.error(response);
                }
            },
            function (response) {
                console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
                console.error(response);
            }
        ).catch(function (reason) {
            console.error("An error occurred while importing the easy tune variables from:", replacedFileURL);
            console.error(reason);
        });
    }

    PP.refreshEasyTuneWidget();
};

// fileURL can contain parameters inside brackets, like {param}
// those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
PP.exportEasyTuneVariables = function (fileURL = null) {
    let jsonVariables = PP.myEasyTuneVariables.toJSON();

    if (fileURL == null || fileURL.length == 0) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(jsonVariables).then(
                function () {
                    console.log("Easy Tune Variables Exported to: clipboard");
                    console.log(jsonVariables);
                },
                function () {
                    console.error("An error occurred while exporting the easy tune variables to: clipboard");
                }
            ).catch(function (reason) {
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
                    console.log("Easy Tune Variables Exported to:", replacedFileURL);
                    console.log(jsonVariables);
                } else {
                    console.error("An error occurred while exporting the easy tune variables to:", replacedFileURL);
                    console.error(response);
                }
            },
            function (response) {
                console.error("An error occurred while exporting the easy tune variables to:", replacedFileURL);
                console.error(response);
            }
        ).catch(function (reason) {
            console.error("An error occurred while exporting the easy tune variables to:", replacedFileURL);
            console.error(reason);
        });
    }
};

PP.mySetEasyTuneWidgetActiveVariableCallbacks = [];
PP.setEasyTuneWidgetActiveVariable = function (variableName) {
    for (let callback of PP.mySetEasyTuneWidgetActiveVariableCallbacks) {
        callback(variableName);
    }
};

PP.myRefreshEasyTuneWidgetCallbacks = [];
PP.refreshEasyTuneWidget = function () {
    for (let callback of PP.myRefreshEasyTuneWidgetCallbacks) {
        callback();
    }
};

PP._importExportEasyTuneVariablesReplaceFileURLParams = function (fileURL) {
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
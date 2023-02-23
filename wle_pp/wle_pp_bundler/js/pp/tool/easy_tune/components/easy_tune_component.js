WL.registerComponent('pp-easy-tune', {
    _myHandedness: { type: WL.Type.Enum, values: ['none', 'left', 'right'], default: 'none' },
    _myShowOnStart: { type: WL.Type.Bool, default: false },
    _myShowVisibilityButton: { type: WL.Type.Bool, default: false },
    _myEnableGamepadScrollVariable: { type: WL.Type.Bool, default: true },
    _myEnableVariablesImportExportButtons: { type: WL.Type.Bool, default: false },
    _myVariablesImportURL: { type: WL.Type.String, default: '' },   // the URL can contain parameters inside brackets, like {param}
    _myVariablesExportURL: { type: WL.Type.String, default: '' },   // those parameters will be replaced with the same one on the current page url, like www.currentpage.com/?param=2
    _myImportVariablesOnStart: { type: WL.Type.Bool, default: false },
    _myResetVariablesDefaultValueOnImport: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
        this._myWidget = new PP.EasyTuneWidget();

        PP.mySetEasyTuneWidgetActiveVariableCallbacks.push(function (variableName) {
            this._myWidget.setActiveVariable(variableName);
        }.bind(this));

        PP.myRefreshEasyTuneWidgetCallbacks.push(function () {
            this._myWidget.refresh();
        }.bind(this));

        this._myStarted = false;
    },
    start: function () {
        let additionalSetup = new PP.EasyTuneWidgetAdditionalSetup();
        additionalSetup.myHandedness = [null, 'left', 'right'][this._myHandedness];
        additionalSetup.myShowOnStart = this._myShowOnStart;
        additionalSetup.myShowVisibilityButton = this._myShowVisibilityButton;
        additionalSetup.myEnableAdditionalButtons = true;
        additionalSetup.myEnableGamepadScrollVariable = this._myEnableGamepadScrollVariable;
        additionalSetup.myPlaneMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
        additionalSetup.myTextMaterial = PP.myDefaultResources.myMaterials.myText.clone();

        additionalSetup.myEnableVariablesImportExportButtons = this._myEnableVariablesImportExportButtons;
        additionalSetup.myVariablesImportCallback = function (onSuccessCallback, onFailureCallback) {
            PP.importEasyTuneVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport, onSuccessCallback, onFailureCallback);
        }.bind(this);
        additionalSetup.myVariablesExportCallback = function (onSuccessCallback, onFailureCallback) {
            PP.exportEasyTuneVariables(this._myVariablesExportURL, onSuccessCallback, onFailureCallback);
        }.bind(this);

        this._myWidget.start(this.object, additionalSetup, PP.myEasyTuneVariables);

        this._myWidgetVisibleBackup = this._myWidget.isVisible();
        this._mySetVisibleNextUpdate = false;

        this._myStarted = true;
        this._myFirstUpdate = true;
    },
    update: function (dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            if (this._myImportVariablesOnStart) {
                PP.importEasyTuneVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport);
            }
        }

        if (this._mySetVisibleNextUpdate) {
            this._mySetVisibleNextUpdate = false;
            this._myWidget.setVisible(false);
            this._myWidget.setVisible(this._myWidgetVisibleBackup);
        }

        this._myWidget.update(dt);
    },
    onActivate() {
        this._mySetVisibleNextUpdate = true;
    },
    onDeactivate() {
        if (this._myStarted) {
            this._myWidgetVisibleBackup = this._myWidget.isVisible();

            this._myWidget.setVisible(false);
        }
    },
});
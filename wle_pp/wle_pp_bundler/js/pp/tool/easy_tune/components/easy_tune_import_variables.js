WL.registerComponent("pp-easy-tune-import-variables", {
    _myVariablesImportURL: { type: WL.Type.String, default: '' },
    _myResetVariablesDefaultValueOnImport: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
    },
    start: function () {
        this._myFirstUpdate = true;
    },
    update: function (dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            PP.importEasyTuneVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport);
        }
    }
});
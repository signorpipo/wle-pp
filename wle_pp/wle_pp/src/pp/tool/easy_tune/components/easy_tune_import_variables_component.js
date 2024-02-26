import { Component, Property } from "@wonderlandengine/api";
import { EasyTuneUtils } from "../easy_tune_utils.js";

export class EasyTuneImportVariablesComponent extends Component {
    static TypeName = "pp-easy-tune-import-variables";
    static Properties = {
        _myVariablesImportURL: Property.string(""),
        _myResetVariablesDefaultValueOnImport: Property.bool(true)
    };

    start() {
        this._myFirstUpdate = true;
    }

    update(dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            EasyTuneUtils.importVariables(this._myVariablesImportURL, this._myResetVariablesDefaultValueOnImport, false, undefined, undefined, this.engine);
        }
    }
}
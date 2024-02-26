import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { EasyTuneVariables } from "../easy_tune_variables.js";

export class InitEasyTuneVariablesComponent extends Component {
    static TypeName = "pp-init-easy-tune-variables";
    static Properties = {
        _myInit: Property.bool(true)
    };

    init() {
        this._myEasyTuneVariables = null;

        if (this._myInit) {
            // Prevents double global from same engine
            if (!Globals.hasEasyTuneVariables(this.engine)) {
                this._myEasyTuneVariables = new EasyTuneVariables();

                Globals.setEasyTuneVariables(this._myEasyTuneVariables, this.engine);
            }
        }
    }

    onDestroy() {
        if (this._myEasyTuneVariables != null && Globals.getEasyTuneVariables(this.engine) == this._myEasyTuneVariables) {
            Globals.removeEasyTuneVariables(this.engine);
        }
    }
}
import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../../pp/globals.js";
import { EasyScale } from "../easy_scale.js";

export class EasyScaleComponent extends Component {
    static TypeName = "pp-easy-scale";
    static Properties = {
        _myVariableName: Property.string(""),
        _mySetAsWidgetCurrentVariable: Property.bool(false),
        _myUseTuneTarget: Property.bool(false),
        _myLocal: Property.bool(false),
        _myScaleAsOne: Property.bool(true) // Edit all scale values together
    };

    init() {
        this._myEasyObjectTuner = null;

        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyScale(this._myLocal, this._myScaleAsOne, this.object, this._myVariableName, this._mySetAsWidgetCurrentVariable, this._myUseTuneTarget);
        }
    }

    start() {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.start();
            }
        }
    }

    update(dt) {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.update(dt);
            }
        }
    }
}
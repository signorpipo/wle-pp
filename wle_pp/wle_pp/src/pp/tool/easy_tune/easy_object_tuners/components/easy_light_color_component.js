import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../../pp/globals.js";
import { EasyLightColor } from "../easy_light_color.js";

export class EasyLightColorComponent extends Component {
    static TypeName = "pp-easy-light-color";
    static Properties = {
        _myVariableName: Property.string(""),
        _mySetAsWidgetCurrentVariable: Property.bool(false),
        _myUseTuneTarget: Property.bool(false),
        _myColorModel: Property.enum(["RGB", "HSV"], "HSV")
    };

    init() {
        this._myEasyObjectTuner = null;

        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyLightColor(this._myColorModel, this.object, this._myVariableName, this._mySetAsWidgetCurrentVariable, this._myUseTuneTarget);
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
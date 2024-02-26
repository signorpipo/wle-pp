import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../../pp/globals.js";
import { EasyTextColor } from "../easy_text_color.js";

export class EasyTextColorComponent extends Component {
    static TypeName = "pp-easy-text-color";
    static Properties = {
        _myVariableName: Property.string(""),
        _mySetAsWidgetCurrentVariable: Property.bool(false),
        _myUseTuneTarget: Property.bool(false),
        _myColorModel: Property.enum(["RGB", "HSV"], "HSV"),
        _myColorType: Property.enum(["Color", "Effect Color"], "Color")
    };

    init() {
        this._myEasyObjectTuner = null;

        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyTextColor(this._myColorModel, this._myColorType, this.object, this._myVariableName, this._mySetAsWidgetCurrentVariable, this._myUseTuneTarget);
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
import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../../pp/globals";
import { EasyLightAttenuation } from "../easy_light_attenuation";

export class EasyLightAttenuationComponent extends Component {
    static TypeName = "pp-easy-light-attenuation";
    static Properties = {
        _myVariableName: Property.string(""),
        _mySetAsWidgetCurrentVariable: Property.bool(false),
        _myUseTuneTarget: Property.bool(false)
    };

    init() {
        this._myEasyObjectTuner = null;

        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyLightAttenuation(this.object, this._myVariableName, this._mySetAsWidgetCurrentVariable, this._myUseTuneTarget);
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
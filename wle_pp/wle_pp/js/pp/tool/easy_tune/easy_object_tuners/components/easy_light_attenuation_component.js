import { Component, Property } from "@wonderlandengine/api";
import { isToolEnabled } from "../../../cauldron/tool_globals";
import { EasyLightAttenuation } from "../easy_light_attenuation";

export class EasyLightAttenuationComponent extends Component {
    static TypeName = "pp-easy-light-attenuation";
    static Properties = {
        _myVariableName: Property.string(""),
        _mySetAsDefault: Property.bool(false),
        _myUseTuneTarget: Property.bool(false)
    };

    init() {
        this._myEasyObjectTuner = null;

        if (isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyLightAttenuation(this.object, this._myVariableName, this._mySetAsDefault, this._myUseTuneTarget);
        }
    }

    start() {
        if (isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.start();
            }
        }
    }

    update(dt) {
        if (isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.update(dt);
            }
        }
    }
}
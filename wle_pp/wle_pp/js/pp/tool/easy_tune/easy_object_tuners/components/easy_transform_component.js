import { Component, Property } from "@wonderlandengine/api";
import { ComponentUtils } from "../../../../cauldron/wl/utils/component_utils";
import { Globals } from "../../../../pp/globals";
import { EasyTransform } from "../easy_transform";

export class EasyTransformComponent extends Component {
    static TypeName = "pp-easy-transform";
    static Properties = {
        _myVariableName: Property.string(""),
        _mySetAsDefault: Property.bool(false),
        _myUseTuneTarget: Property.bool(false),
        _myLocal: Property.bool(false),
        _myScaleAsOne: Property.bool(true) // Edit all scale values together
    };

    init() {
        this._myEasyObjectTuner = null;

        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyTransform(this._myLocal, this._myScaleAsOne, this.object, this._myVariableName, this._mySetAsDefault, this._myUseTuneTarget);
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

    pp_clone(targetObject) {
        let clonedComponent = ComponentUtils.cloneDefault(this, targetObject);

        return clonedComponent;
    }
}
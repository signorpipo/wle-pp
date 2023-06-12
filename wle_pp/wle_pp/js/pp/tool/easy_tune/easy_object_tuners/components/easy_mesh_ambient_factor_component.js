import { Component, Property } from "@wonderlandengine/api";
import { ComponentUtils } from "../../../../cauldron/wl/utils/component_utils";
import { Globals } from "../../../../pp/globals";
import { EasyMeshAmbientFactor } from "../easy_mesh_ambient_factor";

export class EasyMeshAmbientFactorComponent extends Component {
    static TypeName = "pp-easy-mesh-ambient-factor";
    static Properties = {
        _myVariableName: Property.string(""),
        _myUseTuneTarget: Property.bool(false),
        _mySetAsWidgetCurrentVariable: Property.bool(false)
    };

    init() {
        this._myEasyObjectTuner = null;

        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyMeshAmbientFactor(this.object, this._myVariableName, this._mySetAsWidgetCurrentVariable, this._myUseTuneTarget);
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
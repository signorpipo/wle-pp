import { Component, Property } from "@wonderlandengine/api";
import { VisualTransform, VisualTransformParams } from "../../cauldron/visual/elements/visual_transform";
import { isDebugEnabled } from "../debug_globals";

export class DebugTransformComponent extends Component {
    static TypeName = "pp-debug-transform";
    static Properties = {
        _myLength: Property.float(0.1),
        _myThickness: Property.float(0.005)
    };

    start() {
        this._myDebugVisualTransform = null;

        if (isDebugEnabled(this.engine)) {
            this._myDebugTransformParams = new VisualTransformParams(this.engine);
            this._myDebugTransformParams.myLength = this._myLength;
            this._myDebugTransformParams.myThickness = this._myThickness;

            this._myDebugVisualTransform = new VisualTransform(this._myDebugTransformParams);
        }
    }

    update(dt) {
        if (isDebugEnabled(this.engine)) {
            if (this._myDebugVisualTransform != null) {
                this.object.pp_getTransform(this._myDebugTransformParams.myTransform);
                this._myDebugVisualTransform.paramsUpdated();
            }
        }
    }
}
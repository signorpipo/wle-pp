import { Component, Property } from "@wonderlandengine/api";
import { VisualTransform, VisualTransformParams } from "../../cauldron/visual/elements/visual_transform";
import { Globals } from "../../pp/globals";

export class DebugTransformComponent extends Component {
    static TypeName = "pp-debug-transform";
    static Properties = {
        _myLength: Property.float(0.1),
        _myThickness: Property.float(0.005)
    };

    start() {
        this._myDebugVisualTransform = null;

        this._myDebugTransformParams = new VisualTransformParams(this.engine);
        this._myDebugTransformParams.myLength = this._myLength;
        this._myDebugTransformParams.myThickness = this._myThickness;

        this._myDebugVisualTransform = new VisualTransform(this._myDebugTransformParams);
        this._myDebugVisualTransform.setVisible(Globals.isDebugEnabled(this.engine));
    }

    update(dt) {
        if (this._myDebugVisualTransform != null) {
            if (Globals.isDebugEnabled(this.engine)) {
                this.object.pp_getTransform(this._myDebugTransformParams.myTransform);
                this._myDebugVisualTransform.paramsUpdated();
                this._myDebugVisualTransform.setVisible(true);
            } else {
                this._myDebugVisualTransform.setVisible(false);
            }
        }
    }

    onDestroy() {
        this._myDebugVisualTransform.destroy();
    }
}
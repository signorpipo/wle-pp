import { Component, Object3D, property } from "@wonderlandengine/api";
import { ComponentUtils } from "../../../../cauldron/wl/utils/component_utils.js";
import { Globals } from "../../../../pp/globals.js";
import { EasyLightAttenuation } from "../easy_light_attenuation.js";

export class EasyLightAttenuationComponent extends Component {
    public static override  TypeName = "pp-easy-light-attenuation";

    @property.string("")
    private readonly _myVariableName!: string;

    @property.bool(false)
    private readonly _mySetAsWidgetCurrentVariable!: boolean;

    @property.bool(false)
    private readonly _myUseTuneTarget!: boolean;



    private _myEasyObjectTuner: EasyLightAttenuation | null = null;

    public override update(dt: number): void {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.update(dt);
            } else {
                this._myEasyObjectTuner = new EasyLightAttenuation(this.object, this._myVariableName, this._mySetAsWidgetCurrentVariable, this._myUseTuneTarget);
                this._myEasyObjectTuner.start();
            }
        }
    }

    public override onActivate(): void {
        if (this._myEasyObjectTuner != null) {
            this._myEasyObjectTuner.setActive(true);
        }
    }

    public override onDeactivate(): void {
        if (this._myEasyObjectTuner != null) {
            this._myEasyObjectTuner.setActive(false);
        }
    }

    public getEasyObjectTuner(): EasyLightAttenuation | null {
        return this._myEasyObjectTuner;
    }

    public pp_clone(targetObject: Object3D): EasyLightAttenuationComponent | null {
        const clonedComponent = ComponentUtils.cloneDefault(this, targetObject);
        return clonedComponent as any;
    }
}
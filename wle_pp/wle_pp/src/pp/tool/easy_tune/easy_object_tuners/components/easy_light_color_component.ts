import { Component, Object3D } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { ColorModel } from "../../../../cauldron/utils/color_utils.js";
import { ComponentUtils } from "../../../../cauldron/wl/utils/component_utils.js";
import { Globals } from "../../../../pp/globals.js";
import { EasyLightColor } from "../easy_light_color.js";

export class EasyLightColorComponent extends Component {
    public static override  TypeName = "pp-easy-light-color";

    @property.string("")
    private readonly _myVariableName!: string;

    @property.bool(false)
    private readonly _mySetAsWidgetCurrentVariable!: boolean;

    @property.bool(false)
    private readonly _myUseTuneTarget!: boolean;



    @property.enum([ColorModel[ColorModel.RGB], ColorModel[ColorModel.HSV]], ColorModel[ColorModel.HSV])
    private readonly _myColorModel!: number;



    private _myEasyObjectTuner: EasyLightColor | null = null;

    public override init(): void {
        this._myEasyObjectTuner = null;

        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyLightColor(this._myColorModel, this.object, this._myVariableName, this._mySetAsWidgetCurrentVariable, this._myUseTuneTarget, this.engine);
        }
    }

    public override start(): void {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.start();
            }
        }
    }

    public override update(dt: number): void {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.update(dt);
            }
        }
    }

    public getEasyObjectTuner(): EasyLightColor | null {
        return this._myEasyObjectTuner;
    }

    public pp_clone(targetObject: Object3D): EasyLightColorComponent | null {
        const clonedComponent = ComponentUtils.cloneDefault(this, targetObject);
        return clonedComponent as any;
    }
}
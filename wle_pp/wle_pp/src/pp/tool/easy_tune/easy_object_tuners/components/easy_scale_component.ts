import { Component, Object3D } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { ComponentUtils } from "../../../../cauldron/wl/utils/component_utils.js";
import { Globals } from "../../../../pp/globals.js";
import { EasyScale } from "../easy_scale.js";

export class EasyScaleComponent extends Component {
    public static override  TypeName = "pp-easy-scale";

    @property.string("")
    private readonly _myVariableName!: string;

    @property.bool(false)
    private readonly _mySetAsWidgetCurrentVariable!: boolean;

    @property.bool(false)
    private readonly _myUseTuneTarget!: boolean;



    @property.bool(true)
    private readonly _myLocal!: boolean;

    /** Edit all scale values together */
    @property.bool(true)
    private readonly _myScaleAsOne!: boolean;

    @property.float(1)
    private readonly _myStepPerSecond!: number;



    private _myEasyObjectTuner: EasyScale | null = null;

    public override init(): void {
        this._myEasyObjectTuner = null;

        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyObjectTuner = new EasyScale(this._myLocal, this._myScaleAsOne, this._myStepPerSecond, this.object, this._myVariableName, this._mySetAsWidgetCurrentVariable, this._myUseTuneTarget);
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

    public getEasyObjectTuner(): EasyScale | null {
        return this._myEasyObjectTuner;
    }

    public pp_clone(targetObject: Object3D): EasyScaleComponent | null {
        const clonedComponent = ComponentUtils.cloneDefault(this, targetObject);
        return clonedComponent as any;
    }
}
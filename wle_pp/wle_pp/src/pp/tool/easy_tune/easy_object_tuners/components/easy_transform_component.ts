import { Component, Object3D, property } from "@wonderlandengine/api";
import { ComponentUtils } from "../../../../cauldron/wl/utils/component_utils.js";
import { Globals } from "../../../../pp/globals.js";
import { EasyTransform } from "../easy_transform.js";

export class EasyTransformComponent extends Component {
    public static override  TypeName = "pp-easy-transform";

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
    private readonly _myPositionStepPerSecond!: number;

    @property.float(50)
    private readonly _myRotationStepPerSecond!: number;

    @property.float(1)
    private readonly _myScaleStepPerSecond!: number;



    private _myEasyObjectTuner: EasyTransform | null = null;

    public override update(dt: number): void {
        if (Globals.isToolEnabled(this.engine)) {
            if (this._myEasyObjectTuner != null) {
                this._myEasyObjectTuner.update(dt);
            } else {
                this._myEasyObjectTuner = new EasyTransform(this._myLocal, this._myScaleAsOne, this._myPositionStepPerSecond, this._myRotationStepPerSecond, this._myScaleStepPerSecond, this.object, this._myVariableName, this._mySetAsWidgetCurrentVariable, this._myUseTuneTarget, this.engine);
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

    public getEasyObjectTuner(): EasyTransform | null {
        return this._myEasyObjectTuner;
    }

    public pp_clone(targetObject: Object3D): EasyTransformComponent | null {
        const clonedComponent = ComponentUtils.cloneDefault(this, targetObject);
        return clonedComponent as any;
    }
}
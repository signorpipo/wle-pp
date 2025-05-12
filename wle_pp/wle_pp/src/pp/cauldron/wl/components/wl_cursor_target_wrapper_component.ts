import { Component, property } from "@wonderlandengine/api";
import { CursorTarget } from "@wonderlandengine/components";

export class WLCursorTargetWrapperComponent extends Component {
    public static override TypeName = "pp-wl-cursor-target-wrapper";

    @property.bool(false)
    private readonly _myIsSurface!: boolean;

    private cursorTargetComponent: CursorTarget | null = null;

    public override init(): void {
        if (this.markedActive) {
            this.cursorTargetComponent = this.object.pp_addComponent(CursorTarget)!;
            this.cursorTargetComponent.isSurface = this._myIsSurface;
        }
    }
}
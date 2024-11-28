import { Component, Object3D, property } from "@wonderlandengine/api";
import { XRUtils } from "../../utils/xr_utils.js";

export class ResetLocalTransformComponent extends Component {
    public static override TypeName = "pp-reset-local-transform";

    @property.enum(["Self", "Children", "Descendants", "Hierarchy"], "Self")
    private _myResetLocalTransformOn!: number;

    @property.enum(["Init", "Start", "First Update", "Enter XR", "Exit XR", "First Enter XR", "First Exit XR"], "Init")
    private _myResetLocalTransformWhen!: number;

    private _myFirstUpdate: boolean = true;
    private _myFirstXRStart: boolean = true;
    private _myFirstXREnd: boolean = true;

    public override init(): void {
        if (this.markedActive && this._myResetLocalTransformWhen == 0) {
            this._resetLocalTransform();
        }
    }

    public override start(): void {
        if (this._myResetLocalTransformWhen == 1) {
            this._resetLocalTransform();
        }
    }

    public override update(dt: number): void {
        if (this._myResetLocalTransformWhen == 2 && this._myFirstUpdate) {
            this._resetLocalTransform();
        }

        this._myFirstUpdate = false;
    }

    private _onXRSessionStart(): void {
        if (this._myResetLocalTransformWhen == 3 || (this._myResetLocalTransformWhen == 5 && this._myFirstXRStart)) {
            this._resetLocalTransform();
        }

        this._myFirstXRStart = false;
    }

    private _onXRSessionEnd(): void {
        if (this._myResetLocalTransformWhen == 4 || (this._myResetLocalTransformWhen == 6 && this._myFirstXREnd)) {
            this._resetLocalTransform();
        }

        this._myFirstXREnd = false;
    }

    private _resetLocalTransform(): void {
        let objects: Object3D[] = [];
        if (this._myResetLocalTransformOn == 0) {
            objects = [this.object.pp_getSelf()];
        } else if (this._myResetLocalTransformOn == 1) {
            objects = this.object.pp_getChildren();
        } else if (this._myResetLocalTransformOn == 2) {
            objects = this.object.pp_getDescendants();
        } else {
            objects = this.object.pp_getHierarchy();
        }

        for (const object of objects) {
            object.pp_resetTransformLocal();
        }
    }

    public override onActivate(): void {
        if (this._myResetLocalTransformWhen == 3 || this._myResetLocalTransformWhen == 5) {
            XRUtils.registerSessionStartEventListener(this, this._onXRSessionStart.bind(this), true, true, this.engine);
        }

        if (this._myResetLocalTransformWhen == 4 || this._myResetLocalTransformWhen == 6) {
            XRUtils.registerSessionEndEventListener(this, this._onXRSessionEnd.bind(this), this.engine);
        }
    }

    public override onDeactivate(): void {
        XRUtils.unregisterSessionStartEndEventListeners(this, this.engine);
    }
}
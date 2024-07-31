import { Component } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";

export class ClearConsoleComponent extends Component {
    public static override TypeName = "pp-clear-console";

    @property.enum(["Init", "Start", "Update", "Enter XR", "Exit XR"], "Init")
    private _myWhen!: number;

    @property.bool(true)
    private _myFirstTimeOnly!: boolean;

    private _myFirstTimeDone: boolean = false;

    public override init(): void {
        if (this._myWhen == 0) {
            this._clearConsole();
        }
    }

    public override start(): void {
        if (this._myWhen == 1) {
            this._clearConsole();
        }
    }

    public override update(dt: number): void {
        if (this._myWhen == 2) {
            this._clearConsole();
        }
    }

    private _onXRSessionStart(): void {
        if (this._myWhen == 3) {
            this._clearConsole();
        }
    }

    private _onXRSessionEnd(): void {
        if (this._myWhen == 4) {
            this._clearConsole();
        }
    }

    private _clearConsole(): void {
        if (!this._myFirstTimeOnly || !this._myFirstTimeDone) {
            console.clear();

            this._myFirstTimeDone = true;
        }

        if (this._myFirstTimeOnly && this._myFirstTimeDone) {
            this.active = false;
        }
    }

    public override onActivate(): void {
        if (this._myWhen == 3) {
            XRUtils.registerSessionStartEventListener(this, this._onXRSessionStart.bind(this), true, true, this.engine);
        }

        if (this._myWhen == 4) {
            XRUtils.registerSessionEndEventListener(this, this._onXRSessionEnd.bind(this), this.engine);
        }
    }

    public override onDeactivate(): void {
        XRUtils.unregisterSessionStartEndEventListeners(this, this.engine);
    }
}
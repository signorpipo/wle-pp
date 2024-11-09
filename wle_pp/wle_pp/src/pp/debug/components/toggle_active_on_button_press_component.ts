import { Component, property } from "@wonderlandengine/api";
import { Handedness } from "../../input/cauldron/input_types.js";
import { InputUtils } from "../../input/cauldron/input_utils.js";
import { GamepadButtonID } from "../../input/gamepad/gamepad_buttons.js";
import { Globals } from "../../pp/globals.js";

export class ToggleActiveOnButtonPressComponent extends Component {
    public static override  TypeName = "toggle-active-on-button-press";

    @property.enum(["Left", "Right"], "Left")
    private _myHandedness!: number;

    @property.enum(["Select", "Squeeze", "Thumstick", "Top Button", "Bottom Button"], "Bottom Button")
    private _myButton!: number;

    @property.int(2)
    private _myMultiplePressCount!: number;

    private _myHandednessType!: Handedness;
    private _myButtonID!: GamepadButtonID;

    private _myActive: boolean = false;

    public override  start(): void {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness)!;
        switch (this._myButton) {
            case 0:
                this._myButtonID = GamepadButtonID.SELECT;
                break;
            case 1:
                this._myButtonID = GamepadButtonID.SQUEEZE;
                break;
            case 2:
                this._myButtonID = GamepadButtonID.THUMBSTICK;
                break;
            case 3:
                this._myButtonID = GamepadButtonID.TOP_BUTTON;
                break;
            case 4:
                this._myButtonID = GamepadButtonID.BOTTOM_BUTTON;
                break;
        }

        const components = this.object.pp_getComponents();
        for (const component of components) {
            if (component.active) {
                this._myActive = true;
                break;
            }
        }
    }

    public override update(dt: number): void {
        if (Globals.isDebugEnabled() && Globals.getGamepad(this._myHandednessType)!.getButtonInfo(this._myButtonID).isPressEnd(this._myMultiplePressCount > 0 ? this._myMultiplePressCount : null)) {
            this.object.pp_setActive(!this._myActive);
            this.active = true;

            this._myActive = !this._myActive;
        }
    }
}

import { Component, Property } from "@wonderlandengine/api";
import { InputSourceType } from "../input_types";
import { InputUtils } from "../input_utils";

export class SwitchHandObjectComponent extends Component {
    static TypeName = "pp-switch-hand-object";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myGamepad: Property.object(),
        _myTrackedHand: Property.object()
    };

    start() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);
        this._myFirstUpdate = true;

        this._myCurrentInputSourceType = null;
    }

    onActivate() {
        this._myFirstUpdate = true;
    }

    update(dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            this._start();
        }

        let inputSourceType = InputUtils.getInputSourceTypeByHandedness(this._myHandednessType, this.engine);
        if (inputSourceType != null && this._myCurrentInputSourceType != inputSourceType) {
            this._myCurrentInputSourceType = inputSourceType;

            if (inputSourceType == InputSourceType.TRACKED_HAND) {
                if (this._myGamepad != null) {
                    this._myGamepad.pp_setActive(false);
                }
                if (this._myTrackedHand != null) {
                    this._myTrackedHand.pp_setActive(true);
                }
            } else if (inputSourceType == InputSourceType.GAMEPAD) {
                if (this._myTrackedHand != null) {
                    this._myTrackedHand.pp_setActive(false);
                }
                if (this._myGamepad != null) {
                    this._myGamepad.pp_setActive(true);
                }
            }
        }
    }

    _start() {
        if (this._myGamepad != null) {
            this._myGamepad.pp_setActive(false);
        }

        if (this._myTrackedHand != null) {
            this._myTrackedHand.pp_setActive(false);
        }

        this._myCurrentInputSourceType = null;
    }
}
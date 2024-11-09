import { Component, Property } from "@wonderlandengine/api";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { Globals } from "../../../pp/globals.js";
import { InputSourceType } from "../input_types.js";
import { InputUtils } from "../input_utils.js";

export class SwitchHandObjectComponent extends Component {
    static TypeName = "pp-switch-hand-object";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left"),
        _myGamepad: Property.object(),
        _myTrackedHand: Property.object(),
        _myDisableHandsWhenNonXR: Property.bool(true)
    };

    start() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);
        this._myFirstUpdate = true;

        this._myCurrentInputSourceType = null;

        this._myActivateOnNextUpdate = false;
    }

    update(dt) {
        if (this._myActivateOnNextUpdate) {
            this._onActivate();

            this._myActivateOnNextUpdate = false;
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

    _onPoseUpdated(dt, pose) {
        if (!this.active || this._myActivateOnNextUpdate) {
            Globals.getHandPose(this._myHandednessType, this.engine)?.unregisterPoseUpdatedEventListener(this);
            return;
        }

        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            this._start();
        }

        if (this._myDisableHandsWhenNonXR && !XRUtils.isSessionActive(this.engine)) {
            if (this._myCurrentInputSourceType != null) {
                this._myCurrentInputSourceType = null;

                this._myGamepad.pp_setActive(false);
                this._myTrackedHand.pp_setActive(false);
            }
        } else {
            let inputSourceType = pose.getInputSourceType();
            if (this._myCurrentInputSourceType != inputSourceType) {
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
                } else if (inputSourceType == null) {
                    this._myGamepad.pp_setActive(false);
                    this._myTrackedHand.pp_setActive(false);
                }
            }
        }
    }

    onActivate() {
        this._myActivateOnNextUpdate = true;
    }

    _onActivate() {
        Globals.getHandPose(this._myHandednessType, this.engine).registerPoseUpdatedEventListener(this, this._onPoseUpdated.bind(this));

        this._myFirstUpdate = true;
    }

    onDeactivate() {
        Globals.getHandPose(this._myHandednessType, this.engine)?.unregisterPoseUpdatedEventListener(this);
    }
}
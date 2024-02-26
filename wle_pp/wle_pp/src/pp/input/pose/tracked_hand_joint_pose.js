import { XRUtils } from "../../cauldron/utils/xr_utils";
import { InputSourceType } from "../cauldron/input_types";
import { InputUtils } from "../cauldron/input_utils";
import { BasePose, BasePoseParams } from "./base_pose";

export class TrackedHandJointPose extends BasePose {

    constructor(handedness, trackedHandJointID, basePoseParams = new BasePoseParams()) {
        super(basePoseParams);

        this._myInputSource = null;

        this._myHandedness = handedness;
        this._myTrackedHandJointID = trackedHandJointID;

        this._myJointRadius = 0;

        this._myInputSourcesChangeEventListener = null;
    }

    getHandedness() {
        return this._myHandedness;
    }

    getTrackedHandJointID() {
        return this._myTrackedHandJointID;
    }

    setTrackedHandJointID(trackedHandJointID) {
        this._myTrackedHandJointID = trackedHandJointID;
    }

    getJointRadius() {
        return this._myJointRadius;
    }

    _isReadyToGetPose() {
        return this._myInputSource != null;
    }

    _getPose(xrFrame) {
        return xrFrame.getJointPose(this._myInputSource.hand.get(this._myTrackedHandJointID), this.getReferenceSpace());
    }

    _updateHook(dt, updateVelocity, xrPose) {
        if (xrPose != null) {
            this._myJointRadius = xrPose.radius;
        }
    }

    _onXRSessionStartHook(manualCall, session) {
        this._myInputSourcesChangeEventListener = function () {
            this._myInputSource = null;

            if (session.inputSources != null && session.inputSources.length > 0) {
                for (let item of session.inputSources) {
                    if (item.handedness == this._myHandedness) {
                        if (InputUtils.getInputSourceType(item) == InputSourceType.TRACKED_HAND) {
                            this._myInputSource = item;
                        }
                    }
                }
            }
        }.bind(this);

        this._myInputSourcesChangeEventListener();

        session.addEventListener("inputsourceschange", this._myInputSourcesChangeEventListener);
    }

    _onXRSessionEndHook() {
        this._myInputSource = null;

        this._myInputSourcesChangeEventListener = null;
    }

    _destroyHook() {
        XRUtils.getSession(this.getEngine())?.removeEventListener("inputsourceschange", this._myInputSourcesChangeEventListener);
    }
}
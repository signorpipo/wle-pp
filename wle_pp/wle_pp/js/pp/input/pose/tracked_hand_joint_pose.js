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
        return xrFrame.getJointPose(this._myInputSource.hand.get(this._myTrackedHandJointID), this._myReferenceSpace);
    }

    _updateHook(dt, updateVelocity, xrPose) {
        if (xrPose != null) {
            this._myJointRadius = xrPose.radius;
        }
    }

    _onXRSessionStartHook(manualCall, session) {
        session.addEventListener("inputsourceschange", function (event) {
            if (event.removed) {
                for (let item of event.removed) {
                    if (item == this._myInputSource) {
                        this._myInputSource = null;
                    }
                }
            }

            if (event.added) {
                for (let item of event.added) {
                    if (item.handedness == this._myHandedness) {
                        if (InputUtils.getInputSourceType(item) == InputSourceType.TRACKED_HAND) {
                            this._myInputSource = item;
                        }
                    }
                }
            }
        }.bind(this));

        if (manualCall && this._myInputSource == null && session.inputSources) {
            for (let item of session.inputSources) {
                if (item.handedness == this._myHandedness) {
                    if (InputUtils.getInputSourceType(item) == InputSourceType.TRACKED_HAND) {
                        this._myInputSource = item;
                    }
                }
            }
        }
    }

    _onXRSessionEndHook() {
        this._myInputSource = null;
    }
}
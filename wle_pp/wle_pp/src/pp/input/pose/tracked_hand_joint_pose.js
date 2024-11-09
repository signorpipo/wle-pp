import { XRUtils } from "../../cauldron/utils/xr_utils.js";
import { InputSourceType } from "../cauldron/input_types.js";
import { InputUtils } from "../cauldron/input_utils.js";
import { BasePose, BasePoseParams } from "./base_pose.js";

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

    _postUpdate(dt, updateVelocity, manualUpdate, xrPose) {
        if (xrPose != null) {
            this._myJointRadius = xrPose.radius;
        }
    }

    _setActiveHook(active) {
        if (this.isActive() != active) {
            if (!active) {
                this._myInputSource = null;
                this._myJointRadius = 0;

                XRUtils.getSession(this.getEngine())?.removeEventListener("inputsourceschange", this._myInputSourcesChangeEventListener);
            }
        }
    }

    _onXRSessionStartHook(manualCall, session) {
        this._myInputSourcesChangeEventListener = () => {
            this._myInputSource = null;

            if (session.inputSources != null && session.inputSources.length > 0) {

                for (let i = 0; i < session.inputSources.length; i++) {
                    let inputSource = session.inputSources[i];
                    if (inputSource.handedness == this._myHandedness) {
                        if (InputUtils.getInputSourceType(inputSource) == InputSourceType.TRACKED_HAND) {
                            this._myInputSource = inputSource;
                        }
                    }
                }
            }
        };

        this._myInputSourcesChangeEventListener();

        session.addEventListener("inputsourceschange", this._myInputSourcesChangeEventListener);
    }

    _onXRSessionEndHook() {
        this._myInputSource = null;

        this._myInputSourcesChangeEventListener = null;
    }
}
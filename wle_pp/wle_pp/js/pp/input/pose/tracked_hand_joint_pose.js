PP.TrackedHandJointPose = class TrackedHandJointPose extends PP.BasePose {

    constructor(handedness, trackedHandJointID, basePoseParams = new PP.BasePoseParams()) {
        super(basePoseParams);

        this._myInputSource = null;

        this._myHandedness = handedness;
        this._myTrackedHandJointID = trackedHandJointID;

        this._myJointRadius = 0;
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

    _onXRSessionStartHook(manualStart, session) {
        session.addEventListener('inputsourceschange', function (event) {
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
                        if (PP.InputUtils.getInputSourceType(item) == PP.InputSourceType.TRACKED_HAND) {
                            this._myInputSource = item;
                        }
                    }
                }
            }
        }.bind(this));

        if (manualStart && this._myInputSource == null && session.inputSources) {
            for (let item of session.inputSources) {
                if (item.handedness == this._myHandedness) {
                    if (PP.InputUtils.getInputSourceType(item) == PP.InputSourceType.TRACKED_HAND) {
                        this._myInputSource = item;
                    }
                }
            }
        }
    }

    _onXRSessionEndHook() {
        this._myInputSource = null;
    }
};
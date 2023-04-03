import { getMainEngine } from "../../cauldron/wl/engine_globals";
import { TrackedHandJointID } from "../cauldron/input_types";
import { InputUtils } from "../cauldron/input_utils";
import { BasePoseParams } from "./base_pose";
import { TrackedHandJointPose } from "./tracked_hand_joint_pose";

export class TrackedHandPoseParams extends BasePoseParams {

    constructor(addAllJointIDs = true, engine = getMainEngine()) {
        super(engine);

        this.myTrackedHandJointIDList = [];

        if (addAllJointIDs) {
            for (let key in TrackedHandJointID) {
                this.myTrackedHandJointIDList.push([TrackedHandJointID[key]]);
            }
        }
    }
}

export class TrackedHandPose {

    constructor(handedness, trackedHandPoseParams = new TrackedHandPoseParams()) {
        this._myHandedness = handedness;

        this._myFixForward = trackedHandPoseParams.myFixForward;
        this._myForceEmulatedVelocities = trackedHandPoseParams.myForceEmulatedVelocities;
        this._myReferenceObject = trackedHandPoseParams.myReferenceObject;

        this._myEngine = trackedHandPoseParams.myEngine;

        this._myTrackedHandJointPoseParams = new BasePoseParams(this._myEngine);
        this._myTrackedHandJointPoseParams.myFixForward = this._myFixForward;
        this._myTrackedHandJointPoseParams.myForceEmulatedVelocities = this._myForceEmulatedVelocities;
        this._myTrackedHandJointPoseParams.myReferenceObject = this._myReferenceObject;

        this._myTrackedHandJointPoseList = [];
        for (let jointID of trackedHandPoseParams.myTrackedHandJointIDList) {
            let trackedHandJointPose = new TrackedHandJointPose(this._myHandedness, jointID, this._myTrackedHandJointPoseParams);
            this._myTrackedHandJointPoseList[jointID] = trackedHandJointPose;
        }
    }

    start() {
        for (let jointPoseKey in this._myTrackedHandJointPoseList) {
            let jointPose = this._myTrackedHandJointPoseList[jointPoseKey];
            jointPose.start();
        }
    }

    update(dt) {
        for (let jointPoseKey in this._myTrackedHandJointPoseList) {
            let jointPose = this._myTrackedHandJointPoseList[jointPoseKey];
            jointPose.update(dt);
        }
    }

    getEngine() {
        this._myEngine;
    }

    getHandedness() {
        return this._myHandedness;
    }

    getJointPoseList() {
        return this._myTrackedHandJointPoseList;
    }

    getJointPose(jointID) {
        return this._myTrackedHandJointPoseList[jointID];
    }

    getJointPoseByIndex(jointIDIndex) {
        return this._myTrackedHandJointPoseList[InputUtils.getJointIDByIndex(jointIDIndex)];
    }

    addTrackedHandJointID(jointID) {
        if (!this._myTrackedHandJointPoseList.pp_has(element => element.getTrackedHandJointID() == jointID)) {
            let trackedHandJointPose = new TrackedHandJointPose(this._myHandedness, jointID, this._myTrackedHandJointPoseParams);
            this._myTrackedHandJointPoseList.push(trackedHandJointPose);
        }
    }

    removeTrackedHandJointID(jointID) {
        this._myTrackedHandJointPoseList.pp_remove(element => element.getTrackedHandJointID() == jointID);
    }

    setReferenceObject(referenceObject) {
        this._myReferenceObject = referenceObject;
        this._myTrackedHandJointPoseParams.myReferenceObject = this._myReferenceObject;
        for (let jointPoseKey in this._myTrackedHandJointPoseList) {
            let jointPose = this._myTrackedHandJointPoseList[jointPoseKey];
            jointPose.setReferenceObject(referenceObject);
        }
    }

    getReferenceObject() {
        return this._myReferenceObject;
    }

    setFixForward(fixForward) {
        this._myFixForward = fixForward;
        this._myTrackedHandJointPoseParams.myFixForward = this._myFixForward;
        for (let jointPoseKey in this._myTrackedHandJointPoseList) {
            let jointPose = this._myTrackedHandJointPoseList[jointPoseKey];
            jointPose.setFixForward(fixForward);
        }
    }

    isFixForward() {
        return this._myFixForward;
    }

    setForceEmulatedVelocities(forceEmulatedVelocities) {
        this._myForceEmulatedVelocities = forceEmulatedVelocities;
        this._myTrackedHandJointPoseParams.myForceEmulatedVelocities = this._myForceEmulatedVelocities;
        for (let jointPoseKey in this._myTrackedHandJointPoseList) {
            let jointPose = this._myTrackedHandJointPoseList[jointPoseKey];
            jointPose.setForceEmulatedVelocities(forceEmulatedVelocities);
        }
    }

    isForceEmulatedVelocities() {
        return this._myForceEmulatedVelocities;
    }
}
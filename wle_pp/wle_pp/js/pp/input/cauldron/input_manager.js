import { Globals } from "../../pp/globals";
import { GamepadsManager } from "../gamepad/cauldron/gamepads_manager";
import { BasePoseParams } from "../pose/base_pose";
import { HandPose, HandPoseParams } from "../pose/hand_pose";
import { HeadPose } from "../pose/head_pose";
import { TrackedHandPose, TrackedHandPoseParams } from "../pose/tracked_hand_pose";
import { Handedness } from "./input_types";
import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";

export class InputManager {

    constructor(engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._myMouse = new Mouse(this._myEngine);
        this._myKeyboard = new Keyboard(this._myEngine);

        this._myHeadPose = new HeadPose(new BasePoseParams(this._myEngine));
        this._myHeadPose.setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
        this._myHeadPose.setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));

        this._myHandPoses = [];
        this._myHandPoses[Handedness.LEFT] = new HandPose(Handedness.LEFT, new HandPoseParams(this._myEngine));
        this._myHandPoses[Handedness.RIGHT] = new HandPose(Handedness.RIGHT, new HandPoseParams(this._myEngine));
        this._myHandPoses[Handedness.LEFT].setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
        this._myHandPoses[Handedness.RIGHT].setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
        this._myHandPoses[Handedness.LEFT].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
        this._myHandPoses[Handedness.RIGHT].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));

        this._myTrackedHandPoses = [];
        this._myTrackedHandPoses[Handedness.LEFT] = new TrackedHandPose(Handedness.LEFT, new TrackedHandPoseParams(true, this._myEngine));
        this._myTrackedHandPoses[Handedness.RIGHT] = new TrackedHandPose(Handedness.RIGHT, new TrackedHandPoseParams(true, this._myEngine));
        this._myTrackedHandPoses[Handedness.LEFT].setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
        this._myTrackedHandPoses[Handedness.RIGHT].setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
        this._myTrackedHandPoses[Handedness.LEFT].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
        this._myTrackedHandPoses[Handedness.RIGHT].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));

        this._myGamepadsManager = new GamepadsManager(this._myEngine);

        this._myDestroyed = false;
    }

    start() {
        this._myMouse.start();
        this._myKeyboard.start();

        this._myHeadPose.setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
        this._myHeadPose.setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
        this._myHeadPose.start();

        for (let key in this._myHandPoses) {
            this._myHandPoses[key].setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
            this._myHandPoses[key].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
            this._myHandPoses[key].start();
        }

        for (let key in this._myTrackedHandPoses) {
            this._myTrackedHandPoses[key].setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
            this._myTrackedHandPoses[key].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
            this._myTrackedHandPoses[key].start();
        }

        this._myGamepadsManager.start();
    }

    update(dt) {
        this._myMouse.update(dt);
        this._myKeyboard.update(dt);

        this._myHeadPose.setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
        this._myHeadPose.setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
        this._myHeadPose.update(dt);

        for (let key in this._myHandPoses) {
            this._myHandPoses[key].setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
            this._myHandPoses[key].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
            this._myHandPoses[key].update(dt);
        }

        for (let key in this._myTrackedHandPoses) {
            this._myTrackedHandPoses[key].setReferenceObject(Globals.getPlayerObjects(this._myEngine).myReferenceSpace);
            this._myTrackedHandPoses[key].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
            this._myTrackedHandPoses[key].update(dt);
        }

        this._myGamepadsManager.update(dt);
    }

    getMouse() {
        return this._myMouse;
    }

    getKeyboard() {
        return this._myKeyboard;
    }

    getGamepadsManager() {
        return this._myGamepadsManager;
    }

    getHeadPose() {
        return this._myHeadPose;
    }

    getLeftHandPose() {
        return this._myHandPoses[Handedness.LEFT];
    }

    getRightHandPose() {
        return this._myHandPoses[Handedness.RIGHT];
    }

    getHandPose(handedness) {
        return this._myHandPoses[handedness];
    }

    getHandPoses() {
        return this._myHandPoses;
    }

    getLeftTrackedHandPose() {
        return this._myTrackedHandPoses[Handedness.LEFT];
    }

    getRightTrackedHandPose() {
        return this._myTrackedHandPoses[Handedness.RIGHT];
    }

    getTrackedHandPose(handedness) {
        return this._myTrackedHandPoses[handedness];
    }

    getTrackedHandPoses() {
        return this._myTrackedHandPoses;
    }

    destroy() {
        this._myDestroyed = true;

        this._myMouse.destroy();
        this._myKeyboard.destroy();

        this._myHeadPose.destroy();

        for (let key in this._myHandPoses) {
            this._myHandPoses[key].destroy();
        }

        for (let key in this._myTrackedHandPoses) {
            this._myTrackedHandPoses[key].destroy();
        }

        this._myGamepadsManager.destroy();
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}
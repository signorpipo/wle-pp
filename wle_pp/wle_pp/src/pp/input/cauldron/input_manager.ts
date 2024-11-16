import { Emitter, WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { GamepadsManager } from "../gamepad/cauldron/gamepads_manager.js";
import { BasePoseParams } from "../pose/base_pose.js";
import { HandPose, HandPoseParams } from "../pose/hand_pose.js";
import { HandRayPose, HandRayPoseParams } from "../pose/hand_ray_pose.js";
import { HeadPose } from "../pose/head_pose.js";
import { TrackedHandPose, TrackedHandPoseParams } from "../pose/tracked_hand_pose.js";
import { Handedness } from "./input_types.js";
import { Keyboard } from "./keyboard.js";
import { Mouse } from "./mouse.js";

export class InputManager {

    private readonly _myMouse: Mouse;
    private readonly _myKeyboard: Keyboard;

    private readonly _myHeadPose: HeadPose;

    private readonly _myHandPoses: Record<Handedness, HandPose>;
    private readonly _myHandRayPoses: Record<Handedness, HandRayPose>;

    private readonly _myTrackedHandPoses: Record<Handedness, TrackedHandPose>;

    private readonly _myGamepadsManager: GamepadsManager = new GamepadsManager();

    private _myStarted: boolean = false;
    private _myActive: boolean = false;

    private _myTrackedHandPosesEnabled: boolean = true;
    private _myTrackedHandPosesStarted: boolean = false;

    private readonly _myPreUpdateEmitter: Emitter<[number, InputManager]> = new Emitter();
    private readonly _myPostUpdateEmitter: Emitter<[number, InputManager]> = new Emitter();

    private readonly _myEngine: Readonly<WonderlandEngine>;

    private _myDestroyed: boolean = false;

    constructor(engine: Readonly<WonderlandEngine> = Globals.getMainEngine()!) {
        this._myEngine = engine;

        this._myMouse = new Mouse(this._myEngine as any);
        this._myKeyboard = new Keyboard(this._myEngine as any);

        this._myHeadPose = new HeadPose(new BasePoseParams(this._myEngine as any));
        this._myHeadPose.setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
        this._myHeadPose.setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));

        this._myHandPoses = {
            [Handedness.LEFT]: new HandPose(Handedness.LEFT, new HandPoseParams(this._myEngine)),
            [Handedness.RIGHT]: new HandPose(Handedness.RIGHT, new HandPoseParams(this._myEngine))
        };
        this._myHandPoses[Handedness.LEFT].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
        this._myHandPoses[Handedness.RIGHT].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
        this._myHandPoses[Handedness.LEFT].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
        this._myHandPoses[Handedness.RIGHT].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));

        this._myHandRayPoses = {
            [Handedness.LEFT]: new HandRayPose(Handedness.LEFT, new HandRayPoseParams(this._myEngine)),
            [Handedness.RIGHT]: new HandRayPose(Handedness.RIGHT, new HandRayPoseParams(this._myEngine))
        };
        this._myHandRayPoses[Handedness.LEFT].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
        this._myHandRayPoses[Handedness.RIGHT].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
        this._myHandRayPoses[Handedness.LEFT].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
        this._myHandRayPoses[Handedness.RIGHT].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));

        this._myTrackedHandPoses = {
            [Handedness.LEFT]: new TrackedHandPose(Handedness.LEFT, new TrackedHandPoseParams(true, this._myEngine as any)),
            [Handedness.RIGHT]: new TrackedHandPose(Handedness.RIGHT, new TrackedHandPoseParams(true, this._myEngine as any))
        };
        this._myTrackedHandPoses[Handedness.LEFT].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
        this._myTrackedHandPoses[Handedness.RIGHT].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
        this._myTrackedHandPoses[Handedness.LEFT].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
        this._myTrackedHandPoses[Handedness.RIGHT].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
    }

    public setActive(active: boolean): void {
        this._myActive = active;

        this._myMouse.setActive(active);
        this._myKeyboard.setActive(active);

        this._myHeadPose.setActive(active);

        for (const rawHandedness in this._myHandPoses) {
            const handedness = rawHandedness as Handedness;
            this._myHandPoses[handedness].setActive(active);
        }

        for (const rawHandedness in this._myHandRayPoses) {
            const handedness = rawHandedness as Handedness;
            this._myHandRayPoses[handedness].setActive(active);
        }

        for (const rawHandedness in this._myTrackedHandPoses) {
            const handedness = rawHandedness as Handedness;
            this._myTrackedHandPoses[handedness].setActive(active);
        }

        this._myGamepadsManager.setActive(active);
    }

    public isActive(): boolean {
        return this._myActive;
    }

    public start(): void {
        this._myMouse.start();
        this._myKeyboard.start();

        this._myHeadPose.setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
        this._myHeadPose.setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
        this._myHeadPose.start();

        for (const rawHandedness in this._myHandPoses) {
            const handedness = rawHandedness as Handedness;
            this._myHandPoses[handedness].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
            this._myHandPoses[handedness].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
            this._myHandPoses[handedness].start();
        }

        for (const rawHandedness in this._myHandRayPoses) {
            const handedness = rawHandedness as Handedness;
            this._myHandRayPoses[handedness].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
            this._myHandRayPoses[handedness].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
            this._myHandRayPoses[handedness].start();
        }

        if (this._myTrackedHandPosesEnabled) {
            this._startTrackedHandPoses();
        }

        this._myGamepadsManager.start();

        this._myStarted = true;

        const currentActive = this._myActive;
        this._myActive = !this._myActive;
        this.setActive(currentActive);
    }

    public update(dt: number): void {
        if (!this._myActive) return;

        this._myPreUpdateEmitter.notify(dt, this);

        this._myMouse.update(dt);
        this._myKeyboard.update(dt);

        this._myHeadPose.setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
        this._myHeadPose.setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
        this._myHeadPose.update(dt);

        for (const rawHandedness in this._myHandPoses) {
            const handedness = rawHandedness as Handedness;
            this._myHandPoses[handedness].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
            this._myHandPoses[handedness].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
            this._myHandPoses[handedness].update(dt);
        }


        for (const rawHandedness in this._myHandRayPoses) {
            const handedness = rawHandedness as Handedness;
            this._myHandRayPoses[handedness].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
            this._myHandRayPoses[handedness].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
            this._myHandRayPoses[handedness].update(dt);
        }

        this._updateTrackedHandPoses(dt);

        this._myGamepadsManager.update(dt);

        this._myPostUpdateEmitter.notify(dt, this);
    }

    public getMouse(): Mouse {
        return this._myMouse;
    }

    public getKeyboard(): Keyboard {
        return this._myKeyboard;
    }

    public getGamepadsManager(): GamepadsManager {
        return this._myGamepadsManager;
    }

    public getHeadPose(): HeadPose {
        return this._myHeadPose;
    }

    public getLeftHandPose(): HandPose {
        return this._myHandPoses[Handedness.LEFT];
    }

    public getRightHandPose(): HandPose {
        return this._myHandPoses[Handedness.RIGHT];
    }

    public getHandPose(handedness: Handedness): HandPose {
        return this._myHandPoses[handedness];
    }

    public getHandPoses(): Record<Handedness, HandPose> {
        return this._myHandPoses;
    }

    public getLeftHandRayPose(): HandPose {
        return this._myHandRayPoses[Handedness.LEFT];
    }

    public getRightHandRayPose(): HandPose {
        return this._myHandRayPoses[Handedness.RIGHT];
    }

    public getHandRayPose(handedness: Handedness): HandPose {
        return this._myHandRayPoses[handedness];
    }

    public getHandRayPoses(): Record<Handedness, HandPose> {
        return this._myHandRayPoses;
    }

    public getLeftTrackedHandPose(): TrackedHandPose {
        return this._myTrackedHandPoses[Handedness.LEFT];
    }

    public getRightTrackedHandPose(): TrackedHandPose {
        return this._myTrackedHandPoses[Handedness.RIGHT];
    }

    public getTrackedHandPose(handedness: Handedness): TrackedHandPose {
        return this._myTrackedHandPoses[handedness];
    }

    public getTrackedHandPoses(): Record<Handedness, TrackedHandPose> {
        return this._myTrackedHandPoses;
    }

    public areTrackedHandPosesEnabled(): boolean {
        return this._myTrackedHandPosesEnabled;
    }

    public setTrackedHandPosesEnabled(enabled: boolean): void {
        this._myTrackedHandPosesEnabled = enabled;

        if (this._myStarted && this._myTrackedHandPosesEnabled) {
            this._startTrackedHandPoses();
        }
    }

    public registerPreUpdateCallback(id: unknown, callback: (dt: number, inputManager: InputManager) => void): void {
        this._myPreUpdateEmitter.add(callback, { id: id });
    }

    public unregisterPreUpdateCallback(id: unknown): void {
        this._myPreUpdateEmitter.remove(id);
    }

    public registerPostUpdateCallback(id: unknown, callback: (dt: number, inputManager: InputManager) => void): void {
        this._myPostUpdateEmitter.add(callback, { id: id });
    }

    public unregisterPostUpdateCallback(id: unknown): void {
        this._myPostUpdateEmitter.remove(id);
    }

    private _startTrackedHandPoses(): void {
        if (!this._myTrackedHandPosesStarted) {
            for (const rawHandedness in this._myTrackedHandPoses) {
                const handedness = rawHandedness as Handedness;
                this._myTrackedHandPoses[handedness].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
                this._myTrackedHandPoses[handedness].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
                this._myTrackedHandPoses[handedness].start();

                if (this._myStarted) {
                    this._myTrackedHandPoses[handedness].setActive(this._myActive);
                }
            }

            this._myTrackedHandPosesStarted = true;
        }
    }

    private _updateTrackedHandPoses(dt: number): void {
        if (this._myTrackedHandPosesEnabled && this._myTrackedHandPosesStarted) {
            for (const rawHandedness in this._myTrackedHandPoses) {
                const handedness = rawHandedness as Handedness;
                this._myTrackedHandPoses[handedness].setReferenceObject(Globals.getPlayerObjects(this._myEngine)!.myReferenceSpace);
                this._myTrackedHandPoses[handedness].setForwardFixed(Globals.isPoseForwardFixed(this._myEngine));
                this._myTrackedHandPoses[handedness].update(dt);
            }
        }
    }

    public destroy(): void {
        this._myDestroyed = true;

        this.setActive(false);

        this._myMouse.destroy();
        this._myKeyboard.destroy();

        this._myHeadPose.destroy();

        for (const rawHandedness in this._myHandPoses) {
            const handedness = rawHandedness as Handedness;
            this._myHandPoses[handedness].destroy();
        }

        for (const rawHandedness in this._myHandRayPoses) {
            const handedness = rawHandedness as Handedness;
            this._myHandRayPoses[handedness].destroy();
        }

        for (const rawHandedness in this._myTrackedHandPoses) {
            const handedness = rawHandedness as Handedness;
            this._myTrackedHandPoses[handedness].destroy();
        }

        this._myGamepadsManager.destroy();
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }
}
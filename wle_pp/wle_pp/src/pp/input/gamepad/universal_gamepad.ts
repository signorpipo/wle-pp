import { Handedness } from "../cauldron/input_types.js";
import { HandPose } from "../pose/hand_pose.js";
import { Gamepad, GamepadRawAxesData, GamepadRawButtonData } from "./gamepad.js";
import { GamepadAxesID, GamepadButtonID } from "./gamepad_buttons.js";
import { GamepadCore } from "./gamepad_cores/gamepad_core.js";

export class UniversalGamepad extends Gamepad {

    // Switched to `object` instead of `Map` for memory optimization reasons since iterating allocates a lot
    private _myGamepadCores: Record<string, GamepadCore> = {};
    private _myGamepadCoresIDs: string[] = [];

    private _myStarted = false;

    // Support Variables
    private readonly _myButtonData = new GamepadRawButtonData();
    private readonly _myAxesData = new GamepadRawAxesData();
    private readonly _myHapticActuators: GamepadHapticActuator[] = [];

    constructor(handedness: Handedness) {
        super(handedness);
    }

    public addGamepadCore(id: string, gamepadCore: GamepadCore): void {
        if (gamepadCore.getHandedness() == this.getHandedness()) {
            this._myGamepadCores[id] = gamepadCore;
            this._myGamepadCoresIDs.pp_pushUnique(id);

            if (this._myStarted) {
                gamepadCore.start();
                gamepadCore.setActive(this.isActive());
            }
        }
    }

    public getGamepadCore(id: string): GamepadCore {
        return this._myGamepadCores[id];
    }

    public removeGamepadCore(id: string): void {
        const gamepadCore = this._myGamepadCores[id];
        if (gamepadCore != null) {
            delete this._myGamepadCores[id];
            this._myGamepadCoresIDs.pp_removeEqual(id);
        }
    }

    public removeAllGamepadCores(): void {
        this._myGamepadCores = {};
        this._myGamepadCoresIDs = [];
    }

    public override getHandPose(): HandPose {
        let handPose = null;

        for (let i = 0; i < this._myGamepadCoresIDs.length; i++) {
            const id = this._myGamepadCoresIDs[i];
            const core = this._myGamepadCores[id];
            if (core.isGamepadCoreActive()) {
                const currentCoreHandPose = core.getHandPose();
                if (handPose == null || (currentCoreHandPose != null && currentCoreHandPose.isValid())) {
                    handPose = currentCoreHandPose;
                }
            }

            if (handPose != null && handPose.isValid()) {
                break;
            }
        }

        return handPose;
    }

    protected override _setActiveHook(active: boolean): void {
        for (let i = 0; i < this._myGamepadCoresIDs.length; i++) {
            const id = this._myGamepadCoresIDs[i];
            const core = this._myGamepadCores[id];
            core.setActive(active);
        }
    }

    protected override _startHook(): void {
        for (let i = 0; i < this._myGamepadCoresIDs.length; i++) {
            const id = this._myGamepadCoresIDs[i];
            const core = this._myGamepadCores[id];
            core.start();
            core.setActive(this.isActive());
        }

        this._myStarted = true;
    }

    protected override _preUpdate(dt: number): void {
        for (let i = 0; i < this._myGamepadCoresIDs.length; i++) {
            const id = this._myGamepadCoresIDs[i];
            const core = this._myGamepadCores[id];
            core.preUpdate(dt);
        }
    }

    protected override _postUpdate(dt: number): void {
        for (let i = 0; i < this._myGamepadCoresIDs.length; i++) {
            const id = this._myGamepadCoresIDs[i];
            const core = this._myGamepadCores[id];
            core.postUpdate(dt);
        }
    }

    protected override _getButtonData(buttonID: GamepadButtonID): GamepadRawButtonData {
        this._myButtonData.reset();

        for (let i = 0; i < this._myGamepadCoresIDs.length; i++) {
            const id = this._myGamepadCoresIDs[i];
            const core = this._myGamepadCores[id];
            if (core.isGamepadCoreActive()) {
                const coreButtonData = core.getButtonData(buttonID);
                this._myButtonData.myPressed = this._myButtonData.myPressed || coreButtonData.myPressed;
                this._myButtonData.myTouched = this._myButtonData.myTouched || coreButtonData.myTouched;
                if (Math.abs(coreButtonData.myValue) > Math.abs(this._myButtonData.myValue)) {
                    this._myButtonData.myValue = coreButtonData.myValue;
                }
            }
        }

        return this._myButtonData;
    }

    protected override _getAxesData(axesID: GamepadAxesID): GamepadRawAxesData {
        this._myAxesData.reset();

        for (let i = 0; i < this._myGamepadCoresIDs.length; i++) {
            const id = this._myGamepadCoresIDs[i];
            const core = this._myGamepadCores[id];
            if (core.isGamepadCoreActive()) {
                const coreAxesData = core.getAxesData(axesID);

                if (Math.abs(coreAxesData.myAxes[0]) > Math.abs(this._myAxesData.myAxes[0])) {
                    this._myAxesData.myAxes[0] = coreAxesData.myAxes[0];
                }

                if (Math.abs(coreAxesData.myAxes[1]) > Math.abs(this._myAxesData.myAxes[1])) {
                    this._myAxesData.myAxes[1] = coreAxesData.myAxes[1];
                }
            }
        }

        return this._myAxesData;
    }

    protected override _getHapticActuators(): GamepadHapticActuator[] {
        this._myHapticActuators.pp_clear();

        for (let i = 0; i < this._myGamepadCoresIDs.length; i++) {
            const id = this._myGamepadCoresIDs[i];
            const core = this._myGamepadCores[id];
            if (core.isGamepadCoreActive()) {
                const coreHapticActuators = core.getHapticActuators();
                for (let j = 0; j < coreHapticActuators.length; j++) {
                    this._myHapticActuators.push(coreHapticActuators[j]);
                }
            }
        }

        return this._myHapticActuators;
    }

    protected override _destroyHook(): void {
        for (let i = 0; i < this._myGamepadCoresIDs.length; i++) {
            const id = this._myGamepadCoresIDs[i];
            const core = this._myGamepadCores[id];
            core.destroy();
        }
    }
}
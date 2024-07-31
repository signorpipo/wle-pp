import { Handedness } from "../../cauldron/input_types.js";
import { Gamepad } from "../gamepad.js";
import { UniversalGamepad } from "../universal_gamepad.js";

export class GamepadsManager {

    private readonly _myUniversalGamepads: Record<Handedness, UniversalGamepad>;

    private _myDestroyed: boolean = false;

    constructor() {
        this._myUniversalGamepads = {
            [Handedness.LEFT]: new UniversalGamepad(Handedness.LEFT),
            [Handedness.RIGHT]: new UniversalGamepad(Handedness.RIGHT)
        };

        this._myDestroyed = false;
    }

    public start(): void {
        for (const rawHandedness in this._myUniversalGamepads) {
            const handedness = rawHandedness as Handedness;
            this._myUniversalGamepads[handedness].start();
        }
    }

    public update(dt: number): void {
        for (const rawHandedness in this._myUniversalGamepads) {
            const handedness = rawHandedness as Handedness;
            this._myUniversalGamepads[handedness].update(dt);
        }
    }

    public getGamepad(handedness: Handedness): Gamepad {
        return this._myUniversalGamepads[handedness];
    }

    public getGamepads(): Record<Handedness, Gamepad> {
        return this._myUniversalGamepads;
    }

    public getLeftGamepad(): Gamepad {
        return this._myUniversalGamepads[Handedness.LEFT];
    }

    public getRightGamepad(): Gamepad {
        return this._myUniversalGamepads[Handedness.RIGHT];
    }

    public getUniversalGamepad(handedness: Handedness): UniversalGamepad {
        return this._myUniversalGamepads[handedness];
    }

    public getUniversalGamepads(): Record<Handedness, UniversalGamepad> {
        return this._myUniversalGamepads;
    }

    public getLeftUniversalGamepad(): UniversalGamepad {
        return this._myUniversalGamepads[Handedness.LEFT];
    }

    public getRightUniversalGamepad(): UniversalGamepad {
        return this._myUniversalGamepads[Handedness.RIGHT];
    }

    public destroy(): void {
        this._myDestroyed = true;

        for (const rawHandedness in this._myUniversalGamepads) {
            const handedness = rawHandedness as Handedness;
            this._myUniversalGamepads[handedness].destroy();
        }
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }
}
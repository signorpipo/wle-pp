import { Handedness } from "../../cauldron/input_types.js";
import { Gamepad } from "../gamepad.js";
import { UniversalGamepad } from "../universal_gamepad.js";

export class GamepadsManager {

    private readonly _myGamepads: Record<Handedness, Gamepad>;

    private _myDestroyed: boolean = false;

    constructor() {
        this._myGamepads = {
            [Handedness.LEFT]: new UniversalGamepad(Handedness.LEFT),
            [Handedness.RIGHT]: new UniversalGamepad(Handedness.RIGHT)
        };

        this._myDestroyed = false;
    }

    public start(): void {
        for (const rawHandedness in this._myGamepads) {
            const handedness = rawHandedness as Handedness;
            this._myGamepads[handedness].start();
        }
    }

    public update(dt: number): void {
        for (const rawHandedness in this._myGamepads) {
            const handedness = rawHandedness as Handedness;
            this._myGamepads[handedness].update(dt);
        }
    }

    public getLeftGamepad(): Gamepad {
        return this._myGamepads[Handedness.LEFT];
    }

    public getRightGamepad(): Gamepad {
        return this._myGamepads[Handedness.RIGHT];
    }

    public getGamepad(handedness: Handedness): Gamepad {
        return this._myGamepads[handedness];
    }

    public getGamepads(): Record<Handedness, Gamepad> {
        return this._myGamepads;
    }

    public destroy(): void {
        this._myDestroyed = true;

        for (const rawHandedness in this._myGamepads) {
            const handedness = rawHandedness as Handedness;
            this._myGamepads[handedness].destroy();
        }
    }

    public isDestroyed(): boolean {
        return this._myDestroyed;
    }
}
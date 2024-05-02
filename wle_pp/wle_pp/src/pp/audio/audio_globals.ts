import { WonderlandEngine } from "@wonderlandengine/api";
import { Globals } from "../pp/globals.js";
import { AudioManager } from "./audio_manager.js";

const _myAudioManagers: WeakMap<Readonly<WonderlandEngine>, AudioManager> = new WeakMap();

export function getAudioManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): AudioManager | null {
    if (engine == null) return null;

    const audioManager = _myAudioManagers.get(engine);
    return audioManager != null ? audioManager : null;
}

export function setAudioManager(audioManager: AudioManager, engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myAudioManagers.set(engine, audioManager);
    }
}

export function removeAudioManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): void {
    if (engine != null) {
        _myAudioManagers.delete(engine);
    }
}

export function hasAudioManager(engine: Readonly<WonderlandEngine> | null = Globals.getMainEngine()): boolean {
    return engine != null ? _myAudioManagers.has(engine) : false;
}
import { Globals } from "../pp/globals";

let _myAudioManagers = new WeakMap();

export function getAudioManager(engine = Globals.getMainEngine()) {
    return _myAudioManagers.get(engine);
}

export function setAudioManager(audioManager, engine = Globals.getMainEngine()) {
    _myAudioManagers.set(engine, audioManager);
}

export function removeAudioManager(engine = Globals.getMainEngine()) {
    _myAudioManagers.delete(engine);
}

export function hasAudioManager(engine = Globals.getMainEngine()) {
    return _myAudioManagers.has(engine);
}
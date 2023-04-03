import { getMainEngine } from "../cauldron/wl/engine_globals";

let _myAudioManagers = new WeakMap();

export function getAudioManager(engine = getMainEngine()) {
    return _myAudioManagers.get(engine);
}

export function setAudioManager(audioManager, engine = getMainEngine()) {
    _myAudioManagers.set(engine, audioManager);
}

export function removeAudioManager(engine = getMainEngine()) {
    _myAudioManagers.delete(engine);
}

export function hasAudioManager(engine = getMainEngine()) {
    return _myAudioManagers.has(engine);
}
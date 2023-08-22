import { Howler } from "howler";
import { Globals } from "../pp/globals";
import { AudioPlayer } from "./audio_player";

export class AudioManager {

    constructor(preloadAudio = true, engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._myPreloadAudio = preloadAudio;
        this._myAudioSetups = new Map();
    }

    createAudioPlayer(audioSetupID) {
        let audioSetup = this.getAudioSetup(audioSetupID);
        if (audioSetup != null) {
            return new AudioPlayer(this.getAudioSetup(audioSetupID));
        }

        return null;
    }

    getAudioSetup(id) {
        return this._myAudioSetups.get(id);
    }

    addAudioSetup(id, audioSetup, preloadAudioOverride = null) {
        this._myAudioSetups.set(id, audioSetup);
        if ((this._myPreloadAudio && preloadAudioOverride == null) || (preloadAudioOverride != null && preloadAudioOverride)) {
            this.createAudioPlayer(id);
        }
    }

    removeAudioSetup(id) {
        this._myAudioSetups.delete(id);
    }

    setVolume(volume) {
        Howler.volume(volume);
    }

    setMute(mute) {
        Howler.mute(mute);
    }

    stop() {
        Howler.stop();
    }
}
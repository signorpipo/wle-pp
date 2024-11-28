import { Howler } from "howler";
import { Globals } from "../pp/globals.js";
import { AudioPlayer } from "./audio_player.js";

/**
 * "Global" methods like {@link AudioManager.stop} do not support multi scene properly, so be careful
 */
export class AudioManager {

    constructor(preloadAudio = true, engine = Globals.getMainEngine()) {
        this._myEngine = engine;

        this._myPreloadAudio = preloadAudio;
        this._myAudioSetups = new Map();

        this._myAudioPlayersCreatedForPreload = [];
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
            this._myAudioPlayersCreatedForPreload.push(this.createAudioPlayer(id));
        }
    }

    removeAudioSetup(id) {
        this._myAudioSetups.delete(id);
    }

    /**
     * Actually changes the volume of Howler, which means it changes it even for a new scene if you switch it  
     * and use a different audio manager
     */
    setVolume(volume) {
        Howler.volume(volume);
    }

    /**
     * Actually mute Howler, which means it changes it even for a new scene if you switch it  
     * and use a different audio manager
     */
    setMute(mute) {
        Howler.mute(mute);
    }

    /**
     * Actually stops Howler, which means it stops every audio, even for a new scene if you switch it  
     * and use a different audio manager
     */
    stop() {
        Howler.stop();
    }

    /**
     * Actually unload all audio sources in Howler, which means it unloads them even for other scenes
     * 
     * Use this with caution
     */
    unloadAllAudioSources() {
        Howler.unload();
    }
}
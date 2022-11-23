import { Howler } from 'howler';

PP.AudioManager = class AudioManager {
    constructor() {
        this._myAudioSetupMap = new Map();
    }

    createAudioPlayer(audioSetupID) {
        let audioSetup = this.getAudioSetup(audioSetupID);
        if (audioSetup != null) {
            return new PP.AudioPlayer(this.getAudioSetup(audioSetupID));
        }

        return null;
    }

    getAudioSetup(id) {
        return this._myAudioSetupMap.get(id);
    }

    addAudioSetup(id, audioSetup, preload = true) {
        this._myAudioSetupMap.set(id, audioSetup);
        if (preload) {
            this.createAudioPlayer(id);
        }
    }

    removeAudioSetup(id) {
        this._myAudioSetupMap.delete(id);
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
};
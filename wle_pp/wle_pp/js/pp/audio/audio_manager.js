import { Howler } from 'howler';

PP.AudioManager = class AudioManager {
    constructor() {
        this._myAudioSetups = new Map();
    }

    createAudioPlayer(audioSetupID) {
        let audioSetup = this.getAudioSetup(audioSetupID);
        if (audioSetup != null) {
            return new PP.AudioPlayer(this.getAudioSetup(audioSetupID));
        }

        return null;
    }

    getAudioSetup(id) {
        return this._myAudioSetups.get(id);
    }

    addAudioSetup(id, audioSetup, preload = true) {
        this._myAudioSetups.set(id, audioSetup);
        if (preload) {
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
};
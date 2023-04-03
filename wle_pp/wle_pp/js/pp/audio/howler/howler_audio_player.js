import { AudioPlayer } from "../audio_player";

export class HowlerAudioPlayer extends AudioPlayer {

    constructor(howl, audioSetup = null) {
        super(audioSetup, false);

        this._myAudio = howl;

        if (audioSetup == null) {
            this._myAudioSetup.myAudioFilePath = this._myAudio._src;

            this._myAudioSetup.myLoop = this._myAudio._loop;
            this._myAudioSetup.myAutoplay = this._myAudio._autoplay;

            this._myAudioSetup.myVolume = this._myAudio._volume;
            this._myAudioSetup.myRate = this._myAudio._rate;

            this._myAudioSetup.myPool = this._myAudio._pool;
            this._myAudioSetup.myPreload = this._myAudio._preload;

            this._myAudioSetup.myPosition = (this._myAudio._pos != null) ? this._myAudio._pos.vec3_clone() : null;
            this._myAudioSetup.mySpatial = this._myAudio._pos != null;
            this._myAudioSetup.myReferenceDistance = this._myAudio._pannerAttr.refDistance;
        } else {
            this._myAudioSetup.myAudioFilePath = this._myAudio._src;

            this._myAudio.loop(this._myAudioSetup.myLoop);
            this._myAudio._autoplay = this._myAudioSetup.myAutoplay;

            this._myAudio.volume(this._myAudioSetup.myVolume);
            this._myAudio.rate(this._myAudioSetup.myRate);

            this._myAudio._pool = this._myAudioSetup.myPool;
            this._myAudio._preload = this._myAudioSetup.myPreload;

            this.updatePosition(this._myAudioSetup.myPosition);

            this._myAudio._pannerAttr.refDistance = this._myAudioSetup.myReferenceDistance;

            if (this._myAudioSetup.myAutoplay) {
                this._myAudio.play();
            }
        }

        this._addListeners();
    }
}
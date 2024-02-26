export class AudioSetup {

    constructor(audioFilePath = null) {
        this.myAudioFilePath = audioFilePath;

        this.myLoop = false;
        this.myAutoPlay = false;

        this.myVolume = 1.0;
        this._myRate = 1.0; // From 0.5 to 4.0

        this.myPool = 5;
        this.myPreload = true;

        this.myPreventPlayWhenAudioContextNotRunning = false;

        // Spatial Params

        this.myPosition = null;
        this.mySpatial = true;
        this.myReferenceDistance = Number.MAX_VALUE; // At this distance (and closer) the volume is not reduced
    }

    clone() {
        let audioSetup = new AudioSetup();

        audioSetup.myAudioFilePath = this.myAudioFilePath;

        audioSetup.myLoop = this.myLoop;
        audioSetup.myAutoPlay = this.myAutoPlay;

        audioSetup.myVolume = this.myVolume;
        audioSetup.myPitch = this.myPitch;
        audioSetup.myRate = this.myRate;

        audioSetup.myPool = this.myPool;
        audioSetup.myPreload = this.myPreload;

        audioSetup.myPreventPlayWhenAudioContextNotRunning = this.myPreventPlayWhenAudioContextNotRunning;

        // Spatial

        if (this.myPosition != null) {
            audioSetup.myPosition = this.myPosition.vec3_clone();
        } else {
            audioSetup.myPosition = null;
        }

        audioSetup.mySpatial = this.mySpatial;
        audioSetup.myReferenceDistance = this.myReferenceDistance;

        return audioSetup;
    }

    get myPitch() {
        return this._myRate;
    }

    get myRate() {
        return this._myRate;
    }

    set myPitch(pitch) {
        this._myRate = pitch;
    }

    set myRate(rate) {
        this._myRate = rate;
    }
}
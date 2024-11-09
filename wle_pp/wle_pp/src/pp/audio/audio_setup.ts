import { Vector3 } from "../cauldron/type_definitions/array_type_definitions.js";

export class AudioSetup {

    public myAudioFilePath: string | null = null;

    public myLoop: boolean = false;
    public myAutoPlay: boolean = false;

    public myVolume: number = 1.0;

    /** From `0.5` to `4.0` */
    public _myRate: number = 1.0;

    public myPool: number = 5;
    public myPreload: boolean = true;

    public myPreventPlayWhenAudioContextNotRunning: boolean = false;

    // Spatial Params

    public myPosition: Vector3 | null = null;
    public mySpatial: boolean = true;

    /** At this distance (and closer) the volume is not reduced */
    public myReferenceDistance: number = 1;

    // End Spatial Params

    constructor(audioFilePath?: string) {
        if (audioFilePath != null) {
            this.myAudioFilePath = audioFilePath;
        }
    }

    public clone(): AudioSetup {
        const audioSetup = new AudioSetup();

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

    get myPitch(): number {
        return this._myRate;
    }

    get myRate(): number {
        return this._myRate;
    }

    set myPitch(pitch) {
        this._myRate = pitch;
    }

    set myRate(rate) {
        this._myRate = rate;
    }
}
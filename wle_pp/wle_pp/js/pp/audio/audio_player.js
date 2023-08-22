import { Emitter } from "@wonderlandengine/api";
import { Howl, Howler } from "howler";
import { AudioSetup } from "./audio_setup";

export let AudioEvent = {
    END: "end",
    STOP: "stop",
    LOAD: "load",
    LOAD_ERROR: "loaderror",
    PLAY: "play",
    PLAY_ERROR: "playerror",
    PAUSE: "pause",
    MUTE: "mute",
    VOLUME: "volume",
    RATE: "rate",
    SEEK: "seek",
    FADE: "fade",
    UNLOCK: "unlock"
};

export class AudioPlayer {

    constructor(audioSetupOrAudioFilePath, audioInstance = null) {
        if (audioSetupOrAudioFilePath == null) {
            this._myAudioSetup = new AudioSetup();
        } else if (typeof audioSetupOrAudioFilePath === "string") {
            this._myAudioSetup = new AudioSetup(audioSetupOrAudioFilePath);
        } else {
            this._myAudioSetup = audioSetupOrAudioFilePath.clone();
        }

        this._myAudio = null;

        if (audioInstance == null) {
            this._myAudio = new Howl({
                src: [this._myAudioSetup.myAudioFilePath],
                loop: this._myAudioSetup.myLoop,
                volume: this._myAudioSetup.myVolume,
                autoplay: false,
                rate: this._myAudioSetup.myRate,
                pool: this._myAudioSetup.myPool,
                pos: (this._myAudioSetup.mySpatial) ? this._myAudioSetup.myPosition : null,
                refDistance: this._myAudioSetup.myReferenceDistance,
                preload: this._myAudioSetup.myPreload
            });

            this._myAudio._pannerAttr.refDistance = this._myAudioSetup.myReferenceDistance;
        } else {
            this._myAudio = audioInstance;
        }

        this._myLastAudioID = null;

        this._myAudioEventEmitters = new Map();
        for (let eventKey in AudioEvent) {
            this._myAudioEventEmitters.set(AudioEvent[eventKey], new Emitter());    // Signature: listener(audioID)
        }

        this._addListeners();

        if (this._myAudioSetup.myAutoPlay) {
            this.play();
        }
    }

    isValid() {
        return this._myAudio != null;
    }

    play() {
        if (Howler.state != "running" && this._myAudioSetup.myPreventPlayWhenAudioContextNotRunning) {
            return false;
        }

        let audioID = this._myAudio.play();
        if (audioID != null) {
            this._myLastAudioID = audioID;

            this.updatePosition(this._myAudioSetup.myPosition, true);
            this.updatePitch(this._myAudioSetup.myPitch, true);
            this.updateVolume(this._myAudioSetup.myVolume, true);
        }

        return audioID != null;
    }

    stop() {
        this._myAudio.stop();
    }

    pause() {
        this._myAudio.pause();
    }

    resume() {
        this._myAudio.play();
    }

    isPlaying(checkOnlyLast = false) {
        let playing = false;

        if (checkOnlyLast) {
            playing = this._myAudio.playing(this._myLastAudioID);
        }
        else {
            playing = this._myAudio.playing();
        }

        return playing;
    }

    isLoaded() {
        return this._myAudio.state() == "loaded";
    }

    fade(fromVolume, toVolume, duration, updateOnlyLast = true, setValueOnPlayer = true) {
        if (setValueOnPlayer) {
            this.setVolume(toVolume);
        }

        if (updateOnlyLast) {
            this._myAudio.fade(fromVolume, toVolume, duration * 1000, this._myLastAudioID);
        } else {
            this._myAudio.fade(fromVolume, toVolume, duration * 1000);
        }
    }

    isFading(checkOnlyLast = true) {
        let fading = false;

        if (checkOnlyLast) {
            let lastSound = this._myAudio._soundById(this._myLastAudioID);
            if (lastSound != null) {
                fading = lastSound._fadeTo != null;
            }
        } else {
            for (let sound of this._myAudio._sounds) {
                if (sound._fadeTo != null) {
                    fading = true;
                    break;
                }
            }
        }

        return fading;
    }

    updatePosition(position, updateOnlyLast = true, setValueOnPlayer = true) {
        if (setValueOnPlayer) {
            this.setPosition(position);
        }

        if (this._myAudioSetup.mySpatial && position) {
            if (updateOnlyLast) {
                this._myAudio.pos(position[0], position[1], position[2], this._myLastAudioID);
            } else {
                this._myAudio.pos(position[0], position[1], position[2]);
            }
        }
    }

    updatePitch(pitch, updateOnlyLast = true, setValueOnPlayer = true) {
        this.updateRate(pitch, updateOnlyLast, setValueOnPlayer);
    }

    updateRate(rate, updateOnlyLast = true, setValueOnPlayer = true) {
        if (setValueOnPlayer) {
            this.setRate(rate);
        }

        if (rate != null) {
            if (updateOnlyLast) {
                this._myAudio.rate(rate, this._myLastAudioID);
            } else {
                this._myAudio.rate(rate);
            }
        }
    }

    updateVolume(volume, updateOnlyLast = true, setValueOnPlayer = true) {
        if (setValueOnPlayer) {
            this.setVolume(volume);
        }

        if (volume != null) {
            if (updateOnlyLast) {
                this._myAudio.volume(volume, this._myLastAudioID);
            } else {
                this._myAudio.volume(volume);
            }
        }
    }

    setSpatial(spatial) {
        this._myAudioSetup.mySpatial = spatial;
    }

    setPosition(position) {
        this._myAudioSetup.myPosition = position;
    }

    setPitch(pitch) {
        this._myAudioSetup.myPitch = pitch;
    }

    setRate(rate) {
        this._myAudioSetup.myRate = rate;
    }

    setVolume(volume) {
        this._myAudioSetup.myVolume = volume;
    }

    getDuration() {
        return this._myAudio.duration();
    }

    getVolume() {
        return this._myAudioSetup.myVolume;
    }

    getPitch() {
        return this._myAudioSetup.myPitch;
    }

    getRate() {
        return this._myAudioSetup.myRate;
    }

    registerAudioEventListener(audioEvent, id, listener, notifyOnce = false) {
        this._myAudioEventEmitters.get(audioEvent).add(listener, { id: id, once: notifyOnce });
    }

    unregisterAudioEventListener(audioEvent, id) {
        this._myAudioEventEmitters.get(audioEvent).remove(id);
    }

    _addListeners() {
        if (this._myAudio != null) {
            for (let eventKey in AudioEvent) {
                let event = AudioEvent[eventKey];
                this._myAudio.on(event, function (audioID) {
                    let emitter = this._myAudioEventEmitters.get(event);
                    emitter.notify(audioID);
                }.bind(this));
            }
        }
    }
}
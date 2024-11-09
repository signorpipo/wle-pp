import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { AudioManager } from "../audio_manager.js";

export class AudioManagerComponent extends Component {
    static TypeName = "pp-audio-manager";
    static Properties = {
        _myPreloadAudio: Property.bool(false),
        _myCleanUpAudioSourcesOnActivate: Property.bool(false)
    };

    init() {
        this._myAudioManager = new AudioManager(this._myPreloadAudio, this.engine);
    }

    onActivate() {
        if (!Globals.hasAudioManager(this.engine)) {
            if (this._myCleanUpAudioSourcesOnActivate) {
                this._myAudioManager.unloadAllAudioSources();
            }

            Globals.setAudioManager(this._myAudioManager, this.engine);
        }
    }

    onDeactivate() {
        if (Globals.getAudioManager(this.engine) == this._myAudioManager) {
            Globals.removeAudioManager(this.engine);
        }
    }
}
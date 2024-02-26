import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals.js";
import { AudioManager } from "../audio_manager.js";

export class AudioManagerComponent extends Component {
    static TypeName = "pp-audio-manager";
    static Properties = {
        _myPreloadAudio: Property.bool(false),
        _myCleanUpAudioSourcesOnInit: Property.bool(false)
    };

    init() {
        this._myAudioManager = null;

        // Prevents double global from same engine
        if (!Globals.hasAudioManager(this.engine)) {
            this._myAudioManager = new AudioManager(this._myPreloadAudio, this.engine);

            if (this._myCleanUpAudioSourcesOnInit) {
                this._myAudioManager.unloadAllAudioSources();
            }

            Globals.setAudioManager(this._myAudioManager, this.engine);
        }
    }

    onDestroy() {
        if (this._myAudioManager != null && Globals.getAudioManager(this.engine) == this._myAudioManager) {
            Globals.removeAudioManager(this.engine);
        }
    }
}
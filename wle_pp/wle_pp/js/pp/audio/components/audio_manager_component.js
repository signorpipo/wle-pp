import { Component } from "@wonderlandengine/api";
import { Globals } from "../../pp/globals";
import { AudioManager } from "../audio_manager";

export class AudioManagerComponent extends Component {
    static TypeName = "pp-audio-manager";
    static Properties = {};

    init() {
        this._myAudioManager = null;

        // Prevents double global from same engine
        if (!Globals.hasAudioManager(this.engine)) {
            this._myAudioManager = new AudioManager();

            Globals.setAudioManager(this._myAudioManager, this.engine);
        }
    }

    onDestroy() {
        if (this._myAudioManager != null && Globals.getAudioManager(this.engine) == this._myAudioManager) {
            Globals.removeAudioManager(this.engine);
        }
    }
}
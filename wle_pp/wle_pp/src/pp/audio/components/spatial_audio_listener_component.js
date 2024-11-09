import { Component } from "@wonderlandengine/api";
import { Howler } from "howler";
import { vec3_create } from "../../plugin/js/extensions/array/vec_create_extension.js";

export class SpatialAudioListenerComponent extends Component {
    static TypeName = "pp-spatial-audio-listener";

    init() {
        this._myOrigin = vec3_create();
        this._myForward = vec3_create();
        this._myUp = vec3_create();
    }

    start() {
        this._updateAudioListener();
    }

    update(dt) {
        this._updateAudioListener();
    }

    _updateAudioListener() {
        this.object.pp_getPosition(this._myOrigin);
        this.object.pp_getForward(this._myForward);
        this.object.pp_getUp(this._myUp);

        Howler.pos(this._myOrigin[0], this._myOrigin[1], this._myOrigin[2]);
        Howler.orientation(this._myForward[0], this._myForward[1], this._myForward[2],
            this._myUp[0], this._myUp[1], this._myUp[2]);
    }
}
import { Component } from "@wonderlandengine/api";

class PlayerLocomotionSmoothComponent extends Component {
    static TypeName = "pp-player-locomotion-smooth";
    static Properties = {};

    init() {
    }

    start() {
        //this._myPlayerLocomotionSmooth = new PlayerLocomotionSmooth();
    }

    update(dt) {
        this._myPlayerLocomotionSmooth.update(dt);
    }

    getPlayerLocomotionSmooth() {
        return this._myPlayerLocomotionSmooth;
    }
}
import { Component, Property } from "@wonderlandengine/api";
import { PlayerLocomotionSmooth } from "../player_locomotion_smooth";

export class PlayerLocomotionSmoothComponent extends Component {
    static TypeName = "pp-player-locomotion-smooth";
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerLocomotionSmooth = new PlayerLocomotionSmooth();
    }

    update(dt) {
        this._myPlayerLocomotionSmooth.update(dt);
    }

    getPlayerLocomotionSmooth() {
        return this._myPlayerLocomotionSmooth;
    }
}
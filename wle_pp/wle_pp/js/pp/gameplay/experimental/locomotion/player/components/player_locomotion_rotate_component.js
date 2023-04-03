import { Component, Property } from "@wonderlandengine/api";
import { PlayerLocomotionRotate } from "../player_locomotion_rotate";

export class PlayerLocomotionRotateComponent extends Component {
    static TypeName = "pp-player-locomotion-rotate";
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerLocomotionRotate = new PlayerLocomotionRotate();
    }

    update(dt) {
        this._myPlayerLocomotionRotate.update(dt);
    }

    getPlayerLocomotionRotate() {
        return this._myPlayerLocomotionRotate;
    }
}
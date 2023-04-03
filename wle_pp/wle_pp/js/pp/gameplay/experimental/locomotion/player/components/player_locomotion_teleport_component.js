import { Component, Property } from "@wonderlandengine/api";
import { PlayerLocomotionTeleport } from "../teleport/player_locomotion_teleport";

export class PlayerLocomotionTeleportComponent extends Component {
    static TypeName = "pp-player-locomotion-teleport";
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerLocomotionTeleport = new PlayerLocomotionTeleport();
    }

    update(dt) {
        this._myPlayerLocomotionTeleport.update(dt);
    }

    getPlayerLocomotionTeleport() {
        return this._myPlayerLocomotionTeleport;
    }
}
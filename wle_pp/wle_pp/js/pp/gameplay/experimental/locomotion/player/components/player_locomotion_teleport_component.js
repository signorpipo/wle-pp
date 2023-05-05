import { Component } from "@wonderlandengine/api";

class PlayerLocomotionTeleportComponent extends Component {
    static TypeName = "pp-player-locomotion-teleport";
    static Properties = {};

    init() {
    }

    start() {
        //this._myPlayerLocomotionTeleport = new PlayerLocomotionTeleport();
    }

    update(dt) {
        this._myPlayerLocomotionTeleport.update(dt);
    }

    getPlayerLocomotionTeleport() {
        return this._myPlayerLocomotionTeleport;
    }
}
import { Component } from "@wonderlandengine/api";

class PlayerLocomotionGravityComponent extends Component {
    static TypeName = "pp-player-locomotion-gravity";
    static Properties = {};

    init() {
    }

    start() {
        //this._myPlayerLocomotionGravity = new PlayerLocomotionGravity();
    }

    update(dt) {
        this._myPlayerLocomotionGravity.update(dt);
    }

    getPlayerLocomotionGravity() {
        return this._myPlayerLocomotionGravity;
    }
}
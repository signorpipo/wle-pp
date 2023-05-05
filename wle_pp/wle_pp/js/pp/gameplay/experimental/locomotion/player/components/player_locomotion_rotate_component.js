import { Component } from "@wonderlandengine/api";

class PlayerLocomotionRotateComponent extends Component {
    static TypeName = "pp-player-locomotion-rotate";
    static Properties = {};

    init() {
    }

    start() {
        //this._myPlayerLocomotionRotate = new PlayerLocomotionRotate();
    }

    update(dt) {
        this._myPlayerLocomotionRotate.update(dt);
    }

    getPlayerLocomotionRotate() {
        return this._myPlayerLocomotionRotate;
    }
}
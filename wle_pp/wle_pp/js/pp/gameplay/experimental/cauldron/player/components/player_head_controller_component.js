import { Component } from "@wonderlandengine/api";
import { PlayerHeadController } from "../player_head_controller";

export class PlayerHeadControllerComponent extends Component {
    static TypeName = "pp-player-head-controller";
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerHeadController = new PlayerHeadController();
    }

    update(dt) {
        this._myPlayerHeadController.update(dt);
    }

    getPlayerHeadController() {
        return this._myPlayerHeadController;
    }
}
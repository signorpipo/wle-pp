import { Component } from "@wonderlandengine/api";
import { PlayerHeadCharacterController } from "../player_head_character_controller";

export class PlayerHeadCharacterControllerComponent extends Component {
    static TypeName = "pp-player-head-character-controller";
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerHeadCharacterController = new PlayerHeadCharacterController();
    }

    update(dt) {
        this._myPlayerHeadCharacterController.update(dt);
    }

    getPlayerHeadCharacterController() {
        return this._myPlayerHeadCharacterController;
    }
}
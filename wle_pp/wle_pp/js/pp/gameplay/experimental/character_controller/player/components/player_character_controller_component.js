import { Component } from "@wonderlandengine/api";
import { PlayerCharacterController } from "../player_character_controller";

export class PlayerCharacterControllerComponent extends Component {
    static TypeName = "pp-player-character-controller";
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerCharacterController = new PlayerCharacterController();
    }

    update(dt) {
        this._myPlayerCharacterController.update(dt);
    }

    getPlayerCharacterController() {
        return this._myPlayerCharacterController;
    }
}
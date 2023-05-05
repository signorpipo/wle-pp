import { Component } from "@wonderlandengine/api";
import { PlayerHandCharacterController } from "../player_hand_character_controller";

export class PlayerHandCharacterControllerComponent extends Component {
    static TypeName = "pp-player-hand-character-controller";
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerHandCharacterController = new PlayerHandCharacterController();
    }

    update(dt) {
        this._myPlayerHandCharacterController.update(dt);
    }

    getPlayerHandCharacterController() {
        return this._myPlayerHandCharacterController;
    }
}
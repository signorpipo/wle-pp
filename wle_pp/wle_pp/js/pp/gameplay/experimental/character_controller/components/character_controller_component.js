import { Component } from "@wonderlandengine/api";
import { CharacterController } from "../character_controller";

export class CharacterControllerComponent extends Component {
    static TypeName = "pp-character-controller";
    static Properties = {};

    init() {
    }

    start() {
        this._myCharacterController = new CharacterController();
    }

    update(dt) {
        this._myCharacterController.update(dt);
    }

    getCharacterController() {
        return this._myCharacterController;
    }
}
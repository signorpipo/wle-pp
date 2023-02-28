import { Component, Type } from '@wonderlandengine/api';

PP.PlayerCharacterControllerComponent = class PlayerCharacterControllerComponent extends Component {
    static TypeName = 'pp-player-character-controller';
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerCharacterController = new PP.PlayerCharacterController();
    }

    update(dt) {
        this._myPlayerCharacterController.update(dt);
    }

    getPlayerCharacterController() {
        return this._myPlayerCharacterController;
    }
};

WL.registerComponent(PP.PlayerCharacterControllerComponent);
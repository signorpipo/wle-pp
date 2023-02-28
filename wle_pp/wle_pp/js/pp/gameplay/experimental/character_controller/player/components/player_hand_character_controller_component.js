import { Component, Type } from '@wonderlandengine/api';

PP.PlayerHandCharacterControllerComponent = class PlayerHandCharacterControllerComponent extends Component {
    static TypeName = 'pp-player-hand-character-controller';
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerHandCharacterController = new PP.PlayerHandCharacterController();
    }

    update(dt) {
        this._myPlayerHandCharacterController.update(dt);
    }

    getPlayerHandCharacterController() {
        return this._myPlayerHandCharacterController;
    }
};

WL.registerComponent(PP.PlayerHandCharacterControllerComponent);
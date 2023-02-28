import { Component, Type } from '@wonderlandengine/api';

PP.PlayerHeadCharacterControllerComponent = class PlayerHeadCharacterControllerComponent extends Component {
    static TypeName = 'pp-player-head-character-controller';
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerHeadCharacterController = new PP.PlayerHeadCharacterController();
    }

    update(dt) {
        this._myPlayerHeadCharacterController.update(dt);
    }

    getPlayerHeadCharacterController() {
        return this._myPlayerHeadCharacterController;
    }
};

WL.registerComponent(PP.PlayerHeadCharacterControllerComponent);
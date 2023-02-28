import { Component, Type } from '@wonderlandengine/api';

PP.PlayerHeadControllerComponent = class PlayerHeadControllerComponent extends Component {
    static TypeName = 'pp-player-head-controller';
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerHeadController = new PP.PlayerHeadController();
    }

    update(dt) {
        this._myPlayerHeadController.update(dt);
    }

    getPlayerHeadController() {
        return this._myPlayerHeadController;
    }
};

WL.registerComponent(PP.PlayerHeadControllerComponent);
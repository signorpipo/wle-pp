import { Component, Type } from '@wonderlandengine/api';

PP.PlayerLocomotionRotateComponent = class PlayerLocomotionRotateComponent extends Component {
    static TypeName = 'pp-player-locomotion-rotate';
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerLocomotionRotate = new PP.PlayerLocomotionRotate();
    }

    update(dt) {
        this._myPlayerLocomotionRotate.update(dt);
    }

    getPlayerLocomotionRotate() {
        return this._myPlayerLocomotionRotate;
    }
};

WL.registerComponent(PP.PlayerLocomotionRotateComponent);
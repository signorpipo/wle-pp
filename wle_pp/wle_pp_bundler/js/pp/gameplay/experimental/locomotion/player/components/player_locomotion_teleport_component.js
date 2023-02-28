import { Component, Type } from '@wonderlandengine/api';

PP.PlayerLocomotionTeleportComponent = class PlayerLocomotionTeleportComponent extends Component {
    static TypeName = 'pp-player-locomotion-teleport';
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerLocomotionTeleport = new PP.PlayerLocomotionTeleport();
    }

    update(dt) {
        this._myPlayerLocomotionTeleport.update(dt);
    }

    getPlayerLocomotionTeleport() {
        return this._myPlayerLocomotionTeleport;
    }
};

WL.registerComponent(PP.PlayerLocomotionTeleportComponent);
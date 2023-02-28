import { Component, Type } from '@wonderlandengine/api';

PP.PlayerOcclusionComponent = class PlayerOcclusionComponent extends Component {
    static TypeName = 'pp-player-occlusion';
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerOcclusion = new PP.PlayerOcclusion();
    }

    update(dt) {
        this._myPlayerOcclusion.update(dt);
    }

    getPlayerOcclusion() {
        return this._myPlayerOcclusion;
    }
};

WL.registerComponent(PP.PlayerOcclusionComponent);
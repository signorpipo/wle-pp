import { Component, Type } from '@wonderlandengine/api';

PP.PlayerViewOcclusionComponent = class PlayerViewOcclusionComponent extends Component {
    static TypeName = 'pp-player-occlusion';
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerViewOcclusion = new PP.PlayerViewOcclusion();
    }

    update(dt) {
        this._myPlayerViewOcclusion.update(dt);
    }

    getPlayerViewOcclusion() {
        return this._myPlayerViewOcclusion;
    }
};

WL.registerComponent(PP.PlayerViewOcclusionComponent);
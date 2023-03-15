import { Component, Type } from '@wonderlandengine/api';

PP.GatewayComponent = class GatewayComponent extends Component {
    static TypeName = 'pp-gateway';
    static Properties = {};

    init() {
        this._myInputManager = this.object.pp_addComponent("pp-input-manager", false);
        this._myAudioManager = this.object.pp_addComponent("pp-audio-manager", false);
        this._myVisualManager = this.object.pp_addComponent("pp-visual-manager", false);
        this._myDebugManager = this.object.pp_addComponent("pp-debug-manager", false);
    }

    start() {
        this._myInputManager.active = true;
        this._myAudioManager.active = true;
        this._myVisualManager.active = true;
        this._myDebugManager.active = true;
    }

    update(dt) {
    }
};

WL.registerComponent(PP.GatewayComponent);
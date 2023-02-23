import { Component, Type } from '@wonderlandengine/api';

PP.myAudioManager = null;

PP.AudioManagerComponent = class AudioManagerComponent extends Component {
    static TypeName = 'pp-audio-manager';
    static Properties = {};

    init() {
        PP.myAudioManager = new PP.AudioManager();
    }

    start() {
    }

    update(dt) {
    }
};

WL.registerComponent(PP.AudioManagerComponent);
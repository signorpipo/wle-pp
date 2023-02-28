import { Component, Type } from '@wonderlandengine/api';

PP.CharacterCollisionSystemComponent = class CharacterCollisionSystemComponent extends Component {
    static TypeName = 'pp-character-collision-system';
    static Properties = {};

    init() {
        PP.myCharacterCollisionSystem = new PP.CharacterCollisionSystem();
    }

    start() {
    }

    update(dt) {
        PP.myCharacterCollisionSystem.update(dt);
    }
};

WL.registerComponent(PP.CharacterCollisionSystemComponent);

PP.myCharacterCollisionSystem = null;
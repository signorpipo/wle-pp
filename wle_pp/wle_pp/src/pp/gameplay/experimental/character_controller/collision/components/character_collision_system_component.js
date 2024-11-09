import { Component } from "@wonderlandengine/api";
import { Globals } from "../../../../../pp/globals.js";
import { CharacterCollisionSystem } from "../character_collision_system.js";

export class CharacterCollisionSystemComponent extends Component {
    static TypeName = "pp-character-collision-system";

    init() {
        this._myCharacterCollisionSystem = new CharacterCollisionSystem(this.engine);
    }

    update(dt) {
        if (Globals.getCharacterCollisionSystem(this.engine) == this._myCharacterCollisionSystem) {
            this._myCharacterCollisionSystem.update(dt);
        }
    }

    onActivate() {
        if (!Globals.hasCharacterCollisionSystem(this.engine)) {
            Globals.setCharacterCollisionSystem(this._myCharacterCollisionSystem, this.engine);
        }
    }

    onDeactivate() {
        if (Globals.getCharacterCollisionSystem(this.engine) == this._myCharacterCollisionSystem) {
            Globals.removeCharacterCollisionSystem(this.engine);
        }
    }
}
import { Component } from "@wonderlandengine/api";
import { Globals } from "../../../../../pp/globals";
import { CharacterCollisionSystem } from "../character_collision_system";

export class CharacterCollisionSystemComponent extends Component {
    static TypeName = "pp-character-collision-system";
    static Properties = {};

    init() {
        this._myCharacterCollisionSystem = null;

        // Prevents double global from same engine
        if (!Globals.hasCharacterCollisionSystem(this.engine)) {
            this._myCharacterCollisionSystem = new CharacterCollisionSystem(this.engine);

            Globals.setCharacterCollisionSystem(this._myCharacterCollisionSystem, this.engine);
        }
    }

    update(dt) {
        if (this._myCharacterCollisionSystem != null) {
            this._myCharacterCollisionSystem.update(dt);
        }
    }

    onDestroy() {
        if (this._myCharacterCollisionSystem != null && Globals.getCharacterCollisionSystem(this.engine) == this._myCharacterCollisionSystem) {
            Globals.removeCharacterCollisionSystem(this.engine);
        }
    }
}
import { Component, Property } from "@wonderlandengine/api";
import { CharacterCollisionSystem } from "../character_collision_system";
import { getCharacterCollisionSystem, hasCharacterCollisionSystem, removeCharacterCollisionSystem, setCharacterCollisionSystem } from "../character_collision_system_global";

export class CharacterCollisionSystemComponent extends Component {
    static TypeName = "pp-character-collision-system";
    static Properties = {};

    init() {
        this._myCharacterCollisionSystem = null;

        // Prevents double global from same engine
        if (!hasCharacterCollisionSystem(this.engine)) {
            this._myCharacterCollisionSystem = new CharacterCollisionSystem(this.engine);

            setCharacterCollisionSystem(this._myCharacterCollisionSystem, this.engine);
        }
    }

    update(dt) {
        if (this._myCharacterCollisionSystem != null) {
            this._myCharacterCollisionSystem.update(dt);
        }
    }

    onDestroy() {
        if (this._myCharacterCollisionSystem != null && getCharacterCollisionSystem(this.engine) == this._myCharacterCollisionSystem) {
            removeCharacterCollisionSystem(this.engine);
        }
    }
}
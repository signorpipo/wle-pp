import { Component, Property } from "@wonderlandengine/api";
import { getPlayerObjects } from "../../../pp/player_objects_global";

export class CopyPlayerTransformComponent extends Component {
    static TypeName = "pp-copy-player-transform";
    static Properties = {};

    update(dt) {
        let player = getPlayerObjects(this.engine).myPlayer;
        this.object.pp_setTransformQuat(player.pp_getTransformQuat());
        this.object.pp_setScale(player.pp_getScale());
    }
}
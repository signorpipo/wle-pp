import { Component, Property } from "@wonderlandengine/api";
import { getPlayerObjects } from "../../../pp/player_objects_global";

export class CopyPlayerPivotTransformComponent extends Component {
    static TypeName = "pp-copy-player-pivot-transform";
    static Properties = {};

    update(dt) {
        let playerPivot = getPlayerObjects(this.engine).myPlayerPivot;
        this.object.pp_setTransformQuat(playerPivot.pp_getTransformQuat());
        this.object.pp_setScale(playerPivot.pp_getScale());
    }
}
import { Component } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals";

export class CopyPlayerPivotTransformComponent extends Component {
    static TypeName = "pp-copy-player-pivot-transform";
    static Properties = {};

    update(dt) {
        let playerPivot = Globals.getPlayerObjects(this.engine).myPlayerPivot;
        this.object.pp_setTransformQuat(playerPivot.pp_getTransformQuat());
        this.object.pp_setScale(playerPivot.pp_getScale());
    }
}
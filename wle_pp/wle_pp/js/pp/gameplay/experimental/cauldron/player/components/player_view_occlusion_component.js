import { Component } from "@wonderlandengine/api";
import { PlayerViewOcclusion } from "../player_view_occlusion";

export class PlayerViewOcclusionComponent extends Component {
    static TypeName = "pp-player-occlusion";
    static Properties = {};

    init() {
    }

    start() {
        this._myPlayerViewOcclusion = new PlayerViewOcclusion();
    }

    update(dt) {
        this._myPlayerViewOcclusion.update(dt);
    }

    getPlayerViewOcclusion() {
        return this._myPlayerViewOcclusion;
    }
}
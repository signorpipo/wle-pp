import { Component, Property } from "@wonderlandengine/api";
import { getPlayerObjects } from "../../../pp/player_objects_global";

export class CopyHeadTransformComponent extends Component {
    static TypeName = "pp-copy-head-transform";
    static Properties = {};

    update(dt) {
        let head = getPlayerObjects(this.engine).myHead;
        this.object.pp_setTransformQuat(head.pp_getTransformQuat());
        this.object.pp_setScale(head.pp_getScale());
    }
}
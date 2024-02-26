import { Component } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";

export class CopyHeadTransformComponent extends Component {
    static TypeName = "pp-copy-head-transform";
    static Properties = {};

    update(dt) {
        let head = Globals.getPlayerObjects(this.engine).myHead;
        this.object.pp_setTransformQuat(head.pp_getTransformQuat());
        this.object.pp_setScale(head.pp_getScale());
    }
}
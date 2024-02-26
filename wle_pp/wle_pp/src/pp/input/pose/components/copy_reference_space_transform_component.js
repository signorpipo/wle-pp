import { Component } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";

export class CopyReferenceSpaceTransformComponent extends Component {
    static TypeName = "pp-copy-reference-space-transform";
    static Properties = {};

    update(dt) {
        let referenceSpace = Globals.getPlayerObjects(this.engine).myReferenceSpace;
        this.object.pp_setTransformQuat(referenceSpace.pp_getTransformQuat());
        this.object.pp_setScale(referenceSpace.pp_getScale());
    }
}
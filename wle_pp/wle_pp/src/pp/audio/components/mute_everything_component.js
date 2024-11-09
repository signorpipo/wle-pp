import { Component } from "@wonderlandengine/api";
import { Howler } from "howler";

export class MuteEverythingComponent extends Component {
    static TypeName = "pp-mute-everything";

    start() {
        Howler.mute(true);
    }
}
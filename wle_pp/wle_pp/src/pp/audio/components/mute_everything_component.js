import { Component } from "@wonderlandengine/api";
import { Howler } from "howler";

export class MuteEverythingComponent extends Component {
    static TypeName = "pp-mute-everything";
    static Properties = {};

    start() {
        Howler.mute(true);
    }
}
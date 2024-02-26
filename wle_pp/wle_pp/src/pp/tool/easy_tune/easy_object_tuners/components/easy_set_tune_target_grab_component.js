import { Component } from "@wonderlandengine/api";
import { GrabberHandComponent } from "../../../../gameplay/grab_throw/grabber_hand_component.js";
import { Globals } from "../../../../pp/globals.js";

export class EasySetTuneTargeetGrabComponent extends Component {
    static TypeName = "pp-easy-set-tune-target-grab";
    static Properties = {};

    start() {
        this._myGrabber = null;

        if (Globals.isToolEnabled(this.engine)) {
            this._myGrabber = this.object.pp_getComponent(GrabberHandComponent);
            this._myEasyTuneTarget = null;
        }
    }

    _onRelease(grabber, grabbable) {
        if (Globals.isToolEnabled(this.engine)) {
            this._myEasyTuneTarget = grabbable.object;
            Globals.setEasyTuneTarget(this._myEasyTuneTarget, this.engine);
        }
    }

    _onGrab(grabber, grabbable) {
        if (Globals.isToolEnabled(this.engine)) {
            if (Globals.getEasyTuneTarget(this.engine) == this._myEasyTuneTarget) {
                Globals.removeEasyTuneTarget(this.engine);
            }
            this._myEasyTuneTarget = null;
        }
    }

    onActivate() {
        if (this._myGrabber != null) {
            //this._myGrabber.registerGrabEventListener(this, this._onGrab.bind(this));
            this._myGrabber.registerThrowEventListener(this, this._onRelease.bind(this));
        }
    }

    onDeactivate() {
        if (this._myGrabber != null) {
            //this._myGrabber.unregisterGrabEventListener(this);
            this._myGrabber.unregisterThrowEventListener(this);
        }
    }
}
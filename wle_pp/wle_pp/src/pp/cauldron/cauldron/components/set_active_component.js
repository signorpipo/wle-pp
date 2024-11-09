import { Component, Property } from "@wonderlandengine/api";
import { XRUtils } from "../../utils/xr_utils.js";

export class SetActiveComponent extends Component {
    static TypeName = "pp-set-active";
    static Properties = {
        _myActive: Property.bool(true),
        _mySetActiveOn: Property.enum(["Self", "Children", "Descendants", "Hierarchy"], "Hierarchy"),
        _mySetActiveWhen: Property.enum(["Init", "Start", "First Update", "Enter XR", "Exit XR", "First Enter XR", "First Exit XR"], "Init")
    };

    init() {
        if (this.active && this._mySetActiveWhen == 0) {
            this._setActive();
        }
    }

    start() {
        if (this._mySetActiveWhen == 1) {
            this._setActive();
        }

        this._myFirstUpdate = true;
        this._myFirstXRStart = true;
        this._myFirstXREnd = true;

        this._myActivateOnNextUpdate = false;
    }

    update(dt) {
        if (this._myActivateOnNextUpdate) {
            this._onActivate();

            this._myActivateOnNextUpdate = false;
        }

        if (this._mySetActiveWhen == 2 && this._myFirstUpdate) {
            this._setActive();
        }

        this._myFirstUpdate = false;
    }

    _onXRSessionStart() {
        if (this._mySetActiveWhen == 3 || (this._mySetActiveWhen == 5 && this._myFirstXRStart)) {
            this._setActive();
        }

        this._myFirstXRStart = false;
    }

    _onXRSessionEnd() {
        if (this._mySetActiveWhen == 4 || (this._mySetActiveWhen == 6 && this._myFirstXREnd)) {
            this._setActive();
        }

        this._myFirstXREnd = false;
    }

    _setActive() {
        if (this._mySetActiveOn == 0) {
            this.object.pp_setActiveSelf(this._myActive);
        } else if (this._mySetActiveOn == 1) {
            this.object.pp_setActiveChildren(this._myActive);
        } else if (this._mySetActiveOn == 2) {
            this.object.pp_setActiveDescendants(this._myActive);
        } else {
            this.object.pp_setActive(this._myActive);
        }
    }

    onActivate() {
        this._myActivateOnNextUpdate = true;
    }

    _onActivate() {
        if (this._mySetActiveWhen == 3 || this._mySetActiveWhen == 5) {
            XRUtils.registerSessionStartEventListener(this, this._onXRSessionStart.bind(this), true, true, this.engine);
        } else if (this._mySetActiveWhen == 4 || this._mySetActiveWhen == 6) {
            XRUtils.registerSessionEndEventListener(this, this._onXRSessionEnd.bind(this), this.engine);
        }
    }

    onDeactivate() {
        XRUtils.unregisterSessionStartEndEventListeners(this, this.engine);
    }
}
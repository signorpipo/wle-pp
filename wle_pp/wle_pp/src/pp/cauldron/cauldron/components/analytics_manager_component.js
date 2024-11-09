import { Component, Property } from "@wonderlandengine/api";
import { Globals } from "../../../pp/globals.js";
import { BrowserUtils } from "../../utils/browser_utils.js";
import { AnalyticsManager } from "../analytics_manager.js";

export class AnalyticsManagerComponent extends Component {
    static TypeName = "pp-analytics-manager";
    static Properties = {
        _myDisableAnalyticsOnLocalhost: Property.bool(true)
    };

    init() {
        this._myAnalyticsManager = new AnalyticsManager();
    }

    update(dt) {
        if (Globals.getAnalyticsManager(this.engine) == this._myAnalyticsManager) {
            this._myAnalyticsManager.update(dt);
        }
    }

    onActivate() {
        if (!Globals.hasAnalyticsManager(this.engine)) {
            if (BrowserUtils.isLocalhost() && this._myDisableAnalyticsOnLocalhost) {
                this._myAnalyticsManager.setAnalyticsEnabled(false);
            }

            Globals.setAnalyticsManager(this._myAnalyticsManager, this.engine);
        }
    }

    onDeactivate() {
        if (Globals.getAnalyticsManager(this.engine) == this._myAnalyticsManager) {
            Globals.removeAnalyticsManager(this.engine);
        }
    }
}
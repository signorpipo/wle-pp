import { vec3_create } from "../../../../plugin/js/extensions/array_extension";
import { EasyTuneBaseWidgetSetup } from "../base/easy_tune_base_widget_setup";

export class EasyTuneNoneWidgetSetup extends EasyTuneBaseWidgetSetup {

    _getBackPanelMinY() {
        return super._getBackPanelMinY() + this.myTypeNotSupportedPanelPosition[1];
    }

    _getPivotZOffset() {
        return 0.00804713;
    }

    _initializeBuildSetupHook() {
        this.myTypeNotSupportedPanelPosition = vec3_create(0, -0.03, this._myPanelZOffset);
        this.myTypeNotSupportedTextScale = vec3_create(0.275, 0.275, 0.275);
        this.myTypeNotSupportedText = "Type Not Supported";
    }
}
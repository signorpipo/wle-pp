import { EasyTuneBaseArrayWidgetSelector } from "../base/easy_tune_base_array_widget_selector.js";
import { EasyTuneBoolArrayWidget } from "./easy_tune_bool_array_widget.js";

export class EasyTuneBoolArrayWidgetSelector extends EasyTuneBaseArrayWidgetSelector {

    _getEasyTuneArrayWidget(arraySize) {
        return new EasyTuneBoolArrayWidget(this._myParams, arraySize, this._myGamepad, this._myEngine);
    }
}
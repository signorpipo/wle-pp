import * as WLAPI from "@wonderlandengine/api";
import { Component, Property } from "@wonderlandengine/api";
import * as WLComponents from "@wonderlandengine/components";

export class AddWLToWindowComponent extends Component {
    static TypeName = "pp-add-wl-to-window";
    static Properties = {
        _myAdd: Property.bool(true)
    };

    init() {
        if (this._myAdd) {
            window.WL = {};
            this._addProperties(WLAPI);
            this._addProperties(WLComponents);
        }
    }

    _addProperties(object) {
        let propertyNames = Object.getOwnPropertyNames(object);
        for (let propertyName of propertyNames) {
            if (object[propertyName] != undefined) {
                window.WL[propertyName] = object[propertyName];
            }
        }
    }

    onDestroy() {
        window.WL = undefined;
    }
}
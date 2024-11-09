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
            this._myWL = {};
            this._addProperties(WLAPI);
            this._addProperties(WLComponents);

            window.WL = this._myWL;
        }
    }

    _addProperties(object) {
        let propertyNames = Object.getOwnPropertyNames(object);
        for (let propertyName of propertyNames) {
            if (object[propertyName] != undefined) {
                this._myWL[propertyName] = object[propertyName];
            }
        }
    }

    onActivate() {
        if (this._myWL != null) {
            window.WL = this._myWL;
        }
    }

    onDeactivate() {
        if (this._myWL != null) {
            delete window.WL;
        }
    }
}
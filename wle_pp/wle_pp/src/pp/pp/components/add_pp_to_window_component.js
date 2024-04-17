import { Component, Property } from "@wonderlandengine/api";
import * as PPAPI from "../../index.js";

export class AddPPToWindowComponent extends Component {
    static TypeName = "pp-add-pp-to-window";
    static Properties = {
        _myAdd: Property.bool(true)
    };

    init() {
        if (this._myAdd) {
            window.PP = {};
            this._addProperties(PPAPI);
        }
    }

    _addProperties(object) {
        let propertyNames = Object.getOwnPropertyNames(object);
        for (let propertyName of propertyNames) {
            if (object[propertyName] != undefined) {
                window.PP[propertyName] = object[propertyName];
            }
        }
    }

    onDestroy() {
        window.PP = undefined;
    }
}
import { Component, Property } from "@wonderlandengine/api";
import * as PPAPI from "../../index.js";

export class AddPPToWindowComponent extends Component {
    static TypeName = "pp-add-pp-to-window";
    static Properties = {
        _myAdd: Property.bool(true)
    };

    start() {
        this._myPP = null;
        if (this._myAdd) {
            this._myPP = {};
            this._addProperties(PPAPI);

            window.PP = this._myPP;
        }
    }

    _addProperties(object) {
        let propertyNames = Object.getOwnPropertyNames(object);
        for (let propertyName of propertyNames) {
            if (object[propertyName] != undefined) {
                this._myPP[propertyName] = object[propertyName];
            }
        }
    }

    onActivate() {
        if (this._myPP != null) {
            window.PP = this._myPP;
        }
    }

    onDeactivate() {
        if (this._myPP != null) {
            delete window.PP;
        }
    }
}
import { Component, Property } from "@wonderlandengine/api";
import * as PPAPI from "../..";
import { Globals } from "../../pp/globals";

export class AddPPToWindowComponent extends Component {
    static TypeName = "pp-add-pp-to-window";
    static Properties = {
        _myAdd: Property.bool(true)
    };

    init() {
        if (this._myAdd) {
            Globals.getWindow(this.engine).PP = {};
            this._addProperties(PPAPI);
        }
    }

    _addProperties(object) {
        let propertyNames = Object.getOwnPropertyNames(object);
        for (let propertyName of propertyNames) {
            if (object[propertyName] != undefined) {
                Globals.getWindow(this.engine).PP[propertyName] = object[propertyName];
            }
        }
    }

    onDestroy() {
        Globals.getWindow(this.engine).PP = undefined;
    }
}
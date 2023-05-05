import { Component, Property } from "@wonderlandengine/api";
import { AudioManagerComponent } from "../../audio/components/audio_manager_component";
import { VisualManagerComponent } from "../../cauldron/visual/components/visual_manager_component";
import { AddWLToWindowComponent } from "../../cauldron/wl/components/add_wl_to_window_component";
import { DebugManagerComponent } from "../../debug/components/debug_manager_component";
import { EnableDebugsComponent } from "../../debug/components/enable_debugs_component";
import { InputManagerComponent } from "../../input/cauldron/components/input_manager_component";
import { EnableToolsComponent } from "../../tool/cauldron/components/enable_tools_component";
import { InitEasyTuneVariablesComponent } from "../../tool/easy_tune/components/init_easy_tune_variables_component";
import { initPP } from "../init_pp";
import { AddPPToWindowComponent } from "./add_pp_to_window_component";
import { GetDefaultResourcesComponent } from "./get_default_resources_component";
import { GetSceneObjectsComponent } from "./get_scene_objects_component";

let _alreadyRegisteredEngines = [];

export class PPGatewayComponent extends Component {
    static TypeName = "pp-gateway";
    static Properties = {
        _myEnableDebugs: Property.bool(true),
        _myEnableTools: Property.bool(true),
        _myAddPPToWindow: Property.bool(true),
        _myAddWLToWindow: Property.bool(true),
        _myInitEasyTuneVariables: Property.bool(true),
        ...InputManagerComponent.Properties,
        ...AudioManagerComponent.Properties,
        ...VisualManagerComponent.Properties,
        ...DebugManagerComponent.Properties,
        ...GetSceneObjectsComponent.Properties,
        ...GetDefaultResourcesComponent.Properties
    };

    static onRegister(engine) {
        if (!_alreadyRegisteredEngines.includes(engine)) {
            _alreadyRegisteredEngines.push(engine)
            initPP(engine);
        }
    }

    init() {
        this._myGetDefaultResourcesComponent = this.object.pp_addComponent(GetDefaultResourcesComponent, this._getProperties(GetDefaultResourcesComponent.Properties));
        this._myGetSceneObjectsComponent = this.object.pp_addComponent(GetSceneObjectsComponent, this._getProperties(GetSceneObjectsComponent.Properties));

        this._myEnableDebugsComponent = null;
        if (this._myEnableDebugs) {
            this._myEnableDebugsComponent = this.object.pp_addComponent(EnableDebugsComponent, false);
        }

        this._myEnableToolsComponent = null;
        if (this._myEnableTools) {
            this._myEnableToolsComponent = this.object.pp_addComponent(EnableToolsComponent, false);
        }

        this._myAddPPToWindowComponent = null;
        if (this._myAddPPToWindow) {
            this._myAddPPToWindowComponent = this.object.pp_addComponent(AddPPToWindowComponent, false);
        }

        this._myAddWLToWindowComponent = null;
        if (this._myAddWLToWindow) {
            this._myAddWLToWindowComponent = this.object.pp_addComponent(AddWLToWindowComponent, false);
        }

        this._myInitEasyTuneVariablesComponent = null;
        if (this._myInitEasyTuneVariables) {
            this._myInitEasyTuneVariablesComponent = this.object.pp_addComponent(InitEasyTuneVariablesComponent, false);
        }

        this._myInputManagerComponent = this.object.pp_addComponent(InputManagerComponent, this._getProperties(InputManagerComponent.Properties));
        this._myAudioManagerComponent = this.object.pp_addComponent(AudioManagerComponent, false);
        this._myVisualManagerComponent = this.object.pp_addComponent(VisualManagerComponent, false);
        this._myDebugManagerComponent = this.object.pp_addComponent(DebugManagerComponent, false);
    }

    start() {
        this._myGetDefaultResourcesComponent.active = true;
        this._myGetSceneObjectsComponent.active = true;

        if (this._myEnableDebugsComponent != null) {
            this._myEnableDebugsComponent.active = true;
        }

        if (this._myEnableToolsComponent != null) {
            this._myEnableToolsComponent.active = true;
        }

        if (this._myAddPPToWindowComponent != null) {
            this._myAddPPToWindowComponent.active = true;
        }

        if (this._myAddWLToWindowComponent != null) {
            this._myAddWLToWindowComponent.active = true;
        }

        if (this._myInitEasyTuneVariablesComponent != null) {
            this._myInitEasyTuneVariablesComponent.active = true;
        }

        this._myInputManagerComponent.active = true;
        this._myAudioManagerComponent.active = true;
        this._myVisualManagerComponent.active = true;
        this._myDebugManagerComponent.active = true;
    }

    _getProperties(propertiesToGet, active = false) {
        let properties = {};
        properties["active"] = active;
        let propertyNames = Object.getOwnPropertyNames(propertiesToGet);

        for (let propertyName of propertyNames) {
            if (this[propertyName] != undefined) {
                properties[propertyName] = this[propertyName];
            }
        }

        return properties;
    }
}
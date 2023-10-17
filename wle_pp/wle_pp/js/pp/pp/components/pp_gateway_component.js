import { Component, Property } from "@wonderlandengine/api";
import { AudioManagerComponent } from "../../audio/components/audio_manager_component";
import { ObjectPoolManagerComponent } from "../../cauldron/object_pool/components/object_pool_manager_component";
import { VisualManagerComponent } from "../../cauldron/visual/components/visual_manager_component";
import { AddWLToWindowComponent } from "../../cauldron/wl/components/add_wl_to_window_component";
import { DebugManagerComponent } from "../../debug/components/debug_manager_component";
import { EnableDebugComponent } from "../../debug/components/enable_debug_component";
import { InputManagerComponent } from "../../input/cauldron/components/input_manager_component";
import { EnableToolComponent } from "../../tool/cauldron/components/enable_tool_component";
import { InitConsoleVRComponent } from "../../tool/console_vr/components/init_console_vr_component";
import { InitEasyTuneVariablesComponent } from "../../tool/easy_tune/components/init_easy_tune_variables_component";
import { initPP } from "../init_pp";
import { AddPPToWindowComponent } from "./add_pp_to_window_component";
import { GetDefaultResourcesComponent } from "./get_default_resources_component";
import { GetSceneObjectsComponent } from "./get_scene_objects_component";

let _myRegisteredEngines = new WeakMap();

export class PPGatewayComponent extends Component {
    static TypeName = "pp-gateway";
    static Properties = {
        _myEnableDebug: Property.bool(true),
        _myEnableTool: Property.bool(true),
        _myAddPPToWindow: Property.bool(true),
        _myAddWLToWindow: Property.bool(true),
        ...InputManagerComponent.Properties,
        ...AudioManagerComponent.Properties,
        ...VisualManagerComponent.Properties,
        ...ObjectPoolManagerComponent.Properties,
        ...DebugManagerComponent.Properties,
        ...GetSceneObjectsComponent.Properties,
        ...GetDefaultResourcesComponent.Properties
    };

    static onRegister(engine) {
        if (!_myRegisteredEngines.has(engine)) {
            _myRegisteredEngines.set(engine, null);
            initPP(engine);
        }
    }

    init() {
        this._myGetDefaultResourcesComponent = this.object.pp_addComponent(GetDefaultResourcesComponent, this._getProperties(GetDefaultResourcesComponent.Properties), false);
        this._myGetSceneObjectsComponent = this.object.pp_addComponent(GetSceneObjectsComponent, this._getProperties(GetSceneObjectsComponent.Properties), false);

        this._myEnableDebugComponent = null;
        if (this._myEnableDebug) {
            this._myEnableDebugComponent = this.object.pp_addComponent(EnableDebugComponent, false);
        }

        this._myEnableToolComponent = null;
        if (this._myEnableTool) {
            this._myEnableToolComponent = this.object.pp_addComponent(EnableToolComponent, false);
        }

        this._myAddPPToWindowComponent = null;
        if (this._myAddPPToWindow) {
            this._myAddPPToWindowComponent = this.object.pp_addComponent(AddPPToWindowComponent, false);
        }

        this._myAddWLToWindowComponent = null;
        if (this._myAddWLToWindow) {
            this._myAddWLToWindowComponent = this.object.pp_addComponent(AddWLToWindowComponent, false);
        }

        this._myInitConsoleVRComponent = this.object.pp_addComponent(InitConsoleVRComponent, false);
        this._myInitEasyTuneVariablesComponent = this.object.pp_addComponent(InitEasyTuneVariablesComponent, false);

        this._myObjectPoolManagerComponent = this.object.pp_addComponent(ObjectPoolManagerComponent, this._getProperties(ObjectPoolManagerComponent.Properties), false);
        this._myInputManagerComponent = this.object.pp_addComponent(InputManagerComponent, this._getProperties(InputManagerComponent.Properties), false);
        this._myAudioManagerComponent = this.object.pp_addComponent(AudioManagerComponent, this._getProperties(AudioManagerComponent.Properties), false);
        this._myVisualManagerComponent = this.object.pp_addComponent(VisualManagerComponent, this._getProperties(VisualManagerComponent.Properties), false);
        this._myDebugManagerComponent = this.object.pp_addComponent(DebugManagerComponent, this._getProperties(DebugManagerComponent.Properties), false);
    }

    start() {
        this._myGetDefaultResourcesComponent.active = true;
        this._myGetSceneObjectsComponent.active = true;

        if (this._myEnableDebugComponent != null) {
            this._myEnableDebugComponent.active = true;
        }

        if (this._myEnableToolComponent != null) {
            this._myEnableToolComponent.active = true;
        }

        if (this._myAddPPToWindowComponent != null) {
            this._myAddPPToWindowComponent.active = true;
        }

        if (this._myAddWLToWindowComponent != null) {
            this._myAddWLToWindowComponent.active = true;
        }

        this._myInitConsoleVRComponent.active = true;
        this._myInitEasyTuneVariablesComponent.active = true;

        this._myObjectPoolManagerComponent.active = true;
        this._myInputManagerComponent.active = true;
        this._myAudioManagerComponent.active = true;
        this._myVisualManagerComponent.active = true;
        this._myDebugManagerComponent.active = true;
    }

    _getProperties(propertiesToGet) {
        let properties = {};
        let propertyNames = Object.getOwnPropertyNames(propertiesToGet);

        for (let propertyName of propertyNames) {
            if (this[propertyName] != undefined) {
                properties[propertyName] = this[propertyName];
            }
        }

        return properties;
    }
}
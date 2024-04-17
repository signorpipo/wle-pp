import { Component, Property, WonderlandEngine, type ComponentProperty } from "@wonderlandengine/api";
import { AudioManagerComponent } from "../../audio/components/audio_manager_component.js";
import { AnalyticsManagerComponent } from "../../cauldron/cauldron/components/analytics_manager_component.js";
import { SaveManagerComponent } from "../../cauldron/cauldron/components/save_manager_component.js";
import { ObjectPoolManagerComponent } from "../../cauldron/object_pool/components/object_pool_manager_component.js";
import { VisualManagerComponent } from "../../cauldron/visual/components/visual_manager_component.js";
import { AddWLToWindowComponent } from "../../cauldron/wl/components/add_wl_to_window_component.js";
import { GetDefaultResourcesComponent } from "../../cauldron/wl/getters/components/get_default_resources_component.js";
import { GetSceneObjectsComponent } from "../../cauldron/wl/getters/components/get_scene_objects_component.js";
import { DebugManagerComponent } from "../../debug/components/debug_manager_component.js";
import { EnableDebugComponent } from "../../debug/components/enable_debug_component.js";
import { CharacterCollisionSystemComponent } from "../../gameplay/experimental/character_controller/collision/components/character_collision_system_component.js";
import { InputManagerComponent } from "../../input/cauldron/components/input_manager_component.js";
import { EnableToolComponent } from "../../tool/cauldron/components/enable_tool_component.js";
import { InitConsoleVRComponent } from "../../tool/console_vr/components/init_console_vr_component.js";
import { InitEasyTuneVariablesComponent } from "../../tool/easy_tune/components/init_easy_tune_variables_component.js";
import { initPP } from "../init_pp.js";
import { AddPPToWindowComponent } from "./add_pp_to_window_component.js";

// #TODO enable this again as soon as it is possible for the wonderland engine to find components not specified in the index.js,
//since that would make the extension be included just by using the library, and not only when this component is used
//import "../../plugin/add_type_extensions_to_typescript.js";

const _myRegisteredEngines: WeakMap<Readonly<WonderlandEngine>, null> = new WeakMap();

export class PPGatewayComponent extends Component {
    public static override TypeName = "pp-gateway";
    public static override Properties = {
        _myEnableDebug: Property.bool(true),
        _myEnableTool: Property.bool(true),
        _myAddPPToWindow: Property.bool(true),
        _myAddWLToWindow: Property.bool(true),
        ...InputManagerComponent.Properties,
        ...AudioManagerComponent.Properties,
        ...VisualManagerComponent.Properties,
        ...CharacterCollisionSystemComponent.Properties,
        ...ObjectPoolManagerComponent.Properties,
        ...SaveManagerComponent.Properties,
        ...AnalyticsManagerComponent.Properties,
        ...DebugManagerComponent.Properties,
        ...GetSceneObjectsComponent.Properties,
        ...GetDefaultResourcesComponent.Properties
    };

    private _myEnableDebug!: boolean;
    private _myEnableTool!: boolean;

    private _myAddPPToWindow!: boolean;
    private _myAddWLToWindow!: boolean;

    private _myGetDefaultResourcesComponent!: GetDefaultResourcesComponent;
    private _myGetSceneObjectsComponent!: GetSceneObjectsComponent;
    private _myEnableDebugComponent!: EnableDebugComponent;
    private _myEnableToolComponent!: EnableToolComponent;
    private _myAddPPToWindowComponent!: AddPPToWindowComponent;
    private _myAddWLToWindowComponent!: AddWLToWindowComponent;
    private _myInitConsoleVRComponent!: InitConsoleVRComponent;
    private _myInitEasyTuneVariablesComponent!: InitEasyTuneVariablesComponent;
    private _myObjectPoolManagerComponent!: ObjectPoolManagerComponent;
    private _myInputManagerComponent!: InputManagerComponent;
    private _myAudioManagerComponent!: AudioManagerComponent;
    private _myVisualManagerComponent!: VisualManagerComponent;
    private _myCharacterCollisionSystemComponent!: CharacterCollisionSystemComponent;
    private _mySaveManagerComponent!: SaveManagerComponent;
    private _myAnalyticsManagerComponent!: AnalyticsManagerComponent;
    private _myDebugManagerComponent!: DebugManagerComponent;

    public static override onRegister(engine: WonderlandEngine): void {
        if (!_myRegisteredEngines.has(engine)) {
            _myRegisteredEngines.set(engine, null);
            initPP(engine);
        }
    }

    public override init(): void {
        this._myGetDefaultResourcesComponent = this.object.pp_addComponent(GetDefaultResourcesComponent, this._getProperties(GetDefaultResourcesComponent.Properties), false)!;
        this._myGetSceneObjectsComponent = this.object.pp_addComponent(GetSceneObjectsComponent, this._getProperties(GetSceneObjectsComponent.Properties), false)!;

        if (this._myEnableDebug) {
            this._myEnableDebugComponent = this.object.pp_addComponent(EnableDebugComponent, false)!;
        }

        if (this._myEnableTool) {
            this._myEnableToolComponent = this.object.pp_addComponent(EnableToolComponent, false)!;
        }

        if (this._myAddPPToWindow) {
            this._myAddPPToWindowComponent = this.object.pp_addComponent(AddPPToWindowComponent, false)!;
        }

        if (this._myAddWLToWindow) {
            this._myAddWLToWindowComponent = this.object.pp_addComponent(AddWLToWindowComponent, false)!;
        }

        this._myInitConsoleVRComponent = this.object.pp_addComponent(InitConsoleVRComponent, false)!;
        this._myInitEasyTuneVariablesComponent = this.object.pp_addComponent(InitEasyTuneVariablesComponent, false)!;

        this._myObjectPoolManagerComponent = this.object.pp_addComponent(ObjectPoolManagerComponent, this._getProperties(ObjectPoolManagerComponent.Properties), false)!;
        this._myInputManagerComponent = this.object.pp_addComponent(InputManagerComponent, this._getProperties(InputManagerComponent.Properties), false)!;
        this._myAudioManagerComponent = this.object.pp_addComponent(AudioManagerComponent, this._getProperties(AudioManagerComponent.Properties), false)!;
        this._myVisualManagerComponent = this.object.pp_addComponent(VisualManagerComponent, this._getProperties(VisualManagerComponent.Properties), false)!;
        this._myCharacterCollisionSystemComponent = this.object.pp_addComponent(CharacterCollisionSystemComponent, this._getProperties(CharacterCollisionSystemComponent.Properties), false)!;
        this._mySaveManagerComponent = this.object.pp_addComponent(SaveManagerComponent, this._getProperties(SaveManagerComponent.Properties), false)!;
        this._myAnalyticsManagerComponent = this.object.pp_addComponent(AnalyticsManagerComponent, this._getProperties(AnalyticsManagerComponent.Properties), false)!;

        this._myDebugManagerComponent = this.object.pp_addComponent(DebugManagerComponent, this._getProperties(DebugManagerComponent.Properties), false)!;
    }

    public override start(): void {
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
        this._myCharacterCollisionSystemComponent.active = true;
        this._mySaveManagerComponent.active = true;
        this._myAnalyticsManagerComponent.active = true;

        this._myDebugManagerComponent.active = true;
    }

    private _getProperties(propertiesToGet: Record<string, ComponentProperty>): Record<string, any> {
        const properties: Record<string, any> = {};

        if (propertiesToGet != null) {
            const propertyNames = Object.getOwnPropertyNames(propertiesToGet);

            for (const propertyName of propertyNames) {
                const _this = (this as any);
                if (_this[propertyName] != undefined) {
                    properties[propertyName] = _this[propertyName];
                }
            }
        }

        return properties;
    }
}
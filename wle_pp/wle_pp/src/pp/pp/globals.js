import * as AudioGlobals from "../audio/audio_globals";
import * as WindowGlobals from "../cauldron/cauldron/window_globals";
import * as ObjectPoolManagerGlobals from "../cauldron/object_pool/object_pool_globals";
import * as VisualGlobals from "../cauldron/visual/visual_globals";
import * as EngineGlobals from "../cauldron/wl/engine_globals";
import * as DebugGlobals from "../debug/debug_globals";
import * as CharacterCollisionSystemGlobals from "../gameplay/experimental/character_controller/collision/character_collision_system_globals";
import * as InputGlobals from "../input/cauldron/input_globals";
import * as ToolGlobals from "../tool/cauldron/tool_globals";
import * as ConsoleVRGlobals from "../tool/console_vr/console_vr_globals";
import * as EasyTuneGlobals from "../tool/easy_tune/easy_tune_globals";
import * as DefaultResourcesGlobals from "./default_resources_globals";
import * as SceneObjectsGlobals from "./scene_objects_globals";

export let Globals = {
    ...EngineGlobals,
    ...SceneObjectsGlobals,
    ...DefaultResourcesGlobals,
    ...AudioGlobals,
    ...VisualGlobals,
    ...DebugGlobals,
    ...WindowGlobals,
    ...ObjectPoolManagerGlobals,
    ...CharacterCollisionSystemGlobals,
    ...InputGlobals,
    ...ToolGlobals,
    ...ConsoleVRGlobals,
    ...EasyTuneGlobals
};
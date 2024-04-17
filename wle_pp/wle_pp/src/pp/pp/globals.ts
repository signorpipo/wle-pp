import * as AudioGlobals from "../audio/audio_globals.js";
import * as AnalyticsGlobals from "../cauldron/cauldron/analytics_globals.js";
import * as SaveGlobals from "../cauldron/cauldron/save_globals.js";
import * as ObjectPoolManagerGlobals from "../cauldron/object_pool/object_pool_globals.js";
import * as VisualGlobals from "../cauldron/visual/visual_globals.js";
import * as EngineGlobals from "../cauldron/wl/engine_globals.js";
import * as DefaultResourcesGlobals from "../cauldron/wl/getters/default_resources_globals.js";
import * as SceneObjectsGlobals from "../cauldron/wl/getters/scene_objects_globals.js";
import * as DebugGlobals from "../debug/debug_globals.js";
import * as CharacterCollisionSystemGlobals from "../gameplay/experimental/character_controller/collision/character_collision_system_globals.js";
import * as InputGlobals from "../input/cauldron/input_globals.js";
import * as ToolGlobals from "../tool/cauldron/tool_globals.js";
import * as ConsoleVRGlobals from "../tool/console_vr/console_vr_globals.js";
import * as EasyTuneGlobals from "../tool/easy_tune/easy_tune_globals.js";

export const Globals = {
    ...EngineGlobals,
    ...SceneObjectsGlobals,
    ...DefaultResourcesGlobals,
    ...AudioGlobals,
    ...VisualGlobals,
    ...DebugGlobals,
    ...ObjectPoolManagerGlobals,
    ...CharacterCollisionSystemGlobals,
    ...InputGlobals,
    ...SaveGlobals,
    ...AnalyticsGlobals,
    ...ToolGlobals,
    ...ConsoleVRGlobals,
    ...EasyTuneGlobals
} as const;
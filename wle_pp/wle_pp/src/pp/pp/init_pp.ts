import { WonderlandEngine } from "@wonderlandengine/api";
import { registerWLComponents } from "../cauldron/wl/register_wl_components.js";
import { ComponentUtils } from "../cauldron/wl/utils/component_utils.js";
import { initPlugins } from "../plugin/init_plugins.js";
import { Globals } from "./globals.js";
import { PP_VERSION } from "./pp_version.js";
import { registerPPComponents } from "./register_pp_components.js";

/**
 *  TS import preserver
 * 
 *  This is only needed to make it so the import is not removed, since it makes the type extensions available to the Typescript 
 */
import "../plugin/init_plugins.js";

export function initPP(engine: WonderlandEngine): void {
    console.log("PP version: " + PP_VERSION);

    Globals.setMainEngine(engine);

    ComponentUtils.setDefaultWLComponentCloneCallbacks(engine);

    registerWLComponents(engine);
    registerPPComponents(engine);

    initPlugins();
}
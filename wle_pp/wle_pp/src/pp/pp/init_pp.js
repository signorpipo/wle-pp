import { registerWLComponents } from "../cauldron/wl/register_wl_components.js";
import { ComponentUtils } from "../cauldron/wl/utils/component_utils.js";
import { initPlugins } from "../plugin/init_plugins.js";
import { Globals } from "./globals.js";
import { registerPPComponents } from "./register_pp_components.js";

export function initPP(engine) {
    Globals.initEngine(engine);

    ComponentUtils.setDefaultWLComponentCloneCallbacks(engine);

    registerWLComponents(engine);
    registerPPComponents(engine);

    initPlugins(engine);
}
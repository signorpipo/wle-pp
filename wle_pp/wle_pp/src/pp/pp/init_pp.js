import { registerWLComponents } from "../cauldron/wl/register_wl_components";
import { ComponentUtils } from "../cauldron/wl/utils/component_utils";
import { initPlugins } from "../plugin/init_plugins";
import { Globals } from "./globals";
import { registerPPComponents } from "./register_pp_components";

export function initPP(engine) {
    Globals.initEngine(engine);

    ComponentUtils.setDefaultWLComponentCloneCallbacks(engine);

    registerWLComponents(engine);
    registerPPComponents(engine);

    initPlugins(engine);
}
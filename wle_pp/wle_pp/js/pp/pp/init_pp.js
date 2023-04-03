import { initPlugins } from "../plugin/init_plugins";
import { initEngine } from "../cauldron/wl/engine_globals";
import { registerWLComponents } from "../cauldron/wl/register_wl_components";
import { registerPPComponents } from "./register_pp_components";

export function initPP(engine) {
    registerWLComponents(engine);
    registerPPComponents(engine);

    initEngine(engine);

    initPlugins(engine);
}
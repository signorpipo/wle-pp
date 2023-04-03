import { initWLExtensions } from "./extensions/init_wl_extentions";
import { initWLMods } from "./mods/init_wl_mods";

export function initWLPlugins(engine) {
    initWLExtensions(engine);
    initWLMods();
}
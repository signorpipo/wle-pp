import { initWLExtensions } from "./extensions/init_wl_extentions.js";
import { initWLMods } from "./mods/init_wl_mods.js";

export function initWLPlugins(engine) {
    initWLExtensions(engine);
    initWLMods();
}
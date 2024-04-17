import { initWLExtensions } from "./extensions/init_wl_extentions.js";
import { initWLMods } from "./mods/init_wl_mods.js";

/**
 *  TS import preserver
 * 
 *  This is only needed to make it so the import is not removed, since it makes the type extensions available to the Typescript 
 */
import "./extensions/init_wl_extentions.js";
import "./mods/init_wl_mods.js";

export function initWLPlugins(): void {
    initWLExtensions();
    initWLMods();
}
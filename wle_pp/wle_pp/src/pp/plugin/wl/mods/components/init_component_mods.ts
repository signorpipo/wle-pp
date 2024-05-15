import { initCauldronMods } from "./cauldron_mods.js";
import { initCursorComponentMod } from "./cursor_component_mod.js";
import { initCursorTargetComponentMod } from "./cursor_target_component_mod.js";
import { initMouseLookComponentMod } from "./mouse_look_component_mod.js";

/**
 * TS import preserver
 * 
 * This is only needed to make it so the import is not removed, since it makes the type extensions available to the Typescript 
 */
import "./cauldron_mods.js";
import "./cursor_component_mod.js";
import "./cursor_target_component_mod.js";
import "./mouse_look_component_mod.js";

export function initComponentMods(): void {
    initCursorComponentMod();
    initCursorTargetComponentMod();
    initMouseLookComponentMod();

    initCauldronMods();
}
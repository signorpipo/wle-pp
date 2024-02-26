import { initCauldronMods } from "./cauldron_mods.js";
import { initCursorComponentMod } from "./cursor_component_mod.js";
import { initCursorTargetComponentMod } from "./cursor_target_component_mod.js";
import { initMouseLookComponentMod } from "./mouse_look_component_mod.js";

export function initComponentMods() {
    initCursorComponentMod();
    initCursorTargetComponentMod();
    initMouseLookComponentMod();

    initCauldronMods();
}
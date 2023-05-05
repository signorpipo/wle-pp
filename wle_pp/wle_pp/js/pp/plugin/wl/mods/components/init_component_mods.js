import { initCursorComponentMod } from "./cursor_component_mod";
import { initCursorTargetComponentMod } from "./cursor_target_component_mod";
import { initMouseLookComponentMod } from "./mouse_look_component_mod";

export function initComponentMods() {
    initCursorComponentMod();
    initCursorTargetComponentMod();
    initMouseLookComponentMod();
}
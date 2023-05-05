import { initComponentMods } from "./components/init_component_mods";
import { initEmitterMod } from "./emitter_mod";

export function initWLMods() {
    initComponentMods();
    initEmitterMod();
}
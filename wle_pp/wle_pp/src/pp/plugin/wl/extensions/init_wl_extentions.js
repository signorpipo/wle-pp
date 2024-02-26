import { initGetterExtensions } from "./getter_extensions.js";
import { initObjectExtension } from "./object_extension.js";
import { initSceneExtension } from "./scene_extension.js";

export function initWLExtensions(engine) {
    initObjectExtension();
    initSceneExtension();
    initGetterExtensions();
}
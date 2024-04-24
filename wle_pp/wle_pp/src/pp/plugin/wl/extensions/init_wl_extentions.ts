import { initCauldronExtensions } from "./cauldron_extensions.js";
import { initNumberArrayExtension } from "./number_array_extension.js";
import { initObjectExtension } from "./object_extension.js";

/**
 *  TS import preserver
 * 
 *  This is only needed to make it so the import is not removed, since it makes the type extensions available to the Typescript 
 */
import "./cauldron_extensions.js";
import "./number_array_extension.js";
import "./object_extension.js";

export function initWLExtensions(): void {
    initObjectExtension();
    initNumberArrayExtension();
    initCauldronExtensions();
}
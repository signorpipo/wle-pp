import { initJSPlugins } from "./js/init_js_plugins.js";
import { initWLPlugins } from "./wl/init_wl_plugins.js";

/**
 *  TS import preserver
 * 
 *  This is only needed to make it so the import is not removed, since it makes the type extensions available to the Typescript 
 */
import "./js/init_js_plugins.js";
import "./wl/init_wl_plugins.js";

export function initPlugins(): void {
    initJSPlugins();
    initWLPlugins();
}
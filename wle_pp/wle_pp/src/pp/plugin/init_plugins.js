import { initJSPlugins } from "./js/init_js_plugins.js";
import { initWLPlugins } from "./wl/init_wl_plugins.js";

export function initPlugins(engine) {
    initJSPlugins();
    initWLPlugins(engine);
}
import { initJSPlugins } from "./js/init_js_plugins";
import { initWLPlugins } from "./wl/init_wl_plugins";

export function initPlugins(engine) {
    initJSPlugins();
    initWLPlugins(engine);
}
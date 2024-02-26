import { PluginUtils } from "../../utils/plugin_utils";

export function initNumberExtension(engine) {
    initNumberExtensionPrototype();
}

export function initNumberExtensionPrototype() {

    let numberExtension = {};

    // Mostly added to make it easier to use plain numbers in combo with NumberOverFactor
    numberExtension.get = function get() {
        return this.valueOf();
    };



    PluginUtils.injectProperties(numberExtension, Number.prototype, false, true, true);
}
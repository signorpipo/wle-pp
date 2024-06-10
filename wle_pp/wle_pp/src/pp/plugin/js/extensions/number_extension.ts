import { PluginUtils } from "../../utils/plugin_utils.js";
import { NumberExtension } from "./number_type_extension.js";

import "./number_type_extension.js";

export function initNumberExtension(): void {
    _initNumberExtensionPrototype();
}

function _initNumberExtensionPrototype(): void {

    const numberExtension: NumberExtension = {
        get(this: number, factor?: number): number {
            return this.valueOf();
        }
    };

    PluginUtils.injectOwnProperties(numberExtension, Number.prototype, false, true, true);
}
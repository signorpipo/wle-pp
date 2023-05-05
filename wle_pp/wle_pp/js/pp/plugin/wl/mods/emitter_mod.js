import { Emitter } from "@wonderlandengine/api";
import { PluginUtils } from "../../utils/plugin_utils";

export function initEmitterMod() {
    initEmitterModPrototype();
}

export function initEmitterModPrototype() {
    let emitterMod = {};

    // Modified Functions

    emitterMod._find = function _find(listenerOrID) {
        let listeners = this._listeners;
        let index = null;

        for (let i = 0; i < listeners.length; ++i) {
            if (listeners[i].id === listenerOrID || listeners[i].callback === listenerOrID) {
                index = i;
                break;
            }
        }

        return index;
    };

    // New Functions 

    emitterMod.pp_isEmpty = function pp_isEmpty() {
        return this._listeners.length <= 0;
    };



    PluginUtils.injectProperties(emitterMod, Emitter.prototype, false, true, true);
}
import { Emitter } from "@wonderlandengine/api";
import { PluginUtils } from "../../../utils/plugin_utils.js";

export function initCauldronMods() {
    initEmitterModPrototype();
}

export function initEmitterModPrototype() {
    let mod = {};

    mod._flushTransactions = function _flushTransactions() {
        let listeners = this._listeners;
        for (let i = 0; i < this._transactions.length; i++) {
            let transaction = this._transactions[i];
            if (transaction.type === 1) {
                listeners.push(transaction.data);
            } else {
                this.remove(transaction.data);
            }
        }
        this._transactions.length = 0;
    };

    PluginUtils.injectProperties(mod, Emitter.prototype, false, true, true);
}
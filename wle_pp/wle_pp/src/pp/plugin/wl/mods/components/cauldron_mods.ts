import { Emitter } from "@wonderlandengine/api";
import { PluginUtils } from "../../../utils/plugin_utils.js";

export function initCauldronMods(): void {
    _initEmitterModPrototype();
}

function _initEmitterModPrototype(): void {
    const emitterMod: Record<string, any> = {};

    emitterMod._flushTransactions = function _flushTransactions(this: Emitter): void {
        const listeners = this._listeners;
        const _transactions: any[] = (this as any)._transactions;

        for (let i = 0; i < _transactions.length; i++) {
            const transaction = _transactions[i];
            if (transaction.type == 1) {
                listeners.push(transaction.data);
            } else {
                this.remove(transaction.data);
            }
        }

        _transactions.length = 0;
    };

    PluginUtils.injectProperties(emitterMod, Emitter.prototype, false, true, true);
}